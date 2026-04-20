import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Layers, 
  FileText, 
  Tags,
  MoreHorizontal,
  Calendar,
  Cpu
} from 'lucide-react';

const stats = [
  { label: 'Knowledge Bases', value: 3, icon: Layers, color: 'text-violet-500', bg: 'bg-violet-100' },
  { label: 'Total Documents', value: 35, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100' },
  { label: 'Extraction Tags', value: 15, icon: Tags, color: 'text-emerald-500', bg: 'bg-emerald-100' }
];

const knowledgeBases = [
  {
    id: '1',
    name: 'CV Collection',
    description: 'Collection of candidate CVs for recruitment',
    documents: 15,
    tags: 6,
    processing: 1,
    createdAt: 'Jan 15, 2026',
    model: 'text-embedding-ada-002',
    pillColor: 'bg-blue-500 text-white',
    badges: ['Full Name', 'Email', 'Years of Experience']
  },
  {
    id: '2',
    name: 'Product Documentation',
    description: 'Technical documentation for our product line',
    documents: 8,
    tags: 4,
    processing: 0,
    createdAt: 'Jan 20, 2026',
    model: 'text-embedding-ada-002',
    pillColor: 'bg-fuchsia-500 text-white',
    badges: ['Product Name', 'Version', 'Category']
  },
  {
    id: '3',
    name: 'Legal Contracts',
    description: 'Repository of legal documents and contracts',
    documents: 12,
    tags: 5,
    processing: 0,
    createdAt: 'Feb 1, 2026',
    model: 'text-embedding-ada-002',
    pillColor: 'bg-emerald-500 text-white',
    badges: ['Contract Type', 'Party Name', 'Effective Date']
  }
];

export default function KnowledgeBases() {
  const [searchTerm, setSearchTerm] = useState('');

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
        {knowledgeBases.map(kb => (
          <Link key={kb.id} to={`/knowledge-bases/${kb.id}`} className="group relative">
            <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500 ${kb.pillColor} bg-opacity-30`}></div>
            <div className="glass-card relative h-full p-6 flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${kb.pillColor}`}>
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
                    <div className="text-lg font-bold text-slate-800">{kb.documents}</div>
                    <div className="text-xs text-slate-500 font-medium">Documents</div>
                  </div>
                  <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1">
                    <div className="text-lg font-bold text-slate-800">{kb.tags}</div>
                    <div className="text-xs text-slate-500 font-medium">Tags</div>
                  </div>
                </div>

                {kb.processing > 0 && (
                  <div className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-2 rounded-md mb-6 border border-amber-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                    {kb.processing} document processing...
                  </div>
                )}
              </div>
              
              <div className="mt-auto border-t border-slate-100 pt-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created {kb.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{kb.model}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-50">
                  {kb.badges.map((badge, i) => (
                    <span key={i} className="text-[10px] font-medium px-2 py-1 bg-violet-50 text-violet-700 rounded-md border border-violet-100">
                      {badge}
                    </span>
                  ))}
                  <span className="text-[10px] font-medium px-2 py-1 bg-slate-50 text-slate-500 rounded-md border border-slate-100">
                    +2
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

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

// Temporary inline BookOpen import to fix missing import Error
function BookOpen(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
