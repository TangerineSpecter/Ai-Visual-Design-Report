import React, { useState, useEffect, useRef } from 'react';
import { Play, DollarSign, Globe, Shield, BookOpen, ArrowRight, Activity, TrendingUp, Lock, Database, Zap } from 'lucide-react';

// --- Utility Components ---

// Hook to detect when an element is in view
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Only trigger once
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, isVisible];
};

const FadeInSection = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Diagram Components ---

// Triangle of Power Diagram
const PowerTriangle = () => {
  return (
    <div className="relative w-64 h-64 mx-auto my-8">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="url(#grad1)" strokeWidth="2" />
        
        <circle cx="50" cy="10" r="8" fill="#10B981" className="animate-pulse" />
        <text x="50" y="25" textAnchor="middle" fill="#D1D5DB" fontSize="4" fontWeight="bold">安全结构 (Security)</text>
        <text x="50" y="30" textAnchor="middle" fill="#9CA3AF" fontSize="3">军事霸权</text>

        <circle cx="90" cy="90" r="8" fill="#F59E0B" className="animate-pulse" style={{ animationDelay: '1s' }} />
        <text x="90" y="105" textAnchor="middle" fill="#D1D5DB" fontSize="4" fontWeight="bold">软实力 (Soft Power)</text>
        <text x="90" y="110" textAnchor="middle" fill="#9CA3AF" fontSize="3">知识/制度/观念</text>

        <circle cx="10" cy="90" r="8" fill="#3B82F6" className="animate-pulse" style={{ animationDelay: '2s' }} />
        <text x="10" y="105" textAnchor="middle" fill="#D1D5DB" fontSize="4" fontWeight="bold">经济结构 (Finance)</text>
        <text x="10" y="110" textAnchor="middle" fill="#9CA3AF" fontSize="3">生产/贸易/金融</text>
        
        {/* Connecting Lines Animation */}
        <path d="M50 18 L82 82" stroke="white" strokeWidth="0.5" strokeDasharray="2" className="animate-[dash_3s_linear_infinite]" />
        <path d="M18 82 L50 18" stroke="white" strokeWidth="0.5" strokeDasharray="2" className="animate-[dash_3s_linear_infinite]" />
        <path d="M18 88 L82 88" stroke="white" strokeWidth="0.5" strokeDasharray="2" className="animate-[dash_3s_linear_infinite]" />
      </svg>
    </div>
  );
};

