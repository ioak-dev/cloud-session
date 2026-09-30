"use client";

import * as React from "react";

import { WISP_MAIN } from "./firefly-wisp";
import { NixFigure } from "./rig/NixFigure";
import { C } from "./theme";

/**
 * Wisp from the side and from the back, and Wisp in flight. Drawn in the rig's 200 × 300 space so
 * the proportions match the front view, with the same rules: no outlines on the body, no
 * highlights, hairline edges on the wings, colour from the scheme, glow its own.
 *
 * The flight is declared keyframes on one clock: Wisp's path, its turn, and every spark it leaves
 * — each spark appears where Wisp was at its moment in the loop, then drifts and fades. Under
 * reduced motion the stage shows one still frame with the trail behind it.
 */

const GLOW = "#ffcf4a";
const AMBER = "var(--char-glow-edge)";
const HAIR = 1.2;
const EYE = "#241a3a";
const HEAD_FIT = "translate(100 146) scale(1.12) translate(-100 -150)";
const DROPLET =
  "M100 44 C110 62 146 72 146 106 C146 130 126 144 100 144 C74 144 54 130 54 106 C54 72 90 62 100 44 Z";

function useUid() {
  return React.useId().replace(/:/g, "");
}

function HeadFill({ id, cx = "50%" }: { id: string; cx?: string }) {
  return (
    <radialGradient id={id} cx={cx} cy="62%" r="62%">
      <stop offset="0%" stopColor={C.tint} />
      <stop offset="40%" stopColor={C.soft} />
      <stop offset="78%" stopColor={C.mid} />
      <stop offset="100%" stopColor={C.primary} />
    </radialGradient>
  );
}

function FlameFill({ id, x1 = 100, x2 = 106 }: { id: string; x1?: number; x2?: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1="165" x2={x2} y2="270">
      <stop offset="0" stopColor={C.mid} />
      <stop offset="0.24" stopColor={C.mid} />
      <stop offset="0.4" stopColor={GLOW} />
      <stop offset="0.8" stopColor={GLOW} />
      <stop offset="1" stopColor="#ffb547" />
    </linearGradient>
  );
}

const wingProps = {
  fill: C.tint,
  fillOpacity: 0.82,
  stroke: C.hi,
  strokeWidth: HAIR,
  strokeLinejoin: "round" as const,
};

/** Upper and lower wings flap apart, the lower pair twice as fast (only when `flap`). */
const flapStyle = (flap: boolean, kind: "upper" | "lower", origin: string): React.CSSProperties =>
  flap
    ? {
        transformBox: "fill-box",
        transformOrigin: origin,
        animation: `wisp-flap-${kind} ${kind === "upper" ? 0.5 : 0.25}s ease-in-out infinite alternate`,
      }
    : {};

/* ——— side: facing right ——— */

function SideWings({ near, flap }: { near: boolean; flap: boolean }) {
  const o = near ? { x: 0, y: 0, op: 1 } : { x: 8, y: -6, op: 0.55 };
  return (
    <g transform={`translate(${o.x} ${o.y})`} opacity={o.op}>
      <g style={flapStyle(flap, "lower", "100% 5%")}>
        <path
          d="M96 166 C82 170 66 182 60 196 C56 206 68 210 78 200 C88 190 94 178 96 170 Z"
          {...wingProps}
        />
        <circle cx={70} cy={196} r={2.4} fill={C.hi} />
        <circle cx={78} cy={188} r={1.5} fill={C.hi} />
      </g>
      <g style={flapStyle(flap, "upper", "100% 92%")}>
        <path
          d="M96 156 C84 132 66 112 46 110 C32 110 30 128 44 140 C58 154 80 162 96 162 Z"
          {...wingProps}
        />
        <path
          d="M94 158 Q70 136 44 120 M86 158 Q70 150 52 142"
          stroke={C.hi}
          strokeWidth={HAIR}
          fill="none"
        />
        {[
          [48, 122, 3.8],
          [60, 132, 2.6],
          [44, 134, 1.8],
          [72, 146, 1.4],
        ].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={C.hi} />
        ))}
      </g>
    </g>
  );
}

