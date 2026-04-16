export type Diagnostico = 
  | 'TDA' | 'TDAH' | 'TEA' | 'TES' 
  | 'Discapacidad visual' | 'Discapacidad auditiva' 
  | 'Discapacidad intelectual' | 'Discapacidad motora'

export type EstadoAsistencia = 'presente' | 'ausente' | 'tardanza'

export interface Colegio {
  nombre: string
  numero?: string
  direccion: string
  telefono: string
  director_nombre: string
  director_tel: string
  vice_nombre?: string
  vice_tel?: string
  eoe_nombre?: string
  eoe_rol?: string
  eoe_tel?: string
}

export interface AcuerdoClase {
  fecha: string
  acuerdo: string
}

export interface Horario {
  dia: string
  hora_inicio: string
  hora_fin: string
  materia: string
  docente: string
  acuerdos_diarios?: AcuerdoClase[]
}

export interface LogDiario {
  id: string
  fecha: string // 'YYYY-MM-DD'
  observacion: string
  participo: boolean
  se_frustro: boolean
  uso_apoyo_visual: boolean
  trabajo_en_grupo: boolean
}

export interface Documento {
  id: string
  nombre: string
  fecha: string
  tipo: 'pdf' | 'doc'
  descripcion?: string
  geminiFileUri?: string
  geminiMimeType?: string
}

export interface PerfilPedagogico {
  como_aprende: string
  etapa_lectura: 'Presilábica' | 'Silábica' | 'Alfabética' | 'Ortográfica' | 'No evaluada'
  etapa_matematica: 'Sensoriomotora' | 'Preconceptual' | 'Conceptual' | 'Logicomatemática' | 'No evaluada'
  andamiajes: string
  habilidades_intereses: string
}

export interface Alumno {
  slug: string
  nombre: string
  apellido: string
  diagnostico: Diagnostico
  cud: boolean
  colegio: Colegio
  horarios: Horario[]
  logs: LogDiario[]
  asistencia: Record<string, EstadoAsistencia> // key: 'YYYY-MM-DD'
  documentos?: Documento[]
  perfil_pedagogico?: PerfilPedagogico
}

