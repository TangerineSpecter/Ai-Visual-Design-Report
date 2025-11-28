import React, { useState, useEffect } from 'react';
import { Search, Clock, Calendar, TrendingUp, Settings, Zap, Info } from 'lucide-react';

// --- Styles & Global Overrides ---
// We inject Google Fonts and custom scrollbar styles here since we are in a single-file environment.
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
    
    body {
      font-family: 'Noto Sans SC', sans-serif;
      background-color: #0f172a;
      color: #e2e8f0;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #1e293b; }
    ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #64748b; }
    
    .gradient-text {
      background: linear-gradient(to right, #4ade80, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `}</style>
);

// --- Components ---

const Icon = ({ name, size = 24, className }) => {
    const icons = {
        'search': Search,
        'clock': Clock,
        'calendar': Calendar,
        'trending-up': TrendingUp,
        'settings': Settings,
        'zap': Zap,
        'info': Info
    };
    const LucideIcon = icons[name];
    return LucideIcon ? <LucideIcon size={size} className={className} /> : null;
};

const ParameterBox = ({ value, label, subtext }) => (
    <div className="flex flex-col items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <span className="text-3xl font-black gradient-text mb-1">{value}</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-xs text-slate-500 mt-1 text-center">{subtext}</span>
    </div>
);

const Hero = () => (
    <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10"></div>


        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white">
            MACD <span className="gradient-text">参数之谜</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            为什么默认参数是 (12, 26, 9)？<br />
            在这个 7x24 小时的加密货币和 5 天制的 A 股市场里，<br />
            你还在沿用 1970 年代的旧标准吗？
        </p>
        <button
            onClick={() => document.getElementById('history').scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
            开始解密
            <Icon name="search" size={20} className="group-hover:scale-110 transition-transform" />
        </button>
    </section>
);

const HistorySection = () => (
    <section id="history" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="bg-blue-500 w-2 h-8 rounded-full"></span>
                    起源：1970年代的美国
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                    MACD 指标由 <strong>Gerald Appel</strong> 发明。在那个年代，美国证券市场的交易环境与今天截然不同。
                </p>
                <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-yellow-500">
                    <h4 className="text-yellow-400 font-bold mb-2">关键历史背景</h4>
                    <p className="text-slate-400">
                        传说当时美国市场处于“单休”制度，或者 Gerald 关注的特定交易品种（如期货）是<strong>周一到周六</strong>交易的。
                    </p>
                </div>
                <p className="text-slate-300">
                    这直接导致了神奇数字 <span className="text-blue-400 font-bold">12</span> 和 <span className="text-purple-400 font-bold">26</span> 的诞生。
                </p>
            </div>

            <div className="flex-1 w-full">
                <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-500/20 px-4 py-1 rounded-bl-xl text-yellow-400 font-bold text-sm">
                        1970s CALENDAR
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm text-slate-500 font-mono">
                        <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                    </div>
                    {/* Calendar Visualization */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Week 1 */}
                        <div className="h-10 bg-slate-800 rounded flex items-center justify-center text-slate-600 font-bold text-xs sm:text-sm">Rest</div>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-10 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center text-green-400 font-bold text-xs sm:text-sm">Trade</div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <span className="text-4xl font-black text-white">6</span>
                        <span className="text-slate-400 ml-2">交易日 / 周</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const LogicBreakdown = () => (
    <section className="py-20 bg-slate-800/50 px-4">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">解构默认参数 (12, 26, 9)</h2>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Param 12 */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="text-5xl font-black text-blue-500 mb-2">12</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">快线周期 (Short)</div>
                    <p className="text-slate-300">
                        对应 <span className="text-white font-bold">2周</span>。
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                        6天/周 × 2 = 12天
                    </p>
                </div>

                {/* Param 26 */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-all"></div>
                    <div className="text-5xl font-black text-purple-500 mb-2">26</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">慢线周期 (Long)</div>
                    <p className="text-slate-300">
                        对应 <span className="text-white font-bold">1个月</span>。
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                        30天 - 4个周日 = 26天
                    </p>
                </div>

                {/* Param 9 */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full group-hover:bg-orange-500/20 transition-all"></div>
                    <div className="text-5xl font-black text-orange-500 mb-2">9</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">信号线 (Signal)</div>
                    <p className="text-slate-300">
                        众说纷纭，主流说法：<br />对应 <span className="text-white font-bold">1.5周</span>。
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                        6天/周 × 1.5 = 9天
                    </p>
                </div>
            </div>
        </div>
    </section>
);

const Calculator = () => {
    const [marketType, setMarketType] = useState('custom');
    const [daysPerWeek, setDaysPerWeek] = useState(5);
    const [hoursPerDay, setHoursPerDay] = useState(4);

    const getParams = () => {
        let s, l, m;

        if (daysPerWeek === 5) { s = 10; l = 20; m = 7; }
        else if (daysPerWeek === 6) { s = 12; l = 26; m = 9; }
        else if (daysPerWeek === 7) { s = 14; l = 30; m = 10; }
        else {
            s = Math.round(daysPerWeek * 2);
            l = Math.round(daysPerWeek * 4.3);
            m = Math.round(daysPerWeek * 1.5);
        }

        return { s, l, m };
    };

    const getIntradayParams = (minutes) => {
        const dayHours = hoursPerDay;
        const weekHours = daysPerWeek * hoursPerDay;

        const s = Math.round(dayHours * 2);
        const l = Math.round(weekHours);
        const m = Math.round(dayHours * 1.5);

        return { s, l, m };
    };

    const dayParams = getParams();
    const hourParams = getIntradayParams(60);

    const selectPreset = (type) => {
        setMarketType(type);
        if (type === 'ashare') { setDaysPerWeek(5); setHoursPerDay(4); }
        if (type === 'crypto') { setDaysPerWeek(7); setHoursPerDay(24); }
        if (type === 'forex') { setDaysPerWeek(5); setHoursPerDay(24); }
        if (type === 'legacy') { setDaysPerWeek(6); setHoursPerDay(4); }
    };

    return (
        <section className="py-20 px-4 max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-600 shadow-2xl transition-transform hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
                    <div className="p-3 bg-blue-600 rounded-xl text-white">
                        <Icon name="settings" size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">MACD 参数调优器</h2>
                        <p className="text-slate-400">根据你的市场环境，生成科学的参数设置</p>
                    </div>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { id: 'ashare', label: '🇨🇳 A股市场', sub: '5天/4小时' },
                        { id: 'crypto', label: '₿ 加密货币', sub: '7天/24小时' },
                        { id: 'forex', label: '💱 外汇市场', sub: '5天/24小时' },
                        { id: 'legacy', label: '📜 经典美股', sub: '1970s' },
                    ].map(p => (
                        <button
                            key={p.id}
                            onClick={() => selectPreset(p.id)}
                            className={`p-4 rounded-xl text-left transition-all border ${marketType === p.id
                                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <div className="font-bold">{p.label}</div>
                            <div className="text-xs opacity-70">{p.sub}</div>
                        </button>
                    ))}
                </div>

                {/* Custom Sliders */}
                <div className="bg-slate-900/50 rounded-xl p-6 mb-8 space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">每周交易天数</label>
                            <span className="font-bold text-blue-400">{daysPerWeek} 天</span>
                        </div>
                        <input
                            type="range" min="1" max="7" step="1"
                            value={daysPerWeek}
                            onChange={(e) => { setDaysPerWeek(Number(e.target.value)); setMarketType('custom'); }}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">每天交易小时</label>
                            <span className="font-bold text-blue-400">{hoursPerDay} 小时</span>
                        </div>
                        <input
                            type="range" min="1" max="24" step="1"
                            value={hoursPerDay}
                            onChange={(e) => { setHoursPerDay(Number(e.target.value)); setMarketType('custom'); }}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Day Chart Recommendation */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-green-400">
                            <Icon name="calendar" size={20} />
                            <h3 className="font-bold">日线级别建议</h3>
                        </div>
                        <div className="flex justify-between gap-2">
                            <ParameterBox value={dayParams.s} label="Short" subtext="2 周" />
                            <ParameterBox value={dayParams.l} label="Long" subtext="1 月" />
                            <ParameterBox value={dayParams.m} label="Signal" subtext="1.5 周" />
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">
                            逻辑：短周期=2周，长周期=1月，信号=1.5周
                        </p>
                    </div>

                    {/* Hour Chart Recommendation */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-yellow-400">
                            <Icon name="clock" size={20} />
                            <h3 className="font-bold">小时级别建议</h3>
                        </div>
                        <div className="flex justify-between gap-2">
                            <ParameterBox value={hourParams.s} label="Short" subtext="2 日" />
                            <ParameterBox value={hourParams.l} label="Long" subtext="1 周" />
                            <ParameterBox value={hourParams.m} label="Signal" subtext="1.5 日" />
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">
                            逻辑：短周期=2日，长周期=1周，信号=1.5日
                        </p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-200 flex gap-3">
                    <Icon name="info" className="shrink-0 mt-0.5" />
                    <p>
                        <strong>专家提示：</strong>
                        如果你的市场波动极大（如山寨币），可以尝试将计算出的参数等比例缩小（如除以2），以提高灵敏度。
                    </p>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="py-12 text-center text-slate-600 border-t border-slate-800 mt-20">
        <p className="text-xs">
            本文仅供知识科普，不构成任何投资建议。<br />
            Generated by AI • Styled with Tailwind
        </p>
    </footer>
);

export default function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">
            <GlobalStyles />
            <Hero />
            <HistorySection />
            <LogicBreakdown />
            <Calculator />
            <Footer />
        </div>
    );
}