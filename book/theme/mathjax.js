window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    macros: {
      coloneqq: '\\mathrel{:=}',
      textsc: ['\\textrm{#1}', 1]
    }
  },
  chtml: {
    scale: 1.08,
    mtextInheritFont: true
  },
  output: {
    displayOverflow: 'linebreak',
    linebreaks: { inline: true, width: '100%', lineleading: 0.2 }
  },
  startup: { typeset: true }
};
(function () {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-chtml.js';
  s.async = true;
  document.head.appendChild(s);
})();
