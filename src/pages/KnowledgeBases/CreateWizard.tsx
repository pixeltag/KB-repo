import type { SVGProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Bot,
  ChevronDown
} from 'lucide-react';
import { kbApi } from '../../api/kb';
import type { KBField, KBFieldType } from '../../api/types';
import { useKnowledgeBases } from '../../state/useKnowledgeBases';

export default function CreateWizard() {
  const navigate = useNavigate()
  const { upsert } = useKnowledgeBases()
  const [searchParams] = useSearchParams()
  const resetKey = searchParams.get('reset') ?? ''

  const [step, setStep] = useState(1);
  const [tags, setTags] = useState<{name: string, type: KBFieldType, required: boolean}[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagType, setNewTagType] = useState<KBFieldType>('text')
  const [newTagRequired, setNewTagRequired] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const resetForm = () => {
    setStep(1)
    setTags([])
    setNewTagName('')
    setNewTagType('text')
    setNewTagRequired(false)
    setName('')
    setDescription('')
    setSubmitting(false)
    setSubmitError(null)
  }

  useEffect(() => {
    if (!resetKey) return
    resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  const addTag = () => {
    if (newTagName.trim()) {
      setTags([...tags, { name: newTagName.trim(), type: newTagType, required: newTagRequired }]);
      setNewTagName('');
      setNewTagRequired(false)
      setNewTagType('text')
    }
  };

  const fields: KBField[] = useMemo(() => {
    const toKey = (s: string) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
    return tags.map((t) => ({
      key: toKey(t.name),
      label: t.name,
      type: t.type,
      required: t.required,
      description: '',
    }))
  }, [tags])

  const onSubmit = async () => {
    setSubmitError(null)
    if (!name.trim()) {
      setSubmitError('Name is required.')
      return
    }

    try {
      setSubmitting(true)
      const kb = await kbApi.createKnowledgeBase({
        name: name.trim(),
        description: description.trim(),
        fields,
      })
      upsert(kb)
      navigate(`/knowledge-bases/${kb.id}`)
    } catch (e: unknown) {
      // API/network errors are shown via global toaster (apiRequest)
      // Keep the form enabled and avoid inline "Failed to fetch" banners.
      setSubmitError(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
          <Link to="/knowledge-bases" className="hover:text-slate-800 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Knowledge Bases
          </Link>
          <span>›</span>
          <span className="text-slate-800">Create New</span>
        </div>
        
        <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Create Knowledge Base</h1>
        <p className="text-slate-500 text-sm">Set up a new document collection with AI-powered extraction and semantic search</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mt-4 mb-4 max-w-2xl mx-auto w-full relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-100 -z-10"></div>
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3 bg-gray-50 px-2 lg:px-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= s ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-white text-slate-400 border border-slate-200'
            }`}>
              {s}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
              {s === 1 ? 'Basic Info' : 'Tags & Keys'}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        {step === 1 && (
          <div className="glass-card p-8 transition-opacity duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                <p className="text-xs text-slate-500">Name, description, and embedding model</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., CV Collection, Product Manuals, Legal Contracts" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea 
                  placeholder="Describe what this knowledge base will contain and its purpose..." 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm resize-none"
                ></textarea>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                  <Bot className="w-4 h-4 text-slate-400" />
                  Embedding Model
                </label>
                <div className="relative">
                  <select
                    disabled
                    className="appearance-none w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:outline-none transition-all text-sm font-medium text-slate-700 cursor-not-allowed opacity-80"
                  >
                    <option>Backend-managed</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-500 mt-2">Embedding/model settings are managed by the backend for now.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="glass-card p-8 transition-opacity duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-violet-100 text-violet-700">2</div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Tags & Extraction Keys</h2>
                  <p className="text-xs text-slate-500">Define fields to extract from each document</p>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg font-medium text-sm transition-all">
                <Sparkles className="w-4 h-4 text-violet-500" />
                AI Suggest
              </button>
            </div>
            
            <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 mb-4">
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name (e.g., Author, Date, Skills)" 
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                />
                <select
                  value={newTagType}
                  onChange={(e) => setNewTagType(e.target.value as KBFieldType)}
                  className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white text-sm text-slate-700 focus:outline-none"
                >
                  <option value="text">Text</option>
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="boolean">Boolean</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={newTagRequired}
                    onChange={(e) => setNewTagRequired(e.target.checked)}
                    className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                  />
                  Required
                </label>
                <button 
                  onClick={addTag}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-lg font-medium text-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="border border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/30">
              {tags.length === 0 ? (
                <>
                  <Tags className="w-8 h-8 text-slate-300 mb-3" />
                  <h3 className="text-sm font-semibold text-slate-600 mb-1">No tags defined yet</h3>
                  <p className="text-xs text-slate-400">Add tags manually or use AI Suggest</p>
                </>
              ) : (
                <div className="w-full space-y-2">
                  {tags.map((tag, i) => (
                    <div key={i} className="flex flex-row items-center justify-between bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-mono">{i+1}</span>
                        <span className="font-medium text-slate-800 text-sm">{tag.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">{tag.type}</span>
                        {tag.required && <span className="text-[10px] font-medium px-2 py-0.5 bg-red-50 text-red-600 rounded">Required</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
        <button 
          className="px-6 py-2.5 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => step > 1 ? setStep(step - 1) : null}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <div className="flex flex-col items-end gap-2">
          {submitError && <div className="text-xs font-semibold text-red-600">{submitError}</div>}
          <button 
            disabled={submitting}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md ${
              step === 2 
                ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            } ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={() => step < 2 ? setStep(step + 1) : onSubmit()}
          >
            {step === 2 ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{submitting ? 'Creating…' : 'Create Knowledge Base'}</span>
              </>
            ) : 'Next Step'}
          </button>
        </div>
      </div>

    </div>
  );
}

// Inline fallback for missing tag
function Tags(props: SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3v5.172a2 2 0 0 0 .586 1.414l8.204 8.204a2 2 0 0 0 2.828 0l4.204-4.204a2 2 0 0 0 0-2.828Z"/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"/></svg>
}
