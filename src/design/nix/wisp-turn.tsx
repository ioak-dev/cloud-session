import * as React from "react";

import { C } from "./theme";

/**
 * Wisp as a 2.5D puppet: one drawing that can face any way from left profile (−90°) through
 * front (0°) to right profile (90°), continuously — no swaps, no mirror flip.
 *
 * Every part has a place on a simple body in depth. Each frame projects it for the yaw:
 *   screen x = 100 + lateral · cos(yaw) + forward · sin(yaw)
 *   depth    =      − lateral · sin(yaw) + forward · cos(yaw)   (positive: toward us)
 * The face sits on the head's sphere, so it slides round and the far eye foreshortens and fades
 * as it goes. The wings sweep back in depth, so from the side they stream behind. Parts swap in
 * front of or behind the body by depth. The head can lead the body (`headYaw`), as a creature
 * turns its head first.
 *
 * At 0° it matches the rig's front drawing (`firefly-wisp.tsx`), in the same 200 × 300 space.
 */

const GLOW = "#ffcf4a";
const AMBER = "var(--char-glow-edge)";
const EYE = "#241a3a";
const HAIR = 1.2;
const HEAD_FIT = "translate(100 146) scale(1.12) translate(-100 -150)";
const DROPLET =
  "M100 44 C110 62 146 72 146 106 C146 130 126 144 100 144 C74 144 54 130 54 106 C54 72 90 62 100 44 Z";
const TORSO =
  "M84 150 Q100 146 116 150 Q124 156 122 172 Q121 186 112 192 Q100 197 88 192 Q79 186 78 172 Q76 156 84 150 Z";
const FLAME =
  "M84 170 C84 164 116 164 116 170 C126 200 126 232 104 250 C98 256 100 266 110 268 C94 270 88 258 92 248 C76 234 74 202 84 170 Z";
const RINGS = "M84 214 Q102 222 122 212 M88 231 Q102 237 116 228";

type P = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Project a point given as lateral offset from the centre line and forward depth. */
function proj(lat: number, fwd: number, yaw: number) {
  const c = Math.cos(rad(yaw));
  const s = Math.sin(rad(yaw));
  return { x: 100 + lat * c + fwd * s, d: -lat * s + fwd * c };
}

const rot = ([x, y]: P, [ox, oy]: P, deg: number): P => {
  const a = rad(deg);
  const dx = x - ox;
  const dy = y - oy;
  return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a)];
};

/* ——— wings: front-view outlines as points, flapped in their own plane, then swept back ——— */

const upper = (s: number): P[] => [
  [100 + 10 * s, 154],
  [100 + 26 * s, 128],
  [100 + 56 * s, 106],
  [100 + 74 * s, 112],
  [100 + 88 * s, 118],
  [100 + 78 * s, 146],
  [100 + 52 * s, 162],
  [100 + 36 * s, 172],
  [100 + 20 * s, 168],
  [100 + 10 * s, 162],
];
const lower = (s: number): P[] => [
  [100 + 12 * s, 166],
  [100 + 30 * s, 166],
  [100 + 50 * s, 178],
  [100 + 55 * s, 194],
  [100 + 58 * s, 206],
  [100 + 42 * s, 208],
  [100 + 32 * s, 198],
  [100 + 22 * s, 188],
  [100 + 14 * s, 178],
  [100 + 12 * s, 172],
];
const UPPER_SPOTS: [number, number, number][] = [
  [62, 124, 4.2],
  [52, 136, 2.8],
  [70, 138, 2],
  [44, 148, 1.5],
];
const LOWER_SPOTS: [number, number, number][] = [
  [44, 190, 2.8],
  [36, 182, 1.7],
];

/** A wing point in screen space: flapped about the root, then swept back by its reach. */
function wingPoint(p: P, root: P, flap: number, yaw: number) {
  const [x, y] = rot(p, root, flap);
  const lat = x - 100;
  const back = 0.85 * Math.max(0, Math.abs(lat) - 8);
  const q = proj(lat, -back, yaw);
  return { x: q.x, y, d: q.d };
}

