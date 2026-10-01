/**
 * App icon proposals made from Wisp's shape. Not the character: a mark, the way Duolingo's icon is
 * Duo's head rather than Duo. Each proposal has two sizes of drawing on a 128 grid:
 *
 * - `full`: the app icon (home screen, store, 64px and up), on its tile.
 * - `small`: the same mark simplified for 16–32px (favicon, tab, notification). Nothing thinner
 *   than 6 units (≈1px at 16px), no mouth, no rings, no wing spots, eyes without shines.
 *
 * Wisp's drawing rules hold: no black outlines (ink is for eyes and mouth only), no highlights or
 * reflections, colour from the product's primary, and the glow as the one colour of its own.
 * Every proposal draws with a palette `K`, so the studio passes the header's scheme tokens and
 * `scripts/export-logos.mjs` passes the Sparkles scheme in hex for standalone `.svg` files.
 */
import type { ReactNode } from "react";

import { C } from "./theme";

export type K = {
  primary: string;
  deep: string;
  mid: string;
  soft: string;
  tint: string;
  hi: string;
  /** The firefly's own light: the same in every scheme. */
  glow: string;
  amber: string;
  ink: string;
  /** A very dark primary, for a night tile. */
  night: string;
};

/** The studio's palette: follows the header's scheme. */
export const K_SCHEME: K = {
  primary: C.primary,
  deep: C.deep,
  mid: C.mid,
  soft: C.soft,
  tint: C.tint,
  hi: C.hi,
  glow: "#ffcf4a",
  amber: "#e3a41b",
  ink: "#241a3a",
  night: "color-mix(in oklab, var(--char-primary) 35%, black)",
};

/** The Sparkles scheme, resolved to sRGB hex, for files that stand alone. */
export const K_SPARKLES: K = {
  primary: "#1460d6",
  deep: "#0b4399",
  mid: "#5c8fe5",
  soft: "#a8c5f4",
  tint: "#e3edfc",
  hi: "#82aaed",
  glow: "#ffcf4a",
  amber: "#e3a41b",
  ink: "#241a3a",
  night: "#01102f",
};

/**
 * Wisp's droplet (`DROPLET` in `firefly-wisp.tsx`), as a path for any tip, width and height. The
 * tip is at (cx, top); it is widest about two thirds down and round at the bottom.
 */
export function drop(cx: number, top: number, w: number, h: number) {
  const x = (u: number) => +(cx + (u * w) / 2).toFixed(2);
  const y = (v: number) => +(top + v * h).toFixed(2);
  return [
    `M${x(0)} ${y(0)}`,
    `C${x(0.217)} ${y(0.18)} ${x(1)} ${y(0.28)} ${x(1)} ${y(0.62)}`,
    `C${x(1)} ${y(0.86)} ${x(0.565)} ${y(1)} ${x(0)} ${y(1)}`,
    `C${x(-0.565)} ${y(1)} ${x(-1)} ${y(0.86)} ${x(-1)} ${y(0.62)}`,
    `C${x(-1)} ${y(0.28)} ${x(-0.217)} ${y(0.18)} ${x(0)} ${y(0)} Z`,
  ].join(" ");
}

const TILE = "M28 0H100Q128 0 128 28V100Q128 128 100 128H28Q0 128 0 100V28Q0 0 28 0Z";

function Tile({ fill }: { fill: string }) {
  return <path d={TILE} fill={fill} />;
}

/** Two antennae from behind a head whose tip is at (cx, top), each tipped with a spark. */
function Antennae({
  k,
  cx,
  top,
  spread,
  rise,
  stalk,
  tip,
  halo,
  colour,
  tipColour = k.glow,
}: {
  k: K;
  cx: number;
  top: number;
  spread: number;
  rise: number;
  stalk: number;
  tip: number;
  halo?: number;
  colour: string;
  /** The spark at the tip; on a glow tile it takes the stalk's colour instead. */
  tipColour?: string;
}) {
  return (
    <g>
      {([-1, 1] as const).map((s) => {
        const bx = cx + 3 * s;
        const by = top + 14;
        const ex = cx + spread * s;
        const ey = top - rise;
        return (
          <g key={s}>
            <path
              d={`M${bx} ${by} C${bx + 3 * s} ${top} ${ex - 2 * s} ${ey + rise * 0.55} ${ex} ${ey}`}
              stroke={colour}
              strokeWidth={stalk}
              strokeLinecap="round"
              fill="none"
            />
            {halo ? <circle cx={ex} cy={ey} r={halo} fill={k.glow} opacity={0.35} /> : null}
            <circle cx={ex} cy={ey} r={tip} fill={tipColour} />
          </g>
        );
      })}
    </g>
  );
}

