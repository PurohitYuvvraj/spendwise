import React, { useState, useEffect } from 'react'

export default function Budgets() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [limit, setLimit] = useState('')
  const [category, setCategory] = useState('Food')
  
  const currentMonth = new Date().toISOString().slice(0, 7)
  const categories = ['Food', 'Transport', 'Shopping', 'School', 'Gym', 'Entertainment', 'Subscriptions', 'Other']

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    const data = await window.electronAPI.query("SELECT * FROM budgets WHERE month = ?", [currentMonth])
    setBudgets(data)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!limit) return

    // Clean out an existing budget for the category if it's being updated
    await window.electronAPI.run("DELETE FROM budgets WHERE category = ? AND month = ?", [category, currentMonth])
    await window.electronAPI.run(
      "INSERT INTO budgets (category, monthly_limit, month) VALUES (?, ?, ?)",
      [category, parseFloat(limit), currentMonth]
    )
    
    setLimit('')
    loadBudgets()
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl w-full mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Asset Cap Matrix</h2>
        <p className="text-sm text-textMuted">Assign fixed monthly liability threshold caps against operational categories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="bg-surface p-6 rounded-xl border border-border">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-4">Establish Cap</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Target Category</label>
              <select 
                value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Monthly Threshold Max</label>
              <input 
                type="number" required placeholder="e.g. 500" value={limit} onChange={e => setLimit(e.target.value)}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent"
              />
            </div>
            <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-medium py-2 rounded-lg transition-colors">
              Apply Allocation
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-surface rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-background/30 text-sm font-medium text-white">
            Active Constraints For Interval ({currentMonth})
          </div>
          <div className="divide-y divide-border">
            {budgets.map(b => (
              <div key={b.id} className="p-4 flex justify-between items-center text-sm hover:bg-border/10 transition-colors">
                <span className="text-white font-medium">{b.category}</span>
                <span className="font-mono text-accent font-semibold">${b.monthly_limit.toFixed(2)} / mo</span>
              </div>
            ))}
            {budgets.length === 0 && (
              <p className="p-6 text-center text-textMuted text-sm italic">No allocation frameworks applied yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}