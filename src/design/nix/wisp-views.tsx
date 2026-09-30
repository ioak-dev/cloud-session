"use client";

import * as React from "react";

import { flameTip, WispTurn } from "./wisp-turn";
import { C } from "./theme";

/**
 * Wisp's turnaround and Wisp in flight. The three-quarter and side views are the 2.5D puppet
 * (`wisp-turn.tsx`) at 40° and 90°; the back is its own drawing. Same rules everywhere: no
 * outlines on the body, no highlights, hairline edges on the wings, colour from the scheme.
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
export function WispView({
  view,
  className,
}: {
  view: "side" | "back" | "three-quarter";
  className?: string;
}) {
  const uid = useUid();
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <ellipse cx={100} cy={282} rx={42} ry={6} fill="#2a1d22" opacity={0.12} />
      {view === "back" ? <WispBack /> : <WispTurn yaw={view === "side" ? 90 : 40} uid={uid} />}
    </svg>
  );
}

/** Scrub the turn: the puppet at any yaw, left profile to right profile. */
export function WispTurnScrub() {
  const uid = useUid();
  const [yaw, setYaw] = React.useState(35);
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius)] bg-muted p-3">
      <svg
        viewBox="0 -10 200 310"
        className="h-64 w-44"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx={100} cy={282} rx={42} ry={6} fill="#2a1d22" opacity={0.12} />
        <WispTurn yaw={yaw} uid={uid} />
      </svg>
      <label className="instrument flex w-full items-center gap-2 text-xs text-muted-foreground">
        Turn
        <input
          type="range"
          min={-90}
          max={90}
          value={yaw}
          onChange={(e) => setYaw(Number(e.target.value))}
          className="w-full"
        />
        <span className="w-9 text-right tabular-nums">{yaw}°</span>
      </label>
    </div>
  );
}

/* ——— flight ——— */

/*
 * The choreography, on one clock; every frame is a pure function of the loop time. Wisp hovers
 * facing us at A, turns — continuously, the head leading — to face its way, rising a little as
 * it sets off; flies to B banking gently; turns back to face us as it settles; hovers; then turns
 * the other way and flies home, where it faces us again. It never flips. Sparks are left where it
 * has been in flight, and drift and fade.
 */

const W = 800;
const H = 260;
const K = 0.36; // Wisp's scale on the stage
const LOOP = 12000;
const A = { x: 140, y: 138 };
const B = { x: W - 140, y: 138 };
const RISE = 8;
const LEAD = 0.012; // how far ahead of the body the head turns, in loop time

const ease = (u: number) => (1 - Math.cos(Math.PI * u)) / 2;
const bob = (t: number) => 3 * Math.sin(t * Math.PI * 2 * 8);

function yawAt(t: number): number {
  const u = ((t % 1) + 1) % 1;
  const turn = (from: number, to: number, a: number, b: number) =>
    from + (to - from) * ease(clamp01((u - a) / (b - a)));
  if (u < 0.07) return 0;
  if (u < 0.11) return turn(0, 90, 0.07, 0.11);
  if (u < 0.4) return 90;
  if (u < 0.44) return turn(90, 0, 0.4, 0.44);
  if (u < 0.52) return 0;
  if (u < 0.56) return turn(0, -90, 0.52, 0.56);
  if (u < 0.85) return -90;
  if (u < 0.89) return turn(-90, 0, 0.85, 0.89);
  return 0;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function at(t: number): { x: number; y: number; tilt: number } {
  const fly = (u: number, from: typeof A, to: typeof A, dir: number) => ({
    x: from.x + (to.x - from.x) * ease(u),
    y: from.y - RISE - 30 * Math.sin(u * Math.PI * 3),
    tilt: 8 * dir * Math.sin(u * Math.PI),
  });
  if (t < 0.07) return { ...A, y: A.y + bob(t), tilt: 0 };
  if (t < 0.11) return { ...A, y: A.y - RISE * ease((t - 0.07) / 0.04), tilt: 0 };
  if (t < 0.4) return fly((t - 0.11) / 0.29, A, B, 1);
  if (t < 0.44) return { ...B, y: B.y - RISE * (1 - ease((t - 0.4) / 0.04)), tilt: 0 };
  if (t < 0.52) return { ...B, y: B.y + bob(t), tilt: 0 };
  if (t < 0.56) return { ...B, y: B.y - RISE * ease((t - 0.52) / 0.04), tilt: 0 };
  if (t < 0.85) return fly((t - 0.56) / 0.29, B, A, -1);
  if (t < 0.89) return { ...A, y: A.y - RISE * (1 - ease((t - 0.85) / 0.04)), tilt: 0 };
  return { ...A, y: A.y + bob(t), tilt: 0 };
}

const inFlight = (t: number) => (t >= 0.11 && t < 0.4) || (t >= 0.56 && t < 0.85);

/** The wings: slow in the hover, full beats in flight; the lower pair twice as fast. */
function flaps(t: number) {
  const ms = t * LOOP;
  const amp = inFlight(t) ? 1 : 0.35;
  return {
    flapU: -12 * amp * Math.sin((ms / 500) * Math.PI * 2),
    flapL: 16 * amp * Math.sin((ms / 250) * Math.PI * 2 + 1),
  };
}

/** Where the flame's tip is in stage space at loop time t. */
function tipAt(t: number) {
  const p = at(t);
  const [fx, fy] = flameTip(yawAt(t));
  const dx = K * (fx - 100);
  const dy = K * (fy - 170);
  const r = (p.tilt * Math.PI) / 180;
  return {
    x: p.x + dx * Math.cos(r) - dy * Math.sin(r),
    y: p.y + dx * Math.sin(r) + dy * Math.cos(r),
  };
}

const SPARKS = [0.11, 0.56].flatMap((start, leg) =>
  Array.from({ length: 30 }, (_, i) => {
    const t = start + ((i + 0.5) / 30) * 0.29;
    return { t, ...tipAt(t), r: [3.2, 2.2, 2.8, 1.8][(i + leg) % 4], star: i % 3 === 1 };
  }),
);
const LIFE = 0.1;

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
  const [t, setT] = React.useState(0.25);
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(r);
    if (r) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT(((now - start) % LOOP) / LOOP);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const p = at(t);
  const yaw = yawAt(t);
  const headYaw = yawAt(t + LEAD);
  const { flapU, flapL } = flaps(t);
  const trail = reduce ? 1.6 : 1;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full rounded-[var(--radius)] bg-muted"
      role="img"
      aria-label="Wisp hovers facing us, turns, flies across the stage, turns to face us again, then flies back, leaving glowing sparks behind it"
      xmlns="http://www.w3.org/2000/svg"
      data-t={t.toFixed(3)}
    >
      {[A, B].map((q) => (
        <ellipse key={q.x} cx={q.x} cy={H - 22} rx={26} ry={4} fill="#2a1d22" opacity={0.08} />
      ))}
      {SPARKS.map((sp, i) => {
        const age = (t - sp.t) / (LIFE * trail);
        if (age < 0 || age > 1) return null;
        return (
          <g key={i} opacity={1 - age} transform={`translate(0 ${22 * age})`}>
            <Spark {...sp} r={sp.r * (1 - 0.6 * age)} />
          </g>
        );
      })}
      <g transform={`translate(${p.x} ${p.y}) rotate(${p.tilt}) scale(${K}) translate(-100 -170)`}>
        <WispTurn yaw={yaw} headYaw={headYaw} flapU={flapU} flapL={flapL} uid={`${uid}-f`} />
      </g>
    </svg>
  );
}
