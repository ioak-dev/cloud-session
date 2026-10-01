import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import { EYE_WHITE, line } from "./rig/eyes";
import type { OutfitId } from "./rig/outfit";
import type { Body } from "./rig/skeleton";
import { arcBrow, blob, cute, eyesOf, face, INK, mix, mouthOf, person, PERSON_OUTFITS, Two } from "./side-kit";
import { C } from "./theme";

/**
 * More people to shortlist, built on one person-builder so they read as one family: three
 * scientists (Otto, Imani, Haru), three women in their twenties (Priya, Sofia, Ama), three boys
 * under ten (Leo, Kofi, Sami) and three young teens (Mateo, Finn, Dev). Each draws only what makes
 * them themselves — hair, a hook, a mouth quirk — on a face, ears and frame shared by age.
 */

type Age = "kid" | "teen" | "adult" | "elder";

const TORSO = "M84 150 Q100 146 116 150 Q124 156 123 172 L121 210 Q120 222 100 222 Q80 222 79 210 L77 172 Q76 156 84 150 Z";

/** The frame each age stands on: a child's head is half of them; a grown-up's is smaller. */
function frameFor(age: Age, id: string, headVB?: string): Body {
  switch (age) {
    case "kid":
      return cute(id, { k: 1.52, neck: 204, torso: TORSO, w: { upper: 12, fore: 11, thigh: 13, shin: 12, hand: 7.6, cloth: 1.05 }, headVB: headVB ?? "6 16 188 188" });
    case "teen":
      return cute(id, {
        k: 1.32,
        neck: 194,
        torso: TORSO,
        w: { upper: 11.5, fore: 10.5, thigh: 12.5, shin: 11.5, hand: 7.2, cloth: 1 },
        j: { hipL: [92, 250], kneeL: [91, 262], footL: [90, 273], hipR: [108, 250], kneeR: [109, 262], footR: [110, 273] },
        headVB: headVB ?? "14 22 172 172",
      });
    case "adult":
      return cute(id, {
        k: 1.22,
        neck: 184,
        torso: "M82 148 Q100 142 118 148 Q127 156 126 174 L123 212 Q121 222 100 222 Q79 222 77 212 L74 174 Q73 156 82 148 Z",
        w: { upper: 11.5, fore: 10.5, thigh: 12.5, shin: 11.5, hand: 7.2, cloth: 1 },
        j: { shoulderL: [84, 196], elbowL: [78, 214], wristL: [75, 232], shoulderR: [116, 196], elbowR: [122, 214], wristR: [125, 232], hipL: [92, 244], kneeL: [91, 259], footL: [90, 273], hipR: [108, 244], kneeR: [109, 259], footR: [110, 273] },
        headVB: headVB ?? "16 20 168 168",
      });
    case "elder":
      return cute(id, {
        k: 1.36,
        neck: 198,
        torso: "M76 150 Q100 142 124 150 Q136 162 134 186 L130 214 Q126 224 100 224 Q74 224 70 214 L66 186 Q64 162 76 150 Z",
        w: { upper: 13, fore: 12, thigh: 13, shin: 12, hand: 8, cloth: 1.1 },
        headVB: headVB ?? "10 14 180 180",
      });
  }
}

type Rest = Parameters<typeof eyesOf>[0]["rest"];

type Spec = {
  id: string;
  label: string;
  signature: string;
  pitch: string;
  risk: string;
  age: Age;
  skin: string;
  shade: string;
  hair: string;
  hairHi: string;
  lip: string;
  iris: string;
  /** Eye size, lashes, brows and the look at rest. */
  eye?: { rx?: number; ry?: number; lashes?: number; brow?: string; browW?: number; rest?: Rest };
  mouth?: { teeth?: boolean; gap?: boolean; braces?: boolean; W?: number; rest?: (y: number) => ReactNode };
  /** Behind the head: the hair's back, a bun, a ponytail. */
  back?: (c: Ctx) => ReactNode;
  /** Over the face: the hair's front, a fringe, a cap. */
  front: (c: Ctx) => ReactNode;
  /** Over the face and eyes: glasses, goggles, a moustache. */
  top?: (c: Ctx) => ReactNode;
  pendant?: () => ReactNode;
  outfit: OutfitId;
  /** Clothes of their own (a lab coat), over the header's clothes colour. */
  clothes?: string;
  attitude: Candidate["attitude"];
  headVB?: string;
  ears?: false;
  eyeY?: number;
  mouthY?: number;
};

