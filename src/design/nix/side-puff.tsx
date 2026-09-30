import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import {
  arcUp,
  chevron,
  EYE_WHITE,
  line,
  OpenMouth,
  Orb,
  TONGUE_PINK,
  type EyeKit,
  type MouthKit,
} from "./rig/eyes";
import { CHIBI, J, pivot, type Body } from "./rig/skeleton";
import {
  curve,
  dMouth,
  face,
  FACE,
  FACE_SHADE,
  NO_NECK,
  OUTFITS,
  pal,
  Puffs,
  sides,
  Taper,
  wave,
} from "./side-candidates";
import { C } from "./theme";

/**
 * The puff family: three species from Puff's body of soft round puffs, each the animal itself —
 * a poodle, a pufferfish, a chick just hatched. Each has its own eyes and mouth, and an ability
 * that is what the animal naturally does.
 */

const g2 = (a: ReactNode, b: ReactNode) => (
  <g>
    {a}
    {b}
  </g>
);
const NOSE = "#2a1d22";

/* ——— Poodle: pompoms on its head, ears and tail; it fetches ——— */

const POODLE: Body = { ...CHIBI, id: "poodle", j: { ...J, earL: [64, 92], earR: [136, 92] }, neck: NO_NECK };
const palPoodle = pal(C.mid, C.hi);

function PoodleHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, POODLE.j)}>
          <Taper
            segs={[
              [
                [100 + s * 34, 90],
                [100 + s * 44, 104],
                [100 + s * 46, 122],
                [100 + s * 46, 134],
              ],
            ]}
            w0={16}
            w1={12}
            fill={C.mid}
          />
          <Puffs
            at={[
              [100 + s * 47, 142, 11],
              [100 + s * 40, 150, 8],
              [100 + s * 53, 152, 8],
            ]}
            fill={C.hi}
          />
        </g>
      ))}
      <ellipse cx={100} cy={106} rx={37} ry={35} fill={C.mid} />
      {/* the topknot */}
      <Puffs
        at={[
          [100, 68, 16],
          [83, 74, 12],
          [117, 74, 12],
          [91, 58, 11],
          [109, 58, 11],
        ]}
        fill={C.hi}
      />
      <ellipse cx={100} cy={124} rx={17} ry={12} fill={FACE} />
      <ellipse cx={100} cy={115} rx={5.4} ry={3.8} fill={NOSE} />
    </g>
  );
}

function PoodleBehind() {
  return (
    <g data-joint="tail" style={pivot("tail", POODLE.j)}>
      <path d="M110 200 Q124 196 132 180" {...line(C.mid, 6)} />
      <Puffs
        at={[
          [135, 172, 9],
          [141, 180, 6],
        ]}
        fill={C.hi}
      />
    </g>
  );
}

/** Poodle: big wet puppy eyes — dark brown, a large shine — and a dog's brow dots, which lift,
 *  tilt into puppy-dog eyes and knit. */
const POODLE_EYE = "#2a1a14";
const poodleEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const dot = (raise: number, inward = 0) => (
    <ellipse
      cx={x - s * inward}
      cy={y - 12 - raise}
      rx={3.4}
      ry={2.2}
      fill={C.tint}
      transform={`rotate(${s * inward * 4} ${x} ${y - 12 - raise})`}
    />
  );
  const open = (k = 1, top = 0, tilt = 0, extra = false) => (
    <Orb id={id} x={x} y={y} rx={6.4 * k} ry={7 * k} s={s} fill={POODLE_EYE} lid={{ top, tilt, color: C.mid }}>
      <circle cx={x - 2.2 + dx} cy={y - 2.4 + dy} r={2.8 * k} fill={EYE_WHITE} />
      <circle cx={x + 2.4 + dx} cy={y + 2.8 + dy} r={1.2} fill={EYE_WHITE} />
      {extra && <circle cx={x + 2.4 + dx} cy={y - 3 + dy} r={1.4} fill={EYE_WHITE} />}
    </Orb>
  );
  switch (mood) {
    case "happy":
      return g2(<path d={arcUp(x, y, 6, 4)} {...line(POODLE_EYE, 3.2)} />, dot(3));
    case "delighted":
      return g2(open(1.2, 0, 0, true), dot(6));
    case "curious":
      return g2(open(1.1), dot(s === 1 ? 6 : 0));
    case "thinking":
      return g2(open(1, 0.3), dot(s === -1 ? 4 : -1));
    case "focused":
      return g2(open(1, 0.44, -8), dot(-2, 1.5));
    case "worried":
      return g2(open(1.05, 0.08, 14, true), dot(2, -2));
    case "oops":
      return g2(<path d={chevron(x, y, s, 5, 5)} {...line(POODLE_EYE, 3)} />, dot(3, -1));
    case "wink":
      return s === 1 ? g2(<path d={arcUp(x, y, 6, 4)} {...line(POODLE_EYE, 3.2)} />, dot(1)) : g2(open(), dot(3));
    default:
      return g2(open(), dot(0));
  }
};

