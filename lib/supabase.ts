import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Data persistence might be limited to LocalStorage.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper types derived from our schema
export type DbAlumno = {
  id: string
  slug: string
  nombre: string
  apellido: string
  diagnostico: string
  cud: boolean
  colegio_id: string
  perfil_pedagogico: any
  created_at: string
}

export type DbLogDiario = {
  id: string
  alumno_id: string
  fecha: string
  observacion: string
  participo: boolean
  se_frustro: boolean
  uso_apoyo_visual: boolean
  trabajo_en_grupo: boolean
}