function makePerson(sp: Spec): Candidate {
  const frame = frameFor(sp.age, sp.id, sp.headVB);
  const e = sp.eye ?? {};
  const kit = eyesOf({
    rx: e.rx ?? 8.8,
    ry: e.ry ?? 10,
    fill: EYE_WHITE,
    iris: { r: (e.rx ?? 8.8) * 0.76, color: sp.iris },
    pupil: { r: (e.rx ?? 8.8) * 0.38 },
    shine: (e.rx ?? 8.8) * 0.3,
    lid: sp.skin,
    rim: { color: INK, w: 2.8, lashes: e.lashes ?? 0 },
    closed: INK,
    browY: 16,
    brow: arcBrow(e.brow ?? sp.hair, e.browW ?? 4, 6.4),
    rest: e.rest,
  });
  const m = sp.mouth ?? {};
  return {
    id: sp.id,
    kind: "human",
    frame,
    outline: false,
    hands: "mitten",
    attitude: sp.attitude,
    label: sp.label,
    signature: sp.signature,
    pitch: sp.pitch,
    risk: sp.risk,
    pal: person(sp.skin, sp.shade, sp.hair, sp.hairHi, sp.clothes ? { top: sp.clothes, topAlt: sp.clothes } : {}),
    body: sp.clothes ?? C.clothes,
    face: face({
      eyes: "anime",
      eyeY: sp.eyeY ?? 118,
      eyeGap: 18,
      mouthY: sp.mouthY ?? 138,
      nose: "dot",
      lid: sp.skin,
      kit,
      mouthKit: mouthOf({ lip: sp.lip, W: m.W ?? 8, H: 7, teeth: m.teeth ?? true, gap: m.gap, braces: m.braces, rest: m.rest }),
    }),
    outfit: sp.outfit,
    outfits: PERSON_OUTFITS,
    headBack: sp.back,
    head: (c) => (
      <g>
        {sp.ears !== false && (
          <>
            <circle cx={58} cy={120} r={7} fill={sp.skin} />
            <circle cx={142} cy={120} r={7} fill={sp.skin} />
          </>
        )}
        <Two d={blob(100, 116, 41, 39, 1.06)} fill={sp.skin} shade={sp.shade} k={2.2} />
        {sp.front(c)}
      </g>
    ),
    top: sp.top,
    pendant: sp.pendant,
  };
}

/** Curls as a cluster of circles, in one colour. */
const curls = (at: readonly (readonly [number, number, number])[], fill: string) => (
  <g fill={fill}>
    {at.map(([x, y, r]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
    ))}
  </g>
);

const LAB = "#f3f1ec";

/* ——— Scientists ——— */

/** Otto's hair: an uneven white halo of soft tufts, thin on top, wild at the sides, that
 *  stands out further when an idea lands. */