/** Poodle: a dog's split lip under the nose; it pants with its tongue out when it is happy. */
const poodleMouth: MouthKit = ({ mood, y }) => {
  const c = NOSE;
  const lip = (tilt = 0, d = 3.5) => (
    <g>
      <path d={`M100 ${y - 5} L100 ${y}`} {...line(c, 2)} />
      <path d={`M93 ${y + tilt} Q96.5 ${y + d + tilt} 100 ${y} Q103.5 ${y + d - tilt} 107 ${y - tilt}`} {...line(c, 2.2)} />
    </g>
  );
  const tongueOut = (x: number, len: number) => (
    <path d={`M${x - 3.5} ${y + 2} L${x - 3.5} ${y + len} a3.5 3.5 0 0 0 7 0 L${x + 3.5} ${y + 2} Z`} fill={TONGUE_PINK} />
  );
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y - 1, 7, 6)} fill={c} />, tongueOut(100, 11));
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 2, 9, 9)} fill={c} />, tongueOut(100, 15));
    case "curious":
      return g2(<path d={`M100 ${y - 5} L100 ${y - 1}`} {...line(c, 2)} />, <ellipse cx={100} cy={y + 2} rx={2.4} ry={3} fill={c} />);
    case "thinking":
      return lip(1.5);
    case "focused":
      return lip(0, 1.5);
    case "worried":
      return g2(<path d={`M100 ${y - 5} L100 ${y}`} {...line(c, 2)} />, <path d={wave(y + 2, 6, 2.6)} {...line(c, 2.2)} />);
    case "oops":
      return g2(lip(), tongueOut(103, 6));
    case "wink":
      return g2(lip(-1), tongueOut(104, 7));
    default:
      return lip();
  }
};

/* ——— Pufferfish: a round, spotted fish with soft spikes; it puffs up ——— */

const PUFFER: Body = {
  ...CHIBI,
  id: "pufferfish",
  torso: "M90 156 Q100 152 110 156 Q112 162 100 163 Q88 162 90 156 Z",
  neck: NO_NECK,
};
const palPuffer = pal(C.mid, C.mid);
const SPIKES = Array.from({ length: 9 }, (_, i) => 200 + i * 17.5);

function PufferHead() {
  return (
    <g>
      <path d="M146 118 L172 96 Q164 118 172 140 Z" fill={C.primary} />
      <path d="M84 64 Q100 36 116 64 Z" fill={C.primary} />
      {SPIKES.map((a) => {
        const r = (a * Math.PI) / 180;
        const [cx, cy] = [100 + Math.cos(r) * 49, 112 + Math.sin(r) * 49];
        const [ox, oy] = [Math.cos(r), Math.sin(r)];
        const [nx, ny] = [-oy, ox];
        return (
          <path
            key={a}
            d={`M${cx + nx * 5} ${cy + ny * 5} L${cx + ox * 9} ${cy + oy * 9} L${cx - nx * 5} ${cy - ny * 5} Z`}
            fill={C.primary}
            strokeLinejoin="round"
          />
        );
      })}
      <circle cx={100} cy={112} r={50} fill={C.mid} />
      <ellipse cx={100} cy={138} rx={36} ry={21} fill={FACE} />
      {[
        [84, 74, 3.4],
        [100, 68, 3.8],
        [116, 74, 3.4],
        [70, 90, 2.6],
        [130, 90, 2.6],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={C.primary} />
      ))}
    </g>
  );
}

