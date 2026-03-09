import { useState, useEffect } from "react";
import { gisApi } from "../lib/api";

interface GisOverview {
  total_production: number;
  verification_rate: number;
  system_health: number;
}

interface GisZone {
  id: number;
  name: string;
  color: string;
  area_value: string;
}

interface AlertItem {
  id: number;
  title: string;
  description: string;
  severity: string;
  zone_code: string;
}

export function GISDashboard() {
  const [overview, setOverview] = useState<GisOverview | null>(null);
  const [zones, setZones] = useState<GisZone[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    gisApi.getOverview().then(setOverview).catch(console.error);
    gisApi.getZones().then(setZones).catch(console.error);
    gisApi.getAlerts().then(setAlerts).catch(console.error);
  }, []);

  return (
    <div className="relative h-screen w-full bg-[#0a1610] overflow-hidden flex flex-col">
      {/* Map Background */}
      <div className="absolute inset-0 opacity-60">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCORqgCNYzHUElukFNvEmB_o6Or6YljWBOa8LvG-2m7SSX-atvQ4npgXzf-r-bc0vSvJCC-_-yCxn-SPTOaqEaph71hd2Y_a-JCHKprPfXn8xdfPRFJ4BPpGc4vDVSWlRSrhDw_ASPTETsrvK2z3Kz_qm9nFdx7ANhiCm8OyRlyahUXHxa-_DtsP9E4P-ePOYBMQSOhCqarCQ342Qz8LETG3P9Q6OPdyk6ENZU2lXXS-Q-jSTE6L-aDcXzVI4wfBmwg9YubdgNfSas" 
          alt="GIS Map"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent"></div>
      </div>

      {/* Header Overlay */}
      <header className="relative z-20 flex items-center justify-between px-8 py-4 bg-gradient-to-b from-bg-dark/90 to-transparent">
        <div className="flex items-center gap-4">
          <div className="text-accent">
            <span className="material-symbols-outlined text-3xl">hub</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            乡土印迹 <span className="text-accent/80 font-normal text-sm ml-2 tracking-widest">GIS BIG DATA</span>
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input 
              className="bg-primary/20 border border-primary/40 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-accent focus:border-accent w-64 text-white placeholder:text-white/30 backdrop-blur-sm" 
              placeholder="检索地理坐标或地块编号..."
            />
          </div>
        </div>
      </header>

      {/* Main Content Layer */}
      <div className="relative z-10 flex-1 p-6 pointer-events-none">
        
        {/* Left HUD */}
        <div className="absolute top-20 left-6 flex flex-col gap-4 w-80 pointer-events-auto">
          {/* Stats */}
          <div className="glass-panel p-5 rounded-xl border-l-4 border-l-accent">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">analytics</span>
              实时核销概况
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-white/40 text-[10px] mb-1">累计产量 (Mt)</p>
                <p className="text-2xl font-bold text-white font-mono">{overview?.total_production ?? '—'}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] mb-1">核销率</p>
                <p className="text-2xl font-bold text-emerald-400 font-mono">{overview ? `${overview.verification_rate}%` : '—'}</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent shadow-[0_0_10px_#FFB703]" style={{ width: `${overview?.verification_rate ?? 0}%` }}></div>
            </div>
          </div>

          {/* Zones */}
          <div className="glass-panel p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">农业分区监控</h3>
              <span className="text-[10px] text-accent px-2 py-0.5 rounded border border-accent/30 bg-accent/10">Active</span>
            </div>
            <div className="space-y-3">
              {zones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between text-sm group cursor-pointer hover:bg-white/5 p-1 rounded">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className={`size-2 rounded-full ${zone.color} shadow-[0_0_8px_currentColor]`}></span> 
                    {zone.name}
                  </span>
                  <span className="font-mono text-accent">{zone.area_value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right HUD */}
        <div className="absolute top-20 right-6 flex flex-col gap-4 w-80 pointer-events-auto">
          {/* Alerts */}
          <div className="glass-panel p-5 rounded-xl border-r-4 border-r-rose-500">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">warning</span> 预警熔断中心
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${
                  alert.severity === 'critical' 
                    ? 'bg-rose-500/10 border-rose-500/20' 
                    : 'bg-primary/30 border-primary/50'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold ${alert.severity === 'critical' ? 'text-rose-300' : 'text-slate-300'}`}>{alert.title}</span>
                    <span className={`text-[10px] px-1.5 rounded font-bold ${
                      alert.severity === 'critical' ? 'bg-rose-500 text-white' : 'bg-primary text-slate-300'
                    }`}>{alert.severity === 'critical' ? 'CRITICAL' : 'NORMAL'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">动态产能核销趋势</h3>
            <div className="h-32 flex items-end justify-between gap-1 px-2">
              {[40, 60, 85, 55, 70, 95, 45].map((h, i) => (
                <div 
                  key={i} 
                  className={`w-full rounded-t ${i === 2 || i === 5 ? 'bg-accent shadow-[0_0_10px_rgba(197,160,89,0.5)]' : 'bg-primary/60'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-1 border-t border-white/10 pt-2">
              <span className="text-[10px] text-slate-500">06-01</span>
              <span className="text-[10px] text-slate-500">06-07</span>
            </div>
          </div>
        </div>

        {/* Bottom Ticker */}
        <div className="absolute bottom-6 left-6 right-6 h-16 glass-panel rounded-xl flex items-center px-6 gap-6 overflow-hidden pointer-events-auto">
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <span className="material-symbols-outlined">health_and_safety</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 leading-tight">系统健康度</p>
              <p className="text-sm font-bold text-white">{overview ? `${overview.system_health}%` : '—'}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex-1 overflow-hidden relative">
             <div className="flex gap-12 animate-marquee whitespace-nowrap absolute top-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">[日志]</span>
                  <span className="text-xs text-slate-200">2026-10-24 14:22:10 华北1区完成核销 1,240吨</span>
                  <span className="text-emerald-400 text-[10px] font-bold">● SUCCESS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">[预警]</span>
                  <span className="text-xs text-slate-200">产区 B04 监测到土壤湿度异常偏移</span>
                  <span className="text-amber-400 text-[10px] font-bold">● ALERT</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">[系统]</span>
                  <span className="text-xs text-slate-200">卫星影像图层同步更新完成 (24节点)</span>
                  <span className="text-emerald-400 text-[10px] font-bold">● SYNCED</span>
                </div>
             </div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex items-center gap-4 text-xs font-mono text-accent">
            <span>E: 116.40°</span>
            <span>N: 39.90°</span>
            <span className="text-slate-500">Beijing Time: 14:45:22</span>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-28 right-6 flex flex-col gap-2 pointer-events-auto">
          {['layers', 'add', 'remove'].map(icon => (
            <button key={icon} onClick={() => alert('地图控制功能开发中')} className="size-10 glass-panel rounded-lg flex items-center justify-center text-white hover:bg-primary/60 transition-colors cursor-pointer">
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
          <button onClick={() => alert('正在定位您当前位置...')} className="size-10 bg-accent text-primary rounded-lg flex items-center justify-center shadow-lg shadow-accent/20 hover:bg-accent-hover transition-colors cursor-pointer">
            <span className="material-symbols-outlined">near_me</span>
          </button>
        </div>

      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
