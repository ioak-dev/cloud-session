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
 * Human side candidates: Juno (after the brightness of Duolingo's Zari), Wren (after Lily's
 * deadpan), and Lulu and Mimi, in the spirit of Spy × Family's Anya. The spirit only, never the
 * look: each has her own hair, face, eyes and mouth.
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

/* Lulu: caramel hair with a side pony; she peeks over things. */
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

/* Mimi: chestnut space buns and a curtain fringe; she sneaks about on tiptoe. */
const MIMI_SKIN = "#f3d2bd";
const MIMI_HAIR = "#7a4a32";
const palMimi = human(MIMI_SKIN, "#e0b39c", MIMI_HAIR, "#9a6446");

function MimiBack() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side}>
          <circle cx={100 + s * 38} cy={52} r={19} fill={MIMI_HAIR} />
          <ellipse cx={100 + s * 32} cy={66} rx={9} ry={4} transform={`rotate(${s * 35} ${100 + s * 32} 66)`} fill={C.accent} />
        </g>
      ))}
      <ellipse cx={100} cy={100} rx={48} ry={48} fill={MIMI_HAIR} />
    </g>
  );
}

function MimiHead() {
  return (
    <g>
      <ellipse cx={100} cy={108} rx={42} ry={40} fill={MIMI_SKIN} />
      <path d="M57 106 C54 64 78 50 100 52 C96 66 84 80 57 106 Z" fill={MIMI_HAIR} />
      <path d="M143 106 C146 64 122 50 100 52 C104 66 116 80 143 106 Z" fill={MIMI_HAIR} />
    </g>
  );
}

/** Mimi: big dark eyes, all iris, with a large shine and a warm crescent at the bottom, a flicked
 *  top lash and two lower lashes. Shocked, they go blank: white, with a tiny dot. */
const MIMI_IRIS = "#3a2418";
const mimiEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 17 - raise;
    return <path d={`M${x - 5} ${by} L${x + 5} ${by}`} {...line(MIMI_HAIR, 4)} transform={turnAt(s, tilt, x, by)} />;
  };
  const lower = <path d={`M${x + s * 6} ${y + 9} l${s * 2.4} 2 M${x + s * 8.4} ${y + 6} l${s * 2.8} 1.2`} {...line(ink, 1.6)} />;
  const open = (k = 1, top = 0, tilt = 0, blank = false) => {
    const rx = 8.4 * k;
    const ry = 10.4 * k;
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={blank ? EYE_WHITE : MIMI_IRIS} lid={{ top, tilt, color: MIMI_SKIN }} edge={{ color: ink, width: 1.8 }}>
          {blank ? (
            <circle cx={x} cy={y + 1} r={1.8} fill={ink} />
          ) : (
            <g>
              <path d={`M${x - 5} ${y + 6} Q${x} ${y + 10} ${x + 5} ${y + 6}`} {...line("#b0775a", 2.4)} />
              <ellipse cx={x - 2.6 + dx} cy={y - 3.4 + dy} rx={3} ry={3.8} fill={EYE_WHITE} />
              <circle cx={x + 3 + dx} cy={y + 1 + dy} r={1.3} fill={EYE_WHITE} />
            </g>
          )}
        </Orb>
        {top === 0 && <path d={`M${x - rx} ${y - 2} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 2} l${s * 3.4} -2.6`} {...line(ink, 3)} />}
        {lower}
      </g>
    );
  };
  switch (mood) {
    case "happy":
      return g2(<path d={`M${x - 7} ${y + 3} L${x} ${y - 4} L${x + 7} ${y + 3}`} {...line(ink, 3.4)} />, brow(3, 0));
    case "delighted":
      return g2(open(1.12), brow(7, 0));
    case "curious":
      return g2(open(1, 0.08), s === 1 ? brow(7, -10) : brow(0, 4));
    case "thinking":
      return g2(open(1, 0.3, -6), s === -1 ? brow(-2, -10) : brow(4, 8));
    case "focused":
      return g2(open(1, 0.44, -12), brow(-3, -16));
    case "worried":
      return g2(open(1.06, 0, 0, true), brow(4, 16));
    case "oops":
      return g2(open(0.95, 0, 0, true), brow(2, 12));
    case "wink":
      return s === 1 ? g2(<path d={`M${x - 7} ${y + 3} L${x} ${y - 4} L${x + 7} ${y + 3}`} {...line(ink, 3.4)} />, brow(1, 0)) : g2(open(), brow(3, 0));
    default:
      return g2(open(), brow(0, 0));
  }
};

