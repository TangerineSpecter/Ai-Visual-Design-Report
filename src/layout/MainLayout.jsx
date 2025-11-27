// src/layout/MainLayout.jsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { Icons } from '../components/Icons';
import packageJson from '../../package.json';

const MainLayout = ({ currentView, onViewChange, children }) => {
  // --- 状态管理 ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  const [expandedMenus, setExpandedMenus] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 搜索相关
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef(null);

  // --- 菜单配置 ---
  const menuItems = useMemo(() => [
    { id: 'home', label: '控制台首页', icon: Icons.Layout },
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
  ], []);

  // 自动展开
  useEffect(() => {
    const parent = menuItems.find(item => 
      item.children && item.children.some(child => child.id === currentView)
    );
    if (parent) {
      setExpandedMenus(prev => {
        if (prev.includes(parent.id)) return prev;
        return [...prev, parent.id];
      });
    }
  }, [currentView, menuItems]);

  // 搜索逻辑
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
  }, [menuItems]);

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : searchableItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.parentLabel && item.parentLabel.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const currentDisplayList = searchQuery ? searchResults : searchableItems.slice(0, 5);

  const handleSearchResultClick = (id) => {
    onViewChange(id);
    setSearchQuery("");
    setIsSearchOpen(false);
    setSelectedIndex(0);
  };

  useEffect(() => { setSelectedIndex(0); }, [searchQuery]);

  // 快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
        return;
      }
      if (isSearchOpen) {
        if (e.key === 'Escape') setIsSearchOpen(false);
        else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % currentDisplayList.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + currentDisplayList.length) % currentDisplayList.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (currentDisplayList[selectedIndex]) handleSearchResultClick(currentDisplayList[selectedIndex].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, currentDisplayList, selectedIndex]);

  // 主题
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

  // --- 4. 渲染菜单项 (防闪烁终极优化版) ---
  const renderMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = !isSidebarCollapsed && expandedMenus.includes(item.id);
    const isChildActive = hasChildren && item.children.some(child => child.id === currentView);
    const isActive = currentView === item.id;

    return (
      <div key={item.id} className="mb-2 px-3">
        {/* 一级菜单按钮 */}
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
          // 关键点：使用 flex-nowrap 防止换行，overflow-hidden 裁剪内容
          className={`w-full flex items-center flex-nowrap py-3 px-3 rounded-2xl text-sm font-medium transition-all duration-300 relative group overflow-hidden
            ${isActive 
              ? 'bg-gradient-to-r from-n8n to-pink-600 text-white shadow-lg shadow-n8n/30' 
              : item.disabled 
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : isChildActive 
                    ? 'text-white bg-white/5' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }
          `}
        >
          {isActive && <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm animate-pulse"></div>}
          
          {/* 图标：固定宽度，不随父级收缩而挤压 */}
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center relative z-10">
            <item.icon size={20} className={`transition-transform duration-300 ${isActive || isChildActive ? 'scale-110' : 'group-hover:scale-110'}`} />
          </div>
          
          {/* 文字容器：使用 max-width 进行动画，这是防止闪烁的关键 
             ml-3 放在这里面，这样收缩时 margin 也会一起消失，不会留下空白
          */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center
            ${isSidebarCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}
          `}>
             <span className="ml-3 tracking-wide">{item.label}</span>
             
             {/* 箭头也在这个容器里，一起消失 */}
             {hasChildren && (
                <div className={`ml-auto pl-2 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-white' : 'text-slate-500'}`}>
                  <Icons.ChevronRight size={16} />
                </div>
             )}
          </div>
        </button>

        {/* 二级菜单 */}
        {!isSidebarCollapsed && hasChildren && (
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col space-y-1 ml-4 border-l border-white/10 pl-3">
              {item.children.map(child => {
                const isChildSelected = currentView === child.id;
                return (
                  <button
                    key={child.id}
                    onClick={() => onViewChange(child.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 relative overflow-hidden group/child whitespace-nowrap
                      ${isChildSelected 
                        ? 'text-n8n bg-n8n/10 font-bold shadow-[inset_0_0_10px_rgba(255,77,77,0.1)]' 
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                      }
                    `}
                  >
                    {isChildSelected && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-n8n rounded-r-full shadow-[0_0_8px_#ff4d4d]"></div>
                    )}
                    <span className={`relative z-10 transition-transform duration-200 ${isChildSelected ? 'translate-x-1' : 'group-hover/child:translate-x-1'}`}>
                      {child.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#050508] text-slate-200 overflow-hidden font-sans selection:bg-n8n/30 selection:text-n8n-light">
      
      {/* Sidebar */}
      <aside 
        className={`flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) relative z-20 flex-shrink-0 border-r border-white/5 bg-[#050508]
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Header */}
        <div className={`h-24 flex items-center px-6 whitespace-nowrap overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center transition-all duration-300">
            <div className="relative flex-shrink-0 w-10 h-10 bg-gradient-to-br from-n8n to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-n8n/20 group cursor-pointer overflow-hidden z-20">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Icons.Bot size={22} className="text-white relative z-10" />
            </div>
            
            {/* 标题文字：防闪烁处理 */}
            <div className={`flex flex-col ml-3 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
               ${isSidebarCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}
            `}>
                <span className="font-bold text-xl tracking-tight text-white leading-none">AI Engine</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Design Report</span>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className={`px-4 mb-2 flex ${isSidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
           <button 
             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
             className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
           >
             <Icons.Layout size={18} className={isSidebarCollapsed ? "" : "rotate-180"} />
           </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar pt-2 px-2 pb-10">
          {menuItems.map(renderMenuItem)}
        </nav>

        {/* User Profile & Version */}
        <div className="p-4 mt-auto">
          <div className={`flex items-center p-3 rounded-2xl 
            bg-[#0f0f13] border border-white/5
            transition-all duration-300 cursor-pointer overflow-hidden
            hover:border-n8n/30 hover:bg-[#15151a]
            ${isSidebarCollapsed ? 'justify-center p-2' : ''}`}
          >
             <div className="relative flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white text-xs shadow-inner">
                <Icons.UserCheck size={16} />
                <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 ring-2 ring-[#0f0f13] rounded-full animate-pulse"></span>
             </div>
             
             {/* 文字容器：防闪烁处理 */}
             <div className={`flex flex-col transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
               ${isSidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-3'}
             `}>
                 <div className="text-sm font-bold text-slate-200 truncate">丢失的猫咪</div>
                 <div className="flex justify-between items-center mt-0.5 gap-2">
                    <span className="text-[10px] text-slate-500">Pro Account</span>
                    {/* 2. 版本号 (橙色高亮) */}
                    <span className="text-[10px] text-orange-500 font-bold font-mono bg-orange-500/10 px-1.5 rounded border border-orange-500/20">v{packageJson.version}</span>
                 </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content (保持不变) */}
      <main className="flex-1 relative h-full py-3 pr-3 overflow-hidden">
        <div className="h-full w-full rounded-l-[2.5rem] rounded-r-2xl bg-slate-50 dark:bg-[#0c0c0e] shadow-2xl overflow-hidden relative flex flex-col transition-colors duration-500 ease-in-out border border-white/50 dark:border-white/5 group/main z-0">
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-n8n/20 rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-50 transition-opacity duration-1000 z-0"></div>
           <div className="absolute top-6 right-6 z-50 flex items-center gap-3 pointer-events-auto">
               <div className="flex items-center gap-2 p-1.5 bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-white/10 shadow-lg hover:bg-white dark:hover:bg-[#15151a] transition-all duration-300">
                  <button onClick={() => setIsSearchOpen(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-n8n transition-all"><Icons.Search size={16} /></button>
                  <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                  <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-yellow-500 transition-all">{isDarkMode ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}</button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all relative"><Icons.Bell size={16} /><span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span></button>
               </div>
           </div>
           <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent relative z-10 rounded-l-[2.5rem] rounded-r-2xl">
              {children}
           </div>
        </div>
      </main>

      {/* Search Modal (保持不变) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={() => setIsSearchOpen(false)}>
          <div className="w-full max-w-xl bg-white dark:bg-[#121216] shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800/50">
              <Icons.Search size={22} className="text-n8n" /><input ref={searchInputRef} type="text" placeholder="Search..." className="flex-1 ml-4 bg-transparent outline-none text-slate-800 dark:text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
               {currentDisplayList.map((item, index) => (
                    <button key={item.id} onClick={() => handleSearchResultClick(item.id)} className={`w-full px-4 py-3 flex items-center gap-4 rounded-xl transition-all ${index === selectedIndex ? 'bg-n8n/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                      <div className="text-slate-500"><item.icon size={18} /></div><div className="text-left flex-1"><div className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.label}</div></div>
                    </button>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;