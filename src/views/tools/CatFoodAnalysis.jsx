import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Search, Info, Trash2, Cat, ChevronDown, ChevronUp, Sparkles, Leaf, Activity, Scale, Calculator, PieChart, Layers, Plus, Save, HelpCircle, Edit3, Tag, Star, Copy, Check, ShieldCheck, Wheat, Ban } from 'lucide-react';

// --- 雷达图组件 ---
const RadarChart = ({ data, size = 260 }) => {
  const center = size / 2;
  const padding = 50; 
  const radius = (size / 2) - padding; 
  const levels = 4; 

  const getCoordinates = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const x = center + (value / 100) * radius * Math.cos(angle);
    const y = center + (value / 100) * radius * Math.sin(angle);
    return { x, y };
  };

  const bgPolygons = Array.from({ length: levels }).map((_, i) => {
    const levelRadius = (i + 1) * (100 / levels);
    return data.map((_, index) => {
      const { x, y } = getCoordinates(levelRadius, index, data.length);
      return `${x},${y}`;
    }).join(' ');
  });

  const dataPolygon = data.map((item, index) => {
    const { x, y } = getCoordinates(item.value, index, data.length);
    return `${x},${y}`;
  }).join(' ');

  const axes = data.map((_, index) => {
    const { x, y } = getCoordinates(100, index, data.length);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  return (
    <div className="flex justify-center items-center py-2">
      <svg width={size} height={size} className="overflow-visible">
        {bgPolygons.reverse().map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill={i % 2 === 0 ? "#f8fafc" : "white"}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        {axes.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        <polygon
          points={dataPolygon}
          fill="rgba(79, 70, 229, 0.4)"
          stroke="#4f46e5"
          strokeWidth="2.5"
        />
        {data.map((item, index) => {
          const { x, y } = getCoordinates(item.value, index, data.length);
          return (
            <circle key={index} cx={x} cy={y} r="4" fill="#4f46e5" stroke="white" strokeWidth="2" />
          );
        })}
        {data.map((item, index) => {
          const { x, y } = getCoordinates(125, index, data.length); 
          return (
            <g key={index}>
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[11px] font-bold fill-slate-600" style={{ textTransform: 'uppercase' }}>{item.label}</text>
              <text x={x} y={y + 12} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium fill-indigo-500">{Math.round(item.value)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// --- 小标签组件 ---
const FeatureTag = ({ label, active, icon: Icon, positive = true }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${active 
    ? (positive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700') 
    : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'}`}>
    <Icon className={`w-3.5 h-3.5 ${active ? (positive ? 'text-emerald-500' : 'text-red-500') : 'text-slate-400'}`} />
    <span>{label}</span>
  </div>
);

// --- 纯净名称提取工具 (修复版) ---
const getDisplayName = (text) => {
  if (!text) return '';
  // 1. 以括号(全角/半角)为界截取第一部分
  let name = text.split(/[\(（]/)[0];
  // 2. 去除尾部可能存在的百分比数字 (例如: "鲜鸡肉 30%" -> "鲜鸡肉")
  // 但保留中间的数字 (例如: "维生素B12" 不应该被切断)
  // 逻辑：匹配结尾处的 空格+数字+可选小数点+可选百分号
  name = name.replace(/\s*\d+(\.\d+)?%?\s*$/, '');
  return name.trim();
};

export default function App() {
  const [input, setInput] = useState('');
  const [nutritionInput, setNutritionInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const [customRules, setCustomRules] = useState([]);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState({ 
    keyword: '', name: '', level: 'neutral', category: 'other', score: 60, reason: '' 
  });

  // 基础成分知识库 (完整版)
  const defaultIngredientDatabase = [
    // --- 红色警报 (-20分) ---
    { keyword: 'BHA', name: 'BHA (丁基羟基茴香醚)', level: 'danger', category: 'additive', score: 10, reason: '潜在致癌风险的人工防腐剂，可能影响肝肾功能。' },
    { keyword: 'BHT', name: 'BHT (二丁基羟基甲苯)', level: 'danger', category: 'additive', score: 10, reason: '人工防腐剂，长期摄入存在健康争议。' },
    { keyword: '诱食剂', name: '诱食剂/口味增强剂', level: 'danger', category: 'additive', score: 5, reason: '可能掩盖劣质原料的味道，且可能导致猫咪挑食。' },
    { keyword: '卡拉胶', name: '卡拉胶', level: 'danger', category: 'additive', score: 15, reason: '可能引起肠道炎症，争议性较大的增稠剂。' },
    { keyword: '维生素K3', name: '维生素K3 (甲萘醌)', level: 'danger', category: 'additive', score: 10, reason: '人工合成维生素，大量摄入可能导致红细胞破坏。' },
    { keyword: '亚硝酸', name: '亚硝酸盐', level: 'danger', category: 'additive', score: 0, reason: '致癌物质，通常用于发色和防腐。' },
    { keyword: '丙二醇', name: '丙二醇', level: 'danger', category: 'additive', score: 10, reason: '虽然部分允许添加，但对猫有潜在血液毒性风险，建议避免。' },
    { keyword: '风味剂', name: '人工风味剂', level: 'danger', category: 'additive', score: 10, reason: '成分不明，通常用于掩盖原料劣质。' },
    { keyword: '肉骨粉', name: '肉骨粉 (未标明来源)', level: 'danger', category: 'meat', score: 20, reason: '来源不明的动物尸体加工产物，品质极其低劣。' },
    { keyword: '副产品', name: '禽肉/动物副产品', level: 'danger', category: 'meat', score: 25, reason: '通常指内脏、羽毛、脚爪等下脚料，营养价值低且难消化。' },
    { keyword: '大蒜', name: '大蒜/洋葱提取物', level: 'danger', category: 'fruit_veg', score: 0, reason: '即便是少量也可能导致猫咪贫血（氧化损伤红细胞）。' },
    { keyword: '口味增强', name: '口味增强剂', level: 'danger', category: 'additive', score: 5, reason: '通常指人工诱食剂。' },

    // --- 黄色警报 (-10分) ---
    { keyword: '纤维素', name: '粉状纤维素', level: 'warning', category: 'other', score: 40, reason: '通常指木质纤维素，廉价填充物，无营养价值。' },
    { keyword: '玉米', name: '玉米/玉米蛋白粉', level: 'warning', category: 'grain', score: 35, reason: '廉价植物蛋白填充物，不易消化，且是常见过敏源。' },
    { keyword: '小麦', name: '小麦/麸质', level: 'warning', category: 'grain', score: 35, reason: '常见过敏源，猫咪难以消化的谷物。' },
    { keyword: '大豆', name: '大豆/豆粕', level: 'warning', category: 'grain', score: 35, reason: '植物蛋白，缺乏猫咪必须的氨基酸，易导致胀气。' },
    { keyword: '大米', name: '大米/碎米', level: 'warning', category: 'grain', score: 40, reason: '碳水化合物含量高，升糖指数高。' },
    { keyword: '植物蛋白', name: '植物蛋白粉', level: 'warning', category: 'grain', score: 30, reason: '用于凑高蛋白质指标，利用率远低于动物蛋白。' },
    { keyword: '甜菜', name: '甜菜粕', level: 'warning', category: 'fruit_veg', score: 45, reason: '糖厂下脚料，常作为填充物，过多导致软便。' },
    { keyword: '谷朊粉', name: '谷朊粉', level: 'warning', category: 'grain', score: 35, reason: '即小麦面筋，主要用于提高粗蛋白数值，利用率低。' },
    { keyword: '木薯', name: '木薯淀粉', level: 'warning', category: 'grain', score: 45, reason: '无谷粮常见的淀粉来源，营养密度较低。' },
    { keyword: '马铃薯', name: '马铃薯/土豆', level: 'warning', category: 'grain', score: 45, reason: '常见碳水来源，注意是否占比过高。' },
    
    // --- 中性 (不加分不扣分) ---
    { keyword: '红薯', name: '红薯', level: 'neutral', category: 'grain', score: 65, reason: '相比谷物是较好的碳水来源，提供膳食纤维。' },
    { keyword: '豌豆', name: '豌豆', level: 'neutral', category: 'grain', score: 60, reason: '常见的无谷碳水来源，但需注意如果排名过高可能导致植物蛋白占比过大。' },
    { keyword: '鸡肉粉', name: '鸡肉粉', level: 'neutral', category: 'meat', score: 70, reason: '脱水浓缩肉源，蛋白质含量高，但不如鲜肉优质。' },
    { keyword: '鱼粉', name: '鱼粉', level: 'neutral', category: 'meat', score: 70, reason: '脱水浓缩肉源，注意辨别是否为特定鱼类。' },
    { keyword: '牛肉粉', name: '牛肉粉', level: 'neutral', category: 'meat', score: 70, reason: '脱水浓缩肉源。' },
    { keyword: '鸭肉粉', name: '鸭肉粉', level: 'neutral', category: 'meat', score: 70, reason: '脱水浓缩肉源。' },

    // --- 绿色：优质成分 (+2分) ---
    { keyword: '鲜鸡', name: '鲜鸡肉', level: 'good', category: 'meat', score: 95, reason: '优质易消化的动物蛋白来源。' },
    { keyword: '鲜鸭', name: '鲜鸭肉', level: 'good', category: 'meat', score: 95, reason: '低敏温和的肉源，清热去火。' },
    { keyword: '乳鸽', name: '鲜乳鸽', level: 'good', category: 'meat', score: 98, reason: '高蛋白低脂肪，易消化，被视为优质滋补肉源。' },
    { keyword: '三文鱼', name: '三文鱼', level: 'good', category: 'meat', score: 90, reason: '富含Omega-3，对皮毛健康有益。' },
    { keyword: '鳕鱼', name: '鳕鱼', level: 'good', category: 'meat', score: 90, reason: '优质深海鱼蛋白。' },
    { keyword: '牛肉', name: '牛肉', level: 'good', category: 'meat', score: 92, reason: '富含铁和锌的红肉来源。' },
    { keyword: '兔肉', name: '兔肉', level: 'good', category: 'meat', score: 95, reason: '高蛋白低脂肪，低敏肉源。' },
    { keyword: '鸡蛋', name: '鸡蛋/蛋黄', level: 'good', category: 'meat', score: 88, reason: '生物价极高的蛋白质，富含卵磷脂。' },
    { keyword: '羊奶', name: '羊奶/羊奶粉', level: 'good', category: 'meat', score: 85, reason: '富含营养，比牛奶更易消化，低敏。' },
    { keyword: '鸡肝', name: '鸡肝/内脏', level: 'good', category: 'meat', score: 85, reason: '适量内脏提供丰富的维生素A和微量元素，仿生饮食结构。' },
    
    { keyword: '牛磺酸', name: '牛磺酸', level: 'good', category: 'additive', score: 100, reason: '猫咪必须氨基酸，保护心脏和视力。' },
    { keyword: '鱼油', name: '深海鱼油', level: 'good', category: 'additive', score: 90, reason: '提供Omega-3 (DHA/EPA)，美毛护肤，抗炎。' },
    { keyword: '磷虾', name: '磷虾/磷虾油', level: 'good', category: 'additive', score: 92, reason: '优质虾青素和Omega-3来源。' },
    { keyword: '奶酪', name: '奶酪', level: 'good', category: 'meat', score: 80, reason: '提供钙质和风味。' },
    
    { keyword: '蔓越莓', name: '蔓越莓', level: 'good', category: 'fruit_veg', score: 85, reason: '辅助呵护泌尿系统健康，调节尿液酸碱度。' },
    { keyword: '蓝莓', name: '蓝莓', level: 'good', category: 'fruit_veg', score: 85, reason: '天然抗氧化剂，保护视力。' },
    { keyword: '覆盆子', name: '覆盆子', level: 'good', category: 'fruit_veg', score: 85, reason: '富含抗氧化剂和纤维。' },
    { keyword: '菊苣', name: '菊苣根(菊粉)', level: 'good', category: 'additive', score: 88, reason: '优质益生元，促进肠道益生菌生长。' },
    { keyword: '丝兰', name: '丝兰提取物/皂角苷', level: 'good', category: 'additive', score: 85, reason: '吸附氨气，有助于减轻粪便异味。' },
    { keyword: '葡萄糖胺', name: '葡萄糖胺', level: 'good', category: 'additive', score: 88, reason: '保护关节健康，润滑关节。' },
    { keyword: '软骨素', name: '硫酸软骨素', level: 'good', category: 'additive', score: 88, reason: '支持关节软骨修复。' },
    { keyword: '酵母', name: '啤酒酵母/酵母水解物', level: 'good', category: 'additive', score: 85, reason: '富含B族维生素，通过天然鲜味增加适口性。' },
    { keyword: '益生菌', name: '益生菌', level: 'good', category: 'additive', score: 90, reason: '调节肠道菌群，促进消化。' },
    { keyword: '芽孢杆菌', name: '芽孢杆菌', level: 'good', category: 'additive', score: 90, reason: '耐高温的优质益生菌，能活着到达肠道。' },
    { keyword: '车前子', name: '车前子', level: 'good', category: 'fruit_veg', score: 80, reason: '可溶性纤维，帮助化毛和肠道蠕动。' },
    { keyword: '螺旋藻', name: '螺旋藻', level: 'good', category: 'additive', score: 85, reason: '提供微量元素和免疫支持。' },
    
    { keyword: '迷迭香', name: '迷迭香提取物', level: 'good', category: 'additive', score: 85, reason: '天然抗氧化剂/防腐剂。' },
    { keyword: '茶多酚', name: '茶多酚', level: 'good', category: 'additive', score: 85, reason: '天然抗氧化剂。' },
    { keyword: '生育酚', name: '混合生育酚 (维E)', level: 'good', category: 'additive', score: 85, reason: '天然防腐剂，代替BHA/BHT。' },
    
    { keyword: '络合物', name: '螯合矿物质', level: 'good', category: 'additive', score: 90, reason: '如蛋氨酸铁/锌等，吸收率远高于普通无机盐。' },
    { keyword: '螯合', name: '螯合矿物质', level: 'good', category: 'additive', score: 90, reason: '吸收率高的矿物质形态。' },
    { keyword: '硒', name: '有机硒/酵母硒', level: 'good', category: 'additive', score: 88, reason: '比亚硒酸钠更安全好吸收的硒源。' },
  ];

  const categoryOptions = [
    { value: 'meat', label: '肉类/鱼/蛋/奶 (计入肉含量)' },
    { value: 'grain', label: '谷物/豆类/淀粉 (计入植物占比)' },
    { value: 'fruit_veg', label: '蔬菜/水果/草本' },
    { value: 'additive', label: '营养添加剂/防腐剂' },
    { value: 'other', label: '其他' }
  ];

  // 辅助函数
  const extractValue = (text, keywords) => {
    const pattern = new RegExp(`(${keywords.join('|')})[^0-9\\.]*([0-9]+(\\.[0-9]+)?)`, 'i');
    const match = text.match(pattern);
    return match ? parseFloat(match[2]) : null;
  };
  const extractPercentage = (text) => {
    const match = text.match(/([0-9]+(\.[0-9]+)?)%/);
    return match ? parseFloat(match[1]) : 0;
  };

  const analyzeNutritionData = (text) => {
    if (!text.trim()) return null;
    const values = {
      protein: extractValue(text, ['粗蛋白', '蛋白质', 'Protein']),
      fat: extractValue(text, ['粗脂肪', '脂肪', 'Fat']),
      fiber: extractValue(text, ['粗纤维', '纤维', 'Fiber']),
      ash: extractValue(text, ['粗灰分', '灰分', 'Ash']),
      moisture: extractValue(text, ['水分', 'Moisture']),
      calcium: extractValue(text, ['钙', 'Ca', 'Calcium']),
      phosphorus: extractValue(text, ['磷', 'P', 'Phosphorus']),
      taurine: extractValue(text, ['牛磺酸', 'Taurine']),
    };

    let report = [];
    let scoreMod = 0;

    // 1. 蛋白质
    if (values.protein !== null) {
      if (values.protein >= 40) {
        report.push({ label: '粗蛋白', value: `${values.protein}%`, status: 'excellent', msg: '极高，适合大部分猫咪，优秀！' });
        scoreMod += 5;
      } else if (values.protein >= 30) {
        report.push({ label: '粗蛋白', value: `${values.protein}%`, status: 'good', msg: '标准水平。' });
      } else {
        report.push({ label: '粗蛋白', value: `${values.protein}%`, status: 'warning', msg: '偏低，主要靠碳水提供热量？' });
        scoreMod -= 10;
      }
    }

    // 2. 脂肪
    if (values.fat !== null) {
      if (values.fat >= 20) {
         report.push({ label: '粗脂肪', value: `${values.fat}%`, status: 'good', msg: '较高，适合幼猫或运动量大的猫。' });
      } else if (values.fat >= 14) {
         report.push({ label: '粗脂肪', value: `${values.fat}%`, status: 'good', msg: '适中。' });
      } else {
         report.push({ label: '粗脂肪', value: `${values.fat}%`, status: 'warning', msg: '偏低（减肥粮除外）。' });
      }
    }

    // 3. 钙磷比
    if (values.calcium !== null && values.phosphorus !== null) {
      const ratio = values.calcium / values.phosphorus;
      const ratioStr = ratio.toFixed(2) + ":1";
      if (ratio >= 1.0 && ratio <= 1.6) {
        report.push({ label: '钙磷比', value: ratioStr, status: 'excellent', msg: '完美。' });
        scoreMod += 3;
      } else if (ratio < 0.9 || ratio > 2.0) {
        report.push({ label: '钙磷比', value: ratioStr, status: 'danger', msg: '比例失衡。' });
        scoreMod -= 10;
      } else {
         report.push({ label: '钙磷比', value: ratioStr, status: 'warning', msg: '稍有偏差。' });
      }
    }

    // 4. 牛磺酸
    if (values.taurine !== null) {
      if (values.taurine >= 0.2) {
        report.push({ label: '牛磺酸', value: `${values.taurine}%`, status: 'excellent', msg: '充足。' });
        scoreMod += 2;
      } else if (values.taurine >= 0.1) {
        report.push({ label: '牛磺酸', value: `${values.taurine}%`, status: 'good', msg: '达标。' });
      } else {
        report.push({ label: '牛磺酸', value: `${values.taurine}%`, status: 'danger', msg: '偏低。' });
        scoreMod -= 5;
      }
    }

    return { values, report, scoreMod };
  };

  // 核心分析逻辑
  const handleAnalyze = () => {
    if (!input.trim()) return;
    const allRules = [...customRules, ...defaultIngredientDatabase];
    const rawList = input.split(/[,，、\n]+/g).map(s => s.trim()).filter(item => item.length > 0);
    
    let dangerCount = 0; let warningCount = 0; let goodCount = 0; let unknownCount = 0;
    let totalMeatPercentage = 0; let hasExplicitMeatPercent = false;
    let grainCount = 0; let functionalCount = 0;
    
    const analyzedIngredients = rawList.map(item => {
      let match = null;
      let percentage = extractPercentage(item);
      for (let rule of allRules) {
        if (item.includes(rule.keyword)) { match = rule; break; }
      }

      if (match) {
        if (match.level === 'danger') dangerCount++;
        if (match.level === 'warning') warningCount++;
        if (match.level === 'good') {
          goodCount++;
          if (match.category !== 'grain') functionalCount++;
          if ((match.category === 'meat' || match.name.includes('肉') || match.name.includes('鱼')) && percentage > 0) {
             totalMeatPercentage += percentage;
             hasExplicitMeatPercent = true;
          }
        }
        if (match.category === 'grain') grainCount++;
        return { text: item, ...match, percentage, isUnknown: false };
      } else {
        unknownCount++;
        return { text: item, level: 'unknown', category: 'other', reason: '未识别成分', percentage, isUnknown: true };
      }
    });

    const top5 = analyzedIngredients.slice(0, 5);
    const top5Analysis = {
       badItems: top5.filter(i => i.level === 'danger' || i.level === 'warning'),
       meatItems: top5.filter(i => i.level === 'good' && (i.category === 'meat' || i.name.includes('肉'))),
       grainOrStarch: top5.filter(i => !i.isUnknown && (i.category === 'grain' || i.text.includes('米') || i.text.includes('淀粉'))),
    };

    let score = 40; 
    score -= (dangerCount * 20) + (warningCount * 10);
    score += Math.min(goodCount * 2, 20);
    if (top5Analysis.meatItems.length >= 3) score += 15; 
    if (top5Analysis.meatItems.length >= 1 && top5Analysis.meatItems[0] === top5[0]) score += 10;
    if (top5Analysis.badItems.length > 0) score -= (top5Analysis.badItems.length * 10); 
    if (hasExplicitMeatPercent) {
       if (totalMeatPercentage > 75) score += 20;
       else if (totalMeatPercentage > 45) score += 5;
       else if (totalMeatPercentage > 0) score -= 15;
    }
    const nutritionAnalysis = analyzeNutritionData(nutritionInput);
    if (nutritionAnalysis) score += nutritionAnalysis.scoreMod;
    
    if (score > 100) score = 100; if (score < 0) score = 0;

    let verdict = ''; let verdictColor = '';
    if (score >= 90) { verdict = 'S级 巅峰配方'; verdictColor = 'text-emerald-600'; }
    else if (score >= 75) { verdict = 'A级 优质推荐'; verdictColor = 'text-green-600'; }
    else if (score >= 60) { verdict = 'B级 良心及格'; verdictColor = 'text-amber-600'; }
    else { verdict = 'D级 慎重选择'; verdictColor = 'text-red-600'; }

    const radarData = [
      { label: '含肉度', value: hasExplicitMeatPercent ? Math.min(100, totalMeatPercentage) : 50 },
      { label: '安全性', value: Math.max(0, 100 - (dangerCount * 25) - (warningCount * 10)) },
      { label: '功能性', value: Math.min(100, 50 + (functionalCount * 8)) },
      { label: '低敏度', value: Math.max(0, 100 - (grainCount * 20)) },
      { label: '透明度', value: hasExplicitMeatPercent ? 90 : (100 - unknownCount * 5) },
    ];

    const isGrainFree = grainCount === 0;
    const noBadPreservatives = !analyzedIngredients.some(i => ['BHA', 'BHT', '药', '诱食'].some(k => i.text.includes(k)));
    const noUnknownMeat = !analyzedIngredients.some(i => i.text.includes('肉粉') && !i.text.includes('鸡') && !i.text.includes('鸭') && !i.text.includes('鱼'));
    const isHighMeat = totalMeatPercentage > 60 || top5Analysis.meatItems.length >= 3;

    setAnalysis({
      ingredients: analyzedIngredients,
      nutrition: nutritionAnalysis,
      counts: { danger: dangerCount, warning: warningCount, good: goodCount, unknown: unknownCount, neutral: analyzedIngredients.length - dangerCount - warningCount - goodCount - unknownCount },
      top5: top5Analysis,
      meatPercent: { value: totalMeatPercentage, hasData: hasExplicitMeatPercent },
      score, verdict, verdictColor, radarData,
      features: { isGrainFree, noBadPreservatives, noUnknownMeat, isHighMeat }
    });
  };

  // UI Helpers
  const openAddRule = (keyword = '') => { setEditingRule({ keyword, name: keyword, level: 'neutral', category: 'other', score: 60, reason: '' }); setShowRuleForm(true); };
  
  const handleScoreChange = (newScore) => {
    let newLevel = 'neutral';
    if (newScore >= 80) newLevel = 'good';
    else if (newScore >= 60) newLevel = 'neutral';
    else if (newScore >= 40) newLevel = 'warning';
    else newLevel = 'danger';
    setEditingRule(prev => ({ ...prev, score: newScore, level: newLevel }));
  };

  const handleSaveRule = () => { if(!editingRule.keyword.trim()) return; setCustomRules([{...editingRule}, ...customRules.filter(r => r.keyword !== editingRule.keyword)]); setShowRuleForm(false); if(analysis) setTimeout(() => document.getElementById('analyze-btn').click(), 0); };
  
  const getTagStyle = (level, isUnknown) => {
    if (isUnknown) return 'bg-white border-slate-300 text-slate-400 border-dashed hover:border-slate-400 hover:text-slate-600 hover:shadow-sm cursor-pointer';
    switch(level) {
      case 'danger': return 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:shadow-md';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:shadow-md';
      case 'good': return 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:shadow-md';
      default: return 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm';
    }
  };

  const demoText = "鲜鸡肉（75.5%）、鲜鸭肉（11%）、鲜鸡肝(5%)、红薯颗粒、纤维素、鱼油0.5%、全脂羊奶粉0.5%、蛋黄粉0.5%、蓝莓干、覆盆子干、车前子、菊苣根粉、神秘配料X、神秘配料Y、牛磺酸、氨基酸锌络合物";
  const demoNutrition = "粗蛋白质 ≥ 42%\n水分 ≤ 10%\n粗脂肪 ≥ 18%\n牛磺酸 ≥ 0.2%\n粗灰分 ≤9.0%\n总磷 ≥ 0.8%\n粗纤维 ≤ 4.0%\n钙 ≥ 1.0%";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800 relative">
      
      {/* 规则添加弹窗 */}
      {showRuleForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-500"/> 自定义配料规则
              </h3>
              <button onClick={() => setShowRuleForm(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-5">
              {/* Keyword Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">配料名称 / 关键词</label>
                <input 
                  value={editingRule.keyword}
                  onChange={e => setEditingRule({...editingRule, keyword: e.target.value, name: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="例如：鲜火鸡肉"
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex justify-between">
                  配料分类
                  <span className="text-xs font-normal text-slate-400">影响肉含量/无谷检测</span>
                </label>
                <select
                  value={editingRule.category}
                  onChange={e => setEditingRule({...editingRule, category: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Score Slider */}
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                   <span>成分评分 (0-100)</span>
                   <span className={`text-lg font-black ${editingRule.score >= 80 ? 'text-emerald-500' : editingRule.score <= 40 ? 'text-red-500' : 'text-slate-600'}`}>
                     {editingRule.score}
                   </span>
                 </label>
                 <input 
                   type="range" 
                   min="0" 
                   max="100" 
                   value={editingRule.score} 
                   onChange={(e) => handleScoreChange(parseInt(e.target.value))}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
                 <div className="flex justify-between text-xs text-slate-400 mt-1">
                   <span>0 (高危)</span>
                   <span>50</span>
                   <span>100 (优质)</span>
                 </div>
              </div>

              {/* Level Buttons (恢复) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">评价等级 (可手动修正)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: 'good', label: '优质', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                    { val: 'neutral', label: '中性', color: 'bg-slate-100 text-slate-700 border-slate-200' },
                    { val: 'warning', label: '争议', color: 'bg-amber-100 text-amber-700 border-amber-200' },
                    { val: 'danger', label: '风险', color: 'bg-red-100 text-red-700 border-red-200' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setEditingRule({...editingRule, level: opt.val})}
                      className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${editingRule.level === opt.val ? opt.color + ' ring-2 ring-offset-1 ring-indigo-300' : 'border-transparent bg-slate-50 text-slate-500 opacity-60'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">评价理由 (可选)</label>
                <textarea 
                  value={editingRule.reason}
                  onChange={e => setEditingRule({...editingRule, reason: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                  placeholder="例如：优质的低敏肉源..."
                />
              </div>

              <button 
                onClick={handleSaveRule}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> 保存并应用
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-200"><Cat className="text-white w-8 h-8" /></div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">专业猫粮成分分析</h1>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto">基于<span className="text-red-500 font-bold">加倍严苛</span>的算法，深度识别<span className="text-indigo-600 font-bold">配方结构</span>与<span className="text-indigo-600 font-bold">营养陷阱</span></p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 p-6 md:p-8 border border-slate-100 relative">
          <div className="flex justify-between items-end mb-2">
             <label className="block text-sm font-bold text-slate-700">配料表 (必填)：</label>
             <div className="flex gap-2">
               <button onClick={() => {setInput(demoText); setNutritionInput(demoNutrition);}} className="text-slate-400 hover:text-indigo-500 text-xs font-medium transition-colors">加载示例</button>
               <button onClick={() => openAddRule()} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"><Plus className="w-3 h-3" /> 添加规则</button>
             </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
               <textarea className="w-full h-32 p-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none text-slate-600 text-sm leading-relaxed bg-slate-50 transition-all" placeholder="例如：鲜鸡肉75.5%、鲜鸭肉11%、红薯颗粒..." value={input} onChange={(e) => setInput(e.target.value)}></textarea>
            </div>
            <div className="md:col-span-1">
               <textarea className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none text-slate-600 text-sm leading-relaxed bg-slate-50 transition-all font-mono" placeholder="粗蛋白质 ≥ 40%..." value={nutritionInput} onChange={(e) => setNutritionInput(e.target.value)}></textarea>
            </div>
          </div>
          
          <button id="analyze-btn" onClick={handleAnalyze} className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"><Search className="w-5 h-5" /> 严谨评测</button>
        </div>

        {analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 overflow-hidden border border-slate-100 relative">
              <div className="p-8 grid md:grid-cols-3 gap-8 items-center md:items-stretch">
                {/* Left: Score & Radar */}
                <div className="text-center border-r-0 md:border-r border-slate-100 md:pr-8 flex flex-col items-center justify-center">
                   <div className={`text-6xl font-black ${analysis.score >= 75 ? 'text-emerald-500' : analysis.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{analysis.score}</div>
                   <div className={`text-xl font-bold mt-2 ${analysis.verdictColor}`}>{analysis.verdict}</div>
                   <div className="mt-6 w-full flex justify-center"><RadarChart data={analysis.radarData} size={260} /></div>
                </div>

                {/* Right: Metrics & Features */}
                <div className="col-span-2 flex flex-col gap-4">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Layers className="w-4 h-4 text-indigo-500" /> 前5位 (Top5) 定基调</div>
                       <div className="flex gap-2 flex-wrap">
                         {analysis.ingredients.slice(0, 5).map((item, idx) => (
                           <div key={idx} className={`relative group px-2.5 py-1 rounded-lg text-xs border font-medium cursor-default ${getTagStyle(item.level, item.isUnknown)}`}>
                             {idx+1}. {getDisplayName(item.text)}
                             {/* Top 5 Tooltip */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 pointer-events-none z-20 shadow-xl scale-95 group-hover:scale-100">
                               {item.reason || '无特殊风险'}
                               <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                             </div>
                           </div>
                         ))}
                       </div>
                       {analysis.top5.grainOrStarch.length >= 2 && <div className="mt-3 text-xs text-red-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> 警告：前5位淀粉/谷物较多</div>}
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><PieChart className="w-4 h-4 text-indigo-500" /> 标示肉含量</div>
                       <div className={`text-2xl font-black ${analysis.meatPercent.value < 50 ? 'text-red-500' : 'text-slate-800'}`}>{analysis.meatPercent.hasData ? analysis.meatPercent.value.toFixed(1) + '%' : '未标示'}</div>
                       <div className="text-xs text-slate-500">{analysis.meatPercent.hasData ? (analysis.meatPercent.value < 50 ? '肉含量偏低，扣分项' : '明确标示占比的动物蛋白') : '建议优先选择标明肉含量的产品'}</div>
                     </div>
                   </div>

                   <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> 配方综合画像</h4>
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                           <span>成分品质光谱</span>
                           <span>共 {analysis.ingredients.length} 项</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden w-full bg-white shadow-inner">
                           <div style={{width: `${(analysis.counts.good / analysis.ingredients.length)*100}%`}} className="bg-emerald-400" title="优质成分"></div>
                           <div style={{width: `${(analysis.counts.neutral / analysis.ingredients.length)*100}%`}} className="bg-slate-300" title="中性成分"></div>
                           <div style={{width: `${(analysis.counts.unknown / analysis.ingredients.length)*100}%`}} className="bg-slate-200 pattern-diagonal-lines" title="未识别"></div>
                           <div style={{width: `${(analysis.counts.warning / analysis.ingredients.length)*100}%`}} className="bg-amber-400" title="争议成分"></div>
                           <div style={{width: `${(analysis.counts.danger / analysis.ingredients.length)*100}%`}} className="bg-red-500" title="风险成分"></div>
                        </div>
                        <div className="flex gap-4 text-[10px] text-slate-400 mt-1.5 font-medium">
                           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> {analysis.counts.good} 优质</span>
                           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300"></div> {analysis.counts.neutral} 普通</span>
                           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> {analysis.counts.danger + analysis.counts.warning} 风险/争议</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <FeatureTag label="无谷配方" active={analysis.features.isGrainFree} icon={Wheat} positive={true} />
                         <FeatureTag label="高肉含量" active={analysis.features.isHighMeat} icon={Cat} positive={true} />
                         <FeatureTag label="避雷防腐剂" active={analysis.features.noBadPreservatives} icon={ShieldCheck} positive={true} />
                         <FeatureTag label="无不明肉源" active={analysis.features.noUnknownMeat} icon={Ban} positive={true} />
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Details Section - Redesigned Tags & Tooltips */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2"><Info className="w-5 h-5 text-indigo-500"/> 完整配料分析</h3>
                 {analysis.counts.unknown > 0 && (
                   <button onClick={() => {
                      const text = analysis.ingredients.filter(i => i.isUnknown).map(i => i.text).join('、');
                      navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000);
                   }} className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-1">
                     {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} 复制未识别成分
                   </button>
                 )}
               </div>
               <div className="flex flex-wrap gap-2 leading-loose">
                 {analysis.ingredients.map((item, idx) => (
                   <div 
                      key={idx} 
                      className={`relative group inline-block px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-default ${getTagStyle(item.level, item.isUnknown)}`}
                      onClick={() => item.isUnknown && openAddRule(getDisplayName(item.text))}
                   >
                     {getDisplayName(item.text)}
                     {item.isUnknown && <sup className="ml-0.5 text-[10px] opacity-70">?</sup>}
                     
                     {/* Custom Tooltip */}
                     {!item.isUnknown && (
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 pointer-events-none z-50">
                         <div className="font-bold text-slate-200 mb-1">{item.name}</div>
                         <div className="text-slate-300 leading-normal">{item.reason}</div>
                         {/* Triangle Arrow */}
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800/95"></div>
                       </div>
                     )}
                     
                     {/* Unknown Tooltip Hint */}
                     {item.isUnknown && (
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                         点击添加规则 +
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600"></div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </div>
            
            {/* 3. 营养承诺值分析 (Expanded) */}
            {analysis.nutrition && analysis.nutrition.report.length > 0 && (
               <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-slate-800">营养指标完整解读</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysis.nutrition.report.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm flex flex-col">
                        <span className="text-xs text-slate-400 uppercase font-bold">{item.label}</span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-black text-slate-700">{item.value}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === 'excellent' ? 'bg-emerald-100 text-emerald-700' : item.status === 'good' ? 'bg-green-100 text-green-700' : item.status === 'warning' ? 'bg-amber-100 text-amber-700' : item.status === 'danger' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {item.status === 'excellent' ? '优秀' : item.status === 'good' ? '达标' : item.status === 'danger' ? '警惕' : item.status === 'warning' ? '注意' : '信息'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-1">{item.msg}</span>
                      </div>
                    ))}
                  </div>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}