function PufferBehind() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, { ...J, wingL: [58, 130], wingR: [142, 130] })}>
          <ellipse cx={100 + s * 52} cy={134} rx={12} ry={7} transform={`rotate(${s * 30} ${100 + s * 52} 134)`} fill={C.primary} />
        </g>
      ))}
    </g>
  );
}

/** Pufferfish: big bulging eyes, all white, with a small pupil that darts about — it looks where it
 *  is going, and at you. */
const pufferEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const [dx, dy] = look;
  const open = (pupil: number, px = 0, py = 0, top = 0, tilt = 0, bottom = 0) => (
    <Orb id={id} x={x} y={y} rx={10.5} ry={10.5} s={s} fill={EYE_WHITE} lid={{ top, tilt, bottom, color: C.mid }}>
      <circle cx={x + px + dx * 1.4} cy={y + py + dy * 1.4} r={pupil} fill={p.ink} />
      <circle cx={x + px + dx * 1.4 - pupil * 0.35} cy={y + py + dy * 1.4 - pupil * 0.4} r={pupil * 0.3} fill={EYE_WHITE} />
    </Orb>
  );
  switch (mood) {
    case "happy":
      return open(4.4, 0, 0, 0.06, 0, 0.44);
    case "delighted":
      return open(6);
    case "curious":
      return open(4.6, 3, -1);
    case "thinking":
      return open(4, -3, -4, 0.24);
    case "focused":
      return open(3.4, -s * 3, 1, 0.44, -8);
    case "worried":
      return open(2.4, 0, 1, 0.14, 16);
    case "oops":
      return <path d={chevron(x, y, s, 6, 6)} {...line(p.ink, 3.2)} />;
    case "wink":
      return s === 1 ? <path d={arcUp(x, y, 7, 4.5)} {...line(p.ink, 3.2)} /> : open(4);
    default:
      return open(4);
  }
};

/** Pufferfish: puckered fish lips in the accent, that kiss, pout, press and gape. */
const pufferMouth: MouthKit = ({ mood, y, pal: p }) => {
  const lips = (rx0: number, ry0: number, inner: number, cx = 100, rot = 0) => {
    const [rx, ry] = [rx0 * 1.4, ry0 * 1.4];
    return (
    <g transform={`rotate(${rot} ${cx} ${y + 2})`}>
      <ellipse cx={cx} cy={y + 2} rx={rx} ry={ry} fill={C.accent} />
      <ellipse cx={cx} cy={y + 2} rx={rx * inner} ry={ry * inner * 0.8} fill={p.ink} />
    </g>
    );
  };
  switch (mood) {
    case "happy":
      return <path d={curve(y, 11, 8)} {...line(C.accent, 6.5)} />;
    case "delighted":
      return g2(lips(8.5, 8.5, 0.66), <ellipse cx={100} cy={y + 6} rx={3.4} ry={2.2} fill={TONGUE_PINK} />);
    case "curious":
      return lips(4.2, 4.2, 0.4);
    case "thinking":
      return lips(5, 4, 0.36, 106, -14);
    case "focused":
      return <ellipse cx={100} cy={y + 2} rx={9} ry={3.6} fill={C.accent} />;
    case "worried":
      return <path d={wave(y + 2, 10, 3.4)} {...line(C.accent, 6)} />;
    case "oops":
      return g2(lips(6.5, 5.5, 0.5), <ellipse cx={101} cy={y + 7.5} rx={2.6} ry={2.4} fill={TONGUE_PINK} />);
    case "wink":
      return lips(4.6, 4.2, 0.36, 103);
    default:
      return lips(6, 4.8, 0.44);
  }
};

