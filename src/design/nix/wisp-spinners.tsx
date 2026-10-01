"use client";

import * as React from "react";

import type { Candidate } from "./candidates";
import { pal } from "./firefly-wisp";
import { ActFigure, type WispAct } from "./wisp-acts";
import { EASE, fadeAt, handsAt, keys, rotAt, type Hands, type Key, type Track } from "./rig/motion";
import type { Pose } from "./rig/poses";

/**
 * Wisp — loading spinners (proposals). Loops that say "wait a moment" with the main character as
 * drawn, in place of a ring spinner. Each loop is seamless and on one clock (`rig/motion`): the
 * figure's own joint animations are the clock, its face changes on that clock (`ActFigure`), and
 * the effects layer — the glow-coloured dots some of them use — is pinned to the same clock.
 *
 * A spinner is not a reaction: it says nothing about an answer, a count or an approval, and it is
 * the same every time. It turns up while the product loads, never beside an item being answered.
 * Under reduced motion each holds its rest frame, and the dots hold one still frame of the loop.
 * The figure is `aria-hidden`; the spinner carries a status line for assistive technology.
 */

type HandKey = [number, Required<Pick<Hands, "L" | "R">> & Hands];

const DOWN: HandKey[1] = { L: [84, 214], R: [116, 214] };
const TUCK: HandKey[1] = { L: [96, 206], R: [104, 206] };
const HEART: HandKey[1] = { L: [94, 200], R: [106, 200] };

/** Fast wingbeats between two offsets, over a still stroke either side. */
function buzz(from: number, to: number, amp: number, n = 8): Track {
  const out: [number, number][] = [[0, 0], [from, 0]];
  for (let i = 1; i <= n; i++) out.push([from + ((to - from) * i) / n, i % 2 ? amp : 0]);
  out.push([1, 0]);
  return rotAt(...out);
}

/** Each segment eases on its own unless it declares otherwise. */
const eased = (t: Track): Track => t.map((k) => (k.easing ? k : { ...k, easing: "ease-in-out" }));
const linear = (t: Track): Track => t.map((k) => ({ ...k, easing: "linear" }));

/**
 * A spinner's loop runs on linear time, so the face and the effects layer read the clock straight
 * and the easing lives on each segment: a tumble's one long ease is not bent by a second one laid
 * over the whole loop.
 */
const act = (id: string, duration: number, hands: HandKey[], tracks: Pose["motion"]["tracks"]): Pose => {
  const pose: Pose = {
    id: "idle",
    title: id,
    use: "",
    mood: "neutral",
    hands: handsAt(hands),
    motion: { duration, easing: "linear", tracks: {} },
  };
  for (const [k, t] of Object.entries(tracks) as [keyof typeof tracks, Track][]) pose.motion.tracks[k] = eased(t);
  return pose;
};

/**
 * The root's pivot is under the figure (where feet would be). A tumble turns about the middle of
 * the body instead: each key rotates about the root and moves the root back by the difference.
 */
const MID_TO_ROOT = 134;
const about = (deg: number, lift = 0): Key => {
  const t = (deg * Math.PI) / 180;
  const x = -MID_TO_ROOT * Math.sin(t);
  const y = MID_TO_ROOT * Math.cos(t) - MID_TO_ROOT + lift;
  return { r: deg, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
};

/** Ease in and out, sampled into straight keys so one ease spans the whole turn. */
function tumble(from: number, to: number, a: number, b: number, lift: number, n = 18): [number, Key][] {
  const out: [number, Key][] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const s = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    out.push([a + (b - a) * u, { ...about(from + (to - from) * s, -lift * Math.sin(Math.PI * u)), e: "linear" }]);
  }
  return out;
}

export type SpinnerLayer = "none" | "ring" | "dots";

export type WispSpinner = WispAct & {
  /** The effects layer drawn with it, in the glow's colour. */
  layer: SpinnerLayer;
};

const RING_N = 10;
const RING_S = 2.4;
const DOTS_S = 2.4;
/** Where each of the three dots starts its hop, as a share of the loop. */
const HOPS = [0.08, 0.24, 0.4];

