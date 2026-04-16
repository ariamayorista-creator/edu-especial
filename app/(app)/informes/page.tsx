'use client'
import { getColorDiagnostico, getIniciales } from '@/lib/mock'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'

export default function InformesIndexPage() {
  const { students } = useStudents()
  return (
    <div className="p-4 pb-32">
      <div className="flex items-center gap-4 mb-8 pt-8">
        <Link href="/" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:scale-110 active:scale-90 transition-all shadow-lg">
          <span className="text-2xl mt-[-2px]">←</span>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Informes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Seleccioná un alumno para crear un informe</p>
        </div>
      </div>
      <div className="space-y-3">
        {students.map(alumno => {
          const c = getColorDiagnostico(alumno.diagnostico)
          return (
            <Link key={alumno.slug} href={`/informes/${alumno.slug}/nuevo`}
              className="flex items-center gap-4 glass rounded-[1.75rem] p-5 active:scale-[0.98] transition-all border border-slate-200/50 dark:border-white/5 shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/30">
              <div className={`${c.bg} w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
                {getIniciales(alumno.nombre, alumno.apellido)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white font-bold">{alumno.nombre} {alumno.apellido}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{alumno.colegio.nombre}</p>
              </div>
              <span className="text-indigo-500 dark:text-indigo-400 text-sm font-black">+ Nuevo →</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
