'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Sparkles, User } from 'lucide-react'
import { type Alumno } from '@/lib/mock'

interface AIChatProps {
  alumno: Alumno
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AIChat({ alumno }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `¡Hola! Soy tu asistente de Edu-Especial. Ya tengo el perfil pedagógico de ${alumno.nombre} cargado. ¿En qué puedo ayudarte hoy? Podemos redactar un informe, un PPI o pensar estrategias.`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          alumno: {
            nombre: alumno.nombre,
            apellido: alumno.apellido,
            diagnostico: alumno.diagnostico,
            perfil_pedagogico: alumno.perfil_pedagogico,
            documentos: alumno.documentos,
          },
          logs: alumno.logs,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(errData.error || `Error: ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No se pudo leer la respuesta')

      const decoder = new TextDecoder()
      const assistantId = (Date.now() + 1).toString()

      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId ? { ...m, content: m.content + text } : m
          )
        )
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 2).toString(), role: 'assistant', content: `❌ Error: ${err.message}` },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-8 overflow-hidden flex flex-col h-[600px] border-indigo-500/20 shadow-2xl bg-slate-900/50">
      <CardHeader className="bg-indigo-600/10 border-b border-indigo-500/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Asistente Pedagógico ✦</CardTitle>
            <CardDescription className="text-xs">Chat inteligente contextualizado en {alumno.nombre}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                m.role === 'user'
                  ? 'bg-slate-700'
                  : 'bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 rounded-tl-none'
              }`}>
                {m.content || '...'}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-white/5 flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-black/20">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              placeholder={`Preguntame sobre ${alumno.nombre}...`}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-900 border-indigo-500/10 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="rounded-xl shadow-indigo-500/20"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-[10px] text-slate-500 text-center mt-2 font-medium">
            La IA puede cometer errores. Verificá siempre la información pedagógica.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
