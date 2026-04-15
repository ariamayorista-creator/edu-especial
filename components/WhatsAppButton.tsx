import { getWhatsAppUrl } from '@/lib/mock'

interface Props {
  nombre: string
  rol?: string
  telefono?: string
}

export default function WhatsAppButton({ nombre, rol, telefono }: Props) {
  const content = (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
      telefono ? 'bg-slate-700 active:bg-slate-600 cursor-pointer' : 'bg-slate-700 opacity-50 cursor-default'
    }`}>
      <div>
        <p className="text-white text-sm font-medium">{nombre}</p>
        {rol && <p className="text-slate-400 text-xs">{rol}</p>}
      </div>
      {telefono ? (
        <div className="flex items-center gap-1.5 bg-green-600 rounded-lg px-3 py-1.5">
          <span className="text-white text-xs font-semibold">WhatsApp</span>
          <span>💬</span>
        </div>
      ) : (
        <span className="text-slate-500 text-xs">Sin número</span>
      )}
    </div>
  )

  if (!telefono) return content

  return (
    <a href={getWhatsAppUrl(telefono)} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  )
}
