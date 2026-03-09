import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/harvest/logs
router.get('/logs', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('harvest_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[Harvest] Logs error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
