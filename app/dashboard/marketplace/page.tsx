'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'

const RECURSOS = [
  { id: 1, title: "Secuencia didáctica TEA: Matemática con material concreto", tag: "NEE", level: "1° a 3° grado", price: 7000, desc: "Adaptaciones específicas para estudiantes con desafíos en el procesamiento abstracto." },
  { id: 2, title: "Pictogramas ARASAAC: set completo para el aula", tag: "NEE", level: "Todos los niveles", price: 6500, desc: "Set de 500 pictogramas organizados por rutinas, materias y emociones." },
  { id: 3, title: "Cuento El mundo de Tomás: autismo explicado a niños", tag: "Cuento", level: "Jardín a 2° grado", price: 5000, desc: "Recurso visual para trabajar la sensibilización en el grupo de pares." },
  { id: 4, title: "Guía docente: adaptaciones para baja visión en secundaria", tag: "NEE", level: "Secundaria", price: 8500, desc: "Manual práctico para realizar configuraciones de apoyo y accesibilidad." },
  { id: 5, title: "Fichas de Lengua con lectura fácil Nivel 1", tag: "Lengua", level: "1° y 2° grado", price: 5500, desc: "Textos adaptados bajo normas de lectura fácil y tipografía legible." },
  { id: 6, title: "Historia Argentina: línea de tiempo visual e interactiva", tag: "Historia", level: "4° a 6° grado", price: 7500, desc: "Secuencias históricas con fuerte soporte de imagen y síntesis conceptual." },
  { id: 7, title: "Matemática: fracciones con soporte visual y manipulable", tag: "Matemática", level: "4° y 5° grado", price: 7000, desc: "Kits descargables para armar y comprender las partes del entero." },
  { id: 8, title: "Agenda visual semanal: plantillas editables para docentes", tag: "NEE", level: "Todos los niveles", price: 4500, desc: "Organizadores visuales que reducen la ansiedad ante el cambio de rutinas." },
  { id: 9, title: "Biología: el cuerpo humano en formato accesible", tag: "Ciencias", level: "2° a 4° grado", price: 6500, desc: "Diagramas de alto contraste y etiquetas claras para facilitar la identificación." },
  { id: 10, title: "Evaluaciones orales: guía de rúbricas para EOE", tag: "NEE", level: "Secundaria", price: 9000, desc: "Modelos de evaluación y criterios de calificación para diversificar el aula." }
]

const FILTERS = ['Todos', 'NEE', 'Cuento', 'Ciencias', 'Matemática', 'Lengua', 'Historia']

