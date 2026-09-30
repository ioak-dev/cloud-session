import type { Candidate, Ctx } from "./candidates";
import type { ReactNode } from "react";

import type { Mood } from "./rig/face";
import { WHITE, type Palette } from "./rig/palette";
import { pivot } from "./rig/skeleton";

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
const star = (x: number, y: number, r: number) => {
  const q = r * 0.28;
  return `M${x} ${y - r} L${x + q} ${y - q} L${x + r} ${y} L${x + q} ${y + q} L${x} ${y + r} L${x - q} ${y + q} L${x - r} ${y} L${x - q} ${y - q} Z`;
};

function palette(
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
const bright = (m?: Mood) => (m && BRIGHT[m]) ?? 1;

/** An antenna on its joint, turned about its base by the mood. */
function Antenna({
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
function GlowGrad({ id, glow, rim }: { id: string; glow: string; rim: string }) {
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

/* ——— Wings: Spark's long upper pair and short lower pair, shared ——— */

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

/* ——— B · Spark ——— */

const SPK_BODY = "#4b3aa0";
const palSpark = palette(SPK_BODY, "#33267a", "#f7e7d4", "#dcc4a6", {
  eye: "#4b3aa0",
  glow: "#ffcf3f",
  accent: "#ff8a4c",
});

function SparkHead({ pal }: Ctx) {
  return (
    <g>
      <ellipse cx={100} cy={100} rx={45} ry={42} fill={SPK_BODY} />
      {/* a widow's-peak face: the point makes the head read as pointing forward, eager */}
      <path
        d="M61 108 C61 88 76 78 90 76 L100 66 L110 76 C124 78 139 88 139 108 C139 130 122 139 100 139 C78 139 61 130 61 108 Z"
        fill={pal.skin}
      />
      <ellipse cx={100} cy={100} rx={45} ry={42} fill="none" stroke={pal.ink} strokeWidth={2.5} />
      <path
        d="M74 66 Q84 60 94 60"
        stroke="#7a6ad0"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      {[
        [72, 116],
        [77, 121],
        [128, 116],
        [123, 121],
      ].map(([x, y]) => (
        <circle
          key={`${x}${y}`}
          cx={x}
          cy={y}
          r={1.8}
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={0.6}
        />
      ))}
    </g>
  );
}

function SparkAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M88 60 C80 40 62 36 60 24 C58 14 70 12 72 20", [72, 20]],
          ["R", "M112 60 C120 40 138 36 140 24 C142 14 130 12 128 20", [128, 20]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 88 : 112, 60]} mood={mood}>
          <path d={d} stroke={pal.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={9} fill={pal.glow} opacity={0.35 * bright(mood)} />
          <path
            d={star(x, y, 8)}
            fill={pal.glow}
            stroke={pal.ink}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </Antenna>
      ))}
    </g>
  );
}

function SparkBehind({ pal, mood }: Ctx) {
  return (
    <g>
      <LongWings pal={pal} tint="#e6dcff" />
      <g data-joint="tail" style={pivot("tail")}>
        <circle
          data-joint="glow"
          cx={128}
          cy={232}
          r={34}
          fill={pal.glow}
          opacity={0.35 * bright(mood)}
        />
        <path
          d="M108 212 C126 206 146 218 144 236 C142 252 124 256 114 246 C106 238 104 224 108 212 Z"
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d="M112 220 Q124 214 136 220"
          stroke={SPK_BODY}
          strokeWidth={4.5}
          fill="none"
          strokeLinecap="round"
        />
        <path d={star(126, 232, 5)} fill={WHITE} />
      </g>
    </g>
  );
}

/* ——— C · Fuzzy ——— */

