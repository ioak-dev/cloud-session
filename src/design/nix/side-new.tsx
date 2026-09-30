import type { ReactNode } from "react";

import type { Candidate } from "./candidates";
import {
  arcDown,
  arcUp,
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
import { CHIBI, J, pivot, type Body } from "./rig/skeleton";
import { CHUNKY, curve, dMouth, pal, Puffs, sides, Taper, wave } from "./side-candidates";
import { face as humanFace, human } from "./side-humans";
import { C } from "./theme";

/**
 * Five new concepts for the sixth place, each unlike anything the cast has tried: an amphibian,
 * a hoofed animal, an old one, a machine and a boy. Every one is built to act — a temperament you
 * can read at rest, a face that does something different in every mood, and an ability that comes
 * from its own body: a frog's throat, a goat's climbing, a tortoise's shell, a robot's screen, a
 * boy's sense of drama.
 */

const g2 = (a: ReactNode, b: ReactNode) => (
  <g>
    {a}
    {b}
  </g>
);
const MOUTH = "#3a1d2a";
const OUTFITS: Candidate["outfits"] = ["bare", "dungarees", "hoodie", "raincoat", "winter", "party"];
const face = (over: Partial<Candidate["face"]>): Candidate["face"] => ({
  eyes: "bead",
  eyeY: 106,
  eyeGap: 18,
  mouthY: 126,
  nose: "none",
  brows: false,
  lid: "#000",
  ...over,
});

/* ——— Fizz, a blue dart frog: over-excitable; his throat balloons ——— */

const FROG_TORSO =
  "M80 152 Q100 144 120 152 Q138 170 134 196 Q130 220 100 222 Q70 220 66 196 Q62 170 80 152 Z";
const FROG: Body = {
  ...CHIBI,
  id: "frog",
  torso: FROG_TORSO,
  j: { ...J, hipL: [88, 210], kneeL: [64, 236], footL: [78, 268], hipR: [112, 210], kneeR: [136, 236], footR: [122, 268] },
  w: { upper: 11, fore: 10, thigh: 16, shin: 13, hand: 9, cloth: 1.1 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
  headVB: "34 40 132 132",
};
const palFrog = pal(C.mid, C.primary);
const FROG_HEAD =
  "M44 118 C44 92 62 72 100 72 C138 72 156 92 156 118 C156 140 132 152 100 152 C68 152 44 140 44 118 Z";

function FrogHead() {
  return (
    <g>
      {/* the eye bumps rise above the head: its own shade, then its colour */}
      {[74, 126].map((x) => (
        <g key={x}>
          <circle cx={x + 1.5} cy={81.5} r={21} fill={C.primary} />
          <circle cx={x} cy={80} r={20} fill={C.mid} />
        </g>
      ))}
      <path d={FROG_HEAD} fill={C.primary} transform="translate(2 2.5)" />
      <path d={FROG_HEAD} fill={C.mid} />
      {/* a dart frog's spots */}
      {[
        [58, 108, 4.6],
        [142, 104, 5.2],
        [100, 88, 3.6],
        [118, 94, 2.6],
        [66, 128, 3],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={C.deep} />
      ))}
      {/* the pale throat under the wide mouth */}
      <path d="M62 136 Q100 160 138 136 Q100 150 62 136 Z" fill={C.tint} />
      <circle cx={94} cy={110} r={1.6} fill={C.deep} />
      <circle cx={106} cy={110} r={1.6} fill={C.deep} />
    </g>
  );
}

/** Fizz: big round eyes on top of his head, with huge black pupils; his lids close from above and
 *  below, the way a frog's do, and squint up from beneath when he concentrates. */
const fizzEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const [dx, dy] = look;
  const open = (o: { k?: number; pupil?: number; top?: number; bottom?: number; tilt?: number; extra?: boolean } = {}) => {
    const { k = 1, pupil = 8, top = 0, bottom = 0, tilt = 0, extra = false } = o;
    return (
      <Orb id={id} x={x} y={y} rx={13 * k} ry={13 * k} s={s} fill={EYE_WHITE} lid={{ top, bottom, tilt, color: C.mid }}>
        <circle cx={x + dx * 1.2} cy={y + 1 + dy * 1.2} r={pupil * k} fill={p.ink} />
        <circle cx={x + dx * 1.2 - pupil * 0.4} cy={y + dy * 1.2 - pupil * 0.35} r={pupil * 0.36} fill={EYE_WHITE} />
        <circle cx={x + dx * 1.2 + pupil * 0.45} cy={y + dy * 1.2 + pupil * 0.5} r={pupil * 0.16} fill={EYE_WHITE} />
        {extra && <circle cx={x + dx * 1.2 + pupil * 0.4} cy={y + dy * 1.2 - pupil * 0.55} r={pupil * 0.14} fill={EYE_WHITE} />}
      </Orb>
    );
  };
  const shut = (d: string) => <path d={d} {...line(C.deep, 3.4)} />;
  switch (mood) {
    case "happy":
      return shut(arcUp(x, y + 2, 9, 5.4));
    case "delighted":
      return open({ k: 1.12, pupil: 9.6, extra: true });
    case "curious":
      return open({ k: s === 1 ? 1.16 : 0.92, pupil: 7 });
    case "thinking":
      return open({ top: 0.34, pupil: 6.4 });
    case "focused":
      return open({ bottom: 0.4, pupil: 6.4 });
    case "worried":
      return open({ top: 0.12, tilt: 16, pupil: 5 });
    case "oops":
      return shut(`M${x - 9} ${y} L${x + 9} ${y}`);
    case "wink":
      return s === 1 ? shut(arcUp(x, y + 2, 9, 5.4)) : open();
    default:
      return open();
  }
};