function OttoBack({ mood }: Ctx) {
  const w = mood === "delighted" || mood === "curious" ? 1.16 : mood === "worried" ? 0.9 : 1;
  const tufts: [number, number, number][] = [
    [48, 118, 16],
    [44, 96, 18],
    [52, 74, 17],
    [68, 58, 15],
    [88, 54, 12],
    [112, 54, 12],
    [132, 58, 16],
    [150, 74, 18],
    [158, 98, 17],
    [152, 120, 15],
    [40, 132, 11],
    [162, 136, 10],
  ];
  const at = tufts.map(([x, y, r]) => [100 + (x - 100) * w, 106 + (y - 106) * w, r] as const);
  return (
    <g>
      <path d={blob(100, 104, 54 * w, 44 * w, 1.1)} fill={mix("#f2f2f0", C.mid, 70)} transform="translate(2 2)" />
      <path d={blob(100, 104, 54 * w, 44 * w, 1.1)} fill="#f2f2f0" />
      <g fill={mix("#f2f2f0", C.mid, 70)} transform="translate(2 2)">
        {at.map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <g fill="#f2f2f0">
        {at.map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
    </g>
  );
}

/** Otto's moustache: big, white and bushy, over his mouth's top edge. */
function OttoMoustache() {
  return (
    <path
      d="M82 132 Q86 124 100 128 Q114 124 118 132 Q122 140 114 138 Q108 134 100 136 Q92 134 86 138 Q78 140 82 132 Z"
      fill="#f2f2f0"
    />
  );
}

/** A lab coat's lapels and a breast pocket with pens. */
function LabCoat() {
  return (
    <g>
      <path d="M90 150 L100 176 L110 150" {...line(mix(LAB, C.mid, 70), 2.4)} />
      <rect x={106} y={180} width={11} height={9} rx={1.6} fill={mix(LAB, C.mid, 80)} />
      <path d="M109 180 L109 172 M113 180 L113 174" {...line(C.primary, 2)} />
    </g>
  );
}

/* ——— The people ——— */

export const SCIENTISTS: Candidate[] = [
  makePerson({
    id: "more-otto",
    label: "Professor Otto",
    signature: "An old scientist with a wild white halo of hair and a big bushy moustache, in a lab coat — his hair stands up when an idea lands",
    pitch: "Brilliant, absent-minded, delighted by every question — especially the ones he can't answer yet. Wants everyone to wonder; the flaw is that he forgets what he came into the room for. At rest, one finger up, eyes twinkling, chalk on his sleeve. Ability: Eureka — his hair stands straight up when an idea lands.",
    risk: "An archetype, not a likeness: no real scientist's face, and no equations drawn on him.",
    age: "elder",
    skin: "#efc3a0",
    shade: "#d6a07c",
    hair: "#f2f2f0",
    hairHi: "#ffffff",
    lip: "#a8584e",
    iris: "#3e5a7a",
    eye: { rx: 7.6, ry: 8.6, brow: mix("#f2f2f0", C.mid, 60), browW: 4.6, rest: { bottom: 0.16, raise: 4, browTilt: 8 } },
    mouth: { W: 7.6, rest: (y) => <path d={`M94 ${y + 2} Q100 ${y + 5} 106 ${y + 2}`} {...line("#a8584e", 2.6)} /> },
    mouthY: 140,
    back: (c) => <OttoBack {...c} />,
    front: () => (
      <g>
        <path d="M76 82 Q100 70 124 82" {...line("#d6a07c", 2)} opacity={0.5} />
        <ellipse cx={100} cy={128} rx={7} ry={6} fill="#e3a888" />
      </g>
    ),
    top: () => <OttoMoustache />,
    pendant: () => <LabCoat />,
    clothes: LAB,
    outfit: "blazer",
    attitude: { mood: "curious", tilt: 6, hands: { L: [86, 200], R: [134, 146], outL: true, outR: true } },
  }),
  makePerson({
    id: "more-imani",
    label: "Dr Imani",
    signature: "A scientist in her thirties with a big round afro and safety goggles pushed up on her forehead, in a lab coat — she sees how anything works",
    pitch: "Confident, hands-on, takes everything apart to see how it works and puts it back better. Wants everyone to try it themselves; the flaw is that she can't leave anything as it is. At rest, hands on hips, a big grin. Ability: Goggles down — snaps her goggles on and sees how anything works.",
    risk: "The goggles are part of her silhouette; she never mocks a wrong guess — a failed experiment is data.",
    age: "adult",
    skin: "#5e3a26",
    shade: "#472a1a",
    hair: "#1e1614",
    hairHi: "#4a3a34",
    lip: "#4a2018",
    iris: "#2a1810",
    eye: { lashes: 2, rest: { raise: 3, browTilt: -4 } },
    back: () => curls([[100, 84, 52], [62, 100, 22], [138, 100, 22]], "#1e1614"),
    front: () => (
      <path d="M60 104 Q60 72 100 70 Q140 72 140 104 Q124 88 100 88 Q76 88 60 104 Z" fill="#1e1614" />
    ),
    top: () => (
      <g>
        <path d="M58 88 Q100 78 142 88" {...line(C.deep, 4)} />
        <circle cx={84} cy={84} r={11} fill={C.hi} stroke={C.deep} strokeWidth={3} />
        <circle cx={116} cy={84} r={11} fill={C.hi} stroke={C.deep} strokeWidth={3} />
        <path d="M80 80 l4 -3 M112 80 l4 -3" {...line(EYE_WHITE, 2)} />
      </g>
    ),
    pendant: () => <LabCoat />,
    clothes: LAB,
    outfit: "blazer",
    attitude: { mood: "happy", tilt: -5, hands: { L: [78, 202], R: [122, 202], outL: true, outR: true } },
  }),
  makePerson({
    id: "more-haru",
    label: "Haru",
    signature: "A young scientist with messy black hair and big square glasses, a lab coat too long in the sleeves and a pocket full of pens — he counts anything at a glance",
    pitch: "Shy, precise, quietly thrilled by numbers; wants things to add up; the flaw is he corrects people mid-sentence and then apologises. At rest, pushing his glasses up. Ability: Count — counts anything at a glance.",
    risk: "Precise, never a know-it-all at the learner's expense.",
    age: "adult",
    skin: "#efc9a4",
    shade: "#d6a882",
    hair: "#18161e",
    hairHi: "#3e3a4a",
    lip: "#a0564e",
    iris: "#2a2018",
    eye: { rx: 7.8, ry: 8.8, rest: { raise: 2, browTilt: 10, look: [0, 0.6] } },
    back: () => <path d={blob(100, 104, 46, 44, 1.02)} fill="#18161e" />,
    front: () => (
      <g>
        {curls([[62, 96, 10], [70, 80, 12], [84, 68, 12], [100, 64, 12], [116, 66, 12], [130, 76, 12], [138, 92, 10], [92, 56, 7], [110, 54, 6]], "#18161e")}
        <path d="M60 102 Q100 86 140 102 L140 92 Q100 74 60 92 Z" fill="#18161e" />
      </g>
    ),
    top: () => (
      <g {...line("#2a2a34", 3)}>
        <rect x={68} y={106} width={28} height={22} rx={5} fill={EYE_WHITE} fillOpacity={0.2} />
        <rect x={104} y={106} width={28} height={22} rx={5} fill={EYE_WHITE} fillOpacity={0.2} />
        <path d="M96 114 L104 114" />
      </g>
    ),
    pendant: () => <LabCoat />,
    clothes: LAB,
    outfit: "blazer",
    attitude: { mood: "neutral", tilt: 6, hands: { L: [90, 200], R: [112, 140], outL: false, outR: true } },
  }),
];

export const WOMEN: Candidate[] = [
  makePerson({
    id: "more-priya",
    label: "Priya",
    signature: "A woman in her twenties with a long thick braid over one shoulder and small gold earrings — her braid flicks",
    pitch: "Sporty, upbeat, the one who organises the picnic and the relay; wants everyone to have a go; the flaw is she makes everything a race. At rest, a hand on her hip, the braid over her shoulder. Ability: Braid flick — one flick of her braid and she's off.",
    risk: "Competitive with herself, never with the learner.",
    age: "adult",
    skin: "#a86a48",
    shade: "#8a5232",
    hair: "#1e1416",
    hairHi: "#4a3438",
    lip: "#7a3430",
    iris: "#2a1810",
    eye: { lashes: 3, rest: { raise: 3, look: [1, 0] } },
    back: () => <path d={blob(100, 104, 44, 42, 1.02)} fill="#1e1416" />,
    front: () => (
      <g>
        <path d="M58 108 C56 72 78 62 100 62 C122 62 144 72 142 108 C138 92 124 82 102 80 L100 74 L98 80 C76 82 62 92 58 108 Z" fill="#1e1416" />
        <circle cx={58} cy={130} r={2.6} fill={C.accent} />
        <circle cx={142} cy={130} r={2.6} fill={C.accent} />
      </g>
    ),
    /* the braid falls over her right shoulder, in front of her */
    pendant: () => (
      <g fill="#1e1416">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx={118 + (i % 2 ? 2 : -2)} cy={150 + i * 9} rx={7 - i * 0.5} ry={6} />
        ))}
        <path d="M114 204 L122 204 L120 214 L116 214 Z" fill={C.accent} />
      </g>
    ),
    outfit: "hoodie",
    attitude: { mood: "happy", tilt: 6, hands: { L: [78, 202], R: [124, 200], outL: true, outR: true } },
  }),
  makePerson({
    id: "more-sofia",
    label: "Sofia",
    signature: "A woman in her twenties with a big cloud of red curls and dimples — she claps",
    pitch: "Bubbly, musical, sings the instructions; wants everyone joining in; the flaw is she can't stand silence. At rest, hands clasped, head tipped, mid-smile. Ability: Clap — one clap and everyone's on the beat.",
    risk: "Cheerful, never loud on an incorrect answer.",
    age: "adult",
    skin: "#f4cfb2",
    shade: "#dfac8a",
    hair: "#b2462a",
    hairHi: "#d8704a",
    lip: "#c0484a",
    iris: "#4a6a3a",
    eye: { lashes: 2, rest: { raise: 3, browTilt: 4 } },
    back: () =>
      curls(
        [
          [58, 96, 20],
          [142, 96, 20],
          [64, 124, 18],
          [136, 124, 18],
          [74, 70, 20],
          [126, 70, 20],
          [100, 60, 22],
        ],
        "#b2462a",
      ),
    front: () => curls([[72, 90, 11], [86, 80, 12], [100, 78, 12], [114, 80, 12], [128, 90, 11]], "#b2462a"),
    outfit: "dress",
    mouth: { rest: (y) => <g><path d={`M93 ${y} Q100 ${y + 6} 107 ${y}`} {...line("#c0484a", 2.8)} /><path d={`M89 ${y - 2} q-1.4 2 0 3.6 M111 ${y - 2} q1.4 2 0 3.6`} {...line("#dfac8a", 1.6)} /></g> },
    attitude: { mood: "happy", tilt: -8, hands: { L: [96, 186], R: [104, 186], outL: false, outR: false } },
  }),
  makePerson({
    id: "more-ama",
    label: "Ama",
    signature: "A woman in her twenties with box braids in a high ponytail and gold cuffs — her high five echoes",
    pitch: "Cool, funny, everybody's big sister; wants everyone to feel they belong; the flaw is she teases a bit too well. At rest, one hand up ready for a high five. Ability: High five — one so good it echoes across the pond.",
    risk: "Her teasing is always warm and never about a wrong answer.",
    age: "adult",
    skin: "#4e2e1e",
    shade: "#3a2014",
    hair: "#1a1214",
    hairHi: "#3e2e30",
    lip: "#3e1a14",
    iris: "#2a1810",
    eye: { lashes: 3, rest: { top: 0.1, raise: 2, browTilt: -6, look: [1.2, 0] } },
    back: () => (
      <g>
        {/* braids in a high ponytail, falling to one side, with gold cuffs */}
        {[-6, -2, 2, 6].map((dx, i) => (
          <path key={dx} d={`M${104 + dx} 60 C${120 + dx} 56 ${150 + dx} 74 ${150 + dx * 1.4} ${130 + i * 4}`} {...line("#1a1214", 5)} />
        ))}
        <circle cx={130} cy={66} r={4} fill={C.accent} />
        <circle cx={148} cy={100} r={3.2} fill={C.accent} />
      </g>
    ),
    front: () => (
      <g>
        <path d="M58 108 C56 72 78 60 100 60 C122 60 144 72 142 108 C134 90 120 80 100 80 C80 80 66 90 58 108 Z" fill="#1a1214" />
        <path d="M70 92 Q72 76 84 70 M84 84 Q86 72 96 66 M100 80 Q104 70 112 66 M116 82 Q122 74 130 72" {...line("#3e2e30", 1.6)} />
        <circle cx={104} cy={60} r={7} fill={C.accent} />
      </g>
    ),
    outfit: "dungarees",
    attitude: { mood: "neutral", tilt: -5, hands: { L: [80, 200], R: [140, 140], outL: true, outR: true } },
  }),
];

