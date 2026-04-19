'use client'

import { getWhatsAppUrl } from '@/lib/mock'
import { Card } from '@/components/ui/card'
import { MessageCircle, ShieldX } from 'lucide-react'

interface Props {
  nombre: string
  rol?: string
  telefono?: string
}

export default function WhatsAppButton({ nombre, rol, telefono }: Props) {
  const content = (
    <Card variant="glass" className={`flex items-center justify-between p-4 px-5 transition-all group ${
      telefono ? 'hover:bg-emerald-500/5 hover:border-emerald-500/30 cursor-pointer active:scale-95' : 'opacity-50 grayscale cursor-not-allowed'
    }`}>
      <div className="flex-1 min-w-0">
        <p className="text-slate-900 dark:text-white text-[15px] font-black leading-tight truncate">{nombre}</p>
        {rol && <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black mt-1 tracking-widest uppercase">{rol}</p>}
      </div>
      {telefono ? (
        <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl px-3 py-1.5 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Chat</span>
          <MessageCircle className="w-4 h-4" />
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-white/5">
           <span className="text-[10px] font-black uppercase tracking-widest">Inactivo</span>
           <ShieldX className="w-3.5 h-3.5" />
        </div>
      )}
    </Card>
  )

  if (!telefono) return content

  return (
    <a href={getWhatsAppUrl(telefono)} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
      {content}
    </a>
  )
}
