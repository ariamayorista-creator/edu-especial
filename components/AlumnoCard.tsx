import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getColorDiagnostico, getIniciales, type Alumno } from '@/lib/mock'
import { MapPin, NotebookTabs } from 'lucide-react'

export default function AlumnoCard({ alumno }: { alumno: Alumno }) {
  const colors = getColorDiagnostico(alumno.diagnostico)
  const logsCount = alumno.logs.length
  
  // Mapping diagnostico string to dynamic badge variants
  const getBadgeVariant = (diag: string | null) => {
    if (!diag) return 'default'
    const d = diag.toLowerCase()
    if (d.includes('tea')) return 'tea'
    if (d.includes('tdah')) return 'tdah'
    if (d.includes('down')) return 'down'
    return 'default'
  }

  return (
    <Link href={`/alumnos/${alumno.slug}`} className="block active-scale group">
      <Card variant="glass" className="p-6 hover:translate-y-[-2px] hover:shadow-2xl transition-all border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-5">
          <div className={`${colors.bg} w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white font-black text-xl shadow-xl transition-all group-hover:scale-110 group-active:scale-95`}>
            {getIniciales(alumno.nombre, alumno.apellido)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-slate-900 dark:text-white font-black text-xl leading-tight truncate">{alumno.nombre} {alumno.apellido}</h3>
              <div className={`w-2.5 h-2.5 rounded-full ${colors.bg} animate-pulse shadow-lg`} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold truncate flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" /> {alumno.colegio.nombre}
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant(alumno.diagnostico)}>
              {alumno.diagnostico ?? 'Sin diagnóstico'}
            </Badge>
            {alumno.cud && (
              <Badge variant="default" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50">
                CUD
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-white/5">
             <NotebookTabs className="w-4 h-4 text-slate-500" />
             <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
               {logsCount} {logsCount === 1 ? 'Log' : 'Logs'}
             </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
