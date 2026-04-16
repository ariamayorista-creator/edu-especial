'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'
import ScheduleEditor from '@/components/ScheduleEditor'
import { type Horario, type Diagnostico } from '@/lib/mock'
import { DIAGNOSTICOS_SUGERIDOS } from '@/lib/constants'

export default function EditarAlumnoPage() {
  const router = useRouter()
  const { slug } = useParams() as { slug: string }
  const { students, updateStudent } = useStudents()
  const alumno = students.find(s => s.slug === slug)

  // Basic Info
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [diagnostico, setDiagnostico] = useState<Diagnostico>(DIAGNOSTICOS_SUGERIDOS[0] as Diagnostico)
  const [cud, setCud] = useState(false)

  // School Info
  const [colegioNombre, setColegioNombre] = useState('')
  const [colegioDireccion, setColegioDireccion] = useState('')
  const [colegioTel, setColegioTel] = useState('')
  const [directorNombre, setDirectorNombre] = useState('')
  const [directorTel, setDirectorTel] = useState('')

  // Perfil Pedagógico
  const [comoAprende, setComoAprende] = useState('')
  const [etapaLectura, setEtapaLectura] = useState<'Presilábica' | 'Silábica' | 'Alfabética' | 'Ortográfica' | 'No evaluada'>('No evaluada')
  const [etapaMatematica, setEtapaMatematica] = useState<'Sensoriomotora' | 'Preconceptual' | 'Conceptual' | 'Logicomatemática' | 'No evaluada'>('No evaluada')
  const [andamiajes, setAndamiajes] = useState('')
  const [habilidadesIntereses, setHabilidadesIntereses] = useState('')

  // Schedules
  const [horarios, setHorarios] = useState<Horario[]>([])

  useEffect(() => {
    if (alumno) {
      setNombre(alumno.nombre)
      setApellido(alumno.apellido)
      setDiagnostico(alumno.diagnostico)
      setCud(alumno.cud)
      setColegioNombre(alumno.colegio.nombre)
      setColegioDireccion(alumno.colegio.direccion)
      setColegioTel(alumno.colegio.telefono)
      setDirectorNombre(alumno.colegio.director_nombre)
      setDirectorTel(alumno.colegio.director_tel)
      
      if (alumno.perfil_pedagogico) {
        setComoAprende(alumno.perfil_pedagogico.como_aprende)
        setEtapaLectura(alumno.perfil_pedagogico.etapa_lectura)
        setEtapaMatematica(alumno.perfil_pedagogico.etapa_matematica)
        setAndamiajes(alumno.perfil_pedagogico.andamiajes)
        setHabilidadesIntereses(alumno.perfil_pedagogico.habilidades_intereses)
      }
      setHorarios(alumno.horarios)
    }
  }, [alumno])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre || !apellido || !colegioNombre) return

    updateStudent(slug, {
      nombre,
      apellido,
      diagnostico,
      cud,
      colegio: {
        nombre: colegioNombre,
        direccion: colegioDireccion,
        telefono: colegioTel,
        director_nombre: directorNombre,
        director_tel: directorTel,
      },
      perfil_pedagogico: {
        como_aprende: comoAprende,
        etapa_lectura: etapaLectura,
        etapa_matematica: etapaMatematica,
        andamiajes: andamiajes,
        habilidades_intereses: habilidadesIntereses,
      },
      horarios
    })

    router.push(`/alumnos/${slug}`)
  }

  if (!alumno) return <p className="text-white p-6">Cargando...</p>

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-4 pt-6">
        <Link href={`/alumnos/${slug}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-4xl leading-none font-light active:scale-90 transition-transform">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white px-1">Editar Alumno</h1>
          <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-1 mt-0.5">
            Actualiza los datos de {alumno.nombre}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Info */}
        <section className="space-y-4">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Datos Personales</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="bg-slate-800 text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-700/50 shadow-inner"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              className="bg-slate-800 text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-700/50 shadow-inner"
              required
            />
          </div>
          <div className="flex gap-3">
            <select
              value={diagnostico}
              onChange={e => setDiagnostico(e.target.value as Diagnostico)}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 appearance-none shadow-sm dark:shadow-inner"
            >
              {DIAGNOSTICOS_SUGERIDOS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setCud(!cud)}
              className={`flex items-center gap-2 px-6 rounded-2xl border transition-all ${
                cud ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              CUD {cud ? '✓' : '✗'}
            </button>
          </div>
        </section>

        {/* School Info */}
        <section className="space-y-4">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Información Escolar</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre del Colegio"
              value={colegioNombre}
              onChange={e => setColegioNombre(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-700/50"
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={colegioDireccion}
              onChange={e => setColegioDireccion(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tel. Colegio"
                value={colegioTel}
                onChange={e => setColegioTel(e.target.value)}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none"
              />
              <input
                type="text"
                placeholder="Director/a"
                value={directorNombre}
                onChange={e => setDirectorNombre(e.target.value)}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none"
              />
            </div>
          </div>
        </section>

        {/* Perfil Pedagógico */}
        <section className="space-y-4">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Perfil Pedagógico</p>
          <div className="space-y-3">
            <textarea
              placeholder="¿Cómo aprende el alumno?"
              value={comoAprende}
              onChange={e => setComoAprende(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 min-h-[80px] shadow-sm dark:shadow-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={etapaLectura}
                onChange={e => setEtapaLectura(e.target.value as any)}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 appearance-none shadow-sm dark:shadow-none"
              >
                <option value="No evaluada">Lectura: No evaluada</option>
                <option value="Presilábica">Presilábica</option>
                <option value="Silábica">Silábica</option>
                <option value="Alfabética">Alfabética</option>
                <option value="Ortográfica">Ortográfica</option>
              </select>
              <select
                value={etapaMatematica}
                onChange={e => setEtapaMatematica(e.target.value as any)}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 appearance-none shadow-sm dark:shadow-none"
              >
                <option value="No evaluada">Mate: No evaluada</option>
                <option value="Sensoriomotora">Sensoriomotora</option>
                <option value="Preconceptual">Preconceptual</option>
                <option value="Conceptual">Conceptual</option>
                <option value="Logicomatemática">Logicomatemática</option>
              </select>
            </div>
            <textarea
              placeholder="Andamiajes y Configuraciones de Apoyo (ej. visuales, tiempos)..."
              value={andamiajes}
              onChange={e => setAndamiajes(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 min-h-[80px] shadow-sm dark:shadow-none"
            />
            <textarea
              placeholder="Describa habilidades, intereses e inteligencias múltiples..."
              value={habilidadesIntereses}
              onChange={e => setHabilidadesIntereses(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-200 dark:border-slate-700/50 min-h-[80px] shadow-sm dark:shadow-none"
            />
          </div>
        </section>

        {/* Schedule */}
        <section className="space-y-4">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Horarios Semanales</p>
          {/* A simple implementation of ScheduleEditor might need initialHorarios, but we assume it renders horizontally or we just pass the hook set */}
          {/* For perfect functioning with previous component: */}
          <ScheduleEditor onChange={setHorarios} />
          {horarios.length > 0 && <p className="text-[10px] text-emerald-500 uppercase font-bold pl-1">{horarios.length} materias cargadas actualmente</p>}
        </section>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl py-5 font-black text-lg shadow-xl shadow-indigo-900/40 transition-all active-scale"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}
