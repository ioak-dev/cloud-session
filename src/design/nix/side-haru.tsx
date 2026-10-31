/**
 * Haru, refined for the product (2026-10-31): the told-apart proposal (`side-apart.tsx`) — a knitted
 * sweater vest in the deep primary over a cream shirt, sleeves rolled, pens clipped to the vest — and
 * his own eyes (`side-eyes.tsx`): round and wide, filling his lenses, under thick straight brows.
 *
 * His scene (`HaruScene`): what he counts. Count is his ability — he counts anything at a glance —
 * so a few of his reactions leave small dots in the air, one per beat of his finger, and an empty ring
 * where one is still to find. Dots, never digits: nothing is lettered in the drawing, and a count is
 * never a score. A glint on his lens is the light catching it when something adds up.
 */
import type { CSSProperties } from "react";

import type { Candidate } from "./candidates";
import type { Body } from "./rig/skeleton";
import { APART } from "./side-apart";
import { chibiTarget } from "./side-noor";
import { C } from "./theme";

/** Haru with his proposed look and eyes, under the cast's id and name. */
export function refineHaru(c: Candidate): Candidate {
  const after = APART.find((a) => a.before.id === "more-haru")?.after;
  if (!after) return c;
  /* Noor's longer arms and bigger hands (his frame is the same teacher frame hers was), so a finger
     reaches his glasses and a count reads beside his head rather than under his chin */
  const frame: Body | undefined = after.frame && {
    ...after.frame,
    j: { ...after.frame.j, elbowL: [79, 218], wristL: [76, 240], elbowR: [121, 218], wristR: [124, 240] },
    w: { ...after.frame.w, upper: 12, fore: 11, hand: 9.4 },
    elbows: "natural",
  };
  return {
    ...after,
    id: c.id,
    label: c.label,
    frame,
    /* at rest his left hand hangs easy and his right rests at the pens clipped to his vest */
    attitude: frame && {
      ...after.attitude,
      hands: { L: chibiTarget(frame, "L", [80, 234]), R: chibiTarget(frame, "R", [112, 214]) },
    },
  };
}

const at = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" });

const DOT = C.accent;
const DOT_EDGE = C.accentDeep;

/** Where the counted dots hang, left to right, in figure space: in a row just above his raised hand. */
export const COUNT_DOTS = [
  [160, 168],
  [171, 158],
  [182, 168],
] as const;

/** One counted dot; `fx-<id>` pops it in. */
function Dot({ id, x, y }: { id: string; x: number; y: number }) {
  return (
    <g data-joint={`fx-${id}`} style={at(x, y)}>
      <circle cx={x} cy={y} r={5.8} fill={DOT_EDGE} />
      <circle cx={x - 0.6} cy={y - 0.6} r={4.8} fill={DOT} />
    </g>
  );
}

/** The one still to find: an empty ring in the dots' row. */
function Ring({ x, y }: { x: number; y: number }) {
  return (
    <g data-joint="fx-ring" style={at(x, y)}>
      <circle cx={x} cy={y} r={5.4} fill="none" stroke={DOT_EDGE} strokeWidth={2.2} strokeDasharray="3.6 2.6" />
    </g>
  );
}

/** A glint across his right lens: a small four-point star. */
function Glint() {
  const [x, y] = [134, 135];
  return (
    <g data-joint="fx-glint" style={at(x, y)}>
      <path d={`M${x} ${y - 5} L${x + 1.3} ${y - 1.3} L${x + 5} ${y} L${x + 1.3} ${y + 1.3} L${x} ${y + 5} L${x - 1.3} ${y + 1.3} L${x - 5} ${y} L${x - 1.3} ${y - 1.3} Z`} fill="#ffffff" />
    </g>
  );
}

/** A burst of dots for the unlock: more than he can count at a glance, once. */
const BURST = [
  [158, 136],
  [174, 150],
  [182, 170],
  [42, 136],
  [26, 150],
  [18, 170],
] as const;

export type HaruSceneId = "dots" | "dotsRing" | "glint" | "burst";

/** Haru's scene for a reaction: everything is drawn in front of him. */
export function HaruScene({ ids, layer }: { ids: readonly HaruSceneId[]; layer: "under" | "over" }) {
  if (layer === "under") return null;
  const has = (id: HaruSceneId) => ids.includes(id);
  return (
    <>
      {(has("dots") || has("dotsRing")) &&
        COUNT_DOTS.slice(0, has("dotsRing") ? 2 : 3).map(([x, y], i) => <Dot key={i} id={`dot${i + 1}`} x={x} y={y} />)}
      {has("dotsRing") && <Ring x={COUNT_DOTS[2][0]} y={COUNT_DOTS[2][1]} />}
      {has("glint") && <Glint />}
      {has("burst") && BURST.map(([x, y], i) => <Dot key={`b${i}`} id={`burst${i + 1}`} x={x} y={y} />)}
    </>
  );
}
