import Link from 'next/link'
import Badge from '@/components/Badge'
import { getColorDiagnostico, getIniciales, type Alumno } from '@/lib/mock'

export default function AlumnoCard({ alumno }: { alumno: Alumno }) {
  const colors = getColorDiagnostico(alumno.diagnostico)
  return (
    <Link href={`/alumnos/${alumno.slug}`}>
      <div className={`bg-slate-800 rounded-2xl p-4 border-l-4 ${colors.border} active:scale-95 transition-transform cursor-pointer`}>
        <div className="flex items-center gap-3 mb-2.5">
          <div className={`${colors.bg} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {getIniciales(alumno.nombre, alumno.apellido)}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{alumno.nombre} {alumno.apellido}</p>
            <p className="text-slate-400 text-xs truncate">{alumno.colegio.nombre}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge diagnostico={alumno.diagnostico} />
          {alumno.cud && (
            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">CUD ✓</span>
          )}
        </div>
      </div>
    </Link>
  )
}
