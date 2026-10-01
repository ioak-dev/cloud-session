import type { Candidate } from "./candidates";
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
import { EYE_WHITE, line, OpenMouth, TONGUE_PINK, turnAt, type MouthKit } from "./rig/eyes";
import { pivot } from "./rig/skeleton";
import { SHAPE } from "./rig/visemes";
import { GARDEN } from "./side-garden";
import { C } from "./theme";

/**
 * Lantern Pond (`docs/world.md`): a pond at the edge of town where everyone gathers at dusk, and
 * Wisp lights the lily lanterns along the bank. Bun and Bean are in `side-garden.tsx`; this file
 * draws the other four — Otis, a moose; Ines, a girl acrobat; Mina, a girl of about eight; Noodle,
 * a platypus kit — on the cute frame, to `docs/character-guidelines.md`.
 */

/* ——— Otis, a moose: the grown-up who keeps the pond school. A gentle giant ——— */

const MOOSE = mix(C.deep, "#86593f", 28);
const MOOSE_SHADE = mix(C.deep, "#553626", 30);
const MOOSE_MUZZLE = mix(C.soft, "#d9b496", 35);
const MOOSE_NOSE = mix(C.deep, "#6e4636", 28);
const ANTLER = "#ece0c6";
const ANTLER_SHADE = "#cdbb97";
const MOOSE_BROW = "#efe4cf";

const OTIS = cute("otis", {
  k: 1.26,
  neck: 196,
  torso: "M72 150 Q100 136 128 150 Q144 166 142 194 Q138 224 100 224 Q62 224 58 194 Q56 166 72 150 Z",
  w: { upper: 14, fore: 12, thigh: 11, shin: 9.5, hand: 7.6, cloth: 1.2 },
  j: {
    earL: [76, 82],
    earR: [124, 82],
    shoulderL: [80, 206],
    elbowL: [74, 222],
    wristL: [72, 238],
    shoulderR: [120, 206],
    elbowR: [126, 222],
    wristR: [128, 238],
    hipL: [88, 244],
    kneeL: [87, 259],
    footL: [86, 273],
    hipR: [112, 244],
    kneeR: [113, 259],
    footR: [114, 273],
  },
  headVB: "4 22 192 192",
});

/** One broad, flat antler with rounded tines along its top edge; drawn for the left, mirrored. */
function Antler({ s }: { s: -1 | 1 }) {
  const m = (x: number) => mirror(s, x);
  const d = `M${m(82)} 82 C${m(76)} 74 ${m(68)} 68 ${m(60)} 64 C${m(48)} 66 ${m(36)} 62 ${m(30)} 52 C${m(36)} 52 ${m(40)} 50 ${m(40)} 44 C${m(46)} 48 ${m(50)} 46 ${m(50)} 38 C${m(56)} 44 ${m(60)} 42 ${m(62)} 34 C${m(68)} 42 ${m(70)} 50 ${m(70)} 56 C${m(76)} 62 ${m(82)} 70 ${m(88)} 78 Z`;
  return (
    <g>
      <path d={d} fill={ANTLER_SHADE} transform={`translate(${s * -1.4} 1.6)`} />
      <path d={d} fill={ANTLER} />
    </g>
  );
}

function OtisHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, OTIS.j)}>
          <Antler s={s} />
          {/* a long soft ear under each antler */}
          <path d={`M${mirror(s, 72)} 92 Q${mirror(s, 52)} 86 ${mirror(s, 46)} 96 Q${mirror(s, 56)} 104 ${mirror(s, 72)} 102 Z`} fill={MOOSE_SHADE} />
          <path d={`M${mirror(s, 70)} 94 Q${mirror(s, 56)} 90 ${mirror(s, 51)} 96 Q${mirror(s, 58)} 100 ${mirror(s, 70)} 100 Z`} fill={MOOSE_MUZZLE} />
        </g>
      ))}
      {/* the brow, then the long drooping muzzle, then the big soft nose that overhangs it */}
      <Two d={blob(100, 100, 32, 28, 1.02)} fill={MOOSE} shade={MOOSE_SHADE} k={2} />
      <Two d="M72 100 C70 122 74 140 82 150 C90 158 110 158 118 150 C126 140 130 122 128 100 Z" fill={MOOSE} shade={MOOSE_SHADE} k={1.6} />
      <path d={blob(100, 146, 23, 14, 1.06)} fill={MOOSE_NOSE} />
      <path d={blob(99, 144, 21, 12, 1.06)} fill={MOOSE_MUZZLE} />
      <path d="M90 139 q-3 2 -1 5 M110 139 q3 2 1 5" {...line(MOOSE_NOSE, 2.6)} />
      {/* the bell of fur under his chin */}
      <path d="M96 164 Q94 176 100 180 Q106 176 104 164 Z" fill={MOOSE_SHADE} />
    </g>
  );
}

