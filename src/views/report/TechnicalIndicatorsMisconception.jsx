import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Anchor, Activity, Thermometer, TrendingUp, TrendingDown, Play, ArrowRight, Info } from 'lucide-react';

// --- Shared Components ---

const SectionTitle = ({ icon: Icon, title, colorClass = "text-white" }) => (
  <div className={`flex items-center space-x-3 mb-4 ${colorClass}`}>
    <Icon className="w-8 h-8" strokeWidth={2} />
    <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
  </div>
);

// --- Hero Section ---

const Hero = ({ onStart }) => {
  return (
    <header className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-0"></div>
      
      {/* Decorative Background Chart */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
        <svg className="w-full h-full">
          <path d="M0,500 Q200,300 400,600 T800,400 T1200,500" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <div className="z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-4 border border-blue-500/30">
          基于 Lester路肖南 交易哲学
        </span>
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          透过迷雾看本质
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
          为什么画线总是“看似有效”？技术指标真的是未来的水晶球吗？<br />
          带你通过可视化实验，揭开交易指标背后的真相。
        </p>
        <button 
          onClick={onStart}
          className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 flex items-center mx-auto gap-2"
        >
          <Play size={20} fill="currentColor" /> 开始探索
        </button>
      </div>
    </header>
  );
};

// --- Section 1: Random Lines (Anchoring Bias) ---

const RandomLinesSection = () => {
  const [pricePath, setPricePath] = useState("");
  const [randomLines, setRandomLines] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const containerRef = useRef(null);
  
  // Generate Price Path on Mount
  useEffect(() => {
    generateNewPath();
  }, []);

  const generateNewPath = () => {
    let path = "M 0,125";
    let y = 125;
    const width = 500;
    const height = 250;
    const points = []; // for collision detection logic mock
    
    for (let x = 0; x <= width; x += 10) {
      let delta = (Math.random() - 0.5) * 30;
      y += delta;
      y = Math.max(20, Math.min(height - 20, y));
      path += ` L ${x},${y}`;
      points.push(y);
    }
    setPricePath(path);
    setRandomLines([]);
    setFeedback(null);
    return points;
  };

  const handleGenerateRandomLines = () => {
    const height = 250;
    const newLines = [];
    let hitCount = 0;

    // Simulate drawing 3 random lines
    for (let i = 0; i < 3; i++) {
      const y = Math.random() * (height - 40) + 20;
      newLines.push({ y, delay: i * 200 });
      // Mock "Anchoring" logic: purely random, but we tell user it "hit" something
      if (Math.random() > 0.3) hitCount++; 
    }
    
    setRandomLines([]);
    setFeedback(null);

    // Sequence animation
    setTimeout(() => {
      setRandomLines(newLines);
      setTimeout(() => {
        setFeedback(hitCount > 0 ? hitCount : 1); // Always show at least 1 "fake" hit for the lesson
      }, 800);
    }, 100);
  };

  return (
    <section id="section1" className="min-h-screen flex flex-col md:flex-row items-center justify-center p-6 bg-slate-900 border-t border-slate-800 relative">
      <div className="md:w-1/2 p-6 z-10 space-y-6 md:pr-12">
        <SectionTitle icon={Anchor} title="实验一：随机画线的陷阱" colorClass="text-yellow-400" />
        <p className="text-slate-300 text-lg leading-relaxed">
          许多人认为特定的支撑阻力线非常精准。但在视频中，Lester 指出这往往是<strong>“视觉锚定”</strong>和<strong>“选择性解读”</strong>的结果。
        </p>
        <p className="text-slate-400">
          点击生成完全随机的线条。你会惊讶地发现，大脑总能强行解释出它们“有效”的地方（触碰到了高低点）。
        </p>
        <div className="bg-slate-800 p-4 rounded-lg border border-yellow-500/20">
          <p className="text-sm text-yellow-200">
            <span className="font-bold">核心观点：</span> 只要线条画在图上，你的注意力就会被锚定，并下意识忽略无效的部分，只看有效的部分。
          </p>
        </div>
      </div>

      <div className="md:w-1/2 w-full max-w-lg bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden relative z-10">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-mono text-sm text-slate-400">随机线条测试机</h3>
          <div className="flex gap-2">
            <button onClick={generateNewPath} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-colors">
              重置价格
            </button>
            <button onClick={handleGenerateRandomLines} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-xs rounded shadow transition-colors font-bold">
              生成随机线
            </button>
          </div>
        </div>
        <div className="relative h-64 w-full bg-slate-900" style={{ backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 500 250">
            <path d={pricePath} stroke="white" strokeWidth="2" fill="none" />
          </svg>
          
          {randomLines.map((line, idx) => (
            <div 
              key={idx}
              className="absolute left-0 w-full h-0.5 bg-yellow-400/70 shadow-[0_0_10px_rgba(250,204,21,0.5)] origin-left transition-transform duration-500"
              style={{ top: `${line.y}px`, transform: 'scaleX(1)', animation: `growLine 0.5s ease-out ${line.delay}ms backwards` }}
            />
          ))}

          {feedback && (
            <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-green-400 font-mono bg-black/80 p-2 rounded animate-bounce">
              检测到 <span className="text-yellow-300 font-bold">{feedback}</span> 处“精准”触碰！<br/>
              大脑正在告诉你：这也太准了吧？(其实完全是随机的)
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes growLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>
    </section>
  );
};

// --- Section 2: Moving Average (Lag Effect) ---

const MovingAverageSection = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Config
    const points = [];
    const maxPoints = canvas.width; // 1 pixel per point
    let priceY = canvas.height / 2;
    const maPeriod = 30;

    const render = () => {
      // 1. Update Data
      // Random Walk
      priceY += (Math.random() - 0.5) * 8;
      // Mean Reversion (pull back to center to keep in view)
      priceY += (canvas.height / 2 - priceY) * 0.02;

      // Add point
      const currentPoint = {
        price: priceY,
        ma: 0
      };

      points.push(currentPoint);

      // Calc MA
      if (points.length > maPeriod) {
        let sum = 0;
        for (let i = 1; i <= maPeriod; i++) {
          sum += points[points.length - i].price;
        }
        currentPoint.ma = sum / maPeriod;
      } else {
        currentPoint.ma = priceY;
      }

      // Shift if full
      if (points.length > canvas.width) {
        points.shift();
      }

      // 2. Draw
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw Price (White)
      ctx.beginPath();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(i, p.price);
        else ctx.lineTo(i, p.price);
      });
      ctx.stroke();

      // Draw MA (Blue)
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      points.forEach((p, i) => {
        if (i < maPeriod) return;
        if (i === maPeriod) ctx.moveTo(i, p.ma);
        else ctx.lineTo(i, p.ma);
      });
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    // Handle Resize roughly
    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      priceY = canvas.height / 2; // reset center
    };
    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col md:flex-row-reverse items-center justify-center p-6 bg-slate-800 relative">
      <div className="md:w-1/2 p-6 z-10 space-y-6 md:pl-12">
        <SectionTitle icon={Activity} title="实验二：均线是“成本”吗？" colorClass="text-blue-400" />
        <p className="text-slate-300 text-lg leading-relaxed">
          常有人说均线代表“市场平均持仓成本”。这是一个巨大的误解。
        </p>
        <p className="text-slate-400">
          均线仅仅是过去N根K线收盘价的<strong>算术平均</strong>。它不知道每个价格成交了多少量（权重）。它是滞后的数学计算，而不是真实的筹码分布。
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">1</div>
            <div className="flex-1">
              <h4 className="text-white font-semibold">价格变动</h4>
              <p className="text-xs text-slate-400">价格是因，先发生变化。</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xl">2</div>
            <div className="flex-1">
              <h4 className="text-slate-300 font-semibold">均线跟随</h4>
              <p className="text-xs text-slate-400">均线是果，被动跟随计算。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 w-full max-w-lg bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden p-6">
        <div className="text-center mb-4">
          <span className="text-xs font-mono text-slate-500">实时计算演示</span>
        </div>
        <div className="relative h-48 w-full border-b border-l border-slate-600 mb-4">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center"><span className="w-3 h-3 bg-white rounded-full mr-2"></span> 实时价格 (Price)</div>
          <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span> 移动平均 (MA)</div>
        </div>
        <p className="mt-4 text-xs text-center text-slate-500">
          注意观察：蓝色线永远在白色线剧烈波动之后才缓慢转向。<br/>它无法预测转折，只能确认趋势。
        </p>
      </div>
    </section>
  );
};

// --- Section 3: Blood Sugar Analogy ---

const BloodSugarSection = () => {
  const [status, setStatus] = useState('neutral'); // neutral, bad, good
  const [gaugeValue, setGaugeValue] = useState(5.5);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateHealth = (type) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStatus(type);

    // Lag effect simulation
    setTimeout(() => {
      setGaugeValue(type === 'bad' ? 11.2 : 5.5);
      setIsAnimating(false);
    }, 1200); // 1.2s lag to show the point that indicator is slow
  };

  const isBad = status === 'bad';
  
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 relative border-t border-slate-800">
      <div className="text-center max-w-3xl mb-12 space-y-4">
        <div className="flex items-center justify-center gap-3 text-emerald-400">
           <Thermometer className="w-8 h-8" />
           <h2 className="text-3xl font-bold">实验三：血糖仪的比喻</h2>
        </div>
        <p className="text-slate-300">
          指标就像血糖仪。血糖高（指标超买）是因为你长期饮食不健康（市场买盘过重）。<br />
          <strong>盯着仪器看不会改变未来，改变饮食（底层供需）才会。</strong>
        </p>
      </div>

      <div className="w-full max-w-4xl bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Input: Diet */}
          <div 
            className="flex flex-col items-center space-y-4 cursor-pointer group"
            onClick={() => updateHealth('bad')}
          >
            <div className="text-sm font-bold text-slate-400 mb-2">底层原因 (Input)</div>
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition-all ring-2 ring-slate-600 group-hover:ring-red-500">
              <span className="text-4xl" role="img" aria-label="cake">🍰</span>
            </div>
            <button className="px-4 py-1 bg-red-600/20 text-red-400 rounded-full text-xs group-hover:bg-red-600 group-hover:text-white transition">吃甜食 (买入狂热)</button>
          </div>

          {/* Arrow */}
          <ArrowRight className="text-slate-600 animate-pulse w-8 h-8 rotate-90 md:rotate-0" />

          {/* System: Body */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-sm font-bold text-slate-400 mb-2">市场状态 (Market)</div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-1000 ring-2 ring-slate-600 ${isBad ? 'bg-red-900 animate-bounce' : 'bg-emerald-900'}`}>
              <span className={`text-4xl transition-all duration-1000 ${isBad ? '' : 'filter grayscale'}`} role="img" aria-label="face">
                {isBad ? '🤢' : '😎'}
              </span>
            </div>
            <div className="text-xs text-slate-500">身体反应</div>
          </div>

          {/* Arrow */}
          <ArrowRight className="text-slate-600 animate-pulse w-8 h-8 rotate-90 md:rotate-0" />

          {/* Output: Indicator */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-sm font-bold text-slate-400 mb-2">技术指标 (Output)</div>
            <div className="relative w-32 h-24 bg-black rounded-lg border-4 border-slate-600 flex items-center justify-center overflow-hidden">
              <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${gaugeValue > 6 ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className={`text-3xl font-mono font-bold transition-colors duration-1000 ${gaugeValue > 6 ? 'text-red-500' : 'text-green-500'}`}>
                {gaugeValue}
              </span>
            </div>
            <div className="text-xs text-slate-500">只是一个滞后的读数</div>
          </div>
        </div>

        <div className="flex justify-center mt-12 gap-4 flex-wrap">
          <button 
            onClick={() => updateHealth('good')}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow transition"
            disabled={isAnimating}
          >
            恢复健康饮食 (市场冷却)
          </button>
          <button 
            onClick={() => updateHealth('bad')}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow transition"
            disabled={isAnimating}
          >
            暴饮暴食 (疯狂买入)
          </button>
        </div>
        <p className="text-center mt-6 text-sm text-slate-400">
          点击按钮观察：指标的变化永远<strong>滞后</strong>于行为的变化。
        </p>
      </div>
    </section>
  );
};

// --- Section 4: Price Action Core ---

const PriceActionSection = () => {
  const [candle, setCandle] = useState({ y: 80, height: 40, color: '#22c55e' });
  const intervalRef = useRef(null);

  const startPressure = (type) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const step = 2;
    intervalRef.current = setInterval(() => {
      setCandle(prev => {
        let newY = prev.y;
        let newHeight = prev.height;
        let newColor = prev.color;

        if (type === 'buy') {
          // Buy Pressure: Price moves UP (y decreases), Body grows UP or changes color
          newY = Math.max(10, prev.y - 1);
          newHeight = Math.min(150, prev.height + 1);
          newColor = '#22c55e'; // Green
        } else {
          // Sell Pressure: Price moves DOWN (y increases), visual simplification
          newY = Math.min(150, prev.y + 1);
          newColor = '#ef4444'; // Red
          // Keep roughly same visual mass but shift down
        }

        return { y: newY, height: newHeight, color: newColor };
      });
    }, 20);
  };

  const stopPressure = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center p-6 bg-slate-800 border-t border-slate-700">
      <div className="md:w-1/2 p-6 z-10 space-y-6 md:pr-12">
        <SectionTitle icon={TrendingUp} title="回归本质：价格行为 (Price Action)" colorClass="text-purple-400" />
        <p className="text-slate-300 text-lg leading-relaxed">
          剥离所有指标，剩下的是<strong>K线</strong>。
        </p>
        <p className="text-slate-400">
          K线不仅仅是红绿柱子，它是多空双方（买单与卖单）真金白银博弈留下的脚印。
        </p>
        <ul className="space-y-2 text-slate-300 list-disc list-inside">
          <li><span className="text-green-400">阳线实体</span> = 买方力量强势推进</li>
          <li><span className="text-red-400">上影线</span> = 卖方曾经反击并留下的痕迹</li>
          <li><span className="text-purple-400">成交量</span> = 双方交战的激烈程度</li>
        </ul>
        <div className="bg-purple-900/30 p-4 rounded border-l-4 border-purple-500 mt-4">
          <p className="text-sm italic text-purple-200">
            "我首先图表要保持干净。交易千万不要有废动作。" —— Lester
          </p>
        </div>
      </div>

      <div className="md:w-1/2 w-full flex justify-center items-center h-96 bg-slate-900 rounded-xl shadow-inner relative overflow-hidden">
        {/* Background Orders */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20 pointer-events-none select-none">
          <div className="text-red-500 text-xs font-mono">SELL ORDERS PENDING...</div>
          <div className="text-green-500 text-xs font-mono text-right">BUY ORDERS PENDING...</div>
        </div>

        {/* Candle Visualization */}
        <svg className="h-64 w-32 drop-shadow-2xl" viewBox="0 0 100 200">
          {/* Wick */}
          <line x1="50" y1="10" x2="50" y2="190" stroke="gray" strokeWidth="2" />
          {/* Body */}
          <rect 
            x="25" 
            y={candle.y} 
            width="50" 
            height={candle.height} 
            fill={candle.color} 
            className="transition-all duration-75"
          />
        </svg>

        {/* Controls */}
        <div className="absolute bottom-6 flex space-x-4">
          <button 
            onMouseDown={() => startPressure('buy')}
            onMouseUp={stopPressure}
            onMouseLeave={stopPressure}
            className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-xs shadow-lg ring-4 ring-green-900 active:scale-95 transition flex flex-col items-center justify-center"
          >
            <span>买入</span>
            <span>Buy</span>
          </button>
          <button 
            onMouseDown={() => startPressure('sell')}
            onMouseUp={stopPressure}
            onMouseLeave={stopPressure}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg ring-4 ring-red-900 active:scale-95 transition flex flex-col items-center justify-center"
          >
            <span>卖出</span>
            <span>Sell</span>
          </button>
        </div>
        
        <div className="absolute top-6 text-slate-400 text-xs font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          长按按钮模拟买卖力量对K线形态的影响
        </div>
      </div>
    </section>
  );
};

// --- Main App Component ---

const App = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
      <Hero onStart={() => scrollToSection('section1')} />
      <RandomLinesSection />
      <MovingAverageSection />
      <BloodSugarSection />
      <PriceActionSection />

      <footer className="bg-slate-950 py-16 text-center px-6 border-t border-slate-900">
        <h2 className="text-2xl font-bold text-white mb-6 flex justify-center items-center gap-2">
           <Info size={24} /> 最终总结
        </h2>
        <div className="max-w-2xl mx-auto space-y-4 text-slate-400">
          <p>1. 指标是工具，不是根基。根基是<strong>价格、订单和人性</strong>。</p>
          <p>2. 不要因为“大家都用”就觉得有效，要理解它背后的计算逻辑。</p>
          <p>3. 建立自己的交易系统，只做看得懂的行情，拒绝视觉噪音。</p>
        </div>
        <div className="mt-12 text-xs text-slate-600">
          Designed based on content from YouTube: Lester路肖南 | React Version
        </div>
      </footer>
    </div>
  );
};

export default App;