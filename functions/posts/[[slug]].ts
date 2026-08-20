export async function onRequestGet() {
  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />
<title>文章详情</title>
<script>
  (function () {
    var saved = localStorage.getItem('theme');
    var dark;
    if (saved) { dark = saved === 'dark'; }
    else { var h = new Date().getHours(); dark = (h >= 19 || h < 7); }
    if (dark) document.documentElement.classList.add('dark');
  })();
</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css" />
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
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
    background: rgba(255,255,255,0.22);
    backdrop-filter: blur(4px) saturate(180%);
    -webkit-backdrop-filter: blur(4px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.35);
    box-shadow: 0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 14px rgba(255,255,255,0.22);
  }
  html.dark .ios-header {
    background: rgba(25,25,45,0.5);
    border-color: rgba(255,255,255,0.12);
    box-shadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 14px rgba(255,255,255,0.06);
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
    box-shadow: 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 16px rgba(255,255,255,0.15);
  }
  html.dark .card {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.14);
    box-shadow: 0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 16px rgba(255,255,255,0.05);
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

  pre.code-block {
    background: #282c34;
    border-radius: 12px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  }
  pre.code-block code {
    font-family: "SF Mono", "Fira Code", Consolas, monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    background: none;
  }

  /* === 点赞 === */
  .like-row { text-align: center; margin: 1.5rem 0 0.8rem; }
  .like-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1.2rem; border-radius: 999px;
    background: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.4);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    font-size: 0.95rem; color: #1d1d1f; cursor: pointer; transition: all 0.2s;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.35);
  }
  .like-btn:hover { transform: scale(1.05); }
  .like-btn.liked { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.3); color: #6366f1; }
  html.dark .like-btn { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #e8e8f0; }
  html.dark .like-btn.liked { background: rgba(165,166,255,0.15); border-color: rgba(165,166,255,0.3); color: #a5a6ff; }

  /* === 表情快评 === */
  .react-row { display: flex; justify-content: center; gap: 0.5rem; margin: 0 0 1.5rem; flex-wrap: wrap; }
  .react-btn {
    padding: 0.35rem 0.9rem; border-radius: 999px;
    background: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.4);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    font-size: 0.9rem; cursor: pointer; transition: all 0.2s; color: #1d1d1f;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.35);
  }
  .react-btn:hover { transform: scale(1.08); }
  .react-btn.mine { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.35); }
  .react-n { font-size: 0.75rem; color: #888; }
  .react-btn.mine .react-n { color: #6366f1; }
  html.dark .react-btn { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #e8e8f0; }
  html.dark .react-btn.mine { background: rgba(165,166,255,0.15); border-color: rgba(165,166,255,0.35); }
  html.dark .react-n { color: #8888a0; }

  /* === 评论区 === */
  .comments-card {
    margin-top: 0.5rem; padding: 1.5rem;
    background: rgba(255,255,255,0.45);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.5); border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4);
  }
  html.dark .comments-card {
    background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.14);
    box-shadow: 0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .comments-title { margin: 0 0 1rem; font-size: 1.1rem; color: #1d1d1f; }
  html.dark .comments-title { color: #f2f2fa; }
  .comment-item { display: flex; gap: 0.7rem; padding: 0.8rem 0; border-bottom: 1px solid rgba(128,128,128,0.15); }
  .comment-item:last-child { border-bottom: none; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; font-weight: 600; flex-shrink: 0;
  }
  .comment-body { flex: 1; }
  .comment-head { display: flex; align-items: baseline; gap: 0.5rem; }
  .comment-name { font-weight: 600; font-size: 0.9rem; color: #1d1d1f; }
  html.dark .comment-name { color: #e8e8f0; }
  .comment-time { font-size: 0.75rem; color: #999; }
  .comment-text { margin: 0.3rem 0 0; font-size: 0.92rem; line-height: 1.6; color: #444; white-space: pre-wrap; }
  html.dark .comment-text { color: #c2c2d4; }
  .comment-form { margin-top: 1rem; }
  .comment-form textarea {
    width: 100%; padding: 0.6rem 0.9rem; border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.1); background: rgba(255,255,255,0.5);
    font-size: 0.92rem; color: #1d1d1f; outline: none; box-sizing: border-box;
    resize: vertical; font-family: inherit;
  }
  .comment-form textarea:focus { border-color: rgba(99,102,241,0.5); }
  html.dark .comment-form textarea { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #e8e8f0; }
  .comment-submit-row { display: flex; justify-content: flex-end; margin-top: 0.5rem; }
  .comment-submit {
    padding: 0.45rem 1.2rem; border-radius: 999px;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2);
    color: #6366f1; font-size: 0.9rem; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; white-space: nowrap;
    transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s, color 0.3s, border-color 0.3s;
  }
  .comment-submit:hover { background: rgba(99,102,241,0.2); }
  html.dark .comment-submit { background: rgba(165,166,255,0.12); border-color: rgba(165,166,255,0.25); color: #a5a6ff; }
  .comment-submit.morphed {
    background: rgba(17, 17, 20, 0.9);
    border-color: rgba(17, 17, 20, 0.9);
    color: #fff;
  }
  html.dark .comment-submit.morphed {
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(255, 255, 255, 0.92);
    color: #111;
  }
  .m-check {
    display: inline-flex; width: 18px; height: 18px; border-radius: 50%;
    border: 1px solid currentColor; align-items: center; justify-content: center;
    margin-right: 0.4rem; font-size: 0.7rem; flex-shrink: 0;
  }
  .login-hint { margin-top: 1rem; font-size: 0.9rem; color: #888; }

  @media screen and (max-width: 636px) {
    .nav-links { display: none; }
  }

  /* === G3 连续圆角统一设置（已剔除导航栏系控件） === */
  :root { --r: 12px; }
  .nav-links a, .back-btn, .card, .like-btn, .react-btn, .comments-card, .comment-submit, .comment-form textarea, .tag, pre.code-block {
    border-radius: var(--r) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 12px rgba(255,255,255,0.1) !important;
    filter: drop-shadow(0 4px 14px rgba(0,0,0,0.08));
  }
  html.dark .card, html.dark .comments-card {
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 12px rgba(255,255,255,0.05) !important;
    filter: drop-shadow(0 4px 18px rgba(0,0,0,0.4));
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
      <a href="/archive">归档</a>
      <a href="/about">关于</a>
    </nav>
    <div class="user-area" id="user-area"></div>
  </div>
</header>
<div class="container">
  <div id="post-detail"><p class="loading">加载中...</p></div>

  <div id="engage" style="display:none;">
    <div class="like-row">
      <button type="button" id="like-btn" class="like-btn">👍 <span id="like-count">0</span></button>
    </div>
    <div class="react-row" id="react-row"></div>
    <div class="comments-card">
      <h3 class="comments-title">💬 评论</h3>
      <div id="comment-list"></div>
      <div id="comment-form-area"></div>
    </div>
  </div>

  <a href="/blog" class="back-btn">← 返回博客列表</a>
</div>
<script>
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

  function getToken() { return localStorage.getItem('mayu_token'); }
  function authHeaders() {
    var h = { 'Content-Type': 'application/json' };
    var t = getToken();
    if (t) h['Authorization'] = 'Bearer ' + t;
    return h;
  }
  function fmtTime(s) {
    try {
      var d = new Date(s + 'Z');
      return (d.getMonth() + 1) + '-' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    } catch (e) { return s; }
  }

  function morphConfirm(btn, msg) {
    if (btn.dataset.morphing) return;
    btn.dataset.morphing = '1';
    var oldW = btn.offsetWidth;
    var oldHTML = btn.innerHTML;
    btn.style.width = oldW + 'px';
    btn.classList.add('morphed');
    btn.innerHTML = '<span class="m-check">✓</span>' + msg;
    btn.style.width = 'auto';
    var newW = btn.offsetWidth;
    btn.style.width = oldW + 'px';
    void btn.offsetWidth;
    btn.style.width = newW + 'px';
    setTimeout(function () {
      btn.style.width = oldW + 'px';
      setTimeout(function () {
        btn.classList.remove('morphed');
        btn.innerHTML = oldHTML;
        btn.style.width = '';
        delete btn.dataset.morphing;
      }, 460);
    }, 1600);
  }

  // === 表情快评 ===
  var EMOJIS = ['👍', '❤️', '😂', '🤔'];
  async function loadReactions(slug) {
    var res = await fetch('/api/reactions?slug=' + encodeURIComponent(slug), { headers: authHeaders() });
    if (!res.ok) return;
    var data = await res.json();
    var row = document.getElementById('react-row');
    row.innerHTML = EMOJIS.map(function (e) {
      var c = data.counts[e] || 0;
      var mine = data.mine.indexOf(e) !== -1;
      return '<button type="button" class="react-btn' + (mine ? ' mine' : '') + '" data-emoji="' + e + '">' + e + (c > 0 ? ' <span class="react-n">' + c + '</span>' : '') + '</button>';
    }).join('');
    row.querySelectorAll('.react-btn').forEach(function (b) {
      b.addEventListener('click', async function () {
        if (!getToken()) { window.location.href = '/user'; return; }
        var r = await fetch('/api/reactions', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ slug: slug, emoji: b.dataset.emoji }) });
        if (r.ok) loadReactions(slug);
      });
    });
  }

  async function loadLike(slug) {
    var res = await fetch('/api/like?slug=' + encodeURIComponent(slug), { headers: authHeaders() });
    if (!res.ok) return;
    var data = await res.json();
    var btn = document.getElementById('like-btn');
    document.getElementById('like-count').textContent = data.count;
    btn.classList.toggle('liked', data.liked);
    btn.onclick = async function () {
      if (!getToken()) { window.location.href = '/user'; return; }
      var r = await fetch('/api/like', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ slug: slug }) });
      if (r.ok) loadLike(slug);
    };
  }

  async function loadComments(slug) {
    var res = await fetch('/api/comments?slug=' + encodeURIComponent(slug));
    var list = await res.json();
    var el = document.getElementById('comment-list');
    if (!Array.isArray(list) || list.length === 0) {
      el.innerHTML = '<p class="login-hint" style="margin:0;">还没有评论，来抢沙发！</p>';
      return;
    }
    el.innerHTML = list.map(function (c) {
      return '<div class="comment-item">' +
        '<div class="avatar">' + esc(String(c.username).charAt(0).toUpperCase()) + '</div>' +
        '<div class="comment-body">' +
        '<div class="comment-head"><span class="comment-name">' + esc(c.username) + '</span><span class="comment-time">' + fmtTime(c.created_at) + '</span></div>' +
        '<p class="comment-text">' + esc(c.content) + '</p>' +
        '</div></div>';
    }).join('');
  }

  function renderCommentForm(slug) {
    var area = document.getElementById('comment-form-area');
    var user = localStorage.getItem('mayu_user');
    if (!user || !getToken()) {
      area.innerHTML = '<p class="login-hint"><a href="/user">登录</a>后参与讨论~</p>';
      return;
    }
    area.innerHTML = '<div class="comment-form"><textarea id="comment-input" rows="3" maxlength="500" placeholder="说点什么...（最多 500 字）"></textarea><div class="comment-submit-row"><button type="button" class="comment-submit" id="comment-submit">评论</button></div></div>';
    document.getElementById('comment-submit').addEventListener('click', async function () {
      var input = document.getElementById('comment-input');
      var text = input.value.trim();
      if (!text) { alert('评论不能为空'); return; }
      var r = await fetch('/api/comments', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ slug: slug, content: text }) });
      var data = await r.json().catch(function () { return {}; });
      if (r.ok) {
        input.value = '';
        loadComments(slug);
        morphConfirm(document.getElementById('comment-submit'), '已评论');
      } else {
        alert(data.error || '评论失败');
      }
    });
  }

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
      var codeBlocks = [];
      content = content.replace(/\`\`\`(\w*)\\n([\s\S]*?)\`\`\`/g, function (m, lang, code) {
        codeBlocks.push('<pre class="code-block"><code class="language-' + (lang || 'text') + '">' + esc(code) + '</code></pre>');
        return '@@CODE' + (codeBlocks.length - 1) + '@@';
      });
      content = content
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\\n\\n/g, '</p><p>')
        .replace(/\\n/g, '<br/>');
      content = '<p>' + content + '</p>';
      content = content.replace(/@@CODE(\d+)@@/g, function (m, i) { return codeBlocks[+i]; });
      content = content.split('<p><pre').join('<pre').split('</pre></p>').join('</pre>').split('<p><br/></p>').join('');

      container.innerHTML = '<article class="card">' +
        '<h1 class="title">' + esc(post.title) + '</h1>' +
        '<p class="meta">📅 ' + esc(post.pub_date) + ' · ✍️ ' + esc(post.author) + '</p>' +
        (tags.length > 0 ? '<div style="margin-bottom:1.5rem;">' + tagHtml + '</div>' : '') +
        '<hr style="border:none;border-top:1px solid rgba(128,128,128,0.2);margin:1.5rem 0;" />' +
        '<div class="post-content">' + content + '</div>' +
        '</article>';

      if (window.hljs) hljs.highlightAll();

      document.getElementById('engage').style.display = 'block';
      loadLike(slug);
      loadReactions(slug);
      loadComments(slug);
      renderCommentForm(slug);
    } catch (e) {
      document.getElementById('post-detail').innerHTML = '<p style="color:red;">加载失败</p>';
    }
  }
  loadPost();
</script>
<script>
(function () {
  // 已经彻底剔除 .ios-header 等导航栏控件，保护 999px 胶囊圆角！
  var SEL = '.nav-links a, .back-btn, .card, .like-btn, .react-btn, .comments-card, .comment-submit, .comment-form textarea, .tag, pre.code-block';
  var N = 5, STEPS = 14; // N=5：曲率过渡更明显，squircle 感更强
  function buildClip(el) {
    var w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    var r = parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 12;
    r = Math.min(r, w / 2, h / 2);
    var pts = [];
    function push(x, y) { pts.push(x.toFixed(2) + 'px ' + y.toFixed(2) + 'px'); }
    var i, t, c, s;
    for (i = 0; i <= STEPS; i++) { t = (Math.PI/2)*(i/STEPS); c = Math.pow(Math.cos(t),2/N); s = Math.pow(Math.sin(t),2/N); push(r-r*c, r-r*s); }
    for (i = 0; i <= STEPS; i++) { t = (Math.PI/2)*(i/STEPS); c = Math.pow(Math.cos(t),2/N); s = Math.pow(Math.sin(t),2/N); push(w-r+r*s, r-r*c); }
    for (i = 0; i <= STEPS; i++) { t = (Math.PI/2)*(i/STEPS); c = Math.pow(Math.cos(t),2/N); s = Math.pow(Math.sin(t),2/N); push(w-r+r*c, h-r+r*s); }
    for (i = 0; i <= STEPS; i++) { t = (Math.PI/2)*(i/STEPS); c = Math.pow(Math.cos(t),2/N); s = Math.pow(Math.sin(t),2/N); push(r-r*s, h-r+r*c); }
    el.style.clipPath = 'polygon(' + pts.join(',') + ')';
  }
  var ro = new ResizeObserver(function (es) { es.forEach(function (e) { buildClip(e.target); }); });
  function hook(el) { buildClip(el); ro.observe(el); }
  function applyAll() { document.querySelectorAll(SEL).forEach(hook); }
  applyAll();
  window.addEventListener('load', applyAll);
  window.addEventListener('resize', applyAll);
  new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.matches && n.matches(SEL)) hook(n);
        if (n.querySelectorAll) n.querySelectorAll(SEL).forEach(hook);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