const FUZ_BODY = "#6a4d82";
const FUZ_HI = "#9677ae";
const FUZ_CORAL = "#f08a6c";
const palFuzzy = palette(FUZ_BODY, "#35253f", "#fbe8d8", "#e2c6ae", {
  eye: "#4a3657",
  glow: "#ffd35a",
  accent: FUZ_CORAL,
  blush: "#f59c8c",
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
      <LongWings pal={pal} tint="#fbe3ef" />
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

/* ——— D · Nightlight: a night-sky firefly, a constellation on its cap ——— */

const NL_BODY = "#2b2f6e";
const NL_HI = "#5059b8";
const NL_WING = "#d9d2ff";
const palNight = palette(NL_BODY, "#1c1f4d", "#fbeedd", "#e2cdb0", {
  eye: "#3a3290",
  glow: "#ffe07a",
  accent: "#8f78e8",
  blush: "#f5a3b5",
});

function NightHead({ pal, uid }: Ctx) {
  const cap = `${uid}-nlcap`;
  return (
    <g>
      <defs>
        <linearGradient id={cap} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={NL_HI} />
          <stop offset="60%" stopColor={NL_BODY} />
        </linearGradient>
      </defs>
      <ellipse cx={100} cy={100} rx={46} ry={42} fill={`url(#${cap})`} />
      {/* a heart-dipped fringe: two soft bangs meet over the nose */}
      <path
        d="M58 112 C58 94 70 86 84 88 Q93 82 100 90 Q107 82 116 88 C130 86 142 94 142 112 C142 131 122 141 100 141 C78 141 58 131 58 112 Z"
        fill={pal.skin}
      />
      {/* its constellation — three stars joined, and one bright one */}
      <path
        d="M68 84 L74 72 L86 66"
        stroke={NL_WING}
        strokeOpacity={0.55}
        strokeWidth={1.2}
        fill="none"
      />
      {[
        [68, 84, 1.8],
        [74, 72, 2.2],
        [86, 66, 1.6],
      ].map(([x, y, r]) => (
        <circle key={`${x}`} cx={x} cy={y} r={r} fill={WHITE} />
      ))}
      <path d={star(128, 72, 5)} fill={pal.glow} />
      <path
        d="M80 64 Q92 58 104 58"
        stroke={NL_HI}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        opacity={0.9}
      />
      <ellipse cx={100} cy={100} rx={46} ry={42} fill="none" stroke={pal.ink} strokeWidth={2.5} />
    </g>
  );
}

function NightAntennae({ pal, uid, mood }: Ctx) {
  const g = `${uid}-nlbulb`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      {(
        [
          ["L", "M88 60 C84 44 70 40 66 28 C64 20 70 14 76 18", [75, 18]],
          ["R", "M112 60 C116 44 130 40 134 28 C136 20 130 14 124 18", [125, 18]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 88 : 112, 60]} mood={mood}>
          <path d={d} stroke={pal.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={11} fill={pal.glow} opacity={0.3 * bright(mood)} />
          <circle cx={x} cy={y} r={6} fill={`url(#${g})`} stroke={pal.ink} strokeWidth={1.8} />
        </Antenna>
      ))}
    </g>
  );
}

function NightBehind({ pal, uid, mood }: Ctx) {
  const g = `${uid}-nltail`;
  const w = `${uid}-nlwing`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      <defs>
        <linearGradient id={w} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={WHITE} />
          <stop offset="100%" stopColor={NL_WING} />
        </linearGradient>
      </defs>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => {
        const cx = 100 + 36 * s;
        return (
          <g key={j} data-joint={j} style={pivot(j)}>
            {/* round moth-like wings with a dotted border, like stars on a blanket */}
            <g transform={`rotate(${-42 * s} ${cx} 152)`}>
              <ellipse
                cx={cx}
                cy={152}
                rx={22}
                ry={30}
                fill={`url(#${w})`}
                fillOpacity={0.9}
                stroke={pal.ink}
                strokeWidth={2.2}
              />
              <path
                d={`M${cx} 176 Q${cx - 4} 152 ${cx} 128`}
                stroke={pal.ink}
                strokeOpacity={0.25}
                strokeWidth={1.5}
                fill="none"
              />
              {[
                [-10, 134],
                [0, 128],
                [10, 134],
                [-14, 146],
                [14, 146],
              ].map(([dx, y]) => (
                <circle key={`${dx}${y}`} cx={cx + dx} cy={y} r={2} fill={NL_HI} opacity={0.6} />
              ))}
            </g>
          </g>
        );
      })}
      <g data-joint="tail" style={pivot("tail")}>
        <circle
          data-joint="glow"
          cx={128}
          cy={236}
          r={40}
          fill={pal.glow}
          opacity={0.35 * bright(mood)}
        />
        <path
          d="M106 210 C122 204 146 212 148 234 C150 254 132 264 118 256 C106 248 102 228 106 210 Z"
          fill={`url(#${g})`}
          stroke={pal.ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d="M108 216 Q124 208 140 216"
          stroke={NL_BODY}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M112 236 Q128 232 146 238 M116 250 Q128 248 140 252"
          stroke="#f5a623"
          strokeOpacity={0.5}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M116 226 Q120 220 128 220"
          stroke={WHITE}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/* ——— E · Flicker: all fizz — a flame of a crest, freckles and a gap tooth ——— */

const FL_BODY = "#2f4c9e";
const FL_HI = "#5474cc";
const TANGERINE = "#ff8a3d";
const palFlicker = palette(FL_BODY, "#1f3574", "#fde9d6", "#e4c8ac", {
  eye: "#1f3574",
  glow: "#ffc94a",
  accent: TANGERINE,
  top: TANGERINE,
  shoe: TANGERINE,
});

function FlickerHead({ pal, uid }: Ctx) {
  const f = `${uid}-flcrest`;
  const b = `${uid}-flhead`;
  return (
    <g>
      <defs>
        <linearGradient id={f} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="100%" stopColor={TANGERINE} />
        </linearGradient>
        <linearGradient id={b} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={FL_HI} />
          <stop offset="55%" stopColor={FL_BODY} />
        </linearGradient>
      </defs>
      {/* the crest: a three-tongued flame that sways like hair */}
      <g data-joint="hairSway" style={pivot("hairSway")}>
        <path
          d="M84 66 C76 52 84 42 88 30 C92 40 96 44 98 38 C98 28 102 20 108 12 C110 26 118 34 116 44 C122 40 122 34 122 30 C130 42 126 58 118 66 Z"
          fill={`url(#${f})`}
          stroke={pal.ink}
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        <path d="M96 62 C92 54 98 48 100 42 C104 50 110 54 106 62 Z" fill="#fff1b8" />
      </g>
      <ellipse cx={100} cy={100} rx={45} ry={41} fill={`url(#${b})`} />
      <path
        d="M60 108 C60 88 78 80 100 80 C122 80 140 88 140 108 C140 130 122 139 100 139 C78 139 60 130 60 108 Z"
        fill={pal.skin}
      />
      {/* tangerine cheek flashes, the only marking on the face */}
      <path
        d="M62 104 l8 3 M62 110 l7 1"
        stroke={TANGERINE}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d="M138 104 l-8 3 M138 110 l-7 1"
        stroke={TANGERINE}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={100} rx={45} ry={41} fill="none" stroke={pal.ink} strokeWidth={2.5} />
    </g>
  );
}

function FlickerAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M76 66 L68 54 L74 48 L64 34", [64, 32]],
          ["R", "M124 66 L132 54 L126 48 L136 34", [136, 32]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 76 : 124, 66]} mood={mood}>
          {/* a zig-zag, like a spark jumping */}
          <path
            d={d}
            stroke={pal.ink}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={x} cy={y} r={9} fill={pal.glow} opacity={0.35 * bright(mood)} />
          <path
            d={`M${x} ${y - 8} C${x + 5} ${y - 2} ${x + 5} ${y + 5} ${x} ${y + 5} C${x - 5} ${y + 5} ${x - 5} ${y - 2} ${x} ${y - 8} Z`}
            fill={pal.glow}
            stroke={pal.ink}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Antenna>
      ))}
    </g>
  );
}

