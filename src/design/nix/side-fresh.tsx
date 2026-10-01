import type { Candidate } from "./candidates";
import { EYE_WHITE, line } from "./rig/eyes";
import {
  arcBrow,
  blob,
  cute,
  eyesOf,
  face,
  INK,
  mix,
  mouthOf,
  person,
  PERSON_OUTFITS,
  Two,
} from "./side-kit";
import { C } from "./theme";

/**
 * Fresh candidates to shortlist against: Arjun, a boy of about ten; Tilly, a girl of about six;
 * Theo, the pond warden, a young man. (Four animals drawn with them — Crumb, Willow, Biscuit,
 * Hazel — were removed: they looked alike.) Drawn on the cute frame to
 * `docs/character-guidelines.md`, each with its own eyes and mouth (which also talks). Static
 * figures and faces only, until some are picked.
 */

/* ——— Arjun, a boy of about ten: curious, knows a fact about everything ——— */

const ARJUN_SKIN = "#a8704a";
const ARJUN_SHADE = "#8a5634";
const ARJUN_HAIR = "#1d1a24";

const ARJUN = cute("arjun", { k: 1.46, neck: 200, torso: "M84 150 Q100 146 116 150 Q124 156 123 172 L121 210 Q120 222 100 222 Q80 222 79 210 L77 172 Q76 156 84 150 Z", headVB: "14 22 172 172" });

function ArjunHead() {
  return (
    <g>
      <circle cx={58} cy={118} r={7} fill={ARJUN_SKIN} />
      <circle cx={142} cy={118} r={7} fill={ARJUN_SKIN} />
      <Two d={blob(100, 114, 41, 39, 1.06)} fill={ARJUN_SKIN} shade={ARJUN_SHADE} k={2.2} />
      {/* neat hair, a side parting, and the one tuft at the crown that won't lie flat */}
      <path d="M58 104 C56 68 80 58 102 58 C126 58 146 70 142 104 C138 90 130 82 118 78 L112 86 C96 84 76 90 58 104 Z" fill={ARJUN_HAIR} />
      <path d="M104 58 C102 48 110 42 116 46" {...line(ARJUN_HAIR, 4)} />
    </g>
  );
}

/** Over his eyes: big round spectacles. */
function ArjunTop() {
  return (
    <g {...line(C.deep, 3)}>
      <circle cx={82} cy={118} r={13} fill={EYE_WHITE} fillOpacity={0.25} />
      <circle cx={118} cy={118} r={13} fill={EYE_WHITE} fillOpacity={0.25} />
      <path d="M95 116 Q100 112 105 116" />
    </g>
  );
}

const arjunEyes = eyesOf({ rx: 8, ry: 9, fill: EYE_WHITE, iris: { r: 6.2, color: "#3a2214" }, pupil: { r: 3.2 }, shine: 2.4, lid: ARJUN_SKIN, closed: INK, browY: 19, brow: arcBrow(ARJUN_HAIR, 3.6, 6), rest: { raise: 4, browTilt: -4, look: [0, -1] } });

/* ——— Tilly, a girl of about six: the littlest, in a dinosaur hoodie ——— */

const TILLY_SKIN = "#f3cfae";
const TILLY_SHADE = "#e0ae88";
const TILLY_HAIR = "#d8a04a";

const TILLY = cute("tilly", { k: 1.6, neck: 204, torso: "M84 152 Q100 148 116 152 Q124 160 123 178 L121 212 Q120 222 100 222 Q80 222 79 212 L77 178 Q76 160 84 152 Z", headVB: "6 6 188 188" });

/** Her hood is up: a dinosaur hood in the clothes colour, with soft spikes down its crown. */
function TillyBack() {
  return (
    <g>
      <g fill={C.accentDeep}>
        {[
          [64, 72],
          [80, 56],
          [100, 50],
          [120, 56],
          [136, 72],
        ].map(([x, y]) => (
          <path key={x} d={`M${x - 8} ${y + 8} Q${x} ${y - 12} ${x + 8} ${y + 8} Z`} />
        ))}
      </g>
      <path d={blob(100, 108, 52, 50, 1.04)} fill={C.clothes} />
    </g>
  );
}

function TillyHead() {
  return (
    <g>
      <Two d={blob(100, 118, 38, 35, 1.1)} fill={TILLY_SKIN} shade={TILLY_SHADE} k={2} />
      {/* a fringe peeking from under the hood, and the hood's edge round her face */}
      <path d="M68 104 Q84 90 100 96 Q116 90 132 104 Q122 98 112 102 Q100 96 88 102 Q78 98 68 104 Z" fill={TILLY_HAIR} />
      <path d={blob(100, 118, 40, 37, 1.1)} fill="none" stroke={C.clothes} strokeWidth={5} />
    </g>
  );
}

const tillyEyes = eyesOf({ rx: 10, ry: 11.6, fill: EYE_WHITE, iris: { r: 8.6, color: "#3e6a8a" }, pupil: { r: 4.4 }, shine: 3.4, lid: TILLY_SKIN, rim: { color: INK, w: 2.4, lashes: 1 }, closed: INK, browY: 17, brow: arcBrow(TILLY_HAIR, 3, 5), rest: { raise: 3, look: [0, -1] } });

/* ——— Theo, the pond warden: a young man, kind, a little clumsy ——— */

const THEO_SKIN = "#d9a07a";
const THEO_SHADE = "#bd8258";
const THEO_HAIR = "#6a3e24";

