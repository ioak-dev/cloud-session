import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import { palette } from "./firefly-variants";
import { PIP } from "./firefly-pip";
import {
  arcUp,
  chevron,
  EYE_WHITE,
  line,
  OpenMouth,
  Orb,
  TONGUE_PINK,
  turnAt,
  type EyeKit,
  type MouthKit,
} from "./rig/eyes";
import type { Palette } from "./rig/palette";
import { CHIBI, J, pivot, type Body, type P } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Side candidates, round two. Each animal takes the body plan of a reference drawing — a cloud, a
 * bell with tendrils, a flower crown, a standing bean, a fuzzy ruff — and is redrawn as its own
 * species with an ability of its own. None of them glows, carries antennae or leaves a spark trail:
 * those are Wisp's. None changes colour: that is the chameleon's.
 *
 * No outlines anywhere: parts are told apart by colour alone (`line: "none"`, which clothes follow
 * too). Every character has its own eyes (`rig/eyes.tsx`), designed for it and drawn for every
 * mood. Static figures on the shared rig; the abilities are previewed in `side-abilities.tsx`.
 */

export const FACE = "#fff4e8";
export const FACE_SHADE = "#efd8c6";
export const INNER = "#f6c1b0";

export const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

export const pal = (body: string, paw: string, over: Partial<Palette> = {}): Palette =>
  palette(body, paw, FACE, FACE_SHADE, {
    line: "none",
    eye: "#1f1a36",
    top: C.clothes,
    bottom: C.clothes,
    shoe: C.clothes,
    accent: C.clothes,
    blush: "#ffa3b5",
    ...over,
  });

export const face = (over: Partial<Candidate["face"]> = {}): Candidate["face"] => ({
  eyes: "bead",
  eyeY: 106,
  eyeGap: 18,
  mouthY: 124,
  nose: "none",
  brows: false,
  lid: FACE,
  ...over,
});

export const NO_NECK = { x: 100, y: 150, w: 0, h: 0 };

export const sides = [
  ["L", -1],
  ["R", 1],
] as const;

/* ——— A tapering limb along cubic curves: tentacles, gills, tails ——— */

export type Cubic = readonly [P, P, P, P];

export function bez([a, b, c, d]: Cubic, t: number): P {
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
export function Taper({ segs, w0, w1, fill }: { segs: Cubic[]; w0: number; w1: number; fill: string }) {
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

/** A cluster of puffs in one colour: no rim, the overlaps read as one soft mass. */
export function Puffs({ at, fill }: { at: readonly (readonly [number, number, number])[]; fill: string }) {
  return (
    <g fill={fill}>
      {at.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

export const mirror = (s: number, x: number) => 100 + (x - 100) * s;

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

/** Octopus: a white eye with an octopus's bar pupil, which widens, narrows, tilts and rounds with
 *  the mood; the mantle closes over it as a lid. No brows. */
const OCTO_PUPIL = "#1d1838";
const octoEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const bar = (w: number, h: number, rot = 0) => (
    <rect
      x={x - w / 2 + dx}
      y={y - h / 2 + dy}
      width={w}
      height={h}
      rx={h / 2}
      fill={OCTO_PUPIL}
      transform={`rotate(${rot} ${x + dx} ${y + dy})`}
    />
  );
  const round = (r: number) => (
    <g>
      <circle cx={x + dx} cy={y + dy} r={r} fill={OCTO_PUPIL} />
      <circle cx={x + dx - r * 0.35} cy={y + dy - r * 0.35} r={r * 0.3} fill={EYE_WHITE} />
    </g>
  );
  const open = (inner: ReactNode, top = 0, tilt = 0, bottom = 0) => (
    <Orb
      id={id}
      x={x}
      y={y}
      rx={9.5}
      ry={9.5}
      s={s}
      fill={EYE_WHITE}
      lid={{ top, tilt, bottom, color: C.mid }}
    >
      {inner}
    </Orb>
  );
  const shut = (d: string) => <path d={d} {...line(C.deep, 3.2)} />;
  switch (mood) {
    case "happy":
      return open(bar(11, 4.5), 0.08, 0, 0.45);
    case "delighted":
      return open(round(5.4));
    case "curious":
      return open(round(3.8));
    case "thinking":
      return open(bar(10, 4, s * -18), 0.34);
    case "focused":
      return open(bar(11, 2.6), 0.46, -6);
    case "worried":
      return open(round(2.4), 0.14, 16);
    case "oops":
      return shut(`M${x - 8} ${y} Q${x - 4} ${y - 4} ${x} ${y} Q${x + 4} ${y + 4} ${x + 8} ${y}`);
    case "wink":
      return s === 1 ? shut(arcUp(x, y, 7, 4.5)) : open(bar(11, 4.5), 0.18);
    default:
      return open(bar(11, 4.5), 0.18);
  }
};

/* ——— Penguin (from Pip): the standing bean in a dark coat; it slides ——— */

const PENG_FACE = "#f7f9ff";
const palPeng = pal(C.deep, C.accent);
const BEAN =
  "M54 160 C54 126 54 98 60 82 C68 62 84 52 100 52 C116 52 132 62 140 82 C146 98 146 126 146 160 Z";

function PengHead() {
  return (
    <g>
      <path d={BEAN} fill={C.deep} />
      {/* the white face: a heart, as a penguin chick's mask */}
      <path
        d="M100 84 C88 66 58 70 60 100 C62 124 82 138 100 138 C118 138 138 124 140 100 C142 70 112 66 100 84 Z"
        fill={PENG_FACE}
      />
    </g>
  );
}

function PengBehind() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, PIP.j)}>
          <Taper
            segs={[
              [
                [100 + s * 40, 158],
                [100 + s * 54, 170],
                [100 + s * 64, 190],
                [100 + s * 62, 212],
              ],
            ]}
            w0={18}
            w1={8}
            fill={C.deep}
          />
        </g>
      ))}
    </g>
  );
}

