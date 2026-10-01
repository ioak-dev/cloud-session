import type { ReactNode } from "react";

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
  face,
  g2,
  INK,
  mirror,
  mix,
  MOUTH_IN,
  pal,
  PERSON_OUTFITS,
  sides,
  talk,
  Taper,
  Two,
  UNFIT,
  wave,
  mouthOf,
  person,
} from "./side-kit";
import { EYE_WHITE, line, OpenMouth, TONGUE_PINK, type MouthKit } from "./rig/eyes";
import type { Palette } from "./rig/palette";
import { pivot } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Candidates from the second shortlist round: Ada, a grandmother; Kai, a boy of about fourteen;
 * Thistle, a hedgehog (shortlisted); Mischa, a raccoon, and Bodhi, a boy of about nine (backup). Drawn on the cute frame to
 * `docs/character-guidelines.md`, each with its own eyes and mouth (which also talks). Static
 * figures and faces only, until some are picked.
 */

/* ——— Mischa, a raccoon: the night visitor who "borrows" things ——— */

const RAC = mix(C.mid, "#8d8a90", 50);
const RAC_SHADE = mix(C.deep, "#5e5a63", 45);
const RAC_MASK = mix(C.deep, "#2c2a33", 40);
const RAC_LIGHT = "#f1ede6";

const MISCHA = cute("mischa", { k: 1.44, neck: 204, torso: "M80 152 Q100 144 120 152 Q132 164 130 190 Q127 222 100 222 Q73 222 70 190 Q68 164 80 152 Z", j: { earL: [70, 76], earR: [130, 76], tail: [112, 250] } });

function MischaHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, MISCHA.j)}>
          <path d={`M${mirror(s, 60)} 94 Q${mirror(s, 56)} 62 ${mirror(s, 70)} 56 Q${mirror(s, 84)} 62 ${mirror(s, 90)} 80 Z`} fill={RAC_SHADE} />
          <path d={`M${mirror(s, 65)} 86 Q${mirror(s, 64)} 68 ${mirror(s, 71)} 64 Q${mirror(s, 79)} 68 ${mirror(s, 83)} 80 Z`} fill={RAC_LIGHT} />
        </g>
      ))}
      <path d="M58 124 L46 130 L58 134 L50 142 L66 138 Z M142 124 L154 130 L142 134 L150 142 L134 138 Z" fill={RAC_LIGHT} />
      <Two d={blob(100, 112, 44, 38, 1.08)} fill={RAC} shade={RAC_SHADE} k={2.2} />
      {/* the white brows and cheeks, then the bandit's mask across both eyes */}
      <path d="M62 112 C66 96 86 96 100 104 C114 96 134 96 138 112 C134 126 116 128 100 120 C84 128 66 126 62 112 Z" fill={RAC_MASK} />
      <path d="M70 98 Q82 90 94 98 M106 98 Q118 90 130 98" {...line(RAC_LIGHT, 4)} />
      <path d={blob(100, 134, 18, 12, 1.04)} fill={RAC_LIGHT} />
      <ellipse cx={100} cy={127} rx={5.4} ry={3.8} fill={INK} />
    </g>
  );
}

function MischaBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", MISCHA.j)}>
        {/* a big bushy tail in rings, curving up behind */}
        <Taper segs={[[[114, 254], [150, 262], [170, 232], [160, 196]]]} w0={16} w1={22} fill={RAC} />
        {[0.3, 0.55, 0.8].map((t) => {
          const x = 114 + (160 - 114) * t + 12 * Math.sin(t * 3);
          const y = 254 - (254 - 196) * t;
          return <ellipse key={t} cx={x} cy={y} rx={11} ry={4} transform={`rotate(${-60 + t * 50} ${x} ${y})`} fill={RAC_MASK} />;
        })}
        <circle cx={160} cy={194} r={10} fill={RAC_MASK} />
      </g>
    </g>
  );
}

const mischaEyes = eyesOf({
  rx: 8.6,
  ry: 9.6,
  fill: EYE_WHITE,
  iris: { r: 6.4, color: mix(C.accentDeep, "#5a3e2a", 50) },
  pupil: { r: 3.2 },
  shine: 2.4,
  lid: RAC_MASK,
  closed: RAC_LIGHT,
  browY: 16,
  brow: dashBrow(RAC_LIGHT, 3.2, 4.6),
  /* sly: looking sideways, one brow up */
  rest: { look: [2.4, 0], top: 0.18, raise: 2, browTilt: -8, k: [0.96, 1.04] },
});