/** Fizz: a mouth from ear to ear. It grins wide enough to show his whole tongue. */
const fizzMouth: MouthKit = ({ mood, y }) => {
  switch (mood) {
    case "happy":
      return <OpenMouth d={`M66 ${y - 2} Q100 ${y + 22} 134 ${y - 2} Q100 ${y + 6} 66 ${y - 2} Z`} fill={MOUTH} tongue={[100, y + 12, 9, 4]} />;
    case "delighted":
      return <OpenMouth d={`M64 ${y - 4} Q100 ${y + 30} 136 ${y - 4} Q100 ${y + 2} 64 ${y - 4} Z`} fill={MOUTH} tongue={[100, y + 16, 12, 5.4]} />;
    case "curious":
      return <ellipse cx={108} cy={y + 2} rx={3.6} ry={4.4} fill={MOUTH} />;
    case "thinking":
      return <path d={wave(y + 1, 22, 3, 100)} {...line(C.deep, 2.8)} />;
    case "focused":
      return <path d={`M72 ${y} L128 ${y}`} {...line(C.deep, 2.8)} />;
    case "worried":
      return <path d={`M70 ${y + 4} Q85 ${y - 2} 100 ${y + 3} Q115 ${y + 8} 130 ${y + 2}`} {...line(C.deep, 2.8)} />;
    case "oops":
      return <OpenMouth d={`M74 ${y} Q100 ${y + 10} 126 ${y} Q100 ${y + 3} 74 ${y} Z`} fill={MOUTH} tongue={[112, y + 5, 5, 2.6]} />;
    case "wink":
      return <path d={`M66 ${y} Q100 ${y + 16} 136 ${y - 6}`} {...line(C.deep, 2.8)} />;
    default:
      return <path d={curve(y - 1, 34, 12)} {...line(C.deep, 2.8)} />;
  }
};

/* ——— Clover, a goat kid: stubborn and cheeky; she climbs everything ——— */

const GOAT = "#d9c3a5";
const GOAT_SHADE = "#bfa582";
const GOAT_PATCH = "#8a5a3c";
const GOAT_MUZZLE = "#f3e6d4";
const IVORY = "#f3e6c8";
const GOAT_BODY: Body = {
  ...CHIBI,
  id: "goat",
  j: { ...J, earL: [62, 96], earR: [138, 96] },
  w: CHUNKY,
  neck: { x: 94, y: 140, w: 12, h: 16 },
  headVB: "30 28 140 140",
};
const palGoat = pal(GOAT, "#4a3a30", { skin: GOAT, skinShade: GOAT_SHADE });
const GOAT_HEAD =
  "M62 92 C62 64 80 52 100 52 C120 52 138 64 138 92 C138 118 124 146 100 150 C76 146 62 118 62 92 Z";

function GoatHead() {
  return (
    <g>
      {/* short horns, curving back, ridged */}
      {sides.map(([side, s]) => (
        <g key={side}>
          <Taper segs={[[[100 + s * 14, 62], [100 + s * 18, 44], [100 + s * 28, 34], [100 + s * 34, 40]]]} w0={11} w1={5} fill={IVORY} />
          <path d={`M${100 + s * 13} 54 l${s * 6} -2 M${100 + s * 16} 46 l${s * 6} -1`} {...line("#d6c6a4", 1.6)} />
        </g>
      ))}
      {sides.map(([side, s]) => (
        <g key={`e${side}`} data-joint={`ear${side}`} style={pivot(`ear${side}`, GOAT_BODY.j)}>
          <ellipse cx={100 + s * 52} cy={100} rx={20} ry={8} transform={`rotate(${s * 22} ${100 + s * 52} 100)`} fill={GOAT_SHADE} />
          <ellipse cx={100 + s * 51} cy={100} rx={13} ry={4} transform={`rotate(${s * 22} ${100 + s * 51} 100)`} fill="#f2b7a6" />
        </g>
      ))}
      <path d={GOAT_HEAD} fill={GOAT_SHADE} transform="translate(2 2)" />
      <path d={GOAT_HEAD} fill={GOAT} />
      {/* one brown patch over her right eye: nobody else has it */}
      <ellipse cx={120} cy={100} rx={17} ry={15} fill={GOAT_PATCH} />
      <Puffs at={[[92, 62, 6], [100, 58, 7], [108, 62, 6]]} fill={GOAT_PATCH} />
      <ellipse cx={100} cy={132} rx={21} ry={16} fill={GOAT_MUZZLE} />
      <path d="M94 124 q-2 3 -4 2 M106 124 q2 3 4 2" {...line("#8a6a52", 1.8)} />
      {/* her beard, a little tuft */}
      <Taper segs={[[[100, 146], [98, 154], [102, 160], [99, 168]]]} w0={9} w1={3} fill={GOAT_SHADE} />
    </g>
  );
}