export const BOYS: Candidate[] = [
  makePerson({
    id: "more-leo",
    label: "Leo",
    signature: "A boy of about six with a backwards cap, a blond tuft poking out the front and two missing teeth — he hops",
    pitch: "Six and fearless, first to jump in the puddle; wants to be big; the flaw is he never sits still. At rest, both fists up. Ability: Hop — hops on one foot the whole way round the pond.",
    risk: "Mischief, never meanness.",
    age: "kid",
    skin: "#f2c9a6",
    shade: "#dca684",
    hair: "#e0b052",
    hairHi: "#f2cc78",
    lip: "#c06050",
    iris: "#3e6a8a",
    eye: { rx: 9.6, ry: 11, rest: { raise: 3, look: [0, -0.8] } },
    mouth: { gap: true },
    back: () => <path d={blob(100, 100, 46, 40, 1.02)} fill={C.accent} />,
    front: () => (
      <g>
        {/* the cap on backwards: its crown, and its peak sticking out behind his head on the right */}
        <path d="M58 100 C56 64 80 54 100 54 C120 54 144 64 142 100 Z" fill={C.accent} />
        <path d="M136 88 Q160 86 166 96 Q150 100 138 98 Z" fill={C.accentDeep} />
        <circle cx={100} cy={54} r={4} fill={C.accentDeep} />
        <path d="M72 100 Q74 90 84 92 Q86 84 94 90 Q100 82 104 92" fill="#e0b052" />
      </g>
    ),
    outfit: "dungarees",
    attitude: { mood: "delighted", tilt: 8, hands: { L: [62, 160], R: [138, 160], outL: true, outR: true } },
  }),
  makePerson({
    id: "more-kofi",
    label: "Kofi",
    signature: "A boy of about eight with a tall high-top and a star sticker on his cheek — he beatboxes",
    pitch: "Eight, a performer, turns everything into a song; wants an audience; the flaw is he can't whisper. At rest, a big grin, one thumb up. Ability: Beatbox — a beat from nowhere that everyone moves to.",
    risk: "Loud fun kept small: one beat, never a celebration that grows.",
    age: "kid",
    skin: "#5a3624",
    shade: "#442616",
    hair: "#161012",
    hairHi: "#3a2a2e",
    lip: "#3e1a14",
    iris: "#2a1810",
    eye: { rx: 9.4, ry: 10.6, rest: { raise: 3 } },
    front: () => (
      <g>
        {/* a high-top: a tall, flat-topped block of hair, faded close at the sides */}
        <path d="M66 98 L70 70 Q72 56 86 56 L114 56 Q128 56 130 70 L134 98 Q100 86 66 98 Z" fill="#161012" />
        <path d="M58 108 Q60 92 66 90 L66 100 Z M142 108 Q140 92 134 90 L134 100 Z" fill="#2a1e1c" />
        <path d="M82 64 Q100 59 118 64" {...line("#3a2a2e", 2.4)} />
        <path d="M124 128 l2 4.4 l4.8 0.6 l-3.6 3.2 l1 4.8 l-4.2 -2.4 l-4.2 2.4 l1 -4.8 l-3.6 -3.2 l4.8 -0.6 Z" fill={C.accent} />
      </g>
    ),
    headVB: "6 2 188 188",
    outfit: "hoodie",
    attitude: { mood: "happy", tilt: -6, hands: { L: [80, 202], R: [140, 146], outL: true, outR: true } },
  }),
  makePerson({
    id: "more-sami",
    label: "Sami",
    signature: "A shy boy of about seven with a bowl cut and big ears, peeking up — he hides behind his hands",
    pitch: "Seven and shy, notices everything and says little; wants to join in; the flaw is he waits to be asked. At rest, hands together, looking up from under his fringe. Ability: Peekaboo — vanishes behind his hands and pops back out.",
    risk: "Shy, never sad: the others always save him a place.",
    age: "kid",
    skin: "#cf9c74",
    shade: "#b47e56",
    hair: "#3a2418",
    hairHi: "#6a4a36",
    lip: "#9a4e40",
    iris: "#3a2418",
    eye: { rx: 9.6, ry: 11.2, rest: { raise: 2, browTilt: 12, look: [0, -1.6] } },
    ears: false,
    front: () => (
      <g>
        <ellipse cx={56} cy={120} rx={9} ry={11} fill="#cf9c74" />
        <ellipse cx={144} cy={120} rx={9} ry={11} fill="#cf9c74" />
        {/* a round bowl cut, straight across his brows */}
        <path d="M56 112 C54 70 78 58 100 58 C122 58 146 70 144 112 L144 104 Q100 98 56 104 Z" fill="#3a2418" />
        <path d="M58 104 L142 104" {...line("#3a2418", 4)} />
        <path d="M76 70 Q94 62 114 64" {...line("#6a4a36", 3)} />
      </g>
    ),
    outfit: "raincoat",
    mouth: { W: 6.8 },
    attitude: { mood: "neutral", tilt: 8, hands: { L: [96, 188], R: [104, 188], outL: false, outR: false } },
  }),
];

