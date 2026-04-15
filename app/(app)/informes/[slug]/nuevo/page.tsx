'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAlumno } from '@/lib/mock'
import { notFound } from 'next/navigation'

type Resultado = 'si' | 'no' | 'parcial' | ''

interface Intervencion {
  nombre: string
  resultado: Resultado
  comentario: string
}

const INTERVENCIONES_BASE = [
  'Fraccionar consignas',
  'Usar apoyos visuales',
  'Anticipar actividades',
  'Brindar tiempo extra',
  'Reformular consignas',
  'Acompañamiento individual',
]

const TRIMESTRES = [
  { num: 1, label: '1° Trimestre', periodo: 'Marzo – Junio' },
  { num: 2, label: '2° Trimestre', periodo: 'Julio – Septiembre' },
  { num: 3, label: '3° Trimestre', periodo: 'Octubre – Diciembre' },
]

const RESULTADOS: { value: Resultado; label: string; color: string; active: string }[] = [
  { value: 'si', label: 'Sí', color: 'bg-slate-700 text-slate-300', active: 'bg-emerald-600 text-white' },
  { value: 'parcial', label: 'Parcial', color: 'bg-slate-700 text-slate-300', active: 'bg-yellow-500 text-white' },
  { value: 'no', label: 'No', color: 'bg-slate-700 text-slate-300', active: 'bg-red-600 text-white' },
]