function diasAtras(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function fechaMes(año: number, mes: number, dia: number): string {
  return `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

const hoy = new Date()
const año = hoy.getFullYear()
const mes = hoy.getMonth() + 1

export const ALUMNOS: Alumno[] = [
  {
    slug: 'lucas',
    nombre: 'Lucas',
    apellido: 'Méndez',
    diagnostico: 'TEA',
    cud: true,
    colegio: {
      nombre: 'EP Nro 14 "San Martín"',
      direccion: 'Av. Corrientes 1234, Lomas de Zamora',
      telefono: '011 42921234',
      director_nombre: 'María López',
      director_tel: '5491123456789',
    },
    horarios: [
      { dia: 'Lunes', hora_inicio: '08:00', hora_fin: '12:00', materia: 'Prácticas del Lenguaje', docente: 'Prof. Fernández' },
      { dia: 'Martes', hora_inicio: '08:00', hora_fin: '10:00', materia: 'Matemática', docente: 'Prof. Castro' },
    ],
    logs: [
      {
        id: 'l1',
        fecha: diasAtras(1),
        observacion: 'Lucas logró permanecer en el aula durante todo el bloque de Lengua. Utilizó apoyos visuales para secuenciar la tarea del cuento "El gato con botas".',
        participo: true, se_frustro: false, uso_apoyo_visual: true, trabajo_en_grupo: false,
      },
      {
        id: 'l2',
        fecha: diasAtras(3),
        observacion: 'Se observó sensibilidad sensorial ante ruidos en el recreo. En el aula, trabajó bien con auriculares canceladores de ruido.',
        participo: false, se_frustro: true, uso_apoyo_visual: true, trabajo_en_grupo: false,
      },
      {
        id: 'l3',
        fecha: diasAtras(5),
        observacion: 'Excelente avance en la escritura autónoma de palabras sencillas. Identificó fonemas iniciales con tarjetas.',
        participo: true, se_frustro: false, uso_apoyo_visual: true, trabajo_en_grupo: true,
      },
    ],
    asistencia: {},
    documentos: [
      { id: 'd1', nombre: 'Certificado Único de Discapacidad', fecha: '2023-05-12', tipo: 'pdf', descripcion: 'CUD actualizado' },
      { id: 'd2', nombre: 'Informe Neurológico', fecha: '2024-02-10', tipo: 'doc', descripcion: 'Informe Dr. Silva' }
    ],
    perfil_pedagogico: {
      como_aprende: 'Aprende mejor a través de secuencias visuales claras y rutinas estructuradas. Requiere anticipación de los cambios.',
      etapa_lectura: 'Alfabética',
      etapa_matematica: 'Preconceptual',
      andamiajes: 'Apoyo visual (pictogramas), auriculares canceladores de ruido, tareas fraccionadas.',
      habilidades_intereses: 'Dinosaurios, trenes, muy buena memoria visual y facilidad para armar rompecabezas.'
    }
  },
  {
    slug: 'valentina',
    nombre: 'Valentina',
    apellido: 'Rodríguez',
    diagnostico: 'TDAH',
    cud: false,
    colegio: {
      nombre: 'EP Nro 7 "Manuel Belgrano"',
      direccion: 'Rivadavia 567',
      telefono: '011 42925678',
      director_nombre: 'Carmen Suárez',
      director_tel: '5491134567890',
    },
    horarios: [
      { dia: 'Miércoles', hora_inicio: '13:00', hora_fin: '17:00', materia: 'Ciencias Naturales', docente: 'Prof. Giménez' },
    ],
    logs: [
      {
        id: 'v1',
        fecha: diasAtras(2),
        observacion: 'Valentina necesitó varios recordatorios para mantenerse en la tarea. Logró completar el experimento de germinación con supervisión constante.',
        participo: true, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: true,
      },
      {
        id: 'v2',
        fecha: diasAtras(4),
        observacion: 'Jornada muy productiva. Se sentó en el primer banco y esto ayudó a reducir distracciones externas.',
        participo: true, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: false,
      },
    ],
    asistencia: {},
    perfil_pedagogico: {
      como_aprende: 'Aprende de manera kinestésica y mediante el aprendizaje basado en proyectos. Necesita descansos frecuentes.',
      etapa_lectura: 'Ortográfica',
      etapa_matematica: 'Conceptual',
      andamiajes: 'Sentarse en los primeros bancos, pausas activas cada 20 minutos, material concreto en matemáticas.',
      habilidades_intereses: 'Artes plásticas, animales, le gusta ayudar a repartir materiales.'
    }
  },
  {
    slug: 'mateo',
    nombre: 'Mateo',
    apellido: 'González',
    diagnostico: 'Discapacidad intelectual',
    cud: true,
    colegio: {
      nombre: 'ES Nro 3 "9 de Julio"',
      direccion: 'Bv. Rosas 890',
      telefono: '011 42929012',
      director_nombre: 'Roberto Díaz',
      director_tel: '5491156789012',
    },
    horarios: [],
    logs: [
      {
        id: 'm1',
        fecha: diasAtras(1),
        observacion: 'Mateo reconoció los números del 1 al 10 en la recta numérica. Requiere apoyo físico para el trazado de algunas cifras.',
        participo: true, se_frustro: false, uso_apoyo_visual: true, trabajo_en_grupo: false,
      },
    ],
    asistencia: {},
    perfil_pedagogico: {
      como_aprende: 'Aprendizaje por imitación y repetición. Requiere modelado constante y refuerzo positivo inmediato.',
      etapa_lectura: 'Presilábica',
      etapa_matematica: 'Sensoriomotora',
      andamiajes: 'Apoyo físico para grafomotricidad, pictogramas, instrucciones paso a paso muy cortas.',
      habilidades_intereses: 'Música, canciones infantiles, jugar con masa o arcilla.'
    }
  },
]

export function getAlumno(slug: string): Alumno | undefined {
  return ALUMNOS.find(a => a.slug === slug)
}

export function getColorDiagnostico(diagnostico: Diagnostico | string | null) {
  switch (diagnostico) {
    case 'TEA':
    case 'TES':
      return {
        bg: 'bg-indigo-500',
        light: 'bg-indigo-500/10 text-indigo-400',
        border: 'border-l-indigo-500',
      }
    case 'TDAH':
    case 'TDA':
      return {
        bg: 'bg-emerald-500',
        light: 'bg-emerald-500/10 text-emerald-400',
        border: 'border-l-emerald-500',
      }
    case 'Discapacidad intelectual':
    case 'DI':
      return {
        bg: 'bg-orange-500',
        light: 'bg-orange-500/10 text-orange-400',
        border: 'border-l-orange-500',
      }
    case 'Discapacidad motora':
      return {
        bg: 'bg-rose-500',
        light: 'bg-rose-500/10 text-rose-400',
        border: 'border-l-rose-500',
      }
    case 'Discapacidad visual':
    case 'Discapacidad auditiva':
      return {
        bg: 'bg-sky-500',
        light: 'bg-sky-500/10 text-sky-400',
        border: 'border-l-sky-500',
      }
    default: return {
      bg: 'bg-slate-500',
      light: 'bg-slate-500/10 text-slate-400',
      border: 'border-l-slate-500',
    }
  }
}

export function getIniciales(nombre: string, apellido: string) {
  return `${nombre[0]}${apellido[0]}`.toUpperCase()
}

export function getWhatsAppUrl(telefono: string) {
  return `https://wa.me/${telefono.replace(/\D/g, '')}`
}

export function formatFecha(fecha: string) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'short', day: 'numeric', month: 'short'
  })
}