export const WISP_SPINNERS: WispSpinner[] = [
  {
    id: "tumble",
    title: "Tumble",
    line: "It leans back, tucks its hands in, and turns a full somersault about its middle — wings buzzing, antennae trailing — overshoots, settles and hovers a beat before the next. The spin is the spinner. It turns over in its own plane; it never mirrors.",
    layer: "none",
    act: act(
      "tumble",
      2.4,
      [
        [0, DOWN],
        [0.14, DOWN],
        [0.24, TUCK],
        [0.6, TUCK],
        [0.68, { L: [62, 156], R: [138, 156] }],
        [0.86, DOWN],
        [1, DOWN],
      ],
      {
        root: keys(
          [0, about(0)],
          [0.12, { ...about(0), e: EASE.anticipate }],
          [0.24, { ...about(-16), e: "linear" }],
          ...tumble(-16, 368, 0.26, 0.62, 12),
          [0.72, { ...about(360), e: EASE.settle }],
          [1, about(360)],
        ),
        torso: keys(
          [0, {}],
          [0.12, {}],
          [0.24, { sx: 1.08, sy: 0.9, e: EASE.snap }],
          [0.32, { sx: 0.93, sy: 1.1 }],
          [0.56, {}],
          [0.64, { sx: 1.07, sy: 0.92, e: EASE.overshoot }],
          [0.74, {}],
          [1, {}],
        ),
        head: rotAt([0, 0], [0.24, 6], [0.34, -8], [0.6, -4], [0.66, 7], [0.74, -3], [0.82, 0], [1, 0]),
        antL: rotAt([0, 0], [0.24, 10], [0.34, -24], [0.6, -24], [0.66, 14], [0.74, -5], [0.84, 0], [1, 0]),
        antR: rotAt([0, 0], [0.24, -10], [0.34, -18], [0.6, -18], [0.66, 16], [0.74, -6], [0.84, 0], [1, 0]),
        antTipR: rotAt([0, 0], [0.62, 0], [0.66, -26], [0.72, 12], [0.78, -5], [0.84, 0], [1, 0]),
        tail: rotAt([0, 0], [0.26, 0], [0.36, -16], [0.56, -12], [0.66, 12], [0.74, -5], [0.82, 0], [1, 0]),
        wingL: buzz(0.26, 0.62, -22, 10),
        wingR: buzz(0.26, 0.62, 22, 10),
        hindL: buzz(0.26, 0.62, 16, 14),
        hindR: buzz(0.26, 0.62, -16, 14),
        glow: fadeAt([0, 0.4], [0.26, 0.4], [0.44, 0.55], [0.66, 0.5], [0.86, 0.4], [1, 0.4]),
        shadow: keys([0, {}], [0.24, { sx: 1.08 }], [0.44, { sx: 0.7, sy: 0.8 }], [0.64, { sx: 1.08 }], [0.74, {}], [1, {}]),
      },
    ),
    faces: [
      [0, "neutral"],
      [0.12, "sly"],
      [0.26, "delighted"],
      [0.66, "happy"],
      [0.86, "neutral"],
    ],
    rest: "happy",
  },
  {
    id: "breath",
    title: "Glow breath",
    line: "The quietest: hands at its heart, it breathes its light. On the in-breath it rises, grows a little taller, its flame swells and its glow comes up; on the out-breath all of it eases back. Nothing travels, so it suits a spinner that may run for a while.",
    layer: "none",
    act: act(
      "breath",
      3.6,
      [
        [0, HEART],
        [0.45, { L: [94, 194], R: [106, 194] }],
        [0.9, HEART],
        [1, HEART],
      ],
      {
        root: keys([0, { e: EASE.settle }], [0.45, { y: -7, e: EASE.settle }], [0.9, {}], [1, {}]),
        torso: keys([0, { e: EASE.settle }], [0.45, { sx: 0.97, sy: 1.06, e: EASE.settle }], [0.9, {}], [1, {}]),
        tail: keys(
          [0, { sx: 0.92, sy: 0.9, e: EASE.settle }],
          [0.45, { sx: 1.08, sy: 1.14, e: EASE.settle }],
          [0.9, { sx: 0.92, sy: 0.9 }],
          [1, { sx: 0.92, sy: 0.9 }],
        ),
        glow: fadeAt([0, 0.28], [0.45, 0.6], [0.9, 0.28], [1, 0.28]),
        head: rotAt([0, 0], [0.45, -3], [0.9, 0], [1, 0]),
        antL: rotAt([0, 4], [0.45, -6], [0.9, 4], [1, 4]),
        antR: rotAt([0, -4], [0.45, 6], [0.9, -4], [1, -4]),
        antTipL: rotAt([0, 0], [0.5, -6], [0.95, 2], [1, 0]),
        antTipR: rotAt([0, 0], [0.5, 6], [0.95, -2], [1, 0]),
        wingL: rotAt([0, 0], [0.45, -10], [0.9, 0], [1, 0]),
        wingR: rotAt([0, 0], [0.45, 10], [0.9, 0], [1, 0]),
        hindL: rotAt([0, 0], [0.5, 6], [0.95, 0], [1, 0]),
        hindR: rotAt([0, 0], [0.5, -6], [0.95, 0], [1, 0]),
        shadow: keys([0, {}], [0.45, { sx: 0.88, sy: 0.9 }], [0.9, {}], [1, {}]),
      },
    ),
    faces: [
      [0, "neutral"],
      [0.22, "happy"],
      [0.78, "neutral"],
    ],
    rest: "neutral",
  },
  {
    id: "ring",
    title: "Spark ring",
    line: "A ring of its sparks lights up one after another round it, the classic dot spinner, and it watches the lit one go round: its head and body lean after it, its antennae trail. It hovers on the same beat. The ring is an effects layer in the glow's colour, not part of the drawing.",
    layer: "ring",
    act: act(
      "ring",
      RING_S,
      [
        [0, DOWN],
        [1, DOWN],
      ],
      (() => {
        /* the lit spark starts at the top and goes clockwise; it leans after it */
        const k = Array.from({ length: 17 }, (_, i) => i / 16);
        const s = (i: number) => Math.sin(2 * Math.PI * i);
        return {
          root: keys([0, {}], [0.25, { y: -4 }], [0.5, {}], [0.75, { y: -4 }], [1, {}]),
          head: linear(rotAt(...k.map((t): [number, number] => [t, Math.round(7 * s(t) * 10) / 10]))),
          torso: linear(rotAt(...k.map((t): [number, number] => [t, Math.round(3 * s(t - 0.06) * 10) / 10]))),
          antL: linear(rotAt(...k.map((t): [number, number] => [t, Math.round(-8 * s(t - 0.12) * 10) / 10]))),
          antR: linear(rotAt(...k.map((t): [number, number] => [t, Math.round(-8 * s(t - 0.12) * 10) / 10]))),
          tail: linear(rotAt(...k.map((t): [number, number] => [t, Math.round(-6 * s(t - 0.1) * 10) / 10]))),
          wingL: rotAt([0, 0], [0.25, -12], [0.5, 0], [0.75, -12], [1, 0]),
          wingR: rotAt([0, 0], [0.25, 12], [0.5, 0], [0.75, 12], [1, 0]),
          hindL: rotAt([0, 0], [0.125, 8], [0.25, -10], [0.375, 8], [0.5, 0], [0.625, 8], [0.75, -10], [0.875, 8], [1, 0]),
          hindR: rotAt([0, 0], [0.125, -8], [0.25, 10], [0.375, -8], [0.5, 0], [0.625, -8], [0.75, 10], [0.875, -8], [1, 0]),
          glow: fadeAt([0, 0.4], [0.5, 0.5], [1, 0.4]),
        };
      })(),
    ),
    faces: [[0, "curious"]],
    rest: "curious",
  },
  {
    id: "dots",
    title: "Counting dots",
    line: "Three of its sparks wait beside it and hop in turn, the dots of a typing indicator; it nods to each as it goes — one, two, three — with a boing of its antenna, then straightens and waits for the next round. The dots are an effects layer in the glow's colour.",
    layer: "dots",
    act: act(
      "dots",
      DOTS_S,
      [
        [0, DOWN],
        [0.06, DOWN],
        [0.14, { L: [84, 214], R: [130, 196] }],
        [0.6, { L: [84, 214], R: [130, 196] }],
        [0.7, DOWN],
        [1, DOWN],
      ],
      (() => {
        const nods = HOPS.flatMap((a, i): [number, number][] => [
          [a + 0.04, 3 + i * 3],
          [a + 0.12, 7 + i * 3],
        ]);
        const boing = HOPS.flatMap((a): [number, number][] => [
          [a + 0.1, 0],
          [a + 0.12, -16],
          [a + 0.15, 8],
        ]);
        const bob = HOPS.flatMap((a): [number, Key][] => [
          [a + 0.04, {}],
          [a + 0.12, { y: -3 }],
          [a + 0.15, {}],
        ]);
        return {
          root: keys([0, {}], ...bob, [1, {}]),
          head: rotAt([0, 0], ...nods, [0.66, 12], [0.72, -3], [0.8, 0], [1, 0]),
          torso: rotAt([0, 0], [0.12, 3], [0.6, 4], [0.7, -2], [0.78, 0], [1, 0]),
          antTipR: rotAt([0, 0], ...boing, [0.6, 0], [1, 0]),
          antL: rotAt([0, 0], [0.12, 6], [0.62, 10], [0.7, -6], [0.8, 0], [1, 0]),
          antR: rotAt([0, 0], [0.12, 6], [0.62, 10], [0.7, -6], [0.8, 0], [1, 0]),
          tail: rotAt([0, 0], [0.12, -6], [0.62, -8], [0.7, 6], [0.8, 0], [1, 0]),
          wingL: rotAt([0, 0], [0.7, 0], [0.76, -14], [0.82, 0], [1, 0]),
          wingR: rotAt([0, 0], [0.7, 0], [0.76, 14], [0.82, 0], [1, 0]),
          glow: fadeAt([0, 0.4], [1, 0.4]),
        };
      })(),
    ),
    faces: [
      [0, "neutral"],
      [0.08, "focused"],
      [0.64, "happy"],
      [0.88, "neutral"],
    ],
    rest: "neutral",
  },
];