function bez(pts: { x: number; y: number }[]) {
  const [p0, ...rest] = pts;
  let d = `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}`;
  for (let i = 0; i < rest.length; i += 3) {
    const [a, b, c] = rest.slice(i, i + 3);
    d += ` C${a.x.toFixed(1)} ${a.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
  }
  return `${d} Z`;
}

type Part = { d: number; el: React.ReactNode };

function wings(yaw: number, flapU: number, flapL: number): Part[] {
  const parts: Part[] = [];
  for (const s of [-1, 1]) {
    const rootU: P = [100 + 10 * s, 158];
    const rootL: P = [100 + 12 * s, 169];
    const u = upper(s).map((p) => wingPoint(p, rootU, flapU * s, yaw));
    const l = lower(s).map((p) => wingPoint(p, rootL, flapL * s, yaw));
    const depth = u.reduce((a, p) => a + p.d, 0) / u.length;
    const spot = ([dx, y, r]: [number, number, number], root: P, flap: number, i: number) => {
      const q = wingPoint([100 + dx * s, y], root, flap * s, yaw);
      return <circle key={i} cx={q.x} cy={q.y} r={r} fill={C.hi} />;
    };
    const vein = [
      wingPoint([100 + 12 * s, 158], rootU, flapU * s, yaw),
      wingPoint([100 + 42 * s, 132], rootU, flapU * s, yaw),
      wingPoint([100 + 72 * s, 118], rootU, flapU * s, yaw),
    ];
    parts.push({
      d: depth,
      el: (
        <g key={`w${s}`}>
          <path
            d={bez(l)}
            fill={C.tint}
            fillOpacity={0.82}
            stroke={C.hi}
            strokeWidth={HAIR}
            strokeLinejoin="round"
          />
          {LOWER_SPOTS.map((p, i) => spot(p, rootL, flapL, i))}
          <path
            d={bez(u)}
            fill={C.tint}
            fillOpacity={0.82}
            stroke={C.hi}
            strokeWidth={HAIR}
            strokeLinejoin="round"
          />
          <path
            d={`M${vein[0].x} ${vein[0].y} Q${vein[1].x} ${vein[1].y} ${vein[2].x} ${vein[2].y}`}
            stroke={C.hi}
            strokeWidth={HAIR}
            fill="none"
          />
          {UPPER_SPOTS.map((p, i) => spot(p, rootU, flapU, i + 10))}
        </g>
      ),
    });
  }
  return parts;
}

/* ——— arms: hanging tendrils, a little forward of the body ——— */

function arms(yaw: number): Part[] {
  return [-1, 1].map((s) => {
    const sh = proj(16 * s, 0, yaw);
    const el = proj(24 * s, 4, yaw);
    const hd = proj(28.5 * s, 7, yaw);
    const a: P = [el.x, 178];
    const b: P = [hd.x, 196];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w0 = 4.25;
    const w1 = 3.4;
    return {
      d: (sh.d + hd.d) / 2,
      el: (
        <g key={`a${s}`} fill={C.primary}>
          <line
            x1={sh.x}
            y1={160}
            x2={el.x}
            y2={178}
            stroke={C.primary}
            strokeWidth={9}
            strokeLinecap="round"
          />
          <path
            d={`M${a[0] + nx * w0} ${a[1] + ny * w0} L${b[0] + nx * w1} ${b[1] + ny * w1} L${b[0] - nx * w1} ${b[1] - ny * w1} L${a[0] - nx * w0} ${a[1] - ny * w0} Z`}
          />
          <circle cx={b[0]} cy={b[1]} r={5.9} />
        </g>
      ),
    };
  });
}

/* ——— head ——— */

function Antennae({ yaw }: { yaw: number }) {
  return (
    <>
      {[-1, 1].map((s) => {
        // lateral offset, height, forward reach: they lean forward toward the tip
        const pts: [number, number, number][] = [
          [3 * s, 58, 0],
          [7 * s, 46, 4],
          [18 * s, 46, 8],
          [22 * s, 38, 10],
          [24 * s, 34, 12],
          [23 * s, 31, 13],
          [21 * s, 32, 14],
        ];
        const q = pts.map(([l, y, f]) => ({ x: proj(l, f, yaw).x, y }));
        const [p0, a, b, c, e, g, t] = q;
        return (
          <g key={s}>
            <path
              d={`M${p0.x} ${p0.y} C${a.x} ${a.y} ${b.x} ${b.y} ${c.x} ${c.y} C${e.x} ${e.y} ${g.x} ${g.y} ${t.x} ${t.y}`}
              stroke={C.thin}
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={t.x} cy={t.y} r={6.5} fill={GLOW} opacity={0.35} />
            <circle cx={t.x} cy={t.y} r={3} fill={GLOW} stroke={AMBER} strokeWidth={HAIR} />
          </g>
        );
      })}
    </>
  );
}

function Face({ yaw, look = 0 }: { yaw: number; look?: number }) {
  // the eyes and cheeks sit on the head's sphere; the mouth rides the centre line
  const eyes = [-1, 1].map((s) => {
    const phi = s * Math.asin(19 / 36);
    const a = phi + rad(yaw);
    const x = 100 + 36 * Math.sin(a);
    const k = clamp(Math.cos(a) / Math.cos(phi), 0, 1);
    const o = smooth(0.08, 0.32, Math.cos(a));
    return { x, k, o };
  });
  const cheeks = [-1, 1].map((s) => {
    const phi = s * Math.asin(28 / 40);
    const a = phi + rad(yaw);
    return {
      x: 100 + 40 * Math.sin(a),
      k: clamp(Math.cos(a) / Math.cos(phi), 0, 1),
      o: smooth(0, 0.3, Math.cos(a)),
    };
  });
  const my = clamp(yaw, -68, 68);
  const mx = 100 + 38 * Math.sin(rad(my));
  const mk = Math.max(Math.cos(rad(yaw)), 0.5);
  return (
    <g>
      {cheeks.map((c, i) => (
        <ellipse
          key={i}
          cx={c.x}
          cy={121}
          rx={6.5 * Math.max(c.k, 0.3)}
          ry={3.8}
          fill="#ffb3c4"
          opacity={0.6 * c.o}
        />
      ))}
      {eyes.map((e, i) => (
        <g
          key={i}
          opacity={e.o}
          transform={`translate(${e.x} ${108 + look}) scale(${1.15 * Math.max(e.k, 0.05)} 1.15)`}
        >
          <ellipse cx={0} cy={0} rx={7} ry={8.8} fill={EYE} />
          <circle cx={-2.3} cy={-3.2} r={2.5} fill="#fff" />
          <circle cx={2.4} cy={3} r={1.1} fill="#fff" />
          <path
            d="M-7 -15 Q0 -20 7 -15"
            stroke={C.primary}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path
        d={`M${mx - 6 * mk} 125 Q${mx} ${130} ${mx + 6 * mk} 125`}
        stroke={EYE}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/* ——— the whole figure ——— */

export type TurnProps = {
  /** Where the eyes look up (−) or down (+), in head units: a glance, not a turn. */
  look?: number;
  /** −90 (facing left) … 0 (front) … 90 (facing right). */
  yaw: number;
  /** The head's own yaw, to let it lead the body. Defaults to `yaw`. */
  headYaw?: number;
  /** Wing angles in their own plane, degrees: the upper pair and the lower pair. */
  flapU?: number;
  flapL?: number;
  uid: string;
};

export function WispTurn({ yaw, headYaw = yaw, flapU = 0, flapL = 0, look = 0, uid }: TurnProps) {
  const s = Math.sin(rad(yaw));
  const body = 1 - 0.08 * Math.abs(s);
  const fw = 1 - 0.25 * Math.abs(s);
  // the flame narrows a little side-on and sweeps back from where it is heading
  const flame = `matrix(${fw} 0 ${-0.16 * s} 1 ${100 - 100 * fw + 0.16 * s * 170} 0)`;
  const parts = [...wings(yaw, flapU, flapL), ...arms(yaw)];
  const behind = parts.filter((p) => p.d < 0).sort((a, b) => a.d - b.d);
  const front = parts.filter((p) => p.d >= 0).sort((a, b) => a.d - b.d);
  return (
    <g>
      <defs>
        <radialGradient
          id={`${uid}-th`}
          cx={`${50 + 12 * Math.sin(rad(headYaw))}%`}
          cy="62%"
          r="62%"
        >
          <stop offset="0%" stopColor={C.tint} />
          <stop offset="40%" stopColor={C.soft} />
          <stop offset="78%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.primary} />
        </radialGradient>
        <linearGradient
          id={`${uid}-tf`}
          gradientUnits="userSpaceOnUse"
          x1="100"
          y1="165"
          x2="106"
          y2="270"
        >
          <stop offset="0" stopColor={C.mid} />
          <stop offset="0.24" stopColor={C.mid} />
          <stop offset="0.4" stopColor={GLOW} />
          <stop offset="0.8" stopColor={GLOW} />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      {behind.map((p) => p.el)}
      <g transform={flame}>
        <circle cx={104} cy={236} r={38} fill={GLOW} opacity={0.3} />
        <path d={FLAME} fill={`url(#${uid}-tf)`} />
        <path d={RINGS} stroke={AMBER} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </g>
      <path
        d={TORSO}
        transform={`translate(100 0) scale(${body} 1) translate(-100 0)`}
        fill={C.mid}
      />
      <rect x={94} y={134} width={12} height={20} rx={4} fill={C.mid} />
      <g transform={HEAD_FIT}>
        <Antennae yaw={headYaw} />
        <path d={DROPLET} fill={`url(#${uid}-th)`} />
        <Face yaw={headYaw} look={look} />
      </g>
      {front.map((p) => p.el)}
    </g>
  );
}

/** Where the flame's tip is, in figure space, at a yaw: that is where sparks are left. */
export function flameTip(yaw: number): P {
  const s = Math.sin(rad(yaw));
  const fw = 1 - 0.25 * Math.abs(s);
  const [x, y] = [110, 268];
  return [fw * x - 0.16 * s * y + 100 - 100 * fw + 0.16 * s * 170, y];
}
