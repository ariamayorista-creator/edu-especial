'use client'
import Link from 'next/link'

interface QuickActionsProps {
  slug: string
}

const ACTIONS = [
  { href: '/asistencia', icon: '📅', label: 'Asistencia', color: 'bg-blue-500/10 text-blue-400' },
  { href: '/materias', icon: '📘', label: 'Materias', color: 'bg-amber-500/10 text-amber-400' },
  { href: '/ppi', icon: '📋', label: 'PPI', color: 'bg-indigo-500/10 text-indigo-400' },
  { href: '/informes', icon: '📊', label: 'Informes', color: 'bg-rose-500/10 text-rose-400' },
]

export default function StudentQuickActions({ slug }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {ACTIONS.map(item => (
        <Link key={item.href} href={`${item.href}/${slug}`}
          className="glass rounded-[1.75rem] p-5 flex items-center gap-4 active:scale-95 transition-all hover:translate-y-[-2px] hover:shadow-xl group">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${item.color}`}>
            {item.icon}
          </div>
          <p className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">{item.label}</p>
        </Link>
      ))}
      {/* Botón de ancho completo para Registros Diarios */}
      <Link href={`/alumnos/${slug}/registros`}
        className="col-span-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-[1.75rem] p-5 flex items-center justify-center gap-4 active:scale-95 transition-all border border-emerald-500/30 shadow-[0_8px_24px_rgba(16,185,129,0.15)] group">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
          📓
        </div>
        <p className="text-emerald-500 dark:text-emerald-400 font-black text-sm uppercase tracking-[0.15em]">Registros Diarios</p>
      </Link>
    </div>
  )
}
