import * as React from "react";

import { CLEAN, RIBBON_REACH, RIBBON_TAIL, SEED, smoke, SPIRIT_MOTES, STRAND_INNER, useSmokeClock, type Pt, type SpiritForm } from "./wisp-ribbon";
import { Core } from "./wisp-clean";
import { C } from "./theme";

/**
 * Wisp as a 2.5D puppet: one drawing that can face any way — left profile (−90°), front (0°),
 * right profile (90°), and on round to its back (180°) — continuously, no swaps, no mirror flip.
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
const norm = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;
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

/**
 * Which wings the puppet and the back view draw: Wisp's two spotted pairs, or the single pair of
 * ribbons proposed in `wisp-ribbon.tsx`. A page sets it once for every view inside it.
 */
export type WingStyle = "pairs" | "ribbon";
export const WingStyleContext = React.createContext<WingStyle>("pairs");
/** The ribbon variant (`wisp-ribbon.tsx`) every ribbon view draws; only read when the style is `ribbon`. */
export const RibbonFormContext = React.createContext<SpiritForm>(CLEAN);

type Part = { d: number; el: React.ReactNode };

/** Offsets and heights of a ribbon curve as figure-space points on one side. */
const onSide = (pts: readonly Pt[], s: number): P[] => pts.map(([dx, y]) => [100 + dx * s, y]);

/** The ribbons: one pair, flapped as the upper pair is, swept back in depth like the others. */
function ribbons(yaw: number, flap: number, form: SpiritForm, uid: string, t: number): Part[] {
  const fade = form.glow ? GLOW : C.hi;
  return [-1, 1].map((s) => {
    const root: P = [100 + 10 * s, 158];
    /* the trailing edge drifts on its own, per ribbon and strand, before the wing is flapped */
    const seed = SEED[s < 0 ? "L" : "R"];
    const project = (pts: readonly Pt[], k = 0) =>
      onSide(form.smoke ? smoke(pts, t, seed + k, form.smoke) : pts, s).map((p) => wingPoint(p, root, flap * s, yaw));
    const r = project(RIBBON_TAIL);
    const g = `${uid}-tr${s}`;
    const top = wingPoint([100 + 14 * s, 150], root, flap * s, yaw);
    const end = wingPoint([100 + 44 * s, RIBBON_REACH], root, flap * s, yaw);
    return {
      d: r.reduce((a, p) => a + p.d, 0) / r.length,
      el: (
        <g key={`r${s}`}>
          <defs>
            <linearGradient id={g} gradientUnits="userSpaceOnUse" x1={top.x} y1={top.y} x2={end.x} y2={end.y}>
              <stop offset="0" stopColor={C.soft} stopOpacity={0.95} />
              <stop offset="0.35" stopColor={C.tint} stopOpacity={0.88} />
              <stop offset="0.72" stopColor={fade} stopOpacity={form.glow ? 0.7 : 0.5} />
              <stop offset="1" stopColor={fade} stopOpacity={0} />
            </linearGradient>
          </defs>
          {form.strands >= 2 && <path d={bez(project(STRAND_INNER, 2.3))} fill={`url(#${g})`} />}
          <path d={bez(r)} fill={`url(#${g})`} />
          {form.motes === "dots" &&
            SPIRIT_MOTES.map(([dx, y, rad, o]) => {
              const q = wingPoint([100 + dx * s, y], root, flap * s, yaw);
              return <circle key={`${dx}${y}`} cx={q.x} cy={q.y} r={rad} fill={C.hi} opacity={o} />;
            })}
        </g>
      ),
    };
  });
}

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

/** Arm widths: upper stroke, forearm half-widths at elbow and wrist, hand tip radius. On the ribbon
 *  page Wisp has Snug's thicker arms (`SNUG_ARM_W` in `wisp-clean.tsx`), scaled the same way. */
const ARMS = { upper: 9, w0: 4.25, w1: 3.4, hand: 5.9 };
const SNUG_ARMS = { upper: 11.5, w0: 5.5, w1: 4.4, hand: 8 };

/** An arm held somewhere: elbow and hand as [outward, height, forward] on the right side; the
 *  left mirrors it. */
export type ArmPose = { elbow: [number, number, number]; hand: [number, number, number] };
/** Arm poses to ease toward, by weight `w` (0 hanging … 1 there); a side left out stays put. */
export type ArmsTo = { l?: ArmPose; r?: ArmPose; w: number };

/**
 * The arms, hanging (`cover` 0) or raised so the hands cover the eyes (`cover` 1): the elbows
 * lift out to the sides and the hands come up in front of the face, where the eyes are, and grow
 * a little, as a hand held close does. `to` eases either arm on toward a pose of its own.
 */
