import type { Candidate } from "./candidates";
import { EYE_WHITE, line } from "./rig/eyes";
import { arcBrow, blob, cute, eyesOf, face, INK, mix, mouthOf, person, PERSON_OUTFITS, sides, mirror, Two } from "./side-kit";
import { C } from "./theme";

/**
 * More people to shortlist: elders — Ada in a second look (Ada · Bun), Ezra and Grace — and three
 * teachers in their twenties — Lena, Noor and June. Drawn on the cute frame to
 * `docs/character-guidelines.md`, each with their own eyes and mouth (which also talks). An elder's
 * head sits a little lower and rounder, with softer lids and laughter lines; a teacher stands a
 * little taller, with a smaller head than the children's.
 */

/* ——— Ada · Bun: the same Ada, hair up, spectacles on a chain ——— */

const ADA_SKIN = "#f0c7a6";
const ADA_SHADE = "#d9a684";
const ADA_HAIR = "#e7e4ec";
const ADA_HAIR_SHADE = mix(ADA_HAIR, C.mid, 72);

const ADA_BUN = cute("ada-bun", {
  k: 1.4,
  neck: 200,
  torso: "M80 150 Q100 144 120 150 Q130 158 129 178 L126 212 Q124 222 100 222 Q76 222 74 212 L71 178 Q70 158 80 150 Z",
  w: { upper: 13, fore: 12, thigh: 13, shin: 12, hand: 8, cloth: 1.1 },
  headVB: "12 12 176 176",
});

function AdaBunBack() {
  return (
    <g>
      {/* a soft silver bun on top, a little lopsided, with a flower pinned in it */}
      <circle cx={104} cy={58} r={20} fill={ADA_HAIR_SHADE} />
      <circle cx={102} cy={56} r={19} fill={ADA_HAIR} />
      <path d="M90 54 Q100 46 112 52" {...line(ADA_HAIR_SHADE, 2.4)} />
      <g transform="translate(120 46)">
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={5 * Math.cos((a * Math.PI) / 180)} cy={5 * Math.sin((a * Math.PI) / 180)} r={4} fill={C.accent} />
        ))}
        <circle r={2.6} fill={C.accentDeep} />
      </g>
      <path d={blob(100, 104, 46, 42, 1.02)} fill={ADA_HAIR_SHADE} />
    </g>
  );
}

function AdaBunHead() {
  return (
    <g>
      <Two d={blob(100, 116, 41, 38, 1.1)} fill={ADA_SKIN} shade={ADA_SHADE} k={2.2} />
      {/* hair swept up and back, two curls escaping at the temples */}
      <path d="M58 106 C56 76 76 64 100 64 C124 64 144 76 142 106 C134 92 120 86 100 86 C80 86 66 92 58 106 Z" fill={ADA_HAIR} />
      <path d="M74 80 Q90 72 106 74" {...line(ADA_HAIR_SHADE, 2.4)} />
      <path d="M60 104 q-6 6 0 12 M140 104 q6 6 0 12" {...line(ADA_HAIR, 3.4)} />
      <path d="M62 114 l-5 -2 M62 120 l-5 1 M138 114 l5 -2 M138 120 l5 1" {...line(ADA_SHADE, 1.8)} />
    </g>
  );
}

/** Her spectacles hang on a beaded chain against her cardigan when she isn't wearing them. */
function AdaBunChain() {
  return (
    <g>
      <path d="M84 150 Q100 178 116 150" {...line(C.accentDeep, 1.4)} strokeDasharray="1 3" />
      <g {...line(C.accentDeep, 2)} transform="translate(100 176)">
        <path d="M-15 -4 Q-15 6 -7 6 Q1 6 1 -4 Z" fill={EYE_WHITE} fillOpacity={0.4} />
        <path d="M1 -4 Q1 6 9 6 Q17 6 17 -4 Z" fill={EYE_WHITE} fillOpacity={0.4} />
      </g>
    </g>
  );
}

const adaBunEyes = eyesOf({
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
  brow: arcBrow(ADA_HAIR_SHADE, 3.4, 6),
  rest: { bottom: 0.18, raise: 3, browTilt: 4 },
});

