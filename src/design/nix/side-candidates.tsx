import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import { palette } from "./firefly-variants";
import { PIP } from "./firefly-pip";
import type { Mood } from "./rig/face";
import type { Palette } from "./rig/palette";
import { CHIBI, J, pivot, type Body, type P } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Side candidates, round one. Each takes the body plan of one wispy or Pip-line reference drawing —
 * a cloud, a bell with tendrils, a flower crown, a standing bean, a fuzzy ruff — and redraws it as
 * a different species with an ability of its own. None of them glows, carries antennae or leaves a
 * spark trail: those are Wisp's. None changes colour: that is the chameleon's.
 *
 * Static figures only, on the shared rig, in the product's colours. The ability is drawn separately
 * (`SIDE_ABILITIES`), as a preview over the figure, never painted into the character.
 */

const FACE = "#fff4e8";
const FACE_SHADE = "#efd8c6";
const INNER = "#f6c1b0";

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

const pal = (body: string, paw: string, over: Partial<Palette> = {}): Palette =>
  palette(body, paw, FACE, FACE_SHADE, {
    line: C.line,
    eye: "#1f1a36",
    top: C.clothes,
    bottom: C.clothes,
    shoe: C.clothes,
    accent: C.clothes,
    blush: "#ffa3b5",
    ...over,
  });

const face = (over: Partial<Candidate["face"]> = {}): Candidate["face"] => ({
  eyes: "bead",
  eyeY: 106,
  eyeGap: 18,
  mouthY: 124,
  nose: "none",
  brows: false,
  lid: FACE,
  ...over,
});

const sides = [
  ["L", -1],
  ["R", 1],
] as const;

/* ——— A tapering limb along cubic curves: tentacles, gills, tails ——— */

type Cubic = readonly [P, P, P, P];

function bez([a, b, c, d]: Cubic, t: number): P {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}

/** Points along a chain of cubics, each starting where the last ended. */
function along(segs: Cubic[], n = 12): P[] {
  const pts: P[] = [segs[0][0]];
  for (const s of segs) for (let i = 1; i <= n; i++) pts.push(bez(s, i / n));
  return pts;
}

/** One filled shape that narrows from `w0` at the base to `w1` at the tip, with round ends. */
function Taper({ segs, w0, w1, fill }: { segs: Cubic[]; w0: number; w1: number; fill: string }) {
  const pts = along(segs);
  const last = pts.length - 1;
  const left: string[] = [];
  const right: string[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(last, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / last)) / 2;
    left.push(`${p[0] - (dy / l) * w} ${p[1] + (dx / l) * w}`);
    right.push(`${p[0] + (dy / l) * w} ${p[1] - (dx / l) * w}`);
  });
  const d = `M${left.join(" L")} L${right.reverse().join(" L")} Z`;
  return (
    <g fill={fill}>
      <circle cx={pts[0][0]} cy={pts[0][1]} r={w0 / 2} />
      <path d={d} />
      <circle cx={pts[last][0]} cy={pts[last][1]} r={w1 / 2} />
    </g>
  );
}

/** Puffs laid edge-first then fill-over, so the cluster has a hairline rim and no inner seams. */
function Puffs({ at, fill, edge }: { at: readonly (readonly [number, number, number])[]; fill: string; edge: string }) {
  return (
    <g>
      {at.map(([x, y, r]) => (
        <circle key={`e${x}-${y}`} cx={x} cy={y} r={r} fill={fill} stroke={edge} strokeWidth={1.4} />
      ))}
      {at.map(([x, y, r]) => (
        <circle key={`f${x}-${y}`} cx={x} cy={y} r={r - 0.8} fill={fill} />
      ))}
    </g>
  );
}

const mirror = (s: number, x: number) => 100 + (x - 100) * s;

/* ——— Lamb (from Puff): a cloud of fleece; it knits with its own wool ——— */

const LAMB: Body = { ...CHIBI, id: "lamb", j: { ...J, earL: [66, 96], earR: [134, 96] } };
const palLamb = pal(C.deep, C.deep);

const FLEECE_HEAD = [
  [100, 64, 18],
  [80, 70, 16],
  [120, 70, 16],
  [66, 84, 14],
  [134, 84, 14],
  [88, 56, 12],
  [112, 56, 12],
  [62, 102, 11],
  [138, 102, 11],
] as const;

