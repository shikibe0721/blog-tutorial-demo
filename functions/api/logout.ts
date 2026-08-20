import { json } from './_utils';

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { token } = await request.json();
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token || '').run();
  } catch {}
  return json({ ok: true });
}
