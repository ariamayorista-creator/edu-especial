'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-8" id="tour-search">
      <div className="relative group">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
          <Search className="w-5 h-5" />
        </span>
        <Input 
          type="text" 
          placeholder="Buscar por nombre, apellido o colegio..." 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 py-7 rounded-3xl"
        />
      </div>
    </div>
  )
}
