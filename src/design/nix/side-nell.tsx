/**
 * Nell (drawn as Ada), refined for the product (2026-10-31): the told-apart proposal
 * (`side-apart.tsx`) — her own cloud of silver curls and half-moon spectacles kept, a chunky cardigan
 * in the deep accent with deep pockets, a long skirt — and her own eyes (`side-eyes.tsx`): smiling
 * crescents with laughter crinkles. Longer arms than the studio's elder frame, so a cup reaches her
 * lips and a hand can wave someone over.
 *
 * Her scene (`NellScene`) is the tea stall she carries about with her and her ability, Hum: curls of
 * steam over a cup, and the soft waves of a tune she hums — one tune and everyone settles. Waves, not
 * notes: nothing is lettered in the drawing.
 */
import type { CSSProperties } from "react";

import type { Candidate } from "./candidates";
import type { Body } from "./rig/skeleton";
import { APART } from "./side-apart";
import { mix } from "./side-kit";
import { chibiTarget } from "./side-noor";
import { C } from "./theme";

/** Nell with her proposed look and eyes, under the cast's id and name. */
export function refineNell(c: Candidate): Candidate {
  const after = APART.find((a) => a.before.id === "cand-ada")?.after;
  if (!after) return c;
  /* the studio's elder frame has short arms (about 31 long): a cup must reach her lips */
  const frame: Body | undefined = after.frame && {
    ...after.frame,
    j: { ...after.frame.j, elbowL: [80, 230], wristL: [77, 250], elbowR: [120, 230], wristR: [123, 250] },
    w: { ...after.frame.w, upper: 13, fore: 12, hand: 9.4 },
    elbows: "natural",
  };
  return {
    ...after,
    id: c.id,
    label: c.label,
    frame,
    /* at rest her hands are folded over her middle, right over left, and she is smiling */
    attitude: frame && {
      ...after.attitude,
      mood: "happy",
      tilt: -5,
      hands: { L: chibiTarget(frame, "L", [94, 242]), R: chibiTarget(frame, "R", [106, 242]) },
    },
  };
}

const at = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" });

const STEAM = mix("#ffffff", C.mid, 70);
const HUM = mix(C.accentDeep, "#ffffff", 70);
const HUM_EDGE = C.accentDeep;

/** Two curls of steam rising from a cup held at (x, y); `fx-steam` rises and fades them. */
function Steam({ x, y }: { x: number; y: number }) {
  return (
    <g data-joint="fx-steam" style={at(x, y)} fill="none" stroke={STEAM} strokeWidth={2.4} strokeLinecap="round">
      <path d={`M${x - 3} ${y} q-4 -6 0 -11 q4 -5 0 -11`} />
      <path d={`M${x + 4} ${y - 2} q-4 -5 0 -9 q4 -4 0 -9`} opacity={0.75} />
    </g>
  );
}

/** The waves of a hummed tune drifting out beside her head; `side` -1 for her right (screen left). */
function Hum({ id, side }: { id: string; side: 1 | -1 }) {
  const x = 100 + side * 64;
  const y = 166;
  const wave = (dy: number, len: number) => `M${x} ${y + dy} q${side * len * 0.25} -4 ${side * len * 0.5} 0 q${side * len * 0.25} 4 ${side * len * 0.5} 0`;
  return (
    <g data-joint={`fx-${id}`} style={at(x, y)} fill="none" strokeLinecap="round">
      {[
        [-8, 16],
        [0, 22],
        [8, 16],
      ].map(([dy, len]) => (
        <g key={dy}>
          <path d={wave(dy, len)} stroke={HUM_EDGE} strokeWidth={3.6} opacity={0.5} />
          <path d={wave(dy, len)} stroke={HUM} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
}

/** Where her cup is held for each scene that steams: sipped at her lips, raised in a toast, held at
 *  her middle. */
const CUP = { sip: [112, 175], toast: [147, 166], held: [111, 208], offer: [152, 193] } as const;

export type NellSceneId = "steamSip" | "steamToast" | "steamHeld" | "steamOffer" | "hum" | "humBoth";

/** Nell's scene for a reaction: everything is drawn in front of her. */
export function NellScene({ ids, layer }: { ids: readonly NellSceneId[]; layer: "under" | "over" }) {
  if (layer === "under") return null;
  const has = (id: NellSceneId) => ids.includes(id);
  return (
    <>
      {has("steamSip") && <Steam x={CUP.sip[0]} y={CUP.sip[1]} />}
      {has("steamToast") && <Steam x={CUP.toast[0]} y={CUP.toast[1]} />}
      {has("steamHeld") && <Steam x={CUP.held[0]} y={CUP.held[1]} />}
      {has("steamOffer") && <Steam x={CUP.offer[0]} y={CUP.offer[1]} />}
      {(has("hum") || has("humBoth")) && <Hum id="humR" side={1} />}
      {has("humBoth") && <Hum id="humL" side={-1} />}
    </>
  );
}
