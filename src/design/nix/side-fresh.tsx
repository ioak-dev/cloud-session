import type { Candidate, Ctx } from "./candidates";
import { EYE_WHITE, line } from "./rig/eyes";
import { pivot } from "./rig/skeleton";
import {
  ANIMAL_OUTFITS,
  arcBrow,
  blob,
  cute,
  dashBrow,
  eyesOf,
  face,
  INK,
  mirror,
  mix,
  mouthOf,
  pal,
  person,
  PERSON_OUTFITS,
  PINK,
  sides,
  Taper,
  Two,
  UNFIT,
} from "./side-kit";
import { C } from "./theme";

/**
 * Fresh candidates to shortlist against: four animals — Crumb, a mouse; Willow, a fawn; Biscuit,
 * a corgi pup; Hazel, a squirrel — and three people — Arjun, a boy of about ten; Tilly, a girl of
 * about six; Theo, the pond warden, a young man. Drawn on the cute frame to
 * `docs/character-guidelines.md`, each with its own eyes and mouth (which also talks). Static
 * figures and faces only, until some are picked.
 */

/* ——— Crumb, a mouse: the smallest, and the bravest about it ——— */

const MOUSE = mix(C.hi, "#b4a79d", 45);
const MOUSE_SHADE = mix(C.deep, "#7d6e64", 40);
const MOUSE_LIGHT = "#f4ece4";

const CRUMB = cute("crumb", { k: 1.52, neck: 210, torso: "M84 156 Q100 150 116 156 Q124 166 123 190 Q121 220 100 220 Q79 220 77 190 Q76 166 84 156 Z", j: { earL: [70, 80], earR: [130, 80], tail: [110, 252] }, headVB: "4 26 192 192" });

function CrumbHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, CRUMB.j)}>
          {/* big ears, tipped out like satellite dishes, never round circles on top */}
          <ellipse cx={mirror(s, 56)} cy={76} rx={26} ry={22} transform={`rotate(${s * 28} ${mirror(s, 56)} 76)`} fill={MOUSE_SHADE} />
          <ellipse cx={mirror(s, 57)} cy={76} rx={18} ry={15} transform={`rotate(${s * 28} ${mirror(s, 57)} 76)`} fill={PINK} opacity={0.8} />
        </g>
      ))}
      <Two d={blob(100, 116, 38, 35, 1.12)} fill={MOUSE} shade={MOUSE_SHADE} k={2} />
      <path d={blob(100, 132, 20, 13, 1.04)} fill={MOUSE_LIGHT} />
      <circle cx={100} cy={128} r={4} fill={PINK} />
      <g {...line(MOUSE_SHADE, 1.3)}>
        <path d="M84 132 L64 128 M84 136 L66 140 M116 132 L136 128 M116 136 L134 140" />
      </g>
    </g>
  );
}

function CrumbBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", CRUMB.j)}>
        <Taper segs={[[[112, 256], [150, 270], [170, 240], [156, 222]], [[156, 222], [146, 210], [134, 222], [144, 228]]]} w0={5} w1={3} fill={PINK} />
      </g>
    </g>
  );
}

const crumbEyes = eyesOf({ rx: 8.4, ry: 9.8, fill: INK, pupil: { r: 0 }, shine: 3, lid: MOUSE, closed: INK, browY: 15, brow: dashBrow(MOUSE_SHADE, 3, 4), rest: { raise: 3, browTilt: -6 } });

/* ——— Willow, a fawn: gentle, dreamy, all legs ——— */

const FAWN = mix(C.accentDeep, "#c48a58", 45);
const FAWN_SHADE = mix(C.deep, "#8a5c3a", 35);
const FAWN_LIGHT = "#f6e6d2";

const WILLOW = cute("willow", {
  k: 1.4,
  neck: 196,
  torso: "M84 150 Q100 144 116 150 Q126 160 125 182 Q122 214 100 216 Q78 214 75 182 Q74 160 84 150 Z",
  w: { upper: 10, fore: 9, thigh: 9, shin: 7.6, hand: 6.4, cloth: 0.9 },
  j: { earL: [70, 92], earR: [130, 92], hipL: [93, 244], kneeL: [92, 258], footL: [91, 273], hipR: [107, 244], kneeR: [108, 258], footR: [109, 273] },
  headVB: "8 18 184 184",
});

function WillowHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, WILLOW.j)}>
          <path d={`M${mirror(s, 72)} 92 Q${mirror(s, 40)} 78 ${mirror(s, 26)} 92 Q${mirror(s, 44)} 108 ${mirror(s, 72)} 104 Z`} fill={FAWN_SHADE} />
          <path d={`M${mirror(s, 70)} 94 Q${mirror(s, 46)} 84 ${mirror(s, 34)} 93 Q${mirror(s, 48)} 103 ${mirror(s, 70)} 101 Z`} fill={FAWN_LIGHT} />
        </g>
      ))}
      <Two d={blob(100, 112, 36, 36, 1.06)} fill={FAWN} shade={FAWN_SHADE} k={2} />
      {/* white dapples on her crown, a pale muzzle, a small dark nose */}
      {[
        [86, 84, 3],
        [102, 80, 2.6],
        [116, 86, 2.4],
        [94, 92, 2],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={FAWN_LIGHT} />
      ))}
      <path d={blob(100, 134, 17, 12, 1.04)} fill={FAWN_LIGHT} />
      <ellipse cx={100} cy={128} rx={5} ry={3.6} fill={INK} />
    </g>
  );
}

const willowEyes = eyesOf({
  rx: 9.4,
  ry: 11,
  fill: INK,
  iris: { r: 7, color: mix(C.accentDeep, "#4a2c1a", 40) },
  pupil: { r: 0 },
  shine: 3.2,
  lid: FAWN,
  rim: { color: INK, w: 2.6, lashes: 3 },
  closed: INK,
  browY: 16,
  brow: dashBrow(FAWN_SHADE, 2.6, 4),
  /* dreamy: lids a little down, looking off */
  rest: { top: 0.16, look: [-1.6, -1], raise: 2, browTilt: 6 },
});

/* ——— Biscuit, a corgi pup: loyal, bouncing, never stops wagging ——— */

const CORGI = mix(C.accent, "#e09a52", 45);
const CORGI_SHADE = mix(C.accentDeep, "#b06a32", 45);
const CORGI_WHITE = "#fbf3e8";

const BISCUIT = cute("biscuit", {
  k: 1.44,
  neck: 208,
  torso: "M76 154 Q100 144 124 154 Q138 168 136 194 Q132 222 100 222 Q68 222 64 194 Q62 168 76 154 Z",
  w: { upper: 12, fore: 11, thigh: 14, shin: 12, hand: 8, cloth: 1.1 },
  j: { earL: [74, 80], earR: [126, 80], tail: [112, 250], hipL: [88, 258], kneeL: [87, 266], footL: [86, 273], hipR: [112, 258], kneeR: [113, 266], footR: [114, 273] },
  headVB: "8 12 184 184",
});

function BiscuitHead({ mood }: Ctx) {
  /* its ears are its mood: up and forward when happy, back when worried */
  const tilt = mood === "worried" || mood === "oops" ? 28 : mood === "curious" ? -6 : 0;
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, BISCUIT.j)}>
          <g transform={`rotate(${s * tilt} ${mirror(s, 78)} 84)`}>
            <path d={`M${mirror(s, 66)} 92 L${mirror(s, 52)} 36 Q${mirror(s, 58)} 30 ${mirror(s, 64)} 34 L${mirror(s, 96)} 76 Z`} fill={CORGI_SHADE} />
            <path d={`M${mirror(s, 70)} 86 L${mirror(s, 58)} 44 L${mirror(s, 86)} 76 Z`} fill={PINK} opacity={0.7} />
          </g>
        </g>
      ))}
      <Two d={blob(100, 114, 42, 36, 1.12)} fill={CORGI} shade={CORGI_SHADE} k={2.2} />
      {/* the white blaze up its face, the white muzzle, a black nose */}
      <path d="M100 82 Q106 100 112 116 Q124 124 124 136 Q118 150 100 150 Q82 150 76 136 Q76 124 88 116 Q94 100 100 82 Z" fill={CORGI_WHITE} />
      <ellipse cx={100} cy={128} rx={6.4} ry={4.6} fill={INK} />
      <circle cx={98.2} cy={126.6} r={1.4} fill={EYE_WHITE} />
    </g>
  );
}

function BiscuitBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", BISCUIT.j)}>
        <circle cx={124} cy={248} r={8} fill={CORGI_WHITE} />
      </g>
    </g>
  );
}

const biscuitEyes = eyesOf({ rx: 8.8, ry: 9.8, fill: INK, iris: { r: 6.6, color: "#5a3420" }, pupil: { r: 0 }, shine: 3, lid: CORGI, closed: INK, browY: 15, brow: dashBrow(CORGI_SHADE, 3.2, 4.4), rest: { raise: 4, look: [0, -0.8] } });

/* ——— Hazel, a squirrel: quick, chattering, forgets where she buried everything ——— */

const SQ = mix(C.accentDeep, "#b5653a", 45);
const SQ_SHADE = mix(C.deep, "#7a3e22", 35);
const SQ_LIGHT = "#f6e2c8";

const HAZEL = cute("hazel", { k: 1.46, neck: 206, torso: "M82 154 Q100 146 118 154 Q128 166 127 190 Q124 220 100 220 Q76 220 73 190 Q72 166 82 154 Z", j: { earL: [76, 74], earR: [124, 74], tail: [108, 248] }, headVB: "8 18 184 184" });

function HazelHead({ mood }: Ctx) {
  const stuffed = mood === "delighted";
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, HAZEL.j)}>
          <path d={`M${mirror(s, 66)} 88 Q${mirror(s, 62)} 60 ${mirror(s, 72)} 50 Q${mirror(s, 84)} 62 ${mirror(s, 86)} 80 Z`} fill={SQ} />
          {/* the tufts on her ear tips */}
          <path d={`M${mirror(s, 72)} 52 l${s * -4} -10 M${mirror(s, 72)} 52 l${s * 2} -11`} {...line(SQ_SHADE, 3)} />
        </g>
      ))}
      <Two d={blob(100, 114, 38, 35, stuffed ? 1.3 : 1.12)} fill={SQ} shade={SQ_SHADE} k={2} />
      <path d={blob(100, 130, stuffed ? 30 : 22, 16, 1.06)} fill={SQ_LIGHT} />
      <ellipse cx={100} cy={124} rx={4.4} ry={3.2} fill={INK} />
    </g>
  );
}

function HazelBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", HAZEL.j)}>
        {/* a great S of a tail, taller than her head */}
        <Taper segs={[[[110, 252], [160, 260], [176, 210], [150, 170]], [[150, 170], [130, 140], [140, 100], [166, 98]]]} w0={20} w1={30} fill={SQ_SHADE} />
        <g transform="translate(-2 -2)">
          <Taper segs={[[[110, 252], [160, 260], [176, 210], [150, 170]], [[150, 170], [130, 140], [140, 100], [166, 98]]]} w0={16} w1={26} fill={SQ} />
        </g>
      </g>
    </g>
  );
}

