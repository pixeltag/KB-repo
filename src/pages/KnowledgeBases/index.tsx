import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Layers, 
  FileText, 
  Tags,
  MoreHorizontal,
  Calendar,
  Cpu,
  BookOpen
} from 'lucide-react';
import { kbApi } from '../../api/kb';
import type { KnowledgeBase } from '../../api/types';

function formatShortDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const pillColors = [
  'bg-blue-500 text-white',
  'bg-fuchsia-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-violet-500 text-white',
]

export default function KnowledgeBases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    // initial `loading` is true; avoid synchronous setState here (lint rule)
    kbApi
      .listKnowledgeBases()
      .then((data) => {
        if (cancelled) return
        setItems(data)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load knowledge bases')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return items
    return items.filter((kb) => (kb.name + ' ' + kb.description + ' ' + kb.slug).toLowerCase().includes(q))
  }, [items, searchTerm])

  const stats = useMemo(() => {
    const totalFields = items.reduce((acc, kb) => acc + (kb.fields?.length ?? 0), 0)
    return [
      { label: 'Knowledge Bases', value: items.length, icon: Layers, color: 'text-violet-500', bg: 'bg-violet-100' },
      { label: 'Total Fields', value: totalFields, icon: Tags, color: 'text-emerald-500', bg: 'bg-emerald-100' },
      { label: 'Index Status', value: loading ? 'Syncing' : 'Ready', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100' },
    ] as const
  }, [items, loading])

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 mb-1">Knowledge Bases</h1>
          <p className="text-slate-500 text-sm">Manage your document collections and AI agents</p>
        </div>
        <Link 
          to="/knowledge-bases/create"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-2.5 px-5 rounded-lg font-medium transition-all shadow-md shadow-violet-600/20 interactive-btn self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Knowledge Base</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className="text-3xl font-bold font-heading text-slate-900">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search knowledge bases..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Knowledge Bases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {error && (
          <div className="lg:col-span-3 glass-card p-6 border border-red-100 bg-red-50/40 text-red-800">
            <div className="font-semibold mb-1">Couldn’t load knowledge bases</div>
            <div className="text-sm opacity-90">{error}</div>
          </div>
        )}

        {!error && loading && (
          <div className="lg:col-span-3 glass-card p-6 text-slate-600">
            Loading knowledge bases…
          </div>
        )}

        {!error && !loading && filtered.map((kb, idx) => {
          const pillColor = pillColors[idx % pillColors.length]
          const badges = (kb.fields ?? []).slice(0, 3).map((f) => f.label)
          return (
          <Link key={kb.id} to={`/knowledge-bases/${kb.id}`} className="group relative">
            <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500 ${pillColor} bg-opacity-30`}></div>
            <div className="glass-card relative h-full p-6 flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${pillColor}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold font-heading text-slate-900 mb-1">{kb.name}</h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{kb.description}</p>
                
                <div className="flex gap-4 mb-6">
                  <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1">
                    <div className="text-lg font-bold text-slate-800">{kb.slug}</div>
                    <div className="text-xs text-slate-500 font-medium">Slug</div>
                  </div>
                  <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1">
                    <div className="text-lg font-bold text-slate-800">{kb.fields?.length ?? 0}</div>
                    <div className="text-xs text-slate-500 font-medium">Fields</div>
                  </div>
                </div>

                {kb.fields?.some((f) => f.required) && (
                  <div className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-2 rounded-md mb-6 border border-amber-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    Has required fields
                  </div>
                )}
              </div>
              
              <div className="mt-auto border-t border-slate-100 pt-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created {formatShortDate(kb.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">/api/v1</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-50">
                  {badges.map((badge, i) => (
                    <span key={i} className="text-[10px] font-medium px-2 py-1 bg-violet-50 text-violet-700 rounded-md border border-violet-100">
                      {badge}
                    </span>
                  ))}
                  {(kb.fields?.length ?? 0) > badges.length && (
                    <span className="text-[10px] font-medium px-2 py-1 bg-slate-50 text-slate-500 rounded-md border border-slate-100">
                      +{(kb.fields?.length ?? 0) - badges.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )})}

        {/* Add New Card */}
        <Link to="/knowledge-bases/create" className="glass-card flex flex-col items-center justify-center p-8 text-center border-dashed border-2 hover:border-violet-300 group min-h-[350px]">
          <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center mb-4 transition-colors">
            <Plus className="w-6 h-6 text-slate-400 group-hover:text-violet-600 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 group-hover:text-violet-700 transition-colors">New Knowledge Base</h3>
          <p className="text-sm text-slate-500 mt-2">Upload docs and define tags</p>
        </Link>

      </div>
    </div>
  );
}
