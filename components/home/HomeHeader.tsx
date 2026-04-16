'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

interface HomeHeaderProps {
  studentCount: number
}

export default function HomeHeader({ studentCount }: HomeHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="mb-8 pt-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mis Alumnos</h1>
          <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-black text-indigo-500 tracking-wider">V3.3.0</span>
        </div>
        <div className="flex gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-indigo-500/20 border border-slate-300 dark:border-indigo-500/30 flex items-center justify-center text-slate-600 dark:text-indigo-300 text-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
          <Link id="tour-profile-btn" href="/perfil" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-indigo-500/20 border border-slate-300 dark:border-indigo-500/30 flex items-center justify-center text-slate-600 dark:text-indigo-300 text-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer">
            👤
          </Link>
        </div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {studentCount} alumnos activos en seguimiento
      </p>
    </header>
  )
}
