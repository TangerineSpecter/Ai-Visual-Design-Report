import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  Luggage, 
  User, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  Smartphone, 
  Cloud, 
  Coffee,
  ChevronDown,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

// --- Sub-Components ---

// 1. Animation Renderer Component
const SceneAnimation = ({ sceneId, step }) => {
  // Helper for conditional classes
  const getBagPosition = () => {
    if (sceneId === 'checkin') return step >= 2 ? 'left-[35%] bottom-32 scale-75' : 'left-[55%] bottom-8';
    if (sceneId === 'arrival') return step >= 2 ? 'left-[70%]' : 'left-[-20%]';
    return '';
  };

  switch (sceneId) {
    case 'intro':
      return (
        <div className="w-full h-full relative overflow-hidden bg-sky-100 flex flex-col items-center justify-center p-8 rounded-xl">
           <div className="absolute top-10 right-10 animate-pulse text-yellow-500"><User size={32} /></div>
           <div className="relative z-10 text-center">
                <div className="bg-white p-6 rounded-full shadow-xl mb-6 inline-block">
                   <Plane size={80} className="text-blue-600 animate-bounce" />
                </div>
           </div>
           <div className="clouds absolute w-full h-full pointer-events-none">
             <Cloud className="absolute top-10 left-10 text-white opacity-60 animate-pulse w-32 h-32" />
             <Cloud className="absolute bottom-10 right-20 text-white opacity-40 w-24 h-24" />
           </div>
         </div>
      );
    case 'checkin':
      return (
        <div className="w-full h-64 md:h-full relative overflow-hidden bg-slate-100 border-b-8 border-slate-300 flex items-end justify-center pb-8 rounded-xl">
           <div className="absolute top-0 w-full h-24 bg-slate-200 border-b border-slate-300 flex justify-center pt-4">
               <div className="text-3xl font-black text-slate-300 tracking-widest uppercase">Departures</div>
           </div>
          <div className="flex flex-col items-center z-10 mr-12 md:mr-32 relative top-4 transition-transform duration-500">
             <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded mb-1 font-bold">Delta</div>
             <div className="w-32 h-40 bg-blue-500 rounded-t-xl flex items-center justify-center relative shadow-lg">
                <User className="text-white" size={48} />
                <div className="absolute bottom-0 w-full h-2 bg-blue-800"></div>
             </div>
          </div>
          <div className={`absolute transition-all duration-1000 ease-in-out z-20 ${getBagPosition()}`}>
             <Luggage size={64} className="text-rose-500 drop-shadow-xl" />
          </div>
          <div className="flex flex-col items-center z-10 relative top-4 ml-8 transition-transform duration-500">
            <User size={64} className="text-gray-700" />
          </div>
        </div>
      );
    case 'security':
      return (
        <div className="w-full h-64 md:h-full relative overflow-hidden bg-gray-50 flex flex-col justify-center items-center rounded-xl">
          <div className="relative w-40 h-56 border-8 border-gray-400 rounded-xl flex items-center justify-center bg-gray-200/50 z-10 mb-8 shadow-2xl">
              <div className="absolute top-0 w-full h-2 bg-red-500 animate-ping opacity-20"></div>
              <ShieldCheck size={40} className="text-gray-400" />
          </div>
          <div className="absolute bottom-12 w-full h-6 bg-gray-800 flex items-center overflow-hidden border-t-2 border-gray-600">
              <div className={`flex gap-16 transition-transform duration-1000 pl-10 ${step >= 1 ? '-translate-x-60' : 'translate-x-0'}`}>
                  <div className="w-16 h-10 bg-gray-300 rounded flex items-center justify-center text-lg shadow-md border-b-4 border-gray-400">💻</div>
                  <div className="w-16 h-10 bg-gray-300 rounded flex items-center justify-center text-lg shadow-md border-b-4 border-gray-400">🧴</div>
                  <div className="w-16 h-10 bg-gray-300 rounded flex items-center justify-center text-lg shadow-md border-b-4 border-gray-400">👞</div>
              </div>
          </div>
           <div className={`absolute bottom-20 transition-all duration-1000 z-20 ${step >= 3 ? 'left-[65%] opacity-100' : 'left-[25%] opacity-100'}`}>
             <User size={64} className={step >= 3 ? "text-green-600" : "text-gray-700"} />
             {step >= 3 && <CheckCircle className="absolute -top-4 -right-4 text-green-500 bg-white rounded-full animate-bounce" size={20} />}
          </div>
        </div>
      );
    case 'boarding':
      return (
        <div className="w-full h-64 md:h-full relative bg-slate-50 flex flex-col items-center justify-center p-4 rounded-xl">
           <div className="bg-zinc-900 text-yellow-400 font-mono p-6 rounded-xl mb-4 text-center w-full max-w-xs shadow-2xl border-4 border-zinc-700">
              <div className="flex justify-between items-baseline mb-4">
                  <span className="text-lg">DL 237</span>
                  <span className="text-lg">NYC</span>
              </div>
              <div className="bg-zinc-800 p-2 rounded-lg">
                  <div className="text-[10px] text-gray-400 mb-1">GATE</div>
                  <div className={`text-5xl font-bold transition-all duration-500 ${step >= 1 ? 'text-red-500 animate-pulse' : ''}`}>
                      {step >= 1 ? 'C10' : 'C7'}
                  </div>
              </div>
              <div className="text-xs uppercase mt-4 tracking-wider bg-red-900/30 text-red-400 py-1 rounded">
                  {step >= 2 ? 'BOARDING NOW' : 'GATE CHANGED'}
              </div>
           </div>
           <div className={`transition-all duration-700 absolute bottom-6 right-10 ${step >= 3 ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-20 rotate-12'}`}>
              <div className="flex flex-col items-center bg-white p-2 rounded-xl shadow-xl border-2 border-gray-100 w-24">
                  <div className="w-full bg-blue-500 h-24 rounded-lg mb-1 flex flex-col items-center justify-center p-1">
                      <div className="w-12 h-12 bg-white p-1">
                          <div className="w-full h-full bg-black"></div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      );
    case 'inflight':
      return (
        <div className="w-full h-64 md:h-full relative overflow-hidden bg-sky-200 shadow-inner flex items-center justify-center rounded-xl">
           <div className="absolute inset-0 bg-white pointer-events-none z-10" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 15% 15%, 85% 15%, 85% 85%, 15% 85%, 15% 15%)'}}></div>
           <div className="absolute inset-0 flex items-center justify-center bg-sky-400 z-0 overflow-hidden">
              <Cloud size={100} className="text-white/80 absolute top-4 left-4 animate-pulse" style={{ animationDuration: '4s' }} />
              <Cloud size={60} className="text-white/60 absolute bottom-10 right-10" />
           </div>
           <div className="absolute top-4 right-[20%] z-30 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 flex gap-2 shadow-md">
              <div className={`w-3 h-3 rounded-full ${step < 2 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]'}`}></div>
              <span className="text-[10px] font-bold text-gray-500 tracking-wider">SEATBELT</span>
           </div>
           {step >= 2 && (
               <div className="absolute z-30 bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-2xl border border-white/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-10">
                  <div className="bg-orange-100 p-2 rounded-full"><Coffee className="text-orange-600" size={20} /></div>
                  <div><div className="font-bold text-gray-800 text-sm">Service</div></div>
               </div>
           )}
        </div>
      );
    case 'arrival':
      return (
        <div className="w-full h-64 md:h-full bg-zinc-100 relative flex flex-col items-center justify-end overflow-hidden pb-8 rounded-xl">
           <div className="absolute top-0 w-full bg-zinc-800 p-2 text-center z-10 shadow-lg rounded-t-xl">
               <div className="text-2xl font-bold text-green-500 tracking-widest uppercase">Arrivals</div>
           </div>
           <div className="w-full h-24 bg-zinc-800 relative overflow-hidden flex items-center border-y-8 border-zinc-600 shadow-2xl transform -skew-x-12 scale-110">
              <div className="absolute w-[200%] h-full flex items-center opacity-30">
                 {[...Array(20)].map((_, i) => (
                     <div key={i} className="w-32 h-full border-r border-zinc-500 bg-zinc-700"></div>
                 ))}
              </div>
              <div className={`absolute top-2 transition-all duration-[3000ms] linear ${getBagPosition()} filter drop-shadow-2xl`}>
                  <Luggage size={64} className="text-rose-500 rotate-12" />
              </div>
           </div>
           <div className="absolute bottom-2 left-6 font-mono text-zinc-400 text-xs">
              CAROUSEL 04 <br/> JFK
           </div>
        </div>
      );
    default:
      return null;
  }
};

