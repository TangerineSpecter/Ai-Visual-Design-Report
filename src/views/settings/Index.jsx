// src/views/settings/Index.jsx
import { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import packageJson from '../../../package.json';

// --- Micro Components for Consistency ---

const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-800 last:border-0">
        <div className="pr-4">
            <div className="text-sm font-medium text-slate-200">{label}</div>
            {description && <div className="text-xs text-slate-500 mt-1">{description}</div>}
        </div>
        <button 
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-n8n' : 'bg-slate-700'}`}
        >
            <span 
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    </div>
);

const InputGroup = ({ label, value, type = "text", placeholder, icon: Icon }) => (
    <div className="mb-4">
        <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
        <div className="relative rounded-md shadow-sm">
            {Icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className="h-4 w-4 text-slate-500" />
                </div>
            )}
            <input
                type={type}
                className={`block w-full rounded-lg border-0 bg-slate-900 py-2.5 text-slate-200 ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-n8n sm:text-sm sm:leading-6 ${Icon ? 'pl-10' : 'pl-3'}`}
                placeholder={placeholder}
                defaultValue={value}
            />
        </div>
    </div>
);

const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/30">
            <div className="p-1.5 bg-slate-800 rounded-md text-slate-400">
                <Icon size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-200">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

// --- Main Settings View ---

const SettingsView = () => {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // 模拟状态
    const [config, setConfig] = useState({
        animations: true,
        sound: false,
        debug: true,
        autoSave: true
    });

    const handleSave = () => {
        setLoading(true);
        // 模拟 API 请求
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">系统设置</h1>
                    <p className="text-slate-400 text-sm">管理 AI 引擎的全局参数、外观及连接配置。</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        重置默认
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg text-sm font-bold bg-n8n hover:bg-red-500 text-white shadow-[0_0_20px_rgba(255,77,77,0.3)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                保存中...
                            </>
                        ) : saved ? (
                            <>
                                <Icons.Check size={16} /> 已保存
                            </>
                        ) : (
                            '保存更改'
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Main Settings) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Model Configuration */}
                    <Section title="AI 模型配置" icon={Icons.Bot}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InputGroup label="API Key (Gemini)" type="password" value="sk-........................" icon={Icons.Key} />
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">首选模型</label>
                                <select className="block w-full rounded-lg border-0 bg-slate-900 py-2.5 px-3 text-slate-200 ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-n8n sm:text-sm">
                                    <option>Gemini 3.0 Pro</option>
                                    <option>Gemini 2.5 Flash</option>
                                    <option>GPT-5 (OpenAI)</option>
                                    <option>Claude 4.5 Sonnet</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                            <label className="block text-xs font-medium text-slate-400 mb-4">温度系数 (Temperature): 0.7</label>
                            <input type="range" className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-n8n" min="0" max="100" defaultValue="70" />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                                <span>精确 (0.0)</span>
                                <span>创意 (1.0)</span>
                            </div>
                        </div>
                    </Section>

                    {/* Interface Settings */}
                    <Section title="界面与交互" icon={Icons.Layout}>
                        <Toggle 
                            label="启用高频动画" 
                            description="在低性能设备上建议关闭此选项以提升流畅度" 
                            checked={config.animations}
                            onChange={(v) => setConfig({...config, animations: v})}
                        />
                        <Toggle 
                            label="音效反馈" 
                            description="操作成功或报错时播放提示音" 
                            checked={config.sound}
                            onChange={(v) => setConfig({...config, sound: v})}
                        />
                        <Toggle 
                            label="开发者调试模式" 
                            description="在控制台输出详细的 State 变化日志" 
                            checked={config.debug}
                            onChange={(v) => setConfig({...config, debug: v})}
                        />
                    </Section>
                </div>

                {/* Right Column (Info & Stats) */}
                <div className="space-y-6">
                    <Section title="当前环境" icon={Icons.Globe}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">版本</span>
                                <span className="font-mono text-slate-200">v{packageJson.version}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">构建时间</span>
                                <span className="font-mono text-slate-200">2025-11-27</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">React</span>
                                <span className="font-mono text-slate-200">v19.2.0</span>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-800">
                                <div className="text-xs text-slate-500 mb-2">存储使用情况</div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                                <div className="text-right text-[10px] text-slate-400">45% Used</div>
                            </div>
                        </div>
                    </Section>
                    
                    <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                        <div className="flex gap-3">
                            <Icons.AlertCircle className="text-yellow-500 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-yellow-500 mb-1">注意</h4>
                                <p className="text-xs text-yellow-200/70 leading-relaxed">
                                    更改 API Key 后需要重新加载页面才能生效。请确保不要在公共演示中展示您的密钥。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;