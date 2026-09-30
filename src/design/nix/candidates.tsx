import type { ReactNode } from "react";

import type { FaceStyle, Mood } from "./rig/face";
import type { HairId } from "./rig/hair";
import type { OutfitId } from "./rig/outfit";
import { WHITE, type Palette } from "./rig/palette";
import type { PropId } from "./rig/props";
import { pivot, type Body } from "./rig/skeleton";

/**
 * The animal candidates from Sparkles' /design/nix bench: otter, red panda, firefly, chameleon.
 * One rig, one expression set, one wardrobe kit. Each carries the signature its species gives it.
 */
/** `mood` lets a signature react to the expression — an antenna that droops when worried. */
export type Ctx = { pal: Palette; uid: string; mood?: Mood };

export type Candidate = {
  id: string;
  kind: "animal";
  /** The body it stands on; chibi when absent. */
  frame?: Body;
  /** `false` for a character that floats: no legs are drawn. */
  legs?: false;
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
const GLOW = "#ffd34d";
const MAGENTA = "#d93f8e";
const PLUM = "#7c5cc4";
const TEAL = "#2aa3a0";
const CHARCOAL = "#3b3752";

const ANIMAL_OUTFITS: OutfitId[] = ["bare", "dungarees", "hoodie", "raincoat", "winter", "party"];

/* ——— Otter ——— */

const OTTER_CREAM = "#f1dfc6";
const palOtter: Palette = {
  ink: INK,
  skin: "#8a5a3b",
  skinShade: "#6d4429",
  limb: "#8a5a3b",
  paw: "#5b3a26",
  hair: "#4d301f",
  hairHi: "#a87452",
  eye: INK,
  blush: "#e58a7a",
  top: "#e0609b",
  topAlt: CREAM,
  bottom: "#4a3f6b",
  shoe: "#4a3f6b",
  accent: PLUM,
  glow: GLOW,
};

function OtterHead({ pal }: Ctx) {
  return (
    <g>
      {(
        [
          ["earL", 62],
          ["earR", 138],
        ] as const
      ).map(([j, x]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <circle cx={x} cy={70} r={10} fill={pal.skin} stroke={pal.ink} strokeWidth={2.4} />
          <circle cx={x} cy={71} r={5} fill={pal.paw} />
        </g>
      ))}
      <path
        d="M92 62 Q95 48 100 60 Q104 46 109 62 Z"
        fill={pal.skin}
        stroke={pal.ink}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <ellipse cx={100} cy={100} rx={46} ry={40} fill={pal.skin} />
      <path
        d="M64 114 C64 100 82 96 100 100 C118 96 136 100 136 114 C136 132 120 140 100 140 C80 140 64 132 64 114 Z"
        fill={OTTER_CREAM}
      />
      <ellipse cx={100} cy={100} rx={46} ry={40} fill="none" stroke={pal.ink} strokeWidth={2.5} />
    </g>
  );
}

function OtterNose({ pal }: Ctx) {
  return (
    <g>
      <path d="M90 106 Q100 101 110 106 Q108 115 100 116 Q92 115 90 106 Z" fill={pal.ink} />
      <ellipse cx={96} cy={106} rx={3} ry={1.6} fill={WHITE} opacity={0.6} />
      <g stroke={pal.ink} strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
        <path d="M78 116 L58 112 M78 121 L58 124 M122 116 L142 112 M122 121 L142 124" />
      </g>
      <g fill={pal.skinShade}>
        {[
          [82, 114],
          [86, 119],
          [118, 114],
          [114, 119],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={1.3} />
        ))}
      </g>
    </g>
  );
}

function Pebble({ pal }: Ctx) {
  return (
    <g>
      <path d="M88 152 Q100 172 112 152" stroke={pal.ink} strokeWidth={1.8} fill="none" />
      <circle data-joint="glow" cx={100} cy={170} r={11} fill={pal.glow} opacity={0.45} />
      <ellipse cx={100} cy={170} rx={7} ry={5.8} fill={pal.glow} stroke={pal.ink} strokeWidth={2} />
      <path d="M97 168 l1 -2.4 l1 2.4 l2.4 1 l-2.4 1 l-1 2.4 l-1 -2.4 l-2.4 -1 Z" fill={WHITE} />
    </g>
  );
}

/* ——— Red panda ——— */

