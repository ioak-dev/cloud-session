import { pivot } from "./skeleton";
import type { EyeKit, MouthKit } from "./eyes";
import { DROP, TONGUE, WHITE, type Palette } from "./palette";

/**
 * The face every candidate wears — one expression vocabulary across all six, so the bench compares
 * characters, not how many faces each was given. Eyes are either `anime` (a large iris and two
 * highlights) or `bead` (a glossy dark eye, for the animals); everything else is shared.
 */
export type Mood =
  | "neutral"
  | "happy"
  | "delighted"
  | "curious"
  | "thinking"
  | "focused"
  | "worried"
  | "oops"
  | "wink";

type Eye = "open" | "happy" | "squeeze" | "sparkle" | "half";
type Brow = "neutral" | "raised" | "worried" | "think" | "focused";
type Mouth = "smile" | "grin" | "bigD" | "o" | "hmm" | "wavy" | "tongue" | "soft";

export const MOODS: {
  id: Mood;
  title: string;
  use: string;
  eyes: [Eye, Eye];
  look: [number, number];
  brow: Brow;
  mouth: Mouth;
  drop?: boolean;
  blush: number;
}[] = [
  {
    id: "neutral",
    title: "Neutral",
    use: "Default; standing by",
    eyes: ["open", "open"],
    look: [0, 0],
    brow: "neutral",
    mouth: "smile",
    blush: 0.45,
  },
  {
    id: "happy",
    title: "Happy",
    use: "A step done, a correct answer",
    eyes: ["happy", "happy"],
    look: [0, 0],
    brow: "raised",
    mouth: "grin",
    blush: 0.6,
  },
  {
    id: "delighted",
    title: "Delighted",
    use: "Unlock, session complete",
    eyes: ["sparkle", "sparkle"],
    look: [0, 0],
    brow: "raised",
    mouth: "bigD",
    blush: 0.8,
  },
  {
    id: "curious",
    title: "Curious",
    use: "A tip, a new source",
    eyes: ["open", "open"],
    look: [1.6, -1.6],
    brow: "think",
    mouth: "o",
    blush: 0.45,
  },
  {
    id: "thinking",
    title: "Thinking",
    use: "A run working",
    eyes: ["open", "open"],
    look: [-2, -2.6],
    brow: "think",
    mouth: "hmm",
    blush: 0.4,
  },
  {
    id: "focused",
    title: "Focused",
    use: "Reading, reviewing",
    eyes: ["half", "half"],
    look: [0, 1.6],
    brow: "focused",
    mouth: "soft",
    blush: 0.4,
  },
  {
    id: "worried",
    title: "Worried",
    use: "A slow network, a retry",
    eyes: ["open", "open"],
    look: [0, 0.6],
    brow: "worried",
    mouth: "wavy",
    drop: true,
    blush: 0.35,
  },
  {
    id: "oops",
    title: "Oops",
    use: "Not-found, a recoverable error",
    eyes: ["squeeze", "squeeze"],
    look: [0, 0],
    brow: "worried",
    mouth: "tongue",
    drop: true,
    blush: 0.6,
  },
  {
    id: "wink",
    title: "Wink",
    use: "A shortcut, a small secret",
    eyes: ["open", "happy"],
    look: [0.8, 0],
    brow: "raised",
    mouth: "grin",
    blush: 0.6,
  },
];

export type FaceStyle = {
  eyes: "anime" | "bead";
  /** Eye centre line and half the distance between the eyes. */
  eyeY: number;
  eyeGap: number;
  /** Eye scale — below 1 reads older (a young woman rather than a child). */
  eyeSize?: number;
  /** Where the mouth sits; an animal's nose sits above it. */
  mouthY: number;
  nose?: "dot" | "animal" | "none";
  brows?: boolean;
  lashes?: boolean;
  freckles?: boolean;
  gapTooth?: boolean;
  /** Skin the upper lid is drawn in when the eyes half-close. */
  lid: string;
  /** The character's own eyes and brows (`eyes.tsx`), drawn for every mood in place of the
   *  shared set. */
  kit?: EyeKit;
  /** `false` when the character's own part is its mouth (a beak). */
  mouth?: false;
  /** The character's own mouth, drawn for every mood in place of the shared one. */
  mouthKit?: MouthKit;
};

const EYE_RX = 7;
const EYE_RY = 8.8;

function EyeShape({
  kind,
  x,
  y,
  look,
  style,
  pal,
  flip,
}: {
  kind: Eye;
  x: number;
  y: number;
  look: [number, number];
  style: FaceStyle;
  pal: Palette;
  flip: boolean;
}) {
  const ink = pal.ink;
  if (kind === "happy")
    return (
      <path
        d={`M${x - 7} ${y + 2} Q${x} ${y - 8} ${x + 7} ${y + 2}`}
        stroke={ink}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    );
  if (kind === "squeeze") {
    const s = flip ? -1 : 1;
    return (
      <path
        d={`M${x - 6 * s} ${y - 5} L${x + 5 * s} ${y} L${x - 6 * s} ${y + 5}`}
        stroke={ink}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  const [dx, dy] = look;
  const big = kind === "sparkle" ? 1.12 : 1;
  const rx = (style.eyes === "bead" ? 6.2 : EYE_RX) * big;
  const ry = (style.eyes === "bead" ? 7.4 : EYE_RY) * big;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={ink} />
      {style.eyes === "anime" && (
        <ellipse cx={x + dx} cy={y + 2.2 + dy} rx={rx - 2} ry={ry - 3.4} fill={pal.eye} />
      )}
      <circle cx={x - 2.3 + dx} cy={y - 3.2 + dy} r={2.5 * big} fill={WHITE} />
      <circle cx={x + 2.4 + dx} cy={y + 3 + dy} r={1.1} fill={WHITE} />
      {kind === "sparkle" && (
        <path
          d={`M${x + 3} ${y - 6} l1 2.4 l2.4 1 l-2.4 1 l-1 2.4 l-1 -2.4 l-2.4 -1 l2.4 -1 Z`}
          fill={WHITE}
        />
      )}
      {kind === "half" && (
        <>
          <path
            d={`M${x - rx - 1} ${y - ry - 2} L${x + rx + 1} ${y - ry - 2} L${x + rx + 1} ${y - 1} Q${x} ${y - 3} ${x - rx - 1} ${y - 1} Z`}
            fill={style.lid}
          />
          <path
            d={`M${x - rx} ${y - 1} Q${x} ${y - 3.4} ${x + rx} ${y - 1}`}
            stroke={ink}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
      {style.lashes && kind !== "half" && (
        <path
          d={
            flip ? `M${x + rx - 1.5} ${y - ry + 3} l4 -3` : `M${x - rx + 1.5} ${y - ry + 3} l-4 -3`
          }
          stroke={ink}
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function browPath(kind: Brow, x: number, y: number, left: boolean): string {
  const inner = left ? 1 : -1;
  switch (kind) {
    case "raised":
      return `M${x - 7} ${y - 2} Q${x} ${y - 7} ${x + 7} ${y - 2}`;
    case "worried":
      return `M${x - 7 * inner} ${y + 1} Q${x} ${y - 1} ${x + 7 * inner} ${y - 5}`;
    case "think":
      return left
        ? `M${x - 7} ${y - 3} Q${x} ${y - 8} ${x + 7} ${y - 4}`
        : `M${x - 7} ${y + 1} L${x + 7} ${y + 1}`;
    case "focused":
      return `M${x - 7 * inner} ${y} Q${x} ${y - 1} ${x + 7 * inner} ${y + 2}`;
    default:
      return `M${x - 7} ${y} Q${x} ${y - 4} ${x + 7} ${y}`;
  }
}

function MouthShape({
  kind,
  y,
  style,
  pal,
}: {
  kind: Mouth;
  y: number;
  style: FaceStyle;
  pal: Palette;
}) {
  const ink = pal.ink;
  const line = {
    stroke: ink,
    strokeWidth: 2.6,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "grin":
      return (
        <g>
          <path
            d={`M91 ${y - 1} Q100 ${y + 11} 109 ${y - 1} Z`}
            fill={ink}
            strokeLinejoin="round"
            stroke={ink}
            strokeWidth={1.5}
          />
          <ellipse cx={100} cy={y + 5.4} rx={4} ry={2.3} fill={TONGUE} />
          {style.gapTooth && (
            <>
              <rect x={95} y={y - 0.8} width={4.2} height={3.4} rx={0.8} fill={WHITE} />
              <rect x={100.8} y={y - 0.8} width={4.2} height={3.4} rx={0.8} fill={WHITE} />
            </>
          )}
        </g>
      );
    case "bigD":
      return (
        <g>
          <path
            d={`M88 ${y - 3} Q100 ${y + 17} 112 ${y - 3} Z`}
            fill={ink}
            stroke={ink}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <ellipse cx={100} cy={y + 8} rx={5.5} ry={3} fill={TONGUE} />
          {style.gapTooth && (
            <>
              <rect x={94} y={y - 2.6} width={5} height={3.8} rx={0.8} fill={WHITE} />
              <rect x={101} y={y - 2.6} width={5} height={3.8} rx={0.8} fill={WHITE} />
            </>
          )}
        </g>
      );
    case "o":
      return <ellipse cx={101} cy={y + 2} rx={3.4} ry={4.2} fill={ink} />;
    case "hmm":
      return <path d={`M96 ${y + 2} Q102 ${y - 1} 108 ${y + 1}`} {...line} />;
    case "wavy":
      return (
        <path
          d={`M91 ${y + 2} Q95.5 ${y - 2} 100 ${y + 2} Q104.5 ${y + 6} 109 ${y + 2}`}
          {...line}
        />
      );
    case "tongue":
      return (
        <g>
          <path d={`M92 ${y} Q100 ${y + 6} 108 ${y}`} {...line} />
          <path
            d={`M101 ${y + 3} Q102 ${y + 11} 107 ${y + 9} Q108 ${y + 5} 106.5 ${y + 1.5}`}
            fill={TONGUE}
            stroke={ink}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </g>
      );
    case "soft":
      return <path d={`M96 ${y} Q100 ${y + 3} 104 ${y}`} {...line} />;
    default:
      return <path d={`M93 ${y - 1} Q100 ${y + 6} 107 ${y - 1}`} {...line} />;
  }
}

/** The whole face, centred on x = 100. Blinks through the `blink` joint when the eyes are open. */
export function Face({
  mood,
  style,
  pal,
  browColor,
  uid = "face",
}: {
  mood: Mood;
  style: FaceStyle;
  pal: Palette;
  browColor?: string;
  uid?: string;
}) {
  const m = MOODS.find((x) => x.id === mood) ?? MOODS[0];
  const xl = 100 - style.eyeGap;
  const xr = 100 + style.eyeGap;
  const y = style.eyeY;
  const open = m.eyes.every((e) => e === "open" || e === "sparkle");
  const eyes = (
    <>
      {[xl, xr].map((x, i) => (
        <g
          key={x}
          transform={`translate(${x} ${y}) scale(${style.eyeSize ?? 1}) translate(${-x} ${-y})`}
        >
          {style.kit ? (
            style.kit({
              mood: m.id,
              s: i === 0 ? -1 : 1,
              x,
              y,
              look: m.look,
              pal,
              id: `${uid}-eye${i}`,
            })
          ) : (
            <EyeShape
              kind={m.eyes[i]}
              x={x}
              y={y}
              look={m.look}
              style={style}
              pal={pal}
              flip={i === 1}
            />
          )}
        </g>
      ))}
    </>
  );
  return (
    <g>
      <ellipse cx={xl - 9} cy={y + 13} rx={6.5} ry={3.8} fill={pal.blush} opacity={m.blush} />
      <ellipse cx={xr + 9} cy={y + 13} rx={6.5} ry={3.8} fill={pal.blush} opacity={m.blush} />
      {style.freckles && (
        <g fill={pal.skinShade}>
          {[
            [-12, 9],
            [-8, 12],
            [-15, 13],
            [12, 9],
            [8, 12],
            [15, 13],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={(dx < 0 ? xl + 4 : xr - 4) + dx * 0.6} cy={y + dy} r={1.1} />
          ))}
        </g>
      )}
      {open ? (
        <g data-joint="blink" style={{ ...pivot("blink"), transformOrigin: `100px ${y}px` }}>
          {eyes}
        </g>
      ) : (
        eyes
      )}
      {style.brows !== false && !style.kit && (
        <g stroke={browColor ?? pal.hair} strokeWidth={2.8} fill="none" strokeLinecap="round">
          <path d={browPath(m.brow, xl, y - 15, true)} />
          <path d={browPath(m.brow, xr, y - 15, false)} />
        </g>
      )}
      {style.nose === "dot" && (
        <path
          d={`M98.5 ${style.mouthY - 8} q1.5 1.6 3 0`}
          stroke={pal.skinShade}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      )}
      {style.mouthKit
        ? style.mouthKit({ mood: m.id, y: style.mouthY, pal })
        : style.mouth !== false && (
            <MouthShape kind={m.mouth} y={style.mouthY} style={style} pal={pal} />
          )}
      {m.drop && (
        <path
          d="M140 70 q-5 8 -5 11 a5 5 0 0 0 10 0 q0 -3 -5 -11 Z"
          fill={DROP}
          stroke={pal.line === "none" ? "none" : pal.ink}
          strokeWidth={1.5}
        />
      )}
    </g>
  );
}
