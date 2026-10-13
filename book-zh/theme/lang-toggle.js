(function () {
  var p = location.pathname;
  var segs = p.split('/');
  var zi = segs.indexOf('zh');
  var target, label;
  if (zi >= 0) {
    segs.splice(zi, 1);
    target = segs.join('/') || '/';
    label = 'English';
  } else {
    var i = (segs.length > 1 && segs[1] && segs[1].indexOf('.html') === -1) ? 2 : 1;
    segs.splice(i, 0, 'zh');
    target = segs.join('/');
    label = '中文';
  }
  var btn = document.createElement('a');
  btn.href = target;
  btn.textContent = label;
  btn.title = 'Switch language / 切换语言';
  btn.className = 'lang-toggle';
  btn.style.cssText = 'margin:0 8px;padding:4px 10px;font-size:14px;line-height:1.5;color:var(--fg);border:1px solid var(--table-header-border,currentColor);border-radius:4px;text-decoration:none;white-space:nowrap;';
  var rb = document.querySelector('.menu-bar .right-buttons');
  if (rb) rb.insertBefore(btn, rb.firstChild);
})();
