'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getIniciales, getColorDiagnostico, type Alumno } from '@/lib/mock'
import { ArrowLeft, Edit3, FileText } from 'lucide-react'

interface StudentHeaderProps {
  alumno: Alumno
}

export default function StudentHeader({ alumno }: StudentHeaderProps) {
  const colors = getColorDiagnostico(alumno.diagnostico)
  
  // Dynamic badge variant for diagnosis
  const getBadgeVariant = (diag: string | null) => {
    if (!diag) return 'default'
    const d = diag.toLowerCase()
    if (d.includes('tea')) return 'tea'
    if (d.includes('tdah')) return 'tdah'
    if (d.includes('down')) return 'down'
    return 'default'
  }

  return (
    <div className="flex items-center gap-4 mb-8 pt-6 px-1">
      <Button asChild variant="glass" size="icon" className="w-12 h-12 rounded-2xl shadow-lg">
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </Button>
      
      <Card variant="glass" className="flex-1 flex justify-between items-center p-4 shadow-xl border-white/5">
        <div className="flex items-center gap-4">
          <div className={`${colors.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl`}>
            {getIniciales(alumno.nombre, alumno.apellido)}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              {alumno.nombre} {alumno.apellido}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={getBadgeVariant(alumno.diagnostico)}>
                {alumno.diagnostico ?? 'Sin diagnóstico'}
              </Badge>
              {alumno.cud && (
                <Badge variant="default" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50">
                  CUD
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="secondary" size="icon" className="w-11 h-11 rounded-2xl shadow-inner border border-slate-200 dark:border-white/10 hover:scale-105 active:scale-95 transition-all bg-indigo-50/50 hover:bg-indigo-100">
            <Link href={`/alumnos/${alumno.id}/reporte`}>
              <FileText className="w-5 h-5 text-indigo-600" />
            </Link>
          </Button>

          <Button asChild variant="secondary" size="icon" className="w-11 h-11 rounded-2xl shadow-inner border border-slate-200 dark:border-white/10 hover:scale-105 active:scale-95 transition-all">
            <Link href={`/alumnos/${alumno.slug}/editar`}>
              <Edit3 className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
