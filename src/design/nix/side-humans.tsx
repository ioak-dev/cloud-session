import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import { palette } from "./firefly-variants";
import {
  arcDown,
  arcUp,
  chevron,
  EYE_WHITE,
  line,
  OpenMouth,
  Orb,
  roundRect,
  TONGUE_PINK,
  turnAt,
  type EyeKit,
  type MouthKit,
} from "./rig/eyes";
import type { Palette } from "./rig/palette";
import { CHIBI, type Body } from "./rig/skeleton";
import { curve, dMouth, sides, Taper, wave } from "./side-candidates";
import { C } from "./theme";

/**
 * Human side candidates: Juno (after the brightness of Duolingo's Zari) and Lulu (in the spirit
 * of Spy × Family's Anya). The spirit only, never the look: each has her own hair, face, eyes and
 * mouth, and an ability that comes from herself.
 *
 * No outlines. Hair is drawn per character (the head's back and front), not from the shared hair
 * kit, and every character has its own eye and mouth kits.
 */

export const g2 = (a: ReactNode, b: ReactNode) => (
  <g>
    {a}
    {b}
  </g>
);

export const OUTFITS: Candidate["outfits"] = [
  "dungarees",
  "hoodie",
  "raincoat",
  "dress",
  "blazer",
  "winter",
  "party",
];

export function human(skin: string, shade: string, hair: string, hairHi: string): Palette {
  return palette(skin, skin, skin, shade, {
    line: "none",
    hair,
    hairHi,
    eye: "#1f1a36",
    top: C.clothes,
    topAlt: "#fff3de",
    bottom: C.deep,
    shoe: C.deep,
    accent: C.accent,
    blush: "#f08f9b",
  });
}

export const face = (over: Partial<Candidate["face"]> & { lid: string }): Candidate["face"] => ({
  eyes: "anime",
  eyeY: 106,
  eyeGap: 17,
  mouthY: 127,
  nose: "dot",
  brows: false,
  ...over,
});

/* ——— Juno — bright and animated (Zari-inspired), a girl ——— */

const JUNO_SKIN = "#8a5634";
const JUNO_HAIR = "#4a2e24";
const palJuno = human(JUNO_SKIN, "#6e4127", JUNO_HAIR, "#4a3128");

const CURL_FRINGE = [
  [64, 76, 10],
  [74, 68, 11],
  [86, 64, 11],
  [100, 62, 11],
  [114, 64, 11],
  [126, 68, 11],
  [136, 76, 10],
  [58, 90, 9],
  [142, 90, 9],
] as const;

