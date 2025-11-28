import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, Shield, Snowflake, Target, Unlock, Brain, Sparkles, ArrowDown, Play, RotateCcw } from 'lucide-react';

// --- 自定义 Hooks ---
// 用于检测元素是否进入视口，实现滚动淡入效果
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setVisible] = useState(false);
  // 使用 useRef 缓存 options，避免父组件重渲染导致 observer 频繁重建
  const optionsRef = useRef(options);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // 一旦进入视口，就保持可见
      if (entry.isIntersecting) {
        setVisible(true);
        // 性能优化：一旦可见，就停止观察，防止滚动时的闪烁和性能损耗
        if (ref.current) observer.unobserve(ref.current);
      }
    }, optionsRef.current);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      // 清理 observer
      observer.disconnect();
    };
  }, []); // 空依赖数组，确保只在组件挂载时创建一次 observer

  return [ref, isVisible];
};

// --- 组件部分 ---

// 1. 推石头动画组件
const StoneAnimation = () => {
  const [animationState, setAnimationState] = useState('idle'); // idle, pushing, rolling

  const startAnimation = () => {
    setAnimationState('pushing');
    // 模拟推到山顶需要的时间
    setTimeout(() => {
      setAnimationState('rolling');
    }, 4000);
    // 动画结束重置
    setTimeout(() => {
      setAnimationState('idle');
    }, 7000);
  };

  return (
    <div className="relative h-64 w-full bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner flex flex-col items-center justify-center group">
      {/* 背景斜坡 SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <path d="M0,256 L200,100 L400,256" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="2" strokeDasharray="5,5"/>
        {/* 临界点标记 */}
        <line x1="200" y1="100" x2="200" y2="256" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <text x="205" y="120" fill="rgba(255,255,255,0.5)" fontSize="12">¥100,000 (临界点)</text>
      </svg>

      {/* 小球/石头 */}
      <div 
        className={`absolute w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)] z-20 flex items-center justify-center text-white font-bold text-xs transition-all
          ${animationState === 'idle' ? 'left-[10%] bottom-[10%]' : ''}
          ${animationState === 'pushing' ? 'animate-push-uphill' : ''}
          ${animationState === 'rolling' ? 'animate-roll-downhill' : ''}
        `}
      >
        <span className="drop-shadow-md">💰</span>
      </div>

      {/* 状态文字 */}
      <div className="absolute top-4 left-4 z-30">
        {animationState === 'idle' && <span className="text-slate-400 text-sm">点击按钮开始演示</span>}
        {animationState === 'pushing' && <span className="text-orange-400 font-bold animate-pulse">艰难爬坡中... (积累期)</span>}
        {animationState === 'rolling' && <span className="text-green-400 font-bold">自动滚雪球! (复利期)</span>}
      </div>

      {/* 控制按钮 */}
      <button 
        onClick={startAnimation}
        disabled={animationState !== 'idle'}
        className={`absolute bottom-6 px-6 py-2 rounded-full font-bold shadow-lg transition-all z-40 flex items-center gap-2
          ${animationState !== 'idle' ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105'}
        `}
      >
        {animationState === 'idle' ? <><Play size={16}/> 演示全过程</> : <><RotateCcw size={16} className="animate-spin"/> 演示中...</>}
      </button>

      {/* CSS 动画定义在 style 标签中 */}
    </div>
  );
};

