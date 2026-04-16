'use client'
import Link from 'next/link'
import Badge from '@/components/Badge'
import { getIniciales, getColorDiagnostico, type Alumno } from '@/lib/mock'

interface StudentHeaderProps {
  alumno: Alumno
}

export default function StudentHeader({ alumno }: StudentHeaderProps) {
  const colors = getColorDiagnostico(alumno.diagnostico)
  
  return (
    <div className="flex items-center gap-4 mb-8 pt-8 px-1">
      <Link href="/" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:scale-110 active:scale-90 transition-all shadow-lg">
        <span className="text-2xl mt-[-2px]">←</span>
      </Link>
      <div className="flex-1 flex justify-between items-center glass p-4 rounded-[1.75rem] shadow-xl">
        <div className="flex items-center gap-4">
          <div className={`${colors.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg`}>
            {getIniciales(alumno.nombre, alumno.apellido)}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{alumno.nombre} {alumno.apellido}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge diagnostico={alumno.diagnostico} />
              {alumno.cud && <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full font-black border border-indigo-200/50 dark:border-indigo-500/30 uppercase tracking-widest">CUD</span>}
            </div>
          </div>
        </div>
        <Link href={`/alumnos/${alumno.slug}/editar`} className="w-11 h-11 bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-500/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl flex items-center justify-center transition-all shadow-inner border border-slate-200 dark:border-white/5 hover:scale-105 active:scale-95">
          <span className="text-xl">✏️</span>
        </Link>
      </div>
    </div>
  )
}
