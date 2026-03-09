const API_BASE = '/api';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  // 自动注入认证 token
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '请求失败' }));
      throw new ApiError(errorData.error || '请求失败', response.status);
    }

    return await response.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.error(`[API] Request failed: ${endpoint}`, err);
    throw new ApiError('网络请求失败，请检查网络连接', 0);
  }
}

// ========== Auth ==========
export const authApi = {
  login: (email: string, password: string) =>
    request<{ message: string; user: unknown; session: { access_token: string; refresh_token: string } }>(
      '/auth/login',
      { method: 'POST', body: { email, password } }
    ),
  register: (data: { email: string; password: string; role?: string; display_name?: string; phone?: string }) =>
    request<{ message: string; user: unknown }>('/auth/register', { method: 'POST', body: data }),
  me: () => request<{ user: unknown; profile: unknown }>('/auth/me'),
};

// ========== Dashboard ==========
export const dashboardApi = {
  getStats: () =>
    request<Array<{ id: number; icon: string; label: string; value: string; change_percent: string }>>('/dashboard/stats'),
};

// ========== Products ==========
export const productsApi = {
  list: () => request<Array<Record<string, unknown>>>('/products'),
  detail: (id: string | number) =>
    request<{
      id: number; name: string; grade: string; origin: string; description: string;
      image_url: string; sugar_degree: string; diameter_mm: number; weight_g: number;
      trace_steps: Array<{ title: string; step_time: string; description: string; is_active: boolean; sort_order: number }>;
    }>(`/products/${id}`),
};

// ========== Traceability ==========
export const traceabilityApi = {
  getStats: () =>
    request<{ total_batches: string; node_status: string; query_count_today: string; anomaly_count: number }>('/traceability/stats'),
  getBatches: () => request<Array<Record<string, unknown>>>('/traceability/batches'),
  getBatch: (id: string | number) => request<Record<string, unknown>>(`/traceability/batches/${id}`),
  getNodes: () =>
    request<Array<{ id: number; name: string; latency: string; load: string; status: string }>>('/traceability/nodes'),
};

// ========== GIS ==========
export const gisApi = {
  getOverview: () =>
    request<{ total_production: number; verification_rate: number; system_health: number }>('/gis/overview'),
  getZones: () =>
    request<Array<{ id: number; name: string; color: string; area_value: string }>>('/gis/zones'),
  getAlerts: () =>
    request<Array<{ id: number; title: string; description: string; severity: string; zone_code: string }>>('/gis/alerts'),
};

// ========== Capacity ==========
export const capacityApi = {
  getLines: () =>
    request<Array<{ id: number; name: string; status: string; efficiency: string; daily_output: string; color: string; progress: number }>>('/capacity/lines'),
  getLogs: () =>
    request<Array<{ id: number; log_time: string; message: string; log_type: string }>>('/capacity/logs'),
  circuitBreak: () =>
    request<{ message: string }>('/capacity/circuit-break', { method: 'POST' }),
};

// ========== Harvest ==========
export const harvestApi = {
  getLogs: () =>
    request<Array<{ id: number; log_time: string; user_name: string; action: string; amount: string; location: string }>>('/harvest/logs'),
};

// ========== Admin ==========
export const adminApi = {
  getUsers: () =>
    request<Array<{ id: string; user_id: string; role: string; display_name: string; phone: string; created_at: string }>>('/admin/users'),
  getTraces: () =>
    request<Array<{ id: number; batch_code: string; product_name: string; status: string; total_nodes: number; active_nodes: number; created_at: string }>>('/admin/traces'),
};
