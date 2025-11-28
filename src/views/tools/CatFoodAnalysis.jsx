import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Search, Info, Trash2, Cat, ChevronDown, ChevronUp, Sparkles, Leaf, Activity, Scale, Calculator, PieChart, Layers, Plus, Save, HelpCircle, Edit3, Tag, Star, Copy, Check, ShieldCheck, Wheat, Ban, Printer, FileText, Download, Image as ImageIcon } from 'lucide-react';
import ingredientDatabase from './ingredientDatabase';



// --- 雷达图组件 (增加 xmlns 兼容性) ---
const RadarChart = ({ data, size = 260 }) => {
    const center = size / 2;
    const padding = 60;
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
        <div className="flex justify-center items-center py-4">
            <svg width={size} height={size} className="overflow-visible" xmlns="http://www.w3.org/2000/svg">
                {bgPolygons.reverse().map((points, i) => (
                    <polygon key={i} points={points} fill={i % 2 === 0 ? "#f8fafc" : "white"} stroke="#e2e8f0" strokeWidth="1" />
                ))}
                {axes.map((line, i) => (
                    <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                ))}
                <polygon points={dataPolygon} fill="rgba(79, 70, 229, 0.3)" stroke="#4f46e5" strokeWidth="2" />
                {data.map((item, index) => {
                    const { x, y } = getCoordinates(item.value, index, data.length);
                    return <circle key={index} cx={x} cy={y} r="3" fill="#4f46e5" stroke="white" strokeWidth="2" />;
                })}
                {data.map((item, index) => {
                    const { x, y } = getCoordinates(135, index, data.length);
                    return (
                        <g key={index}>
                            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider">{item.label}</text>
                            <text x={x} y={y + 14} textAnchor="middle" dominantBaseline="middle" className="text-[12px] font-black fill-indigo-600">{Math.round(item.value)}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// --- 小标签组件 ---
const FeatureTag = ({ label, active, icon: Icon, positive = true }) => (
    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${active
        ? (positive ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-red-50 border-red-200 text-red-700 shadow-sm')
        : 'bg-slate-50 border-slate-100 text-slate-300 grayscale opacity-50'}`}>
        <Icon className={`w-3.5 h-3.5 ${active ? (positive ? 'text-emerald-500' : 'text-red-500') : 'text-slate-300'}`} />
        <span>{label}</span>
    </div>
);

// --- 纯净名称提取工具 ---
const getDisplayName = (text) => {
    if (!text) return '';
    let name = text.replace(/[\(\uff08\[\u3010].*$/, '');
    name = name.replace(/\s*\d+(\.\d+)?%?\s*$/, '');
    name = name.replace(/[:：]/g, '');
    return name.trim();
};

// --- 分类名称转换 (修复版) ---
const getCategoryLabel = (cat) => {
    // console.log('Checking category:', cat); // Debug
    if (!cat) return '原料';
    switch (cat.toLowerCase()) {
        case 'meat': return '肉类';
        case 'grain': return '谷物';
        case 'fruit_veg': return '蔬果';
        case 'additive': return '添加剂';
        default: return '原料';
    }
};

export default function App() {
    const [brandName, setBrandName] = useState('');
    const [input, setInput] = useState('');
    const [nutritionInput, setNutritionInput] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [copied, setCopied] = useState(false);
    const [isGeneratingImg, setIsGeneratingImg] = useState(false);

    const [customRules, setCustomRules] = useState([]);
    const [showRuleForm, setShowRuleForm] = useState(false);
    const [editingRule, setEditingRule] = useState({
        keyword: '', name: '', level: 'neutral', category: 'other', score: 60, reason: ''
    });

    // 动态加载 html2canvas
    useEffect(() => {
        if (!document.getElementById('html2canvas-script')) {
            const script = document.createElement('script');
            script.id = 'html2canvas-script';
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const categoryOptions = [
        { value: 'meat', label: '肉类/鱼/蛋/奶' },
        { value: 'grain', label: '谷物/豆/淀粉' },
        { value: 'fruit_veg', label: '蔬果/草本' },
        { value: 'additive', label: '营养/添加剂' },
        { value: 'other', label: '其他' }
    ];

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

        if (values.protein !== null) {
            if (values.protein >= 40) {
                report.push({ label: '粗蛋白', value: `${values.protein}%`, status: 'excellent', msg: '极高，优秀！' });
                scoreMod += 5;
            } else if (values.protein >= 30) {
                report.push({ label: '粗蛋白', value: `${values.protein}%`, status: 'good', msg: '标准水平。' });
            } else {
                report.push({ label: '粗蛋白', value: `${values.protein}%`, status: 'warning', msg: '偏低。' });
                scoreMod -= 10;
            }
        }
        if (values.calcium !== null && values.phosphorus !== null) {
            const ratio = values.calcium / values.phosphorus;
            const ratioStr = ratio.toFixed(2) + ":1";
            if (ratio >= 1.0 && ratio <= 1.6) {
                report.push({ label: '钙磷比', value: ratioStr, status: 'excellent', msg: '完美。' });
                scoreMod += 3;
            } else if (ratio < 0.9 || ratio > 2.0) {
                report.push({ label: '钙磷比', value: ratioStr, status: 'danger', msg: '失衡。' });
                scoreMod -= 10;
            } else {
                report.push({ label: '钙磷比', value: ratioStr, status: 'warning', msg: '一般。' });
            }
        }
        if (report.length === 0 && text.length > 0) {
            report.push({ label: '数据', value: '解析中', status: 'warning', msg: '未匹配到关键指标，请检查格式' });
        }

        return { values, report, scoreMod };
    };

    const handleAnalyze = () => {
        if (!input.trim()) return;
        const allRules = [...customRules, ...ingredientDatabase];
        const rawList = input.split(/[,，、\n]+/g).map(s => s.trim()).filter(item => item.length > 0);

        let dangerCount = 0; let warningCount = 0; let goodCount = 0; let unknownCount = 0;
        let totalMeatPercentage = 0; let hasExplicitMeatPercent = false;
        let grainCount = 0; let functionalCount = 0;

        const analyzedIngredients = rawList.map(item => {
            let match = null;
            let percentage = extractPercentage(item);
            const normalizedItem = item.replace(/\s+/g, '').toLowerCase();

            for (let rule of allRules) {
                const normalizedKeyword = rule.keyword.replace(/\s+/g, '').toLowerCase();
                const normalizedName = rule.name ? rule.name.replace(/\s+/g, '').toLowerCase() : '';
                if (normalizedItem.includes(normalizedKeyword) || (normalizedName && normalizedItem.includes(normalizedName))) {
                    match = rule; break;
                }
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

        // 强制执行营养分析
        let nutritionAnalysis = null;
        if (nutritionInput.trim()) {
            nutritionAnalysis = analyzeNutritionData(nutritionInput);
            if (nutritionAnalysis) score += nutritionAnalysis.scoreMod;
        }

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
            brandName: brandName || '未命名产品',
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
        if (newScore >= 80) newLevel = 'good'; else if (newScore <= 40) newLevel = 'warning'; if (newScore <= 20) newLevel = 'danger';
        setEditingRule(prev => ({ ...prev, score: newScore, level: newLevel }));
    };
    const handleSaveRule = () => { if (!editingRule.keyword.trim()) return; setCustomRules([{ ...editingRule }, ...customRules.filter(r => r.keyword !== editingRule.keyword)]); setShowRuleForm(false); if (analysis) setTimeout(() => document.getElementById('analyze-btn').click(), 0); };

    // 核心修复：直接截图可见区域，避免 "cloning" 导致的样式丢失
    const handleExportImage = async () => {
        if (isGeneratingImg) return;
        setIsGeneratingImg(true);

        if (window.html2canvas) {
            try {
                const element = document.getElementById('result-card');

                // 截图配置：直接截取当前可见元素
                const canvas = await window.html2canvas(element, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    // 确保捕获完整的卡片高度
                    windowHeight: element.scrollHeight,
                });

                const link = document.createElement('a');
                link.download = `猫粮分析_${brandName || 'report'}.png`;
                link.href = canvas.toDataURL();
                link.click();
            } catch (error) {
                console.error('Export failed:', error);
                alert('导出失败，请尝试直接截图');
            }
        } else {
            alert('组件加载中，请稍后重试');
        }
        setIsGeneratingImg(false);
    };

    const getPillStyle = (level, isUnknown) => {
        const base = "border font-medium transition-all duration-200 cursor-help shadow-sm hover:scale-105";
        if (isUnknown) return `${base} bg-white border-slate-300 text-slate-400 border-dashed hover:border-slate-400 hover:text-slate-600`;
        switch (level) {
            case 'danger': return `${base} bg-red-50 border-red-100 text-red-700`;
            case 'warning': return `${base} bg-amber-50 border-amber-100 text-amber-700`;
            case 'good': return `${base} bg-emerald-50 border-emerald-100 text-emerald-700`;
            default: return `${base} bg-slate-50 border-slate-200 text-slate-600`;
        }
    };

    const demoText = "鲜鸡肉（75.5%）、鲜鸭肉（11%）、L-抗坏血酸-2- 磷酸酯、红薯颗粒、纤维素、鱼油0.5%、全脂羊奶粉0.5%、蛋黄粉0.5%、蓝莓干、覆盆子干、车前子、菊苣根粉、神秘配料X、牛磺酸、氨基酸锌络合物";
    const demoNutrition = "粗蛋白质 ≥ 42%\n水分 ≤ 10%\n粗脂肪 ≥ 18%\n牛磺酸 ≥ 0.2%\n粗灰分 ≤9.0%\n总磷 ≥ 0.8%\n粗纤维 ≤ 4.0%\n钙 ≥ 1.0%";

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">

            {/* 规则添加弹窗 */}
            {showRuleForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Edit3 className="w-5 h-5 text-indigo-500" /> 自定义规则</h3>
                            <button onClick={() => setShowRuleForm(false)}><XCircle className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="space-y-4">
                            <input value={editingRule.keyword} onChange={e => setEditingRule({ ...editingRule, keyword: e.target.value })} className="w-full p-3 rounded-xl border" placeholder="配料关键词" />
                            <select value={editingRule.category} onChange={e => setEditingRule({ ...editingRule, category: e.target.value })} className="w-full p-3 rounded-xl border bg-white">
                                {categoryOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                            </select>
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-2"><span>评分 {editingRule.score}</span></div>
                                <input type="range" min="0" max="100" value={editingRule.score} onChange={(e) => handleScoreChange(parseInt(e.target.value))} className="w-full" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { val: 'good', label: '优质', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                                    { val: 'neutral', label: '中性', color: 'bg-slate-100 text-slate-700 border-slate-200' },
                                    { val: 'warning', label: '争议', color: 'bg-amber-100 text-amber-700 border-amber-200' },
                                    { val: 'danger', label: '风险', color: 'bg-red-100 text-red-700 border-red-200' },
                                ].map(opt => (
                                    <button key={opt.val} onClick={() => setEditingRule({ ...editingRule, level: opt.val })} className={`py-2 rounded-lg text-sm font-bold border-2 ${editingRule.level === opt.val ? opt.color + ' ring-2 ring-offset-1 ring-indigo-300' : 'border-transparent bg-slate-50 text-slate-500 opacity-60'}`}>{opt.label}</button>
                                ))}
                            </div>
                            <textarea value={editingRule.reason} onChange={e => setEditingRule({ ...editingRule, reason: e.target.value })} className="w-full p-3 rounded-xl border h-20" placeholder="评价理由..." />
                            <button onClick={handleSaveRule} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2"><Save className="w-5 h-5" /> 保存</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-8">

                {/* 输入区域 */}
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-3">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl text-white"><Cat className="w-6 h-6" /></div>
                            专业猫粮配料分析器
                        </h1>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 p-6 md:p-8 border border-slate-100">
                        {/* 品牌名称输入 */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-slate-700 mb-1">品牌名称 (选填)</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 font-bold" placeholder="例如：渴望 鸡肉味" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                        </div>

                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-sm font-bold text-slate-700">配料表 (必填)</label>
                            <div className="flex gap-2">
                                <button onClick={() => { setInput(demoText); setNutritionInput(demoNutrition); setBrandName("测试品牌 经典鸡肉"); }} className="text-slate-400 hover:text-indigo-500 text-xs font-medium transition-colors">示例</button>
                                <button onClick={() => openAddRule()} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> 添加规则</button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className="md:col-span-2">
                                <textarea className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none text-slate-600 text-sm leading-relaxed" placeholder="粘贴配料表..." value={input} onChange={(e) => setInput(e.target.value)}></textarea>
                            </div>
                            <div className="md:col-span-1">
                                <textarea className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none text-slate-600 text-sm leading-relaxed font-mono" placeholder="成分承诺值..." value={nutritionInput} onChange={(e) => setNutritionInput(e.target.value)}></textarea>
                            </div>
                        </div>

                        <button id="analyze-btn" onClick={handleAnalyze} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 text-lg"><Search className="w-5 h-5" /> 开始分析</button>
                    </div>
                </div>

                {/* 结果卡片 (海报区域) */}
                {analysis && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
                        <div className="flex justify-end gap-3 mb-4">
                            <button onClick={handleExportImage} disabled={isGeneratingImg} className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-700 shadow-lg transition-all disabled:opacity-50">
                                {isGeneratingImg ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                                {isGeneratingImg ? '生成中...' : '保存海报图片'}
                            </button>
                        </div>

                        <div id="result-card" className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-200 relative p-8">

                            {/* Poster Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-slate-100 pb-6">
                                <div>
                                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Cat Food Analysis Report</div>
                                    <h2 className="text-3xl font-black text-slate-900">{analysis.brandName}</h2>
                                    <p className="text-slate-400 text-sm mt-1">生成日期: {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-2">
                                        <span className={`text-6xl font-black ${analysis.score >= 80 ? 'text-emerald-500' : analysis.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{analysis.score}</span>
                                        <span className="text-slate-300 font-bold text-xl">/ 100</span>
                                    </div>
                                    <div className={`text-lg font-bold ${analysis.verdictColor}`}>{analysis.verdict}</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-10">
                                {/* Left: Radar */}
                                <div className="flex flex-col items-center justify-center md:border-r border-slate-100 md:pr-10">
                                    <div className="w-full flex justify-center mb-4"><RadarChart data={analysis.radarData} size={240} /></div>

                                    {/* Spectrum Bar */}
                                    <div className="w-full">
                                        <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 uppercase font-bold">
                                            <span>成分分布</span>
                                            <span>共 {analysis.ingredients.length} 项</span>
                                        </div>
                                        <div className="flex h-3 rounded-full overflow-hidden w-full bg-slate-100 mb-2">
                                            <div style={{ width: `${(analysis.counts.good / analysis.ingredients.length) * 100}%` }} className="bg-emerald-400"></div>
                                            <div style={{ width: `${(analysis.counts.neutral / analysis.ingredients.length) * 100}%` }} className="bg-slate-300"></div>
                                            <div style={{ width: `${(analysis.counts.warning / analysis.ingredients.length) * 100}%` }} className="bg-amber-400"></div>
                                            <div style={{ width: `${(analysis.counts.danger / analysis.ingredients.length) * 100}%` }} className="bg-red-500"></div>
                                            <div style={{ width: `${(analysis.counts.unknown / analysis.ingredients.length) * 100}%` }} className="bg-slate-200 pattern-diagonal-lines"></div>
                                        </div>
                                        <div className="flex gap-3 text-[10px] text-slate-400 font-medium justify-center">
                                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> {analysis.counts.good} 优质</span>
                                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {analysis.counts.danger} 风险</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Metrics */}
                                <div className="col-span-2 flex flex-col gap-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Top 5 */}
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3"><Layers className="w-4 h-4 text-indigo-500" /> 前5位定基调</div>
                                            <div className="flex gap-2 flex-wrap">
                                                {analysis.ingredients.slice(0, 5).map((item, idx) => (
                                                    <div key={idx} className={`relative group px-2.5 py-1 rounded-lg text-xs font-bold border cursor-default ${getPillStyle(item.level, item.isUnknown)}`}>
                                                        {idx + 1}. {getDisplayName(item.text)}
                                                        {/* Top 5 Tip - Fixed Z-index */}
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-[999] pointer-events-none transform -translate-y-1">
                                                            <div className="font-bold text-emerald-300 mb-1">{item.name}</div>
                                                            <div className="leading-relaxed opacity-90">{item.reason}</div>
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800/95"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {analysis.top5.grainOrStarch.length >= 2 && <div className="mt-3 text-xs text-red-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> 警告：前5位淀粉/谷物较多</div>}
                                        </div>

                                        {/* Meat Percent */}
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><PieChart className="w-4 h-4 text-indigo-500" /> 标示肉含量</div>
                                            <div className={`text-3xl font-black ${analysis.meatPercent.value < 50 ? 'text-red-500' : 'text-slate-800'}`}>{analysis.meatPercent.hasData ? analysis.meatPercent.value.toFixed(1) + '%' : '未标示'}</div>
                                            <div className="text-xs text-slate-500 mt-1">{analysis.meatPercent.hasData ? (analysis.meatPercent.value < 50 ? '肉含量偏低' : '动物蛋白占比') : '建议选择标明肉含量的产品'}</div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <FeatureTag label="无谷配方" active={analysis.features.isGrainFree} icon={Wheat} />
                                        <FeatureTag label="高肉含量" active={analysis.features.isHighMeat} icon={Cat} />
                                        <FeatureTag label="无诱食剂" active={analysis.features.noBadPreservatives} icon={ShieldCheck} />
                                        <FeatureTag label="无不明肉" active={analysis.features.noUnknownMeat} icon={Ban} />
                                    </div>

                                    {/* Nutrition Analysis Section (Restored & Fixed) */}
                                    {analysis.nutrition && (
                                        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3"><Calculator className="w-4 h-4 text-indigo-500" /> 营养指标摘要</div>
                                            {analysis.nutrition.report.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {analysis.nutrition.report.slice(0, 4).map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-blue-100 shadow-sm">
                                                            <span className="text-xs font-bold text-slate-500">{item.label}</span>
                                                            <div className="text-right">
                                                                <span className="text-sm font-black text-slate-700 block">{item.value}</span>
                                                                <span className={`text-[10px] ${item.status === 'excellent' ? 'text-emerald-500' : item.status === 'danger' ? 'text-red-500' : 'text-slate-400'}`}>{item.status === 'excellent' ? '优秀' : item.status === 'danger' ? '警惕' : ''}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-slate-400 italic text-center py-2">未检测到有效营养承诺值</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Full List Section (With Improved Tooltips) */}
                            <div className="p-8 pt-0 border-t border-slate-100 mt-4">
                                <div className="flex items-center justify-between mb-4 pt-6">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Info className="w-5 h-5 text-indigo-500" /> 完整配料分析</h3>
                                    {analysis.counts.unknown > 0 && (
                                        <button onClick={() => {
                                            const text = analysis.ingredients.filter(i => i.isUnknown).map(i => i.text).join('、');
                                            navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000);
                                        }} className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-1" id="no-print">
                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 复制未识别成分
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2.5 leading-loose">
                                    {analysis.ingredients.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`relative group inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border cursor-help shadow-sm hover:scale-105 transition-transform ${getPillStyle(item.level, item.isUnknown)}`}
                                            onClick={() => item.isUnknown && openAddRule(getDisplayName(item.text))}
                                        >
                                            {getDisplayName(item.text)}
                                            {item.isUnknown && <sup className="ml-0.5 text-[9px] opacity-70">?</sup>}

                                            {/* Enhanced Tooltip (Fix: layout for long text) */}
                                            {!item.isUnknown && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-0 bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-[999] overflow-hidden border border-white/10 pointer-events-none transform -translate-y-1">
                                                    <div className="flex items-stretch border-b border-white/10">
                                                        <div className="flex-1 p-3 bg-white/5">
                                                            <span className="font-bold text-sm text-emerald-400 block leading-tight">{item.name}</span>
                                                        </div>
                                                        <div className="bg-white/10 px-3 flex items-center justify-center border-l border-white/10">
                                                            <span className="text-[10px] uppercase font-bold tracking-wider">{getCategoryLabel(item.category)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-slate-300 leading-relaxed mb-2">{item.reason}</p>
                                                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-white/10">
                                                            <span>评分: <span className="text-white">{item.score}</span></span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer for Poster */}
                            <div className="text-center pb-2 pt-6 text-[10px] text-slate-300 uppercase tracking-widest">Generated by CatFood Analyzer Pro</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}