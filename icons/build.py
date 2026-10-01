import math, os, re
OUT = os.path.dirname(os.path.abspath(__file__))
INK="#2a1d22"; CREAM="#fff3de"; GLOW="#ffd34d"; WHITE="#fffdf8"; PLUM="#7c5cc4"; CHARCOAL="#3b3752"

GLOWDEF = '<defs><radialGradient id="glow"><stop offset="0" stop-color="#ffe25a" stop-opacity=".75"/><stop offset=".45" stop-color="#ffd34d" stop-opacity=".35"/><stop offset="1" stop-color="#ffd34d" stop-opacity="0"/></radialGradient></defs>'
def small(body, zoom):
    body = re.sub(r"<!--d-->.*?<!--/d-->", "", body, flags=re.S)
    body = re.sub(r'stroke-width="([\d.]+)"', lambda m: f'stroke-width="{float(m.group(1))*1.5:g}"', body)
    return f'<clipPath id="t"><rect width="512" height="512" rx="96"/></clipPath><g clip-path="url(#t)"><g transform="translate(256 256) scale({zoom}) translate(-256 -256)">{body}</g></g>'
def tile(fill, body, title, rx=112):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="{title}">
<title>{title}</title>
{GLOWDEF}
<rect width="512" height="512" rx="{rx}" fill="{fill}"/>
{body}
</svg>
'''
def g(scale, cy, inner, cx=100, x=256, y=256):
    return f'<g transform="translate({x} {y}) scale({scale}) translate({-cx} {-cy})">\n{inner}\n</g>'

def bead(x, y, rx=7, ry=8.4, dx=0, dy=0):
    return (f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{INK}"/>'
            f'<circle cx="{x-2.4+dx}" cy="{y-3.2+dy}" r="2.7" fill="{WHITE}"/>')
def sparkle(x, y, s):  # four-point star centred on x,y, half-size s
    k = s*0.28
    return (f'<path d="M{x} {y-s} L{x+k} {y-k} L{x+s} {y} L{x+k} {y+k} L{x} {y+s} '
            f'L{x-k} {y+k} L{x-s} {y} L{x-k} {y-k} Z" fill="{WHITE}"/>')

# ——— Otter ———
OT_SKIN="#8a5a3b"; OT_PAW="#5b3a26"; OT_CREAM="#f1dfc6"; OT_SHADE="#6d4429"; BLUSH="#e58a7a"
def otter_head(ear_stroke=3.6):
    s = ear_stroke
    ears = "".join(f'<circle cx="{x}" cy="70" r="11" fill="{OT_SKIN}" stroke="{INK}" stroke-width="{s}"/>'
                   f'<circle cx="{x}" cy="71" r="5.5" fill="{OT_PAW}"/>' for x in (62, 138))
    return f'''{ears}
