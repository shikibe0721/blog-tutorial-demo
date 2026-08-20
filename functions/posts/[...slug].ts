export async function onRequestGet(context: any) {
  // 读取 public/posts/index.html 的内容并返回
  const url = new URL(context.request.url);
  const postUrl = url.origin + '/posts/index.html';

  try {
    const res = await fetch(postUrl);
    const html = await res.text();
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return new Response('文章加载失败', { status: 500 });
  }
}
