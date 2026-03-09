import { useState, useEffect } from "react";
import { harvestApi } from "../lib/api";

interface HarvestLog {
  id: number;
  log_time: string;
  user_name: string;
  action: string;
  amount: string;
  location: string;
}

export function VRMuseum() {
  const [activeFilter, setActiveFilter] = useState("全部区域");
  const [harvestLogs, setHarvestLogs] = useState<HarvestLog[]>([]);

  useEffect(() => {
    harvestApi.getLogs().then(setHarvestLogs).catch(console.error);

    // Load Pannellum API dynamically
    if (!document.getElementById('pannellum-css')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('pannellum-script')) {
      const script = document.createElement('script');
      script.id = 'pannellum-script';
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.onload = () => {
        // @ts-ignore
        if (window.pannellum) {
          // @ts-ignore
          window.pannellum.viewer('panorama', {
            type: "equirectangular",
            panorama: "/orchard_panorama.png",
            autoLoad: true,
            autoRotate: -2,
            compass: true,
            showControls: true
          });
        }
      };
      document.head.appendChild(script);
    } else {
      // @ts-ignore
      if (window.pannellum) {
        // @ts-ignore
        window.pannellum.viewer('panorama', {
          type: "equirectangular",
          panorama: "/orchard_panorama.png",
          autoLoad: true,
          autoRotate: -2,
          compass: true,
          showControls: true
        });
      }
    }
  }, []);

  return (
    <div className="h-screen w-full bg-bg-dark flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div id="panorama" className="w-full h-full"></div>
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-bg-dark/80 via-transparent to-bg-dark/80`}></div>
      </div>

      <header className="relative z-10 px-8 py-6 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-accent text-4xl">view_in_ar</span>数字果园 VR 博物馆
          </h1>
          <p className="text-white/60 mt-2 text-lg font-light">沉浸式体验 · 720°全景 · 实时生长监测</p>
        </div>
        <div className="pointer-events-auto flex gap-2">
          {['全部区域', '育苗区', '挂果区', '采摘区'].map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors backdrop-blur-md border ${activeFilter === f ? 'bg-accent text-primary border-accent' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}>{f}</button>
          ))}
        </div>
      </header>

      <div className="absolute right-0 top-0 bottom-0 w-96 bg-bg-dark/90 backdrop-blur-xl border-l border-white/10 p-6 z-10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <span className="material-symbols-outlined text-accent">history</span>实时采摘动态
        </h2>
        <div className="space-y-4 overflow-y-auto h-[calc(100vh-140px)] pr-2">
          {harvestLogs.map((item) => (
            <div key={item.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-accent/30 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-white/40">{item.log_time}</span>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">{item.location}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-primary/40 flex items-center justify-center text-white/80"><span className="material-symbols-outlined text-sm">person</span></div>
                <div><p className="text-sm font-bold text-white">{item.user_name}</p><p className="text-xs text-white/50">{item.action}</p></div>
              </div>
              <div className="text-right"><span className="text-lg font-mono font-bold text-emerald-400">{item.amount}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/3 left-1/4 z-0 group cursor-pointer">
        <div className="size-4 bg-accent rounded-full animate-ping absolute"></div>
        <div className="size-4 bg-accent rounded-full relative border-2 border-white shadow-lg"></div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">树龄: 12年<br/>品种: 凯特</div>
      </div>
      <div className="absolute top-1/2 right-1/3 z-0 group cursor-pointer">
        <div className="size-4 bg-emerald-500 rounded-full animate-ping absolute" style={{ animationDelay: "0.5s" }}></div>
        <div className="size-4 bg-emerald-500 rounded-full relative border-2 border-white shadow-lg"></div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">环境监测站<br/>湿度: 68%</div>
      </div>
    </div>
  );
}
