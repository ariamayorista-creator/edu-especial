'use client'

import { notFound, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  BookOpen, 
  UserCircle2, 
  Clock, 
  Calendar,
  Zap,
  PlusCircle,
  FileText,
  ChevronRight
} from 'lucide-react'

export default function MateriasAcuerdosPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const { students } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  if (!alumno) notFound()

  return (
    <div className="p-4 pb-32 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <Button variant="glass" size="icon" onClick={() => router.back()} className="rounded-2xl shadow-lg">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Materias y Acuerdos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest mt-0.5">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      {alumno.horarios.length === 0 ? (
        <Card className="text-center p-12 bg-slate-50/50 dark:bg-slate-900/40 rounded-[2.5rem] border-dashed border-2 border-slate-200 dark:border-white/5">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
             <BookOpen className="w-10 h-10 opacity-20" />
          </div>
          <p className="text-slate-900 dark:text-white text-lg font-black tracking-tight">Sin materias cargadas</p>
          <p className="text-slate-500 text-sm mt-2 mb-8 max-w-[200px] mx-auto leading-relaxed">Configurá el horario semanal del alumno para cargar acuerdos por área.</p>
          <Button asChild variant="indigo" className="rounded-2xl font-black px-8">
            <Link href={`/alumnos/${slug}/editar`}>EDITAR HORARIOS</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {alumno.horarios.map((h, i) => (
            <Card key={i} className="overflow-hidden border-slate-200 dark:border-white/5 shadow-2xl bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] group">
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-start bg-slate-50/30 dark:bg-slate-800/20 group-hover:bg-indigo-500/5 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <h2 className="text-slate-900 dark:text-white text-xl font-black tracking-tight">{h.materia}</h2>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{h.dia}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{h.hora_inicio}–{h.hora_fin}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-white/5 shadow-sm text-center min-w-[100px]">
                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-0.5">Docente Cargo</p>
                  <p className="text-slate-900 dark:text-white text-xs font-black truncate">{h.docente}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Acuerdos de Aula</p>
                  </div>
                  <Badge variant="success" className="h-5 px-2 text-[8px] border-none font-black uppercase tracking-widest">ACTIVOS</Badge>
                </div>
                
                <div className="space-y-3">
                  {h.acuerdos_diarios && h.acuerdos_diarios.length > 0 ? (
                    h.acuerdos_diarios.map((acuerdo, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden group/item hover:border-indigo-500/30 transition-all">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/20 group-hover/item:bg-indigo-500 transition-colors" />
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md">{acuerdo.fecha}</span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-[13px] leading-relaxed font-medium">{acuerdo.acuerdo}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-800/10 rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-30" />
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold leading-none italic">Aún no hay acuerdos registrados para esta materia.</p>
                    </div>
                  )}
                </div>
                
                <Button variant="secondary" className="mt-6 w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/10 gap-2">
                  <PlusCircle className="w-4 h-4" /> Registrar Nuevo Acuerdo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
