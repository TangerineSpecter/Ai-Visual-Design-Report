import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, Layout, Type, Palette, Code, Image as ImageIcon, 
  Share2, RefreshCw, Smartphone, Maximize2, ZoomIn, ZoomOut, 
  Settings, Coffee, FileText, Monitor, Film, Zap, Briefcase, Layers,
  Feather, TreePine, Cpu, BookOpen, Sun, Aperture, Music, Droplets, Newspaper, Crown
} from 'lucide-react';

// --- Utility: Load External Script ---
const useScript = (url) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};

// --- Syntax Highlighting Utility ---
const highlightCode = (code, theme) => {
  const tokens = [
    { regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, color: theme === 'tech' ? 'text-green-300' : 'text-green-600' }, 
    { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await)\b/g, color: theme === 'tech' ? 'text-purple-400' : 'text-purple-600 font-bold' }, 
    { regex: /\b(true|false|null|undefined)\b/g, color: theme === 'tech' ? 'text-orange-400' : 'text-orange-600' }, 
    { regex: /\b\d+\b/g, color: theme === 'tech' ? 'text-blue-400' : 'text-blue-600' }, 
    { regex: /\/\/.*/g, color: theme === 'tech' ? 'text-gray-500 italic' : 'text-gray-400 italic' }, 
    { regex: /[{}()[\]]/g, color: theme === 'tech' ? 'text-yellow-500' : 'text-gray-500' }, 
  ];

  let parts = [{ text: code, index: 0 }];

  tokens.forEach(token => {
    const newParts = [];
    parts.forEach(part => {
      if (part.color) { newParts.push(part); return; }
      let match, lastIndex = 0;
      const re = new RegExp(token.regex); 
      while ((match = re.exec(part.text)) !== null) {
        if (match.index > lastIndex) newParts.push({ text: part.text.substring(lastIndex, match.index), index: part.index + lastIndex });
        newParts.push({ text: match[0], color: token.color, index: part.index + match.index });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < part.text.length) newParts.push({ text: part.text.substring(lastIndex), index: part.index + lastIndex });
    });
    parts = newParts;
  });

  return parts.map((p, i) => <span key={i} className={p.color || ''}>{p.text}</span>);
};

// --- Mock Data & Presets ---
const PRESETS = {
  warm: {
    title: "一、风暴中心：美股市场——从降息狂欢到鹰派恐慌",
    author: "宏观策略",
    date: "2023-11-20",
    content: `
11月20日，美股市场走势极为戏剧化，其深层逻辑在于宏观数据与央行信号彻底颠覆了市场原有的叙事。

### 1.1 引爆市场的双重催化剂

#### A. 迟到但"致命"的9月非农就业报告

市场普遍预期在经济放缓趋势下，新增就业仅为5万人左右。然而，实际公布的数据高达 **11.9万**，是预期的两倍多。

这一数据成为市场的"惊吓"，其影响是决定性的：

* 粉碎降息逻辑：强劲的劳动力市场直接削弱了美联储降息的紧迫性和必要性。
* 华尔街迅速倒戈：以摩根士丹利为代表的投行迅速撤回了预测。
* 市场定价剧变：期货市场交易员大幅下调对12月FOMC会议降息的押注。

#### B. 揭示分歧的美联储会议纪要

同日公布的会议纪要明确指出，与会官员存在"强烈分歧的观点"。
    `,
    theme: 'warm',
    color: 'orange',
    width: 560
  },
  insight: {
    title: "Boden《以日为鉴》深度解析",
    author: "首席分析师",
    date: "2023.10.27",
    meta: { source: "宏观经济调查", role: "特约撰稿" },
    content: `
## 重要洞察 (Key Insights)

本报告旨在对《以日为鉴：衰退时代生存指南》进行系统性解析。

### 核心理论框架

综合现有调查结果，该书的核心价值在于其独特的 **微观叙事视角**，揭示了宏观政策如何塑造个体命运。

#### 关键发现点

1. 短期维稳的长期毒性：为维护短期社会稳定而采取的非市场化干预措施，可能会对经济活力造成长达数十年的结构性损害。
2. 宏观政策的微观传导：宏观经济政策并非遥远的数字，而是会通过就业市场、教育体系等渠道，直接并深刻地影响每个普通人。

---

### 行动建议

* 现金流管理：保持充裕的现金流储备。
* 技能重塑：投资于不可替代的专业技能。
    `,
    theme: 'insight',
    color: 'blue',
    width: 560
  },
  tech: {
      title: "Rust vs Go: 高性能后端选型指南",
      author: "DevOps_Lead",
      date: "2023-11-24",
      content: `
# 内存管理机制对比

Go 使用 GC (Garbage Collection)，而 Rust 使用 **Ownership** 机制。

### Go 的并发模型

Go 语言的 Goroutine 非常轻量。

\`\`\`go
func main() {
    go say("world")
    say("hello")
}
\`\`\`

### Rust 的安全性

Rust 在编译期保证内存安全。

#### 选型建议

* **Go**: 适合业务逻辑复杂、迭代快的微服务。
* **Rust**: 适合基础设施、高性能网关、嵌入式。
      `,
      theme: 'tech',
      color: 'blue',
      width: 560
  }
};