// 2. 盾牌防御动画组件
const ShieldAnimation = () => {
  // 关键修复：使用 useMemo 冻结随机粒子数据
  // 确保粒子只在组件挂载时生成一次，不会随父组件重渲染而改变
  const particles = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      id: i,
      top: `${10 + Math.random() * 80}%`,
      left: i % 2 === 0 ? '-20%' : '120%', // 确保初始位置在屏幕外
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random()}s`
    }));
  }, []); // 空依赖数组 = 只执行一次

  return (
    <div className="relative h-72 w-full flex items-center justify-center overflow-hidden bg-slate-800/30 rounded-2xl border border-slate-700/30">
      {/* 盾牌主体 */}
      <div className="relative z-20 transform transition-transform duration-300 hover:scale-110">
        <Shield size={140} className="text-blue-500 fill-blue-500/10 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-blue-200 font-bold text-lg">存款</span>
        </div>
      </div>

      {/* 攻击粒子 */}
      {particles.map((particle) => (
        <div 
          key={particle.id}
          className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] animate-attack-shield z-10"
          style={{
            top: particle.top,
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            animationIterationCount: 'infinite'
          }}
        >
          {/* 拖尾效果 */}
          <div className="absolute top-1/2 left-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-red-500/80 to-transparent transform -translate-y-1/2 -translate-x-1/2 blur-sm"></div>
        </div>
      ))}
      
      <div className="absolute bottom-4 text-slate-500 text-xs z-30 bg-slate-900/50 px-3 py-1 rounded-full">
        *红点代表生活中的意外打击 (失业/生病/账单)
      </div>
    </div>
  );
};

// 3. 通用 Section 组件 (提取到主组件外部，防止重渲染时销毁重建)
const Section = ({ title, children, icon: Icon, className = "" }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className={`min-h-[80vh] flex flex-col justify-center items-center p-4 md:p-8 transition-all duration-1000 transform 
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} 
      ${className}`}
    >
      <div className="max-w-5xl w-full bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-[2rem] p-6 md:p-12 border border-slate-700/50 relative overflow-hidden group">
        {/* 卡片高光 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-8 border-b border-slate-700/50 pb-6 relative z-10">
          <div className="p-3 md:p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-900/30 text-white shrink-0">
            <Icon size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-200 tracking-tight leading-tight">{title}</h2>
        </div>
        <div className="relative z-10 text-slate-300">
          {children}
        </div>
      </div>
    </section>
  );
};

const MungerWisdom = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 模拟复利数据
  const [year, setYear] = useState(0);
  const [savings, setSavings] = useState(0);
  const [compound, setCompound] = useState(0);
  const isSimulating = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    const handleMouseMove = (e) => {
      // 降低更新频率可以稍微优化性能，但核心修复在 useMemo
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 复利模拟器逻辑
  const startSimulation = () => {
    if (isSimulating.current) return;
    isSimulating.current = true;
    setYear(0);
    setSavings(10000);
    setCompound(10000);
    
    let currentYear = 0;
    let currentSavings = 10000;
    let currentCompound = 10000;

    const interval = setInterval(() => {
      currentYear++;
      currentSavings += 10000;
      currentCompound = (currentCompound + 10000) * 1.10;

      setYear(currentYear);
      setSavings(currentSavings);
      setCompound(currentCompound);

      if (currentYear >= 20) {
        clearInterval(interval);
        isSimulating.current = false;
      }
    }, 150);
  };

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-slate-300 selection:bg-blue-500/30 overflow-x-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-[#000000]"></div>
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-20 transition-transform duration-100 ease-out"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
      </div>

      {/* 顶部进度条 */}
      <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 shadow-[0_0_15px_rgba(37,99,235,0.8)]" style={{ width: `${scrollProgress * 100}%` }} />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center p-6 relative">
        <div className="z-10 animate-fade-in-up flex flex-col items-center max-w-4xl">
          <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-sm font-semibold mb-8 tracking-wider backdrop-blur-md">
            <Sparkles size={16} className="text-blue-400" /> 查理·芒格的人生算法
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-6 leading-none tracking-tighter">
            <span className="text-slate-200 block md:inline">第一个</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 filter drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              10万
            </span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
            "最难的不是赚钱，而是忍受<span className="text-white font-medium border-b border-blue-500/50">变富之前的无聊</span>。"
          </p>
          
          <div className="animate-bounce text-slate-500 flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] opacity-70">向下滚动开始觉醒</span>
            <ArrowDown className="text-blue-500" />
          </div>
        </div>
      </section>

      {/* Section 1: 痛苦的门槛 */}
      <Section title="痛苦的门槛" icon={Target}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-lg leading-relaxed">
            <h3 className="text-2xl font-bold text-white">为什么这是最难的一关？</h3>
            <p>芒格说，存第一个10万就像在没有助力的斜坡上推石头。</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">1</span>
                <span>你看不到显著的回报，每一分钱增长都像龟速。</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">2</span>
                <span>你必须对抗消费主义的洗脑，像苦行僧一样生活。</span>
              </li>
            </ul>
            <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-orange-500 text-orange-200 text-sm italic mt-4">
              "在这个阶段，你不是在投资，你是在为自己赎身。"
            </div>
          </div>
          {/* 动画演示区 */}
          <div className="w-full">
            <StoneAnimation />
          </div>
        </div>
      </Section>

      {/* Section 2: 复利的奇迹 */}
      <Section title="复利的拐点" icon={TrendingUp}>
        <div className="space-y-8">
          <p className="text-xl text-slate-300">
            "前几年什么都不会发生。然后有一天，它突然<span className="text-blue-400 font-bold">爆发</span>了。"
          </p>
          
          <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 relative z-10">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">时间轴: 第 <span className="text-white text-xl font-bold">{year}</span> 年</span>
                  <button 
                    onClick={startSimulation}
                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${isSimulating.current ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/40'}`}
                  >
                    {year === 0 ? '启动复利引擎 ▶' : '重置并模拟 ↻'}
                  </button>
                </div>
                
                {/* 数据展示 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                    <div className="text-xs text-slate-500 uppercase mb-1">普通储蓄 (线性)</div>
                    <div className="text-2xl font-bold text-slate-300">¥{Math.round(savings).toLocaleString()}</div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-slate-500 transition-all duration-200" style={{ width: `${(savings / 700000) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-blue-900/20 p-4 rounded-2xl border border-blue-500/30 relative overflow-hidden">
                     {/* 动态雪球背景 */}
                    <div className="absolute -right-4 -bottom-4 bg-blue-500/20 rounded-full transition-all duration-300 blur-2xl" 
                         style={{ width: `${Math.min(compound / 2000, 200)}px`, height: `${Math.min(compound / 2000, 200)}px` }}></div>
                    
                    <div className="text-xs text-blue-300 uppercase mb-1 relative z-10">复利增长 (指数)</div>
                    <div className="text-3xl font-black text-blue-100 relative z-10 drop-shadow-md">¥{Math.round(compound).toLocaleString()}</div>
                    <div className="h-1.5 w-full bg-blue-900/50 rounded-full mt-3 overflow-hidden relative z-10">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${(compound / 700000) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: 自由的盾牌 */}
      <Section title="购买自由，而非商品" icon={Shield}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 动画演示 */}
          <ShieldAnimation />

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">什么是 "Fuck You Money"?</h3>
            <p className="text-slate-300 text-lg">
              芒格认为，金钱最大的价值不是消费，而是<span className="text-blue-400 font-bold">拒绝权</span>。当你有了10万存款：
            </p>
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <Unlock className="text-green-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-200">职场自由</h4>
                  <p className="text-sm text-slate-400">你可以对无理的老板说“不”，而不必担心下个月饿死。</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-colors">
                <Brain className="text-purple-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-200">决策理性</h4>
                  <p className="text-sm text-slate-400">你不再因为恐慌而做决定，你可以等待最好的机会。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

       {/* Section 4: 等待的艺术 */}
       <Section title="耐心：终极策略" icon={Snowflake}>
        <div className="space-y-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* 卡片 1 */}
            <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors group">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">🎰</div>
              <h3 className="font-bold text-red-400 mb-2">赌徒</h3>
              <p className="text-sm text-slate-500">追求一夜暴富，频繁交易，最终归零。</p>
            </div>
             {/* 卡片 2 (高亮) */}
            <div className="p-8 bg-gradient-to-b from-blue-900/40 to-slate-900/40 rounded-3xl border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.15)] transform scale-105 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <div className="text-5xl mb-4">🦁</div>
              <h3 className="font-bold text-blue-300 text-xl mb-3">智者 (芒格)</h3>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                大部分时间什么都不做（极度耐心），死死抱住现金。等到机会来临时，<span className="font-bold text-white">重仓出击</span>。
              </p>
            </div>
             {/* 卡片 3 */}
            <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors group">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">🐢</div>
              <h3 className="font-bold text-yellow-400 mb-2">普通人</h3>
              <p className="text-sm text-slate-500">随波逐流，有些积蓄就想消费，永远无法积累资本。</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 italic">"如果你不能忍受看着你的钱在银行里'发霉'，你就永远无法变得富有。"</p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-black text-white py-32 px-6 text-center border-t border-slate-900">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-600">
            准备好开始修行了吗？
          </h2>
          <button className="px-12 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            设定目标：¥100,000
          </button>
        </div>
      </footer>
      
      {/* 动画样式 */}
      <style>{`
        @keyframes push-uphill {
          0% { left: 10%; bottom: 10%; transform: rotate(0deg); }
          100% { left: 50%; bottom: 80%; transform: rotate(360deg); }
        }
        @keyframes roll-downhill {
          0% { left: 50%; bottom: 80%; transform: rotate(0deg); }
          100% { left: 90%; bottom: 10%; transform: rotate(720deg) scale(1.5); }
        }
        @keyframes attack-shield {
          0% { opacity: 0; transform: scale(0.5); }
          10% { opacity: 1; transform: scale(1); }
          90% { opacity: 1; }
          100% { top: 50%; left: 50%; opacity: 0; transform: scale(0); } /* 撞击盾牌消失 */
        }
        .animate-push-uphill {
          animation: push-uphill 4s linear forwards;
        }
        .animate-roll-downhill {
          animation: roll-downhill 3s ease-in forwards;
        }
        .animate-attack-shield {
          animation: attack-shield 2s ease-in infinite; /* 关键修改：infinite */
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MungerWisdom;