import { ALUMNOS } from '@/lib/mock'
import RegistrosClient from './RegistrosClient'

export function generateStaticParams() {
  return ALUMNOS.map(a => ({ slug: a.slug }))
}

export default function Page() {
  return <RegistrosClient />
}
