import type { Candidate, Ctx } from "./candidates";
import { palette } from "./firefly-variants";
import {
  ANIMAL_OUTFITS,
  arcBrow,
  blob,
  cute,
  dashBrow,
  dMouth,
  eyesOf,
  FACE,
  face,
  g2,
  INK,
  mix,
  MOUTH_IN,
  pal,
  PERSON_OUTFITS,
  sides,
  SMILE,
  mirror,
  talk,
  Two,
  UNFIT,
  wave,
} from "./observatory";
import type { Mood } from "./rig/face";
import { EYE_WHITE, line, OpenMouth, TONGUE_PINK, type MouthKit } from "./rig/eyes";
import { CHIBI, J, pivot, type Body } from "./rig/skeleton";
import { SHAPE } from "./rig/visemes";
import { GARDEN } from "./side-garden";
import { C } from "./theme";

/**
 * Lantern Pond (`docs/world.md`): a pond at the edge of town where everyone gathers at dusk, and
 * Wisp lights the lily lanterns along the bank. Bun and Bean are in `side-garden.tsx`; this file
 * draws the other four — Marlowe, an old heron; Ines, a girl acrobat; Mina, a girl of about eight;
 * Ollie, a snail — on the cute frame, to `docs/character-guidelines.md`.
 */

/* ——— Marlowe, an old heron: the grown-up who keeps the pond school. Tall and thin ——— */

const HERON = mix(C.mid, "#8f98a3", 50);
const HERON_SHADE = mix(C.deep, "#5f6670", 45);
const HERON_DARK = mix(C.deep, INK, 55);
const BEAK = C.accent;
const BEAK_SHADE = C.accentDeep;

/** Marlowe stands on his own body: long thin legs, an egg of a body with a tail, an S of a neck,
 *  a head on top — the one tall shape in a cast of round ones. */
const MARLOWE_TORSO_FIT = "translate(100 176) scale(1.05 0.7) translate(-100 -148)";
const MARLOWE_UNFIT = "translate(100 148) scale(0.95238 1.42857) translate(-100 -176)";

