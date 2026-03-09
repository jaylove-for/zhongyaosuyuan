import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { traceabilityApi } from "../lib/api";

interface TraceStats {
  total_batches: string;
  node_status: string;
  query_count_today: string;
  anomaly_count: number;
}

interface TraceStep {
  id: number;
  step_name: string;
  step_date: string;
  icon: string;
  is_active: boolean;
  is_current: boolean;
}

interface TraceNode {
  id: number;
  name: string;
  latency: string;
  load: string;
  status: string;
}

export function TraceabilityDashboard() {
  const [stats, setStats] = useState<TraceStats | null>(null);
  const [steps, setSteps] = useState<TraceStep[]>([]);
  const [nodes, setNodes] = useState<TraceNode[]>([]);
  const [batchCode, setBatchCode] = useState("");

  useEffect(() => {
    traceabilityApi.getStats().then(setStats).catch(console.error);
    traceabilityApi.getBatch(1).then((data: Record<string, unknown>) => {
      setSteps((data.steps as TraceStep[]) || []);
      setBatchCode((data.batch_code as string) || "CN-FJ-2026-0901-A2");
    }).catch(console.error);
    traceabilityApi.getNodes().then(setNodes).catch(console.error);
  }, []);

  const statCards = stats ? [
    { label: "已上链批次", value: stats.total_batches, icon: "deployed_code", trend: "12%", color: "text-emerald-400" },
    { label: "活跃节点数", value: stats.node_status, icon: "hub", status: "稳定", color: "text-white" },
    { label: "今日溯源查询", value: stats.query_count_today, icon: "qr_code_scanner", trend: "2%", color: "text-rose-400", trendIcon: "trending_down" },
    { label: "异常预警次数", value: String(stats.anomaly_count), icon: "warning", status: "安全", color: "text-emerald-400" }
  ] : [];

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-bg-dark">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">区块链可视化看板</h1>
          <div className="flex items-center gap-3 text-sm text-white/50">
            <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 font-mono text-xs">Mainnet v2.4.0</span>
            <p>整合物联网与区块链技术，实现从田间到餐桌的全链路数字化信任。当前共有 <span className="text-accent font-bold">{stats?.total_batches || '—'}</span> 个批次安全运行中。</p>
          </div>
        </div>
        <Link 
          to="/trace/create"
          className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          发起溯源
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-accent text-3xl">{stat.icon}</span>
              {stat.trend ? (
                <span className={`text-xs font-bold ${stat.color} flex items-center gap-1`}>
                  <span className="material-symbols-outlined text-sm">{stat.trendIcon || "trending_up"}</span> {stat.trend}
                </span>
              ) : (
                <span className={`text-xs font-bold ${stat.color === 'text-emerald-400' ? 'text-emerald-400' : 'text-white/60'}`}>{stat.status}</span>
              )}
            </div>
            <p className="text-white/40 text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Map/Lifecycle Area */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-8 border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">route</span>
              农产品生命周期追踪 (实时)
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono text-white/40">
              <span className="size-2 bg-accent rounded-full animate-pulse"></span>
              ID: {batchCode}
            </div>
          </div>

          {/* Lifecycle Steps */}
          <div className="relative flex justify-between items-center mb-12 px-4">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10"></div>
            <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-accent -z-10"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className={`size-12 rounded-full flex items-center justify-center border-4 ${step.is_active ? 'bg-accent border-bg-dark text-primary' : 'bg-bg-dark border-white/10 text-white/20'}`}>
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${step.is_active ? 'text-white' : 'text-white/40'}`}>{step.step_name}</p>
                  <p className="text-[10px] text-white/40">{step.step_date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="relative h-64 w-full rounded-xl overflow-hidden border border-white/10">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfhpWJnYRGjfTUukMfxoty-Oh00JRKm2Wg1gnC7rqZ1akxqvNXW-DbLWWy0siNlRdRjObAxmusDyBeYuuUWdXHj2ZpvOCGmRq1jgt8nEHhocAHJiAlMHRXG3iZEtVpuN4EUUrI2Ygy6xk9eQfDsbZeDDnmUnQl1GSfdjJFlIHQmnJIIYDE_owVmoFk-KdNB_LmWfS29TNlGMHqv3pIcgOkf95lSTH-YsEqpDmC4L1jrK4J7i5enVXzmq4SDSPDvlsW8w3sfcA9Kj4" 
              className="w-full h-full object-cover opacity-40 grayscale"
              alt="World Map"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 bg-accent text-primary px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
              <span className="material-symbols-outlined">location_on</span>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-70">当前位置</p>
                <p className="text-sm font-bold">福建武夷山生态茶园 C区</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Node Status */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">hub</span>
              节点监控中心
            </h3>
            <div className="space-y-6">
              {nodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className={`size-2 rounded-full ${node.status === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-[0_0_8px_currentColor]`}></span>
                    <span className="text-sm text-white group-hover:text-accent transition-colors">{node.name}</span>
                  </div>
                  <span className="text-xs font-mono text-white/40">{node.latency} / {node.load}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between text-xs text-white/40 mb-2">
                <span>平均区块同步率</span>
                <span className="text-accent font-bold">99.9%</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[99.9%]"></div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 bg-primary/20 border-l-4 border-l-emerald-500">
            <h3 className="text-sm font-bold text-white mb-2">系统消息</h3>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-emerald-500 text-sm mt-1">check_circle</span>
              <div>
                <p className="text-sm font-bold text-white">系统升级完成</p>
                <p className="text-xs text-white/50 mt-1">溯源接口已优化，响应速度提升40%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