/* ——— The effects layer ———
 * Dots in the glow's colour with the glow's own edge, as the spark trail draws them. They are
 * WAAPI animations whose start time is the figure's: one clock. */

const GLOW = pal.glow;
const EDGE = "var(--char-glow-edge)";

/** A ring spark's brightness over the loop, from the moment it is lit. */
const RING_KEYS: Keyframe[] = [
  { offset: 0, opacity: 1, scale: "1.3" },
  { offset: 0.45, opacity: 0.18, scale: "0.62" },
  { offset: 1, opacity: 0.18, scale: "0.62" },
];

/** The still frame: each spark where the loop's start leaves it. */
function ringStill(i: number) {
  const age = (1 - i / RING_N) % 1;
  const u = Math.min(1, age / 0.45);
  return { opacity: 1 - 0.82 * u, scale: 1.3 - 0.68 * u };
}

function hopKeys(a: number): Keyframe[] {
  return [
    { offset: 0, translate: "0px 0px", scale: "1 1" },
    { offset: a, translate: "0px 0px", scale: "1 1", easing: EASE.anticipate },
    { offset: a + 0.04, translate: "0px 1px", scale: "1.18 0.8", easing: EASE.snap },
    { offset: a + 0.12, translate: "0px -18px", scale: "0.9 1.12", easing: EASE.fall },
    { offset: a + 0.2, translate: "0px 0px", scale: "1.18 0.82", easing: EASE.overshoot },
    { offset: a + 0.26, translate: "0px 0px", scale: "1 1" },
    { offset: 1, translate: "0px 0px", scale: "1 1" },
  ];
}

