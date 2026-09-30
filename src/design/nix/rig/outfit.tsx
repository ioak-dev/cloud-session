import type { ReactNode } from "react";

import { WHITE, type Palette } from "./palette";

/**
 * Wardrobe kit — every outfit is torso overlays plus per-segment cloth, so it rides the joints it
 * belongs to (a sleeve moves with the elbow, a trouser leg with the knee). Colours come from the
 * candidate's palette, so the same cut reads as that candidate's own. Authored, never earned or
 * bought (§9.4.3): the product picks an outfit by context.
 */
export type OutfitId =
  | "bare"
  | "dungarees"
  | "hoodie"
  | "raincoat"
  | "dress"
  | "blazer"
  | "winter"
  | "party";

export const OUTFITS: { id: OutfitId; title: string; use: string }[] = [
  { id: "bare", title: "Bare", use: "An animal's own fur — the silhouette test" },
  { id: "dungarees", title: "Dungarees", use: "Everyday; building, making, onboarding" },
  { id: "hoodie", title: "Hoodie", use: "Everyday; reading, long waits" },
  { id: "raincoat", title: "Raincoat", use: "Everyday; out exploring, a new source" },
  { id: "dress", title: "Dress", use: "A lesson opening, a welcome" },
  {
    id: "blazer",
    title: "Blazer",
    use: "Everyday for a teacher; the editor's path, a welcome to a team",
  },
  { id: "winter", title: "Winter", use: "Seasonal — December to February" },
  { id: "party", title: "Party", use: "Unlock, session complete" },
];

/** Cloth over a limb segment, as a fraction of it: [from, to], width, colour. */
export type Cloth = { from: number; to: number; w: number; color: string } | null;

export type OutfitParts = {
  /** Behind the head and torso: a hood, a backpack. */
  back?: ReactNode;
  /** Over the torso body. */
  torso?: ReactNode;
  /** Over the hips and thighs, drawn after the torso: a skirt, a coat's hem. */
  hem?: ReactNode;
  /** Around the neck, above everything on the torso: a collar, a scarf. */
  collar?: ReactNode;
  upper: Cloth;
  fore: Cloth;
  thigh: Cloth;
  shin: Cloth;
  /** Shoes; `boots` draws them up the shin. */
  shoe: string | null;
  boots?: string;
  /** Head props the outfit brings. */
  brings?: ("beanie" | "partyHat")[];
};

