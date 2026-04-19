'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Moon, Sun, User } from 'lucide-react'

interface HomeHeaderProps {
  studentCount: number
}

export default function HomeHeader({ studentCount }: HomeHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="mb-8 pt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mis Alumnos</h1>
            <Badge variant="version" className="h-5 px-2">V4.4.0</Badge>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            {studentCount} alumnos activos en seguimiento
          </p>
        </div>
        <div className="flex gap-2">
          {mounted && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full w-11 h-11 shadow-sm border border-slate-200 dark:border-white/10"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </Button>
          )}
          <Button
            asChild
            variant="secondary"
            size="icon"
            className="rounded-full w-11 h-11 shadow-sm border border-slate-200 dark:border-white/10"
          >
            <Link id="tour-profile-btn" href="/perfil">
              <User className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