const hazelEyes = eyesOf({ rx: 8, ry: 9.4, fill: INK, iris: { r: 6, color: "#4a2414" }, pupil: { r: 0 }, shine: 2.8, lid: SQ, closed: INK, browY: 14, brow: arcBrow(SQ_SHADE, 3, 5), rest: { raise: 5, browTilt: -6, look: [1.6, -0.6], k: [1, 1.06] } });

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
    id: "fresh-crumb",
    kind: "animal",
    frame: CRUMB,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -8, hands: { L: [76, 202], R: [124, 196], outL: true, outR: true } },
    label: "Crumb",
    signature: "A tiny mouse with great tipped-out ears and a curling pink tail — she squeezes",
    pitch: "The smallest of everyone, and the bravest about it: wants to be taken seriously; the flaw is that she picks fights with things fifty times her size. At rest, fists on hips, chin up. Ability: Squeeze — fits through any gap.",
    risk: "Ears tipped out, never two black circles on top: stay clear of a famous mouse.",
    pal: pal(MOUSE, PINK, { skin: MOUSE, skinShade: MOUSE_SHADE, limb: MOUSE, paw: PINK }),
    body: MOUSE,
    face: face({ eyeY: 116, eyeGap: 17, mouthY: 140, lid: MOUSE, kit: crumbEyes, mouthKit: mouthOf({ lip: MOUSE_SHADE, W: 6.4, H: 6, buck: true }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <CrumbBehind />,
    belly: () => <ellipse cx={100} cy={190} rx={15} ry={20} fill={MOUSE_LIGHT} />,
    head: () => <CrumbHead />,
  },
  {
    id: "fresh-willow",
    kind: "animal",
    frame: WILLOW,
    outline: false,
    attitude: { mood: "neutral", tilt: 8, hands: { L: [92, 200], R: [108, 200], outL: false, outR: false } },
    label: "Willow",
    signature: "A dappled fawn with long lashes, wide soft ears and long thin legs — she vanishes in the dapple",
    pitch: "Gentle and dreamy, notices the small things; the flaw is she drifts off mid-sentence. At rest, head on one side, gazing off. Ability: Dapple — stands so still in dappled light no one can see her.",
    risk: "Dreamy, never vacant.",
    pal: pal(FAWN, FAWN_SHADE, { skin: FAWN, skinShade: FAWN_SHADE, limb: FAWN, paw: FAWN_SHADE, shoe: FAWN_SHADE }),
    body: FAWN,
    face: face({ eyeY: 116, eyeGap: 17, mouthY: 142, lid: FAWN, kit: willowEyes, mouthKit: mouthOf({ lip: FAWN_SHADE, W: 6, H: 6 }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    belly: () => (
      <g fill={FAWN_LIGHT}>
        <ellipse cx={100} cy={190} rx={14} ry={20} />
        <circle cx={82} cy={164} r={3} />
        <circle cx={118} cy={170} r={2.6} />
      </g>
    ),
    head: () => <WillowHead />,
  },
  {
    id: "fresh-biscuit",
    kind: "animal",
    frame: BISCUIT,
    outline: false,
    attitude: { mood: "delighted", tilt: 8, hands: { L: [86, 204], R: [114, 204], outL: true, outR: true } },
    label: "Biscuit",
    signature: "A corgi pup with huge upright ears, a white blaze and a fluffy chest — it wags",
    pitch: "Loyal, bouncing, never stops wagging: wants everyone together; the flaw is that it can't keep still for a second. Its ears are its mood. Ability: Wag — wags so hard its whole body wiggles.",
    risk: "Excitement kept small; it never jumps on the learner's answer.",
    pal: pal(CORGI, CORGI_WHITE, { skin: CORGI, skinShade: CORGI_SHADE, limb: CORGI, paw: CORGI_WHITE }),
    body: CORGI,
    face: face({ eyeY: 112, eyeGap: 19, mouthY: 140, lid: CORGI, kit: biscuitEyes, mouthKit: mouthOf({ lip: "#5a3420", W: 7.6, H: 7.6 }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <BiscuitBehind />,
    belly: () => <path d="M84 154 Q100 166 116 154 Q120 182 110 204 Q100 210 90 204 Q80 182 84 154 Z" fill={CORGI_WHITE} />,
    head: (c) => <BiscuitHead {...c} />,
  },
  {
    id: "fresh-hazel",
    kind: "animal",
    frame: HAZEL,
    outline: false,
    hands: "mitten",
    attitude: { mood: "curious", tilt: -8, hands: { L: [96, 176], R: [104, 176], outL: false, outR: false } },
    label: "Hazel",
    signature: "A rust-red squirrel with ear tufts and a great S of a tail — she stuffs her cheeks",
    pitch: "Quick, chattering, a hundred plans at once; the flaw is she forgets where she buried every one. At rest, paws up at her chest, head cocked, one eye wider. Her cheeks puff out when she is delighted. Ability: Cheeks — stuffs them till they're round as plums.",
    risk: "Scatterbrained, never silly about the learner's work.",
    pal: pal(SQ, SQ_SHADE, { skin: SQ, skinShade: SQ_SHADE, limb: SQ, paw: SQ_SHADE }),
    body: SQ,
    face: face({ eyeY: 112, eyeGap: 18, mouthY: 136, lid: SQ, kit: hazelEyes, mouthKit: mouthOf({ lip: SQ_SHADE, W: 6.6, H: 6.4, buck: true }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <HazelBehind />,
    belly: () => <ellipse cx={100} cy={190} rx={15} ry={21} fill={SQ_LIGHT} />,
    head: (c) => <HazelHead {...c} />,
  },
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

