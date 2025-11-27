// src/views/home/Index.jsx
import { Icons } from '../../components/Icons';

const HomeView = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full min-h-[calc(100vh-2rem)] flex items-center justify-center overflow-hidden bg-slate-950 rounded-2xl border border-slate-800/50 p-8">
      
      {/* 动态背景网格 */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
           }}>
      </div>

      {/* 中心核心动画区域 */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* 核心能量球 (点击去报告) */}
        <div className="relative mb-8 group cursor-pointer" onClick={() => onNavigate('report-basic')}>
          <div className="absolute inset-0 bg-n8n blur-[60px] opacity-20 animate-pulse"></div>
          
          <div className="absolute inset-[-20px] border border-slate-700/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-[-40px] border border-slate-800/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          
          <div className="relative w-32 h-32 bg-slate-900 rounded-full border-2 border-slate-700 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:border-n8n">
            <Icons.Zap size={48} className="text-white group-hover:text-n8n transition-colors duration-300" />
          </div>

          <div className="absolute -right-12 top-0 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600 animate-bounce delay-75">
            System Ready
          </div>
          <div className="absolute -left-12 bottom-0 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600 animate-bounce delay-700">
            AI Online
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
          Visual Workstation
        </h1>
        <p className="text-slate-400 max-w-md text-center mb-8">
          欢迎回到控制台。请选择下方的功能模块开始工作。
        </p>

        {/* 快速入口卡片 - 改为 grid-cols-3 以容纳新按钮 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          
          {/* 1. 查看报告 */}
          <button onClick={() => onNavigate('report-basic')} className="flex flex-col items-center p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-n8n/50 hover:bg-slate-800 transition-all group text-center">
            <div className="p-3 bg-n8n/10 rounded-lg group-hover:bg-n8n group-hover:text-white transition-colors text-n8n mb-3">
              <Icons.FileText size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">查看报告</div>
              <div className="text-[10px] text-slate-500 mt-1">Design Report</div>
            </div>
          </button>
          
          {/* 2. 新增：AI 工具 (跳转到 cat-food-analysis) */}
          <button onClick={() => onNavigate('cat-food-analysis')} className="flex flex-col items-center p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all group text-center">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-400 mb-3">
              <Icons.Wrench size={24} /> {/* 假设 Icon 用 Search 代表分析 */}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">AI 工具</div>
              <div className="text-[10px] text-slate-500 mt-1">Analysis Tools</div>
            </div>
          </button>
          
          {/* 3. 系统设置 (Disabled) */}
          <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900/50 border border-slate-800 opacity-50 cursor-not-allowed">
            <div className="p-3 bg-slate-800 rounded-lg text-slate-500 mb-3">
              <Icons.Settings size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500">系统设置</div>
              <div className="text-[10px] text-slate-600 mt-1">Coming Soon</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeView;