"use client";

import * as React from "react";

import type { Candidate } from "./candidates";
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
const HEART: HandKey[1] = { L: [94, 200], R: [106, 200] };

/** Each segment eases on its own unless it declares otherwise. */
const eased = (t: Track): Track => t.map((k) => (k.easing ? k : { ...k, easing: "ease-in-out" }));
const linear = (t: Track): Track => t.map((k) => ({ ...k, easing: "linear" }));

/**
 * A spinner's loop runs on linear time, so the face and the effects layer read the clock straight
 * and the easing lives on each segment: one long ease is not bent by a second one laid
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

export type SpinnerLayer = "none" | "ring" | "dots" | "orbit" | "ripple";

export type WispSpinner = WispAct & {
  /** The effects layer drawn with it, in the glow's colour. */
  layer: SpinnerLayer;
  /** Fixed lines shown as text beside the figure, one per loop, cycling. Never lettering in the SVG. */
  words?: string[];
};

/** A head, body and antennae that lean after something going round once a loop. */
const lean = (amp: number, lag: number, k: number[]): Track =>
  rotAt(...k.map((t): [number, number] => [t, Math.round(amp * Math.sin(2 * Math.PI * (t - lag)) * 10) / 10]));
const SAMPLES = Array.from({ length: 17 }, (_, i) => i / 16);

const ORBIT_S = 2.8;
const RIPPLE_S = 3.2;

const RING_N = 10;
const RING_S = 2.4;
const DOTS_S = 2.4;
/** Where each of the three dots starts its hop, as a share of the loop. */
const HOPS = [0.08, 0.24, 0.4];

/** Shared acts: the spinners with words reuse the figure of the one without. */
const BREATH_ACT = act(
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
);

/** A lantern on a hook in a light wind: it swings about its hook and rises a little at the bottom of each swing. */
const SWAY_ACT = act(
  "sway",
  3.2,
  [
    [0, DOWN],
    [1, DOWN],
  ],
  (() => {
    const c = (t: number) => Math.cos(2 * Math.PI * t);
    const r1 = (n: number) => Math.round(n * 100) / 100;
    return {
      root: linear(
        keys(...SAMPLES.map((t): [number, Key] => [t, { x: r1(-9 * c(t)), r: r1(-4 * c(t)), y: r1(-2.5 * (1 - c(2 * t))), e: "linear" }])),
      ),
      head: linear(lean(5, 0.1, SAMPLES)),
      antL: linear(lean(-9, 0.2, SAMPLES)),
      antR: linear(lean(-9, 0.22, SAMPLES)),
      tail: linear(lean(-7, 0.18, SAMPLES)),
      wingL: rotAt([0, 0], [0.25, -9], [0.5, 0], [0.75, -9], [1, 0]),
      wingR: rotAt([0, 0], [0.25, 9], [0.5, 0], [0.75, 9], [1, 0]),
      glow: fadeAt([0, 0.34], [0.25, 0.5], [0.5, 0.34], [0.75, 0.5], [1, 0.34]),
    };
  })(),
);

/** It follows a spark circling it: head and antennae lean after it. */
const ORBIT_ACT = act(
  "orbit",
  ORBIT_S,
  [
    [0, DOWN],
    [1, DOWN],
  ],
  {
    root: keys([0, {}], [0.25, { y: -4 }], [0.5, {}], [0.75, { y: -4 }], [1, {}]),
    head: linear(lean(8, 0, SAMPLES)),
    torso: linear(lean(3, 0.06, SAMPLES)),
    antL: linear(lean(-8, 0.12, SAMPLES)),
    antR: linear(lean(-8, 0.12, SAMPLES)),
    tail: linear(lean(-6, 0.1, SAMPLES)),
    wingL: rotAt([0, 0], [0.25, -10], [0.5, 0], [0.75, -10], [1, 0]),
    wingR: rotAt([0, 0], [0.25, 10], [0.5, 0], [0.75, 10], [1, 0]),
    glow: fadeAt([0, 0.4], [0.5, 0.5], [1, 0.4]),
  },
);