function GoatBehind() {
  return (
    <g data-joint="tail" style={pivot("tail", GOAT_BODY.j)}>
      <Taper segs={[[[114, 196], [124, 188], [128, 178], [126, 170]]]} w0={9} w1={4} fill={GOAT_SHADE} />
    </g>
  );
}

/** Clover: a goat's amber eyes with a bar pupil lying flat; the bar widens with glee and thins to
 *  a slit when she is up to something. Her lids sit a touch low: cheek. */
const cloverEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const [dx, dy] = look;
  const lid = s === 1 ? GOAT_PATCH : GOAT;
  const brow = (raise: number, tilt: number) => {
    const by = y - 14 - raise;
    return <path d={`M${x - 6} ${by} Q${x} ${by - 3} ${x + 6} ${by}`} {...line(s === 1 ? "#5a3a26" : GOAT_PATCH, 2.6)} transform={turnAt(s, tilt, x, by)} />;
  };
  const open = (o: { bw?: number; bh?: number; top?: number; tilt?: number } = {}) => {
    const { bw = 10, bh = 3.6, top = 0.14, tilt = 0 } = o;
    return (
      <Orb id={id} x={x} y={y} rx={9} ry={8.6} s={s} fill="#e0a23a" lid={{ top, tilt, color: lid }}>
        <rect x={x - bw / 2 + dx} y={y - bh / 2 + dy} width={bw} height={bh} rx={bh / 2} fill={p.ink} />
        <circle cx={x - 3.6 + dx} cy={y - 3.6 + dy} r={2} fill={EYE_WHITE} />
      </Orb>
    );
  };
  const shut = (d: string) => <path d={d} {...line(p.ink, 3.2)} />;
  switch (mood) {
    case "happy":
      return g2(shut(arcUp(x, y, 7, 4.6)), brow(3, 0));
    case "delighted":
      return g2(open({ bw: 12, bh: 6, top: 0 }), brow(7, 0));
    case "curious":
      return g2(open({ bw: 9, bh: 4.6, top: 0 }), s === 1 ? brow(7, -10) : brow(0, 4));
    case "thinking":
      return g2(open({ bw: 11, bh: 2.4, top: 0.3 }), s === -1 ? brow(3, 8) : brow(0, -6));
    case "focused":
      return g2(open({ bw: 11, bh: 2, top: 0.44, tilt: -12 }), brow(-2, -16));
    case "worried":
      return g2(open({ bw: 8, bh: 3, top: 0.1, tilt: 14 }), brow(3, 18));
    case "oops":
      return g2(shut(arcDown(x, y, 7, 3)), brow(3, 12));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y, 7, 4.6)), brow(-1, -6)) : g2(open(), brow(5, 0));
    default:
      return g2(open(), brow(0, -4));
  }
};

/** Clover: a cheeky mouth on her pale muzzle — a sideways chew at rest, a grin with her little
 *  bottom teeth, and a wide-open bleat. */
const cloverMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const teeth = (top: number) => <rect x={95} y={top} width={10} height={3.4} rx={1} fill={EYE_WHITE} />;
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y, 9, 7)} fill={MOUTH} tongue={[100, y + 10, 4.4, 2.6]} />, teeth(y + 7));
    case "delighted":
      /* the bleat */
      return <OpenMouth d={`M91 ${y - 1} Q100 ${y - 4} 109 ${y - 1} Q112 ${y + 12} 100 ${y + 15} Q88 ${y + 12} 91 ${y - 1} Z`} fill={MOUTH} tongue={[100, y + 11, 5, 3]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.6} ry={3.2} fill={ink} />;
    case "thinking":
      return <path d={`M92 ${y + 2} Q98 ${y - 1} 104 ${y + 2} Q108 ${y + 4} 111 ${y}`} {...line(ink, 2.2)} />;
    case "focused":
      return <path d={`M94 ${y + 1} L106 ${y + 1}`} {...line(ink, 2.4)} />;
    case "worried":
      return <path d={wave(y + 2, 6, 2.2)} {...line(ink, 2.2)} />;
    case "oops":
      return g2(<path d={`M92 ${y + 1} L108 ${y + 1}`} {...line(ink, 2.2)} />, teeth(y + 1.6));
    case "wink":
      return g2(<path d={`M91 ${y + 1} Q100 ${y + 6} 110 ${y - 2}`} {...line(ink, 2.4)} />, <ellipse cx={107} cy={y + 3.6} rx={2} ry={2} fill={TONGUE_PINK} />);
    default:
      return <path d={`M92 ${y} Q100 ${y + 4} 108 ${y - 1.5}`} {...line(ink, 2.4)} />;
  }
};