/* ——— Chick: a ball of fluff still in the bottom of its eggshell; it ducks into its shell ——— */

const CHICK: Body = {
  ...CHIBI,
  id: "chick",
  neck: NO_NECK,
  headVB: "36 56 128 128",
  w: { ...CHIBI.w, thigh: 5, shin: 5 },
};
const palChick = pal(C.accent, C.accent);

function ChickHead({ mood }: Ctx) {
  const droop = mood === "worried" || mood === "oops" ? 34 : mood === "delighted" ? -14 : 0;
  const rim = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return [100 + Math.cos(a) * 48, 128 + Math.sin(a) * 46, 9] as const;
  });
  return (
    <g>
      {/* the tuft: three curls that stand up, and droop when it is worried */}
      <g transform={`rotate(${droop} 100 84)`}>
        <path d="M100 84 C96 70 90 64 84 66" {...line(C.primary, 5)} />
        <path d="M100 84 C100 68 104 60 110 60" {...line(C.primary, 5)} />
        <path d="M100 84 C104 72 112 70 118 74" {...line(C.primary, 4)} />
      </g>
      <Puffs at={rim} fill={C.mid} />
      <circle cx={100} cy={128} r={48} fill={C.mid} />
    </g>
  );
}

function ChickShell() {
  return (
    <g>
      <path
        d="M54 170 L62 160 L70 170 L78 160 L86 170 L94 160 L102 170 L110 160 L118 170 L126 160 L134 170 L142 160 L147 170 C148 200 126 218 100 218 C74 218 52 200 54 170 Z"
        fill={FACE_SHADE}
      />
      <circle cx={80} cy={194} r={3} fill={C.hi} />
      <circle cx={118} cy={200} r={2.4} fill={C.hi} />
      <circle cx={104} cy={186} r={2} fill={C.hi} />
    </g>
  );
}

function ChickBehind() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, { ...J, wingL: [56, 140], wingR: [144, 140] })}>
          <ellipse cx={100 + s * 50} cy={146} rx={8} ry={14} transform={`rotate(${s * 40} ${100 + s * 50} 146)`} fill={C.primary} />
        </g>
      ))}
    </g>
  );
}

/** Chick: wide, flat black ovals — wider than tall — with one shine. They squash to arcs, round up
 *  when delighted, and slant when worried; the tuft does the rest. */
