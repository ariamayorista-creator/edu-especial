import { ALUMNOS } from '@/lib/mock'
import NuevoInformeClient from './NuevoInformeClient'

export function generateStaticParams() {
  return ALUMNOS.map(a => ({ slug: a.slug }))
}

export default function Page() {
  return <NuevoInformeClient />
}
