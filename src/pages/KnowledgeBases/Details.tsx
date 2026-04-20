import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  MessageSquare
} from 'lucide-react';

const tabs = ['Documents', 'Tag Structure', 'AI Chat'];

const documents = [
  { name: 'John_Doe_CV.pdf', type: 'PDF', status: 'Completed', uploadedAt: 'Feb 1, 2026', size: '239.9 KB' },
  { name: 'Jane_Smith_Resume.pdf', type: 'PDF', status: 'Completed', uploadedAt: 'Feb 3, 2026', size: '193.6 KB' },
  { name: 'Mike_Johnson_CV.docx', type: 'DOCX', status: 'Processing', uploadedAt: 'Feb 5, 2026', size: '153.1 KB' }
];

const extractedData = [
  { doc: 'John_Doe_CV.pdf', name: 'John Doe', email: 'john.doe@email.com', years: '8', background: 'MS Computer Science, Stanford University' },
  { doc: 'Jane_Smith_Resume.pdf', name: 'Jane Smith', email: 'jane.smith@email.com', years: '5', background: 'BS Data Science, MIT' }
];

const tagsList = [
  { name: 'Full Name', desc: 'Extraction key for text data', type: 'text', required: true, ai: false },
  { name: 'Email', desc: 'Extraction key for text data', type: 'text', required: true, ai: false },
  { name: 'Years of Experience', desc: 'Extraction key for number data', type: 'number', required: true, ai: true },
  { name: 'Academic Background', desc: 'Extraction key for text data', type: 'text', required: false, ai: true },
  { name: 'Skills', desc: 'Extraction key for list data', type: 'list', required: false, ai: true },
  { name: 'Current Position', desc: 'Extraction key for text data', type: 'text', required: false, ai: false },
];

