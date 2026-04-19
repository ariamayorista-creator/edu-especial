'use client'

import WhatsAppButton from '@/components/WhatsAppButton'
import { type Colegio } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, School, Users2, ShieldCheck } from 'lucide-react'

interface StudentSchoolInfoProps {
  colegio: Colegio
}

export default function StudentSchoolInfo({ colegio }: StudentSchoolInfoProps) {
  return (
    <div className="space-y-6 mt-8">
      {/* Colegio */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <School className="w-4 h-4 text-slate-500" />
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Institución Educativa</p>
        </div>
        <Card variant="glass" className="p-6 border-slate-200/50 dark:border-white/10 shadow-xl shadow-slate-200/5">
          <CardContent className="p-0 space-y-4">
            <p className="text-slate-900 dark:text-white font-black text-lg leading-tight">{colegio.nombre}</p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-500 mt-0.5" />
                <p className="text-slate-600 dark:text-slate-400 text-xs font-medium leading-normal">{colegio.direccion}</p>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Phone className="w-4 h-4 text-indigo-500" />
                <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">{colegio.telefono}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contactos directivos */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Users2 className="w-4 h-4 text-slate-500" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Cuerpo Directivo</p>
        </div>
        <div className="grid gap-3">
          <WhatsAppButton nombre={colegio.director_nombre} rol="Directora/Director" telefono={colegio.director_tel} />
          {colegio.vice_nombre && (
            <WhatsAppButton nombre={colegio.vice_nombre} rol="Vicedirector/a" telefono={colegio.vice_tel} />
          )}
        </div>
      </section>

      {/* EOE */}
      {colegio.eoe_nombre && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Gabinete (EOE)</p>
          </div>
          <WhatsAppButton nombre={colegio.eoe_nombre} rol={colegio.eoe_rol} telefono={colegio.eoe_tel} />
        </section>
      )}
    </div>
  )
}
