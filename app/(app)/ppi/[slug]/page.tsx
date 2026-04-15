import { getAlumno, ALUMNOS } from '@/lib/mock'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export function generateStaticParams() {
  return ALUMNOS.map(a => ({ slug: a.slug }))
}

export default function PPIAlumnoPage({ params }: { params: { slug: string } }) {
  const alumno = getAlumno(params.slug)
  if (!alumno) notFound()

  const añoActual = new Date().getFullYear()
  // PPI de ejemplo hardcodeado
  const ppis = [{ año: añoActual - 1, estado: 'finalizado' }]

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6 pt-6">
        <Link href="/ppi" className="text-slate-400 text-2xl leading-none">‹</Link>
        <div>
          <h1 className="text-xl font-bold text-white">PPI</h1>
          <p className="text-slate-400 text-sm">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      <Link href={`/ppi/${alumno.slug}/nuevo`}
        className="block w-full bg-indigo-600 text-white rounded-2xl py-4 text-center font-semibold mb-6 active:bg-indigo-700 transition-colors">
        + Nueva PPI {añoActual}
      </Link>

      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3 px-1">Anteriores</p>
      <div className="space-y-2">
        {ppis.map(ppi => (
          <div key={ppi.año} className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">PPI {ppi.año}</p>
              <p className="text-slate-400 text-sm">Propuesta Pedagógica Individual</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
              ✓ Finalizado
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
