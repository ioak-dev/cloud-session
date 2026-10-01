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
 * - `smoke`: the ribbon's trailing edge moves on its own, like smoke (`smoke` below), separately
 *   from the wing's flap and from the other ribbon; the strand drifts on its own beat too.
 */
export type SpiritForm = {
  strands: 1 | 2;
  motes: "dots" | "none";
  glow?: boolean;
  smoke?: boolean;
};

/** Clean: one ribbon each side, fading to nothing, nothing inside. */
export const CLEAN: SpiritForm = { strands: 1, motes: "none" };
/** Glow tips: Clean, with the ribbons fading to the glow's gold. */
export const GLOW_TIPS: SpiritForm = { ...CLEAN, glow: true };
/** Spirit: a thinner strand inside each ribbon, and a few motes fading with it. */
export const SPIRIT: SpiritForm = { strands: 2, motes: "dots", smoke: true };

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
    note: "The simplest spirit: one ribbon each side, fading to nothing, nothing inside it. The fade does all the work.",
  },
  {
    id: "glow",
    label: "Glow tips",
    form: GLOW_TIPS,
    note: "Clean, but as the ribbons fade they turn from the product colour to the glow's gold, as if the firefly's light seeps out through its wings. The only Wisp whose wings carry its ability.",
  },
  {
    id: "spirit",
    label: "Spirit",
    form: SPIRIT,
    note: "Longer ribbons that fade to nothing, a thinner strand trailing inside each, and a few motes fading with them: Wisp seems made of light and mist from the shoulders down.",
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
/** The most a point at the tip drifts, in figure units. */
const SMOKE_REACH = 9;

/**
 * Drifts a ribbon curve as smoke does. A point's drift grows from nothing at the shoulder to full
 * at the tip, and each point has its own phase, so the edge ripples instead of swinging as one:
 * the tail curls one way while the middle goes the other. Two beats per point (one and two cycles)
 * keep it from reading as a sine. `seed` makes each ribbon and strand its own.
 */
export function smoke(pts: readonly Pt[], t: number, seed: number): Pt[] {
  const th = (2 * Math.PI * t) / SMOKE_PERIOD;
  return pts.map(([dx, y], i) => {
    const w = Math.min(1, Math.max(0, (y - 168) / 88)) ** 1.6;
    const ph = seed + i * 0.95;
    return [
      dx + w * SMOKE_REACH * (Math.sin(th + ph) + 0.45 * Math.sin(2 * th + 1.7 * ph)),
      y + w * SMOKE_REACH * 0.45 * Math.cos(th + 1.3 * ph),
    ];
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

/** Keyframes of a drifting curve, as the values of an SVG `animate` that loops. */
const SMOKE_FRAMES = 16;
const smokeValues = (pts: readonly Pt[], seed: number, X: (dx: number) => number) =>
  Array.from({ length: SMOKE_FRAMES + 1 }, (_, k) =>
    curve(smoke(pts, (k % SMOKE_FRAMES) * (SMOKE_PERIOD / SMOKE_FRAMES), seed), X),
  ).join(";");

/** A ribbon or strand whose trailing edge drifts on its own (SMIL: no re-render per frame). */
function Drift({ pts, seed, X, fill }: { pts: readonly Pt[]; seed: number; X: (dx: number) => number; fill: string }) {
  const live = !prefersStill();
  return (
    <path d={curve(pts, X)} fill={fill}>
      {live && (
        <animate
          attributeName="d"
          dur={`${SMOKE_PERIOD}s`}
          repeatCount="indefinite"
          values={smokeValues(pts, seed, X)}
        />
      )}
    </path>
  );
}

/** Each side drifts from its own phase. */
export const SEED = { L: 0, R: 2.1 } as const;

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
            </defs>
            {form.smoke ? (
              <>
                {/* each ribbon and strand has its own seed: nothing moves together */}
                {form.strands >= 2 && <Drift pts={STRAND_INNER} seed={SEED[side] + 2.3} X={X} fill={`url(#${g})`} />}
                <Drift pts={RIBBON_TAIL} seed={SEED[side]} X={X} fill={`url(#${g})`} />
              </>
            ) : (
              <>
                {form.strands >= 2 && <path d={curve(STRAND_INNER, X)} fill={`url(#${g})`} />}
                <path d={curve(RIBBON_TAIL, X)} fill={`url(#${g})`} />
              </>
            )}
            {form.motes === "dots" &&
              SPIRIT_MOTES.map(([dx, y, r, o]) => (
                <circle key={`${dx}${y}`} cx={X(dx)} cy={y} r={r} fill={C.hi} opacity={o} />
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
