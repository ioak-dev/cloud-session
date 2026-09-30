import type { ReactNode } from "react";

import { arcUp, chevron, line, OpenMouth, Orb, TONGUE_PINK, type EyeKit, type MouthKit } from "./rig/eyes";
import type { FaceStyle, Mood } from "./rig/face";
import type { Hands, Motion } from "./rig/motion";
import type { HairId } from "./rig/hair";
import type { OutfitId } from "./rig/outfit";
import { WHITE, type Palette } from "./rig/palette";
import type { PropId } from "./rig/props";
import { CHIBI, pivot, type Body } from "./rig/skeleton";

/**
 * The animal candidates from Sparkles' /design/nix bench: otter, red panda, firefly, chameleon.
 * One rig, one expression set, one wardrobe kit. Each carries the signature its species gives it.
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
const GLOW = "#ffd34d";
const MAGENTA = "#d93f8e";
const PLUM = "#7c5cc4";
const TEAL = "#2aa3a0";
const CHARCOAL = "#3b3752";

/** Chunkier limbs and hands for the side candidates: rounder, softer, more huggable. */
const CHUNKY = { upper: 13.5, fore: 12.5, thigh: 15, shin: 14, hand: 8.6, cloth: 1.15 };

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
  line: "none",
};

const PANDA_EAR = "M52 84 C42 60 50 40 66 36 C80 46 84 62 78 74 Z";
const PANDA_EAR_IN = "M59 76 C55 62 59 50 66 46 C73 54 75 64 72 72 Z";

function PandaHead({ pal }: Ctx) {
  const HEAD =
    "M56 96 C56 64 76 54 100 54 C124 54 144 64 144 96 L154 106 L144 111 L152 121 L139 124 C130 136 116 140 100 140 C84 140 70 136 61 124 L48 121 L56 111 L46 106 Z";
  return (
    <g>
      {(["earL", "earR"] as const).map((j) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <g transform={j === "earR" ? "translate(200 0) scale(-1 1)" : undefined}>
            <path d={PANDA_EAR} fill={pal.skinShade} />
            <path d={PANDA_EAR} fill={pal.skin} transform="translate(1.5 1.5) scale(0.97)" />
            <path d={PANDA_EAR_IN} fill={PANDA_CREAM} />
            {/* the fluff that fills a red panda's ear */}
            <path d="M62 72 l2 -8 M66 72 l3 -9 M70 72 l2 -6" stroke="#ffffff" strokeWidth={1.6} strokeLinecap="round" />
          </g>
        </g>
      ))}
      <path d={HEAD} fill={pal.skinShade} />
      <path d={HEAD} fill={pal.skin} transform="translate(-2 -2.5) scale(0.99)" />
      {/* the darker mask round the eyes */}
      <ellipse cx={82} cy={100} rx={13} ry={11} fill="#a8481f" />
      <ellipse cx={118} cy={100} rx={13} ry={11} fill="#a8481f" />
      <path d="M50 112 L58 110 L52 120 L62 122 C66 128 72 132 78 134 C70 122 70 110 64 104 Z" fill={PANDA_CREAM} />
      <path d="M150 112 L142 110 L148 120 L138 122 C134 128 128 132 122 134 C130 122 130 110 136 104 Z" fill={PANDA_CREAM} />
      <path d="M76 114 C78 102 90 100 100 104 C110 100 122 102 124 114 C124 128 112 136 100 136 C88 136 76 128 76 114 Z" fill={PANDA_CREAM} />
      <path d="M81 108 Q78 118 83 128 M119 108 Q122 118 117 128" stroke={pal.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* whisker dots on the muzzle */}
      {[
        [88, 120],
        [85, 125],
        [112, 120],
        [115, 125],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.2} fill="#d9c2aa" />
      ))}
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
      <g clipPath={`url(#${id})`}>
        <g stroke="#ecb48a" strokeWidth={8}>
          <path d="M122 226 L134 186 M146 222 L152 184 M178 200 L154 180 M186 172 L156 166 M180 144 L152 152" />
        </g>
        {/* its own shade along the underside, and a dark tip */}
        <path d="M100 206 C130 224 174 208 178 168 C170 196 140 212 104 200 Z" fill={pal.skinShade} opacity={0.55} />
        <ellipse cx={150} cy={134} rx={12} ry={10} fill="#5a2a14" />
      </g>
    </g>
  );
}

