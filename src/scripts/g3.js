// G4 连续圆角引擎（全浏览器兼容）
(function () {
  // 已剔除导航栏系控件（.theme-btn/.user-chip/.user-login），它们保持胶囊形
  var SEL = '.home-card, .about-card, .about-small, .admin-container, #post-form, .calendar, .user-card, .comments-card, .post-item, .ios-btn, .ios-btn-secondary, .ios-btn-danger, .tab, .date-btn, .like-btn, .react-btn, .comment-submit, .tag-chip, .sort-btn, .admin-link, .back-btn, .tl-item, input, textarea, .gb-editor, .gb-send, .gb-login-hint';
  var N = 5;
  var STEPS = 14;

  function buildClip(el) {
    if (el.classList.contains('ios-header') && window.innerWidth <= 636) {
      el.style.clipPath = '';
      return;
    }
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

  var ro = new ResizeObserver(function (es) {
    es.forEach(function (e) { buildClip(e.target); });
  });
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
