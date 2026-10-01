import * as React from "react";

import type { Candidate, Ctx } from "./candidates";
import { Flame, pal as WISP_PAL, WISP } from "./firefly-wisp";
import { pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Wisp · Ribbon — a proposal, not adopted. `WISP_MAIN` is untouched.
 *
 * The first Wisp (the bench's `firefly-bodies.tsx`, commit 1cc3b0d) did not have insect wings.
 * It had one pair of ribbons that left the shoulders, swelled out and then trailed down past the
 * body to a point, like a scarf in a draught or the hem of a ghost's sheet. "Finalise Wisp"
 * (43969ae) swapped them for two pairs of spotted, rounded wings.
 *
 * Here everything else is Wisp — head, antennae, face, body, arms, flame, sparks — and only the
 * wings go back to the ribbons, drawn to today's rules: no ink outline, the colour is the edge
 * (shaded from the scheme's `C.soft` at the shoulder through `C.tint`), fading to nothing at the
 * tips. A ribbon is one pair, so it rides `wingL`/`wingR` alone; `hindL`/`hindR` carry nothing.
 *
 * Three variants are kept, and the ribbon page lets one be chosen for every figure on it:
 * Clean, Glow tips and Spirit. The studio's ribbon page is the Wisp page with that choice
 * applied: the turn puppet, back view, flight and form read `WingStyleContext` and
 * `RibbonFormContext` (`wisp-turn.tsx`).
 */

const GLOW = WISP_PAL.glow;

const sides = [
  ["L", -1],
  ["R", 1],
] as const;

/**
 * The ribbon's shape, so each variant changes one thing:
 * - `strands`: 1, the ribbon alone; 2, a thinner strand trailing inside it.
 * - `motes`: fading dots in `C.hi`, or none.
 * - `glow`: the mist turns the glow's colour as it fades, as if its light leaks out of the ribbon.
 * - `smoke`: the ribbon's trailing edge moves on its own (`smoke` below), separately from the
 *   wing's flap and from the other ribbon; the strand drifts on its own beat too. `full` is smoke,
 *   wide and rolling; `calm` is a slow, narrow drift of the tail only.
 * - `puffs`: soft puffs peel off each tip, drift out and up, swell and thin to nothing: frost,
 *   or with `glow`, the glow's gold, as if its light is left in the air.
 */
export type SpiritForm = {
  strands: 1 | 2;
  motes: "dots" | "none";
  glow?: boolean;
  smoke?: SmokeKind;
  puffs?: boolean;
};

/** Clean: one ribbon each side, fading to nothing, nothing inside; its tail sways and smokes, calmly. */
export const CLEAN: SpiritForm = { strands: 1, motes: "none", smoke: "calm", puffs: true };
/** Glow tips: Clean, with the ribbons fading to the glow's gold, and that gold leaving the tips. */
export const GLOW_TIPS: SpiritForm = { ...CLEAN, glow: true };
/** Spirit: a thinner strand inside each ribbon, a few motes rising through it, and smoke. */
export const SPIRIT: SpiritForm = { strands: 2, motes: "dots", smoke: "full", puffs: true };

export type RibbonVariantId = "clean" | "glow" | "spirit";
export const RIBBON_VARIANTS: readonly {
  id: RibbonVariantId;
  label: string;
  form: SpiritForm;
  note: string;
}[] = [
  {
    id: "clean",
    label: "Clean",
    form: CLEAN,
    note: "The simplest spirit: one ribbon each side, fading to nothing, nothing inside it. The fade does most of the work; the tails sway slowly and a little mist leaves the tips.",
  },
  {
    id: "glow",
    label: "Glow tips",
    form: GLOW_TIPS,
    note: "Clean, but as the ribbons fade they turn from the product colour to the glow's gold, as if the firefly's light seeps out through its wings, and drifts off the tips as soft gold puffs. The tails sway as Clean's do. The only Wisp whose wings carry its ability.",
  },
  {
    id: "spirit",
    label: "Spirit",
    form: SPIRIT,
    note: "Longer ribbons that fade to nothing, a thinner strand trailing inside each, and a few motes rising through them: Wisp seems made of light and mist from the shoulders down. The tails roll and curl like smoke, and puffs of mist peel off the tips.",
  },
];

export type Pt = readonly [number, number];
/** A closed curve through outward offsets and heights: a start point, then cubic triples. */
const curve = ([p0, ...rest]: readonly Pt[], X: (dx: number) => number) => {
  let d = `M${X(p0[0])} ${p0[1]}`;
  for (let i = 0; i < rest.length; i += 3) {
    d += ` C${rest
      .slice(i, i + 3)
      .map(([dx, y]) => `${X(dx)} ${y}`)
      .join(" ")}`;
  }
  return `${d} Z`;
};

/** The ribbon: out from the shoulder, its tail curling out like smoke. */
export const RIBBON_TAIL: readonly Pt[] = [
  [10, 156], [40, 136], [66, 146], [64, 172], [62, 194], [50, 208], [48, 226],
  [46, 240], [52, 250], [60, 254], [48, 258], [38, 248], [38, 232], [37, 210], [32, 182], [10, 166],
];
/** The thinner strand inside it (Spirit only). */
export const STRAND_INNER: readonly Pt[] = [
  [30, 182], [28, 204], [20, 222], [24, 240], [26, 248], [32, 250], [34, 247],
  [29, 243], [29, 230], [33, 216], [36, 204], [36, 192], [30, 182],
];
/** Motes: outward offset, height, size, opacity. */
export const SPIRIT_MOTES = [
  [46, 164, 2.2, 1],
  [55, 176, 1.4, 0.9],
  [44, 196, 1.6, 0.7],
  [50, 220, 1.2, 0.45],
  [30, 222, 1.1, 0.4],
] as const;
/** Where the fade ends: the gradient's far end, in figure space. */
export const RIBBON_REACH = 256;

/* ——— smoke: the trailing edge moves on its own ——— */

/** The seconds one smoke cycle takes; every component below is a whole number of cycles, so it loops. */
export const SMOKE_PERIOD = 8;

export type SmokeKind = "full" | "calm";
/**
 * How far a ribbon's tail drifts (`reach`, figure units at the tip), how far behind the middle the
 * tip runs (`lag`, radians from shoulder to tip), and how much the tail breathes wider and narrower
 * (`swell`). Smoke rolls wide and lags far; calm only lets the tail sway.
 */
const SMOKE_HOW: Record<SmokeKind, { reach: number; lag: number; swell: number }> = {
  full: { reach: 15, lag: 3, swell: 0.16 },
  calm: { reach: 9, lag: 2.2, swell: 0.08 },
};

/**
 * Drifts a ribbon curve as smoke does. A point's drift grows from nothing at the shoulder to full
 * at the tip. The movement is a wave that runs down the ribbon: a point's phase follows its height,
 * so the tip lags the middle and the tail rolls and curls rather than swinging as one, while
 * neighbouring points (an anchor and its handles) move together and the edge stays smooth. Each
 * point turns a small loop (sway out and back, lift up and down, a second beat at twice the speed),
 * and the tail breathes wider and narrower about its middle. Every term is zero at `t = 0`, so a
 * stilled figure shows the drawing as drawn. `seed` makes each ribbon and strand its own.
 */
export function smoke(pts: readonly Pt[], t: number, seed: number, kind: SmokeKind = "full"): Pt[] {
  const { reach, lag, swell } = SMOKE_HOW[kind];
  const th = (2 * Math.PI * t) / SMOKE_PERIOD;
  const tip = Math.max(...pts.map((p) => p[1]));
  const mid = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  /* a beat that starts from rest: zero at t = 0 */
  const beat = (k: number, ph: number, f = Math.sin) => f(k * th - ph) - f(-ph);
  return pts.map(([dx, y]) => {
    const u = Math.min(1, Math.max(0, (y - 168) / (tip - 168)));
    const w = u ** 1.7;
    const ph = seed + u * lag;
    const sway = beat(1, ph) + 0.3 * beat(2, 1.6 * ph + 0.8);
    const lift = 0.45 * beat(1, ph, Math.cos);
    const breathe = swell * (dx - mid) * beat(1, ph + 1.2);
    return [dx + w * (reach * 0.5 * sway + breathe), y + w * reach * 0.5 * lift];
  });
}

/** One shared clock for every smoking ribbon, in seconds; stands still under reduced motion. */
const clock = (() => {
  const subs = new Set<() => void>();
  let t = 0;
  let frame = 0;
  const tick = () => {
    const next = Math.round(performance.now() / 33) / 30; // 30 frames a second is smooth enough
    if (next !== t) {
      t = next;
      subs.forEach((f) => f());
    }
    frame = requestAnimationFrame(tick);
  };
  return {
    subscribe(f: () => void) {
      subs.add(f);
      if (subs.size === 1 && !prefersStill()) frame = requestAnimationFrame(tick);
      return () => {
        subs.delete(f);
        if (subs.size === 0) cancelAnimationFrame(frame);
      };
    },
    get: () => t,
  };
})();
const noSub = () => () => {};
const prefersStill = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Seconds for a puppet that has to redraw its ribbons itself; 0 when `active` is false. */
export function useSmokeClock(active: boolean): number {
  return React.useSyncExternalStore(
    active ? clock.subscribe : noSub,
    active ? clock.get : () => 0,
    () => 0,
  );
}

/** Keyframes of a drifting curve, as the values of an SVG `animate` that loops. Enough of them that
 *  the straight runs between keyframes do not show as a change of pace. */
const SMOKE_FRAMES = 32;
const round = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)]);
const smokeValues = (pts: readonly Pt[], seed: number, kind: SmokeKind, X: (dx: number) => number) =>
  Array.from({ length: SMOKE_FRAMES + 1 }, (_, k) =>
    curve(round(smoke(pts, (k % SMOKE_FRAMES) * (SMOKE_PERIOD / SMOKE_FRAMES), seed, kind)), X),
  ).join(";");

