import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { dashboardApi } from "../lib/api";

interface StatItem {
  id: number;
  icon: string;
  label: string;
  value: string;
  change_percent: string;
}

export function LandingPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("[LandingPage] Failed to load stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col p-6 lg:p-10 overflow-hidden">
      {/* Vertical Background Text */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden lg:block">
        <h1 className="writing-vertical text-9xl font-black opacity-5 text-primary-light tracking-widest select-none">
          守望原香
        </h1>
      </div>

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden mb-12 min-h-[600px] flex flex-col items-center justify-center text-center p-8 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent z-10"></div>
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgYbU9p-bToxo10RW2GKxZ3AhPSnvBk208MzJU5AIfssGdnX6zf4ZLhlL4k2KzDnsrDOUcYQ3wFF7alZNZiw-jFsozbeuJZza9uMktJzowm_xon3NZ7hMzYsr6zUCRJ3PgZVFQUmMM7XtShgqVC5d3_pNYGCfL3WAdYgJ5iczLDE0ZVkGRQQJHyUvmEudw2Ho7AfVrAA2xMgPPT1bEfzoiHfX1D9CH2tq-lzQHS6-bhdt-qMb3HIXYxKzyhsaGCryYv9yThaWD3GU" 
            alt="Panzhihua Mango Base"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-20 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-6 border border-accent/20 backdrop-blur-md">
              Panzhihua Miye Base
            </span>
            <h1 className="text-ivory text-6xl md:text-8xl font-black leading-tight mb-8 drop-shadow-2xl font-display">
              守望原香
            </h1>
            <p className="text-ivory/80 text-xl md:text-2xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
              攀枝花米易基地 · 沉浸式全时溯源<br />
              <span className="text-base opacity-70 mt-2 block">基于区块链技术，记录每一颗果实的成长轨迹</span>
            </p>
            <Link 
              to="/traceability"
              className="inline-flex items-center justify-center gap-3 rounded-xl h-16 px-10 bg-gradient-to-r from-accent to-[#E0A102] text-primary text-lg font-black shadow-[0_0_30px_-5px_rgba(255,183,3,0.4)] hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
              查看溯源
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Data Wall Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-8 border-l-4 border-l-accent animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          stats.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-8 border-l-4 border-l-accent group hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-accent text-2xl">{item.icon}</span>
                <p className="text-ivory/60 text-sm font-medium">{item.label}</p>
              </div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-ivory text-4xl font-black tracking-tight">{item.value}</h3>
                <span className="text-accent text-sm font-bold bg-accent/10 px-2 py-0.5 rounded">{item.change_percent}</span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Tech Section */}
      <section className="py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-ivory text-3xl font-bold mb-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-accent rounded-full"></span>
              核心防伪技术体系
            </h2>
            <p className="text-ivory/60">构建从田间地头到餐桌的全链路数字化信任底座，三层防御机制保障原产地真实性。</p>
          </div>
          <Link to="/traceability" className="text-accent font-bold flex items-center gap-2 group hover:underline">
            技术白皮书 
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              level: "01", 
              title: "物理指纹特征", 
              icon: "fingerprint",
              desc: '利用AI识别植物叶片、果皮的天然纹路，为每一株植物建立唯一的生物识别身份证。',
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWivkrYbeSYO0BINGUBc7TbzWUA6npeuPwIMIGVjUUiOnWhavK2Rcoug1LBgkSaEBGZ9jQtnU07hz5Z59R1XAdfTv3_rzkKspJPSV55z8Dk3oCYHpxsg8KdtU123ZGhR8cHt8-CQrXJiI5RwrZ1Cmwphjs6qNaUS-shqNsQAZszn5ujmWCxSTi0fnz97BZl8cQSdDmyXJA1fLkZiNQhAjfKcrHSTexwqNZO1lhs1N6ijNzko5rWCKaMurIyOATUtAq9OYTqn3GSjA"
            },
            { 
              level: "02", 
              title: "区块链哈希锚定", 
              icon: "link",
              desc: "数据实时上链，多方节点共同校验，确保生产、运输、销售全生命周期记录不可篡改。",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhJLWPM5kwy9-G6ZXujaW2sCFyynA3jZheG8sTxPmuP_7c4hxIyhap6w0JdO2aaIFRtIpaRb_SHdkM_SObmaTaYrIUW49m0LPe7q8flVT1NEdyedb-MQPECquzb6AchFOdVzRRxXeXmAv1WRo9uFed4Q9KcZB-W7l2lmGfUapLk0aO_kyVZHxRBhLq-Mrbb2HxQzG42CPTQeM2NLJEVoYcGpv82KPprqEw_qWNHwjZ3VffgsdXs34Bc3_CMDJv_dfd8c67OYMcSAI"
            },
            { 
              level: "03", 
              title: "原产地熔断机制", 
              icon: "electric_bolt",
              desc: "基于地理围栏，一旦识别到非原产地流通异常，系统自动锁定赋码效力，实现源头熔断。",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkgGZ-JXtkIf9zNcls8lIELeY78F017xsp2rv8XWyglNtQIx52CpDXjerpHigGy1sQCCeMnWxYPT3tcNqUX3YTrI6HV3Ue2fk7ujvMkfYqdNEOyoNciDeSPDMXzRegLRhG5vVnZw6fhyH4cyvMX-IdQrdLVKgUv9xajWlGEXe-ffqXlPQ9KzOuZOIpUN140T8i98coupaMRWiaUDRQnM4KIHVWxv2_hLSAEJ452p-NxEysC61m7tlFVg-8bGjsfRYnxm9omU94nW0"
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col gap-6 p-4 rounded-3xl bg-primary/20 border border-white/5 hover:bg-primary/30 transition-colors group">
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={item.img} alt={item.title} referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-ivory text-[10px] font-bold rounded-full border border-white/10">LEVEL {item.level}</div>
              </div>
              <div className="px-2 pb-2">
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                  <span className="material-symbols-outlined text-accent">{item.icon}</span>
                  {item.title}
                </h4>
                <p className="text-sm text-ivory/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