// --- Enhanced Markdown Parser ---
const MarkdownRenderer = ({ content, theme, color }) => {
  if (!content) return null;
  const lines = content.split('\n');
  const rendered = [];
  let inCodeBlock = false, codeBlockContent = [], codeLanguage = '';

  // Theme Colors Helper
  const getThemeColors = (t, c) => {
      // Warm Theme
      if (t === 'warm') return { 
          h1: 'text-[#E85D4E]', h2: 'text-[#E85D4E]', list: 'bg-[#E85D4E]', 
          bg: 'bg-[#FFF8F3]', text: 'text-[#4A4A4A]', bold: 'text-[#E85D4E]' 
      };
      // Insight Theme
      if (t === 'insight') {
          const map = {
              blue: { primary: 'bg-blue-600', gradient: 'from-blue-500 to-cyan-400', light: 'bg-blue-50', border: 'border-blue-600', text: 'text-blue-600', highlighter: 'rgba(191, 219, 254, 0.6)' },
              pink: { primary: 'bg-rose-500', gradient: 'from-rose-500 to-pink-400', light: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-600', highlighter: 'rgba(254, 205, 211, 0.6)' },
              green: { primary: 'bg-emerald-600', gradient: 'from-emerald-600 to-teal-400', light: 'bg-emerald-50', border: 'border-emerald-600', text: 'text-emerald-600', highlighter: 'rgba(167, 243, 208, 0.6)' },
              purple: { primary: 'bg-purple-600', gradient: 'from-purple-600 to-indigo-400', light: 'bg-purple-50', border: 'border-purple-600', text: 'text-purple-600', highlighter: 'rgba(221, 214, 254, 0.6)' },
          };
          return map[c] || map.blue;
      }
      return {};
  };
  const tc = getThemeColors(theme, color);

  // Determine if theme is dark to adjust default text color
  const isDarkTheme = ['tech', 'cyber', 'aurora', 'film', 'luxury'].includes(theme);
  const bodyTextClass = isDarkTheme ? 'text-inherit opacity-90' : 'text-gray-800 opacity-90';

  const parseInline = (text, isHeader = false) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /(\*\*(.*?)\*\*)|(`(.*?)`)|(#[\w\u4e00-\u9fa5]+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
      if (match[1]) {
          // Header bold check: if inside a header, strip effects
          if (isHeader) {
               parts.push(<span key={match.index}>{match[2]}</span>);
          } else {
              if (theme === 'insight') {
                  parts.push(
                    <strong key={match.index} className="font-bold mx-0.5 text-gray-900 relative z-0 inline-block">
                        <span className="absolute bottom-0.5 left-0 w-full h-2.5 -z-10 rounded-sm" style={{ backgroundColor: tc.highlighter }}></span>
                        {match[2]}
                    </strong>
                  );
              } else if (theme === 'warm') {
                  parts.push(<strong key={match.index} className="font-bold mx-0.5 text-[#E85D4E]">{match[2]}</strong>);
              } else if (isDarkTheme) {
                  parts.push(<strong key={match.index} className="font-bold mx-0.5 text-white/90 border-b border-white/40">{match[2]}</strong>);
              } else {
                  parts.push(<strong key={match.index} className="font-bold mx-0.5 text-indigo-600 bg-indigo-50 px-1 rounded">{match[2]}</strong>);
              }
          }
      }
      else if (match[3]) parts.push(<span key={match.index} className="mx-1 px-1.5 py-0.5 rounded text-[0.9em] font-mono bg-gray-100 text-red-500 border border-gray-200 break-all">{match[4]}</span>);
      else if (match[5]) parts.push(<span key={match.index} className="inline-flex items-center mx-1 text-xs font-medium text-blue-500 hover:underline cursor-pointer">{match[5]}</span>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return parts;
  };

  lines.forEach((line, index) => {
    const key = index;
    const trimmed = line.trim();

    // Code Block
    if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
            rendered.push(
                <div key={`code-${key}`} className={`my-4 rounded-lg overflow-hidden shadow-sm text-sm font-mono leading-normal ${
                    theme === 'tech' ? 'bg-[#1e1e1e] border border-slate-700' : 'bg-gray-800 text-white'
                }`}>
                    <div className="p-4 overflow-x-hidden">
                        <pre className="whitespace-pre-wrap break-words">{highlightCode(codeBlockContent.join('\n'), theme)}</pre>
                    </div>
                </div>
            );
            inCodeBlock = false;
            codeBlockContent = [];
        } else {
            inCodeBlock = true;
            codeLanguage = trimmed.replace('```', '').trim();
        }
        return;
    }
    if (inCodeBlock) { codeBlockContent.push(line); return; }

    // Headers
    if (line.startsWith('# ')) {
        const text = line.replace('# ', '');
        if (theme === 'warm') rendered.push(<h1 key={key} className="text-xl font-bold mt-6 mb-3 leading-snug text-[#E85D4E]">{parseInline(text, true)}</h1>);
        else rendered.push(<h1 key={key} className={`text-3xl font-black mt-8 mb-4 leading-tight ${isDarkTheme ? 'text-inherit' : 'text-gray-900'}`}>{parseInline(text, true)}</h1>);
    }
    else if (line.startsWith('## ')) {
        const text = line.replace('## ', '');
        if (theme === 'insight') rendered.push(
            <div key={key} className="flex justify-center my-8">
                <div className={`px-8 py-2 rounded-full shadow-lg text-white font-bold text-lg tracking-wide bg-gradient-to-r ${tc.gradient}`}>{parseInline(text, true)}</div>
            </div>
        );
        else if (theme === 'warm') rendered.push(<h2 key={key} className="text-lg font-bold mt-5 mb-2 text-[#E85D4E] opacity-90">{parseInline(text, true)}</h2>);
        else rendered.push(<h2 key={key} className={`text-xl font-bold mt-5 mb-3 ${isDarkTheme ? 'text-inherit' : ''}`}>{parseInline(text, true)}</h2>);
    }
    else if (line.startsWith('### ')) {
        const text = line.replace('### ', '');
        if (theme === 'insight') rendered.push(
            <div key={key} className={`mt-8 mb-4 px-4 py-3 rounded-r-lg border-l-[6px] ${tc.border} ${tc.light} text-black font-bold text-lg shadow-sm flex items-center`}>{parseInline(text, true)}</div>
        );
        else if (theme === 'warm') rendered.push(<h3 key={key} className="text-base font-bold mt-4 mb-2 text-[#E85D4E] opacity-80">{parseInline(text, true)}</h3>);
        else rendered.push(<h3 key={key} className={`text-lg font-bold mt-4 mb-2 opacity-90 ${isDarkTheme ? 'text-inherit' : ''}`}>{parseInline(text, true)}</h3>);
    }
    else if (line.startsWith('#### ')) {
        const text = line.replace('#### ', '');
        if (theme === 'insight') rendered.push(<h4 key={key} className="text-base font-bold mt-6 mb-3 text-black border-l-4 border-gray-400 pl-3">{parseInline(text, true)}</h4>);
        else rendered.push(<h4 key={key} className={`text-base font-bold mt-4 mb-2 flex items-center ${isDarkTheme ? 'text-inherit' : 'text-black'}`}><span className="mr-2 text-lg">▪</span>{parseInline(text, true)}</h4>);
    }
    else if (line.startsWith('##### ')) {
        const text = line.replace('##### ', '');
        if (theme === 'insight') rendered.push(<h5 key={key} className="text-sm font-bold mt-4 mb-2 text-gray-800 flex items-center"><span className={`w-2 h-2 rounded-full mr-2 ${tc.primary}`}></span>{parseInline(text, true)}</h5>);
        else rendered.push(<h5 key={key} className={`text-sm font-bold mt-3 mb-1 italic opacity-80 ${isDarkTheme ? 'text-inherit' : 'text-black'}`}>{parseInline(text, true)}</h5>);
    }
    
    // Blockquote
    else if (line.startsWith('> ')) rendered.push(
        <blockquote key={key} className={`my-4 pl-4 py-1 border-l-4 italic opacity-80 ${theme === 'insight' ? 'border-blue-500 bg-blue-50/50 text-gray-700' : isDarkTheme ? 'border-gray-500 text-gray-400' : 'border-gray-300'}`}>
           {parseInline(line.replace('> ', ''))}
        </blockquote>
    );
    
    // Lists
    else if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s(.*)/);
        if (match) {
            const num = match[1], text = match[2];
            if (theme === 'insight') rendered.push(
                <div key={key} className="flex items-start my-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5 ${tc.primary}`}>{num}</div>
                    <span className="leading-relaxed text-gray-800">{parseInline(text)}</span>
                </div>
            );
            else rendered.push(<div key={key} className="flex items-start my-1.5"><span className="mr-2 font-bold opacity-60">{num}.</span><span className="leading-relaxed">{parseInline(text)}</span></div>);
        }
    }
    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
         const text = trimmed.replace(/^[\*\-]\s/, '');
         if (theme === 'insight') rendered.push(
             <div key={key} className="flex items-start my-2">
               <div className="mr-2 mt-1.5 text-red-500 text-[10px] flex-shrink-0">◆</div>
               <span className="leading-relaxed text-gray-800">{parseInline(text)}</span>
             </div>
        );
        else if (theme === 'warm') rendered.push(
             <div key={key} className="flex items-start my-2">
               <div className="mr-2 mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#E85D4E] opacity-60"></div>
               <span className="leading-relaxed">{parseInline(text)}</span>
             </div>
        );
        else rendered.push(
             <div key={key} className="flex items-start my-1.5">
               <div className={`mr-2 mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current opacity-60`}></div>
               <span className="leading-relaxed">{parseInline(text)}</span>
             </div>
        );
    }
    // Checklist
    else if (trimmed.startsWith('[ ] ')) rendered.push(
        <div key={key} className="flex items-center my-1.5 opacity-90"><div className="w-4 h-4 border-2 border-gray-400 rounded mr-2"></div><span>{parseInline(line.replace('[ ] ', ''))}</span></div>
    );
    else if (trimmed === '---') rendered.push(<hr key={key} className="my-6 border-t-2 border-dashed border-gray-300" />);
    else if (trimmed !== '') rendered.push(<p key={key} className={`mb-3 leading-7 text-justify break-words ${bodyTextClass}`}>{parseInline(line)}</p>);
    else rendered.push(<div key={key} className="h-2"></div>);
  });
  return <div>{rendered}</div>;
};