export function WispSide({ flap = false, uid: given }: { flap?: boolean; uid?: string }) {
  const own = useUid();
  const uid = given ?? own;
  return (
    <g>
      <defs>
        <HeadFill id={`${uid}-sh`} cx="60%" />
        <FlameFill id={`${uid}-sf`} x1={100} x2={70} />
      </defs>
      <SideWings near={false} flap={flap} />
      {/* the far arm, mostly behind the body */}
      <g stroke={C.primary} strokeLinecap="round" fill="none">
        <path d="M96 160 L92 178" strokeWidth={9} />
        <path d="M92 178 L90 194" strokeWidth={7} />
      </g>
      <circle cx={90} cy={196} r={5.4} fill={C.primary} />
      {/* the flame sweeps back as it flies */}
      <path
        d="M86 166 C86 160 114 160 114 168 C118 200 104 230 78 246 C70 252 68 262 76 268 C60 266 58 250 66 240 C78 224 84 200 86 166 Z"
        fill={`url(#${uid}-sf)`}
      />
      <path
        d="M84 208 Q98 214 110 204 M80 224 Q92 229 102 220"
        stroke={AMBER}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M90 150 Q102 146 112 152 Q120 164 116 180 Q112 192 100 195 Q90 194 86 184 Q82 166 90 150 Z"
        fill={C.mid}
      />
      <rect x={95} y={134} width={10} height={20} rx={3} fill={C.mid} />
      <g transform={HEAD_FIT}>
        <g transform="rotate(-6 100 100)">
          {/* antennae from behind the head, sweeping forward; the far one fainter */}
          <path
            d="M98 60 C98 46 110 38 118 34"
            stroke={C.thin}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            opacity={0.55}
          />
          <circle cx={119} cy={33} r={2.6} fill={GLOW} opacity={0.7} />
          <path
            d="M102 60 C106 46 122 42 130 38"
            stroke={C.thin}
            strokeWidth={2.8}
            fill="none"
            strokeLinecap="round"
          />
          <circle cx={131} cy={37} r={6} fill={GLOW} opacity={0.35} />
          <circle cx={131} cy={37} r={3} fill={GLOW} stroke={AMBER} strokeWidth={HAIR} />
          <path d={DROPLET} fill={`url(#${uid}-sh)`} />
          {/* the face in profile: one eye near the front, the mouth at the front edge */}
          <path
            d="M114 92 Q121 88 128 92"
            stroke={C.primary}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx={122} cy={106} rx={6} ry={8.5} fill={EYE} />
          <circle cx={124.5} cy={102} r={2.2} fill="#fff" />
          <circle cx={119.5} cy={110} r={1} fill="#fff" />
          <ellipse cx={117} cy={120} rx={6} ry={3.4} fill="#ffb3c4" opacity={0.7} />
          <path
            d="M129 124 Q134 128 139 122"
            stroke={EYE}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>
      <SideWings near flap={flap} />
      {/* the near arm, a tendril ending in a soft tip */}
      <g stroke={C.primary} strokeLinecap="round" fill="none">
        <path d="M106 160 L112 178" strokeWidth={9} />
        <path d="M112 178 L116 194" strokeWidth={6} />
      </g>
      <circle cx={116.5} cy={196} r={5.8} fill={C.primary} />
    </g>
  );
}

/* ——— back ——— */

function BackWings() {
  return (
    <>
      {([-1, 1] as const).map((s) => (
        <g key={s}>
          <path
            d={`M${100 + 12 * s} 166 C${100 + 30 * s} 166 ${100 + 50 * s} 178 ${100 + 55 * s} 194 C${100 + 58 * s} 206 ${100 + 42 * s} 208 ${100 + 32 * s} 198 C${100 + 22 * s} 188 ${100 + 14 * s} 178 ${100 + 12 * s} 172 Z`}
            {...wingProps}
          />
          <path
            d={`M${100 + 10 * s} 154 C${100 + 26 * s} 128 ${100 + 56 * s} 106 ${100 + 74 * s} 112 C${100 + 88 * s} 118 ${100 + 78 * s} 146 ${100 + 52 * s} 162 C${100 + 36 * s} 172 ${100 + 20 * s} 168 ${100 + 10 * s} 162 Z`}
            {...wingProps}
          />
          <path
            d={`M${100 + 12 * s} 158 Q${100 + 42 * s} 132 ${100 + 72 * s} 118 M${100 + 14 * s} 170 Q${100 + 34 * s} 178 ${100 + 50 * s} 198`}
            stroke={C.hi}
            strokeWidth={HAIR}
            fill="none"
          />
          {[
            [62, 124, 4.2],
            [52, 136, 2.8],
            [70, 138, 2],
            [44, 148, 1.5],
            [44, 190, 2.8],
            [36, 182, 1.7],
          ].map(([dx, y, r]) => (
            <circle key={`${dx}${y}`} cx={100 + dx * s} cy={y} r={r} fill={C.hi} />
          ))}
        </g>
      ))}
    </>
  );
}

