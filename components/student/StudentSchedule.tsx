'use client'

import { type Horario } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock3, UserRound } from 'lucide-react'

interface StudentScheduleProps {
  horarios: Horario[]
}

export default function StudentSchedule({ horarios }: StudentScheduleProps) {
  if (horarios.length === 0) return null;

  return (
    <section className="mb-6 mt-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <CalendarDays className="w-4 h-4 text-slate-500" />
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Horario Semanal</p>
      </div>
      
      <Card variant="glass" className="overflow-hidden border-slate-200/50 dark:border-white/5 shadow-xl shadow-slate-200/10 dark:shadow-none">
        <CardContent className="p-0">
          {horarios.map((h, i) => (
            <div key={i} className={`flex items-center px-5 py-4 gap-4 ${i < horarios.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors`}>
              <div className="w-20 flex-shrink-0">
                <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">{h.dia}</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 dark:text-slate-500">
                  <Clock3 className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{h.hora_inicio}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white text-sm font-black truncate">{h.materia}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <UserRound className="w-3 h-3 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-500 text-[11px] font-medium truncate">{h.docente}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