/* ——— Thistle, a hedgehog: the head gardener, fussy and tender ——— */

const SPINE = mix(C.accentDeep, "#7a5a44", 45);
const SPINE_SHADE = mix(C.deep, "#4e3a2e", 35);
const HOG_FACE = "#f6dcc4";
const HOG_SHADE = "#e3bea0";

const THISTLE = cute("thistle", { k: 1.44, neck: 206, torso: "M78 152 Q100 144 122 152 Q134 166 132 192 Q128 222 100 222 Q72 222 68 192 Q66 166 78 152 Z", headVB: "10 30 180 180" });

function ThistleBack() {
  /* a crown of soft spines all round the back of her head */
  const spikes = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI * (1.02 + (i / 12) * 0.96);
    const x = 100 + 48 * Math.cos(a);
    const y = 110 + 46 * Math.sin(a);
    const tx = 100 + 70 * Math.cos(a);
    const ty = 110 + 66 * Math.sin(a);
    const nx = -Math.sin(a) * 9;
    const ny = Math.cos(a) * 9;
    return `M${x - nx} ${y - ny} Q${tx} ${ty} ${tx} ${ty} L${x + nx} ${y + ny} Z`;
  });
  return (
    <g>
      <g fill={SPINE_SHADE} transform="translate(2 2)">
        {spikes.map((d) => (
          <path key={d} d={d} strokeLinejoin="round" stroke={SPINE_SHADE} strokeWidth={4} />
        ))}
      </g>
      <g fill={SPINE}>
        {spikes.map((d) => (
          <path key={d} d={d} strokeLinejoin="round" stroke={SPINE} strokeWidth={4} />
        ))}
      </g>
      <path d={blob(100, 108, 50, 46, 1.02)} fill={SPINE} />
    </g>
  );
}

function ThistleHead() {
  return (
    <g>
      <circle cx={64} cy={90} r={8} fill={HOG_SHADE} />
      <circle cx={136} cy={90} r={8} fill={HOG_SHADE} />
      <Two d={blob(100, 116, 38, 34, 1.08)} fill={HOG_FACE} shade={HOG_SHADE} k={2} />
      {/* a peak of spines on her forehead, and a big button nose */}
      <path d="M74 92 Q86 76 100 84 Q114 76 126 92 Q112 86 100 92 Q88 86 74 92 Z" fill={SPINE} />
      <ellipse cx={100} cy={130} rx={6.4} ry={5} fill={INK} />
      <circle cx={98.2} cy={128.4} r={1.4} fill={EYE_WHITE} />
    </g>
  );
}

const thistleEyes = eyesOf({
  rx: 7,
  ry: 8.2,
  fill: INK,
  pupil: { r: 0 },
  shine: 2.4,
  lid: HOG_FACE,
  closed: INK,
  browY: 13,
  brow: arcBrow(SPINE, 3, 5),
  /* fussing: brows knitted up at the middle */
  rest: { raise: 2, browTilt: 14 },
});

/* ——— Bodhi, a boy of about nine: muddy knees, first into everything ——— */

const BODHI_SKIN = "#7d4b2f";
const BODHI_SHADE = "#623820";
const BODHI_HAIR = "#2a1d1d";
const BODHI_HI = "#5a4040";

const BODHI = cute("bodhi", { k: 1.48, neck: 202, torso: "M84 150 Q100 146 116 150 Q124 156 123 172 L121 210 Q120 222 100 222 Q80 222 79 210 L77 172 Q76 156 84 150 Z", headVB: "12 22 176 176" });

const BODHI_CURLS = [
  [62, 96, 11],
  [66, 80, 12],
  [78, 68, 12],
  [92, 62, 12],
  [106, 60, 12],
  [120, 64, 12],
  [132, 74, 12],
  [138, 90, 11],
  [100, 52, 9],
  [116, 50, 8],
] as const;

