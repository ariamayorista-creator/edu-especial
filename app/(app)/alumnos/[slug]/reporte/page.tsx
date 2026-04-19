'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Printer, ChevronLeft, Download, Award, Calendar, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ReportPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFullData() {
      const { data: student } = await supabase
        .from('alumnos')
        .select(`
          *,
          colegios(nombre, numero),
          acuerdos(*),
          asistencia(*),
          logs_diarios(*)
        `)
        .eq('id', slug)
        .single()
      
      if (student) {
        // Calcular métricas
        const total = student.asistencia.length
        const presentes = student.asistencia.filter((a: any) => a.estado === 'presente').length
        student.stats = {
          asistencia: total > 0 ? Math.round((presentes / total) * 100) : 100,
          acuerdosCount: student.acuerdos.length,
          logsCount: student.logs_diarios.length
        }
        setData(student)
      }
      setLoading(false)
    }
    fetchFullData()
  }, [slug])

  if (loading) return <div className="p-20 text-center font-black uppercase text-slate-300 animate-pulse">Generando Reporte...</div>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Tool Bar - Hidden on Print */}
      <div className="max-w-4xl mx-auto p-6 flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <ChevronLeft className="w-4 h-4" /> Volver al Perfil
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active-scale">
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </Button>
        </div>
      </div>

      {/* Report Canvas */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-950 shadow-2xl print:shadow-none min-h-[29.7cm] p-12 print:p-0 relative overflow-hidden">
        
        {/* Decorative Watermark */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-indigo-600 pb-8 relative z-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Edu-Especial</h1>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">Plataforma de Seguimiento NEE</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-slate-900 dark:text-white">Reporte de Seguimiento</div>
            <div className="text-[10px] font-black text-slate-400 uppercase mt-1">{new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Student Info Section */}
        <div className="mt-10 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Información del Alumno</h2>
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900 dark:text-white capitalize">{data.nombre} {data.apellido}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-black uppercase border-indigo-100 text-indigo-600">{data.nee_tipo || 'NEE'}</Badge>
                <span className="text-xs font-bold text-slate-500">{data.colegios?.nombre} - {data.nivel || 'Nivel'}</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 flex flex-col justify-center items-center">
            <div className="text-3xl font-black text-indigo-600 leading-none">{data.stats.asistencia}%</div>
            <div className="text-[9px] font-black text-slate-400 uppercase mt-2">Asistencia Total</div>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-12 space-y-12">
          
          {/* Section: Acuerdos */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg"><Award className="w-4 h-4 text-indigo-600" /></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Acuerdos Pedagógicos Vigentes</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data.acuerdos.map((ac: any, i: number) => (
                <div key={i} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50">
                  <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                    "{ac.descripcion}"
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Resumen de Observaciones */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg"><FileText className="w-4 h-4 text-emerald-600" /></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Bitácora Pedagógica (Últimas Entradas)</h3>
            </div>
            <div className="space-y-4">
              {data.logs_diarios.slice(-5).reverse().map((log: any, i: number) => (
                <div key={i} className="flex gap-4 items-start pl-2">
                  <div className="text-[10px] font-black text-slate-400 w-24 pt-1 uppercase">
                    {new Date(log.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                  </div>
                  <div className="flex-1 text-xs font-medium text-slate-600 pb-4 border-b border-slate-50 leading-relaxed">
                    {log.observacion}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="absolute bottom-12 inset-x-12 border-t border-slate-100 pt-8 flex justify-between items-end">
          <div className="text-[9px] font-black text-slate-300 uppercase leading-loose tracking-tighter">
            Este documento es un reporte interno de seguimiento pedagógico.<br />
            Generado automáticamente por el motor de Edu-Especial V4.5.
          </div>
          <div className="flex flex-col items-center">
            <div className="w-40 h-px bg-slate-300 mb-2" />
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Firma del Profesional</div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .min-h-screen { background: white !important; }
          @page { size: portrait; margin: 0; }
        }
      `}</style>
    </div>
  )
}