function JunoBack() {
  return (
    <g fill={JUNO_HAIR}>
      <ellipse cx={100} cy={94} rx={52} ry={48} />
      {/* the high puff of curls */}
      {[
        [100, 30, 26],
        [78, 38, 18],
        [122, 38, 18],
        [88, 18, 16],
        [112, 18, 16],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

function JunoHead() {
  return (
    <g>
      <circle cx={58} cy={110} r={7} fill={JUNO_SKIN} />
      <circle cx={142} cy={110} r={7} fill={JUNO_SKIN} />
      <ellipse cx={100} cy={104} rx={42} ry={40} fill={JUNO_SKIN} />
      <g fill={JUNO_HAIR}>
        {CURL_FRINGE.map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <path d="M62 60 Q100 30 138 60" {...line(C.accent, 7)} />
      <circle cx={57} cy={124} r={5} {...line(C.accent, 2.2)} />
      <circle cx={143} cy={124} r={5} {...line(C.accent, 2.2)} />
    </g>
  );
}

/** Juno: big round eyes nearly filled by a warm brown iris, two shines, a bold lash line with two
 *  lashes, and thick, very mobile brows. */
const junoEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const lash = (bx: number, by: number) => (
    <path
      d={`M${bx} ${by} l${s * 3.6} -2.6 M${bx - s * 2} ${by - 2.4} l${s * 2.6} -3.2`}
      {...line(ink, 2)}
    />
  );
  const brow = (raise: number, tilt: number) => {
    const by = y - 17 - raise;
    return (
      <path
        d={`M${x - 7} ${by + 1.5} Q${x} ${by - 4} ${x + 7} ${by + 1.5}`}
        {...line(JUNO_HAIR, 4.2)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (top = 0, tilt = 0, bottom = 0, k = 1, extra = false) => {
    const rx = 8 * k;
    const ry = 9.6 * k;
    return (
      <g>
        <Orb
          id={id}
          x={x}
          y={y}
          rx={rx}
          ry={ry}
          s={s}
          fill={EYE_WHITE}
          lid={{ top, tilt, bottom, color: JUNO_SKIN }}
          edge={{ color: ink, width: 1.8 }}
        >
          <circle cx={x + dx} cy={y + 1 + dy} r={6.4 * k} fill="#5a3322" />
          <circle cx={x + dx} cy={y + 1 + dy} r={3 * k} fill={ink} />
          <circle cx={x - 2.4 + dx} cy={y - 2.4 + dy} r={2.4 * k} fill={EYE_WHITE} />
          <circle cx={x + 2.6 + dx} cy={y + 3.4 + dy} r={1.1} fill={EYE_WHITE} />
          {extra && <circle cx={x + 2.8 + dx} cy={y - 3 + dy} r={1.4} fill={EYE_WHITE} />}
        </Orb>
        {top === 0 && (
          <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1}`} {...line(ink, 3)} />
        )}
        {lash(x + s * (rx - 1.5), top === 0 ? y - ry * 0.55 : y - ry + 2 * ry * top)}
      </g>
    );
  };
  const shut = (d: string) => (
    <g>
      <path d={d} {...line(ink, 3)} />
      {lash(x + s * 6, y)}
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(open(0.1, 0, 0.42), brow(3, 0));
    case "delighted":
      return g2(open(0, 0, 0, 1.12, true), brow(7, 0));
    case "curious":
      return g2(open(), s === 1 ? brow(7, -10) : brow(0, 4));
    case "thinking":
      return g2(open(0.3), s === -1 ? brow(6, 10) : brow(-1, -8));
    case "focused":
      return g2(open(0.42, -8), brow(-3, -16));
    case "worried":
      return g2(open(0.12, 14, 0, 1, true), brow(2, 20));
    case "oops":
      return g2(shut(`M${x + s * 6} ${y - 5} L${x - s * 5} ${y} L${x + s * 6} ${y + 5}`), brow(3, 18));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y, 7, 4.5)), brow(-1, -4)) : g2(open(), brow(3, 0));
    default:
      return g2(open(), brow(0, 0));
  }
};

/* ——— Mouths ——— */

const JUNO_LIP = "#6b3024";
export const MOUTH_IN = "#3a1d24";

/** Juno: full lips; she grins wide, with her top teeth showing. */
const junoMouth: MouthKit = ({ mood, y }) => {
  const smile = (dx = 0, rot = 0) => (
    <path
      d={`M${90 + dx} ${y} Q${100 + dx} ${y + 9} ${110 + dx} ${y} Q${100 + dx} ${y + 4} ${90 + dx} ${y} Z`}
      fill={JUNO_LIP}
      transform={`rotate(${rot} ${100 + dx} ${y})`}
    />
  );
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 10, 8)} fill={MOUTH_IN} teeth={[88, y - 1, 24, 3.6]} tongue={[100, y + 11, 5, 3]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 12, 11)} fill={MOUTH_IN} teeth={[86, y - 2, 28, 4]} tongue={[100, y + 14, 6, 3.6]} />;
    case "curious":
      return g2(<ellipse cx={100} cy={y + 2} rx={4.4} ry={5} fill={JUNO_LIP} />, <ellipse cx={100} cy={y + 2} rx={2.2} ry={3} fill={MOUTH_IN} />);
    case "thinking":
      return smile(4, -10);
    case "focused":
      return <ellipse cx={100} cy={y + 1} rx={7} ry={2.4} fill={JUNO_LIP} />;
    case "worried":
      return <path d={wave(y + 2, 7, 3)} {...line(JUNO_LIP, 3.4)} />;
    case "oops":
      return <OpenMouth d={dMouth(y, 7, 5, 102)} fill={MOUTH_IN} teeth={[94, y - 1, 16, 3]} tongue={[104, y + 7, 4, 3]} />;
    case "wink":
      return <OpenMouth d={dMouth(y, 8, 6, 103)} fill={MOUTH_IN} teeth={[95, y - 1, 16, 3]} />;
    default:
      return smile();
  }
};

/* ——— Anya-spirited girls ———
 * In the spirit of Spy × Family's Anya — a tiny girl with a big head and huge, rubbery faces — not
 * her look: no pink hair, no black cone clips, no green eyes, no school uniform. Faces are what
 * they are made of: each has a gag face per mood (a smug scheming look, a blank shock). */

const BIG_HEAD = "translate(100 150) scale(1.14) translate(-100 -150)";
export const BIG: Body = { ...CHIBI, id: "big-head", headFit: BIG_HEAD, neck: { x: 94, y: 138, w: 12, h: 18 } };

/* Lulu: caramel hair with a side pony; her eyes go huge and shiny when she wants something. */
const LULU_SKIN = "#f7dcca";
const LULU_HAIR = "#c9894a";
const palLulu = human(LULU_SKIN, "#e6bca6", LULU_HAIR, "#e0a868");

function LuluBack() {
  return (
    <g>
      <Taper
        segs={[
          [
            [60, 74],
            [44, 80],
            [30, 96],
            [28, 118],
          ],
        ]}
        w0={24}
        w1={10}
        fill={LULU_HAIR}
      />
      <path d="M52 128 C46 70 70 46 100 46 C130 46 154 70 148 128 Q140 136 130 132 L70 132 Q60 136 52 128 Z" fill={LULU_HAIR} />
      <circle cx={58} cy={74} r={6} fill={C.accent} />
    </g>
  );
}

function LuluHead() {
  return (
    <g>
      <ellipse cx={100} cy={108} rx={42} ry={40} fill={LULU_SKIN} />
      {/* a choppy fringe */}
      <path
        d="M58 98 C56 62 78 50 100 50 C122 50 144 62 142 98 L136 84 L128 92 L118 80 L108 90 L98 78 L88 90 L78 80 L70 92 L64 84 Z"
        fill={LULU_HAIR}
      />
    </g>
  );
}

/** Lulu: huge round eyes with a big violet iris. Shocked, the iris shrinks to a dot; scheming, the
 *  lids drop flat and the eyes slide sideways — the smug face. */
const luluEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 17 - raise;
    return <path d={`M${x - 6} ${by + 1} Q${x} ${by - 2} ${x + 6} ${by + 1}`} {...line(LULU_HAIR, 3)} transform={turnAt(s, tilt, x, by)} />;
  };
  const open = (k = 1, iris = 7.4, top = 0, bottom = 0, tilt = 0, px = 0, extra = false) => {
    const rx = 10 * k;
    const ry = 11 * k;
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={EYE_WHITE} lid={{ top, bottom, tilt, color: LULU_SKIN }} edge={{ color: ink, width: 1.8 }}>
          <circle cx={x + dx + px} cy={y + 1 + dy} r={iris} fill="#7b5cc4" />
          <circle cx={x + dx + px} cy={y + 1 + dy} r={Math.min(3.4, iris * 0.5)} fill={ink} />
          {iris > 3 && <circle cx={x - 2.8 + dx + px} cy={y - 2.6 + dy} r={2.8} fill={EYE_WHITE} />}
          {iris > 3 && <circle cx={x + 3 + dx + px} cy={y + 4 + dy} r={1.3} fill={EYE_WHITE} />}
          {extra && <circle cx={x + 3.2 + dx + px} cy={y - 3.4 + dy} r={1.6} fill={EYE_WHITE} />}
        </Orb>
        {top === 0 && <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1} l${s * 3} -3`} {...line(ink, 3)} />}
      </g>
    );
  };
  switch (mood) {
    case "happy":
      return g2(<path d={arcUp(x, y, 8.5, 5)} {...line(ink, 3.4)} />, brow(3, 0));
    case "delighted":
      return g2(open(1.1, 8.4, 0, 0, 0, 0, true), brow(7, 0));
    case "curious":
      return g2(open(1, 7.4), s === 1 ? brow(7, -10) : brow(0, 4));
    case "thinking":
      return g2(open(1, 6.4, 0.5, 0.18, 0, 3.4), brow(-2, 0));
    case "focused":
      return g2(open(1, 6.6, 0.4, 0, -10), brow(-3, -14));
    case "worried":
      return g2(open(1.08, 2.4), brow(4, 18));
    case "oops":
      return g2(<path d={chevron(x, y, s, 6.5, 6)} {...line(ink, 3.4)} />, brow(3, 16));
    case "wink":
      return s === 1 ? g2(<path d={arcUp(x, y, 8.5, 5)} {...line(ink, 3.4)} />, brow(0, 0)) : g2(open(), brow(3, 0));
    default:
      return g2(open(), brow(0, 0));
  }
};

/** Lulu: gag mouths — a “:3” at rest, a grin that takes her whole chin, the smug flat “heh”, and a
 *  gritted grimace for a fright. */
const luluMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 11, 8)} fill={MOUTH_IN} tongue={[100, y + 11, 5.5, 3.2]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 2, 14, 13)} fill={MOUTH_IN} teeth={[84, y - 3, 32, 3.6]} tongue={[100, y + 16, 7, 4]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={3} ry={3.8} fill={ink} />;
    case "thinking":
      return <path d={`M88 ${y + 1} Q100 ${y + 3.5} 112 ${y - 1.5} l2 -2.5`} {...line(ink, 2.6)} />;
    case "focused":
      return <path d={`M96 ${y + 1} L104 ${y + 1}`} {...line(ink, 2.6)} />;
    case "worried":
      return (
        <OpenMouth d={roundRect(100, y + 3, 22, 9, 3.5)} fill={MOUTH_IN} teeth={[88, y - 2, 24, 4]} />
      );
    case "oops":
      return g2(<path d={wave(y + 1, 8, 3)} {...line(ink, 2.6)} />, <ellipse cx={104} cy={y + 5} rx={2.6} ry={2.8} fill={TONGUE_PINK} />);
    case "wink":
      return <OpenMouth d={dMouth(y, 9, 7, 103)} fill={MOUTH_IN} tongue={[103, y + 9, 4.5, 3]} />;
    default:
      return <path d={`M93 ${y} Q96.5 ${y + 3.5} 100 ${y} Q103.5 ${y + 3.5} 107 ${y}`} {...line(ink, 2.4)} />;
  }
};

/* ——— The people ——— */

export const SIDE_HUMANS: Candidate[] = [
  {
    id: "side-juno",
    kind: "human",
    frame: CHIBI,
    outline: false,
    hands: "mitten",
    label: "Juno",
    signature: "A high puff of curls, a headband and hoops — she cartwheels",
    pitch:
      "Inspired by Zari's brightness: quick, warm, all motion. A girl with a high puff of curls, a curly fringe and a headband in the accent. Her ability is Cartwheel: she arrives, and leaves, with a cartwheel. Big round eyes almost filled by a warm brown iris, and thick brows that do a lot of the talking.",
    risk: "Energy must not make the product loud: one cartwheel, never a celebration that grows. Too close to Zari if she wears Zari's colours or hair.",
    pal: palJuno,
    body: C.clothes,
    face: face({ lid: JUNO_SKIN, kit: junoEyes, mouthKit: junoMouth }),
    outfit: "dungarees",
    outfits: OUTFITS,
    headBack: () => <JunoBack />,
    head: () => <JunoHead />,
  },
  {
    id: "side-lulu",
    kind: "human",
    frame: BIG,
    outline: false,
    hands: "mitten",
    label: "Lulu",
    signature: "A tiny girl with a big head, caramel hair in a side pony — her eyes go huge and shiny",
    pitch:
      "Anya-spirited: a tiny girl with a big head and the most rubbery face in the cast — a smug scheming look, a gritted fright, a grin that takes her chin. Caramel hair with a choppy fringe and a side pony tied in the accent. Her ability is Puppy eyes, from the face she is made of: when she wants something, her eyes swell huge, glossy and brimming, and no one can say no. Huge round eyes with a violet iris that shrinks to a dot when she is startled.",
    risk: "Must stay clear of Anya's design: no pink hair, no cone clips, no green eyes, no uniform. Puppy eyes must never be aimed at the learner to get something from them, and never on an incorrect answer.",
    pal: palLulu,
    body: C.clothes,
    face: face({ eyeY: 110, eyeGap: 18, mouthY: 131, lid: LULU_SKIN, kit: luluEyes, mouthKit: luluMouth }),
    outfit: "dress",
    outfits: OUTFITS,
    headBack: () => <LuluBack />,
    head: () => <LuluHead />,
  },
];
