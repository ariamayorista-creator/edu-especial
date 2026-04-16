'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ALUMNOS, type Alumno, type LogDiario, type EstadoAsistencia } from '@/lib/mock'

interface TeacherInfo {
  nombre: string
  titulo: string
}

interface StudentContextType {
  students: Alumno[]
  teacherInfo: TeacherInfo
  addStudent: (student: Alumno) => void
  updateStudent: (slug: string, updates: Partial<Alumno>) => void
  deleteStudent: (slug: string) => void
  addLog: (slug: string, log: LogDiario) => void
  setAsistencia: (slug: string, fecha: string, estado: EstadoAsistencia | null) => void
  updateTeacherInfo: (info: TeacherInfo) => void
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

const STORAGE_KEY = 'edu_especial_data_v1'
const TEACHER_KEY = 'edu_teacher_info'

const INITIAL_TEACHER: TeacherInfo = {
  nombre: 'Prof. Ana García',
  titulo: 'Maestra de Educación Especial',
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Alumno[]>([])
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>(INITIAL_TEACHER)
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load from local storage AND Supabase on mount
  useEffect(() => {
    async function initData() {
      const saved = localStorage.getItem(STORAGE_KEY)
      const savedTeacher = localStorage.getItem(TEACHER_KEY)
      
      let initialStudents = ALUMNOS
      if (saved) {
        try {
          initialStudents = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse saved students', e)
        }
      }

      // Try fetching from Supabase
      try {
        const { studentService } = await import('@/lib/services/studentService')
        const remoteStudents = await studentService.getStudents()
        if (remoteStudents && remoteStudents.length > 0) {
          initialStudents = remoteStudents
        }
      } catch (err) {
        console.warn('Could not load from Supabase, using local data', err)
      }

      setStudents(initialStudents)

      if (savedTeacher) {
        try {
          setTeacherInfo(JSON.parse(savedTeacher))
        } catch (e) {
          console.error('Failed to parse saved teacher info', e)
        }
      }
      
      setInitialized(true)
      setLoading(false)
    }

    initData()
  }, [])

  // Save to local storage on change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
    }
  }, [students, initialized])

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(TEACHER_KEY, JSON.stringify(teacherInfo))
    }
  }, [teacherInfo, initialized])

  const addStudent = (student: Alumno) => {
    setStudents(prev => [...prev, student])
  }

  const updateStudent = async (slug: string, updates: Partial<Alumno>) => {
    setStudents(prev => prev.map(s => s.slug === slug ? { ...s, ...updates } : s))
    
    // Sync with Supabase
    try {
       const { studentService } = await import('@/lib/services/studentService')
       await studentService.updateStudent(slug, updates)
    } catch (err) {
       console.error('Failed to sync update with Supabase', err)
    }
  }

  const deleteStudent = (slug: string) => {
    setStudents(prev => prev.filter(s => s.slug !== slug))
  }

  const addLog = (slug: string, log: LogDiario) => {
    setStudents(prev => prev.map(s => 
      s.slug === slug ? { ...s, logs: [log, ...s.logs] } : s
    ))
  }

  const setAsistencia = (slug: string, fecha: string, estado: EstadoAsistencia | null) => {
    setStudents(prev => prev.map(s => {
      if (s.slug !== slug) return s
      const newAsistencia = { ...s.asistencia }
      if (estado === null) {
        delete newAsistencia[fecha]
      } else {
        newAsistencia[fecha] = estado
      }
      return { ...s, asistencia: newAsistencia }
    }))
  }

  const updateTeacherInfo = (info: TeacherInfo) => {
    setTeacherInfo(info)
  }

  return (
    <StudentContext.Provider value={{ 
      students, 
      teacherInfo,
      addStudent, 
      updateStudent, 
      deleteStudent, 
      addLog, 
      setAsistencia,
      updateTeacherInfo 
    }}>
      {children}
    </StudentContext.Provider>
  )
}

export function useStudents() {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider')
  }
  return context
}
