'use client'

import { useState, useRef } from 'react'
import { type Documento } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileUp, 
  FileText, 
  FileCode, 
  Zap,
  Info,
  ChevronRight,
  FileBox
} from 'lucide-react'

interface StudentDocumentsProps {
  documentos?: Documento[]
  onUpload: (file: File) => Promise<void>
  onToggleTemplate: (docId: string) => void
  uploading: boolean
}

export default function StudentDocuments({ documentos, onUpload, onToggleTemplate, uploading }: StudentDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUpload(file)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <section className="mb-8" id="archivos">
      <div className="flex items-center justify-between px-1 mb-4">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <FileBox className="w-3.5 h-3.5" />
          Documentos Importantes
        </p>
        <input 
           type="file" 
           ref={fileInputRef} 
           onChange={handleFileChange} 
           className="hidden" 
           accept=".pdf,.doc,.docx,.txt"
        />
        <Button 
           variant="secondary"
           size="sm"
           onClick={() => fileInputRef.current?.click()}
           disabled={uploading}
           className="h-8 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Subiendo...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FileUp className="w-3.5 h-3.5" /> Subir Archivo
            </span>
          )}
        </Button>
      </div>
      
      <div className="space-y-3">
        {documentos && documentos.length > 0 ? (
          documentos.map(doc => (
            <Card key={doc.id} className="group hover:border-indigo-500/30 transition-all border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-800/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-transform group-hover:scale-105 shadow-sm ${
                    doc.tipo === 'pdf' 
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                      : doc.tipo === 'txt'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                  }`}>
                    {doc.tipo.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-black truncate max-w-[180px] sm:max-w-xs">{doc.nombre}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-slate-500 dark:text-slate-500 text-[10px] font-medium">{doc.fecha}</p>
                      {doc.geminiFileUri && (
                        <Badge variant="success" className="h-5 px-2 text-[8px] font-black uppercase tracking-[0.1em] gap-1">
                          <Zap className="w-2.5 h-2.5 fill-current" /> En Gemini AI
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`h-8 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                      doc.esPlantilla 
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-amber-500'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTemplate(doc.id);
                    }}
                  >
                    {doc.esPlantilla ? 'Estructura Activa' : 'Usar como Estructura'}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-10 bg-slate-50/50 dark:bg-slate-900/40 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:scale-110 transition-transform">
               <Info className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-black">No hay documentos subidos</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 max-w-[200px] mx-auto leading-relaxed">
              Sube informes previos para que la IA los analice al generar planes.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