export const WISP_SPINNERS: WispSpinner[] = [
  {
    id: "breath",
    title: "Glow breath",
    line: "The quietest: hands at its heart, it breathes its light. On the in-breath it rises, grows a little taller, its flame swells and its glow comes up; on the out-breath all of it eases back. Nothing travels, so it suits a spinner that may run for a while.",
    layer: "none",
    act: BREATH_ACT,
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
    line: "Three of its sparks hop in turn, the dots of a typing indicator; it watches them with a patient nod for each. It never smiles, straightens or flicks its wings at the end of a round, so nothing reads as an arrival and a long wait is not mocked. The dots are an effects layer in the glow's colour.",
    layer: "dots",
    act: act(
      "dots",
      DOTS_S,
      [
        [0, { L: [84, 214], R: [130, 196] }],
        [1, { L: [84, 214], R: [130, 196] }],
      ],
      (() => {
        const nods = HOPS.flatMap((a, i): [number, number][] => [
          [a + 0.04, 2 + i * 2],
          [a + 0.12, 5 + i * 2],
        ]);
        const boing = HOPS.flatMap((a): [number, number][] => [
          [a + 0.1, 0],
          [a + 0.12, -12],
          [a + 0.15, 5],
        ]);
        const bob = HOPS.flatMap((a): [number, Key][] => [
          [a + 0.04, {}],
          [a + 0.12, { y: -3 }],
          [a + 0.15, {}],
        ]);
        return {
          root: keys([0, {}], ...bob, [1, {}]),
          head: rotAt([0, 0], ...nods, [0.8, 5], [1, 0]),
          torso: rotAt([0, 3], [0.5, 4], [1, 3]),
          antTipR: rotAt([0, 0], ...boing, [0.6, 0], [1, 0]),
          antL: rotAt([0, 6], [0.5, 8], [1, 6]),
          antR: rotAt([0, 6], [0.5, 8], [1, 6]),
          tail: rotAt([0, -6], [0.5, -7], [1, -6]),
          glow: fadeAt([0, 0.4], [1, 0.4]),
        };
      })(),
    ),
    faces: [[0, "focused"]],
    rest: "focused",
  },
  {
    id: "sway",
    title: "Lantern sway",
    line: "It hangs in the air like a lantern on a hook in a light wind: it swings slowly side to side, its antennae and tail trailing a beat behind, rising a little at the bottom of each swing, its glow brightest as it passes through the middle. Nothing in it builds or arrives, so it holds up however long the wait.",
    layer: "none",
    act: SWAY_ACT,
    faces: [[0, "neutral"]],
    rest: "neutral",
  },
  {
    id: "orbit",
    title: "Orbit",
    line: "One spark, with a short tail of fainter ones behind it, circles Wisp on a tilted loop, passing behind it and in front; Wisp follows it with its eyes, head and antennae. One spark, not ten: quieter than the ring, and the depth makes it read at a glance.",
    layer: "orbit",
    act: ORBIT_ACT,
    faces: [[0, "curious"]],
    rest: "curious",
  },
  {
    id: "ripple",
    title: "Ripple",
    line: "Wisp hovers and sends rings of its glow out across the water, one after another, each widening and fading as it goes; its flame brightens as a ring leaves and settles. It tilts a little to watch them go. The rings are an effects layer in the glow's colour.",
    layer: "ripple",
    act: act(
      "ripple",
      RIPPLE_S,
      [
        [0, HEART],
        [1, HEART],
      ],
      {
        root: keys([0, {}], [0.25, { y: -4, e: EASE.settle }], [0.5, {}], [0.75, { y: -4, e: EASE.settle }], [1, {}]),
        torso: keys([0, { e: EASE.settle }], [0.25, { sx: 0.98, sy: 1.04, e: EASE.settle }], [0.5, {}], [0.75, { sx: 0.98, sy: 1.04 }], [1, {}]),
        head: linear(lean(4, 0.12, SAMPLES)),
        antL: linear(lean(-6, 0.2, SAMPLES)),
        antR: linear(lean(-6, 0.2, SAMPLES)),
        wingL: rotAt([0, 0], [0.25, -8], [0.5, 0], [0.75, -8], [1, 0]),
        wingR: rotAt([0, 0], [0.25, 8], [0.5, 0], [0.75, 8], [1, 0]),
        glow: fadeAt([0, 0.6], [0.2, 0.38], [0.5, 0.6], [0.7, 0.38], [1, 0.6]),
      },
    ),
    faces: [[0, "curious"]],
    rest: "curious",
  },
  {
    id: "breath-words",
    title: "Glow breath · words",
    line: "The glow breath with a line beside it that changes every breath. The lines are honest about time: they describe what Wisp is doing, never how far along it is, and the last one owns up to a long wait. They are fixed copy shown as text, never lettering in the drawing.",
    layer: "none",
    act: BREATH_ACT,
    faces: [
      [0, "neutral"],
      [0.22, "happy"],
      [0.78, "neutral"],
    ],
    rest: "neutral",
    words: ["Lighting a lantern…", "Gathering your things…", "Warming things up…", "Taking a little longer than usual — still on it"],
  },
  {
    id: "sway-words",
    title: "Lantern sway · words",
    line: "The lantern sway with a line beside it that changes every other swing. It keeps a neutral face the whole time, so the words can carry the tone: a pause, a thank-you for waiting, and nothing that promises an end.",
    layer: "none",
    act: SWAY_ACT,
    faces: [[0, "neutral"]],
    rest: "neutral",
    words: ["Hanging the lanterns…", "Following the glow…", "Thanks for waiting — still on it"],
  },
  {
    id: "orbit-words",
    title: "Orbit · words",
    line: "Wisp follows its spark round while a line beside it changes every lap. Playful but never cheerful at the user's expense: the curious face is the same on every line, including the apology.",
    layer: "orbit",
    act: ORBIT_ACT,
    faces: [[0, "curious"]],
    rest: "curious",
    words: ["Following a spark…", "Round we go…", "Sorry, this one is slow — thank you for your patience"],
  },
];