function FlickerBehind({ pal, uid, mood }: Ctx) {
  const g = `${uid}-fltail`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim={TANGERINE} />
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          {/* swept, pointed wings with a tangerine leading edge */}
          <path
            d={`M${100 + 8 * s} 158 C${100 + 30 * s} 134 ${100 + 58 * s} 126 ${100 + 70 * s} 128 C${100 + 64 * s} 148 ${100 + 36 * s} 164 ${100 + 8 * s} 164 Z`}
            fill="#fff0e2"
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 14 * s} 156 C${100 + 32 * s} 140 ${100 + 54 * s} 132 ${100 + 66 * s} 131`}
            stroke={TANGERINE}
            strokeWidth={2.6}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${100 + 8 * s} 170 C${100 + 30 * s} 172 ${100 + 48 * s} 184 ${100 + 52 * s} 198 C${100 + 36 * s} 196 ${100 + 20 * s} 186 ${100 + 8 * s} 176 Z`}
            fill="#fff0e2"
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
        </g>
      ))}
      <g data-joint="tail" style={pivot("tail")}>
        <circle
          data-joint="glow"
          cx={128}
          cy={232}
          r={38}
          fill={pal.glow}
          opacity={0.35 * bright(mood)}
        />
        {/* a flame-shaped glow: the tip flicks up and back */}
        <path
          d="M106 212 C120 208 138 210 150 196 C154 214 154 236 142 250 C130 262 110 256 106 242 C102 232 102 220 106 212 Z"
          fill={`url(#${g})`}
          stroke={pal.ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d="M108 218 Q120 212 132 214"
          stroke={FL_BODY}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M124 248 C116 240 122 230 128 224 C128 234 136 232 134 242 C133 248 128 250 124 248 Z"
          fill={WHITE}
          opacity={0.85}
        />
      </g>
    </g>
  );
}

