import { checkSession, json } from '../_utils';

function getToken(request: Request) {
  return (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
}

async function requireSession(context: any) {
  const token = getToken(context.request);
  const session = await checkSession(context.env, token);
  if (!session) return null;
  return session;
}

export async function onRequestGet(context: any) {
  const { env, params } = context;
  const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(params.id).first();

  if (!post) {
    return json({ error: 'Not found' }, 404);
  }

  return json(post);
}

export async function onRequestPut(context: any) {
  const session = await requireSession(context);
  if (!session) return json({ error: '未登录' }, 401);

  const { request, env, params } = context;
  const body = await request.json();
  const allowedFields = ['title', 'slug', 'content', 'description', 'author', 'tags', 'cover_url', 'cover_alt', 'pub_date'];
  const fields: string[] = [];
  const values: any[] = [];

  for (const key of allowedFields) {
    if (!(key in body)) continue;
    fields.push(`${key} = ?`);
    values.push(key === 'tags' ? JSON.stringify(body[key]) : body[key]);
  }

  if (fields.length === 0) return json({ error: '没有可更新的内容' }, 400);

  fields.push("updated_at = datetime('now')");
  values.push(params.id);

  await env.DB.prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();

  return json({ success: true });
}

export async function onRequestDelete(context: any) {
  const session = await requireSession(context);
  if (!session) return json({ error: '未登录' }, 401);

  const { env, params } = context;
  await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(params.id).run();

  return json({ success: true });
}