export const TEENS: Candidate[] = [
  makePerson({
    id: "more-mateo",
    label: "Mateo",
    signature: "A boy of about thirteen with wavy hair swept to one side and braces — he juggles anything",
    pitch: "Thirteen, a joker, can juggle anything you hand him; wants to be the funny one; the flaw is he can't resist a bad pun. At rest, a lopsided grin showing his braces. Ability: Juggle — keeps anything in the air.",
    risk: "His jokes are never at the learner.",
    age: "teen",
    skin: "#c08a62",
    shade: "#a46e48",
    hair: "#2a1a14",
    hairHi: "#5a3e30",
    lip: "#8a4a3a",
    iris: "#3a2214",
    mouth: { braces: true, rest: (y) => <path d={`M93 ${y + 1} Q101 ${y + 5} 108 ${y - 2}`} {...line("#8a4a3a", 2.8)} /> },
    front: () => (
      <g>
        <path d="M58 106 C56 70 80 58 104 58 C130 58 146 74 142 100 C134 90 126 86 120 88 C116 96 96 100 72 96 C66 98 62 102 58 106 Z" fill="#2a1a14" />
        <path d="M76 70 Q92 60 112 64 M96 78 Q110 70 124 76" {...line("#5a3e30", 2.8)} />
      </g>
    ),
    outfit: "hoodie",
    attitude: { mood: "happy", tilt: 6, hands: { L: [80, 202], R: [120, 202], outL: true, outR: true } },
  }),
  makePerson({
    id: "more-finn",
    label: "Finn",
    signature: "A boy of about twelve with messy ginger spikes and freckles everywhere — he whistles through his fingers",
    pitch: "Twelve, outdoorsy, knows every path round the pond; wants an adventure; the flaw is he never checks the map. At rest, thumbs hooked in his pockets, squinting at the horizon. Ability: Two-finger whistle — heard across the whole pond.",
    risk: "Adventurous, never reckless with the little ones.",
    age: "teen",
    skin: "#f6d2b8",
    shade: "#e2b094",
    hair: "#c8642a",
    hairHi: "#e8884a",
    lip: "#c06a5a",
    iris: "#3e6a3a",
    eye: { rest: { top: 0.2, raise: 1, look: [1.4, -0.6] } },
    front: () => (
      <g>
        <path d="M58 104 L60 78 L68 86 L72 66 L82 78 L88 58 L96 74 L104 56 L110 72 L120 60 L124 78 L134 70 L136 88 L142 104 Q122 90 100 94 Q78 90 58 104 Z" fill="#c8642a" />
        {[
          [80, 128],
          [86, 132],
          [76, 133],
          [114, 128],
          [120, 132],
          [124, 127],
          [96, 126],
          [104, 126],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={1.2} fill="#d8946a" />
        ))}
      </g>
    ),
    outfit: "raincoat",
    attitude: { mood: "neutral", tilt: -5, hands: { L: [84, 210], R: [116, 210], outL: true, outR: true } },
  }),
  makePerson({
    id: "more-dev",
    label: "Dev",
    signature: "A boy of about fourteen with a close buzz cut and a sweatband — he catches anything",
    pitch: "Fourteen, steady, the team's captain and goalkeeper; wants the team to win together; the flaw is he takes the blame for everyone. At rest, arms folded, a calm half-smile. Ability: Catch — catches anything, from anywhere.",
    risk: "Competitive, never with the learner; he always passes.",
    age: "teen",
    skin: "#8a5838",
    shade: "#704226",
    hair: "#1a1414",
    hairHi: "#3a2e2e",
    lip: "#5a2a20",
    iris: "#2a1810",
    eye: { rest: { raise: 1, browTilt: -4 } },
    front: () => (
      <g>
        {/* a close buzz cut that follows his head, a sweatband across it */}
        <path d="M60 102 C58 70 80 62 100 62 C120 62 142 70 140 102 Q100 88 60 102 Z" fill="#2a2020" />
        <path d="M58 94 Q100 80 142 94" {...line(C.accent, 7)} />
      </g>
    ),
    outfit: "hoodie",
    mouth: { rest: (y) => <path d={`M94 ${y + 1} Q101 ${y + 3} 107 ${y - 1}`} {...line("#5a2a20", 2.6)} /> },
    attitude: { mood: "neutral", tilt: 4, hands: { L: [112, 186], R: [88, 188], outL: false, outR: false } },
  }),
];

