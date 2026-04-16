'use client'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'

export default function MateriasAcuerdosPage() {
  const { slug } = useParams() as { slug: string }
  const { students } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  if (!alumno) notFound()

  return (
    <div className="p-4 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-6">
        <Link href={`/alumnos/${alumno.slug}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-4xl leading-none font-light active:scale-90 transition-transform">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white px-1">Materias</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">Diarios de aula y Acuerdos</p>
        </div>
      </div>

      {alumno.horarios.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <p className="text-3xl mb-2">🤷‍♂️</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">No hay materias cargadas</p>
          <Link href="/alumnos/nuevo" className="text-indigo-600 dark:text-indigo-400 text-xs mt-2 inline-block font-bold">Editar Horarios →</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {alumno.horarios.map((h, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-xl">
              <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-start">
                <div>
                  <h2 className="text-slate-900 dark:text-white text-lg font-black">{h.materia}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{h.dia} · {h.hora_inicio}–{h.hora_fin}</p>
                </div>
                <div className="bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-indigo-600 dark:text-indigo-400 text-[9px] uppercase font-bold tracking-widest block">Docente</span>
                  <span className="text-slate-900 dark:text-white text-xs font-medium">{h.docente}</span>
                </div>
              </div>
              
              <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    🎯 Acuerdo Pedagógico Diario
                  </p>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20 font-bold">Prioritario</span>
                </div>
                
                {h.acuerdos_diarios && h.acuerdos_diarios.length > 0 ? (
                  <ul className="space-y-3">
                    {h.acuerdos_diarios.map((acuerdo, idx) => (
                      <li key={idx} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl flex flex-col shadow-sm dark:shadow-none">
                        <span className="text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-1">{acuerdo.fecha}</span>
                        <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{acuerdo.acuerdo}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 bg-white dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-400 dark:text-slate-500 text-xs italic">Aún no hay acuerdos registrados.</p>
                  </div>
                )}
                
                <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20">
                  + Registrar Nuevo Acuerdo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
