import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Layout, Grid, X, Trash2, GripHorizontal, Type, Settings, Layers, MousePointer2, Image as ImageIcon, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Move } from 'lucide-react';

const PhotoStitching = () => {
  // --- 状态管理 ---
  const [images, setImages] = useState([]);
  const [layoutMode, setLayoutMode] = useState('vertical'); // vertical, horizontal, grid
  
  // 样式状态
  const [gap, setGap] = useState(10); 
  const [padding, setPadding] = useState(20); // 默认边距
  const [bgColor, setBgColor] = useState('#ffffff'); 
  const [isExporting, setIsExporting] = useState(false);
  
  // 全局字体设置
  const [fontFamily, setFontFamily] = useState('sans'); 
  const [fontSizeScale, setFontSizeScale] = useState(1); 
  
  // 图片配置
  const [imgConfigs, setImgConfigs] = useState({});

  // 拖拽状态
  const [dragState, setDragState] = useState({ 
    type: null, 
    activeId: null, 
    startY: 0,
    startVal: 0 
  });

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);

  // --- 全局事件监听 (处理拖拽释放) ---
  useEffect(() => {
    const handleMouseUp = () => {
      if (dragState.type) {
        setDragState({ type: null, activeId: null, startY: 0, startVal: 0 });
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    const handleMouseMove = (e) => {
      if (!dragState.type || !dragState.activeId) return;
      
      const config = imgConfigs[dragState.activeId];
      if (!config) return;

      const cellElement = document.getElementById(`cell-${dragState.activeId}`);
      if (!cellElement) return;
      const rect = cellElement.getBoundingClientRect();
      const width = rect.width;

      if (dragState.type === 'move-img') {
        const deltaY = e.clientY - dragState.startY;
        const deltaRatio = deltaY / width;
        setImgConfigs(prev => ({
          ...prev,
          [dragState.activeId]: {
            ...prev[dragState.activeId],
            offsetY: dragState.startVal + deltaRatio
          }
        }));

      } else if (dragState.type === 'resize-height') {
        const deltaY = e.clientY - dragState.startY;
        const deltaRatio = deltaY / width;
        const newHeightRatio = Math.max(0.1, dragState.startVal + deltaRatio);
        
        setImgConfigs(prev => ({
          ...prev,
          [dragState.activeId]: {
            ...prev[dragState.activeId],
            heightRatio: newHeightRatio
          }
        }));
      }
    };

    if (dragState.type) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, imgConfigs]);


  // --- 业务逻辑 ---

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    const newConfigs = { ...imgConfigs };

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          newImages.push({ id, src: event.target.result, width: img.width, height: img.height });
          
          const defaultHeightRatio = 0.5625; // 16:9
          
          newConfigs[id] = {
            offsetY: 0, 
            heightRatio: layoutMode === 'grid' ? 1 : defaultHeightRatio,
            subtitleCn: '',
            subtitleEn: ''
          };

          if (newImages.length === files.length) {
            setImages(prev => [...prev, ...newImages]);
            setImgConfigs(prev => ({ ...prev, ...newConfigs }));
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
    const newConfigs = { ...imgConfigs };
    delete newConfigs[id];
    setImgConfigs(newConfigs);
  };

  // 排序逻辑
  const moveImageOrder = (index, direction) => {
    const newImages = [...images];
    if (direction === 'prev' && index > 0) {
      // 交换当前和前一个
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'next' && index < newImages.length - 1) {
      // 交换当前和后一个
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    setImages(newImages);
  };

  const updateConfig = (id, key, value) => {
    setImgConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: value }
    }));
  };

  // --- 交互处理器 ---

  const startDragImage = (e, id) => {
    if (['INPUT', 'BUTTON', 'SELECT'].includes(e.target.tagName)) return;
    e.preventDefault();
    setDragState({
      type: 'move-img',
      activeId: id,
      startY: e.clientY,
      startVal: imgConfigs[id].offsetY
    });
    document.body.style.cursor = 'move';
  };

  const startResizeHeight = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setDragState({
      type: 'resize-height',
      activeId: id,
      startY: e.clientY,
      startVal: imgConfigs[id].heightRatio
    });
    document.body.style.cursor = 'row-resize';
  };

  // --- 字体样式映射 ---
  const getFontFamily = (type) => {
    switch(type) {
      case 'serif': return '"Songti SC", "Noto Serif SC", serif';
      case 'mono': return '"Courier New", monospace';
      case 'kai': return '"KaiTi", "STKaiti", serif';
      case 'sans': default: return '"Noto Sans SC", "PingFang SC", sans-serif';
    }
  };

  // --- 导出逻辑 ---
  const handleExport = async () => {
    if (images.length === 0) return;
    setIsExporting(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 关键修正：计算导出比例因子
    // 预览区域的实际宽度 (假设如果还未渲染则默认为 500)
    const previewWidth = previewRef.current ? previewRef.current.offsetWidth : 500;
    // 导出基准宽度
    const BASE_WIDTH = 1500; 
    // 缩放比例：导出宽度 / 预览宽度
    // 这样，预览里看着是 10px 的边距，导出时就会自动放大成 30px，视觉比例保持一致
    const scaleFactor = BASE_WIDTH / previewWidth;

    // 应用缩放后的边距和间距
    const exportPadding = padding * scaleFactor;
    const exportGap = gap * scaleFactor;

    let totalHeight = 0;
    let items = [];

    // 预计算布局
    if (layoutMode === 'vertical') {
      const contentWidth = BASE_WIDTH - (exportPadding * 2);
      let currentY = exportPadding;
      items = images.map(img => {
        const config = imgConfigs[img.id];
        const h = contentWidth * config.heightRatio;
        const item = { imgObj: img, x: exportPadding, y: currentY, w: contentWidth, h: h, config };
        currentY += h + exportGap;
        return item;
      });
      totalHeight = currentY - exportGap + exportPadding;
    } 
    else if (layoutMode === 'grid') {
      const cols = 2;
      const contentWidth = (BASE_WIDTH - (exportPadding * 2) - exportGap) / cols;
      const cellHeight = contentWidth; 
      const rows = Math.ceil(images.length / cols);
      items = images.map((img, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        return {
          imgObj: img,
          x: exportPadding + col * (contentWidth + exportGap),
          y: exportPadding + row * (cellHeight + exportGap),
          w: contentWidth, h: cellHeight, config: imgConfigs[img.id]
        };
      });
      totalHeight = exportPadding * 2 + rows * cellHeight + (rows - 1) * exportGap;
    }
    else {
        // Horizontal
        const BASE_HEIGHT = 1000;
        const contentHeight = BASE_HEIGHT - exportPadding*2;
        let currentX = exportPadding;
        items = images.map(img => {
            const config = imgConfigs[img.id];
            const w = contentHeight / (img.height / img.width);
            const item = { imgObj: img, x: currentX, y: exportPadding, w: w, h: contentHeight, config };
            currentX += w + exportGap;
            return item;
        })
        canvas.width = currentX - exportGap + exportPadding;
        totalHeight = BASE_HEIGHT;
    }

    if (layoutMode !== 'horizontal') canvas.width = BASE_WIDTH;
    canvas.height = totalHeight;

    // 绘制背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制图片和字幕
    for (let item of items) {
      await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = item.imgObj.src;
        img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.rect(item.x, item.y, item.w, item.h);
            ctx.clip();

            const scale = item.w / img.width;
            const drawImgH = img.height * scale;
            const drawImgW = item.w;
            const offsetYPx = item.config.offsetY * item.w;

            ctx.drawImage(img, item.x, item.y + offsetYPx, drawImgW, drawImgH);

            // 字幕绘制
            const { subtitleCn, subtitleEn } = item.config;
            if (subtitleCn || subtitleEn) {
                const baseSize = (layoutMode === 'grid' ? item.h * 0.08 : item.w * 0.05) * fontSizeScale;
                const fontStack = getFontFamily(fontFamily).replace(/"/g, ''); 
                
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#000000';
                ctx.lineJoin = 'round';
                
                const centerX = item.x + item.w / 2;
                // 底部基线
                let bottomY = item.y + item.h - (item.h * 0.03); 

                if (subtitleEn) {
                    const enSize = baseSize * 0.6;
                    ctx.font = `bold ${enSize}px ${fontStack}`;
                    ctx.lineWidth = enSize * 0.15; 
                    ctx.strokeText(subtitleEn, centerX, bottomY);
                    ctx.fillText(subtitleEn, centerX, bottomY);
                    bottomY -= enSize * 1.2;
                }

                if (subtitleCn) {
                    ctx.font = `bold ${baseSize}px ${fontStack}`;
                    ctx.lineWidth = baseSize * 0.12; 
                    ctx.strokeText(subtitleCn, centerX, bottomY);
                    ctx.fillText(subtitleCn, centerX, bottomY);
                }
            }
            ctx.restore();
            resolve();
        };
      });
    }

    const link = document.createElement('a');
    link.download = `stitch-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setIsExporting(false);
  };

  // --- 样式辅助 ---
  const cardClass = "bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100";
  const btnClass = "transform transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg hover:-translate-y-0.5";

  return (
    <div className="flex flex-col h-screen md:flex-row bg-[#f3f4f6] text-gray-800 font-sans selection:bg-indigo-100 overflow-hidden">
      
      {/* --- 左侧立体感控制台 --- */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-indigo-200 shadow-lg">
                <Layout size={20} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">光影拼图</h1>
                <p className="text-xs text-gray-500 font-medium">极简 · 立体 · 拼接</p>
             </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* 上传区域 */}
          <div className={`${cardClass} p-1`}>
            <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
            <button 
              onClick={() => fileInputRef.current.click()}
              className={`w-full py-4 bg-gradient-to-br from-indigo-50 to-white hover:from-indigo-100 hover:to-indigo-50 rounded-lg border-2 border-dashed border-indigo-200 flex items-center justify-center gap-2 group transition-all`}
            >
              <div className="bg-indigo-100 p-2 rounded-full group-hover:bg-indigo-200 transition-colors">
                 <Upload size={18} className="text-indigo-600" />
              </div>
              <span className="text-sm font-bold text-indigo-900">上传图片</span>
            </button>
          </div>

          {/* 模式选择 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
              <Layers size={14} /> 拼接模式
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'vertical', label: '纵向' },
                { id: 'horizontal', label: '横向' },
                { id: 'grid', label: '四宫格' },
              ].map(mode => (
                <button 
                  key={mode.id}
                  onClick={() => setLayoutMode(mode.id)}
                  className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    layoutMode === mode.id 
                      ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-md transform -translate-y-0.5' 
                      : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* 字幕设置 */}
          <div className={`${cardClass} p-4 space-y-4`}>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
              <Type size={14} /> 字幕设置
            </div>
            
            <div className="space-y-3">
               {/* 字体选择 */}
               <div className="relative">
                 <select 
                   value={fontFamily} 
                   onChange={(e) => setFontFamily(e.target.value)}
                   className="w-full bg-gray-50 text-gray-700 text-sm p-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none appearance-none font-medium"
                 >
                   <option value="sans">黑体 (默认)</option>
                   <option value="serif">宋体 (电影感)</option>
                   <option value="kai">楷体 (文艺)</option>
                   <option value="mono">等宽 (代码风)</option>
                 </select>
                 <div className="absolute right-3 top-3 pointer-events-none text-gray-400">▼</div>
               </div>
               
               {/* 字体大小 */}
               <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>字体大小</span>
                    <span>{fontSizeScale.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="2.0" step="0.1"
                    value={fontSizeScale}
                    onChange={(e) => setFontSizeScale(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
               </div>
            </div>
          </div>

          {/* 参数调整 */}
          <div className={`${cardClass} p-4 space-y-4`}>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
              <Settings size={14} /> 参数调整
            </div>

             {/* 间距 */}
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>图片间距</span>
                  <span>{gap}px</span>
               </div>
               <input 
                  type="range" min="0" max="50" value={gap} 
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
             </div>
             
             {/* 外边距 */}
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>画布边距</span>
                  <span>{padding}px</span>
               </div>
               <input 
                  type="range" min="0" max="100" value={padding} 
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
             </div>

             {/* 背景颜色 */}
             <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>背景颜色</span>
                  <span className="uppercase font-mono text-gray-400">{bgColor}</span>
               </div>
               <div className="flex gap-2 items-center">
                  {['#ffffff', '#000000', '#f3f4f6', '#1e1b4b'].map(c => (
                    <button 
                        key={c}
                        onClick={() => setBgColor(c)}
                        className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${bgColor === c ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-transparent'}`}
                        style={{backgroundColor: c}}
                    />
                  ))}
                  <div className="relative ml-auto">
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer shadow-sm ring-1 ring-gray-200"
                    />
                  </div>
               </div>
             </div>
          </div>

          <div className="pt-2 mt-auto">
             <button 
              onClick={handleExport}
              disabled={images.length === 0 || isExporting}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 ${btnClass} ${
                images.length === 0 
                ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed' 
                : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
              }`}
            >
              {isExporting ? '生成中...' : <><Download size={18} /> 导出图片</>}
            </button>
          </div>
        </div>
      </div>

      {/* --- 右侧工作区 --- */}
      <div className="flex-1 bg-[#f8fafc] relative overflow-hidden flex flex-col">
        {/* 背景装饰点阵 */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{
               backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)',
               backgroundSize: '24px 24px'
             }}>
        </div>

        {/* 顶部提示栏 */}
        <div className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
           <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded text-gray-600"><MousePointer2 size={12} /> 拖动图片调整位置</span>
              <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded text-gray-600"><GripHorizontal size={12} /> 拖动底部调整高度</span>
           </div>
           <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
             已加载 {images.length} 张图片
           </div>
        </div>
        
        {/* 预览区域 */}
        <div className="flex-1 overflow-auto p-10 flex items-start justify-center relative z-10 custom-scrollbar" id="preview-area">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full select-none animate-in fade-in zoom-in duration-500">
              <div className="w-40 h-40 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 rotate-3 transform transition-transform hover:rotate-6">
                  <ImageIcon size={48} className="text-indigo-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">开始创作您的拼图</h3>
              <p className="text-sm text-gray-400">请从左侧上传图片</p>
            </div>
          ) : (
            <div 
              ref={previewRef}
              className="transition-all duration-300 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] select-none ring-1 ring-black/5 rounded-sm"
              style={{
                backgroundColor: bgColor, 
                padding: `${padding}px`,
                display: layoutMode === 'horizontal' ? 'flex' : (layoutMode === 'grid' ? 'grid' : 'flex'),
                flexDirection: layoutMode === 'vertical' ? 'column' : 'row',
                gridTemplateColumns: layoutMode === 'grid' ? 'repeat(2, 1fr)' : 'none',
                gap: `${gap}px`,
                width: layoutMode === 'horizontal' ? 'auto' : '100%',
                maxWidth: layoutMode === 'horizontal' ? 'none' : '520px', 
              }}
            >
              {images.map((img, idx) => {
                 const config = imgConfigs[img.id] || { offsetY: 0, heightRatio: 0.5625, subtitleCn: '', subtitleEn: '' };
                 
                 const cellStyle = {
                   position: 'relative',
                   overflow: 'hidden',
                   backgroundColor: '#e2e8f0', 
                   paddingBottom: layoutMode === 'horizontal' 
                      ? '0' 
                      : (layoutMode === 'grid' ? '100%' : `${config.heightRatio * 100}%`),
                   height: layoutMode === 'horizontal' ? '300px' : 'auto',
                   width: layoutMode === 'horizontal' ? `${300 / (img.height/img.width)}px` : '100%',
                 };

                 const fontStack = getFontFamily(fontFamily);

                 return (
                  <div 
                    key={img.id}
                    id={`cell-${img.id}`}
                    className="group relative hover:ring-4 hover:ring-indigo-400/30 transition-shadow duration-200"
                    style={cellStyle}
                    onMouseDown={(e) => startDragImage(e, img.id)}
                  >
                     {/* 图像层 */}
                     <img 
                        src={img.src}
                        alt=""
                        className="absolute left-0 w-full pointer-events-none select-none will-change-transform"
                        style={{
                          top: layoutMode === 'vertical' || layoutMode === 'grid' ? `${config.offsetY * 100}%` : '0',
                          height: layoutMode === 'vertical' || layoutMode === 'grid' ? 'auto' : '100%',
                          width: layoutMode === 'horizontal' ? 'auto' : '100%',
                          maxWidth: 'none'
                        }}
                     />

                     {/* 交互层：完全分离上下结构 */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 flex flex-col justify-between p-2 bg-black/10 pointer-events-none">
                        
                        {/* 顶部工具栏 (Pointer Events Auto) */}
                        <div className="flex justify-between items-start pointer-events-auto">
                            {/* 排序区 */}
                            <div className="flex gap-1 bg-white/90 backdrop-blur rounded-lg shadow-sm p-1 border border-white/50">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveImageOrder(idx, 'prev'); }}
                                  disabled={idx === 0}
                                  className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded disabled:opacity-30 transition-colors"
                                  title="前移"
                                >
                                  {layoutMode === 'horizontal' ? <ArrowLeft size={14} /> : <ArrowUp size={14} />}
                                </button>
                                <div className="w-[1px] bg-gray-200 my-0.5"></div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveImageOrder(idx, 'next'); }}
                                  disabled={idx === images.length - 1}
                                  className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded disabled:opacity-30 transition-colors"
                                  title="后移"
                                >
                                  {layoutMode === 'horizontal' ? <ArrowRight size={14} /> : <ArrowDown size={14} />}
                                </button>
                            </div>

                            {/* 删除按钮 */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                className="p-2 bg-white/90 backdrop-blur text-red-500 rounded-lg shadow-sm border border-white/50 hover:bg-red-50 transition-colors"
                                title="删除图片"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* 底部字幕输入区 (Pointer Events Auto) */}
                        <div className="space-y-1.5 pointer-events-auto mt-auto pt-4 bg-gradient-to-t from-black/50 to-transparent p-2 -mx-2 -mb-2">
                           <input 
                              type="text" 
                              value={config.subtitleCn}
                              onChange={(e) => updateConfig(img.id, 'subtitleCn', e.target.value)}
                              placeholder="输入中文字幕"
                              className="w-full bg-white/95 backdrop-blur text-gray-800 text-xs px-2 py-1.5 rounded shadow-sm border border-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-center font-bold placeholder-gray-400"
                              onMouseDown={(e) => e.stopPropagation()} 
                           />
                           <input 
                              type="text" 
                              value={config.subtitleEn}
                              onChange={(e) => updateConfig(img.id, 'subtitleEn', e.target.value)}
                              placeholder="Enter English Subtitle"
                              className="w-full bg-white/95 backdrop-blur text-gray-600 text-xs px-2 py-1.5 rounded shadow-sm border border-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-center font-medium placeholder-gray-400"
                              onMouseDown={(e) => e.stopPropagation()} 
                           />
                        </div>
                     </div>

                     {/* 渲染层 (始终显示) */}
                     {(config.subtitleCn || config.subtitleEn) && (
                        <div className="absolute bottom-[4%] left-0 right-0 text-center pointer-events-none z-10 px-4 flex flex-col items-center drop-shadow-md">
                          {/* 英文 - 下方小字 */}
                          {config.subtitleCn && (
                             <span 
                               className="font-bold tracking-wide block"
                               style={{
                                 fontFamily: fontStack,
                                 fontSize: layoutMode === 'grid' ? '12px' : `clamp(14px, ${1.5 * fontSizeScale}vw, 24px)`,
                                 color: '#fff',
                                 textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                 marginBottom: config.subtitleEn ? '0px' : '0'
                               }}
                             >
                               {config.subtitleCn}
                             </span>
                          )}
                          {/* 中文 - 上方大字 */}
                          {config.subtitleEn && (
                             <span 
                               className="font-medium tracking-wide block opacity-95"
                               style={{
                                 fontFamily: fontStack,
                                 fontSize: layoutMode === 'grid' ? '8px' : `clamp(10px, ${0.9 * fontSizeScale}vw, 16px)`,
                                 color: '#f0f0f0',
                                 textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                               }}
                             >
                               {config.subtitleEn}
                             </span>
                          )}
                        </div>
                     )}

                     {/* 高度调整手柄 */}
                     {layoutMode === 'vertical' && (
                       <div 
                          className="absolute bottom-0 left-0 right-0 h-4 cursor-row-resize z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onMouseDown={(e) => startResizeHeight(e, img.id)}
                       >
                          <div className="w-12 h-1.5 bg-white/80 rounded-full shadow-lg backdrop-blur hover:bg-white hover:scale-110 transition-all"></div>
                       </div>
                     )}
                  </div>
                 );
              })}
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoStitching;