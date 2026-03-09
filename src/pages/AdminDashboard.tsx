import { useState, useEffect } from "react";
import { adminApi } from "../lib/api";

type User = {
  id: string;
  user_id: string;
  role: string;
  display_name: string;
  phone: string;
  created_at: string;
};

type Trace = {
  id: number;
  batch_code: string;
  product_name: string;
  status: string;
  total_nodes: number;
  active_nodes: number;
  created_at: string;
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "traces">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const data = await adminApi.getUsers();
        setUsers(data);
      } else {
        const data = await adminApi.getTraces();
        setTraces(data);
      }
    } catch (err) {
      console.error(err);
      // alert("加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; color: string }> = {
      consumer: { label: "消费者", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      farmer: { label: "农户/企业", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
      regulator: { label: "监管部门", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
    };
    const config = roles[role] || { label: role, color: "bg-gray-500/20 text-gray-400" };
    return <span className={`px-2 py-1 text-xs border rounded-md ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="p-8 pb-24 h-full overflow-y-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-ivory mb-2 flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-accent">admin_panel_settings</span>
            管理控制台
          </h1>
          <p className="text-ivory/60">查看所有的注册用户与产品溯源上链记录数据库</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === "users"
              ? "bg-primary text-white font-bold shadow-lg shadow-primary/20"
              : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined">group</span>
          用户管理
        </button>
        <button
          onClick={() => setActiveTab("traces")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === "traces"
              ? "bg-primary text-white font-bold shadow-lg shadow-primary/20"
              : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined">link</span>
          溯源记录
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full size-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-ivory/60 text-sm">
                {activeTab === "users" ? (
                  <>
                    <th className="p-4 font-normal">用户ID (Profile)</th>
                    <th className="p-4 font-normal">昵称</th>
                    <th className="p-4 font-normal">角色</th>
                    <th className="p-4 font-normal">手机号</th>
                    <th className="p-4 font-normal text-right">注册时间</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 font-normal">溯源批次号</th>
                    <th className="p-4 font-normal">关联产品</th>
                    <th className="p-4 font-normal">节点覆盖</th>
                    <th className="p-4 font-normal">状态</th>
                    <th className="p-4 font-normal text-right">创建时间</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === "users" && users.map((u) => (
                <tr key={u.id} className="border-t border-white/5 hover:bg-white/5 transition-colors group text-sm">
                  <td className="p-4 text-white/60 font-mono text-xs">{u.id}</td>
                  <td className="p-4 font-bold text-white group-hover:text-accent transition-colors">
                    {u.display_name || "—"}
                  </td>
                  <td className="p-4">{getRoleBadge(u.role)}</td>
                  <td className="p-4 text-white/80">{u.phone || "—"}</td>
                  <td className="p-4 text-right text-white/60">
                    {new Date(u.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              
              {activeTab === "traces" && traces.map((t) => (
                <tr key={t.id} className="border-t border-white/5 hover:bg-white/5 transition-colors group text-sm">
                  <td className="p-4 font-bold font-mono text-accent">{t.batch_code}</td>
                  <td className="p-4 text-white">{t.product_name}</td>
                  <td className="p-4 text-white/80">
                    {t.active_nodes} / {t.total_nodes}
                    <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${(t.active_nodes / t.total_nodes) * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs border rounded-md ${
                      t.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }`}>
                      {t.status === "active" ? "活跃" : t.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-white/60">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {((activeTab === "users" && users.length === 0) || (activeTab === "traces" && traces.length === 0)) && (
            <div className="p-12 text-center text-white/40">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
              <p>暂无数据记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
