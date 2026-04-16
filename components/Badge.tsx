import { getColorDiagnostico, type Diagnostico } from '@/lib/mock'

export default function Badge({ diagnostico }: { diagnostico: Diagnostico | string | null }) {
  const colors = getColorDiagnostico(diagnostico)
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border border-white/5 ${colors.light.replace('text-', 'text-opacity-95 text-').replace('bg-', 'bg-opacity-20 bg-')}`}>
      {diagnostico ?? 'Sin diagnóstico'}
    </span>
  )
}
