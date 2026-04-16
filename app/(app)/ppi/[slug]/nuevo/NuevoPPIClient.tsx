'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'

const CAMPOS = [
  {
    key: 'barreras',
    label: 'Barreras de Aprendizaje',
    emoji: '🚧',
    placeholder: 'Ej: Barreras didácticas - Tiempos inflexibles, materiales no accesibles...',
  },
  {
    key: 'modos_aprender',
    label: 'Modos de aprender',
    emoji: '🧩',
    placeholder: 'Ej: Frente a las propuestas el estudiante se muestra receptivo cuando se presentan de manera clara, accesible y simple. La anticipación de actividades y las rutinas estructuradas favorecen su comprensión y participación...',
  },
  {
    key: 'acuerdos_lengua',
    label: 'Acuerdos — Prácticas del Lenguaje',
    emoji: '📖',
    placeholder: 'Ej:\n- Fraccionar consignas y reducir estímulos\n- Utilizar tipografía clara y ampliada\n- Ofrecer consignas impresas\n- Evitar la copia sin sentido, priorizando el abordaje de las propuestas',
  },
  {
    key: 'acuerdos_matematica',
    label: 'Acuerdos — Matemática',
    emoji: '🔢',
    placeholder: 'Ej:\n- Permitir resolver con apoyo visual (tabla pitagórica)\n- Reformular consignas y brindar tiempo extra\n- Utilizar billetes y monedas para situaciones problemáticas sencillas',
  },
  {
    key: 'acuerdos_naturales',
    label: 'Acuerdos — Ciencias Naturales',
    emoji: '🌿',
    placeholder: 'Ej:\n- Priorización de la participación oral\n- Utilización de imágenes reales, videos, textos ilustrados\n- Habilitar distintas formas de resolución (V o F, unir con flechas)',
  },
  {
    key: 'acuerdos_sociales',
    label: 'Acuerdos — Ciencias Sociales',
    emoji: '🌎',
    placeholder: 'Ej:\n- Priorizar el trabajo grupal\n- Utilización de imágenes y videos\n- Organizar y registrar información en differentes soportes (voz, dibujos)',
  },
  {
    key: 'criterios',
    label: 'Criterios de evaluación',
    emoji: '📊',
    placeholder: 'Ej: La evaluación se realizará teniendo en cuenta la implementación de los acuerdos didácticos y el desempeño en el trabajo áulico...',
  },
  {
    key: 'herramientas',
    label: 'Herramientas de evaluación',
    emoji: '⚒️',
    placeholder: 'Ej: Observación directa y sistemática, registros anecdóticos, análisis de producciones...',
  },
]

