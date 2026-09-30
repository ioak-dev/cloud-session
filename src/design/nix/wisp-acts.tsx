"use client";

import * as React from "react";

import type { Candidate } from "./candidates";
import { STALK_IDLE, ALIVE_IDLE } from "./wisp-warm";
import type { Mood } from "./rig/face";
import { EASE, fadeAt, handsAt, keys, rotAt, type Hands, type Key, type Track } from "./rig/motion";
import { NixFigure } from "./rig/NixFigure";
import type { Pose } from "./rig/poses";

/**
 * Wisp, warmer — acting. Proposals for what made it laid back: it floated level and centred on one
 * even, slow beat, always looked straight at you, never changed shape, and never did anything
 * with its own light. Each act here breaks one of those:
 *
 * - off balance: it leans, sinks, peeks round an edge;
 * - rhythm: stillness, then something sudden — holds, snaps and overshoots, not even easing;
 * - eyes: glances away and back, side-eye, a caught look;
 * - squash and stretch: it gathers before it pops, stretches in surprise, squashes as it lands;
 * - its light: it hides its glow, hiccups it, and lets it flare.
 *
 * An act is declared keyframes on one clock (`rig/motion`), and its face changes on that same
 * clock: the expression is read from the act's own animation time, not a second timer. Stilled
 * or under reduced motion, the figure holds the act's first frame and its `rest` face.
 */

type HandKey = [number, Required<Pick<Hands, "L" | "R">> & Hands];

/** Its hands at rest (chibi space): one under its heart, one up in a hey. */
const REST: HandKey[1] = { L: [99, 200], R: [142, 148], outR: true };
const DOWN: HandKey[1] = { L: [84, 214], R: [116, 214] };

/** Fast wingbeats between two offsets, over a still stroke either side. */
function buzz(from: number, to: number, amp: number, n = 8): Track {
  const out: [number, number][] = [[0, 0], [from, 0]];
  for (let i = 1; i <= n; i++) out.push([from + ((to - from) * i) / n, i % 2 ? amp : 0]);
  out.push([1, 0]);
  return rotAt(...out);
}

export type WispAct = {
  id: string;
  title: string;
  /** What it breaks in the old stance, and where it could play. */
  line: string;
  act: Pose;
  /** The face over the act's clock: [offset, mood], each held until the next. */
  faces: [number, Mood][];
  /** The face it holds when stilled. */
  rest: Mood;
};

const act = (id: string, duration: number, hands: HandKey[], tracks: Pose["motion"]["tracks"]): Pose => ({
  id: "idle",
  title: id,
  use: "",
  mood: "neutral",
  hands: handsAt(hands),
  motion: { duration, easing: "ease-in-out", tracks },
});

