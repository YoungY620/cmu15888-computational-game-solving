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
  chtml: { scale: 1 },
  startup: { typeset: true }
};
(function () {
  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-chtml.min.js';
  s.async = true;
  document.head.appendChild(s);
})();
