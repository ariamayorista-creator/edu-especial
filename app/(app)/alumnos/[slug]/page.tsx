'use client'
import { useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { useStudents } from '@/lib/context/StudentContext'

// Sub-componentes refactorizados
import StudentHeader from '@/components/student/StudentHeader'
import StudentQuickActions from '@/components/student/StudentQuickActions'
import StudentPedagogicalProfile from '@/components/student/StudentPedagogicalProfile'
import StudentDocuments from '@/components/student/StudentDocuments'
import StudentSchoolInfo from '@/components/student/StudentSchoolInfo'
import StudentSchedule from '@/components/student/StudentSchedule'

export default function AlumnoPage() {
  const { slug } = useParams() as { slug: string }
  const { students, updateStudent } = useStudents()
  const alumno = students.find(s => s.slug === slug)
  
  const [uploading, setUploading] = useState(false)

  if (!alumno) notFound()

  async function handleFileUpload(file: File) {
    if (!alumno) return;
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Error al subir el archivo')
      
      const data = await res.json()
      
      const newDoc = {
        id: 'doc_' + Date.now(),
        nombre: data.displayName,
        fecha: new Date().toISOString().split('T')[0],
        tipo: (file.type.includes('pdf') ? 'pdf' : 'doc') as 'pdf' | 'doc',
        geminiFileUri: data.uri,
        geminiMimeType: data.mimeType
      }
      
      const newDocs = alumno.documentos ? [...alumno.documentos, newDoc] : [newDoc]
      updateStudent(slug, { documentos: newDocs })
      
    } catch (err) {
      console.error(err)
      alert("Error al subir archivo. Verifica tu conexión o GOOGLE_API_KEY.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4">
      <StudentHeader alumno={alumno} />
      
      <StudentQuickActions slug={alumno.slug} />

      {alumno.perfil_pedagogico && (
        <StudentPedagogicalProfile perfil={alumno.perfil_pedagogico} />
      )}

      <StudentDocuments 
        documentos={alumno.documentos} 
        onUpload={handleFileUpload} 
        uploading={uploading} 
      />

      <StudentSchoolInfo colegio={alumno.colegio} />

      <StudentSchedule horarios={alumno.horarios} />
    </div>
  )
}
