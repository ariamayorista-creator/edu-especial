'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Job {
  id: string
  alumnoNombre: string
  alumnoSlug: string
  trimestre: string
  status: 'generando' | 'listo' | 'error'
  creadoEn: string
  contenido?: {
    avancesLengua: string
    avancesMatematica: string
    avancesGenerales: string
    intervenciones: any[]
  }
}

const STATUS_CONFIG = {
  generando: {
    label: 'Generando con IA...',
    icon: '⌛',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
    pulse: true,
  },
  listo: {
    label: 'Listo para descargar',
    icon: '✦',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    pulse: false,
  },
  error: {
    label: 'Error al generar',
    icon: '✕',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/20',
    pulse: false,
  },
}

export default function BandejaPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    function loadJobs() {
      try {
        const stored = JSON.parse(localStorage.getItem('bandeja_jobs') || '[]') as Job[]
        setJobs(stored.sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()))
      } catch { setJobs([]) }
    }
    loadJobs()
    const interval = setInterval(loadJobs, 3000)
    return () => clearInterval(interval)
  }, [])

  function borrarJob(id: string) {
    const updated = jobs.filter(j => j.id !== id)
    localStorage.setItem('bandeja_jobs', JSON.stringify(updated))
    setJobs(updated)
    if (selectedJob?.id === id) setSelectedJob(null)
  }

  function descargarTXT(job: Job) {
    if (!job.contenido) return
    const texto = `INFORME PEDAGÓGICO INDIVIDUAL
Dirección General de Cultura y Educación (Comunicación 71/22)
--------------------------------------------------
ESTUDIANTE: ${job.alumnoNombre}
PERÍODO: ${job.trimestre}
--------------------------------------------------

VALORACIÓN DE INTERVENCIONES Y APOYOS
${job.contenido.intervenciones?.filter((i: any) => i.resultado !== '').map((item: any) =>
  `- ${item.nombre}: ${item.resultado === 'si' ? 'Efectivo' : item.resultado === 'parcial' ? 'Parcial' : 'No efectivo'}${item.comentario ? `\n   ${item.comentario}` : ''}`
).join('\n') || 'Sin intervenciones registradas.'}

--------------------------------------------------
AVANCES EN PRÁCTICAS DEL LENGUAJE
${job.contenido.avancesLengua || 'Sin observaciones.'}

AVANCES EN MATEMÁTICA
${job.contenido.avancesMatematica || 'Sin observaciones.'}

PROGRESO GENERAL E INTERACCIÓN
${job.contenido.avancesGenerales || 'Sin observaciones.'}
--------------------------------------------------
Generado automáticamente por Edu-Especial ✦
`
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Informe_${job.alumnoNombre.split(' ')[1] || job.alumnoNombre}_${job.trimestre}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 pb-36">
      {/* Header */}
      <div className="pt-10 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">📥</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Bandeja</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium ml-1">
          Tus informes generados con IA aparecerán aquí
        </p>
      </div>

      {/* Lista de trabajos */}
      {jobs.length === 0 ? (
        <div className="glass rounded-[2rem] p-10 text-center">
          <p className="text-5xl mb-4">🗂️</p>
          <p className="text-slate-900 dark:text-white font-black text-xl mb-2">Bandeja vacía</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Cuando generes un informe con IA, aparecerá aquí.</p>
          <Link href="/informes" className="mt-6 inline-block bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl text-sm active:scale-95 transition-all">
            Crear informe →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => {
            const cfg = STATUS_CONFIG[job.status]
            return (
              <div key={job.id} className={`glass rounded-[1.75rem] border ${cfg.bg} p-5 transition-all`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${cfg.bg} border ${cfg.bg}`}>
                      <span className={cfg.pulse ? 'animate-pulse' : ''}>{cfg.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 dark:text-white text-base truncate">{job.alumnoNombre}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{job.trimestre}</p>
                      <p className={`text-[11px] font-black uppercase tracking-widest mt-1 ${cfg.color}`}>{cfg.label}</p>
                    </div>
                  </div>
                  <button onClick={() => borrarJob(job.id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 text-lg">
                    ✕
                  </button>
                </div>

                {/* Acciones si está listo */}
                {job.status === 'listo' && job.contenido && (
                  <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                      className="glass py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
                    >
                      {selectedJob?.id === job.id ? '▲ Cerrar' : '👁 Ver Preview'}
                    </button>
                    <button
                      onClick={() => descargarTXT(job)}
                      className="bg-emerald-600 text-white py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      ⬇ Descargar TXT
                    </button>
                  </div>
                )}

                {/* Preview inline */}
                {selectedJob?.id === job.id && job.contenido && (
                  <div className="mt-4 bg-white dark:bg-slate-900/50 rounded-[1.25rem] p-5 border border-slate-200 dark:border-white/5 text-sm space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">📖 Prácticas del Lenguaje</p>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{job.contenido.avancesLengua}</p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 pt-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">🔢 Matemática</p>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{job.contenido.avancesMatematica}</p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 pt-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">📝 Avances Generales</p>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{job.contenido.avancesGenerales}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
