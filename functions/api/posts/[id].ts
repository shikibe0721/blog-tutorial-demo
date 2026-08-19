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
  const body = await request.json();

  const fields: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(body)) {
    fields.push(`${key} = ?`);
    values.push(key === 'tags' ? JSON.stringify(value) : value);
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
  await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(params.id).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
