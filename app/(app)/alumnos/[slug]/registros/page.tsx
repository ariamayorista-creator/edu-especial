'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAlumno, formatFecha, type LogDiario } from '@/lib/mock'
import { notFound } from 'next/navigation'

const INDICADORES = [
  { key: 'participo' as const, label: 'Participó', emoji: '🙋' },
  { key: 'se_frustro' as const, label: 'Se frustró', emoji: '😤' },
  { key: 'uso_apoyo_visual' as const, label: 'Apoyo visual', emoji: '👁️' },
  { key: 'trabajo_en_grupo' as const, label: 'En grupo', emoji: '👥' },
]

type Indicadores = { participo: boolean; se_frustro: boolean; uso_apoyo_visual: boolean; trabajo_en_grupo: boolean }

export default function RegistrosPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const alumno = getAlumno(slug)
  if (!alumno) notFound()

  const [logs, setLogs] = useState<LogDiario[]>(alumno.logs)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [texto, setTexto] = useState('')
  const [indicadores, setIndicadores] = useState<Indicadores>({
    participo: false, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: false,
  })

  function guardar() {
    if (!texto.trim()) return
    const nuevo: LogDiario = {
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0],
      observacion: texto,
      ...indicadores,
    }
    setLogs([nuevo, ...logs])
    setTexto('')
    setIndicadores({ participo: false, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: false })
    setMostrarForm(false)
  }

  function toggleIndicador(key: keyof Indicadores) {
    setIndicadores(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const hoyStr = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6 pt-6">
        <button onClick={() => router.back()} className="text-slate-400 text-2xl leading-none">‹</button>
        <div>
          <h1 className="text-xl font-bold text-white">Registros diarios</h1>
          <p className="text-slate-400 text-sm">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      {!mostrarForm ? (
        <button
          onClick={() => setMostrarForm(true)}
          className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-semibold text-base mb-6 active:bg-indigo-700 transition-colors"
        >
          + Registro de hoy
        </button>
      ) : (
        <div className="bg-slate-800 rounded-2xl p-4 mb-6 space-y-4">
          <p className="text-slate-400 text-sm capitalize">{hoyStr}</p>
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="¿Cómo fue la jornada? ¿Qué pasó en clase? ¿Hubo algo importante?"
            className="w-full bg-slate-700 text-white rounded-xl p-3 text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[96px] resize-none"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            {INDICADORES.map(ind => (
              <button
                key={ind.key}
                onClick={() => toggleIndicador(ind.key)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  indicadores[ind.key] ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                <span>{ind.emoji}</span>
                <span>{ind.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setMostrarForm(false); setTexto(''); setIndicadores({ participo: false, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: false }) }}
              className="flex-1 bg-slate-700 text-slate-300 rounded-xl py-3 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              disabled={!texto.trim()}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold disabled:opacity-40 transition-opacity"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {logs.length === 0 && (
          <p className="text-slate-500 text-center py-12">Sin registros todavía</p>
        )}
        {logs.map(log => (
          <div key={log.id} className="bg-slate-800 rounded-2xl p-4">
            <p className="text-slate-400 text-xs mb-2">{formatFecha(log.fecha)}</p>
            <p className="text-slate-200 text-sm leading-relaxed">{log.observacion}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {log.participo && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">🙋 Participó</span>}
              {log.se_frustro && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">😤 Se frustró</span>}
              {log.uso_apoyo_visual && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">👁️ Apoyo visual</span>}
              {log.trabajo_en_grupo && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">👥 En grupo</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
