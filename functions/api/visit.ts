import { json } from './_utils';

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const today = new Date().toISOString().slice(0, 10);

  // 总访问量 PV +1
  await env.DB.prepare("INSERT OR IGNORE INTO stats (key, value) VALUES ('pv', 0)").run();
  await env.DB.prepare("UPDATE stats SET value = value + 1 WHERE key = 'pv'").run();

  // 记录今日独立访客
  await env.DB.prepare('INSERT OR IGNORE INTO visits (visit_date, ip) VALUES (?, ?)').bind(today, ip).run();

  const pv = await env.DB.prepare("SELECT value FROM stats WHERE key = 'pv'").first();
  const todayUv = await env.DB.prepare('SELECT COUNT(*) AS n FROM visits WHERE visit_date = ?').bind(today).first();
  const allUv = await env.DB.prepare('SELECT COUNT(DISTINCT ip) AS n FROM visits').first();

  return json({ pv: pv.value, today: todayUv.n, uv: allUv.n });
}
