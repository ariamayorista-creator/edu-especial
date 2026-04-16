'use client'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'

export default function PPIAlumnoPage() {
  const { slug } = useParams() as { slug: string }
  const { students } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  if (!alumno) notFound()

  const añoActual = new Date().getFullYear()
  // PPI de ejemplo hardcodeado (por ahora para mantener la UI)
  const ppis = [{ año: añoActual - 1, estado: 'finalizado' }]

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6 pt-6">
        <Link href={`/alumnos/${alumno.slug}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-4xl leading-none font-light active:scale-90 transition-transform">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">PPI</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      <Link href={`/ppi/${alumno.slug}/nuevo`}
        className="block w-full bg-indigo-600 text-white rounded-2xl py-4 text-center font-semibold mb-6 active:bg-indigo-700 transition-colors">
        + Nueva PPI {añoActual}
      </Link>

      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3 px-1">Anteriores</p>
      <div className="space-y-4">
        {ppis.map(ppi => (
          <div key={ppi.año} className="bg-white dark:bg-slate-800 rounded-3xl p-5 flex items-center justify-between border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
            <div>
              <p className="text-slate-900 dark:text-white font-black text-lg">PPI {ppi.año}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Propuesta Pedagógica Individual</p>
            </div>
            <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
              ✓ Finalizado
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
