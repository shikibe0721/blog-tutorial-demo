import { requireAdmin, UNAUTHORIZED, json } from '../_utils';

// 可更新列白名单——杜绝把请求体任意键拼进 SQL（列名注入）
const ALLOWED_COLUMNS = new Set([
  'title', 'slug', 'content', 'description',
  'author', 'tags', 'cover_url', 'cover_alt', 'pub_date',
]);

export async function onRequestGet(context: any) {
  const { env, params } = context;
  const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(params.id).first();

  if (!post) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(post), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPut(context: any) {
  const { request, env, params } = context;

  if (!(await requireAdmin(context))) return UNAUTHORIZED;

  const body = await request.json();

  const fields: string[] = [];
  const values: any[] = [];
  const rejected: string[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_COLUMNS.has(key)) { rejected.push(key); continue; }
    fields.push(`"${key}" = ?`);
    values.push(key === 'tags' ? JSON.stringify(value) : value);
  }

  if (rejected.length > 0) {
    return json({ error: '包含不允许更新的字段: ' + rejected.join(', ') }, 400);
  }
  if (fields.length === 0) {
    return json({ error: '没有可更新的字段' }, 400);
  }

  fields.push("updated_at = datetime('now')");
  values.push(params.id);

  await env.DB.prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestDelete(context: any) {
  const { env, params } = context;

  if (!(await requireAdmin(context))) return UNAUTHORIZED;

  await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(params.id).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
