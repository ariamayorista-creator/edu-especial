import { ALUMNOS } from '@/lib/mock'
import NuevoPPIClient from './NuevoPPIClient'

export function generateStaticParams() {
  return ALUMNOS.map(a => ({ slug: a.slug }))
}

export default function Page() {
  return <NuevoPPIClient />
}
