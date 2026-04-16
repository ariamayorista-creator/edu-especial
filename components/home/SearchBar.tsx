'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-8" id="tour-search">
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500">
          🔍
        </span>
        <input 
          type="text" 
          placeholder="Buscar por nombre, apellido o colegio..." 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  )
}
