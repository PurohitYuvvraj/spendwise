import React, { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, Scale, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ income: 0, expenses: 0, balance: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateFinancials()
  }, [])

  const calculateFinancials = async () => {
    if (!window.electronAPI) {
      setTimeout(calculateFinancials, 50)
      return
    }

    try {
      const txData = await window.electronAPI.query("SELECT type, amount FROM transactions")
      let totalIncome = 0
      let totalExpenses = 0

      if (Array.isArray(txData)) {
        txData.forEach((tx: any) => {
          if (tx.type === 'Income') totalIncome += tx.amount
          else totalExpenses += tx.amount
        })
      }

      setMetrics({
        income: totalIncome,
        expenses: totalExpenses,
        balance: totalIncome - totalExpenses,
      })
    } catch (error) {
      console.error("Database layer parsing crash:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col gap-3 items-center justify-center bg-[#0D121F] text-gray-400 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        Initializing local database context...
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl w-full mx-auto">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2640] pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Financial Matrix</h2>
          <p className="text-xs text-gray-400 mt-1">Real-time localized ledger telemetry and expense tracking.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#131926] border border-[#1E2640] px-3 py-1.5 rounded-lg text-[11px] font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /> SECURE MAC MEMORY ISOLATION
        </div>
      </div>

      {/* Main KPI Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-[#131926] p-6 rounded-2xl border border-[#1E2640] flex items-center justify-between hover:border-[#2C3759] transition-all duration-200">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Inbound Gross Income</p>
            <h3 className="text-3xl font-mono font-bold text-emerald-400 mt-1.5">${metrics.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-[#131926] p-6 rounded-2xl border border-[#1E2640] flex items-center justify-between hover:border-[#2C3759] transition-all duration-200">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Outbound Ledger Expenses</p>
            <h3 className="text-3xl font-mono font-bold text-rose-400 mt-1.5">${metrics.expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/10">
            <ArrowDownRight className="w-5 h-5 text-rose-400" />
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-[#131926] p-6 rounded-2xl border border-[#1E2640] flex items-center justify-between hover:border-[#2C3759] transition-all duration-200">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Net Position Liquid Liquidity</p>
            <h3 className={`text-3xl font-mono font-bold mt-1.5 ${metrics.balance >= 0 ? 'text-blue-400' : 'text-amber-500'}`}>
              ${metrics.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/10">
            <Scale className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Info Status Banner */}
      <div className="bg-[#131926]/40 p-5 rounded-2xl border border-[#1E2640] flex items-start gap-4">
        <div className="p-2 bg-blue-500/10 rounded-xl flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-white tracking-wide uppercase">Local System Sandbox Operational</h4>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-4xl">
            SpendWise is running in local-first secure isolation mode. All transaction logs and database states update instantly to an encrypted localized directory database instance without passing through any remote external server networks.
          </p>
        </div>
      </div>
    </div>
  )
}