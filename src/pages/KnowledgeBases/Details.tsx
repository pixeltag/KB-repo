import type { SVGProps } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  File, 
  FileText,
  Tag,
  BookOpen,
  Calendar,
  Cpu,
  Sparkles,
  MessageSquare,
  Trash2,
  Save
} from 'lucide-react';
import { kbApi } from '../../api/kb';
import type { ChatResponse, DocumentResponse, KnowledgeBase, RecordResponse } from '../../api/types';
import { useKnowledgeBases } from '../../state/useKnowledgeBases';

const tabs = ['Documents', 'Tag Structure', 'AI Chat'];
function formatShortDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function KnowledgeBaseDetails() {
  const { id } = useParams()
  const { upsert, remove } = useKnowledgeBases()
  const [activeTab, setActiveTab] = useState('Documents');
  const [kb, setKb] = useState<KnowledgeBase | null>(null)
  const [kbLoading, setKbLoading] = useState(true)
  const [kbError, setKbError] = useState<string | null>(null)

  const [documents, setDocuments] = useState<DocumentResponse[]>([])
  const [docsLoading, setDocsLoading] = useState(false)
  const [docsError, setDocsError] = useState<string | null>(null)

  const [records, setRecords] = useState<RecordResponse[]>([])
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [recordsError, setRecordsError] = useState<string | null>(null)

  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [chatSessionId, setChatSessionId] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setKbLoading(true)
    setKbError(null)
    kbApi
      .getKnowledgeBase(id)
      .then((data) => {
        if (cancelled) return
        setKb(data)
        setEditName(data.name)
        setEditDescription(data.description)
        upsert(data)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setKbError(e instanceof Error ? e.message : 'Failed to load knowledge base')
      })
      .finally(() => {
        if (cancelled) return
        setKbLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, upsert])

  const refreshDocuments = async () => {
    if (!id) return
    setDocsError(null)
    setDocsLoading(true)
    try {
      const data = await kbApi.listDocuments(id)
      setDocuments(data)
    } catch (e: unknown) {
      setDocsError(e instanceof Error ? e.message : 'Failed to load documents')
    } finally {
      setDocsLoading(false)
    }
  }

  const refreshRecords = async () => {
    if (!id) return
    setRecordsError(null)
    setRecordsLoading(true)
    try {
      const data = await kbApi.listRecords(id)
      setRecords(data)
    } catch (e: unknown) {
      setRecordsError(e instanceof Error ? e.message : 'Failed to load records')
    } finally {
      setRecordsLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    refreshDocuments()
    refreshRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onSaveKb = async () => {
    if (!id) return
    setSaving(true)
    try {
      const updated = await kbApi.updateKnowledgeBase(id, {
        name: editName.trim(),
        description: editDescription.trim(),
        fields: kb?.fields ?? [],
      })
      setKb(updated)
      upsert(updated)
    } catch (e: unknown) {
      setKbError(e instanceof Error ? e.message : 'Failed to save knowledge base')
    } finally {
      setSaving(false)
    }
  }

  const onDeleteKb = async () => {
    if (!id) return
    setDeleting(true)
    try {
      await kbApi.deleteKnowledgeBase(id)
      remove(id)
      window.location.href = '/knowledge-bases'
    } catch (e: unknown) {
      setKbError(e instanceof Error ? e.message : 'Failed to delete knowledge base')
    } finally {
      setDeleting(false)
    }
  }

  const onPickFile = () => fileInputRef.current?.click()

  const onUpload = async (file: File | null) => {
    if (!id || !file) return
    setUploadError(null)
    setUploading(true)
    try {
      await kbApi.uploadDocument(id, file)
      await Promise.all([refreshDocuments(), refreshRecords()])
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const previewFields = useMemo(() => (kb?.fields ?? []).slice(0, 4), [kb])

  const docCounts = useMemo(() => {
    const total = documents.length
    return { completed: total, processing: 0, failed: 0, total }
  }, [documents.length])

  const sendChat = async () => {
    if (!id) return
    const text = chatInput.trim()
    if (!text) return
    setChatError(null)
    setChatSending(true)
    setChatInput('')
    setChatMessages((m) => [...m, { role: 'user', content: text }])
    try {
      const res: ChatResponse = await kbApi.chat(id, { query: text, session_id: chatSessionId })
      setChatSessionId(res.session_id)
      setChatMessages((m) => [...m, { role: 'assistant', content: res.response }])
    } catch (e: unknown) {
      setChatError(e instanceof Error ? e.message : 'Chat failed')
    } finally {
      setChatSending(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
        <Link to="/knowledge-bases" className="hover:text-slate-800 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Knowledge Bases
        </Link>
        <span>›</span>
        <span className="text-slate-800">{kb?.name ?? (kbLoading ? 'Loading…' : 'Not found')}</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-col gap-3">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-2xl font-bold font-heading text-slate-900 bg-transparent border-b border-transparent focus:border-slate-200 outline-none"
                placeholder="Knowledge base name"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="text-slate-500 text-sm bg-transparent border border-transparent focus:border-slate-200 rounded-md outline-none resize-none"
                rows={2}
                placeholder="Description"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                <FileText className="w-3.5 h-3.5" /> {documents.length} documents
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                <Tag className="w-3.5 h-3.5" /> {kb?.fields?.length ?? 0} fields
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                <Cpu className="w-3.5 h-3.5" /> /api/v1
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" /> {kb?.created_at ? formatShortDate(kb.created_at) : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button
            disabled={saving || kbLoading}
            onClick={onSaveKb}
            className={`flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg font-medium transition-all shadow-md interactive-btn whitespace-nowrap ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving…' : 'Save'}</span>
          </button>
          <button
            disabled={deleting || kbLoading}
            onClick={onDeleteKb}
            className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all shadow-md shadow-red-600/20 interactive-btn whitespace-nowrap ${deleting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Deleting…' : 'Delete'}</span>
          </button>
          <button
            disabled={uploading || !id}
            onClick={onPickFile}
            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg font-medium transition-all shadow-md shadow-blue-600/20 interactive-btn whitespace-nowrap ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'Uploading…' : 'Add Documents'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
              activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'Documents' && <FileText className="w-4 h-4" />}
            {tab === 'Tag Structure' && <Tag className="w-4 h-4" />}
            {tab === 'AI Chat' && <MessageSquare className="w-4 h-4" />}
            {tab}
            {tab === 'AI Chat' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
            
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content: Documents */}
      {activeTab === 'Documents' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          {kbError && (
            <div className="glass-card p-4 bg-red-50/40 border border-red-100 text-red-800 text-sm">{kbError}</div>
          )}
          {uploadError && (
            <div className="glass-card p-4 bg-red-50/40 border border-red-100 text-red-800 text-sm">{uploadError}</div>
          )}
          {/* Status Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="glass-card p-4">
               <div className="flex items-center justify-between mb-2">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">OK</span>
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">{docCounts.completed}</div>
               <div className="text-xs font-medium text-slate-500">Completed</div>
             </div>
             <div className="glass-card p-4 relative overflow-hidden">
               <div className="absolute bottom-0 left-0 h-1 bg-amber-400 w-1/3"></div>
               <div className="flex items-center justify-between mb-2">
                 <Clock className="w-5 h-5 text-amber-500" />
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">{docCounts.processing}</div>
               <div className="text-xs font-medium text-slate-500">Processing</div>
             </div>
             <div className="glass-card p-4">
               <div className="flex items-center justify-between mb-2">
                 <XCircle className="w-5 h-5 text-red-500" />
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">{docCounts.failed}</div>
               <div className="text-xs font-medium text-slate-500">Failed</div>
             </div>
             <div className="glass-card p-4 bg-slate-50 border-slate-200">
               <div className="flex items-center justify-between mb-2">
                 <File className="w-5 h-5 text-blue-500" />
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">{docCounts.total}</div>
               <div className="text-xs font-medium text-slate-500">Total</div>
             </div>
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
             <div className="p-5 border-b border-slate-100 bg-white">
                <h3 className="font-semibold text-slate-900">Documents</h3>
             </div>
             {docsError && <div className="p-4 text-sm text-red-700 bg-red-50/40 border-b border-slate-100">{docsError}</div>}
             {docsLoading && <div className="p-4 text-sm text-slate-600 border-b border-slate-100">Loading…</div>}
             <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 bg-slate-50 uppercase text-[10px] tracking-widest font-bold">
                    <th className="px-5 py-3 font-medium">Document</th>
                    <th className="px-5 py-3 font-medium">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-white bg-red-500">
                              <File className="w-4 h-4" />
                           </div>
                           <div>
                             <div className="font-medium text-slate-800">{doc.file_name}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PDF</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{formatShortDate(doc.uploaded_at)}</td>
                    </tr>
                  ))}
                  {!docsLoading && documents.length === 0 && (
                    <tr>
                      <td className="px-5 py-6 text-slate-500" colSpan={2}>
                        No documents yet. Upload a PDF to start ingestion.
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>

          <div className="glass-card overflow-hidden">
             <div className="p-5 border-b border-slate-100 bg-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <h3 className="font-semibold text-slate-900">Extracted Data Preview</h3>
             </div>
             {recordsError && <div className="p-4 text-sm text-red-700 bg-red-50/40 border-b border-slate-100">{recordsError}</div>}
             {recordsLoading && <div className="p-4 text-sm text-slate-600 border-b border-slate-100">Loading…</div>}
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 bg-slate-50 uppercase text-[10px] tracking-widest font-bold">
                      <th className="px-5 py-3 font-medium">Document</th>
                      {previewFields.map((f) => (
                        <th key={f.key} className="px-5 py-3 font-medium text-slate-600">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-800">{r.file_name}</td>
                        {previewFields.map((f) => (
                          <td key={f.key} className="px-5 py-3.5 text-slate-600">
                            {String((r.extracted_data as Record<string, unknown>)[f.key] ?? '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {!recordsLoading && records.length === 0 && (
                      <tr>
                        <td className="px-5 py-6 text-slate-500" colSpan={1 + previewFields.length}>
                          No extracted records yet. Upload a PDF to create records.
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {/* Tab Content: Tag Structure */}
      {activeTab === 'Tag Structure' && (
        <div className="glass-card flex flex-col p-6 animate-in fade-in duration-300">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-semibold text-slate-900">Field Structure</h3>
             <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">{kb?.fields?.length ?? 0} fields defined</span>
           </div>
           
           <div className="flex flex-col gap-3">
             {(kb?.fields ?? []).map((tag, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/30 rounded-xl hover:border-slate-300 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-mono text-sm shrink-0 shadow-sm">{i+1}</div>
                    <Tag className="w-5 h-5 text-slate-300 group-hover:text-violet-400 transition-colors" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{tag.label}</h4>
                      <p className="text-xs text-slate-400 font-mono">{tag.key}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100">{tag.type}</span>
                    {tag.required && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-red-600 border border-red-200 bg-red-50">required</span>}
                  </div>
                </div>
             ))}
             {!kbLoading && (kb?.fields?.length ?? 0) === 0 && (
               <div className="p-4 text-sm text-slate-600 bg-slate-50/50 border border-slate-100 rounded-xl">
                 No fields defined yet. Create fields from the “Create Knowledge Base” wizard.
               </div>
             )}
           </div>

           <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
             <div className="p-1 min-w-max text-blue-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
             </div>
             <p className="text-xs text-blue-800 leading-relaxed font-medium">
               Fields define what structured data is extracted from each document during ingestion. Use the AI Chat tab to query content across the KB.
             </p>
           </div>
        </div>
      )}

      {/* Tab Content: AI Chat Placeholder */}
      {activeTab === 'AI Chat' && (
        <div className="glass-card flex-1 min-h-[400px] flex flex-col p-6 animate-in fade-in duration-300">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center border border-violet-200">
                <Bot className="w-5 h-5 text-violet-600" />
             </div>
             <div>
                <h3 className="font-semibold text-slate-900">DocuMind AI Assistant</h3>
                <p className="text-xs text-slate-500">Ask questions across this knowledge base</p>
             </div>
           </div>
           
           <div className="flex-1 flex flex-col justify-end">
             {chatMessages.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center pb-12 flex-1">
                 <Sparkles className="w-8 h-8 text-violet-300 mb-3" />
                 <p className="text-slate-500 text-sm max-w-sm">Try asking:</p>
                 <div className="flex flex-col gap-2 mt-4 w-full max-w-sm">
                   <button onClick={() => setChatInput('Summarize the uploaded documents.')} className="text-left text-sm px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition">"Summarize the uploaded documents."</button>
                   <button onClick={() => setChatInput('What are the key entities extracted?')} className="text-left text-sm px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition">"What are the key entities extracted?"</button>
                 </div>
               </div>
             ) : (
               <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
                 {chatMessages.map((m, idx) => (
                   <div key={idx} className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                     m.role === 'user'
                       ? 'self-end bg-violet-600 text-white'
                       : 'self-start bg-white border border-slate-200 text-slate-800'
                   }`}>
                     {m.content}
                   </div>
                 ))}
               </div>
             )}

             <div className="relative mt-auto">
               <input 
                 type="text" 
                 placeholder="Ask about documents..." 
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') void sendChat()
                 }}
                 className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
               />
               <button
                 disabled={chatSending}
                 onClick={() => void sendChat()}
                 className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors ${chatSending ? 'opacity-60 cursor-not-allowed' : ''}`}
               >
                 <Sparkles className="w-4 h-4" />
               </button>
             </div>
             {chatError && <div className="text-xs font-semibold text-red-600 mt-2">{chatError}</div>}
             {chatSending && <div className="text-xs text-slate-500 mt-2">Thinking…</div>}
           </div>
        </div>
      )}

    </div>
  );
}

// Inline fallback for missing tag
function Bot(props: SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
}
