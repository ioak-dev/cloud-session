"use client";

import * as React from "react";

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

/** One of the views as a standalone figure. */
export function WispView({ view, className }: { view: "side" | "back"; className?: string }) {
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <ellipse cx={100} cy={282} rx={42} ry={6} fill="#2a1d22" opacity={0.12} />
      {view === "side" ? <WispSide /> : <WispBack />}
    </svg>
  );
}

/* ——— flight ——— */

const W = 800;
const H = 260;
const K = 0.34; // Wisp's scale on the stage
const LOOP = 9000;

const ease = (u: number) => (1 - Math.cos(Math.PI * u)) / 2;

/** Where Wisp is at loop time t (0–1), and which way it faces (1 right, −1 left). */
function at(t: number): { x: number; y: number; f: number; tilt: number } {
  const L = 90;
  const R = W - 90;
  if (t < 0.45) {
    const u = t / 0.45;
    return { x: L + (R - L) * ease(u), y: 140 + 42 * Math.sin(u * Math.PI * 4), f: 1, tilt: 8 };
  }
  if (t < 0.5) {
    const u = (t - 0.45) / 0.05;
    return {
      x: R + 16 * Math.sin(u * Math.PI),
      y: 140 - 26 * Math.sin(u * Math.PI),
      f: Math.cos(u * Math.PI),
      tilt: 0,
    };
  }
  if (t < 0.95) {
    const u = (t - 0.5) / 0.45;
    return { x: R - (R - L) * ease(u), y: 140 - 42 * Math.sin(u * Math.PI * 4), f: -1, tilt: -8 };
  }
  const u = (t - 0.95) / 0.05;
  return {
    x: L - 16 * Math.sin(u * Math.PI),
    y: 140 - 26 * Math.sin(u * Math.PI),
    f: -Math.cos(u * Math.PI),
    tilt: 0,
  };
}

const place = (t: number) => {
  const p = at(t);
  const fx = Math.abs(p.f) < 0.05 ? 0.05 * Math.sign(p.f || 1) : p.f;
  return `translate(${p.x}px, ${p.y}px) rotate(${p.tilt}deg) scale(${fx * K}, ${K}) translate(-100px, -170px)`;
};

/** Where the flame's tip is in stage space at loop time t: that is where a spark is left. */
function tip(t: number) {
  const p = at(t);
  const f = Math.sign(p.f) || 1;
  const dx = f * K * (72 - 100);
  const dy = K * (266 - 170);
  const r = (p.tilt * Math.PI) / 180;
  return {
    x: p.x + dx * Math.cos(r) - dy * Math.sin(r),
    y: p.y + dx * Math.sin(r) + dy * Math.cos(r),
  };
}

const SPARKS = Array.from({ length: 44 }, (_, i) => {
  const t = (i + 0.5) / 44;
  return { t, ...tip(t), r: [3.2, 2.2, 2.8, 1.8][i % 4], star: i % 3 === 1 };
});
const LIFE = 0.16;

function sparkFrames(t: number): Keyframe[] {
  const end = t + LIFE;
  const on = (o: number) => ({ offset: o, opacity: 1, transform: "translate(0px, 0px) scale(1)" });
  const off = (o: number, drift: boolean) => ({
    offset: o,
    opacity: 0,
    transform: drift ? "translate(0px, 22px) scale(0.3)" : "translate(0px, 0px) scale(1)",
  });
  if (end <= 1) {
    return [
      off(0, false),
      off(Math.max(0, t - 0.001), false),
      on(t),
      off(end, true),
      off(1, false),
    ];
  }
  // wraps past the end of the loop: fading from the start, lit again at t
  const e = end - 1;
  const mid = (1 - t) / LIFE;
  const part = (k: number) => ({
    opacity: 1 - k,
    transform: `translate(0px, ${22 * k}px) scale(${1 - 0.7 * k})`,
  });
  return [
    { offset: 0, ...part(mid) },
    off(e, true),
    off(Math.max(e, t - 0.001), false),
    on(t),
    { offset: 1, ...part(mid) },
  ];
}

export function WispFlight() {
  const uid = useUid();
  const wisp = React.useRef<SVGGElement>(null);
  const sparks = React.useRef<SVGGElement>(null);
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  React.useEffect(() => {
    if (reduce || !wisp.current || !sparks.current) return;
    const frames = Array.from({ length: 121 }, (_, i) => ({
      offset: i / 120,
      transform: place(i / 120),
    }));
    const running = [wisp.current.animate(frames, { duration: LOOP, iterations: Infinity })];
    Array.from(sparks.current.children).forEach((el, i) => {
      running.push(
        (el as SVGGElement).animate(sparkFrames(SPARKS[i].t), {
          duration: LOOP,
          iterations: Infinity,
        }),
      );
    });
    return () => running.forEach((a) => a.cancel());
  }, [reduce]);

  const still = 0.3;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full rounded-[var(--radius)] bg-muted"
      role="img"
      aria-label="Wisp flies across the stage and back, leaving glowing sparks behind it"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M90 ${H - 20} L${W - 90} ${H - 20}`}
        stroke="var(--border)"
        strokeWidth={1}
        strokeDasharray="3 6"
      />
      <g ref={sparks}>
        {SPARKS.map((s, i) => {
          const age = still - s.t;
          const visible = reduce && age >= 0 && age < LIFE * 1.4;
          return (
            <g
              key={i}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              opacity={reduce ? (visible ? 1 - age / (LIFE * 1.4) : 0) : 0}
            >
              <circle cx={s.x} cy={s.y} r={s.r * 2.4} fill={GLOW} opacity={0.3} />
              {s.star ? (
                <path
                  d={`M${s.x} ${s.y - s.r * 1.9} L${s.x + s.r * 0.35} ${s.y - s.r * 0.35} L${s.x + s.r * 1.9} ${s.y} L${s.x + s.r * 0.35} ${s.y + s.r * 0.35} L${s.x} ${s.y + s.r * 1.9} L${s.x - s.r * 0.35} ${s.y + s.r * 0.35} L${s.x - s.r * 1.9} ${s.y} L${s.x - s.r * 0.35} ${s.y - s.r * 0.35} Z`}
                  fill={GLOW}
                  stroke={AMBER}
                  strokeWidth={0.8}
                />
              ) : (
                <circle cx={s.x} cy={s.y} r={s.r} fill={GLOW} stroke={AMBER} strokeWidth={0.8} />
              )}
            </g>
          );
        })}
      </g>
      <g ref={wisp} style={{ transform: place(reduce ? still : 0) }}>
        <WispSide flap={!reduce} uid={`${uid}-fly`} />
      </g>
    </svg>
  );
}