/* ——— The effects layer ———
 * Dots in the glow's colour with the glow's own edge, as the spark trail draws them. They are
 * WAAPI animations whose start time is the figure's: one clock. */

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

function Dot({ r, glow }: { r: number; glow: string }) {
  return (
    <>
      <circle r={r * 2.3} fill={glow} opacity={0.3} />
      <circle r={r} fill={glow} stroke={EDGE} strokeWidth={0.8} />
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

const ORBIT = { rx: 74, ry: 24, cy: 6, tilt: -12 };
/** Position and size of an orbiting spark at a share `u` of the lap, tilted, larger in front. */
function orbitAt(u: number) {
  const a = 2 * Math.PI * u;
  const x = ORBIT.rx * Math.sin(a);
  const y = ORBIT.cy + ORBIT.ry * Math.cos(a) * -1;
  const t = (ORBIT.tilt * Math.PI) / 180;
  return { x: x * Math.cos(t) - (y - ORBIT.cy) * Math.sin(t), y: ORBIT.cy + x * Math.sin(t) + (y - ORBIT.cy) * Math.cos(t), front: -Math.cos(a) };
}
const ORBIT_KEYS: Keyframe[] = Array.from({ length: 33 }, (_, i) => {
  const p = orbitAt(i / 32);
  return { offset: i / 32, translate: `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`, scale: String((1 + 0.3 * p.front).toFixed(3)) };
});
/** The spark and its three fainter followers, each a little behind the one before. */
const ORBIT_LAG = [0, 0.035, 0.07, 0.105];

const buildOrbit = (svg: SVGSVGElement, ms: number) =>
  Array.from(svg.querySelectorAll<SVGGElement>("[data-orb]")).map((el) =>
    el.animate(ORBIT_KEYS, { duration: ms, iterations: Infinity, delay: -ORBIT_LAG[Number(el.dataset.orb)] * ms, easing: "linear" }),
  );

/** A ripple widens from the body and fades; two share the loop half a lap apart. */
const RIPPLE_KEYS: Keyframe[] = [
  { offset: 0, opacity: 0.7, scale: "0.25" },
  { offset: 0.5, opacity: 0, scale: "1" },
  { offset: 1, opacity: 0, scale: "1" },
];
const buildRipple = (svg: SVGSVGElement, ms: number) =>
  Array.from(svg.querySelectorAll<SVGGElement>("[data-ripple]")).map((el) =>
    el.animate(RIPPLE_KEYS, { duration: ms, iterations: Infinity, delay: -Number(el.dataset.ripple) * ms, easing: "ease-out" }),
  );

const buildDots = (svg: SVGSVGElement, ms: number) =>
  Array.from(svg.querySelectorAll<SVGGElement>("[data-hop]")).map((el) =>
    el.animate(hopKeys(HOPS[Number(el.dataset.hop)]), { duration: ms, iterations: Infinity }),
  );

const BUILDERS = { ring: buildRing, dots: buildDots, orbit: buildOrbit, ripple: buildRipple, none: () => [] as Animation[] };

/**
 * The words of a spinner with them, one per loop of its figure, cycling. They are fixed copy shown
 * as text, and they are the status line for assistive technology. Under reduced motion the first
 * line holds.
 */
function Words({ lines, seconds, align }: { lines: string[]; seconds: number; align: "left" | "center" }) {
  const [i, setI] = React.useState(0);
  const el = React.useRef<HTMLParagraphElement>(null);
  const still = React.useRef(false);
  React.useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % lines.length), seconds * 1000);
    return () => window.clearInterval(id);
  }, [lines.length, seconds]);
  React.useEffect(() => {
    if (i && !still.current) el.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
  }, [i]);
  return (
    <p ref={el} role="status" className={`material m-0 text-sm text-muted-foreground ${align === "center" ? "text-center" : "text-left"}`}>
      {lines[i]}
    </p>
  );
}