/* ——— Tuck, an old tortoise: dry and unhurried; he spins on his shell ——— */

const SKIN = "#a89478";
const SKIN_SHADE = "#8a785e";
const PLASTRON = "#e6d29a";
const TORT_TORSO =
  "M78 152 Q100 146 122 152 Q130 184 124 212 Q100 222 76 212 Q70 184 78 152 Z";
const TORT: Body = {
  ...CHIBI,
  id: "tortoise",
  torso: TORT_TORSO,
  w: { upper: 14, fore: 13, thigh: 17, shin: 16, hand: 9, cloth: 1.2 },
  neck: { x: 91, y: 130, w: 18, h: 26 },
  headFit: "translate(100 150) scale(1.16) translate(-100 -150)",
  headVB: "38 40 124 124",
};
const palTort = pal(SKIN, SKIN, { skin: SKIN, skinShade: SKIN_SHADE });

function TortShell() {
  return (
    <g>
      <ellipse cx={101.5} cy={186.5} rx={52} ry={48} fill={C.deep} />
      <ellipse cx={100} cy={184} rx={50} ry={46} fill={C.primary} />
      {/* the scutes */}
      <path d="M66 162 L82 150 L100 156 L118 150 L134 162 M58 188 L74 176 L66 162 M142 188 L126 176 L134 162 M74 176 L126 176 M62 208 L76 196 L74 176 M138 208 L124 196 L126 176" {...line(C.deep, 2.4)} />
    </g>
  );
}

function TortHead() {
  return (
    <g>
      <ellipse cx={101.5} cy={107.5} rx={37} ry={33} fill={SKIN_SHADE} />
      <ellipse cx={100} cy={105} rx={35.5} ry={31.5} fill={SKIN} />
      {/* wrinkles, and a few age spots */}
      <path d="M84 80 Q100 76 116 80 M88 86 Q100 83 112 86" {...line(SKIN_SHADE, 1.8)} />
      <circle cx={70} cy={98} r={2} fill={SKIN_SHADE} />
      <circle cx={132} cy={94} r={1.6} fill={SKIN_SHADE} />
      <circle cx={126} cy={118} r={1.4} fill={SKIN_SHADE} />
      <circle cx={96} cy={114} r={1.2} fill={SKIN_SHADE} />
      <circle cx={104} cy={114} r={1.2} fill={SKIN_SHADE} />
    </g>
  );
}

/** Tuck: small, deep-set old eyes under heavy lids, bags beneath, and enormous white eyebrows that
 *  do nearly all of his talking. At rest the lids are half down: unimpressed. */
const tuckEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 12 - raise;
    return (
      <g transform={turnAt(s, tilt, x, by)}>
        <path d={`M${x - 10} ${by + 3} Q${x} ${by - 5} ${x + 10} ${by + 1}`} {...line("#f2eee6", 6)} />
        <path d={`M${x + s * 9} ${by + 1} l${s * 5} 3 M${x - s * 9} ${by + 3} l${-s * 4} 2`} {...line("#f2eee6", 3)} />
      </g>
    );
  };
  const bags = <path d={`M${x - 6} ${y + 8} Q${x} ${y + 11} ${x + 6} ${y + 8}`} {...line(SKIN_SHADE, 1.6)} />;
  const open = (top = 0.46, tilt = 0, k = 1) => (
    <g>
      <Orb id={id} x={x} y={y} rx={7 * k} ry={7 * k} s={s} fill={EYE_WHITE} lid={{ top, tilt, color: SKIN_SHADE }}>
        <circle cx={x + dx} cy={y + 1 + dy} r={4.6 * k} fill="#3a2a1a" />
        <circle cx={x - 1.6 + dx} cy={y - 1 + dy} r={1.4} fill={EYE_WHITE} />
      </Orb>
      {bags}
    </g>
  );
  const shut = (d: string) => g2(<path d={d} {...line(p.ink, 2.8)} />, bags);
  switch (mood) {
    case "happy":
      return g2(shut(arcUp(x, y, 6, 3.4)), brow(4, 0));
    case "delighted":
      return g2(open(0.02, 0, 1.2), brow(10, 0));
    case "curious":
      return g2(open(0.2), s === 1 ? brow(9, -12) : brow(1, 4));
    case "thinking":
      return g2(open(0.5, 0), s === -1 ? brow(4, 10) : brow(-1, -8));
    case "focused":
      return g2(open(0.56, -10), brow(-3, -18));
    case "worried":
      return g2(open(0.2, 14), brow(4, 20));
    case "oops":
      return g2(open(0.02, 0, 1.14), brow(9, 6));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y, 6, 3.4)), brow(-2, -6)) : g2(open(0.3), brow(6, 0));
    default:
      return g2(open(), brow(0, -4));
  }
};

/** Tuck: a tortoise's thin beak of a mouth, turned down at rest — grumpy — which cracks into a
 *  toothless grin he tries to hide. */
const tuckMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const beak = <path d={`M98 ${y - 1} l2 3 l2 -3`} {...line(ink, 1.8)} />;
  switch (mood) {
    case "happy":
      return g2(<path d={curve(y, 12, 5)} {...line(ink, 2.4)} />, beak);
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 12, 9)} fill={MOUTH} tongue={[100, y + 11, 5, 3]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={3} ry={3.6} fill={MOUTH} />;
    case "thinking":
      return g2(<path d={`M90 ${y + 2} Q100 ${y - 1} 110 ${y + 2}`} {...line(ink, 2.4)} />, beak);
    case "focused":
      return g2(<path d={`M88 ${y + 1} L112 ${y + 1}`} {...line(ink, 2.4)} />, beak);
    case "worried":
      return <path d={wave(y + 2, 10, 2.6)} {...line(ink, 2.4)} />;
    case "oops":
      return <OpenMouth d={`M95 ${y} a5 6 0 1 0 10 0 a5 6 0 1 0 -10 0 Z`} fill={MOUTH} />;
    case "wink":
      return g2(<path d={`M88 ${y + 2} Q100 ${y + 4} 112 ${y - 3}`} {...line(ink, 2.4)} />, beak);
    default:
      /* grumpy: turned down at the corners */
      return g2(<path d={curve(y + 3, 12, -5)} {...line(ink, 2.4)} />, beak);
  }
};

/* ——— Bit, a small robot: earnest and still learning feelings; its face is a screen ——— */

const SCREEN = "#1c2242";
const PIXEL = "#9fe2ff";
const BOT: Body = {
  ...CHIBI,
  id: "robot",
  torso: "M78 154 H122 Q128 154 128 162 V208 Q128 216 120 216 H80 Q72 216 72 208 V162 Q72 154 78 154 Z",
  neck: { x: 94, y: 136, w: 12, h: 20 },
  w: { upper: 9, fore: 8.5, thigh: 11, shin: 10, hand: 8, cloth: 1 },
  headVB: "40 20 120 120",
};
const palBot = pal(C.hi, C.deep, { skin: C.mid, skinShade: C.deep, blush: "#ff8fb0" });

function BotHead() {
  return (
    <g>
      {/* a sprung antenna with a round tip — no light: that is Wisp's */}
      <path d="M100 54 l-5 -4 l10 -4 l-10 -4 l10 -4 l-5 -3" {...line(C.deep, 2.4)} />
      <circle cx={100} cy={30} r={5} fill={C.accent} />
      <rect x={58} y={52} width={84} height={88} rx={18} fill={C.deep} transform="translate(2 2)" />
      <rect x={58} y={52} width={84} height={88} rx={18} fill={C.mid} />
      <rect x={66} y={62} width={68} height={66} rx={12} fill={SCREEN} />
      <path d="M72 70 Q82 66 96 66" {...line("#ffffff", 2)} opacity={0.18} />
      {sides.map(([side, s]) => (
        <g key={side}>
          <rect x={100 + s * 44 - 5} y={86} width={10} height={20} rx={4} fill={C.deep} />
          <circle cx={100 + s * 44} cy={96} r={2.4} fill={C.accent} />
        </g>
      ))}
    </g>
  );
}

function BotChest() {
  return (
    <g>
      <rect x={84} y={166} width={32} height={26} rx={6} fill={C.deep} />
      <circle cx={93} cy={176} r={3.4} fill={C.accent} />
      <circle cx={107} cy={176} r={3.4} fill={PIXEL} />
      <path d="M90 186 h20" {...line(C.hi, 2)} />
    </g>
  );
}

/** Bit: pixel eyes on its screen. Every mood is a different shape — blocks, carets, hearts, a
 *  loading ring, bars, crosses — because it is still learning which face goes with which feeling. */
const px = 3.2;
const bitEyes: EyeKit = ({ mood, s, x, y, look }) => {
  const [dx, dy] = look;
  const cells = (pts: [number, number][]) => (
    <g fill={PIXEL}>
      {pts.map(([cx, cy], i) => (
        <rect key={i} x={x + dx + cx * px - px / 2} y={y + dy + cy * px - px / 2} width={px - 0.4} height={px - 0.4} rx={0.6} />
      ))}
    </g>
  );
  switch (mood) {
    case "happy":
      return cells([[-2, 1], [-1, 0], [0, -1], [1, 0], [2, 1]]);
    case "delighted":
      /* hearts */
      return cells([[-1.5, -1], [-0.5, -1], [0.5, -1], [1.5, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-1.5, 1], [-0.5, 1], [0.5, 1], [1.5, 1], [-1, 2], [0, 2], [1, 2], [0, 3], [-1.5, -1.6], [1.5, -1.6]].filter(([cx, cy]) => !(cy === -1.6)) as [number, number][]);
    case "curious":
      return s === 1
        ? cells([[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]])
        : cells([[0, 0], [1, 0], [0, 1], [1, 1]]);
    case "thinking":
      /* a loading ring */
      return <path d={`M${x + 6} ${y} A6 6 0 1 1 ${x} ${y - 6}`} {...line(PIXEL, 3)} />;
    case "focused":
      return cells([[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]]);
    case "worried":
      return cells(s === -1 ? [[-1, 1], [0, 0], [1, -1], [0, 1], [1, 0]] : [[1, 1], [0, 0], [-1, -1], [0, 1], [-1, 0]]);
    case "oops":
      return cells([[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]]);
    case "wink":
      return s === 1 ? cells([[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]]) : cells([[0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]]);
    default:
      return cells([[0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]]);
  }
};

