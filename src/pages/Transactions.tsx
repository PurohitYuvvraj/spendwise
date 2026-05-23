import React, { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [formData, setFormData] = useState({
    type: 'Expense',
    amount: '',
    category: 'Food',
    transaction_date: new Date().toISOString().split('T')[0],
    payment_method: 'Credit Card',
    description: '',
    is_recurring: 'No'
  })

  const categories = ['Food', 'Transport', 'Shopping', 'School', 'Gym', 'Entertainment', 'Subscriptions', 'Income', 'Other']

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const data = await window.electronAPI.query("SELECT * FROM transactions ORDER BY transaction_date DESC, id DESC")
    setTransactions(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount) return

    const recurringBit = formData.is_recurring === 'Yes' ? 1 : 0

    await window.electronAPI.run(
      `INSERT INTO transactions (type, amount, category, transaction_date, payment_method, description, is_recurring) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [formData.type, parseFloat(formData.amount), formData.category, formData.transaction_date, formData.payment_method, formData.description, recurringBit]
    )

    setFormData({ ...formData, amount: '', description: '', is_recurring: 'No' })
    fetchTransactions()
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl w-full mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Transactions Ledger</h2>
        <p className="text-sm text-textMuted">Log or monitor inbound deposits and outbound expense parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Transaction Add Form */}
        <div className="bg-surface p-6 rounded-xl border border-border space-y-4">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">Record Asset Event</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Entry Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent"
              >
                <option value="Expense">Expense Outflow</option>
                <option value="Income">Income Inflow</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Value (USD)</label>
              <input 
                type="number" step="0.01" required placeholder="0.00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Operational Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Effective Date</label>
              <input 
                type="date" required
                value={formData.transaction_date}
                onChange={e => setFormData({...formData, transaction_date: e.target.value})}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Payment Channel</label>
              <input 
                type="text" placeholder="e.g. Chase Visa, Cash"
                value={formData.payment_method}
                onChange={e => setFormData({...formData, payment_method: e.target.value})}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Recurring Event</label>
              <select 
                value={formData.is_recurring}
                onChange={e => setFormData({...formData, is_recurring: e.target.value})}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Contextual Description</label>
              <textarea 
                placeholder="Optional notes..." rows={2}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <PlusCircle className="w-4 h-4" /> Commit Registry
            </button>
          </form>
        </div>

        {/* Historic Log Table List */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-surface/50">
            <h3 className="text-sm font-medium text-white">System Ledger History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs text-textMuted uppercase bg-background/50">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Channel</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium text-right">Magnitude</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-border/20 transition-colors">
                    <td className="p-4 text-textMuted font-mono text-xs">{tx.transaction_date}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-background border border-border rounded text-xs text-white">
                        {tx.category}
                      </span>
                      {tx.is_recurring === 1 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded text-[10px] text-accent tracking-wide uppercase font-mono">
                          Auto
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-textMuted text-xs">{tx.payment_method || '—'}</td>
                    <td className="p-4 text-white max-w-[180px] truncate">{tx.description || <span className="text-textMuted italic text-xs">None</span>}</td>
                    <td className={`p-4 text-right font-semibold font-mono ${tx.type === 'Income' ? 'text-income' : 'text-expense'}`}>
                      {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sm text-textMuted italic">No transaction sequences detected in the local database instance.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}