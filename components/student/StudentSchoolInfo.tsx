'use client'
import WhatsAppButton from '@/components/WhatsAppButton'
import { type Colegio } from '@/lib/mock'

interface StudentSchoolInfoProps {
  colegio: Colegio
}

export default function StudentSchoolInfo({ colegio }: StudentSchoolInfoProps) {
  return (
    <div className="space-y-4">
      {/* Colegio */}
      <section>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 px-1">Colegio</p>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-1.5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <p className="text-slate-900 dark:text-white font-semibold">{colegio.nombre}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">📍 {colegio.direccion}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">📞 {colegio.telefono}</p>
        </div>
      </section>

      {/* Contactos directivos */}
      <section>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 px-1">Contactos directivos</p>
        <div className="space-y-2">
          <WhatsAppButton nombre={colegio.director_nombre} rol="Directora/Director" telefono={colegio.director_tel} />
          {colegio.vice_nombre && (
            <WhatsAppButton nombre={colegio.vice_nombre} rol="Vice" telefono={colegio.vice_tel} />
          )}
        </div>
      </section>

      {/* EOE */}
      {colegio.eoe_nombre && (
        <section>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 px-1">EOE</p>
          <WhatsAppButton nombre={colegio.eoe_nombre} rol={colegio.eoe_rol} telefono={colegio.eoe_tel} />
        </section>
      )}
    </div>
  )
}
