-- =============================================
-- 修复种子数据导致的 SERIAL 序列不同步问题
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

SELECT setval(pg_get_serial_sequence('traceability_batches', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM traceability_batches;
SELECT setval(pg_get_serial_sequence('traceability_steps', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM traceability_steps;
SELECT setval(pg_get_serial_sequence('dashboard_stats', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM dashboard_stats;
SELECT setval(pg_get_serial_sequence('products', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM products;
SELECT setval(pg_get_serial_sequence('product_trace_steps', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM product_trace_steps;
SELECT setval(pg_get_serial_sequence('gis_zones', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM gis_zones;
SELECT setval(pg_get_serial_sequence('gis_overview', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM gis_overview;
SELECT setval(pg_get_serial_sequence('alerts', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM alerts;
SELECT setval(pg_get_serial_sequence('production_lines', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM production_lines;
SELECT setval(pg_get_serial_sequence('production_logs', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM production_logs;
SELECT setval(pg_get_serial_sequence('harvest_logs', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM harvest_logs;
SELECT setval(pg_get_serial_sequence('traceability_nodes', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM traceability_nodes;
