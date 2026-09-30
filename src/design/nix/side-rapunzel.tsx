import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import {
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

import { CHIBI, type Body } from "./rig/skeleton";
import { CHUNKY, curve, dMouth, sides, Taper, wave } from "./side-candidates";
import { face, g2, human, MOUTH_IN, OUTFITS } from "./side-humans";
import { C } from "./theme";

/**
 * Two girls in the spirit of Rapunzel from Tangled — wide-eyed wonder, a life lived for the first
 * time, an artist's restlessness, hair that is part of who she is — and not her look: no long
 * golden braid with flowers, no purple dress, no green eyes, no frying pan.
 *
 * They are drawn to act. Every part of the face moves: brows that do half the talking, eyes that
 * grow and narrow and look away, mouths that bite a lip or poke a tongue out, hair and freckles
 * and a paint smudge that tell you who she is before she does anything.
 */

const HERO: Body = {
  ...CHIBI,
  id: "hero",
  headFit: "translate(100 150) scale(1.06) translate(-100 -150)",
  neck: { x: 94, y: 136, w: 12, h: 20 },
  headVB: "34 34 132 132",
  w: CHUNKY,
};

/* ——— Sunny: impossibly long honey hair; wonder ——— */

const SUNNY_SKIN = "#f7d9c4";
const SUNNY_SHADE = "#e6b9a0";
const SUNNY_HAIR = "#e3a94a";
const SUNNY_HAIR_SHADE = "#c48a32";
const SUNNY_HAIR_HI = "#f6d489";
const SUNNY_LIP = "#d86a7a";
const palSunny = human(SUNNY_SKIN, SUNNY_SHADE, SUNNY_HAIR, SUNNY_HAIR_HI);

/** The hair that falls behind her all the way to the floor, and coils there. */
function SunnyBack() {
  return (
    <g>
      {/* a curtain of hair behind her shoulders, both sides */}
      <path d="M48 104 C44 58 72 40 100 40 C128 40 156 58 152 104 C156 132 160 160 150 178 Q126 186 100 184 Q74 186 50 178 C40 160 44 132 48 104 Z" fill={SUNNY_HAIR_SHADE} />
      <path d="M50 102 C46 58 74 42 100 42 C126 42 154 58 150 102 C154 130 156 156 148 172 Q124 180 100 178 Q76 180 52 172 C44 156 46 130 50 102 Z" fill={SUNNY_HAIR} />
      {/* and from the back, the rest of it: a rope of hair all the way to the floor, coiled there */}
      <Taper
        segs={[
          [
            [126, 160],
            [150, 200],
            [150, 240],
            [138, 272],
          ],
        ]}
        w0={34}
        w1={18}
        fill={SUNNY_HAIR_SHADE}
      />
      <path d="M138 272 C126 294 88 294 86 280 C84 268 102 262 110 272" {...line(SUNNY_HAIR_SHADE, 18)} />
      <path d="M136 270 C124 290 90 290 88 279 C86 269 102 264 108 272" {...line(SUNNY_HAIR, 13)} />
      <path d="M130 176 C144 204 144 236 134 262" {...line(SUNNY_HAIR, 12)} />
      <path d="M138 196 C142 216 140 236 134 252" {...line(SUNNY_HAIR_HI, 3.4)} />
      <path d="M66 70 Q84 54 106 52" {...line(SUNNY_HAIR_HI, 4)} />
    </g>
  );
}

/** Two long locks frame her face and fall past her shoulders; their ends curl up when she is happy
 *  and hang straight when she is worried. */
function SunnyHead({ mood }: Ctx) {
  const up = mood === "happy" || mood === "delighted" || mood === "wink";
  const down = mood === "worried" || mood === "oops";
  const tip = (s: number) =>
    down
      ? `l${s * 1} 16`
      : up
        ? `q${s * 10} 10 ${s * 12} -4`
        : `q${s * 6} 12 ${s * 10} 6`;
  return (
    <g>
      <ellipse cx={101.5} cy={109.5} rx={40} ry={39} fill={SUNNY_SHADE} />
      <ellipse cx={99.5} cy={107} rx={38.6} ry={37.6} fill={SUNNY_SKIN} />
      {/* freckles across her nose and cheeks */}
      {[
        [86, 118],
        [90, 121],
        [83, 122],
        [110, 118],
        [114, 121],
        [117, 117],
        [97, 114],
        [103, 114],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.2} fill="#d99a7e" />
      ))}
      <path d="M64 92 C70 82 86 76 100 78 C114 76 130 82 136 92 Q100 86 64 92 Z" fill={SUNNY_SHADE} />
      <path
        d="M60 94 C56 58 82 46 104 48 C128 50 146 64 142 92 C136 78 124 68 110 66 C96 72 80 80 62 96 Z"
        fill={SUNNY_HAIR}
      />
      <path d="M72 70 Q86 58 104 56" {...line(SUNNY_HAIR_HI, 4)} />
      {sides.map(([side, s]) => (
        <g key={side}>
          <path
            d={`M${100 + s * 40} 92 C${100 + s * 46} 120 ${100 + s * 44} 150 ${100 + s * 46} 172 ${tip(s)}`}
            {...line(SUNNY_HAIR, 11)}
          />
        </g>
      ))}
    </g>
  );
}

