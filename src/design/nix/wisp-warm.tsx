import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright } from "./firefly-variants";
import { DROPLET, Flame, HAIR, pal as WISP_PAL, WISP, WISP_MAIN, Wings } from "./firefly-wisp";
import { EYE_STYLES, HONEY_EYES } from "./wisp-eyes";
import { line, OpenMouth, type MouthKit } from "./rig/eyes";
import { EASE, keys, rotAt } from "./rig/motion";
import type { FaceStyle } from "./rig/face";
import type { Palette } from "./rig/palette";
import { pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Wisp, warmer — proposals, not adopted. `WISP_MAIN` is untouched; these answer what it lacks
 * in spirit. Next to the side characters, Wisp is the only one who is nobody at rest: a cold,
 * all-blue figure whose only warmth is at its tail, a small face low on a perfectly symmetric
 * drop that reads as a logo, a stick body, and no temperament.
 *
 * Each of the first four changes one thing, so its effect can be judged alone; the fifth puts
 * them together, restrained. The silhouette's parts, the two pairs of wings, the ringed flame
 * and the spark trail are Wisp's and stay.
 *
 * - Hearth — warmth: its light lives in its heart as well as its tail.
 * - Scamp — attitude: a curl on its head, a bent antenna, a lopsided smile.
 * - Moony — a face: big honey eyes, brows that talk.
 * - Snug — softness: a rounder head and body, a fluffy ruff, chunky arms.
 * - Wisp, warmer — the four together.
 */

const AMBER = "var(--char-glow-edge)";
const GLOW = WISP_PAL.glow;
/** The warm light its heart gives the face, and the cheeks that catch it. */
const EMBER_LIGHT = "#ffd9b0";
const WARM_BLUSH = "#ff9f8a";

const sides = [
  ["L", -1],
  ["R", 1],
] as const;

/* ——— heads ——— */

/** The base drop with its tip swept over to one side in a curl, like a lick of flame. */
export const CURL =
  "M100 144 C74 144 54 130 54 106 C54 78 82 66 92 54 C98 44 110 36 120 42 C112 42 106 48 108 58 C118 70 146 80 146 106 C146 130 126 144 100 144 Z";
/** A rounder, softer drop: a shorter tip, a fuller cheek. */
const ROUND =
  "M100 54 C112 68 150 78 150 108 C150 132 128 146 100 146 C72 146 50 132 50 108 C50 78 88 68 100 54 Z";
/** The round drop with the curl. */
const ROUND_CURL =
  "M100 146 C72 146 50 132 50 108 C50 82 80 70 92 58 C98 48 110 42 118 48 C110 48 105 54 108 62 C118 74 150 82 150 108 C150 132 128 146 100 146 Z";

/** The base's colour: a light heart to the primary at the rim. */
function HeadFill({ id, d }: { id: string; d: string }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="62%" r="62%">
          <stop offset="0%" stopColor={C.tint} />
          <stop offset="40%" stopColor={C.soft} />
          <stop offset="78%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.primary} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} />
    </>
  );
}

/**
 * The warmth of its heart, showing through the face: a peach light low in the head, strongest
 * behind the cheeks, fading out before the rim so the rim keeps the product's colour. Not a
 * highlight: it does not depend on where light comes from, it comes from inside.
 */
function Warmth({ id, d, mood }: { id: string; d: string; mood?: Ctx["mood"] }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="74%" r="52%">
          <stop offset="0%" stopColor={EMBER_LIGHT} stopOpacity={1} />
          <stop offset="50%" stopColor={EMBER_LIGHT} stopOpacity={0.7} />
          <stop offset="100%" stopColor={EMBER_LIGHT} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} opacity={Math.min(1, 0.85 * bright(mood))} />
    </>
  );
}

/* ——— antennae ——— */