export const WISP_ACTS: WispAct[] = [
  {
    id: "glance",
    title: "At rest — never still",
    line: "Its resting loop: it leans in, drifts up and hangs there, drops with a squash and pops back; meanwhile its eyes wander off — a side-glance, a look up at something — and snap back to you. Its antennae twitch and boing. Where: beside a field nobody is typing in.",
    act: act("glance", 4, [[0, REST], [1, REST]], { ...STALK_IDLE, ...ALIVE_IDLE }),
    faces: [
      [0, "neutral"],
      [0.18, "sly"],
      [0.34, "neutral"],
      [0.62, "thinking"],
      [0.76, "curious"],
      [0.84, "neutral"],
    ],
    rest: "neutral",
  },
  {
    id: "surprise",
    title: "Surprise take",
    line: "Rhythm and squash and stretch: calm, then it gathers into a squash, pops up stretched tall with its arms thrown up and its wings buzzing, hangs, drops and lands with a squash and a wobble — and laughs at itself. Where: the first time focus lands in the form.",
    act: act(
      "surprise",
      3,
      [
        [0, DOWN],
        [0.2, DOWN],
        [0.25, { L: [90, 204], R: [110, 204] }],
        [0.32, { L: [56, 132], R: [144, 132] }],
        [0.55, { L: [60, 138], R: [140, 138] }],
        [0.68, { L: [80, 206], R: [120, 206] }],
        [0.8, REST],
        [1, DOWN],
      ],
      {
        root: keys(
          [0, {}],
          [0.2, {}],
          [0.25, { y: 4, e: EASE.snap }],
          [0.33, { y: -30 }],
          [0.55, { y: -27, e: EASE.fall }],
          [0.63, { y: 3, e: EASE.overshoot }],
          [0.7, { y: -3 }],
          [0.78, {}],
          [1, {}],
        ),
        torso: keys(
          [0, {}],
          [0.2, {}],
          [0.25, { sx: 1.14, sy: 0.84, e: EASE.snap }],
          [0.31, { sx: 0.88, sy: 1.18 }],
          [0.4, { r: -3 }],
          [0.55, { r: 2 }],
          [0.63, { sx: 1.14, sy: 0.86, e: EASE.overshoot }],
          [0.7, { sx: 0.96, sy: 1.05, r: -3 }],
          [0.78, { r: 3 }],
          [0.86, { r: -2 }],
          [0.92, {}],
          [1, {}],
        ),
        head: rotAt([0, 0], [0.25, 0], [0.32, -6], [0.55, 4], [0.66, -4], [0.72, 6], [0.8, -5], [0.88, 3], [1, 0]),
        shadow: keys([0, {}], [0.25, { sx: 1.1 }], [0.33, { sx: 0.6, sy: 0.7 }], [0.55, { sx: 0.62, sy: 0.7 }], [0.63, { sx: 1.1 }], [0.75, {}], [1, {}]),
        wingL: buzz(0.26, 0.58, -24, 10),
        wingR: buzz(0.26, 0.58, 24, 10),
        hindL: buzz(0.26, 0.58, 18, 14),
        hindR: buzz(0.26, 0.58, -18, 14),
        glow: fadeAt([0, 0.45], [0.25, 0.45], [0.32, 1], [0.55, 0.9], [0.72, 0.55], [1, 0.45]),
        antTipR: rotAt([0, 0], [0.26, 0], [0.32, -32], [0.38, 18], [0.44, -9], [0.5, 4], [0.64, -18], [0.7, 10], [0.76, -4], [1, 0]),
        antTipL: rotAt([0, 0], [0.26, 0], [0.32, 20], [0.38, -12], [0.44, 5], [0.5, 0], [0.64, 12], [0.7, -6], [1, 0]),
        tail: rotAt([0, 0], [0.25, 0], [0.33, 14], [0.4, -8], [0.5, 4], [0.64, -10], [0.72, 5], [1, 0]),
      },
    ),
    faces: [
      [0, "neutral"],
      [0.24, "surprised"],
      [0.64, "oops"],
      [0.72, "happy"],
      [0.92, "neutral"],
    ],
    rest: "surprised",
  },
  {
    id: "peek",
    title: "Sneak peek",
    line: "Off balance and eyes: it leans right over as if peeking round the edge of the form, side-eyeing; freezes when it catches you looking; snaps back upright with an overshoot and looks innocent. Where: while the learner reads the page, before anything is typed.",
    act: act(
      "peek",
      4.4,
      [
        [0, REST],
        [0.12, DOWN],
        [0.28, { L: [80, 206], R: [150, 158], outR: true }],
        [0.58, { L: [80, 206], R: [150, 158], outR: true }],
        [0.62, { L: [96, 214], R: [104, 214] }],
        [0.9, { L: [96, 214], R: [104, 214] }],
        [1, REST],
      ],
      {
        torso: keys(
          [0, { r: 4 }],
          [0.12, { r: -4, y: 1 }],
          [0.28, { r: 24, y: 6, x: 4 }],
          [0.46, { r: 26, y: 6, x: 5 }],
          [0.5, { r: 26, y: 6, x: 5 }],
          [0.58, { r: 26, y: 6, x: 5, e: EASE.overshoot }],
          [0.64, { r: -6, y: -3, sx: 0.96, sy: 1.05 }],
          [0.7, { r: 3 }],
          [0.76, { r: 0 }],
          [0.9, { r: 0 }],
          [1, { r: 4 }],
        ),
        head: rotAt([0, 0], [0.28, 10], [0.46, 14], [0.5, 4], [0.58, 4], [0.64, -8], [0.72, 4], [0.8, 0], [1, 0]),
        antL: rotAt([0, 0], [0.28, 16], [0.46, 20], [0.58, 20], [0.64, -14], [0.7, 6], [0.8, 0], [1, 0]),
        antR: rotAt([0, 0], [0.28, 12], [0.46, 16], [0.58, 16], [0.64, -16], [0.7, 8], [0.8, 0], [1, 0]),
        antTipR: rotAt([0, 0], [0.64, 0], [0.68, -26], [0.74, 12], [0.8, -5], [0.86, 0], [1, 0]),
        shadow: keys([0, {}], [0.28, { x: 10, sx: 1.08 }], [0.58, { x: 10, sx: 1.08 }], [0.64, {}], [1, {}]),
      },
    ),
    faces: [
      [0, "neutral"],
      [0.12, "sly"],
      [0.46, "surprised"],
      [0.62, "proud"],
      [0.9, "neutral"],
    ],
    rest: "sly",
  },
  {
    id: "hiccup",
    title: "Hiccup",
    line: "Rhythm and its light: hovering calmly — hic! — a jolt up, a stretch and a flash of its glow; again; a pause long enough to think it is over — hic! — and a silly face. Funny because it is not on the beat. Where: now and then while nothing is happening.",
    act: act(
      "hiccup",
      3.6,
      [
        [0, DOWN],
        [0.28, DOWN],
        [0.31, { L: [72, 196], R: [128, 196] }],
        [0.4, DOWN],
        [0.72, DOWN],
        [0.75, { L: [66, 186], R: [134, 186] }],
        [0.86, { L: [98, 186], R: [102, 186] }],
        [1, DOWN],
      ],
      (() => {
        /* three hiccups, off the beat: a sudden jolt up with a stretch, a squash as it drops back */
        const HICS: [number, number][] = [[0.28, 12], [0.5, 9], [0.72, 16]];
        const up = HICS.flatMap(([at, h]): [number, Key][] => [[at, { e: EASE.snap }], [at + 0.025, { y: -h }], [at + 0.09, {}]]);
        const shape = HICS.flatMap(([at]): [number, Key][] => [
          [at, { e: EASE.snap }],
          [at + 0.025, { sx: 0.9, sy: 1.12 }],
          [at + 0.09, { sx: 1.04, sy: 0.97 }],
          [at + 0.13, {}],
        ]);
        return {
          root: keys([0, {}], ...up, [1, {}]),
          torso: keys([0, {}], ...shape, [1, {}]),
          glow: fadeAt([0, 0.4], [0.28, 0.4], [0.3, 1], [0.38, 0.4], [0.5, 0.4], [0.52, 1], [0.6, 0.4], [0.72, 0.4], [0.74, 1], [0.84, 0.5], [1, 0.4]),
          tail: rotAt([0, 0], [0.28, 0], [0.31, 16], [0.38, 0], [0.5, 0], [0.53, -14], [0.6, 0], [0.72, 0], [0.75, 20], [0.8, -8], [0.86, 0], [1, 0]),
          antTipL: rotAt([0, 0], [0.28, 0], [0.31, 18], [0.38, 0], [0.5, 0], [0.53, 16], [0.6, 0], [0.72, 0], [0.75, 24], [0.8, -10], [0.86, 0], [1, 0]),
          antTipR: rotAt([0, 0], [0.28, 0], [0.31, -22], [0.38, 6], [0.44, 0], [0.5, 0], [0.53, -20], [0.6, 0], [0.72, 0], [0.75, -30], [0.8, 14], [0.86, -5], [0.92, 0], [1, 0]),
          head: rotAt([0, 0], [0.28, 0], [0.31, -5], [0.4, 0], [0.72, 0], [0.75, 7], [0.84, -4], [1, 0]),
        };
      })(),
    ),
    faces: [
      [0, "neutral"],
      [0.28, "oops"],
      [0.4, "surprised"],
      [0.5, "oops"],
      [0.62, "worried"],
      [0.72, "oops"],
      [0.82, "silly"],
      [0.96, "neutral"],
    ],
    rest: "silly",
  },
  {
    id: "lights",
    title: "Lights out",
    line: "Its own light as a toy: it tucks its flame in with its hands and its glow goes out — shh — then throws its arms wide and flares, brighter than before. The ability as play, not a status. Where: when the last field is filled in, once.",
    act: act(
      "lights",
      4.2,
      [
        [0, REST],
        [0.14, DOWN],
        [0.26, { L: [96, 216], R: [104, 216] }],
        [0.56, { L: [96, 216], R: [104, 216] }],
        [0.62, { L: [52, 128], R: [148, 128] }],
        [0.78, { L: [58, 136], R: [142, 136] }],
        [0.9, DOWN],
        [1, REST],
      ],
      {
        tail: keys(
          [0, {}],
          [0.18, {}],
          [0.28, { sx: 0.62, sy: 0.55 }],
          [0.56, { sx: 0.62, sy: 0.55, e: EASE.overshoot }],
          [0.62, { sx: 1.2, sy: 1.22 }],
          [0.72, { sx: 0.96, sy: 0.95 }],
          [0.8, {}],
          [1, {}],
        ),
        glow: fadeAt([0, 0.5], [0.18, 0.5], [0.28, 0.03], [0.56, 0.03], [0.6, 1], [0.8, 0.9], [1, 0.5]),
        root: keys([0, {}], [0.26, { y: 4 }], [0.56, { y: 4, e: EASE.snap }], [0.62, { y: -18 }], [0.74, { y: -12, e: EASE.fall }], [0.84, { y: 1 }], [0.9, {}], [1, {}]),
        torso: keys(
          [0, { r: 4 }],
          [0.26, { r: 0, sx: 1.06, sy: 0.92 }],
          [0.56, { r: 0, sx: 1.06, sy: 0.92, e: EASE.snap }],
          [0.62, { sx: 0.92, sy: 1.12 }],
          [0.72, {}],
          [0.84, { sx: 1.05, sy: 0.95 }],
          [0.9, {}],
          [1, { r: 4 }],
        ),
        head: rotAt([0, 0], [0.26, 8], [0.56, 8], [0.62, -6], [0.72, 3], [1, 0]),
        antL: rotAt([0, 0], [0.26, 20], [0.56, 20], [0.62, -16], [0.7, 6], [0.8, 0], [1, 0]),
        antR: rotAt([0, 0], [0.26, -18], [0.56, -18], [0.62, 18], [0.7, -6], [0.8, 0], [1, 0]),
        wingL: buzz(0.6, 0.8, -22, 8),
        wingR: buzz(0.6, 0.8, 22, 8),
        hindL: buzz(0.6, 0.8, 16, 12),
        hindR: buzz(0.6, 0.8, -16, 12),
        shadow: keys([0, {}], [0.56, {}], [0.62, { sx: 0.7, sy: 0.8 }], [0.74, { sx: 0.76, sy: 0.8 }], [0.84, {}], [1, {}]),
      },
    ),
    faces: [
      [0, "neutral"],
      [0.14, "sly"],
      [0.3, "wink"],
      [0.44, "sly"],
      [0.58, "party"],
      [0.86, "happy"],
      [0.96, "neutral"],
    ],
    rest: "party",
  },
  {
    id: "password",
    title: "Password — eyes shut",
    line: "An alternative to turning its back: it ducks its head down into its ruff, clamps its hands over its eyes, droops its antennae and giggles with its shoulders; pops back out when you leave the field. It never peeks — a joke about looking would teach the wrong thing about a password.",
    act: act(
      "password",
      4,
      [
        [0, DOWN],
        [0.1, DOWN],
        [0.2, { L: [96, 106], R: [104, 106], outL: true, outR: true }],
        [0.8, { L: [96, 106], R: [104, 106], outL: true, outR: true }],
        [0.88, { L: [60, 150], R: [140, 150] }],
        [1, DOWN],
      ],
      {
        head: keys(
          [0, {}],
          [0.1, {}],
          [0.2, { y: 18, r: 0 }],
          [0.34, { y: 18, r: -4 }],
          [0.38, { y: 17, r: 4 }],
          [0.42, { y: 18, r: -4 }],
          [0.46, { y: 17, r: 4 }],
          [0.5, { y: 18, r: 0 }],
          [0.8, { y: 18, e: EASE.overshoot }],
          [0.87, { y: -4, r: -4 }],
          [0.93, { y: 1, r: 2 }],
          [1, {}],
        ),
        torso: keys([0, {}], [0.2, { sx: 1.06, sy: 0.94 }], [0.34, { sx: 1.06, sy: 0.94 }], [0.38, { sx: 1.08, sy: 0.92, y: -1 }], [0.42, { sx: 1.06, sy: 0.94 }], [0.46, { sx: 1.08, sy: 0.92, y: -1 }], [0.5, { sx: 1.06, sy: 0.94 }], [0.8, { sx: 1.06, sy: 0.94, e: EASE.overshoot }], [0.87, { sx: 0.94, sy: 1.08 }], [0.94, {}], [1, {}]),
        antL: rotAt([0, 0], [0.2, -34], [0.8, -34], [0.87, 10], [0.93, -4], [1, 0]),
        antR: rotAt([0, 0], [0.2, 34], [0.8, 34], [0.87, -10], [0.93, 4], [1, 0]),
        antTipR: rotAt([0, 0], [0.87, 0], [0.9, -24], [0.95, 10], [1, 0]),
      },
    ),
    faces: [
      [0, "neutral"],
      [0.12, "happy"],
      [0.84, "delighted"],
      [0.96, "neutral"],
    ],
    rest: "happy",
  },
];

