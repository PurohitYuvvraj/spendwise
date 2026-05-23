import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import sqlite3 from 'sqlite3'

let mainWindow: BrowserWindow | null = null
let db: sqlite3.Database

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const dbPath = path.join(app.getPath('userData'), 'spendwise.db')
  db = new sqlite3.Database(dbPath, (err) => {
    if (!err) {
      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, amount REAL, category TEXT, transaction_date TEXT, payment_method TEXT, description TEXT, is_recurring INTEGER DEFAULT 0
      )`)
      db.run(`CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, monthly_limit REAL, month TEXT
      )`)
      db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, billing_day INTEGER, frequency TEXT, category TEXT, status TEXT DEFAULT 'active'
      )`)
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

ipcMain.handle('db-query', async (_, sql, params = []) => {
  return new Promise((resolve) => {
    db.all(sql, params, (err, rows) => resolve(rows || []))
  })
})

ipcMain.handle('db-run', async (_, sql, params = []) => {
  return new Promise((resolve) => {
    db.run(sql, params, function() { resolve({ lastID: this.lastID, changes: this.changes }) })
  })
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})