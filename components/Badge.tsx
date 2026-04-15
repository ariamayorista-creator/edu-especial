import { getColorDiagnostico, type Diagnostico } from '@/lib/mock'

export default function Badge({ diagnostico }: { diagnostico: Diagnostico }) {
  const colors = getColorDiagnostico(diagnostico)
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.light}`}>
      {diagnostico}
    </span>
  )
}
