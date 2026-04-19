'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { type EstadoAsistencia } from '@/lib/mock'
import { useStudents } from '@/lib/context/StudentContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Info
} from 'lucide-react'

const CICLO: (EstadoAsistencia | null)[] = ['presente', 'ausente', 'tardanza', null]

function diasEnMes(año: number, mes: number) { return new Date(año, mes + 1, 0).getDate() }
function primerDiaMes(año: number, mes: number) { return new Date(año, mes, 1).getDay() }
function toKey(año: number, mes: number, dia: number) {
  return `${año}-${String(mes + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function AsistenciaPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const { students, setAsistencia } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [año, setAño] = useState(hoy.getFullYear())

  if (!alumno) return <div className="p-8 text-center text-slate-400">Alumno no encontrado</div>

  const asistencia = alumno.asistencia

  function cambiarMes(delta: number) {
    let nuevoMes = mes + delta
    let nuevoAño = año
    if (nuevoMes < 0) { nuevoMes = 11; nuevoAño = año - 1 }
    else if (nuevoMes > 11) { nuevoMes = 0; nuevoAño = año + 1 }
    setMes(nuevoMes)
    setAño(nuevoAño)
  }

  function marcar(dia: number) {
    const key = toKey(año, mes, dia)
    const actual = asistencia[key] ?? null
    const idx = CICLO.indexOf(actual)
    const siguiente = CICLO[(idx + 1) % CICLO.length]
    setAsistencia(slug, key, siguiente)
  }

  const dias = diasEnMes(año, mes)
  const offset = primerDiaMes(año, mes)
  const asistenciaMes = Object.entries(asistencia).filter(([k]) => k.startsWith(`${año}-${String(mes+1).padStart(2,'0')}`))
  const presentes = asistenciaMes.filter(([,v]) => v === 'presente').length
  const ausentes = asistenciaMes.filter(([,v]) => v === 'ausente').length
  const tardanzas = asistenciaMes.filter(([,v]) => v === 'tardanza').length
  const total = presentes + ausentes + tardanzas
  const pct = total > 0 ? Math.round((presentes / total) * 100) : 0

  function getDiaStyles(dia: number) {
    const key = toKey(año, mes, dia)
    const estado = asistencia[key]
    const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()
    
    let base = "aspect-square rounded-xl text-[13px] font-black flex flex-col items-center justify-center transition-all active:scale-90 border relative overflow-hidden group "
    
    if (estado === 'presente') return base + "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20"
    if (estado === 'ausente') return base + "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20"
    if (estado === 'tardanza') return base + "bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/20"
    
    if (esHoy) return base + "bg-white dark:bg-slate-800 border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-500/10"
    
    return base + "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 hover:border-slate-300"
  }

  return (
    <div className="p-4 pb-32 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <Button variant="glass" size="icon" onClick={() => router.back()} className="rounded-2xl shadow-lg">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Control de Asistencia</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest mt-0.5">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      {/* Selector de Mes */}
      <Card variant="glass" className="mb-6 border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-2">
          <Button variant="ghost" size="icon" onClick={() => cambiarMes(-1)} className="rounded-xl h-12 w-12">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-slate-900 dark:text-white font-black text-lg uppercase tracking-widest">{MESES[mes]}</span>
            <span className="text-indigo-500 text-[10px] font-black tracking-[0.3em]">{año}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => cambiarMes(1)} className="rounded-xl h-12 w-12">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </Card>

      {/* Calendario */}
      <Card className="p-6 mb-8 border-slate-200 dark:border-white/5 shadow-2xl bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem]">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 pb-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: dias }).map((_, i) => {
            const dia = i + 1
            const estado = asistencia[toKey(año, mes, dia)]
            return (
              <button
                key={dia}
                onClick={() => marcar(dia)}
                className={getDiaStyles(dia)}
              >
                {dia}
                {estado === 'presente' && <CheckCircle2 className="w-3 h-3 absolute bottom-1 right-1 opacity-40" />}
                {estado === 'ausente' && <XCircle className="w-3 h-3 absolute bottom-1 right-1 opacity-40" />}
                {estado === 'tardanza' && <Clock className="w-3 h-3 absolute bottom-1 right-1 opacity-40" />}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-5 bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 rounded-3xl text-center space-y-1">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Asistencia Total</p>
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{pct}%</p>
          <Badge variant="indigo" className="h-5 text-[9px]">Métrica del Mes</Badge>
        </Card>
        <Card className="p-5 bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 rounded-3xl flex flex-col justify-center items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
          </div>
          <p className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">Estados</p>
          <p className="text-slate-400 text-[9px] font-bold">Multiciclo habilitado</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-2 px-1">
        {[
          { label: 'Presentes', val: presentes, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Ausentes', val: ausentes, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Tardanzas', val: tardanzas, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map(item => (
          <div key={item.label} className={`p-4 rounded-2xl ${item.bg} border border-white/5 text-center`}>
            <p className={`text-2xl font-black ${item.color}`}>{item.val}</p>
            <p className="text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/5 flex gap-4 items-start">
         <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
           <Info className="w-5 h-5 text-indigo-500" />
         </div>
         <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
           <span className="font-black text-slate-900 dark:text-white uppercase text-[10px] block mb-1">Guía Rápida</span>
           Tocá un día para rotar entre los estados: <strong>Presente</strong> → <strong>Ausente</strong> → <strong>Tardanza</strong> → <strong>Vacío</strong>. Los datos se guardan automáticamente.
         </p>
      </div>
    </div>
  )
}
