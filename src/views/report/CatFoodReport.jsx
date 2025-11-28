import React, { useState, useEffect } from 'react';
import {
    Cat,
    Bone,
    Fish,
    Wheat,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Scale,
    Droplet,
    Search,
    ChevronDown,
    Activity,
    Zap,
    ShieldAlert
} from 'lucide-react';

const CatFoodReport = () => {
    const [activeTab, setActiveTab] = useState('evolution');
    const [scrollY, setScrollY] = useState(0);

    // Scroll listener for sticky header effects
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'evolution', icon: Cat, label: '肉食本能' },
        { id: 'protein', icon: Bone, label: '蛋白质真相' },
        { id: 'fat', icon: Droplet, label: '脂肪奥秘' },
        { id: 'ingredients', icon: Search, label: '成分红绿灯' },
        { id: 'calculator', icon: Activity, label: '碳水计算' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Sticky Header */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
                {/* Changed max-w-6xl to max-w-5xl to match the rest of the page content */}
                <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-500 p-2 rounded-full text-white">
                            <Cat size={24} />
                        </div>
                        <span className={`font-bold text-xl ${scrollY > 50 ? 'text-slate-800' : 'text-slate-900'} tracking-tight`}>
                            猫粮<span className="text-amber-600">真相实验室</span>
                        </span>
                    </div>

                    <div className="hidden md:flex gap-6">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${activeTab === item.id
                                        ? 'bg-amber-100 text-amber-700 font-medium'
                                        : 'text-slate-600 hover:text-amber-600'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-20 px-4 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden relative">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 z-10 space-y-6">
                        <div className="inline-block px-4 py-1 bg-amber-200 text-amber-900 rounded-full text-sm font-semibold mb-2 animate-bounce">
                            深度解析报告可视化
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                            你的猫真的是<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                                绝对肉食动物
                            </span>
                        </h1>
                        <p className="text-lg text-slate-700 leading-relaxed">
                            从鲜肉幻觉得到无谷陷阱，带你读懂配料表背后的科学真相。基于AAFCO与最新兽医营养学研究。
                        </p>
                        <button
                            onClick={() => document.getElementById('evolution').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 hover:scale-105 transition-all transform flex items-center gap-2"
                        >
                            开始探索 <ChevronDown size={20} />
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        {/* Abstract decorative shapes representing nutrients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 -left-4 w-64 h-64 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                        <div className="relative z-10 bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-white/50 shadow-xl">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                                    <div className="bg-red-100 p-2 rounded-full text-red-600"><Bone size={20} /></div>
                                    <div>
                                        <div className="text-xs text-slate-500">生理需求</div>
                                        <div className="font-bold">高蛋白 / 中脂肪</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Droplet size={20} /></div>
                                    <div>
                                        <div className="text-xs text-slate-500">关键缺乏</div>
                                        <div className="font-bold">无法合成牛磺酸</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600"><Wheat size={20} /></div>
                                    <div>
                                        <div className="text-xs text-slate-500">代谢短板</div>
                                        <div className="font-bold">极低的碳水耐受</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12 space-y-24">

                {/* Section 1: Evolution */}
                <section id="evolution" className="scroll-mt-24">
                    <SectionHeader
                        icon={Cat}
                        title="进化的遗产"
                        subtitle="为什么猫不能像人或狗一样吃东西？"
                    />

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <ShieldAlert className="text-red-500" /> 代谢特质
                            </h3>
                            <ul className="space-y-4">
                                <ListItem title="极短的消化道" desc="适应高消化率肉类，无法有效发酵复杂植物纤维。" />
                                <ListItem title="酶的缺失" desc="无法将胡萝卜素转化为维生素A，极低的葡萄糖激酶活性。" />
                                <ListItem title="必需营养素" desc="必须直接摄取牛磺酸、精氨酸和花生四烯酸（植物中没有）。" />
                            </ul>
                        </div>
                        <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-amber-500 rounded-full filter blur-3xl opacity-20 transform translate-x-10 -translate-y-10"></div>
                            <h3 className="text-xl font-bold mb-6 text-amber-400">工业化的悖论</h3>
                            <p className="mb-6 leading-relaxed text-slate-300">
                                猫的生理需求是<strong className="text-white">高蛋白、高水分、极低碳水</strong>。
                                <br /><br />
                                但商业干粮（膨化粮）为了成型和成本，往往是<strong className="text-white">低水分、高碳水、植物蛋白填充</strong>。
                                这就像让一个只喝油的车去烧煤，长期下来必然导致引擎（身体）故障。
                            </p>
                            <div className="flex gap-4 text-sm font-bold">
                                <div className="flex-1 bg-slate-700 p-3 rounded-lg text-center">
                                    自然饮食<br /><span className="text-green-400 text-xl">70% 水分</span>
                                </div>
                                <div className="flex-1 bg-slate-700 p-3 rounded-lg text-center">
                                    干粮<br /><span className="text-red-400 text-xl">10% 水分</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Protein - Interactive Simulator */}
                <section id="protein" className="scroll-mt-24">
                    <SectionHeader
                        icon={Bone}
                        title="蛋白质的伪装"
                        subtitle="鲜肉 vs 肉粉：谁才是真正的王者？"
                    />

                    <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                        <div className="p-6 bg-amber-50 border-b border-amber-100">
                            <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                                <Zap size={20} /> 互动实验：水分幻觉 (Water Illusion)
                            </h3>
                            <p className="text-sm text-amber-800 mt-1">
                                配料表是按加工前的“湿重”排序的。试着点击开关，看看脱水后的真相。
                            </p>
                        </div>

                        <ProteinSimulator />

                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="p-8 border-r border-slate-100">
                                <h4 className="font-bold text-lg mb-2 text-green-700">优质蛋白来源</h4>
                                <ul className="text-sm space-y-2 text-slate-600">
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> <b>鲜鸡肉/鸭肉：</b> 氨基酸保留率高，消化好。</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> <b>鸡肉粉/鱼粉：</b> 高浓度蛋白，矿物质丰富（需注意灰分）。</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> <b>内脏（心/肝）：</b> 天然的维生素宝库。</li>
                                </ul>
                            </div>
                            <div className="p-8 bg-slate-50">
                                <h4 className="font-bold text-lg mb-2 text-red-700">劣质/假性蛋白</h4>
                                <ul className="text-sm space-y-2 text-slate-600">
                                    <li className="flex items-center gap-2"><XCircle size={16} className="text-red-500" /> <b>植物蛋白（谷蛋白/豌豆蛋白）：</b> 缺氨基酸，易导致结石。</li>
                                    <li className="flex items-center gap-2"><XCircle size={16} className="text-red-500" /> <b>“肉类副产品”：</b> 定义模糊，可能含羽毛、蹄角等低质组织。</li>
                                    <li className="flex items-center gap-2"><XCircle size={16} className="text-red-500" /> <b>成分拆分：</b> 把豌豆拆成豌豆、豌豆粉、豌豆蛋白，掩盖其总量。</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Traffic Light System */}
                <section id="ingredients" className="scroll-mt-24">
                    <SectionHeader
                        icon={Search}
                        title="配料表红绿灯"
                        subtitle="哪些成分是宝藏，哪些是毒药？"
                    />
                    <IngredientTrafficLight />
                </section>

                {/* Section 4: Carb Calculator */}
                <section id="calculator" className="scroll-mt-24">
                    <SectionHeader
                        icon={Activity}
                        title="隐藏的碳水化合物"
                        subtitle="厂商不会写在标签上，但你需要知道。"
                    />

                    <div className="mt-8 grid lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <p className="text-slate-700">
                                猫的自然饮食中碳水化合物 <span className="font-bold text-red-600">&lt; 5%</span>。
                                但为了让干粮颗粒成型，商业粮通常含有 <span className="font-bold text-amber-600">30-40%</span> 的碳水。
                                <br /><br />
                                长期高碳水饮食 = 肥胖 + 糖尿病 + 胰腺压力。
                                <br />
                                <b>无谷 ≠ 低碳水</b>：土豆和豌豆淀粉往往比谷物更高。
                            </p>

                            <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
                                <h4 className="font-bold text-lg mb-2">计算公式 (干物质基础估算)</h4>
                                <code className="block bg-slate-100 p-3 rounded text-slate-800 font-mono text-sm">
                                    100% - 粗蛋白% - 粗脂肪% - 粗纤维% - 水分% - 灰分%(估算8%) = 碳水化合物%
                                </code>
                            </div>
                        </div>

                        <CarbCalculator />
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-12">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <Cat size={48} className="mx-auto text-slate-600 mb-4" />
                    <h2 className="text-2xl font-bold text-white">做个聪明的铲屎官</h2>
                    <p className="max-w-xl mx-auto">
                        配料表不仅仅是一张纸，它是猫咪健康的晴雨表。
                        <br />
                        虽然我们无法完全避免工业加工食品，但我们可以通过学习，避开那些明显的健康陷阱。
                    </p>
                    <div className="pt-8 text-sm text-slate-600">
                        © 2023 基于 AAFCO & FEDIAF 数据深度分析报告生成
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- Sub Components ---

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-start gap-4 mb-6">
        <div className="bg-amber-100 p-3 rounded-xl text-amber-600 mt-1">
            <Icon size={28} />
        </div>
        <div>
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            <p className="text-lg text-slate-500 mt-1">{subtitle}</p>
        </div>
    </div>
);

