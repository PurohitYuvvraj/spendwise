import React from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
  activePage: string
  setActivePage: (page: string) => void
}

export default function Layout({ children, activePage, setActivePage }: LayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-[#0B0F19] overflow-hidden text-gray-200 select-none">
      {/* Native Frameless Window Draggable region */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 bg-transparent pointer-events-none z-50" 
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      />
      
      {/* Sidebar navigation mount point with tracking bindings */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Main interactive stage viewport canvas */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto pt-8 bg-[#0D121F]">
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}