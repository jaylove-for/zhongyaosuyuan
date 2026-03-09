import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('[Products] List error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) {
      res.status(404).json({ error: '产品不存在' });
      return;
    }

    // 获取该产品的溯源步骤
    const { data: traceSteps } = await supabase
      .from('product_trace_steps')
      .select('*')
      .eq('product_id', id)
      .order('sort_order', { ascending: true });

    res.json({ ...product, trace_steps: traceSteps || [] });
  } catch (err) {
    console.error('[Products] Detail error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