/* ——— F · Bulb: a lightbulb for a tail — a bright idea ——— */

const BB_BODY = "#5a98d6";
const BB_NAVY = "#23365e";
const palBulb = palette(BB_NAVY, "#172745", "#fdf0de", "#e6cfb2", {
  eye: BB_NAVY,
  glow: "#ffd23f",
  accent: "#f0795a",
  top: "#f0795a",
  shoe: "#f0795a",
  blush: "#f7a08e",
});

function BulbHead({ pal, uid }: Ctx) {
  const clip = `${uid}-bbclip`;
  const b = `${uid}-bbhead`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <ellipse cx={100} cy={100} rx={46} ry={42} />
        </clipPath>
        <linearGradient id={b} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8cc0ee" />
          <stop offset="60%" stopColor={BB_BODY} />
        </linearGradient>
      </defs>
      <ellipse cx={100} cy={100} rx={46} ry={42} fill={`url(#${b})`} />
      {/* two navy bands over the crown, like a knitted cap that is really its shell */}
      <g clipPath={`url(#${clip})`}>
        <path d="M50 78 Q100 50 150 78" stroke={BB_NAVY} strokeWidth={7} fill="none" />
        <path d="M50 64 Q100 36 150 64" stroke={BB_NAVY} strokeWidth={7} fill="none" />
      </g>
      <path
        d="M58 112 C58 92 78 84 100 84 C122 84 142 92 142 112 C142 132 122 141 100 141 C78 141 58 132 58 112 Z"
        fill={pal.skin}
      />
      <ellipse cx={100} cy={100} rx={46} ry={42} fill="none" stroke={pal.ink} strokeWidth={2.5} />
    </g>
  );
}

function BulbAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M86 60 C84 46 80 38 72 30", [70, 27]],
          ["R", "M114 60 C116 46 120 38 128 30", [130, 27]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 86 : 114, 60]} mood={mood}>
          <path d={d} stroke={pal.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* glass beads with a spark inside */}
          <circle cx={x} cy={y} r={7} fill="#eaf5ff" stroke={pal.ink} strokeWidth={2} />
          <circle cx={x} cy={y} r={3} fill={pal.glow} opacity={Math.min(1, 0.8 * bright(mood))} />
          <path
            d={`M${x - 4} ${y - 2} q2 -3 5 -3`}
            stroke={WHITE}
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
          />
        </Antenna>
      ))}
    </g>
  );
}

function BulbBehind({ pal, uid, mood }: Ctx) {
  const g = `${uid}-bbtail`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5b400" />
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          {/* round, polka-dotted wings — friendly rather than insect-like */}
          <ellipse
            cx={100 + 36 * s}
            cy={152}
            rx={24}
            ry={18}
            transform={`rotate(${-22 * s} ${100 + 36 * s} 152)`}
            fill="#e8f3ff"
            fillOpacity={0.92}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
          <ellipse
            cx={100 + 30 * s}
            cy={176}
            rx={15}
            ry={11}
            transform={`rotate(${18 * s} ${100 + 30 * s} 176)`}
            fill="#e8f3ff"
            fillOpacity={0.92}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
          {[
            [40, 146, 3],
            [50, 156, 2.4],
            [30, 142, 2],
          ].map(([dx, y, r]) => (
            <circle key={dx} cx={100 + dx * s} cy={y} r={r} fill={BB_BODY} opacity={0.7} />
          ))}
        </g>
      ))}
      <g data-joint="tail" style={pivot("tail")}>
        <g transform="rotate(-58 112 208)">
          <circle
            data-joint="glow"
            cx={112}
            cy={242}
            r={36}
            fill={pal.glow}
            opacity={0.35 * bright(mood)}
          />
          {/* the glass bulb */}
          <path
            d="M105 218 L119 218 C121 224 134 228 134 243 C134 256 124 264 112 264 C100 264 90 256 90 243 C90 228 103 224 105 218 Z"
            fill={`url(#${g})`}
            stroke={pal.ink}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          {/* the filament: the idea, lit */}
          <path
            d="M107 220 L104 246 M117 220 L120 246"
            stroke={pal.ink}
            strokeOpacity={0.35}
            strokeWidth={1.4}
          />
          <path
            d="M104 246 C106 236 109 244 112 236 C115 244 118 236 120 246"
            stroke="#e07b00"
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M97 238 Q98 230 104 228"
            stroke={WHITE}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          {/* the screw base, where it joins the body */}
          <rect
            x={103}
            y={204}
            width={18}
            height={15}
            rx={3}
            fill={BB_NAVY}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
          <path d="M104 209 L120 208 M104 214 L120 213" stroke="#8cc0ee" strokeWidth={1.6} />
        </g>
      </g>
    </g>
  );
}