/** The beak is the penguin's mouth: it opens for the bright moods. */
function Beak({ mood }: Ctx) {
  const open =
    mood === "happy" ||
    mood === "delighted" ||
    mood === "oops" ||
    mood === "curious" ||
    mood === "wink";
  return open ? (
    <g>
      <path d="M92 117 L108 117 L100 132 Z" fill={palPeng.ink} />
      <path d="M90 115 Q100 109 110 115 L100 121 Z" fill={C.accent} />
      <path d="M94 127 Q100 125 106 127 L100 134 Z" fill={C.accent} />
    </g>
  ) : (
    <path d="M90 115 Q100 109 110 115 L100 128 Z" fill={C.accent} />
  );
}

/** Penguin: tall black ovals with a capsule of shine, on the white mask; short thick brows in the
 *  coat's colour. */
const penguinEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 14 - raise;
    return (
      <path
        d={`M${x - 4.5} ${by} L${x + 4.5} ${by}`}
        {...line(C.deep, 4.2)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (k = 1, top = 0, tilt = 0, extra = false) => (
    <Orb
      id={id}
      x={x}
      y={y}
      rx={5.2 * k}
      ry={8 * k}
      s={s}
      fill={ink}
      lid={{ top, tilt, color: PENG_FACE }}
    >
      <rect x={x - 3 + dx} y={y - 6 * k + dy} width={2.2} height={5 * k} rx={1.1} fill={EYE_WHITE} />
      {extra && <circle cx={x + 2 + dx} cy={y + 4 + dy} r={1.1} fill={EYE_WHITE} />}
    </Orb>
  );
  const shut = (d: string) => <path d={d} {...line(ink, 3.4)} />;
  const g = (a: ReactNode, b: ReactNode) => (
    <g>
      {a}
      {b}
    </g>
  );
  switch (mood) {
    case "happy":
      return g(shut(arcUp(x, y, 5.5, 3.5)), brow(3, 0));
    case "delighted":
      return g(open(1.2, 0, 0, true), brow(7, 0));
    case "curious":
      return g(open(1.1), s === 1 ? brow(6, -10) : brow(0, 4));
    case "thinking":
      return g(open(0.95, 0.3), s === -1 ? brow(5, 10) : brow(-1, -6));
    case "focused":
      return g(open(1, 0.45, -6), brow(-2, -14));
    case "worried":
      return g(open(0.85, 0.08, 12, true), brow(2, 18));
    case "oops":
      return g(<ellipse cx={x} cy={y + 1} rx={6} ry={2.2} fill={ink} />, brow(2, 16));
    case "wink":
      return s === 1 ? g(shut(arcUp(x, y, 5.5, 3.5)), brow(1, 0)) : g(open(), brow(3, 0));
    default:
      return g(open(), brow(0, 0));
  }
};

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


/** Fruit bat: huge glossy dark eyes with a crescent of shine and a rim of reflected colour, and fur
 *  tufts for brows that lift, droop and tilt. */
const BAT_EYE = "#1b1420";
const batEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const tuft = (raise: number, tilt: number) => {
    const by = y - 15 - raise;
    return (
      <path
        d={`M${x - 6} ${by + 2} Q${x - 2} ${by - 3} ${x} ${by - 6} Q${x + 1} ${by - 2} ${x + 6} ${by + 2} Q${x} ${by} ${x - 6} ${by + 2} Z`}
        fill={C.deep}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (top: number, tilt = 0, bottom = 0, k = 1, extra = false) => (
    <Orb
      id={id}
      x={x}
      y={y}
      rx={8.6 * k}
      ry={10 * k}
      s={s}
      fill={BAT_EYE}
      lid={{ top, tilt, bottom, color: FACE }}
    >
      <ellipse cx={x - 3 + dx} cy={y - 4 + dy} rx={3.4 * k} ry={3 * k} fill={EYE_WHITE} />
      <circle cx={x + 3.4 + dx} cy={y + 3 + dy} r={1.6} fill={EYE_WHITE} />
      {extra && <circle cx={x + 3.6 + dx} cy={y - 4.6 + dy} r={1.2} fill={EYE_WHITE} />}
      <path d={`M${x - 5} ${y + 6.5} Q${x} ${y + 9.5} ${x + 5} ${y + 6.5}`} {...line(C.hi, 1.6)} />
    </Orb>
  );
  const shut = (d: string) => <path d={d} {...line(BAT_EYE, 3.2)} />;
  const g = (a: ReactNode, b: ReactNode) => (
    <g>
      {a}
      {b}
    </g>
  );
  switch (mood) {
    case "happy":
      return g(open(0.08, 0, 0.42), tuft(2, 0));
    case "delighted":
      return g(open(0, 0, 0, 1.14, true), tuft(5, -4));
    case "curious":
      return g(open(0, 0, 0, 1.06), s === 1 ? tuft(7, -12) : tuft(0, 4));
    case "thinking":
      return g(open(0.34), s === -1 ? tuft(5, 10) : tuft(-1, -8));
    case "focused":
      return g(open(0.42, -8), tuft(-2, -14));
    case "worried":
      return g(open(0.14, 14, 0.05, 1, true), tuft(1, 18));
    case "oops":
      return g(shut(chevron(x, y, s, 5.5, 5)), tuft(3, 16));
    case "wink":
      return s === 1 ? g(shut(arcUp(x, y, 7, 4.5)), tuft(1, 0)) : g(open(0.12), tuft(3, 0));
    default:
      return g(open(0.12), tuft(0, 0));
  }
};

/* ——— Mouths: each character's own ——— */

/** A D-shaped open mouth, `w` half-wide and `h` deep, its top edge at `y`. */
export const dMouth = (y: number, w: number, h: number, cx = 100) =>
  `M${cx - w} ${y} Q${cx} ${y + h * 1.6} ${cx + w} ${y} Q${cx} ${y + h * 0.15} ${cx - w} ${y} Z`;
/** A curve from one corner to the other, `d` deep (negative frowns). */
export const curve = (y: number, w: number, d: number, cx = 100) =>
  `M${cx - w} ${y} Q${cx} ${y + d} ${cx + w} ${y}`;
export const wave = (y: number, w: number, a: number, cx = 100) =>
  `M${cx - w} ${y} Q${cx - w / 2} ${y - a} ${cx} ${y} Q${cx + w / 2} ${y + a} ${cx + w} ${y}`;

/** Octopus: small, puckered, round mouths in its deep tone, never wide. */
const octoMouth: MouthKit = ({ mood, y }) => {
  const c = C.deep;
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 6, 6)} fill={c} tongue={[100, y + 8, 3.5, 2.4]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 8, 9)} fill={c} tongue={[100, y + 11, 4.5, 3]} />;
    case "curious":
      return <ellipse cx={101} cy={y + 2} rx={2.6} ry={3.2} fill={c} />;
    case "thinking":
      return <path d={`M104 ${y - 2} q3 1.5 0 3 q3 1.5 0 3`} {...line(c, 2.2)} />;
    case "focused":
      return <path d={`M97 ${y + 1} L103 ${y + 1}`} {...line(c, 2.4)} />;
    case "worried":
      return <path d={wave(y + 2, 5, 2.5)} {...line(c, 2.2)} />;
    case "oops":
      return <OpenMouth d={`M96 ${y} a4 4.5 0 1 0 8 0 a4 4.5 0 1 0 -8 0 Z`} fill={c} tongue={[103, y + 4, 3, 2.6]} />;
    case "wink":
      return <path d={curve(y, 5, 4, 102)} {...line(c, 2.4)} />;
    default:
      return <path d={curve(y, 4.5, 3.5)} {...line(c, 2.4)} />;
  }
};