/**
 * A character playing an act, with its face following the act's own clock. The figure's
 * animations are the clock: each frame the face is read off the act's position in its loop.
 */
export function ActFigure({ c, a, className }: { c: Candidate; a: WispAct; className?: string }) {
  const box = React.useRef<HTMLDivElement>(null);
  const [mood, setMood] = React.useState<Mood>(a.faces[0][1]);
  const [still, setStill] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      setMood(a.rest);
      return;
    }
    const ms = a.act.motion.duration * 1000;
    /* the act's clock: one of its own joint animations, found once and looked for again only
       if it is replaced */
    let clock: Animation | undefined;
    const find = () =>
      box.current?.querySelector('[data-joint="root"]')?.getAnimations().find((x) => x.effect?.getTiming().duration === ms) ??
      box.current?.getAnimations({ subtree: true }).find((x) => x.effect?.getTiming().duration === ms);
    /* faces change at most a few times a second, so the clock is read on a short interval
       rather than every frame */
    const id = window.setInterval(() => {
      if (!clock || clock.playState === "idle") clock = find();
      const t = typeof clock?.currentTime === "number" ? (clock.currentTime % ms) / ms : 0;
      let m = a.faces[0][1];
      for (const [o, f] of a.faces) if (t >= o) m = f;
      setMood((prev) => (prev === m ? prev : m));
    }, 40);
    return () => window.clearInterval(id);
  }, [a]);

  return (
    <div ref={box} className={className}>
      <NixFigure c={c} act={a.act} mood={mood} still={still} className="h-full w-full" />
    </div>
  );
}