function arms(yaw: number, { upper, w0, w1, hand } = ARMS, cover = 0, to?: ArmsTo): Part[] {
  const u = cover * cover * (3 - 2 * cover);
  const mix = (a: number, b: number) => a + (b - a) * u;
  const w = to ? clamp(to.w, 0, 1.2) : 0;
  return [-1, 1].map((s) => {
    const pose = s < 0 ? to?.l : to?.r;
    const go = (a: number, b: number) => (pose ? a + (b - a) * w : a);
    const sh = proj(16 * s, 0, yaw);
    const el = proj(go(mix(24, 34), pose?.elbow[0] ?? 0) * s, go(mix(4, 16), pose?.elbow[2] ?? 0), yaw);
    const hd = proj(go(mix(28.5, 22), pose?.hand[0] ?? 0) * s, go(mix(7, 30), pose?.hand[2] ?? 0), yaw);
    const a: P = [el.x, go(mix(178, 138), pose?.elbow[1] ?? 0)];
    const b: P = [hd.x, go(mix(196, 98), pose?.hand[1] ?? 0)];
    const r = mix(hand, hand * 1.45);
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    return {
      /* raised, the arms are in front of the face */
      d: Math.max((sh.d + hd.d) / 2, u > 0.2 ? 40 * u : -Infinity),
      el: (
        <g key={`a${s}`} fill={C.primary}>
          <line
            x1={sh.x}
            y1={160}
            x2={el.x}
            y2={a[1]}
            stroke={C.primary}
            strokeWidth={upper}
            strokeLinecap="round"
          />
          <path
            d={`M${a[0] + nx * w0} ${a[1] + ny * w0} L${b[0] + nx * w1} ${b[1] + ny * w1} L${b[0] - nx * w1} ${b[1] - ny * w1} L${a[0] - nx * w0} ${a[1] - ny * w0} Z`}
          />
          <ellipse cx={b[0]} cy={b[1]} rx={r} ry={r * (1 + 0.12 * u)} />
        </g>
      ),
    };
  });
}

/* ——— head ——— */

/** The right antenna curled into a question mark: up, over, and hooked back in. */
const QUERY: [number, number, number][] = [
  [3, 58, 0],
  [4, 40, 4],
  [2, 22, 8],
  [16, 16, 10],
  [32, 12, 12],
  [34, 34, 13],
  [20, 36, 14],
];

