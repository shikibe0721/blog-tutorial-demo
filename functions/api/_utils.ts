export function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// ============ 常量与通用工具 ============

const PBKDF2_ITERATIONS = 150_000;
const HASH_PREFIX = 'pbkdf2$150000$';

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** 恒定时间字符串比较，防时序侧信道 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ============ 密码哈希（PBKDF2-SHA256） ============

async function pbkdf2(password: string, saltHex: string, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex) as unknown as BufferSource, iterations },
    key, 256
  );
  return toHex(bits);
}

/** 生成新格式哈希：pbkdf2$迭代次数$salt$hash */
export async function hashPassword(password: string): Promise<string> {
  const saltHex = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const hash = await pbkdf2(password, saltHex, PBKDF2_ITERATIONS);
  return `${HASH_PREFIX}${saltHex}$${hash}`;
}

/** 旧格式（单轮 SHA-256(salt:password)）验证，用于存量数据过渡 */
async function verifyLegacy(password: string, saltHex: string, expectedHash: string): Promise<boolean> {
  const data = new TextEncoder().encode(saltHex + ':' + password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return timingSafeEqual(toHex(digest), expectedHash);
}

/**
 * 验证密码。支持两种存储格式：
 *  - 新格式：password_hash = 'pbkdf2$150000$salt$hash'（忽略独立 salt 列）
 *  - 旧格式：password_hash = sha256(salt + ':' + password)，salt 在独立列 —— 验证通过后应调用 rehashUser 透明升级
 */
export async function verifyPassword(user: { password_hash: string; salt?: string }, password: string): Promise<boolean> {
  const stored = user.password_hash || '';
  if (stored.startsWith(HASH_PREFIX)) {
    const [, , saltHex, hash] = stored.split('$');
    const computed = await pbkdf2(password, saltHex, PBKDF2_ITERATIONS);
    return timingSafeEqual(computed, hash);
  }
  if (user.salt) {
    return verifyLegacy(password, user.salt, stored);
  }
  return false;
}

/** 登录成功后把旧格式哈希透明升级为 PBKDF2 */
export async function rehashUser(env: any, userId: number | string, password: string): Promise<void> {
  const newHash = await hashPassword(password);
  await env.DB.prepare('UPDATE users SET password_hash = ?, salt = NULL WHERE id = ?').bind(newHash, userId).run();
}

// ============ 用户会话（评论区功能使用） ============

export async function checkSession(env: any, token: string | null) {
  if (!token) return null;
  const session = await env.DB.prepare('SELECT * FROM sessions WHERE token = ?').bind(token).first();
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return session;
}

export function getBearerToken(request: Request): string {
  return (request.headers.get('Authorization') || '').replace('Bearer ', '').trim();
}

// ============ 管理员会话（后台写操作使用） ============

const ADMIN_SESSION_TTL_MS = 12 * 3600 * 1000; // 12 小时

export async function createAdminSession(env: any): Promise<{ token: string; expiresAt: string } | null> {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)).buffer);
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_MS).toISOString();
  try {
    await env.DB.prepare('INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)').bind(token, expiresAt).run();
    return { token, expiresAt };
  } catch {
    return null; // 表不存在等部署问题
  }
}

export async function requireAdmin(context: any) {
  const { request, env } = context;
  const token = getBearerToken(request);
  if (!token) return null;
  let session: any = null;
  try {
    session = await env.DB.prepare('SELECT * FROM admin_sessions WHERE token = ?').bind(token).first();
  } catch {
    return null;
  }
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    await env.DB.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return session;
}

export const UNAUTHORIZED = json({ error: '未授权，请先登录管理后台' }, 401);
