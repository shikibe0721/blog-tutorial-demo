export async function onRequestGet() {
  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />
<title>文章详情</title>
<script>
  if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
</script>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: linear-gradient(135deg, #e0f0ff 0%, #f0e6ff 50%, #ffe6f0 100%);
    background-attachment: fixed;
    min-height: 100vh;
    margin: 0;
    padding: 6rem 1rem 2rem;
    color: #1d1d1f;
  }
  html.dark body {
    background: linear-gradient(135deg, #0d1022 0%, #1a1035 50%, #200d2e 100%);
    color: #e8e8f0;
  }
  .container { max-width: 700px; margin: 0 auto; }
  a { color: #6366f1; text-decoration: none; }
  html.dark a { color: #a5a6ff; }

  .ios-header {
    position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
    z-index: 1000; width: calc(100% - 24px); max-width: 780px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.6rem 1.2rem; border-radius: 999px;
    background: rgba(255,255,255,0.25);
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.35);
    box-shadow: 0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4);
  }
  html.dark .ios-header {
    background: rgba(25,25,45,0.55);
    border-color: rgba(255,255,255,0.12);
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }
  .right-side { display: flex; align-items: center; gap: 0.25rem; }
  .logo { font-weight: 700; font-size: 1.1rem; color: #1d1d1f; letter-spacing: -0.02em; }
  html.dark .logo { color: #e8e8f0; }
  .nav-links { display: flex; gap: 0.25rem; }
  .nav-links a { padding: 0.4rem 0.9rem; border-radius: 999px; font-size: 0.9rem; font-weight: 500; color: #1d1d1f; }
  .nav-links a:hover { background: rgba(255,255,255,0.35); }
  html.dark .nav-links a { color: #e8e8f0; }
  html.dark .nav-links a:hover { background: rgba(255,255,255,0.1); }
  .theme-btn { background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.3); border-radius: 999px; padding: 0.3rem 0.6rem; font-size: 1rem; cursor: pointer; }
  html.dark .theme-btn { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); }
  .user-area { display: flex; align-items: center; gap: 0.2rem; }
  .user-chip { padding: 0.3rem 0.8rem; border-radius: 999px; background: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.35); font-size: 0.85rem; font-weight: 500; color: #1d1d1f; max-width: 12ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  html.dark .user-chip { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); color: #e8e8f0; }
  .user-logout { background: none; border: none; cursor: pointer; font-size: 0.9rem; padding: 0.2rem 0.45rem; border-radius: 999px; color: #888; }
  .user-login { padding: 0.3rem 0.9rem; border-radius: 999px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); color: #6366f1; font-size: 0.85rem; font-weight: 500; }
  html.dark .user-login { background: rgba(165,166,255,0.12); border-color: rgba(165,166,255,0.25); color: #a5a6ff; }

  .back-btn { display: inline-block; padding: 0.4rem 1rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 999px; color: #6366f1; font-weight: 500; margin-top: 2rem; }
  html.dark .back-btn { background: rgba(165,166,255,0.12); border-color: rgba(165,166,255,0.25); color: #a5a6ff; }

  .card {
    padding: 2rem;
    background: rgba(255,255,255,0.45);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  html.dark .card {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.14);
    box-shadow: 0 4px 24px rgba(0,0,0,0.35);
  }
  .title { margin: 0 0 0.5rem; font-size: 1.8rem; font-weight: 700; color: #1d1d1f; }
  html.dark .title { color: #f2f2fa; }
  .meta { color: #888; font-size: 0.9rem; margin: 0 0 1rem; }
  html.dark .meta { color: #8888a0; }
  .tag { display: inline-block; margin-right: 0.4rem; padding: 0.15rem 0.6rem; background: rgba(99,102,241,0.1); color: #6366f1; border-radius: 999px; font-size: 0.8rem; font-weight: 500; }
  html.dark .tag { background: rgba(165,166,255,0.15); color: #a5a6ff; }
  .post-content { line-height: 1.8; color: #333; }
  html.dark .post-content { color: #c2c2d4; }
  .post-content h1, .post-content h2, .post-content h3 { color: #1d1d1f; margin: 1.5rem 0 0.5rem; }
  html.dark .post-content h1, html.dark .post-content h2, html.dark .post-content h3 { color: #f2f2fa; }
  .post-content p { margin: 0.8rem 0; }
  .post-content li { margin-left: 1.5rem; margin-bottom: 0.3rem; }
  .loading { color: #888; }

  @media screen and (max-width: 636px) {
    .nav-links { display: none; }
  }
</style>
</head>
<body>
<header class="ios-header">
  <a href="/" class="logo">Mayu's Blog</a>
  <div class="right-side">
    <button type="button" class="theme-btn" id="theme-toggle" title="切换深浅模式">🌙</button>
    <nav class="nav-links">
      <a href="/">首页</a>
      <a href="/blog">博客</a>
      <a href="/about">关于</a>
    </nav>
    <div class="user-area" id="user-area"></div>
  </div>
</header>
<div class="container">
  <div id="post-detail"><p class="loading">加载中...</p></div>
  <a href="/blog" class="back-btn">← 返回博客列表</a>
</div>
<script>
  // === 主题切换 ===
  var themeBtn = document.getElementById('theme-toggle');
  function updateThemeIcon() {
    themeBtn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
  }
  themeBtn.addEventListener('click', function () {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
  });
  updateThemeIcon();

  // === 用户区域 ===
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function renderUserArea() {
    var area = document.getElementById('user-area');
    var user = localStorage.getItem('mayu_user');
    var token = localStorage.getItem('mayu_token');
    if (user && token) {
      area.innerHTML = '<span class="user-chip">👤 ' + esc(user) + '</span><button type="button" class="user-logout" id="nav-logout" title="退出登录">⎋</button>';
      document.getElementById('nav-logout').addEventListener('click', function () {
        fetch('/api/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: token }) }).catch(function () {});
        localStorage.removeItem('mayu_token');
        localStorage.removeItem('mayu_user');
        renderUserArea();
      });
    } else {
      area.innerHTML = '<a href="/user" class="user-login">登录</a>';
    }
  }
  renderUserArea();

  // === 加载文章 ===
  async function loadPost() {
    var pathParts = window.location.pathname.split('/').filter(Boolean);
    var slug = pathParts[pathParts.length - 1];
    try {
      var res = await fetch('/api/posts');
      var posts = await res.json();
      var post = posts.find(function (p) { return p.slug === slug; });
      var container = document.getElementById('post-detail');
      if (!post) { container.innerHTML = '<p class="loading">文章不存在</p>'; return; }
      document.title = post.title + " | Mayu's Blog";
      var tags = JSON.parse(post.tags || '[]');
      var tagHtml = tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
      var content = post.content || '';
      content = content
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\\n\\n/g, '</p><p>')
        .replace(/\\n/g, '<br/>');
      content = '<p>' + content + '</p>';
      container.innerHTML = '<article class="card">' +
        '<h1 class="title">' + esc(post.title) + '</h1>' +
        '<p class="meta">📅 ' + esc(post.pub_date) + ' · ✍️ ' + esc(post.author) + '</p>' +
        (tags.length > 0 ? '<div style="margin-bottom:1.5rem;">' + tagHtml + '</div>' : '') +
        '<hr style="border:none;border-top:1px solid rgba(128,128,128,0.2);margin:1.5rem 0;" />' +
        '<div class="post-content">' + content + '</div>' +
        '</article>';
    } catch (e) {
      document.getElementById('post-detail').innerHTML = '<p style="color:red;">加载失败</p>';
    }
  }
  loadPost();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
