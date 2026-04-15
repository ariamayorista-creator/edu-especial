import { ALUMNOS, getColorDiagnostico, getIniciales } from '@/lib/mock'
import Link from 'next/link'

export default function PPIIndexPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-1 pt-6">PPI</h1>
      <p className="text-slate-400 text-sm mb-6">Seleccioná un alumno</p>
      <div className="space-y-2">
        {ALUMNOS.map(alumno => {
          const c = getColorDiagnostico(alumno.diagnostico)
          return (
            <Link key={alumno.slug} href={`/ppi/${alumno.slug}`}
              className="flex items-center gap-3 bg-slate-800 rounded-2xl p-4 active:bg-slate-700 transition-colors">
              <div className={`${c.bg} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {getIniciales(alumno.nombre, alumno.apellido)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{alumno.nombre} {alumno.apellido}</p>
                <p className="text-slate-400 text-xs truncate">{alumno.colegio.nombre}</p>
              </div>
              <span className="text-slate-500 text-xl">›</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