const tip = (x: number, y: number, mood: Ctx["mood"]) => (
  <>
    <circle cx={x} cy={y} r={6.5} fill={GLOW} opacity={0.35 * bright(mood)} />
    <circle cx={x} cy={y} r={3} fill={GLOW} stroke={AMBER} strokeWidth={HAIR} />
  </>
);

/** The base's pair. */
function Antennae({ mood, base = 58 }: Ctx & { base?: number }) {
  return (
    <g>
      {sides.map(([side, s]) => {
        const bx = 100 + 3 * s;
        const x = 100 + 21 * s;
        const y = 32;
        return (
          <Antenna key={side} side={side} base={[bx, base]} mood={mood}>
            <path
              d={`M${bx} ${base} C${bx + 4 * s} 46 ${100 + 18 * s} 46 ${100 + 22 * s} 38 C${100 + 24 * s} 34 ${100 + 23 * s} 31 ${x} ${y}`}
              stroke={C.thin}
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
            />
            {tip(x, y, mood)}
          </Antenna>
        );
      })}
    </g>
  );
}

/**
 * The warmer's antennae: soft stalks in three segments on their own joints — base, halfway up,
 * and the tip — so they bend as they sway, each segment a little later and further than the one
 * it hangs from. The left one stands up, perky; the right one flops over in a smooth curl like a
 * question mark and bounces. Each segment is a little thinner than the last, so the stalk tapers.
 */
const STALK = {
  L: {
    base: [97, 58],
    mid: [89, 42],
    tip: [82, 31],
    d: ["M97 58 C96 52 93 46 89 42", "M89 42 C86 38 83.4 35 82 31", "M82 31 C81.5 29.4 81.4 27.6 81.6 26"],
    bulb: [81.6, 25.4],
  },
  R: {
    base: [103, 58],
    mid: [110, 40],
    tip: [123, 30],
    d: ["M103 58 C104 51 106 45 110 40", "M110 40 C113 35 118 31 123 30", "M123 30 C128 29.5 132 32 133 37"],
    bulb: [133, 38.6],
  },
} as const;

/** A frame with the stalk joints placed on this character's antennae. */
export const withStalks = (b: Body, id: string, headVB?: string): Body => ({
  ...b,
  id,
  headVB: headVB ?? b.headVB,
  j: {
    ...b.j,
    antL: STALK.L.base,
    antR: STALK.R.base,
    antMidL: STALK.L.mid,
    antMidR: STALK.R.mid,
    antTipL: STALK.L.tip,
    antTipR: STALK.R.tip,
  },
});