const otisEyes = eyesOf({
  rx: 7.6,
  ry: 8.6,
  fill: INK,
  iris: { r: 5.8, color: mix(C.accentDeep, "#6b4a3a", 50) },
  pupil: { r: 0 },
  shine: 2.4,
  lid: MOOSE,
  closed: MOOSE_BROW,
  browY: 14,
  /* big shaggy pale brows, easy to read on dark fur */
  brow: ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return (
      <path
        d={`M${x - 9} ${by + 2.6} Q${x - 4} ${by - 4} ${x + 3} ${by - 3} Q${x + 8} ${by - 3.4} ${x + 10} ${by + 1} Q${x + 2} ${by + 1} ${x - 9} ${by + 2.6} Z`}
        fill={MOOSE_BROW}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  },
  /* calm: lids half down, brows soft */
  rest: { top: 0.34, raise: 1, browTilt: 6 },
});

/** Otis: a wide soft mouth under his nose; it talks slowly and smiles with one side first. */
const otisMouth: MouthKit = ({ mood, y, viseme }) => {
  if (viseme) return talk(viseme, mood, y, { W: 11, H: 7, inside: MOUTH_IN, lip: MOOSE_NOSE, lipW: 2.6, teeth: EYE_WHITE });
  const c = MOOSE_NOSE;
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 10, 5)} fill={MOUTH_IN} tongue={[100, y + 7, 4.6, 2.4]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 12, 8)} fill={MOUTH_IN} teeth={[92, y - 2, 16, 3]} tongue={[100, y + 11, 5.4, 3]} />;
    case "curious":
      return <ellipse cx={101} cy={y + 2} rx={3} ry={3.6} fill={MOUTH_IN} />;
    case "thinking":
      return <path d={`M92 ${y + 1} Q100 ${y + 2} 110 ${y - 2}`} {...line(c, 2.6)} />;
    case "focused":
      return <path d={`M93 ${y + 1} L107 ${y + 1}`} {...line(c, 2.6)} />;
    case "worried":
      return <path d={wave(y + 2, 8, 2.4)} {...line(c, 2.6)} />;
    case "oops":
      return <OpenMouth d={`M92 ${y + 4} Q100 ${y - 3} 108 ${y + 4} Q100 ${y + 2} 92 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "wink":
      return <path d={`M90 ${y} Q100 ${y + 6} 110 ${y - 2}`} {...line(c, 2.6)} />;
    default:
      /* a slow half-smile, the right side first */
      return <path d={`M91 ${y + 1} Q100 ${y + 4} 109 ${y - 1.6}`} {...line(c, 2.6)} />;
  }
};

/* ——— Ines, a girl acrobat of about twelve: fearless and showy ——— */

const INES_SKIN = "#b9774c";
const INES_SHADE = "#9a5d36";
const INES_HAIR = "#3d2636";
const INES_HAIR_HI = "#7a5670";
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
const MINA_HAIR = "#5c3521";
const MINA_HAIR_HI = "#94603f";
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

/* ——— Noodle, a platypus kit: the newcomer. A bit of everything ——— */

const PLAT = mix(C.accentDeep, "#8a5a3c", 40);
const PLAT_SHADE = mix(C.accentDeep, "#5e3a26", 40);
const PLAT_LIGHT = mix(C.accent, "#f1dcc0", 35);
const BILL = mix(C.deep, "#3e4452", 50);
const BILL_LIGHT = mix(C.primary, "#6a7284", 45);

const NOODLE = cute("noodle", {
  k: 1.42,
  neck: 206,
  torso: "M78 152 Q100 142 122 152 Q136 166 134 194 Q130 224 100 224 Q70 224 66 194 Q64 166 78 152 Z",
  w: { upper: 13, fore: 12, thigh: 15, shin: 14, hand: 8.6, cloth: 1.15 },
  j: { tail: [100, 256] },
  headVB: "14 36 172 172",
});

function NoodleHead() {
  return (
    <g>
      <Two d={blob(100, 108, 41, 37, 1.08)} fill={PLAT} shade={PLAT_SHADE} k={2.2} />
      {/* a tuft on top, and the pale patches round its eyes */}
      <path d="M92 74 Q94 64 100 70 Q104 62 108 72" fill={PLAT} />
      <ellipse cx={81} cy={104} rx={12} ry={11} fill={PLAT_LIGHT} />
      <ellipse cx={119} cy={104} rx={12} ry={11} fill={PLAT_LIGHT} />
    </g>
  );
}

function NoodleBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", NOODLE.j)}>
        {/* a flat paddle of a tail, out to the right */}
        <ellipse cx={142} cy={262} rx={30} ry={14} fill={PLAT_SHADE} transform="rotate(-12 142 262)" />
        <ellipse cx={140} cy={259} rx={28} ry={12} fill={PLAT} transform="rotate(-12 140 259)" />
        <path d="M122 260 L156 252 M126 266 L160 258" {...line(PLAT_SHADE, 1.6)} opacity={0.6} />
      </g>
    </g>
  );
}

const noodleEyes = eyesOf({
  rx: 8.6,
  ry: 9.8,
  fill: INK,
  iris: { r: 6.4, color: mix(C.primary, INK, 55) },
  pupil: { r: 0 },
  shine: 3.2,
  lid: PLAT_LIGHT,
  closed: INK,
  browY: 15,
  brow: dashBrow(PLAT_SHADE, 3, 4.4),
  /* unsure: brows up at the middle, looking up at you */
  rest: { raise: 1, browTilt: 12, look: [0.6, -1.2] },
});

/** Noodle's bill is its mouth: a wide, flat, rounded duck's bill. It talks by opening it — the
 *  lower half drops — and smiles at the corners where the bill meets its cheeks. */
const noodleMouth: MouthKit = ({ mood, y, viseme }) => {
  const bill = (open: number, smile = 0, wide = 1) => {
    const w = 26 * wide;
    return (
      <g>
        {open > 0.5 && <path d={`M${100 - w + 3} ${y} Q100 ${y + 2} ${100 + w - 3} ${y} L${100 + w - 6} ${y + open} Q100 ${y + open + 4} ${100 - w + 6} ${y + open} Z`} fill={MOUTH_IN} />}
        {/* lower bill */}
        <path d={`M${100 - w + 2} ${y + open} Q100 ${y + open + 12} ${100 + w - 2} ${y + open} Q100 ${y + open + 4} ${100 - w + 2} ${y + open} Z`} fill={BILL} />
        {/* upper bill, wider at the tip, with its nostrils */}
        <path d={`M${100 - w} ${y - smile} C${100 - w - 2} ${y - 14} ${100 - w * 0.5} ${y - 18} 100 ${y - 18} C${100 + w * 0.5} ${y - 18} ${100 + w + 2} ${y - 14} ${100 + w} ${y - smile} Q100 ${y + 4} ${100 - w} ${y - smile} Z`} fill={BILL_LIGHT} />
        <ellipse cx={95} cy={y - 12} rx={1.6} ry={1.2} fill={BILL} />
        <ellipse cx={105} cy={y - 12} rx={1.6} ry={1.2} fill={BILL} />
      </g>
    );
  };
  if (viseme) {
    const sh = SHAPE[viseme];
    return bill(sh.h * 9, (SMILE[mood] ?? 0) * 0.8, sh.round ? 0.86 : 1);
  }
  switch (mood) {
    case "happy":
      return bill(3, 3);
    case "delighted":
      return bill(8, 4);
    case "curious":
      return bill(3, 0, 0.9);
    case "thinking":
      return bill(0, -1);
    case "focused":
      return bill(0, -2);
    case "worried":
      return bill(1.6, -3, 0.94);
    case "oops":
      return bill(5, -2, 0.94);
    case "wink":
      return bill(1.6, 3);
    default:
      return bill(0, 1);
  }
};

/* ——— The cast ——— */

const NEW_FOUR: Candidate[] = [
  {
    id: "pond-otis",
    kind: "animal",
    frame: OTIS,
    outline: false,
    attitude: { mood: "neutral", tilt: -5, hands: { L: [80, 206], R: [120, 206], outL: true, outR: true } },
    label: "Otis",
    signature: "A big, gentle moose with broad antlers and a soft drooping nose — he wades",
    pitch:
      "The grown-up who keeps the pond school: the biggest of them, and the gentlest. Wants everyone to take their time; the flaw is that he takes all of his — by the time he has finished a sentence the young ones have run off, so he says the end of it to whoever is left. At rest he stands calm and square, lids half down, a slow half-smile starting on one side. Species-true: two broad flat antlers with rounded tines (his silhouette), long soft ears under them, a long muzzle with a big overhanging nose, the bell of fur under his chin, long legs. Shaggy pale brows do most of his acting. His ability is Wade: he walks out where the water is too deep for anyone else, calm as anything.",
    risk: "Big, never looming: he crouches to the little ones' height. On an incorrect answer he is the gentlest of all.",
    pal: pal(MOOSE, MOOSE_SHADE, { skin: MOOSE, skinShade: MOOSE_SHADE, limb: MOOSE, paw: MOOSE_SHADE, shoe: MOOSE_SHADE, blush: "#e98f9c" }),
    body: MOOSE,
    face: face({ eyeY: 98, eyeGap: 15, mouthY: 150, lid: MOOSE, kit: otisEyes, mouthKit: otisMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    head: () => <OtisHead />,
    belly: () => <ellipse cx={100} cy={192} rx={22} ry={24} fill={MOOSE_MUZZLE} opacity={0.6} />,
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
      /* a star jump: arms and legs flung out, as if she has just landed it */
      hands: { L: [24, 150], R: [176, 150], outL: true, outR: true },
      motion: { hipL: [{ rotate: "24deg" }, { rotate: "24deg" }], hipR: [{ rotate: "-24deg" }, { rotate: "-24deg" }] },
    },
    label: "Ines",
    signature: "A girl acrobat of about twelve with a high bun and a ribbon, arms and legs flung out in a star — she stretches",
    pitch:
      "Fearless and showy, about twelve: the oldest of the young ones and the first to try anything. Wants to be watched; the flaw is that she can't do anything without turning it into a show. At rest she is in a star jump, arms and legs flung out as if she has just landed it — head tipped, a lopsided smirk, brows arched. Her hair is pulled back smooth into a high bun with a ribbon, and one curl has escaped. Her ability is Stretch: she bends like rubber — into a bridge, a knot, a shape no one else can make.",
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
    id: "pond-noodle",
    kind: "animal",
    frame: NOODLE,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: 8, hands: { L: [78, 210], R: [122, 210], outL: true, outR: true } },
    label: "Noodle",
    signature: "A small round platypus kit with a big flat bill and a paddle tail — its bill tingles",
    pitch:
      "The newcomer — new to the pond this term, like the learner on the first page. A bit of everything: a duck's bill, a beaver's tail, an otter's fur, webbed feet. Wants to know where it fits; the flaw is that it is sure it doesn't, so it asks before it tries. At rest it looks up at you, brows worried in the middle, paws together. Pale patches round its eyes, a tuft on top, a cream belly. Its bill is its mouth: it opens to talk and turns up at the corners to smile. Its ability is Tingle: its bill tingles when something is nearby — it knows before anyone sees.",
    risk: "Unsure, never sad: its stake is belonging, and the others always make room. Being a mix is the joke it learns to love, never one made at it.",
    pal: pal(PLAT, BILL, { skin: PLAT, skinShade: PLAT_SHADE, limb: PLAT, paw: BILL, shoe: BILL, blush: "#ff9fb5" }),
    body: PLAT,
    face: face({ eyeY: 104, eyeGap: 19, mouthY: 136, lid: PLAT_LIGHT, kit: noodleEyes, mouthKit: noodleMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <NoodleBehind />,
    belly: () => <ellipse cx={100} cy={192} rx={20} ry={23} fill={PLAT_LIGHT} />,
    head: () => <NoodleHead />,
  },
];

/** The Lantern Pond cast in the studio's order: the grown-up, the bossy one, the girls, the
 *  sleepy one, the newcomer. */
export const POND: Candidate[] = [NEW_FOUR[0], GARDEN[0], NEW_FOUR[1], NEW_FOUR[2], GARDEN[1], NEW_FOUR[3]];