export const FIREFLY_VARIANTS: Candidate[] = [
  {
    id: "firefly-spark",
    kind: "animal",
    label: "Firefly · Spark",
    signature: "Star-tipped antennae and a comet-shaped glow tail",
    pitch:
      "The most magical: the antennae end in stars, so the name Sparkles is literally on the character. Two pairs of long wings give it the most range in motion; the widow's-peak face reads as quick and eager.",
    risk: "The stars on its antennae may clash with product ornaments that also use a four-point star.",
    pal: palSpark,
    body: SPK_BODY,
    face: {
      eyes: "anime",
      eyeY: 104,
      eyeGap: 17,
      mouthY: 124,
      nose: "none",
      brows: true,
      lid: palSpark.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <SparkBehind {...c} />,
    head: (c) => <SparkHead {...c} />,
    top: (c) => <SparkAntennae {...c} />,
    belly: ({ pal }) => (
      <path
        d="M86 178 L100 186 L114 178 M86 194 L100 202 L114 194"
        stroke={pal.glow}
        strokeOpacity={0.8}
        strokeWidth={3}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: "firefly-fuzzy",
    kind: "animal",
    label: "Firefly · Fuzzy",
    signature: "A fuzzy body, feathery antennae and a round glow-bulb tail",
    pitch:
      "The most huggable: fuzz, a crown tuft and a ruff take the bug out of the bug, answering the bench's worry that some children dislike insects. It reads as a plush toy, which suits a character a child names. Spark's long wings keep it light.",
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
  {
    id: "firefly-night",
    kind: "animal",
    label: "Firefly · Nightlight",
    signature: "A constellation on its cap and a glow like a nightlight",
    pitch:
      "Calm and reassuring: a firefly is a small light in the dark, and this one carries the night sky with it. Heart-dipped bangs, lashes and big eyes make it the most tender face; the glowing bulbs on its antennae brighten and dim with its mood. Suits a child working alone in the evening.",
    risk: "The quietest of the set; its gentleness may read as sleepy beside energetic side characters. The deep navy needs its lighter cap to hold an edge on the dark ground.",
    pal: palNight,
    body: NL_BODY,
    face: {
      eyes: "anime",
      eyeY: 110,
      eyeGap: 18,
      eyeSize: 1.08,
      mouthY: 128,
      nose: "none",
      brows: true,
      lashes: true,
      lid: palNight.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <NightBehind {...c} />,
    head: (c) => <NightHead {...c} />,
    top: (c) => <NightAntennae {...c} />,
    belly: ({ pal }) => (
      <path
        d="M82 178 Q100 183 118 178 M81 192 Q100 197 119 192 M82 206 Q100 210 118 206"
        stroke={pal.skin}
        strokeOpacity={0.5}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: "firefly-flicker",
    kind: "animal",
    label: "Firefly · Flicker",
    signature: "A flame crest, zig-zag antennae and a flame-shaped glow",
    pitch:
      "All energy: the crest is a flame that sways like hair, the antennae zig-zag like a jumping spark and end in tiny flames, and freckles and a gap tooth make every expression cheeky. The fire in fire sparkles, drawn as personality. The crest gives it the strongest silhouette of the set.",
    risk: "Fire is a hazard sign to some parents; the flames must stay soft and round. The crest disappears under a winter hat, so the zig-zag antennae have to carry it then.",
    pal: palFlicker,
    body: FL_BODY,
    face: {
      eyes: "anime",
      eyeY: 106,
      eyeGap: 18,
      mouthY: 125,
      nose: "none",
      brows: true,
      freckles: true,
      gapTooth: true,
      lid: palFlicker.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <FlickerBehind {...c} />,
    head: (c) => <FlickerHead {...c} />,
    top: (c) => <FlickerAntennae {...c} />,
    belly: ({ pal }) => (
      <path
        d="M84 178 Q100 184 116 178 M84 194 Q100 200 116 194"
        stroke={pal.glow}
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: "firefly-bulb",
    kind: "animal",
    label: "Firefly · Bulb",
    signature: "A lightbulb for a tail, filament and all — a bright idea",
    pitch:
      "The learning one: its glow is a lightbulb, the universal sign of a bright idea, so the character says what the product is for. A striped cap, glass-bead antennae and polka-dot wings keep it playful; the filament lights up in a lesson's 'got it' moment. The lightest body of the set, so it pops on the dark ground.",
    risk: "A lightbulb is an object, not a creature — it may read as a gadget. A sky-blue body sits near an info hue, so keep it out of status use.",
    pal: palBulb,
    body: BB_BODY,
    face: {
      eyes: "anime",
      eyeY: 110,
      eyeGap: 18,
      mouthY: 128,
      nose: "none",
      brows: true,
      lid: palBulb.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <BulbBehind {...c} />,
    head: (c) => <BulbHead {...c} />,
    top: (c) => <BulbAntennae {...c} />,
    belly: () => (
      <path
        d="M80 182 Q100 188 120 182 M80 198 Q100 204 120 198"
        stroke={BB_NAVY}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    ),
  },
];