/* ——— Ezra, a grandfather: the pond's oldest regular, a terrible joke for every occasion ——— */

const EZRA_SKIN = "#e8b48e";
const EZRA_SHADE = "#cc9268";
const EZRA_WHITE = "#f2f0ea";
const EZRA_WHITE_SHADE = mix(EZRA_WHITE, C.mid, 75);

const EZRA = cute("ezra", {
  k: 1.36,
  neck: 198,
  torso: "M76 150 Q100 142 124 150 Q136 162 134 186 L130 214 Q126 224 100 224 Q74 224 70 214 L66 186 Q64 162 76 150 Z",
  w: { upper: 13.5, fore: 12.5, thigh: 13.5, shin: 12.5, hand: 8.2, cloth: 1.15 },
  headVB: "14 30 172 172",
});

function EzraHead() {
  return (
    <g>
      <ellipse cx={57} cy={118} rx={8} ry={9} fill={EZRA_SKIN} />
      <ellipse cx={143} cy={118} rx={8} ry={9} fill={EZRA_SKIN} />
      {/* a round bald dome, a fringe of white round the sides, a big soft nose */}
      <Two d={blob(100, 112, 42, 41, 1.06)} fill={EZRA_SKIN} shade={EZRA_SHADE} k={2.2} />
      <path d="M78 76 Q90 70 100 72" {...line(EZRA_SHADE, 2)} opacity={0.6} />
      {sides.map(([side, s]) => (
        <path key={side} d={`M${mirror(s, 60)} 118 Q${mirror(s, 54)} 98 ${mirror(s, 64)} 86 Q${mirror(s, 70)} 96 ${mirror(s, 66)} 104 Q${mirror(s, 72)} 108 ${mirror(s, 68)} 120 Z`} fill={EZRA_WHITE} />
      ))}
      <ellipse cx={100} cy={128} rx={7.6} ry={6.4} fill={EZRA_SHADE} />
      <ellipse cx={99} cy={127} rx={6.6} ry={5.6} fill={mix(EZRA_SKIN, "#e48a7a", 70)} />
      <path d="M62 112 l-6 -2 M62 118 l-6 0 M138 112 l6 -2 M138 118 l6 0" {...line(EZRA_SHADE, 1.8)} />
    </g>
  );
}

const ezraEyes = eyesOf({
  rx: 6.8,
  ry: 7.6,
  fill: INK,
  iris: { r: 5, color: "#3e5a6a" },
  pupil: { r: 0 },
  shine: 2.2,
  lid: EZRA_SKIN,
  closed: INK,
  browY: 14,
  /* big, bushy white brows with a will of their own */
  brow: ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return (
      <path
        d={`M${x - 11} ${by + 3} Q${x - 8} ${by - 5} ${x} ${by - 4} Q${x + 8} ${by - 6} ${x + 12} ${by + 1} L${x + 14} ${by - 3} Q${x + 10} ${by + 3} ${x} ${by + 2} Q${x - 7} ${by + 4} ${x - 11} ${by + 3} Z`}
        fill={EZRA_WHITE_SHADE}
        transform={`rotate(${s * tilt} ${x} ${by}) ${s === 1 ? `translate(${2 * x} 0) scale(-1 1)` : ""}`}
      />
    );
  },
  rest: { bottom: 0.14, top: 0.1, raise: 2, browTilt: 4 },
});

/* ——— Grace, a grandmother: regal, a dancer once and still ——— */

const GRACE_SKIN = "#6e4430";
const GRACE_SHADE = "#55321f";
const GRACE_HAIR = "#ece8e2";
const GRACE_HAIR_SHADE = mix(GRACE_HAIR, C.mid, 70);

const GRACE = cute("grace", {
  k: 1.34,
  neck: 196,
  torso: "M82 150 Q100 144 118 150 Q128 158 127 178 L124 214 Q122 224 100 224 Q78 224 76 214 L73 178 Q72 158 82 150 Z",
  w: { upper: 12, fore: 11, thigh: 12.5, shin: 11.5, hand: 7.6, cloth: 1 },
  headVB: "14 22 172 172",
});

