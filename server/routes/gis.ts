import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/gis/overview
router.get('/overview', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('gis_overview')
      .select('*')
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[GIS] Overview error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/gis/zones
router.get('/zones', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('gis_zones')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[GIS] Zones error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/gis/alerts
router.get('/alerts', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[GIS] Alerts error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
