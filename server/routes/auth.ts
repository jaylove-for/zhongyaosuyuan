import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role, display_name, phone } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: '邮箱和密码为必填项' });
      return;
    }

    // 使用 Supabase Auth 注册
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      res.status(400).json({ error: authError.message });
      return;
    }

    // 创建 profile
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: authData.user.id,
        role: role || 'consumer',
        display_name: display_name || '',
        phone: phone || '',
      });

      if (profileError) {
        console.error('[Auth] Profile creation failed:', profileError);
      }
    }

    res.json({ message: '注册成功', user: authData.user });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: '邮箱和密码为必填项' });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: '登录失败: ' + error.message });
      return;
    }

    res.json({
      message: '登录成功',
      user: data.user,
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: '未提供认证令牌' });
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ error: '令牌无效' });
      return;
    }

    // 获取 profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    res.json({ user, profile });
  } catch (err) {
    console.error('[Auth] Me error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
