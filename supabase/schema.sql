-- =============================================
-- 乡土印迹 (Rural Imprint) - Supabase Schema
-- =============================================

-- 用户扩展信息表（Supabase Auth 已内置 auth.users）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer', 'farmer', 'regulator')),
  display_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- 首页统计数据
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(50) NOT NULL,
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL,
  change_percent VARCHAR(20),
  sort_order INT DEFAULT 0
);

-- 产品表
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  grade VARCHAR(50),
  origin VARCHAR(200),
  description TEXT,
  image_url TEXT,
  sugar_degree VARCHAR(20),
  diameter_mm INT,
  weight_g INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 溯源批次表
CREATE TABLE IF NOT EXISTS traceability_batches (
  id SERIAL PRIMARY KEY,
  batch_code VARCHAR(50) NOT NULL UNIQUE,
  product_id INT REFERENCES products(id),
  status VARCHAR(20) DEFAULT 'active',
  total_nodes INT DEFAULT 0,
  active_nodes INT DEFAULT 0,
  query_count_today INT DEFAULT 0,
  anomaly_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 溯源步骤表
CREATE TABLE IF NOT EXISTS traceability_steps (
  id SERIAL PRIMARY KEY,
  batch_id INT REFERENCES traceability_batches(id) ON DELETE CASCADE,
  step_name VARCHAR(100) NOT NULL,
  step_date VARCHAR(50),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT false,
  is_current BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- GIS 农业分区表
CREATE TABLE IF NOT EXISTS gis_zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50),
  area_value VARCHAR(50),
  zone_type VARCHAR(50) DEFAULT 'production'
);

-- GIS 概览统计
CREATE TABLE IF NOT EXISTS gis_overview (
  id SERIAL PRIMARY KEY,
  total_production DECIMAL(10,1),
  verification_rate DECIMAL(5,1),
  system_health DECIMAL(5,1)
);

-- 预警/熔断表
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'normal' CHECK (severity IN ('critical', 'warning', 'normal')),
  zone_code VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 产线表
CREATE TABLE IF NOT EXISTS production_lines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  status VARCHAR(20) DEFAULT 'Running',
  efficiency VARCHAR(10),
  daily_output VARCHAR(50),
  color VARCHAR(20),
  progress INT DEFAULT 0
);

-- 生产日志表
CREATE TABLE IF NOT EXISTS production_logs (
  id SERIAL PRIMARY KEY,
  line_id INT REFERENCES production_lines(id) ON DELETE SET NULL,
  log_time VARCHAR(10),
  message TEXT NOT NULL,
  log_type VARCHAR(20) DEFAULT 'info' CHECK (log_type IN ('info', 'warn', 'success', 'error')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 采摘动态日志
CREATE TABLE IF NOT EXISTS harvest_logs (
  id SERIAL PRIMARY KEY,
  log_time VARCHAR(10),
  user_name VARCHAR(100),
  action VARCHAR(100),
  amount VARCHAR(50),
  location VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 节点监控
CREATE TABLE IF NOT EXISTS traceability_nodes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  latency VARCHAR(20),
  load VARCHAR(20),
  status VARCHAR(20) DEFAULT 'emerald'
);

-- 产品溯源档案步骤（产品详情页用）
CREATE TABLE IF NOT EXISTS product_trace_steps (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  step_time VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);
