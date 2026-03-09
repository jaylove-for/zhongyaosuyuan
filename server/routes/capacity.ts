import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/capacity/lines
router.get('/lines', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('production_lines')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[Capacity] Lines error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/capacity/logs
router.get('/logs', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('production_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[Capacity] Logs error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/capacity/circuit-break
router.post('/circuit-break', async (_req: Request, res: Response) => {
  try {
    // 将所有产线标记为 Halted
    const { error } = await supabase
      .from('production_lines')
      .update({ status: 'Halted', progress: 0, efficiency: '0%' })
      .neq('status', 'Maintenance');

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // 写入日志
    await supabase.from('production_logs').insert({
      log_time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      message: '全链熔断保护已触发，所有活跃产线已锁定',
      log_type: 'error',
    });

    res.json({ message: '已触发全链熔断保护机制！所有相关批次已被锁定。' });
  } catch (err) {
    console.error('[Capacity] Circuit-break error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
