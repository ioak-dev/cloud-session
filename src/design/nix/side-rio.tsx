/**
 * Rio (drawn as Kai), refined for the product (2026-11-01): the told-apart proposal (`side-apart.tsx`)
 * — drawn as before, his hoodie fixed in the accent — and his own eyes (`side-eyes.tsx`): flat-topped
 * and half-lidded under short straight brows. Longer arms than the studio's frame, so a hand can come
 * out of his pocket for a fist bump or a point and read at size.
 *
 * His scene (`RioScene`) is what he moves to: the small waves of a beat from the headphones round his
 * neck, and the streaks his feet leave on the floor when he moonwalks (his ability: he glides
 * backwards as if the ground were ice).
 */
import type { CSSProperties } from "react";

import type { Candidate } from "./candidates";
import type { Body } from "./rig/skeleton";
import { APART } from "./side-apart";
import { mix } from "./side-kit";
import { chibiTarget } from "./side-noor";
import { C } from "./theme";

/** Rio with his proposed look and eyes, under the cast's id and name. */
export function refineRio(c: Candidate): Candidate {
  const after = APART.find((a) => a.before.id === "cand-kai")?.after;
  if (!after) return c;
  const frame: Body | undefined = after.frame && {
    ...after.frame,
    j: { ...after.frame.j, elbowL: [80, 230], wristL: [77, 250], elbowR: [120, 230], wristR: [123, 250] },
    w: { ...after.frame.w, upper: 12, fore: 11, hand: 9 },
    elbows: "natural",
  };
  return {
    ...after,
    id: c.id,
    label: c.label,
    frame,
    /* at rest both hands are in his hoodie's pocket */
    attitude: frame && {
      ...after.attitude,
      hands: { L: chibiTarget(frame, "L", [93, 238]), R: chibiTarget(frame, "R", [107, 238]) },
    },
  };
}

const at = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" });

const BEAT = mix(C.accent, "#ffffff", 40);
const BEAT_EDGE = C.accentDeep;
const STREAK = mix(C.mid, "#ffffff", 55);

/** The waves of a beat from one ear cup of his headphones, at (x, y); `side` is which way they go. */
function Beat({ id, x, y, side }: { id: string; x: number; y: number; side: 1 | -1 }) {
  const arc = (k: number) => `M${x + side * k} ${y - k * 0.9} Q${x + side * k * 1.5} ${y} ${x + side * k} ${y + k * 0.9}`;
  return (
    <g data-joint={`fx-${id}`} style={at(x, y)} fill="none" strokeLinecap="round">
      {[6, 11].map((k) => (
        <g key={k}>
          <path d={arc(k)} stroke={BEAT_EDGE} strokeWidth={3.6} opacity={0.5} />
          <path d={arc(k)} stroke={BEAT} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
}

/** Streaks on the floor behind his feet as he glides. */
function Streaks() {
  return (
    <g data-joint="fx-streaks" stroke={STREAK} strokeWidth={2.4} strokeLinecap="round">
      <path d="M58 276 L84 276" />
      <path d="M50 281 L80 281" opacity={0.7} />
      <path d="M62 286 L84 286" opacity={0.5} />
    </g>
  );
}

export type RioSceneId = "beat" | "streaks";

/** Rio's scene: the streaks under him, the beat in front. */
export function RioScene({ ids, layer }: { ids: readonly RioSceneId[]; layer: "under" | "over" }) {
  const has = (id: RioSceneId) => ids.includes(id);
  if (layer === "under") return <>{has("streaks") && <Streaks />}</>;
  return (
    <>
      {has("beat") && <Beat id="beatL" x={64} y={194} side={-1} />}
      {has("beat") && <Beat id="beatR" x={136} y={194} side={1} />}
    </>
  );
}
