import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Activity, 
  BarChart2, 
  ListChecks, 
  Home, 
  Ruler, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Anchor
} from 'lucide-react';

// --- Components ---

// 1. Navigation Bar
const Navbar = () => {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'measurement', 'clock', 'patterns', 'ma-system', 'checklist'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };
};

// 2. Custom SVG Chart Component (Lightweight replacement for Chart.js)
const SvgLineChart = ({ type }) => {
  const width = 600;
  const height = 300;
  
  // Generate data based on type
  const paths = useMemo(() => {
    const points = 50;
    const step = width / points;
    let pathData = { price: '', ma20: '', ma60: '', ma120: '' };
    
    // Helper to build path string
    const buildPath = (dataArr) => {
      return dataArr.map((y, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - y}`).join(' ');
    };

    if (type === 'consolidation') {
      // Sideways Data
      const base = height / 2;
      const priceData = Array.from({length: points}, () => base + (Math.random() - 0.5) * 40);
      const ma20 = priceData.map((_, i) => base + Math.sin(i * 0.2) * 15 + (Math.random() - 0.5) * 5);
      const ma60 = priceData.map((_, i) => base + Math.cos(i * 0.15) * 10);
      const ma120 = priceData.map((_, i) => base + Math.sin(i * 0.1) * 5);

      return {
        price: buildPath(priceData),
        ma20: buildPath(ma20),
        ma60: buildPath(ma60),
        ma120: buildPath(ma120)
      };
    } else {
      // Uptrend Data
      const priceData = Array.from({length: points}, (_, i) => 50 + (i * 4) + (Math.random() - 0.5) * 30);
      const ma20 = Array.from({length: points}, (_, i) => 50 + (i * 3.8) - 10);
      const ma60 = Array.from({length: points}, (_, i) => 50 + (i * 3.2) - 20);
      const ma120 = Array.from({length: points}, (_, i) => 50 + (i * 2.5) - 30);

      return {
        price: buildPath(priceData),
        ma20: buildPath(ma20),
        ma60: buildPath(ma60),
        ma120: buildPath(ma120)
      };
    }
  }, [type]);

  return (
    <div className="w-full h-[300px] bg-slate-800 border border-slate-700 rounded-xl overflow-hidden relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full p-4" preserveAspectRatio="none">
        {/* Grid Lines */}
        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#334155" strokeDasharray="5,5" strokeWidth="1" />
        
        {/* Lines */}
        {/* MA120 (Red) */}
        <path d={paths.ma120} fill="none" stroke="#f87171" strokeWidth="3" />
        {/* MA60 (Green) */}
        <path d={paths.ma60} fill="none" stroke="#4ade80" strokeWidth="3" />
        {/* MA20 (Blue) */}
        <path d={paths.ma20} fill="none" stroke="#38bdf8" strokeWidth="3" />
        {/* Price (White Dashed) */}
        <path d={paths.price} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeDasharray="4,4" />
      </svg>
      {/* Legend */}
      <div className="absolute top-4 left-4 flex gap-3 text-xs font-mono">
        <span className="text-white opacity-60">Price</span>
        <span className="text-sky-400">MA20</span>
        <span className="text-green-400">MA60</span>
        <span className="text-red-400">MA120</span>
      </div>
    </div>
  );
};

// 3. Main Application Component
const TrendTradeAnalysisReport = () => {
  const [clockRotation, setClockRotation] = useState(45); // Default to 1:30

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-sky-500/30">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-[60px] pb-20 flex flex-col gap-24">
        
        {/* Hero Section */}
        <section id="intro" className="flex flex-col gap-6">
          <div className="text-green-400 font-bold tracking-widest text-sm uppercase">Deep Dive Learning</div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            趋势交易深度解析
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            基于视频内容的深度分析笔记。本文将解构“时钟方向”隐喻，结合均线系统与对数坐标，为您构建一套完整的趋势跟踪交易体系。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
              <Clock className="text-sky-400" size={32} />
              <div>
                <div className="text-xs text-slate-400 mb-1">核心模型</div>
                <div className="font-bold text-lg">时钟隐喻 (Clock Metaphor)</div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
              <BarChart2 className="text-green-400" size={32} />
              <div>
                <div className="text-xs text-slate-400 mb-1">核心工具</div>
                <div className="font-bold text-lg">对数坐标 (Log Scale)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Measurement Section */}
        <section id="measurement">
          <h2 className="text-3xl font-bold text-sky-400 border-b border-slate-800 pb-4 mb-8">
            01. 趋势的度量标准
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">为什么必须用对数坐标？</h3>
              <p className="text-slate-400 text-lg mb-6">
                交易中最大的误区之一是使用普通坐标看长线趋势。在对数坐标下，不同时期的趋势斜率才具备可比性。
              </p>
              <div className="bg-sky-500/10 border-l-4 border-sky-400 p-5 rounded-r-lg">
                <p className="text-sky-100 font-medium">
                  核心原理：普通坐标展示绝对价格变化，对数坐标展示涨跌幅百分比。
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-sky-400 mb-6">观察窗口设定</h3>
              <ul className="space-y-6">
                <li>
                  <strong className="block text-lg mb-1 text-slate-200">长期趋势 (Long Term)</strong>
                  <span className="text-slate-400">建议固定图表长度为 <span className="text-white font-mono bg-slate-700 px-2 py-0.5 rounded">5年</span>，以此判断大周期的斜率方向。</span>
                </li>
                <li>
                  <strong className="block text-lg mb-1 text-slate-200">短期趋势 (Short Term)</strong>
                  <span className="text-slate-400">建议固定图表长度为 <span className="text-white font-mono bg-slate-700 px-2 py-0.5 rounded">1年</span>，用于寻找具体的入场时机。</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Clock Metaphor Section */}
        <section id="clock">
          <h2 className="text-3xl font-bold text-sky-400 border-b border-slate-800 pb-4 mb-8">
            02. 核心隐喻：时钟方向
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            演讲者将趋势的斜率比作时钟指针的方向，这是判断当下市场状态最直观的方法。
            <span className="text-sm block mt-2 text-slate-500">* 鼠标悬停在下方卡片上，查看左侧时钟演示</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Clock */}
            <div className="relative w-[300px] h-[300px] mx-auto bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center shadow-2xl shadow-black/50">
              <div className="w-4 h-4 bg-white rounded-full z-10 shadow-lg"></div>
              {/* Clock Hand */}
              <div 
                className="absolute bottom-1/2 left-1/2 w-1.5 h-[40%] bg-slate-300 rounded-full origin-bottom transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-50%) rotate(${clockRotation}deg)` }}
              ></div>
              
              {/* Zones */}
              <div className="absolute top-4 right-20 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded">狂热</div>
              <div className="absolute top-16 right-4 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded">利润区</div>
              <div className="absolute top-36 right-4 bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded">垃圾时间</div>
              <div className="absolute bottom-16 right-10 bg-slate-500/90 text-white text-xs font-bold px-2 py-1 rounded">下跌</div>
            </div>

            {/* Interactive Cards */}
            <div className="flex flex-col gap-4">
              <div 
                className="bg-slate-800 p-6 rounded-xl border-l-4 border-red-400 cursor-pointer hover:bg-slate-750 transition-colors group"
                onMouseEnter={() => setClockRotation(15)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-lg">12:00 - 01:00</span>
                  <span className="text-xs bg-red-400/20 text-red-400 px-3 py-1 rounded-full font-bold">极度狂热</span>
                </div>
                <p className="text-slate-400 group-hover:text-slate-200">
                  斜率近90度，偏离均线极远。 <strong className="text-red-400 block mt-1">动作：高风险，准备离场。</strong>
                </p>
              </div>

              <div 
                className="bg-slate-800 p-6 rounded-xl border-l-4 border-green-400 cursor-pointer hover:bg-slate-750 transition-colors group"
                onMouseEnter={() => setClockRotation(50)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-lg">01:00 - 02:30</span>
                  <span className="text-xs bg-green-400/20 text-green-400 px-3 py-1 rounded-full font-bold">黄金赛道</span>
                </div>
                <p className="text-slate-400 group-hover:text-slate-200">
                  斜率30°-60°，均线多头排列。 <strong className="text-green-400 block mt-1">动作：持有 / 加仓。</strong>
                </p>
              </div>

              <div 
                className="bg-slate-800 p-6 rounded-xl border-l-4 border-yellow-400 cursor-pointer hover:bg-slate-750 transition-colors group"
                onMouseEnter={() => setClockRotation(90)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-lg">02:30 - 03:30</span>
                  <span className="text-xs bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full font-bold">横盘震荡</span>
                </div>
                <p className="text-slate-400 group-hover:text-slate-200">
                  无明显方向，均线缠绕。 <strong className="text-yellow-400 block mt-1">动作：空仓观望 (垃圾时间)。</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Patterns Section */}
        <section id="patterns">
          <h2 className="text-3xl font-bold text-sky-400 border-b border-slate-800 pb-4 mb-8">
            03. 关键形态深度解析
          </h2>

          <div className="flex flex-col gap-16">
            {/* Consolidation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Activity size={24} />
                  密集成交区 (Consolidation)
                </h3>
                <p className="text-slate-400 mb-4">
                  这是市场成本“统一”的过程，也是大行情的蓄力阶段。别名：筹码密集区、中继形态。
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-slate-300">
                    <XCircle size={18} className="text-red-400" />
                    <span><strong>特征：</strong> 三条均线像麻花一样高度纠缠。</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <AlertTriangle size={18} className="text-yellow-400" />
                    <span><strong>策略：</strong> 垃圾时间，只看不做。</span>
                  </li>
                </ul>
                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <strong className="text-red-200 block mb-1">⚠️ 风险提示：假突破 (The Trap)</strong>
                  <p className="text-sm text-red-300/80">
                    如果价格突破密集区后，没有延续，而是快速反向跌回区间内，立即反手或止损。
                  </p>
                </div>
              </div>
              <SvgLineChart type="consolidation" />
            </div>

            {/* Uptrend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="order-2 md:order-1">
                <SvgLineChart type="uptrend" />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <TrendingUp size={24} />
                  稳定趋势 (Stable Trend)
                </h3>
                <p className="text-slate-400 mb-4">
                  这是真正的大行情，斜率维持在30度到60度之间。
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-green-400" />
                    <span><strong>多头排列：</strong> 短期(蓝) &gt; 中期(绿) &gt; 长期(红)。</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-green-400" />
                    <span><strong>发散形状：</strong> 均线发散，成本稳步抬升。</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <Anchor size={18} className="text-sky-400" />
                    <span><strong>入场策略：</strong> 第一次回踩蓝色线，或深幅回踩绿色线不破。</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MA System Section */}
        <section id="ma-system">
          <h2 className="text-3xl font-bold text-sky-400 border-b border-slate-800 pb-4 mb-8">
            04. 均线系统设置
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center hover:border-sky-500/50 transition-colors">
              <div className="text-5xl font-mono font-bold text-sky-400 mb-2">20</div>
              <div className="text-sm text-slate-400 mb-4">MA20 + EMA20</div>
              <div className="font-bold text-white">短期成本</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center hover:border-green-500/50 transition-colors">
              <div className="text-5xl font-mono font-bold text-green-400 mb-2">60</div>
              <div className="text-sm text-slate-400 mb-4">MA60 + EMA60</div>
              <div className="font-bold text-white">中期成本 (季线)</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center hover:border-red-500/50 transition-colors">
              <div className="text-5xl font-mono font-bold text-red-400 mb-2">120</div>
              <div className="text-sm text-slate-400 mb-4">MA120 + EMA120</div>
              <div className="font-bold text-white">长期成本 (半年线)</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-bold text-lg text-sky-400 flex items-center gap-2 mb-2">
                <Activity size={20} /> 关键性波动
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                不是所有的波动都重要。市场充满了噪音。只有那些<strong className="text-white">改变了均线运行方向</strong>的波动，才是关键性波动。
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-bold text-lg text-sky-400 flex items-center gap-2 mb-2">
                <Ruler size={20} /> 抵扣价原理
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                均线是N天的平均价。明天均线要涨，明天的收盘价必须高于“N天前”的收盘价。如果价格持续高于抵扣价，均线就会持续向上。
              </p>
            </div>
          </div>
        </section>

        {/* Checklist Section */}
        <section id="checklist">
          <h2 className="text-3xl font-bold text-sky-400 border-b border-slate-800 pb-4 mb-8">
            05. 实战执行清单 (SOP)
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { id: 1, title: '打开图表，设置环境', desc: '切换至对数坐标 (Log Scale)，将图表时间跨度固定为5年查看大势。', color: 'bg-sky-500' },
              { id: 2, title: '定性趋势 (时钟定位)', desc: '判断当前处于时钟的哪个区域？只参与 1:00 - 2:30 的行情。如果是 2:30 - 3:30 (震荡)，坚决休息。', color: 'bg-sky-500' },
              { id: 3, title: '寻找买点 (Sniper Mode)', desc: '确认长期均线 (60/120) 方向向上。等待价格回踩均线组，观察是否获得支撑（不破位）。', color: 'bg-sky-500' },
              { id: 4, title: '底线风控 (Stop Loss)', desc: '均线排列结构一旦被破坏，或者出现乱序交叉，无条件离场。', color: 'bg-red-500' },
            ].map((step) => (
              <div key={step.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-start gap-5">
                <div className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {step.id}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white mb-1">{step.title}</h4>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Quote */}
        <footer className="mt-12 mb-20">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900 opacity-50"></div>
            <div className="relative z-10">
              <blockquote className="text-2xl md:text-4xl font-serif italic text-white mb-6 leading-tight">
                "我喜欢坐轿子，不喜欢给人抬轿子。"
              </blockquote>
              <div className="text-green-400 font-bold mb-2">— 趋势交易哲学</div>
              <div className="text-slate-500">(只做趋势确立后的跟随者，不做震荡期的消耗者)</div>
            </div>
          </div>
          <div className="text-center text-slate-600 text-sm mt-8">
            © 2025 Trend Trading Notes. Visualized for Deep Learning.
          </div>
        </footer>

      </main>
    </div>
  );
};

export default TrendTradeAnalysisReport;
