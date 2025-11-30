import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, FileImage, RefreshCw, X, Check, Monitor, Smartphone, Maximize2, MousePointerClick, Zap, ArrowRight, ChevronRight, LayoutTemplate, Sparkles, Sliders } from 'lucide-react';

export default function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [previewOriginal, setPreviewOriginal] = useState(null);
  const [compressedResult, setCompressedResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState({
    resolution: 'original', 
    format: 'image/jpeg',   
    quality: 0.9,           
  });

  const RESOLUTIONS = {
    'original': { label: '原始尺寸', sub: 'Original', icon: Maximize2 },
    '4k': { label: '4K UHD', sub: '3840px', icon: Monitor },
    '2k': { label: '2K QHD', sub: '2560px', icon: Monitor },
    '1080': { label: '1080p', sub: '1920px', icon: Monitor },
    '720': { label: '720p', sub: '1280px', icon: Smartphone },
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('请上传图片文件 (JPG, PNG, WebP 等)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalFile({
          file,
          width: img.width,
          height: img.height,
          size: file.size,
          name: file.name
        });
        setPreviewOriginal(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const processImage = useCallback(async () => {
    if (!originalFile || !previewOriginal) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 50));

    const img = new Image();
    img.src = previewOriginal;
    
    await new Promise(resolve => { img.onload = resolve; });

    const canvas = document.createElement('canvas');
    let { width, height } = img;

    const targetLongEdge = RESOLUTIONS[settings.resolution].value || (settings.resolution !== 'original' ? parseInt(RESOLUTIONS[settings.resolution].sub) : 0);
    
    const targetSizes = {
        '720': 1280,
        '1080': 1920,
        '2k': 2560,
        '4k': 3840
    };
    const targetSize = targetSizes[settings.resolution] || 0;

    if (targetSize > 0) {
      const ratio = width / height;
      if (width > height) {
        if (width > targetSize) {
          width = targetSize;
          height = width / ratio;
        }
      } else {
        if (height > targetSize) {
          height = targetSize;
          width = height * ratio;
        }
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    if (settings.format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    const dataUrl = canvas.toDataURL(settings.format, settings.quality);
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    setCompressedResult({
      url: dataUrl,
      size: blob.size,
      width: Math.round(width),
      height: Math.round(height),
      blob: blob
    });

    setIsProcessing(false);
  }, [originalFile, previewOriginal, settings]);

  useEffect(() => {
    processImage();
  }, [processImage]);

  const handleDownload = () => {
    if (!compressedResult) return;
    
    const link = document.createElement('a');
    link.href = compressedResult.url;
    const originalName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
    const ext = settings.format === 'image/jpeg' ? 'jpg' : 'png';
    link.download = `${originalName}_optimized.${ext}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e);
  };

  const getCompressionRatio = () => {
    if (!originalFile || !compressedResult) return 0;
    const ratio = ((originalFile.size - compressedResult.size) / originalFile.size) * 100;
    return ratio.toFixed(1);
  };

  return (
    <div className="flex absolute inset-0 bg-slate-50 text-slate-600 font-sans overflow-hidden selection:bg-violet-500/30 selection:text-violet-900">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{animationDuration: '10s'}}></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-violet-400/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{animationDuration: '15s'}}></div>
      </div>

      {/* LEFT SIDEBAR - Polished & Colorful */}
      <aside className="w-80 md:w-96 bg-white/80 backdrop-blur-xl border-r border-white/40 flex flex-col shadow-[20px_0_40px_-10px_rgba(0,0,0,0.05)] z-20 relative">
        
        {/* Header */}
        <div className="h-20 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
               <div className="relative bg-gradient-to-br from-blue-600 to-violet-600 p-2 rounded-xl shadow-inner text-white">
                  <Zap size={20} fill="currentColor" />
               </div>
            </div>
            <div>
               <h1 className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">PixelPress</h1>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ready</span>
               </div>
            </div>
          </div>
        </div>

        {/* Scrollable Settings */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* File Info Card */}
          {originalFile ? (
            <div className="bg-white rounded-2xl p-4 shadow-lg shadow-blue-900/5 ring-1 ring-slate-100 relative group overflow-hidden">
                {/* Decorative background blob */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-100 to-violet-100 rounded-full blur-2xl opacity-60"></div>

                <button 
                  onClick={() => { setOriginalFile(null); setCompressedResult(null); }}
                  className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-4 relative z-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-inner ring-1 ring-slate-100 flex items-center justify-center shrink-0">
                    <FileImage className="text-blue-500 w-7 h-7 drop-shadow-sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-700 text-sm truncate" title={originalFile.name}>{originalFile.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">{originalFile.width}×{originalFile.height}</span>
                        <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{formatSize(originalFile.size)}</span>
                    </div>
                  </div>
                </div>
            </div>
          ) : (
             <div className="text-center py-8 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                   <Upload size={18} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 font-medium">请先导入图片</p>
             </div>
          )}

          {originalFile && (
            <>
              {/* Size Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="bg-blue-100 p-1 rounded-md text-blue-600">
                      <LayoutTemplate size={14} /> 
                   </div>
                   <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">调整尺寸</label>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                   {Object.entries(RESOLUTIONS).map(([key, config]) => {
                     const isSelected = settings.resolution === key;
                     return (
                       <button 
                         key={key}
                         onClick={() => setSettings({...settings, resolution: key})}
                         className={`
                           relative w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 group
                           ${isSelected 
                             ? 'bg-gradient-to-r from-blue-600 to-violet-600 border-transparent text-white shadow-md shadow-blue-500/30' 
                             : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm'
                           }
                         `}
                       >
                         <div className="flex items-center justify-between z-10 relative">
                            <div className="flex items-center gap-2">
                                <config.icon size={16} className={isSelected ? 'text-blue-100' : 'text-slate-400 group-hover:text-blue-500'} />
                                <div>
                                    <span className="block text-xs font-bold">{config.label}</span>
                                    <span className={`text-[9px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{config.sub}</span>
                                </div>
                            </div>
                            {isSelected && <div className="absolute top-0 right-0 w-4 h-4 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm"><Check size={10} strokeWidth={3} /></div>}
                         </div>
                       </button>
                     )
                   })}
                </div>
              </div>

              {/* Format & Quality */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="bg-violet-100 p-1 rounded-md text-violet-600">
                      <Sliders size={14} /> 
                   </div>
                   <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">格式与质量</label>
                </div>
                
                <div className="bg-slate-100/80 p-1.5 rounded-xl flex border border-slate-200">
                  {['image/jpeg', 'image/png'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSettings({...settings, format: fmt})}
                      className={`
                        flex-1 py-2 text-xs font-bold rounded-lg transition-all relative overflow-hidden
                        ${settings.format === fmt 
                           ? 'bg-white text-violet-700 shadow-sm ring-1 ring-black/5' 
                           : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }
                      `}
                    >
                      {settings.format === fmt && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"></div>}
                      {fmt === 'image/jpeg' ? 'JPEG' : 'PNG'}
                    </button>
                  ))}
                </div>

                {settings.format === 'image/jpeg' && (
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                       <Sparkles className="text-violet-500" size={40} />
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-500">压缩强度</span>
                      <span className="text-xs font-bold text-white bg-violet-500 px-2 py-0.5 rounded-full shadow-sm shadow-violet-200">
                        {Math.round(settings.quality * 100)}%
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.05" 
                      value={settings.quality} 
                      onChange={(e) => setSettings({...settings, quality: parseFloat(e.target.value)})}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600 hover:accent-violet-500"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                        <span>更小体积</span>
                        <span>更高画质</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/50 bg-white/50 shrink-0 backdrop-blur-sm">
          <button 
             onClick={handleDownload}
             disabled={!compressedResult || isProcessing}
             className="
                group w-full py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-violet-600 
                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 text-white 
                rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 
                shadow-lg shadow-slate-200 disabled:shadow-none active:scale-[0.98]
             "
          >
             {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
             <span>{isProcessing ? '正在处理...' : '导出图片'}</span>
             {!isProcessing && <ChevronRight size={16} className="opacity-60 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN - Preview */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none z-0" 
             style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
        </div>

        {!originalFile ? (
          // Empty State
          <div 
             className="flex-1 flex flex-col items-center justify-center p-8 z-10"
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
          >
             <div 
                onClick={() => document.getElementById('fileInput').click()}
                className={`
                  group cursor-pointer relative bg-white/60 backdrop-blur-md border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-500 max-w-xl w-full
                  ${isDragging 
                     ? 'border-blue-500 bg-blue-50/50 scale-105 shadow-2xl shadow-blue-200/50' 
                     : 'border-slate-300 hover:border-blue-400 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1'
                  }
                `}
             >
                <input type="file" id="fileInput" className="hidden" accept="image/*" onChange={handleFileChange} />
                
                {/* Floating Icons Animation */}
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
                    <div className="absolute top-10 left-10 text-blue-300 animate-bounce" style={{animationDelay: '0.1s'}}><ImageIcon size={24} /></div>
                    <div className="absolute bottom-10 right-10 text-violet-300 animate-bounce" style={{animationDelay: '0.3s'}}><Zap size={24} /></div>
                </div>

                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white shadow-sm">
                   <Upload size={32} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">上传图片</h3>
                <p className="text-slate-500 text-base font-medium">拖拽文件到这里，或者点击浏览</p>
                <div className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 rounded-full text-sm font-bold text-white shadow-lg shadow-slate-200 group-hover:bg-blue-600 group-hover:shadow-blue-200 transition-all">
                   <MousePointerClick size={16} /> 选择文件
                </div>
             </div>
          </div>
        ) : (
          // Preview Canvas
          <div className="flex-1 relative flex flex-col z-10">
             
             {/* Top Info Bar - Floating Island Style */}
             <div className="absolute top-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <div className="bg-white/80 backdrop-blur-md border border-white/60 shadow-xl shadow-slate-200/40 rounded-full px-6 py-2.5 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                   {compressedResult ? (
                     <>
                        <div className="flex flex-col items-center px-2">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">原始大小</span>
                           <span className="font-mono font-bold text-slate-600">{formatSize(originalFile.size)}</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className="flex flex-col items-center px-2">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">压缩后</span>
                           <span className="font-mono font-bold text-slate-800">{formatSize(compressedResult.size)}</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${getCompressionRatio() > 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                           <span className="text-sm font-bold">{getCompressionRatio() > 0 ? `-${getCompressionRatio()}%` : '+0%'}</span>
                        </div>
                     </>
                   ) : (
                      <span className="text-xs font-bold text-slate-400 animate-pulse">正在准备预览...</span>
                   )}
                </div>
             </div>

             {/* Canvas */}
             <div className="flex-1 overflow-auto p-12 pb-24 flex items-center justify-center custom-scrollbar">
                <div className="relative shadow-2xl shadow-blue-900/10 rounded-xl bg-white p-2 ring-1 ring-white/60 backdrop-blur-sm transition-all duration-300 group">
                   
                   <div className="relative rounded-lg overflow-hidden bg-slate-50">
                       {/* Checkerboard */}
                       <div className="absolute inset-0 z-0 opacity-100" 
                            style={{
                                backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)', 
                                backgroundSize: '20px 20px',
                            }}>
                       </div>

                       {/* Image */}
                       {compressedResult ? (
                          <img 
                            src={compressedResult.url} 
                            alt="Preview" 
                            className={`relative z-10 max-h-[calc(100vh-200px)] max-w-full object-contain transition-all duration-300 ${isProcessing ? 'blur-sm scale-[0.99] opacity-80' : 'scale-100 opacity-100'}`} 
                          />
                       ) : (
                          <div className="w-[400px] h-[300px] flex items-center justify-center relative z-10">
                             <RefreshCw className="animate-spin text-slate-300" size={32} />
                          </div>
                       )}
                   </div>

                   {/* Processing Overlay */}
                   {isProcessing && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/30 backdrop-blur-[2px] rounded-xl">
                          <div className="bg-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-3 animate-bounce">
                             <RefreshCw size={18} className="animate-spin text-blue-600" />
                             <span className="text-sm font-bold text-slate-700">优化中...</span>
                          </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </main>

    </div>
  );
}