/** Mimi: a tiny triangle of a mouth at rest; it opens huge, twists into a smug curl, and wobbles. */
const mimiMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const tri = (w: number, h: number) => <OpenMouth d={`M${100 - w} ${y} L${100 + w} ${y} L100 ${y + h} Z`} fill={MOUTH_IN} tongue={[100, y + h * 0.8, w * 0.6, h * 0.3]} />;
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 10, 8)} fill={MOUTH_IN} tongue={[100, y + 11, 5, 3]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 2, 13, 13)} fill={MOUTH_IN} teeth={[86, y - 3, 28, 3.4]} tongue={[100, y + 16, 6.5, 4]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.4} ry={3} fill={ink} />;
    case "thinking":
      return <path d={`M90 ${y + 1} Q102 ${y + 5} 110 ${y - 3}`} {...line(ink, 2.6)} />;
    case "focused":
      return <path d={`M95 ${y + 1} L105 ${y + 1}`} {...line(ink, 3)} />;
    case "worried":
      return <OpenMouth d={`M93 ${y + 3} Q96 ${y - 1} 100 ${y + 2} Q104 ${y - 1} 107 ${y + 3} Q100 ${y + 9} 93 ${y + 3} Z`} fill={MOUTH_IN} />;
    case "oops":
      return <path d={`M88 ${y + 2} Q91 ${y - 1} 94 ${y + 2} Q97 ${y + 5} 100 ${y + 2} Q103 ${y - 1} 106 ${y + 2} Q109 ${y + 5} 112 ${y + 2}`} {...line(ink, 2.6)} />;
    case "wink":
      return tri(6, 8);
    default:
      return tri(3.6, 5);
  }
};

/* Pia: a round bob, a blunt fringe and one cowlick that won't lie flat; she plays statues. */
const PIA_SKIN = "#f5d6c0";
const PIA_HAIR = "#6b4a3a";
const palPia = human(PIA_SKIN, "#e3b9a0", PIA_HAIR, "#8a6450");

function PiaBack() {
  return (
    <path
      d="M52 134 C44 72 70 46 100 46 C130 46 156 72 148 134 Q124 142 100 140 Q76 142 52 134 Z"
      fill={PIA_HAIR}
    />
  );
}

function PiaHead({ mood }: Ctx) {
  /* the cowlick springs up when she is delighted and flops when she is worried */
  const lick = mood === "worried" || mood === "oops" ? 70 : mood === "delighted" ? -18 : 0;
  return (
    <g>
      <ellipse cx={100} cy={108} rx={42} ry={40} fill={PIA_SKIN} />
      <path d="M58 94 C58 62 78 52 100 52 C122 52 142 62 142 94 Z" fill={PIA_HAIR} />
      <g transform={`rotate(${lick} 104 54)`}>
        <path d="M104 54 C98 36 112 26 120 32 C126 38 118 44 112 40" {...line(PIA_HAIR, 6)} />
      </g>
    </g>
  );
}

/** Pia: huge round eyes with a two-tone honey iris and a square shine; a heavy, flat lash line.
 *  Startled, they go to hollow rings. */
const piaEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 17 - raise;
    return <path d={`M${x - 6} ${by + 1.5} Q${x} ${by - 2.5} ${x + 6} ${by + 1.5}`} {...line(PIA_HAIR, 2.6)} transform={turnAt(s, tilt, x, by)} />;
  };
  const open = (k = 1, top = 0, tilt = 0, extra = false) => {
    const [rx, ry] = [9.6 * k, 10.8 * k];
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={EYE_WHITE} lid={{ top, tilt, color: PIA_SKIN }} edge={{ color: ink, width: 2 }}>
          <circle cx={x + dx} cy={y + 1 + dy} r={7 * k} fill="#b86e22" />
          <ellipse cx={x + dx} cy={y + 5 + dy} rx={5 * k} ry={3.2 * k} fill="#e8b35a" />
          <circle cx={x + dx} cy={y + 1 + dy} r={3.2 * k} fill={ink} />
          <rect x={x - 5 + dx} y={y - 5 + dy} width={3.6} height={4.2} rx={1} fill={EYE_WHITE} />
          {extra && <circle cx={x + 3 + dx} cy={y + 3 + dy} r={1.4} fill={EYE_WHITE} />}
        </Orb>
        {top === 0 && <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1}`} {...line(ink, 3.4)} />}
      </g>
    );
  };
  const ring = (r: number) => (
    <g>
      <ellipse cx={x} cy={y} rx={9.6} ry={10.8} fill={EYE_WHITE} />
      <circle cx={x} cy={y + 1} r={r} {...line(ink, 2.2)} />
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(<path d={arcUp(x, y, 8, 5)} {...line(ink, 3.4)} />, brow(3, 0));
    case "delighted":
      return g2(open(1.1, 0, 0, true), brow(7, 0));
    case "curious":
      return g2(open(1.04), s === 1 ? brow(7, -10) : brow(0, 3));
    case "thinking":
      return g2(open(1, 0.36, 0), s === -1 ? brow(5, 10) : brow(-1, -6));
    case "focused":
      return g2(open(1, 0.4, -8), brow(-3, -14));
    case "worried":
      return g2(ring(4), brow(4, 18));
    case "oops":
      return g2(ring(2.4), brow(3, 14));
    case "wink":
      return s === 1 ? g2(<path d={arcUp(x, y, 8, 5)} {...line(ink, 3.4)} />, brow(0, 0)) : g2(open(), brow(3, 0));
    default:
      return g2(open(), brow(0, 0));
  }
};

/** Pia: a small mouth with one snaggletooth, which shows whenever she smiles; frozen, she grits
 *  her teeth. */
const piaMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const fang = (x: number, top: number) => <path d={`M${x - 2} ${top} L${x + 2} ${top} L${x} ${top + 3.6} Z`} fill={EYE_WHITE} />;
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y, 9, 7)} fill={MOUTH_IN} tongue={[100, y + 10, 4.5, 3]} />, fang(105, y + 0.2));
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 2, 12, 11)} fill={MOUTH_IN} tongue={[100, y + 13, 6, 3.6]} />, fang(106, y - 1.4));
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.8} ry={3.4} fill={ink} />;
    case "thinking":
      return <path d={`M99 ${y + 1} L109 ${y}`} {...line(ink, 2.4)} />;
    case "focused":
      return (
        <g>
          <rect x={90} y={y - 2} width={20} height={7} rx={3} fill={MOUTH_IN} />
          <rect x={91.5} y={y - 0.8} width={17} height={4.6} rx={1.6} fill={EYE_WHITE} />
          <path d={`M91.5 ${y + 1.5} L108.5 ${y + 1.5}`} {...line(MOUTH_IN, 1)} />
        </g>
      );
    case "worried":
      return <path d={wave(y + 2, 6, 2.6)} {...line(ink, 2.4)} />;
    case "oops":
      return g2(<path d={`M92 ${y + 1} L108 ${y + 1}`} {...line(ink, 2.4)} />, fang(104, y + 1.4));
    case "wink":
      return g2(<path d={`M92 ${y} Q100 ${y + 6} 109 ${y - 2}`} {...line(ink, 2.4)} />, fang(104, y + 2.6));
    default:
      return g2(<path d={curve(y, 6, 4)} {...line(ink, 2.4)} />, fang(104, y + 1.8));
  }
};

/* Nell: long auburn twin tails and a swept fringe; she twirls. */
const NELL_SKIN = "#f8e0d0";
const NELL_HAIR = "#b8563a";
const palNell = human(NELL_SKIN, "#ecc0aa", NELL_HAIR, "#d27a5a");

function NellBack() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side}>
          <Taper
            segs={[
              [
                [100 + s * 40, 62],
                [100 + s * 64, 78],
                [100 + s * 70, 120],
                [100 + s * 62, 170],
              ],
            ]}
            w0={28}
            w1={12}
            fill={NELL_HAIR}
          />
          <circle cx={100 + s * 40} cy={62} r={6.5} fill={C.accent} />
        </g>
      ))}
      <ellipse cx={100} cy={100} rx={48} ry={50} fill={NELL_HAIR} />
    </g>
  );
}

function NellHead() {
  return (
    <g>
      <ellipse cx={100} cy={108} rx={42} ry={40} fill={NELL_SKIN} />
      <path
        d="M58 102 C54 60 80 48 104 50 C128 52 146 66 142 100 C136 84 126 74 112 72 C98 80 80 88 60 106 Z"
        fill={NELL_HAIR}
      />
    </g>
  );
}

/** Nell: huge, tall eyes with a blue iris, a big oval shine and three lashes. Worried, they well up;
 *  flustered, they spin into swirls. */
const nellEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 18 - raise;
    return <path d={`M${x - 7} ${by + 2} Q${x} ${by - 2} ${x + 7} ${by + 1}`} {...line(NELL_HAIR, 2)} transform={turnAt(s, tilt, x, by)} />;
  };
  const lashes = (bx: number, by: number) => (
    <path d={`M${bx} ${by} l${s * 4} -2.4 M${bx - s * 1.2} ${by - 2.6} l${s * 3.4} -3.6 M${bx - s * 3.6} ${by - 4.6} l${s * 2} -3.8`} {...line(ink, 1.8)} />
  );
  const open = (k = 1, top = 0, tilt = 0, teary = false) => {
    const [rx, ry] = [9.4 * k, 11.8 * k];
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={EYE_WHITE} lid={{ top, tilt, color: NELL_SKIN }} edge={{ color: ink, width: 1.8 }}>
          <ellipse cx={x + dx} cy={y + 1.5 + dy} rx={7 * k} ry={8.4 * k} fill={C.primary} />
          <ellipse cx={x + dx} cy={y + 1.5 + dy} rx={3.4 * k} ry={4.2 * k} fill={ink} />
          <ellipse cx={x - 2.8 + dx} cy={y - 3 + dy} rx={2.8} ry={3.6} fill={EYE_WHITE} />
          <circle cx={x + 3 + dx} cy={y + 4.6 + dy} r={1.3} fill={EYE_WHITE} />
          {teary && <ellipse cx={x} cy={y + 7} rx={rx} ry={5.5} fill={C.tint} opacity={0.75} />}
          {teary && <path d={`M${x - 5} ${y + 5} Q${x} ${y + 3} ${x + 5} ${y + 5}`} {...line(EYE_WHITE, 1.6)} />}
        </Orb>
        {top === 0 && <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1}`} {...line(ink, 2.8)} />}
        {lashes(x + s * (rx - 1), top === 0 ? y - ry * 0.55 : y - ry + 2 * ry * top)}
      </g>
    );
  };
  const swirl = <path d={`M${x} ${y} a1.8 1.8 0 1 1 3.6 0 a3.6 3.6 0 1 1 -7.2 0 a5.4 5.4 0 1 1 10.8 0`} {...line(ink, 2)} />;
  switch (mood) {
    case "happy":
      return g2(g2(<path d={arcUp(x, y, 8, 5)} {...line(ink, 3.2)} />, lashes(x + s * 7.5, y + 1)), brow(3, 0));
    case "delighted":
      return g2(open(1.1), brow(7, 0));
    case "curious":
      return g2(open(1.02), s === 1 ? brow(7, -10) : brow(0, 3));
    case "thinking":
      return g2(open(1, 0.3), s === -1 ? brow(5, 10) : brow(-1, -6));
    case "focused":
      return g2(open(1, 0.4, -8), brow(-3, -12));
    case "worried":
      return g2(open(1.04, 0.06, 12, true), brow(3, 18));
    case "oops":
      return g2(swirl, brow(3, 14));
    case "wink":
      return s === 1 ? g2(g2(<path d={arcUp(x, y, 8, 5)} {...line(ink, 3.2)} />, lashes(x + s * 7.5, y + 1)), brow(0, 0)) : g2(open(), brow(3, 0));
    default:
      return g2(open(), brow(0, 0));
  }
};

