import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Layers, 
  GitMerge, 
  Workflow, 
  Database, 
  Terminal, 
  Layout, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Code, 
  Zap,
  Box,
  Share2,
  MessageSquare
} from 'lucide-react';

// Animation utility components
const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Section = ({ title, children, icon: Icon, className = "" }) => (
  <section className={`py-20 px-6 md:px-20 border-b border-slate-800 ${className}`}>
    <FadeIn>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
          <Icon size={32} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      </div>
      <div className="text-slate-300 text-lg leading-relaxed">
        {children}
      </div>
    </FadeIn>
  </section>
);

const FeatureCard = ({ title, desc, icon: Icon }) => (
  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all hover:bg-slate-800 hover:-translate-y-1 duration-300">
    <div className="mb-4 text-blue-400">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{desc}</p>
  </div>
);

// Demo Component: Middleware Visualization
const MiddlewareDemo = () => {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: "用户输入", active: step === 0, color: "bg-green-500" },
    { label: "前置中间件 (上下文压缩/审核)", active: step === 1, color: "bg-yellow-500" },
    { label: "Agent/LLM 思考", active: step === 2, color: "bg-blue-600" },
    { label: "后置中间件 (结果修正)", active: step === 3, color: "bg-purple-500" },
    { label: "最终响应", active: step === 4, color: "bg-green-500" },
  ];

  return (
    <div className="my-8 bg-slate-900 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
        <div className="h-full bg-blue-500 transition-all duration-500 ease-linear" style={{ width: `${(step + 1) * 20}%` }}></div>
      </div>
      <h3 className="text-center text-white mb-6 font-bold">中间件 (Middleware) 运行机制</h3>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`p-4 rounded-lg text-sm font-bold transition-all duration-500 w-full md:w-40 text-center ${s.active ? `${s.color} text-white scale-110 shadow-lg shadow-${s.color}/50` : 'bg-slate-800 text-slate-500'}`}>
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className={`text-slate-600 hidden md:block transition-colors duration-300 ${s.active ? 'text-blue-400' : ''}`} />
            )}
            {i < steps.length - 1 && (
              <div className={`w-1 h-8 md:hidden bg-slate-700 ${s.active ? 'bg-blue-500' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-6 text-center text-slate-400 text-sm">
        中间件允许我们在 AI 运行的关键节点“插入代码”，打破黑盒，实现精细化控制。
      </p>
    </div>
  );
};

// Demo Component: LangGraph Structure
const GraphDemo = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center my-10">
      <div className="relative w-64 h-64">
        {/* Nodes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600 p-3 rounded-full text-white z-10 animate-bounce">Start</div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-slate-700 p-4 rounded-lg border border-slate-500 text-white z-10">Agent Node</div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-slate-700 p-4 rounded-lg border border-slate-500 text-white z-10">Tool Node</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-green-600 p-3 rounded-full text-white z-10">End</div>
        
        {/* Edges (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M128 40 L60 110" stroke="#475569" strokeWidth="2" fill="none" />
          <path d="M60 150 L128 220" stroke="#475569" strokeWidth="2" fill="none" />
          {/* Cycle */}
          <path d="M90 130 L160 130" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" fill="none" className="animate-pulse" />
          <path d="M190 150 L100 150" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" fill="none" className="animate-pulse" />
        </svg>
      </div>
      <div className="flex-1 space-y-4">
        <h3 className="text-xl font-bold text-blue-400">图 (Graph) 的力量</h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-center gap-2"><GitMerge size={16} className="text-purple-400"/> <b>循环结构：</b> 允许 Agent 自我修正、多步执行。</li>
          <li className="flex items-center gap-2"><Database size={16} className="text-purple-400"/> <b>State (状态)：</b> 像接力棒一样在节点间传递记忆。</li>
          <li className="flex items-center gap-2"><Box size={16} className="text-purple-400"/> <b>Human-in-the-loop：</b> 可以在任意节点暂停，等待人类批准。</li>
        </ul>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xl">
            <Box />
            <span>AI Tech Insider</span>
          </div>
          <a 
            href="https://www.youtube.com/watch?v=IXhPqRqu-Gw" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Share2 size={16} />
            观看原视频
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="pt-20 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
        <FadeIn>
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-6 border border-blue-500/20">
            赋范课堂深度解读
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            LangChain 1.0 <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Agent 开发新纪元
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            从 LangChain 到 LangGraph，再到 MCP 工业级方案。
            <br />
            一文读懂智能体开发的最前沿技术栈。
          </p>
        </FadeIn>
      </div>

      <main className="max-w-5xl mx-auto">
        
        {/* Section 1: 架构变革 */}
        <Section title="1.0 架构大变革" icon={Layers}>
          <p className="mb-6">
            LangChain 1.0 正式版发布，这是自 2022 年以来的最大更新。最大的变化在于<b>架构的统一</b>与<b>API 的瘦身</b>。
          </p>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-red-900/30 opacity-70">
              <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2"><MessageSquare size={18}/> 过去 (0.3版)</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>API 臃肿复杂</li>
                <li>createReactAgent, createJsonAgent 等十几种 API</li>
                <li>LangChain 和 LangGraph 关系混乱</li>
                <li>黑盒运行，难以控制</li>
              </ul>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-blue-500 shadow-lg shadow-blue-500/10">
              <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><Zap size={18}/> 现在 (1.0版)</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-white">
                <li><b>LangChain</b> 退居底层，作为基础框架</li>
                <li><b>LangGraph</b> 成为核心编排引擎</li>
                <li>API 统一为 <code>create_react_agent</code></li>
                <li>引入 Middleware，打破黑盒</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Section 2: 中间件 */}
        <Section title="中间件 (Middleware)：核心黑科技" icon={GitMerge}>
          <p>
            如果说以前的 Agent 是一个一旦启动就无法干预的“黑盒”，那么 Middleware 就是给你装上了“遥控器”。
            它允许你在模型调用前后、工具执行前后插入自定义逻辑。
          </p>
          <MiddlewareDemo />
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <FeatureCard 
              title="无限上下文" 
              desc="在 context 即将溢出时，自动触发中间件对历史消息进行压缩或裁剪，实现永久记忆。"
              icon={Database}
            />
            <FeatureCard 
              title="人工介入 (HITL)" 
              desc="在执行敏感操作（如删除文件）前暂停，等待人类审批后继续。"
              icon={ShieldCheck}
            />
            <FeatureCard 
              title="动态模型切换" 
              desc="根据任务难度，简单问题用小模型，复杂推理自动切换到推理大模型 (O1/R1)。"
              icon={Cpu}
            />
          </div>
        </Section>

        {/* Section 3: LangGraph */}
        <Section title="LangGraph：图的艺术" icon={Workflow}>
          <p>
            LangGraph 引入了<b>状态机 (State Machine)</b> 的概念。不同于线性的 Chain（链），Graph（图）允许循环、分支和持久化记忆。
          </p>
          <GraphDemo />
          <div className="bg-slate-800/50 p-6 rounded-xl border-l-4 border-purple-500 mt-6">
            <h4 className="font-bold text-white mb-2">为什么需要 Graph?</h4>
            <p className="text-sm">
              现实世界的任务往往不是线性的。比如写代码：写代码 → 运行 → 报错 → 修改 → 再运行。
              这是一个循环过程。LangGraph 通过<b>循环图结构</b>完美支持这种自我修正的 Agent 模式。
            </p>
          </div>
        </Section>

        {/* Section 4: MCP 协议 */}
        <Section title="MCP：AI 时代的 USB 接口" icon={Globe}>
          <p className="mb-6">
            <b>Model Context Protocol (MCP)</b> 是连接 AI 模型与外部数据的通用标准。
            以前，每个工具（如 Google Search, Notion）都需要单独写适配代码。现在，只要符合 MCP 标准，LangGraph Agent 可以即插即用。
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center bg-slate-900 p-8 rounded-xl">
            <div className="p-4 bg-slate-800 rounded-lg text-center w-full md:w-1/3">
              <div className="text-blue-400 font-bold mb-2">MCP Client</div>
              <div className="text-xs text-slate-500">我们的 LangGraph Agent</div>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-500 to-green-500 relative w-full md:w-auto">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2 text-xs text-slate-400 whitespace-nowrap">
                通用协议 (Stdio / SSE)
              </div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg text-center w-full md:w-1/3">
              <div className="text-green-400 font-bold mb-2">MCP Server</div>
              <div className="text-xs text-slate-500">工具 (文件系统, 数据库, API)</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {['本地文件系统', 'SQL 数据库', '浏览器自动化', 'Web 搜索'].map((item, i) => (
              <div key={i} className="bg-slate-800 py-2 rounded text-sm text-slate-300 border border-slate-700">
                {item}
              </div>
            ))}
          </div>
        </Section>

        {/* Section 5: 工具链 */}
        <Section title="工业级开发工具链" icon={Terminal}>
          <p className="mb-8">
            LangChain 1.0 不仅仅是代码库，它提供了一整套从开发到部署的 DevOps 工具。
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg"><Layout className="text-blue-400"/></div>
              <div>
                <h3 className="font-bold text-white">LangGraph Studio</h3>
                <p className="text-sm text-slate-400">可视化 IDE。不用写前端代码，直接在网页上查看 Agent 的思考路径、状态变化和记忆快照。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg"><Code className="text-green-400"/></div>
              <div>
                <h3 className="font-bold text-white">LangSmith</h3>
                <p className="text-sm text-slate-400">企业级监控。追踪每一次 LLM 调用的 Token 消耗、延迟和错误，用于调试和优化。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg"><Server className="text-purple-400"/></div>
              <div>
                <h3 className="font-bold text-white">LangGraph CLI</h3>
                <p className="text-sm text-slate-400">一键部署。将你的 Python 代码打包成生产级 API 服务，自动处理并发和持久化。</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Summary Footer */}
        <footer className="mt-20 py-10 border-t border-slate-800 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">总结</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            LangChain 1.0 + LangGraph + MCP 代表了当前 AI Agent 开发的最高工业标准。
            它不再是简单的“提示词工程”，而是演变成了一个包含<b>状态管理、工具协议、中间件控制</b>的完整软件工程体系。
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20">
            开始构建你的 Agent
          </button>
          <div className="mt-8 text-xs text-slate-600">
            Generated based on video content interpretation.
          </div>
        </footer>

      </main>
    </div>
  );
}