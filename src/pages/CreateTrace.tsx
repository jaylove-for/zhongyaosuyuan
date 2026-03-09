import { useState } from "react";
import { Link } from "react-router-dom";

interface TraceResult {
  message: string;
  batch_code: string;
  blockchain_hash: string;
  farmer_name: string;
  sugar_degree: string;
  timestamp: string;
  node_count: string;
}

export function CreateTrace() {
  const [batchCode, setBatchCode] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [sugarDegree, setSugarDegree] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TraceResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode.trim() || !farmerName.trim()) {
      setError("请填写批次号和农户姓名");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/traceability/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_code: batchCode, farmer_name: farmerName, sugar_degree: sugarDegree }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "上链失败");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "上链失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark p-6 lg:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link to="/traceability" className="hover:text-accent transition-colors">区块链溯源</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-accent">发起溯源</span>
        </div>

        {!result ? (
          <div className="glass-card rounded-3xl p-8 lg:p-12 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-accent text-3xl">deployed_code</span>
              <h1 className="text-2xl lg:text-3xl font-black text-white">攀芒智链 - 农户上链端</h1>
            </div>
            <p className="text-white/40 text-sm mb-10 ml-11">将农产品信息写入区块链，生成不可篡改的防伪溯源凭证</p>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-white/60 mb-2 block">芒果批次号 *</label>
                <input
                  type="text" value={batchCode} onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="请输入芒果批次号 (例: PZH-20260301)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-white/25 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-base"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-white/60 mb-2 block">农户姓名 *</label>
                <input
                  type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="农户姓名 (例: 张三)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-white/25 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-base"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-white/60 mb-2 block">平均糖度</label>
                <input
                  type="text" value={sugarDegree} onChange={(e) => setSugarDegree(e.target.value)}
                  placeholder="平均糖度 (例: 15%)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-white/25 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-base"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-accent to-[#E0A102] text-primary font-black text-lg rounded-xl shadow-[0_0_30px_-5px_rgba(255,183,3,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">{loading ? "hourglass_top" : "link"}</span>
                {loading ? "上链中..." : "点击生成区块链防伪溯源凭证"}
              </button>
            </form>
          </div>
        ) : (
          /* 上链成功 - 凭证展示 */
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-8 lg:p-12 border border-accent/30 bg-accent/5 text-center">
              <div className="size-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-accent/40">
                <span className="material-symbols-outlined text-accent text-4xl">verified</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">上链成功!</h2>
              <p className="text-white/50 mb-8">区块链防伪溯源凭证已生成</p>

              <div className="bg-black/30 rounded-2xl p-6 text-left space-y-4 border border-white/5">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/40 text-sm">批次号</span>
                  <span className="text-white font-mono font-bold">{result.batch_code}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/40 text-sm">农户</span>
                  <span className="text-white font-bold">{result.farmer_name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/40 text-sm">糖度</span>
                  <span className="text-accent font-mono font-bold">{result.sugar_degree}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/40 text-sm">节点状态</span>
                  <span className="text-emerald-400 font-mono">{result.node_count}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/40 text-sm">上链时间</span>
                  <span className="text-white/70 font-mono text-xs">{new Date(result.timestamp).toLocaleString("zh-CN")}</span>
                </div>
                <div>
                  <span className="text-white/40 text-sm block mb-2">区块链哈希</span>
                  <div className="bg-primary/30 rounded-lg px-4 py-3 font-mono text-xs text-accent break-all border border-primary/50">
                    {result.blockchain_hash}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => { setResult(null); setBatchCode(""); setFarmerName(""); setSugarDegree(""); }}
                className="flex-1 py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add_circle</span>继续上链
              </button>
              <Link
                to="/traceability"
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>返回看板
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