const LAMB_TORSO =
  "M82 152 C74 150 70 162 76 168 C66 174 68 190 78 192 C72 204 82 216 92 212 C96 222 106 222 110 212 C120 216 130 204 122 192 C132 190 134 174 124 168 C130 162 126 150 118 152 C112 144 88 144 82 152 Z";

function LambHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, LAMB.j)}>
          <g transform={`rotate(${22 * s} ${mirror(s, 140)} 104)`}>
            <ellipse cx={mirror(s, 142)} cy={104} rx={17} ry={7.5} fill={C.deep} />
            <ellipse cx={mirror(s, 140)} cy={104} rx={10} ry={3.6} fill={INNER} />
          </g>
        </g>
      ))}
      <Puffs at={FLEECE_HEAD} fill={C.tint} edge={C.hi} />
      <ellipse cx={100} cy={110} rx={33} ry={30} fill={FACE} />
      {/* the forelock: a curl of fleece over the brow */}
      <Puffs
        at={[
          [92, 84, 9],
          [104, 82, 10],
          [114, 88, 7],
        ]}
        fill={C.tint}
        edge={C.hi}
      />
      <path d="M96 116 Q100 113 104 116 Q102 120 100 120 Q98 120 96 116 Z" fill={INNER} />
    </g>
  );
}

function LambBehind() {
  return (
    <g data-joint="tail" style={pivot("tail", LAMB.j)}>
      <Puffs
        at={[
          [124, 204, 9],
          [130, 198, 6],
        ]}
        fill={C.tint}
        edge={C.hi}
      />
    </g>
  );
}

/* ——— Octopus (from Jelly): a bell with curling arms; it doodles in ink ——— */

const OCTO: Body = {
  ...CHIBI,
  id: "octopus",
  torso: "M78 140 Q100 132 122 140 Q126 158 100 164 Q74 158 78 140 Z",
  neck: { x: 100, y: 150, w: 0, h: 0 },
};
const palOcto = pal(C.primary, C.primary);

const MANTLE =
  "M52 118 C46 70 70 34 100 34 C130 34 154 70 148 118 C146 138 126 150 100 150 C74 150 54 138 52 118 Z";

function octoArms(s: number): Cubic[][] {
  const m = (x: number) => mirror(s, x);
  return [
    [
      [
        [m(106), 144],
        [m(110), 176],
        [m(102), 200],
        [m(114), 228],
      ],
      [
        [m(114), 228],
        [m(122), 244],
        [m(138), 236],
        [m(130), 224],
      ],
    ],
    [
      [
        [m(120), 142],
        [m(136), 168],
        [m(130), 198],
        [m(146), 216],
      ],
      [
        [m(146), 216],
        [m(158), 228],
        [m(170), 214],
        [m(160), 204],
      ],
    ],
    [
      [
        [m(134), 132],
        [m(156), 140],
        [m(172), 164],
        [m(176), 186],
      ],
      [
        [m(176), 186],
        [m(180), 202],
        [m(166), 208],
        [m(162), 196],
      ],
    ],
  ];
}

function OctoBehind() {
  return (
    <g data-joint="tail" style={pivot("tail", { ...J, tail: [100, 150] })}>
      {sides.map(([side, s]) =>
        octoArms(s).map((arm, i) => (
          <g key={`${side}${i}`}>
            <Taper segs={arm} w0={17} w1={5} fill={C.primary} />
            {/* suckers along the underside of the curl */}
            {[0.15, 0.5].map((t) => {
              const [x, y] = bez(arm[1], t);
              return <circle key={t} cx={x} cy={y} r={2.3} fill={C.soft} />;
            })}
          </g>
        )),
      )}
    </g>
  );
}

function OctoHead({ uid }: Ctx) {
  const g = `${uid}-mantle`;
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.primary} />
          <stop offset="100%" stopColor={C.mid} />
        </linearGradient>
      </defs>
      <path d={MANTLE} fill={`url(#${g})`} />
      {/* spots on the crown, a tone of its own colour */}
      {[
        [84, 58, 5],
        [112, 52, 4],
        [124, 72, 3.2],
        [74, 80, 3],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={C.deep} opacity={0.45} />
      ))}
    </g>
  );
}