/** Nell: a gap-toothed grin — two front teeth with a gap — whenever she smiles open. */
const nellMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const teeth = (top: number) => (
    <g fill={EYE_WHITE}>
      <rect x={94.6} y={top} width={4.6} height={4} rx={1} />
      <rect x={100.8} y={top} width={4.6} height={4} rx={1} />
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y, 10, 8)} fill={MOUTH_IN} tongue={[100, y + 11, 5, 3]} />, teeth(y));
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 2, 13, 12)} fill={MOUTH_IN} tongue={[100, y + 15, 6.5, 4]} />, teeth(y - 1.6));
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.6} ry={3.4} fill={ink} />;
    case "thinking":
      return <path d={`M104 ${y - 2.5} q3.4 1.6 0 3 q3.4 1.6 0 3`} {...line(ink, 2.2)} />;
    case "focused":
      return <path d={`M95 ${y + 1} L105 ${y + 1}`} {...line(ink, 2.4)} />;
    case "worried":
      return <OpenMouth d={`M93 ${y + 4} Q100 ${y - 3} 107 ${y + 4} Q100 ${y + 2} 93 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "oops":
      return g2(<path d={wave(y + 1, 8, 3)} {...line(ink, 2.4)} />, <ellipse cx={103} cy={y + 5} rx={2.6} ry={2.6} fill={TONGUE_PINK} />);
    case "wink":
      return g2(<OpenMouth d={dMouth(y, 9, 6, 102)} fill={MOUTH_IN} />, teeth(y));
    default:
      return <path d={curve(y, 6, 4.4)} {...line(ink, 2.4)} />;
  }
};

/* Koko: a short lilac-grey bob with a scalloped fringe and a big bow; she gets the hiccups. */
const KOKO_SKIN = "#eebf9c";
const KOKO_HAIR = "#8e7aac";
const palKoko = human(KOKO_SKIN, "#dca482", KOKO_HAIR, "#aa98c6");

function KokoBack() {
  return <ellipse cx={100} cy={98} rx={48} ry={47} fill={KOKO_HAIR} />;
}

function KokoHead() {
  return (
    <g>
      <ellipse cx={100} cy={108} rx={42} ry={40} fill={KOKO_SKIN} />
      <path
        d="M58 98 C56 60 80 50 100 50 C120 50 144 60 142 98 L136 84 Q128 96 120 82 Q110 96 100 80 Q90 96 80 82 Q72 96 64 84 Z"
        fill={KOKO_HAIR}
      />
      {/* the bow */}
      <g fill={C.accent}>
        <ellipse cx={116} cy={52} rx={13} ry={8} transform="rotate(-24 116 52)" />
        <ellipse cx={140} cy={46} rx={13} ry={8} transform="rotate(20 140 46)" />
        <circle cx={128} cy={50} r={5.5} />
      </g>
    </g>
  );
}

/** Koko: big black pupils on white with three shines, and round dot brows that bob up and down.
 *  A hiccup makes one eye squeeze shut and the other pop. */
const kokoEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const dot = (raise: number, drift = 0) => <ellipse cx={x - s * drift} cy={y - 16 - raise} rx={3.2} ry={2.4} fill={KOKO_HAIR} />;
  const open = (k = 1, pupil = 6.4, top = 0, tilt = 0, extra = false) => (
    <g>
      <Orb id={id} x={x} y={y} rx={9 * k} ry={10 * k} s={s} fill={EYE_WHITE} lid={{ top, tilt, color: KOKO_SKIN }} edge={{ color: ink, width: 1.4 }}>
        <circle cx={x + dx} cy={y + 1 + dy} r={pupil} fill={ink} />
        <circle cx={x - pupil * 0.4 + dx} cy={y - pupil * 0.35 + dy} r={pupil * 0.36} fill={EYE_WHITE} />
        <circle cx={x + pupil * 0.45 + dx} cy={y + pupil * 0.45 + dy} r={pupil * 0.18} fill={EYE_WHITE} />
        <circle cx={x + pupil * 0.3 + dx} cy={y - pupil * 0.55 + dy} r={pupil * 0.14} fill={EYE_WHITE} />
        {extra && <circle cx={x - pupil * 0.5 + dx} cy={y + pupil * 0.5 + dy} r={pupil * 0.14} fill={EYE_WHITE} />}
      </Orb>
      {top === 0 && <path d={`M${x - 9 * k} ${y - 1} A${9 * k} ${10 * k} 0 0 1 ${x + 9 * k} ${y - 1}`} {...line(ink, 2)} />}
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(<path d={arcUp(x, y, 7.5, 5)} {...line(ink, 3.4)} />, dot(3));
    case "delighted":
      return g2(open(1.14, 7.4, 0, 0, true), dot(7));
    case "curious":
      return g2(open(1, 5), dot(s === 1 ? 7 : 0));
    case "thinking":
      return g2(open(1, 5.6, 0.4), dot(s === -1 ? 5 : -1));
    case "focused":
      return g2(open(1, 5.8, 0.44, -8), dot(-2, 2));
    case "worried":
      return g2(open(1.06, 3.2), dot(3, -2.4));
    case "oops":
      return s === -1
        ? g2(<path d={chevron(x, y, s, 6, 5.5)} {...line(ink, 3.4)} />, dot(1))
        : g2(open(1.12, 3.6), dot(8));
    case "wink":
      return s === 1 ? g2(<path d={arcUp(x, y, 7.5, 5)} {...line(ink, 3.4)} />, dot(1)) : g2(open(), dot(3));
    default:
      return g2(open(), dot(0));
  }
};

/** Koko: a tiny “u” with the tip of her tongue showing at rest; a round “o” for a hiccup. */
const kokoMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  switch (mood) {
    case "happy":
      return <OpenMouth d={`M91 ${y} Q100 ${y + 14} 109 ${y} Z`} fill={MOUTH_IN} tongue={[100, y + 8, 4.4, 2.8]} />;
    case "delighted":
      return <OpenMouth d={`M88 ${y - 2} Q100 ${y + 20} 112 ${y - 2} Z`} fill={MOUTH_IN} tongue={[100, y + 11, 6, 3.8]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.4} ry={3} fill={ink} />;
    case "thinking":
      return <path d={`M103 ${y - 2.5} q3.2 1.6 0 3 q3.2 1.6 0 3`} {...line(ink, 2.2)} />;
    case "focused":
      return <path d={`M96 ${y + 1} L104 ${y + 1}`} {...line(ink, 2.6)} />;
    case "worried":
      return <path d={wave(y + 2, 4.6, 2)} {...line(ink, 2.2)} />;
    case "oops":
      return <OpenMouth d={`M96 ${y + 2} a4 4.4 0 1 0 8 0 a4 4.4 0 1 0 -8 0 Z`} fill={MOUTH_IN} />;
    case "wink":
      return <path d={`M93 ${y} Q96.5 ${y + 3.5} 100 ${y} Q103.5 ${y + 3.5} 107 ${y}`} {...line(ink, 2.4)} />;
    default:
      return g2(
        <OpenMouth d={`M95 ${y} Q100 ${y + 8} 105 ${y} Z`} fill={MOUTH_IN} />,
        <ellipse cx={100} cy={y + 3.6} rx={2.2} ry={1.6} fill={TONGUE_PINK} />,
      );
  }
};

/* Tami: two long braids with ribbons, a middle parting; she daydreams. After Juno's line: a normal
   head, not the big one. */
const TAMI_SKIN = "#b07350";
const TAMI_HAIR = "#5b3a2a";
const TAMI_LIP = "#7e3f30";
const palTami = human(TAMI_SKIN, "#955e3e", TAMI_HAIR, "#7a5040");

function TamiBack() {
  return <ellipse cx={100} cy={98} rx={48} ry={48} fill={TAMI_HAIR} />;
}

function TamiHead() {
  return (
    <g>
      <ellipse cx={100} cy={106} rx={42} ry={40} fill={TAMI_SKIN} />
      <path d="M58 100 C56 60 80 50 100 50 C120 50 144 60 142 100 C132 78 116 68 100 68 C84 68 68 78 58 100 Z" fill={TAMI_HAIR} />
      <path d="M100 52 L100 68" {...line("#7a5040", 1.6)} />
      {/* two braids falling in front of the shoulders, ribbons at the ends */}
      {sides.map(([side, s]) => (
        <g key={side}>
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx={100 + s * (46 - i * 0.6)} cy={112 + i * 14} rx={8.4 - i * 0.4} ry={9} fill={TAMI_HAIR} />
          ))}
          <path d={`M${100 + s * 44} 180 l${-s * 8} 8 M${100 + s * 44} 180 l${s * 8} 8`} {...line(C.accent, 4.4)} />
        </g>
      ))}
    </g>
  );
}

/** Tami: soft, dreamy eyes under a gently lowered lid, a hazel iris, a top lash line and two long
 *  lower lashes; she gazes up and away when she drifts off. Soft, full brows. */
const tamiEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 16 - raise;
    return <path d={`M${x - 8} ${by + 2} Q${x - 1} ${by - 3} ${x + 8} ${by}`} {...line(TAMI_HAIR, 3.6)} transform={turnAt(s, tilt, x, by)} />;
  };
  const lower = <path d={`M${x + s * 5} ${y + 8.4} l${s * 2.6} 2.6 M${x + s * 7.6} ${y + 6} l${s * 3} 1.6`} {...line(ink, 1.6)} />;
  const open = (top = 0.24, tilt = 0, k = 1) => (
    <g>
      <Orb id={id} x={x} y={y} rx={9 * k} ry={9.4 * k} s={s} fill={EYE_WHITE} lid={{ top, tilt, color: TAMI_SKIN }} edge={{ color: ink, width: 1.8 }}>
        <circle cx={x + dx} cy={y + 1 + dy} r={6.4 * k} fill="#8a6a3a" />
        <circle cx={x + dx} cy={y + 1 + dy} r={2.8 * k} fill={ink} />
        <circle cx={x - 2 + dx} cy={y - 1.6 + dy} r={2.2} fill={EYE_WHITE} />
      </Orb>
      {top === 0 && <path d={`M${x - 9 * k} ${y - 1} A${9 * k} ${9.4 * k} 0 0 1 ${x + 9 * k} ${y - 1} l${s * 3} -2.4`} {...line(ink, 2.8)} />}
      {lower}
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(g2(<path d={arcUp(x, y, 7.5, 4.4)} {...line(ink, 3)} />, lower), brow(2, 0));
    case "delighted":
      return g2(open(0, 0, 1.1), brow(6, 0));
    case "curious":
      return g2(open(0.06), s === 1 ? brow(6, -8) : brow(0, 3));
    case "thinking":
      return g2(open(0.18), brow(3, 6));
    case "focused":
      return g2(open(0.44, -6), brow(-2, -10));
    case "worried":
      return g2(open(0.14, 12), brow(1, 16));
    case "oops":
      return g2(<path d={arcDown(x, y, 7, 3)} {...line(ink, 3)} />, brow(2, 12));
    case "wink":
      return s === 1 ? g2(<path d={arcUp(x, y, 7.5, 4.4)} {...line(ink, 3)} />, brow(0, 0)) : g2(open(), brow(2, 0));
    default:
      return g2(open(), brow(0, 0));
  }
};

/** Tami: soft full lips; a small open “o” when she is miles away. */
const tamiMouth: MouthKit = ({ mood, y }) => {
  const lips = (dx = 0, rot = 0) => (
    <path d={`M${91 + dx} ${y} Q${100 + dx} ${y + 8} ${109 + dx} ${y} Q${100 + dx} ${y + 3} ${91 + dx} ${y} Z`} fill={TAMI_LIP} transform={`rotate(${rot} ${100 + dx} ${y})`} />
  );
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 9, 7)} fill={MOUTH_IN} teeth={[89, y - 1, 22, 3.2]} tongue={[100, y + 10, 4.4, 2.8]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 11, 10)} fill={MOUTH_IN} teeth={[87, y - 2, 26, 3.6]} tongue={[100, y + 13, 5.6, 3.4]} />;
    case "curious":
      return g2(<ellipse cx={100} cy={y + 2} rx={4} ry={4.6} fill={TAMI_LIP} />, <ellipse cx={100} cy={y + 2} rx={2} ry={2.6} fill={MOUTH_IN} />);
    case "thinking":
      return g2(<ellipse cx={103} cy={y + 2} rx={3.4} ry={3.8} fill={TAMI_LIP} />, <ellipse cx={103} cy={y + 2} rx={1.7} ry={2.2} fill={MOUTH_IN} />);
    case "focused":
      return <ellipse cx={100} cy={y + 1} rx={6.4} ry={2.2} fill={TAMI_LIP} />;
    case "worried":
      return <path d={wave(y + 2, 6, 2.6)} {...line(TAMI_LIP, 3.2)} />;
    case "oops":
      return g2(lips(), <ellipse cx={103} cy={y + 5.6} rx={2.4} ry={2.4} fill={TONGUE_PINK} />);
    case "wink":
      return lips(3, -8);
    default:
      return lips();
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
    signature: "A tiny girl with a big head, caramel hair in a side pony — she peeks over things",
    pitch:
      "Anya-spirited: a tiny girl with a big head and the most rubbery face in the cast — a smug scheming look, a gritted fright, a grin that takes her chin. Caramel hair with a choppy fringe and a side pony tied in the accent. Her ability is Peekaboo: she peeks over the edge of anything — a card, a heading — just her eyes and fingers showing. Huge round eyes with a violet iris that shrinks to a dot when she is startled.",
    risk: "Must stay clear of Anya's design: no pink hair, no cone clips, no green eyes, no uniform. Peeking must not read as spying on the learner.",
    pal: palLulu,
    body: C.clothes,
    face: face({ eyeY: 110, eyeGap: 18, mouthY: 131, lid: LULU_SKIN, kit: luluEyes, mouthKit: luluMouth }),
    outfit: "dress",
    outfits: OUTFITS,
    headBack: () => <LuluBack />,
    head: () => <LuluHead />,
  },
  {
    id: "side-mimi",
    kind: "human",
    frame: BIG,
    outline: false,
    hands: "mitten",
    label: "Mimi",
    signature: "A tiny girl with a big head and two chestnut space buns — she sneaks on tiptoe",
    pitch:
      "Anya-spirited, the second way: a tiny girl with a big head, chestnut space buns tied in the accent and a curtain fringe. Her ability is Tiptoe: she sneaks in, spy-style, on tiptoe, and is suddenly there. Big dark eyes, all iris, with a large shine and lower lashes; shocked, they go blank white with a tiny dot. A tiny triangle of a mouth that opens huge.",
    risk: "Must stay clear of Anya's design; the space buns and dark eyes are her own. Sneaking must stay playful, never a jump-scare.",
    pal: palMimi,
    body: C.clothes,
    face: face({ eyeY: 110, eyeGap: 18, mouthY: 131, lid: MIMI_SKIN, kit: mimiEyes, mouthKit: mimiMouth }),
    outfit: "dungarees",
    outfits: OUTFITS,
    headBack: () => <MimiBack />,
    head: () => <MimiHead />,
  },
  {
    id: "side-pia",
    kind: "human",
    frame: BIG,
    outline: false,
    hands: "mitten",
    label: "Pia",
    signature: "A tiny girl with a round bob and one cowlick that won't lie flat — she plays statues",
    pitch:
      "Lulu's line: a tiny girl with a big head, a round cocoa bob, a blunt fringe and a single cowlick that springs up when she is delighted and flops when she is worried. Her ability is Statue: she freezes mid-move, like the game, and holds it until it is her turn — the one for waiting. Huge eyes with a two-tone honey iris and a square shine that go to hollow rings when she is startled; a small mouth with one snaggletooth, gritted when she is frozen.",
    risk: "Freezing must read as a game, never as fear.",
    pal: palPia,
    body: C.clothes,
    face: face({ eyeY: 110, eyeGap: 18, mouthY: 131, lid: PIA_SKIN, kit: piaEyes, mouthKit: piaMouth }),
    outfit: "dungarees",
    outfits: OUTFITS,
    headBack: () => <PiaBack />,
    head: (c) => <PiaHead {...c} />,
  },
  {
    id: "side-nell",
    kind: "human",
    frame: BIG,
    outline: false,
    hands: "mitten",
    label: "Nell",
    signature: "A tiny girl with long auburn twin tails and a swept fringe — she twirls",
    pitch:
      "Lulu's line: a tiny girl with a big head and long auburn twin tails tied in the accent, a fringe swept to one side. Her ability is Twirl: she spins on the spot, twin tails flying. Huge, tall eyes with a blue iris, a big oval shine and three lashes; they well up when she is worried and spin into swirls when she is flustered. A gap-toothed grin.",
    risk: "Welling up must stay gentle and brief: never on an incorrect answer.",
    pal: palNell,
    body: C.clothes,
    face: face({ eyeY: 110, eyeGap: 18, mouthY: 131, lid: NELL_SKIN, kit: nellEyes, mouthKit: nellMouth }),
    outfit: "dress",
    outfits: OUTFITS,
    headBack: () => <NellBack />,
    head: () => <NellHead />,
  },
  {
    id: "side-koko",
    kind: "human",
    frame: BIG,
    outline: false,
    hands: "mitten",
    label: "Koko",
    signature: "A tiny girl with a lilac-grey bob, a scalloped fringe and a big bow — she gets the hiccups",
    pitch:
      "Lulu's line: a tiny girl with a big head, a short lilac-grey bob with a scalloped fringe and a big bow in the accent. Her ability is Hiccup: she gets the hiccups and hops a little with each one — one eye squeezes shut and the other pops. Big black pupils on white with three shines, and round dot brows that bob; a tiny mouth with the tip of her tongue showing.",
    risk: "Hiccups are a gag: never tied to a wrong answer or a score.",
    pal: palKoko,
    body: C.clothes,
    face: face({ eyeY: 110, eyeGap: 18, mouthY: 131, lid: KOKO_SKIN, kit: kokoEyes, mouthKit: kokoMouth }),
    outfit: "hoodie",
    outfits: OUTFITS,
    headBack: () => <KokoBack />,
    head: () => <KokoHead />,
  },
  {
    id: "side-tami",
    kind: "human",
    frame: CHIBI,
    outline: false,
    hands: "mitten",
    label: "Tami",
    signature: "Two long braids with ribbons and a middle parting — she daydreams",
    pitch:
      "Juno's line, with a normal head: a girl with two long braids falling in front of her shoulders, ribbons in the accent, and a middle parting. Her ability is Daydream: she drifts off, eyes up and away, and a small cloud of a thought appears — then she is back. Soft dreamy eyes under a gently lowered lid, a hazel iris and long lower lashes; soft full lips that fall into a small “o” when she is miles away.",
    risk: "Daydreaming must not read as not paying attention to the learner.",
    pal: palTami,
    body: C.clothes,
    face: face({ eyeY: 106, eyeGap: 18, mouthY: 128, lid: TAMI_SKIN, kit: tamiEyes, mouthKit: tamiMouth }),
    outfit: "raincoat",
    outfits: OUTFITS,
    headBack: () => <TamiBack />,
    head: () => <TamiHead />,
  },
];