const ListItem = ({ title, desc }) => (
    <li className="flex gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0"></div>
        <div>
            <span className="font-bold text-slate-800">{title}</span>
            <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
        </div>
    </li>
);

// Interactive Protein Simulator
const ProteinSimulator = () => {
    const [isDry, setIsDry] = useState(false);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h4 className="font-bold text-xl text-slate-800">加工前 vs 加工后</h4>
                <button
                    onClick={() => setIsDry(!isDry)}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${isDry ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                >
                    {isDry ? '查看加工后 (干物质)' : '查看加工前 (配料表顺序)'}
                </button>
            </div>

            <div className="space-y-6">
                {/* Ingredient 1: Fresh Chicken */}
                <div className="relative">
                    <div className="flex justify-between text-sm font-semibold mb-1">
                        <span>鲜鸡肉 (第一位)</span>
                        <span>{isDry ? '实际上约 4% 蛋白贡献' : '占重量 30% (含水)'}</span>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-green-500 transition-all duration-1000 ease-in-out flex items-center justify-center text-xs text-white whitespace-nowrap overflow-hidden"
                            style={{ width: isDry ? '20%' : '80%' }}
                        >
                            {isDry ? '剩余肉干' : '鲜肉'}
                        </div>
                        <div
                            className="h-full bg-blue-200 transition-all duration-1000 ease-in-out flex items-center justify-center text-xs text-blue-800"
                            style={{ width: isDry ? '0%' : '60%' }} // Visualizing water loss
                        >
                            {!isDry && '水分 (加工蒸发)'}
                        </div>
                    </div>
                    {isDry && <span className="text-xs text-red-500 absolute -bottom-5 right-0">大部分是水，蒸发后排名暴跌！</span>}
                </div>

                {/* Ingredient 2: Chicken Meal */}
                <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                        <span>鸡肉粉 (第二位)</span>
                        <span>{isDry ? '实际上约 35% 蛋白贡献' : '占重量 25%'}</span>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 transition-all duration-1000 ease-in-out flex items-center justify-center text-xs text-white"
                            style={{ width: isDry ? '25%' : '25%' }} // Meal doesn't shrink much
                        >
                            浓缩肉粉
                        </div>
                    </div>
                </div>

                {/* Ingredient 3: Corn */}
                <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                        <span>玉米/淀粉 (第三位)</span>
                        <span>{isDry ? '占比不变' : '占重量 20%'}</span>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-yellow-400 transition-all duration-1000 ease-in-out flex items-center justify-center text-xs text-yellow-900"
                            style={{ width: '20%' }}
                        >
                            碳水
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="font-bold text-amber-600">分析：</span>
                如果你看到“鲜鸡肉”排第一，但紧接着是“大米、玉米蛋白粉”，这通常是营销陷阱。
                因为鲜肉含75%的水，一旦做成干粮，它的固体含量可能还没排在后面的谷物多。
            </p>
        </div>
    );
};