/** One spinner: the figure acting the loop, with its effects layer on the same clock. */
export function SpinnerFigure({
  c,
  s,
  size = "h-56",
  status = "Loading",
  words = "beside",
}: {
  c: Candidate;
  s: WispSpinner;
  /** The spinner's height (a Tailwind class); its width follows. */
  size?: string;
  status?: string;
  /** Where a spinner with words puts them. */
  words?: "beside" | "below";
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const layer = React.useRef<SVGSVGElement>(null);
  useLayerClock(box, layer, s.act.motion.duration, BUILDERS[s.layer]);

  /* the dots sit to the right of the figure; the others get a square and may draw past their own box */
  const aspect = s.layer === "dots" ? "aspect-[5/4]" : "aspect-square";
  const figure = (
    <div ref={box} role={s.words ? undefined : "status"} className={`relative mx-auto ${size} ${aspect} shrink-0`}>
      {!s.words && <span className="sr-only">{status}</span>}
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
                  <Dot r={5} glow={c.pal.glow} />
                </g>
              </g>
            );
          })}
        </svg>
      )}
      {s.layer === "orbit" && (
        <svg ref={layer} viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {ORBIT_LAG.map((_, i) => (
            <g key={i} data-orb={i} style={{ opacity: 1 - i * 0.24, transformBox: "fill-box", transformOrigin: "center" }}>
              <Dot r={5 - i * 0.9} glow={c.pal.glow} />
            </g>
          ))}
        </svg>
      )}
      {s.layer === "ripple" && (
        <svg ref={layer} viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
          {[0, 0.5].map((phase) => (
            <g key={phase} transform="translate(0 4)">
              <g data-ripple={phase} style={{ opacity: 0, transformBox: "fill-box", transformOrigin: "center" }}>
                <ellipse rx={92} ry={36} fill="none" stroke={c.pal.glow} strokeWidth={2.2} />
                <ellipse rx={92} ry={36} fill="none" stroke={EDGE} strokeWidth={0.6} opacity={0.7} />
              </g>
            </g>
          ))}
        </svg>
      )}
      {s.layer === "dots" && (
        <svg ref={layer} viewBox="0 0 250 200" className="absolute inset-0 h-full w-full" aria-hidden>
          {HOPS.map((_, i) => (
            <g key={i} transform={`translate(${164 + i * 26} 120)`}>
              <g data-hop={i} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
                <Dot r={4.6} glow={c.pal.glow} />
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
                s.layer === "ring" || s.layer === "orbit" || s.layer === "ripple" ? "h-[86%]" : "h-full"
              }`
        }
      />
    </div>
  );
  if (!s.words) return figure;
  return (
    <div className={`flex items-center gap-3 ${words === "below" ? "flex-col" : "flex-row"}`}>
      {figure}
      <Words lines={s.words} seconds={s.act.motion.duration} align={words === "below" ? "center" : "left"} />
    </div>
  );
}