export function WispBack() {
  const uid = useUid();
  return (
    <g>
      <defs>
        <HeadFill id={`${uid}-bh`} cx="50%" />
        <FlameFill id={`${uid}-bf`} />
      </defs>
      {([-1, 1] as const).map((s) => (
        <g key={s}>
          <g stroke={C.primary} strokeLinecap="round" fill="none">
            <path d={`M${100 + 16 * s} 160 L${100 + 24 * s} 178`} strokeWidth={9} />
            <path d={`M${100 + 24 * s} 178 L${100 + 28 * s} 194`} strokeWidth={6} />
          </g>
          <circle cx={100 + 28.6 * s} cy={197} r={5.8} fill={C.primary} />
        </g>
      ))}
      <path
        d="M84 170 C84 164 116 164 116 170 C126 200 126 232 104 250 C98 256 100 266 110 268 C94 270 88 258 92 248 C76 234 74 202 84 170 Z"
        fill={`url(#${uid}-bf)`}
      />
      <path
        d="M84 214 Q102 222 122 212 M88 231 Q102 237 116 228"
        stroke={AMBER}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M84 150 Q100 146 116 150 Q124 156 122 172 Q121 186 112 192 Q100 197 88 192 Q79 186 78 172 Q76 156 84 150 Z"
        fill={C.mid}
      />
      <rect x={94} y={134} width={12} height={20} rx={4} fill={C.mid} />
      <g transform={HEAD_FIT}>
        {/* the antennae rise from behind the tip, as in front */}
        {([-1, 1] as const).map((s) => (
          <g key={s}>
            <path
              d={`M${100 + 3 * s} 58 C${100 + 7 * s} 46 ${100 + 18 * s} 46 ${100 + 22 * s} 38 C${100 + 24 * s} 34 ${100 + 23 * s} 31 ${100 + 21 * s} 32`}
              stroke={C.thin}
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={100 + 21 * s} cy={32} r={3} fill={GLOW} stroke={AMBER} strokeWidth={HAIR} />
          </g>
        ))}
        <path d={DROPLET} fill={`url(#${uid}-bh)`} />
      </g>
      <BackWings />
    </g>
  );
}

/* ——— three-quarter: facing right, between front and side ——— */

const FRONT_UPPER = (s: number) =>
  `M${100 + 10 * s} 154 C${100 + 26 * s} 128 ${100 + 56 * s} 106 ${100 + 74 * s} 112 C${100 + 88 * s} 118 ${100 + 78 * s} 146 ${100 + 52 * s} 162 C${100 + 36 * s} 172 ${100 + 20 * s} 168 ${100 + 10 * s} 162 Z`;
const FRONT_LOWER = (s: number) =>
  `M${100 + 12 * s} 166 C${100 + 30 * s} 166 ${100 + 50 * s} 178 ${100 + 55 * s} 194 C${100 + 58 * s} 206 ${100 + 42 * s} 208 ${100 + 32 * s} 198 C${100 + 22 * s} 188 ${100 + 14 * s} 178 ${100 + 12 * s} 172 Z`;
const FRONT_FLAME =
  "M84 170 C84 164 116 164 116 170 C126 200 126 232 104 250 C98 256 100 266 110 268 C94 270 88 258 92 248 C76 234 74 202 84 170 Z";
const FRONT_TORSO =
  "M84 150 Q100 146 116 150 Q124 156 122 172 Q121 186 112 192 Q100 197 88 192 Q79 186 78 172 Q76 156 84 150 Z";

function WingPair({ s }: { s: number }) {
  return (
    <g>
      <path d={FRONT_LOWER(s)} {...wingProps} />
      <path d={FRONT_UPPER(s)} {...wingProps} />
      <path
        d={`M${100 + 12 * s} 158 Q${100 + 42 * s} 132 ${100 + 72 * s} 118`}
        stroke={C.hi}
        strokeWidth={HAIR}
        fill="none"
      />
      {[
        [62, 124, 4.2],
        [52, 136, 2.8],
        [70, 138, 2],
        [44, 190, 2.8],
      ].map(([dx, y, r]) => (
        <circle key={`${dx}${y}`} cx={100 + dx * s} cy={y} r={r} fill={C.hi} />
      ))}
    </g>
  );
}

