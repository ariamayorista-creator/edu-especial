'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStudents } from '@/lib/context/StudentContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  ClipboardCheck,
  FileEdit,
  BarChart3,
  Calendar,
  MessageSquare,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { toast } from 'sonner'
import AIChat from '@/components/student/AIChat'

type Resultado = 'si' | 'no' | 'parcial' | ''

const TRIMESTRES = [
  { num: "1", label: '1° Trimestre', periodo: 'Marzo – Junio' },
  { num: "2", label: '2° Trimestre', periodo: 'Julio – Septiembre' },
  { num: "3", label: '3° Trimestre', periodo: 'Octubre – Diciembre' },
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
  { value: 'si', label: 'Sí', color: 'bg-slate-100 dark:bg-slate-800 text-slate-500', active: 'bg-emerald-600 text-white' },
  { value: 'parcial', label: 'Parcial', color: 'bg-slate-100 dark:bg-slate-800 text-slate-500', active: 'bg-yellow-500 text-white' },
  { value: 'no', label: 'No', color: 'bg-slate-100 dark:bg-slate-800 text-slate-500', active: 'bg-red-600 text-white' },
]

export default function NuevoInformePage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const { students } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  const [paso, setPaso] = useState("1")
  const [trimestre, setTrimestre] = useState<string>("1")
  const [intervenciones, setIntervenciones] = useState<Intervencion[]>(
    INTERVENCIONES_BASE.map(nombre => ({ nombre, resultado: '', comentario: '' }))
  )
  const [avancesLengua, setAvancesLengua] = useState('')
  const [avancesMatematica, setAvancesMatematica] = useState('')
  const [avancesGenerales, setAvancesGenerales] = useState('')
  const [showChat, setShowChat] = useState(false)

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

  function guardar() {
    toast.success('Informe guardado correctamente')
    setTimeout(() => router.push(`/alumnos/${slug}`), 1800)
  }

  function descargarTXT() {
    try {
      const periodo = TRIMESTRES.find(t=>t.num===trimestre)?.label || '';
      const texto = `INFORME PEDAGÓGICO INDIVIDUAL
Dirección General de Cultura y Educación (Comunicación 71/22)
--------------------------------------------------
ESTUDIANTE: ${alumno?.nombre} ${alumno?.apellido}
DIAGNÓSTICO: ${alumno?.diagnostico}
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
Generado automáticamente por Edu-Especial V4.0
`;

      const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Informe_${alumno?.apellido || 'estudiante'}_${periodo}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Archivo TXT descargado");
    } catch (e) {
      toast.error("Error al exportar el archivo");
    }
  }

  return (
    <div className="p-4 pb-48 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <Button variant="glass" size="icon" onClick={() => router.back()} className="rounded-2xl shadow-lg">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Informe Trimestral</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{alumno.nombre} {alumno.apellido}</p>
        </div>
        <Badge variant="indigo" className="h-8 px-4 rounded-full">Paso {paso}/4</Badge>
      </div>

      <Tabs value={paso} onValueChange={setPaso} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="1">1. Trimestre</TabsTrigger>
          <TabsTrigger value="2">2. Apoyos</TabsTrigger>
          <TabsTrigger value="3">3. Redacción</TabsTrigger>
          <TabsTrigger value="4">4. Final</TabsTrigger>
        </TabsList>

        {/* PASO 1 — Trimestre */}
        <TabsContent value="1" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card variant="glass" className="p-6 border-indigo-500/10 shadow-indigo-500/5">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl">Seleccioná el período</CardTitle>
              <CardDescription>¿A qué trimestre corresponde este informe?</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {TRIMESTRES.map(t => (
                <button 
                  key={t.num} 
                  onClick={() => { setTrimestre(t.num); setPaso("2"); }}
                  className={`w-full rounded-[1.75rem] p-6 text-left transition-all border shadow-lg flex items-center justify-between group ${
                    trimestre === t.num 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-500/20' 
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${
                      trimestre === t.num ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-900'
                    }`}>
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-lg">{t.label} {new Date().getFullYear()}</p>
                      <p className={`text-xs ${trimestre === t.num ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>{t.periodo}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${trimestre === t.num ? 'translate-x-1' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* PASO 2 — Intervenciones */}
        <TabsContent value="2" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-slate-900 dark:text-white text-xl font-black">Intervenciones y Apoyos</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Indicá la efectividad de los ajustes aplicados.</p>
            </div>
            <Badge variant="indigo" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              Normativa 71/22
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {intervenciones.map((item, i) => (
              <Card key={i} className="border-slate-200 dark:border-white/5 shadow-sm bg-white dark:bg-slate-800/40">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <ClipboardCheck className="w-4 h-4 text-indigo-500" />
                    </div>
                    <p className="text-slate-900 dark:text-white text-sm font-black">{item.nombre}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {RESULTADOS.map(opt => (
                      <Button 
                        key={opt.value} 
                        onClick={() => setResultado(i, opt.value)}
                        variant="secondary"
                        size="sm"
                        className={`flex-1 rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 ${
                          item.resultado === opt.value ? opt.active : opt.color
                        }`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                  
                  {item.resultado !== '' && (
                    <Input
                      value={item.comentario}
                      onChange={e => setComentario(i, e.target.value)}
                      placeholder="Agregá una observación específica..."
                      className="bg-slate-50 dark:bg-slate-900/50 border-none h-10 rounded-xl"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PASO 3 — Avances con IA Chat */}
        <TabsContent value="3" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          {/* AI Banner */}
          <Card variant="gradient" className="p-6 border-none ring-1 ring-white/20 shadow-xl shadow-indigo-500/10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-md">
                  <Sparkles className="w-7 h-7 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-white text-xl font-black">Asistente de Redacción</p>
                  <p className="text-indigo-100 text-[10px] font-medium uppercase tracking-widest mt-1">Gemini 2.5 Flash en vivo</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowChat(!showChat)}
                variant="secondary"
                className="bg-white text-indigo-700 hover:bg-white/90 rounded-2xl font-black text-xs px-5 shadow-lg"
              >
                {showChat ? 'OCULTAR CHAT' : 'ABRIR ASISTENTE'}
              </Button>
            </div>
          </Card>

          {/* Stats Bar */}
          <Card className="p-4 bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest text-slate-500">
                <BarChart3 className="w-3.5 h-3.5" /> Estadísticas del Trimestre:
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" className="h-6">✓ {presentes} Presentes</Badge>
                <Badge variant="warning" className="h-6">~ {tardanzas} Tardanzas</Badge>
                <Badge variant="indigo" className="h-6">{pct}% Asistencia</Badge>
              </div>
            </div>
          </Card>

          {showChat && (
            <div className="animate-in slide-in-from-top-4 duration-500">
              <AIChat alumno={alumno} />
              <div className="mt-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                 <p className="text-[11px] text-indigo-400 font-bold uppercase tracking-widest text-center">
                   Tip: Podés copiar fragmentos del chat directamente a los campos de abajo.
                 </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {[
              { id: 'lengua', label: '📖 Prácticas del Lenguaje', val: avancesLengua, set: setAvancesLengua, ph: 'Ej: Mejoró la lectura comprensiva con apoyo visual...' },
              { id: 'matematica', label: '🔢 Matemática', val: avancesMatematica, set: setAvancesMatematica, ph: 'Ej: Resuelve situaciones problemáticas con material concreto...' },
              { id: 'generales', label: '📝 Avances generales', val: avancesGenerales, set: setAvancesGenerales, ph: 'Ej: Se observaron avances en la autonomía y participación...' },
            ].map(campo => (
              <div key={campo.id} className="space-y-2">
                <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">
                  {campo.label}
                </label>
                <Textarea 
                  value={campo.val} 
                  onChange={e => campo.set(e.target.value)}
                  placeholder={campo.ph} 
                  className="min-h-[140px] text-[13px] leading-relaxed p-6 shadow-sm border-slate-200 dark:border-white/5" 
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* PASO 4 — Preview */}
        <TabsContent value="4" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <Card className="overflow-hidden border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-slate-900">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-center py-10">
               <CardTitle className="text-xl uppercase tracking-[0.2em]">Informe Pedagógico Individual</CardTitle>
               <CardDescription className="text-xs uppercase font-bold text-indigo-500 mt-2 tracking-widest">
                 Dirección General de Cultura y Educación
               </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest">Estudiante</p>
                  <p className="text-slate-900 dark:text-white font-bold text-base">{alumno.nombre} {alumno.apellido}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest">Diagnóstico</p>
                   <p className="text-slate-900 dark:text-white font-bold">{alumno.diagnostico}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest">Período</p>
                   <p className="text-slate-900 dark:text-white font-bold">{TRIMESTRES.find(t => t.num === trimestre)?.label} {new Date().getFullYear()}</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                <p className="text-indigo-500 text-[10px] uppercase font-black tracking-widest">Valoración de Intervenciones</p>
                <div className="grid gap-3">
                  {intervenciones.filter(i => i.resultado !== '').map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                      <Badge variant={item.resultado === 'si' ? 'success' : item.resultado === 'parcial' ? 'warning' : 'error'} className="h-6">
                        {item.resultado === 'si' ? 'Efectivo' : item.resultado === 'parcial' ? 'Parcial' : 'No efectivo'}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 dark:text-white font-bold text-xs">{item.nombre}</p>
                        {item.comentario && <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 leading-snug italic">"{item.comentario}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="space-y-2">
                  <p className="text-indigo-500 text-[10px] uppercase font-black tracking-widest">Prácticas del Lenguaje</p>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium text-xs whitespace-pre-wrap">{avancesLengua || 'Sin registros.'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-indigo-500 text-[10px] uppercase font-black tracking-widest">Matemática</p>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium text-xs whitespace-pre-wrap">{avancesMatematica || 'Sin registros.'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-indigo-500 text-[10px] uppercase font-black tracking-widest">Progreso General</p>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium text-xs whitespace-pre-wrap">{avancesGenerales || 'Sin registros.'}</p>
                </div>
              </div>

              <div className="flex justify-center pt-8 opacity-30 grayscale">
                 <div className="text-center font-black text-[10px] uppercase tracking-[0.3em]">Edu-Especial V4.0</div>
              </div>
            </CardContent>
          </Card>
          
          <Button onClick={descargarTXT} variant="gold" className="w-full h-14 rounded-2xl">
             <Download className="w-5 h-5 mr-2" /> Descargar para entregar (TXT)
          </Button>
        </TabsContent>
      </Tabs>

      {/* Footer Nav */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50">
        <div className="max-w-2xl mx-auto flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setPaso(p => (parseInt(p) > 1 ? (parseInt(p) - 1).toString() : "1"))}
            disabled={paso === "1"}
            className="flex-1 h-14 rounded-2xl shadow-sm border-slate-200"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Anterior
          </Button>
          {paso === "4" ? (
            <Button onClick={guardar} variant="secondary" className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 mr-2" /> Guardar Informe
            </Button>
          ) : (
            <Button onClick={() => setPaso(p => (parseInt(p) < 4 ? (parseInt(p) + 1).toString() : "4"))} className="flex-1 h-14 rounded-2xl shadow-xl shadow-indigo-500/20">
              Siguiente <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
