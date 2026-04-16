'use client'
import { type PerfilPedagogico } from '@/lib/mock'

interface PedagogicalProfileProps {
  perfil: PerfilPedagogico
}

export default function StudentPedagogicalProfile({ perfil }: PedagogicalProfileProps) {
  return (
    <section className="mb-6 space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Perfil Pedagógico</p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-white/5 space-y-4 shadow-sm dark:shadow-none">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">🧠 Cómo Aprende</p>
          <p className="text-slate-700 dark:text-white text-sm leading-relaxed">{perfil.como_aprende}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-0.5">📖 Lectura/Escritura</p>
            <p className="text-indigo-600 dark:text-indigo-300 text-xs font-bold">{perfil.etapa_lectura}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-0.5">🔢 Matemática</p>
            <p className="text-emerald-600 dark:text-emerald-300 text-xs font-bold">{perfil.etapa_matematica}</p>
          </div>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">🏗️ Andamiaje Necesario</p>
          <p className="text-slate-700 dark:text-white text-xs leading-relaxed">{perfil.andamiajes}</p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">⭐ Habilidades e Intereses</p>
          <p className="text-slate-700 dark:text-white text-xs leading-relaxed">{perfil.habilidades_intereses}</p>
        </div>
      </div>
    </section>
  )
}
