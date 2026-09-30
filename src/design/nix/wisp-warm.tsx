import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright } from "./firefly-variants";
import { DROPLET, Flame, HAIR, pal as WISP_PAL, WISP, WISP_MAIN, Wings } from "./firefly-wisp";
import {
  arcUp,
  chevron,
  EYE_WHITE,
  line,
  OpenMouth,
  Orb,
  turnAt,
  type EyeKit,
  type MouthKit,
} from "./rig/eyes";
import type { FaceStyle } from "./rig/face";
import type { Palette } from "./rig/palette";
import type { Body } from "./rig/skeleton";
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
/** Warm eyes: honey irises instead of the base's cool dark ones. */
const HONEY = "#b86f1c";
const HONEY_LIGHT = "#e3a24a";

const sides = [
  ["L", -1],
  ["R", 1],
] as const;

/* ——— heads ——— */

/** The base drop with its tip swept over to one side in a curl, like a lick of flame. */
const CURL =
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
 * One straight antenna and one that has been bent — a kink halfway up, the tip flopped over.
 * The imperfection that makes it someone rather than a logo.
 */
function OddAntennae({ mood, base = 58 }: Ctx & { base?: number }) {
  return (
    <g>
      <Antenna side="L" base={[97, base]} mood={mood}>
        <path
          d={`M97 ${base} C93 46 82 46 78 38 C76 34 77 31 79 30`}
          stroke={C.thin}
          strokeWidth={2.8}
          fill="none"
          strokeLinecap="round"
        />
        {tip(79, 30, mood)}
      </Antenna>
      <Antenna side="R" base={[103, base]} mood={mood}>
        <path
          d={`M103 ${base} C106 50 110 46 114 42 L120 40 C126 38 131 40 134 45`}
          stroke={C.thin}
          strokeWidth={2.8}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {tip(134, 46, mood)}
      </Antenna>
    </g>
  );
}

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

/* ——— a face: Moony's eyes ——— */

/**
 * Big, dark, round eyes with honey irises — warm where the base's are cool — set wide and low.
 * Thick soft brows that do half the talking.
 */
const honeyEye: EyeKit = ({ mood, s, x, y, look, pal, id }) => {
  const ink = pal.ink;
  const [dx, dy] = look;
  const brow = (tilt: number, lift = 0) => (
    <path
      d={`M${x - 8} ${y - 15 - lift} Q${x} ${y - 20 - lift} ${x + 8} ${y - 15 - lift}`}
      transform={turnAt(s, tilt, x, y - 16 - lift)}
      {...line(ink, 3.2)}
    />
  );
  const closed = (d: string) => <path d={d} {...line(ink, 3.4)} />;
  if (mood === "happy") return <>{closed(arcUp(x, y + 1, 8.5, 5))}{brow(0, 3)}</>;
  if (mood === "oops") return <>{closed(chevron(x, y, s, 6.5, 6))}{brow(16)}</>;
  if (mood === "wink" && s === 1) return <>{closed(arcUp(x, y + 1, 8.5, 5))}{brow(0, 3)}</>;
  const big = mood === "delighted" ? 1.08 : 1;
  const rx = 9.6 * big;
  const ry = 11.4 * big;
  const lid =
    mood === "focused"
      ? { top: 0.42, color: C.soft }
      : mood === "worried"
        ? { top: 0.12, tilt: 14, color: C.soft }
        : undefined;
  const browFor =
    mood === "worried"
      ? brow(18)
      : mood === "focused"
        ? brow(-14, -2)
        : mood === "thinking"
          ? brow(s === -1 ? 0 : -6, s === -1 ? 4 : 0)
          : mood === "curious"
            ? brow(s === 1 ? 0 : 4, s === 1 ? 5 : 1)
            : brow(0, mood === "delighted" ? 4 : 1);
  return (
    <g>
      <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={ink} lid={lid} edge={{ color: ink, width: 1.2 }}>
        <ellipse cx={x + dx} cy={y + 2.6 + dy} rx={rx - 2.6} ry={ry - 3.6} fill={HONEY} />
        <ellipse cx={x + dx} cy={y + 5 + dy} rx={rx - 4.4} ry={ry - 7} fill={HONEY_LIGHT} opacity={0.7} />
        <circle cx={x + dx} cy={y + 2.6 + dy} r={3.4} fill={ink} />
        <circle cx={x - 3 + dx} cy={y - 4 + dy} r={3.2 * big} fill={EYE_WHITE} />
        <circle cx={x + 3.4 + dx} cy={y + 4.4 + dy} r={1.4} fill={EYE_WHITE} />
        {mood === "delighted" && (
          <path
            d={`M${x + 3.5} ${y - 7} l1 2.4 l2.4 1 l-2.4 1 l-1 2.4 l-1 -2.4 l-2.4 -1 l2.4 -1 Z`}
            fill={EYE_WHITE}
          />
        )}
      </Orb>
      {browFor}
    </g>
  );
};

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