<path d="M92 62 Q95 48 100 60 Q104 46 109 62 Z" fill="{OT_SKIN}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="100" cy="100" rx="46" ry="40" fill="{OT_SKIN}"/>
<path d="M64 114 C64 100 82 96 100 100 C118 96 136 100 136 114 C136 132 120 140 100 140 C80 140 64 132 64 114 Z" fill="{OT_CREAM}"/>
<ellipse cx="100" cy="100" rx="46" ry="40" fill="none" stroke="{INK}" stroke-width="{s}"/>
<!--d--><ellipse cx="73" cy="113" rx="6" ry="3.4" fill="{BLUSH}" opacity=".55"/><ellipse cx="127" cy="113" rx="6" ry="3.4" fill="{BLUSH}" opacity=".55"/><!--/d-->
{bead(82,94)}{bead(118,94)}
<path d="M89 106 Q100 100 111 106 Q109 116 100 117 Q91 116 89 106 Z" fill="{INK}"/>
<!--d--><ellipse cx="96" cy="106" rx="3" ry="1.6" fill="{WHITE}" opacity=".6"/><!--/d-->
<path d="M100 117 V121 M93 121 Q96.5 125.5 100 121 Q103.5 125.5 107 121" stroke="{INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<g stroke="{INK}" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M77 116 L57 112 M77 121 L57 124 M123 116 L143 112 M123 121 L143 124"/></g>'''

otter_a = g(2.95, 113, f'''<path d="M84 136 Q100 160 116 136" stroke="{INK}" stroke-width="2.6" fill="none"/>
{otter_head()}
<circle cx="100" cy="164" r="20" fill="url(#glow)"/>
<ellipse cx="100" cy="164" rx="11" ry="9.4" fill="{GLOW}" stroke="{INK}" stroke-width="3"/>
{sparkle(97,162,4.6)}''')

otter_b = g(3.05, 104, f'''{otter_head()}
<circle cx="100" cy="148" r="30" fill="url(#glow)"/>
<ellipse cx="100" cy="148" rx="15" ry="12.5" fill="{GLOW}" stroke="{INK}" stroke-width="3.2"/>
{sparkle(97,146,6)}
<ellipse cx="83" cy="151" rx="8.5" ry="7.5" fill="{OT_PAW}" stroke="{INK}" stroke-width="3"/>
<ellipse cx="117" cy="151" rx="8.5" ry="7.5" fill="{OT_PAW}" stroke="{INK}" stroke-width="3"/>''')

# ——— Red panda ———
RP_SKIN="#c25a2c"; RP_SHADE="#8e3a18"; RP_CREAM="#f7e7d3"; RP_BLUSH="#f39a8a"
EAR="M52 84 C42 60 50 40 66 36 C80 46 84 62 78 74 Z"; EAR_IN="M59 76 C55 62 59 50 66 46 C73 54 75 64 72 72 Z"
panda_face = f'''<g><path d="{EAR}" fill="{RP_SKIN}" stroke="{INK}" stroke-width="3.6" stroke-linejoin="round"/><path d="{EAR_IN}" fill="{RP_CREAM}"/></g>
<g transform="translate(200 0) scale(-1 1)"><path d="{EAR}" fill="{RP_SKIN}" stroke="{INK}" stroke-width="3.6" stroke-linejoin="round"/><path d="{EAR_IN}" fill="{RP_CREAM}"/></g>
<path d="M56 96 C56 64 76 54 100 54 C124 54 144 64 144 96 L154 106 L144 111 L152 121 L139 124 C130 136 116 140 100 140 C84 140 70 136 61 124 L48 121 L56 111 L46 106 Z" fill="{RP_SKIN}" stroke="{INK}" stroke-width="3.6" stroke-linejoin="round"/>
<path d="M50 112 L58 110 L52 120 L62 122 C66 128 72 132 78 134 C70 122 70 110 64 104 Z" fill="{RP_CREAM}"/>
<path d="M150 112 L142 110 L148 120 L138 122 C134 128 128 132 122 134 C130 122 130 110 136 104 Z" fill="{RP_CREAM}"/>
<ellipse cx="82" cy="81" rx="9.5" ry="5.6" fill="{RP_CREAM}"/><ellipse cx="118" cy="81" rx="9.5" ry="5.6" fill="{RP_CREAM}"/>
<path d="M76 114 C78 102 90 100 100 104 C110 100 122 102 124 114 C124 128 112 136 100 136 C88 136 76 128 76 114 Z" fill="{RP_CREAM}"/>
<path d="M81 104 Q78 116 83 128 M119 104 Q122 116 117 128" stroke="{RP_SHADE}" stroke-width="6" fill="none" stroke-linecap="round"/>
<!--d--><ellipse cx="72" cy="114" rx="5" ry="3" fill="{RP_BLUSH}" opacity=".6"/><ellipse cx="128" cy="114" rx="5" ry="3" fill="{RP_BLUSH}" opacity=".6"/><!--/d-->
{bead(83,97)}{bead(117,97)}
<path d="M93 108 Q100 104.5 107 108 Q105 115 100 115 Q95 115 93 108 Z" fill="{INK}"/>
<path d="M100 115 V119 M93 119 Q96.5 123.5 100 119 Q103.5 123.5 107 119" stroke="{INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>'''
panda_a = g(3.3, 88, panda_face)

