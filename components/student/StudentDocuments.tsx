'use client'
import { useState, useRef } from 'react'
import { type Documento } from '@/lib/mock'

interface StudentDocumentsProps {
  documentos?: Documento[]
  onUpload: (file: File) => Promise<void>
  uploading: boolean
}

export default function StudentDocuments({ documentos, onUpload, uploading }: StudentDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUpload(file)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <section className="mb-6" id="archivos">
      <div className="flex items-center justify-between px-1 mb-3">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Documentos Importantes</p>
        <input 
           type="file" 
           ref={fileInputRef} 
           onChange={handleFileChange} 
           className="hidden" 
           accept=".pdf,.doc,.docx"
        />
        <button 
           onClick={() => fileInputRef.current?.click()}
           disabled={uploading}
           className="text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-1 disabled:opacity-50">
          {uploading ? '⌛ Subiendo...' : '+ Subir Archivo'}
        </button>
      </div>
      
      <div className="space-y-2">
        {documentos && documentos.length > 0 ? documentos.map(doc => (
          <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-between border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${doc.tipo === 'pdf' ? 'bg-red-500/10 dark:bg-red-500/20 text-red-500 dark:text-red-400' : 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400'}`}>
                {doc.tipo.toUpperCase()}
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-sm font-bold">{doc.nombre}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{doc.fecha}</p>
                  {doc.geminiFileUri && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">En Gemini AI</span>}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No hay documentos subidos</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Sube PDFs para que la IA los analice al crear informes.</p>
          </div>
        )}
      </div>
    </section>
  )
}
