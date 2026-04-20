import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Plus, 
  Bot,
  ChevronDown
} from 'lucide-react';

export default function CreateWizard() {
  const [step, setStep] = useState(1);
  const [tags, setTags] = useState<{name: string, type: string, required: boolean}[]>([]);
  const [newTagName, setNewTagName] = useState('');

  const addTag = () => {
    if (newTagName.trim()) {
      setTags([...tags, { name: newTagName, type: 'Text', required: false }]);
      setNewTagName('');
    }
  };

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
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3 bg-gray-50 px-2 lg:px-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= s ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-white text-slate-400 border border-slate-200'
            }`}>
              {s}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
              {s === 1 ? 'Basic Info' : s === 2 ? 'Tags & Keys' : 'Documents'}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <div className={`glass-card p-8 transition-opacity duration-300 ${step < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
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
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea 
                placeholder="Describe what this knowledge base will contain and its purpose..." 
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                <Bot className="w-4 h-4 text-slate-400" />
                Embedding Model
              </label>
              <div className="relative">
                <select className="appearance-none w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm font-medium text-slate-700 cursor-pointer">
                  <option>text-embedding-ada-002 — Fast & efficient</option>
                  <option>text-embedding-3-small — Default</option>
                  <option>text-embedding-3-large — High accuracy</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Determines semantic search quality. Larger models are more accurate but slower.</p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`glass-card p-8 transition-opacity duration-300 ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400'}`}>2</div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Tags & Extraction Keys</h2>
                <p className="text-xs text-slate-500">Define fields to extract from each document</p>
              </div>
            </div>
            {step >= 2 && (
               <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg font-medium text-sm transition-all">
                 <Sparkles className="w-4 h-4 text-violet-500" />
                 AI Suggest
               </button>
            )}
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
              <select className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white text-sm text-slate-700 focus:outline-none">
                <option>Text</option>
                <option>Number</option>
                <option>Date</option>
                <option>List</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4" />
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

        {/* Step 3 */}
        <div className={`glass-card p-8 transition-opacity duration-300 ${step < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400'}`}>3</div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Upload Documents</h2>
              <p className="text-xs text-slate-500">Optional — you can add documents later</p>
            </div>
          </div>

          <div className="border hover:border-violet-400 transition-colors border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 cursor-pointer group">
            <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-violet-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">
              <span className="text-violet-600 hover:underline">Click to upload</span> or drag & drop
            </h3>
            <p className="text-xs text-slate-500">PDF, DOC, DOCX, PPT, PPTX — up to 10MB each</p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
        <button 
          className="px-6 py-2.5 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => step > 1 ? setStep(step - 1) : null}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button 
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md ${
             step === 3 
              ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20' 
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
          onClick={() => step < 3 ? setStep(step + 1) : null}
        >
          {step === 3 ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Create Knowledge Base</span>
            </>
          ) : 'Next Step'}
        </button>
      </div>

    </div>
  );
}

// Inline fallback for missing tag
function Tags(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3v5.172a2 2 0 0 0 .586 1.414l8.204 8.204a2 2 0 0 0 2.828 0l4.204-4.204a2 2 0 0 0 0-2.828Z"/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"/></svg>
}
