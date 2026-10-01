import type { ReactNode } from "react";

import type { FaceStyle, Mood } from "./rig/face";
import type { Hands, Motion } from "./rig/motion";
import type { HairId } from "./rig/hair";
import type { OutfitId } from "./rig/outfit";
import { WHITE, type Palette } from "./rig/palette";
import type { PropId } from "./rig/props";
import { pivot, type Body } from "./rig/skeleton";

/**
 * A character on the shared rig, and the bench's original firefly, kept as reference. The side
 * characters are the club in `observatory.tsx`.
 */
/** `mood` lets a signature react to the expression — an antenna that droops when worried. */
export type Ctx = { pal: Palette; uid: string; mood?: Mood };

export type Candidate = {
  id: string;
  kind: "animal" | "human";
  /** The body it stands on; chibi when absent. */
  frame?: Body;
  /** `false` for a character that floats: no legs are drawn. */
  legs?: false;
  /** `false` for a character whose shape carries its own arms (a star's points). */
  arms?: false;
  /** Where its spark trail comes from, in figure space: the sparks it leaves behind as it flies. */
  trail?: readonly [number, number];
  /** `false`: the body, limbs, hands and neck are drawn with no outline, told apart by colour.
   *  Clothes keep their detail lines. */
  outline?: false;
  /** `mitten`: a rounded hand with a thumb on the inside. `wisp`: the forearm tapers like a
   *  tendril and ends in a soft round tip of the same colour. `tong`: a chameleon's two fat toes in a
   *  V, on the hands and the feet. Default: a ball. */
  hands?: "mitten" | "wisp" | "tong";
  label: string;
  signature: string;
  pitch: string;
  risk: string;
  pal: Palette;
  /** Torso colour when bare. */
  body: string;
  face: FaceStyle;
  hair?: HairId;
  outfit: OutfitId;
  outfits: OutfitId[];
  props?: PropId[];
  /** Who it is at rest: the expression it wears when nothing is happening, the way it holds its
   *  head, and how it stands. A character is never neutral. */
  attitude?: {
    mood?: Mood;
    tilt?: number;
    hands?: Hands;
    /** Its own habits at rest, laid over the idle pose on the same clock: an antenna that
     *  twitches, a flame that flicks. */
    motion?: Motion["tracks"];
  };
  /** Behind the head, riding its joint: long hair, a bun. */
  headBack?: (c: Ctx) => ReactNode;
  /** Behind the torso: a tail, wings. */
  behind?: (c: Ctx) => ReactNode;
  /** The head's base shape, ears and markings — before the face. */
  head: (c: Ctx) => ReactNode;
  /** After the face and hair: the signature, a nose and whiskers. */
  top?: (c: Ctx) => ReactNode;
  /** On the torso under any outfit: a belly patch. */
  belly?: (c: Ctx) => ReactNode;
  /** On the torso over any outfit: a pendant. */
  pendant?: (c: Ctx) => ReactNode;
};

const INK = "#2a1d22";
const CREAM = "#fff3de";
const MAGENTA = "#d93f8e";

const ANIMAL_OUTFITS: OutfitId[] = ["bare", "dungarees", "hoodie", "raincoat", "winter", "party"];

/* ——— Firefly ——— */

const FLY_NAVY = "#34377a";
const palFly: Palette = {
  ink: INK,
  skin: "#f6e6cc",
  skinShade: "#d8bf9c",
  limb: FLY_NAVY,
  paw: "#262861",
  hair: FLY_NAVY,
  hairHi: "#5a5ea8",
  eye: "#6d4fc2",
  blush: "#f28fa6",
  top: MAGENTA,
  topAlt: CREAM,
  bottom: FLY_NAVY,
  shoe: MAGENTA,
  accent: MAGENTA,
  glow: "#ffe25a",
};

function FlyHead({ pal }: Ctx) {
  return (
    <g>
      <ellipse cx={100} cy={98} rx={44} ry={40} fill={FLY_NAVY} />
      <path
        d="M60 106 C60 82 78 72 100 72 C122 72 140 82 140 106 C140 128 122 138 100 138 C78 138 60 128 60 106 Z"
        fill={pal.skin}
      />
      <ellipse cx={100} cy={98} rx={44} ry={40} fill="none" stroke={pal.ink} strokeWidth={2.5} />
      <path
        d="M78 64 Q90 58 104 60"
        stroke="#5a5ea8"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function FlyAntennae({ pal }: Ctx) {
  return (
    <g>
      {(
        [
          ["antL", "M88 62 C84 44 74 32 64 28", 63],
          ["antR", "M112 62 C116 44 126 32 136 28", 137],
        ] as const
      ).map(([j, d, x]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <path d={d} stroke={pal.ink} strokeWidth={3.2} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={26} r={10} fill={pal.glow} opacity={0.35} />
          <circle cx={x} cy={26} r={6} fill={pal.glow} stroke={pal.ink} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
}

function FlyBehind({ pal }: Ctx) {
  return (
    <g>
      {(
        [
          ["wingL", 70, -35],
          ["wingR", 130, 35],
        ] as const
      ).map(([j, x, a]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <ellipse
            cx={x}
            cy={160}
            rx={18}
            ry={32}
            fill="#dcecff"
            fillOpacity={0.8}
            stroke={pal.ink}
            strokeWidth={2.2}
            transform={`rotate(${a} ${x} 160)`}
          />
          <path
            d={`M${j === "wingL" ? 88 : 112} 168 L${x} 152`}
            stroke={pal.ink}
            strokeOpacity={0.3}
            strokeWidth={1.6}
          />
        </g>
      ))}
      <g data-joint="tail" style={pivot("tail")}>
        <circle data-joint="glow" cx={130} cy={226} r={32} fill={pal.glow} opacity={0.35} />
        <ellipse
          cx={128}
          cy={224}
          rx={20}
          ry={17}
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={2.5}
          transform="rotate(28 128 224)"
        />
        <path
          d="M112 212 Q122 204 134 208"
          stroke={FLY_NAVY}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <path d="M122 222 l1.4 -3 l1.4 3 l3 1.4 l-3 1.4 l-1.4 3 l-1.4 -3 l-3 -1.4 Z" fill={WHITE} />
      </g>
    </g>
  );
}

export const CANDIDATES: Candidate[] = [
  {
    id: "firefly",
    kind: "animal",
    label: "Firefly (bench original)",
    signature: "A tail that glows — it literally sparkles",
    pitch:
      "The most on-brand: Sparkles' guide is a small light. The glow is a built-in stage cue — it can brighten on an unlock, dim when sleepy — and fireflies are almost untouched as a mascot. Round, soft face, big eyes, flutter wings.",
    risk: "Insects are less huggable than mammals, and some children dislike bugs; its humanoid limbs are an invention.",
    pal: palFly,
    body: FLY_NAVY,
    face: {
      eyes: "anime",
      eyeY: 104,
      eyeGap: 17,
      mouthY: 123,
      nose: "none",
      brows: true,
      lid: palFly.skin,
    },
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: (c) => <FlyBehind {...c} />,
    head: (c) => <FlyHead {...c} />,
    top: (c) => <FlyAntennae {...c} />,
    belly: ({ pal }) => (
      <path
        d="M80 176 Q100 180 120 176 M79 192 Q100 196 121 192"
        stroke={pal.glow}
        strokeOpacity={0.7}
        strokeWidth={3}
        fill="none"
      />
    ),
  },
];
