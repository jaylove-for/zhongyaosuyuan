import { useState, useEffect } from "react";
import { capacityApi } from "../lib/api";

interface ProductionLine {
  id: number; name: string; status: string; efficiency: string;
  daily_output: string; color: string; progress: number;
}
interface ProductionLog {
  id: number; log_time: string; message: string; log_type: string;
}

export function CapacityControl() {
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [logs, setLogs] = useState<ProductionLog[]>([]);

  useEffect(() => {
    capacityApi.getLines().then(setLines).catch(console.error);
    capacityApi.getLogs().then(setLogs).catch(console.error);
  }, []);

  const handleCircuitBreak = async () => {
    try {
      const result = await capacityApi.circuitBreak();
      alert(result.message);
      capacityApi.getLines().then(setLines);
      capacityApi.getLogs().then(setLogs);
    } catch (err) { alert("熔断操作失败"); console.error(err); }
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-bg-dark text-white">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="material-symbols-outlined text-accent text-4xl">precision_manufacturing</span>企业产能控制中枢
          </h1>
          <p className="text-white/50">基于 Transformer 模型的动态产能预测与熔断控制系统</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="size-2 bg-rose-500 rounded-full animate-pulse"></span>
            <span className="text-rose-400 font-bold text-sm">熔断保护: 开启</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="size-2 bg-emerald-500 rounded-full"></span>
            <span className="text-emerald-400 font-bold text-sm">系统负载: 42%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {lines.map((line) => (
            <div key={line.id} className="glass-card p-6 rounded-2xl border-l-4" style={{ borderLeftColor: line.color === 'emerald' ? 'var(--color-primary)' : line.color === 'rose' ? '#f43f5e' : 'var(--color-accent)' }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">{line.name}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${line.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : line.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>{line.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/40">日产能</p>
                  <p className="text-2xl font-mono font-bold">{line.daily_output}</p>
                </div>
              </div>
              <div className="relative pt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/40">综合效率</span>
                  <span className="font-bold">{line.efficiency}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${line.color === 'emerald' ? 'bg-emerald-500' : line.color === 'rose' ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${line.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}

          <div className="glass-card p-8 rounded-2xl border border-white/5 mt-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">neurology</span>Transformer 预测模型状态
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              {[{ label: "Attention Heads", val: "12" },{ label: "Hidden Layers", val: "24" },{ label: "Parameters", val: "1.2B" },{ label: "Accuracy", val: "99.2%" }].map((s, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs text-white/40 mb-1">{s.label}</p>
                  <p className="text-xl font-mono font-bold text-accent">{s.val}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
              <p className="text-white/20 text-sm font-mono animate-pulse">Model Inference Visualization Placeholder</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20">
            <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2"><span className="material-symbols-outlined">gavel</span>熔断控制</h3>
            <p className="text-sm text-white/60 mb-6">当检测到非原产地数据流入或质量异常时，可手动触发全链熔断。</p>
            <button onClick={handleCircuitBreak} className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-900/50 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">lock</span>立即熔断所有批次
            </button>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4">生产日志</h3>
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 text-sm border-b border-white/5 pb-2 last:border-0">
                  <span className="font-mono text-white/30 text-xs mt-0.5">{log.log_time}</span>
                  <span className={log.log_type === 'warn' ? 'text-amber-400' : log.log_type === 'success' ? 'text-emerald-400' : log.log_type === 'error' ? 'text-rose-400' : 'text-white/70'}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