function GraceHead() {
  return (
    <g>
      <Two d={blob(100, 114, 40, 38, 1.04)} fill={GRACE_SKIN} shade={GRACE_SHADE} k={2.2} />
      {/* short white natural curls, cropped close and tall on top */}
      <g fill={GRACE_HAIR}>
        {[
          [66, 92, 11],
          [74, 78, 12],
          [88, 68, 12],
          [102, 64, 12],
          [116, 68, 12],
          [128, 78, 12],
          [134, 92, 11],
        ].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
        <path d="M62 100 Q100 80 138 100 L138 88 Q100 64 62 88 Z" />
      </g>
      <path d="M80 70 q4 -4 8 0 M100 64 q4 -4 8 0 M120 70 q4 -4 8 0" {...line(GRACE_HAIR_SHADE, 2)} />
      {/* big gold hoops */}
      <circle cx={58} cy={132} r={7} {...line(C.accent, 2.6)} />
      <circle cx={142} cy={132} r={7} {...line(C.accent, 2.6)} />
    </g>
  );
}

/** Over her eyes: bold round glasses in the accent. */
function GraceTop() {
  return (
    <g {...line(C.accent, 3.2)}>
      <path d={`M68 112 Q68 128 83 128 Q96 128 96 114 Q96 104 82 104 Q68 104 68 112 Z`} />
      <path d={`M132 112 Q132 128 117 128 Q104 128 104 114 Q104 104 118 104 Q132 104 132 112 Z`} />
      <path d="M96 112 Q100 109 104 112" />
    </g>
  );
}

const graceEyes = eyesOf({
  rx: 7.6,
  ry: 8.4,
  fill: EYE_WHITE,
  iris: { r: 6, color: "#3a2214" },
  pupil: { r: 3 },
  shine: 2.2,
  lid: GRACE_SKIN,
  rim: { color: INK, w: 2.6, lashes: 2 },
  closed: INK,
  browY: 16,
  brow: arcBrow(GRACE_HAIR_SHADE, 3, 6),
  /* knowing: one brow up, lids a little lowered */
  rest: { top: 0.14, raise: 3, browTilt: -6, k: [0.98, 1.04] },
});

/* ——— Lena, a teacher in her twenties: warm, a pencil behind her ear ——— */

const LENA_SKIN = "#e7b693";
const LENA_SHADE = "#cc9672";
const LENA_HAIR = "#7a4630";
const LENA_HI = "#a8694a";
const PINKISH = "#e9a0a8";

const teacherFrame = (id: string, headVB = "22 26 156 156") =>
  cute(id, {
    k: 1.22,
    neck: 184,
    torso: "M82 148 Q100 142 118 148 Q127 156 126 174 L123 212 Q121 222 100 222 Q79 222 77 212 L74 174 Q73 156 82 148 Z",
    w: { upper: 11.5, fore: 10.5, thigh: 12.5, shin: 11.5, hand: 7.2, cloth: 1 },
    j: {
      shoulderL: [84, 196],
      elbowL: [78, 214],
      wristL: [75, 232],
      shoulderR: [116, 196],
      elbowR: [122, 214],
      wristR: [125, 232],
      hipL: [92, 244],
      kneeL: [91, 259],
      footL: [90, 273],
      hipR: [108, 244],
      kneeR: [109, 259],
      footR: [110, 273],
      braidL: [64, 100],
      braidR: [136, 100],
    },
    headVB,
  });

const LENA = teacherFrame("lena", "8 28 172 172");

function LenaBack() {
  return (
    <g>
      {/* shoulder-length waves */}
      <path d="M54 104 C50 70 74 56 100 56 C126 56 150 70 146 104 L150 140 Q142 152 132 146 Q136 158 124 156 L76 156 Q64 158 68 146 Q58 152 50 140 Z" fill={LENA_HAIR} />
    </g>
  );
}

function LenaHead() {
  return (
    <g>
      <Two d={blob(100, 114, 38, 37, 1.04)} fill={LENA_SKIN} shade={LENA_SHADE} k={2} />
      {/* a side parting, the hair tucked behind one ear with a pencil */}
      <path d="M60 110 C58 74 80 62 104 62 C126 62 142 74 140 100 C130 88 118 80 108 78 C96 88 80 98 60 110 Z" fill={LENA_HAIR} />
      <path d="M80 72 Q96 66 112 68" {...line(LENA_HI, 3)} />
      <ellipse cx={140} cy={116} rx={6} ry={7} fill={LENA_SKIN} />
      <g transform="rotate(-50 142 104)">
        <rect x={128} y={101} width={30} height={5} rx={1.4} fill={C.accent} />
        <path d="M158 101 L164 103.5 L158 106 Z" fill="#e8cfa8" />
        <rect x={126} y={101} width={4} height={5} fill={PINKISH} />
      </g>
      {/* a few freckles */}
      {[
        [84, 128],
        [88, 131],
        [112, 128],
        [116, 131],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1} fill={LENA_SHADE} />
      ))}
    </g>
  );
}


