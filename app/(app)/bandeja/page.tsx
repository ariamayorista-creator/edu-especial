'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Inbox,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'

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
    icon: Clock,
    variant: 'warning' as const,
    pulse: true,
  },
  listo: {
    label: 'Listo para descargar',
    icon: CheckCircle2,
    variant: 'success' as const,
    pulse: false,
  },
  error: {
    label: 'Error al generar',
    icon: AlertCircle,
    variant: 'error' as const,
    pulse: false,
  },
}

export default function BandejaPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

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
    if (selectedJobId === id) setSelectedJobId(null)
    toast.success('Informe eliminado de la bandeja')
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
    toast.success('Descarga iniciada')
  }

  return (
    <div className="p-4 pb-36 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-8">
        <Button asChild variant="glass" size="icon" className="w-12 h-12 rounded-2xl shadow-lg">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-indigo-500" />
            Bandeja
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            Tus informes generados con IA aparecerán aquí
          </p>
        </div>
      </div>

      {/* Lista de trabajos */}
      {jobs.length === 0 ? (
        <Card variant="glass" className="p-12 text-center space-y-4">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner">
            🗂️
          </div>
          <div>
            <CardTitle className="text-xl mb-2">Bandeja vacía</CardTitle>
            <CardDescription className="text-sm">
              Cuando generes un informe con IA, aparecerá aquí.
            </CardDescription>
          </div>
          <Button asChild className="mt-4 px-8 rounded-2xl">
            <Link href="/informes">
              Crear informe <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const cfg = STATUS_CONFIG[job.status]
            const StatusIcon = cfg.icon
            const isSelected = selectedJobId === job.id
            
            return (
              <Card 
                key={job.id} 
                className={`transition-all border-l-4 ${
                  job.status === 'generando' ? 'border-l-amber-500 bg-amber-500/5' : 
                  job.status === 'listo' ? 'border-l-emerald-500 bg-emerald-500/5' : 
                  'border-l-rose-500 bg-rose-500/5'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        job.status === 'generando' ? 'bg-amber-500/10 text-amber-500' : 
                        job.status === 'listo' ? 'bg-emerald-500/10 text-emerald-500' : 
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        <StatusIcon className={`w-6 h-6 ${cfg.pulse ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 dark:text-white text-base truncate">{job.alumnoNombre}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{job.trimestre}</p>
                        <div className="mt-2">
                          <Badge variant={cfg.variant}>
                            {cfg.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => borrarJob(job.id)}
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Acciones si está listo */}
                  {job.status === 'listo' && job.contenido && (
                    <div className="mt-5 pt-5 border-t border-slate-200/50 dark:border-white/5 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedJobId(isSelected ? null : job.id)}
                        className="flex-1 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                      >
                        {isSelected ? <EyeOff className="w-3.5 h-3.5 mr-2" /> : <Eye className="w-3.5 h-3.5 mr-2" />}
                        {isSelected ? 'Cerrar' : 'Ver Preview'}
                      </Button>
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => descargarTXT(job)}
                        className="flex-1 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                      >
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Descargar TXT
                      </Button>
                    </div>
                  )}

                  {/* Preview inline */}
                  {isSelected && job.contenido && (
                    <div className="mt-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-white/5 text-sm space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black (thinking) text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-[0.15em]">
                            Prácticas del Lenguaje
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{job.contenido.avancesLengua}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 border-t border-slate-200/50 dark:border-white/5 pt-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-[0.15em]">
                            Matemática
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{job.contenido.avancesMatematica}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 border-t border-slate-200/50 dark:border-white/5 pt-4">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-[0.15em]">
                            Avances Generales
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{job.contenido.avancesGenerales}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