# Tail as an S: ink outline, rust body, light rings via dashes, dark tip.
S = "M366 118 C300 70 150 92 160 186 C168 262 344 244 352 330 C360 414 236 446 150 400"
panda_b = f'''<path d="{S}" stroke="{INK}" stroke-width="112" fill="none" stroke-linecap="round"/>
<path d="{S}" stroke="{RP_SKIN}" stroke-width="94" fill="none" stroke-linecap="round"/>
<path d="{S}" stroke="#ecb48a" stroke-width="94" fill="none" stroke-dasharray="30 56" stroke-dashoffset="-40"/>
<circle cx="366" cy="118" r="47" fill="{RP_SHADE}"/>
<path d="{S}" stroke="{INK}" stroke-width="9" fill="none" stroke-linecap="round" opacity="0"/>'''
# ring dashes overrun the outline at the round caps; clip to the body stroke by redrawing outline last
panda_b = f'''<defs><mask id="tail"><path d="{S}" stroke="#fff" stroke-width="94" fill="none" stroke-linecap="round"/></mask></defs>
<path d="{S}" stroke="{INK}" stroke-width="112" fill="none" stroke-linecap="round"/>
<g mask="url(#tail)">
<path d="{S}" stroke="{RP_SKIN}" stroke-width="120" fill="none" stroke-linecap="round"/>
<path d="{S}" stroke="#ecb48a" stroke-width="120" fill="none" stroke-dasharray="30 58" stroke-dashoffset="-44"/>
<circle cx="366" cy="118" r="60" fill="{RP_SHADE}"/>
<circle cx="150" cy="400" r="58" fill="{RP_SKIN}"/>
</g>'''

# ——— Firefly ———
NAVY="#34377a"; NIGHT="#1e2052"; FLY_SKIN="#f6e6cc"; FLY_GLOW="#ffe25a"; FLY_EYE="#6d4fc2"; FLY_BLUSH="#f28fa6"
def anime(x, y):
    return (f'<ellipse cx="{x}" cy="{y}" rx="7.6" ry="9.4" fill="{INK}"/>'
            f'<ellipse cx="{x}" cy="{y+2.4}" rx="5.4" ry="5.8" fill="{FLY_EYE}"/>'
            f'<circle cx="{x-2.4}" cy="{y-3.4}" r="2.8" fill="{WHITE}"/><circle cx="{x+2.6}" cy="{y+3.2}" r="1.2" fill="{WHITE}"/>')
ant = "".join(f'<path d="{d}" stroke="{FLY_SKIN}" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
              f'<circle cx="{x}" cy="26" r="17" fill="url(#glow)"/>'
              f'<circle cx="{x}" cy="26" r="7.5" fill="{FLY_GLOW}" stroke="{INK}" stroke-width="2.6"/>'
              for d, x in (("M88 62 C84 44 74 32 64 28", 63), ("M112 62 C116 44 126 32 136 28", 137)))
firefly_a = g(3.1, 80, f'''{ant}
<ellipse cx="100" cy="98" rx="44" ry="40" fill="{NAVY}"/>
<path d="M60 106 C60 82 78 72 100 72 C122 72 140 82 140 106 C140 128 122 138 100 138 C78 138 60 128 60 106 Z" fill="{FLY_SKIN}"/>
<ellipse cx="100" cy="98" rx="44" ry="40" fill="none" stroke="{FLY_SKIN}" stroke-opacity=".35" stroke-width="3.6"/>
<!--d--><path d="M78 64 Q90 58 104 60" stroke="#5a5ea8" stroke-width="3.4" fill="none" stroke-linecap="round"/><!--/d-->
<!--d--><ellipse cx="73" cy="118" rx="5.5" ry="3.2" fill="{FLY_BLUSH}" opacity=".6"/><ellipse cx="127" cy="118" rx="5.5" ry="3.2" fill="{FLY_BLUSH}" opacity=".6"/><!--/d-->
{anime(83,104)}{anime(117,104)}
<!--d--><path d="M77 90 Q83 86 89 89 M111 89 Q117 86 123 90" stroke="{NAVY}" stroke-width="2.4" fill="none" stroke-linecap="round"/><!--/d-->
<path d="M93 122 Q100 128 107 122" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>''')