const chickEyes: EyeKit = ({ mood, s, x, y, look, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const oval = (rx: number, ry: number, rot = 0) => (
    <g transform={`rotate(${rot} ${x + dx} ${y + dy})`}>
      <ellipse cx={x + dx} cy={y + dy} rx={rx} ry={ry} fill={ink} />
      <circle cx={x + dx - rx * 0.35} cy={y + dy - ry * 0.3} r={Math.min(rx, ry) * 0.36} fill={EYE_WHITE} />
    </g>
  );
  switch (mood) {
    case "happy":
      return <path d={arcUp(x, y, 6, 4)} {...line(ink, 3.2)} />;
    case "delighted":
      return oval(8, 8);
    case "curious":
      return oval(7.4, 6.8);
    case "thinking":
      return oval(6.6, 4.6, s * 10);
    case "focused":
      return oval(7.6, 2.8);
    case "worried":
      return oval(6, 4.8, -s * 20);
    case "oops":
      return <path d={chevron(x, y, s, 4.5, 4.5)} {...line(ink, 3)} />;
    case "wink":
      return s === 1 ? <path d={arcUp(x, y, 6, 4)} {...line(ink, 3.2)} /> : oval(7.6, 5.4);
    default:
      return oval(7.6, 5.4);
  }
};

/** Chick: a small beak in the accent, which opens wide to cheep. */
const chickMouth: MouthKit = ({ mood, y, pal: p }) => {
  const closed = (dx = 0, rot = 0) => (
    <path d={`M${94 + dx} ${y} L${100 + dx} ${y - 4} L${106 + dx} ${y} L${100 + dx} ${y + 5} Z`} fill={C.accent} transform={`rotate(${rot} ${100 + dx} ${y})`} />
  );
  const open = (gap: number, tongue = false) => (
    <g>
      <path d={`M94 ${y} L106 ${y} L100 ${y + gap + 4} Z`} fill={p.ink} />
      {tongue && <ellipse cx={100} cy={y + gap} rx={2.4} ry={1.8} fill={TONGUE_PINK} />}
      <path d={`M93 ${y} L100 ${y - 5} L107 ${y} Z`} fill={C.accent} />
      <path d={`M95 ${y + gap} L105 ${y + gap} L100 ${y + gap + 5} Z`} fill={C.accent} />
    </g>
  );
  switch (mood) {
    case "happy":
      return open(4);
    case "delighted":
      return open(7, true);
    case "curious":
      return open(2);
    case "thinking":
      return closed(3, -10);
    case "worried":
      return closed(0, 180);
    case "oops":
      return open(5, true);
    case "wink":
      return open(3);
    default:
      return closed();
  }
};

/* ——— The three ——— */

export const PUFF_FAMILY: Candidate[] = [
  {
    id: "side-poodle",
    kind: "animal",
    frame: POODLE,
    outline: false,
    label: "Poodle",
    signature: "Pompoms on its head, its long ears and its tail — it fetches",
    pitch:
      "From Puff's soft puffs: a poodle, whose clip is a set of pompoms — a topknot, one at the end of each long ear, one on the tail, a puff on the chest. Its ability is Fetch: it runs off and brings the thing back. Big wet puppy eyes with a dog's brow dots, and a split lip that pants with its tongue out.",
    risk: "Dogs are common in children's apps; the pompoms and the product blue make it its own.",
    pal: palPoodle,
    body: C.mid,
    face: face({ eyeY: 102, eyeGap: 16, mouthY: 122, kit: poodleEyes, mouthKit: poodleMouth }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: () => <PoodleBehind />,
    head: () => <PoodleHead />,
    belly: () => (
      <Puffs
        at={[
          [92, 160, 8],
          [108, 160, 8],
          [100, 167, 9],
        ]}
        fill={C.hi}
      />
    ),
  },
  {
    id: "side-pufferfish",
    kind: "animal",
    frame: PUFFER,
    legs: false,
    arms: false,
    outline: false,
    label: "Pufferfish",
    signature: "A round spotted fish with soft spikes and fish lips — it puffs up",
    pitch:
      "Puff taken literally: a pufferfish, one round body with soft spikes over its back, spots, small fins and a tail. Its ability is Puff up: it gulps and swells into a spiky ball, then lets it out again — surprise, made visible. Bulging white eyes with darting pupils, and puckered lips in the accent that kiss, pout and gape.",
    risk: "Puffing up is a fright response; it should read as a gasp of surprise, never alarm at a wrong answer.",
    pal: palPuffer,
    body: C.mid,
    face: face({ eyeY: 98, eyeGap: 24, mouthY: 124, kit: pufferEyes, mouthKit: pufferMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    behind: () => <PufferBehind />,
    head: () => <PufferHead />,
  },
  {
    id: "side-chick",
    kind: "animal",
    frame: CHICK,
    arms: false,
    outline: false,
    label: "Chick",
    signature: "A ball of fluff with a curly tuft, still in the bottom of its eggshell — it ducks into its shell",
    pitch:
      "From Puff: one round ball of fluff with a curly tuft, standing in the bottom half of the eggshell it hatched from, on thin legs. Its ability is Shell: when it is shy it ducks down into its shell, and pops out again. Wide flat eyes, a beak that opens to cheep, and a tuft that droops when it is worried.",
    risk: "A chick is a baby; it must never make hatching or growing up a reward.",
    pal: palChick,
    body: C.mid,
    face: face({ eyeY: 118, eyeGap: 18, mouthY: 132, kit: chickEyes, mouthKit: chickMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    behind: () => <ChickBehind />,
    head: (c) => <ChickHead {...c} />,
    top: () => <ChickShell />,
  },
];