/** Red panda: dark, round, glossy eyes with a warm brown rim, and its cream brow marks, which lift,
 *  tilt and knit — the marks are its brows. Startled, the eyes go wide and the marks shoot up. */
const PANDA_EYE = "#241510";
const pandaEyes: EyeKit = ({ mood, s, x, y, look, id, pal }) => {
  const [dx, dy] = look;
  const mark = (raise: number, tilt: number) => (
    <ellipse
      cx={x}
      cy={y - 16 - raise}
      rx={8}
      ry={4.6}
      fill={PANDA_CREAM}
      transform={`rotate(${s * tilt} ${x} ${y - 16 - raise})`}
    />
  );
  const open = (k = 1, top = 0, tilt = 0, extra = false) => (
    <Orb id={id} x={x} y={y} rx={6.8 * k} ry={7.4 * k} s={s} fill={PANDA_EYE} lid={{ top, tilt, color: "#a8481f" }}>
      <circle cx={x + dx} cy={y + dy} r={5.2 * k} fill="#6a3a22" />
      <circle cx={x + dx} cy={y + dy} r={3.4 * k} fill={PANDA_EYE} />
      <circle cx={x - 2.4 + dx} cy={y - 2.6 + dy} r={2.4 * k} fill={WHITE} />
      <circle cx={x + 2.4 + dx} cy={y + 2.6 + dy} r={1} fill={WHITE} />
      {extra && <circle cx={x + 2.6 + dx} cy={y - 2.8 + dy} r={1.2} fill={WHITE} />}
    </Orb>
  );
  const g = (a: ReactNode, b: ReactNode) => (
    <g>
      {b}
      {a}
    </g>
  );
  const shut = (d: string) => <path d={d} {...line(PANDA_EYE, 3.2)} />;
  switch (mood) {
    case "happy":
      return g(shut(arcUp(x, y, 6.5, 4.4)), mark(3, 0));
    case "delighted":
      return g(open(1.2, 0, 0, true), mark(8, 0));
    case "curious":
      return g(open(1.1), mark(s === 1 ? 7 : 0, s === 1 ? -10 : 4));
    case "thinking":
      return g(open(1, 0.34), mark(s === -1 ? 5 : -1, s === -1 ? 10 : -6));
    case "focused":
      return g(open(1, 0.44, -8), mark(-2, -14));
    case "worried":
      return g(open(1.04, 0.1, 14, true), mark(3, 18));
    case "oops":
      return g(shut(chevron(x, y, s, 5, 5)), mark(4, 14));
    case "wink":
      return s === 1 ? g(shut(arcUp(x, y, 6.5, 4.4)), mark(1, 0)) : g(open(), mark(3, 0));
    default:
      return g(open(), mark(0, 0));
  }
};

/** Red panda: a split lip under its dark nose; it opens pink, and gapes when it rears up. */
const pandaMouth: MouthKit = ({ mood, y, pal }) => {
  const ink = pal.ink;
  const lip = (d = 3.4, tilt = 0) => (
    <g>
      <path d={`M100 ${y - 8} L100 ${y}`} {...line(ink, 2)} />
      <path d={`M93 ${y + tilt} Q96.5 ${y + d + tilt} 100 ${y} Q103.5 ${y + d - tilt} 107 ${y - tilt}`} {...line(ink, 2.2)} />
    </g>
  );
  switch (mood) {
    case "happy":
      return <g><path d={`M100 ${y - 8} L100 ${y - 2}`} {...line(ink, 2)} /><OpenMouth d={`M92 ${y - 2} Q100 ${y + 12} 108 ${y - 2} Z`} fill="#4a1e1a" tongue={[100, y + 6, 4, 2.6]} /></g>;
    case "delighted":
      return <g><path d={`M100 ${y - 8} L100 ${y - 3}`} {...line(ink, 2)} /><OpenMouth d={`M90 ${y - 3} Q100 ${y + 16} 110 ${y - 3} Z`} fill="#4a1e1a" tongue={[100, y + 8, 5, 3.2]} /></g>;
    case "curious":
      return <g><path d={`M100 ${y - 8} L100 ${y - 3}`} {...line(ink, 2)} /><ellipse cx={100} cy={y + 1} rx={3.2} ry={4} fill="#4a1e1a" /></g>;
    case "thinking":
      return lip(3.4, 1.6);
    case "focused":
      return lip(1.4);
    case "worried":
      return <g><path d={`M100 ${y - 8} L100 ${y - 1}`} {...line(ink, 2)} /><path d={`M93 ${y + 2} Q96.5 ${y - 1} 100 ${y + 1} Q103.5 ${y + 3} 107 ${y}`} {...line(ink, 2.2)} /></g>;
    case "oops":
      return <g>{lip()}<path d={`M101 ${y + 2} q1 6 5 5 q1 -3 -1 -5 Z`} fill={TONGUE_PINK} /></g>;
    case "wink":
      return lip(4.4, -1.2);
    default:
      return lip();
  }
};

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
  line: "none",
};

