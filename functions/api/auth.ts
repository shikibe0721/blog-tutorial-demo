// 服务端记录失败次数和时间
const failRecord: Record<string, { count: number; lockUntil: number }> = {};

export async function onRequestPost(context: any) {
  const { request, env } = context;

  // 用 IP 作为标识（Cloudflare 会自动注入 CF-Connecting-IP）
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  const record = failRecord[ip] || { count: 0, lockUntil: 0 };
  const now = Date.now();

  // 检查是否被锁定
  if (now < record.lockUntil) {
    const remain = Math.ceil((record.lockUntil - now) / 1000);
    return new Response(
      JSON.stringify({ error: '操作太频繁，请 ' + remain + ' 秒后再试', locked: true }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { password } = await request.json();

  if (password === env.ADMIN_PASSWORD) {
    // 登录成功，清除失败记录
    delete failRecord[ip];
    return new Response(JSON.stringify({ token: 'authenticated' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 密码错误，累加计数
  record.count++;
  if (record.count >= 5) {
    record.lockUntil = now + 60000; // 锁定 60 秒
    record.count = 0;
  }
  failRecord[ip] = record;

  const remaining = 5 - record.count;
  return new Response(
    JSON.stringify({
      error: remaining > 0
        ? '密码错误（还剩 ' + remaining + ' 次机会）'
        : '错误次数过多，已锁定 60 秒',
      locked: remaining <= 0,
    }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
}
