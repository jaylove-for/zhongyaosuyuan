import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productsApi } from "../lib/api";

interface TraceStep {
  title: string; step_time: string; description: string; is_active: boolean; sort_order: number;
}
interface Product {
  id: number; name: string; grade: string; origin: string; description: string;
  image_url: string; sugar_degree: string; diameter_mm: number; weight_g: number;
  trace_steps: TraceStep[];
}

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.detail(id || '1')
      .then((data) => setProduct(data as Product))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-bg-dark flex items-center justify-center"><p className="text-white/40 animate-pulse">加载中...</p></div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-bg-dark flex items-center justify-center"><p className="text-white/40">产品不存在</p></div>;
  }

  return (
    <div className="min-h-screen bg-bg-dark p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <span>首页</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>溯源查询</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-accent">产品详情 #{product.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative mb-8 group">
              <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
              <div className="absolute top-6 right-6 bg-accent text-primary px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined">verified</span>已认证
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[{ label: "糖度", val: product.sugar_degree, icon: "water_drop" },{ label: "果径", val: `${product.diameter_mm}mm`, icon: "straighten" },{ label: "重量", val: `${product.weight_g}g`, icon: "scale" }].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                  <span className="material-symbols-outlined text-white/40 mb-2">{s.icon}</span>
                  <p className="text-2xl font-bold text-white mb-1">{s.val}</p>
                  <p className="text-xs text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">{product.name} ({product.grade})</h1>
              <p className="text-lg text-white/60 font-light">{product.description}</p>
            </div>
            <div className="bg-primary/20 rounded-2xl p-6 border border-primary/30">
              <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-4">生长环境数据</h3>
              <div className="space-y-4">
                {[{l:"土壤有机质含量",w:"85%",t:"High"},{l:"年平均日照时长",w:"92%",t:"2700h"},{l:"灌溉水质标准",w:"100%",t:"Class I"}].map((d,i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">{d.l}</span>
                    <div className="flex items-center gap-3 w-1/2">
                      <div className="h-2 flex-1 bg-black/20 rounded-full overflow-hidden"><div className={`h-full ${i===0?'bg-emerald-500':i===1?'bg-amber-500':'bg-blue-500'}`} style={{width:d.w}}></div></div>
                      <span className="text-white font-mono text-sm">{d.t}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-6">全链路溯源档案</h3>
              <div className="relative pl-8 border-l border-white/10 space-y-8">
                {product.trace_steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[37px] top-1 size-4 rounded-full border-2 ${step.is_active ? 'bg-accent border-accent' : 'bg-bg-dark border-white/20'}`}></div>
                    <h4 className={`text-lg font-bold ${step.is_active ? 'text-white' : 'text-white/40'}`}>{step.title}</h4>
                    <p className="text-xs font-mono text-white/30 mb-2">{step.step_time}</p>
                    <p className="text-sm text-white/60">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