/* A rounder head, wider at the jaw, rising to a low casque swept back to one side. */
const CHAM_HEAD =
  "M52 110 C50 78 70 54 98 48 C110 45 120 38 132 30 C134 48 146 66 148 100 C150 128 128 144 100 144 C72 144 54 134 52 110 Z";

/** A chameleon's crest: small bumps up the middle of the head to the casque's peak. */
const CHAM_CREST = [
  [98, 50, 3.6],
  [106, 46, 3.8],
  [114, 42, 4],
  [122, 37, 4],
  [129, 32, 3.6],
] as const;

/* A pear of a body on short, bowed legs. */
const CHAM_TORSO =
  "M84 152 Q100 146 116 152 Q130 166 128 192 Q126 216 100 218 Q74 216 72 192 Q70 166 84 152 Z";
const CHAM: Body = {
  ...CHIBI,
  id: "chameleon",
  torso: CHAM_TORSO,
  j: {
    ...CHIBI.j,
    hipL: [90, 208],
    kneeL: [82, 238],
    footL: [88, 268],
    hipR: [110, 208],
    kneeR: [118, 238],
    footR: [112, 268],
  },
  w: { upper: 11.5, fore: 10.5, thigh: 13, shin: 12, hand: 8.4, cloth: 1 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

function ChamHead({ pal }: Ctx) {
  return (
    <g>
      {/* two tones: its own shade below and to the right, the head over it */}
      <path d={CHAM_HEAD} fill={pal.skinShade} transform="translate(2 2.5)" />
      <path d={CHAM_HEAD} fill={pal.skin} />
      {CHAM_CREST.map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={pal.skin} />
      ))}
      {/* the casque's ridge lines, in its shade */}
      <path d="M90 62 Q108 50 126 40 M84 74 Q106 62 132 52" stroke={pal.skinShade} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {/* the pale throat and jaw, finely scaled */}
      <path d="M58 120 C70 142 130 142 142 120 C130 136 70 136 58 120 Z" fill={CHAM_BELLY} />
      <path d="M72 130 l3 3 M84 134 l2 3 M100 135 l0 3 M116 134 l-2 3 M128 130 l-3 3" stroke="#a99be8" strokeWidth={1.6} strokeLinecap="round" />
      {/* the turret eyes bulge past the head: their own shade, a groove, a light on top */}
      {[76, 124].map((x) => (
        <g key={x}>
          <circle cx={x + 2} cy={102} r={18.5} fill={pal.skinShade} />
          <circle cx={x} cy={100} r={18} fill={pal.skin} />
          <circle cx={x} cy={100} r={15.5} fill="none" stroke={pal.skinShade} strokeWidth={1.6} opacity={0.6} />
          <path d={`M${x - 13} ${94} A15 15 0 0 1 ${x + 3} ${85}`} stroke={pal.hairHi} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* rosettes, a paler tone */}
      {[
        [60, 118],
        [140, 118],
        [104, 66],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} fill={pal.hairHi}>
          <circle cx={x} cy={y} r={2.6} />
          <circle cx={x + 4} cy={y + 3} r={1.8} />
          <circle cx={x - 3.4} cy={y + 3.6} r={1.5} />
        </g>
      ))}
      <circle cx={95} cy={115} r={1.5} fill={pal.skinShade} />
      <circle cx={105} cy={115} r={1.5} fill={pal.skinShade} />
    </g>
  );
}

