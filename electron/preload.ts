import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  query: (sql: string, params: any[] = []) => ipcRenderer.invoke('db-query', sql, params),
  run: (sql: string, params: any[] = []) => ipcRenderer.invoke('db-run', sql, params)
})