const THEO = cute("theo", {
  k: 1.2,
  neck: 184,
  torso: "M80 148 Q100 140 120 148 Q130 158 129 178 L126 214 Q124 224 100 224 Q76 224 74 214 L71 178 Q70 158 80 148 Z",
  w: { upper: 13, fore: 12, thigh: 14, shin: 13, hand: 8, cloth: 1.1 },
  j: { shoulderL: [82, 198], elbowL: [76, 216], wristL: [73, 234], shoulderR: [118, 198], elbowR: [124, 216], wristR: [127, 234], hipL: [91, 246], kneeL: [90, 260], footL: [89, 273], hipR: [109, 246], kneeR: [110, 260], footR: [111, 273] },
  headVB: "24 40 152 152",
});

function TheoHead() {
  return (
    <g>
      <circle cx={60} cy={116} r={6.4} fill={THEO_SKIN} />
      <circle cx={140} cy={116} r={6.4} fill={THEO_SKIN} />
      <Two d={blob(100, 112, 39, 38, 1.04)} fill={THEO_SKIN} shade={THEO_SHADE} k={2} />
      {/* a short soft beard along his jaw, sideburns, and a beanie with a bobble */}
      <path d="M62 116 Q62 150 100 152 Q138 150 138 116 Q132 136 118 138 Q108 132 100 134 Q92 132 82 138 Q68 136 62 116 Z" fill={THEO_HAIR} />
      <path d="M58 98 C58 62 80 52 100 52 C120 52 142 62 142 98 Z" fill={C.accent} />
      <path d="M56 98 L144 98" {...line(C.accentDeep, 8)} />
      <circle cx={100} cy={48} r={10} fill={C.accentDeep} />
    </g>
  );
}

const theoEyes = eyesOf({ rx: 7.4, ry: 8.2, fill: EYE_WHITE, iris: { r: 5.8, color: "#4a6a4a" }, pupil: { r: 2.8 }, shine: 2.2, lid: THEO_SKIN, closed: INK, browY: 14, brow: arcBrow(THEO_HAIR, 4, 6.4), rest: { raise: 2, browTilt: 6, bottom: 0.1 } });

/* ——— The candidates ——— */

export const FRESH: Candidate[] = [
  {
    id: "fresh-arjun",
    kind: "human",
    frame: ARJUN,
    outline: false,
    hands: "mitten",
    attitude: { mood: "curious", tilt: 6, hands: { L: [78, 202], R: [128, 150], outL: true, outR: true } },
    label: "Arjun",
    signature: "A boy of about ten in big round spectacles, one finger up — he spins",
    pitch: "Curious, knows a fact about everything and can't not share it; wants to be asked. At rest, one finger up mid-fact, brows high. Neat hair with one tuft at the crown that won't lie flat. Ability: Spin — spins on one heel like a top when an idea lands.",
    risk: "A know-it-all who is never a show-off at the learner's expense.",
    pal: person(ARJUN_SKIN, ARJUN_SHADE, ARJUN_HAIR, "#4a4458"),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 18, mouthY: 138, nose: "dot", lid: ARJUN_SKIN, kit: arjunEyes, mouthKit: mouthOf({ lip: "#6a3424", W: 7.6, H: 7, teeth: true }) }),
    outfit: "blazer",
    outfits: PERSON_OUTFITS,
    head: () => <ArjunHead />,
    top: () => <ArjunTop />,
  },
  {
    id: "fresh-tilly",
    kind: "human",
    frame: TILLY,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: -8, hands: { L: [70, 180], R: [130, 180], outL: true, outR: true } },
    label: "Tilly",
    signature: "The littlest, about six, in a dinosaur hoodie with the hood up — she roars",
    pitch: "The littlest, and very sure she is a dinosaur: wants to keep up with the big ones; the flaw is that she won't take the hood off. At rest, claws up, grinning. Ability: Roar — a tiny dinosaur roar that surprises everyone, every time.",
    risk: "A roar that is funny, never frightening; never aimed at a wrong answer.",
    pal: person(TILLY_SKIN, TILLY_SHADE, TILLY_HAIR, "#f0c070"),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 122, eyeGap: 17, mouthY: 140, nose: "dot", lid: TILLY_SKIN, kit: tillyEyes, mouthKit: mouthOf({ lip: "#c06a5a", W: 7, H: 7, teeth: true }) }),
    outfit: "bare",
    outfits: PERSON_OUTFITS,
    headBack: () => <TillyBack />,
    head: () => <TillyHead />,
  },
  {
    id: "fresh-theo",
    kind: "human",
    frame: THEO,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: 4, hands: { L: [80, 204], R: [136, 150], outL: true, outR: true } },
    label: "Theo",
    signature: "The pond warden, a young man in a bobble beanie with a soft beard — he whistles",
    pitch: "Kind, outdoorsy, a little clumsy: looks after the pond and everyone at it; wants the young ones to love it as he does; the flaw is that he trips over his own wellies. At rest, waving. Ability: Whistle — calls the ducks in, every one of them.",
    risk: "A grown-up who is never in charge of the learner, only of the pond.",
    pal: person(THEO_SKIN, THEO_SHADE, THEO_HAIR, "#8a5a3a"),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 114, eyeGap: 17, mouthY: 132, nose: "dot", lid: THEO_SKIN, kit: theoEyes, mouthKit: mouthOf({ lip: "#8a4a3a", W: 8, H: 7, teeth: true }) }),
    outfit: "dungarees",
    outfits: PERSON_OUTFITS,
    head: () => <TheoHead />,
  },
];

