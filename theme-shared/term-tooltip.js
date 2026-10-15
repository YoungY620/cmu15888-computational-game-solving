/* Wikipedia 式术语悬浮卡：等 MathJax 排版完成后，把正文中的术语包成链接，
   hover（桌面）/ 点按（移动端）显示一句话简介，点击跳转术语表。 */
(function () {
  var DATA = window.TERMS_DATA;
  if (!DATA) return;
  if (/glossary\.html$/.test(location.pathname)) return;

  function run() {
    var root = document.querySelector('main') || document.body;
    var zh = (document.documentElement.lang || '').startsWith('zh');
    var terms = Object.keys(DATA).sort(function (a, b) { return b.length - a.length; });
    if (!terms.length) return;

    // 书根相对前缀：从页面里 theme/ 资源的相对路径推断（兼容子目录页与任意部署基路径）
    var prefix = '';
    var res = document.querySelectorAll('script[src], link[href]');
    for (var ri = 0; ri < res.length; ri++) {
      var u = res[ri].getAttribute('src') || res[ri].getAttribute('href');
      var m = u && u.match(/^((?:\.\.\/)*)theme\//);
      if (m) { prefix = m[1]; break; }
    }
    var MAX_PER_TERM = 2;
    var counts = {};
    var enRe = null;
    if (!zh) {
      enRe = new RegExp('\\b(' + terms.map(function (t) {
        return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }).join('|') + ')\\b', 'gi');
    }

    function excluded(node) {
      return node.parentElement && node.parentElement.closest(
        'mjx-container, code, pre, a, h1, h2, h3, h4, h5, h6, script, style, .term-tip, .sidebar, .menu-bar');
    }

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return excluded(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (textNode) {
      var node = textNode;
      // 同一节点内持续向后链接：链接最早命中的术语后，继续处理其后的文本，
      // 否则同段中排在其它术语后面的词（如"河牌"跟在"转牌"后）永远得不到链接
      while (node && node.nodeValue && node.nodeValue.trim()) {
        var text = node.nodeValue;
        var found = null, idx = -1, i;
        if (zh) {
          for (i = 0; i < terms.length; i++) {
            if ((counts[terms[i]] || 0) >= MAX_PER_TERM) continue;
            var p = text.indexOf(terms[i]);
            if (p !== -1 && (idx === -1 || p < idx)) { idx = p; found = terms[i]; }
          }
        } else {
          enRe.lastIndex = 0;
          var m;
          while ((m = enRe.exec(text))) {
            var hit = m[1].toLowerCase();
            for (i = 0; i < terms.length; i++) {
              if (terms[i].toLowerCase() === hit && (counts[terms[i]] || 0) < MAX_PER_TERM) {
                found = terms[i]; idx = m.index; break;
              }
            }
            if (found) break;
          }
        }
        if (!found) return;
        // 防御：处理期间 DOM 可能被 MathJax 等并发修改，替换前重新校验节点状态
        if (!node.isConnected || !node.parentNode) return;
        if (idx + found.length > node.nodeValue.length) return;
        counts[found] = (counts[found] || 0) + 1;

        var tail;
        try {
          var a = document.createElement('a');
          a.className = 'term-tip';
          a.dataset.term = found;
          a.href = prefix + 'glossary.html#' + DATA[found].a;
          a.textContent = node.nodeValue.slice(idx, idx + found.length);
          var after = node.splitText(idx);
          tail = after.splitText(found.length);
          node.parentNode.replaceChild(a, after);
        } catch (e) { return; /* 节点已被并发修改则跳过该处 */ }
        node = tail;
      }
    });

    setupCard(prefix, zh);
  }

  function setupCard(prefix, zh) {
    var card = document.createElement('div');
    card.id = 'term-card';
    document.body.appendChild(card);
    var showTimer = null, hideTimer = null;

    function show(link) {
      var term = link.dataset.term;
      var info = DATA[term];
      if (!info) return;
      card.innerHTML = '<strong></strong><p></p><a>' + (zh ? '查看详解 →' : 'Read more →') + '</a>';
      card.querySelector('strong').textContent = term;
      card.querySelector('p').textContent = info.s;
      card.querySelector('a').href = prefix + 'glossary.html#' + info.a;
      card.style.display = 'block';
      var r = link.getBoundingClientRect();
      var w = Math.min(320, window.innerWidth - 16);
      card.style.maxWidth = w + 'px';
      var left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
      var below = r.bottom + 8 + card.offsetHeight < window.innerHeight - 8;
      card.style.left = left + 'px';
      card.style.top = below ? (r.bottom + 8) + 'px' : (r.top - card.offsetHeight - 8) + 'px';
    }
    function scheduleShow(link) {
      clearTimeout(hideTimer);
      showTimer = setTimeout(function () { show(link); }, 200);
    }
    function scheduleHide() {
      clearTimeout(showTimer);
      hideTimer = setTimeout(function () { card.style.display = 'none'; }, 160);
    }

    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (coarse) {
      document.addEventListener('click', function (e) {
        var link = e.target.closest && e.target.closest('a.term-tip');
        if (link) {
          e.preventDefault();
          show(link);
        } else if (!e.target.closest || !e.target.closest('#term-card')) {
          card.style.display = 'none';
        }
      });
    } else {
      document.addEventListener('mouseover', function (e) {
        var link = e.target.closest && e.target.closest('a.term-tip');
        if (link) scheduleShow(link);
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target.closest && e.target.closest('a.term-tip')) scheduleHide();
      });
      card.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
      card.addEventListener('mouseleave', scheduleHide);
    }
  }

  function start() {
    try { run(); } catch (e) { console.error('term-tooltip:', e); }
  }
  // MathJax 库异步加载：config 同步存在但 startup.promise 尚未创建。
  // 轮询等待其出现再链接化，避免与排版过程并发修改文本节点；10s 超时兜底（CDN 不可用时降级为纯链接）。
  (function whenReady(n) {
    if (window.MathJax && MathJax.startup && MathJax.startup.promise) {
      MathJax.startup.promise.then(start, start);
    } else if (n > 100 || !document.querySelector('mjx-container') && n > 100) {
      start();
    } else {
      setTimeout(function () { whenReady(n + 1); }, 100);
    }
  })(0);
})();
