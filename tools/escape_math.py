#!/usr/bin/env python3
"""保护 Markdown 文件中的数学公式，防止 Markdown 解析器破坏 LaTeX。

问题（CommonMark / pulldown-cmark 在 MathJax 之前先解析 Markdown）：
- 公式内 `\\,` `\\;` `\\{` `\\|` 等反斜杠+标点被当作 Markdown 转义吞掉；
- `}` / `$` 旁的 `_`（如 \\mathcal{A}_1）被当成斜体定界符变成 <em>；`*` 同理。

修复：在 $...$ / $$...$$ 范围内把 `\\` 翻倍、`_`/`*` 加反斜杠——Markdown 输出后
还原为原始 LaTeX，MathJax 拿到完整公式。

用法:
  escape_math.py <file-or-dir> ...     处理（跳过带标记的文件）
  escape_math.py --reprocess <file-or-dir> ...
      先逆转换还原再重新处理——编辑过已处理文件后用它。

处理过的文件首行带标记 <!-- escape-math: v1 -->。请在 git 下使用以便核对 diff。
"""
import sys
from pathlib import Path

MARKER = '<!-- escape-math: v1 -->'

def _mask_code_spans(text: str):
    """把围栏代码块和行内代码替换为等长占位，返回 (masked, segments)。"""
    segs = []
    out = []
    i = 0
    while i < len(text):
        if text.startswith('```', i):
            j = text.find('```', i + 3)
            if j == -1:
                out.append(text[i]); i += 3; continue
            j += 3
        elif text[i] == '`':
            k = i
            while k < len(text) and text[k] == '`':
                k += 1
            if k - i > 1:
                # 2+ 反引号（如 LaTeX 引号 ``）：不做行内代码掩码，按普通文本
                out.append(text[i:k]); i = k; continue
            ticks = text[i:k]
            j = text.find(ticks, k)
            if j == -1:
                out.append(text[i]); i += 1; continue
            j += len(ticks)
        else:
            out.append(text[i]); i += 1; continue
        segs.append(text[i:j])
        out.append(f'\x00{len(segs)-1}\x00')
        i = j
    return ''.join(out), segs

def _unmask(text: str, segs) -> str:
    for n, s in enumerate(segs):
        text = text.replace(f'\x00{n}\x00', s)
    return text

def transform(text: str, inverse: bool = False) -> str:
    masked, segs = _mask_code_spans(text)
    out = []
    i = 0
    display = False   # 是否在 $$ 内
    inline = False    # 是否在 $ 内
    while i < len(masked):
        c = masked[i]
        in_math = display or inline
        if c == '\\' and i + 1 < len(masked):
            nxt = masked[i+1]
            if in_math and nxt == '\\' and inverse:
                # 逆转换：\\$（转义美元）单独处理
                if i + 2 < len(masked) and masked[i+2] == '$' and not (i + 3 < len(masked) and masked[i+3] == '$'):
                    out.append('\\$'); i += 3
                else:
                    out.append('\\'); i += 2
                continue
            if in_math and inverse and nxt in '_*':
                out.append(nxt); i += 2; continue
            if in_math and not inverse:
                # 正转换：反斜杠+标点 → 反斜杠翻倍（\$ 也翻倍成 \\$，不被当作定界符）
                if nxt in '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~':
                    out.append('\\\\'); out.append(nxt); i += 2; continue
                if nxt in '_*':
                    out.append('\\\\'); out.append(nxt); i += 2; continue
            if not in_math and not inverse:
                # 散文中的美元：\$ → \\$，让 MathJax 看到反斜杠（processEscapes 识别为字面 $）
                if nxt == '$':
                    out.append('\\\\$'); i += 2; continue
                if nxt == '\\' and i + 2 < len(masked) and masked[i+2] == '$':
                    out.append('\\\\$'); i += 3; continue
            if not in_math and inverse:
                if nxt == '\\' and i + 2 < len(masked) and masked[i+2] == '$':
                    out.append('\\$'); i += 3; continue
            # 数学外或非标点：原样
            out.append(c); out.append(nxt); i += 2; continue
        if in_math and not inverse and c in '_*':
            out.append('\\'); out.append(c); i += 1; continue
        if c == '$':
            if display and masked.startswith('$$', i):
                out.append('$$'); i += 2; display = False; continue
            if not in_math and masked.startswith('$$', i):
                out.append('$$'); i += 2; display = True; continue
            if not in_math:
                # 行内公式起点：$ 后不跟空格/数字（数字起头是散文金额，不该出现——已全部 \$ 转义）
                if i + 1 < len(masked) and masked[i+1] not in ' \t\n':
                    out.append('$'); i += 1; inline = True; continue
                out.append('$'); i += 1; continue
            # 数学内的孤立 $ = 闭合
            out.append('$'); i += 1
            if inline:
                inline = False
            continue
        out.append(c); i += 1
    if display or inline:
        print('WARN: 未闭合的数学定界符', file=sys.stderr)
    return _unmask(''.join(out), segs)

def main():
    inverse = False
    args = sys.argv[1:]
    if args and args[0] == '--reprocess':
        inverse = True
        args = args[1:]
    for arg in args:
        p = Path(arg)
        files = sorted(p.rglob('*.md')) if p.is_dir() else [p]
        for f in files:
            src = f.read_text(encoding='utf-8')
            has_marker = src.startswith(MARKER)
            if not inverse and has_marker:
                continue
            body = src[len(MARKER):].lstrip('\n') if has_marker else src
            dst = transform(body, inverse=inverse)
            if inverse:
                dst = transform(dst, inverse=False)
            if dst != body or not has_marker:
                f.write_text(MARKER + '\n' + dst, encoding='utf-8')
                print(('reprocessed: ' if inverse else 'escaped: ') + str(f))

if __name__ == '__main__':
    main()
