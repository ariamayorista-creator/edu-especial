'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Calendar, ClipboardCheck, MessageSquare } from 'lucide-react'

export default function StatsBar() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const userId = session.user.id
        const now = new Date()
        const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        // 1. Asistencia del Mes
        const { data: attendance } = await supabase
          .from('asistencia')
          .select('estado')
          .eq('user_id', userId)
          .gte('fecha', firstDayMonth)
        
        const totalAsis = attendance?.length || 0
        const presentes = attendance?.filter(a => a.estado === 'presente').length || 0
        const attendanceRate = totalAsis > 0 ? Math.round((presentes / totalAsis) * 100) : 100

        // 2. Acuerdos Activos
        const { count: agreementsCount } = await supabase
          .from('acuerdos')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)

        // 3. Clases esta semana (simplificado: horarios totales vs días registrados)
        const { count: schedulesCount } = await supabase
          .from('horarios')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
        
        // 4. Último Log
        const { data: lastLogs } = await supabase
          .from('logs_diarios')
          .select('fecha')
          .eq('user_id', userId)
          .order('fecha', { ascending: false })
          .limit(1)
        
        const lastLogDate = lastLogs?.[0]?.fecha ? new Date(lastLogs[0].fecha).toLocaleDateString() : 'N/A'

        setStats({
          attendance: `${attendanceRate}%`,
          schedules: schedulesCount || 0,
          agreements: agreementsCount || 0,
          lastUpdate: lastLogDate
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    )
  }

  const items = [
    { label: 'Asistencia Mes', value: stats.attendance, icon: ClipboardCheck, color: 'text-emerald-500' },
    { label: 'Clases Semanales', value: `${stats.schedules}`, icon: Calendar, color: 'text-indigo-500' },
    { label: 'Acuerdos Activos', value: stats.agreements, icon: Users, color: 'text-amber-500' },
    { label: 'Última Obs.', value: stats.lastUpdate, icon: MessageSquare, color: 'text-rose-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <Card key={idx} className="border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden group hover:ring-2 hover:ring-indigo-500/20 transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{item.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
