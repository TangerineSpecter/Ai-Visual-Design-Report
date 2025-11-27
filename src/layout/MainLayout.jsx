// src/layout/MainLayout.jsx
import { Icons } from '../components/Icons';

const MainLayout = ({ currentView, onViewChange, children }) => {
  const menuItems = [
    { id: 'home', label: '控制台首页', icon: Icons.Layout },
    { id: 'report', label: 'AI 设计报告', icon: Icons.FileText },
    { id: 'settings', label: '全局设置', icon: Icons.Settings, disabled: true },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* Left Sidebar (20% Width) */}
      <aside className="w-1/5 min-w-[240px] flex flex-col border-r border-slate-800 bg-slate-900/30">
        {/* Logo Area */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-gradient-to-br from-n8n to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-n8n/20">
            <Icons.Bot size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">AI Engine</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Menu
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && onViewChange(item.id)}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${currentView === item.id 
                  ? 'bg-n8n text-white shadow-lg shadow-n8n/20' 
                  : item.disabled 
                    ? 'opacity-40 cursor-not-allowed'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Icons.UserCheck size={16} />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-white truncate">Administrator</div>
              <div className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Online
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Content Area (80% Width) */}
      <main className="flex-1 relative overflow-hidden bg-slate-950">
        {/* Header/Breadcrumbs (Optional) */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm z-20 absolute top-0 w-full">
           <div className="text-sm text-slate-400">
              <span className="opacity-50">Views / </span>
              <span className="text-white font-medium capitalize">{currentView}</span>
           </div>
           <div className="flex gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Icons.Search size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                  <Icons.Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="h-full pt-16 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="p-6 md:p-8 min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;