export default function NuevoInformePage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const alumno = getAlumno(slug)
  if (!alumno) notFound()

  const [paso, setPaso] = useState(1)
  const [trimestre, setTrimestre] = useState<number>(1)
  const [intervenciones, setIntervenciones] = useState<Intervencion[]>(
    INTERVENCIONES_BASE.map(nombre => ({ nombre, resultado: '', comentario: '' }))
  )
  const [avancesLengua, setAvancesLengua] = useState('')
  const [avancesMatematica, setAvancesMatematica] = useState('')
  const [avancesGenerales, setAvancesGenerales] = useState('')
  const [toast, setToast] = useState('')

  const asistencias = Object.values(alumno.asistencia)
  const presentes = asistencias.filter(e => e === 'presente').length
  const ausentes = asistencias.filter(e => e === 'ausente').length
  const tardanzas = asistencias.filter(e => e === 'tardanza').length
  const totalDias = presentes + ausentes + tardanzas
  const pct = totalDias > 0 ? Math.round((presentes / totalDias) * 100) : 0

  function setResultado(i: number, resultado: Resultado) {
    setIntervenciones(prev => prev.map((item, idx) => idx === i ? { ...item, resultado } : item))
  }

  function setComentario(i: number, comentario: string) {
    setIntervenciones(prev => prev.map((item, idx) => idx === i ? { ...item, comentario } : item))
  }

  function volverOSalir() {
    if (paso > 1) setPaso(p => p - 1)
    else router.push('/informes')
  }

  function guardar() {
    setToast('Informe guardado ✓')
    setTimeout(() => router.push(`/alumnos/${slug}`), 1800)
  }

  const intervCompletadas = intervenciones.filter(i => i.resultado !== '').length

  return (
    <div className="p-4 pb-36">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pt-6">
        <button onClick={volverOSalir} className="text-slate-400 text-2xl leading-none">‹</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Informe Trimestral</h1>
          <p className="text-slate-400 text-sm">{alumno.nombre} {alumno.apellido}</p>
        </div>
        <span className="text-slate-500 text-sm">Paso {paso}/4</span>
      </div>

      {/* Barra de progreso */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= paso ? 'bg-indigo-500' : 'bg-slate-700'}`} />
        ))}
      </div>

      {/* PASO 1 — Trimestre */}
      {paso === 1 && (
        <div>
          <p className="text-white text-lg font-semibold mb-4">¿Qué trimestre es?</p>
          <div className="space-y-3">
            {TRIMESTRES.map(t => (
              <button key={t.num} onClick={() => setTrimestre(t.num)}
                className={`w-full rounded-2xl p-4 text-left transition-colors ${trimestre === t.num ? 'bg-indigo-600' : 'bg-slate-800 active:bg-slate-700'}`}>
                <p className="font-semibold text-white">{t.label} {new Date().getFullYear()}</p>
                <p className={`text-sm mt-0.5 ${trimestre === t.num ? 'text-indigo-200' : 'text-slate-400'}`}>{t.periodo}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PASO 2 — Intervenciones */}
      {paso === 2 && (
        <div>
          <p className="text-white text-lg font-semibold mb-1">¿Cómo funcionaron las intervenciones?</p>
          <p className="text-slate-400 text-sm mb-4">Marcá el resultado de cada estrategia este trimestre</p>
          <div className="space-y-3">
            {intervenciones.map((item, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-4">
                <p className="text-white text-sm font-medium mb-3">{item.nombre}</p>
                <div className="flex gap-2 mb-2">
                  {RESULTADOS.map(opt => (
                    <button key={opt.value} onClick={() => setResultado(i, opt.value)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${item.resultado === opt.value ? opt.active : opt.color}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {item.resultado !== '' && (
                  <input
                    value={item.comentario}
                    onChange={e => setComentario(i, e.target.value)}
                    placeholder="Comentario (opcional)"
                    className="w-full bg-slate-700 text-white rounded-xl px-3 py-2 text-sm placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>
          {intervCompletadas > 0 && (
            <p className="text-slate-500 text-xs text-center mt-3">{intervCompletadas} de {intervenciones.length} intervenciones marcadas</p>
          )}
        </div>
      )}

      {/* PASO 3 — Avances */}
      {paso === 3 && (
        <div>
          <p className="text-white text-lg font-semibold mb-1">¿Qué avances observaste?</p>
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2 mb-4 w-fit">
            <span className="text-slate-400 text-xs">Asistencia:</span>
            <span className="text-emerald-400 text-xs font-medium">✓ {presentes}</span>
            <span className="text-red-400 text-xs font-medium">✗ {ausentes}</span>
            {tardanzas > 0 && <span className="text-yellow-400 text-xs font-medium">~ {tardanzas}</span>}
            <span className="text-indigo-400 text-xs font-medium">{pct}%</span>
          </div>
          <div className="space-y-4">
            {[
              { label: '📖 Prácticas del Lenguaje', val: avancesLengua, set: setAvancesLengua, ph: 'Ej: Mejoró la lectura comprensiva con apoyo visual. Logró producción escrita con consignas fraccionadas...' },
              { label: '🔢 Matemática', val: avancesMatematica, set: setAvancesMatematica, ph: 'Ej: Resuelve situaciones problemáticas sencillas con material concreto. En proceso de operar con apoyo visual...' },
              { label: '📝 Avances generales', val: avancesGenerales, set: setAvancesGenerales, ph: 'Ej: Durante este trimestre se observaron avances en la autonomía y la participación grupal. Los ajustes implementados resultaron adecuados...' },
            ].map(campo => (
              <div key={campo.label}>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">{campo.label}</label>
                <textarea value={campo.val} onChange={e => campo.set(e.target.value)}
                  placeholder={campo.ph} rows={3}
                  className="w-full bg-slate-800 text-white rounded-2xl p-4 text-sm placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASO 4 — Preview */}
      {paso === 4 && (
        <div>
          <p className="text-white text-lg font-semibold mb-4">Resumen del informe</p>
          <div className="bg-slate-800 rounded-2xl p-4 space-y-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Alumno</p>
              <p className="text-white">{alumno.nombre} {alumno.apellido} · {TRIMESTRES.find(t => t.num === trimestre)?.label} {new Date().getFullYear()}</p>
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-400 text-xs uppercase font-semibold mb-2">Intervenciones</p>
              {intervenciones.filter(i => i.resultado !== '').length === 0 && (
                <p className="text-slate-500 text-sm">Sin intervenciones marcadas</p>
              )}
              {intervenciones.filter(i => i.resultado !== '').map((item, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    item.resultado === 'si' ? 'bg-emerald-100 text-emerald-700'
                    : item.resultado === 'parcial' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                    {item.resultado === 'si' ? 'Sí' : item.resultado === 'parcial' ? 'Parcial' : 'No'}
                  </span>
                  <div>
                    <span className="text-slate-200">{item.nombre}</span>
                    {item.comentario && <p className="text-slate-400 text-xs mt-0.5">{item.comentario}</p>}
                  </div>
                </div>
              ))}
            </div>
            {avancesGenerales && (
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Avances generales</p>
                <p className="text-slate-200 leading-relaxed">{avancesGenerales}</p>
              </div>
            )}
            <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-800/50">
              <p className="text-indigo-300 text-xs">✦ En fase 2: la IA generará el texto formal completo y exportará en Word y PDF usando todos tus registros diarios</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Barra fija inferior */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 z-40">
        <div className="max-w-2xl mx-auto">
          {paso < 4 ? (
            <button onClick={() => setPaso(p => p + 1)}
              className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-semibold active:bg-indigo-700 transition-colors">
              Siguiente →
            </button>
          ) : (
            <button onClick={guardar}
              className="w-full bg-emerald-600 text-white rounded-2xl py-4 font-semibold active:bg-emerald-700 transition-colors">
              ✓ Guardar informe
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
