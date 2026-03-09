-- =============================================
-- 乡土印迹 (Rural Imprint) - 种子数据
-- 将前端硬编码的数据迁移到数据库
-- =============================================

-- 首页统计数据 (LandingPage)
INSERT INTO dashboard_stats (icon, label, value, change_percent, sort_order) VALUES
('grid_view', '已上链地块数量', '1,280', '+12.4%', 1),
('qr_code_2', '累计赋码量', '85,620,000', '+25.8%', 2),
('shield', '成功拦截仿冒次数', '3,420', '+5.2%', 3);

-- 产品 (ProductDetail)
INSERT INTO products (id, name, grade, origin, description, image_url, sugar_degree, diameter_mm, weight_g) VALUES
(1, '攀枝花凯特芒果', '特级', '攀枝花米易基地', '源自北纬26度黄金产区，每一颗都经过严格筛选。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYbU9p-bToxo10RW2GKxZ3AhPSnvBk208MzJU5AIfssGdnX6zf4ZLhlL4k2KzDnsrDOUcYQ3wFF7alZNZiw-jFsozbeuJZza9uMktJzowm_xon3NZ7hMzYsr6zUCRJ3PgZVFQUmMM7XtShgqVC5d3_pNYGCfL3WAdYgJ5iczLDE0ZVkGRQQJHyUvmEudw2Ho7AfVrAA2xMgPPT1bEfzoiHfX1D9CH2tq-lzQHS6-bhdt-qMb3HIXYxKzyhsaGCryYv9yThaWD3GU', '16.8°', 85, 420);

-- 产品溯源档案步骤
INSERT INTO product_trace_steps (product_id, title, step_time, description, is_active, sort_order) VALUES
(1, '采摘入库', '2026-11-15 08:30', '由果农张三完成采摘，经初检合格。', true, 1),
(1, '分选包装', '2026-11-16 14:20', '进入智能分选线，完成糖度无损检测。', true, 2),
(1, '冷链运输', '2026-11-17 09:00', '装车发往北京配送中心，车厢温度 5°C。', true, 3),
(1, '终端上架', '2026-11-19 10:00', '到达盒马鲜生(朝阳店)。', false, 4);

-- 溯源批次 (TraceabilityDashboard)
INSERT INTO traceability_batches (id, batch_code, product_id, status, total_nodes, active_nodes, query_count_today, anomaly_count) VALUES
(1, 'CN-FJ-2026-0901-A2', 1, 'active', 16, 16, 450200, 0);

-- 溯源步骤
INSERT INTO traceability_steps (batch_id, step_name, step_date, icon, is_active, is_current, sort_order) VALUES
(1, '生态种植', '2026.09.01', 'potted_plant', true, false, 1),
(1, '标准化采收', '2026.11.15', 'inventory', true, false, 2),
(1, '精细加工', '2026.11.18', 'factory', true, false, 3),
(1, '冷链物流', '进行中', 'local_shipping', true, true, 4),
(1, '零售终端', '等待接入', 'storefront', false, false, 5);

-- 溯源节点监控
INSERT INTO traceability_nodes (name, latency, load, status) VALUES
('武夷山核心节点', '14ms', '1.2G', 'emerald'),
('北京备灾节点', '28ms', '0.8G', 'emerald'),
('加工厂监测点', '35ms', '0.5G', 'emerald'),
('运输车终端 (移动)', '120ms', '5G', 'amber');

-- GIS 数据 (GISDashboard)
INSERT INTO gis_overview (total_production, verification_rate, system_health) VALUES
(852.4, 92.3, 99.8);

INSERT INTO gis_zones (name, color, area_value, zone_type) VALUES
('华东主产区', 'bg-emerald-500', '142.1k ha', 'production'),
('西南生态区', 'bg-blue-500', '89.4k ha', 'ecology'),
('北部旱作区', 'bg-amber-500', '210.8k ha', 'dryland');

-- 预警数据
INSERT INTO alerts (title, description, severity, zone_code) VALUES
('极端天气熔断 - W204', '南部产区发生特大暴雨，自动触发保护性核销中止。', 'critical', 'W204'),
('供需波动预警 - S109', '东部区小麦产量超出预期3.2%，建议调整物流配置。', 'normal', 'S109');

-- 产线数据 (CapacityControl)
INSERT INTO production_lines (id, name, status, efficiency, daily_output, color, progress) VALUES
(1, '凯特芒果 - 产线 A', 'Running', '94%', '1,240 吨/日', 'emerald', 94),
(2, '吉禄芒果 - 产线 B', 'Maintenance', '0%', '0 吨/日', 'rose', 0),
(3, '金煌芒果 - 产线 C', 'Warning', '78%', '850 吨/日', 'amber', 78);

-- 生产日志
INSERT INTO production_logs (line_id, log_time, message, log_type) VALUES
(1, '14:20', '产线 A 效率下降 2%', 'warn'),
(1, '14:15', '批次 #8829 完成质检', 'info'),
(1, '13:50', '模型参数自动校准', 'success'),
(1, '13:30', '新订单接入: 500吨', 'info');

-- 采摘动态 (VRMuseum)
INSERT INTO harvest_logs (log_time, user_name, action, amount, location) VALUES
('10:24', '张** (果农)', '采摘入库', '50kg', 'A-04区'),
('10:21', '李** (质检)', '糖度检测', '14.2°', 'B-12区'),
('10:15', '王** (物流)', '装车发货', '200箱', 'C-01区'),
('09:58', '赵** (果农)', '采摘入库', '45kg', 'A-05区'),
('09:42', '系统自动', '环境监测', '24°C/65%', '全域'),
('09:30', '刘** (果农)', '施肥作业', '有机肥', 'D-02区');
