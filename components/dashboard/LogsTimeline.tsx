'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Filter } from 'lucide-react'
import QuickLogForm from './QuickLogForm'

interface LogEntry {
  id: string
  fecha: string
  observacion: string
  alumno_id: string
  alumnos: {
    nombre: string
  }
}

export default function LogsTimeline() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [limit, setLimit] = useState(20)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        let query = supabase
          .from('logs_diarios')
          .select('id, fecha, observacion, alumno_id, alumnos(nombre)')
          .eq('user_id', session.user.id)
          .order('fecha', { ascending: false })
          .limit(limit)

        if (filter !== 'todos') {
          query = query.filter('alumnos.nombre', 'eq', filter)
        }

        const { data: logsData } = await query
        setLogs(logsData || [])
      } catch (err) {
        console.error('Error fetching logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [filter, limit, refreshKey])

  if (loading) return <Skeleton className="h-[400px] w-full rounded-2xl" />

  const students = Array.from(new Set(logs.map(l => l.alumnos?.nombre).filter(Boolean)))

  return (
    <Card className="border-slate-200/50 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-800">
        <div>
          <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-400">Observaciones Recientes</CardTitle>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Crónica Pedagógica</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="hidden sm:flex gap-1">
            <button 
              onClick={() => setFilter('todos')}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all ${filter === 'todos' ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
            >
              Todos
            </button>
            {['Lucas', 'Mateo'].map(name => (
              <button 
                key={name}
                onClick={() => setFilter(name)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all ${filter === name ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
              >
                {name}
              </button>
            ))}
          </div>
          <QuickLogForm onRefresh={() => setRefreshKey(prev => prev + 1)} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-100 mx-auto mb-3" />
            <p className="text-slate-400 text-xs font-bold uppercase">Aún no hay observaciones registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {logs.map((log, idx) => (
              <div key={log.id} className="p-5 hover:bg-slate-50/50 transition-colors flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${log.alumnos?.nombre === 'Lucas' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                  <div className="flex-1 w-px bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(log.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </span>
                    <Badge variant="outline" className={`text-[9px] font-black uppercase ${log.alumnos?.nombre === 'Lucas' ? 'border-indigo-200 text-indigo-500' : 'border-emerald-200 text-emerald-500'}`}>
                      {log.alumnos?.nombre}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {log.observacion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {logs.length >= 20 && (
          <div className="p-4 border-t border-slate-50 dark:border-slate-800">
            <Button 
              variant="outline" 
              className="w-full h-9 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all border-slate-200"
              onClick={() => setLimit(prev => prev + 20)}
            >
              Cargar más registros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