function Stalks({ mood, frame }: Ctx & { frame: Body }) {
  return (
    <g>
      {(["L", "R"] as const).map((side) => {
        const a = STALK[side];
        const droop = DROOP_OF(mood, side);
        const seg = (d: string, w: number) => (
          <path d={d} stroke={C.thin} strokeWidth={w} fill="none" strokeLinecap="round" />
        );
        return (
          <g key={side} data-joint={`ant${side}`} style={pivot(`ant${side}`, frame.j)}>
            <g transform={`rotate(${droop} ${a.base[0]} ${a.base[1]})`}>
              {seg(a.d[0], 3.2)}
              <g data-joint={`antMid${side}`} style={pivot(`antMid${side}`, frame.j)}>
                {seg(a.d[1], 2.8)}
                <g data-joint={`antTip${side}`} style={pivot(`antTip${side}`, frame.j)}>
                  {seg(a.d[2], 2.4)}
                  {tip(a.bulb[0], a.bulb[1], mood)}
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** How far each antenna turns about its base for a mood, as the shared `Antenna` does. */
const DROOP_OF = (mood: Ctx["mood"], side: "L" | "R") => {
  const d: Partial<Record<NonNullable<Ctx["mood"]>, [number, number]>> = {
    happy: [-6, -6],
    delighted: [-14, -14],
    curious: [2, -18],
    thinking: [10, -10],
    focused: [-10, -10],
    worried: [32, 32],
    oops: [22, -6],
    wink: [0, -12],
    sly: [-4, 14],
    silly: [26, -20],
    surprised: [-22, -22],
    proud: [-10, -4],
    party: [-18, -10],
  };
  const [l, r] = d[mood ?? "neutral"] ?? [0, 0];
  return side === "L" ? -l : r;
};

/**
 * Its habits at rest, on the idle pose's clock: both stalks sway and follow through; once a loop
 * the left one perks up in a quick twitch, and a beat later the right one's tip flicks up and
 * springs back — boing — settling in smaller and smaller bounces. Declared keyframes; stilled or
 * under reduced motion they hold the first frame.
 */
export const STALK_IDLE: NonNullable<NonNullable<Candidate["attitude"]>["motion"]> = {
  antL: rotAt([0, -4], [0.3, 6], [0.56, -1], [0.6, -13], [0.68, 3], [0.76, -5], [1, -4]),
  antMidL: rotAt([0, 3], [0.36, -6], [0.64, 9], [0.72, -5], [0.8, 2], [1, 3]),
  antTipL: rotAt([0, 3], [0.42, -6], [0.67, 12], [0.76, -6], [0.84, 3], [1, 3]),
  antR: rotAt([0, 3], [0.5, -6], [1, 3]),
  antMidR: rotAt([0, -4], [0.22, 7], [0.55, -7], [0.7, -10], [0.76, 7], [0.84, -3], [1, -4]),
  antTipR: rotAt(
    [0, 4],
    [0.26, -5],
    [0.52, 8],
    [0.7, -24],
    [0.76, 16],
    [0.82, -9],
    [0.88, 5],
    [0.94, -2],
    [1, 4],
  ),
};

/* ——— the heart ——— */

/**
 * A small flame in its chest — the same light as its tail, where a heart would be. It breathes
 * on the glow joint and brightens with the mood, so its light is how it feels. Under clothes it
 * is covered, like any heart.
 */
function Ember({ uid, mood }: Ctx) {
  const g = `${uid}-ember`;
  return (
    <g>
      <defs>
        <radialGradient id={g}>
          <stop offset="0%" stopColor={GLOW} stopOpacity={0.9} />
          <stop offset="100%" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle data-joint="glow" cx={100} cy={176} r={17} fill={`url(#${g})`} opacity={0.8 * bright(mood)} />
      <path
        d="M100 166 C103 171 107 174 107 179 C107 183 104 186 100 186 C96 186 93 183 93 179 C93 174 97 171 100 166 Z"
        fill={GLOW}
        stroke={AMBER}
        strokeWidth={HAIR}
      />
    </g>
  );
}

/* ——— the ruff ——— */

/** A collar of fuzz where the head meets the body, as on a real firefly: it hides the stalk of
 *  a neck and makes it something to hug. Two tones of its own colour, no outline. */
function Ruff() {
  const puffs = [-22, -13, -4, 5, 14, 23].map((dx, i) => [100 + dx + 0.5, 150 + (i % 2) * 2.5] as const);
  return (
    <g>
      {puffs.map(([x, y]) => (
        <circle key={`s${x}`} cx={x + 1.2} cy={y + 2} r={7.4} fill={C.primary} />
      ))}
      {puffs.map(([x, y]) => (
        <circle key={`f${x}`} cx={x} cy={y} r={7} fill={C.mid} />
      ))}
    </g>
  );
}

/* ——— a face: Moony's eyes are `HONEY_EYES` (wisp-eyes.tsx) ——— */

/** Moony's mouth: bigger and rounder than the base's, open at the smallest excuse. */
const roundMouth: MouthKit = ({ mood, y, pal }) => {
  const ink = pal.ink;
  switch (mood) {
    case "happy":
    case "wink":
      return (
        <OpenMouth d={`M90 ${y - 2} Q100 ${y + 13} 110 ${y - 2} Z`} fill={ink} tongue={[100, y + 7, 5, 3]} />
      );
    case "delighted":
      return (
        <OpenMouth d={`M86 ${y - 4} Q100 ${y + 20} 114 ${y - 4} Z`} fill={ink} tongue={[100, y + 10, 6.5, 4]} />
      );
    case "curious":
      return <ellipse cx={101} cy={y + 2} rx={4} ry={5} fill={ink} />;
    case "thinking":
      return <path d={`M95 ${y + 2} Q102 ${y - 1} 108 ${y + 1}`} {...line(ink, 2.8)} />;
    case "focused":
      return <path d={`M96 ${y} Q100 ${y + 3} 104 ${y}`} {...line(ink, 2.8)} />;
    case "worried":
      return <path d={`M90 ${y + 2} Q95 ${y - 2} 100 ${y + 2} Q105 ${y + 6} 110 ${y + 2}`} {...line(ink, 2.8)} />;
    case "oops":
      return (
        <OpenMouth d={`M92 ${y + 3} Q100 ${y - 3} 108 ${y + 3} Q100 ${y + 9} 92 ${y + 3} Z`} fill={ink} />
      );
    default:
      /* at rest, just open: always about to say something */
      return (
        <OpenMouth d={`M93 ${y - 1} Q100 ${y + 9} 107 ${y - 1} Z`} fill={ink} tongue={[100, y + 5, 3.4, 2]} />
      );
  }
};

/* ——— attitude: Scamp's lopsided mouth ——— */

/**
 * Scamp's mouth sits a little to one side and smiles higher on the right: always slightly too
 * pleased with itself. When it concentrates, the tip of its tongue pokes out of the corner.
 */
const sideMouth: MouthKit = ({ mood, y, pal }) => {
  const ink = pal.ink;
  switch (mood) {
    case "happy":
    case "wink":
      return (
        <OpenMouth d={`M92 ${y} Q102 ${y + 11} 111 ${y - 4} Z`} fill={ink} tongue={[102, y + 5, 4, 2.4]} />
      );
    case "delighted":
      return (
        <OpenMouth d={`M88 ${y - 2} Q101 ${y + 17} 114 ${y - 5} Z`} fill={ink} tongue={[101, y + 8, 5.5, 3.2]} />
      );
    case "curious":
      return <ellipse cx={104} cy={y + 1} rx={3.2} ry={4} fill={ink} />;
    case "thinking":
      return <path d={`M96 ${y + 2} Q103 ${y} 110 ${y - 2}`} {...line(ink, 2.6)} />;
    case "focused":
      /* the tongue at the corner: concentrating hard */
      return (
        <g>
          <path d={`M94 ${y} Q101 ${y + 2} 108 ${y - 1}`} {...line(ink, 2.6)} />
          <ellipse cx={108.5} cy={y + 1.5} rx={2.6} ry={2.2} fill="#ef7f8e" />
        </g>
      );
    case "worried":
      return <path d={`M92 ${y + 2} Q97 ${y - 2} 101 ${y + 2} Q106 ${y + 5} 110 ${y}`} {...line(ink, 2.6)} />;
    case "oops":
      return (
        <g>
          <path d={`M92 ${y} Q101 ${y + 5} 110 ${y - 2}`} {...line(ink, 2.6)} />
          <path d={`M101 ${y + 3} Q102 ${y + 10} 107 ${y + 8} Q108 ${y + 4} 106.5 ${y + 1}`} fill="#ef7f8e" />
        </g>
      );
    case "sly":
      /* the smirk pulled right up one side */
      return (
        <g>
          <path d={`M94 ${y + 1} Q103 ${y + 4} 111 ${y - 6}`} {...line(ink, 2.6)} />
          <path d={`M111.5 ${y - 8.5} q1.8 2.2 0.6 4.6`} {...line(ink, 1.8)} />
        </g>
      );
    case "silly":
      /* a grin with the tongue stuck right out, off to one side */
      return (
        <g>
          <path
            d={`M101 ${y + 2} Q100 ${y + 14} 107 ${y + 13} Q112 ${y + 11} 108 ${y + 1} Z`}
            fill="#ef7f8e"
          />
          <path d={`M104 ${y + 5} L104.6 ${y + 10}`} {...line("#d45d70", 1.2)} />
          <path d={`M90 ${y - 2} Q100 ${y + 6} 112 ${y - 3}`} {...line(ink, 2.6)} />
        </g>
      );
    case "surprised":
      return <ellipse cx={101} cy={y + 3} rx={4.4} ry={6.4} fill={ink} />;
    case "proud":
      /* a closed, wide, pleased smile, higher on the right */
      return (
        <g>
          <path d={`M90 ${y - 1} Q100 ${y + 7} 111 ${y - 3}`} {...line(ink, 2.6)} />
          <path d={`M111.6 ${y - 5.4} q1.6 2 0.4 4`} {...line(ink, 1.8)} />
        </g>
      );
    case "party":
      return (
        <OpenMouth d={`M86 ${y - 3} Q101 ${y + 19} 115 ${y - 5} Z`} fill={ink} tongue={[101, y + 10, 6, 3.6]} />
      );
    default:
      /* the smirk: flat on the left, up on the right, with a dimple */
      return (
        <g>
          <path d={`M93 ${y} Q101 ${y + 5} 109 ${y - 3}`} {...line(ink, 2.6)} />
          <path d={`M109.5 ${y - 5.5} q1.6 2 0.4 4`} {...line(ink, 1.8)} />
        </g>
      );
  }
};

/**
 * The warmer at rest is never level and never on an even beat. It leans in, drifts up and hangs
 * there a moment, then drops a little with a squash and pops back with an overshoot — a rhythm
 * with a hold and a snap in it, not a slow breath. The shadow answers the height.
 */
export const ALIVE_IDLE: NonNullable<NonNullable<Candidate["attitude"]>["motion"]> = {
  torso: keys(
    [0, { r: 4 }],
    [0.34, { r: 6, y: -3.5 }],
    [0.5, { r: 6, y: -3.5, e: EASE.fall }],
    [0.56, { r: 2, y: 2, sx: 1.06, sy: 0.94, e: EASE.overshoot }],
    [0.64, { r: 5, y: -1.5, sx: 0.98, sy: 1.03 }],
    [0.72, { r: 4 }],
    [1, { r: 4 }],
  ),
  head: rotAt([0, -2], [0.5, 3], [0.56, -3], [0.66, 1], [1, -2]),
  shadow: keys([0, {}], [0.34, { sx: 0.9, sy: 0.9 }], [0.5, { sx: 0.9, sy: 0.9 }], [0.56, { sx: 1.04, sy: 1 }], [0.7, {}], [1, {}]),
};

/* ——— bodies ——— */

/** Snug's body: rounder and wider, a tummy under the chest; chunkier arms with bigger tips. The
 *  joints Wisp's wings and flame hang from are unchanged. */
const SNUG: Body = {
  ...WISP,
  id: "wisp-snug",
  j: {
    ...WISP.j,
    shoulderL: [81, 160],
    elbowL: [72, 177],
    wristL: [68, 193],
    shoulderR: [119, 160],
    elbowR: [128, 177],
    wristR: [132, 193],
  },
  packFit: "translate(100 150) scale(0.9 0.74) translate(-100 -150)",
  torso:
    "M80 150 Q100 144 120 150 Q131 160 129 176 Q127 192 114 198 Q100 203 86 198 Q73 192 71 176 Q69 160 80 150 Z",
  w: { ...WISP.w, upper: 11.5, fore: 11, hand: 8.4, cloth: 1.05 },
};

/** The warmer's frame: Snug's body with the stalk joints, and a head crop tall enough for the
 *  stalks above and the mouth below. */
const WARMER = withStalks(SNUG, "wisp-warmer", "26 0 148 152");

/* ——— assembling a variant ——— */

export type Parts = {
  id: string;
  label: string;
  frame?: Body;
  head: string;
  warm?: boolean;
  /** `stalks`: the jointed stalks, one standing and one flopped over, that sway and twitch. */
  antennae?: "stalks";
  ember?: boolean;
  ruff?: boolean;
  face?: Partial<FaceStyle>;
  pal?: Partial<Palette>;
  attitude: Candidate["attitude"];
  signature: string;
  pitch: string;
  risk: string;
};

export function variant(p: Parts): Candidate {
  const pal: Palette = { ...WISP_PAL, ...p.pal };
  const frame = p.frame ?? WISP;
  const Head = (c: Ctx): ReactNode => (
    <g>
      {p.antennae === "stalks" ? <Stalks {...c} frame={frame} /> : <Antennae {...c} />}
      <HeadFill id={`${c.uid}-${p.id}-head`} d={p.head} />
      {p.warm && <Warmth id={`${c.uid}-${p.id}-warm`} d={p.head} mood={c.mood} />}
    </g>
  );
  return {
    ...WISP_MAIN,
    id: p.id,
    label: p.label,
    frame,
    pal,
    face: { ...WISP_MAIN.face, ...p.face },
    attitude:
      p.antennae === "stalks" ? { ...p.attitude, motion: { ...STALK_IDLE, ...p.attitude?.motion } } : p.attitude,
    signature: p.signature,
    pitch: p.pitch,
    risk: p.risk,
    head: Head,
    belly: p.ember ? (c) => <Ember {...c} /> : undefined,
    pendant: p.ruff ? () => <Ruff /> : undefined,
    behind: (c) => (
      <g>
        <Wings />
        <Flame {...c} />
      </g>
    ),
  };
}

export const WARMER_PARTS: Parts = {
  id: "wisp-warmer",
  label: "Wisp · warmer",
  frame: WARMER,
  head: ROUND_CURL,
  warm: true,
  ember: true,
  ruff: true,
  antennae: "stalks",
  pal: { blush: WARM_BLUSH },
  face: { kit: HONEY_EYES, mouthKit: sideMouth, eyeSize: 1, eyeGap: 20, eyeY: 107, mouthY: 128 },
  attitude: {
    tilt: 6,
    hands: { L: [99, 200], R: [142, 148], outR: true },
    motion: ALIVE_IDLE,
  },
  signature: "A flame for a heart, a curl, a flopped antenna, honey eyes, a ruff",
  pitch:
    "The four together, each turned down a little so no one of them takes over: Hearth's flame in its chest and the warmth in its face; Scamp's curl, flopped antenna and lopsided smile; Moony's honey eyes and talking brows; Snug's rounder drop, ruff and chunky arms. Temperament: warm-hearted, curious and a bit cheeky — it wants to light your way and cannot help poking its nose into everything on the way. At rest: head tipped, one hand up in a hey, the other under its heart.",
  risk: "Most detail of any Wisp: check it still reads at 32px and that the turn puppet, back view and flight can carry the curl, the ruff and the heart before adopting it.",
};

export const WISP_WARM: Candidate[] = [
  variant({
    id: "wisp-hearth",
    label: "Wisp · Hearth",
    head: DROPLET,
    warm: true,
    ember: true,
    pal: { blush: WARM_BLUSH },
    attitude: {
      hands: { L: [99, 200], R: [101, 200] },
    },
    signature: "A small flame for a heart: its light is how it feels",
    pitch:
      "Warm-hearted and eager to help: it wants to light your way, and worries it is too small to. The base keeps all its warmth at its tail, as far from the face as it can be, and everything we look at is cool blue. Hearth moves the light to where feeling lives: a small flame in its chest, the same light as its tail, that breathes and brightens with the mood; and that warmth shows through its face as a peach glow behind the cheeks, fading out before the rim so the rim keeps the product's colour. Warmer cheeks catch it. At rest its hands are held together just under its heart, waiting to be useful.",
    risk: "A second light: the heart must stay small and part of the one ability — glow — so the tail's flame is still what it is known by. Covered by clothes, like any heart.",
  }),
  variant({
    id: "wisp-scamp",
    label: "Wisp · Scamp",
    frame: withStalks(WISP, "wisp-scamp", "26 0 148 152"),
    head: CURL,
    antennae: "stalks",
    face: { mouthKit: sideMouth },
    attitude: {
      tilt: 7,
      hands: { L: [80, 204], R: [142, 148], outR: true },
    },
    signature: "A curl on its head, one antenna flopped over, a lopsided smile",
    pitch:
      "Curious and a bit cheeky: it cannot leave a thing unpoked, and it is always slightly too pleased with itself. The base is perfectly symmetric and stands dead level with its arms down: a logo, not a friend. Scamp's drop has its tip swept over into a curl, like a lick of flame caught in a breeze; one antenna stands up and the other flops over in a soft curl; both sway and bend as it moves, and once in a while the flopped one boings. Its smile sits to one side with a dimple, and when it concentrates the tip of its tongue pokes out of the corner. At rest its head is tipped and one hand is up in a little hey.",
    risk: "Cheek has to stay warm, never smug at a child: the smirk is for rest, and an incorrect answer still gets the gentle face.",
  }),
  variant({
    id: "wisp-moony",
    label: "Wisp · Moony",
    head: DROPLET,
    face: { kit: HONEY_EYES, mouthKit: roundMouth, eyeSize: 1, eyeGap: 20, eyeY: 106, mouthY: 128 },
    attitude: {
      tilt: -5,
      hands: { L: [58, 200], R: [142, 200] },
    },
    signature: "Big honey eyes and brows that talk: every feeling on its face",
    pitch:
      "Wears every feeling on its face, and cannot keep a secret. The base's eyes are small, dark and cool for the size of its head, and its brows are faint strokes of blue, so the face barely changes between moods. Moony's eyes are big and round with warm honey irises — the only warm thing a child looks into — and its brows are thick soft ink that lift, knit and tip on their own. Its mouth is bigger and at rest is just open, always about to say something. At rest its arms are a little out from its sides, as if it is about to tell you something.",
    risk: "Big eyes with a warm iris must never read as glowing eyes; the iris is honey, not the glow's yellow.",
  }),
  variant({
    id: "wisp-snug",
    label: "Wisp · Snug",
    frame: SNUG,
    head: ROUND,
    ruff: true,
    attitude: {
      mood: "happy",
      tilt: 5,
      hands: { L: [98, 196], R: [102, 196] },
    },
    signature: "A rounder drop, a ruff of fuzz, a tummy: something to hug",
    pitch:
      "Cosy and patient: the night-light that stays up with you, a bit of a homebody. The base is built of hard shapes — a pointed drop on a thin stalk of a neck, a narrow body, stick arms — and nothing about it asks to be hugged. Snug's drop is shorter and fuller in the cheek, a ruff of fuzz (a real firefly's) hides the neck, its body is rounder with a tummy, and its arms are chunkier with bigger soft tips. At rest it is content: eyes closed in a smile, hands folded on its tummy.",
    risk: "Softer and rounder moves it toward Fuzzy and Chonk (reference); the wings, the flame and the drop must still say Wisp at 32px.",
  }),
  variant(WARMER_PARTS),
];

/**
 * Wisp, warmer in each eye style (`wisp-eyes.tsx`), for choosing its eyes. Everything but the
 * eyes is the warmer as drawn.
 */
export const WISP_EYES: Candidate[] = EYE_STYLES.map((e) =>
  variant({
    ...WARMER_PARTS,
    id: `wisp-warmer-eyes-${e.id}`,
    label: `Warmer · ${e.label} eyes`,
    face: { ...WARMER_PARTS.face, kit: e.kit },
    pitch: e.note,
  }),
);
