import { json, checkSession } from './_utils';

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  const session = await checkSession(env, token);
  if (!session) return json({ error: '未登录' }, 401);
  return json({ username: session.username });
}