export default function PosterGenerator() {
  useScript('https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js');

  const [activeTab, setActiveTab] = useState('editor');
  const [data, setData] = useState(PRESETS.insight); // Default width now 560 from preset
  const [zoom, setZoom] = useState(0.8);
  const [exporting, setExporting] = useState(false);
  const posterRef = useRef(null);

  const handleDownload = async () => {
    if (!window.htmlToImage || !posterRef.current) return;
    setExporting(true);
    try {
        const dataUrl = await window.htmlToImage.toPng(posterRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = `poster-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    } catch (e) { alert("Error generating image."); } 
    finally { setExporting(false); }
  };

  // --- Styles List (Updated to 20) ---
  const stylesList = [
      { id: 'insight', name: '深度研报', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
      { id: 'warm', name: '暖阳研报', icon: Sun, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }, 
      { id: 'redbook', name: '小红书', icon: Smartphone, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
      { id: 'wechat', name: '公众号', icon: Type, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
      { id: 'tech', name: '极客代码', icon: Code, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
      { id: 'aurora', name: '极光渐变', icon: Aperture, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' }, 
      { id: 'brutalism', name: '新丑主义', icon: Zap, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' }, 
      { id: 'academic', name: '学术论文', icon: BookOpen, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }, 
      { id: 'vogue', name: '时尚杂志', icon: Feather, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' }, 
      { id: 'forest', name: '自然森系', icon: TreePine, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' }, 
      { id: 'cyber', name: '赛博朋克', icon: Cpu, color: 'text-purple-500', bg: 'bg-slate-900', border: 'border-purple-900' }, 
      { id: 'lofi', name: 'Lo-Fi', icon: Music, color: 'text-purple-400', bg: 'bg-purple-50', border: 'border-purple-200' }, // New 17
      { id: 'glass', name: '毛玻璃', icon: Droplets, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' }, // New 18
      { id: 'vintage', name: '老报纸', icon: Newspaper, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }, // New 19
      { id: 'luxury', name: '黑金商务', icon: Crown, color: 'text-yellow-600', bg: 'bg-neutral-900', border: 'border-yellow-600' }, // New 20
      { id: 'zen', name: '日签', icon: Coffee, color: 'text-stone-600', bg: 'bg-stone-50', border: 'border-stone-200' },
      { id: 'notion', name: 'Notion', icon: Layers, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
      { id: 'pop', name: '孟菲斯', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      { id: 'business', name: '商务风', icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
      { id: 'minimal', name: '极简黑白', icon: Monitor, color: 'text-black', bg: 'bg-gray-100', border: 'border-black' },
  ];

  // --- Templates ---

  // 17. Lo-Fi (New)
  const LoFiTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-[#E0D6EB] p-8 font-mono text-[#4A3B59] border-[6px] border-[#9F87AF] flex flex-col relative">
          <div className="absolute top-4 right-4 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#FF7676]"></div>
              <div className="w-3 h-3 rounded-full bg-[#F6E05E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#68D391]"></div>
          </div>
          <div className="mt-8 mb-6 text-center border-b-2 border-dashed border-[#9F87AF] pb-6">
              <h1 className="text-2xl font-bold mb-2 tracking-wider">{data.title}</h1>
              <div className="text-xs uppercase opacity-70">♫ Now Playing: {data.author} - {data.date}</div>
          </div>
          <div className="flex-1 bg-white/50 p-6 rounded-xl backdrop-blur-sm shadow-inner">
              <MarkdownRenderer content={data.content} theme="pop" />
          </div>
      </div>
  );

  // 18. Glass (New)
  const GlassTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex flex-col font-sans relative">
          <div className="w-48 h-48 bg-yellow-300 rounded-full absolute top-[-50px] left-[-50px] mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="w-48 h-48 bg-pink-300 rounded-full absolute top-[-50px] right-[-50px] mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 h-full flex flex-col text-white">
              <div className="border-b border-white/20 pb-4 mb-6">
                  <h1 className="text-3xl font-bold drop-shadow-sm">{data.title}</h1>
                  <div className="flex justify-between mt-2 text-sm font-medium text-white/80">
                      <span>{data.author}</span><span>{data.date}</span>
                  </div>
              </div>
              <div className="flex-1 text-white/95 drop-shadow-sm"><MarkdownRenderer content={data.content} theme="tech" /></div>
          </div>
      </div>
  );

  // 19. Vintage (New)
  const VintageTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-[#F0E6D2] p-6 font-serif text-[#2C241B] flex flex-col relative">
          <div className="border-4 border-double border-[#4A3C31] h-full p-6 flex flex-col relative">
              <div className="text-center border-b-2 border-[#4A3C31] pb-4 mb-4">
                  <div className="text-4xl font-black uppercase tracking-tighter mb-2">The Daily Post</div>
                  <div className="flex justify-between border-t border-b border-[#4A3C31] py-1 text-xs uppercase tracking-widest">
                      <span>Vol. 01</span><span>{data.date}</span><span>Price: Free</span>
                  </div>
              </div>
              <h1 className="text-3xl font-bold text-center mb-6 leading-none">{data.title}</h1>
              <div className="text-center text-sm italic mb-6">— Written by {data.author} —</div>
              <div className="flex-1 text-justify leading-6 text-sm" style={{ columnCount: 1 }}>
                  <MarkdownRenderer content={data.content} theme="zen" />
              </div>
          </div>
      </div>
  );

  // 20. Luxury (New)
  const LuxuryTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-[#0F0F0F] p-10 font-sans text-[#D4AF37] flex flex-col border border-[#D4AF37]">
          <div className="text-center mb-12">
              <Crown size={48} className="mx-auto mb-6 opacity-80" />
              <h1 className="text-3xl font-light tracking-[0.1em] uppercase mb-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">{data.title}</h1>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
              <div className="mt-4 text-xs tracking-[0.3em] text-[#888] uppercase">{data.author} &bull; {data.date}</div>
          </div>
          <div className="flex-1 text-[#E5E5E5] font-light leading-8 tracking-wide">
              <MarkdownRenderer content={data.content} theme="luxury" />
          </div>
          <div className="text-center text-[10px] text-[#444] mt-8 uppercase tracking-[0.5em]">Exclusive Invitation</div>
      </div>
  );

  // ... (Previous templates: Warm, Insight, Aurora, Brutalism, Academic, Vogue, Forest, Cyber, etc. - Kept exactly as is)
  const WarmTemplate = ({ data }) => (
    <div className="w-full min-h-full bg-[#FFF8F3] p-10 font-sans text-[#4A4A4A] relative">
         <div className="border-l-4 border-[#E85D4E] pl-6 mb-8">
             <h1 className="text-2xl font-bold text-[#E85D4E] leading-relaxed mb-4">{data.title}</h1>
             <div className="text-sm text-gray-500 font-medium">{data.date} · {data.author}</div>
         </div>
         <div className="flex-1 text-base leading-7">
             <MarkdownRenderer content={data.content} theme="warm" />
         </div>
         <div className="mt-12 pt-4 border-t border-[#E85D4E]/20 text-xs text-[#E85D4E] text-center opacity-80 font-bold tracking-widest uppercase">
             Daily Insights
         </div>
    </div>
  );
  const AuroraTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-slate-900 p-8 font-sans text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 z-0"></div>
          <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[50%] bg-cyan-400 rounded-full blur-[100px] opacity-30 z-0"></div>
          <div className="relative z-10 backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
              <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-white">{data.title}</h1>
              <div className="flex items-center text-xs text-cyan-200 mb-8 uppercase tracking-widest font-bold">
                  <span className="mr-4">{data.date}</span><span>// {data.author}</span>
              </div>
              <div className="flex-1 text-gray-100 leading-relaxed"><MarkdownRenderer content={data.content} theme="aurora" /></div>
          </div>
      </div>
  );
  const BrutalismTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-[#C4B5FD] p-6 font-mono text-black">
          <div className="bg-[#A78BFA] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
              <h1 className="text-2xl font-black uppercase mb-2">{data.title}</h1>
              <div className="border-t-4 border-black pt-2 mt-2 flex justify-between font-bold text-xs">
                  <span>{data.author}</span><span>{data.date}</span>
              </div>
          </div>
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 min-h-[500px]">
              <MarkdownRenderer content={data.content} theme="pop" />
          </div>
      </div>
  );
  const AcademicTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-white p-10 font-serif text-gray-900 flex flex-col">
          <div className="border-b-2 border-black pb-6 mb-6 text-center">
              <h1 className="text-2xl font-bold mb-3">{data.title}</h1>
              <div className="text-sm italic text-gray-600">By {data.author}, {data.date}</div>
          </div>
          <div className="flex-1 columns-1 text-justify leading-7 text-sm">
              <MarkdownRenderer content={data.content} theme="notion" />
          </div>
          <div className="mt-8 text-[10px] text-center text-gray-400 font-sans">Preprint | Not for distribution</div>
      </div>
  );
  const VogueTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-[#FDFBF7] p-8 font-serif text-gray-900 flex flex-col relative border-[12px] border-white outline outline-1 outline-gray-200">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[100px] opacity-5 font-black font-sans pointer-events-none">VOGUE</div>
          <h1 className="text-4xl font-light italic mb-8 mt-4 text-center">{data.title}</h1>
          <div className="flex justify-center mb-8"><div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs italic">A</div></div>
          <div className="flex-1 text-base leading-loose px-4"><MarkdownRenderer content={data.content} theme="zen" /></div>
          <div className="text-center text-xs tracking-[0.3em] mt-10 uppercase border-t border-gray-200 pt-4">Exclusive</div>
      </div>
  );
  const ForestTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-[#EAE7DC] p-8 font-sans text-[#4A4036] relative flex flex-col">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#8E8D8A]"></div>
          <div className="bg-white/60 p-8 rounded-b-3xl shadow-sm flex-1">
               <h1 className="text-2xl font-bold text-[#E98074] mb-4">{data.title}</h1>
               <div className="flex items-center text-xs text-[#8E8D8A] mb-8 font-bold uppercase tracking-wide">
                   <TreePine size={14} className="mr-2"/> {data.author} · {data.date}
               </div>
               <div className="leading-8 text-[#4A4036]"><MarkdownRenderer content={data.content} theme="zen" /></div>
          </div>
      </div>
  );
  const CyberTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-black p-6 font-mono text-[#00ff41] relative overflow-hidden border border-[#00ff41]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
          <div className="relative z-10 p-4 border border-[#00ff41] h-full shadow-[0_0_20px_rgba(0,255,65,0.2)]">
              <h1 className="text-xl font-bold mb-4 text-[#f0f] text-shadow-neon">{data.title}</h1>
              <div className="border-b border-[#00ff41] pb-2 mb-4 text-xs opacity-80 flex justify-between">
                  <span>SYS.ADMIN: {data.author}</span><span>LOG: {data.date}</span>
              </div>
              <div className="text-sm leading-relaxed text-[#00ff41]"><MarkdownRenderer content={data.content} theme="cyber" /></div>
          </div>
      </div>
  );
  const InsightTemplate = ({ data }) => {
    return (
        <div className={`w-full min-h-full bg-[#F5F7FF] p-8 flex flex-col font-sans relative`}>
            <div className="border-b-2 border-gray-200/60 pb-6 mb-2">
                <h1 className="text-3xl font-extrabold text-[#4A55A2] mb-4 leading-tight">{data.title}</h1>
                <div className="space-y-1.5 text-sm text-gray-600 font-medium">
                     <div><span className="font-bold text-[#4A55A2]">报告撰写人</span> {data.author}</div>
                     <div><span className="font-bold text-[#4A55A2]">报告日期</span> {data.date}</div>
                </div>
            </div>
            <div className="flex-1 text-gray-800 leading-relaxed"><MarkdownRenderer content={data.content} theme="insight" color={data.color} /></div>
            <div className="mt-12 pt-4 border-t border-gray-300 flex justify-between items-center opacity-70">
                <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-[#4A55A2]"></div><span className="text-xs font-bold uppercase text-gray-500">Deep Insight</span></div>
            </div>
        </div>
    );
  };
  const RedBookTemplate = ({ data }) => (
    <div className="w-full min-h-full bg-white relative flex flex-col font-sans p-6">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-rose-50 to-white z-0"></div>
        <div className="relative z-10 bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="h-40 bg-rose-100 flex items-center justify-center p-6 text-center">
                <h1 className="text-xl font-black text-gray-800">{data.title}</h1>
            </div>
            <div className="p-6 text-gray-700 leading-relaxed flex-1"><MarkdownRenderer content={data.content} theme="redbook" /></div>
        </div>
    </div>
  );
  const WeChatTemplate = ({ data }) => (
    <div className="w-full min-h-full bg-white p-10 font-serif flex flex-col border border-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">{data.title}</h1>
        <div className="text-sm text-gray-400 mb-8">{data.date} <span className="text-blue-600 mx-2">{data.author}</span></div>
        <div className="flex-1 text-gray-700 leading-7"><MarkdownRenderer content={data.content} theme="wechat" /></div>
    </div>
  );
  const TechTemplate = ({ data }) => (
    <div className="w-full min-h-full bg-[#0f172a] text-slate-300 p-8 font-mono flex flex-col">
         <div className="border-b border-slate-700 pb-4 mb-6"><h1 className="text-xl font-bold text-white">{data.title}</h1></div>
         <div className="flex-1"><MarkdownRenderer content={data.content} theme="tech" /></div>
    </div>
  );
  const ZenTemplate = ({ data }) => (
    <div className="w-full min-h-full bg-[#f4f1ea] p-8 font-serif flex flex-col items-center">
         <div className="bg-white p-8 shadow-lg flex-1 w-full border border-stone-200">
             <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white mb-6 font-bold">{data.title[0]}</div>
             <h1 className="text-2xl font-bold text-stone-800 mb-6">{data.title}</h1>
             <div className="text-stone-600 leading-loose"><MarkdownRenderer content={data.content} theme="zen" /></div>
         </div>
    </div>
  );
  const NotionTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-white text-[#37352f] p-10 font-sans flex flex-col">
          <div className="text-4xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold mb-6 text-gray-900">{data.title}</h1>
          <div className="flex-1 leading-7 text-lg"><MarkdownRenderer content={data.content} theme="notion" /></div>
      </div>
  );
  const PopTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-[#FFE66D] p-6 font-sans text-gray-900 border-8 border-black">
           <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col">
               <h1 className="text-3xl font-black italic mb-4 bg-black text-white p-2 inline-block">{data.title}</h1>
               <div className="flex-1"><MarkdownRenderer content={data.content} theme="pop" /></div>
           </div>
      </div>
  );
  const BusinessTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-slate-50 flex flex-col font-sans text-slate-800">
           <div className="bg-[#1e293b] text-white p-8"><h1 className="text-xl font-bold">{data.title}</h1></div>
           <div className="p-8 flex-1 bg-white"><MarkdownRenderer content={data.content} theme="business" /></div>
      </div>
  );
  const MinimalTemplate = ({ data }) => (
      <div className="w-full min-h-full bg-white p-10 font-sans flex flex-col border-l-[20px] border-black">
          <h1 className="text-4xl font-black mb-8">{data.title}</h1>
          <div className="flex-1 text-lg font-medium leading-relaxed"><MarkdownRenderer content={data.content} theme="minimal" /></div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-2 rounded-lg shadow-md"><Layout size={20} /></div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">海报生成器 <span className="text-xs font-normal text-gray-500 ml-1 bg-gray-100 px-2 py-0.5 rounded-full">v5.0</span></h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeTab === 'editor' ? (
            <div className="h-full flex flex-col md:flex-row">
                <div className="w-full md:w-[420px] bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl flex-shrink-0">
                    
                    {/* FIXED EXPORT BUTTON AREA */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50 z-10">
                        <button onClick={handleDownload} disabled={exporting} className="w-full py-3 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-base hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-70">
                            {exporting ? <><RefreshCw className="animate-spin mr-2" size={18} /> 处理中...</> : <><Download className="mr-2" size={18} /> 导出高清图片</>}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Styles Grid */}
                        <div className="space-y-3">
                             <div className="flex items-center justify-between"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center"><Layout size={12} className="mr-1"/> 风格库 (20)</label></div>
                             <div className="grid grid-cols-2 gap-3">
                                {stylesList.map((t) => (
                                    <button 
                                        key={t.id}
                                        onClick={() => {
                                            const preset = PRESETS[t.id] ? PRESETS[t.id] : data;
                                            setData({...preset, theme: t.id, width: 560, color: data.color});
                                        }} 
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${data.theme === t.id ? `${t.border} ${t.bg} ${t.color} ring-1 ring-offset-1` : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                                    >
                                        <div className="flex items-center justify-between mb-1"><t.icon size={18} />{data.theme === t.id && <div className="w-2 h-2 rounded-full bg-current"></div>}</div>
                                        <div className="text-sm font-bold">{t.name}</div>
                                    </button>
                                ))}
                             </div>
                        </div>

                        {/* Config */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center"><Settings size={12} className="mr-1"/> 参数设置</label>
                             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between text-sm mb-2 font-medium text-gray-700"><span>海报宽度</span><span>{data.width}px</span></div>
                                <input type="range" min="300" max="800" step="10" value={data.width || 560} onChange={(e) => setData({...data, width: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                             </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 pt-4 border-t border-gray-100 pb-10">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center"><Type size={12} className="mr-1"/> 内容编辑</label>
                            <input type="text" placeholder="标题" value={data.title} onChange={(e) => setData({...data, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <div className="flex space-x-3">
                                <input type="text" placeholder="作者" value={data.author} onChange={(e) => setData({...data, author: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm" />
                                <input type="text" placeholder="日期" value={data.date} onChange={(e) => setData({...data, date: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm" />
                            </div>
                            <div className="relative">
                                <textarea value={data.content} onChange={(e) => setData({...data, content: e.target.value})} placeholder="支持 Markdown..." className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-80 font-mono text-sm leading-relaxed resize-none bg-gray-50" />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none bg-white/80 px-2 py-1 rounded backdrop-blur">Markdown Supported</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-gray-200/80 relative overflow-hidden flex flex-col">
                     <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/90 backdrop-blur shadow-sm rounded-full px-4 py-2 border border-gray-200/50 space-x-4">
                        <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ZoomOut size={16}/></button>
                        <span className="text-xs font-mono w-12 text-center text-gray-500">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ZoomIn size={16}/></button>
                        <div className="w-px h-4 bg-gray-300 mx-2"></div>
                        <span className="text-xs text-gray-400 flex items-center"><Maximize2 size={12} className="mr-1"/> 预览模式</span>
                     </div>
                     <div className="flex-1 overflow-auto flex items-start justify-center p-12">
                         <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', width: `${data.width}px`, transition: 'width 0.3s ease' }} className="flex-shrink-0 shadow-2xl">
                             <div ref={posterRef} className="w-full h-auto bg-white">
                                {data.theme === 'warm' && <WarmTemplate data={data} />}
                                {data.theme === 'insight' && <InsightTemplate data={data} />}
                                {data.theme === 'aurora' && <AuroraTemplate data={data} />}
                                {data.theme === 'brutalism' && <BrutalismTemplate data={data} />}
                                {data.theme === 'academic' && <AcademicTemplate data={data} />}
                                {data.theme === 'vogue' && <VogueTemplate data={data} />}
                                {data.theme === 'forest' && <ForestTemplate data={data} />}
                                {data.theme === 'cyber' && <CyberTemplate data={data} />}
                                {data.theme === 'lofi' && <LoFiTemplate data={data} />}
                                {data.theme === 'glass' && <GlassTemplate data={data} />}
                                {data.theme === 'vintage' && <VintageTemplate data={data} />}
                                {data.theme === 'luxury' && <LuxuryTemplate data={data} />}
                                {data.theme === 'redbook' && <RedBookTemplate data={data} />}
                                {data.theme === 'wechat' && <WeChatTemplate data={data} />}
                                {data.theme === 'tech' && <TechTemplate data={data} />}
                                {data.theme === 'zen' && <ZenTemplate data={data} />}
                                {data.theme === 'notion' && <NotionTemplate data={data} />}
                                {data.theme === 'pop' && <PopTemplate data={data} />}
                                {data.theme === 'business' && <BusinessTemplate data={data} />}
                                {data.theme === 'minimal' && <MinimalTemplate data={data} />}
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        ) : (
            <div className="max-w-4xl mx-auto py-12 px-6 overflow-y-auto h-full text-center text-gray-500">
                API 文档内容同上...
            </div>
        )}
      </main>
    </div>
  );
}