/** Sunny: big tall eyes with a sea-glass iris, pale below, and long lashes; thin high brows that
 *  never stop moving. Wonder is her resting face. Worried, the lower lid shines wet. */
const sunnyEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 19 - raise;
    return (
      <path
        d={`M${x - 7.5} ${by + 2} Q${x - 1} ${by - 3.5} ${x + 7.5} ${by + 1}`}
        {...line("#b77a2c", 2.4)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const lashes = (bx: number, by: number) => (
    <path d={`M${bx} ${by} l${s * 4} -2 M${bx - s * 1.4} ${by - 3} l${s * 3.4} -3.2`} {...line(ink, 1.8)} />
  );
  const open = (o: { k?: number; top?: number; bottom?: number; tilt?: number; iris?: number; px?: number; py?: number; wet?: boolean; extra?: boolean } = {}) => {
    const { k = 1, top = 0, bottom = 0, tilt = 0, iris = 1, px = 0, py = 0, wet = false, extra = false } = o;
    const rx = 10.4 * k;
    const ry = 12.6 * k;
    const ir = 8.4 * k * iris;
    const cx = x + dx + px;
    const cy = y + 1.5 + dy + py;
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={EYE_WHITE} lid={{ top, bottom, tilt, color: SUNNY_SKIN }} edge={{ color: ink, width: 1.8 }}>
          <circle cx={cx} cy={cy} r={ir} fill="#3f8f7a" />
          <ellipse cx={cx} cy={cy + ir * 0.48} rx={ir * 0.74} ry={ir * 0.4} fill="#7cc0a6" />
          <circle cx={cx} cy={cy} r={Math.min(ir * 0.45, 3.8)} fill={ink} />
          <ellipse cx={cx - ir * 0.38} cy={cy - ir * 0.42} rx={ir * 0.3} ry={ir * 0.4} fill={EYE_WHITE} />
          <circle cx={cx + ir * 0.42} cy={cy + ir * 0.44} r={ir * 0.14} fill={EYE_WHITE} />
          {extra && <circle cx={cx + ir * 0.36} cy={cy - ir * 0.5} r={ir * 0.14} fill={EYE_WHITE} />}
          {wet && <path d={`M${x - rx * 0.8} ${y + ry * 0.62} Q${x} ${y + ry * 0.9} ${x + rx * 0.8} ${y + ry * 0.62}`} {...line("#bfe6ff", 2.4)} />}
        </Orb>
        {top === 0 && <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1}`} {...line(ink, 3)} />}
        {lashes(x + s * (rx - 1), top === 0 ? y - ry * 0.5 : y - ry + 2 * ry * top)}
      </g>
    );
  };
  const closed = (d: string) => g2(<path d={d} {...line(ink, 3.2)} />, lashes(x + s * 7.4, y + 1.4));
  switch (mood) {
    case "happy":
      return g2(closed(arcUp(x, y, 8, 5)), brow(5, 0));
    case "delighted":
      return g2(open({ k: 1.12, iris: 1.06, extra: true }), brow(9, 0));
    case "curious":
      return g2(open({ k: 1.05, px: 1.6 }), s === 1 ? brow(10, -12) : brow(3, 2));
    case "thinking":
      return g2(open({ top: 0.2, px: -2.2, py: -3.4 }), s === -1 ? brow(6, 10) : brow(1, -6));
    case "focused":
      return g2(open({ top: 0.38, tilt: -10 }), brow(-2, -14));
    case "worried":
      return g2(open({ top: 0.06, tilt: 16, iris: 0.86, wet: true }), brow(6, 22));
    case "oops":
      return g2(g2(<path d={chevron(x, y, s, 6.5, 6)} {...line(ink, 3.4)} />, lashes(x + s * 6.5, y - 5)), brow(5, 18));
    case "wink":
      return s === 1 ? g2(closed(arcUp(x, y, 8, 5)), brow(2, 0)) : g2(open({ extra: true }), brow(6, 0));
    default:
      return g2(open(), brow(3, 0));
  }
};

/** Sunny: soft pink lips; she gasps in wonder, bites her lip when she is worried, and grins with
 *  her whole face. */
const sunnyMouth: MouthKit = ({ mood, y }) => {
  const smile = (dx = 0, rot = 0) => (
    <path
      d={`M${91 + dx} ${y} Q${100 + dx} ${y + 8} ${109 + dx} ${y} Q${100 + dx} ${y + 3.4} ${91 + dx} ${y} Z`}
      fill={SUNNY_LIP}
      transform={`rotate(${rot} ${100 + dx} ${y})`}
    />
  );
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 10, 8)} fill={MOUTH_IN} teeth={[88, y - 1, 24, 3.4]} tongue={[100, y + 11, 5, 3]} />;
    case "delighted":
      return <OpenMouth d={`M89 ${y} Q100 ${y - 2} 111 ${y} Q112 ${y + 14} 100 ${y + 16} Q88 ${y + 14} 89 ${y} Z`} fill={MOUTH_IN} teeth={[88, y - 1, 24, 3.4]} tongue={[100, y + 12, 6, 3.6]} />;
    case "curious":
      return g2(<ellipse cx={100} cy={y + 2.5} rx={4.4} ry={5.4} fill={SUNNY_LIP} />, <ellipse cx={100} cy={y + 2.5} rx={2.4} ry={3.4} fill={MOUTH_IN} />);
    case "thinking":
      return smile(5, -14);
    case "focused":
      return <path d={`M94 ${y + 1} L106 ${y + 1}`} {...line(SUNNY_LIP, 3.4)} />;
    case "worried":
      /* biting her lower lip */
      return (
        <g>
          <path d={`M92 ${y + 1} Q100 ${y - 2} 108 ${y + 1}`} {...line(SUNNY_LIP, 3.2)} />
          <rect x={96} y={y} width={8} height={3.6} rx={1} fill={EYE_WHITE} />
        </g>
      );
    case "oops":
      return <OpenMouth d={roundRect(100, y + 3, 20, 8, 3.4)} fill={MOUTH_IN} teeth={[89, y - 1, 22, 3.4]} />;
    case "wink":
      return <OpenMouth d={dMouth(y, 8, 6, 103)} fill={MOUTH_IN} teeth={[95, y - 1, 16, 3]} />;
    default:
      return smile();
  }
};

/* ——— Poppy: a short chestnut crop, a paint smudge; she dances ——— */

const POPPY_SKIN = "#e8b490";
const POPPY_SHADE = "#d19a74";
const POPPY_HAIR = "#6e3f24";
const POPPY_HAIR_HI = "#9a5e38";
const palPoppy = human(POPPY_SKIN, POPPY_SHADE, POPPY_HAIR, POPPY_HAIR_HI);

function PoppyBack() {
  return (
    <g fill={POPPY_HAIR}>
      <ellipse cx={100} cy={96} rx={50} ry={48} />
      {/* the crop's uneven ends, cut in a hurry */}
      <path d="M52 110 L48 132 L60 124 L62 136 L72 126 Z" />
      <path d="M148 110 L154 130 L142 124 L140 138 L130 126 Z" />
    </g>
  );
}

function PoppyHead() {
  return (
    <g>
      <ellipse cx={101.5} cy={109.5} rx={40} ry={39} fill={POPPY_SHADE} />
      <ellipse cx={99.5} cy={107} rx={38.6} ry={37.6} fill={POPPY_SKIN} />
      {/* a smudge of paint on her cheek and a dab on her nose: she has been painting again */}
      <path d="M122 124 q6 -3 10 2" {...line(C.accent, 4)} />
      <circle cx={101} cy={114} r={2} fill={C.primary} />
      <circle cx={112} cy={136} r={1.3} fill="#8a5a40" />
      <path d="M64 98 C74 86 88 82 104 84 C120 84 132 90 138 100 Q100 92 64 98 Z" fill={POPPY_SHADE} />
      {/* a big swept fringe with a flick at one end */}
      <path
        d="M58 104 C52 58 84 44 108 48 C132 52 148 70 144 104 C140 86 132 76 120 72 C122 80 118 88 110 90 C104 78 94 72 84 74 C74 80 64 90 58 104 Z"
        fill={POPPY_HAIR}
      />
      <path d="M58 104 q-8 2 -10 -6" {...line(POPPY_HAIR, 6)} />
      <path d="M86 60 Q100 52 116 54" {...line(POPPY_HAIR_HI, 4)} />
    </g>
  );
}

/** Poppy: round, warm brown eyes and bold brows that do half the acting — knit, hitched, flying.
 *  Curious, she squints one eye and widens the other. Dizzy, they spin. */
const poppyEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 17 - raise;
    return (
      <path
        d={`M${x - 7 * s} ${by + 2} L${x + 1 * s} ${by - 1.5} L${x + 7.5 * s} ${by}`}
        {...line(POPPY_HAIR, 4.2)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (o: { k?: number; top?: number; tilt?: number; iris?: number; px?: number; py?: number; extra?: boolean } = {}) => {
    const { k = 1, top = 0, tilt = 0, iris = 1, px = 0, py = 0, extra = false } = o;
    const rx = 9.6 * k;
    const ry = 10.4 * k;
    const ir = 7.2 * k * iris;
    const cx = x + dx + px;
    const cy = y + 1 + dy + py;
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={EYE_WHITE} lid={{ top, tilt, color: POPPY_SKIN }} edge={{ color: ink, width: 2.2 }}>
          <circle cx={cx} cy={cy} r={ir} fill="#6a3f24" />
          <ellipse cx={cx} cy={cy + ir * 0.5} rx={ir * 0.7} ry={ir * 0.36} fill="#a8703f" />
          <circle cx={cx} cy={cy} r={Math.min(ir * 0.46, 3.4)} fill={ink} />
          <circle cx={cx - ir * 0.4} cy={cy - ir * 0.38} r={ir * 0.32} fill={EYE_WHITE} />
          <circle cx={cx + ir * 0.34} cy={cy - ir * 0.46} r={ir * 0.18} fill={EYE_WHITE} />
          {extra && <circle cx={cx + ir * 0.4} cy={cy + ir * 0.46} r={ir * 0.14} fill={EYE_WHITE} />}
        </Orb>
        {top === 0 && <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1} l${s * 3.4} -3`} {...line(ink, 3.4)} />}
      </g>
    );
  };
  const swirl = <path d={`M${x} ${y} a1.8 1.8 0 1 1 3.6 0 a3.6 3.6 0 1 1 -7.2 0 a5.4 5.4 0 1 1 10.8 0`} {...line(ink, 2.2)} />;
  switch (mood) {
    case "happy":
      return g2(<path d={arcUp(x, y, 7.6, 5)} {...line(ink, 3.6)} />, brow(4, 0));
    case "delighted":
      return g2(open({ k: 1.12, extra: true }), brow(9, -4));
    case "curious":
      return s === -1 ? g2(open({ top: 0.34, tilt: -6 }), brow(-2, -10)) : g2(open({ k: 1.1 }), brow(10, -8));
    case "thinking":
      return g2(open({ top: 0.24, px: 2.4, py: -3.4 }), s === 1 ? brow(7, -10) : brow(0, 8));
    case "focused":
      return g2(open({ top: 0.46, tilt: -14 }), brow(-4, -18));
    case "worried":
      return g2(open({ k: 1.04, top: 0.06, tilt: 14, iris: 0.8 }), brow(5, 20));
    case "oops":
      return g2(swirl, brow(5, 14));
    case "wink":
      return s === 1 ? g2(<path d={arcUp(x, y, 7.6, 5)} {...line(ink, 3.6)} />, brow(-2, -8)) : g2(open(), brow(7, 0));
    default:
      return g2(open(), brow(1, -4));
  }
};