export default function KnowledgeBaseDetails() {
  // Route Params can be accessed here if needed downstream


  const [activeTab, setActiveTab] = useState('Documents');

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
        <Link to="/knowledge-bases" className="hover:text-slate-800 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Knowledge Bases
        </Link>
        <span>›</span>
        <span className="text-slate-800">CV Collection</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-1">CV Collection</h1>
            <p className="text-slate-500 text-sm mb-4">Collection of candidate CVs for recruitment</p>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                <FileText className="w-3.5 h-3.5" /> 15 documents
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                <Tag className="w-3.5 h-3.5" /> 6 tags
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                <Cpu className="w-3.5 h-3.5" /> text-embedding-ada-002
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" /> Jan 15, 2026
              </div>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg font-medium transition-all shadow-md shadow-blue-600/20 interactive-btn self-start whitespace-nowrap">
          <UploadCloud className="w-4 h-4" />
          <span>Add Documents</span>
        </button>
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
          {/* Status Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="glass-card p-4">
               <div className="flex items-center justify-between mb-2">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">67%</span>
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">2</div>
               <div className="text-xs font-medium text-slate-500">Completed</div>
             </div>
             <div className="glass-card p-4 relative overflow-hidden">
               <div className="absolute bottom-0 left-0 h-1 bg-amber-400 w-1/3"></div>
               <div className="flex items-center justify-between mb-2">
                 <Clock className="w-5 h-5 text-amber-500" />
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">1</div>
               <div className="text-xs font-medium text-slate-500">Processing</div>
             </div>
             <div className="glass-card p-4">
               <div className="flex items-center justify-between mb-2">
                 <XCircle className="w-5 h-5 text-red-500" />
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
               <div className="text-xs font-medium text-slate-500">Failed</div>
             </div>
             <div className="glass-card p-4 bg-slate-50 border-slate-200">
               <div className="flex items-center justify-between mb-2">
                 <File className="w-5 h-5 text-blue-500" />
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">3</div>
               <div className="text-xs font-medium text-slate-500">Total</div>
             </div>
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
             <div className="p-5 border-b border-slate-100 bg-white">
                <h3 className="font-semibold text-slate-900">Documents</h3>
             </div>
             <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 bg-slate-50 uppercase text-[10px] tracking-widest font-bold">
                    <th className="px-5 py-3 font-medium">Document</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Uploaded</th>
                    <th className="px-5 py-3 font-medium">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-white ${doc.type === 'PDF' ? 'bg-red-500' : 'bg-blue-500'}`}>
                              <File className="w-4 h-4" />
                           </div>
                           <div>
                             <div className="font-medium text-slate-800">{doc.name}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{doc.type}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {doc.status === 'Completed' ? (
                          <span className="flex items-center w-fit gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="flex items-center w-fit gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5" /> Processing
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{doc.uploadedAt}</td>
                      <td className="px-5 py-3.5 text-slate-500">{doc.size}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>

          <div className="glass-card overflow-hidden">
             <div className="p-5 border-b border-slate-100 bg-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <h3 className="font-semibold text-slate-900">Extracted Data Preview</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 bg-slate-50 uppercase text-[10px] tracking-widest font-bold">
                      <th className="px-5 py-3 font-medium">Document</th>
                      <th className="px-5 py-3 font-medium text-slate-600">Full Name</th>
                      <th className="px-5 py-3 font-medium text-slate-600">Email</th>
                      <th className="px-5 py-3 font-medium text-slate-600">Years of Experience</th>
                      <th className="px-5 py-3 font-medium text-slate-600">Academic Background</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-800">{row.doc}</td>
                        <td className="px-5 py-3.5 text-slate-600">{row.name}</td>
                        <td className="px-5 py-3.5 text-slate-600">{row.email}</td>
                        <td className="px-5 py-3.5 text-slate-600 font-mono">{row.years}</td>
                        <td className="px-5 py-3.5 text-slate-600">{row.background}</td>
                      </tr>
                    ))}
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
             <h3 className="font-semibold text-slate-900">Tag Structure</h3>
             <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">{tagsList.length} tags defined</span>
           </div>
           
           <div className="flex flex-col gap-3">
             {tagsList.map((tag, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/30 rounded-xl hover:border-slate-300 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-mono text-sm shrink-0 shadow-sm">{i+1}</div>
                    <Tag className="w-5 h-5 text-slate-300 group-hover:text-violet-400 transition-colors" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{tag.name}</h4>
                      <p className="text-xs text-slate-400">{tag.desc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100">{tag.type}</span>
                    {tag.required && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-red-600 border border-red-200 bg-red-50">required</span>}
                    {tag.ai && <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-violet-600 border border-violet-200 bg-violet-50">
                      <Sparkles className="w-3 h-3" /> AI
                    </span>}
                  </div>
                </div>
             ))}
           </div>

           <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
             <div className="p-1 min-w-max text-blue-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
             </div>
             <p className="text-xs text-blue-800 leading-relaxed font-medium">
               Tags define what structured data is extracted from each document during processing. Use the AI Chat tab to refine and add new tags interactively based on your specific requirements.
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
                <p className="text-xs text-slate-500">Ask questions or update document tags</p>
             </div>
           </div>
           
           <div className="flex-1 flex flex-col justify-end">
             {/* Stubbed empty chat view */}
             <div className="flex flex-col items-center justify-center text-center pb-12 flex-1">
               <Sparkles className="w-8 h-8 text-violet-300 mb-3" />
               <p className="text-slate-500 text-sm max-w-sm">I can help you analyze the documents or modify the tag extraction schema. Try asking:</p>
               <div className="flex flex-col gap-2 mt-4 w-full max-w-sm">
                 <button className="text-left text-sm px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition">"Find all candidates with Python experience"</button>
                 <button className="text-left text-sm px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition">"Add a required tag for 'University Name'"</button>
               </div>
             </div>

             <div className="relative mt-auto">
               <input 
                 type="text" 
                 placeholder="Ask about documents or modify tags..." 
                 className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                 <Sparkles className="w-4 h-4" />
               </button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}

// Inline fallback for missing tag
function Bot(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
}
