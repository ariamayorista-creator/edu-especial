'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function TestChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
    setError(null)

    try {
      const res = await fetch('/api/test-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(errorData.error || `Error del servidor: ${res.status}`)
      }

      // Read the streaming response
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No se pudo leer la respuesta del servidor')

      const decoder = new TextDecoder()
      const assistantId = (Date.now() + 1).toString()

      // Add empty assistant message
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
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">🧪 Chat de Prueba (Sin SDK)</h1>
        <p className="text-slate-500 text-sm mt-1">Conexión directa a Google Gemini. Sin intermediarios.</p>
      </div>

      <Card className="p-4 h-[400px] overflow-y-auto bg-slate-50 dark:bg-slate-900 flex flex-col gap-3" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Escribe algo para probar la conexión con la IA...
          </div>
        )}
        {messages.map(m => (
          <div
            key={m.id}
            className={`p-3 rounded-xl text-sm whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white ml-8 rounded-tr-none'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-8 rounded-tl-none'
            }`}
          >
            <span className="font-bold uppercase text-[9px] block mb-1 opacity-50">
              {m.role === 'user' ? 'Tú' : 'IA'}
            </span>
            {m.content || '...'}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="text-xs text-indigo-400 animate-pulse flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
            Pensando...
          </div>
        )}
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs border border-rose-200 dark:border-rose-800">
            <strong>Error:</strong> {error}
          </div>
        )}
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe algo sencillo..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Enviar
        </Button>
      </form>
    </div>
  )
}
