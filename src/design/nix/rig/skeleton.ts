/**
 * The guide's skeleton — one rig every bench candidate is drawn on, so the six are compared on
 * design alone (`ui-design-language.md` §9.4.3, `brd.md` Q36).
 *
 * Chibi proportions: about 2.4 heads tall, so a face reads at 48px and the silhouette survives at
 * 16px. Every pivot is a rest position in `FIGURE_VB` coordinates; each segment is drawn at rest
 * and hangs from the pivot named here. `L`/`R` are the viewer's left and right.
 *
 *   root ─┬─ hipL ── kneeL        legs sit outside the torso so it can lean over them
 *         ├─ hipR ── kneeR
 *         └─ torso ─┬─ head ─┬─ hairSway · braidL · braidR · antL · antR · earL · earR
 *                   ├─ tail · wingL · wingR · hindL · hindR
 *                   ├─ shoulderL ── elbowL
 *                   └─ shoulderR ── elbowR
 */
import type { CSSProperties } from "react";

export type P = readonly [number, number];

export const FIGURE_VB = "0 0 200 300";
/** Head only, with room for puffs, ears and antennae — the favicon and expression crop. */
export const HEAD_VB = "34 8 132 132";

export const J = {
  root: [100, 284],
  torso: [100, 214],
  head: [100, 150],
  shoulderL: [83, 158],
  elbowL: [79, 183],
  wristL: [77, 206],
  shoulderR: [117, 158],
  elbowR: [121, 183],
  wristR: [123, 206],
  hipL: [92, 212],
  kneeL: [91, 243],
  footL: [90, 272],
  hipR: [108, 212],
  kneeR: [109, 243],
  footR: [110, 272],
  tail: [110, 206],
  wingL: [92, 160],
  wingR: [108, 160],
  /** The lower (flying) wings, on their own joints so they beat apart from the upper pair. */
  hindL: [92, 166],
  hindR: [108, 166],
  hairSway: [124, 54],
  braidL: [60, 104],
  braidR: [140, 104],
  antL: [80, 56],
  antR: [120, 56],
  earL: [66, 72],
  earR: [134, 72],
  blink: [100, 102],
} as const satisfies Record<string, P>;

export type JointName = keyof typeof J;

export type Joints = Record<JointName, P>;

/**
 * A body the rig can stand on. `chibi` is the space every kit is drawn in (face, hair, outfits,
 * props); `adult` — a young woman, about five heads tall — re-uses those kits through three fits:
 * the head, the torso and the hem are each drawn in chibi space and placed onto the adult frame by
 * one transform, so a hair style or an outfit is drawn once and worn by both.
 */
export type Body = {
  /** `chibi` and `adult` are the shared bodies; a candidate may bring its own. */
  id: string;
  j: Joints;
  headFit?: string;
  torsoFit?: string;
  hemFit?: string;
  /** Places the read pose's book between the hands. */
  handsFit?: string;
  /** Fits the backpack to a body shorter or narrower than chibi's. */
  packFit?: string;
  /** Torso outline in chibi space. */
  torso: string;
  /** Head-and-hair crop for expressions and the favicon. */
  headVB: string;
  /** Limb widths: upper arm, forearm, thigh, shin, hand radius; and the factor sleeves scale by. */
  w: { upper: number; fore: number; thigh: number; shin: number; hand: number; cloth: number };
  neck: { x: number; y: number; w: number; h: number };
};

export const CHIBI: Body = {
  id: "chibi",
  j: J,
  torso:
    "M84 150 Q100 146 116 150 Q124 154 123 168 L121 206 Q120 220 100 221 Q80 220 79 206 L77 168 Q76 154 84 150 Z",
  headVB: HEAD_VB,
  w: { upper: 11, fore: 10, thigh: 13, shin: 12, hand: 6.8, cloth: 1 },
  neck: { x: 93, y: 132, w: 14, h: 24 },
};

/** Chibi torso (y 148–221) onto the adult one (y 96–176), narrowed. */
const TORSO_FIT = "translate(100 96) scale(0.8 1.096) translate(-100 -148)";

export const ADULT: Body = {
  id: "adult",
  j: {
    ...J,
    root: [100, 284],
    torso: [100, 168],
    head: [100, 94],
    shoulderL: [86, 107],
    elbowL: [81, 140],
    wristL: [78, 171],
    shoulderR: [114, 107],
    elbowR: [119, 140],
    wristR: [122, 171],
    hipL: [92, 168],
    kneeL: [91, 220],
    footL: [90, 270],
    hipR: [108, 168],
    kneeR: [109, 220],
    footR: [110, 270],
  },
  headFit: "translate(100 94) scale(0.66) translate(-100 -150)",
  torsoFit: TORSO_FIT,
  hemFit: "translate(100 151) scale(0.86 1.65) translate(-100 -198)",
  handsFit: "translate(100 107) scale(1.3) translate(-100 -158)",
  torso:
    "M84 150 Q100 146 116 150 Q124 154 123 166 Q120 184 116 196 Q122 208 121 214 Q120 221 100 221 Q80 221 79 214 Q78 208 84 196 Q80 184 77 166 Q76 154 84 150 Z",
  headVB: "56 0 88 88",
  w: { upper: 9.5, fore: 8.5, thigh: 12.5, shin: 11, hand: 5.6, cloth: 0.8 },
  neck: { x: 95.5, y: 80, w: 9, h: 20 },
};

/** A pivot as the inline style its `<g>` needs: origin on the joint, in viewBox units. */
export function pivot(name: JointName, j: Joints = J): CSSProperties {
  const [x, y] = j[name];
  return { transformOrigin: `${x}px ${y}px`, transformBox: "view-box" };
}

export const lerp = (a: P, b: P, t: number): P => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

const deg = (r: number) => (r * 180) / Math.PI;
const angle = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const len = (a: P, b: P) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const norm = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

/**
 * Two-bone reach: the shoulder and elbow rotations (CSS degrees, clockwise positive) that put this
 * side's wrist on `hand`, with the elbow bent away from the body (`out`) or toward it. A target out
 * of reach is clamped to the arm's length, so a pose never tears the rig.
 */
export function reach(
  side: "L" | "R",
  hand: P,
  out = true,
  j: Joints = J,
): { shoulder: number; elbow: number } {
  const S = j[`shoulder${side}`];
  const E0 = j[`elbow${side}`];
  const W0 = j[`wrist${side}`];
  const a = len(S, E0);
  const b = len(E0, W0);
  const d = Math.min(Math.max(len(S, hand), Math.abs(a - b) + 0.01), a + b - 0.01);
  const th = angle(S, hand);
  const u: P = [Math.cos(th), Math.sin(th)];
  const x = (a * a - b * b + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, a * a - x * x));
  const away = side === "R" ? 1 : -1;
  let p: P = [-u[1], u[0]];
  if (Math.sign(p[0] || 1) !== (out ? away : -away)) p = [u[1], -u[0]];
  const E: P = [S[0] + x * u[0] + h * p[0], S[1] + x * u[1] + h * p[1]];
  const H: P = [S[0] + d * u[0], S[1] + d * u[1]];
  const shoulder = norm(deg(angle(S, E) - angle(S, E0)));
  const world = deg(angle(E, H) - angle(E0, W0));
  return { shoulder, elbow: norm(world - shoulder) };
}
