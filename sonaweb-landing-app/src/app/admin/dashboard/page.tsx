'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import {
  Search,
  RefreshCw,
  X,
  LogOut,
  Inbox,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  MessageSquare,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'

type ServiceItem = {
  category: string
  items: string[]
}

type Lead = {
  id: string
  type: 'project' | 'message' | 'team' | string
  name: string
  email: string
  phone?: string
  message?: string
  services?: ServiceItem[]
  timeline?: string
  budget?: string
  status: 'ÚJ' | 'FOLYAMATBAN' | 'LEZÁRT' | string
  createdAt: string
}

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Szűrők
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'project' | 'message' | 'team'>('all')
  const [statusFilter, setStatusFilter] = useState<'Összes' | 'ÚJ' | 'FOLYAMATBAN' | 'LEZÁRT'>('Összes')
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login')
      } else {
        setCurrentUser(user)
        fetchLeads()
      }
    })
    return () => unsubscribe()
  }, [router])

  const fetchLeads = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/leads')
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    })

    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      )
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/admin/login')
  }

  // Megjelenítési segédfüggvények
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'team':
        return { label: 'Csapat', icon: Users, color: 'text-teal-400 bg-teal-400/10 border-teal-400/20' }
      case 'message':
        return { label: 'Üzenet', icon: MessageSquare, color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' }
      case 'project':
      default:
        return { label: 'Projekt', icon: Briefcase, color: 'text-sky-400 bg-sky-400/10 border-sky-400/20' }
    }
  }

  const getStatusConfig = (status: string) => {
    const s = status?.toUpperCase()
    if (s === 'ÚJ') return { label: 'Új', icon: AlertCircle, color: 'text-[#f87171] bg-[#BF2234]/15 border-[#BF2234]/30' }
    if (s === 'FOLYAMATBAN') return { label: 'Folyamatban', icon: Loader2, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' }
    return { label: 'Lezárt', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' }
  }

  // Szűrt lista
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'Összes' ? true : lead.status?.toUpperCase() === statusFilter
      const matchesType = typeFilter === 'all' ? true : lead.type === typeFilter
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        lead.name?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        (lead.phone && lead.phone.includes(query))

      return matchesStatus && matchesType && matchesSearch
    })
  }, [leads, statusFilter, typeFilter, searchQuery])

  // Globális statisztikák a kártyákhoz
  const metrics = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status?.toUpperCase() === 'ÚJ').length,
      inProgress: leads.filter((l) => l.status?.toUpperCase() === 'FOLYAMATBAN').length,
      closed: leads.filter((l) => l.status?.toUpperCase() === 'LEZÁRT').length,
    }
  }, [leads])

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] font-inter text-[14px] font-medium text-zinc-500 cursor-default">
        Rendszer inicializálása...
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0a] font-inter text-white selection:bg-[#BF2234] cursor-default">
      
      {/* 1. FEJLÉC */}
      <header className="flex h-16 shrink-0 items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-[#0a0a0a]">
        <h1 className="text-[18px] font-bold text-white tracking-tight">
          Megkeresések
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchLeads}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-40 cursor-pointer"
            title="Frissítés"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <span className="hidden text-[13px] text-zinc-500 sm:block font-medium">
            {currentUser?.email}
          </span>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/5 px-5 py-2 text-[13px] font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Kilépés</span>
          </button>
        </div>
      </header>

      {/* 2. STATISZTIKÁK & SZŰRŐK */}
      <div className="shrink-0 px-6 lg:px-10 pt-8 pb-4">
        <div className="mx-auto max-w-[1400px]">
          
          {/* Interaktív Statisztika Kártyák */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => setStatusFilter('Összes')}
              className={`rounded-2xl p-5 cursor-pointer transition-all border ${statusFilter === 'Összes' ? 'bg-white/[0.08] border-white/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}
            >
              <span className="text-[12px] font-semibold text-zinc-400">Összes</span>
              <p className="text-[32px] font-bold text-white mt-1 leading-none">{metrics.total}</p>
            </div>
            
            <div 
              onClick={() => setStatusFilter('ÚJ')}
              className={`rounded-2xl p-5 cursor-pointer transition-all border ${statusFilter === 'ÚJ' ? 'bg-[#BF2234]/15 border-[#BF2234]/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}
            >
              <span className="text-[12px] font-semibold text-[#f87171] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#BF2234]" /> Új megkeresés
              </span>
              <p className="text-[32px] font-bold text-white mt-1 leading-none">{metrics.new}</p>
            </div>

            <div 
              onClick={() => setStatusFilter('FOLYAMATBAN')}
              className={`rounded-2xl p-5 cursor-pointer transition-all border ${statusFilter === 'FOLYAMATBAN' ? 'bg-amber-500/15 border-amber-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}
            >
              <span className="text-[12px] font-semibold text-amber-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Folyamatban
              </span>
              <p className="text-[32px] font-bold text-white mt-1 leading-none">{metrics.inProgress}</p>
            </div>

            <div 
              onClick={() => setStatusFilter('LEZÁRT')}
              className={`rounded-2xl p-5 cursor-pointer transition-all border ${statusFilter === 'LEZÁRT' ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}
            >
              <span className="text-[12px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Lezárt
              </span>
              <p className="text-[32px] font-bold text-white mt-1 leading-none">{metrics.closed}</p>
            </div>
          </div>

          {/* Szűrősáv (Típusok és Kereső) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {[
                { id: 'all', label: 'Minden típus' },
                { id: 'project', label: 'Projektek' },
                { id: 'message', label: 'Üzenetek' },
                { id: 'team', label: 'Csapat' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id as typeof typeFilter)}
                  className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all shrink-0 cursor-pointer ${
                    typeFilter === t.id
                      ? 'bg-white text-[#0a0a0a]'
                      : 'bg-white/[0.04] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Keresés..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-white/[0.04] border border-white/5 py-2.5 pl-11 pr-5 text-[13px] text-white placeholder:text-zinc-500 focus:border-white/30 focus:bg-white/[0.08] focus:outline-none transition-all cursor-text"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 3. TISZTA LISTA NÉZET */}
      <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
            {filteredLeads.length > 0 ? (
              <div className="divide-y divide-white/5">
                {filteredLeads.map((lead) => {
                  const dateStr = lead.createdAt
                    ? new Date(lead.createdAt).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '—'
                    
                  const tConfig = getTypeConfig(lead.type)
                  const TypeIcon = tConfig.icon
                  const sConfig = getStatusConfig(lead.status)

                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/[0.04] transition-colors cursor-pointer gap-4"
                    >
                      {/* Ügyfél & Típus */}
                      <div className="flex items-center gap-4 min-w-[300px]">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-white font-bold text-[15px]">
                          {lead.name ? lead.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 mb-0.5">
                            <span className="text-[15px] font-semibold text-white">
                              {lead.name}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border flex items-center gap-1 uppercase tracking-wide ${tConfig.color}`}>
                              <TypeIcon className="h-3 w-3" />
                              {tConfig.label}
                            </span>
                          </div>
                          <span className="text-[13px] text-zinc-400 block">
                            {lead.email}
                          </span>
                        </div>
                      </div>

                      {/* Letisztult jobboldal: Csak Dátum és Státusz */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                        <span className="text-zinc-500 font-medium text-[13px]">{dateStr}</span>
                        
                        <span className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold border flex items-center gap-1.5 min-w-[105px] justify-center uppercase tracking-wide ${sConfig.color}`}>
                          {sConfig.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <Inbox className="h-12 w-12 text-zinc-700 mb-4" />
                <h3 className="text-[16px] font-semibold text-white">Nincs megjeleníthető találat</h3>
                <p className="mt-1.5 text-[14px] text-zinc-500">
                  A jelenlegi szűrési feltételeknek egyetlen megkeresés sem felel meg.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. TELJES OLDALAS RÉSZLETEZŐ MODAL */}
      {selectedLead && (
        <div 
          onClick={() => setSelectedLead(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8 cursor-default"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden"
          >
            
            {/* Modal Fejléc */}
            <div className="flex items-start justify-between border-b border-white/10 pb-6 shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const tConfig = getTypeConfig(selectedLead.type)
                    const Icon = tConfig.icon
                    return (
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold border flex items-center gap-1.5 uppercase tracking-wide ${tConfig.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {tConfig.label}
                      </span>
                    )
                  })()}
                  <span className="text-[13px] text-zinc-500 font-mono">ID: {selectedLead.id}</span>
                </div>
                <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight leading-tight">
                  {selectedLead.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Belső (Görgethető) */}
            <div className="flex-1 overflow-y-auto py-8 pr-1 flex flex-col gap-8 custom-scrollbar">
              
              {/* Vezérlősáv */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div>
                  <span className="text-[12px] font-semibold text-zinc-500 block mb-2.5 uppercase tracking-wide">
                    Státusz beállítása
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Új', val: 'ÚJ', active: 'bg-[#BF2234] text-white border-[#BF2234]' },
                      { label: 'Folyamatban', val: 'FOLYAMATBAN', active: 'bg-amber-400 text-[#0a0a0a] border-amber-400' },
                      { label: 'Lezárt', val: 'LEZÁRT', active: 'bg-emerald-500 text-white border-emerald-500' },
                    ].map((s) => {
                      const isSelected = selectedLead.status?.toUpperCase() === s.val
                      return (
                        <button
                          key={s.val}
                          onClick={() => updateStatus(selectedLead.id, s.val)}
                          className={`rounded-full px-5 py-2 text-[12px] font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? s.active
                              : 'bg-transparent border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                          }`}
                        >
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-[#0a0a0a] hover:bg-zinc-200 transition-all cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    <span>E-mail küldése</span>
                  </a>
                  {selectedLead.phone && (
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/5 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{selectedLead.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Projekt Paraméterek (Csak projekt esetén) */}
              {selectedLead.type === 'project' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                        <DollarSign className="h-4 w-4" />
                        Költségkeret
                      </span>
                      <span className="text-[18px] font-bold text-white">
                        {selectedLead.budget || 'Nem megadott'}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                        <Clock className="h-4 w-4" />
                        Időzítés
                      </span>
                      <span className="text-[18px] font-bold text-white">
                        {selectedLead.timeline || 'Nem megadott'}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                        <Calendar className="h-4 w-4" />
                        Rögzítve
                      </span>
                      <span className="text-[16px] font-semibold text-white">
                        {selectedLead.createdAt
                          ? new Date(selectedLead.createdAt).toLocaleString('hu-HU')
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {selectedLead.services && selectedLead.services.length > 0 && (
                    <div>
                      <span className="text-[13px] font-bold text-zinc-500 block mb-4 uppercase tracking-wide">
                        Kiválasztott szolgáltatások
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedLead.services.map((svc, i) => (
                          <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                            <span className="text-[15px] font-bold text-white block mb-3">
                              {svc.category}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {svc.items.length > 0 ? (
                                svc.items.map((sub, j) => (
                                  <span
                                    key={j}
                                    className="rounded-full bg-white/[0.05] border border-white/5 px-3.5 py-1.5 text-[12px] font-semibold text-zinc-200"
                                  >
                                    {sub}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[13px] text-zinc-500 font-medium">Általános megbízás</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Ha nem projekt, rögzítés ideje külön doboz */}
              {selectedLead.type !== 'project' && (
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5 w-full sm:w-1/3">
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                    <Calendar className="h-4 w-4" />
                    Rögzítés időpontja
                  </span>
                  <span className="text-[16px] font-semibold text-white">
                    {selectedLead.createdAt
                      ? new Date(selectedLead.createdAt).toLocaleString('hu-HU')
                      : '—'}
                  </span>
                </div>
              )}

              {/* Szöveges üzenet */}
              {selectedLead.message && (
                <div>
                  <span className="text-[13px] font-bold text-zinc-500 block mb-3 uppercase tracking-wide">
                    {selectedLead.type === 'team' ? 'Bemutatkozás' : 'Üzenet / Jegyzet'}
                  </span>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 text-[15px] leading-relaxed text-zinc-200 whitespace-pre-wrap">
                    {selectedLead.message}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Lábléc */}
            <div className="border-t border-white/10 pt-5 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-full bg-white/[0.04] border border-white/5 px-8 py-3 text-[13px] font-bold text-white hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                Bezárás
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Egyedi görgetősáv stílus a modalhoz */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  )
}
