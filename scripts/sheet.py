"""Renders docs/logo/<name>.svg files into an HTML contact sheet: python3 scripts/sheet.py out.html id..."""
import sys
out, ids = sys.argv[1], sys.argv[2:]
def sz(svg, px): return svg.replace('<svg ', f'<svg width="{px}" height="{px}" ', 1)
rows = ''
for i in ids:
    f = open(f'docs/logo/{i}.svg').read(); s = open(f'docs/logo/{i}-favicon.svg').read()
    rows += (f'<div style="display:flex;gap:14px;align-items:end;margin:8px">{sz(f,220)}{sz(f,64)}{sz(s,32)}{sz(s,16)}'
             f'<div style="background:#15171c;padding:8px;display:flex;gap:8px;align-items:end">{sz(f,64)}{sz(s,32)}{sz(s,16)}</div></div>')
open(out, 'w').write(f'<html><body style="margin:0;background:#fff;display:grid;grid-template-columns:1fr 1fr">{rows}</body></html>')
