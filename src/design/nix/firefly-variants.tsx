import type { Candidate, Ctx } from "./candidates";
import type { ReactNode } from "react";

import type { Mood } from "./rig/face";
import { WHITE, type Palette } from "./rig/palette";
import { pivot } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Directions for the main character, the firefly. Each is drawn on the shared chibi rig, so every
 * outfit, prop, pose and expression works on it unchanged. The glow is the firefly's own ability —
 * fire sparkles — and belongs to no other character. It is a signature, never a status.
 *
 * Sparkle trails, bursts and other flourishes are not part of any character: they are effects to
 * be layered on later, for any character.
 *
 * Antennae and glow read the expression (`Ctx.mood`): they droop when worried, perk up when
 * delighted, and one lifts when curious. Poses and motion wait until a variant is chosen.
 */

const INK = "#2a1d22";
const CREAM = "#fff3de";
const MAGENTA = "#d93f8e";
const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

/** A four-point sparkle centred on (x, y). */
export const star = (x: number, y: number, r: number) => {
  const q = r * 0.28;
  return `M${x} ${y - r} L${x + q} ${y - q} L${x + r} ${y} L${x + q} ${y + q} L${x} ${y + r} L${x - q} ${y + q} L${x - r} ${y} L${x - q} ${y - q} Z`;
};

export function palette(
  body: string,
  bodyHi: string,
  face: string,
  faceShade: string,
  over: Partial<Palette>,
): Palette {
  return {
    ink: INK,
    skin: face,
    skinShade: faceShade,
    limb: body,
    paw: bodyHi,
    hair: body,
    hairHi: bodyHi,
    eye: INK,
    blush: "#f28fa6",
    top: MAGENTA,
    topAlt: CREAM,
    bottom: body,
    shoe: MAGENTA,
    accent: MAGENTA,
    glow: "#ffd84a",
    ...over,
  };
}

/* ——— Expression: how antennae and glow follow the mood ——— */

/** Degrees each antenna droops outward (negative perks it up), [left, right]. */
const DROOP: Record<Mood, [number, number]> = {
  neutral: [0, 0],
  happy: [-6, -6],
  delighted: [-14, -14],
  curious: [2, -18],
  thinking: [10, -10],
  focused: [-10, -10],
  worried: [32, 32],
  oops: [22, -6],
  wink: [0, -12],
};

/** How brightly the glow halo shines for a mood. */
const BRIGHT: Partial<Record<Mood, number>> = {
  happy: 1.2,
  delighted: 1.5,
  worried: 0.6,
  oops: 0.8,
};
export const bright = (m?: Mood) => (m && BRIGHT[m]) ?? 1;

/** An antenna on its joint, turned about its base by the mood. */
export function Antenna({
  side,
  base,
  mood,
  children,
}: {
  side: "L" | "R";
  base: readonly [number, number];
  mood?: Mood;
  children: ReactNode;
}) {
  const d = DROOP[mood ?? "neutral"][side === "L" ? 0 : 1];
  const j = side === "L" ? "antL" : "antR";
  return (
    <g data-joint={j} style={pivot(j)}>
      <g transform={`rotate(${side === "L" ? -d : d} ${base[0]} ${base[1]})`}>{children}</g>
    </g>
  );
}

/** A radial glow fill: a white-hot core, the glow, a warm rim. */
export function GlowGrad({ id, glow, rim }: { id: string; glow: string; rim: string }) {
  return (
    <defs>
      <radialGradient id={id} cx="42%" cy="40%" r="65%">
        <stop offset="0%" stopColor={WHITE} />
        <stop offset="45%" stopColor={glow} />
        <stop offset="100%" stopColor={rim} />
      </radialGradient>
    </defs>
  );
}

/* ——— Wings: a long upper pair and a short lower pair ——— */

function LongWings({ pal, tint, vein }: { pal: Palette; tint: string; vein?: string }) {
  return (
    <>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <path
            d={`M${100 + 8 * s} 158 C${100 + 30 * s} 126 ${100 + 64 * s} 124 ${100 + 66 * s} 142 C${100 + 66 * s} 156 ${100 + 40 * s} 166 ${100 + 8 * s} 164 Z`}
            fill={tint}
            fillOpacity={0.85}
            stroke={pal.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 8 * s} 168 C${100 + 34 * s} 168 ${100 + 52 * s} 178 ${100 + 50 * s} 192 C${100 + 46 * s} 202 ${100 + 24 * s} 190 ${100 + 8 * s} 172 Z`}
            fill={tint}
            fillOpacity={0.85}
            stroke={pal.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 12 * s} 160 Q${100 + 40 * s} 144 ${100 + 58 * s} 140 M${100 + 12 * s} 170 Q${100 + 30 * s} 176 ${100 + 44 * s} 188`}
            stroke={vein ?? pal.ink}
            strokeOpacity={vein ? 0.7 : 0.3}
            strokeWidth={1.5}
            fill="none"
          />
        </g>
      ))}
    </>
  );
}

/* ——— Fuzzy ——— */