export default function MarketplacePage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [isSearchingIA, setIsSearchingIA] = useState(false)
  const [iaResults, setIaResults] = useState<number[] | null>(null)

  const handleSelect = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      // FIFO Logic: Max 2
      if (prev.length >= 2) {
        return [prev[1], id]
      }
      return [...prev, id]
    })
  }

  const handleAISearch = async () => {
    if (!search.trim()) return
    setIsSearchingIA(true)
    try {
      const res = await fetch('/api/marketplace/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: search, catalog: RECURSOS })
      })
      const data = await res.json()
      if (data.ids) {
        setIaResults(data.ids)
        toast.success('Búsqueda potenciada por IA completada ✨')
      }
    } catch (err) {
      toast.error('Error en búsqueda IA, usando búsqueda local')
      setIaResults(null)
    } finally {
      setIsSearchingIA(false)
    }
  }

  const filteredResources = useMemo(() => {
    let result = RECURSOS
    
    // IA Results take precedence
    if (iaResults) {
      result = result.filter(r => iaResults.includes(r.id))
    } else {
      // Local Filter
      if (filter !== 'Todos') {
        result = result.filter(r => r.tag === filter)
      }
      // Search
      if (search) {
        const term = search.toLowerCase()
        result = result.filter(r => 
          r.title.toLowerCase().includes(term) || 
          r.desc.toLowerCase().includes(term)
        )
      }
    }
    return result
  }, [search, filter, iaResults])

  const totalOriginal = selectedIds.reduce((sum, id) => {
    const r = RECURSOS.find(it => it.id === id)
    return sum + (r?.price || 0)
  }, 0)

  return (
    <div className="p-6 pb-32 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          Marketplace <Badge className="bg-indigo-500/10 text-indigo-500 border-none shadow-none">PRO</Badge>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Recursos pedagógicos adaptados para una educación inclusiva</p>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        <div className="lg:col-span-2 relative group">
          <Input 
            placeholder="Buscar por tema, diagnóstico o andamiaje..." 
            className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={e => { setSearch(e.target.value); setIaResults(null); }}
            onKeyDown={e => e.key === 'Enter' && handleAISearch()}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <Button 
            onClick={handleAISearch}
            disabled={isSearchingIA}
            size="sm" 
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-10 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            {isSearchingIA ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            IA
          </Button>
        </div>

        <div className="lg:col-span-2 flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'glass'}
              size="sm"
              onClick={() => { setFilter(f); setIaResults(null); }}
              className={`rounded-full px-4 h-10 font-bold transition-all ${filter === f ? 'bg-indigo-500 text-white shadow-lg' : ''}`}
            >
               {f}
            </Button>
          ))}
        </div>
      </div>

      {/* RESOURCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => {
          const isSelected = selectedIds.includes(res.id)
          return (
            <Card 
              key={res.id} 
              onClick={() => handleSelect(res.id)}
              className={`group cursor-pointer border-none ring-1 transition-all h-full flex flex-col ${
                isSelected 
                  ? 'ring-indigo-500 bg-indigo-500/5 shadow-2xl shadow-indigo-500/10' 
                  : 'ring-slate-200 dark:ring-white/5 bg-white dark:bg-slate-900 hover:ring-indigo-300 dark:hover:ring-indigo-500/40'
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black tracking-widest text-[10px] uppercase">
                    {res.tag}
                  </Badge>
                  <span className="text-lg font-black text-indigo-500">${res.price.toLocaleString()}</span>
                </div>
                <CardTitle className="text-xl font-bold leading-tight group-hover:text-indigo-500 transition-colors">
                  {res.title}
                </CardTitle>
                <CardDescription className="text-xs font-semibold uppercase tracking-widest mt-1 opacity-60">
                  {res.level}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {res.desc}
                </p>
                <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-500' : 'text-slate-200'}`} />
                      {isSelected ? 'Seleccionado' : 'Disponible'}
                   </div>
                   <ArrowRight className={`w-5 h-5 transition-all ${isSelected ? 'text-indigo-500 translate-x-1' : 'text-slate-200 group-hover:translate-x-1'}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* PROMO BANNER */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 flex justify-center z-[60] pointer-events-none transition-all duration-500 ${selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
         <div className="glass max-w-2xl w-full p-6 rounded-[2.5rem] border border-white/20 shadow-2xl flex items-center justify-between gap-6 pointer-events-auto bg-indigo-500/90 backdrop-blur-2xl ring-4 ring-indigo-500/20">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl rotate-3">
                  <ShoppingBag className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {selectedIds.length === 2 ? '🔥 Pack Desbloqueado' : 'Falta 1 para el Pack'}
                  </p>
                  <h3 className="text-white text-2xl font-black flex items-center gap-2">
                    {selectedIds.length === 2 ? '$10.000' : `$${totalOriginal.toLocaleString()}`}
                    {selectedIds.length === 2 && (
                       <span className="text-indigo-200 text-sm line-through opacity-60 ml-2">
                         ${totalOriginal.toLocaleString()}
                       </span>
                    )}
                  </h3>
               </div>
            </div>
            
            <div className="flex flex-col gap-2">
               <Button 
                disabled={selectedIds.length !== 2}
                className={`px-8 h-14 rounded-2xl font-black text-sm transition-all ${
                  selectedIds.length === 2 
                    ? 'bg-white text-indigo-600 hover:bg-slate-50 shadow-xl shadow-white/20 hover:scale-105' 
                    : 'bg-white/10 text-white/50 border border-white/10'
                }`}
                onClick={() => toast.success('¡Redirigiendo al checkout! 🎉')}
               >
                 COMPRAR PACK
               </Button>
               {selectedIds.length < 2 && (
                  <p className="text-[9px] font-medium text-indigo-100/60 text-center uppercase tracking-widest">
                    Selecciona 2 recursos
                  </p>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
