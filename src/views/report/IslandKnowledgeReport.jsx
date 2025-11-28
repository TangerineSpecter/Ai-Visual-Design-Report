import React, { useState, useEffect, useRef } from 'react';
import { 
  Fish, 
  Network, 
  TrendingUp, 
  Banknote, 
  Home, 
  ArrowRight, 
  ArrowDown,
  AlertTriangle,
  RefreshCw,
  Coins,
  Utensils,
  ThumbsUp,
  ThumbsDown,
  Printer
} from 'lucide-react';

// --- 通用组件 ---

const Section = ({ children, className = "" }) => (
  <section className={`h-screen w-full snap-start flex flex-col items-center justify-center relative overflow-hidden ${className}`}>
    {children}
  </section>
);

const Instruction = ({ children }) => (
  <div className="absolute bottom-12 left-0 w-full text-center animate-bounce-slow z-20 px-4">
    <p className="text-slate-400 text-sm md:text-base font-medium tracking-widest uppercase bg-black/30 backdrop-blur px-4 py-2 rounded-full inline-block border border-white/10">
      {children}
    </p>
  </div>
);

const TitleOverlay = ({ title, sub }) => (
  <div className="absolute top-12 left-0 w-full text-center z-20 pointer-events-none px-4">
    <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tight mb-2">
      {title}
    </h2>
    <p className="text-slate-300 text-lg md:text-xl font-light shadow-black drop-shadow-md">
      {sub}
    </p>
  </div>
);

// --- 章节组件 ---

