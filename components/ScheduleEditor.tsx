'use client'
import { useState } from 'react'
import { MATERIAS_SUGERIDAS, DIAS_SEMANA } from '@/lib/constants'
import { type Horario } from '@/lib/mock'

interface Props {
  onChange: (schedules: Horario[]) => void
}

export default function ScheduleEditor({ onChange }: Props) {
  const [blocks, setBlocks] = useState<Horario[]>([])
  const [editingDay, setEditingDay] = useState(DIAS_SEMANA[0])
  
  // Local state for the current block being added
  const [materia, setMateria] = useState('')
  const [customMateria, setCustomMateria] = useState('')
  const [docente, setDocente] = useState('')
  const [inicio, setInicio] = useState('08:00')
  const [fin, setFin] = useState('09:00')

  function addBlock() {
    const finalMateria = materia === 'Otra...' ? customMateria : materia
    if (!finalMateria || !docente) return

    const newBlock: Horario = {
      dia: editingDay,
      hora_inicio: inicio,
      hora_fin: fin,
      materia: finalMateria,
      docente
    }

    const updated = [...blocks, newBlock]
    setBlocks(updated)
    onChange(updated)
    
    // Reset
    setMateria('')
    setCustomMateria('')
    setDocente('')
  }

  function removeBlock(index: number) {
    const updated = blocks.filter((_, i) => i !== index)
    setBlocks(updated)
    onChange(updated)
  }

  const currentDayBlocks = blocks.filter(b => b.dia === editingDay)

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex bg-white dark:bg-slate-800/50 p-1 rounded-2xl overflow-x-auto no-scrollbar border border-slate-200 dark:border-white/5">
        {DIAS_SEMANA.map(dia => (
          <button
            key={dia}
            type="button"
            onClick={() => setEditingDay(dia)}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              editingDay === dia ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Existing Blocks for current day */}
      <div className="space-y-2">
        {currentDayBlocks.length === 0 && (
          <p className="text-center py-4 text-slate-500 text-xs italic">No hay materias cargadas para el {editingDay}</p>
        )}
        {currentDayBlocks.map((block, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800/60 rounded-xl p-3 flex items-center justify-between border-l-4 border-l-indigo-500 shadow-sm dark:shadow-none border-y border-r border-slate-200 dark:border-white/5">
            <div className="min-w-0">
              <p className="text-slate-900 dark:text-white text-sm font-bold truncate">{block.materia}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                {block.hora_inicio} - {block.hora_fin} · {block.docente}
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => removeBlock(blocks.indexOf(block))}
              className="text-red-400 p-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add New Block Form */}
      <div className="bg-white dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 space-y-4 shadow-sm dark:shadow-none">
        <p className="text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Agregar Materia - {editingDay}</p>
        
        <div className="grid grid-cols-1 gap-3">
          <select
            value={materia}
            onChange={e => setMateria(e.target.value)}
            className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
          >
            <option value="">Seleccionar Materia...</option>
            {MATERIAS_SUGERIDAS.map(m => <option key={m} value={m}>{m}</option>)}
            <option value="Otra...">Otra...</option>
          </select>

          {materia === 'Otra...' && (
            <input
              type="text"
              placeholder="¿Cuál materia?"
              value={customMateria}
              onChange={e => setCustomMateria(e.target.value)}
              className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          )}

          <input
            type="text"
            placeholder="Nombre del Docente"
            value={docente}
            onChange={e => setDocente(e.target.value)}
            className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

            <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Inicio</label>
              <input
                type="time"
                value={inicio}
                onChange={e => setInicio(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Fin</label>
              <input
                type="time"
                value={fin}
                onChange={e => setFin(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={addBlock}
          disabled={(!materia && !customMateria) || !docente}
          className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl py-3 font-bold text-sm transition-all shadow-lg active-scale disabled:opacity-40"
        >
          + Agregar al {editingDay}
        </button>
      </div>
    </div>
  )
}
