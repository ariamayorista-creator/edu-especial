import { getWhatsAppUrl } from '@/lib/mock'

interface Props {
  nombre: string
  rol?: string
  telefono?: string
}

export default function WhatsAppButton({ nombre, rol, telefono }: Props) {
  const content = (
    <div className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all active-scale ${
      telefono ? 'glass hover:bg-white/5 cursor-pointer' : 'bg-slate-800/50 opacity-50 cursor-default'
    }`}>
      <div>
        <p className="text-white text-base font-bold leading-tight">{nombre}</p>
        {rol && <p className="text-slate-400 text-xs font-medium mt-0.5 tracking-wide uppercase opacity-70">{rol}</p>}
      </div>
      {telefono ? (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-3 py-1.5 shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
          <span className="text-sm">💬</span>
        </div>
      ) : (
        <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-slate-900/50 rounded-xl border border-slate-800">Inactivo</span>
      )}
    </div>
  )

  if (!telefono) return content

  return (
    <a href={getWhatsAppUrl(telefono)} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  )
}