/** Bit: a pixel mouth that redraws itself for each feeling. */
const bitMouth: MouthKit = ({ mood, y }) => {
  const row = (pts: [number, number][]) => (
    <g fill={PIXEL}>
      {pts.map(([cx, cy], i) => (
        <rect key={i} x={100 + cx * px - px / 2} y={y + cy * px - px / 2} width={px - 0.4} height={px - 0.4} rx={0.6} />
      ))}
    </g>
  );
  switch (mood) {
    case "happy":
      return row([[-3, 0], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 0]]);
    case "delighted":
      return row([[-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [-2, 1], [2, 1], [-1, 2], [0, 2], [1, 2]]);
    case "curious":
      return row([[-1, 0], [0, -1], [1, 0], [0, 1]]);
    case "thinking":
      return row([[-2, 0], [0, 0], [2, 0]]);
    case "focused":
      return row([[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]]);
    case "worried":
      return row([[-3, 1], [-2, 0], [-1, 0], [0, 1], [1, 0], [2, 0], [3, 1]]);
    case "oops":
      return row([[-3, 0], [-2, -1], [-1, 0], [0, -1], [1, 0], [2, -1], [3, 0]]);
    case "wink":
      return row([[-2, 1], [-1, 1], [0, 1], [1, 0], [2, -1]]);
    default:
      return row([[-2, 0], [-1, 1], [0, 1], [1, 1], [2, 0]]);
  }
};

/* ——— Remy, a boy: a theatrical dreamer; every feeling at full size ——— */

const REMY_SKIN = "#f0c7a8";
const REMY_SHADE = "#dcaa88";
const REMY_HAIR = "#c4552e";
const REMY_HAIR_SHADE = "#9a3e20";
const REMY_BROW = "#8a3a1e";
const palRemy = human(REMY_SKIN, REMY_SHADE, REMY_HAIR, "#e07a4e");
const REMY: Body = {
  ...CHIBI,
  id: "remy",
  headFit: "translate(100 150) scale(1.05) translate(-100 -150)",
  w: CHUNKY,
  headVB: "30 22 140 140",
};

function RemyBack() {
  return <ellipse cx={100} cy={98} rx={47} ry={46} fill={REMY_HAIR_SHADE} />;
}

function RemyHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side}>
          <circle cx={100 + s * 42} cy={110} r={10} fill={REMY_SKIN} />
          <circle cx={100 + s * 43} cy={110} r={5} fill={REMY_SHADE} />
        </g>
      ))}
      <ellipse cx={101.5} cy={109.5} rx={40} ry={39} fill={REMY_SHADE} />
      <ellipse cx={99.5} cy={107} rx={38.6} ry={37.6} fill={REMY_SKIN} />
      <path d="M96 116 Q100 122 104 116" {...line(REMY_SHADE, 2.4)} />
      {/* the quiff: a wave that rises off his forehead and curls over */}
      <path
        d="M58 100 C54 64 76 50 96 50 C104 30 132 20 152 34 C138 36 128 44 130 56 C140 64 144 80 142 100 C134 82 122 74 108 72 C92 76 74 86 60 104 Z"
        fill={REMY_HAIR}
      />
      <path d="M100 48 C110 34 128 28 144 32" {...line("#e07a4e", 3.6)} />
    </g>
  );
}

/** Remy: large eyes with a hazel iris and a heavy lash line, and enormous brows that fly: they
 *  do the acting of a whole stage. */
const remyEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 17 - raise;
    return (
      <path
        d={`M${x - 9} ${by + 3} Q${x - 1} ${by - 5} ${x + 9} ${by + 1}`}
        {...line(REMY_BROW, 5)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (o: { k?: number; top?: number; tilt?: number; iris?: number; px?: number; py?: number; wet?: boolean } = {}) => {
    const { k = 1, top = 0, tilt = 0, iris = 1, px: ox = 0, py = 0, wet = false } = o;
    const rx = 9.6 * k;
    const ry = 10.6 * k;
    const ir = 7 * k * iris;
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={EYE_WHITE} lid={{ top, tilt, color: REMY_SKIN }} edge={{ color: ink, width: 2 }}>
          <circle cx={x + dx + ox} cy={y + 1 + dy + py} r={ir} fill="#6a7a3a" />
          <circle cx={x + dx + ox} cy={y + 1 + dy + py} r={Math.min(ir * 0.46, 3.4)} fill={ink} />
          <circle cx={x - ir * 0.4 + dx + ox} cy={y - ir * 0.34 + dy + py} r={ir * 0.32} fill={EYE_WHITE} />
          {wet && <path d={`M${x - rx * 0.8} ${y + ry * 0.6} Q${x} ${y + ry * 0.9} ${x + rx * 0.8} ${y + ry * 0.6}`} {...line("#bfe6ff", 2.4)} />}
        </Orb>
        {top === 0 && <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1}`} {...line(ink, 3.4)} />}
      </g>
    );
  };
  const shut = (d: string) => <path d={d} {...line(ink, 3.4)} />;
  switch (mood) {
    case "happy":
      return g2(shut(arcUp(x, y, 8, 5)), brow(6, 0));
    case "delighted":
      return g2(open({ k: 1.16 }), brow(13, -4));
    case "curious":
      return g2(open({ k: 1.08 }), s === 1 ? brow(13, -14) : brow(2, 4));
    case "thinking":
      return g2(open({ top: 0.26, px: -2.6, py: -3 }), s === 1 ? brow(10, -10) : brow(-2, 8));
    case "focused":
      return g2(open({ top: 0.46, tilt: -14 }), brow(-4, -20));
    case "worried":
      return g2(open({ top: 0.06, tilt: 16, iris: 0.86, wet: true }), brow(9, 26));
    case "oops":
      return g2(shut(`M${x + s * 7} ${y - 6} L${x - s * 6} ${y} L${x + s * 7} ${y + 6}`), brow(7, 20));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y, 8, 5)), brow(-2, -10)) : g2(open(), brow(12, 0));
    default:
      return g2(open(), brow(3, -2));
  }
};

/** Remy: a big stage mouth — a wide gap-toothed grin, a gasp, a wobbling grimace. */
const remyMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const gap = (top: number) => (
    <g fill={EYE_WHITE}>
      <rect x={94} y={top} width={5} height={4.4} rx={1} />
      <rect x={101} y={top} width={5} height={4.4} rx={1} />
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y - 1, 13, 9)} fill={MOUTH} tongue={[100, y + 12, 6, 3.4]} />, gap(y - 1));
    case "delighted":
      return <OpenMouth d={`M86 ${y - 2} Q100 ${y - 6} 114 ${y - 2} Q116 ${y + 18} 100 ${y + 20} Q84 ${y + 18} 86 ${y - 2} Z`} fill={MOUTH} teeth={[86, y - 4, 28, 4]} tongue={[100, y + 15, 7, 4]} />;
    case "curious":
      return <OpenMouth d={`M95 ${y + 2} a5 6.4 0 1 0 10 0 a5 6.4 0 1 0 -10 0 Z`} fill={MOUTH} />;
    case "thinking":
      return <path d={`M90 ${y + 2} Q96 ${y - 2} 102 ${y + 1} Q108 ${y + 3} 112 ${y - 1}`} {...line(ink, 2.8)} />;
    case "focused":
      return <path d={`M92 ${y + 1} L108 ${y + 1}`} {...line(ink, 3)} />;
    case "worried":
      return <OpenMouth d={roundRect(100, y + 3, 24, 8, 3.4)} fill={MOUTH} teeth={[88, y - 1, 24, 3.4]} />;
    case "oops":
      return <OpenMouth d={`M88 ${y + 2} Q94 ${y - 2} 100 ${y + 2} Q106 ${y - 2} 112 ${y + 2} Q100 ${y + 12} 88 ${y + 2} Z`} fill={MOUTH} />;
    case "wink":
      return g2(<OpenMouth d={dMouth(y, 10, 6, 103)} fill={MOUTH} />, gap(y - 0.6));
    default:
      return <path d={curve(y, 12, 7)} {...line(ink, 2.8)} />;
  }
};

/* ——— The five ——— */

export const NEW_CONCEPTS: Candidate[] = [
  {
    id: "new-frog",
    kind: "animal",
    frame: FROG,
    outline: false,
    label: "Fizz (frog)",
    attitude: { mood: "delighted", tilt: -6, hands: { L: [90, 176], R: [110, 176], outL: false, outR: false } },
    signature: "A blue dart frog with eyes on top and a mouth from ear to ear — his throat balloons up",
    pitch:
      "An over-excitable enthusiast: everything is the best thing ever, he leaps before he looks, and he can't keep a feeling in. At rest he is already delighted, fists clenched at his chest, head cocked, grinning from ear to ear. Blue, not green — a poison dart frog's blue and spots, so no large field reads as correct. His ability is Throat balloon: when he is bursting to say something, the pale throat under his chin swells up round like a balloon. Big round eyes on top of his head with huge pupils; frog lids that close from above and below, and squint up from beneath when he concentrates; the widest mouth in the cast.",
    risk: "Frogs are often green; he must stay blue. Excitement must not make the product loud: a balloon and a grin, never a fanfare.",
    pal: palFrog,
    body: C.mid,
    face: face({ eyeY: 80, eyeGap: 26, mouthY: 124, lid: C.mid, kit: fizzEyes, mouthKit: fizzMouth }),
    outfit: "bare",
    outfits: OUTFITS,
    head: () => <FrogHead />,
    belly: () => <ellipse cx={100} cy={192} rx={22} ry={22} fill={C.tint} />,
  },
  {
    id: "new-goat",
    kind: "animal",
    frame: GOAT_BODY,
    outline: false,
    label: "Clover (goat)",
    attitude: { mood: "wink", tilt: 7, hands: { L: [82, 200], R: [118, 200], outL: true, outR: true } },
    signature: "A goat kid with little horns, a beard tuft and one brown eye patch — she climbs everything",
    pitch:
      "Stubborn, cheeky and fearless: a small rebel who climbs everything she is told not to and nibbles what she shouldn't. At rest she stands hands on hips, head cocked, winking. Her ability is Climb: she scrambles up onto the top of anything — a card, a heading, the edge of the screen — and stands there, proud. A goat's amber eyes with the bar pupil lying flat, widening with glee and thinning to a slit when she's plotting; one brown patch over one eye; a pale muzzle with a sideways chew and a wide-open bleat.",
    risk: "Cheek must stay affectionate, never mocking the learner.",
    pal: palGoat,
    body: GOAT,
    face: face({ eyeY: 100, eyeGap: 19, mouthY: 136, lid: GOAT, kit: cloverEyes, mouthKit: cloverMouth }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: () => <GoatBehind />,
    head: () => <GoatHead />,
    belly: () => <ellipse cx={108} cy={184} rx={12} ry={16} fill={GOAT_PATCH} opacity={0.85} />,
  },
  {
    id: "new-tortoise",
    kind: "animal",
    frame: TORT,
    outline: false,
    label: "Tuck (tortoise)",
    attitude: { tilt: -3, hands: { L: [96, 198], R: [104, 198], outL: false, outR: false } },
    signature: "An old tortoise with a blue shell and enormous white eyebrows — he spins on his shell",
    pitch:
      "Old, dry and unhurried: he pretends nothing impresses him — then, when you get it right, he flips onto his back and spins on his shell like a breakdancer. At rest his lids are half down, his mouth turned down, his hands folded: unimpressed, or so he'd like you to think. His ability is Shell spin. Small deep-set old eyes with bags beneath and enormous white eyebrows that do nearly all of his talking; a thin beak of a mouth that cracks into a toothless grin he tries to hide; wrinkles and age spots. His shell is the product's blue.",
    risk: "Grumpiness must be a joke the learner is in on — his grumbles are never at them.",
    pal: palTort,
    body: PLASTRON,
    face: face({ eyeY: 102, eyeGap: 15, mouthY: 124, lid: SKIN_SHADE, kit: tuckEyes, mouthKit: tuckMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    behind: () => <TortShell />,
    head: () => <TortHead />,
    belly: () => <path d="M80 172 H120 M78 192 H122 M100 154 V214" {...line("#cdb77e", 2)} />,
  },
  {
    id: "new-robot",
    kind: "animal",
    frame: BOT,
    outline: false,
    label: "Bit (robot)",
    attitude: { tilt: 6, hands: { L: [78, 200], R: [122, 200] } },
    signature: "A small robot with a screen for a face and a sprung antenna — its face can be anything",
    pitch:
      "Earnest, helpful and still learning feelings: it tries very hard, gets them a little wrong, and is overjoyed to be right. At rest it tips its head, antenna bobbing, waiting to be useful. Its ability is Screen face: its face is a screen, so its eyes can become any shape — hearts, a loading ring, a question — and it tries them all. Pixel eyes and a pixel mouth that redraw themselves for every mood; a chest panel of buttons; bolts for ears. No light of its own: glowing is Wisp's.",
    risk: "A robot can feel cold; its earnestness and its wrong-shaped feelings are what make it warm. Its screen must never show text or a claim about the material.",
    pal: palBot,
    body: C.soft,
    face: face({ eyeY: 90, eyeGap: 15, mouthY: 112, lid: SCREEN, kit: bitEyes, mouthKit: bitMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    head: () => <BotHead />,
    pendant: () => <BotChest />,
  },
  {
    id: "new-boy",
    kind: "human",
    frame: REMY,
    outline: false,
    hands: "mitten",
    label: "Remy (boy)",
    attitude: { mood: "happy", tilt: -8, hands: { L: [96, 172], R: [150, 146], outL: false } },
    signature: "A boy with a tall ginger quiff, big ears and enormous brows — every feeling at full size",
    pitch:
      "A theatrical dreamer who narrates his own life like a film: he gasps, he swoons, he takes a bow, and underneath it all he is kind. At rest he stands with one hand on his heart and the other flung out to an invisible audience. His ability is Drama: every feeling at full size — the gasp, the swoon, the bow — made of nothing but himself. Large hazel eyes with a heavy lash line and enormous brows that fly; a big stage mouth with a gap-toothed grin; a tall ginger quiff that curls over; big ears.",
    risk: "Drama must stay warm and silly, never loud or mocking — his swoon at an incorrect answer is for the question, never the learner.",
    pal: palRemy,
    body: C.clothes,
    face: humanFace({ eyeY: 106, eyeGap: 18, mouthY: 130, lid: REMY_SKIN, kit: remyEyes, mouthKit: remyMouth }),
    outfit: "dungarees",
    outfits: ["dungarees", "hoodie", "raincoat", "winter", "party"],
    headBack: () => <RemyBack />,
    head: () => <RemyHead />,
  },
];

