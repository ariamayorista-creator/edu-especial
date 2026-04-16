import { supabase } from '@/lib/supabase'
import { type Alumno, type LogDiario, type EstadoAsistencia } from '@/lib/mock'

export const studentService = {
  async getStudents(): Promise<Alumno[]> {
    const { data, error } = await supabase
      .from('alumnos')
      .select(`
        *,
        colegios (*),
        horarios (*),
        logs_diarios (*),
        asistencia (*),
        documentos (*)
      `)
    
    if (error) {
      console.error('Error fetching students from Supabase:', error)
      return []
    }
    
    return data.map((d: any) => ({
      slug: d.slug,
      nombre: d.nombre,
      apellido: d.apellido,
      diagnostico: d.diagnostico,
      cud: d.cud,
      colegio: d.colegios || { nombre: 'Sin colegio', direccion: '', telefono: '', director_nombre: '', director_tel: '' },
      horarios: d.horarios || [],
      logs: d.logs_diarios || [],
      asistencia: (d.asistencia || []).reduce((acc: any, curr: any) => {
        acc[curr.fecha] = curr.estado
        return acc
      }, {}),
      documentos: d.documentos || [],
      perfil_pedagogico: d.perfil_pedagogico
    }))
  },

  async updateStudent(slug: string, updates: Partial<Alumno>) {
    // This requires getting the ID first
    const { data: student } = await supabase.from('alumnos').select('id').eq('slug', slug).single()
    if (!student) return;

    const { error } = await supabase
      .from('alumnos')
      .update(updates)
      .eq('id', student.id)
    
    if (error) throw error
  }
}
