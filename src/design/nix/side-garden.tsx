import type { Candidate, Ctx } from "./candidates";
import {
  ANIMAL_OUTFITS,
  arcBrow,
  blob,
  cute,
  dashBrow,
  dMouth,
  eyesOf,
  face,
  g2,
  INK,
  mirror,
  mix,
  MOUTH_IN,
  pal,
  PINK,
  sides,
  SMILE,
  Two,
  UNFIT,
  wave,
} from "./observatory";
import type { Mood } from "./rig/face";
import { EYE_WHITE, line, OpenMouth, TONGUE_PINK, type MouthKit } from "./rig/eyes";
import { pivot } from "./rig/skeleton";
import { SHAPE } from "./rig/visemes";
import { C } from "./theme";

/**
 * Round three: two characters picked for expression first — Bun, a rabbit, and Bean, a baby hippo —
 * drawn to `docs/character-guidelines.md` on the cute frame (`cute` in `observatory.tsx`): two
 * heads tall, eyes big and low, brows on both, nub limbs. They are refined before any world or
 * the rest of a cast is drawn.
 */

/* ——— Bun, a rabbit: bossy, loud, sure she is in charge ———
 * Her ears are her second face: they stand up, fold, droop and swivel with every mood. */

const BUN_FUR = C.mid;
const BUN_SHADE = mix(C.primary, C.mid, 60);
const BUN_LIGHT = C.soft;
const BUN_INNER = "#f6b3c4";

const BUN = cute("bun", {
  k: 1.42,
  neck: 206,
  torso: "M82 152 Q100 144 118 152 Q128 162 127 186 Q125 222 100 222 Q75 222 73 186 Q72 162 82 152 Z",
  w: { upper: 13, fore: 12, thigh: 17, shin: 16, hand: 8.4, cloth: 1.15 },
  j: { earL: [86, 74], earR: [114, 74], tail: [110, 252] },
  headVB: "6 8 192 192",
});

/** How each ear sits in each mood: [left, right] turn in degrees (outward positive), and whether
 *  the right one folds over at the tip — it does at rest, which is her imperfection. */
const BUN_EARS: Record<Mood, { turn: [number, number]; fold: boolean }> = {
  neutral: { turn: [-4, 6], fold: true },
  happy: { turn: [-8, 8], fold: false },
  delighted: { turn: [-2, 2], fold: false },
  curious: { turn: [6, 18], fold: true },
  thinking: { turn: [-10, 22], fold: true },
  focused: { turn: [-14, 14], fold: false },
  worried: { turn: [-62, 62], fold: true },
  oops: { turn: [-78, 78], fold: true },
  wink: { turn: [-6, 16], fold: true },
  sly: { turn: [-4, 6], fold: true },
  silly: { turn: [-30, 40], fold: true },
  surprised: { turn: [0, 0], fold: false },
  proud: { turn: [-4, 4], fold: false },
  party: { turn: [-8, 8], fold: false },
};

function BunEar({ s, turn, fold }: { s: -1 | 1; turn: number; fold: boolean }) {
  const m = (x: number) => mirror(s, x);
  /* the ear stands from its base; a folded ear bends over a third of the way from the tip */
  const straight = `M${m(84)} 78 C${m(76)} 52 ${m(72)} 22 ${m(80)} 8 C${m(90)} 2 ${m(98)} 24 ${m(98)} 46 C${m(98)} 60 ${m(96)} 70 ${m(96)} 78 Z`;
  const inner = `M${m(87)} 72 C${m(82)} 52 ${m(80)} 28 ${m(84)} 18 C${m(90)} 16 ${m(93)} 32 ${m(93)} 48 C${m(93)} 58 ${m(92)} 66 ${m(92)} 72 Z`;
  const base = `M${m(84)} 78 C${m(78)} 60 ${m(76)} 44 ${m(78)} 34 L${m(97)} 34 C${m(98)} 50 ${m(96)} 66 ${m(96)} 78 Z`;
  /* the folded tip hangs outward, away from the other ear, its inside showing */
  const tip = `M${m(97)} 36 C${m(96)} 26 ${m(80)} 24 ${m(77)} 34 C${m(66)} 38 ${m(54)} 52 ${m(56)} 62 C${m(60)} 68 ${m(72)} 58 ${m(80)} 46 Z`;
  return (
    <g transform={`rotate(${turn * s} ${m(90)} 78)`}>
      {fold ? (
        <g>
          <path d={base} fill={BUN_SHADE} transform="translate(1.6 1.2)" />
          <path d={base} fill={BUN_FUR} />
          <path d={`M${m(87)} 72 C${m(82)} 58 ${m(81)} 46 ${m(82)} 38 L${m(93)} 38 C${m(93)} 52 ${m(92)} 64 ${m(92)} 72 Z`} fill={BUN_INNER} />
          <path d={tip} fill={BUN_SHADE} />
        </g>
      ) : (
        <g>
          <path d={straight} fill={BUN_SHADE} transform="translate(1.6 1.2)" />
          <path d={straight} fill={BUN_FUR} />
          <path d={inner} fill={BUN_INNER} />
        </g>
      )}
    </g>
  );
}

