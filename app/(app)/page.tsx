'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'
import HomeHeader from '@/components/home/HomeHeader'
import SearchBar from '@/components/home/SearchBar'
import StudentList from '@/components/home/StudentList'

function BandejaPreview() {
  const [count, setCount] = useState({ total: 0, listos: 0, generando: 0 })

  useEffect(() => {
    function calc() {
      try {
        const jobs = JSON.parse(localStorage.getItem('bandeja_jobs') || '[]')
        setCount({
          total: jobs.length,
          listos: jobs.filter((j: any) => j.status === 'listo').length,
          generando: jobs.filter((j: any) => j.status === 'generando').length,
        })
      } catch { setCount({ total: 0, listos: 0, generando: 0 }) }
    }
    calc()
    const interval = setInterval(calc, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Link href="/bandeja" className="block mb-6">
      <div className="glass rounded-[1.75rem] p-5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl">
              📥
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-base">Bandeja de Informes</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {count.total === 0
                  ? 'Sin informes generados todavía'
                  : `${count.listos} listo${count.listos !== 1 ? 's' : ''} · ${count.generando} procesando`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {count.listos > 0 && (
              <span className="w-6 h-6 bg-emerald-500 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                {count.listos}
              </span>
            )}
            {count.generando > 0 && (
              <span className="w-6 h-6 bg-amber-500 text-white text-[11px] font-black rounded-full flex items-center justify-center animate-pulse">
                {count.generando}
              </span>
            )}
            <span className="text-slate-400 text-lg ml-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

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

      <BandejaPreview />

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <StudentList 
        students={filteredStudents} 
        isFiltered={searchTerm.length > 0} 
      />
    </div>
  )
}