// 1. 生存
const ChapterSurvival = () => {
  const [fish, setFish] = useState(0);
  const [isFishing, setIsFishing] = useState(false);

  const catchFish = () => {
    if (isFishing) return;
    setIsFishing(true);
    setTimeout(() => {
      setFish(f => f + 1);
      setIsFishing(false);
    }, 500);
  };

  return (
    <Section className="bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950"></div>
      
      <TitleOverlay title="生存的底线" sub="手停口停：没有资本的原始生活" />

      <div className="relative z-10 flex flex-col items-center">
        {/* 动画区域 */}
        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
          <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-3xl transition-all duration-500 ${isFishing ? 'scale-125 opacity-100' : 'scale-100 opacity-50'}`}></div>
          
          {/* 鱼群动画 */}
          <div className="absolute inset-0 overflow-hidden rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isFishing ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                <Fish size={64} className="text-blue-400 animate-pulse" />
             </div>
             {isFishing && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-4xl animate-ping">🎣</div>
               </div>
             )}
          </div>

          {/* 浮动文字 */}
          {fish > 0 && (
             <div key={fish} className="absolute -top-10 text-green-400 font-bold text-xl animate-fade-up">
               +1 晚餐
             </div>
          )}
        </div>

        {/* 交互区 */}
        <div className="text-center space-y-6">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 min-w-[200px]">
             <div className="text-slate-400 text-xs uppercase mb-1">库存 (今日口粮)</div>
             <div className="text-4xl font-mono font-bold text-white">{fish}</div>
          </div>

          <button 
            onClick={catchFish}
            disabled={isFishing}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all rounded-full font-bold text-lg text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              <Utensils size={20} />
              {isFishing ? '捕鱼中...' : '徒手抓鱼'}
            </span>
          </button>
        </div>
      </div>

      <Instruction>点击抓鱼 • 向下滑动进入下一章</Instruction>
    </Section>
  );
};

// 2. 资本
const ChapterCapital = () => {
  const [hunger, setHunger] = useState(100);
  const [progress, setProgress] = useState(0);
  const [isWeaving, setIsWeaving] = useState(false);
  const intervalRef = useRef(null);

  const startWeaving = () => {
    if (progress >= 100) return;
    setIsWeaving(true);
    intervalRef.current = setInterval(() => {
      setHunger(h => Math.max(0, h - 2));
      setProgress(p => Math.min(100, p + 1.5));
    }, 50);
  };

  const stopWeaving = () => {
    setIsWeaving(false);
    clearInterval(intervalRef.current);
    // 恢复饱腹感
    if (progress < 100) {
      const recoverId = setInterval(() => {
        setHunger(h => {
          if (h >= 100) {
            clearInterval(recoverId);
            return 100;
          }
          return h + 5;
        });
      }, 50);
    }
  };

  const isDone = progress >= 100;

  return (
    <Section className="bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-950 to-slate-950"></div>
      
      <TitleOverlay title="资本的诞生" sub="延迟满足：忍受饥饿来制造工具" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* 状态面板 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="text-slate-400 text-xs mb-1">饱腹感 (代价)</div>
             <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-100 ${hunger < 30 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                 style={{ width: `${hunger}%` }}
               ></div>
             </div>
             <div className="mt-1 text-right text-xs font-mono">{Math.floor(hunger)}%</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="text-slate-400 text-xs mb-1">渔网进度 (资本)</div>
             <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-blue-500 transition-all duration-100" 
                 style={{ width: `${progress}%` }}
               ></div>
             </div>
             <div className="mt-1 text-right text-xs font-mono">{Math.floor(progress)}%</div>
          </div>
        </div>

        {/* 动画反馈 */}
        <div className="h-48 flex items-center justify-center mb-8 relative">
           {isDone ? (
             <div className="flex flex-col items-center animate-bounce">
               <Network size={80} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
               <p className="text-emerald-400 font-bold mt-4">资本构建完成！效率 x 200%</p>
             </div>
           ) : (
             <div className="relative">
                <div className={`transition-all duration-300 ${isWeaving ? 'scale-110 opacity-100' : 'scale-100 opacity-50'}`}>
                  <Network size={80} className="text-slate-600" />
                </div>
                {/* 编织线 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  <path 
                    d="M10,10 L90,90 M90,10 L10,90" 
                    stroke="#10b981" 
                    strokeWidth="8" 
                    strokeDasharray="200"
                    strokeDashoffset={200 - (progress * 2)}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                </svg>
             </div>
           )}
           {hunger < 20 && !isDone && (
             <div className="absolute top-0 text-red-500 font-bold animate-pulse">
               太饿了！快撑不住了！
             </div>
           )}
        </div>

        {/* 交互按钮 */}
        <div className="flex justify-center">
          {!isDone ? (
            <button 
              onMouseDown={startWeaving}
              onMouseUp={stopWeaving}
              onMouseLeave={stopWeaving}
              onTouchStart={(e) => { e.preventDefault(); startWeaving(); }}
              onTouchEnd={(e) => { e.preventDefault(); stopWeaving(); }}
              className="px-8 py-6 bg-emerald-600 active:scale-95 transition-all rounded-2xl font-bold text-xl text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full select-none"
            >
              按住不放来织网
              <div className="text-xs font-normal opacity-80 mt-1">这会消耗你的饱腹感</div>
            </button>
          ) : (
            <div className="px-8 py-4 bg-slate-800 text-slate-400 rounded-xl w-full text-center">
              已完成 • 请向下滑动
            </div>
          )}
        </div>
      </div>
      <Instruction>长按织网 • 注意不要饿死</Instruction>
    </Section>
  );
};

// 3. 借贷
const ChapterLoan = () => {
  const [choice, setChoice] = useState(null); // 'good', 'bad'

  return (
    <Section className="bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-slate-950 to-slate-950"></div>

      <TitleOverlay title="借贷的智慧" sub="资源配置：把鱼借给谁？" />

      <div className="relative z-10 w-full max-w-4xl px-4 grid md:grid-cols-2 gap-8 mt-12">
        {/* 选项 A */}
        <button 
          onClick={() => setChoice('good')}
          className={`relative p-6 rounded-3xl border-2 transition-all duration-300 text-left group
            ${choice === 'good' 
              ? 'bg-green-900/40 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-105' 
              : 'bg-slate-800/40 border-slate-700 hover:border-green-500/50 hover:bg-slate-800'
            }
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <TrendingUp size={32} />
            </div>
            {choice === 'good' && <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">已选择</div>}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">借给贝克 (企业家)</h3>
          <p className="text-slate-400 text-sm mb-4">
            他想借鱼购买木材，制造巨型捕鱼器。
          </p>
          <div className={`mt-4 p-3 rounded-lg text-sm font-bold transition-all ${choice === 'good' ? 'bg-green-500 text-black' : 'bg-slate-700 text-slate-500'}`}>
            {choice === 'good' ? '结果：产量大增，连本带利归还！' : '预期回报：高'}
          </div>
        </button>

        {/* 选项 B */}
        <button 
          onClick={() => setChoice('bad')}
          className={`relative p-6 rounded-3xl border-2 transition-all duration-300 text-left group
            ${choice === 'bad' 
              ? 'bg-red-900/40 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-105' 
              : 'bg-slate-800/40 border-slate-700 hover:border-red-500/50 hover:bg-slate-800'
            }
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
              <Coins size={32} />
            </div>
            {choice === 'bad' && <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">已选择</div>}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">借给查理 (享乐者)</h3>
          <p className="text-slate-400 text-sm mb-4">
            他想借鱼去海边度个假，放松一下心情。
          </p>
          <div className={`mt-4 p-3 rounded-lg text-sm font-bold transition-all ${choice === 'bad' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
            {choice === 'bad' ? '结果：鱼被吃光了，他还不起债。' : '预期回报：负'}
          </div>
        </button>
      </div>

      <Instruction>选择正确的借款人</Instruction>
    </Section>
  );
};

// 4. 通胀
const ChapterInflation = () => {
  const [money, setMoney] = useState(1);
  const [bills, setBills] = useState([]);

  const printMoney = () => {
    setMoney(m => m + 1);
    // 添加新的飘落钞票
    const newBill = {
      id: Date.now(),
      left: Math.random() * 80 + 10, // 10% - 90%
      rotation: Math.random() * 360,
      duration: Math.random() * 2 + 2
    };
    setBills(prev => [...prev.slice(-15), newBill]); // 限制数量防止卡顿
  };

  return (
    <Section className="bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
      
      <TitleOverlay title="通胀的幻觉" sub="印钞机：稀释财富的隐形税收" />

      {/* 飘落的钞票容器 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bills.map(bill => (
          <div
            key={bill.id}
            className="absolute text-green-500 opacity-0 animate-fall"
            style={{
              left: `${bill.left}%`,
              top: '-50px',
              animationDuration: `${bill.duration}s`,
              transform: `rotate(${bill.rotation}deg)`
            }}
          >
            <Banknote size={32} />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 mt-8">
        {/* 天平效果 */}
        <div className="flex items-end gap-8 relative">
           <div className="flex flex-col items-center gap-2 transition-all" style={{ transform: `translateY(${money * 2}px)` }}>
             <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-full border border-white/20 flex items-center justify-center shadow-lg">
               <Fish size={48} className="text-blue-400" />
             </div>
             <span className="text-xs text-slate-400 font-mono">1 FISH</span>
           </div>

           <div className="text-4xl font-black text-slate-600 mb-8">=</div>

           <div className="flex flex-col items-center gap-2 transition-all" style={{ transform: `translateY(-${Math.min(50, money * 2)}px)` }}>
             <div className="w-32 h-32 bg-green-900/20 backdrop-blur rounded-full border border-green-500/50 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.2)]">
               <span className="text-xs text-green-400 uppercase tracking-widest mb-1">Price</span>
               <span className="text-4xl font-black text-green-400 tabular-nums">${money}</span>
             </div>
             <span className="text-xs text-slate-400 font-mono">PAPER MONEY</span>
           </div>
        </div>

        {/* 交互 */}
        <div className="text-center">
          <p className="text-slate-400 mb-6 max-w-xs mx-auto text-sm">
            当你印更多的钱，鱼的数量并没有增加。结果只是你需要更多的纸来买同一条鱼。
          </p>
          <button 
            onClick={printMoney}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all rounded-full font-bold text-lg text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center gap-3 mx-auto"
          >
            <Printer size={24} />
            开动印钞机
          </button>
        </div>
      </div>

      <Instruction>点击印钞 • 观察价格</Instruction>
    </Section>
  );
};

// 5. 泡沫
const ChapterBubble = () => {
  const [size, setSize] = useState(100);
  const [popped, setPopped] = useState(false);

  const inflate = () => {
    if (popped) return;
    setSize(s => {
      const newSize = s + 20;
      if (newSize > 350) {
        setPopped(true);
        return 0;
      }
      return newSize;
    });
  };

  const reset = () => {
    setSize(100);
    setPopped(false);
  };

  return (
    <Section className="bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-950 to-slate-950"></div>
      
      <TitleOverlay title="泡沫的破裂" sub="最后的疯狂：直到没人接盘" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
          {popped ? (
            <div className="text-center animate-zoom-in">
              <div className="text-8xl mb-4">💥</div>
              <h3 className="text-3xl font-black text-red-500 mb-2">崩盘！</h3>
              <p className="text-slate-400 max-w-xs mx-auto mb-8">
                繁荣的假象消失了，留下的只有债务和废墟。
              </p>
              <button 
                onClick={reset}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white text-sm flex items-center gap-2 mx-auto transition-colors"
              >
                <RefreshCw size={16} /> 重置演示
              </button>
            </div>
          ) : (
            <div 
              onClick={inflate}
              className="rounded-full bg-purple-500/20 backdrop-blur border-2 border-purple-400 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-500/30 transition-all duration-200 shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:shadow-[0_0_80px_rgba(168,85,247,0.5)] select-none"
              style={{ width: `${size}px`, height: `${size}px` }}
            >
              <Home size={Math.max(24, size/5)} className="text-white drop-shadow-md" />
              <span className="text-purple-200 font-bold mt-2" style={{ fontSize: `${Math.max(12, size/10)}px` }}>
                ${size * 1000}
              </span>
              {size > 250 && (
                <div className="absolute -top-12 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce whitespace-nowrap">
                  危险！即将爆炸！
                </div>
              )}
            </div>
          )}
        </div>

        {!popped && (
          <p className="text-slate-500 mt-8 text-sm">
            点击气泡来推高房价。每个人都觉得它会永远涨下去。
          </p>
        )}
      </div>

      <Instruction>{popped ? '演示结束' : '点击充气'}</Instruction>
    </Section>
  );
};

// --- 主应用 ---

export default function App() {
  return (
    <div className="bg-black text-slate-200 h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <style>{`
        .animate-fade-up { animation: fadeUp 1s ease-out forwards; }
        @keyframes fadeUp {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-50px); }
        }
        .animate-fall { animation: fall linear forwards; }
        @keyframes fall {
          from { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          to { transform: translateY(400px) rotate(180deg); opacity: 0; }
        }
        .animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
        @keyframes zoomIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-slow { animation: bounce 2s infinite; }
      `}</style>

      {/* 封面 */}
      <Section className="bg-black">
        <div className="text-center px-6">
          <div className="mb-6 inline-flex p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
            <Fish size={40} className="text-blue-500 mr-4" />
            <ArrowRight size={40} className="text-slate-600 mr-4" />
            <Network size={40} className="text-emerald-500 mr-4" />
            <ArrowRight size={40} className="text-slate-600 mr-4" />
            <AlertTriangle size={40} className="text-purple-500" />
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-600 mb-6 pb-2">
            小岛经济学
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-12">
            一个关于财富、贪婪与崩溃的寓言。<br/>
            <span className="text-base text-slate-600 mt-2 block">下滑开始体验沉浸式模拟</span>
          </p>
          <div className="animate-bounce">
            <ArrowDown size={32} className="text-slate-500" />
          </div>
        </div>
      </Section>

      <ChapterSurvival />
      <ChapterCapital />
      <ChapterLoan />
      <ChapterInflation />
      <ChapterBubble />

      {/* 结语 */}
      <Section className="bg-slate-950 text-center px-6">
        <h2 className="text-4xl font-bold text-white mb-6">经济学的核心铁律</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full text-left">
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-emerald-400 mb-2">1. 生产 {'>'} 消费</h3>
            <p className="text-slate-400">没有储蓄（延迟消费），就没有资本。没有资本，生产力永远无法提高。</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-blue-400 mb-2">2. 钱 ≠ 财富</h3>
            <p className="text-slate-400">只有商品（鱼）是真实的财富。印钞票只是在稀释你手里每一分钱的价值。</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-purple-400 mb-2">3. 泡沫必破</h3>
            <p className="text-slate-400">当资产价格脱离了实际价值，崩盘只是时间问题。只有核心技能属于你。</p>
          </div>
        </div>
        <button 
          onClick={() => document.querySelector('div').scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-12 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors"
        >
          回到开始
        </button>
      </Section>
    </div>
  );
}