function BunHead({ mood }: Ctx) {
  const e = BUN_EARS[mood ?? "neutral"];
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, BUN.j)}>
          <BunEar s={s} turn={s === -1 ? -e.turn[0] : e.turn[1]} fold={s === 1 && e.fold} />
        </g>
      ))}
      {/* cheek fluff, the head, a tuft on top */}
      <path d="M60 122 L48 126 L58 132 L52 138 L66 136 Z M140 122 L152 126 L142 132 L148 138 L134 136 Z" fill={BUN_FUR} />
      <Two d={blob(100, 112, 42, 38, 1.1)} fill={BUN_FUR} shade={BUN_SHADE} k={2.2} />
      <path d="M94 76 Q96 66 100 72 Q103 64 106 74" fill={BUN_FUR} />
      {/* a pale muzzle in two puffs, a pink nose */}
      <ellipse cx={93} cy={133} rx={9.5} ry={8} fill={BUN_LIGHT} />
      <ellipse cx={107} cy={133} rx={9.5} ry={8} fill={BUN_LIGHT} />
      <path d="M96 126 Q100 124 104 126 Q102 130 100 130.6 Q98 130 96 126 Z" fill={PINK} />
    </g>
  );
}

function BunBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", BUN.j)}>
        <circle cx={118} cy={252} r={10} fill={BUN_LIGHT} />
        <circle cx={112} cy={246} r={7} fill={EYE_WHITE} opacity={0.6} />
      </g>
    </g>
  );
}

/** Bun: big white eyes with a deep iris that nearly fills them, a lash flick, and brows that are
 *  always busy. At rest the brows are down at the middle and the chin up: she is in charge. */
const bunEyes = eyesOf({
  rx: 9.6,
  ry: 11.2,
  fill: EYE_WHITE,
  iris: { r: 8, color: C.deep },
  pupil: { r: 3.8 },
  shine: 3,
  lid: BUN_FUR,
  rim: { color: INK, w: 2.8, lashes: 2 },
  closed: INK,
  browY: 18,
  brow: arcBrow(C.deep, 4, 6.4),
  rest: { look: [0, -0.6], raise: -1, browTilt: -12, top: 0.08 },
});

