#!/usr/bin/env python3
"""从 terms.<lang>.yaml 生成术语附录页 glossary.md 和前端数据 terms-data.js。

用法: build_glossary.py zh|en   （在项目根目录运行）
  zh: terms.zh.yaml → book-zh/src/glossary.md + book-zh/theme/terms-data.js（按拼音分组排序）
  en: terms.en.yaml → book/src/glossary.md + book/src/theme/terms-data.js（按字母分组排序）

YAML schema:
  - term: 术语
    en|zh: 对照写法
    short: 一句话简介
    detail: 详细解释
    first: 章节文件主干（链接到 <stem>.html，标题从 SUMMARY.md 读取）
    see: 目标术语      # 可选，别名条目
"""
import json
import re
import sys
from pathlib import Path

import yaml
from pypinyin import lazy_pinyin

def sanitize(s: str) -> str:
    # 散文中的字面 $：$EV、$100 等不能成为数学定界符
    if not s:
        return s
    s = s.replace('$EV', '\\$EV')
    return re.sub(r'\$(?=\d)', r'\\$', s)

def slug_zh(term: str) -> str:
    return re.sub(r'[^a-z0-9]', '', ''.join(
        lazy_pinyin(term, errors=lambda x: ''.join(c for c in x if c.isascii()))).lower())

def slug_en(term: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', term.lower()).strip('-')

def group_key_zh(term: str):
    py = lazy_pinyin(term, errors=lambda x: ''.join(c for c in x if c.isascii()))
    first = py[0][0].upper() if py and py[0] else '#'
    return (first if first.isalpha() else '#', ''.join(py))

def group_key_en(term: str):
    c = term[0].upper() if term else '#'
    return (c if c.isalpha() else '#', term.lower())

def load_summary_titles(path: Path):
    titles = {}
    if path.exists():
        for m in re.finditer(r'\[([^\]]+)\]\(([^)]+?)\.md\)', path.read_text(encoding='utf-8')):
            titles[m.group(2)] = m.group(1)
    return titles

def main():
    lang = sys.argv[1]
    assert lang in ('zh', 'en')
    root = Path('.')
    book = root / ('book-zh' if lang == 'zh' else 'book')
    terms = yaml.safe_load((root / f'terms.{lang}.yaml').read_text(encoding='utf-8'))
    titles = load_summary_titles(book / 'src' / 'SUMMARY.md')
    slug = slug_zh if lang == 'zh' else slug_en
    gkey = group_key_zh if lang == 'zh' else group_key_en
    other = 'en' if lang == 'zh' else 'zh'

    by_term = {t['term']: t for t in terms}
    data = {}
    for t in terms:
        if 'see' in t:
            tgt = t['see']
            data[t['term']] = {'s': f"见 {tgt}" if lang == 'zh' else f"See {tgt}",
                               'a': slug(tgt)}
        else:
            data[t['term']] = {'s': t['short'], 'a': slug(t['term'])}

    entries = sorted(terms, key=lambda t: gkey(t['term']))
    lines = []
    if lang == 'zh':
        lines.append('# 术语表\n')
        lines.append('收录本书出现的专业概念，按拼音分组。正文中的术语在桌面端悬浮、移动端点按可显示简介，点击可跳回本页对应条目。\n')
    else:
        lines.append('# Glossary\n')
        lines.append('Technical concepts used in this book, grouped alphabetically. Hover (desktop) or tap (mobile) a term anywhere in the text for a short definition; click to jump to its entry here.\n')
    cur = None
    for t in entries:
        g = gkey(t['term'])[0]
        if g != cur:
            cur = g
            lines.append(f'\n## {g}\n')
        anchor = slug(t['term'])
        if 'see' in t:
            lines.append(f'<a id="{anchor}"></a>')
            see_txt = f"见 [{t['see']}](#{slug(t['see'])})。" if lang == 'zh' else f"See [{t['see']}](#{slug(t['see'])})."
            lines.append(f"**{t['term']}**　{see_txt}\n")
            continue
        pair = sanitize(t.get(other, ''))
        head = f"**{sanitize(t['term'])}（{pair}）**" if pair else f"**{sanitize(t['term'])}**"
        lines.append(f'<a id="{anchor}"></a>')
        lines.append(head + '　')
        lines.append(sanitize(t['short']) + '\n')
        if t.get('detail'):
            lines.append(sanitize(t['detail']) + '\n')
        first = t.get('first', '')
        if first:
            title = titles.get(first, first)
            label = '首次讲解' if lang == 'zh' else 'First covered in'
            lines.append(f'*{label}：[{title}]({first}.html)*\n')

    (book / 'src' / 'glossary.md').write_text('\n'.join(lines), encoding='utf-8')
    (book / 'theme').mkdir(exist_ok=True)
    (book / 'theme' / 'terms-data.js').write_text(
        'window.TERMS_DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n', encoding='utf-8')
    print(f'{lang}: {len(terms)} terms, {len(data)} tooltip entries → {book}/src/glossary.md, theme/terms-data.js')

if __name__ == '__main__':
    main()