export default function NuevaPPIPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const { students } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(CAMPOS.map(c => [c.key, '']))
  )
  const [toast, setToast] = useState('')
  const [userTier] = useState<'free' | 'plus' | 'pro'>('pro')
  const [isInterviewing, setIsInterviewing] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([])
  const [isCompiling, setIsCompiling] = useState(false)

  if (!alumno) return <div className="p-8 text-center text-slate-400">Alumno no encontrado</div>

  function startInterview() {
    if (!alumno) return
    setIsInterviewing(true)
    setChatMessages([
      { role: 'ai', content: `Hola, soy tu asistente pedagógico. Basado en los ${alumno.logs.length} registros que tengo de ${alumno.nombre}, he notado que el uso de apoyos visuales y auriculares canceladores de ruido son clave. ¿Hay alguna otra herramienta o estrategia específica que quieras destacar para este ciclo lectivo?` }
    ])
  }

  async function simulateGeneration() {
    if (!alumno) return
    setIsCompiling(true)
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumno, logs: alumno.logs, tipo: 'ppi' })
      })

      if (!res.ok) throw new Error('Error en IA')
      const data = await res.json()

      setForm(prev => ({
        ...prev,
        ...data
      }))
      
      mostrarToast('¡PPI compilada con éxito usando Gemini! ✦')
    } catch (err) {
      console.error(err)
      mostrarToast('Error al generar la PPI. Verifica tu conexión o GOOGLE_API_KEY.')
    } finally {
      setIsCompiling(false)
      setIsInterviewing(false)
    }
  }

  function setField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function mostrarToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function guardarBorrador() {
    mostrarToast('Borrador guardado ✓')
  }

  function finalizar() {
    mostrarToast('PPI finalizada ✓')
    setTimeout(() => router.push(`/ppi/${slug}`), 1500)
  }

  return (
    <div className="p-4 pb-36 max-w-2xl mx-auto">
      {/* AI INTERVIEW OVERLAY */}
      {isInterviewing && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-500">
           <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
              <header className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">✦</div>
                    <div>
                       <h2 className="text-white font-black">Asistente Pro</h2>
                       <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Modo Entrevista</p>
                    </div>
                 </div>
                 <button onClick={() => setIsInterviewing(false)} className="text-slate-500 hover:text-white transition-colors">Cerrar</button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                 {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                       <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                          m.role === 'ai' 
                            ? 'bg-slate-800 text-white rounded-tl-none border border-white/5' 
                            : 'bg-amber-500 text-black font-bold rounded-tr-none'
                        }`}>
                          {m.content}
                       </div>
                    </div>
                 ))}
                 {isCompiling && (
                   <div className="flex justify-start">
                      <div className="bg-slate-800 p-4 rounded-3xl rounded-tl-none border border-white/5 flex items-center gap-3">
                         <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0s' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                         </div>
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Compilando registros...</span>
                      </div>
                   </div>
                 )}
              </div>

              <footer className="mt-6 space-y-3">
                 <div className="bg-slate-900 rounded-3xl p-1 border border-white/5 flex items-center">
                    <input 
                      disabled={isCompiling}
                      type="text" 
                      placeholder="Escribe tu observación o criterio..."
                      className="flex-1 bg-transparent text-white px-5 py-3 text-sm outline-none placeholder:text-slate-600"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          const val = e.currentTarget.value
                          setChatMessages([...chatMessages, { role: 'user', content: val }])
                          e.currentTarget.value = ''
                          setTimeout(() => {
                            setChatMessages(prev => [...prev, { role: 'ai', content: 'Excelente aporte. Lo incluiré en la sección de Acuerdos Pedagógicos. ¿Deseas generar la PPI ahora o agregar más detalles?' }])
                          }, 1000)
                        }
                      }}
                    />
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={simulateGeneration}
                      disabled={isCompiling}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-2xl py-4 font-black text-xs uppercase tracking-widest shadow-xl transition-all active-scale"
                    >
                      {isCompiling ? 'Generando...' : '✦ Compilar PPI'}
                    </button>
                 </div>
              </footer>
           </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6 pt-6">
        <Link href={`/ppi/${slug}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-4xl leading-none font-light active:scale-90 transition-transform">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-1">Nueva PPI {new Date().getFullYear()}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 mb-10 border transition-all duration-500 shadow-2xl ${
        userTier === 'pro' 
          ? 'bg-gradient-to-br from-amber-500/10 via-slate-900 to-amber-900/20 border-amber-500/30 shadow-amber-500/5' 
          : 'bg-slate-800/50 border-white/5'
      }`}>
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1">
            <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-amber-400">
              Inteligencia Pedagógica
            </h2>
            <p className="text-white text-2xl font-black">Planificación Asistida</p>
          </div>
          <div className="text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-tighter bg-amber-500 text-black shadow-amber-500/20">
            Nivel Pro ✦
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Contexto Analizado:</span>
              <span className="text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {alumno.logs.length} Registros Diarios
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={simulateGeneration}
              disabled={isCompiling}
              className="group flex flex-col items-center justify-center p-5 rounded-3xl border transition-all active-scale text-center gap-2 bg-amber-500 text-black border-amber-400 font-black shadow-xl"
            >
              <span className="text-xl">{isCompiling ? '⌛' : '✦'}</span>
              <div className="leading-tight">
                <p className="text-sm">{isCompiling ? 'Generando...' : 'Generación Pro'}</p>
                <p className="text-[9px] opacity-70 uppercase tracking-widest font-black">Auto-completar Todo</p>
              </div>
            </button>

            <button 
              type="button"
              onClick={startInterview}
              disabled={isCompiling}
              className="flex flex-col items-center justify-center p-5 rounded-3xl border transition-all active-scale text-center gap-2 bg-slate-900 text-amber-400 border-amber-500/30 hover:border-amber-500/60"
            >
              <span className="text-xl">💬</span>
              <div className="leading-tight">
                <p className="text-sm font-bold">Modo Entrevista</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Preguntas Relevantes</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-2 px-1">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Carga Manual</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {CAMPOS.map(campo => (
          <div key={campo.key} className="space-y-3">
            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest px-1 ml-1">
              {campo.emoji} {campo.label}
            </label>
            <textarea
              value={form[campo.key]}
              onChange={e => setField(campo.key, e.target.value)}
              placeholder={campo.placeholder}
              rows={5}
              className="w-full bg-slate-800/50 text-white rounded-3xl p-5 text-sm placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700/30 transition-shadow focus:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
            />
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 glass text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl z-50 border border-indigo-500 animate-in fade-in zoom-in duration-300">
          {toast}
        </div>
      )}

      {/* Barra fija inferior */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/80 backdrop-blur-md border-t border-white/5 z-40">
        <div className="flex gap-4 max-w-2xl mx-auto">
          <button onClick={guardarBorrador}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl py-4 font-bold text-sm transition-all active-scale">
            Borrador
          </button>
          <button onClick={finalizar}
            className="flex-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-4 font-black text-sm transition-all shadow-xl active-scale">
            FINALIZAR PPI
          </button>
        </div>
      </div>
    </div>
  )
}
