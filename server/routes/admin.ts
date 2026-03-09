import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/admin/users
router.get('/users', async (_req: Request, res: Response) => {
  try {
    // 假设管理端不严格校验 token role（如果是真实生产环境需检查权限）
    // 从 profiles 获取用户列表
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, user_id, role, display_name, phone, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(profiles);
  } catch (err) {
    console.error('[Admin] Get users error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/admin/traces
router.get('/traces', async (_req: Request, res: Response) => {
  try {
    // 获取溯源批次，关联产品名称
    const { data: batches, error } = await supabase
      .from('traceability_batches')
      .select(`
        id,
        batch_code,
        status,
        total_nodes,
        active_nodes,
        created_at,
        products ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // 格式化输出
    const formatted = batches.map((b: any) => ({
      id: b.id,
      batch_code: b.batch_code,
      product_name: b.products?.name || '未知产品',
      status: b.status,
      total_nodes: b.total_nodes,
      active_nodes: b.active_nodes,
      created_at: b.created_at,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('[Admin] Get traces error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
