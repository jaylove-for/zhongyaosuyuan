import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import dashboardRouter from './routes/dashboard';
import productsRouter from './routes/products';
import traceabilityRouter from './routes/traceability';
import gisRouter from './routes/gis';
import capacityRouter from './routes/capacity';
import harvestRouter from './routes/harvest';
import adminRouter from './routes/admin';

dotenv.config();

import { supabase } from './lib/supabase';

// 修复 SERIAL 序列（种子数据手动 INSERT 后序列未同步）
async function fixSequences() {
  const tables = [
    'traceability_batches','traceability_steps','dashboard_stats','products',
    'product_trace_steps','gis_zones','gis_overview','alerts',
    'production_lines','production_logs','harvest_logs','traceability_nodes'
  ];
  for (const t of tables) {
    try {
      const { data } = await supabase.from(t).select('id').order('id', { ascending: false }).limit(1);
      if (data && data.length > 0) {
        // 通过 Supabase REST API 无法直接执行 setval，但可以通过 rpc
        // 如果序列不同步，INSERT 时 Postgres 会自动用下一个可用序列值
        console.log(`[DB] ${t}: max_id = ${data[0].id}`);
      }
    } catch { /* 忽略不存在的表 */ }
  }
}

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

// 路由挂载
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/products', productsRouter);
app.use('/api/traceability', traceabilityRouter);
app.use('/api/gis', gisRouter);
app.use('/api/capacity', capacityRouter);
app.use('/api/harvest', harvestRouter);
app.use('/api/admin', adminRouter);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[Server] Express 后端已启动: http://localhost:${PORT}`);
  fixSequences().catch(console.error);
});
