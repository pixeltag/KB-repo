import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans selection:bg-violet-600/20">
      {/* Sidebar fixed to the left */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto px-10 py-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