const FUZ_BODY = C.primary;
const FUZ_HI = C.hi;
const FUZ_CORAL = C.accent;
const palFuzzy = palette(FUZ_BODY, C.deep, "#fbe8d8", "#e2c6ae", {
  eye: "#4a3657",
  glow: "#ffd35a",
  accent: C.clothes,
  blush: "#f59c8c",
  top: C.clothes,
  bottom: C.deep,
  shoe: C.clothes,
});

/** A scalloped fuzz edge round an ellipse: stroked puffs, then the fill laid over their seams. */
function Fuzz({
  cx,
  cy,
  rx,
  ry,
  n,
  r,
  fill,
  ink,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  n: number;
  r: number;
  fill: string;
  ink: string;
}) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as const;
  });
  return (
    <g>
      {pts.map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={r} fill={fill} stroke={ink} strokeWidth={2.4} />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={`f${i}`} cx={x} cy={y} r={r - 1.3} fill={fill} />
      ))}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />
    </g>
  );
}

function FuzzyHead({ pal }: Ctx) {
  return (
    <g>
      <Fuzz cx={100} cy={100} rx={42} ry={37} n={22} r={8} fill={FUZ_BODY} ink={pal.ink} />
      <path
        d="M62 110 C62 88 80 80 100 80 C120 80 138 88 138 110 C138 130 120 138 100 138 C80 138 62 130 62 110 Z"
        fill={pal.skin}
      />
      <path
        d="M92 64 C90 54 98 50 100 58 C102 48 112 52 108 64"
        fill={FUZ_BODY}
        stroke={pal.ink}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M74 72 Q84 66 94 66"
        stroke={FUZ_HI}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function FuzzyAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(["L", "R"] as const).map((side) => {
        const s = side === "L" ? -1 : 1;
        const bx = 100 + 14 * s;
        const tx = 100 + 36 * s;
        return (
          <Antenna key={side} side={side} base={[bx, 64]} mood={mood}>
            <path
              d={`M${bx} 64 C${bx + 4 * s} 46 ${tx - 6 * s} 34 ${tx} 26`}
              stroke={pal.ink}
              strokeWidth={2.6}
              fill="none"
              strokeLinecap="round"
            />
            {[0.3, 0.5, 0.7].map((t) => {
              const x = bx + (tx - bx) * t;
              const y = 64 - 38 * t;
              return (
                <path
                  key={t}
                  d={`M${x} ${y} l${-7 * s} -6 M${x} ${y} l${7 * s} 2`}
                  stroke={FUZ_BODY}
                  strokeWidth={3.4}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx={tx} cy={24} r={5} fill={FUZ_CORAL} stroke={pal.ink} strokeWidth={1.8} />
          </Antenna>
        );
      })}
    </g>
  );
}

function FuzzyBehind({ pal, mood }: Ctx) {
  return (
    <g>
      <LongWings pal={pal} tint={C.tint} />
      <g data-joint="tail" style={pivot("tail")}>
        <circle
          data-joint="glow"
          cx={126}
          cy={234}
          r={38}
          fill={pal.glow}
          opacity={0.35 * bright(mood)}
        />
        <circle cx={126} cy={236} r={22} fill={pal.glow} stroke={pal.ink} strokeWidth={2.5} />
        <Fuzz cx={114} cy={216} rx={9} ry={5} n={7} r={5} fill={FUZ_BODY} ink={pal.ink} />
        <path
          d="M114 232 Q118 224 126 222"
          stroke={WHITE}
          strokeOpacity={0.8}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <path d={star(130, 240, 6)} fill={WHITE} />
      </g>
    </g>
  );
}

/** The variants kept from earlier rounds. */
export const FIREFLY_KEPT: Candidate[] = [
  {
    id: "firefly-fuzzy",
    kind: "animal",
    label: "Firefly · Fuzzy",
    signature: "A fuzzy body, feathery antennae and a round glow-bulb tail",
    pitch:
      "The most huggable: fuzz, a crown tuft and a ruff take the bug out of the bug, answering the bench's worry that some children dislike insects. It reads as a plush toy, which suits a character a child names. Long wings keep it light.",
    risk: "The fuzz edge is fiddly at 16px and may read as a bumblebee or a moth.",
    pal: palFuzzy,
    body: FUZ_BODY,
    face: {
      eyes: "anime",
      eyeY: 108,
      eyeGap: 17,
      mouthY: 126,
      nose: "none",
      brows: false,
      lid: palFuzzy.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <FuzzyBehind {...c} />,
    head: (c) => <FuzzyHead {...c} />,
    top: (c) => <FuzzyAntennae {...c} />,
    belly: ({ pal }) => (
      <Fuzz cx={100} cy={188} rx={10} ry={15} n={10} r={4.5} fill={pal.skin} ink={pal.ink} />
    ),
    pendant: ({ pal }) => (
      <Fuzz cx={100} cy={152} rx={16} ry={4} n={8} r={6} fill={FUZ_BODY} ink={pal.ink} />
    ),
  },
];