function Tip({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill={GLOW} opacity={0.35} />
      <circle cx={x} cy={y} r={3} fill={GLOW} stroke={AMBER} strokeWidth={HAIR} />
    </g>
  );
}

export function WispThreeQuarter({ uid: given }: { uid?: string }) {
  const own = useUid();
  const uid = given ?? own;
  /* the flame sweeps a little back, the far side is foreshortened, the face turns toward us */
  const sweep = "matrix(1 0 -0.16 1 27.2 0)";
  return (
    <g>
      <defs>
        <HeadFill id={`${uid}-qh`} cx="58%" />
        <FlameFill id={`${uid}-qf`} x1={100} x2={92} />
      </defs>
      <g transform="translate(100 0) scale(0.62 1) translate(-100 0)" opacity={0.85}>
        <WingPair s={1} />
      </g>
      <g transform="translate(-4 0)">
        <WingPair s={-1} />
      </g>
      <g stroke={C.primary} strokeLinecap="round" fill="none">
        <path d="M112 160 L118 178" strokeWidth={9} />
        <path d="M118 178 L120 194" strokeWidth={6} />
      </g>
      <circle cx={120.5} cy={196} r={5.8} fill={C.primary} />
      <g transform={sweep}>
        <path d={FRONT_FLAME} fill={`url(#${uid}-qf)`} />
        <path
          d="M84 214 Q102 222 122 212 M88 231 Q102 237 116 228"
          stroke={AMBER}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <path
        d={FRONT_TORSO}
        transform="translate(102 0) scale(0.9 1) translate(-100 0)"
        fill={C.mid}
      />
      <rect x={96} y={134} width={11} height={20} rx={4} fill={C.mid} />
      <g transform={HEAD_FIT}>
        <path
          d="M100 58 C96 46 86 42 82 36"
          stroke={C.thin}
          strokeWidth={2.8}
          fill="none"
          strokeLinecap="round"
        />
        <Tip x={81} y={34} />
        <path
          d="M108 58 C112 44 124 40 128 32"
          stroke={C.thin}
          strokeWidth={2.6}
          fill="none"
          strokeLinecap="round"
          opacity={0.85}
        />
        <Tip x={129} y={30} />
        <path
          d={DROPLET}
          transform="translate(102 0) scale(0.94 1) translate(-100 0)"
          fill={`url(#${uid}-qh)`}
        />
        <path
          d="M96 92 Q103 88 110 92"
          stroke={C.primary}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M122 93 Q127 90 132 93"
          stroke={C.primary}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx={104} cy={108} rx={7} ry={9} fill={EYE} />
        <ellipse cx={128} cy={108} rx={5.2} ry={8.6} fill={EYE} />
        <circle cx={106.5} cy={104.5} r={2.4} fill="#fff" />
        <circle cx={130} cy={104.5} r={1.8} fill="#fff" />
        <ellipse cx={96} cy={120} rx={6.5} ry={3.6} fill="#ffb3c4" opacity={0.7} />
        <ellipse cx={136} cy={120} rx={3.6} ry={3} fill="#ffb3c4" opacity={0.7} />
        <path
          d="M112 124 Q118 129 124 123"
          stroke={EYE}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <g stroke={C.primary} strokeLinecap="round" fill="none">
        <path d="M86 160 L80 178" strokeWidth={9} />
        <path d="M80 178 L76 194" strokeWidth={6} />
      </g>
      <circle cx={75.5} cy={196} r={5.8} fill={C.primary} />
    </g>
  );
}

/** One of the views as a standalone figure. */
export function WispView({
  view,
  className,
}: {
  view: "side" | "back" | "three-quarter";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <ellipse cx={100} cy={282} rx={42} ry={6} fill="#2a1d22" opacity={0.12} />
      {view === "side" ? <WispSide /> : view === "back" ? <WispBack /> : <WispThreeQuarter />}
    </svg>
  );
}

/* ——— flight ——— */

/*
 * The choreography, on one clock. Wisp hovers facing us at A; turns — front, three-quarter,
 * side, a drawing at a time, rising a little as it sets off; flies to B; turns back through
 * three-quarter to face us, settling as it arrives; hovers; then turns the other way and flies
 * home, where it faces us again. Facing is mirrored only while the front is showing, so the
 * swap is never seen. Sparks are left only in flight; hovering, the rig's own trail falls.
 */