firefly_b = f'''<circle cx="276" cy="326" r="196" fill="url(#glow)"/>
<ellipse cx="168" cy="230" rx="52" ry="92" fill="#dcecff" fill-opacity=".85" stroke="{INK}" stroke-width="10" transform="rotate(-52 168 230)"/>
<ellipse cx="340" cy="180" rx="44" ry="80" fill="#dcecff" fill-opacity=".85" stroke="{INK}" stroke-width="10" transform="rotate(38 340 180)"/>
<ellipse cx="282" cy="330" rx="104" ry="92" fill="{FLY_GLOW}" stroke="{INK}" stroke-width="12" transform="rotate(28 282 330)"/>
<path d="M200 262 Q246 226 304 240" stroke="{NAVY}" stroke-width="22" fill="none" stroke-linecap="round"/>
{sparkle(268,336,46)}
<path d="M180 168 C170 120 140 96 112 92" stroke="{FLY_SKIN}" stroke-width="10" fill="none" stroke-linecap="round"/>
<circle cx="108" cy="92" r="18" fill="{FLY_GLOW}" stroke="{INK}" stroke-width="8"/>
<circle cx="196" cy="206" r="62" fill="{NAVY}" stroke="{FLY_SKIN}" stroke-opacity=".4" stroke-width="8"/>
<path d="M166 214 C166 194 178 186 196 186 C214 186 226 194 226 214 C226 234 212 244 196 244 C180 244 166 234 166 214 Z" fill="{FLY_SKIN}"/>
<ellipse cx="184" cy="212" rx="6.5" ry="8" fill="{INK}"/><ellipse cx="210" cy="212" rx="6.5" ry="8" fill="{INK}"/>
<circle cx="182" cy="209" r="2.4" fill="{WHITE}"/><circle cx="208" cy="209" r="2.4" fill="{WHITE}"/>'''

# ——— Chameleon ———
CH_SKIN="#8b78d8"; CH_SHADE="#6a58b8"; CH_BELLY="#cbc1f6"; CH_BLUSH="#f59fbf"; MAGENTA="#d93f8e"
def turret(x, y, dx, dy, r=15):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{CH_SKIN}" stroke="{INK}" stroke-width="3.4"/>'
            f'<circle cx="{x}" cy="{y}" r="{r-3.8}" fill="none" stroke="{CH_SHADE}" stroke-width="2.4"/>'
            + bead(x+dx, y+dy, 6, 7.2))
cham_a = g(3.35, 88, f'''<path d="M66 76 C66 44 98 26 128 34 C122 48 130 62 138 76 Z" fill="{CH_SKIN}" stroke="{INK}" stroke-width="3.4" stroke-linejoin="round"/>
<!--d--><path d="M84 50 L92 70 M100 40 L106 68 M116 38 L120 66" stroke="{CH_SHADE}" stroke-width="3.6" stroke-linecap="round"/><!--/d-->
<ellipse cx="100" cy="104" rx="46" ry="37" fill="{CH_SKIN}" stroke="{INK}" stroke-width="3.4"/>
<path d="M62 116 C74 136 126 136 138 116 C128 130 72 130 62 116 Z" fill="{CH_BELLY}"/>
<!--d--><ellipse cx="68" cy="114" rx="5" ry="3" fill="{CH_BLUSH}" opacity=".7"/><ellipse cx="132" cy="114" rx="5" ry="3" fill="{CH_BLUSH}" opacity=".7"/><!--/d-->
{turret(78,98,-3,-2)}{turret(122,98,3,2)}
<path d="M86 120 Q100 130 114 120" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<!--d--><circle cx="100" cy="78" r="3.4" fill="{CH_SHADE}"/><!--/d-->''')

