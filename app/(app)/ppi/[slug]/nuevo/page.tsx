'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAlumno } from '@/lib/mock'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const CAMPOS = [
  {
    key: 'modos_aprender',
    label: 'Modos de aprender',
    emoji: '🧩',
    placeholder: 'Ej: Frente a las propuestas el estudiante se muestra receptivo cuando se presentan de manera clara, accesible y simple. La anticipación de actividades y las rutinas estructuradas favorecen su comprensión y participación...',
  },
  {
    key: 'acuerdos_lengua',
    label: 'Acuerdos — Prácticas del Lenguaje',
    emoji: '📖',
    placeholder: 'Ej:\n- Fraccionar consignas y reducir estímulos\n- Utilizar tipografía clara y ampliada\n- Ofrecer consignas impresas\n- Evitar la copia sin sentido, priorizando el abordaje de las propuestas',
  },
  {
    key: 'acuerdos_matematica',
    label: 'Acuerdos — Matemática',
    emoji: '🔢',
    placeholder: 'Ej:\n- Permitir resolver con apoyo visual (tabla pitagórica)\n- Reformular consignas y brindar tiempo extra\n- Utilizar billetes y monedas para situaciones problemáticas sencillas',
  },
  {
    key: 'acuerdos_naturales',
    label: 'Acuerdos — Ciencias Naturales',
    emoji: '🌿',
    placeholder: 'Ej:\n- Priorización de la participación oral\n- Utilización de imágenes reales, videos, textos ilustrados\n- Habilitar distintas formas de resolución (V o F, unir con flechas)',
  },
  {
    key: 'acuerdos_sociales',
    label: 'Acuerdos — Ciencias Sociales',
    emoji: '🌎',
    placeholder: 'Ej:\n- Priorizar el trabajo grupal\n- Utilización de imágenes y videos\n- Organizar y registrar información en diferentes soportes (voz, dibujos)',
  },
  {
    key: 'criterios',
    label: 'Criterios de evaluación',
    emoji: '📊',
    placeholder: 'Ej: La evaluación se realizará teniendo en cuenta la implementación de los acuerdos didácticos y el desempeño en el trabajo áulico. Herramientas: observación directa, registros anecdóticos, análisis de producciones del estudiante...',
  },
]

export default function NuevaPPIPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const alumno = getAlumno(slug)
  if (!alumno) notFound()

  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(CAMPOS.map(c => [c.key, '']))
  )
  const [toast, setToast] = useState('')

  function setField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function mostrarToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function guardarBorrador() {
    mostrarToast('Borrador guardado ✓')
  }

  function finalizar() {
    mostrarToast('PPI finalizada ✓')
    setTimeout(() => router.push(`/ppi/${slug}`), 1500)
  }

  return (
    <div className="p-4 pb-36">
      <div className="flex items-center gap-3 mb-4 pt-6">
        <Link href={`/ppi/${slug}`} className="text-slate-400 text-2xl leading-none">‹</Link>
        <div>
          <h1 className="text-xl font-bold text-white">Nueva PPI {new Date().getFullYear()}</h1>
          <p className="text-slate-400 text-sm">{alumno.nombre} {alumno.apellido}</p>
        </div>
      </div>

      {/* Toggle IA (placeholder) */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between opacity-50">
        <div>
          <p className="text-white text-sm font-medium">Usar diseño curricular como referencia</p>
          <p className="text-slate-400 text-xs">Disponible en fase 2</p>
        </div>
        <div className="w-11 h-6 bg-slate-600 rounded-full flex-shrink-0" />
      </div>

      <div className="space-y-5">
        {CAMPOS.map(campo => (
          <div key={campo.key}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">
              {campo.emoji} {campo.label}
            </label>
            <textarea
              value={form[campo.key]}
              onChange={e => setField(campo.key, e.target.value)}
              placeholder={campo.placeholder}
              rows={4}
              className="w-full bg-slate-800 text-white rounded-2xl p-4 text-sm placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        ))}
      </div>

      {/* Caja IA placeholder */}
      <div className="mt-6 bg-slate-800 rounded-2xl p-4 border border-slate-700 text-center">
        <p className="text-indigo-400 text-sm font-medium mb-1">✦ Generar con IA</p>
        <p className="text-slate-500 text-xs">La IA completará todos los campos automáticamente en fase 2</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Barra fija inferior */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 z-40">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <button onClick={guardarBorrador}
            className="flex-1 bg-slate-700 text-white rounded-2xl py-3.5 font-semibold active:bg-slate-600">
            Guardar borrador
          </button>
          <button onClick={finalizar}
            className="flex-1 bg-indigo-600 text-white rounded-2xl py-3.5 font-semibold active:bg-indigo-700">
            Finalizar PPI
          </button>
        </div>
      </div>
    </div>
  )
}
