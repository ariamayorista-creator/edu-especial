'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { 
  CalendarDays, 
  BookOpenCheck, 
  FileText, 
  BarChart3, 
  NotebookPen,
  ChevronRight
} from 'lucide-react'

interface QuickActionsProps {
  slug: string
}

const ACTIONS = [
  { 
    id: 'asistencia',
    href: (slug: string) => `/alumnos/${slug}/asistencia`, 
    icon: CalendarDays, 
    label: 'Asistencia', 
    color: 'bg-blue-500/10 text-blue-500 dark:text-blue-400' 
  },
  { 
    id: 'materias',
    href: (slug: string) => `/alumnos/${slug}/materias`, 
    icon: BookOpenCheck, 
    label: 'Materias', 
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
  },
  { 
    id: 'ppi',
    href: (slug: string) => `/ppi/${slug}`, 
    icon: FileText, 
    label: 'PPI', 
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
  },
  { 
    id: 'informes',
    href: (slug: string) => `/informes/${slug}`, 
    icon: BarChart3, 
    label: 'Informes', 
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
  },
]

export default function StudentQuickActions({ slug }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {ACTIONS.map(item => (
        <Link key={item.id} href={item.href(slug)} className="block active-scale group">
          <Card variant="glass" className="p-5 flex items-center gap-4 group-hover:border-indigo-500/30 transition-all border-slate-200/50 dark:border-white/5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest">{item.label}</p>
            </div>
          </Card>
        </Link>
      ))}
      
      {/* Registros Diarios - Full Width */}
      <Link href={`/alumnos/${slug}/registros`} className="col-span-2 block active-scale group">
        <Card className="bg-emerald-500/5 hover:bg-emerald-500/10 rounded-[2rem] p-6 flex items-center justify-between gap-4 transition-all border-emerald-500/20 shadow-xl shadow-emerald-500/5 group-hover:border-emerald-500/40">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-110">
              <NotebookPen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm uppercase tracking-[0.2em] mb-0.5">Bitácora de Clases</p>
              <p className="text-slate-500 text-[11px] font-medium leading-none">Registros Diarios y Logros</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-emerald-500/50 group-hover:translate-x-1 transition-transform" />
        </Card>
      </Link>
    </div>
  )
}
