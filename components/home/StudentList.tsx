'use client'
import Link from 'next/link'
import AlumnoCard from '@/components/AlumnoCard'
import { type Alumno } from '@/lib/mock'

interface StudentListProps {
  students: Alumno[]
  isFiltered: boolean
}

export default function StudentList({ students, isFiltered }: StudentListProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-widest">
          {isFiltered ? 'Resultados de búsqueda' : 'Listado Principal'}
        </h2>
        <Link 
          id="tour-new-student"
          href="/alumnos/nuevo"
          className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors uppercase tracking-widest"
        >
          + Nuevo Alumno
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-4" id="tarjetas-alumnos">
        {students.length > 0 ? (
          students.map(alumno => (
            <AlumnoCard key={alumno.slug} alumno={alumno} />
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 bg-white dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <p className="text-3xl mb-3">🤷‍♂️</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">No se encontraron alumnos</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Intenta con otro nombre o escuela</p>
          </div>
        )}
      </div>
    </section>
  )
}
