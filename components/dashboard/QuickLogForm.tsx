'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Loader2 } from 'lucide-react'

interface Student {
  id: string
  nombre: string
}

export default function QuickLogForm({ onRefresh }: { onRefresh?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    alumno_id: '',
    tipo: 'general',
    observacion: '',
    fecha: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    async function fetchStudents() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      
      const { data } = await supabase
        .from('alumnos')
        .select('id, nombre')
        .eq('user_id', session.user.id)
      
      setStudents(data || [])
    }
    if (open) fetchStudents()
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.alumno_id || !formData.observacion) {
      toast.error('Completa todos los campos')
      return
    }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      // Para mantener compatibilidad con el esquema, incluimos el tipo en la observación si no hay columna específica
      // O simplemente insertamos la observación limpia si solo queremos la descripción
      const fullObservation = `[${formData.tipo.toUpperCase()}] ${formData.observacion}`

      const { error } = await supabase
        .from('logs_diarios')
        .insert({
          alumno_id: formData.alumno_id,
          user_id: session.user.id,
          fecha: formData.fecha,
          observacion: fullObservation
        })

      if (error) throw error

      toast.success('Observación registrada correctamente')
      setOpen(false)
      setFormData({ ...formData, observacion: '' })
      if (onRefresh) onRefresh()
    } catch (err: any) {
      toast.error('Error al guardar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-indigo-500/20 active-scale">
          <Plus className="w-3.5 h-3.5" />
          Nuevo Registro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-0 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
             Registro Diario
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Alumno</label>
            <Select onValueChange={(v) => setFormData({...formData, alumno_id: v})}>
              <SelectTrigger className="bg-slate-50 border-0 h-12 rounded-xl focus:ring-2 focus:ring-indigo-500/20">
                <SelectValue placeholder="Seleccionar alumno..." />
              </SelectTrigger>
              <SelectContent>
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipo</label>
              <Select defaultValue="general" onValueChange={(v) => setFormData({...formData, tipo: v})}>
                <SelectTrigger className="bg-slate-50 border-0 h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="logro">Logro</SelectItem>
                  <SelectItem value="dificultad">Dificultad</SelectItem>
                  <SelectItem value="adaptacion">Adaptación</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha</label>
              <input 
                type="date" 
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                className="w-full h-12 bg-slate-50 border-0 rounded-xl px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Observación</label>
            <Textarea 
              placeholder="¿Qué sucedió hoy?" 
              className="bg-slate-50 border-0 rounded-2xl min-h-[120px] focus:ring-2 focus:ring-indigo-500/20"
              maxLength={500}
              value={formData.observacion}
              onChange={(e) => setFormData({...formData, observacion: e.target.value})}
            />
            <p className="text-right text-[9px] font-black text-slate-300 uppercase tracking-tighter">
              {formData.observacion.length} / 500
            </p>
          </div>

          <Button 
            disabled={loading}
            type="submit" 
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/30 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Observación'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
