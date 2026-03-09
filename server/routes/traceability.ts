import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/traceability/stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const { data: batches } = await supabase
      .from('traceability_batches')
      .select('*');

    const totalBatches = batches?.length || 0;
    const totalNodes = batches?.reduce((sum, b) => sum + (b.total_nodes || 0), 0) || 0;
    const activeNodes = batches?.reduce((sum, b) => sum + (b.active_nodes || 0), 0) || 0;
    const queryCountToday = batches?.reduce((sum, b) => sum + (b.query_count_today || 0), 0) || 0;
    const anomalyCount = batches?.reduce((sum, b) => sum + (b.anomaly_count || 0), 0) || 0;

    res.json({
      total_batches: totalBatches.toLocaleString(),
      node_status: `${activeNodes} / ${totalNodes}`,
      query_count_today: queryCountToday >= 1000 ? (queryCountToday / 1000).toFixed(1) + 'k' : queryCountToday.toString(),
      anomaly_count: anomalyCount,
    });
  } catch (err) {
    console.error('[Traceability] Stats error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/traceability/batches
router.get('/batches', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('traceability_batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[Traceability] Batches error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/traceability/batches/:id
router.get('/batches/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: batch, error: batchError } = await supabase
      .from('traceability_batches')
      .select('*')
      .eq('id', id)
      .single();

    if (batchError) {
      res.status(404).json({ error: '批次不存在' });
      return;
    }

    const { data: steps } = await supabase
      .from('traceability_steps')
      .select('*')
      .eq('batch_id', id)
      .order('sort_order', { ascending: true });

    res.json({ ...batch, steps: steps || [] });
  } catch (err) {
    console.error('[Traceability] Batch detail error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/traceability/nodes
router.get('/nodes', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('traceability_nodes')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[Traceability] Nodes error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/traceability/create — 农户上链端：发起溯源
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { batch_code, farmer_name, sugar_degree, product_id } = req.body;

    if (!batch_code || !farmer_name) {
      res.status(400).json({ error: '批次号和农户姓名为必填项' });
      return;
    }

    // 生成模拟区块链哈希 (SHA-256 风格)
    const timestamp = Date.now();
    const rawStr = `${batch_code}-${farmer_name}-${timestamp}`;
    let hash = '0x';
    for (let i = 0; i < rawStr.length; i++) {
      hash += rawStr.charCodeAt(i).toString(16);
    }
    hash = hash.padEnd(66, 'a').substring(0, 66);

    // 写入溯源批次
    const { data: batch, error: batchErr } = await supabase
      .from('traceability_batches')
      .insert({
        batch_code,
        product_id: product_id || 1,
        status: 'active',
        total_nodes: 16,
        active_nodes: 1,
        query_count_today: 0,
        anomaly_count: 0,
      })
      .select()
      .single();

    if (batchErr) {
      res.status(500).json({ error: '上链失败: ' + batchErr.message });
      return;
    }

    // 写入初始溯源步骤
    await supabase.from('traceability_steps').insert({
      batch_id: batch.id,
      step_name: '生态种植',
      step_date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      icon: 'potted_plant',
      is_active: true,
      is_current: true,
      sort_order: 1,
    });

    res.json({
      message: '上链成功！区块链防伪溯源凭证已生成。',
      batch_id: batch.id,
      batch_code,
      blockchain_hash: hash,
      farmer_name,
      sugar_degree: sugar_degree || '未检测',
      timestamp: new Date().toISOString(),
      node_count: '1 / 16',
    });
  } catch (err) {
    console.error('[Traceability] Create error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
