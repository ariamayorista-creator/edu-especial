'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStudents } from '@/lib/context/StudentContext'

type Resultado = 'si' | 'no' | 'parcial' | ''

const TRIMESTRES = [
  { num: 1, label: '1° Trimestre', periodo: 'Marzo – Junio' },
  { num: 2, label: '2° Trimestre', periodo: 'Julio – Septiembre' },
  { num: 3, label: '3° Trimestre', periodo: 'Octubre – Diciembre' },
]

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

const RESULTADOS: { value: Resultado; label: string; color: string; active: string }[] = [
  { value: 'si', label: 'Sí', color: 'bg-slate-700 text-slate-300', active: 'bg-emerald-600 text-white' },
  { value: 'parcial', label: 'Parcial', color: 'bg-slate-700 text-slate-300', active: 'bg-yellow-500 text-white' },
  { value: 'no', label: 'No', color: 'bg-slate-700 text-slate-300', active: 'bg-red-600 text-white' },
]

export default function NuevoInformePage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const { students } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  const [paso, setPaso] = useState(1)
  const [trimestre, setTrimestre] = useState<number>(1)
  const [intervenciones, setIntervenciones] = useState<Intervencion[]>(
    INTERVENCIONES_BASE.map(nombre => ({ nombre, resultado: '', comentario: '' }))
  )
  const [avancesLengua, setAvancesLengua] = useState('')
  const [avancesMatematica, setAvancesMatematica] = useState('')
  const [avancesGenerales, setAvancesGenerales] = useState('')
  const [toast, setToast] = useState('')
  const [isCompiling, setIsCompiling] = useState(false)

  if (!alumno) return <div className="p-8 text-center text-slate-400">Alumno no encontrado</div>

  const asistencias = Object.values(alumno.asistencia || {})
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

  async function AI_Generate() {
    if (!alumno) return;
    setIsCompiling(true)
    
    // 1. Crear un Job inmediato en localStorage (modo bandeja)
    const jobId = `job_${Date.now()}`
    const periodo = TRIMESTRES.find(t => t.num === trimestre)?.label || `Trimestre ${trimestre}`
    const newJob = {
      id: jobId,
      alumnoNombre: `${alumno.nombre} ${alumno.apellido}`,
      alumnoSlug: alumno.slug,
      trimestre: `${periodo} ${new Date().getFullYear()}`,
      status: 'generando',
      creadoEn: new Date().toISOString(),
      intervenciones,
    }
    
    try {
      const existing = JSON.parse(localStorage.getItem('bandeja_jobs') || '[]')
      localStorage.setItem('bandeja_jobs', JSON.stringify([newJob, ...existing]))
    } catch(e) { console.error(e) }

    setToast('✦ IA procesando... Revisá tu Bandeja en unos minutos')
    setTimeout(() => setToast(''), 4000)

    // 2. Disparar IA en segundo plano (sin bloquear la UI)
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumno, logs: alumno.logs, tipo: 'informe' })
    }).then(async res => {
      const existing = JSON.parse(localStorage.getItem('bandeja_jobs') || '[]')
      if (res.ok) {
        const data = await res.json()
        const updated = existing.map((j: any) => j.id === jobId 
          ? { ...j, status: 'listo', contenido: { avancesLengua: data.avances_lengua || '', avancesMatematica: data.avances_matematica || '', avancesGenerales: data.avances_generales || '', intervenciones } }
          : j
        )
        localStorage.setItem('bandeja_jobs', JSON.stringify(updated))
      } else {
        const updated = existing.map((j: any) => j.id === jobId ? { ...j, status: 'error' } : j)
        localStorage.setItem('bandeja_jobs', JSON.stringify(updated))
      }
    }).catch(() => {
      const existing = JSON.parse(localStorage.getItem('bandeja_jobs') || '[]')
      const updated = existing.map((j: any) => j.id === jobId ? { ...j, status: 'error' } : j)
      localStorage.setItem('bandeja_jobs', JSON.stringify(updated))
    }).finally(() => {
      setIsCompiling(false)
    })
  }

  function guardar() {
    setToast('Informe guardado ✓')
    setTimeout(() => router.push(`/alumnos/${slug}`), 1800)
  }

  function descargarTXT() {
    if (!alumno) return;
    
    try {
      const periodo = TRIMESTRES.find(t=>t.num===trimestre)?.label || '';
      const texto = `INFORME PEDAGÓGICO INDIVIDUAL
Dirección General de Cultura y Educación (Comunicación 71/22)
--------------------------------------------------
ESTUDIANTE: ${alumno.nombre} ${alumno.apellido}
DIAGNÓSTICO: ${alumno.diagnostico}
PERÍODO: ${periodo} ${new Date().getFullYear()}
--------------------------------------------------

VALORACIÓN DE INTERVENCIONES Y APOYOS
${intervenciones.filter(i => i.resultado !== '').map(item => 
  `- ${item.nombre}: ${item.resultado === 'si' ? 'Efectivo' : item.resultado === 'parcial' ? 'Parcial' : 'No efectivo'}
   ${item.comentario ? `Comentario: ${item.comentario}` : ''}`
).join('\n')}

--------------------------------------------------
AVANCES EN PRÁCTICAS DEL LENGUAJE
${avancesLengua || 'Sin observaciones adicionales.'}

AVANCES EN MATEMÁTICA
${avancesMatematica || 'Sin observaciones adicionales.'}

PROGRESO GENERAL E INTERACCIÓN
${avancesGenerales || 'Sin observaciones adicionales.'}
--------------------------------------------------
Generado automáticamente por Edu-Especial
`;

      const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Informe_${alumno.apellido}_${periodo}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setToast("Archivo TXT descargado correctamente");
    } catch (e) {
      console.error("Error al generar TXT", e);
      setToast("Error al exportar el archivo");
    }
  }


  const intervCompletadas = intervenciones.filter(i => i.resultado !== '').length

  return (
    <div className="p-4 pb-36">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-6">
        <button onClick={volverOSalir} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-4xl leading-none font-light active:scale-90 transition-transform">
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Informe Trimestral</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{alumno.nombre} {alumno.apellido}</p>
        </div>
        <span className="text-slate-500 text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">Paso {paso}/4</span>
      </div>

      {/* Barra de progreso */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= paso ? 'bg-indigo-500' : 'bg-slate-700'}`} />
        ))}
      </div>

      {/* PASO 1 — Trimestre */}
      {paso === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-slate-900 dark:text-white text-xl font-black mb-6">¿Qué trimestre es?</p>
          <div className="space-y-4">
            {TRIMESTRES.map(t => (
              <button key={t.num} onClick={() => setTrimestre(t.num)}
                className={`w-full rounded-[1.75rem] p-6 text-left transition-all backdrop-blur-xl border shadow-xl hover:translate-y-[-2px] ${
                  trimestre === t.num 
                    ? 'bg-indigo-600/90 dark:bg-indigo-600/80 text-white border-indigo-400/50 shadow-[#6366f130]' 
                    : 'glass text-slate-900 dark:text-white border-slate-200/50 dark:border-white/10 hover:border-indigo-300'
                }`}>
                <p className={`font-black text-lg ${trimestre === t.num ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{t.label} {new Date().getFullYear()}</p>
                <p className={`text-sm mt-0.5 ${trimestre === t.num ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>{t.periodo}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PASO 2 — Intervenciones */}
      {paso === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-slate-900 dark:text-white text-xl font-black mb-1">¿Cómo funcionaron las intervenciones?</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Basado en tu uso en el aula, indicalo para exportarlo luego.</p>
          <div className="space-y-4">
            {intervenciones.map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                <p className="text-slate-900 dark:text-white text-base font-bold mb-4">{item.nombre}</p>
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
                    className="w-full bg-slate-100 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow mt-3"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASO 3 — Avances */}
      {paso === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4 bg-amber-500/10 border border-amber-500/20 p-4 rounded-3xl backdrop-blur-md">
             <div>
               <p className="text-amber-700 dark:text-amber-400 text-[11px] font-black uppercase tracking-widest mb-1">Módulo Predictivo de IA</p>
               <p className="text-slate-900 dark:text-white text-lg font-black leading-tight">Autocompletar con Gemini</p>
             </div>
             <button onClick={AI_Generate} disabled={isCompiling} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1 disabled:opacity-50 disabled:grayscale">
                {isCompiling ? '⌛ PROCESANDO...' : '✦ GENERAR ESTUDIO'}
             </button>
          </div>
          <div className="flex items-center justify-between mb-4 mt-8">
             <p className="text-slate-900 dark:text-white text-xl font-black mb-1">Redacción de Avances</p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-2xl px-4 py-3 mb-6 w-fit">
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
                <label className="block text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">{campo.label}</label>
                <textarea value={campo.val} onChange={e => campo.set(e.target.value)}
                  placeholder={campo.ph} rows={4}
                  className="w-full glass text-slate-900 dark:text-white rounded-[1.75rem] p-6 text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASO 4 — Preview */}
      {paso === 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-slate-900 dark:text-white text-xl font-black mb-6">Resumen del informe</p>
          
          <div id="informe-preview" className="bg-white dark:bg-slate-800 rounded-3xl p-8 space-y-6 text-sm border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4">
               <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">Informe Pedagógico Individual</h2>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Dirección General de Cultura y Educación (Comunicación 71/22)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-0.5">Estudiante</p>
                <p className="text-slate-900 dark:text-white font-bold text-base">{alumno.nombre} {alumno.apellido}</p>
              </div>
              <div>
                 <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-0.5">Diagnóstico Técnico</p>
                 <p className="text-slate-900 dark:text-white font-bold">{alumno.diagnostico}</p>
              </div>
              <div>
                 <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-0.5">Período de Evaluación</p>
                 <p className="text-slate-900 dark:text-white font-bold">{TRIMESTRES.find(t => t.num === trimestre)?.label} {new Date().getFullYear()}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest mb-3">Valoración de Intervenciones y Apoyos</p>
              {intervenciones.filter(i => i.resultado !== '').map((item, i) => (
                <div key={i} className="flex items-start gap-3 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl flex-shrink-0 ${
                    item.resultado === 'si' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : item.resultado === 'parcial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                  }`}>
                    {item.resultado === 'si' ? 'Efectivo' : item.resultado === 'parcial' ? 'Parcial' : 'No efectivo'}
                  </span>
                  <div>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{item.nombre}</span>
                    {item.comentario && <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 !leading-snug">{item.comentario}</p>}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              {avancesLengua && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest mb-2">Prácticas del Lenguaje</p>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium text-[13px]">{avancesLengua}</p>
                </div>
              )}
              {avancesMatematica && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest mb-2">Matemática</p>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium text-[13px]">{avancesMatematica}</p>
                </div>
              )}
              {avancesGenerales && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest mb-2">Progreso General e Interacción</p>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium text-[13px]">{avancesGenerales}</p>
                </div>
              )}
            </div>
          </div>
          
          <button onClick={descargarTXT} className="w-full mt-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active-scale shadow-xl">
             Descargar en TXT para entregar ⬇
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Barra fija inferior */}
      <div className="fixed bottom-0 pb-safe left-0 right-0 p-4 pb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-white/5 z-40">
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