const W = 800;
const H = 260;
const K = 0.36; // Wisp's scale on the stage
const LOOP = 12000;
const A = { x: 140, y: 138 };
const B = { x: W - 140, y: 138 };
const RISE = 8;

type View = "front" | "q" | "side";
const TIMELINE: [number, View][] = [
  [0, "front"],
  [0.08, "q"],
  [0.1, "side"],
  [0.4, "q"],
  [0.42, "front"],
  [0.52, "q"],
  [0.54, "side"],
  [0.84, "q"],
  [0.86, "front"],
];
/** When the facing flips: both moments fall while the front is showing. */
const FLIP = [0.47, 0.93];

const ease = (u: number) => (1 - Math.cos(Math.PI * u)) / 2;
const bob = (t: number) => 3 * Math.sin(t * Math.PI * 2 * 8);

function at(t: number): { x: number; y: number; tilt: number; f: 1 | -1 } {
  const fly = (u: number, from: typeof A, to: typeof A, f: 1 | -1) => ({
    x: from.x + (to.x - from.x) * ease(u),
    y: from.y - RISE - 30 * Math.sin(u * Math.PI * 3),
    tilt: 8 * f * Math.sin(u * Math.PI),
    f,
  });
  if (t < 0.08) return { ...A, y: A.y + bob(t), tilt: 0, f: 1 };
  if (t < 0.1) return { ...A, y: A.y - RISE * ease((t - 0.08) / 0.02), tilt: 0, f: 1 };
  if (t < 0.4) return fly((t - 0.1) / 0.3, A, B, 1);
  if (t < 0.42) return { ...B, y: B.y - RISE * (1 - ease((t - 0.4) / 0.02)), tilt: 0, f: 1 };
  if (t < 0.52) return { ...B, y: B.y + bob(t), tilt: 0, f: t < FLIP[0] ? 1 : -1 };
  if (t < 0.54) return { ...B, y: B.y - RISE * ease((t - 0.52) / 0.02), tilt: 0, f: -1 };
  if (t < 0.84) return fly((t - 0.54) / 0.3, B, A, -1);
  if (t < 0.86) return { ...A, y: A.y - RISE * (1 - ease((t - 0.84) / 0.02)), tilt: 0, f: -1 };
  return { ...A, y: A.y + bob(t), tilt: 0, f: t < FLIP[1] ? -1 : 1 };
}

const place = (t: number) => {
  const p = at(t);
  return `translate(${p.x}px, ${p.y}px) rotate(${p.tilt}deg) scale(${K}) translate(-100px, -170px)`;
};

/** Hard switches between values at the given moments. */
function steps<T>(
  points: [number, T][],
  key: string,
  value: (v: T) => string | number,
): Keyframe[] {
  const out: Keyframe[] = [{ offset: 0, [key]: value(points[0][1]) }];
  for (let i = 1; i < points.length; i++) {
    const [o, v] = points[i];
    out.push({ offset: o, [key]: value(points[i - 1][1]) });
    out.push({ offset: Math.min(1, o + 0.0005), [key]: value(v) });
  }
  out.push({ offset: 1, [key]: value(points[points.length - 1][1]) });
  return out;
}

/** Where the flame's tip is in stage space at loop time t: that is where a spark is left. */
function tip(t: number) {
  const p = at(t);
  const dx = p.f * K * (72 - 100);
  const dy = K * (266 - 170);
  const r = (p.tilt * Math.PI) / 180;
  return {
    x: p.x + dx * Math.cos(r) - dy * Math.sin(r),
    y: p.y + dx * Math.sin(r) + dy * Math.cos(r),
  };
}

const SPARKS = [0.1, 0.54].flatMap((start, leg) =>
  Array.from({ length: 30 }, (_, i) => {
    const t = start + ((i + 0.5) / 30) * 0.3;
    return { t, ...tip(t), r: [3.2, 2.2, 2.8, 1.8][(i + leg) % 4], star: i % 3 === 1 };
  }),
);
const LIFE = 0.1;

