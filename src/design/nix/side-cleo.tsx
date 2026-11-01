/**
 * Cleo (drawn as Sofia), refined for the product (2026-11-01): the told-apart proposal
 * (`side-apart.tsx`) — a top striped in the primary, wide trousers, a headband in the stripes' colour
 * tucked into her red curls, canvas shoes — and her own eyes (`side-eyes.tsx`): big round green eyes
 * with long lashes that stay when they close. Noor's longer arms (her frame is the same teacher
 * frame), so a clap can be held high and conducting reads.
 *
 * Her scene (`CleoScene`) is the beat she puts everyone on: when her hands meet in her ability, Clap,
 * short lines burst out from them and a ring pulses outward — the beat, made visible. Rings and rays,
 * not notes: nothing is lettered in the drawing.
 */
import type { CSSProperties } from "react";

import type { Candidate } from "./candidates";
import type { Body } from "./rig/skeleton";
import { APART } from "./side-apart";
import { mix } from "./side-kit";
import { chibiTarget } from "./side-noor";
import { C } from "./theme";

/** Cleo with her proposed look and eyes, under the cast's id and name. */
export function refineCleo(c: Candidate): Candidate {
  const after = APART.find((a) => a.before.id === "more-sofia")?.after;
  if (!after) return c;
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
    /* at rest her hands are clasped in front of her, head tipped, mid-smile — about to burst into song */
    attitude: frame && {
      ...after.attitude,
      mood: "happy",
      hands: { L: chibiTarget(frame, "L", [96, 222]), R: chibiTarget(frame, "R", [104, 222]) },
    },
  };
}

const at = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" });

const BEAT = C.accent;
const BEAT_EDGE = C.accentDeep;
const RING = mix(C.primary, "#ffffff", 55);

/** Where her hands meet for the big clap: out to her right, below her chin — as far over as her left
 *  hand can reach, so the burst fans out clear of her face. */
export const CLAP_AT = [122, 200] as const;
/** Where her conducting hand beats. */
export const CONDUCT_AT = [154, 194] as const;

/** Short lines bursting out from the clap. */
function Burst({ x, y }: { x: number; y: number }) {
  /* fanned out to her right, away from her face */
  const rays = [-85, -50, -15, 20, 55];
  return (
    <g data-joint="fx-burst" style={at(x, y)} strokeLinecap="round">
      {rays.map((a) => {
        const r = (a * Math.PI) / 180;
        const p = (k: number) => `${x + Math.cos(r) * k} ${y + Math.sin(r) * k}`;
        return (
          <g key={a}>
            <path d={`M${p(11)} L${p(19)}`} stroke={BEAT_EDGE} strokeWidth={4.4} />
            <path d={`M${p(11)} L${p(19)}`} stroke={BEAT} strokeWidth={2.6} />
          </g>
        );
      })}
    </g>
  );
}

/** A ring pulsing out from the clap: the beat. */
function Ring({ id, x, y }: { id: string; x: number; y: number }) {
  return (
    <g data-joint={`fx-${id}`} style={at(x, y)}>
      <circle cx={x} cy={y} r={14} fill="none" stroke={RING} strokeWidth={2.6} />
    </g>
  );
}

export type CleoSceneId = "clap" | "conduct";

/** Cleo's scene: the burst and the rings of her clap, or the rings of her conducting hand, in front. */
export function CleoScene({ ids, layer }: { ids: readonly CleoSceneId[]; layer: "under" | "over" }) {
  if (layer === "under") return null;
  const [x, y] = ids.includes("clap") ? CLAP_AT : CONDUCT_AT;
  if (!ids.includes("clap") && !ids.includes("conduct")) return null;
  return (
    <>
      <Ring id="ring1" x={x} y={y} />
      <Ring id="ring2" x={x} y={y} />
      {ids.includes("clap") && <Burst x={x} y={y} />}
    </>
  );
}
