// src/views/home/Index.jsx
import { Icons } from '../../components/Icons';

const HomeView = ({ onNavigate }) => {
  return (
    // 修改点 1: 去掉 min-h-[calc(100vh-2rem)]，改为 h-full
    // 修改点 2: 保留 relative, w-full, flex, overflow-hidden
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden 
      bg-slate-50 dark:bg-slate-950 
      rounded-2xl border-slate-200 dark:border-slate-800/50 
      transition-colors duration-500 ease-in-out p-8">
      
      {/* --- 动态背景网格 --- */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
             WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
           }}>
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-20"
             style={{
                backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                color: 'var(--grid-color)'
             }}>
             {/* 隐形 CSS 变量 hack */}
             <div className="text-slate-900 dark:text-slate-100 hidden"></div> 
        </div>
      </div>

      {/* --- 中心内容区 --- */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full"> {/* 限制最大宽度优化大屏体验 */}
        
        {/* --- 核心交互球 (Core) --- */}
        {/* 稍微减小 mb-10 为 mb-8 以适应小屏幕 */}
        <div className="relative mb-8 group cursor-pointer" onClick={() => onNavigate('report-basic')}>
          
          <div className="absolute inset-0 bg-n8n blur-[60px] opacity-0 dark:opacity-20 animate-pulse transition-opacity duration-500"></div>
          
          <div className="absolute inset-[-24px] border border-slate-200 dark:border-slate-700/50 rounded-full animate-[spin_12s_linear_infinite] opacity-60"></div>
          <div className="absolute inset-[-48px] border border-slate-200/60 dark:border-slate-800/30 border-dashed rounded-full animate-[spin_20s_linear_infinite_reverse] opacity-40"></div>
          
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-500
            bg-white dark:bg-slate-900 
            border-4 border-slate-100 dark:border-slate-700
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-none
            group-hover:scale-105 group-hover:border-n8n/50 dark:group-hover:border-n8n
          ">
            <Icons.Zap size={56} className="text-slate-400 dark:text-white group-hover:text-n8n transition-colors duration-300" />
          </div>

          <div className="absolute -right-16 top-0 
            bg-white dark:bg-slate-800 
            text-slate-500 dark:text-slate-300 
            text-[10px] font-bold px-3 py-1.5 rounded-full 
            border border-slate-100 dark:border-slate-600 
            shadow-lg dark:shadow-none animate-bounce delay-75 z-20">
            System Ready
          </div>
          <div className="absolute -left-16 bottom-0 
            bg-white dark:bg-slate-800 
            text-slate-500 dark:text-slate-300 
            text-[10px] font-bold px-3 py-1.5 rounded-full 
            border border-slate-100 dark:border-slate-600 
            shadow-lg dark:shadow-none animate-bounce delay-700 z-20">
            AI Online
          </div>
        </div>

        {/* --- 标题文字 --- */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-center transition-colors duration-300
          text-slate-900 dark:text-white">
          Visual <span className="text-n8n">Workstation</span>
        </h1>
        <p className="max-w-md text-center mb-8 text-base md:text-lg transition-colors duration-300
          text-slate-500 dark:text-slate-400">
          可视化智能中枢已就绪。请选择功能模块以开始您的工作流。
        </p>

        {/* --- 卡片入口区 --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4">
          
          <ActionCard 
            icon={Icons.FileText} 
            title="AI 视觉报告" 
            desc="Visual Design Report" 
            onClick={() => onNavigate('report-basic')}
            colorClass="text-n8n"
            bgClass="bg-n8n/10"
          />
          
          <ActionCard 
            icon={Icons.Wrench} 
            title="AI 实验室" 
            desc="Analysis Tools" 
            onClick={() => onNavigate('cat-food-analysis')}
            colorClass="text-blue-500 dark:text-blue-400"
            bgClass="bg-blue-500/10"
          />
          
          <div className="relative group overflow-hidden rounded-xl border transition-all duration-300
            bg-slate-100 dark:bg-slate-900/40 
            border-slate-200 dark:border-slate-800 
            opacity-60 cursor-not-allowed p-5 flex flex-col items-center text-center">
            <div className="p-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 mb-4">
              <Icons.Settings size={28} />
            </div>
            <div className="text-base font-bold text-slate-400 dark:text-slate-500">系统设置</div>
            <div className="text-xs text-slate-400 mt-1">Coming Soon</div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- 卡片组件 (保持不变) ---
const ActionCard = ({ icon: Icon, title, desc, onClick, colorClass, bgClass }) => (
  <button 
    onClick={onClick} 
    className="relative group overflow-hidden rounded-xl border p-5 flex flex-col items-center text-center transition-all duration-300
      bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1
      dark:bg-slate-900/60 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-slate-700
    ">
    <div className={`p-3 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${bgClass} ${colorClass}`}>
      <Icon size={28} />
    </div>
    <div>
      <div className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</div>
      <div className="text-xs text-slate-500 dark:text-slate-500 font-mono">{desc}</div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none dark:hidden" />
  </button>
);

export default HomeView;