import React, { useState, useEffect } from 'react'
import { Calendar, Layers } from 'lucide-react'

export default function Subscriptions() {
  const [subs, setSubs] = useState<any[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [day, setDay] = useState('1')
  const [frequency, setFrequency] = useState('Monthly')
  const [status, setStatus] = useState('active')

  useEffect(() => { loadSubs() }, [])

  const loadSubs = async () => {
    const data = await window.electronAPI.query("SELECT * FROM subscriptions ORDER BY billing_day ASC")
    setSubs(data)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount) return

    await window.electronAPI.run(
      "INSERT INTO subscriptions (name, amount, billing_day, frequency, category, status) VALUES (?, ?, ?, ?, 'Fixed Subscriptions', ?)",
      [name, parseFloat(amount), parseInt(day), frequency, status]
    )

    setName('')
    setAmount('')
    loadSubs()
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'cancelled' : 'active'
    await window.electronAPI.run("UPDATE subscriptions SET status = ? WHERE id = ?", [nextStatus, id])
    loadSubs()
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl w-full mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Fixed Subscription Framework</h2>
        <p className="text-sm text-textMuted">Register fixed operational overhead profiles to verify rolling cycles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="bg-surface p-6 rounded-xl border border-border">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-4">Register Contract</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Contract Name</label>
              <input type="text" required placeholder="e.g. AWS Core, Bloomberg" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Billing Value</label>
              <input type="number" step="0.01" required placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Billing Day</label>
              <input type="number" min="1" max="31" required value={day} onChange={e => setDay(e.target.value)}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Cycle Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent">
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Initial Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2 text-sm focus:border-accent">
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-medium py-2 rounded-lg transition-colors">
              Authorize Monitor
            </button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-3">
          {subs.map(s => (
            <div key={s.id} className={`bg-surface p-4 rounded-xl border transition-all flex items-center justify-between ${s.status === 'active' ? 'border-border hover:border-accent/40' : 'border-border/30 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-textMuted">
                  <Layers className={`w-4 h-4 ${s.status === 'active' ? 'text-accent' : 'text-textMuted'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">{s.name}</h4>
                    <span onClick={() => toggleStatus(s.id, s.status)} className={`cursor-pointer text-[9px] px-1.5 py-0.5 rounded tracking-wide font-mono uppercase ${s.status === 'active' ? 'bg-income/10 text-income border border-income/20' : 'bg-border text-textMuted border border-border/60'}`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-textMuted flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> Recur Cycle: Day {s.billing_day} ({s.frequency})
                  </p>
                </div>
              </div>
              <div className="font-mono font-semibold text-sm text-expense">
                -${s.amount.toFixed(2)}
              </div>
            </div>
          ))}
          {subs.length === 0 && (
            <div className="bg-surface rounded-xl border border-border p-8 text-center text-textMuted text-sm italic">
              No continuous subscription profiles active in this ledger database.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}