'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStudents } from '@/lib/context/StudentContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  BrainCircuit, 
  ShieldAlert, 
  Target, 
  Wrench,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquareText
} from 'lucide-react'
import { toast } from 'sonner'
import AIChat from '@/components/student/AIChat'

const CAMPOS = [
  { key: 'barreras', label: 'Barreras de Aprendizaje', group: 'perfil', icon: ShieldAlert, ph: 'Ej: Barreras didácticas - Tiempos inflexibles, materiales no accesibles...' },
  { key: 'modos_aprender', label: 'Modos de aprender', group: 'perfil', icon: BrainCircuit, ph: 'Ej: Frente a las propuestas el estudiante se muestra receptivo cuando se presentan de manera clara...' },
  { key: 'acuerdos_lengua', label: 'Lengua', group: 'acuerdos', icon: BookOpen, ph: 'Ej: Fraccionar consignas, apoyos visuales...' },
  { key: 'acuerdos_matematica', label: 'Matemática', group: 'acuerdos', icon: BookOpen, ph: 'Ej: Permitir resolver con apoyo visual (tabla pitagórica)...' },
  { key: 'acuerdos_naturales', label: 'Ciencias Naturales', group: 'acuerdos', icon: BookOpen, ph: 'Ej: Priorización de la participación oral, textos ilustrados...' },
  { key: 'acuerdos_sociales', label: 'Ciencias Sociales', group: 'acuerdos', icon: BookOpen, ph: 'Ej: Organizar y registrar información en diferentes soportes...' },
  { key: 'criterios', label: 'Criterios de evaluación', group: 'evaluacion', icon: Target, ph: 'Ej: La evaluación se realizará teniendo en cuenta la implementación de los acuerdos...' },
  { key: 'herramientas', label: 'Herramientas de evaluación', group: 'evaluacion', icon: Wrench, ph: 'Ej: Observación directa y sistemática, registros anecdóticos...' },
]

export default function NuevaPPIPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const { students } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  const [paso, setPaso] = useState("perfil")
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(CAMPOS.map(c => [c.key, '']))
  )
  const [showChat, setShowChat] = useState(false)

  if (!alumno) return <div className="p-8 text-center text-slate-400">Alumno no encontrado</div>

  function setField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function finalizar() {
    toast.success('PPI finalizada correctamente')
    setTimeout(() => router.push(`/ppi/${slug}`), 1500)
  }

  return (
    <div className="p-4 pb-48 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <Button variant="glass" size="icon" onClick={() => router.back()} className="rounded-2xl shadow-lg">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Proyecto Pedagógico Individual</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-[0.2em] mt-1">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      {/* AI Pro Banner */}
      <Card variant="gradient" className="p-6 border-none ring-1 ring-white/20 shadow-xl shadow-amber-500/10 mb-8 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-600/20 rotate-3">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <div>
              <p className="text-white text-xl font-black">Planificación Asistida</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="indigo" className="bg-amber-400 text-black border-none h-5 px-2 text-[9px]">PRO LEVEL</Badge>
                <p className="text-amber-100/70 text-[10px] font-bold uppercase tracking-widest leading-none">Contexto: {alumno.logs.length} Registros</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setShowChat(!showChat)}
            variant="secondary"
            className="bg-white text-amber-700 hover:bg-white/90 rounded-2xl font-black text-xs px-5 shadow-lg h-12"
          >
            {showChat ? 'CERRAR AI' : 'ABRIR ASISTENTE'}
          </Button>
        </div>
      </Card>

      {showChat && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
          <AIChat alumno={alumno} />
          <div className="mt-4 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex gap-3 items-center">
             <MessageSquareText className="w-5 h-5 text-amber-500" />
             <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed">
               Pedile a la IA que redacte la PPI basándose en el historial. Podrás copiar las sugerencias directamente a los campos.
             </p>
          </div>
        </div>
      )}

      <Tabs value={paso} onValueChange={setPaso} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="perfil">1. Perfil</TabsTrigger>
          <TabsTrigger value="acuerdos">2. Acuerdos</TabsTrigger>
          <TabsTrigger value="evaluacion">3. Evaluación</TabsTrigger>
        </TabsList>

        {CAMPOS.filter(c => c.group === paso).map(campo => (
          <TabsContent key={campo.key} value={paso} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">
                <campo.icon className="w-3.5 h-3.5 text-indigo-500" />
                {campo.label}
              </label>
              <Textarea
                value={form[campo.key]}
                onChange={e => setField(campo.key, e.target.value)}
                placeholder={campo.ph}
                className="min-h-[160px] text-[13px] leading-relaxed p-6 shadow-sm bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5"
              />
            </div>
          </TabsContent>
        ))}

        <TabsContent value="resumen" className="space-y-6">
           {/* Resumen final if needed */}
        </TabsContent>
      </Tabs>

      {/* Footer Nav */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50">
        <div className="max-w-2xl mx-auto flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              if (paso === "acuerdos") setPaso("perfil")
              else if (paso === "evaluacion") setPaso("acuerdos")
              else router.back()
            }}
            className="flex-1 h-14 rounded-2xl shadow-sm border-slate-200"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Anterior
          </Button>
          
          {paso === "evaluacion" ? (
            <Button onClick={finalizar} variant="secondary" className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 mr-2" /> Finalizar PPI
            </Button>
          ) : (
            <Button 
              onClick={() => {
                if (paso === "perfil") setPaso("acuerdos")
                else if (paso === "acuerdos") setPaso("evaluacion")
              }} 
              className="flex-1 h-14 rounded-2xl shadow-xl shadow-indigo-500/20"
            >
              Siguiente <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