function BodhiHead() {
  return (
    <g>
      <circle cx={57} cy={118} r={7} fill={BODHI_SKIN} />
      <circle cx={143} cy={118} r={7} fill={BODHI_SKIN} />
      <Two d={blob(100, 114, 42, 39, 1.06)} fill={BODHI_SKIN} shade={BODHI_SHADE} k={2.2} />
      {/* a mop of tight curls, one springing up on top */}
      <g fill={BODHI_HAIR}>
        {BODHI_CURLS.map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
        <path d="M60 100 Q100 76 140 98 L140 84 Q100 60 60 84 Z" />
      </g>
      <path d="M84 62 q4 -4 8 0 M104 56 q4 -4 8 0 M70 78 q4 -4 8 0 M124 70 q4 -4 8 0" {...line(BODHI_HI, 2.2)} />
      {/* a smudge of mud on his cheek */}
      <ellipse cx={126} cy={132} rx={5} ry={3} fill={BODHI_SHADE} opacity={0.6} />
    </g>
  );
}

const bodhiEyes = eyesOf({
  rx: 9.4,
  ry: 10.6,
  fill: EYE_WHITE,
  iris: { r: 7.6, color: "#3e2418" },
  pupil: { r: 3.8 },
  shine: 3,
  lid: BODHI_SKIN,
  rim: { color: INK, w: 3, lashes: 0 },
  closed: INK,
  browY: 17,
  brow: arcBrow(BODHI_HAIR, 4.4, 6.4),
  rest: { raise: 3, browTilt: -2, look: [0, -0.8] },
});

/* ——— Ada, a grandmother: runs the tea stall on the bank, laughs the loudest ——— */

const ADA_SKIN = "#f0c7a6";
const ADA_SHADE = "#d9a684";
const ADA_HAIR = "#e7e4ec";
const ADA_HI = "#ffffff";

const ADA = cute("ada", {
  k: 1.4,
  neck: 200,
  torso: "M80 150 Q100 144 120 150 Q130 158 129 178 L126 212 Q124 222 100 222 Q76 222 74 212 L71 178 Q70 158 80 150 Z",
  w: { upper: 13, fore: 12, thigh: 13, shin: 12, hand: 8, cloth: 1.1 },
  headVB: "12 22 176 176",
});

function AdaBack() {
  return (
    <g fill={mix(ADA_HAIR, C.mid, 80)}>
      {[
        [58, 110, 16],
        [142, 110, 16],
        [62, 88, 17],
        [138, 88, 17],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

function AdaHead() {
  return (
    <g>
      <Two d={blob(100, 114, 41, 38, 1.1)} fill={ADA_SKIN} shade={ADA_SHADE} k={2.2} />
      {/* a cloud of short silver curls */}
      <g fill={ADA_HAIR}>
        {[
          [64, 92, 13],
          [74, 76, 14],
          [90, 66, 14],
          [108, 64, 14],
          [124, 70, 14],
          [136, 86, 13],
          [62, 108, 10],
          [138, 106, 10],
        ].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <path d="M80 70 q5 -5 10 0 M102 62 q5 -5 10 0 M120 72 q4 -4 8 0" {...line(mix(ADA_HAIR, C.mid, 70), 2.2)} />
      {/* laughter lines at the corners of her eyes */}
      <path d="M62 112 l-5 -2 M62 118 l-5 1 M138 112 l5 -2 M138 118 l5 1" {...line(ADA_SHADE, 1.8)} />
    </g>
  );
}

/** Over her eyes: half-moon spectacles, worn low. */
function AdaTop() {
  return (
    <g {...line(C.accentDeep, 2.4)}>
      <path d="M71 118 Q71 130 82 130 Q93 130 93 118 Z" fill={EYE_WHITE} fillOpacity={0.3} />
      <path d="M107 118 Q107 130 118 130 Q129 130 129 118 Z" fill={EYE_WHITE} fillOpacity={0.3} />
      <path d="M93 119 Q100 116 107 119" />
    </g>
  );
}

const adaEyes = eyesOf({
  rx: 7.6,
  ry: 8.6,
  fill: EYE_WHITE,
  iris: { r: 6, color: "#4a6a7a" },
  pupil: { r: 3 },
  shine: 2.2,
  lid: ADA_SKIN,
  rim: { color: INK, w: 2.4, lashes: 1 },
  closed: INK,
  browY: 15,
  brow: arcBrow(mix(ADA_HAIR, C.mid, 60), 3.4, 6),
  /* twinkling: lower lids up, as if about to laugh */
  rest: { bottom: 0.18, raise: 3, browTilt: 4 },
});

/* ——— Kai, a boy of about fourteen: cool, deadpan, secretly the kindest ——— */

const KAI_SKIN = "#e2b48c";
const KAI_SHADE = "#c79470";
const KAI_HAIR = "#1f2733";
const KAI_HI = "#4a5a70";

const KAI = cute("kai", {
  k: 1.28,
  neck: 192,
  torso: "M82 148 Q100 142 118 148 Q127 156 126 174 L123 212 Q121 222 100 222 Q79 222 77 212 L74 174 Q73 156 82 148 Z",
  w: { upper: 11.5, fore: 10.5, thigh: 12.5, shin: 11.5, hand: 7.2, cloth: 1 },
  j: { hipL: [92, 250], kneeL: [91, 262], footL: [90, 273], hipR: [108, 250], kneeR: [109, 262], footR: [110, 273] },
  headVB: "20 30 160 160",
});

function KaiBack() {
  return <path d={blob(100, 104, 46, 44, 1.02)} fill={KAI_HAIR} />;
}

function KaiHead() {
  return (
    <g>
      <circle cx={60} cy={116} r={6.4} fill={KAI_SKIN} />
      <circle cx={140} cy={116} r={6.4} fill={KAI_SKIN} />
      <Two d={blob(100, 112, 39, 38, 1.02)} fill={KAI_SKIN} shade={KAI_SHADE} k={2} />
      {/* a long fringe swept across, hiding one eye's brow */}
      <path d="M56 104 C54 66 80 56 104 58 C130 60 146 76 144 102 C138 92 130 88 122 86 C112 98 92 108 64 110 C70 104 74 98 76 92 C68 96 62 100 56 104 Z" fill={KAI_HAIR} />
      <path d="M78 68 Q98 60 118 66" {...line(KAI_HI, 3)} />
    </g>
  );
}

/** Kai wears his headphones round his neck, always. */
function KaiPendant() {
  return (
    <g>
      <path d="M78 150 Q100 166 122 150" {...line(C.deep, 4)} />
      <circle cx={78} cy={152} r={7} fill={C.deep} />
      <circle cx={122} cy={152} r={7} fill={C.deep} />
      <circle cx={78} cy={152} r={3.4} fill={C.accent} />
      <circle cx={122} cy={152} r={3.4} fill={C.accent} />
    </g>
  );
}

const kaiEyes = eyesOf({
  rx: 8.2,
  ry: 8.8,
  fill: EYE_WHITE,
  iris: { r: 6.2, color: "#3a4a5e" },
  pupil: { r: 3 },
  shine: 2.2,
  lid: KAI_SKIN,
  rim: { color: INK, w: 2.8, lashes: 0 },
  closed: INK,
  browY: 15,
  brow: arcBrow(KAI_HAIR, 3.6, 6.4),
  /* deadpan: lids half down, brows flat */
  rest: { top: 0.4, raise: -1, look: [1.6, 0] },
});

/* ——— The candidates ——— */

const ALL_FIVE: Candidate[] = [
  {
    id: "cand-mischa",
    kind: "animal",
    frame: MISCHA,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -8, hands: { L: [86, 196], R: [114, 190], outL: false, outR: false } },
    label: "Mischa",
    signature: "A grey raccoon with a bandit's mask, white brows and a ringed tail — nimble hands",
    pitch: "The night visitor who “borrows” things and always brings them back, mostly. Cheeky, sly, quick; wants to be trusted; the flaw is that he can't leave a lid closed. At rest: rubbing his hands, looking sideways, one brow up. Ability: Nimble hands — opens any lid, unties any knot.",
    risk: "Sly, never a thief: what he borrows comes back. Never sneaky with the learner.",
    pal: pal(RAC, RAC_MASK, { skin: RAC, skinShade: RAC_SHADE, limb: RAC, paw: RAC_MASK }),
    body: RAC,
    face: face({ eyeY: 112, eyeGap: 19, mouthY: 141, lid: RAC_MASK, kit: mischaEyes, mouthKit: mouthOf({ lip: RAC_SHADE, W: 7, H: 6.4, fang: true, rest: (y) => <path d={`M93 ${y + 1} Q101 ${y + 4} 108 ${y - 2}`} {...line(RAC_SHADE, 2.6)} /> }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <MischaBehind />,
    belly: () => <ellipse cx={100} cy={190} rx={18} ry={22} fill={RAC_LIGHT} />,
    head: () => <MischaHead />,
  },
  {
    id: "cand-thistle",
    kind: "animal",
    frame: THISTLE,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: 6, hands: { L: [94, 184], R: [106, 184], outL: false, outR: false } },
    label: "Thistle",
    signature: "A small hedgehog with a crown of soft spines and a big button nose — she curls",
    pitch: "Fussy and tender: wants everything to grow properly, frets that it won't. At rest her paws are clasped and her brows knitted. Ability: Curl — rolls into a spiky ball and trundles off when it all gets too much.",
    risk: "Fussing is care, never nagging the learner.",
    pal: pal(HOG_FACE, HOG_SHADE, { skin: HOG_FACE, skinShade: HOG_SHADE, limb: HOG_FACE, paw: HOG_SHADE }),
    body: SPINE,
    face: face({ eyeY: 114, eyeGap: 16, mouthY: 140, lid: HOG_FACE, kit: thistleEyes, mouthKit: mouthOf({ lip: "#b36a5e", W: 6, H: 6 }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    headBack: () => <ThistleBack />,
    belly: () => <ellipse cx={100} cy={188} rx={18} ry={22} fill={HOG_FACE} />,
    head: () => <ThistleHead />,
  },
  {
    id: "cand-bodhi",
    kind: "human",
    frame: BODHI,
    outline: false,
    hands: "mitten",
    attitude: { mood: "delighted", tilt: 6, hands: { L: [66, 196], R: [150, 120], outL: true, outR: true } },
    label: "Bodhi",
    signature: "A boy of about nine with a mop of curls, mud on his cheek, one fist up — he bounces",
    pitch: "First into everything, muddy knees, a grin with a missing tooth: wants to explore; the flaw is he never looks before he leaps. Ability: Bounce — springs three times his own height.",
    risk: "Energy kept small; never a celebration that grows.",
    pal: person(BODHI_SKIN, BODHI_SHADE, BODHI_HAIR, BODHI_HI),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 18, mouthY: 138, nose: "dot", lid: BODHI_SKIN, kit: bodhiEyes, mouthKit: mouthOf({ lip: "#5a2a1e", W: 8.6, H: 8, teeth: true, gap: true }) }),
    outfit: "dungarees",
    outfits: PERSON_OUTFITS,
    head: () => <BodhiHead />,
  },
  {
    id: "cand-ada",
    kind: "human",
    frame: ADA,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: -5, hands: { L: [92, 186], R: [108, 186], outL: false, outR: false } },
    label: "Ada",
    signature: "A grandmother with a cloud of silver curls and half-moon spectacles — she hums",
    pitch: "Runs the tea stall on the bank and laughs the loudest; wants everyone fed; the flaw is she can't keep a secret. Twinkling eyes, laughter lines, spectacles worn low. Ability: Hum — one tune and everyone settles.",
    risk: "A grown-up who is never strict; her “well done” is fixed copy on one event only.",
    pal: person(ADA_SKIN, ADA_SHADE, ADA_HAIR, ADA_HI),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 18, mouthY: 138, nose: "dot", lid: ADA_SKIN, kit: adaEyes, mouthKit: mouthOf({ lip: "#a85a56", W: 8, H: 7, teeth: true }) }),
    outfit: "dress",
    outfits: PERSON_OUTFITS,
    headBack: () => <AdaBack />,
    head: () => <AdaHead />,
    top: () => <AdaTop />,
  },
  {
    id: "cand-kai",
    kind: "human",
    frame: KAI,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -4, hands: { L: [84, 204], R: [116, 204], outL: true, outR: true } },
    label: "Kai",
    signature: "A boy of about fourteen with a swept fringe and headphones round his neck — he moonwalks",
    pitch: "Cool, deadpan, says little — and is secretly the kindest, the one who waits for the slow ones. Wants to look like he doesn't care. Hands in pockets, lids half down, a fringe over one brow. Ability: Moonwalk — glides backwards as if the ground were ice.",
    risk: "Cool, never dismissive of the learner.",
    pal: person(KAI_SKIN, KAI_SHADE, KAI_HAIR, KAI_HI),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 116, eyeGap: 17, mouthY: 136, nose: "dot", lid: KAI_SKIN, kit: kaiEyes, mouthKit: mouthOf({ lip: "#9a5a4a", W: 7.4, H: 7, teeth: true, rest: (y) => <path d={`M95 ${y + 1} L105 ${y}`} {...line("#9a5a4a", 2.6)} /> }) }),
    outfit: "hoodie",
    outfits: PERSON_OUTFITS,
    headBack: () => <KaiBack />,
    head: () => <KaiHead />,
    pendant: () => <KaiPendant />,
  },
];

const pick = (...ids: string[]) => ids.map((id) => ALL_FIVE.find((c) => c.id === id)!);

/** Shortlisted with the pond four: Ada, Kai, Thistle. */
export const SHORTLISTED: Candidate[] = pick("cand-ada", "cand-kai", "cand-thistle");
/** Kept as backup: Mischa, Bodhi. */
export const BACKUP: Candidate[] = pick("cand-mischa", "cand-bodhi");