/** Bun: a rabbit's “y” under the nose with two big front teeth; she talks with them showing. */
const bunMouth: MouthKit = ({ mood, y, viseme }) => {
  const teeth = (dy = 0, w = 3.2) => (
    <g fill={EYE_WHITE}>
      <rect x={100 - w - 0.3} y={y + dy - 0.6} width={w} height={4.4} rx={1} />
      <rect x={100.3} y={y + dy - 0.6} width={w} height={4.4} rx={1} />
    </g>
  );
  const why = (dy = 0) => (
    <path d={`M100 ${y - 6} L100 ${y + dy - 1} M93 ${y + dy - 2} Q96.5 ${y + dy + 1.6} 100 ${y + dy - 1} Q103.5 ${y + dy + 1.6} 107 ${y + dy - 2}`} {...line(BUN_SHADE, 2.2)} />
  );
  if (viseme) {
    const sh = SHAPE[viseme];
    const lift = SMILE[mood] ?? 0;
    if (sh.h === 0) return g2(why(sh.pressed ? -0.6 : 0), teeth(1));
    const w = (sh.round ? 4.6 : 8) * sh.w;
    const h = 8 * sh.h;
    return g2(
      <OpenMouth
        d={`M${100 - w} ${y - lift * 0.4} Q100 ${y - 1} ${100 + w} ${y - lift * 0.4} Q${100 + w * 0.8} ${y + h} 100 ${y + h + 1} Q${100 - w * 0.8} ${y + h} ${100 - w} ${y - lift * 0.4} Z`}
        fill={MOUTH_IN}
        tongue={[100, y + h, w * 0.6, h * 0.4]}
      />,
      teeth(-0.4, 3),
      <path d={`M100 ${y - 6} L100 ${y - 1}`} {...line(BUN_SHADE, 2.2)} />,
    );
  }
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y, 8, 5)} fill={MOUTH_IN} tongue={[100, y + 7, 3.6, 2.2]} />, teeth(-0.4, 3));
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 1, 10, 8)} fill={MOUTH_IN} tongue={[100, y + 10, 5, 3]} />, teeth(-1, 3.2));
    case "curious":
      return g2(why(), <ellipse cx={100} cy={y + 3} rx={2.4} ry={2.6} fill={MOUTH_IN} />);
    case "thinking":
      /* chewing the side of her mouth */
      return g2(<path d={`M100 ${y - 6} L101 ${y - 1} M95 ${y} Q101 ${y + 2} 107 ${y - 2.6}`} {...line(BUN_SHADE, 2.2)} />, teeth(0.4));
    case "focused":
      return g2(<path d={`M100 ${y - 6} L100 ${y - 1} M94 ${y} L106 ${y}`} {...line(BUN_SHADE, 2.4)} />);
    case "worried":
      return g2(<path d={`M100 ${y - 6} L100 ${y - 1}`} {...line(BUN_SHADE, 2.2)} />, <path d={wave(y + 1, 6, 2.2)} {...line(BUN_SHADE, 2.2)} />, teeth(1.6, 2.6));
    case "oops":
      return g2(<OpenMouth d={`M93 ${y + 4} Q100 ${y - 3} 107 ${y + 4} Q100 ${y + 2} 93 ${y + 4} Z`} fill={MOUTH_IN} />, teeth(-0.6, 2.6));
    case "wink":
      return g2(why(), teeth(1), <ellipse cx={104} cy={y + 4.4} rx={2.2} ry={1.8} fill={TONGUE_PINK} />);
    default:
      return g2(why(), teeth(0.6));
  }
};

/* ——— Bean, a baby hippo: sleepy, sweet, an enormous appetite ———
 * A circle on a circle: a small round crown with the eyes in it, over a big soft muzzle that is
 * most of the face, so its mouth can go from a tiny smile to a yawn that fills the frame. */

const BEAN_SKIN = mix(C.primary, "#c79bc4", 38);
const BEAN_SHADE = mix(C.deep, "#9a6c9a", 45);
const BEAN_MUZZLE = mix(C.soft, "#f3c9dc", 45);
const BEAN_MUZZLE_SHADE = mix(C.hi, "#d99ab8", 45);

const BEAN = cute("bean", {
  k: 1.4,
  neck: 208,
  torso: "M74 152 Q100 142 126 152 Q142 168 140 196 Q136 226 100 226 Q64 226 60 196 Q58 168 74 152 Z",
  w: { upper: 15, fore: 14, thigh: 21, shin: 20, hand: 9.4, cloth: 1.3 },
  j: {
    earL: [74, 74],
    earR: [126, 74],
    tail: [112, 256],
    hipL: [87, 256],
    kneeL: [86, 265],
    footL: [85, 273],
    hipR: [113, 256],
    kneeR: [114, 265],
    footR: [115, 273],
    shoulderL: [80, 214],
    elbowL: [73, 228],
    wristL: [70, 241],
    shoulderR: [120, 214],
    elbowR: [127, 228],
    wristR: [130, 241],
  },
  headVB: "14 30 172 172",
});