const PANDA_CREAM = "#f7e7d3";
const palPanda: Palette = {
  ink: INK,
  skin: "#c25a2c",
  skinShade: "#8e3a18",
  limb: "#3a2419",
  paw: "#2a1a12",
  hair: "#8e3a18",
  hairHi: "#e08050",
  eye: INK,
  blush: "#f39a8a",
  top: PLUM,
  topAlt: CREAM,
  bottom: CHARCOAL,
  shoe: MAGENTA,
  accent: TEAL,
  glow: GLOW,
};

const PANDA_EAR = "M52 84 C42 60 50 40 66 36 C80 46 84 62 78 74 Z";
const PANDA_EAR_IN = "M59 76 C55 62 59 50 66 46 C73 54 75 64 72 72 Z";

function PandaHead({ pal }: Ctx) {
  return (
    <g>
      {(["earL", "earR"] as const).map((j) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <g transform={j === "earR" ? "translate(200 0) scale(-1 1)" : undefined}>
            <path
              d={PANDA_EAR}
              fill={pal.skin}
              stroke={pal.ink}
              strokeWidth={2.4}
              strokeLinejoin="round"
            />
            <path d={PANDA_EAR_IN} fill={PANDA_CREAM} />
          </g>
        </g>
      ))}
      <path
        d="M56 96 C56 64 76 54 100 54 C124 54 144 64 144 96 L154 106 L144 111 L152 121 L139 124 C130 136 116 140 100 140 C84 140 70 136 61 124 L48 121 L56 111 L46 106 Z"
        fill={pal.skin}
        stroke={pal.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M50 112 L58 110 L52 120 L62 122 C66 128 72 132 78 134 C70 122 70 110 64 104 Z"
        fill={PANDA_CREAM}
      />
      <path
        d="M150 112 L142 110 L148 120 L138 122 C134 128 128 132 122 134 C130 122 130 110 136 104 Z"
        fill={PANDA_CREAM}
      />
      <ellipse cx={82} cy={82} rx={8.5} ry={5} fill={PANDA_CREAM} />
      <ellipse cx={118} cy={82} rx={8.5} ry={5} fill={PANDA_CREAM} />
      <path
        d="M76 114 C78 102 90 100 100 104 C110 100 122 102 124 114 C124 128 112 136 100 136 C88 136 76 128 76 114 Z"
        fill={PANDA_CREAM}
      />
      <path
        d="M81 104 Q78 116 83 128 M119 104 Q122 116 117 128"
        stroke={pal.skinShade}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function PandaNose({ pal }: Ctx) {
  return <path d="M94 108 Q100 105 106 108 Q104 114 100 114 Q96 114 94 108 Z" fill={pal.ink} />;
}

function PandaTail({ pal, uid }: Ctx) {
  const d =
    "M100 206 C130 224 174 208 178 168 C180 142 164 124 146 128 C138 132 140 140 148 146 C160 168 148 190 110 192 Z";
  const id = `${uid}-tail`;
  return (
    <g data-joint="tail" style={pivot("tail")}>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={pal.skin} />
      <g clipPath={`url(#${id})`} stroke="#ecb48a" strokeWidth={8}>
        <path d="M122 226 L134 186 M146 222 L152 184 M178 200 L154 180 M186 172 L156 166 M180 144 L152 152" />
      </g>
      <path d={d} fill="none" stroke={pal.ink} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
}

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

/* ——— Chameleon ——— */

const CHAM_BELLY = "#cbc1f6";
const palCham: Palette = {
  ink: INK,
  skin: "#8b78d8",
  skinShade: "#6a58b8",
  limb: "#8b78d8",
  paw: "#6a58b8",
  hair: "#6a58b8",
  hairHi: "#b2a5ee",
  eye: INK,
  blush: "#f59fbf",
  top: TEAL,
  topAlt: CREAM,
  bottom: "#34304d",
  shoe: "#34304d",
  accent: MAGENTA,
  glow: GLOW,
};

function ChamHead({ pal }: Ctx) {
  return (
    <g>
      <path
        d="M66 76 C66 44 98 26 128 34 C122 48 130 62 138 76 Z"
        fill={pal.skin}
        stroke={pal.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M84 50 L92 70 M100 40 L106 68 M116 38 L120 66"
        stroke={pal.skinShade}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <ellipse
        cx={100}
        cy={104}
        rx={46}
        ry={37}
        fill={pal.skin}
        stroke={pal.ink}
        strokeWidth={2.5}
      />
      <path d="M62 116 C74 136 126 136 138 116 C128 130 72 130 62 116 Z" fill={CHAM_BELLY} />
      {[78, 122].map((x) => (
        <g key={x}>
          <circle cx={x} cy={98} r={15} fill={pal.skin} stroke={pal.ink} strokeWidth={2.4} />
          <circle cx={x} cy={98} r={11.5} fill="none" stroke={pal.skinShade} strokeWidth={2} />
        </g>
      ))}
      {[
        [66, 120],
        [134, 120],
        [100, 76],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill={pal.skinShade} />
      ))}
    </g>
  );
}

function ChamTail({ pal }: Ctx) {
  const d = "M106 204 C138 210 164 232 154 256 C146 272 120 266 124 250 C127 239 142 240 142 250";
  return (
    <g data-joint="tail" style={pivot("tail")}>
      <path d={d} stroke={pal.ink} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={d} stroke={pal.skin} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path
        d="M130 212 l4 6 M146 226 l6 3 M156 244 l6 0"
        stroke={pal.skinShade}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </g>
  );
}

export const CANDIDATES: Candidate[] = [
  {
    id: "otter",
    kind: "animal",
    label: "Otter",
    signature: "A glowing pebble worn round the neck — the spark it keeps",
    pitch:
      "Sea otters keep a favourite stone and carry it everywhere; this one's stone glows. Hands that hold things, playful by nature, and almost unused in education. Clothes sit on it naturally.",
    risk: "Brown-on-brown is the weakest silhouette of the four until the tail is visible; it leans on the pebble and the whiskers to be told from a generic bear or mouse.",
    pal: palOtter,
    body: palOtter.skin,
    face: {
      eyes: "bead",
      eyeY: 94,
      eyeGap: 18,
      mouthY: 123,
      nose: "none",
      brows: false,
      lid: palOtter.skin,
    },
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: ({ pal }) => (
      <g data-joint="tail" style={pivot("tail")}>
        <path
          d="M104 200 C126 206 150 228 162 266 C152 268 132 240 108 216 Z"
          fill={pal.skin}
          stroke={pal.ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </g>
    ),
    head: (c) => <OtterHead {...c} />,
    top: (c) => <OtterNose {...c} />,
    belly: () => <ellipse cx={100} cy={188} rx={15} ry={22} fill={OTTER_CREAM} />,
    pendant: (c) => <Pebble {...c} />,
  },
  {
    id: "panda",
    kind: "animal",
    label: "Red panda",
    signature: "A huge ringed tail, tear-mark cheeks and dark legs",
    pitch:
      "The strongest silhouette of the animals: the tail alone identifies it at 48px, and the white face markings make every expression read. Universally cute across ages, and the dark legs make any outfit pop.",
    risk: "Its rust fur sits between the destructive and warning hues; as a large field it may read as a status (§9.4.3). A Firefox and Turning Red association exists.",
    pal: palPanda,
    body: palPanda.skin,
    face: {
      eyes: "bead",
      eyeY: 98,
      eyeGap: 17,
      mouthY: 122,
      nose: "none",
      brows: false,
      lid: palPanda.skin,
    },
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: (c) => <PandaTail {...c} />,
    head: (c) => <PandaHead {...c} />,
    top: (c) => <PandaNose {...c} />,
    belly: ({ pal }) => (
      <path d="M84 150 Q100 146 116 150 L118 168 Q100 172 82 168 Z" fill={pal.limb} opacity={0.5} />
    ),
  },
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
  {
    id: "chameleon",
    kind: "animal",
    label: "Chameleon",
    signature: "Turret eyes and a curled spiral tail",
    pitch:
      "The funniest face on the bench — turret eyes that swivel independently are a gag in every expression. A chameleon changes to fit where it is, which is the wardrobe idea made into a character. Violet by default.",
    risk: "Confirmed side character. Colour change is its ability and is semantic on purpose — green for correct, a gentle hue for not yet — always paired with words or a status mark (docs/cast.md). A reptile is less huggable, like the firefly.",
    pal: palCham,
    body: palCham.skin,
    face: {
      eyes: "bead",
      eyeY: 98,
      eyeGap: 22,
      mouthY: 123,
      nose: "none",
      brows: false,
      lid: palCham.skin,
    },
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: (c) => <ChamTail {...c} />,
    head: (c) => <ChamHead {...c} />,
    belly: () => <path d="M92 156 L108 156 L110 214 L90 214 Z" fill={CHAM_BELLY} />,
  },
];
