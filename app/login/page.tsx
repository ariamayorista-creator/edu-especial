'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('Error al iniciar sesión', {
          description: error.message === 'Invalid login credentials' 
            ? 'Credenciales inválidas. Verifica el mail y la clave.' 
            : error.message
        })
      } else if (data.user) {
        toast.success(`¡Bienvenido/a, ${data.user.user_metadata?.full_name || 'docente'}!`)
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      toast.error('Ocurrió un error inesperado.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center items-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent">
      
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="inline-block p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-600/20 mb-4 animate-bounce-subtle">
             <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Edu-Especial</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Plataforma de Gestión Pedagógica Inteligente</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email de acceso</label>
                <input
                  type="email"
                  placeholder="ejemplo@edu.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              {isLoading ? 'Iniciando...' : 'Entrar al Panel'}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-3">Accesos de Prueba (Demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <div 
                className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
                onClick={() => { setEmail('ana@edu.com'); setPassword('ana123456'); }}
              >
                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">DOCENTE ANA</p>
                <p className="text-[9px] text-slate-500">Primaria / Lucas</p>
              </div>
              <div 
                className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
                onClick={() => { setEmail('carlos@edu.com'); setPassword('carlos123456'); }}
              >
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">DOCENTE CARLOS</p>
                <p className="text-[9px] text-slate-500">Secundaria / Mateo</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs">
          © 2026 Edu-Especial v4.4.0 · Diseñado para la Inclusión
        </p>
      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