// 2. Individual Scene Card Component
const SceneCard = ({ scene, index }) => {
  // Use a local state to track "progress" within this specific scene's dialogues
  const [localStep, setLocalStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  // Auto-play logic for individual card
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setLocalStep(prev => {
          if (scene.dialogues && prev < scene.dialogues.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500); // Change dialogue every 2.5 seconds
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, scene.dialogues]);

  const togglePlay = () => {
    if (localStep >= (scene.dialogues?.length || 0) - 1 && !isPlaying) {
        setLocalStep(0); // Restart if at end
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
      setIsPlaying(false);
      setLocalStep(0);
  }

  // Handle manual click on a dialogue line
  const handleLineClick = (idx) => {
      setLocalStep(idx);
      setIsPlaying(false);
  }

  if (scene.id === 'intro') {
      return (
        <div className="mb-12 text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Plane size={48} className="text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Airport English <span className="text-blue-600">Mastery</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Scroll down to experience the complete journey from check-in to arrival.
                <br/>
                <span className="text-base text-slate-400">向下滚动，体验从值机到抵达的全流程英语。</span>
            </p>
            <div className="mt-8 animate-bounce text-slate-300">
                <ChevronDown size={32} className="mx-auto"/>
            </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-16 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all hover:shadow-2xl">
      {/* Left/Top: Visual Stage */}
      <div className="w-full lg:w-1/2 bg-slate-50 relative min-h-[300px] lg:min-h-[400px]">
          {/* Header Overlay */}
          <div className="absolute top-0 left-0 p-4 z-20 w-full flex justify-between items-start pointer-events-none">
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <MapPin size={14} className="text-blue-500" />
                        {scene.title}
                    </h2>
                </div>
          </div>
          
          {/* Animation Content */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <SceneAnimation sceneId={scene.id} step={localStep} />
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={reset}
                className="p-2 bg-white rounded-full shadow-md hover:bg-slate-50 text-slate-500"
                title="Reset Scene"
              >
                  <RotateCcw size={16} />
              </button>
              <button 
                onClick={togglePlay}
                className={`p-2 rounded-full shadow-md text-white transition-colors flex items-center gap-2 px-4 ${isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  <span className="text-xs font-bold">{isPlaying ? 'Pause' : 'Play Demo'}</span>
              </button>
          </div>
      </div>

      {/* Right/Bottom: Dialogues */}
      <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col">
         <div className="mb-6 pb-4 border-b border-slate-100">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">{index}</span>
                {scene.location}
             </h3>
             <p className="text-slate-400 text-sm mt-1 ml-10">Select a line to update the visual.</p>
         </div>

         <div className="flex-1 space-y-4">
             {scene.dialogues && scene.dialogues.map((d, idx) => (
                 <div 
                    key={idx} 
                    onClick={() => handleLineClick(idx)}
                    className={`group cursor-pointer transition-all duration-300 transform ${
                        idx === localStep 
                        ? 'opacity-100 scale-[1.02]' 
                        : 'opacity-60 hover:opacity-90 hover:scale-[1.01]'
                    }`}
                 >
                    <div className={`flex gap-3 ${d.speaker === 'You' ? 'flex-row-reverse' : 'flex-row'}`}>
                         {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border 
                            ${d.speaker === 'You' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
                            {d.speaker === 'You' ? <User size={14} /> : <span className="text-xs font-bold">{d.speaker[0]}</span>}
                        </div>

                        {/* Text Bubble */}
                        <div className={`flex-1 p-3 rounded-2xl text-sm border relative
                             ${d.speaker === 'You' 
                                ? 'bg-blue-50 border-blue-100 text-blue-900 rounded-tr-none' 
                                : 'bg-white border-slate-200 text-slate-700 rounded-tl-none'
                             } ${idx === localStep ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
                             <p className="font-medium mb-1">{d.text}</p>
                             <p className="text-xs opacity-70 border-t border-black/5 pt-1 mt-1">{d.translation}</p>
                        </div>
                    </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};

const AirportJourney = () => {
  // 场景定义 (Data)
  const scenes = [
    {
      id: 'intro',
      title: "Start",
      subtitle: "Welcome",
    },
    {
      id: 'checkin',
      title: "Check-in",
      location: "Departure Hall / 出发大厅",
      dialogues: [
        { speaker: 'You', text: "Excuse me, where is the Delta check-in counter?", translation: "打扰一下，达美航空柜台在哪？" },
        { speaker: 'Staff', text: "It's over there next to gate 5.", translation: "就在那边，5号门旁边。" },
        { speaker: 'Staff', text: "Place your bag on the scale, please.", translation: "请把您的包放在秤上。" },
        { speaker: 'You', text: "Just one suitcase. Is it overweight?", translation: "就一个箱子，超重了吗？" }
      ]
    },
    {
      id: 'security',
      title: "Security",
      location: "Security Checkpoint / 安检处",
      dialogues: [
        { speaker: 'Officer', text: "Laptop and liquids out of the bag.", translation: "把电脑和液体拿出来。" },
        { speaker: 'You', text: "Should I take off my shoes?", translation: "要脱鞋吗？" },
        { speaker: 'Officer', text: "Yes, and your belt too.", translation: "是的，皮带也要解下来。" },
        { speaker: 'System', text: "Walk through the scanner.", translation: "请通过扫描仪。" }
      ]
    },
    {
      id: 'boarding',
      title: "Boarding",
      location: "Gate C10 / 登机口",
      dialogues: [
        { speaker: 'System', text: "Gate changed to C10.", translation: "登机口变更为 C10。" },
        { speaker: 'You', text: "Better run before it changes again!", translation: "最好快跑，免得又变了！" },
        { speaker: 'Staff', text: "Boarding pass ready, please.", translation: "请准备好登机牌。" },
        { speaker: 'You', text: "It's on my phone.", translation: "在我的手机上。" }
      ]
    },
    {
      id: 'inflight',
      title: "In-flight",
      location: "Seat 18A / 机舱座位",
      dialogues: [
        { speaker: 'You', text: "Excuse me, can you help me find seat 18A?", translation: "能帮我找下18A座吗？" },
        { speaker: 'Crew', text: "Right here by the window.", translation: "就在这儿，靠窗。" },
        { speaker: 'Crew', text: "Beef or Chicken?", translation: "牛肉还是鸡肉？" },
        { speaker: 'You', text: "Chicken, please.", translation: "鸡肉，谢谢。" }
      ]
    },
    {
      id: 'arrival',
      title: "Arrival",
      location: "Baggage Claim / 行李提取",
      dialogues: [
        { speaker: 'You', text: "Finally! The flight was smooth.", translation: "终于到了！飞行很顺利。" },
        { speaker: 'You', text: "Where is the luggage belt?", translation: "行李传送带在哪？" },
        { speaker: 'You', text: "There's my suitcase!", translation: "那是我的箱子！" },
        { speaker: 'You', text: "Time to grab a taxi.", translation: "该去打车了。" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-blue-600 text-lg">
                    <Plane className="rotate-45" size={24} />
                    <span>AirTutor</span>
                </div>
                <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Complete Guide
                </div>
            </div>
        </div>

        {/* Main Content List */}
        <main className="max-w-5xl mx-auto px-4 py-8">
            {scenes.map((scene, index) => (
                <SceneCard key={scene.id} scene={scene} index={index} />
            ))}
            
            {/* Footer */}
            <div className="text-center py-12 text-slate-400 text-sm">
                <p>Have a safe trip! ✈️</p>
                <p className="mt-2">Designed for English Learning</p>
            </div>
        </main>
    </div>
  );
};

export default AirportJourney;