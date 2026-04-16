'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', icon: '👥', activeIcon: '👥', label: 'Alumnos' },
  { href: '/perfil', icon: '👤', activeIcon: '👤', label: 'Perfil' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="glass max-w-lg mx-auto rounded-3xl p-2 flex items-center justify-around shadow-2xl border border-white/10">
        {TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all active-scale ${
                active ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`text-xl transition-transform ${active ? 'scale-110' : 'scale-100'}`}>
                {active ? tab.activeIcon : tab.icon}
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
