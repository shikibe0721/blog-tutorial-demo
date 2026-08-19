export async function onRequestPost(context: any) {
  const { request, env } = context;
  const { password } = await request.json();

  if (password === env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ token: 'authenticated' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Invalid password' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
