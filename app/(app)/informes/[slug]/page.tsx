'use client'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'

export default function InformesAlumnoPage() {
  const { slug } = useParams() as { slug: string }
  const { students } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  if (!alumno) notFound()

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6 pt-6">
        <Link href={`/alumnos/${alumno.slug}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 text-4xl leading-none font-light active:scale-90 transition-transform">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Informes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      <Link 
        href={`/informes/${alumno.slug}/nuevo`}
        className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl py-5 text-center font-black text-lg shadow-xl shadow-indigo-900/20 transition-all active:scale-95 mb-8"
      >
        + Generar Nuevo Informe
      </Link>

      <section className="space-y-4">
        <h2 className="text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-widest px-1">Historial de Informes</h2>
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-white/5 text-center py-12">
          <p className="text-3xl mb-3">📄</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Aún no se han generado informes</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Usa el botón de arriba para crear el primero.</p>
        </div>
      </section>

      {/* Placeholder para Fase 4: Exportación */}
      <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] text-center">
        <p className="text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest mb-2">Fase 4: Exportación</p>
        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
          En la siguiente etapa implementaremos la descarga directa en <strong className="text-slate-900 dark:text-white">PDF y Excel</strong> de cada informe, tanto individual como el lote completo por escuela.
        </p>
      </div>
    </div>
  )
}