const MARLOWE: Body = {
  ...CHIBI,
  id: "marlowe",
  j: {
    ...J,
    root: [100, 284],
    torso: [100, 212],
    head: [100, 148],
    shoulderL: [84, 190],
    elbowL: [79, 206],
    wristL: [78, 220],
    shoulderR: [116, 190],
    elbowR: [121, 206],
    wristR: [122, 220],
    hipL: [95, 222],
    kneeL: [94, 248],
    footL: [93, 273],
    hipR: [105, 222],
    kneeR: [106, 248],
    footR: [107, 273],
    tail: [128, 214],
    earL: [116, 84],
    earR: [116, 84],
  },
  headFit: "translate(100 148) scale(1.22) translate(-100 -150)",
  torsoFit: MARLOWE_TORSO_FIT,
  hemFit: MARLOWE_TORSO_FIT,
  handsFit: "translate(100 196) scale(0.85) translate(-100 -158)",
  packFit: "translate(0 2)",
  torso: "M80 152 Q100 140 122 150 Q138 160 142 178 L156 200 Q136 204 126 210 Q112 222 96 222 Q78 218 74 196 Q70 168 80 152 Z",
  headVB: "30 34 156 156",
  w: { upper: 12, fore: 11, thigh: 5.2, shin: 4.6, hand: 5.6, cloth: 0.9 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

function MarloweHead() {
  return (
    <g>
      {/* two long plumes from the back of his crown, on a joint so they lift and droop */}
      <g data-joint="earL" style={pivot("earL", MARLOWE.j)}>
        <path d="M112 80 C130 70 150 70 168 80" {...line(HERON_DARK, 5)} />
        <path d="M114 86 C130 80 146 82 160 92" {...line(HERON_DARK, 3.4)} />
      </g>
      <Two d={blob(100, 106, 37, 34, 1.04)} fill={HERON} shade={HERON_SHADE} k={2} />
      {/* a white face and throat, and the dark stripe over each eye running back into the plumes */}
      <path d={blob(100, 118, 30, 22, 1.04)} fill={FACE} />
      {sides.map(([side, s]) => (
        <path key={side} d={`M${mirror(s, 92)} 94 Q${mirror(s, 78)} 88 ${mirror(s, 64)} 96 Q${mirror(s, 78)} 92 ${mirror(s, 90)} 98 Z`} fill={HERON_DARK} />
      ))}
    </g>
  );
}

/** In the torso's space: his S of a neck, white down the front, and the long plumes hanging from
 *  its base like a beard. */
function MarloweNeck() {
  return (
    <g transform={MARLOWE_UNFIT}>
      <path d="M91 194 C84 176 98 166 92 138 L108 138 C114 166 102 176 110 194 Z" fill={HERON} />
      <path d="M97 192 C92 178 102 168 98 140 L104 140 C108 168 100 178 104 192 Z" fill={FACE} />
      <g {...line(FACE, 2.4)}>
        <path d="M96 190 Q94 202 90 212" />
        <path d="M100 191 Q100 204 98 216" />
        <path d="M104 190 Q106 202 108 212" />
      </g>
    </g>
  );
}

const marloweEyes = eyesOf({
  rx: 7.8,
  ry: 8.4,
  fill: mix(C.accent, "white", 35),
  pupil: { r: 3.6 },
  shine: 2,
  lid: HERON,
  closed: INK,
  browY: 14,
  /* long, drooping old-professor brows */
  brow: ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return <path d={`M${x - s * 8} ${by - 1} Q${x} ${by - 3.4} ${x + s * 10} ${by + 3.4}`} {...line(FACE, 3.4)} transform={`rotate(${s * tilt} ${x} ${by})`} />;
  },
  /* dry: lids half down, the right brow a little higher */
  rest: { top: 0.36, raise: 1, browTilt: -4, k: [1, 1.05] },
});

/** Marlowe: a long beak held off to one side, so his face reads three-quarter; a ridge down the
 *  top, a nostril, and a lower half that drops on its hinge to talk. A smile shows at the gape. */
const marloweMouth: MouthKit = ({ mood, y, viseme }) => {
  const beak = (open: number, smile = 0) => (
    <g>
      {open > 0.4 && <path d={`M94 ${y + 1} L144 ${y + 20} L95 ${y + 4 + open}`} fill={MOUTH_IN} />}
      <path
        d={`M94 ${y + 2} Q120 ${y + 12 + open * 1.4} 142 ${y + 22 + open * 0.6} Q144 ${y + 24 + open * 0.6} 140 ${y + 24 + open * 0.6} Q118 ${y + 18 + open * 1.4} 95 ${y + 7 + open} Z`}
        fill={BEAK_SHADE}
      />
      <path
        d={`M90 ${y - 6} Q100 ${y - 10} 110 ${y - 6} Q128 ${y + 2} 148 ${y + 18} Q151 ${y + 22} 146 ${y + 21} Q124 ${y + 10} 92 ${y + 2} Q88 ${y - 2} 90 ${y - 6} Z`}
        fill={BEAK}
      />
      <path d={`M100 ${y - 6} Q122 ${y + 1} 142 ${y + 15}`} {...line(BEAK_SHADE, 1.4)} opacity={0.55} />
      <path d={`M104 ${y - 3} l6 2`} {...line(BEAK_SHADE, 1.6)} />
      {smile !== 0 && <path d={`M91 ${y + 1} q-4 ${smile * 1.2} -7 ${smile * 0.4}`} {...line(HERON_SHADE, 2)} />}
    </g>
  );
  if (viseme) return beak(SHAPE[viseme].h * 7, (SMILE[mood] ?? 0) > 1 ? -2 : 0);
  switch (mood) {
    case "happy":
      return beak(1.6, -2.4);
    case "delighted":
      return beak(6, -3);
    case "curious":
      return beak(2.4);
    case "oops":
      return beak(4, 2);
    case "worried":
      return beak(0, 2.4);
    case "wink":
      return beak(0, -2.4);
    default:
      return beak(0);
  }
};

/* ——— Ines, a girl acrobat of about twelve: fearless and showy ——— */

const INES_SKIN = "#b9774c";
const INES_SHADE = "#9a5d36";
const INES_HAIR = "#2b1d2a";
const INES_HAIR_HI = "#54394d";
const INES_LIP = "#7a3a33";

const palInes = palette(INES_SKIN, INES_SKIN, INES_SKIN, INES_SHADE, {
  line: "none",
  ink: INK,
  hair: INES_HAIR,
  hairHi: INES_HAIR_HI,
  eye: INK,
  top: C.clothes,
  topAlt: "#fff3de",
  bottom: C.deep,
  shoe: C.deep,
  accent: C.accent,
  blush: "#e88a86",
});

const INES = cute("ines", {
  k: 1.36,
  neck: 200,
  torso: "M84 150 Q100 146 116 150 Q124 156 123 172 L120 210 Q118 220 100 220 Q82 220 80 210 L77 172 Q76 156 84 150 Z",
  w: { upper: 11.5, fore: 10.5, thigh: 13, shin: 12, hand: 7.4, cloth: 1 },
  headVB: "18 32 164 164",
});

function InesBack() {
  return (
    <g>
      {/* a high bun tied with a ribbon */}
      <circle cx={101} cy={50} r={18} fill={mix(INES_HAIR, "black", 70)} />
      <circle cx={99} cy={48} r={17} fill={INES_HAIR} />
      <path d="M88 44 Q98 38 108 42" {...line(INES_HAIR_HI, 3)} />
    </g>
  );
}

function InesHead() {
  return (
    <g>
      <circle cx={58} cy={118} r={6.6} fill={INES_SKIN} />
      <circle cx={142} cy={118} r={6.6} fill={INES_SKIN} />
      <Two d={blob(100, 112, 40, 38, 1.04)} fill={INES_SKIN} shade={INES_SHADE} k={2} />
      {/* hair pulled back smooth with a side parting; one curl has escaped */}
      <path d="M58 106 C56 72 78 62 100 62 C124 62 144 74 142 106 C136 90 120 80 108 80 C96 80 84 82 74 88 C66 92 62 98 58 106 Z" fill={INES_HAIR} />
      <path d="M78 72 Q94 66 110 68" {...line(INES_HAIR_HI, 3)} />
      <path d="M86 82 C82 90 88 96 92 92" {...line(INES_HAIR, 3)} />
      {/* the ribbon on her bun */}
      <path d="M100 62 L88 56 L88 68 Z M100 62 L112 56 L112 68 Z" fill={C.accent} />
      <circle cx={100} cy={62} r={3.2} fill={C.accentDeep} />
    </g>
  );
}

const inesEyes = eyesOf({
  rx: 8.8,
  ry: 9.6,
  fill: EYE_WHITE,
  iris: { r: 6.6, color: "#4a2a1c" },
  pupil: { r: 3.2 },
  shine: 2.6,
  lid: INES_SKIN,
  rim: { color: INK, w: 3, lashes: 3 },
  closed: INK,
  browY: 16,
  brow: arcBrow(INES_HAIR, 3.6, 7.4),
  /* sure of herself: brows arched high, lids a touch lowered */
  rest: { top: 0.14, raise: 4, browTilt: 6 },
});

/** Ines: a showy grin with all her teeth, and a lopsided smirk at rest. */
const inesMouth: MouthKit = ({ mood, y, viseme }) => {
  if (viseme) return talk(viseme, mood, y, { W: 8.6, H: 7.6, inside: MOUTH_IN, lip: INES_LIP, lipW: 2.6, teeth: EYE_WHITE });
  const grin = (w: number, h: number, cx = 100) => (
    <OpenMouth d={dMouth(y - 1, w, h, cx)} fill={MOUTH_IN} teeth={[cx - w * 0.8, y - 1.6, w * 1.6, 3.6]} tongue={[cx, y + h * 1.2, w * 0.5, h * 0.4]} />
  );
  switch (mood) {
    case "happy":
      return grin(9, 6);
    case "delighted":
      return grin(11, 9);
    case "curious":
      return <ellipse cx={101} cy={y + 2} rx={2.8} ry={3.4} fill={MOUTH_IN} />;
    case "thinking":
      return <path d={`M95 ${y + 1} Q101 ${y + 2} 107 ${y - 2}`} {...line(INES_LIP, 2.6)} />;
    case "focused":
      /* biting her lip */
      return g2(<path d={`M94 ${y} L106 ${y}`} {...line(INES_LIP, 2.6)} />, <rect x={98} y={y - 0.6} width={5} height={2.4} rx={0.8} fill={EYE_WHITE} />);
    case "worried":
      return <path d={wave(y + 2, 6, 2.2)} {...line(INES_LIP, 2.6)} />;
    case "oops":
      return <OpenMouth d={`M94 ${y + 4} Q100 ${y - 2} 106 ${y + 4} Q100 ${y + 2} 94 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "wink":
      return grin(8, 5, 102);
    default:
      return <path d={`M93 ${y + 1} Q100 ${y + 4} 108 ${y - 2.4}`} {...line(INES_LIP, 2.8)} />;
  }
};

/* ——— Mina, a girl of about eight: the learner's age, and the learner's friend ——— */

const MINA_SKIN = "#ebbd94";
const MINA_SHADE = "#d49d71";
const MINA_HAIR = "#4a2a1a";
const MINA_HAIR_HI = "#7a4a30";
const MINA_LIP = "#b0584c";

const palMina = palette(MINA_SKIN, MINA_SKIN, MINA_SKIN, MINA_SHADE, {
  line: "none",
  ink: INK,
  hair: MINA_HAIR,
  hairHi: MINA_HAIR_HI,
  eye: INK,
  top: C.clothes,
  topAlt: "#fff3de",
  bottom: C.deep,
  shoe: C.deep,
  accent: C.accent,
  blush: "#f39a9c",
});

const MINA = cute("mina", {
  k: 1.5,
  neck: 202,
  torso: "M84 150 Q100 146 116 150 Q124 156 123 172 L121 210 Q120 222 100 222 Q80 222 79 210 L77 172 Q76 156 84 150 Z",
  w: { upper: 12.5, fore: 11.5, thigh: 13.5, shin: 12.5, hand: 7.8, cloth: 1.05 },
  j: { braidL: [64, 96], braidR: [136, 96] },
  headVB: "8 26 184 184",
});

function MinaBack() {
  return (
    <g>
      {/* two puffy bunches with bobbles, on their own joints so they bounce */}
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`braid${side}`} style={pivot(`braid${side}`, MINA.j)}>
          <circle cx={mirror(s, 48)} cy={104} r={19} fill={mix(MINA_HAIR, "black", 75)} />
          <circle cx={mirror(s, 47)} cy={102} r={18} fill={MINA_HAIR} />
          <path d={`M${mirror(s, 40)} 92 Q${mirror(s, 48)} 88 ${mirror(s, 54)} 94`} {...line(MINA_HAIR_HI, 2.6)} />
          <circle cx={mirror(s, 62)} cy={98} r={5} fill={C.accent} />
        </g>
      ))}
      <path d={blob(100, 100, 46, 44, 1.04)} fill={MINA_HAIR} />
    </g>
  );
}

function MinaHead() {
  return (
    <g>
      <Two d={blob(100, 114, 43, 40, 1.1)} fill={MINA_SKIN} shade={MINA_SHADE} k={2.2} />
      {/* a straight-cut fringe, a little uneven */}
      <path d="M58 104 C56 72 76 60 100 60 C126 60 146 72 142 104 L136 102 L128 104 L118 101 L108 104 L98 101 L88 104 L78 101 L68 104 Z" fill={MINA_HAIR} />
      <path d="M74 72 Q92 64 112 66" {...line(MINA_HAIR_HI, 3.2)} />
      {/* freckles across her nose */}
      {[
        [88, 128],
        [92, 131],
        [108, 128],
        [112, 131],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.1} fill={MINA_SHADE} />
      ))}
    </g>
  );
}

const minaEyes = eyesOf({
  rx: 10,
  ry: 11.6,
  fill: EYE_WHITE,
  iris: { r: 8.4, color: "#6b4a2b" },
  pupil: { r: 4.2 },
  shine: 3.2,
  lid: MINA_SKIN,
  rim: { color: INK, w: 2.6, lashes: 1 },
  closed: INK,
  browY: 17,
  brow: arcBrow(MINA_HAIR, 3.2, 5.4),
  /* bright and open, a giggle never far off */
  rest: { raise: 2, browTilt: 2, look: [0.6, 0] },
});

/** Mina: a wide open giggle, dimples at rest. */
const minaMouth: MouthKit = ({ mood, y, viseme }) => {
  if (viseme) return talk(viseme, mood, y, { W: 8.4, H: 8, inside: MOUTH_IN, lip: MINA_LIP, lipW: 2.6, teeth: EYE_WHITE });
  const dimples = g2(<path d={`M89 ${y - 2} q-1.4 2 0 3.6`} {...line(MINA_SHADE, 1.6)} />, <path d={`M111 ${y - 2} q1.4 2 0 3.6`} {...line(MINA_SHADE, 1.6)} />);
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y, 9, 7)} fill={MOUTH_IN} teeth={[92, y - 1, 16, 3]} tongue={[100, y + 9, 4.6, 2.8]} />, dimples);
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 1, 11, 11)} fill={MOUTH_IN} teeth={[90, y - 2, 20, 3.4]} tongue={[100, y + 14, 6, 3.6]} />, dimples);
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={3} ry={3.8} fill={MOUTH_IN} />;
    case "thinking":
      return <path d={`M95 ${y + 1} Q99 ${y + 3} 106 ${y}`} {...line(MINA_LIP, 2.6)} />;
    case "focused":
      return g2(<path d={`M94 ${y + 1} L106 ${y + 1}`} {...line(MINA_LIP, 2.6)} />, <ellipse cx={96} cy={y + 3} rx={2.4} ry={2} fill={TONGUE_PINK} />);
    case "worried":
      return <path d={wave(y + 2, 6, 2.4)} {...line(MINA_LIP, 2.6)} />;
    case "oops":
      return <OpenMouth d={`M93 ${y + 4} Q100 ${y - 3} 107 ${y + 4} Q100 ${y + 2} 93 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "wink":
      return g2(<OpenMouth d={dMouth(y, 7, 5, 102)} fill={MOUTH_IN} tongue={[102, y + 7, 3.4, 2.2]} />, dimples);
    default:
      return g2(<path d={`M93 ${y} Q100 ${y + 6} 107 ${y}`} {...line(MINA_LIP, 2.6)} />, dimples);
  }
};

/* ——— Ollie, a snail: the newcomer. A spiral ——— */

const SNAIL = mix(C.accent, "#d9b8a0", 40);
const SNAIL_SHADE = mix(C.accentDeep, "#b08d74", 45);
const SHELL = C.primary;
const SHELL_SHADE = C.deep;

const OLLIE = cute("ollie", {
  k: 1.04,
  neck: 258,
  torso: "M86 186 Q100 180 114 186 L116 218 Q100 224 84 218 Z",
  headVB: "22 112 156 156",
});

function OllieBehind() {
  return (
    <g transform={UNFIT}>
      {/* the shell on its back, a spiral, peeking out to the right of its head */}
      <circle cx={146} cy={214} r={50} fill={SHELL_SHADE} />
      <circle cx={143} cy={211} r={48} fill={SHELL} />
      <path d="M143 211 m0 -7 a7 7 0 1 1 -7 7 a14 14 0 1 1 14 14 a24 24 0 1 1 -24 -24 a34 34 0 1 1 34 34" {...line(C.hi, 4.4)} />
      {/* its foot: a soft puddle with a tail to the right */}
      <path d="M40 284 Q36 260 66 256 L150 254 Q182 252 192 274 Q194 284 176 284 Z" fill={SNAIL_SHADE} />
      <path d="M44 282 Q40 262 68 258 L150 256 Q178 255 188 274 Q188 280 176 281 Z" fill={SNAIL} />
    </g>
  );
}

/** Its eyes ride on two stalks; the stalks droop when it is worried and stand up when it is
 *  delighted, the snail's own way of acting. */
const OLLIE_STALK: Partial<Record<Mood, number>> = { worried: 10, oops: 14, delighted: -6, happy: -3, curious: -4, thinking: 4 };

function OllieHead({ mood }: Ctx) {
  const d = (mood && OLLIE_STALK[mood]) ?? 2;
  return (
    <g>
      {sides.map(([side, s]) => (
        <path key={side} d={`M${mirror(s, 90)} 84 Q${mirror(s, 86 - d * 0.4)} ${66 + d * 0.3} ${mirror(s, 84)} ${50 + d * 0.2}`} {...line(SNAIL, 8)} />
      ))}
      <Two d={blob(100, 112, 40, 36, 1.08)} fill={SNAIL} shade={SNAIL_SHADE} k={2} />
      {/* its own blush, low on the cheeks */}
      <ellipse cx={72} cy={124} rx={7} ry={4.4} fill="#ff9fb5" opacity={0.55} />
      <ellipse cx={128} cy={124} rx={7} ry={4.4} fill="#ff9fb5" opacity={0.55} />
    </g>
  );
}

const ollieEyes = eyesOf({
  rx: 11,
  ry: 12.4,
  fill: INK,
  iris: { r: 8, color: mix(C.primary, INK, 50) },
  pupil: { r: 0 },
  shine: 3.6,
  lid: SNAIL,
  closed: INK,
  browY: 18,
  brow: dashBrow(SNAIL_SHADE, 3, 4),
  /* shy and careful: brows up at the middle */
  rest: { raise: 1, browTilt: 14, look: [0, 1] },
});

/** Ollie: a small soft mouth; it opens round and slow. */
const ollieMouth: MouthKit = ({ mood, y, viseme }) => {
  const c = SNAIL_SHADE;
  if (viseme) return talk(viseme, mood, y, { W: 9, H: 8, inside: MOUTH_IN, lip: c, lipW: 2.6 });
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 8, 6)} fill={MOUTH_IN} tongue={[100, y + 8.4, 4.2, 2.6]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 10, 9)} fill={MOUTH_IN} tongue={[100, y + 12, 5.4, 3.4]} />;
    case "curious":
      return <ellipse cx={101} cy={y + 2.4} rx={3.2} ry={4} fill={MOUTH_IN} />;
    case "oops":
      return <OpenMouth d={`M93 ${y + 4} Q100 ${y - 2} 107 ${y + 4} Q100 ${y + 2} 93 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "worried":
      return <path d={wave(y + 2, 6.4, 2.4)} {...line(c, 2.6)} />;
    case "thinking":
      return <path d={`M95 ${y + 2} Q101 ${y + 3} 107 ${y - 1}`} {...line(c, 2.6)} />;
    case "focused":
      return <path d={`M95 ${y + 1} L105 ${y + 1}`} {...line(c, 2.6)} />;
    case "wink":
      return <path d={`M93 ${y} Q100 ${y + 6} 107 ${y - 1}`} {...line(c, 2.6)} />;
    default:
      return <path d={`M94 ${y} Q100 ${y + 5} 106 ${y}`} {...line(c, 2.6)} />;
  }
};

/* ——— The cast ——— */

const NEW_FOUR: Candidate[] = [
  {
    id: "pond-marlowe",
    kind: "animal",
    frame: MARLOWE,
    outline: false,
    attitude: {
      mood: "neutral",
      tilt: -4,
      hands: { L: [78, 212], R: [122, 212], outL: true, outR: true },
    },
    label: "Marlowe",
    signature: "A tall, thin old heron with a long yellow beak and two plumes trailing back — his neck stretches",
    pitch:
      "The grown-up who keeps the pond school: tall, thin, patient and dry, the one tall shape in a cast of round ones. Wants the young ones to slow down and look properly; the flaw is that he takes so long to say it that they've usually run off. At rest he stands with his wings folded, lids half down, one brow a little higher than the other. Species-true: a long dagger of a beak (held off to one side so it reads face-on), a white face and neck front, a black stripe over the eye that runs back into two long plumes, yellow eyes, long thin legs. His ability is Long reach: his neck stretches to reach anything, anywhere.",
    risk: "Dry, never cold: on an incorrect answer he is the gentlest of all. The beak must never point at the learner.",
    pal: pal(HERON, HERON, { skin: FACE, skinShade: HERON_SHADE, limb: HERON, paw: HERON, shoe: mix(C.accentDeep, "#8a7a62", 50), blush: "#f3a0b0" }),
    body: HERON,
    face: face({ eyeY: 104, eyeGap: 16, mouthY: 122, lid: HERON, kit: marloweEyes, mouthKit: marloweMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    head: () => <MarloweHead />,
    pendant: () => <MarloweNeck />,
    /* folded wings down his sides, their flight feathers ending in points; his arms are the same
       grey, so at rest they lie in the wings and only show when he gestures */
    belly: () => (
      <g fill={HERON_SHADE}>
        {sides.map(([side, s]) => (
          <path key={side} d={`M${mirror(s, 82)} 156 Q${mirror(s, 72)} 182 ${mirror(s, 78)} 212 L${mirror(s, 84)} 204 L${mirror(s, 88)} 214 L${mirror(s, 92)} 202 Q${mirror(s, 88)} 182 ${mirror(s, 90)} 160 Z`} />
        ))}
      </g>
    ),
  },
  {
    id: "pond-ines",
    kind: "human",
    frame: INES,
    outline: false,
    hands: "mitten",
    attitude: {
      mood: "neutral",
      tilt: -6,
      /* balancing on one leg, the other knee up, arms out like on a beam */
      hands: { L: [36, 150], R: [164, 150], outL: true, outR: true },
      motion: { hipR: [{ rotate: "-78deg" }, { rotate: "-78deg" }], kneeR: [{ rotate: "128deg" }, { rotate: "128deg" }] },
    },
    label: "Ines",
    signature: "A girl acrobat of about twelve with a high bun and a ribbon, balancing on one leg — she stretches",
    pitch:
      "Fearless and showy, about twelve: the oldest of the young ones and the first to try anything. Wants to be watched; the flaw is that she can't do anything without turning it into a show. At rest she balances on one leg, the other knee up, arms out as if on a beam — head tipped, a lopsided smirk, brows arched. Her hair is pulled back smooth into a high bun with a ribbon, and one curl has escaped. Her ability is Stretch: she bends like rubber — into a bridge, a knot, a shape no one else can make.",
    risk: "Showy, never showing off at anyone's expense: she spots the others, hands out and ready. Stretching stays playful, never contortion that looks painful.",
    pal: palInes,
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 116, eyeGap: 17, mouthY: 134, nose: "dot", lid: INES_SKIN, kit: inesEyes, mouthKit: inesMouth }),
    outfit: "bare",
    outfits: PERSON_OUTFITS,
    headBack: () => <InesBack />,
    head: () => <InesHead />,
  },
  {
    id: "pond-mina",
    kind: "human",
    frame: MINA,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: 8, hands: { L: [96, 186], R: [104, 186], outL: false, outR: false } },
    label: "Mina",
    signature: "A girl of about eight with two puffy bunches and a raincoat, giggling — her giggle is catching",
    pitch:
      "Comes to the pond after school: the learner's age, and the learner's friend. Wants everyone to be friends; the flaw is that she giggles at exactly the wrong moment. At rest: hands together under her chin, head tipped, mid-giggle. Two puffy bunches with bobbles that bounce, a straight-cut fringe that's a little uneven, freckles across her nose, dimples, a raincoat and wellies for the pond. Her ability is Giggle: a laugh so catching that everyone round her joins in.",
    risk: "Her giggle is never at the learner, and never on an incorrect answer.",
    pal: palMina,
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 18, mouthY: 137, nose: "dot", lid: MINA_SKIN, kit: minaEyes, mouthKit: minaMouth }),
    outfit: "raincoat",
    outfits: PERSON_OUTFITS,
    headBack: () => <MinaBack />,
    head: () => <MinaHead />,
  },
  {
    id: "pond-ollie",
    kind: "animal",
    frame: OLLIE,
    legs: false,
    arms: false,
    outline: false,
    attitude: { mood: "neutral", tilt: 6 },
    label: "Ollie",
    signature: "A small snail with a big spiral shell and eyes on stalks — it tucks in",
    pitch:
      "The newcomer — new to the pond this term, slow and careful, like a learner on the first page. Wants to keep up and to be asked along; the flaw is that it hides in its shell before anyone can ask. At rest it looks up with its head on one side, brows worried in the middle. Its eyes ride on two stalks that stand up when it is delighted and droop when it is worried; a big spiral shell in the scheme's colour with an accent band; a soft foot. Its ability is Tuck: it pulls into its shell and peeks out.",
    risk: "Slow is never a joke at its expense: the others wait for it. No arms, so its stalks, eyes and brows carry all its acting.",
    pal: pal(SNAIL, SNAIL, { skin: SNAIL, skinShade: SNAIL_SHADE, limb: SNAIL, paw: SNAIL, blush: "transparent" }),
    body: SNAIL,
    face: face({ eyeY: 50, eyeGap: 16, mouthY: 124, lid: SNAIL, kit: ollieEyes, mouthKit: ollieMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    behind: () => <OllieBehind />,
    head: (c) => <OllieHead {...c} />,
  },
];

/** The Lantern Pond cast in the studio's order: the grown-up, the bossy one, the girls, the
 *  sleepy one, the newcomer. */
export const POND: Candidate[] = [NEW_FOUR[0], GARDEN[0], NEW_FOUR[1], NEW_FOUR[2], GARDEN[1], NEW_FOUR[3]];