/** Fruit bat: a cat's ω with two small fangs, which show in every open mouth. */
const batMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const fang = (x: number, top: number) => <path d={`M${x - 1.8} ${top} L${x + 1.8} ${top} L${x} ${top + 3.4} Z`} fill={EYE_WHITE} />;
  const omega = (dy = 0, tilt = 0) => (
    <path d={`M92 ${y + dy} Q96 ${y + 4 + dy} 100 ${y + dy - tilt} Q104 ${y + 4 + dy - tilt} 108 ${y + dy - tilt * 2}`} {...line(ink, 2.2)} />
  );
  switch (mood) {
    case "happy":
      return <g><OpenMouth d={dMouth(y, 8, 7)} fill={ink} tongue={[100, y + 9, 4, 2.6]} />{fang(95, y + 0.4)}{fang(105, y + 0.4)}</g>;
    case "delighted":
      return <g><OpenMouth d={dMouth(y - 1, 10, 10)} fill={ink} tongue={[100, y + 12, 5, 3.2]} />{fang(94, y - 0.4)}{fang(106, y - 0.4)}</g>;
    case "curious":
      return <ellipse cx={100} cy={y + 2.5} rx={3} ry={3.6} fill={ink} />;
    case "thinking":
      return <g>{omega(0, 1.5)}{fang(97, y + 1.6)}</g>;
    case "focused":
      return <g><path d={`M94 ${y + 1} L106 ${y + 1}`} {...line(ink, 2.2)} />{fang(103, y + 1.2)}</g>;
    case "worried":
      return <g><path d={wave(y + 2, 7, 3)} {...line(ink, 2.2)} />{fang(97, y + 2.4)}</g>;
    case "oops":
      return <g>{omega()}<path d={`M101 ${y + 3} q1 6 5 5 q1 -3 -1 -5 Z`} fill={TONGUE_PINK} />{fang(96, y + 2)}</g>;
    case "wink":
      return <g>{omega(0, -1)}{fang(96, y + 2)}</g>;
    default:
      return <g>{omega()}{fang(96, y + 2)}</g>;
  }
};

