import { supabase } from './supabase';

// ========== Types ==========
interface ApiError {
  message: string;
  status: number;
}

const handleError = (error: any): never => {
  console.error('[Supabase API Error]', error);
  throw { message: error.message || '操作失败', status: 500 } as ApiError;
};

// ========== Auth ==========
export const authApi = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return handleError(error);
    return { 
      message: '登录成功', 
      user: data.user, 
      session: { 
        access_token: data.session?.access_token || '', 
        refresh_token: data.session?.refresh_token || '' 
      } 
    };
  },
  register: async (data: { email: string; password: string; role?: string; display_name?: string; phone?: string }) => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) return handleError(error);

    // Create profile
    if (signUpData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: signUpData.user.id,
        role: data.role || 'consumer',
        display_name: data.display_name || data.email.split('@')[0],
        phone: data.phone || '',
      });
      if (profileError) console.error('Profile creation error:', profileError);
    }

    return { message: '注册成功', user: signUpData.user };
  },
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { user: null, profile: null };
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
    return { user, profile };
  },
};

// ========== Dashboard ==========
export const dashboardApi = {
  getStats: async () => {
    const { data, error } = await supabase.from('dashboard_stats').select('*').order('sort_order', { ascending: true });
    if (error) return handleError(error);
    return data;
  },
};

// ========== Products ==========
export const productsApi = {
  list: async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) return handleError(error);
    return data;
  },
  detail: async (id: string | number) => {
    const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', id).single();
    if (productError) return handleError(productError);

    const { data: traceSteps } = await supabase.from('product_trace_steps').select('*').eq('product_id', id).order('sort_order', { ascending: true });
    return { ...product, trace_steps: traceSteps || [] };
  },
};

// ========== Traceability ==========
export const traceabilityApi = {
  getStats: async () => {
    const { data: batches, error } = await supabase.from('traceability_batches').select('*');
    if (error) return handleError(error);

    const totalBatches = batches?.length || 0;
    const totalNodes = batches?.reduce((sum, b) => sum + (b.total_nodes || 0), 0) || 0;
    const activeNodes = batches?.reduce((sum, b) => sum + (b.active_nodes || 0), 0) || 0;
    const queryCountToday = batches?.reduce((sum, b) => sum + (b.query_count_today || 0), 0) || 0;
    const anomalyCount = batches?.reduce((sum, b) => sum + (b.anomaly_count || 0), 0) || 0;

    return {
      total_batches: totalBatches.toLocaleString(),
      node_status: `${activeNodes} / ${totalNodes}`,
      query_count_today: queryCountToday >= 1000 ? (queryCountToday / 1000).toFixed(1) + 'k' : queryCountToday.toString(),
      anomaly_count: anomalyCount,
    };
  },
  getBatches: async () => {
    const { data, error } = await supabase.from('traceability_batches').select('*').order('created_at', { ascending: false });
    if (error) return handleError(error);
    return data;
  },
  getBatch: async (id: string | number) => {
    const { data: batch, error: batchError } = await supabase.from('traceability_batches').select('*').eq('id', id).single();
    if (batchError) return handleError(batchError);

    const { data: steps } = await supabase.from('traceability_steps').select('*').eq('batch_id', id).order('sort_order', { ascending: true });
    return { ...batch, steps: steps || [] };
  },
  getNodes: async () => {
    const { data, error } = await supabase.from('traceability_nodes').select('*').order('id', { ascending: true });
    if (error) return handleError(error);
    return data;
  },
  createBatch: async (data: { batch_code: string; farmer_name: string; sugar_degree?: string; product_id?: number }) => {
    const { data: batch, error: batchErr } = await supabase.from('traceability_batches').insert({
      batch_code: data.batch_code,
      product_id: data.product_id || 1,
      status: 'active',
      total_nodes: 16,
      active_nodes: 1,
      query_count_today: 0,
      anomaly_count: 0,
    }).select().single();

    if (batchErr) return handleError(batchErr);

    await supabase.from('traceability_steps').insert({
      batch_id: batch.id,
      step_name: '生态种植',
      step_date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      icon: 'potted_plant',
      is_active: true,
      is_current: true,
      sort_order: 1,
    });

    return { message: '上链成功', batch_id: batch.id };
  }
};

// ========== GIS ==========
export const gisApi = {
  getOverview: async () => {
    const { data, error } = await supabase.from('gis_overview').select('*').single();
    if (error) return handleError(error);
    return data;
  },
  getZones: async () => {
    const { data, error } = await supabase.from('gis_zones').select('*').order('id', { ascending: true });
    if (error) return handleError(error);
    return data;
  },
  getAlerts: async () => {
    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
    if (error) return handleError(error);
    return data;
  },
};

// ========== Capacity ==========
export const capacityApi = {
  getLines: async () => {
    const { data, error } = await supabase.from('production_lines').select('*').order('id', { ascending: true });
    if (error) return handleError(error);
    return data;
  },
  getLogs: async () => {
    const { data, error } = await supabase.from('production_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) return handleError(error);
    return data;
  },
  circuitBreak: async () => {
    const { error } = await supabase.from('production_lines').update({ status: 'Halted', progress: 0, efficiency: '0%' }).neq('status', 'Maintenance');
    if (error) return handleError(error);

    await supabase.from('production_logs').insert({
      log_time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      message: '全链熔断保护已触发，所有活跃产线已锁定',
      log_type: 'error',
    });

    return { message: '已触发全链熔断保护机制！' };
  },
};

// ========== Harvest ==========
export const harvestApi = {
  getLogs: async () => {
    const { data, error } = await supabase.from('harvest_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) return handleError(error);
    return data;
  },
};

// ========== Admin ==========
export const adminApi = {
  getUsers: async () => {
    const { data, error } = await supabase.from('profiles').select('id, user_id, role, display_name, phone, created_at').order('created_at', { ascending: false });
    if (error) return handleError(error);
    return data;
  },
  getTraces: async () => {
    const { data: batches, error } = await supabase.from('traceability_batches').select(`id, batch_code, status, total_nodes, active_nodes, created_at, products ( name )`).order('created_at', { ascending: false });
    if (error) return handleError(error);
    return batches.map((b: any) => ({
      id: b.id,
      batch_code: b.batch_code,
      product_name: b.products?.name || '未知产品',
      status: b.status,
      total_nodes: b.total_nodes,
      active_nodes: b.active_nodes,
      created_at: b.created_at,
    }));
  },
};

