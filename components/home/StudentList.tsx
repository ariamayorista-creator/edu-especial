'use client'

import Link from 'next/link'
import AlumnoCard from '@/components/AlumnoCard'
import { type Alumno } from '@/lib/mock'
import { Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StudentListProps {
  students: Alumno[]
  isFiltered: boolean
}

export default function StudentList({ students, isFiltered }: StudentListProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-slate-500 dark:text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
          <Users className="w-3 h-3" />
          {isFiltered ? 'Resultados de búsqueda' : 'Listado Principal'}
        </h2>
        <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-indigo-600 dark:text-indigo-400 hover:bg-transparent hover:text-indigo-500 font-black text-[10px] uppercase tracking-widest">
          <Link id="tour-new-student" href="/alumnos/nuevo">
            <Plus className="w-3 h-3 mr-1" /> Nuevo Alumno
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4" id="tarjetas-alumnos">
        {students.length > 0 ? (
          students.map(alumno => (
            <AlumnoCard key={alumno.slug} alumno={alumno} />
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800/30 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner">
              🤷‍♂️
            </div>
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">No se encontraron alumnos</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Intenta con otro nombre o escuela</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