function Antennae({ yaw, curl = 0 }: { yaw: number; curl?: number }) {
  return (
    <>
      {[-1, 1].map((s) => {
        // lateral offset, height, forward reach: they lean forward toward the tip
        const base: [number, number, number][] = [
          [3 * s, 58, 0],
          [7 * s, 46, 4],
          [18 * s, 46, 8],
          [22 * s, 38, 10],
          [24 * s, 34, 12],
          [23 * s, 31, 13],
          [21 * s, 32, 14],
        ];
        const pts =
          s > 0 && curl
            ? base.map((p, i) => p.map((v, k) => v + (QUERY[i][k] - v) * curl) as [number, number, number])
            : base;
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

/**
 * Feather (`BEAN_FEATHER` in `wisp-eyes.tsx`), the main character's eyes: a white eye with a
 * translucent hairline rim, an ink pupil that roams inside it, and a tapered ink brow. Where the
 * puppet looks moves the pupil, not the eye, so a glance reads as Feather's does.
 */
/** An eye closed: a beam (upturned arc) or asleep (a lid's curve). */
function Shut({ as, ink }: { as: "happy" | "sleep"; ink: string }) {
  return (
    <path
      d={as === "happy" ? "M-8 3 Q0 -8 8 3" : "M-8 -1 Q0 6 8 -1"}
      stroke={ink}
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
    />
  );
}

function FeatherEye({ look, lookX }: { look: number; lookX: number }) {
  const px = clamp(lookX * 0.8, -4, 4);
  const py = 1 + clamp(look * 0.6, -4, 4);
  const r = 5.4;
  return (
    <>
      <ellipse cx={0} cy={0} rx={9.4} ry={12} fill="#fff" stroke={C.line} strokeWidth={1.1} />
      <circle cx={px} cy={py} r={r} fill={EYE} />
      <circle cx={px - r * 0.4} cy={py - r * 0.45} r={r * 0.34} fill="#fff" />
      <path
        d="M-7.6 -15.4 Q0 -23.2 7.6 -15.4 Q0 -16.4 -7.6 -15.4 Z"
        fill={EYE}
        stroke={EYE}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </>
  );
}

function Face({
  yaw,
  look = 0,
  lookX = 0,
  feather = false,
  shut = 0,
  shutAs = "happy",
  wink = 0,
  mouth = "smile",
}: {
  yaw: number;
  look?: number;
  lookX?: number;
  shut?: number;
  shutAs?: "happy" | "sleep";
  wink?: number;
  mouth?: Mouth;
  /** The main character's Feather eyes (the Wisp page); otherwise the butterfly Wisp's. */
  feather?: boolean;
}) {
  // the eyes and cheeks sit on the head's sphere; the mouth rides the centre line
  const eyes = [-1, 1].map((s) => {
    const phi = s * Math.asin((feather ? 20 : 19) / 36);
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
  // facing away (past profile), the mouth is out of sight
  const mo = smooth(0.02, 0.25, Math.cos(rad(yaw)));
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
      {eyes.map((e, i) => {
        /* the near (right) eye winks; a closed eye squeezes shut, then is drawn as a line */
        const lid = i === 1 ? Math.max(shut, wink) : shut;
        const as = i === 1 && wink > shut ? "happy" : shutAs;
        if (lid > 0.01)
          return (
            <g key={i} opacity={e.o} transform={`translate(${e.x} ${feather ? 107 : 108}) scale(${Math.max(e.k, 0.05)} 1)`}>
              {lid < 0.7 ? (
                <g transform={`scale(1 ${1 - lid})`}>
                  {feather ? <FeatherEye look={0} lookX={lookX} /> : <ellipse rx={7} ry={8.8} fill={EYE} />}
                </g>
              ) : (
                <Shut as={as} ink={EYE} />
              )}
            </g>
          );
        return feather ? (
          <g
            key={i}
            opacity={e.o}
            transform={`translate(${e.x} ${107 + 0.4 * look}) scale(${Math.max(e.k, 0.05)} 1)`}
          >
            <FeatherEye look={look} lookX={lookX} />
          </g>
        ) : (
        <g
          key={i}
          opacity={e.o}
          transform={`translate(${e.x + 0.6 * lookX * e.k} ${108 + look}) scale(${1.15 * Math.max(e.k, 0.05)} 1.15)`}
        >
          <ellipse cx={0} cy={0} rx={7} ry={8.8} fill={EYE} />
          {/* the catchlights shift further than the eye: a glance */}
          <circle cx={-2.3 + 0.5 * lookX} cy={-3.2} r={2.5} fill="#fff" />
          <circle cx={2.4 + 0.5 * lookX} cy={3} r={1.1} fill="#fff" />
          <path
            d="M-7 -15 Q0 -20 7 -15"
            stroke={C.primary}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
        </g>
        );
      })}
      <g opacity={mo}>
        {mouth === "grin" ? (
          <path d={`M${mx - 8 * mk} 123 Q${mx} 136 ${mx + 8 * mk} 123 Q${mx} 127 ${mx - 8 * mk} 123 Z`} fill={EYE} stroke={EYE} strokeWidth={1.6} strokeLinejoin="round" />
        ) : mouth === "o" ? (
          <ellipse cx={mx} cy={127} rx={3.4 * mk} ry={4} fill={EYE} />
        ) : mouth === "wobble" ? (
          <path d={`M${mx - 7 * mk} 127 q${3.5 * mk} -3 ${7 * mk} 0 q${3.5 * mk} 3 ${7 * mk} 0`} stroke={EYE} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        ) : (
          <path d={`M${mx - 6 * mk} 125 Q${mx} ${130} ${mx + 6 * mk} 125`} stroke={EYE} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        )}
      </g>
    </g>
  );
}

/** The mouths the puppet can make: its smile, a grin, an “o” (surprise, a yawn, blowing) and a
 *  sheepish wobble. */
export type Mouth = "smile" | "grin" | "o" | "wobble";

/* ——— the whole figure ——— */

export type TurnProps = {
  /** Where the eyes look up (−) or down (+), in head units: a glance, not a turn. */
  look?: number;
  /** Where the eyes look left (−) or right (+), in head units. */
  lookX?: number;
  /** −90 (facing left) … 0 (front) … 90 (facing right). */
  yaw: number;
  /** The head's own yaw, to let it lead the body. Defaults to `yaw`. */
  headYaw?: number;
  /** Wing angles in their own plane, degrees: the upper pair and the lower pair. Ribbons take
   *  the upper pair's. */
  flapU?: number;
  flapL?: number;
  /** 0 → 1: the hands come up over the eyes (a way not to look at a password). */
  cover?: number;
  /** 0 → 1: the ribbons sweep up over the head as a blanket, a little ghost under a sheet with its
   *  antennae poking out (another way not to look). Ribbons only. */
  blanket?: number;
  /** The blanket's wiggle, in degrees: it giggles under there. */
  wiggle?: number;
  /** 0 → 1: the eyes close, as a beam (`happy`) or asleep (`sleep`). */
  shut?: number;
  shutAs?: "happy" | "sleep";
  /** 0 → 1: the near (right) eye winks. */
  wink?: number;
  mouth?: Mouth;
  /** The lantern: 0 out, 1 as drawn, above 1 a flash. */
  glow?: number;
  /** Either arm eased toward a pose of its own. */
  armsTo?: ArmsTo;
  /** 0 → 1: the ribbons swing in, cross under the flame and tie in a knot behind. Ribbons only. */
  knot?: number;
  /** 0 → 1: the right antenna curls into a question mark. */
  curl?: number;
  /** 0 → 1: the ribbons are tied in a bow on top of the head. Ribbons only. */
  bow?: number;
  uid: string;
};

/** The ribbons tied in a bow on the drop's tip, in head space: two loops, a knot, two tails. */
function Bow({ b, uid }: { b: number; uid: string }) {
  const loop = "M100 42 C88 24 66 24 70 40 C73 52 90 50 100 42 Z";
  const tail = "M98 45 Q92 56 84 66 L92 63 L94 70 Q99 57 101 46 Z";
  return (
    <g transform={`translate(100 42) scale(${b}) translate(-100 -42)`} opacity={Math.min(1, b * 2)}>
      <defs>
        <linearGradient id={`${uid}-bow`} gradientUnits="userSpaceOnUse" x1="100" y1="24" x2="100" y2="70">
          <stop offset="0" stopColor={C.tint} />
          <stop offset="1" stopColor={C.soft} />
        </linearGradient>
      </defs>
      {[1, -1].map((s) => (
        <g key={s} transform={s < 0 ? "translate(200 0) scale(-1 1)" : undefined} fill={`url(#${uid}-bow)`} stroke={C.hi} strokeWidth={HAIR} strokeLinejoin="round">
          <path d={tail} />
          <path d={loop} />
        </g>
      ))}
      <ellipse cx={100} cy={42} rx={6} ry={5.5} fill={C.tint} stroke={C.hi} strokeWidth={HAIR} />
    </g>
  );
}

/** The knot the ribbons tie behind Wisp: a small pretzel in the ribbons' frost. */
function Knot({ k, yaw }: { k: number; yaw: number }) {
  const q = proj(0, -58, yaw);
  return (
    <g transform={`translate(${q.x} 212) scale(${1.4 * k})`} fill={C.tint} stroke={C.hi} strokeWidth={HAIR} strokeLinejoin="round">
      <path d="M0 0 C-14 -14 -22 4 -8 6 C-2 7 2 3 0 0 Z" />
      <path d="M0 0 C14 -14 22 4 8 6 C2 7 -2 3 0 0 Z" />
      <ellipse cx={0} cy={1} rx={5} ry={4.5} />
    </g>
  );
}

/** The blanket: a sheet over the head, peaked where the drop's tip is, hemmed at the chest. */
const SHEET =
  "M42 172 C38 126 58 62 88 36 Q100 20 112 36 C142 62 162 126 158 172 Q148 181 138 172 Q129 181 119 172 Q109 181 100 172 Q91 181 81 172 Q71 181 62 172 Q52 181 42 172 Z";

/**
 * Wisp under its ribbons. The sheet rises from the shoulders over the head as `b` goes 0 → 1
 * (pulled up, as a child pulls up a blanket); it is the ribbons' own frost, shaded from the head
 * down, with a hairline edge and two soft folds; the antennae poke out on top.
 */
function Blanket({ b, yaw, headYaw, wiggle, uid }: { b: number; yaw: number; headYaw: number; wiggle: number; uid: string }) {
  const top = 182 - (182 - 14) * b;
  const k = 1 - 0.1 * Math.abs(Math.sin(rad(yaw)));
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-blanket`}>
          <rect x={0} y={top} width={200} height={200} />
        </clipPath>
        <linearGradient id={`${uid}-sheet`} gradientUnits="userSpaceOnUse" x1="100" y1="24" x2="100" y2="180">
          <stop offset="0" stopColor={C.tint} />
          <stop offset="0.65" stopColor={C.tint} />
          <stop offset="1" stopColor={C.soft} />
        </linearGradient>
      </defs>
      <g
        clipPath={`url(#${uid}-blanket)`}
        transform={`rotate(${wiggle} 100 172) translate(100 0) scale(${k} 1) translate(-100 0)`}
      >
        <path d={SHEET} fill={`url(#${uid}-sheet)`} stroke={C.hi} strokeWidth={HAIR} strokeLinejoin="round" />
        <path d="M72 70 Q66 120 70 166 M128 70 Q134 120 130 166" stroke={C.hi} strokeWidth={HAIR} fill="none" strokeLinecap="round" />
      </g>
      {b > 0.85 && (
        <g transform={HEAD_FIT} opacity={(b - 0.85) / 0.15}>
          <Antennae yaw={headYaw} />
        </g>
      )}
    </g>
  );
}

export function WispTurn({
  yaw,
  headYaw = yaw,
  flapU = 0,
  flapL = 0,
  look = 0,
  lookX = 0,
  cover = 0,
  blanket = 0,
  wiggle = 0,
  shut = 0,
  shutAs = "happy",
  wink = 0,
  mouth = "smile",
  glow = 1,
  armsTo,
  knot = 0,
  curl = 0,
  bow = 0,
  uid,
}: TurnProps) {
  /* a whole turn comes back round: the angle is kept within ±180° */
  yaw = norm(yaw);
  headYaw = norm(headYaw);
  const s = Math.sin(rad(yaw));
  const body = 1 - 0.08 * Math.abs(s);
  const fw = 1 - 0.25 * Math.abs(s);
  // the flame narrows a little side-on and sweeps back from where it is heading
  const flame = `matrix(${fw} 0 ${-0.16 * s} 1 ${100 - 100 * fw + 0.16 * s * 170} 0)`;
  const style = React.useContext(WingStyleContext);
  const form = React.useContext(RibbonFormContext);
  const t = useSmokeClock(style === "ribbon" && !!form.smoke);
  /* under the blanket, or tied in a bow, the ribbons are the blanket or the bow, so they fade
     from the sides as it forms */
  const sheet = style === "ribbon" ? blanket : 0;
  const tied = style === "ribbon" ? bow : 0;
  const hide = Math.max(sheet, tied);
  /* knotted, the ribbons swing in until they cross under the flame */
  const tangle = style === "ribbon" ? knot : 0;
  const parts = [
    ...(style === "ribbon"
      ? ribbons(yaw, flapU + 42 * tangle, form, uid, t).map((p, i) =>
          hide > 0 ? { ...p, el: <g key={`rb${i}`} opacity={1 - hide}>{p.el}</g> } : p,
        )
      : wings(yaw, flapU, flapL)),
    ...(tangle > 0.05 ? [{ d: -20, el: <Knot key="knot" k={clamp(tangle, 0, 1.2)} yaw={yaw} /> }] : []),
    /* the Wisp page (ribbons) draws the picks on Clean: Snug's arms and the Core tail */
    ...arms(yaw, style === "ribbon" ? SNUG_ARMS : ARMS, cover, armsTo),
  ];
  const lamp = clamp(glow, 0, 2.4);
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
        <circle cx={104} cy={236} r={38 * (0.7 + 0.3 * lamp)} fill={GLOW} opacity={Math.min(0.75, 0.3 * lamp)} />
        {/* dimmed, the lantern shows the body's own pale colour through it */}
        {lamp < 1 && <path d={FLAME} fill={C.soft} />}
        <path d={FLAME} fill={`url(#${uid}-tf)`} opacity={Math.min(1, lamp)} />
        {style === "ribbon" && <Core uid={uid} />}
        <path d={RINGS} stroke={AMBER} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </g>
      <path
        d={TORSO}
        transform={`translate(100 0) scale(${body} 1) translate(-100 0)`}
        fill={C.mid}
      />
      <rect x={94} y={134} width={12} height={20} rx={4} fill={C.mid} />
      <g transform={HEAD_FIT}>
        <Antennae yaw={headYaw} curl={curl} />
        <path d={DROPLET} fill={`url(#${uid}-th)`} />
        <Face
          yaw={headYaw}
          look={look}
          lookX={lookX}
          feather={style === "ribbon"}
          shut={shut}
          shutAs={shutAs}
          wink={wink}
          mouth={mouth}
        />
        {tied > 0.02 && <Bow b={tied} uid={uid} />}
      </g>
      {front.map((p) => p.el)}
      {sheet > 0 && <Blanket b={sheet} yaw={yaw} headYaw={headYaw} wiggle={wiggle} uid={uid} />}
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
