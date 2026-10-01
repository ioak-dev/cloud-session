import type { ReactNode } from "react";

import type { Mood } from "./face";
import type { Palette } from "./palette";
import type { Viseme } from "./visemes";

/**
 * A character's own eyes. Every side character designs its eyes on purpose — shape, colour,
 * shine, lids, brows — and draws every mood with them, so no two characters share a set. The
 * rig's `Face` calls the kit once per eye, in place of the shared eyes and brows; the mouth and
 * blush stay shared.
 *
 * `s` is the eye's side: -1 for the viewer's left, 1 for the right. The inner corner is toward
 * the face's centre line, at `x - s * rx`.
 */
export type EyeArgs = {
  mood: Mood;
  s: -1 | 1;
  x: number;
  y: number;
  look: readonly [number, number];
  pal: Palette;
  /** Unique per eye, for clip paths. */
  id: string;
};

export type EyeKit = (a: EyeArgs) => ReactNode;

/** A character's own mouth, centred on x = 100 at `y`, for every mood. While it talks, `viseme`
 *  is the mouth shape for the sound being said (`visemes.ts`), drawn in place of the mood's mouth
 *  and coloured by the mood; absent, the mouth is the mood's own. */
export type MouthArgs = { mood: Mood; y: number; pal: Palette; viseme?: Viseme };
export type MouthKit = (a: MouthArgs) => ReactNode;

export const TONGUE_PINK = "#ef7f8e";

/** An open mouth: a filled shape with a tongue at its floor, optionally a row of teeth. */
export function OpenMouth({
  d,
  fill,
  tongue,
  teeth,
}: {
  d: string;
  fill: string;
  /** Tongue ellipse [cx, cy, rx, ry]. */
  tongue?: readonly [number, number, number, number];
  /** Teeth as a rect [x, y, w, h] at the top of the mouth. */
  teeth?: readonly [number, number, number, number];
}) {
  const id = `m${d.length}${Math.round(Math.abs(d.charCodeAt(4) * 97))}`;
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={fill} />
      <g clipPath={`url(#${id})`}>
        {tongue && (
          <ellipse cx={tongue[0]} cy={tongue[1]} rx={tongue[2]} ry={tongue[3]} fill={TONGUE_PINK} />
        )}
        {teeth && <rect x={teeth[0]} y={teeth[1]} width={teeth[2]} height={teeth[3]} fill={EYE_WHITE} />}
      </g>
    </g>
  );
}

export const EYE_WHITE = "#fffdf8";

/** Lids in the colour of the skin around the eye. `top` and `bottom` are how much of the eye
 *  they cover (0–1); `tilt` lifts the top lid's inner end, in degrees (negative lowers it). */
export type Lid = { top?: number; bottom?: number; tilt?: number; color: string };

/**
 * One open eye: its shape filled, what is inside it (iris, pupil, shine) clipped to the shape,
 * then the lids. `edge` draws a lash line along the top lid's edge. No outline round the eye.
 */
export function Orb({
  id,
  x,
  y,
  rx,
  ry,
  s,
  fill,
  lid,
  shape,
  edge,
  children,
}: {
  id: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  s: -1 | 1;
  fill: string;
  lid?: Lid;
  /** A custom eye shape (a path); an ellipse of rx, ry when absent. */
  shape?: string;
  edge?: { color: string; width: number };
  children?: ReactNode;
}) {
  const top = lid?.top ?? 0;
  const bottom = lid?.bottom ?? 0;
  const y0 = y - ry + 2 * ry * top;
  const y1 = y + ry - 2 * ry * bottom;
  const turn = `rotate(${s * (lid?.tilt ?? 0)} ${x} ${y0})`;
  const body = shape ? <path d={shape} /> : <ellipse cx={x} cy={y} rx={rx} ry={ry} />;
  return (
    <g>
      <clipPath id={id}>{body}</clipPath>
      <g clipPath={`url(#${id})`}>
        {shape ? (
          <path d={shape} fill={fill} />
        ) : (
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} />
        )}
        {children}
        {bottom > 0 && lid && (
          <path
            d={`M${x - rx - 6} ${y + ry + 12} L${x - rx - 6} ${y1 + 3} Q${x} ${y1 - 5} ${x + rx + 6} ${y1 + 3} L${x + rx + 6} ${y + ry + 12} Z`}
            fill={lid.color}
          />
        )}
        {top > 0 && lid && (
          <rect
            x={x - rx - 8}
            y={y - ry - 16}
            width={2 * rx + 16}
            height={y0 - (y - ry - 16)}
            fill={lid.color}
            transform={turn}
          />
        )}
        {edge && top > 0 && (
          <line
            x1={x - rx - 8}
            y1={y0}
            x2={x + rx + 8}
            y2={y0}
            stroke={edge.color}
            strokeWidth={edge.width * 2}
            transform={turn}
          />
        )}
      </g>
    </g>
  );
}

export const line = (color: string, w: number) =>
  ({
    stroke: color,
    strokeWidth: w,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }) as const;

/** ∩ — a closed, smiling eye. */
export const arcUp = (x: number, y: number, w: number, h: number) =>
  `M${x - w} ${y + h * 0.5} Q${x} ${y - h * 1.5} ${x + w} ${y + h * 0.5}`;

/** ∪ — a closed, pressed or content eye. */
export const arcDown = (x: number, y: number, w: number, h: number) =>
  `M${x - w} ${y - h * 0.5} Q${x} ${y + h * 1.5} ${x + w} ${y - h * 0.5}`;

/** > < — a squeezed eye, pointing at the face's centre line. */
export const chevron = (x: number, y: number, s: number, w: number, h: number) =>
  `M${x + s * w} ${y - h} L${x - s * w} ${y} L${x + s * w} ${y + h}`;

/** A rounded rectangle as a path, centred on (x, y). */
export const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
  const l = x - w / 2;
  const t = y - h / 2;
  return `M${l + r} ${t} H${l + w - r} Q${l + w} ${t} ${l + w} ${t + r} V${t + h - r} Q${l + w} ${t + h} ${l + w - r} ${t + h} H${l + r} Q${l} ${t + h} ${l} ${t + h - r} V${t + r} Q${l} ${t} ${l + r} ${t} Z`;
};

/** A brow or tuft turned about its centre: `tilt` lifts the inner end. */
export const turnAt = (s: number, tilt: number, x: number, y: number) =>
  `rotate(${s * tilt} ${x} ${y})`;