/** Chameleon: turret eyes. A small pupil in each turret, and the two look their own ways — apart
 *  at rest, together on something that interests it, crossed when it concentrates. The turret's
 *  skin closes over the eye as a lid. */
const chamEyes: EyeKit = ({ mood, s, x, y, id, pal }) => {
  const left = s === -1;
  const K = 1.3;
  const open = (dx: number, dy: number, r = 4.2, top = 0.18, tilt = 0) => (
    <Orb id={id} x={x} y={y} rx={13.6} ry={13.6} s={s} fill="#f4f0ff" lid={{ top, tilt, color: pal.skin }}>
      <circle cx={x + dx * K} cy={y + dy * K} r={r * K * 1.7} fill="#e2a33a" />
      <circle cx={x + dx * K} cy={y + dy * K} r={r * K} fill={pal.ink} />
      <circle cx={x + dx * K - r * 0.5} cy={y + dy * K - r * 0.5} r={r * 0.42} fill={WHITE} />
      <circle cx={x + dx * K + r * 0.55} cy={y + dy * K + r * 0.5} r={r * 0.18} fill={WHITE} />
    </Orb>
  );
  const shut = (
    <g>
      <circle cx={x} cy={y} r={13.6} fill={pal.skin} />
      <path d={arcUp(x, y + 1, 7.5, 4.4)} {...line(pal.ink, 3)} />
    </g>
  );
  switch (mood) {
    case "happy":
      return shut;
    case "delighted":
      return open(0, 0, 5.6, 0);
    case "curious":
      return left ? open(4, -1) : open(4, -1, 5.2, 0);
    case "thinking":
      return left ? open(-3.4, -4.4, 4, 0.2) : open(3.4, -4.4, 4, 0.2);
    case "focused":
      return open(-s * 3.4, 1.6, 4, 0.45);
    case "worried":
      return open(0, 1.6, 3, 0.18, 14);
    case "oops":
      return left ? open(-3.4, -3.4, 3.4, 0.08) : open(3.4, 3.4, 3.4, 0.08);
    case "wink":
      return s === 1 ? shut : open(2.4, 0);
    default:
      return left ? open(-3.4, 1) : open(2.6, -1.6);
  }
};

/** Chameleon: a lizard's long mouth line, nearly ear to ear; when it opens wide, its long tongue
 *  curls out. */
const chamMouth: MouthKit = ({ mood, y, pal }) => {
  const ink = pal.ink;
  const long = (d: number, tilt = 0) => (
    <path d={`M74 ${y + tilt} Q100 ${y + d} 126 ${y - tilt}`} {...line(ink, 2.6)} />
  );
  switch (mood) {
    case "happy":
      return <OpenMouth d={`M76 ${y} Q100 ${y + 16} 124 ${y} Q100 ${y + 5} 76 ${y} Z`} fill="#3a1d34" tongue={[100, y + 9, 7, 3]} />;
    case "delighted":
      return (
        <g>
          <OpenMouth d={`M74 ${y - 1} Q100 ${y + 22} 126 ${y - 1} Q100 ${y + 4} 74 ${y - 1} Z`} fill="#3a1d34" />
          <path d={`M100 ${y + 8} C104 ${y + 22} 122 ${y + 24} 120 ${y + 14} C118 ${y + 8} 110 ${y + 12} 114 ${y + 16}`} {...line(TONGUE_PINK, 4)} />
        </g>
      );
    case "curious":
      return <g>{long(3)}<ellipse cx={100} cy={y + 3} rx={3} ry={3.6} fill={ink} /></g>;
    case "thinking":
      return long(3, 3);
    case "focused":
      return long(0);
    case "worried":
      return <path d={`M76 ${y + 2} Q88 ${y - 2} 100 ${y + 2} Q112 ${y + 6} 124 ${y + 2}`} {...line(ink, 2.6)} />;
    case "oops":
      return <g>{long(6)}<path d={`M104 ${y + 4} C106 ${y + 14} 116 ${y + 14} 114 ${y + 8}`} {...line(TONGUE_PINK, 3.6)} /></g>;
    case "wink":
      return long(9, -2);
    default:
      return long(8);
  }
};