// Commodity Dollar Cycle Diagram
const TradeCycle = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto h-48 bg-gray-900 rounded-xl border border-gray-700 p-4 overflow-hidden">
      <div className="absolute top-4 left-4 flex flex-col items-center z-10">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
          <Globe className="text-white w-6 h-6" />
        </div>
        <span className="text-xs text-gray-300 font-bold">世界各国 (贸易国)</span>
        <span className="text-[10px] text-red-400">辛苦生产商品</span>
      </div>

      <div className="absolute top-4 right-4 flex flex-col items-center z-10">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
          <DollarSign className="text-white w-6 h-6" />
        </div>
        <span className="text-xs text-gray-300 font-bold">美国 (金融国)</span>
        <span className="text-[10px] text-green-400">印钞消费</span>
      </div>

      {/* Arrows */}
      <div className="absolute top-10 left-16 right-16 h-20">
        {/* Top Arrow: Goods */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 opacity-50"></div>
        <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 bg-gray-900 px-1">
          实体商品 (Goods)
        </div>
        <div className="absolute top-[-4px] animate-[moveRight_3s_linear_infinite] w-2 h-2 bg-blue-400 rounded-full"></div>

        {/* Bottom Arrow: Dollars */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 opacity-50"></div>
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 text-[10px] text-green-400 bg-gray-900 px-1 text-center">
          美元回流 (购买美债)<br/>维持汇率稳定
        </div>
        <div className="absolute bottom-[-4px] animate-[moveLeft_3s_linear_infinite] w-2 h-2 bg-green-400 rounded-full"></div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function DollarHegemony() {
  const [activeTab, setActiveTab] = useState(0);

  const sections = [
    { title: "帝国基石", icon: <Shield size={18} /> },
    { title: "逻辑逆转", icon: <Activity size={18} /> },
    { title: "三大机制", icon: <DollarSign size={18} /> },
    { title: "结构性权力", icon: <Lock size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500 selection:text-white pb-20">
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        @keyframes moveRight {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes moveLeft {
          0% { left: 100%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 0; opacity: 0; }
        }
      `}</style>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950 z-0"></div>
        <div className="z-10 text-center px-4 max-w-4xl">
          <div className="inline-block px-3 py-1 mb-4 border border-blue-500/30 rounded-full bg-blue-900/10 text-blue-400 text-sm font-medium tracking-wide animate-fade-in-up">
            李晓教授深度解析
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 animate-fade-in-up delay-100">
            美元如何控制世界
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            不是通过占领领土，而是通过重塑人类的金融逻辑。<br/>
            <span className="text-blue-400 text-base mt-2 block">解析金融帝国的底层代码</span>
          </p>
          <button 
            onClick={() => document.getElementById('content-start').scrollIntoView({ behavior: 'smooth' })}
            className="group bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto animate-bounce"
          >
            开始解构 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
      </header>

      {/* Navigation Sticky Header */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex justify-start md:justify-center space-x-2 md:space-x-8 py-4 min-w-max">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  document.getElementById(`section-${index}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === index 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main id="content-start" className="max-w-4xl mx-auto px-6 py-12 space-y-32">
        
        {/* Section 1: Introduction & Triangle */}
        <section id="section-0" className="scroll-mt-32">
          <FadeInSection>
            <div className="border-l-4 border-blue-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">美国的本质：人为设计的金融帝国</h2>
              <p className="text-gray-400">不同于传统的领土帝国，美国是人类历史上第一个建立在“人性恶”假设基础上的人为设计国家。</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">独特性一：</strong> 它是先有宪法（1787年），后有国家。这套制度设计了200多年几乎没有大改，展现了极强的制度稳定性。
                </p>
                <p>
                  <strong className="text-white">独特性二：</strong> “大而富”。历史上大国往往难富（如古代帝国），富国往往不大（如荷兰、威尼斯）。美国打破了这一规律，在工业、农业、科技、金融上均无短板。
                </p>
                <p>
                  <strong className="text-white">独特性三：</strong> 进可攻退可守的地理位置。
                </p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h3 className="text-center text-sm font-mono text-gray-500 mb-4">美国的权力三角结构</h3>
                <PowerTriangle />
                <p className="text-xs text-center text-gray-500 mt-4">这三种力量相互支撑，构成了霸权的基石。</p>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Section 2: The Shift */}
        <section id="section-1" className="scroll-mt-32">
          <FadeInSection>
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 p-8 rounded-3xl border border-red-900/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                  <Activity size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white">1971年：人类金融逻辑的彻底逆转</h2>
              </div>
              
              <div className="space-y-6 text-lg text-gray-300">
                <p>
                  在此之前，世界遵循的是<strong className="text-red-400 mx-1">债权人逻辑</strong>：
                  <span className="block text-sm text-gray-500 mt-1">“欠债还钱，杀人偿命”。英国作为霸主时，必须维持英镑高估，必须通过努力赚钱来还债。</span>
                </p>
                
                <div className="h-px bg-gray-700 my-4"></div>

                <p>
                  <span className="text-white font-bold">1971年 尼克松冲击 (Nixon Shock)</span><br/>
                  美元与黄金脱钩。从此，美国将逻辑偷换为<strong className="text-blue-400 mx-1">债务人逻辑</strong>：
                  <span className="block text-sm text-gray-500 mt-1">
                    美国变成了世界上最大的债务国，但它不再焦虑如何还钱，而是让债权人（如中国、日本、德国）焦虑“美国能不能维持美元价值”。
                  </span>
                </p>
                
                <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-yellow-500 mt-4">
                  <p className="text-yellow-500 italic font-medium">“美元是我们的货币，却是你们的问题。”</p>
                  <p className="text-right text-xs text-gray-500 mt-2">— 约翰·康纳利 (时任美国财长)</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Section 3: Three Mechanisms */}
        <section id="section-2" className="scroll-mt-32">
          <FadeInSection>
            <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
              <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
              美元霸权的三大控制机制
            </h2>

            <div className="grid gap-8">
              {/* Mechanism 1 */}
              <div className="group relative bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-colors border border-gray-800">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg">1</div>
                <h3 className="text-xl font-bold text-blue-400 mb-4 ml-6">商品美元环流机制 (贸易国家的悲剧)</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-gray-300 text-sm leading-relaxed">
                    <p className="mb-4">
                      除了美国，世界上分为两类国家：<strong>生产国</strong>（中、德、日）和<strong>资源国</strong>（俄、沙特）。
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-400">
                      <li>美国提供最终消费市场，输出美元。</li>
                      <li>生产国辛苦赚取美元，为了防止本币升值影响出口，被迫购买美债。</li>
                      <li><strong>结果：</strong>一群赚了美国钱的国家，还要负责支撑美国的汇率和债务稳定。</li>
                    </ul>
                  </div>
                  <TradeCycle />
                </div>
              </div>

              {/* Mechanism 2 */}
              <div className="group relative bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-colors border border-gray-800">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg">2</div>
                <h3 className="text-xl font-bold text-purple-400 mb-4 ml-6">石油交易的美元计价机制</h3>
                <div className="text-gray-300 text-sm leading-relaxed space-y-4">
                  <p>
                    1973-1974年，美国与沙特达成“不可动摇协议”。黄金脱钩后，美元找到了新的“锚”——<strong>石油</strong>（工业的血液）。
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-black/30 p-4 rounded-lg border border-purple-500/20">
                      <h4 className="font-bold text-white mb-2">萨达姆的教训</h4>
                      <p className="text-xs text-gray-400">萨达姆曾试图用欧元结算石油，触动了美国的“肺管子”（核心利益），导致了第二次海湾战争。这是一场为了维护美元计价权的战争。</p>
                    </div>
                    <div className="flex-1 bg-black/30 p-4 rounded-lg border border-purple-500/20">
                      <h4 className="font-bold text-white mb-2">逻辑链条</h4>
                      <p className="text-xs text-gray-400">工业化需要石油 &rarr; 买石油必须用美元 &rarr; 必须储备美元 &rarr; 美元需求刚性化。</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mechanism 3 */}
              <div className="group relative bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-colors border border-gray-800">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg">3</div>
                <h3 className="text-xl font-bold text-green-400 mb-4 ml-6">对外负债的本币计价机制</h3>
                <div className="text-gray-300 text-sm leading-relaxed">
                  <p className="mb-4">
                    想象一下，如果你能给自己写欠条，而且你的邻居可以用这欠条在市场上买东西，你会担心还钱吗？
                  </p>
                  <p>
                    美国的对外债务80%以上是以<strong>美元计价</strong>的。这意味着美国可以通过印钞来稀释债务。它没有“货币错配”的风险（即借外币还本币的风险，这是导致拉美危机的根源）。
                  </p>
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded text-center text-green-400 font-mono text-xs">
                    只要美债还是用美元计价，美国就很难真正“破产”。
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Section 4: Structural Power */}
        <section id="section-3" className="scroll-mt-32">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">为什么美元难以被撼动？</h2>
              <p className="text-blue-400 mt-2">结构性权力：让你即使讨厌它，也离不开它</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <BookOpen className="text-yellow-400" />,
                  title: "规则制定权",
                  desc: "控制IMF（国际货币基金组织）和世界银行，制定国际金融游戏规则。"
                },
                {
                  icon: <Zap className="text-blue-400" />,
                  title: "网络外部性",
                  desc: "就像语言一样，用的人越多越好用。美元具有规模经济效应，替代成本极高。"
                },
                {
                  icon: <TrendingUp className="text-green-400" />,
                  title: "市场广度与深度",
                  desc: "只有美国金融市场能容纳全球如此庞大的资金流动，提供丰富的避险和投资工具。"
                },
                {
                  icon: <Database className="text-purple-400" />,
                  title: "评级与会计话语权",
                  desc: "穆迪、标普等评级机构掌握了谁能融资、融资成本多少的生杀大权。"
                },
                {
                  icon: <Lock className="text-red-400" />,
                  title: "精准制裁能力",
                  desc: "通过SWIFT、CHIPS等支付系统，可以精准切断任何国家或个人的资金链（如对俄罗斯的制裁）。"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-start gap-4 hover:border-gray-500 transition-all">
                  <div className="mt-1 p-2 bg-gray-900 rounded-lg">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-200">{item.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-blue-900/10 border border-blue-800 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-blue-300 mb-2">系统性恐惧</h3>
              <p className="text-gray-300">
                世界对美元体系崩溃的恐惧，远大于对美元剥削的怨恨。<br/>
                <span className="text-sm text-gray-500 mt-2 block">这才是美国肆意妄为的底气。</span>
              </p>
            </div>
          </FadeInSection>
        </section>

        {/* Footer */}
        <footer className="pt-20 pb-10 text-center text-gray-600 border-t border-gray-800">
          <p className="text-sm">基于李晓教授演讲《美元如何控制世界》整理制作</p>
          <p className="text-xs mt-2">点击右下角 Preview 查看动态效果</p>
        </footer>

      </main>
    </div>
  );
}