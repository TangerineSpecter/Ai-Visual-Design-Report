// src/layout/MainLayout.jsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { Icons } from '../components/Icons';

const MainLayout = ({ currentView, onViewChange, children }) => {
  // --- 1. 状态管理 ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  const [expandedMenus, setExpandedMenus] = useState(['report', 'tools']);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 搜索相关状态
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // 新增：键盘选择索引
  const searchInputRef = useRef(null);

  // --- 2. 菜单配置 (严格保持原样) ---
  // --- 2. 菜单配置 (保持原样) ---
  const menuItems = [
    { 
      id: 'home', 
      label: '控制台首页', 
      icon: Icons.Layout 
    },
    { 
      id: 'report', 
      label: 'AI 报告', 
      icon: Icons.FileText,
      children: [
        { id: 'n8n-report', label: 'n8n工作流' }
      ]
    },
    { 
      id: 'tools', 
      label: 'AI 工具', 
      icon: Icons.Wrench,
      children: [
        { id: 'cat-food-analysis', label: '猫粮成分分析' }
      ]
    },
    { 
      id: 'settings', 
      label: '全局设置', 
      icon: Icons.Settings, 
      disabled: false 
    },
  ];

  // --- 3. 搜索逻辑 & 键盘导航 ---
  const searchableItems = useMemo(() => {
    const items = [];
    menuItems.forEach(item => {
      if (!item.disabled) items.push({ id: item.id, label: item.label, icon: item.icon });
      if (item.children) {
        item.children.forEach(child => {
          items.push({ id: child.id, label: child.label, parentLabel: item.label, icon: item.icon });
        });
      }
    });
    return items;
  }, []);

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : searchableItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.parentLabel && item.parentLabel.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // 获取当前展示的列表（用于键盘导航：如果有搜索词显示结果，没有则显示推荐）
  const currentDisplayList = searchQuery ? searchResults : searchableItems.slice(0, 5);

  const handleSearchResultClick = (id) => {
    onViewChange(id);
    setSearchQuery("");
    setIsSearchOpen(false);
    setSelectedIndex(0);
  };

  // 重置索引：当搜索词变化时，重置回第一个
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // 全局快捷键 & 搜索框键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. 打开搜索框: Cmd+F / Ctrl+F
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
        return;
      }

      // 2. 搜索框打开时的操作
      if (isSearchOpen) {
        if (e.key === 'Escape') {
          setIsSearchOpen(false);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % currentDisplayList.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + currentDisplayList.length) % currentDisplayList.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (currentDisplayList[selectedIndex]) {
            handleSearchResultClick(currentDisplayList[selectedIndex].id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, currentDisplayList, selectedIndex]);

  // --- 4. 主题 & 辅助逻辑 ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleMenu = (menuId) => {
    if (isSidebarCollapsed) return;
    setExpandedMenus(prev => prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]);
  };

  const renderMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = !isSidebarCollapsed && expandedMenus.includes(item.id);
    const isParentActive = hasChildren && item.children.some(child => child.id === currentView);
    const isActive = currentView === item.id;

    return (
      <div key={item.id} className="mb-1 px-3">
        <button
          onClick={() => {
            if (item.disabled) return;
            if (isSidebarCollapsed) {
              setIsSidebarCollapsed(false);
              setExpandedMenus([...expandedMenus, item.id]);
              return;
            }
            if (hasChildren) toggleMenu(item.id);
            else onViewChange(item.id);
          }}
          disabled={item.disabled}
          className={`w-full flex items-center p-3 rounded-xl text-sm font-medium transition-all duration-300
            ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} 
            ${isActive 
              ? 'bg-n8n text-white shadow-md shadow-n8n/20 scale-[1.02]' 
              : item.disabled 
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : isParentActive 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }
          `}
          title={isSidebarCollapsed ? item.label : ""}
        >
          <div className="flex items-center gap-3">
            <item.icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
            {!isSidebarCollapsed && <span>{item.label}</span>}
          </div>
          
          {!isSidebarCollapsed && hasChildren && (
            <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90 text-slate-800 dark:text-white' : 'text-slate-400'}`}>
              <Icons.ChevronRight size={16} />
            </div>
          )}
        </button>

        {!isSidebarCollapsed && hasChildren && (
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col space-y-1 ml-4 border-l-2 border-slate-100 dark:border-slate-800 pl-2">
              {item.children.map(child => (
                <button
                  key={child.id}
                  onClick={() => onViewChange(child.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${currentView === child.id 
                      ? 'text-n8n font-bold bg-n8n/5 translate-x-1' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:translate-x-1'
                    }
                  `}
                >
                  {child.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-200 overflow-hidden font-sans">
      
      {/* --- Sidebar --- */}
      <aside 
        className={`flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0f] transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Header */}
        <div className={`h-20 flex items-center px-5 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-9 h-9 bg-n8n rounded-xl flex items-center justify-center shadow-lg shadow-n8n/20">
              <Icons.Bot size={20} className="text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-lg tracking-wide text-slate-900 dark:text-white whitespace-nowrap animate-in fade-in duration-300">
                AI Engine
              </span>
            )}
          </div>
          
          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Icons.ChevronRight size={18} className="rotate-180" />
            </button>
          )}
        </div>

        {isSidebarCollapsed && (
           <button 
             onClick={() => setIsSidebarCollapsed(false)}
             className="mx-auto mb-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-n8n transition-all hover:scale-110 shadow-sm"
           >
             <Icons.ChevronRight size={16} />
           </button>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pt-2">
          {menuItems.map(renderMenuItem)}
        </nav>

        {/* User Profile (还原高质感设计) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
          <div className={`flex items-center gap-3 p-3 rounded-2xl 
            bg-slate-50 dark:bg-[#15151a] 
            border border-slate-200 dark:border-slate-800 
            transition-all duration-300 group cursor-pointer 
            hover:border-n8n/50 dark:hover:border-n8n/50 hover:shadow-[0_0_15px_rgba(255,77,77,0.1)]
            ${isSidebarCollapsed ? 'justify-center p-2' : ''}`}
          >
             <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 shadow-inner">
                  <Icons.UserCheck size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#15151a] rounded-full"></div>
             </div>
             {!isSidebarCollapsed && (
               <div className="overflow-hidden">
                 <div className="text-sm font-bold text-slate-800 dark:text-white truncate">丢失的猫咪</div>
                 <div className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-n8n transition-colors">Online</div>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      {/* 保持直角硬朗风格，无 round/margin */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-slate-50/50 dark:bg-black">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md z-30 sticky top-0">
           <div className="hidden md:flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Workspace</span>
              <div className="text-sm font-bold text-slate-800 dark:text-white capitalize flex items-center gap-2">
                 {currentView.replace(/-/g, ' ')}
              </div>
           </div>
           
           <div className="flex items-center gap-3 ml-auto">
              
              {/* 搜索按钮 */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="group flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:border-n8n dark:hover:border-n8n transition-all hover:w-48 w-32 justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icons.Search size={14} />
                  <span>Search</span>
                </div>
                <span className="px-1.5 py-0.5 bg-white dark:bg-black border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono opacity-50 group-hover:opacity-100">⌘K</span>
              </button>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-yellow-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                  {isDarkMode ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
              </button>

              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-n8n hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative">
                  <Icons.Bell size={18} />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
              </button>
           </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {children}
        </div>
      </main>

      {/* --- Spotlight Search Modal --- */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] animate-in fade-in duration-200" 
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-[#1a1a1f] shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 slide-in-from-bottom-2"
            onClick={e => e.stopPropagation()} 
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-slate-200 dark:border-slate-800">
              <Icons.Search size={22} className="text-n8n" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search anything..." 
                className="flex-1 ml-4 bg-transparent border-none outline-none text-lg text-slate-800 dark:text-white placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 font-mono">ESC</div>
            </div>

            {/* Results Area */}
            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
              {searchQuery && searchResults.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {!searchQuery && (
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Links</div>
                  )}
                  
                  {currentDisplayList.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearchResultClick(item.id)}
                      className={`w-full px-3 py-3 flex items-center gap-4 rounded-xl transition-colors group
                        ${index === selectedIndex 
                          ? 'bg-n8n/10 dark:bg-n8n/20' // 键盘选中高亮
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800' // 鼠标悬停
                        }
                      `}
                    >
                      <div className={`p-2 rounded-lg transition-colors
                        ${index === selectedIndex 
                          ? 'bg-white dark:bg-slate-700 text-n8n shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-n8n group-hover:bg-white dark:group-hover:bg-slate-700'
                        }
                      `}>
                        <item.icon size={18} />
                      </div>
                      <div className="text-left flex-1">
                        <div className={`text-sm font-bold ${index === selectedIndex ? 'text-n8n' : 'text-slate-700 dark:text-slate-200 group-hover:text-n8n'}`}>
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                           <span>Go to</span>
                           <Icons.ChevronRight size={10} />
                           <span>{item.parentLabel || 'Page'}</span>
                        </div>
                      </div>
                      <div className={`transition-opacity px-2 py-1 rounded text-[10px] shadow-sm
                        ${index === selectedIndex 
                           ? 'opacity-100 bg-white dark:bg-slate-800 text-n8n' 
                           : 'opacity-0 group-hover:opacity-100 bg-white dark:bg-slate-800 text-slate-400'
                        }
                      `}>
                        Jump
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
              <div className="flex gap-3">
                <span><strong>↵</strong> to select</span>
                <span><strong>↑↓</strong> to navigate</span>
              </div>
              <div><strong>AI Engine</strong> Workspace</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;