const lenaEyes = eyesOf({
  rx: 7.8,
  ry: 8.8,
  fill: EYE_WHITE,
  iris: { r: 6, color: "#5a7a4a" },
  pupil: { r: 3 },
  shine: 2.4,
  lid: LENA_SKIN,
  rim: { color: INK, w: 2.6, lashes: 2 },
  closed: INK,
  browY: 15,
  brow: arcBrow(LENA_HAIR, 3.4, 6.4),
  rest: { raise: 3, browTilt: 4, look: [0.6, 0] },
});

/* ——— Noor, a teacher in her twenties: calm, patient, quietly funny ——— */

const NOOR_SKIN = "#c99068";
const NOOR_SHADE = "#ad7450";
const HIJAB = mix(C.primary, "#7a8ab8", 35);
const HIJAB_SHADE = mix(C.deep, "#4a5680", 40);

const NOOR = teacherFrame("noor", "16 22 168 168");

/** Her hijab: wrapped round her face and falling to her shoulders, in a soft blue from the scheme. */
function NoorBack() {
  return <path d={blob(100, 110, 50, 52, 1.12)} fill={HIJAB_SHADE} />;
}

function NoorHead() {
  return (
    <g>
      <path d={blob(100, 108, 48, 50, 1.1)} fill={HIJAB} />
      <Two d={blob(100, 118, 34, 33, 1.04)} fill={NOOR_SKIN} shade={NOOR_SHADE} k={1.8} />
      {/* the fold where the wrap crosses at her forehead and under her chin */}
      <path d="M66 98 Q100 78 134 98" {...line(HIJAB_SHADE, 2.4)} />
      <path d="M78 150 Q100 160 124 146" {...line(HIJAB_SHADE, 2.4)} />
    </g>
  );
}

function NoorDrape() {
  return <path d="M80 150 Q100 146 120 150 Q126 168 100 176 Q74 168 80 150 Z" fill={HIJAB} />;
}

const noorEyes = eyesOf({
  rx: 8.4,
  ry: 9.4,
  fill: EYE_WHITE,
  iris: { r: 6.8, color: "#3a2416" },
  pupil: { r: 3.2 },
  shine: 2.6,
  lid: NOOR_SKIN,
  rim: { color: INK, w: 3, lashes: 3 },
  closed: INK,
  browY: 15,
  brow: arcBrow("#3a2416", 3.4, 6.4),
  /* calm: lids soft, a small knowing look */
  rest: { top: 0.12, raise: 2, browTilt: 2 },
});

/* ——— June, a teacher in her twenties: brisk, bright, always one step ahead ——— */

const JUNE_SKIN = "#f0caa4";
const JUNE_SHADE = "#d8a882";
const JUNE_HAIR = "#1e1a22";
const JUNE_HI = "#4a4252";

const JUNE = teacherFrame("june", "18 26 164 164");

function JuneBack() {
  return <path d="M54 104 C50 66 76 56 100 56 C124 56 150 66 146 104 L148 134 Q124 140 100 138 Q76 140 52 134 Z" fill={JUNE_HAIR} />;
}

function JuneHead() {
  return (
    <g>
      <Two d={blob(100, 114, 37, 36, 1.04)} fill={JUNE_SKIN} shade={JUNE_SHADE} k={2} />
      {/* a sharp bob with straight-cut bangs, and a clip */}
      <path d="M58 104 C56 70 78 60 100 60 C122 60 144 70 142 104 L142 98 L58 98 Z" fill={JUNE_HAIR} />
      <path d="M60 100 L140 100" {...line(JUNE_HAIR, 3)} />
      <path d="M76 70 Q94 62 114 66" {...line(JUNE_HI, 3)} />
      <rect x={124} y={80} width={14} height={4.4} rx={2.2} transform="rotate(-20 131 82)" fill={C.accent} />
    </g>
  );
}

