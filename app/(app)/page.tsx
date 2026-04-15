import { ALUMNOS } from '@/lib/mock'
import AlumnoCard from '@/components/AlumnoCard'

export default function HomePage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Alumnos</h1>
          <p className="text-slate-400 text-sm">{ALUMNOS.length} alumnos activos</p>
        </div>
        <div className="relative group">
          <button className="bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-semibold opacity-60 cursor-not-allowed">
            + Nuevo
          </button>
          <span className="absolute -top-8 right-0 bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
            Disponible en fase 2
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ALUMNOS.map(alumno => (
          <AlumnoCard key={alumno.slug} alumno={alumno} />
        ))}
      </div>
    </div>
  )
}
