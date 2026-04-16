'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const TABS = [
  { href: '/', icon: '👥', label: 'Alumnos' },
  { href: '/bandeja', icon: '📥', label: 'Bandeja' },
  { href: '/perfil', icon: '👤', label: 'Perfil' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    function calcPending() {
      try {
        const jobs = JSON.parse(localStorage.getItem('bandeja_jobs') || '[]')
        const pending = jobs.filter((j: any) => j.status === 'pendiente' || j.status === 'listo').length
        setPendingCount(pending)
      } catch { setPendingCount(0) }
    }
    calcPending()
    window.addEventListener('storage', calcPending)
    const interval = setInterval(calcPending, 3000)
    return () => { window.removeEventListener('storage', calcPending); clearInterval(interval) }
  }, [])

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="glass max-w-lg mx-auto rounded-3xl p-2 flex items-center justify-around shadow-2xl border border-white/10">
        {TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          const hasBadge = tab.href === '/bandeja' && pendingCount > 0
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all active-scale relative ${
                active ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`text-xl transition-transform relative ${active ? 'scale-110' : 'scale-100'}`}>
                {tab.icon}
                {hasBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg">
                    {pendingCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-70'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
