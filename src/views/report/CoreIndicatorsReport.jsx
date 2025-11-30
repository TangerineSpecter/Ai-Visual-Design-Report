import React from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Factory, 
  Percent, 
  BarChart3, 
  Info,
  BookOpen,
  ArrowUpRight,
  Activity,
  Home,
  Truck,
  DollarSign,
  Layers,
  Search
} from 'lucide-react';

// 核心缩写词，用于自动高亮
const KEY_ACRONYMS = [
  "GDP", "CPI", "PPI", "PCE", "PMI", "WEI", 
  "LIBOR", "AAII", "NAAIM", "CFTC", "VTI", "ETF", "Risk Off", "Risk On"
];

// 高亮缩写词组件 - 暗黑霓虹风格
const HighlightText = ({ text }) => {
  if (!text) return null;
  
  const regex = new RegExp(`(${KEY_ACRONYMS.join('|')})`, 'g');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        if (KEY_ACRONYMS.includes(part)) {
          return (
            <span key={index} className="inline-flex items-center px-1.5 rounded text-[0.85em] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mx-0.5 shadow-[0_0_10px_-4px_rgba(99,102,241,0.5)]">
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

// 数据结构
const categories = [
  {
    id: 'consumption',
    title: '一、消费 (Consumption)',
    desc: '美国是消费驱动型经济，消费占 GDP 约 70%。关注“意愿”与“能力”。',
    icon: <ShoppingCart className="w-5 h-5" />,
    themeColor: 'cyan', // 亮青色
    items: [
      {
        title: '就业数据',
        subTitle: 'Employment',
        icon: <TrendingUp className="w-4 h-4" />,
        metrics: ['初次申领失业金人数', '连续申领失业金人数', '非农就业人数年度变化'],
        meaning: '消费的最前端基础。有工作才有收入，有收入才能消费。'
      },
      {
        title: '个人财务状况',
        subTitle: 'Personal Finance',
        icon: <DollarSign className="w-4 h-4" />,
        metrics: ['个人收入同比', '个人消费支出 (PCE) 同比', '储蓄率'],
        meaning: '收入、支出和储蓄互为因果。只要美国人有钱花、敢花钱，经济就不会太差。'
      },
      {
        title: '房屋销售',
        subTitle: 'Housing Sales',
        icon: <Home className="w-4 h-4" />,
        metrics: ['成屋销售同比', '新屋销售同比', '20 大都市圈房价指数', '新房销售价格中位数'],
        meaning: '房子是最大的消费品，牵涉产业链极广。销售情况与房价息息相关。'
      },
      {
        title: '汽车消费',
        subTitle: 'Auto Sales',
        icon: <Truck className="w-4 h-4" />,
        metrics: ['全美汽车销量', '销售年同比增长率', '二手车价格指数'],
        meaning: '第二大消费品。曾因芯片短缺导致二手车价飙升，现供应链恢复，关注新车购买力。'
      },
      {
        title: '零售数据',
        subTitle: 'Retail',
        icon: <ShoppingCart className="w-4 h-4" />,
        metrics: ['总体零售销售额同比', '红皮书同店销售指数 (Redbook)', '非实体店销售同比 (电商)'],
        meaning: '准确反映消费情况。疫情改变了消费习惯，但实体店消费依然重要。'
      }
    ]
  },
  {
    id: 'supply',
    title: '二、供给 (Supply)',
    desc: '供给端数据往往预示未来的经济走向。',
    icon: <Factory className="w-5 h-5" />,
    themeColor: 'amber', // 亮琥珀色
    items: [
      {
        title: '房屋供给',
        subTitle: 'Housing Supply',
        icon: <Home className="w-4 h-4" />,
        metrics: ['建房许可 (Permits, 领先指标)', '新屋开工', '房屋库存 (关键)'],
        meaning: '建房许可预示未来半年的新房供应。库存上升意味着供大于求（跌价），反之亦然。'
      },
      {
        title: '制造业订单',
        subTitle: 'Manufacturing Orders',
        icon: <Factory className="w-4 h-4" />,
        metrics: ['耐用品订单', '核心耐用品订单', '制造业 PMI', '非制造业 PMI'],
        meaning: '订单和采购是领先指标。订单下行意味着未来 3-6 个月社会总供应量下降。'
      },
      {
        title: '每周经济指数',
        subTitle: 'WEI',
        icon: <Activity className="w-4 h-4" />,
        metrics: ['纽约联储发布的高频数据'],
        meaning: '涵盖消费者、工商业和政府。是 GDP 的先行指标，进入负值区通常预示衰退。'
      },
      {
        title: '铜金比',
        subTitle: 'Copper/Gold Ratio',
        icon: <BarChart3 className="w-4 h-4" />,
        metrics: ['铜价 / 金价'],
        meaning: '铜代表工业需求，金代表避险。反映隐含风险溢价的工业运行情况，是 PPI 和 PMI 的先行指标。'
      },
      {
        title: '油金比',
        subTitle: 'Oil/Gold Ratio',
        icon: <TrendingUp className="w-4 h-4" />,
        metrics: ['原油价格 / 金价'],
        meaning: '油代表成本。反映隐含风险溢价的社会运营成本，是 CPI (通胀) 的先行指标。'
      }
    ]
  },
  {
    id: 'rates',
    title: '三、利率 (Interest Rates)',
    desc: '利率是资本的成本、机会成本，也是货币价值的标尺。',
    icon: <Percent className="w-5 h-5" />,
    themeColor: 'rose', // 亮玫瑰色
    items: [
      {
        title: '重要利率',
        subTitle: 'Key Interest Rates',
        icon: <Percent className="w-4 h-4" />,
        metrics: ['美联储目标利率 (政策)', '10年/5年/2年期国债收益率 (市场)', 'LIBOR'],
        meaning: '市场引导政策；短期引导长期。倒挂 (短>长) 预示经济不正常，可能衰退。'
      },
      {
        title: '信用利差',
        subTitle: 'Credit Spread',
        icon: <Activity className="w-4 h-4" />,
        metrics: ['垃圾债 (CCC级以下) 收益率 - 10年期国债收益率'],
        meaning: '代表风险补偿。利差快速扩大 = 市场认为企业违约风险大幅增加。'
      }
    ]
  },
  {
    id: 'market',
    title: '四、市场 (Market)',
    desc: '金融市场是情绪交换的场所。要在股市获利需独立思考。',
    icon: <BarChart3 className="w-5 h-5" />,
    themeColor: 'emerald', // 亮翠绿色
    items: [
      {
        title: '散户情绪',
        subTitle: 'AAII Sentiment',
        icon: <TrendingUp className="w-4 h-4" />,
        metrics: ['看涨比例 - 看跌比例'],
        meaning: '反向指标。> 25% (极度贪婪) 往往是顶部；< -25% (极度恐惧) 往往是底部。'
      },
      {
        title: '机构情绪',
        subTitle: 'NAAIM Exposure',
        icon: <BarChart3 className="w-4 h-4" />,
        metrics: ['投资经理风险敞口 (Exposure Index)'],
        meaning: '> 100% 为高位，< 40% 为低位。触及极值区容易引发市场反转。'
      },
      {
        title: '期权市场',
        subTitle: 'Put/Call Ratio',
        icon: <ArrowUpRight className="w-4 h-4" />,
        metrics: ['看跌期权 / 看涨期权成交量比值'],
        meaning: '数值 > 1 (看跌者多)，往往对应市场阶段性底部。'
      },
      {
        title: '期货持仓',
        subTitle: 'CFTC Positioning',
        icon: <BookOpen className="w-4 h-4" />,
        metrics: ['S&P 500 未平仓合约', 'Nasdaq 100 未平仓合约'],
        meaning: '观察轧空 (Short Squeeze) 现象。科技股与整体市场可能出现分歧。'
      },
      {
        title: '市场宽度',
        subTitle: 'Market Breadth',
        icon: <Activity className="w-4 h-4" />,
        metrics: ['股价 > 50日均线的比例', '股价 > 200日均线的比例'],
        meaning: '最具实战意义。> 85% 超买 (贪婪见顶)；< 15% 超卖 (恐惧见底)。'
      },
      {
        title: '行业相对强度',
        subTitle: 'Relative Strength',
        icon: <BarChart3 className="w-4 h-4" />,
        metrics: ['11个行业 ETF / 全市场指数 (VTI)'],
        meaning: '防御板块强 = Risk Off (避险)；科技/周期板块强 = Risk On (冒险)。'
      }
    ]
  }
];

// 颜色映射系统 (Dark Mode Neon)
const colorMap = {
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(34,211,238,0.15)]',
    pill: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20 hover:bg-cyan-500/20'
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(251,191,36,0.15)]',
    pill: 'bg-amber-500/10 text-amber-200 border-amber-500/20 hover:bg-amber-500/20'
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(251,113,133,0.15)]',
    pill: 'bg-rose-500/10 text-rose-200 border-rose-500/20 hover:bg-rose-500/20'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(52,211,153,0.15)]',
    pill: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20 hover:bg-emerald-500/20'
  }
};