const juneEyes = eyesOf({
  rx: 8.2,
  ry: 8.2,
  fill: EYE_WHITE,
  iris: { r: 6.2, color: "#2a1e1a" },
  pupil: { r: 3 },
  shine: 2.4,
  lid: JUNE_SKIN,
  rim: { color: INK, w: 3, lashes: 1 },
  closed: INK,
  browY: 14,
  brow: arcBrow(JUNE_HAIR, 3.2, 6),
  /* bright and quick: brows up, a sideways look */
  rest: { raise: 4, browTilt: -4, look: [1.4, 0] },
});

/* ——— The people ——— */

export const ELDERS: Candidate[] = [
  {
    id: "people-ada-bun",
    kind: "human",
    frame: ADA_BUN,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: 6, hands: { L: [80, 200], R: [126, 186], outL: true, outR: true } },
    label: "Ada · Bun",
    signature: "Ada in a second look: silver hair up in a soft bun with a flower pinned in it, spectacles on a beaded chain",
    pitch: "The same Ada — runs the tea stall, laughs the loudest, can't keep a secret — with her hair swept up into a lopsided bun, two curls escaping, a flower in it, and her spectacles hanging on a chain against her cardigan instead of on her nose.",
    risk: "Compare with Ada as drawn: the bun gives her a taller silhouette; the curls are softer and more huggable.",
    pal: person(ADA_SKIN, ADA_SHADE, ADA_HAIR, "#ffffff"),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 18, mouthY: 138, nose: "dot", lid: ADA_SKIN, kit: adaBunEyes, mouthKit: mouthOf({ lip: "#a85a56", W: 8, H: 7, teeth: true }) }),
    outfit: "blazer",
    outfits: PERSON_OUTFITS,
    headBack: () => <AdaBunBack />,
    head: () => <AdaBunHead />,
    pendant: () => <AdaBunChain />,
  },
  {
    id: "people-ezra",
    kind: "human",
    frame: EZRA,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: -6, hands: { L: [92, 200], R: [108, 200], outL: false, outR: false } },
    label: "Ezra",
    signature: "A round grandfather, bald on top with a white fringe, huge bushy white brows and a big soft nose — he wiggles his ears",
    pitch: "The pond's oldest regular, with a terrible joke for every occasion and a laugh that starts before the punchline. Wants to make someone laugh every day; the flaw is that he tells the same joke twice. At rest, hands clasped over his tummy, eyes crinkled. Ability: Ear wiggle — both ears, on command, every time.",
    risk: "A grandfather with no moustache, so he never reads as anyone's famous professor or teacher.",
    pal: person(EZRA_SKIN, EZRA_SHADE, EZRA_WHITE, "#ffffff"),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 114, eyeGap: 18, mouthY: 142, nose: "none", lid: EZRA_SKIN, kit: ezraEyes, mouthKit: mouthOf({ lip: "#a85a50", W: 9, H: 7, teeth: true }) }),
    outfit: "blazer",
    outfits: PERSON_OUTFITS,
    head: () => <EzraHead />,
  },
  {
    id: "people-grace",
    kind: "human",
    frame: GRACE,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: 8, hands: { L: [76, 200], R: [124, 200], outL: true, outR: true } },
    label: "Grace",
    signature: "A regal grandmother with cropped white curls, bold round glasses and gold hoops — she dances",
    pitch: "Was a dancer once, and still is: tall, regal, warm. Wants everyone to stand up straight and enjoy themselves; the flaw is she'll turn any moment into a dance lesson. At rest, hands on hips, one brow up, a knowing smile. Ability: Shimmy — one shimmy and the whole pond is dancing.",
    risk: "Regal, never stern.",
    pal: person(GRACE_SKIN, GRACE_SHADE, GRACE_HAIR, "#ffffff"),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 116, eyeGap: 18, mouthY: 136, nose: "dot", lid: GRACE_SKIN, kit: graceEyes, mouthKit: mouthOf({ lip: "#5a2a22", W: 7.6, H: 7, teeth: true, rest: (y) => <path d={`M93 ${y + 1} Q101 ${y + 4} 108 ${y - 2}`} {...line("#5a2a22", 2.8)} /> }) }),
    outfit: "dress",
    outfits: PERSON_OUTFITS,
    head: () => <GraceHead />,
    top: () => <GraceTop />,
  },
];

