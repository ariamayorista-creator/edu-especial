'use client'
import { type Horario } from '@/lib/mock'

interface StudentScheduleProps {
  horarios: Horario[]
}

export default function StudentSchedule({ horarios }: StudentScheduleProps) {
  if (horarios.length === 0) return null;

  return (
    <section className="mb-4 mt-6">
      <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 px-1">Horario Semanal</p>
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
        {horarios.map((h, i) => (
          <div key={i} className={`flex items-center px-4 py-3 gap-3 ${i < horarios.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
            <span className="text-slate-500 dark:text-slate-400 text-sm w-20 flex-shrink-0">{h.dia}</span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{h.materia}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{h.hora_inicio}–{h.hora_fin} · {h.docente}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
