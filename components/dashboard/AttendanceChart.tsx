'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface WeeklyData {
  semana: string
  lucas: number
  mateo: number
}

export default function AttendanceChart() {
  const [data, setData] = useState<WeeklyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // Query agrupado por semana (asumiendo que los alumnos Lucas y Mateo existen para este docente)
        const { data: attendanceData, error } = await supabase
          .rpc('get_weekly_attendance', { teacher_id: session.user.id })

        if (error) {
          // Fallback manual si el RPC no existe aún
          const { data: rawData } = await supabase
            .from('asistencia')
            .select('fecha, estado, alumno_id, alumnos(nombre)')
            .eq('user_id', session.user.id)
            .gte('fecha', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          
          if (rawData) {
            // Procesamiento simple para el gráfico
            const weeks: Record<string, any> = {}
            rawData.forEach((reg: any) => {
              const date = new Date(reg.fecha)
              const weekNum = `Sem ${Math.ceil(date.getDate() / 7)}`
              if (!weeks[weekNum]) weeks[weekNum] = { semana: weekNum, lucas: 0, mateo: 0, countL: 0, countM: 0 }
              
              if (reg.alumnos?.nombre === 'Lucas') {
                weeks[weekNum].countL++
                if (reg.estado === 'presente') weeks[weekNum].lucas++
              } else if (reg.alumnos?.nombre === 'Mateo') {
                weeks[weekNum].countM++
                if (reg.estado === 'presente') weeks[weekNum].mateo++
              }
            })

            const processed = Object.values(weeks).map((w: any) => ({
              semana: w.semana,
              lucas: w.countL > 0 ? Math.round((w.lucas / w.countL) * 100) : 0,
              mateo: w.countM > 0 ? Math.round((w.mateo / w.countM) * 100) : 0
            })).slice(-4)

            setData(processed)
          }
        } else {
          setData(attendanceData)
        }
      } catch (err) {
        console.error('Error fetching chart data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Skeleton className="h-[300px] w-full rounded-2xl" />

  if (data.length === 0) {
    return (
      <Card className="border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
        <p className="text-slate-400 text-sm font-medium">Sin registros suficientes este mes</p>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200/50 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-400">Asistencia Mensual (%)</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] flex items-end justify-around gap-2 px-6 pb-12 pt-4 relative">
        {/* Y-Axis Guidelines */}
        <div className="absolute inset-x-6 top-4 bottom-12 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map(v => (
            <div key={v} className="border-t border-slate-100 dark:border-slate-800 w-full relative">
              <span className="absolute -left-6 -top-2 text-[8px] font-bold text-slate-300">{v}%</span>
            </div>
          ))}
        </div>

        {/* Bars */}
        {data.map((week, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
            <div className="flex gap-1 w-full justify-center items-end h-[100%]">
              {/* Lucas Bar */}
              <div 
                className="w-3 rounded-t-full bg-gradient-to-t from-indigo-500 to-indigo-400 relative group/bar"
                style={{ height: `${week.lucas}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Lucas: {week.lucas}%
                </div>
              </div>
              {/* Mateo Bar */}
              <div 
                className="w-3 rounded-t-full bg-gradient-to-t from-emerald-500 to-emerald-400 relative group/bar"
                style={{ height: `${week.mateo}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                   Mateo: {week.mateo}%
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{week.semana}</span>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-3 left-6 flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[9px] font-bold text-slate-500">LUCAS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-bold text-slate-500">MATEO</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