function Dot({ r }: { r: number }) {
  return (
    <>
      <circle r={r * 2.3} fill={GLOW} opacity={0.3} />
      <circle r={r} fill={GLOW} stroke={EDGE} strokeWidth={0.8} />
    </>
  );
}

/**
 * Pins the effects layer's animations to the figure's clock: the root's animation, found in `box`.
 * When the figure is off screen its animations are cancelled, and the layer pauses with it.
 */
function useLayerClock(
  box: React.RefObject<HTMLDivElement | null>,
  layer: React.RefObject<SVGSVGElement | null>,
  seconds: number,
  build: (svg: SVGSVGElement, ms: number) => Animation[],
) {
  React.useEffect(() => {
    const svg = layer.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ms = seconds * 1000;
    const anims = build(svg, ms);
    anims.forEach((a) => a.pause());
    const find = () =>
      box.current
        ?.querySelector('[data-joint="root"]')
        ?.getAnimations()
        .find((x) => x.effect?.getTiming().duration === ms);
    let clock: Animation | undefined;
    const sync = () => {
      if (!clock || clock.playState === "idle") clock = find();
      const start = clock?.playState === "running" ? clock.startTime : null;
      for (const a of anims) {
        if (start === null) {
          if (a.playState === "running") a.pause();
        } else if (a.startTime !== start) {
          a.startTime = start;
        }
      }
    };
    sync();
    const id = window.setInterval(sync, 250);
    return () => {
      window.clearInterval(id);
      anims.forEach((a) => a.cancel());
    };
  }, [box, layer, seconds, build]);
}