/** A thick tail that tapers into a tight coil, in two tones, with pale rings. */
function ChamTail({ pal }: Ctx) {
  const d = "M110 204 C140 206 166 222 164 246 C162 268 136 272 130 256 C125 244 138 236 146 242 C151 246 148 254 142 252";
  return (
    <g data-joint="tail" style={pivot("tail")}>
      <path d={d} stroke={pal.skinShade} strokeWidth={17} fill="none" strokeLinecap="round" />
      <path d={d} stroke={pal.skin} strokeWidth={12} fill="none" strokeLinecap="round" transform="translate(-1.4 -1.6)" />
      <path d="M130 207 l2 8 M148 216 l-2 8 M161 232 l-7 3 M163 252 l-8 -1" stroke={pal.hairHi} strokeWidth={3} strokeLinecap="round" />
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
    outline: false,
    frame: { ...CHIBI, id: "red-panda", w: CHUNKY },
    hands: "mitten",
    attitude: { mood: "happy", tilt: 5, hands: { L: [92, 178], R: [108, 178], outL: false, outR: false } },
    signature: "A huge ringed tail, tear-mark cheeks and dark legs — it rears up tall",
    pitch:
      "Gentle, cosy and easily startled — it would rather be curled up in its own tail, and at rest it holds its paws up at its chest, the way red pandas do, with a small contented smile. The strongest silhouette of the animals: the tail alone identifies it at 48px, and the cream face markings make every expression read. Its ability is Stand tall — a red panda's own startle: it rears up on its hind legs with its arms thrown wide and its tail fluffed, to look as big as it can. A surprise, and a delight, made of its own body. Dark glossy eyes, and cream brow marks that lift and knit; a split lip under its dark nose.",
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
      kit: pandaEyes,
      mouthKit: pandaMouth,
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
    frame: CHAM,
    hands: "tong",
    attitude: { tilt: 6, hands: { L: [82, 200], R: [134, 140], outL: true, outR: true } },
    signature: "Big bulging turret eyes, a swept-back casque and a coiled tail — it changes colour",
    pitch:
      "A small, fierce, loyal best friend who says everything with its face and its hands: it mimes, it points, it sulks, it cheers, it rolls one eye at you. Brave far beyond its size — and it blushes, literally, when you catch it caring. At rest it stands with one hand on its hip and the other up, mid-gesture, as if it were about to tell you something, its two eyes looking two ways. Inspired by the spirit of the sidekick chameleon in Tangled, not its look: violet, not green, its own casque and eyes. Drawn with a rounder head that rises to a low casque swept back to one side, a crest of small bumps, big turret eyes that bulge past the head with an amber ring round each pupil, a pale scaled throat, a pear of a body with a scaled belly and pale flank stripes, a chameleon's two-toed grips on its hands and feet, short bowed legs, and a thick tail that coils tight, in two tones with pale rings. Its ability is its colour.",
    risk: "Confirmed side character. Colour change is its ability and is semantic on purpose — green for correct, a gentle hue for not yet — always paired with words or a status mark (docs/cast.md). A reptile is less huggable, like the firefly.",
    pal: palCham,
    body: palCham.skin,
    face: {
      eyes: "bead",
      eyeY: 100,
      eyeGap: 24,
      mouthY: 124,
      nose: "none",
      brows: false,
      lid: palCham.skin,
      kit: chamEyes,
      mouthKit: chamMouth,
    },
    outline: false,
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: (c) => <ChamTail {...c} />,
    head: (c) => <ChamHead {...c} />,
    belly: ({ pal }) => (
      <g>
        {/* its own shade down one side of the pear */}
        <path d={CHAM_TORSO} fill={pal.skinShade} transform="translate(3 2)" opacity={0.7} />
        <path d="M92 156 Q100 154 108 156 L112 208 Q100 214 88 208 Z" fill={CHAM_BELLY} />
        <path d="M92 168 l8 4 l8 -4 M90 182 l10 4 l10 -4 M90 196 l10 4 l10 -4" stroke="#a99be8" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        {/* the pale flank stripe chameleons carry */}
        <path d="M80 174 Q78 190 82 204 M120 174 Q122 190 118 204" stroke={pal.hairHi} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
];
