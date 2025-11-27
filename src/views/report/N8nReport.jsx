// src/App.jsx

import { useState, useEffect, useRef } from 'react';
import { Icons } from '../../components/Icons';

// --- Visual Components ---
// ... 把你原来 HTML 里的 FlowPath, NodeCard, AnimatedPacket, SectionHeader, InfoBox 等所有非 Icon 和非 App 的组件都粘贴在这里 ...

const FlowPath = ({ className }) => (
    <svg className={`absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 -z-10 ${className}`} overflow="visible">
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#475569" strokeWidth="2" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ff4d4d" strokeWidth="2" className="path-flow" opacity="0.6" />
    </svg>
);

const NodeCard = ({ icon: Icon, label, subLabel, type = "default", active = true }) => {
    const colors = {
        default: "border-slate-700 bg-slate-800/80",
        trigger: "border-n8n bg-slate-800/80 shadow-[0_0_15px_rgba(255,77,77,0.2)]",
        ai: "border-purple-500 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
        db: "border-green-500 bg-green-900/20",
        action: "border-blue-500 bg-blue-900/20"
    };

    return (
        <div className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 min-w-[100px] z-10 ${colors[type] || colors.default} ${active ? 'scale-100 opacity-100' : 'scale-95 opacity-50 grayscale'}`}>
            <div className="p-2 rounded-full bg-slate-900/50 mb-2">
                <Icon size={20} className="text-white" />
            </div>
            <span className="text-xs font-bold text-white whitespace-nowrap">{label}</span>
            {subLabel && <span className="text-[10px] text-slate-400 mt-1">{subLabel}</span>}

            <div className="absolute top-1/2 -left-1 w-2 h-2 bg-slate-400 rounded-full"></div>
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-400 rounded-full"></div>
        </div>
    );
};

const SectionHeader = ({ level, title, subTitle }) => (
    <div className="flex items-start gap-4 mb-8">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xl text-n8n shadow-lg">
            {level}
        </div>
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{title}</h2>
            <p className="text-slate-400 font-mono text-sm">{subTitle}</p>
        </div>
    </div>
);

const InfoBox = ({ children, type = "info" }) => {
    const styles = {
        info: "bg-blue-900/20 border-blue-500/30 text-blue-200",
        tip: "bg-yellow-900/20 border-yellow-500/30 text-yellow-200",
        warn: "bg-red-900/20 border-red-500/30 text-red-200"
    };
    return (
        <div className={`mt-4 p-4 rounded-lg border text-sm ${styles[type]}`}>
            {children}
        </div>
    );
};

const Level1_Visual = () => {
    return (
        <div className="w-full relative py-12 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden group">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative flex justify-between items-center max-w-3xl mx-auto">
                <FlowPath />
                <div className="absolute top-1/2 left-10 w-3 h-3 bg-n8n rounded-full shadow-[0_0_10px_#ff4d4d] -translate-y-1/2 z-0 animate-[moveAcross_3s_linear_infinite]"
                    style={{ animationName: 'moveAcross' }}>
                    <style>{`
                        @keyframes moveAcross {
                            0% { left: 5%; opacity: 0; }
                            10% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { left: 95%; opacity: 0; }
                        }
                     `}</style>
                </div>
                <NodeCard icon={Icons.FileText} label="Trigger" subLabel="Webhook" type="trigger" />
                <div className="flex flex-col items-center">
                    <div className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-[10px] text-slate-400 mb-2">JSON Array</div>
                    <NodeCard icon={Icons.Database} label="Sheets" subLabel="存储数据" type="db" />
                </div>
                <div className="relative p-2 border border-dashed border-slate-600 rounded-lg bg-slate-800/30">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-slate-500 px-1">Logic</span>
                    <div className="flex gap-2">
                        <NodeCard icon={Icons.Filter} label="Filter" subLabel="过滤" type="default" />
                        <NodeCard icon={Icons.Split} label="Switch" subLabel="分流" type="default" />
                    </div>
                </div>
                <NodeCard icon={Icons.Mail} label="Gmail" subLabel="发送" type="action" />
            </div>
        </div>
    );
};

const Level3_Visual = () => { /* ... 粘贴 Level3_Visual 的代码 ... */
    return (
        <div className="w-full relative p-8 bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center group">
                <div className="relative">
                    <Icons.FileText size={48} className="text-red-400 relative z-10" />
                    <div className="absolute top-0 left-0 text-red-400 opacity-50 animate-ping-slow">
                        <Icons.FileText size={48} />
                    </div>
                </div>
                <span className="mt-2 text-xs font-mono text-slate-400">原始 PDF</span>
            </div>
            <Icons.ChevronRight className="text-slate-600" />
            <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1 animate-pulse">
                    <div className="w-8 h-10 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-[8px] text-slate-400">Part 1</div>
                    <div className="w-8 h-10 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-[8px] text-slate-400">Part 2</div>
                    <div className="w-8 h-10 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-[8px] text-slate-400">Part 3</div>
                </div>
                <span className="text-xs font-mono text-n8n">Chunking (切块)</span>
            </div>
            <Icons.ChevronRight className="text-slate-600" />
            <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 bg-slate-800 rounded-lg border border-green-500/30 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 text-[6px] leading-tight text-green-400 break-all p-1 font-mono">
                        0.123 0.542 0.991 0.111 0.222 0.333 ...
                    </div>
                    <Icons.Database size={32} className="text-green-400 z-10" />
                </div>
                <span className="mt-2 text-xs font-mono text-green-400">Embeddings (向量)</span>
            </div>
        </div>
    );
};

const Level4_Visual = () => { /* ... 粘贴 Level4_Visual 的代码 ... */
    return (
        <div className="w-full relative h-[300px] bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="absolute w-[200px] h-[200px] rounded-full border border-slate-700 border-dashed animate-[spin_20s_linear_infinite]"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 bg-slate-800 rounded-full border-2 border-n8n shadow-[0_0_30px_rgba(255,77,77,0.3)] animate-float">
                <Icons.Bot size={40} className="text-white" />
                <span className="text-[10px] font-bold text-n8n mt-1">AGENT</span>
            </div>
            <div className="absolute top-[20%] right-[25%] bg-white text-slate-900 text-[10px] px-2 py-1 rounded-lg rounded-bl-none animate-bounce opacity-80 z-20">
                Thinking...
            </div>
            <div className="absolute w-full h-full animate-[spin_15s_linear_infinite]">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 bg-blue-900/80 border border-blue-500 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                        <Icons.Search size={18} className="text-blue-400" />
                    </div>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="w-10 h-10 bg-red-900/80 border border-red-500 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                        <Icons.Code size={18} className="text-red-400" />
                    </div>
                </div>
                <div className="absolute top-1/2 right-10 translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 bg-yellow-900/80 border border-yellow-500 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                        <Icons.UserCheck size={18} className="text-yellow-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Intro = ({ onStart }) => ( /* ... 粘贴 Intro 的代码 ... */
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-950 -z-10"></div>
        <div className="relative mb-8">
            <div className="absolute -inset-4 bg-n8n blur-3xl opacity-20 animate-pulse"></div>
            <Icons.Zap size={80} className="text-n8n relative z-10 animate-float" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            n8n AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-n8n to-orange-500">Automation</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            不再只是连线，而是构建智能体。<br />
            通过可视化的互动图解，掌握从基础自动化到 AI Agent 的核心逻辑。
        </p>
        <button onClick={onStart} className="group relative px-8 py-4 bg-n8n hover:bg-red-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,77,77,0.4)] hover:shadow-[0_0_30px_rgba(255,77,77,0.6)]">
            开始实战之旅
            <Icons.ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
    </div>
);

// --- Main App Component ---

function ReportView() {
    const contentRef = useRef(null);
    const scrollToContent = () => contentRef.current?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="min-h-screen w-full pb-20 bg-slate-950 text-white">
            <Intro onStart={scrollToContent} />
            <div ref={contentRef} className="px-4 md:px-8 space-y-24 pt-12">
                <section className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                    <SectionHeader level="1" title="基础自动化" subTitle="Basic Pipeline Flow" />
                    <div className="pl-20">
                        <Level1_Visual />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <InfoBox type="info">
                                <h4 className="font-bold mb-1 flex items-center gap-2"><Icons.Zap size={16} /> Trigger 原理</h4>
                                <p className="text-xs opacity-80">Webhook 就像门铃，有人按（发请求）才会响。Cron 就像闹钟，时间到了自动响。</p>
                            </InfoBox>
                            <InfoBox type="tip">
                                <h4 className="font-bold mb-1 flex items-center gap-2"><Icons.Merge size={16} /> 关键技巧：Merge Node</h4>
                                <p className="text-xs opacity-80">看到上面流程图中的分支了吗？如果分支后需要汇总数据（例如：不管走哪条路最后都要发 Slack），一定要用 Merge Node。</p>
                            </InfoBox>
                        </div>
                    </div>
                </section>
                <section className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                    <SectionHeader level="2" title="引入 AI 大脑" subTitle="LLM Integration" />
                    <div className="pl-20">
                        <div className="glass-card p-6 rounded-2xl flex items-center justify-center gap-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-purple-900/10"></div>
                            <NodeCard icon={Icons.Database} label="Input" type="db" />
                            <div className="w-16 h-0.5 bg-slate-700 relative">
                                <div className="absolute inset-0 bg-purple-500 animate-dash" style={{ width: '100%' }}></div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-purple-500/30 blur-xl animate-pulse"></div>
                                <NodeCard icon={Icons.Brain} label="LLM Chain" type="ai" />
                            </div>
                            <div className="w-16 h-0.5 bg-slate-700"></div>
                            <NodeCard icon={Icons.Box} label="JSON Parser" type="default" />
                        </div>
                        <InfoBox type="warn">
                            <h4 className="font-bold mb-1">为什么需要 JSON Parser?</h4>
                            <p className="text-xs opacity-80">AI 也是会“胡说八道”的。如果它返回了一段散文，后续的节点根本看不懂。Structured Output Parser 就像一个翻译官，强迫 AI 只讲标准的 JSON 格式。</p>
                        </InfoBox>
                    </div>
                </section>
                <section className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                    <SectionHeader level="3" title="RAG 知识库" subTitle="Retrieval Augmented Generation" />
                    <div className="pl-20">
                        <Level3_Visual />
                        <div className="mt-6 text-sm text-slate-400">
                            <p className="mb-2"><strong>图解说明：</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>左侧：原始文档（AI 读不懂整本书）。</li>
                                <li>中间：<strong>Chunking</strong> 将书撕成每一页或每一段。</li>
                                <li>右侧：<strong>Embedding</strong> 将文字转成数学向量（数字），存入向量数据库。AI 搜索时，其实是在比对数字的相似度。</li>
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="relative">
                    <SectionHeader level="4" title="AI Agent 智能体" subTitle="Autonomous Loop" />
                    <div className="pl-20">
                        <Level4_Visual />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <h4 className="text-n8n font-bold mb-2">Chain vs Agent</h4>
                                <div className="space-y-2 text-xs text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                                        <span><strong>Chain (链):</strong> 火车。按预定轨道 (A-&gt;B-&gt;C) 跑，出轨即死。</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-n8n rounded-full"></span>
                                        <span><strong>Agent (代理):</strong> 出租车。你给目的地，司机（AI）自己看地图（Tools）决定怎么走。</span>
                                    </div>
                                </div>
                            </div>
                            <InfoBox type="tip">
                                <h4 className="font-bold mb-1">Human in the Loop</h4>
                                <p className="text-xs opacity-80">全自动 Agent 有时很可怕（比如乱发邮件）。给它一个 "Wait for Approval" 工具，它在做危险操作前会停下来等你点确认。</p>
                            </InfoBox>
                        </div>
                    </div>
                </section>
            </div>
            <footer className="text-center text-slate-600 py-20 mt-10 border-t border-slate-900">
                <p className="text-sm">Interactive Guide for n8n Automation</p>
            </footer>
        </div>
    );
};

export default ReportView;
