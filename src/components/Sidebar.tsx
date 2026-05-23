import React from 'react'
import { LayoutDashboard, Receipt, Landmark, BellRing, Wallet } from 'lucide-react'

interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Transactions', icon: Receipt },
    { name: 'Budgets', icon: Landmark },
    { name: 'Subscriptions', icon: BellRing },
  ]

  return (
    <div className="w-64 h-full bg-[#0B0F19] border-r border-[#1E2640] flex flex-col justify-between p-4 flex-shrink-0 pt-12 z-40">
      <div className="space-y-6">
        {/* Upper Branding Header badge */}
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">SpendWise</h1>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">v1.0 Local</span>
          </div>
        </div>

        {/* Dynamic Nav link matrix maps */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isCurrent = activePage === item.name

            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/10 font-semibold'
                    : 'text-gray-400 hover:bg-[#131926] hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Database engine confirmation cluster footprint */}
      <div className="bg-[#111625] border border-[#1E2640] rounded-xl p-3 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <div className="min-w-0">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider truncate">SQLite Engine</p>
          <p className="text-[11px] text-gray-200 font-medium truncate">Isolated Instance Active</p>
        </div>
      </div>
    </div>
  )
}