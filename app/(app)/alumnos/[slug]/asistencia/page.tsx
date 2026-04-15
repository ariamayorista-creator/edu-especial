import { ALUMNOS } from '@/lib/mock'
import AsistenciaClient from './AsistenciaClient'

export function generateStaticParams() {
  return ALUMNOS.map(a => ({ slug: a.slug }))
}

export default function Page() {
  return <AsistenciaClient />
}