// Traffic Light Component
const IngredientTrafficLight = () => {
    const [filter, setFilter] = useState('all');

    const ingredients = [
        { name: '去骨鸡肉/鸭肉', type: 'good', cat: '蛋白', desc: '优质易消化，但需注意水分幻觉。' },
        { name: '鸡肉粉/鱼粉', type: 'good', cat: '蛋白', desc: '高密度蛋白来源，若是明确物种（如三文鱼粉）则极佳。' },
        { name: '鸡肝/鸡心', type: 'good', cat: '内脏', desc: '天然的维生素与牛磺酸宝库。' },
        { name: '深海鱼油', type: 'good', cat: '脂肪', desc: '提供Omega-3 (EPA/DHA)，抗炎。' },
        { name: '混合生育酚', type: 'good', cat: '防腐', desc: '即维生素E，天然安全的抗氧化剂。' },
        { name: '螯合矿物质', type: 'good', cat: '微量', desc: '如“蛋白锌”，吸收率远高于普通矿物质。' },

        { name: '豌豆蛋白', type: 'mid', cat: '蛋白', desc: '氨基酸谱尚可，但含有抗营养因子，过多可能导致结石。' },
        { name: '植物油', type: 'mid', cat: '脂肪', desc: '如葵花籽油。猫无法有效利用其中的Omega-6转化为花生四烯酸。' },
        { name: '瓜尔胶', type: 'mid', cat: '添加', desc: '常见增稠剂，量大会导致软便。' },
        { name: '肉类副产品', type: 'mid', cat: '蛋白', desc: '定义模糊。可能是肝脏，也可能是血管和结缔组织。' },

        { name: 'BHA / BHT', type: 'bad', cat: '防腐', desc: '合成抗氧化剂，潜在致癌物，尽量避免。' },
        { name: '人工色素', type: 'bad', cat: '添加', desc: '红40、黄5等。纯粹为了给主人看，对猫有潜在毒性。' },
        { name: '丙二醇', type: 'bad', cat: '添加', desc: '破坏红细胞，导致溶血性贫血。FDA禁止用于猫粮。' },
        { name: '维生素K3', type: 'bad', cat: '微量', desc: '合成K3，具有肝毒性，廉价替代品。' },
        { name: '卡拉胶', type: 'bad', cat: '添加', desc: '强致炎剂，可能诱发肠炎(IBD)甚至癌症。' },
        { name: '玉米面筋粉', type: 'bad', cat: '蛋白', desc: '廉价植物蛋白填充，缺乏必需氨基酸。' },
    ];

    const filtered = filter === 'all' ? ingredients : ingredients.filter(i => i.type === filter);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
                {['all', 'good', 'mid', 'bad'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors
              ${filter === f ? 'bg-slate-50 text-slate-900 border-b-2 border-amber-500' : 'text-slate-400 hover:bg-slate-50'}
            `}
                    >
                        {f === 'all' ? '全部' : f === 'good' ? '绿灯 (推荐)' : f === 'mid' ? '黄灯 (斟酌)' : '红灯 (警惕)'}
                    </button>
                ))}
            </div>

            <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border-l-4 shadow-sm group hover:shadow-md transition-all
            ${item.type === 'good' ? 'border-green-500 bg-green-50/50' :
                            item.type === 'mid' ? 'border-yellow-400 bg-yellow-50/50' : 'border-red-500 bg-red-50/50'}
          `}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-800">{item.name}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-200 px-1 rounded">{item.cat}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Simple Calculator Component
const CarbCalculator = () => {
    const [values, setValues] = useState({ p: 35, f: 15, fib: 4, ash: 8, water: 10 });

    const carb = Math.max(0, 100 - values.p - values.f - values.fib - values.ash - values.water);
    const dryCarb = (carb / (100 - values.water)) * 100;

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: Number(e.target.value) });
    };

    return (
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg flex items-center gap-2">
                    <Activity className="text-amber-400" /> 碳水计算器
                </h4>
                <div className="text-xs bg-slate-700 px-2 py-1 rounded">请输入标签上的保证值</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                    { label: '粗蛋白 %', name: 'p' },
                    { label: '粗脂肪 %', name: 'f' },
                    { label: '粗纤维 %', name: 'fib' },
                    { label: '水分 %', name: 'water' },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="text-xs text-slate-400 block mb-1">{field.label}</label>
                        <input
                            type="number"
                            name={field.name}
                            value={values[field.name]}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-slate-700">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-400">估算碳水化合物:</span>
                    <span className={`text-3xl font-bold ${carb > 30 ? 'text-red-400' : carb < 10 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {carb.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${carb > 30 ? 'bg-red-500' : carb < 10 ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(100, carb)}%` }}
                    ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-right">
                    *注：灰分默认为8%，实际可能浮动
                </p>
            </div>
        </div>
    );
};

export default CatFoodReport;
