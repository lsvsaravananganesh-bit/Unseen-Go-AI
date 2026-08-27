from pathlib import Path

ROOT = Path('.')
THEME = '<link rel="stylesheet" href="/Unseen-Go-AI/unseengo-usa-theme.css?v=20260827" data-unseengo-usa-theme="1">'
SKIP = {'.git'}

for path in ROOT.rglob('*.html'):
    if any(part in SKIP for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8')
    if 'data-unseengo-usa-theme="1"' in text:
        continue
    if '</head>' in text:
        text = text.replace('</head>', THEME + '</head>', 1)
    elif '<body' in text:
        text = text.replace('<body', THEME + '<body', 1)
    else:
        continue
    path.write_text(text, encoding='utf-8')
    print(f'Themed: {path}')
