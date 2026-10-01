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
} from "./side-kit";
import type { Mood } from "./rig/face";
import { EYE_WHITE, line, OpenMouth, TONGUE_PINK, turnAt, type MouthKit } from "./rig/eyes";
import { pivot } from "./rig/skeleton";
import { SHAPE } from "./rig/visemes";
import { GARDEN } from "./side-garden";
import { C } from "./theme";

/**
 * Lantern Pond (`docs/world.md`): a pond at the edge of town where everyone gathers at dusk, and
 * Wisp lights the lily lanterns along the bank. Bun and Bean are in `side-garden.tsx`; this file
 * draws Ines, a girl acrobat, and Mina, a girl of about eight, on the cute frame, to `docs/character-guidelines.md`.
 */

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

/* ——— The cast ——— */

const NEW_FOUR: Candidate[] = [
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
];

/** Ines and Mina, drawn here; with Bun and Bean (`side-garden.tsx`) the pond four of the
 *  shortlist. */
export const POND: Candidate[] = [GARDEN[0], NEW_FOUR[0], NEW_FOUR[1], GARDEN[1]];
