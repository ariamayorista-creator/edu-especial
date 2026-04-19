'use client'

import { getColorDiagnostico, getIniciales } from '@/lib/mock'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookCheck, Sparkles, ChevronRight } from 'lucide-react'

export default function PPIIndexPage() {
  const { students } = useStudents()
  
  return (
    <div className="p-4 pb-32 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-8">
        <Button asChild variant="glass" size="icon" className="w-12 h-12 rounded-2xl shadow-lg">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookCheck className="w-6 h-6 text-indigo-500" />
            PPI / Propuestas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Seleccioná un alumno para crear un nuevo PPI</p>
        </div>
      </div>

      <div className="space-y-4">
        {students.map(alumno => {
          const colors = getColorDiagnostico(alumno.diagnostico)
          return (
            <Link key={alumno.slug} href={`/ppi/${alumno.slug}/nuevo`} className="block active-scale group">
              <Card variant="glass" className="flex items-center gap-5 p-5 group-hover:border-indigo-500/40 transition-all shadow-lg border-slate-200/50 dark:border-white/5">
                <div className={`${colors.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform`}>
                  {getIniciales(alumno.nombre, alumno.apellido)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-900 dark:text-white font-black text-lg truncate">{alumno.nombre} {alumno.apellido}</p>
                    <div className={`w-2 h-2 rounded-full ${colors.bg} animate-pulse shadow-sm`} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate flex items-center gap-1">
                    <span className="opacity-70">📍</span> {alumno.colegio.nombre}
                  </p>
                </div>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest hidden sm:block">Nuevo PPI</p>
                  <ChevronRight className="w-5 h-5 text-indigo-500" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* IA Hint */}
      <div className="mt-8 p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/10 flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Edu-Especial v4.0 Tip:</span> La IA ahora puede redactar los acuerdos pedagógicos basándose en el historial trimestral subido y los registros de clase.
        </p>
      </div>
    </div>
  )
}