/* ——— Axolotl (from Bloom): a crown of frilled gills; it mends what is broken ——— */

const AXO: Body = {
  ...CHIBI,
  id: "axolotl",
  j: { ...J, earL: [60, 94], earR: [140, 94] },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};
const palAxo = pal(C.soft, C.hi);

function Gill({ s, a, len }: { s: number; a: number; len: number }) {
  const bx = mirror(s, 142);
  const by = 96;
  const rad = (a * Math.PI) / 180;
  const ex = bx + s * Math.cos(rad) * len;
  const ey = by - Math.sin(rad) * len;
  const seg: Cubic = [
    [bx, by],
    [bx + s * Math.cos(rad) * len * 0.4, by - Math.sin(rad) * len * 0.5],
    [ex - s * 4, ey + 4],
    [ex, ey],
  ];
  return (
    <g>
      {/* the frill: short feathery strands both sides of each gill */}
      {[0.35, 0.55, 0.75, 0.92].map((t) => {
        const [x, y] = bez(seg, t);
        const k = 9 * (1 - t * 0.4);
        return (
          <path
            key={t}
            d={`M${x} ${y} l${s * k * 0.6} ${-k} M${x} ${y} l${s * k} ${k * 0.4}`}
            stroke={C.primary}
            strokeWidth={3.4}
            strokeLinecap="round"
          />
        );
      })}
      <Taper segs={[seg]} w0={11} w1={6} fill={C.primary} />
    </g>
  );
}

function AxoHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, AXO.j)}>
          <Gill s={s} a={66} len={48} />
          <Gill s={s} a={32} len={50} />
          <Gill s={s} a={0} len={42} />
        </g>
      ))}
      <ellipse cx={100} cy={106} rx={50} ry={37} fill={C.soft} />
      {/* a paler face and chin, so the features read on either ground */}
      <ellipse cx={100} cy={114} rx={38} ry={24} fill={C.tint} />
      {[
        [84, 78],
        [100, 74],
        [116, 78],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={2.6} fill={C.hi} />
      ))}
    </g>
  );
}

function AxoBehind() {
  const tail: Cubic = [
    [106, 200],
    [132, 208],
    [150, 236],
    [168, 252],
  ];
  return (
    <g data-joint="tail" style={pivot("tail", AXO.j)}>
      {/* the fin runs the length of the tail, a paler band round it */}
      <Taper segs={[tail]} w0={30} w1={6} fill={C.hi} />
      <Taper segs={[tail]} w0={18} w1={3} fill={C.soft} />
    </g>
  );
}

/* ——— Hamster (from Pip): the standing bean; it stashes things in its cheeks ——— */

const palHam = pal(C.accentDeep, INNER);
const BEAN =
  "M54 160 C54 126 54 98 60 82 C68 62 84 52 100 52 C116 52 132 62 140 82 C146 98 146 126 146 160 Z";

function HamHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, PIP.j)}>
          <circle cx={mirror(s, 68)} cy={66} r={12} fill={C.accentDeep} />
          <circle cx={mirror(s, 68)} cy={67} r={6.5} fill={INNER} />
        </g>
      ))}
      <path d={BEAN} fill={C.accentDeep} />
      {/* the pale muzzle, and the cheek pouches that bulge past the bean */}
      <ellipse cx={100} cy={116} rx={34} ry={26} fill={FACE} />
      {sides.map(([side, s]) => (
        <ellipse key={side} cx={mirror(s, 66)} cy={124} rx={15} ry={13} fill={FACE} />
      ))}
      <path
        d="M92 70 Q100 62 108 70"
        stroke={FACE}
        strokeOpacity={0.55}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <path d="M96 114 Q100 111 104 114 Q102 118 100 118 Q98 118 96 114 Z" fill={INNER} />
    </g>
  );
}

/* ——— Fruit bat (from Fuzzy): fuzz, a ruff, big ears; it hangs upside down ——— */

const BAT: Body = { ...CHIBI, id: "bat", j: { ...J, earL: [74, 70], earR: [126, 70] } };
const palBat = pal(C.deep, C.primary);

function ring(cx: number, cy: number, rx: number, ry: number, n: number, r: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a), r] as const;
  });
}

function BatHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, BAT.j)}>
          <path
            d={`M${mirror(s, 64)} 84 C${mirror(s, 52)} 60 ${mirror(s, 48)} 34 ${mirror(s, 54)} 18 C${mirror(s, 72)} 28 ${mirror(s, 88)} 46 ${mirror(s, 94)} 66 Z`}
            fill={C.deep}
          />
          <path
            d={`M${mirror(s, 68)} 74 C${mirror(s, 60)} 58 ${mirror(s, 58)} 42 ${mirror(s, 60)} 32 C${mirror(s, 72)} 42 ${mirror(s, 82)} 54 ${mirror(s, 84)} 66 Z`}
            fill={C.primary}
          />
        </g>
      ))}
      {/* fuzz round the head: puffs of its own colour, no rim */}
      {ring(100, 102, 40, 35, 20, 8).map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.deep} />
      ))}
      <ellipse cx={100} cy={102} rx={40} ry={35} fill={C.deep} />
      <path
        d="M66 112 C66 94 82 86 100 90 C118 86 134 94 134 112 C134 130 118 138 100 138 C82 138 66 130 66 112 Z"
        fill={FACE}
      />
      <path
        d="M88 72 C90 62 96 60 100 68 C104 60 110 62 112 72"
        fill={C.deep}
      />
      <ellipse cx={100} cy={115} rx={4} ry={2.8} fill={C.deep} />
    </g>
  );
}

function BatBehind() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, BAT.j)}>
          {/* folded wings, worn like a cape; the fingers show as ribs, the hem scallops */}
          <path
            d={`M${mirror(s, 112)} 160 C${mirror(s, 136)} 150 ${mirror(s, 158)} 150 ${mirror(s, 166)} 158 C${mirror(s, 170)} 180 ${mirror(s, 164)} 200 ${mirror(s, 156)} 214 C${mirror(s, 148)} 206 ${mirror(s, 142)} 210 ${mirror(s, 138)} 218 C${mirror(s, 130)} 210 ${mirror(s, 124)} 212 ${mirror(s, 120)} 218 C${mirror(s, 116)} 212 ${mirror(s, 114)} 210 ${mirror(s, 112)} 206 Z`}
            fill={C.primary}
          />
          <path
            d={`M${mirror(s, 114)} 162 L${mirror(s, 156)} 212 M${mirror(s, 114)} 162 L${mirror(s, 138)} 216 M${mirror(s, 114)} 162 L${mirror(s, 120)} 216`}
            stroke={C.deep}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
          <path
            d={`M${mirror(s, 114)} 162 C${mirror(s, 138)} 154 ${mirror(s, 156)} 152 ${mirror(s, 166)} 158`}
            stroke={C.deep}
            strokeWidth={3.4}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
}

function BatRuff() {
  return (
    <g>
      {ring(100, 154, 18, 5, 10, 6).map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.primary} />
      ))}
      <ellipse cx={100} cy={154} rx={18} ry={5} fill={C.primary} />
    </g>
  );
}

/* ——— The cast of this round ——— */

