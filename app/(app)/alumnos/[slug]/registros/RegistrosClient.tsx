'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatFecha, type LogDiario } from '@/lib/mock'
import { useStudents } from '@/lib/context/StudentContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Save, 
  CalendarDays,
  Users2,
  Brain,
  Eye,
  HandHelping,
  ChevronDown,
  ChevronUp,
  FilePenLine,
  Search
} from 'lucide-react'
import { toast } from 'sonner'

const INDICADORES = [
  { key: 'participo' as const, label: 'Participó', icon: HandHelping, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { key: 'se_frustro' as const, label: 'Se frustró', icon: Brain, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { key: 'uso_apoyo_visual' as const, label: 'Apoyo visual', icon: Eye, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { key: 'trabajo_en_grupo' as const, label: 'En grupo', icon: Users2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
]

type Indicadores = { participo: boolean; se_frustro: boolean; uso_apoyo_visual: boolean; trabajo_en_grupo: boolean }

export default function RegistrosPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const { students, addLog } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  const [mostrarForm, setMostrarForm] = useState(false)
  const [texto, setTexto] = useState('')
  const [indicadores, setIndicadores] = useState<Indicadores>({
    participo: false, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: false,
  })

  if (!alumno) return <div className="p-8 text-center text-slate-400">Alumno no encontrado</div>

  const logs = [...alumno.logs].sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  function guardar() {
    if (!texto.trim()) return
    const nuevo: LogDiario = {
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0],
      observacion: texto,
      ...indicadores,
    }
    
    addLog(slug, nuevo)
    toast.success('Bitácora actualizada correctamente')
    
    setTexto('')
    setIndicadores({ participo: false, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: false })
    setMostrarForm(false)
  }

  function toggleIndicador(key: keyof Indicadores) {
    setIndicadores(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const hoyStr = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-4 pb-32 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <Button variant="glass" size="icon" onClick={() => router.back()} className="rounded-2xl shadow-lg">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Bitácora de Aula</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest mt-0.5">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      {!mostrarForm ? (
        <Button 
          onClick={() => setMostrarForm(true)}
          className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg tracking-tight shadow-xl shadow-indigo-500/20 gap-3 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <FilePenLine className="w-6 h-6" /> CREAR REGISTRO DE HOY
        </Button>
      ) : (
        <Card variant="glass" className="mb-10 border-indigo-500/30 shadow-2xl animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
               <div>
                  <CardTitle className="text-xl font-black tracking-tight">{hoyStr}</CardTitle>
                  <CardDescription className="text-indigo-500 font-bold uppercase text-[10px] tracking-widest mt-1">Carga de observación diaria</CardDescription>
               </div>
               <Button variant="ghost" size="icon" onClick={() => setMostrarForm(false)} className="rounded-xl text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
               </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Detalle de la jornada</label>
              <Textarea
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="¿Cómo fue la jornada? ¿Qué intervenciones fueron necesarias?"
                className="min-h-[140px] text-[14px] leading-relaxed p-6 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/5 rounded-2xl"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Indicadores de Desempeño</label>
              <div className="grid grid-cols-2 gap-3">
                {INDICADORES.map(ind => (
                  <button
                    key={ind.key}
                    onClick={() => toggleIndicador(ind.key)}
                    className={`flex items-center gap-3 rounded-[1.25rem] px-4 py-4 text-xs font-black transition-all border ${
                      indicadores[ind.key] 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <ind.icon className={`w-4 h-4 ${indicadores[ind.key] ? 'text-white' : ind.color}`} />
                    <span className="uppercase tracking-widest">{ind.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={guardar}
                disabled={!texto.trim()}
                className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm tracking-widest shadow-xl shadow-indigo-500/20 gap-2"
              >
                <Save className="w-4 h-4" /> GUARDAR REGISTRO
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listado de Logs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1 text-slate-500">
           <CalendarDays className="w-4 h-4" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em]">Historial Reciente</p>
        </div>

        {logs.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border-dashed border-2 border-slate-200 dark:border-white/5">
            <p className="text-slate-400 text-sm italic">Sin registros registrados para este alumno.</p>
          </div>
        ) : (
          logs.map(log => (
            <Card key={log.id} className="overflow-hidden border-slate-200 dark:border-white/5 shadow-xl bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="indigo" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none font-black text-[9px] uppercase tracking-widest h-6">
                    {formatFecha(log.fecha)}
                  </Badge>
                  <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                     {INDICADORES.filter(ind => log[ind.key]).map(ind => (
                       <div key={ind.key} className={`w-6 h-6 rounded-lg ${ind.bg} flex items-center justify-center`}>
                          <ind.icon className={`w-3 h-3 ${ind.color}`} />
                       </div>
                     ))}
                  </div>
                </div>
                
                <p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 font-medium whitespace-pre-wrap">
                  {log.observacion}
                </p>

                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  {log.participo && <Badge variant="success" className="text-[8px] h-6">✓ Participó</Badge>}
                  {log.se_frustro && <Badge variant="error" className="text-[8px] h-6">⚠ Frustración</Badge>}
                  {log.uso_apoyo_visual && <Badge variant="indigo" className="text-[8px] h-6">👁 Apoyo Visual</Badge>}
                  {log.trabajo_en_grupo && <Badge variant="warning" className="text-[8px] h-6">👥 Grupal</Badge>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