/**
 * A ribbon or strand whose trailing edge drifts on its own (SMIL: no re-render per frame). The
 * figure's motion (`useJointMotion`) pauses it off screen and holds it at rest when stilled.
 */
function Drift({
  pts,
  seed,
  kind,
  X,
  fill,
}: {
  pts: readonly Pt[];
  seed: number;
  kind: SmokeKind;
  X: (dx: number) => number;
  fill: string;
}) {
  const live = !prefersStill();
  return (
    <path d={curve(pts, X)} fill={fill}>
      {live && (
        <animate
          attributeName="d"
          dur={`${SMOKE_PERIOD}s`}
          repeatCount="indefinite"
          values={smokeValues(pts, seed, kind, X)}
        />
      )}
    </path>
  );
}

/** Each side drifts from its own phase. */
export const SEED = { L: 0, R: 2.1 } as const;

/**
 * The puffs off each tip: where the tail ends (outward offset, height), then each puff's drift,
 * size and start. Drawn with a radial fade, so a puff has no edge. Declared CSS keyframes
 * (`studio.css`, `smoke-puff`), gone when the figure is stilled, off screen or under reduced motion.
 * The puffs ride the tip as it drifts (`TipPath`), so the smoke always leaves from the end.
 */
const TIP = 9;
const PUFF_FROM: Pt = RIBBON_TAIL[TIP];
const PUFFS = [
  { dx: 14, dy: -14, r: 5.2, delay: 0 },
  { dx: 6, dy: -22, r: 4.4, delay: 1 },
  { dx: 21, dy: -7, r: 4, delay: 2 },
  { dx: 11, dy: -19, r: 3.6, delay: 3 },
] as const;