const MetricPill = ({ text, colorStyles }) => (
  <div className={`
    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium 
    border transition-all duration-300 cursor-default
    ${colorStyles.pill}
  `}>
    <div className={`w-1 h-1 rounded-full ${colorStyles.text.replace('text-', 'bg-')} opacity-80`} />
    <HighlightText text={text} />
  </div>
);

const DarkInfoCard = ({ item, themeColor }) => {
  const styles = colorMap[themeColor];
  
  return (
    <div className={`
      flex flex-col h-full 
      bg-[#151c2c] 
      border border-[#2d3748] 
      rounded-xl 
      overflow-hidden 
      hover:border-opacity-50 hover:${styles.border.replace('border-', 'border-')} 
      hover:shadow-lg transition-all duration-300 group
    `}>
      {/* 顶部彩色线条 */}
      <div className={`h-1 w-full ${styles.text.replace('text-', 'bg-')} opacity-60`} />

      <div className="p-5 flex flex-col flex-grow">
        {/* 标题区 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
              {item.title}
            </h3>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              {item.subTitle}
            </span>
          </div>
          <div className={`p-2 rounded-lg ${styles.bg} ${styles.text}`}>
            {item.icon}
          </div>
        </div>

        {/* 核心指标展示区 - 使用 Pills 胶囊样式 */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            核心监控指标
          </div>
          <div className="flex flex-wrap gap-2">
            {item.metrics.map((metric, idx) => (
              <MetricPill key={idx} text={metric} colorStyles={styles} />
            ))}
          </div>
        </div>

        {/* 底部含义区 */}
        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="flex gap-3">
            <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-400 leading-relaxed">
              <HighlightText text={item.meaning} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function USStockChartsNotes() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 顶部 Hero 区域 */}
      <div className="relative border-b border-slate-800/60 bg-[#0B1120]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-[#0B1120]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-12 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 backdrop-blur-sm">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            美股核心 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">20 图表</span> 仪表盘
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-light">
            通过追踪消费、供给、利率和市场四大维度的核心数据，构建客观的宏观投资逻辑。
          </p>

          {/* 图例说明 */}
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
              <span>消费数据</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
              <span>供给数据</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]"></span>
              <span>利率指标</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
              <span>市场情绪</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-20">
        {categories.map((category) => {
          const styles = colorMap[category.themeColor];
          return (
            <section key={category.id}>
              {/* 分类标题 */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-2.5 rounded-lg ${styles.bg} ${styles.text} border border-white/5`}>
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {category.title}
                </h2>
                <div className="h-px bg-slate-800 flex-grow ml-4"></div>
              </div>
              
              <div className="mb-8 text-slate-400 text-sm max-w-3xl">
                 <HighlightText text={category.desc} />
              </div>

              {/* 卡片 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, index) => (
                  <DarkInfoCard key={index} item={item} themeColor={category.themeColor} />
                ))}
              </div>
            </section>
          );
        })}

        {/* 底部总结 */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#151c2c] to-slate-900 border border-slate-800 relative overflow-hidden text-center">
          <div className="relative z-10">
             <h3 className="text-xl font-bold text-white mb-4">交易员核心备忘</h3>
             <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-7">
               这些图表不是水晶球，而是<span className="text-indigo-300 font-semibold">温度计</span>。
               当 <HighlightText text="CPI" /> 过热或 <HighlightText text="AAII" /> 极度贪婪时，保持清醒；
               当市场极度恐慌时，利用数据寻找机会。客观中立是唯一的生存法则。
             </p>
          </div>
          {/* 装饰光效 */}
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        </div>
      </main>
    </div>
  );
}