/** Poppy: a wide, lopsided mouth: a smirk at rest, a grin that runs off one side, and her tongue
 *  poking out when she concentrates. */
const poppyMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  switch (mood) {
    case "happy":
      return <OpenMouth d={`M88 ${y - 2} Q101 ${y + 14} 114 ${y - 4} Q101 ${y + 1} 88 ${y - 2} Z`} fill={MOUTH_IN} teeth={[88, y - 4, 26, 3.6]} tongue={[101, y + 8, 5, 2.6]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 2, 14, 13)} fill={MOUTH_IN} teeth={[86, y - 3, 28, 3.8]} tongue={[100, y + 16, 7, 4]} />;
    case "curious":
      return g2(<ellipse cx={104} cy={y + 2} rx={3.4} ry={3.8} fill="#b8604e" />, <ellipse cx={104} cy={y + 2} rx={1.6} ry={2} fill={MOUTH_IN} />);
    case "thinking":
      return <path d={`M92 ${y + 3} Q100 ${y + 3} 108 ${y - 2}`} {...line(ink, 2.8)} />;
    case "focused":
      /* tongue out at the corner: concentrating */
      return g2(<path d={`M92 ${y + 1} L108 ${y + 1}`} {...line(ink, 2.8)} />, <path d={`M104 ${y + 1} q1 7 6 6 q2 -3 -1 -6 Z`} fill={TONGUE_PINK} />);
    case "worried":
      return <OpenMouth d={`M92 ${y + 4} Q96 ${y - 1} 100 ${y + 2} Q104 ${y - 1} 108 ${y + 4} Q100 ${y + 8} 92 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "oops":
      return <OpenMouth d={roundRect(100, y + 3, 22, 9, 3.6)} fill={MOUTH_IN} teeth={[88, y - 1.4, 24, 3.6]} />;
    case "wink":
      return g2(<path d={`M90 ${y + 1} Q102 ${y + 7} 112 ${y - 3}`} {...line(ink, 2.8)} />, <ellipse cx={108} cy={y + 4} rx={2.4} ry={2.2} fill={TONGUE_PINK} />);
    default:
      return <path d={`M91 ${y + 1} Q100 ${y + 5} 110 ${y - 2.5}`} {...line(ink, 2.8)} />;
  }
};

/* ——— The two ——— */

export const RAPUNZEL_LINE: Candidate[] = [
  {
    id: "side-sunny",
    kind: "human",
    frame: HERO,
    outline: false,
    hands: "mitten",
    label: "Sunny",
    attitude: { mood: "curious", tilt: -7, hands: { L: [95, 164], R: [105, 164], outL: false, outR: false } },
    signature: "Impossibly long honey hair to the floor, freckles, sea-glass eyes — her hair moves with her feelings",
    pitch:
      "Wide-eyed and wildly curious, seeing everything for the first time; brave in bursts, then worried she broke a rule, then off again. In Rapunzel's spirit, not her look. At rest she clasps her hands under her chin, head tipped, one brow up, lips in a little “o” — wonder is her resting face. Her ability is Hair: her impossibly long hair is part of her, and it moves with her feelings — its ends curl up when she is happy, hang straight when she is worried, and it whips out like a rope to catch what she reaches for. Big tall eyes with a sea-glass iris and long lashes, thin brows that never stop moving, a wet shine when she is anxious; soft pink lips that gasp, grin, and bite when she is nervous; freckles across her nose.",
    risk: "Must never read as Disney's Rapunzel: no golden braid with flowers, no purple dress, no green eyes. Hair must stay light enough to hold on the dark ground and never become a large glow-coloured field beside Wisp.",
    pal: palSunny,
    body: C.clothes,
    face: face({ eyeY: 108, eyeGap: 18, mouthY: 130, lid: SUNNY_SKIN, kit: sunnyEyes, mouthKit: sunnyMouth }),
    outfit: "dress",
    outfits: OUTFITS,
    headBack: () => <SunnyBack />,
    head: (c) => <SunnyHead {...c} />,
  },
  {
    id: "side-poppy",
    kind: "human",
    frame: HERO,
    outline: false,
    hands: "mitten",
    label: "Poppy",
    attitude: { mood: "happy", tilt: 8, hands: { L: [50, 168], R: [150, 168] } },
    signature: "A short chestnut crop cut in a hurry, a paint smudge on her cheek — she dances",
    pitch:
      "Bold, quick and warm, an artist who can't sit still: she paints on anything, marches when she is determined and dances when she is happy. In the spirit of Rapunzel after the hair is cut — the freedom, the new start — not her look. At rest she stands arms out — ta-da — with a grin that runs off one side of her face. Her ability is Dance: when she is happy it comes out of her, a spin, a stamp and a flourish. Round warm-brown eyes and bold brows that do half the acting; curious, she squints one eye and widens the other; dizzy, they spin. A wide, lopsided mouth that pokes its tongue out when she concentrates. A smudge of paint on her cheek, a dab on her nose, a flick at the end of her fringe.",
    risk: "Must not read as Disney's short-haired Rapunzel: no brown pixie with the purple dress. Dancing is joy, never a celebration of a score.",
    pal: palPoppy,
    body: C.clothes,
    face: face({ eyeY: 108, eyeGap: 18, mouthY: 130, lid: POPPY_SKIN, kit: poppyEyes, mouthKit: poppyMouth }),
    outfit: "dungarees",
    outfits: OUTFITS,
    headBack: () => <PoppyBack />,
    head: () => <PoppyHead />,
  },
];

