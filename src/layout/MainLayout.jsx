// src/layout/MainLayout.jsx
import { useState } from 'react'; // 引入 useState
import { Icons } from '../components/Icons';

const MainLayout = ({ currentView, onViewChange, children }) => {
  // 定义展开的菜单状态 (默认展开 'report' 菜单)
  const [expandedMenus, setExpandedMenus] = useState(['report']);

  // 菜单配置：支持 children 嵌套
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
      // 定义子菜单
      children: [
        { id: 'report-basic', label: '基础自动化' },
        { id: 'report-rag', label: 'RAG 知识库' },
        { id: 'report-agent', label: 'AI Agent 智能体' }
      ]
    },
    { 
      id: 'tools', 
      label: 'AI 工具', 
      icon: Icons.FileText,
      // 定义子菜单
      children: [
        { id: 'cat-food-analysis', label: '猫粮成分分析' }
      ]
    },
    { 
      id: 'settings', 
      label: '全局设置', 
      icon: Icons.Settings, 
      disabled: true 
    },
  ];

  // 切换菜单展开/收起
  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId) // 如果已展开，则关闭
        : [...prev, menuId]                // 如果已关闭，则展开
    );
  };

  // 渲染菜单项的辅助函数
  const renderMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    // 判断当前项是否被选中 (对于父菜单，如果它的某个子菜单被选中，它也算"关联选中")
    const isParentActive = hasChildren && item.children.some(child => child.id === currentView);
    const isActive = currentView === item.id;

    return (
      <div key={item.id} className="mb-1">
        {/* 菜单主按钮 */}
        <button
          onClick={() => {
            if (item.disabled) return;
            // 核心逻辑：如果有子菜单，只切换展开状态；否则切换页面
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              onViewChange(item.id);
            }
          }}
          disabled={item.disabled}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive 
              ? 'bg-n8n text-white shadow-lg shadow-n8n/20' 
              : item.disabled 
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : isParentActive // 父菜单激活样式（但不完全高亮）
                    ? 'text-white bg-slate-800'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <item.icon size={18} />
            <span>{item.label}</span>
          </div>
          {/* 如果有子菜单，显示箭头 */}
          {hasChildren && (
            <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
              <Icons.ChevronRight size={16} />
            </div>
          )}
        </button>

        {/* 子菜单区域 */}
        {hasChildren && (
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col space-y-1 ml-4 border-l border-slate-700 pl-2">
              {item.children.map(child => (
                <button
                  key={child.id}
                  onClick={() => onViewChange(child.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                    ${currentView === child.id 
                      ? 'text-n8n bg-n8n/10 font-bold border-r-2 border-n8n' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
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
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-1/5 min-w-[240px] flex flex-col border-r border-slate-800 bg-slate-900/30">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-gradient-to-br from-n8n to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-n8n/20">
            <Icons.Bot size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">AI Design Engine</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Menu
          </div>
          {/* 遍历渲染菜单 */}
          {menuItems.map(renderMenuItem)}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Icons.UserCheck size={16} />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-white truncate">丢失的猫咪</div>
              <div className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Online
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden bg-slate-950">
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