import { getAlumno, getColorDiagnostico, getIniciales, ALUMNOS } from '@/lib/mock'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/Badge'
import WhatsAppButton from '@/components/WhatsAppButton'

export function generateStaticParams() {
  return ALUMNOS.map(a => ({ slug: a.slug }))
}

export default function AlumnoPage({ params }: { params: { slug: string } }) {
  const alumno = getAlumno(params.slug)
  if (!alumno) notFound()

  const colors = getColorDiagnostico(alumno.diagnostico)
  const c = alumno.colegio

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-6">
        <Link href="/" className="text-slate-400 text-2xl leading-none">‹</Link>
        <div className={`${colors.bg} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
          {getIniciales(alumno.nombre, alumno.apellido)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{alumno.nombre} {alumno.apellido}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge diagnostico={alumno.diagnostico} />
            {alumno.cud && <span className="text-xs text-slate-400">CUD ✓</span>}
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { href: `/alumnos/${alumno.slug}/registros`, icon: '📓', label: 'Registros' },
          { href: `/alumnos/${alumno.slug}/asistencia`, icon: '📅', label: 'Asistencia' },
          { href: `/ppi/${alumno.slug}`, icon: '📋', label: 'PPI' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="bg-slate-800 rounded-xl p-3 text-center active:bg-slate-700 transition-colors">
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className="text-slate-300 text-xs">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Colegio */}
      <section className="mb-4">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 px-1">Colegio</p>
        <div className="bg-slate-800 rounded-2xl p-4 space-y-1.5">
          <p className="text-white font-semibold">{c.nombre}</p>
          <p className="text-slate-400 text-sm">📍 {c.direccion}</p>
          <p className="text-slate-400 text-sm">📞 {c.telefono}</p>
        </div>
      </section>

      {/* Contactos directivos */}
      <section className="mb-4">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 px-1">Contactos directivos</p>
        <div className="space-y-2">
          <WhatsAppButton nombre={c.director_nombre} rol="Directora/Director" telefono={c.director_tel} />
          {c.vice_nombre && (
            <WhatsAppButton nombre={c.vice_nombre} rol="Vice" telefono={c.vice_tel} />
          )}
        </div>
      </section>

      {/* EOE */}
      {c.eoe_nombre && (
        <section className="mb-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 px-1">EOE</p>
          <WhatsAppButton nombre={c.eoe_nombre} rol={c.eoe_rol} telefono={c.eoe_tel} />
        </section>
      )}

      {/* Horario */}
      {alumno.horarios.length > 0 && (
        <section className="mb-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 px-1">Horario de materias</p>
          <div className="bg-slate-800 rounded-2xl overflow-hidden">
            {alumno.horarios.map((h, i) => (
              <div key={i} className={`flex items-center px-4 py-3 gap-3 ${i < alumno.horarios.length - 1 ? 'border-b border-slate-700' : ''}`}>
                <span className="text-slate-400 text-sm w-20 flex-shrink-0">{h.dia}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{h.materia}</p>
                  <p className="text-slate-400 text-xs">{h.hora_inicio}–{h.hora_fin} · {h.docente}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
