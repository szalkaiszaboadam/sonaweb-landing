'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import { ArrowRight, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin/dashboard')
    } catch {
      setError('Hibás e-mail cím vagy jelszó.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] px-6 font-inter text-white selection:bg-[#BF2234]">
      <div className="w-full max-w-[380px] flex flex-col items-center">
        
        <div className="mb-8 text-center">
          <h1 className="text-[26px] font-bold tracking-tight text-white">
            Bejelentkezés
          </h1>
          <p className="mt-1.5 text-[14px] text-zinc-400">
            Add meg a belépési adataidat
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              placeholder="E-mail cím"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-full bg-zinc-900 border border-zinc-800 py-3.5 pl-11 pr-5 text-[14px] text-white placeholder:text-zinc-500 focus:border-white focus:bg-zinc-800/80 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-full bg-zinc-900 border border-zinc-800 py-3.5 pl-11 pr-5 text-[14px] text-white placeholder:text-zinc-500 focus:border-white focus:bg-zinc-800/80 focus:outline-none transition-all"
            />
          </div>

          {error && (
            <div className="rounded-full bg-[#BF2234]/15 border border-[#BF2234]/30 px-4 py-2 text-center text-[13px] font-medium text-[#f87171]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-[14px] font-semibold text-[#0a0a0a] transition-all hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-40 cursor-pointer shadow-lg shadow-white/5"
          >
            {loading ? (
              'Hitelesítés...'
            ) : (
              <>
                Belépés
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}
