export async function onRequestGet(context: any) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    'SELECT * FROM posts ORDER BY pub_date DESC'
  ).all();

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const body = await request.json();
  const { title, slug, content, description, author, tags, cover_url, cover_alt, pub_date } = body;

  const result = await env.DB.prepare(`
    INSERT INTO posts (title, slug, content, description, author, tags, cover_url, cover_alt, pub_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    title, slug, content || '', description || '', author || 'Mayu',
    JSON.stringify(tags || []), cover_url || '', cover_alt || '', pub_date
  ).run();

  return new Response(JSON.stringify({ id: result.meta.last_row_id, success: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