function Shirt({
  d,
  color,
  pal,
  children,
}: {
  d: string;
  color: string;
  pal: Palette;
  children?: ReactNode;
}) {
  return (
    <g>
      <path
        d={d}
        fill={color}
        stroke={pal.line ?? pal.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {children}
    </g>
  );
}

function Skirt({
  color,
  pal,
  flare = 12,
  bottom = 238,
  stars,
}: {
  color: string;
  pal: Palette;
  flare?: number;
  bottom?: number;
  stars?: boolean;
}) {
  return (
    <g>
      <path
        d={`M80 198 L120 198 L${120 + flare} ${bottom} Q100 ${bottom + 7} ${80 - flare} ${bottom} Z`}
        fill={color}
        stroke={pal.line ?? pal.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d={`M92 204 L88 ${bottom + 2} M108 204 L112 ${bottom + 2}`}
        stroke={pal.line ?? pal.ink}
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      {stars &&
        [
          [86, 220],
          [104, 230],
          [118, 214],
          [96, 212],
        ].map(([x, y], i) => <Star key={i} x={x} y={y} r={3.4} fill={pal.glow} />)}
    </g>
  );
}

export function Star({
  x,
  y,
  r,
  fill,
  stroke,
}: {
  x: number;
  y: number;
  r: number;
  fill: string;
  stroke?: string;
}) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const k = i % 2 ? r * 0.45 : r;
    return `${(x + k * Math.cos(a)).toFixed(2)},${(y + k * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <polygon
      points={pts}
      fill={fill}
      stroke={stroke}
      strokeWidth={stroke ? 1.6 : 0}
      strokeLinejoin="round"
    />
  );
}

export function outfitParts(id: OutfitId, pal: Palette, torso: string): OutfitParts {
  const ink = pal.line ?? pal.line ?? pal.ink;
  switch (id) {
    case "bare":
      return { upper: null, fore: null, thigh: null, shin: null, shoe: null };
    case "dungarees":
      return {
        torso: (
          <Shirt d={torso} color={pal.topAlt} pal={pal}>
            <path d="M80 164 L120 164 M79 176 L121 176" stroke={pal.accent} strokeWidth={3.4} />
            <path
              d="M86 170 L114 170 L116 200 L121 206 Q120 220 100 221 Q80 220 79 206 L84 200 Z"
              fill={pal.bottom}
              stroke={ink}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            <path
              d="M86 170 L84 152 M114 170 L116 152"
              stroke={pal.bottom}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <circle cx={88} cy={173} r={2.2} fill={pal.glow} stroke={ink} strokeWidth={1.2} />
            <circle cx={112} cy={173} r={2.2} fill={pal.glow} stroke={ink} strokeWidth={1.2} />
            <path
              d="M93 182 L107 182 L106 194 L94 194 Z"
              fill="none"
              stroke={ink}
              strokeOpacity={0.4}
              strokeWidth={1.8}
            />
            <Star x={100} y={188} r={3.4} fill={pal.accent} />
          </Shirt>
        ),
        upper: { from: 0, to: 0.55, w: 15, color: pal.topAlt },
        fore: null,
        thigh: { from: 0, to: 1, w: 16, color: pal.bottom },
        shin: { from: 0, to: 0.7, w: 15, color: pal.bottom },
        shoe: pal.shoe,
      };
    case "hoodie":
      return {
        back: (
          <ellipse
            cx={100}
            cy={140}
            rx={46}
            ry={20}
            fill={pal.top}
            stroke={ink}
            strokeWidth={2.5}
          />
        ),
        torso: (
          <Shirt d={torso} color={pal.top} pal={pal}>
            <path
              d="M86 190 L114 190 L118 206 L82 206 Z"
              fill={pal.top}
              stroke={ink}
              strokeOpacity={0.5}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <path
              d="M95 156 L94 172 M105 156 L106 172"
              stroke={WHITE}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              d="M90 162 Q100 166 110 162"
              stroke={ink}
              strokeOpacity={0.3}
              strokeWidth={2}
              fill="none"
            />
          </Shirt>
        ),
        hem: <Skirt color={pal.bottom} pal={pal} flare={8} bottom={232} />,
        upper: { from: 0, to: 1, w: 15, color: pal.top },
        fore: { from: 0, to: 0.88, w: 14, color: pal.top },
        thigh: { from: 0, to: 1, w: 14, color: pal.topAlt },
        shin: { from: 0, to: 1, w: 12, color: pal.topAlt },
        shoe: pal.shoe,
      };
    case "raincoat":
      return {
        torso: (
          <Shirt d={torso} color={pal.top} pal={pal}>
            <path d="M100 152 L100 206" stroke={ink} strokeOpacity={0.35} strokeWidth={2} />
            {[166, 180, 194].map((y) => (
              <circle
                key={y}
                cx={104}
                cy={y}
                r={2.2}
                fill={pal.glow}
                stroke={ink}
                strokeWidth={1.2}
              />
            ))}
            <path
              d="M84 196 L94 196 M106 196 L116 196"
              stroke={ink}
              strokeOpacity={0.4}
              strokeWidth={2}
            />
          </Shirt>
        ),
        hem: (
          <path
            d="M79 200 L121 200 L128 240 Q100 245 72 240 Z"
            fill={pal.top}
            stroke={ink}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        ),
        collar: (
          <path
            d="M84 150 L96 162 L100 152 L104 162 L116 150 Q100 144 84 150 Z"
            fill={pal.top}
            stroke={ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
        ),
        upper: { from: 0, to: 1, w: 16, color: pal.top },
        fore: { from: 0, to: 0.86, w: 15, color: pal.top },
        thigh: null,
        shin: { from: 0.35, to: 1, w: 13, color: pal.accent },
        shoe: pal.accent,
        boots: pal.accent,
      };
    case "dress":
      return {
        torso: (
          <Shirt d={torso} color={pal.topAlt} pal={pal}>
            <path d="M88 150 Q100 162 112 150" fill={WHITE} stroke={ink} strokeWidth={2} />
            <path d="M80 194 L120 194" stroke={pal.accent} strokeWidth={4} />
          </Shirt>
        ),
        hem: <Skirt color={pal.topAlt} pal={pal} flare={14} bottom={240} />,
        upper: { from: 0, to: 0.35, w: 19, color: pal.topAlt },
        fore: null,
        thigh: null,
        shin: { from: 0.55, to: 1, w: 12, color: WHITE },
        shoe: pal.accent,
      };
    case "blazer":
      return {
        torso: (
          <Shirt d={torso} color={pal.topAlt} pal={pal}>
            <path
              d="M84 150 L100 176 L90 221 Q82 220 79 212 L77 168 Q76 154 84 150 Z"
              fill={pal.top}
              stroke={ink}
              strokeWidth={2.4}
              strokeLinejoin="round"
            />
            <path
              d="M116 150 L100 176 L110 221 Q118 220 121 212 L123 168 Q124 154 116 150 Z"
              fill={pal.top}
              stroke={ink}
              strokeWidth={2.4}
              strokeLinejoin="round"
            />
            <path
              d="M86 152 L94 166 L88 170 Z M114 152 L106 166 L112 170 Z"
              fill={pal.top}
              stroke={ink}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
            <Star x={110} y={186} r={3.6} fill={pal.glow} stroke={ink} />
          </Shirt>
        ),
        upper: { from: 0, to: 1, w: 15, color: pal.top },
        fore: { from: 0, to: 0.86, w: 14, color: pal.top },
        thigh: { from: 0, to: 1, w: 15, color: pal.bottom },
        shin: { from: 0, to: 0.92, w: 14, color: pal.bottom },
        shoe: pal.accent,
      };
    case "winter":
      return {
        torso: (
          <Shirt d={torso} color={pal.top} pal={pal}>
            <path
              d="M78 170 Q100 174 122 170 M78 186 Q100 190 122 186 M79 202 Q100 206 121 202"
              stroke={ink}
              strokeOpacity={0.3}
              strokeWidth={2}
              fill="none"
            />
          </Shirt>
        ),
        collar: (
          <g>
            <path
              d="M82 150 Q100 162 118 150 Q120 158 116 162 Q100 170 84 162 Q80 158 82 150 Z"
              fill={pal.accent}
              stroke={ink}
              strokeWidth={2.2}
            />
            <path
              d="M108 162 L112 190 L104 190 L102 164 Z"
              fill={pal.accent}
              stroke={ink}
              strokeWidth={2.2}
              strokeLinejoin="round"
            />
            <path d="M104 186 L112 186" stroke={WHITE} strokeWidth={2} />
          </g>
        ),
        upper: { from: 0, to: 1, w: 18, color: pal.top },
        fore: { from: 0, to: 0.86, w: 16, color: pal.top },
        thigh: { from: 0, to: 1, w: 16, color: pal.bottom },
        shin: { from: 0, to: 1, w: 15, color: pal.bottom },
        shoe: pal.line ?? pal.ink,
        boots: pal.shoe,
        brings: ["beanie"],
      };
    case "party":
      return {
        torso: (
          <Shirt d={torso} color={pal.accent} pal={pal}>
            <path d="M88 150 Q100 160 112 150" fill="none" stroke={pal.glow} strokeWidth={3} />
            <Star x={100} y={176} r={6} fill={pal.glow} stroke={ink} />
          </Shirt>
        ),
        hem: <Skirt color={pal.accent} pal={pal} flare={16} bottom={240} stars />,
        upper: { from: 0, to: 0.35, w: 19, color: pal.accent },
        fore: null,
        thigh: null,
        shin: { from: 0.6, to: 1, w: 12, color: WHITE },
        shoe: pal.glow,
        brings: ["partyHat"],
      };
  }
}
