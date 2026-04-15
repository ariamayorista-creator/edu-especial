// lib/mock.ts
export type Diagnostico = 'TEA' | 'TDAH' | 'DI'
export type EstadoAsistencia = 'presente' | 'ausente' | 'tardanza'

export interface Colegio {
  nombre: string
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

export interface Horario {
  dia: string
  hora_inicio: string
  hora_fin: string
  materia: string
  docente: string
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
      telefono: '4 292-1234',
      director_nombre: 'María López',
      director_tel: '5491123456789',
      vice_nombre: 'Ana Pérez',
      vice_tel: '5491198765432',
      eoe_nombre: 'Gabriela Torres',
      eoe_rol: 'Psicóloga',
      eoe_tel: '5491145678901',
    },
    horarios: [
      { dia: 'Lunes', hora_inicio: '08:00', hora_fin: '09:30', materia: 'Prácticas del Lenguaje', docente: 'Prof. Fernández' },
      { dia: 'Martes', hora_inicio: '08:00', hora_fin: '09:30', materia: 'Matemática', docente: 'Prof. Castro' },
      { dia: 'Miércoles', hora_inicio: '10:00', hora_fin: '11:00', materia: 'Ciencias Naturales', docente: 'Prof. Romero' },
      { dia: 'Jueves', hora_inicio: '08:00', hora_fin: '09:00', materia: 'Ciencias Sociales', docente: 'Prof. Díaz' },
    ],
    logs: [
      {
        id: '1',
        fecha: diasAtras(1),
        observacion: 'Lucas trabajó bien con las consignas fragmentadas. Completó 3 de 4 actividades de Lengua sin frustrarse.',
        participo: true, se_frustro: false, uso_apoyo_visual: true, trabajo_en_grupo: false,
      },
      {
        id: '2',
        fecha: diasAtras(3),
        observacion: 'Jornada difícil. Se frustró al cambiar de actividad sin anticipación. Mejoró con la tabla visual al final de la clase.',
        participo: false, se_frustro: true, uso_apoyo_visual: true, trabajo_en_grupo: false,
      },
      {
        id: '3',
        fecha: diasAtras(5),
        observacion: 'Excelente participación en trabajo grupal de Ciencias Naturales. Tomó el rol de "lector" del grupo.',
        participo: true, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: true,
      },
    ],
    asistencia: {
      [fechaMes(año, mes, 1)]: 'presente',
      [fechaMes(año, mes, 2)]: 'presente',
      [fechaMes(año, mes, 3)]: 'presente',
      [fechaMes(año, mes, 4)]: 'ausente',
      [fechaMes(año, mes, 7)]: 'tardanza',
      [fechaMes(año, mes, 8)]: 'presente',
      [fechaMes(año, mes, 9)]: 'presente',
      [fechaMes(año, mes, 10)]: 'presente',
    },
  },
  {
    slug: 'valentina',
    nombre: 'Valentina',
    apellido: 'Rodríguez',
    diagnostico: 'TDAH',
    cud: false,
    colegio: {
      nombre: 'EP Nro 7 "Manuel Belgrano"',
      direccion: 'Calle Rivadavia 567, Lomas de Zamora',
      telefono: '4 292-5678',
      director_nombre: 'Carmen Suárez',
      director_tel: '5491134567890',
    },
    horarios: [
      { dia: 'Lunes', hora_inicio: '09:00', hora_fin: '10:30', materia: 'Prácticas del Lenguaje', docente: 'Prof. Giménez' },
      { dia: 'Miércoles', hora_inicio: '08:00', hora_fin: '09:30', materia: 'Matemática', docente: 'Prof. Vargas' },
    ],
    logs: [
      {
        id: '4',
        fecha: diasAtras(2),
        observacion: 'Valentina participó activamente. Necesitó recordatorio de turnos x2 pero logró trabajar en grupo sin conflictos.',
        participo: true, se_frustro: false, uso_apoyo_visual: false, trabajo_en_grupo: true,
      },
    ],
    asistencia: {
      [fechaMes(año, mes, 1)]: 'presente',
      [fechaMes(año, mes, 2)]: 'presente',
      [fechaMes(año, mes, 3)]: 'tardanza',
      [fechaMes(año, mes, 7)]: 'presente',
      [fechaMes(año, mes, 8)]: 'presente',
    },
  },
  {
    slug: 'mateo',
    nombre: 'Mateo',
    apellido: 'González',
    diagnostico: 'DI',
    cud: true,
    colegio: {
      nombre: 'ES Nro 3 "9 de Julio"',
      direccion: 'Bv. Rosas 890, Lomas de Zamora',
      telefono: '4 292-9012',
      director_nombre: 'Roberto Díaz',
      director_tel: '5491156789012',
      eoe_nombre: 'Marcelo Ríos',
      eoe_rol: 'Trabajador Social',
      eoe_tel: '5491167890123',
    },
    horarios: [
      { dia: 'Martes', hora_inicio: '08:00', hora_fin: '09:00', materia: 'Matemática', docente: 'Prof. Morales' },
      { dia: 'Jueves', hora_inicio: '10:00', hora_fin: '11:30', materia: 'Prácticas del Lenguaje', docente: 'Prof. Acosta' },
      { dia: 'Viernes', hora_inicio: '08:00', hora_fin: '09:00', materia: 'Ciencias Sociales', docente: 'Prof. Herrera' },
    ],
    logs: [],
    asistencia: {
      [fechaMes(año, mes, 1)]: 'presente',
      [fechaMes(año, mes, 2)]: 'ausente',
      [fechaMes(año, mes, 3)]: 'presente',
      [fechaMes(año, mes, 7)]: 'presente',
    },
  },
]

export function getAlumno(slug: string): Alumno | undefined {
  return ALUMNOS.find(a => a.slug === slug)
}

export function getColorDiagnostico(diagnostico: Diagnostico) {
  // Retorna índice en lugar de strings para evitar purga de Tailwind
  switch (diagnostico) {
    case 'TEA': return { key: 'tea', bg: 'bg-indigo-500', light: 'bg-indigo-100 text-indigo-700', border: 'border-l-indigo-500' }
    case 'TDAH': return { key: 'tdah', bg: 'bg-emerald-500', light: 'bg-emerald-100 text-emerald-700', border: 'border-l-emerald-500' }
    case 'DI': return { key: 'di', bg: 'bg-orange-500', light: 'bg-orange-100 text-orange-700', border: 'border-l-orange-500' }
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