/* ——— The cast of this round ——— */

export const SIDE_CANDIDATES: Candidate[] = [
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
      "From Jelly: the bell and the tendrils, now an octopus's mantle and six thick arms that curl, with suckers under the tips. Its ability is Ink: it draws a mark in the air — an arrow, a circle, an underline — to show where to look. Its eyes have an octopus's bar pupil, which widens, narrows and rounds with the mood.",
    risk: "Real octopuses change colour, which is the chameleon's; this one never does. Ink stays a pointer: never a tick, a cross or lettering.",
    pal: palOcto,
    body: C.primary,
    face: face({ eyeY: 104, eyeGap: 20, mouthY: 124, kit: octoEyes, mouthKit: octoMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    behind: () => <OctoBehind />,
    head: (c) => <OctoHead {...c} />,
  },
  {
    id: "side-bat",
    kind: "animal",
    frame: BAT,
    outline: false,
    label: "Fruit bat",
    signature: "Fuzz, a ruff, tall ears and wings folded like a cape — it hangs upside down",
    pitch:
      "From Fuzzy: the fuzz and the ruff, and the feathery antennae become a fruit bat's tall ears; the long wings fold into a cape. Its ability is Upside-down: it hangs from anything — a heading, the edge of a card — and sees it the other way round. Huge glossy eyes, and fur tufts for brows.",
    risk: "Bats can read as spooky; the round cream face carries it. Its wings stay folded, so it is never a second flier beside Wisp.",
    pal: palBat,
    body: C.deep,
    face: face({ eyeY: 108, eyeGap: 17, mouthY: 127, kit: batEyes, mouthKit: batMouth }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: () => <BatBehind />,
    head: () => <BatHead />,
    pendant: () => <BatRuff />,
  },
  {
    id: "side-penguin",
    kind: "animal",
    frame: { ...PIP, id: "penguin" },
    arms: false,
    outline: false,
    label: "Penguin",
    signature: "A dark bean with a white heart of a face, flippers and a beak — it slides",
    pitch:
      "From Pip, replacing the hamster: the bean that stands, head and body one shape. Where Pip's bottom glowed, the penguin has a white belly; the wing cases become flippers. Its ability is Slide: it drops onto its belly and slides to where it is going, the one character who travels that way. Tall eyes with a capsule of shine, thick brows in its coat's colour, and a beak that opens.",
    risk: "Penguins are common mascots; the heart-shaped face and the product blue keep it its own.",
    pal: palPeng,
    body: C.deep,
    face: face({ eyeY: 104, eyeGap: 16, mouthY: 122, lid: PENG_FACE, mouth: false, kit: penguinEyes }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: () => <PengBehind />,
    head: () => <PengHead />,
    top: (c) => <Beak {...c} />,
    belly: () => <ellipse cx={100} cy={210} rx={34} ry={38} fill={PENG_FACE} />,
  },
];