const buildRing = (svg: SVGSVGElement, ms: number) =>
  Array.from(svg.querySelectorAll<SVGGElement>("[data-spark]")).map((el) => {
    const i = Number(el.dataset.spark);
    return el.animate(RING_KEYS, { duration: ms, iterations: Infinity, delay: (i / RING_N) * ms - ms, easing: "linear" });
  });

const buildDots = (svg: SVGSVGElement, ms: number) =>
  Array.from(svg.querySelectorAll<SVGGElement>("[data-hop]")).map((el) =>
    el.animate(hopKeys(HOPS[Number(el.dataset.hop)]), { duration: ms, iterations: Infinity }),
  );

/** One spinner: the figure acting the loop, with its effects layer on the same clock. */
export function SpinnerFigure({
  c,
  s,
  size = "h-56",
  status = "Loading",
}: {
  c: Candidate;
  s: WispSpinner;
  /** The spinner's height (a Tailwind class); its width follows. */
  size?: string;
  status?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const layer = React.useRef<SVGSVGElement>(null);
  const build = s.layer === "ring" ? buildRing : buildDots;
  useLayerClock(box, layer, s.act.motion.duration, build);

  /* a tumble turns the figure on its side, so it gets a square and may draw past its own box */
  const aspect = s.layer === "dots" ? "aspect-[5/4]" : "aspect-square";
  return (
    <div ref={box} role="status" className={`relative mx-auto ${size} ${aspect}`}>
      <span className="sr-only">{status}</span>
      {s.layer === "ring" && (
        <svg ref={layer} viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
          {Array.from({ length: RING_N }, (_, i) => {
            const t = (2 * Math.PI * i) / RING_N;
            const still = ringStill(i);
            return (
              <g key={i} transform={`translate(${84 * Math.sin(t)} ${-84 * Math.cos(t)})`}>
                <g
                  data-spark={i}
                  style={{ opacity: still.opacity, scale: String(still.scale), transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <Dot r={5} />
                </g>
              </g>
            );
          })}
        </svg>
      )}
      {s.layer === "dots" && (
        <svg ref={layer} viewBox="0 0 250 200" className="absolute inset-0 h-full w-full" aria-hidden>
          {HOPS.map((_, i) => (
            <g key={i} transform={`translate(${164 + i * 26} 120)`}>
              <g data-hop={i} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
                <Dot r={4.6} />
              </g>
            </g>
          ))}
        </svg>
      )}
      <ActFigure
        c={c}
        a={s}
        className={
          s.layer === "dots"
            ? "absolute left-0 top-0 h-full aspect-[2/3] translate-x-[12%]"
            : `absolute left-1/2 top-1/2 aspect-[2/3] -translate-x-1/2 -translate-y-1/2 [&_svg]:overflow-visible ${
                s.layer === "ring" ? "h-[86%]" : "h-full"
              }`
        }
      />
    </div>
  );
}