# Curled chameleon: a tapered spiral tail whose outer end becomes the head.
cx, cy = 250, 300
t1 = 2.0*math.pi
off = math.radians(-95) - t1
def pt(t):
    r = 22 + 22*t
    a = t + off
    return cx + r*math.cos(a), cy + r*math.sin(a)
N = 140; outer = []; inner = []
for i in range(N+1):
    t = t1*i/N
    x, y = pt(t); x2, y2 = pt(t+1e-3)
    dx, dy = x2-x, y2-y; L = math.hypot(dx, dy); nx, ny = -dy/L, dx/L
    w = 7 + 36*(i/N)**0.85
    outer.append((x+nx*w, y+ny*w)); inner.append((x-nx*w, y-ny*w))
coil = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in outer) + " L" + " L".join(f"{x:.1f} {y:.1f}" for x, y in reversed(inner)) + " Z"
ex, ey = pt(t1)
cham_b = f'''<path d="{coil}" fill="{CH_SKIN}" stroke="{INK}" stroke-width="11" stroke-linejoin="round"/>
<g transform="translate({ex:.1f} {ey:.1f})">
<path d="M-40 -14 C-30 -66 30 -84 74 -58 C62 -44 70 -28 84 -14 Z" fill="{CH_SKIN}" stroke="{INK}" stroke-width="11" stroke-linejoin="round"/>
<!--d--><path d="M-6 -58 L6 -30 M24 -70 L32 -36" stroke="{CH_SHADE}" stroke-width="9" stroke-linecap="round"/><!--/d-->
<ellipse cx="34" cy="20" rx="92" ry="64" fill="{CH_SKIN}" stroke="{INK}" stroke-width="11"/>
<path d="M-50 40 C-20 82 92 84 124 40 C96 66 -16 66 -50 40 Z" fill="{CH_BELLY}"/>
<circle cx="56" cy="6" r="40" fill="{CH_SKIN}" stroke="{INK}" stroke-width="11"/>
<circle cx="56" cy="6" r="29" fill="none" stroke="{CH_SHADE}" stroke-width="7"/>
<ellipse cx="66" cy="4" rx="16" ry="19" fill="{INK}"/><circle cx="60" cy="-4" r="6.5" fill="{WHITE}"/>
<path d="M80 50 Q102 52 116 36" stroke="{INK}" stroke-width="8" fill="none" stroke-linecap="round"/>
</g>'''

ICONS = [
  ("otter-pebble", PLUM, otter_a, "Sparkles — otter with glowing pebble", 1.22),
  ("otter-holding", CREAM, otter_b, "Sparkles — otter holding its pebble", 1.22),
  ("red-panda-face", CHARCOAL, panda_a, "Sparkles — red panda face", 1.2),
  ("red-panda-tail", CREAM, panda_b, "Sparkles — red panda tail", 1.12),
  ("firefly-face", NIGHT, firefly_a, "Sparkles — firefly face", 1.2),
  ("firefly-glow", NIGHT, firefly_b, "Sparkles — firefly glow", 1.12),
  ("chameleon-face", CREAM, cham_a, "Sparkles — chameleon face", 1.2),
  ("chameleon-curl", CREAM, cham_b, "Sparkles — curled chameleon", 1.12),
]
for name, fill, body, title, zoom in ICONS:
    open(f"{OUT}/{name}.svg", "w").write(tile(fill, body, title))
    open(f"{OUT}/{name}-small.svg", "w").write(tile(fill, small(body, zoom), title + " (small sizes)", 96))
print([i[0] for i in ICONS])