const BEAN_CROWN = blob(100, 100, 38, 34, 1.04);
const BEAN_SNOUT = "M54 132 C54 114 74 106 100 106 C126 106 146 114 146 132 C146 150 126 160 100 160 C74 160 54 150 54 132 Z";

function BeanHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, BEAN.j)}>
          <ellipse cx={mirror(s, 72)} cy={72} rx={8} ry={9} fill={BEAN_SHADE} />
          <ellipse cx={mirror(s, 72)} cy={72} rx={4.4} ry={5.4} fill={BEAN_MUZZLE_SHADE} />
        </g>
      ))}
      <Two d={BEAN_CROWN} fill={BEAN_SKIN} shade={BEAN_SHADE} k={2} />
      <Two d={BEAN_SNOUT} fill={BEAN_MUZZLE} shade={BEAN_MUZZLE_SHADE} k={2} />
      {/* nostrils on top of the snout, freckles, and its own blush low on the snout */}
      <ellipse cx={86} cy={118} rx={3.6} ry={2.4} fill={BEAN_SHADE} />
      <ellipse cx={114} cy={118} rx={3.6} ry={2.4} fill={BEAN_SHADE} />
      {[
        [66, 132],
        [70, 138],
        [64, 140],
        [134, 132],
        [130, 138],
        [136, 140],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.3} fill={BEAN_MUZZLE_SHADE} />
      ))}
      <ellipse cx={70} cy={146} rx={8} ry={4.6} fill="#ff9fb5" opacity={0.55} />
      <ellipse cx={130} cy={146} rx={8} ry={4.6} fill="#ff9fb5" opacity={0.55} />
    </g>
  );
}

function BeanBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", BEAN.j)}>
        <path d="M118 254 Q132 252 134 244 Q138 250 132 258 Q126 262 118 260 Z" fill={BEAN_SHADE} />
      </g>
    </g>
  );
}

/** Bean: big solid glossy eyes, two shines, set in the crown; heavy, content lids at rest — it is
 *  always a little sleepy; small soft brows. */
const beanEyes = eyesOf({
  rx: 9.4,
  ry: 10.8,
  fill: INK,
  iris: { r: 7, color: mix(C.deep, INK, 40) },
  pupil: { r: 0 },
  shine: 3.4,
  lid: BEAN_SKIN,
  closed: INK,
  browY: 16,
  brow: dashBrow(BEAN_SHADE, 3.2, 4.4),
  rest: { top: 0.3, raise: 2, browTilt: 6 },
});

/** Bean: a wide mouth across the snout — a tiny smile at rest, a yawn that takes the whole snout,
 *  two little bottom teeth. */
const beanMouth: MouthKit = ({ mood, y, viseme }) => {
  const smile = (w: number, d: number) => <path d={`M${100 - w} ${y} Q100 ${y + d} ${100 + w} ${y}`} {...line(BEAN_SHADE, 2.6)} />;
  const open = (w: number, h: number, lift = 0) => (
    <g>
      <OpenMouth
        d={`M${100 - w} ${y - lift} Q100 ${y + 2 - lift * 0.4} ${100 + w} ${y - lift} Q${100 + w * 0.9} ${y + h} 100 ${y + h + 2} Q${100 - w * 0.9} ${y + h} ${100 - w} ${y - lift} Z`}
        fill={MOUTH_IN}
        tongue={[100, y + h, w * 0.55, Math.max(2, h * 0.36)]}
      />
      {h > 4 && (
        <g fill={EYE_WHITE}>
          <rect x={100 - w * 0.5 - 1.6} y={y + h - 2.6} width={3.2} height={3.4} rx={1} />
          <rect x={100 + w * 0.5 - 1.6} y={y + h - 2.6} width={3.2} height={3.4} rx={1} />
        </g>
      )}
    </g>
  );
  if (viseme) {
    const sh = SHAPE[viseme];
    const lift = SMILE[mood] ?? 0;
    if (sh.h === 0) return smile(14 * sh.w, 4 + lift);
    return open((sh.round ? 9 : 15) * sh.w, 12 * sh.h, lift);
  }
  switch (mood) {
    case "happy":
      return open(14, 6, 3);
    case "delighted":
      return open(17, 11, 4);
    case "curious":
      return <ellipse cx={100} cy={y + 2.4} rx={4} ry={4.6} fill={MOUTH_IN} />;
    case "thinking":
      return <path d={`M92 ${y + 2} Q100 ${y + 3} 110 ${y - 2}`} {...line(BEAN_SHADE, 2.6)} />;
    case "focused":
      return <path d={`M93 ${y + 1} L107 ${y + 1}`} {...line(BEAN_SHADE, 2.6)} />;
    case "worried":
      return <path d={wave(y + 2, 9, 2.6)} {...line(BEAN_SHADE, 2.6)} />;
    case "oops":
      return open(9, 7, -2);
    case "wink":
      return g2(smile(13, 7), <ellipse cx={106} cy={y + 4.6} rx={3} ry={2.4} fill={TONGUE_PINK} />);
    default:
      return smile(11, 5);
  }
};