function sparkFrames(t: number): Keyframe[] {
  const hide = { opacity: 0, transform: "translate(0px, 0px) scale(1)" };
  return [
    { offset: 0, ...hide },
    { offset: t - 0.0005, ...hide },
    { offset: t, opacity: 1, transform: "translate(0px, 0px) scale(1)" },
    { offset: t + LIFE, opacity: 0, transform: "translate(0px, 22px) scale(0.3)" },
    { offset: 1, ...hide },
  ];
}

function Spark({ x, y, r, star }: { x: number; y: number; r: number; star: boolean }) {
  return (
    <>
      <circle cx={x} cy={y} r={r * 2.4} fill={GLOW} opacity={0.3} />
      {star ? (
        <path
          d={`M${x} ${y - r * 1.9} L${x + r * 0.35} ${y - r * 0.35} L${x + r * 1.9} ${y} L${x + r * 0.35} ${y + r * 0.35} L${x} ${y + r * 1.9} L${x - r * 0.35} ${y + r * 0.35} L${x - r * 1.9} ${y} L${x - r * 0.35} ${y - r * 0.35} Z`}
          fill={GLOW}
          stroke={AMBER}
          strokeWidth={0.8}
        />
      ) : (
        <circle cx={x} cy={y} r={r} fill={GLOW} stroke={AMBER} strokeWidth={0.8} />
      )}
    </>
  );
}

export function WispFlight() {
  const uid = useUid();
  const wisp = React.useRef<SVGGElement>(null);
  const face = React.useRef<SVGGElement>(null);
  const layers = React.useRef<Record<View, SVGGElement | null>>({
    front: null,
    q: null,
    side: null,
  });
  const sparks = React.useRef<SVGGElement>(null);
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  React.useEffect(() => {
    if (reduce || !wisp.current || !face.current || !sparks.current) return;
    const timing = { duration: LOOP, iterations: Infinity };
    const running: Animation[] = [];
    const path = Array.from({ length: 481 }, (_, i) => ({
      offset: i / 480,
      transform: place(i / 480),
    }));
    running.push(wisp.current.animate(path, timing));
    running.push(
      face.current.animate(
        steps<number>(
          [
            [0, 1],
            [FLIP[0], -1],
            [FLIP[1], 1],
          ],
          "transform",
          (f) => `translate(100px, 0px) scale(${f}, 1) translate(-100px, 0px)`,
        ),
        timing,
      ),
    );
    (Object.keys(layers.current) as View[]).forEach((v) => {
      const el = layers.current[v];
      if (!el) return;
      running.push(
        el.animate(
          steps<View>(TIMELINE, "opacity", (x) => (x === v ? 1 : 0)),
          timing,
        ),
      );
    });
    Array.from(sparks.current.children).forEach((el, i) => {
      running.push((el as SVGGElement).animate(sparkFrames(SPARKS[i].t), timing));
    });
    return () => running.forEach((a) => a.cancel());
  }, [reduce]);

  const still = 0.25;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full rounded-[var(--radius)] bg-muted"
      role="img"
      aria-label="Wisp hovers facing us, turns, flies across the stage, turns to face us again, then flies back, leaving glowing sparks behind it"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[A, B].map((p) => (
        <ellipse key={p.x} cx={p.x} cy={H - 22} rx={26} ry={4} fill="#2a1d22" opacity={0.08} />
      ))}
      <g ref={sparks}>
        {SPARKS.map((sp, i) => {
          const age = still - sp.t;
          const on = reduce && age >= 0 && age < LIFE * 1.6;
          return (
            <g
              key={i}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              opacity={reduce ? (on ? 1 - age / (LIFE * 1.6) : 0) : 0}
            >
              <Spark {...sp} />
            </g>
          );
        })}
      </g>
      <g ref={wisp} style={{ transform: place(reduce ? still : 0) }}>
        <g
          ref={(el) => {
            layers.current.front = el;
          }}
          opacity={reduce ? 0 : 1}
        >
          <svg x={0} y={0} width={200} height={300} overflow="visible">
            <NixFigure c={WISP_MAIN} still={reduce} />
          </svg>
        </g>
        <g ref={face}>
          <g
            ref={(el) => {
              layers.current.q = el;
            }}
            opacity={0}
          >
            <WispThreeQuarter uid={`${uid}-q`} />
          </g>
          <g
            ref={(el) => {
              layers.current.side = el;
            }}
            opacity={reduce ? 1 : 0}
          >
            <WispSide flap={!reduce} uid={`${uid}-s`} />
          </g>
        </g>
      </g>
    </svg>
  );
}
