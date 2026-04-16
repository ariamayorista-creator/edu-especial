'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { type EstadoAsistencia } from '@/lib/mock'
import { useStudents } from '@/lib/context/StudentContext'
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
  
  if (!alumno) return <div className="p-8 text-center text-slate-400">Alumno no encontrado</div>

  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [año, setAño] = useState(hoy.getFullYear())
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

  function colorDia(dia: number) {
    const estado = asistencia[toKey(año, mes, dia)]
    const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()
    if (estado === 'presente') return 'bg-emerald-500 text-white'
    if (estado === 'ausente') return 'bg-red-500 text-white'
    if (estado === 'tardanza') return 'bg-yellow-500 text-white'
    if (esHoy) return 'bg-slate-600 text-white ring-2 ring-indigo-400'
    return 'bg-slate-700 text-slate-300 hover:bg-slate-600'
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6 pt-6">
        <button onClick={() => router.back()} className="text-slate-400 text-2xl leading-none">‹</button>
        <div>
          <h1 className="text-xl font-bold text-white">Asistencia</h1>
          <p className="text-slate-400 text-sm">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      {/* Selector mes */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => cambiarMes(-1)} className="text-slate-400 px-3 py-2 text-xl">‹</button>
        <span className="text-white font-semibold">{MESES[mes]} {año}</span>
        <button onClick={() => cambiarMes(1)} className="text-slate-400 px-3 py-2 text-xl">›</button>
      </div>

      {/* Calendario */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['D','L','M','X','J','V','S'].map(d => (
            <div key={d} className="text-center text-slate-500 text-xs py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: dias }).map((_, i) => {
            const dia = i + 1
            return (
              <button
                key={dia}
                onClick={() => marcar(dia)}
                className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all active:scale-90 ${colorDia(dia)}`}
              >
                {dia}
              </button>
            )
          })}
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-4">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">Resumen del mes</p>
        <div className="grid grid-cols-4 gap-2 text-center mb-3">
          <div><p className="text-2xl font-bold text-emerald-400">{presentes}</p><p className="text-slate-500 text-xs">Presentes</p></div>
          <div><p className="text-2xl font-bold text-red-400">{ausentes}</p><p className="text-slate-500 text-xs">Ausentes</p></div>
          <div><p className="text-2xl font-bold text-yellow-400">{tardanzas}</p><p className="text-slate-500 text-xs">Tardanzas</p></div>
          <div><p className="text-2xl font-bold text-indigo-400">{pct}%</p><p className="text-slate-500 text-xs">Asistencia</p></div>
        </div>
        <p className="text-slate-600 text-xs text-center">Tap en un día: sin marcar → presente → ausente → tardanza</p>
      </div>

      {/* Leyenda */}
      <div className="flex justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" /> Presente</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-sm inline-block" /> Ausente</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-sm inline-block" /> Tardanza</span>
      </div>
    </div>
  )
}
