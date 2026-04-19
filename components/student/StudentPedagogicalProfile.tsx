'use client'

import { type PerfilPedagogico } from '@/lib/mock'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  BrainCircuit, 
  BookOpen, 
  Calculator, 
  Construction, 
  Star,
  Sparkles
} from 'lucide-react'

interface PedagogicalProfileProps {
  perfil: PerfilPedagogico
}

export default function StudentPedagogicalProfile({ perfil }: PedagogicalProfileProps) {
  return (
    <section className="mb-8 space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <BrainCircuit className="w-3.5 h-3.5" />
          Perfil Pedagógico
        </p>
      </div>
      
      <Card variant="glass" className="overflow-hidden border-slate-200/50 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-500">
               <Sparkles className="w-4 h-4" />
               <p className="text-[10px] font-black uppercase tracking-widest leading-none">Cómo Aprende</p>
            </div>
            <p className="text-slate-700 dark:text-slate-200 text-[13px] leading-relaxed font-medium">
              {perfil.como_aprende}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <BookOpen className="w-3.5 h-3.5" />
                <p className="text-[9px] font-black uppercase tracking-widest leading-none">Lectura/Escritura</p>
              </div>
              <p className="text-indigo-600 dark:text-indigo-300 text-xs font-black">{perfil.etapa_lectura}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Calculator className="w-3.5 h-3.5" />
                <p className="text-[9px] font-black uppercase tracking-widest leading-none">Matemática</p>
              </div>
              <p className="text-emerald-600 dark:text-emerald-300 text-xs font-black">{perfil.etapa_matematica}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                 <Construction className="w-4 h-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none">Andamiaje Necesario</p>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                {perfil.andamiajes}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-violet-500">
                 <Star className="w-4 h-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none">Habilidades e Intereses</p>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                {perfil.habilidades_intereses}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
