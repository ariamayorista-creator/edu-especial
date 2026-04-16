'use client'
import { useState } from 'react'
import { useStudents } from '@/lib/context/StudentContext'
import HomeHeader from '@/components/home/HomeHeader'
import SearchBar from '@/components/home/SearchBar'
import StudentList from '@/components/home/StudentList'

export default function HomePage() {
  const { students } = useStudents()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = students.filter(student => {
    const searchLow = searchTerm.toLowerCase()
    const matchName = `${student.nombre} ${student.apellido}`.toLowerCase().includes(searchLow)
    const matchSchoolName = student.colegio.nombre.toLowerCase().includes(searchLow)
    const matchSchoolNum = student.colegio.numero?.toLowerCase().includes(searchLow)
    return matchName || matchSchoolName || matchSchoolNum
  })

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto">
      <HomeHeader studentCount={students.length} />

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <StudentList 
        students={filteredStudents} 
        isFiltered={searchTerm.length > 0} 
      />
    </div>
  )
}
