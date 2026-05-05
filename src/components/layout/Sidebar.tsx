import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FolderSync, 
  Plus, 
  BookOpen, 
  Settings, 
  HelpCircle,
  Database
} from 'lucide-react';
import { useMemo } from 'react';
import { useKnowledgeBases } from '../../state/useKnowledgeBases';

const colors = [
  { color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { color: 'text-violet-500', bg: 'bg-violet-500/10' },
]

export default function Sidebar() {
  const { items: kbs } = useKnowledgeBases()
  const location = useLocation()
  const navigate = useNavigate()

  const forceResetCreateWizard = () => {
    navigate(`/knowledge-bases/create?reset=${Date.now()}`)
  }

  const workspaces = useMemo(() => {
    return kbs.map((kb, idx) => ({
      id: kb.id,
      name: kb.name,
      items: kb.fields?.length ?? 0,
      ...colors[idx % colors.length],
    }))
  }, [kbs])

  return (
    <aside className="w-[280px] bg-[#0E0B16] text-white flex flex-col h-full border-r border-[#1e1a33] shadow-xl">
      {/* Brand Header */}
      <div className="p-6 pb-2">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
            <FolderSync className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-heading tracking-wide">DocuMind</h1>
            <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">AI Platform</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 flex flex-col gap-8">
        
        {/* Navigation Section */}
        <div>
          <div className="text-[11px] font-bold text-gray-500 mb-3 px-2 uppercase tracking-widest">Navigation</div>
          <nav className="flex flex-col gap-1">
            <NavLink 
              to="/knowledge-bases" 
              end
              className={({isActive}) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#1a162b]'}
              `}
            >
              <Database className="w-4 h-4" />
              <span>Knowledge Bases</span>
            </NavLink>
            <NavLink 
              to="/knowledge-bases/create"
              onClick={(e) => {
                if (location.pathname === '/knowledge-bases/create') {
                  e.preventDefault()
                  forceResetCreateWizard()
                }
              }}
              className={({isActive}) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#1a162b]'}
              `}
            >
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </NavLink>
          </nav>
        </div>

        {/* Workspaces Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Workspaces</div>
            <span className="w-5 h-5 rounded-full bg-[#1a162b] text-[10px] font-bold flex items-center justify-center text-gray-400">{workspaces.length}</span>
          </div>
          <nav className="flex flex-col gap-1">
            {workspaces.map(ws => (
              <NavLink 
                key={ws.id}
                to={`/knowledge-bases/${ws.id}`}
                className={({isActive}) => `
                  flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
                  ${isActive ? 'bg-indigo-900/20 text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a162b]'}
                `}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`p-1.5 rounded-md ${ws.bg}`}>
                    <BookOpen className={`w-3.5 h-3.5 ${ws.color}`} />
                  </div>
                  <span className="truncate group-hover:translate-x-0.5 transition-transform">{ws.name}</span>
                </div>
                <span className="text-[11px] font-mono opacity-60">{ws.items}</span>
              </NavLink>
            ))}
            {workspaces.length === 0 && (
              <div className="px-3 py-2.5 text-xs text-gray-500">No knowledge bases yet.</div>
            )}
          </nav>
        </div>

      </div>

      {/* Primary Action Button */}
      <div className="p-4 px-6 mt-auto">
        <Link 
          to="/knowledge-bases/create"
          onClick={(e) => {
            if (location.pathname === '/knowledge-bases/create') {
              e.preventDefault()
              forceResetCreateWizard()
            }
          }}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-lg shadow-violet-600/20 py-3 px-4 rounded-xl font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Knowledge Base</span>
        </Link>
      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-around border-t border-[#1e1a33] p-4 text-xs text-gray-400 font-medium">
        <button className="flex items-center gap-2 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="flex items-center gap-2 hover:text-white transition-colors">
          <HelpCircle className="w-4 h-4" />
          Help
        </button>
      </div>
    </aside>
  );
}