/* ——— assembling a variant ——— */

type Parts = {
  id: string;
  label: string;
  frame?: Body;
  head: string;
  warm?: boolean;
  antennae?: "odd";
  ember?: boolean;
  ruff?: boolean;
  face?: Partial<FaceStyle>;
  pal?: Partial<Palette>;
  attitude: Candidate["attitude"];
  signature: string;
  pitch: string;
  risk: string;
};

function variant(p: Parts): Candidate {
  const pal: Palette = { ...WISP_PAL, ...p.pal };
  const Head = (c: Ctx): ReactNode => (
    <g>
      {p.antennae === "odd" ? <OddAntennae {...c} /> : <Antennae {...c} />}
      <HeadFill id={`${c.uid}-${p.id}-head`} d={p.head} />
      {p.warm && <Warmth id={`${c.uid}-${p.id}-warm`} d={p.head} mood={c.mood} />}
    </g>
  );
  return {
    ...WISP_MAIN,
    id: p.id,
    label: p.label,
    frame: p.frame ?? WISP,
    pal,
    face: { ...WISP_MAIN.face, ...p.face },
    attitude: p.attitude,
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
    head: CURL,
    antennae: "odd",
    face: { mouthKit: sideMouth },
    attitude: {
      tilt: 7,
      hands: { L: [80, 204], R: [142, 148], outR: true },
    },
    signature: "A curl on its head, one bent antenna, a lopsided smile",
    pitch:
      "Curious and a bit cheeky: it cannot leave a thing unpoked, and it is always slightly too pleased with itself. The base is perfectly symmetric and stands dead level with its arms down: a logo, not a friend. Scamp's drop has its tip swept over into a curl, like a lick of flame caught in a breeze; one antenna is straight and the other has a kink halfway up, bent in some adventure. Its smile sits to one side with a dimple, and when it concentrates the tip of its tongue pokes out of the corner. At rest its head is tipped and one hand is up in a little hey.",
    risk: "Cheek has to stay warm, never smug at a child: the smirk is for rest, and an incorrect answer still gets the gentle face.",
  }),
  variant({
    id: "wisp-moony",
    label: "Wisp · Moony",
    head: DROPLET,
    face: { kit: honeyEye, mouthKit: roundMouth, eyeSize: 1, eyeGap: 20, eyeY: 106, mouthY: 128 },
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
  variant({
    id: "wisp-warmer",
    label: "Wisp · warmer",
    frame: SNUG,
    head: ROUND_CURL,
    warm: true,
    ember: true,
    ruff: true,
    antennae: "odd",
    pal: { blush: WARM_BLUSH },
    face: { kit: honeyEye, mouthKit: sideMouth, eyeSize: 1, eyeGap: 20, eyeY: 107, mouthY: 128 },
    attitude: {
      tilt: 6,
      hands: { L: [99, 200], R: [142, 148], outR: true },
    },
    signature: "A flame for a heart, a curl, a bent antenna, honey eyes, a ruff",
    pitch:
      "The four together, each turned down a little so no one of them takes over: Hearth's flame in its chest and the warmth in its face; Scamp's curl, bent antenna and lopsided smile; Moony's honey eyes and talking brows; Snug's rounder drop, ruff and chunky arms. Temperament: warm-hearted, curious and a bit cheeky — it wants to light your way and cannot help poking its nose into everything on the way. At rest: head tipped, one hand up in a hey, the other under its heart.",
    risk: "Most detail of any Wisp: check it still reads at 32px and that the turn puppet, back view and flight can carry the curl, the ruff and the heart before adopting it.",
  }),
];
