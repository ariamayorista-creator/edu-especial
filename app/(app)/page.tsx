'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStudents } from '@/lib/context/StudentContext'
import HomeHeader from '@/components/home/HomeHeader'
import StatsBar from '@/components/dashboard/StatsBar'
import AttendanceChart from '@/components/dashboard/AttendanceChart'
import LogsTimeline from '@/components/dashboard/LogsTimeline'
import SearchBar from '@/components/home/SearchBar'
import StudentList from '@/components/home/StudentList'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    <Link href="/bandeja" className="block mb-6 active-scale">
      <Card variant="glass" className="p-5 border-indigo-500/20 hover:border-indigo-500/40 transition-all shadow-lg shadow-indigo-500/5">
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
              <Badge variant="success" className="w-6 h-6 flex items-center justify-center p-0 rounded-full text-[10px]">
                {count.listos}
              </Badge>
            )}
            {count.generando > 0 && (
              <Badge variant="warning" className="w-6 h-6 flex items-center justify-center p-0 rounded-full text-[10px] animate-pulse">
                {count.generando}
              </Badge>
            )}
            <span className="text-slate-400 text-lg ml-1">→</span>
          </div>
        </div>
      </Card>
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

      <div className="mb-6">
        <StatsBar />
      </div>

      <div className="mb-6">
        <AttendanceChart />
      </div>

      <div className="mb-8">
        <LogsTimeline />
      </div>

      <BandejaPreview />

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <StudentList 
        students={filteredStudents} 
        isFiltered={searchTerm.length > 0} 
      />
    </div>
  )
}
