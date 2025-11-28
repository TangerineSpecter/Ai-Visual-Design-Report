import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronDown, Scissors, TrendingDown, Scale, Printer } from 'lucide-react';

export default function App() {
  // --- State for Chart Interactivity ---
  const [chartState, setChartState] = useState({
    productivity: true,
    short: false,
    long: false,
  });

  const [tooltip, setTooltip] = useState({
    title: "基础",
    desc: "这是经济的基准线。如果没有任何信贷，经济增长只能靠生产率提高。",
    opacity: 1,
  });

  // --- Scroll Observer Logic ---
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-up');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // --- Chart Logic ---
  const toggleChart = (type) => {
    setChartState(prev => {
      let newState = { ...prev };
      
      if (type === 'short') {
        newState.short = !prev.short;
        if (!newState.short) newState.long = false; // Turn off long if short is off
      } else if (type === 'long') {
        if (!prev.short) newState.short = true; // Auto turn on short
        newState.long = !prev.long;
      }
      
      // Update Tooltip based on new state
      let activeKey = 'productivity';
      if (newState.long) activeKey = 'long';
      else if (newState.short) activeKey = 'short';

      const tooltips = {
        productivity: { title: "基础", desc: "这是经济的基准线。如果没有任何信贷，经济增长只能靠生产率提高。" },
        short: { title: "短期波动", desc: "信贷很容易产生，也很容易消失。央行通过升息降息控制这个5-8年的周期。" },
        long: { title: "长期叠加", desc: "注意看！长期债务周期的大浪把短周期抬高了，直到到达不可持续的顶点（去杠杆时刻）。" }
      };

      setTooltip({ ...tooltips[activeKey], opacity: 0 });
      setTimeout(() => setTooltip({ ...tooltips[activeKey], opacity: 1 }), 100);

      return newState;
    });
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      <style>{`
        /* 1. Dynamic Grid Background */
        .grid-bg {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(30, 41, 59, 0.5) 1px, transparent 1px);
          mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
          animation: moveGrid 20s linear infinite;
        }
        @keyframes moveGrid {
          from { transform: translateY(0); }
          to { transform: translateY(50px); }
        }

        /* 2. Path Drawing Animation */
        .path-draw {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          transition: stroke-dashoffset 2.5s ease-out, opacity 0.5s ease;
        }
        .path-draw.active {
          stroke-dashoffset: 0;
          opacity: 1;
        }
        .path-hidden {
          opacity: 0;
          stroke-dashoffset: 2000;
        }

        /* 3. Neon Text */
        .neon-text {
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.5),
                       0 0 20px rgba(56, 189, 248, 0.3);
        }

        /* 4. Glass Card */
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .glass-card:hover {
          transform: translateY(-5px) scale(1.02);
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 20px 40px -10px rgba(56, 189, 248, 0.15);
        }

        /* 5. Gear Spin */
        .gear-spin { animation: spin 30s linear infinite; }
        .gear-spin-reverse { animation: spinReverse 40s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes spinReverse { 100% { transform: rotate(-360deg); } }

        /* 6. Reveal Animation */
        .reveal-up {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal-up.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* --- Background Layers --- */}
      {/* Changed to absolute to stay within container when embedded */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* --- Navbar --- */}
      {/* Changed to sticky to respect container width */}
      <nav className="sticky top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-lg tracking-wider cursor-pointer hover:scale-105 transition-transform">
            <div className="relative w-6 h-6 text-cyan-400">
               <GearIcon className="w-full h-full gear-spin" />
            </div>
            <span className="text-white">ECONOMIC <span className="text-cyan-400">MACHINE</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-slate-400 font-medium">
            <a href="#forces" className="hover:text-cyan-400 transition-colors">三股动力</a>
            <a href="#chart" className="hover:text-cyan-400 transition-colors">周期图解</a>
            <a href="#deleveraging" className="hover:text-cyan-400 transition-colors">去杠杆化</a>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative z-10 min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Gears */}
        <div className="absolute -right-64 top-1/4 w-[800px] h-[800px] text-slate-800/30 pointer-events-none">
             <GearIcon className="w-full h-full gear-spin" />
        </div>
        <div className="absolute -left-64 bottom-0 w-[600px] h-[600px] text-slate-800/30 pointer-events-none">
             <GearIcon className="w-full h-full gear-spin-reverse" />
        </div>

        <div className="text-center px-4 max-w-4xl mx-auto relative">
          <div className="reveal-up inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest mb-8 uppercase">
            Based on Ray Dalio's Principles
          </div>
          
          <h1 className="reveal-up text-6xl md:text-8xl font-black text-white tracking-tight leading-none mb-8" style={{transitionDelay: '100ms'}}>
            经济是一部<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text">简单的机器</span>
          </h1>
          
          <p className="reveal-up text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed" style={{transitionDelay: '200ms'}}>
            看似复杂，实则是由无数次简单的<strong>“交易”</strong>重复构成。理解这三个主要动力，你就能看清经济周期的本质。
          </p>

          <div className="reveal-up flex justify-center gap-4" style={{transitionDelay: '300ms'}}>
            <a href="#forces" className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center gap-2">
              启动机器
              <Play className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>
      </header>

      {/* --- Section 1: The Transaction Formula --- */}
      <section className="py-24 relative z-10 bg-slate-950/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-card p-12 rounded-3xl text-center reveal-up">
            <h3 className="text-2xl font-bold text-slate-200 mb-8">经济的最基本粒子：<span className="text-cyan-400">交易</span></h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-4 animate-pulse">💰</div>
                <div className="text-lg font-bold">货币 + 信贷</div>
                <div className="text-sm text-slate-500">支出总额</div>
              </div>
              <div className="text-3xl text-slate-600 font-light">÷</div>
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-4">📦</div>
                <div className="text-lg font-bold">商品/服务/资产</div>
                <div className="text-sm text-slate-500">销量</div>
              </div>
              <div className="text-3xl text-cyan-500 font-bold">=</div>
              <div className="flex flex-col items-center p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
                <div className="text-4xl font-black text-cyan-400 mb-2">价格</div>
                <div className="text-xs text-cyan-300/70">PRICE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Three Forces --- */}
      <section id="forces" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 reveal-up">
            <span className="text-cyan-500 font-mono text-sm tracking-widest">SYSTEM INPUTS</span>
            <h2 className="text-4xl font-bold mt-2 text-white">驱动经济的三股动力</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Force 1 */}
            <div className="glass-card p-8 rounded-2xl reveal-up" style={{transitionDelay: '100ms'}}>
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mb-6 border border-emerald-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">1. 生产率的提高</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">勤奋和创新带来的知识积累。这是一条缓慢上升的直线。</p>
            </div>

            {/* Force 2 */}
            <div className="glass-card p-8 rounded-2xl reveal-up" style={{transitionDelay: '200ms'}}>
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-6 border border-blue-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">2. 短期债务周期</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">持续 <strong>5-8年</strong>。主要由央行通过利率控制（信贷扩张与收缩）。</p>
            </div>

            {/* Force 3 */}
            <div className="glass-card p-8 rounded-2xl reveal-up" style={{transitionDelay: '300ms'}}>
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-6 border border-purple-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">3. 长期债务周期</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">持续 <strong>75-100年</strong>。债务积累最终超过收入，导致泡沫破裂。</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Interactive Chart Builder --- */}
      <section id="chart" className="py-20 bg-slate-900 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '100% 40px'}}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10 reveal-up">
            <h2 className="text-3xl font-bold text-white mb-4">模型构建器：拼装你的经济机器</h2>
            <p className="text-slate-400">点击下方按钮，逐步叠加三股动力，看清复杂曲线背后的简单逻辑。</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Controls Side (Left) */}
            <div className="lg:col-span-4 space-y-4 reveal-up">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Layers</div>
              
              <ChartButton 
                active={chartState.productivity} 
                onClick={() => toggleChart('productivity')} 
                color="emerald"
                title="生产率增长"
                desc="一条笔直向上的斜线。代表人类知识的积累，长期看它是最重要的。"
              />
              
              <ChartButton 
                active={chartState.short} 
                onClick={() => toggleChart('short')} 
                color="blue"
                title="叠加：短期债务周期"
                desc="围绕生产率的小波浪。由央行利率政策驱动（5-8年）。"
              />

              <ChartButton 
                active={chartState.long} 
                onClick={() => toggleChart('long')} 
                color="purple"
                title="叠加：长期债务周期"
                desc="这是真正的大浪。几十年的人性贪婪积累，最终形成巨大的泡沫和萧条。"
              />
            </div>

            {/* Chart Side (Right) */}
            <div className="lg:col-span-8 reveal-up">
              <div className="glass-card rounded-2xl p-6 h-[400px] md:h-[500px] relative flex flex-col justify-end overflow-hidden">
                {/* Legend */}
                <div className="absolute top-6 left-6 flex flex-col sm:flex-row gap-4 text-xs font-mono z-20">
                  <div className={`flex items-center gap-2 transition-opacity duration-300 ${chartState.productivity ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>生产率
                  </div>
                  <div className={`flex items-center gap-2 transition-opacity duration-300 ${chartState.short ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>短期周期
                  </div>
                  <div className={`flex items-center gap-2 transition-opacity duration-300 ${chartState.long ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>长期周期
                  </div>
                </div>

                <svg className="w-full h-full absolute inset-0 p-4" viewBox="0 0 800 450" preserveAspectRatio="none">
                  {/* Productivity Line */}
                  <path 
                    className={`path-draw ${chartState.productivity ? 'active' : 'path-hidden'}`} 
                    d="M0,400 L800,50" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3" 
                    strokeDasharray="8,8" 
                    opacity="0.8" 
                  />
                  
                  {/* Short Term */}
                  <path 
                    className={`path-draw ${chartState.short ? 'active' : 'path-hidden'}`} 
                    d="M0,400 Q25,360 50,380 T100,356 T150,335 T200,313 T250,292 T300,270 T350,248 T400,227 T450,205 T500,183 T550,162 T600,140 T650,119 T700,97 T750,75 T800,50" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                  />
                  
                  {/* Long Term */}
                  <path 
                    className={`path-draw ${chartState.long ? 'active' : 'path-hidden'}`} 
                    d="M0,400 C150,350 300,450 450,200 C500,100 600,250 800,20" 
                    fill="none" 
                    stroke="#a855f7" 
                    strokeWidth="5" 
                    strokeLinecap="round" 
                  />
                </svg>

                {/* Dynamic Overlay */}
                <div 
                  className={`absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur border border-white/10 p-4 rounded-xl max-w-xs transition-all duration-500 transform ${tooltip.opacity ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <h5 className="text-white font-bold mb-1">{tooltip.title}</h5>
                  <p className="text-slate-400 text-xs leading-relaxed">{tooltip.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 4: Deleveraging --- */}
      <section id="deleveraging" className="py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 reveal-up">
            <div className="inline-block p-3 rounded-full bg-red-500/10 mb-4 animate-pulse">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">泡沫破裂：去杠杆化</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">当利率降无可降（接近0%），传统的货币政策失效。这时候必须采取四种措施。</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DeleverageCard 
              icon={<Scissors className="w-8 h-8" />}
              color="red"
              title="1. 削减支出"
              desc="即“紧缩”。但这会导致收入下降快于还债，反而加重负担。"
            />
            <DeleverageCard 
              icon={<TrendingDown className="w-8 h-8" />}
              color="orange"
              title="2. 债务违约"
              desc="债务重组。银行资产缩水，人们发现财富其实是幻觉。"
              delay="100ms"
            />
            <DeleverageCard 
              icon={<Scale className="w-8 h-8" />}
              color="yellow"
              title="3. 财富再分配"
              desc="向富人增税补贴穷人。可能导致社会动荡。"
              delay="200ms"
            />
            <DeleverageCard 
              icon={<Printer className="w-8 h-8" />}
              color="cyan"
              title="4. 发行货币"
              desc="央行印钞购买资产。这是唯一的通胀性措施，用于平衡前三者的通缩。"
              delay="300ms"
            />
          </div>

          {/* Beautiful Deleveraging */}
          <div className="mt-16 glass-card p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl reveal-up">
            <div className="bg-slate-950 rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">✨ 和谐的去杠杆化 (Beautiful Deleveraging)</h3>
              <p className="text-slate-300 max-w-2xl mx-auto relative z-10">
                关键在于<span className="text-cyan-400 font-bold">平衡</span>。如果决策者能平衡通缩力量（削减支出、违约）和通胀力量（印钞），债务收入比就会下降，同时经济保持正增长。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-12 text-white">最后的忠告</h2>
          <div className="space-y-6 text-left">
            <RuleCard icon="🚫" title="不要让债务增长速度超过收入" desc="因为债务负担最终会将你压垮。" />
            <RuleCard icon="📈" title="不要让收入增长速度超过生产率" desc="因为这最终会使你失去竞争力。" />
            <RuleCard icon="🚀" title="尽一切努力提高生产率" desc="因为生产率在长期内起着最关键的作用。" />
          </div>
          <div className="mt-20 text-slate-600 text-xs">
            Designed with <span className="text-red-500">♥</span> based on Ray Dalio's "How The Economic Machine Works"
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function ChartButton({ active, onClick, color, title, desc }) {
  const colorMap = {
    emerald: 'text-emerald-400 border-emerald-500 group-hover:text-emerald-300',
    blue: 'text-blue-400 border-blue-500 group-hover:text-blue-300',
    purple: 'text-purple-400 border-purple-500 group-hover:text-purple-300',
  };

  const bgMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl flex items-start gap-4 transition-all duration-300 border border-transparent group hover:bg-white/5 ${active ? 'bg-slate-900/80 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}`}
    >
      <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${colorMap[color].split(' ')[1]}`}>
        <div className={`w-2.5 h-2.5 rounded-full transition-opacity ${bgMap[color]} ${active ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
      <div>
        <h4 className={`font-bold text-lg ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[2]}`}>{title}</h4>
        <p className="text-sm text-slate-400 mt-1">{desc}</p>
      </div>
    </button>
  );
}

function DeleverageCard({ icon, color, title, desc, delay }) {
  const colorClasses = {
    red: 'text-red-400 border-t-red-500 hover:bg-red-900/10',
    orange: 'text-orange-400 border-t-orange-500 hover:bg-orange-900/10',
    yellow: 'text-yellow-400 border-t-yellow-500 hover:bg-yellow-900/10',
    cyan: 'text-cyan-400 border-t-cyan-500 hover:bg-cyan-900/10',
  };

  return (
    <div className={`glass-card p-6 rounded-xl border-t-4 reveal-up ${colorClasses[color]}`} style={{transitionDelay: delay}}>
      <div className="mb-4">{icon}</div>
      <h4 className={`text-lg font-bold ${colorClasses[color].split(' ')[0]}`}>{title}</h4>
      <p className="text-xs text-slate-400 mt-2">{desc}</p>
    </div>
  );
}

function RuleCard({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="font-bold text-slate-200">{title}</h4>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function GearIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
      <path d="M12 2v2"/>
      <path d="M12 22v-2"/>
      <path d="m17 20.66-1-1.73"/>
      <path d="M11 10.27 7 3.34"/>
      <path d="m20.66 17-1.73-1"/>
      <path d="m3.34 7 1.73 1"/>
      <path d="M14 12h8"/>
      <path d="M2 12h2"/>
      <path d="m20.66 7-1.73 1"/>
      <path d="m3.34 17 1.73-1"/>
      <path d="m17 3.34-1 1.73"/>
      <path d="m11 13.73-4 6.93"/>
    </svg>
  );
}