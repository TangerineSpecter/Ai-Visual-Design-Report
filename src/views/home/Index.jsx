// src/views/home/Index.jsx
import { useState, useCallback } from 'react';
import { Icons } from '../../components/Icons';

// StarIcon 组件 (保持不变)
const StarIcon = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HomeView = ({ onNavigate }) => {
  const [isExploding, setIsExploding] = useState(false);

  const handleOrbitIteration = useCallback(() => {
    setIsExploding(true);
    const timer = setTimeout(() => setIsExploding(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden 
      bg-slate-50 dark:bg-[#0c0c0e] 
      transition-colors duration-500 ease-in-out p-6 md:p-12">
      
      {/* 1. 背景网格 (保持不变) */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.4] dark:opacity-20"
             style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(148, 163, 184, 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(148, 163, 184, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
             }}>
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50 dark:from-[#0c0c0e] dark:via-transparent dark:to-[#0c0c0e]"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-slate-50 dark:from-[#0c0c0e] dark:via-transparent dark:to-[#0c0c0e]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-5xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700"> 
        
        {/* 2. 核心能量区 (保持你满意的呼吸效果) */}
        <div className="relative mb-16 mt-8 cursor-pointer group/core" onClick={() => onNavigate('report-basic')}>
          {/* 呼吸光晕 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse bg-n8n/20 dark:bg-cyan-500/20 transition-colors duration-500"></div>
          
          {/* 轨道 */}
          <div className="absolute inset-[-15px] rounded-full border border-dashed animate-[spin_10s_linear_infinite] border-slate-300/50 dark:border-white/30 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
          <div className="absolute inset-[-8px] rounded-full border border-t-2 animate-[spin_5s_linear_infinite_reverse] border-transparent border-t-n8n/50 dark:border-t-orange-400 dark:border-r-orange-400/30"></div>

          {/* 星星轨道 */}
          <div className="absolute inset-[-50px] rounded-full animate-[spin_8s_linear_infinite] pointer-events-none z-20" onAnimationIteration={handleOrbitIteration}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 p-1.5 rounded-full shadow-sm transition-colors bg-white dark:bg-white dark:shadow-[0_0_15px_rgba(255,255,255,0.8)]">
              <StarIcon className="text-yellow-500" size={14} />
            </div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-3 h-3 rounded-full animate-pulse delay-1000 bg-blue-400 dark:bg-cyan-400 dark:shadow-[0_0_10px_#22d3ee]"></div>
          </div>

          {/* 核心球体 */}
          <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center backdrop-blur-xl border-2 transition-all duration-300 ease-out z-30
            ${isExploding 
              ? 'bg-white dark:bg-[#1a1a1f] scale-110 shadow-[0_0_60px_-5px_rgba(255,77,77,0.8)] dark:shadow-[0_0_80px_-5px_rgba(6,182,212,0.6)] border-n8n/50 dark:border-cyan-400/50' 
              : 'bg-white/90 dark:bg-[#15151a]/90 border-white dark:border-white/20 shadow-[0_0_40px_-10px_rgba(255,77,77,0.3)] dark:shadow-[0_0_50px_-10px_rgba(6,182,212,0.2)]'
            }
          `}>
             {isExploding && (<div className="absolute inset-0 rounded-full border-4 animate-[ping_1s_ease-out_1] border-n8n/60 dark:border-cyan-400/60"></div>)}
             <div className="absolute inset-0 bg-gradient-to-tr rounded-full opacity-60 from-slate-100 via-transparent to-slate-100 dark:from-white/10 dark:via-transparent dark:to-white/10"></div>
             <Icons.Zap size={48} className={`relative z-10 transition-all ${isExploding ? 'animate-[bounce_0.5s_ease_infinite] scale-110' : 'animate-[pulse_3s_ease-in-out_infinite]'} text-n8n dark:text-orange-400 drop-shadow-[0_0_10px_rgba(255,77,77,0.6)] dark:drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]`} fill="currentColor" fillOpacity={0.2} />
          </div>

          <div className="absolute -right-14 top-0 bg-white/80 dark:bg-[#1a1a1f]/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-white/20 shadow-sm animate-[bounce_3s_infinite]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1.5 shadow-[0_0_5px_#22c55e]"></span>
            Online
          </div>

          <div className="absolute -left-12 bottom-0 bg-white/80 dark:bg-[#1a1a1f]/80 backdrop-blur-sm text-slate-500 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-white/20 shadow-sm animate-[bounce_3s_infinite] transition-colors duration-300">
            (๑•̀ㅂ•́)و✧
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-n8n to-orange-500 dark:from-cyan-400 dark:to-blue-500">Workstation</span>
          </h1>
          <p className="max-w-md mx-auto text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            可视化智能中枢已就绪。所有模块运行正常。
          </p>
        </div>

        {/* 3. 卡片入口区 - 全新设计的 3D 立体感卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
          
          <ActionCard 
            icon={Icons.FileText} 
            title="AI 视觉报告" 
            desc="Visual Design Report" 
            onClick={() => onNavigate('report-basic')}
            // 红色系
            glowColor="group-hover:shadow-n8n/40 dark:group-hover:shadow-orange-500/40"
            iconColor="text-n8n dark:text-orange-400"
            ringColor="group-hover:ring-n8n/50"
            gradient="from-n8n/5 to-transparent"
          />
          
          <ActionCard 
            icon={Icons.Wrench} 
            title="AI 工具箱" 
            desc="Analysis Tools" 
            onClick={() => onNavigate('cat-food-analysis')}
            // 蓝色系
            glowColor="group-hover:shadow-blue-500/40 dark:group-hover:shadow-cyan-400/40"
            iconColor="text-blue-600 dark:text-cyan-400"
            ringColor="group-hover:ring-blue-500/50"
            gradient="from-blue-500/5 to-transparent"
          />
          
          <ActionCard 
            icon={Icons.Settings} 
            title="系统设置" 
            desc="System Configuration" 
            onClick={() => onNavigate('settings')}
            // 紫色系
            glowColor="group-hover:shadow-purple-500/40 dark:group-hover:shadow-purple-400/40"
            iconColor="text-purple-600 dark:text-purple-400"
            ringColor="group-hover:ring-purple-500/50"
            gradient="from-purple-500/5 to-transparent"
          />
          
        </div>
      </div>
    </div>
  );
};

// --- 重构后的 3D 立体卡片 ---
const ActionCard = ({ icon: Icon, title, desc, onClick, glowColor, iconColor, ringColor, gradient }) => (
  <button 
    onClick={onClick}
    className={`
      relative group h-full w-full
      flex flex-col items-start text-left p-6
      rounded-3xl
      transition-all duration-500 ease-out
      
      /* 背景与基础质感 */
      bg-gradient-to-br from-white to-slate-50 
      dark:from-[#15151a] dark:to-[#0c0c0e]
      
      /* 边框：细微的亮边 */
      border border-slate-200/60 dark:border-white/10
      
      /* 初始阴影 (较浅) -> 悬停阴影 (爆发颜色 + 深度) */
      shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]
      hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]
      hover:-translate-y-2
      ${glowColor} /* 注入颜色阴影 */
      
      overflow-hidden
    `}
  >
    {/* 1. 顶部高光 (Inset Highlight) - 模拟玻璃厚度 */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20 opacity-50"></div>
    
    {/* 2. 背景色彩光晕 (Hover时出现) */}
    <div className={`absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -mr-10 -mt-10`}></div>

    {/* 3. 扫光动画 (Sheen Effect) */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-3xl">
       <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] animate-[shine_1s_ease-in-out_infinite_running] group-hover:animate-[shine_0.8s_ease-in-out_once]"></div>
    </div>

    {/* 4. 图标底座 (3D 悬浮感) */}
    <div className={`
      relative mb-5 p-4 rounded-2xl
      bg-slate-100/50 dark:bg-white/5 
      backdrop-blur-sm
      border border-slate-200/50 dark:border-white/10
      shadow-sm
      group-hover:scale-110 group-hover:rotate-[-3deg]
      transition-all duration-300 ease-out
      ${ringColor} group-hover:ring-1
    `}>
      <Icon size={26} className={`relative z-10 transition-colors duration-300 ${iconColor}`} />
      
      {/* 图标内部发光 */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 bg-current transition-opacity duration-300 ${iconColor}`}></div>
    </div>
    
    {/* 5. 文本内容 */}
    <div className="relative z-10 w-full mt-auto">
      <div className="flex justify-between items-center mb-1.5">
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-black dark:group-hover:text-white transition-colors">
            {title}
          </span>
          
          {/* 箭头：默认缩小透明，Hover时滑入 */}
          <Icons.ArrowRight size={18} className={`
            transform translate-x-[-10px] opacity-0 
            group-hover:translate-x-0 group-hover:opacity-100 
            transition-all duration-300 ease-out
            ${iconColor}
          `} />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium font-mono leading-relaxed">
        {desc}
      </p>
    </div>
    
    {/* 底部装饰条 (Optional, 增加底部的稳重感) */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200/30 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </button>
);

export default HomeView;