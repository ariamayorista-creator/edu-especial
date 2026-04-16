'use client'
import { useState, useEffect, useRef } from 'react'

const STEPS = [
  {
    targetId: null,
    title: "¡Bienvenida a Edu-Especial! 👋",
    content: "Hemos preparado este sistema para que organices todo sin volver a escribir la misma información dos veces."
  },
  {
    targetId: 'tour-search',
    title: "Buscador Inteligente 🔍",
    content: "Aquí puedes buscar alumnos por nombre, apellido o colegio. Transparente y rápido."
  },
  {
    targetId: 'tour-new-student',
    title: "Ingresa Nuevos Alumnos ➕",
    content: "Registra a tus alumnos una sola vez en la vida. El sistema recordará todos sus datos."
  },
  {
    targetId: 'tarjetas-alumnos',
    title: "Acceso Inmediato ⚡",
    content: "Toca cualquier alumno para entrar a su perfil, editar sus horarios o añadir registros diarios."
  },
  {
    targetId: 'tour-profile-btn',
    title: "Tu Perfil y Configuración 👤",
    content: "Configura tus datos, activa el Modo Claro/Oscuro y desbloquea el poder de la IA aquí."
  }
]

export default function TutorialOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<{ top: number, left: number, width: number, height: number, bottom: number } | null>(null)
  
  useEffect(() => {
    const hasSeen = localStorage.getItem('edu_tutorial_v2_final')
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    
    // Refresh position for the current step
    const updatePosition = () => {
      const step = STEPS[currentStep]
      if (step.targetId) {
        const el = document.getElementById(step.targetId)
        if (el) {
          const rect = el.getBoundingClientRect()
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom
          })
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          setTargetRect(null)
        }
      } else {
        setTargetRect(null)
      }
    }

    updatePosition()
    // Small timeout to catch up with animations/scrolling
    const timeout = setTimeout(updatePosition, 300)
    
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
      clearTimeout(timeout)
    }
  }, [currentStep, isOpen])

  function closeTutorial() {
    setIsOpen(false)
    localStorage.setItem('edu_tutorial_v2_final', 'true')
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      closeTutorial()
    }
  }

  if (!isOpen) return null

  const step = STEPS[currentStep]
  const overlayOpacity = targetRect ? '0.75' : '0.9'

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden">
      {/* Dimmed Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950 transition-opacity duration-500"
        style={{ opacity: overlayOpacity }}
        onClick={closeTutorial}
      />

      {/* Spotlight Circle/Box */}
      {targetRect && (
        <div 
          className="absolute border-2 border-indigo-400 bg-transparent rounded-2xl shadow-[0_0_0_9999px_rgba(2,6,23,0.75)] transition-all duration-300 pointer-events-none"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      {/* Tooltip */}
      <div 
        className={`absolute w-full max-w-[320px] bg-white dark:bg-slate-900 border border-indigo-500/50 shadow-2xl rounded-3xl p-5 transition-all duration-500 ${targetRect ? '' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}
        style={targetRect ? {
          top: targetRect.bottom + 24 > window.innerHeight - 200 ? targetRect.top - 220 : targetRect.bottom + 16,
          left: Math.max(16, Math.min(window.innerWidth - 336, targetRect.left + (targetRect.width / 2) - 160))
        } : {}}
      >
        <div className="flex gap-1 mb-4">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>

        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{step.content}</p>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button 
              onClick={prevStep}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-2xl py-3 text-xs uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5 shadow-inner"
            >
              ← Atrás
            </button>
          )}
          <button 
            onClick={currentStep < STEPS.length - 1 ? nextStep : closeTutorial}
            className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl py-3 text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 border border-indigo-500 shadow-indigo-500/20"
          >
            {currentStep < STEPS.length - 1 ? 'Siguiente →' : 'Comenzar 🚀'}
          </button>
        </div>
      </div>
    </div>
  )
}
