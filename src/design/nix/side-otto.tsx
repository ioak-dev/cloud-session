/**
 * Otto, refined for the product (2026-10-31): the told-apart proposal (`side-apart.tsx`) — the only lab
 * coat on the shortlist, longer and flared past the knee, a bow tie in the accent, chalk on one cuff —
 * and his own eyes (`side-eyes.tsx`): small dark beads with no whites under big bushy white brows.
 * Longer arms than the studio's elder frame, so a finger can go up beside his head when an idea lands.
 *
 * His scene (`OttoScene`) is his ability and his chalk: Eureka — his hair stands straight up when an
 * idea lands, drawn as white tufts springing up behind his head — and puffs of chalk dust from the
 * stick he is never without (the rig's `chalk` grip). Nothing is written: the chalk only ever leaves dust.
 */
import type { CSSProperties } from "react";

import type { Candidate } from "./candidates";
import type { Body } from "./rig/skeleton";
import { APART } from "./side-apart";
import { mix } from "./side-kit";
import { chibiTarget } from "./side-noor";
import { C } from "./theme";

/** Otto with his proposed look and eyes, under the cast's id and name. */
export function refineOtto(c: Candidate): Candidate {
  const after = APART.find((a) => a.before.id === "more-otto")?.after;
  if (!after) return c;
  /* the studio's elder frame has short arms (about 31 long): a finger must go up beside his head */
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
    /* at rest one finger is up beside him, as if a thought just arrived; the other hand hangs easy */
    attitude: frame && {
      ...after.attitude,
      hands: { L: chibiTarget(frame, "L", [80, 240]), R: chibiTarget(frame, "R", [140, 204]), outR: true },
    },
  };
}

const at = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" });

const HAIR = "#f2f2f0";
const HAIR_SHADE = mix(HAIR, C.mid, 70);
const DUST = mix("#ffffff", C.mid, 82);

/** Eureka: tufts of his white hair standing straight up behind his head; `fx-eureka` springs them up
 *  from their roots. Drawn behind him, so they rise out of his own hair. */
function Eureka() {
  const tufts: [number, number, number][] = [
    [54, 34, 7],
    [70, 18, 8],
    [86, 8, 7],
    [102, 4, 8],
    [118, 10, 7.5],
    [134, 20, 8],
    [148, 36, 6.5],
  ];
  return (
    <g data-joint="fx-eureka" style={at(100, 96)}>
      {tufts.map(([x, y, r], i) => {
        /* each tuft tapers to a point that curls a little, fanned out from the crown */
        const d = `M${x - r} 100 C${x - r} ${y + 26} ${x - 3} ${y + 10} ${x + (i % 2 ? 3 : -2)} ${y} C${x + 2} ${y + 12} ${x + r} ${y + 28} ${x + r} 100 Z`;
        const fan = `rotate(${(x - 100) * 0.4} ${x} 100)`;
        return (
          <g key={x} transform={fan}>
            <path d={d} fill={HAIR_SHADE} transform="translate(1.6 1.6)" />
            <path d={d} fill={HAIR} />
          </g>
        );
      })}
    </g>
  );
}

/** A puff of chalk dust at (x, y): a few soft round motes. */
function Dust({ id, x, y }: { id: string; x: number; y: number }) {
  return (
    <g data-joint={`fx-${id}`} style={at(x, y)} fill={DUST}>
      <circle cx={x} cy={y} r={4.2} />
      <circle cx={x + 5} cy={y - 3} r={3} />
      <circle cx={x - 5} cy={y - 2} r={2.6} />
      <circle cx={x + 2} cy={y - 7} r={2} />
      <circle cx={x - 3} cy={y + 4} r={1.6} />
    </g>
  );
}

/** Where his chalk dust puffs: at the chalk's tip, held up beside him; between his hands as he claps;
 *  and out to both sides for the unlock. */
const DUST_AT = { chalk: [152, 186], clap: [100, 226], left: [44, 190], right: [156, 190] } as const;

export type OttoSceneId = "eureka" | "dustChalk" | "dustClap" | "dustBoth";

/** Otto's scene: Eureka rises behind him; the chalk dust is drawn in front. */
export function OttoScene({ ids, layer }: { ids: readonly OttoSceneId[]; layer: "under" | "over" }) {
  const has = (id: OttoSceneId) => ids.includes(id);
  if (layer === "under") return <>{has("eureka") && <Eureka />}</>;
  return (
    <>
      {has("dustChalk") && <Dust id="dust" x={DUST_AT.chalk[0]} y={DUST_AT.chalk[1]} />}
      {has("dustClap") && <Dust id="dust" x={DUST_AT.clap[0]} y={DUST_AT.clap[1]} />}
      {has("dustBoth") && <Dust id="dustL" x={DUST_AT.left[0]} y={DUST_AT.left[1]} />}
      {has("dustBoth") && <Dust id="dustR" x={DUST_AT.right[0]} y={DUST_AT.right[1]} />}
    </>
  );
}