/* ——— The two ——— */

export const GARDEN: Candidate[] = [
  {
    id: "garden-bun",
    kind: "animal",
    frame: BUN,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -6, hands: { L: [78, 200], R: [122, 200], outL: true, outR: true } },
    label: "Bun",
    signature: "A small blue rabbit, hands on hips, with one ear folded over — she thumps",
    pitch:
      "Bossy, loud and sure she is in charge — and she usually is. Wants everything done properly and everyone to know who said so; the flaw is that she can't admit she's wrong, so she changes the subject. At rest: hands on hips, chin up, brows down at the middle. Her ears are a second face: they stand up tall when she is pleased, swivel when she is curious, and drop flat when she is worried; the right one folds over at the tip and will not stay up, which she pretends not to notice. Big white eyes with an iris that nearly fills them, two front teeth, a pale muzzle, cheek fluff, a cotton tail. Her ability is Thump: one stamp of her foot and everything round her jumps.",
    risk: "Bossy, never mean: she bosses because she cares. A thump is a call to attention, never a scold on an incorrect answer.",
    pal: pal(BUN_FUR, BUN_FUR, { skin: BUN_FUR, skinShade: BUN_SHADE, limb: BUN_FUR, paw: BUN_LIGHT, blush: "#ff9fb5" }),
    body: BUN_FUR,
    face: face({ eyeY: 114, eyeGap: 19, mouthY: 138, lid: BUN_FUR, kit: bunEyes, mouthKit: bunMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <BunBehind />,
    belly: () => <ellipse cx={100} cy={190} rx={17} ry={22} fill={BUN_LIGHT} />,
    head: (c) => <BunHead {...c} />,
  },
  {
    id: "garden-bean",
    kind: "animal",
    frame: BEAN,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: 7, hands: { L: [84, 206], R: [116, 204], outL: true, outR: true } },
    label: "Bean",
    signature: "A round lilac baby hippo with a big soft snout and sleepy eyes — it yawns",
    pitch:
      "Sleepy, sweet, with an enormous appetite: a circle on a circle. Wants a snack and a nap, and you there for both; the flaw is that it dozes off at the best part. At rest its lids are heavy and content, head on one side, paws on its tummy. Species-true: a small round crown with tiny round ears, a big soft snout that is most of its face with nostrils on top and freckles, two little bottom teeth, a stub of a tail. Its mouth has the widest range in the cast — from a tiny smile to a yawn that fills the frame — so it talks the most clearly. Its ability is Yawn: a yawn so big everyone round it yawns too.",
    risk: "Sleepy, never bored: it naps because it is content, and never on a learner's answer. A yawn is never a reaction to the material.",
    pal: pal(BEAN_SKIN, BEAN_MUZZLE, { skin: BEAN_SKIN, skinShade: BEAN_SHADE, limb: BEAN_SKIN, paw: BEAN_MUZZLE, blush: "transparent" }),
    body: BEAN_SKIN,
    face: face({ eyeY: 100, eyeGap: 18, mouthY: 140, lid: BEAN_SKIN, kit: beanEyes, mouthKit: beanMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <BeanBehind />,
    belly: () => <ellipse cx={100} cy={192} rx={22} ry={24} fill={BEAN_MUZZLE} />,
    head: () => <BeanHead />,
  },
];

