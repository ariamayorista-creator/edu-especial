'use client'

import { supabase } from '@/lib/supabase'

import { useState } from 'react'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  ArrowLeft, 
  User, 
  GraduationCap, 
  Gift, 
  CheckCircle2, 
  Sparkles,
  Rocket,
  Edit2,
  Copy,
  ChevronRight,
  ShieldCheck,
  LogOut
} from 'lucide-react'
import { toast } from 'sonner'

export default function PerfilPage() {
  const { teacherInfo, updateTeacherInfo } = useStudents()
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState(teacherInfo)
  const [referrals, setReferrals] = useState(1)
  const [isProModalOpen, setIsProModalOpen] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateTeacherInfo(form)
    setEditMode(false)
    toast.success('Perfil actualizado correctamente')
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      toast.success('Sesión cerrada correctamente')
      window.location.href = '/login'
    } else {
      toast.error('Error al cerrar sesión')
    }
  }

  function handleCopy() {
    if (referrals < 5) {
      setReferrals(prev => prev + 1)
      toast.success('Link copiado. ¡Progreso aumentado! 🚀')
    } else {
      toast.success('¡Link copiado! Nivel Pro Desbloqueado 🎉')
    }
  }

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <header className="pt-8 flex items-center gap-4">
        <Button asChild variant="glass" size="icon" className="w-12 h-12 rounded-2xl shadow-lg">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Mi Perfil</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-[0.2em] mt-1">Configuración y Membresía</p>
        </div>
      </header>

      {/* TIER STATUS CARD */}
      <Card variant="gradient" className="relative group overflow-hidden p-8 border-none ring-1 ring-white/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em]">Suscripción Actual</p>
              <h2 className="text-white text-3xl font-black">Plan Profesional</h2>
            </div>
            <Badge className="bg-white text-indigo-700 hover:bg-white border-none shadow-xl px-3 h-7">Activo</Badge>
          </div>
          
          <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold text-indigo-100">
               <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Generaciones IA Restantes</span>
               <span>02 / 10</span>
             </div>
             <div className="h-2.5 bg-black/20 rounded-full overflow-hidden border border-white/10">
               <div className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_20px_white]" style={{ width: '20%' }} />
             </div>
          </div>

          <div className="pt-2">
             <Button 
               onClick={() => setIsProModalOpen(true)}
               variant="secondary"
               className="w-full bg-white/10 hover:bg-white/20 border-white/10 text-white justify-between h-14 rounded-2xl group/btn"
             >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <div className="text-left">
                    <p className="text-sm font-black">Prueba Gratis Pro ✨</p>
                    <p className="text-indigo-200 text-[9px] font-medium leading-none">Beneficios exclusivos ilimitados</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/50 group-hover/btn:translate-x-1 transition-transform" />
             </Button>
          </div>
        </div>
      </Card>

      {/* REFERRAL CARD */}
      <Card className="p-6 border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-800/40">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg border border-amber-500/20 animate-bounce">
            <Gift className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-black text-sm">Programa de Referidos</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Recomienda a 5 maestros y obtén **2 usos Pro** gratis.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Maestros Referidos</span>
             <Badge variant={referrals >= 5 ? 'success' : 'warning'} className="h-6">
               {referrals >= 5 ? '¡COMPLETADO! 🎉' : `${referrals} / 5`}
             </Badge>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/5">
             <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                referrals >= 5 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              }`}
              style={{ width: `${(referrals / 5) * 100}%` }} 
             />
          </div>
          <Button 
            onClick={handleCopy}
            variant="secondary"
            className="w-full text-[11px] h-12 rounded-xl"
          >
            {referrals >= 5 ? <Rocket className="w-4 h-4 mr-2 text-indigo-500" /> : <Copy className="w-4 h-4 mr-2" />}
            {referrals >= 5 ? '¡Compartir Logro!' : 'Copiar Link de Invitación'}
          </Button>
        </div>
      </Card>

      {/* DATA FORM */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Datos del Profesional</p>
          {!editMode && (
            <Button 
              onClick={() => setEditMode(true)} 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-indigo-500 font-black uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-indigo-400"
            >
              <Edit2 className="w-3 h-3 mr-1" /> Editar
            </Button>
          )}
        </div>

        {editMode ? (
          <Card className="p-4 border-indigo-500/20 bg-indigo-500/5 animate-in fade-in zoom-in-95 duration-300">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nombre completo</label>
                <Input 
                  value={form.nombre}
                  onChange={e => setForm({...form, nombre: e.target.value})}
                  className="bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Título / Especialidad</label>
                <Input 
                  value={form.titulo}
                  onChange={e => setForm({...form, titulo: e.target.value})}
                  className="bg-white dark:bg-slate-900"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => { setEditMode(false); setForm(teacherInfo); }}
                  className="flex-1 rounded-2xl h-14"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="flex-[2] rounded-2xl h-14"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Guardar Cambios
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Nombre', value: teacherInfo.nombre, icon: User },
              { label: 'Título', value: teacherInfo.titulo, icon: GraduationCap },
            ].map((item, idx) => (
              <Card key={idx} className="flex items-center gap-4 p-4 border-slate-200/50 dark:border-white/5 group hover:bg-slate-100/5 transition-colors group">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <item.icon className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">{item.label}</p>
                  <p className="text-slate-900 dark:text-white text-sm font-bold">{item.value}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* PHASE 3 TEASER */}
      <Card variant="glass" className="p-8 border-indigo-500/20 text-center space-y-4 bg-indigo-500/5">
         <Badge variant="default" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-4 h-6">
           Iniciando Fase 3 🚀
         </Badge>
         <CardTitle className="text-white text-xl">Planificación Autónoma</CardTitle>
         <CardDescription className="max-w-xs mx-auto">
           Estamos conectando tu motor de IA para procesar el diseño curricular y el historial de tus alumnos.
         </CardDescription>
         <div className="flex justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" />
         </div>
      </Card>

      {/* PRO BENEFITS DIALOG */}
      <Dialog open={isProModalOpen} onOpenChange={setIsProModalOpen}>
        <DialogContent className="border-indigo-500/20 bg-gradient-to-br from-slate-900 to-slate-800 ring-1 ring-white/10">
          <DialogHeader className="items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-[1.75rem] flex items-center justify-center text-4xl font-black mb-4 shadow-2xl shadow-indigo-500/30 rotate-6 animate-pulse">
              PRO
            </div>
            <DialogTitle className="text-3xl text-white">Edu-Especial Pro</DialogTitle>
            <DialogDescription className="text-indigo-200/60 font-medium">
              La inteligencia artificial trabajando para ti.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            {[
              {
                title: "Generación Automática de Informes",
                desc: "Crea informes trimestrales y finales en segundos usando el historial de registros.",
                icon: FileText
              },
              {
                title: "Asistente para PPI Completo",
                desc: "La IA redactará los acuerdos y criterios de evaluación por ti automáticamente.",
                icon: ShieldCheck
              },
              {
                title: "Streaming de IA en Tiempo Real",
                desc: "Mira cómo la IA redacta tus documentos en vivo, palabra por palabra.",
                icon: Sparkles
              },
              {
                title: "Sugerencias para Docentes",
                desc: "Recibe consejos precisos sobre andamiajes basados en el perfil cognitivo del alumno.",
                icon: Rocket
              }
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white text-sm font-black">{benefit.title}</p>
                  <p className="text-slate-400 text-[10px] leading-relaxed mt-1">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsProModalOpen(false)}
              className="w-full h-14 rounded-2xl font-black text-sm bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02] active:scale-95 transition-all"
            >
              ¡ENTENDIDO!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LOGOUT BUTTON */}
      <div className="pt-4">
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="w-full h-14 rounded-2xl border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-black"
        >
          <LogOut className="w-5 h-5 mr-2" /> CERRAR SESIÓN
        </Button>
      </div>
    </div>
  )
}

function FileText({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  )
}