/** Two eyes: ink ovals, with a small shine at icon size only. */
function Eyes({
  k,
  cx,
  y,
  gap,
  rx,
  ry,
  shine,
  look = [0, 0],
}: {
  k: K;
  cx: number;
  y: number;
  gap: number;
  rx: number;
  ry: number;
  shine?: boolean;
  look?: [number, number];
}) {
  return (
    <g>
      {([-1, 1] as const).map((s) => {
        const ex = cx + gap * s + look[0];
        const ey = y + look[1];
        return (
          <g key={s}>
            <ellipse cx={ex} cy={ey} rx={rx} ry={ry} fill={k.ink} />
            {shine ? (
              <circle cx={ex + rx * 0.3} cy={ey - ry * 0.4} r={rx * 0.36} fill="#fff" />
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

function Smile({ k, cx, y, w }: { k: K; cx: number; y: number; w: number }) {
  return (
    <path
      d={`M${cx - w / 2} ${y} Q${cx} ${y + w * 0.55} ${cx + w / 2} ${y}`}
      stroke={k.ink}
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
    />
  );
}

/** Wisp's head colour: a light heart to the primary at the rim (as `firefly-wisp.tsx`). */
function HeadGradient({ id, k }: { id: string; k: K }) {
  return (
    <radialGradient id={id} cx="50%" cy="64%" r="62%">
      <stop offset="0%" stopColor={k.tint} />
      <stop offset="40%" stopColor={k.soft} />
      <stop offset="78%" stopColor={k.mid} />
      <stop offset="100%" stopColor={k.primary} />
    </radialGradient>
  );
}

/** A four-point spark, as the trail draws them. */
function Spark({ x, y, r, fill, opacity = 1 }: { x: number; y: number; r: number; fill: string; opacity?: number }) {
  const q = r * 0.28;
  return (
    <path
      d={`M${x} ${y - r} Q${x + q} ${y - q} ${x + r} ${y} Q${x + q} ${y + q} ${x} ${y + r} Q${x - q} ${y + q} ${x - r} ${y} Q${x - q} ${y - q} ${x} ${y - r} Z`}
      fill={fill}
      opacity={opacity}
    />
  );
}

export type LogoSize = "full" | "small";

export type Logo = {
  id: string;
  label: string;
  /** What it is, in one line. */
  line: string;
  /** Where it is strong and where it is weak. */
  note: string;
  draw: (k: K, size: LogoSize, uid: string) => ReactNode;
};

/* ——— 1. Drop: Wisp's head, front on, on a pale tile ——— */

const DROP: Logo = {
  id: "drop",
  label: "Drop",
  line: "Wisp's head, front on: the droplet, its eyes and its two glowing antennae.",
  note: "The Duolingo shape: the face is the icon. Reads at 16px as a blue drop with two yellow dots on top. Pale tile, so it sits quietly on a home screen.",
  draw: (k, size, uid) =>
    size === "full" ? (
      <>
        <defs>
          <HeadGradient id={`${uid}-h`} k={k} />
        </defs>
        <Tile fill={k.tint} />
        <Antennae k={k} cx={64} top={34} spread={24} rise={16} stalk={4} tip={5} halo={10} colour={k.primary} />
        <path d={drop(64, 30, 80, 86)} fill={`url(#${uid}-h)`} />
        <Eyes k={k} cx={64} y={86} gap={14} rx={5.4} ry={7.4} shine />
        <Smile k={k} cx={64} y={100} w={10} />
      </>
    ) : (
      <>
        <Tile fill={k.tint} />
        <Antennae k={k} cx={64} top={34} spread={30} rise={18} stalk={7} tip={11} colour={k.primary} />
        <path d={drop(64, 28, 92, 92)} fill={k.mid} />
        <Eyes k={k} cx={64} y={86} gap={17} rx={8} ry={11} />
      </>
    ),
};

/* ——— 2. Figure: the whole figure, head over its flame, on the primary ——— */

const FIGURE: Logo = {
  id: "figure",
  label: "Figure",
  line: "The whole figure, reduced: the drop for a head, its wings, and the flame of light below it.",
  note: "The only one that says firefly rather than face. Tall, so the head is small at 16px; the yellow flame carries it there.",
  draw: (k, size, uid) =>
    size === "full" ? (
      <>
        <defs>
          <HeadGradient id={`${uid}-h`} k={k} />
          <radialGradient id={`${uid}-g`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={k.glow} stopOpacity={0.55} />
            <stop offset="100%" stopColor={k.glow} stopOpacity={0} />
          </radialGradient>
        </defs>
        <Tile fill={k.primary} />
        <circle cx={64} cy={98} r={30} fill={`url(#${uid}-g)`} />
        {/* wings: one rounded leaf each side, frosted */}
        {([-1, 1] as const).map((s) => (
          <path
            key={s}
            d={`M${64 + 6 * s} 74 C${64 + 18 * s} 56 ${64 + 40 * s} 52 ${64 + 46 * s} 62 C${64 + 52 * s} 72 ${64 + 34 * s} 86 ${64 + 8 * s} 84 Z`}
            fill={k.tint}
            fillOpacity={0.55}
          />
        ))}
        {/* the flame: the body turning into light, with its two rings */}
        <path
          d="M54 80 C54 74 74 74 74 80 C82 94 80 108 66 116 C62 119 63 123 69 124 C58 125 55 118 58 113 C48 106 46 92 54 80 Z"
          fill={k.glow}
        />
        <path d="M53 96 Q64 101 76 95 M56 106 Q64 110 72 105" stroke={k.amber} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <Antennae k={k} cx={64} top={20} spread={14} rise={10} stalk={3} tip={3.6} colour={k.tint} />
        <path d={drop(64, 16, 50, 60)} fill={`url(#${uid}-h)`} />
        <Eyes k={k} cx={64} y={56} gap={9} rx={3.6} ry={5} shine />
        <Smile k={k} cx={64} y={66} w={7} />
      </>
    ) : (
      <>
        <Tile fill={k.primary} />
        {([-1, 1] as const).map((s) => (
          <path
            key={s}
            d={`M${64 + 6 * s} 76 C${64 + 20 * s} 58 ${64 + 46 * s} 56 ${64 + 52 * s} 68 C${64 + 56 * s} 80 ${64 + 36 * s} 90 ${64 + 8 * s} 86 Z`}
            fill={k.soft}
          />
        ))}
        <path d="M50 78 C50 70 78 70 78 78 C88 94 84 110 70 120 C60 126 46 112 50 98 C46 90 46 84 50 78 Z" fill={k.glow} />
        <path d={drop(64, 10, 62, 70)} fill={k.tint} />
        <Eyes k={k} cx={64} y={56} gap={12} rx={6} ry={8} />
      </>
    ),
};

/* ——— 3. Flight: side-on, head first, leaving sparks ——— */

const FLIGHT: Logo = {
  id: "flight",
  label: "Flight",
  line: "Wisp travelling: side-on and leaning into its way, the flame streaming behind, sparks left where it has been.",
  note: "Motion and the spark trail, its ability, in one mark; the most product-like. One eye only, so less face than Drop. The sparks drop out at 16px; the leaning drop and its flame remain.",
  draw: (k, size, uid) => {
    /* drawn upright, side-on facing right, then leant forward into its flight */
    const lean = "rotate(34 64 74) translate(6 0)";
    const flame =
      "M52 74 C52 68 74 68 74 76 C78 94 70 108 58 116 C53 119 53 124 59 126 C46 127 41 118 45 111 C38 100 42 86 52 74 Z";
    return size === "full" ? (
      <>
        <defs>
          <HeadGradient id={`${uid}-h`} k={k} />
          <linearGradient id={`${uid}-f`} gradientUnits="userSpaceOnUse" x1="62" y1="70" x2="56" y2="126">
            <stop offset="0" stopColor={k.mid} />
            <stop offset="0.2" stopColor={k.glow} />
            <stop offset="1" stopColor={k.amber} />
          </linearGradient>
        </defs>
        <Tile fill={k.night} />
        <Spark x={22} y={100} r={5.5} fill={k.glow} opacity={0.75} />
        <Spark x={12} y={84} r={3.4} fill={k.glow} opacity={0.5} />
        <Spark x={30} y={116} r={2.8} fill={k.glow} opacity={0.4} />
        <g transform={lean}>
          {/* the wing, swept back */}
          <path d="M58 80 C46 62 26 54 18 62 C12 70 24 84 54 86 Z" fill={k.tint} fillOpacity={0.6} />
          <g transform="translate(62 72) scale(0.82) translate(-62 -72)">
            <path d={flame} fill={`url(#${uid}-f)`} />
            <path d="M50 98 Q61 103 72 98" stroke={k.amber} strokeWidth={2.6} strokeLinecap="round" fill="none" />
          </g>
          <path d="M62 24 C58 14 50 8 42 8" stroke={k.hi} strokeWidth={3.2} strokeLinecap="round" fill="none" />
          <circle cx={42} cy={8} r={8} fill={k.glow} opacity={0.35} />
          <circle cx={42} cy={8} r={4} fill={k.glow} />
          <path d={drop(64, 14, 60, 66)} fill={`url(#${uid}-h)`} />
        </g>
        {/* the face, upright in the tile so it never tips with the body */}
        <ellipse cx={82} cy={62} rx={4.8} ry={6.6} fill={k.ink} />
        <circle cx={83.6} cy={59.6} r={1.7} fill="#fff" />
        <path d="M80 75 Q86 79 91 73" stroke={k.ink} strokeWidth={2.8} strokeLinecap="round" fill="none" />
      </>
    ) : (
      <>
        <Tile fill={k.night} />
        <g transform={lean}>
          <path d={flame} fill={k.glow} transform="translate(60 70) scale(1.1) translate(-60 -70)" />
          <path d={drop(64, 8, 74, 78)} fill={k.mid} />
        </g>
        <ellipse cx={86} cy={60} rx={8} ry={11} fill={k.ink} />
      </>
    );
  },
};

/* ——— 4. Glow: the drop as a silhouette in its own light ——— */

const GLOW: Logo = {
  id: "glow",
  label: "Glow",
  line: "The drop and antennae in the primary, standing in its own yellow light; the eyes are the only detail.",
  note: "The boldest and the best at 16px: two colours, one shape. Least character at large size. A big yellow field is the glow, not a status hue, but check it beside warning yellows.",
  draw: (k, size) =>
    size === "full" ? (
      <>
        <Tile fill={k.glow} />
        <Antennae k={k} cx={64} top={32} spread={22} rise={16} stalk={4.5} tip={6} colour={k.primary} tipColour={k.primary} />
        <path d={drop(64, 28, 80, 86)} fill={k.primary} />
        {/* the eyes are pale here: ink on the primary would vanish */}
        <Eyes k={{ ...k, ink: k.tint }} cx={64} y={84} gap={14} rx={6} ry={8.4} />
        <path d="M58 99 Q64 104 70 99" stroke={k.tint} strokeWidth={3} strokeLinecap="round" fill="none" />
      </>
    ) : (
      <>
        <Tile fill={k.glow} />
        <Antennae k={k} cx={64} top={30} spread={28} rise={18} stalk={8} tip={10} colour={k.primary} tipColour={k.primary} />
        <path d={drop(64, 26, 92, 94)} fill={k.primary} />
        <Eyes k={{ ...k, ink: k.tint }} cx={64} y={84} gap={17} rx={8} ry={11} />
      </>
    ),
};

/* ——— 5. Peek: the head rising into the tile from below, looking up ——— */

const PEEK: Logo = {
  id: "peek",
  label: "Peek",
  line: "The top of Wisp's head rising from the bottom edge, eyes up, antennae and their sparks reaching into the tile.",
  note: "The most personality: curious, about to arrive. Cropped, so the drop's tip and the antennae do all the work; at 16px it is a blue hill with two eyes.",
  draw: (k, size, uid) =>
    size === "full" ? (
      <>
        <defs>
          <HeadGradient id={`${uid}-h`} k={k} />
          <clipPath id={`${uid}-c`}>
            <path d={TILE} />
          </clipPath>
        </defs>
        <Tile fill={k.deep} />
        <g clipPath={`url(#${uid}-c)`}>
          <Spark x={28} y={30} r={4} fill={k.glow} opacity={0.5} />
          <Spark x={102} y={22} r={3} fill={k.glow} opacity={0.4} />
          <Antennae k={k} cx={64} top={48} spread={30} rise={24} stalk={4.5} tip={6} halo={12} colour={k.hi} />
          <path d={drop(64, 42, 112, 120)} fill={`url(#${uid}-h)`} />
          <Eyes k={k} cx={64} y={100} gap={18} rx={7} ry={9.4} shine look={[2, -3]} />
        </g>
      </>
    ) : (
      <>
        <defs>
          <clipPath id={`${uid}-c`}>
            <path d={TILE} />
          </clipPath>
        </defs>
        <Tile fill={k.deep} />
        <g clipPath={`url(#${uid}-c)`}>
          <Antennae k={k} cx={64} top={46} spread={34} rise={24} stalk={7} tip={10} colour={k.hi} />
          <path d={drop(64, 38, 120, 128)} fill={k.mid} />
          <Eyes k={k} cx={64} y={96} gap={20} rx={9} ry={12} look={[2, -2]} />
        </g>
      </>
    ),
};

/* ——— 6. Ember: head and flame as one shape ——— */

const EMBER: Logo = {
  id: "ember",
  label: "Ember",
  line: "Head and flame as one shape: the drop's colour runs down into the light and curls off in the flame's tip.",
  note: "An abstract mark that is still Wisp (the drop, the eyes, the curl of its flame) and nothing else is shaped like it. Works without the face too, as a wordmark's dot.",
  draw: (k, size, uid) => {
    const body =
      "M64 10 C70 22 98 32 98 56 C98 70 92 80 84 88 C76 96 72 104 74 112 C76 118 82 120 86 118 C78 126 62 124 58 112 C56 104 60 96 54 90 C42 82 30 72 30 56 C30 32 58 22 64 10 Z";
    return size === "full" ? (
      <>
        <defs>
          <linearGradient id={`${uid}-e`} gradientUnits="userSpaceOnUse" x1="60" y1="10" x2="72" y2="122">
            <stop offset="0" stopColor={k.primary} />
            <stop offset="0.3" stopColor={k.mid} />
            <stop offset="0.56" stopColor={k.mid} />
            <stop offset="0.7" stopColor={k.glow} />
            <stop offset="1" stopColor={k.amber} />
          </linearGradient>
        </defs>
        <Tile fill={k.night} />
        <path d={body} fill={`url(#${uid}-e)`} />
        <path d="M58 94 Q68 98 80 92" stroke={k.amber} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <Eyes k={k} cx={64} y={54} gap={11} rx={4.6} ry={6.4} shine />
        <Smile k={k} cx={64} y={66} w={8} />
      </>
    ) : (
      <>
        <defs>
          <linearGradient id={`${uid}-e`} gradientUnits="userSpaceOnUse" x1="60" y1="10" x2="72" y2="122">
            <stop offset="0.6" stopColor={k.mid} />
            <stop offset="0.6" stopColor={k.glow} />
          </linearGradient>
        </defs>
        <Tile fill={k.night} />
        <path d={body} transform="translate(64 64) scale(1.12) translate(-64 -64)" fill={`url(#${uid}-e)`} />
        <Eyes k={k} cx={64} y={52} gap={13} rx={7} ry={9.5} />
      </>
    );
  },
};

export const LOGOS: Logo[] = [DROP, FIGURE, FLIGHT, GLOW, PEEK, EMBER];

/** One proposal as an `<svg>`, at any pixel size; `small` is used at 32px and under. */
export function LogoMark({
  logo,
  k = K_SCHEME,
  px,
  size = px <= 32 ? "small" : "full",
  uid = `${logo.id}-${px}-${size}`,
}: {
  logo: Logo;
  k?: K;
  px: number;
  size?: LogoSize;
  uid?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={px}
      height={px}
      aria-hidden
    >
      {logo.draw(k, size, uid)}
    </svg>
  );
}