export const SIDE_CANDIDATES: Candidate[] = [
  {
    id: "side-lamb",
    kind: "animal",
    frame: { ...LAMB, torso: LAMB_TORSO },
    outline: false,
    label: "Lamb",
    signature: "A cloud of fleece with a pale face and floppy ears — it knits with its own wool",
    pitch:
      "From Puff: the head of puffs and the cloud body, now a lamb's fleece. It walks, where Puff drifted, and the light at its core is gone. Its ability is Knit: it draws a strand from its own fleece and knits it into something — a scarf, a pennant, a small heart — so it is the cast's maker.",
    risk: "Pale fleece needs its hairline edge on the light ground. A knitted thing must never become a reward that accumulates.",
    pal: palLamb,
    body: C.tint,
    face: face({ eyeY: 106, eyeGap: 15, mouthY: 124 }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: () => <LambBehind />,
    head: () => <LambHead />,
    belly: () => (
      <path d={LAMB_TORSO} fill="none" stroke={C.hi} strokeWidth={1.4} strokeLinejoin="round" />
    ),
  },
  {
    id: "side-octopus",
    kind: "animal",
    frame: OCTO,
    legs: false,
    arms: false,
    outline: false,
    label: "Octopus",
    signature: "A round bell and six curling arms — it draws in ink",
    pitch:
      "From Jelly: the bell and the tendrils, but the bell is now an octopus's mantle and the tendrils are thick arms that curl, with suckers under the tips. No wings, no antennae, no light. Its ability is Ink: it draws a mark in the air with a squirt of ink — an arrow, a circle, an underline — to show where to look. The mark is never a tick or a cross; it carries no claim about the material.",
    risk: "Real octopuses change colour, which is the chameleon's; this one never does. Ink must stay a pointer, never lettering.",
    pal: palOcto,
    body: C.primary,
    face: face({ eyeY: 104, eyeGap: 20, mouthY: 122 }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    behind: () => <OctoBehind />,
    head: (c) => <OctoHead {...c} />,
  },
  {
    id: "side-axolotl",
    kind: "animal",
    frame: AXO,
    outline: false,
    label: "Axolotl",
    signature: "A wide smiling head with a crown of frilled gills and a finned tail — it mends things",
    pitch:
      "From Bloom: the crown of petals round the face becomes an axolotl's gills, three frilled fronds a side, and the petal skirt becomes a finned tail. Axolotls regrow what they lose, so its ability is Mend: it puts a broken thing back together. It suits the gentle incorrect answer — not yet, let's fix it — without a scold.",
    risk: "Mending must never imply the learner broke something. Popular with children right now, so it may be more common in other apps.",
    pal: palAxo,
    body: C.soft,
    face: face({ eyeY: 104, eyeGap: 24, mouthY: 120, lid: C.soft }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: () => <AxoBehind />,
    head: () => <AxoHead />,
    belly: () => <ellipse cx={100} cy={190} rx={13} ry={20} fill={C.tint} />,
  },
  {
    id: "side-hamster",
    kind: "animal",
    frame: PIP,
    outline: false,
    label: "Hamster",
    signature: "A golden bean on stubby legs, with cheek pouches — it stashes things away",
    pitch:
      "From Pip: the bean that stands, head and body one shape. Where Pip's bottom glowed, the hamster has a cream tummy; the wing cases are gone. Its ability is Stash: it tucks something into its cheek pouches, cheeks bulging, and brings it out again later — the cast's keeper of things.",
    risk: "The gold is the product accent, darkened so it does not read as Wisp's glow. A stash must not become a hoard that grows with use.",
    pal: palHam,
    body: C.accentDeep,
    face: face({ eyeY: 104, eyeGap: 17, eyeSize: 1.15, mouthY: 122 }),
    outfit: "bare",
    outfits: OUTFITS,
    head: () => <HamHead />,
    belly: () => <ellipse cx={100} cy={216} rx={30} ry={28} fill={FACE} />,
  },
  {
    id: "side-bat",
    kind: "animal",
    frame: BAT,
    outline: false,
    label: "Fruit bat",
    signature: "Fuzz, a ruff, tall ears and wings folded like a cape — it hangs upside down",
    pitch:
      "From Fuzzy: the fuzz, the ruff and the feathery antennae, which become a fruit bat's tall ears. The long wings fold into a cape. Its ability is Upside-down: it hangs from anything — a heading, the edge of a card — and sees it the other way round. The one character who is at home the wrong way up.",
    risk: "Bats can read as spooky or as Halloween; the fruit bat's round face and the cream muzzle carry it. Its wings must stay folded, so it is never a second flier beside Wisp.",
    pal: palBat,
    body: C.deep,
    face: face({ eyeY: 108, eyeGap: 17, mouthY: 126 }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: () => <BatBehind />,
    head: () => <BatHead />,
    pendant: () => <BatRuff />,
  },
];

/* ——— The abilities, drawn as a preview over each figure ——— */

export type Ability = {
  /** The candidate it belongs to (`candidates.tsx` or this file). */
  id: string;
  name: string;
  line: string;
  /** How the preview holds the figure: over it, or turned upside down beneath a bar. */
  mode?: "over" | "hang";
  /** Moves the frame so a preview has room above the head. */
  viewBox?: string;
  mood?: Mood;
  fx: () => ReactNode;
};

const TALL = "0 -40 200 340";

export const SIDE_ABILITIES: Ability[] = [
  {
    id: "side-lamb",
    name: "Knit",
    line: "Draws a strand from its own fleece and knits it into a thing.",
    mood: "happy",
    fx: () => (
      <g>
        <path
          d="M122 186 C146 200 158 170 150 150 C144 134 156 124 160 132"
          stroke={C.hi}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M160 150 C140 132 146 110 160 118 C174 110 180 132 160 150 Z"
          fill={C.accent}
        />
        <path
          d="M150 122 l4 5 l4 -5 M158 122 l4 5 l4 -5 M154 131 l4 5 l4 -5 M162 131 l4 5 l4 -5"
          stroke={C.accentDeep}
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M142 106 L176 146 M178 106 L144 146"
          stroke={C.deep}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <circle cx={142} cy={106} r={3} fill={C.deep} />
        <circle cx={178} cy={106} r={3} fill={C.deep} />
      </g>
    ),
  },
  {
    id: "side-octopus",
    name: "Ink",
    line: "Draws a mark in the air in ink — an arrow, a circle, an underline — to show where to look.",
    mood: "curious",
    fx: () => (
      <g stroke={C.deep} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M172 196 C192 176 192 146 172 140 C154 136 154 160 170 160 C186 160 190 128 184 96" />
        <path d="M176 104 L184 94 L192 106" />
        <circle cx={196} cy={150} r={2.2} fill={C.deep} stroke="none" />
        <circle cx={158} cy={124} r={1.8} fill={C.deep} stroke="none" />
      </g>
    ),
  },
  {
    id: "side-axolotl",
    name: "Mend",
    line: "Puts a broken thing back together. It regrows what it loses, so it knows how.",
    mood: "happy",
    fx: () => (
      <g>
        <path
          d="M164 88 L170 104 L187 104 L174 114 L179 131 L164 121 L149 131 L154 114 L141 104 L158 104 Z"
          fill={C.accent}
        />
        <path d="M164 90 L160 102 L167 110 L161 120 L164 124" stroke={C.accentDeep} strokeWidth={1.8} fill="none" />
        <g transform="rotate(-28 164 110)">
          <rect x={152} y={105} width={24} height={10} rx={4} fill={FACE} stroke={FACE_SHADE} strokeWidth={1.2} />
          <circle cx={161} cy={110} r={1} fill={FACE_SHADE} />
          <circle cx={167} cy={110} r={1} fill={FACE_SHADE} />
        </g>
      </g>
    ),
  },
  {
    id: "side-hamster",
    name: "Stash",
    line: "Tucks a thing into its cheek pouches and brings it out again later.",
    mood: "happy",
    fx: () => (
      <g>
        {sides.map(([side, s]) => (
          <ellipse key={side} cx={mirror(s, 62)} cy={122} rx={20} ry={17} fill={FACE} />
        ))}
        <path
          d="M176 70 C168 90 154 100 142 108"
          stroke={C.deep}
          strokeOpacity={0.45}
          strokeWidth={2}
          strokeDasharray="3 5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx={180} cy={62} rx={5} ry={8} transform="rotate(30 180 62)" fill={C.deep} />
        <ellipse cx={181} cy={62} rx={2} ry={5} transform="rotate(30 181 62)" fill={FACE} />
      </g>
    ),
  },
  {
    id: "side-bat",
    name: "Upside-down",
    line: "Hangs from anything — a heading, the edge of a card — and sees it the other way round.",
    mode: "hang",
    mood: "happy",
    fx: () => (
      <rect x={36} y={12} width={128} height={7} rx={3.5} fill={C.deep} opacity={0.6} />
    ),
  },
  {
    id: "panda",
    name: "Balance",
    line: "Balances anything on its head and tail: a proposal for the backup red panda.",
    viewBox: TALL,
    mood: "focused",
    fx: () => (
      <g>
        <rect x={76} y={26} width={48} height={12} rx={2} fill={C.accent} />
        <rect x={76} y={34} width={48} height={4} fill={C.accentDeep} />
        <circle cx={100} cy={12} r={13} fill={C.primary} />
        <path d="M88 8 Q100 16 112 8" stroke={C.soft} strokeWidth={2} fill="none" />
        <rect x={90} y={-20} width={20} height={20} rx={3} fill={C.mid} />
      </g>
    ),
  },
];