export const TEACHERS: Candidate[] = [
  {
    id: "people-lena",
    kind: "human",
    frame: LENA,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: -6, hands: { L: [92, 196], R: [138, 150], outL: false, outR: true } },
    label: "Lena",
    signature: "A teacher in her twenties with shoulder-length waves and a pencil tucked behind her ear — her eyebrow says everything",
    pitch: "Warm, a little scattered, always has a pencil and never the one she's looking for. Wants every one of them to get it; the flaw is she gets so excited she skips ahead. At rest, one hand up mid-wave. Ability: The Eyebrow — one raised brow that says “are you sure?” without a word.",
    risk: "The eyebrow is playful, never a scold; it is never used on an incorrect answer.",
    pal: person(LENA_SKIN, LENA_SHADE, LENA_HAIR, LENA_HI),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 116, eyeGap: 17, mouthY: 136, nose: "dot", lid: LENA_SKIN, kit: lenaEyes, mouthKit: mouthOf({ lip: "#a85050", W: 7.6, H: 7, teeth: true }) }),
    outfit: "blazer",
    outfits: PERSON_OUTFITS,
    headBack: () => <LenaBack />,
    head: () => <LenaHead />,
  },
  {
    id: "people-noor",
    kind: "human",
    frame: NOOR,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: 6, hands: { L: [94, 196], R: [106, 196], outL: false, outR: false } },
    label: "Noor",
    signature: "A teacher in her twenties in a soft blue hijab, calm, hands together — her thumbs-up is the best in the world",
    pitch: "Calm, patient, quietly funny: the one who waits as long as it takes. Wants everyone to feel they can ask; the flaw is that she is too nice to tell the ducks off. At rest, hands together, a small knowing smile. Ability: Thumbs-up — a thumbs-up so warm it fills the frame.",
    risk: "Her hijab is drawn neatly and in the product's colours; it is part of her, never a costume or a joke.",
    pal: person(NOOR_SKIN, NOOR_SHADE, HIJAB, HIJAB),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 16, mouthY: 136, nose: "dot", lid: NOOR_SKIN, kit: noorEyes, mouthKit: mouthOf({ lip: "#8a4438", W: 7.4, H: 7, teeth: true }) }),
    outfit: "dress",
    outfits: PERSON_OUTFITS,
    headBack: () => <NoorBack />,
    head: () => <NoorHead />,
    pendant: () => <NoorDrape />,
  },
  {
    id: "people-june",
    kind: "human",
    frame: JUNE,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -4, hands: { L: [78, 200], R: [122, 200], outL: true, outR: true } },
    label: "June",
    signature: "A teacher in her twenties with a sharp black bob and straight-cut bangs, hands on hips — she tiptoes",
    pitch: "Brisk, bright, always one step ahead and delighted when someone catches up. Wants things done well; the flaw is she can't resist a pop quiz. At rest, hands on hips, a sideways look, brows up. Ability: Tiptoe — moves so quietly she's always already there.",
    risk: "Brisk, never cold; one step ahead is a game, not a test.",
    pal: person(JUNE_SKIN, JUNE_SHADE, JUNE_HAIR, JUNE_HI),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 116, eyeGap: 17, mouthY: 135, nose: "dot", lid: JUNE_SKIN, kit: juneEyes, mouthKit: mouthOf({ lip: "#b0505a", W: 7.4, H: 7, teeth: true, rest: (y) => <path d={`M94 ${y} Q100 ${y + 3.6} 107 ${y - 1.4}`} {...line("#b0505a", 2.6)} /> }) }),
    outfit: "blazer",
    outfits: PERSON_OUTFITS,
    headBack: () => <JuneBack />,
    head: () => <JuneHead />,
  },
];
