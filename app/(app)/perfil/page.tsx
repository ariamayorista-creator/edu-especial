'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'

export default function PerfilPage() {
  const { teacherInfo, updateTeacherInfo } = useStudents()
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState(teacherInfo)
  const [toast, setToast] = useState('')
  const [referrals, setReferrals] = useState(1) // Empezamos en 1 como ejemplo
  const [isProModalOpen, setIsProModalOpen] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateTeacherInfo(form)
    setEditMode(false)
    setToast('Perfil actualizado ✓')
    setTimeout(() => setToast(''), 2500)
  }

  function handleCopy() {
    if (referrals < 5) {
      setReferrals(prev => prev + 1)
      setToast('Link copiado. ¡Progreso aumentado! 🚀')
    } else {
      setToast('¡Link copiado! Nivel Pro Desbloqueado 🎉')
    }
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-8">
      {/* ... [mismo header] ... */}
      <header className="pt-8 flex items-center gap-4">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-4xl leading-none font-light active:scale-90 transition-transform">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white px-1">Mi Perfil</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium px-1 mt-1 uppercase tracking-widest">Configuración y Membresía</p>
        </div>
      </header>

      {/* TIER STATUS CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em]">Suscripción Actual</p>
              <h2 className="text-white text-3xl font-black">Plan Profesional</h2>
            </div>
            <span className="bg-white text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase shadow-xl">Activo</span>
          </div>
          
          <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold text-indigo-100">
               <span>Generaciones IA Restantes</span>
               <span>02 / 10</span>
             </div>
             <div className="h-2 bg-black/20 rounded-full overflow-hidden border border-white/5">
               <div className="h-full bg-white transition-all duration-700 ease-out shadow-[0_0_15px_white]" style={{ width: '20%' }} />
             </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
             <button 
               onClick={() => setIsProModalOpen(true)}
               className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm hover:bg-white/20 active:scale-95 transition-all text-left"
             >
                <div className="flex items-center justify-between">
                  <p className="text-white font-black text-sm">Prueba Gratis Pro ✨</p>
                  <span className="text-white">→</span>
                </div>
                <p className="text-indigo-200 text-[10px] mt-1">Descubre los beneficios exclusivos</p>
             </button>
          </div>
        </div>
      </div>

      {/* REFERRAL CARD */}
      <div className="bg-white dark:bg-slate-800/40 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 space-y-4 shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-amber-500/20 animate-bounce">🎁</div>
          <div>
            <p className="text-slate-900 dark:text-white font-black text-sm">Programa de Referidos</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Recomienda a 5 maestros y obtén **2 usos Pro** gratis.</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
             <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Maestros Referidos</span>
             <span className={`text-xs font-black transition-colors ${referrals >= 5 ? 'text-emerald-500' : 'text-amber-500'}`}>
               {referrals >= 5 ? '¡COMPLETADO! 🎉' : `${referrals} / 5`}
             </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/5">
             <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${referrals >= 5 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}
              style={{ width: `${(referrals / 5) * 100}%` }} 
             />
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 text-slate-900 dark:text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-transparent"
        >
          {referrals >= 5 ? '¡Compartir Logro!' : 'Copiar Link de Invitación'}
        </button>
      </div>

      {/* DATA FORM */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Datos del Profesional</p>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Editar</button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-3 bg-slate-100 dark:bg-slate-800/10 p-2 rounded-3xl animate-in fade-in zoom-in duration-300">
            <input 
              type="text" placeholder="Nombre completo" value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-inner"
            />
            <input 
              type="text" placeholder="Título / Especialidad" value={form.titulo}
              onChange={e => setForm({...form, titulo: e.target.value})}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-inner"
            />
            <div className="flex gap-3 pt-2">
              <button 
                type="button" onClick={() => { setEditMode(false); setForm(teacherInfo); }}
                className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl py-3.5 font-bold text-sm"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-2 bg-indigo-600 text-white rounded-2xl py-3.5 font-black text-sm shadow-xl"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Nombre', value: teacherInfo.nombre, icon: '👤' },
              { label: 'Título', value: teacherInfo.titulo, icon: '🎓' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-200 dark:border-white/5 flex items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm dark:shadow-none">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-sm shadow-inner group-hover:scale-110 transition-transform">{item.icon}</div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">{item.label}</p>
                  <p className="text-slate-900 dark:text-white text-sm font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PHASE 3 TEASER */}
      <div className="bg-indigo-600/10 rounded-[2rem] p-8 border border-indigo-500/20 text-center space-y-4">
         <div className="inline-block bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-2 border border-indigo-500/30">
           Iniciando Fase 3 🚀
         </div>
         <h3 className="text-white text-xl font-black">Planificación Autónoma</h3>
         <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
           Estamos conectando tu motor de IA para procesar el diseño curricular y el historial de tus alumnos.
         </p>
         <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
         </div>
      </div>

      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 glass text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl z-50 animate-in fade-in zoom-in duration-300">
          {toast}
        </div>
      )}

      {/* PRO BENEFITS MODAL */}
      {isProModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsProModalOpen(false)}></div>
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 max-w-sm w-full border border-indigo-500/30 shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setIsProModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-xl shadow-indigo-500/20 rotate-3">
                PRO
              </div>
              <h3 className="text-2xl font-black text-white">Edu-Especial Pro</h3>
              <p className="text-slate-400 text-xs mt-2">La inteligencia artificial trabajando para ti.</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                 <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                 <div>
                   <p className="text-white text-sm font-bold">Generación Automática de Informes</p>
                   <p className="text-slate-400 text-[10px]">Crea informes trimestrales y finales en segundos usando el historial de registros.</p>
                 </div>
              </li>
              <li className="flex items-start gap-3">
                 <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                 <div>
                   <p className="text-white text-sm font-bold">Asistente para PPI Completo</p>
                   <p className="text-slate-400 text-[10px]">La IA redactará los acuerdos y criterios de evaluación por ti, con un tono profesional.</p>
                 </div>
              </li>
              <li className="flex items-start gap-3">
                 <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                 <div>
                   <p className="text-white text-sm font-bold">Análisis de Documentos Subidos</p>
                   <p className="text-slate-400 text-[10px]">Sube PDFs como informes y la IA extraerá las recomendaciones clave automáticamente.</p>
                 </div>
              </li>
              <li className="flex items-start gap-3">
                 <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                 <div>
                   <p className="text-white text-sm font-bold">Sugerencias para Docentes</p>
                   <p className="text-slate-400 text-[10px]">Recibe consejos precisos sobre cómo debe enseñar cada profesor basado en el perfil de cómo aprende el alumno.</p>
                 </div>
              </li>
            </ul>
            
            <button 
              onClick={() => setIsProModalOpen(false)}
              className="w-full bg-white text-slate-900 font-black rounded-2xl py-4 hover:scale-105 transition-transform"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
