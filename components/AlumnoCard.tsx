import Link from 'next/link'
import Badge from '@/components/Badge'
import { getColorDiagnostico, getIniciales, type Alumno } from '@/lib/mock'

export default function AlumnoCard({ alumno }: { alumno: Alumno }) {
  const colors = getColorDiagnostico(alumno.diagnostico)
  const logsCount = alumno.logs.length
  
  return (
    <Link href={`/alumnos/${alumno.slug}`} className="block active-scale group">
      <div className="glass rounded-[2rem] p-6 transition-all hover:translate-y-[-2px] hover:shadow-2xl">
        <div className="flex items-center gap-5">
          <div className={`${colors.bg} w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white font-black text-xl shadow-xl transition-all group-hover:scale-110 group-active:scale-95`}>
            {getIniciales(alumno.nombre, alumno.apellido)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-slate-900 dark:text-white font-black text-xl leading-tight truncate">{alumno.nombre} {alumno.apellido}</h3>
              <div className={`w-2 h-2 rounded-full ${colors.bg} animate-pulse shadow-[0_0_12px_rgba(0,0,0,0.1)]`} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold truncate flex items-center gap-1.5">
              <span className="text-base">📍</span> {alumno.colegio.nombre}
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge diagnostico={alumno.diagnostico} />
            {alumno.cud && (
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-500/30 uppercase tracking-widest">CUD</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-full border border-slate-200/50 dark:border-white/5">
             <span className="text-xs">🗒️</span>
             <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
               {logsCount} {logsCount === 1 ? 'Log' : 'Logs'}
             </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
