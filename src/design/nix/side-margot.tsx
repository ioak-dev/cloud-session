/**
 * Margot (drawn as Grace), refined for the product (2026-10-31): the told-apart proposal
 * (`side-apart.tsx`) — a tall printed headwrap knotted into a fan, gold hoops, no glasses, a long wrap
 * dress in the same print, a lighter, warmer skin — and her own eyes (`side-eyes.tsx`): almond, under
 * heavy lids with a wing, thin arched brows. Longer arms than the studio's elder frame, so a dancer's
 * arms read: a hand can sweep up beside her head, and rest on her hip with the elbow out.
 *
 * Her scene (`MargotScene`) is the stage she carries with her: a swish of light that trails her hand
 * through a flourish, and a soft pool of light on the ground for the moments she takes a bow — or
 * gives one to the learner.
 */
import type { CSSProperties } from "react";

import type { Candidate } from "./candidates";
import type { Body } from "./rig/skeleton";
import { APART } from "./side-apart";
import { mix } from "./side-kit";
import { chibiTarget } from "./side-noor";
import { C } from "./theme";

/** Margot with her proposed look and eyes, under the cast's id and name. */
export function refineMargot(c: Candidate): Candidate {
  const after = APART.find((a) => a.before.id === "people-grace")?.after;
  if (!after) return c;
  /* the studio's elder frame has short arms (about 31 long): a dancer's arms need to reach */
  const frame: Body | undefined = after.frame && {
    ...after.frame,
    j: { ...after.frame.j, elbowL: [80, 230], wristL: [77, 250], elbowR: [120, 230], wristR: [123, 250] },
    w: { ...after.frame.w, upper: 12.5, fore: 11.5, hand: 9 },
    elbows: "natural",
  };
  return {
    ...after,
    id: c.id,
    label: c.label,
    frame,
    /* regal at rest: both hands on her hips, elbows out */
    attitude: frame && {
      ...after.attitude,
      mood: "neutral",
      hands: { L: chibiTarget(frame, "L", [80, 240]), R: chibiTarget(frame, "R", [120, 240]), outL: true, outR: true },
    },
  };
}

const at = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" });

const LIGHT = mix(C.accent, "#ffffff", 55);
const LIGHT_EDGE = C.accent;

/** A swish of light trailing her right hand up through a flourish, drawn on by `fx-swish`. */
function Swish() {
  const d = "M126 250 C150 248 162 230 160 212 C159 202 154 196 148 191";
  return (
    <g data-joint="fx-swish" fill="none" strokeLinecap="round">
      <path d={d} stroke={LIGHT_EDGE} strokeWidth={5} opacity={0.45} />
      <path d={d} stroke={LIGHT} strokeWidth={2.6} />
      <circle cx={153} cy={184} r={1.8} fill={LIGHT} />
      <circle cx={164} cy={196} r={1.3} fill={LIGHT} />
    </g>
  );
}

/** A soft pool of light on the ground where she stands. */
function Spot() {
  return (
    <g data-joint="fx-spot" style={at(100, 282)}>
      <ellipse cx={100} cy={282} rx={58} ry={10} fill={LIGHT} opacity={0.55} />
      <ellipse cx={100} cy={282} rx={40} ry={6.5} fill={LIGHT} opacity={0.6} />
    </g>
  );
}

export type MargotSceneId = "swish" | "spot";

/** Margot's scene for a reaction: the pool of light under her, the swish in front. */
export function MargotScene({ ids, layer }: { ids: readonly MargotSceneId[]; layer: "under" | "over" }) {
  const has = (id: MargotSceneId) => ids.includes(id);
  if (layer === "under") return <>{has("spot") && <Spot />}</>;
  return <>{has("swish") && <Swish />}</>;
}