/** Moves its children with the ribbon's tip as the tail drifts (SMIL, on the ribbon's clock). */
function TipPath({ seed, kind, s, children }: { seed: number; kind?: SmokeKind; s: number; children: React.ReactNode }) {
  const live = !!kind && !prefersStill();
  const values = live
    ? Array.from({ length: SMOKE_FRAMES + 1 }, (_, k) => {
        const [dx, y] = smoke(RIBBON_TAIL, (k % SMOKE_FRAMES) * (SMOKE_PERIOD / SMOKE_FRAMES), seed, kind)[TIP];
        return `${((dx - PUFF_FROM[0]) * s).toFixed(2)} ${(y - PUFF_FROM[1]).toFixed(2)}`;
      }).join(";")
    : "";
  return (
    <g>
      {live && (
        <animateTransform
          attributeName="transform"
          type="translate"
          dur={`${SMOKE_PERIOD}s`}
          repeatCount="indefinite"
          values={values}
        />
      )}
      {children}
    </g>
  );
}

/** The ribbons in a form, on whichever frame they are hung from. */
export function FinishedRibbons({
  frame = WISP,
  uid,
  form = CLEAN,
}: {
  frame?: Body;
  uid: string;
  form?: SpiritForm;
}) {
  return (
    <>
      {sides.map(([side, s]) => {
        const X = (dx: number) => 100 + dx * s;
        const g = `${uid}-ribbon-${side}`;
        const fade = form.glow ? GLOW : C.hi;
        return (
          <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, frame.j)}>
            <defs>
              {/* shaded from the shoulder down: the colour is the edge */}
              <linearGradient id={g} gradientUnits="userSpaceOnUse" x1={X(14)} y1={150} x2={X(44)} y2={RIBBON_REACH}>
                <stop offset="0" stopColor={C.soft} stopOpacity={0.95} />
                <stop offset="0.35" stopColor={C.tint} stopOpacity={0.88} />
                {/* toward the tip it turns back to the product colour (or, glowing, to the glow),
                    so a fade still reads on a pale ground */}
                <stop offset="0.72" stopColor={fade} stopOpacity={form.glow ? 0.7 : 0.5} />
                <stop offset="1" stopColor={fade} stopOpacity={0} />
              </linearGradient>
              {form.puffs && (
                /* a puff: its colour at the heart, nothing at the edge */
                <radialGradient id={`${g}-puff`}>
                  <stop offset="0" stopColor={form.glow ? GLOW : C.tint} stopOpacity={0.9} />
                  <stop offset="0.55" stopColor={form.glow ? GLOW : C.tint} stopOpacity={0.45} />
                  <stop offset="1" stopColor={form.glow ? GLOW : C.tint} stopOpacity={0} />
                </radialGradient>
              )}
            </defs>
            {form.smoke ? (
              <>
                {/* each ribbon and strand has its own seed: nothing moves together */}
                {form.strands >= 2 && (
                  <Drift pts={STRAND_INNER} seed={SEED[side] + 2.3} kind={form.smoke} X={X} fill={`url(#${g})`} />
                )}
                <Drift pts={RIBBON_TAIL} seed={SEED[side]} kind={form.smoke} X={X} fill={`url(#${g})`} />
              </>
            ) : (
              <>
                {form.strands >= 2 && <path d={curve(STRAND_INNER, X)} fill={`url(#${g})`} />}
                <path d={curve(RIBBON_TAIL, X)} fill={`url(#${g})`} />
              </>
            )}
            {form.puffs && (
              /* the smoke leaves from the tip, wherever the drift has taken it */
              <TipPath seed={SEED[side]} kind={form.smoke} s={s}>
                {PUFFS.map(({ dx, dy, r, delay }) => (
                  <circle
                    key={delay}
                    className="smoke-puff"
                    cx={X(PUFF_FROM[0])}
                    cy={PUFF_FROM[1]}
                    r={r}
                    fill={`url(#${g}-puff)`}
                    style={{ "--dx": `${dx * s}px`, "--dy": `${dy}px`, animationDelay: `${delay + (s > 0 ? 0.5 : 0)}s` } as React.CSSProperties}
                  />
                ))}
              </TipPath>
            )}
            {form.motes === "dots" &&
              SPIRIT_MOTES.map(([dx, y, r, o], i) => (
                /* the motes rise slowly through the mist, each on its own beat */
                <circle
                  key={`${dx}${y}`}
                  className="spirit-mote"
                  cx={X(dx)}
                  cy={y}
                  r={r}
                  fill={C.hi}
                  opacity={o}
                  style={{ animationDelay: `${-i * 1.3 - (s > 0 ? 0.6 : 0)}s` }}
                />
              ))}
          </g>
        );
      })}
    </>
  );
}

/** Any Wisp with its wings swapped for the ribbons in a form, and nothing else changed. */
export function withRibbon(c: Candidate, v: { id: RibbonVariantId; form: SpiritForm; label: string }): Candidate {
  return {
    ...c,
    id: `${c.id}-ribbon-${v.id}`,
    label: `${c.label} · ${v.label}`,
    behind: (x: Ctx) => (
      <g>
        <FinishedRibbons frame={c.frame} uid={x.uid} form={v.form} />
        <Flame {...x} />
      </g>
    ),
  };
}
