import { createElement, type ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import { palette } from "./firefly-variants";
import type { Mood } from "./rig/face";
import { arcDown, arcUp, chevron, EYE_WHITE, line, OpenMouth, Orb, TONGUE_PINK, turnAt, type EyeKit, type MouthKit } from "./rig/eyes";
import type { Palette } from "./rig/palette";
import { CHIBI, J, pivot, type Body, type P } from "./rig/skeleton";
import { SHAPE, type Viseme } from "./rig/visemes";
import { C } from "./theme";

/**
 * The side characters: the club at the Observatory on the hill (`docs/world.md`).
 *
 * Hob, a star-nosed mole, keeps the observatory. Tavi, a girl of about ten, is the club's loudest
 * member. Grit, a small gargoyle, has sat on the dome for three hundred years. Lyra, a lyrebird,
 * performs. Nox, a cat, owns the roof. Pim, a fennec fox kit, is new.
 *
 * Every one is drawn in the product's scheme (the `C` tokens, and mixes of them with a neutral),
 * with no outlines: parts are told apart by colour and tone, each main part in two tones (its own
 * shade beneath, offset down and right). Every one has its own eyes and its own mouth, and its mouth
 * draws the talking shapes (`rig/visemes.ts`) as well as the moods, so it can say a fixed line.
 * None glows, flies or leaves a trail: that is Wisp's.
 */

/* ——— Shared ——— */

const FACE = "#fff4e8";
const INK = "#231c33";
const MOUTH_IN = "#3a1d2c";
const PINK = "#f29ab0";
const PINK_SHADE = "#d9718f";

/** Chunky limbs: rounder reads softer at small sizes. */
const CHUNKY = { upper: 13.5, fore: 12.5, thigh: 15, shin: 14, hand: 8.6, cloth: 1.15 };

const ANIMAL_OUTFITS: Candidate["outfits"] = ["bare", "dungarees", "hoodie", "raincoat", "winter", "party"];
const PERSON_OUTFITS: Candidate["outfits"] = ["hoodie", "dungarees", "raincoat", "dress", "winter", "party"];

const mix = (a: string, b: string, k: number) => `color-mix(in oklab, ${a} ${k}%, ${b})`;

const pal = (body: string, paw: string, over: Partial<Palette> = {}): Palette =>
  palette(body, paw, FACE, "#efd8c6", {
    line: "none",
    eye: INK,
    ink: INK,
    top: C.clothes,
    bottom: C.clothes,
    shoe: C.clothes,
    accent: C.accent,
    blush: "#ffa3b5",
    ...over,
  });

const face = (over: Partial<Candidate["face"]> & { lid: string }): Candidate["face"] => ({
  eyes: "bead",
  eyeY: 104,
  eyeGap: 18,
  mouthY: 128,
  nose: "none",
  brows: false,
  ...over,
});

const g2 = (...a: ReactNode[]) => createElement("g", null, ...a);
const sides = [
  ["L", -1],
  ["R", 1],
] as const;
const mirror = (s: number, x: number) => 100 + (x - 100) * s;

type Cubic = readonly [P, P, P, P];

function bez([a, b, c, d]: Cubic, t: number): P {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}

/** One filled shape along cubics, narrowing from `w0` to `w1`, with round ends. */
function Taper({ segs, w0, w1, fill }: { segs: Cubic[]; w0: number; w1: number; fill: string }) {
  const pts: P[] = [segs[0][0]];
  for (const s of segs) for (let i = 1; i <= 12; i++) pts.push(bez(s, i / 12));
  const last = pts.length - 1;
  const left: string[] = [];
  const right: string[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(last, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / last)) / 2;
    left.push(`${p[0] - (dy / l) * w} ${p[1] + (dx / l) * w}`);
    right.push(`${p[0] + (dy / l) * w} ${p[1] - (dx / l) * w}`);
  });
  return (
    <g fill={fill}>
      <circle cx={pts[0][0]} cy={pts[0][1]} r={w0 / 2} />
      <path d={`M${left.join(" L")} L${right.reverse().join(" L")} Z`} />
      <circle cx={pts[last][0]} cy={pts[last][1]} r={w1 / 2} />
    </g>
  );
}

/** A shape in two tones: its shade, then itself offset up and to the left. */
function Two({ d, fill, shade, k = 2 }: { d: string; fill: string; shade: string; k?: number }) {
  return (
    <g>
      <path d={d} fill={shade} />
      <path d={d} fill={fill} transform={`translate(${-k} ${-k * 0.8})`} />
    </g>
  );
}

const dMouth = (y: number, w: number, h: number, cx = 100) =>
  `M${cx - w} ${y} Q${cx} ${y + h * 1.6} ${cx + w} ${y} Q${cx} ${y + h * 0.15} ${cx - w} ${y} Z`;
const curve = (y: number, w: number, d: number, cx = 100) => `M${cx - w} ${y} Q${cx} ${y + d} ${cx + w} ${y}`;
const wave = (y: number, w: number, a: number, cx = 100) =>
  `M${cx - w} ${y} Q${cx - w / 2} ${y - a} ${cx} ${y} Q${cx + w / 2} ${y + a} ${cx + w} ${y}`;

/** How far a mood lifts the corners of a talking mouth: a happy line is said smiling. */
const SMILE: Partial<Record<Mood, number>> = { happy: 3, delighted: 4, wink: 2, curious: 1, worried: -2.5, oops: -1.5, focused: -0.5 };

/**
 * A talking mouth with lips: `W` its widest half-width and `H` its most open depth, drawn in the
 * kit's own colours. `teeth` is the top row's colour; `gap` leaves a tooth out.
 */
function talk(
  v: Viseme,
  mood: Mood,
  y: number,
  o: { W: number; H: number; inside: string; lip?: string; lipW?: number; teeth?: string; gap?: boolean; cx?: number },
): ReactNode {
  const s = SHAPE[v];
  const cx = o.cx ?? 100;
  const lift = SMILE[mood] ?? 0;
  const w = o.W * s.w;
  const lip = o.lip ?? o.inside;
  const lw = o.lipW ?? 2.6;
  if (s.h === 0)
    return (
      <path
        d={`M${cx - w} ${y - lift * 0.5} Q${cx} ${y + lift * 0.6 + (s.pressed ? -0.6 : 1)} ${cx + w} ${y - lift * 0.5}`}
        {...line(lip, s.pressed ? lw + 1.4 : lw)}
      />
    );
  const h = o.H * s.h;
  if (s.round)
    return (
      <g>
        {o.lip && <ellipse cx={cx} cy={y + h * 0.45} rx={w * 0.62 + 1.6} ry={h * 0.62 + 1.6} fill={o.lip} />}
        <ellipse cx={cx} cy={y + h * 0.45} rx={w * 0.62} ry={h * 0.62} fill={o.inside} />
      </g>
    );
  const top = y - lift * 0.5;
  const d = `M${cx - w} ${top} Q${cx} ${top - 2 + lift * 0.3} ${cx + w} ${top} Q${cx + w * 0.7} ${y + h * 1.25} ${cx} ${y + h * 1.3} Q${cx - w * 0.7} ${y + h * 1.25} ${cx - w} ${top} Z`;
  const teeth = s.teeth && o.teeth;
  return (
    <g>
      <OpenMouth
        d={d}
        fill={o.inside}
        tongue={s.tongue ? [cx, top + h * 0.45, w * 0.5, h * 0.35] : [cx, y + h * 1.2, w * 0.55, h * 0.4]}
      />
      {teeth && (
        <g fill={o.teeth}>
          {o.gap ? (
            <>
              <rect x={cx - w * 0.62} y={top - 0.6} width={w * 0.5} height={Math.min(4, h * 0.6)} rx={1} />
              <rect x={cx + w * 0.18} y={top - 0.6} width={w * 0.44} height={Math.min(4, h * 0.6)} rx={1} />
            </>
          ) : (
            <rect x={cx - w * 0.66} y={top - 0.6} width={w * 1.32} height={Math.min(4, h * 0.6)} rx={1.2} />
          )}
        </g>
      )}
      {s.bite && <path d={curve(top + h + 1.6, w * 0.7, -2, cx)} {...line(lip, lw + 1)} />}
    </g>
  );
}

/* ——— Hob, a star-nosed mole: the keeper ——— */

const HOB_FUR = C.deep;
const HOB_SHADE = mix(C.deep, "black", 72);
const HOB_SOCKET = mix(C.primary, C.deep, 70);
const HOB_BROW = "#efe6d4";

const HOB: Body = {
  ...CHIBI,
  id: "hob",
  j: {
    ...J,
    head: [100, 154],
    shoulderL: [76, 164],
    elbowL: [67, 186],
    wristL: [63, 206],
    shoulderR: [124, 164],
    elbowR: [133, 186],
    wristR: [137, 206],
    hipL: [89, 214],
    kneeL: [88, 244],
    footL: [87, 272],
    hipR: [111, 214],
    kneeR: [112, 244],
    footR: [113, 272],
  },
  torso: "M80 146 Q100 140 120 146 Q137 156 139 186 Q141 224 100 226 Q59 224 61 186 Q63 156 80 146 Z",
  headFit: "translate(0 6)",
  headVB: "30 36 140 140",
  w: { upper: 15, fore: 15, thigh: 21, shin: 20, hand: 11.5, cloth: 1.4 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

const HOB_HEAD = "M54 112 C52 78 74 62 100 62 C126 62 148 78 146 112 C145 138 126 152 100 152 C74 152 55 138 54 112 Z";

/** The star: twenty-two fleshy rays round the nostrils, eleven a side, drawn as a ring of petals. */
function Star({ x, y }: { x: number; y: number }) {
  const rays = Array.from({ length: 11 }, (_, i) => (i / 11) * 360 + 8);
  return (
    <g>
      {rays.map((a) => (
        <ellipse
          key={a}
          cx={x + 9.6 * Math.cos((a * Math.PI) / 180) + 0.8}
          cy={y + 9.6 * Math.sin((a * Math.PI) / 180) + 0.8}
          rx={6.4}
          ry={2.9}
          transform={`rotate(${a} ${x + 9.6 * Math.cos((a * Math.PI) / 180) + 0.8} ${y + 9.6 * Math.sin((a * Math.PI) / 180) + 0.8})`}
          fill={PINK_SHADE}
        />
      ))}
      {rays.map((a) => (
        <ellipse
          key={a}
          cx={x + 9.6 * Math.cos((a * Math.PI) / 180)}
          cy={y + 9.6 * Math.sin((a * Math.PI) / 180)}
          rx={6.2}
          ry={2.6}
          transform={`rotate(${a} ${x + 9.6 * Math.cos((a * Math.PI) / 180)} ${y + 9.6 * Math.sin((a * Math.PI) / 180)})`}
          fill={PINK}
        />
      ))}
      <circle cx={x} cy={y} r={6.4} fill={PINK_SHADE} />
      <circle cx={x - 2.2} cy={y - 0.4} r={1.4} fill={MOUTH_IN} />
      <circle cx={x + 2.2} cy={y - 0.4} r={1.4} fill={MOUTH_IN} />
    </g>
  );
}

function HobHead() {
  return (
    <g>
      {/* fur that stands up on top, and two tufts at the cheeks */}
      <path d="M84 66 L88 52 L94 64 L100 48 L106 63 L113 54 L116 67 Z" fill={HOB_FUR} />
      <path d="M56 118 L44 122 L54 128 L46 136 L60 134 Z M144 118 L156 122 L146 128 L154 136 L140 134 Z" fill={HOB_FUR} />
      <Two d={HOB_HEAD} fill={HOB_FUR} shade={HOB_SHADE} k={2.5} />
      {/* soft sockets so his tiny eyes read on dark fur */}
      <ellipse cx={81} cy={98} rx={9} ry={8} fill={HOB_SOCKET} />
      <ellipse cx={119} cy={98} rx={9} ry={8} fill={HOB_SOCKET} />
      {/* the spectacles he never wears, pushed up on his forehead and crooked */}
      <g transform="rotate(-7 100 74)">
        <circle cx={88} cy={74} r={7.5} fill={C.tint} opacity={0.35} />
        <circle cx={112} cy={74} r={7.5} fill={C.tint} opacity={0.35} />
        <g {...line(C.accent, 2.6)}>
          <circle cx={88} cy={74} r={7.5} />
          <circle cx={112} cy={74} r={7.5} />
          <path d="M95.5 73 Q100 70 104.5 73" />
        </g>
      </g>
    </g>
  );
}

function HobTop() {
  return <Star x={100} y={120} />;
}

/** Hob: tiny bead eyes he squints with — the left half-shut at rest — under big bushy pale brows
 *  that do all his acting. */
const hobEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 13 - raise;
    return (
      <g transform={turnAt(s, tilt, x, by)}>
        <path
          d={`M${x - 10} ${by + 3} Q${x - 6} ${by - 5} ${x} ${by - 4} Q${x + 6} ${by - 7} ${x + 11} ${by + 1} Q${x + 4} ${by} ${x - 2} ${by + 2} Q${x - 7} ${by + 4} ${x - 10} ${by + 3} Z`}
          fill={HOB_BROW}
        />
        <path d={`M${x + s * 10} ${by} l${s * 4} -3`} {...line(HOB_BROW, 2.4)} />
      </g>
    );
  };
  const open = (r = 3.6, top = 0, extra = false) => (
    <Orb id={id} x={x} y={y} rx={r} ry={r * 1.08} s={s} fill={INK} lid={{ top, color: HOB_SOCKET }}>
      <circle cx={x - r * 0.35 + dx * 0.3} cy={y - r * 0.4 + dy * 0.3} r={r * 0.36} fill={EYE_WHITE} />
      {extra && <circle cx={x + r * 0.4} cy={y + r * 0.3} r={r * 0.2} fill={EYE_WHITE} />}
    </Orb>
  );
  const shut = (d: string) => <path d={d} {...line(INK, 2.8)} />;
  switch (mood) {
    case "happy":
      return g2(shut(arcUp(x, y + 1, 5, 3)), brow(4, 0));
    case "delighted":
      return g2(open(4.4, 0, true), brow(8, -4));
    case "curious":
      /* the squint: one eye screwed up, the other wide, as if through a lens */
      return s === -1 ? g2(open(2.8, 0.45), brow(-2, -10)) : g2(open(4.8, 0, true), brow(9, -6));
    case "thinking":
      return g2(open(3.4, 0.2), s === 1 ? brow(7, -8) : brow(1, 6));
    case "focused":
      return g2(shut(`M${x - 4.5} ${y} L${x + 4.5} ${y}`), brow(-3, -16));
    case "worried":
      return g2(open(3, 0.1), brow(3, 22));
    case "oops":
      return g2(shut(chevron(x, y, s, 4, 3.6)), brow(5, 18));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y + 1, 5, 3)), brow(-1, -6)) : g2(open(), brow(4, 0));
    default:
      return s === -1 ? g2(open(3.4, 0.42), brow(-1, -8)) : g2(open(3.8), brow(3, 0));
  }
};

/** Hob: a small mouth under the star, with two old front teeth. */
const hobMouth: MouthKit = ({ mood, y, viseme }) => {
  if (viseme) return talk(viseme, mood, y, { W: 10, H: 8, inside: MOUTH_IN, lip: PINK_SHADE, lipW: 2.6, teeth: EYE_WHITE });
  const buck = (dy = 0) => (
    <g fill={EYE_WHITE}>
      <rect x={96.6} y={y + dy - 0.5} width={3.2} height={4.2} rx={0.9} />
      <rect x={100.4} y={y + dy - 0.5} width={3.2} height={4.2} rx={0.9} />
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y, 9, 6)} fill={MOUTH_IN} tongue={[100, y + 8, 4, 2.4]} />, buck());
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 1, 11, 9)} fill={MOUTH_IN} tongue={[100, y + 12, 5, 3]} />, buck(-1));
    case "curious":
      return <ellipse cx={101} cy={y + 2.5} rx={3} ry={3.6} fill={MOUTH_IN} />;
    case "thinking":
      return <path d={`M94 ${y + 2} Q100 ${y + 1} 107 ${y - 1}`} {...line(PINK_SHADE, 2.6)} />;
    case "focused":
      return <path d={`M95 ${y + 1} L105 ${y + 1}`} {...line(PINK_SHADE, 2.8)} />;
    case "worried":
      return <path d={wave(y + 2, 7, 2.6)} {...line(PINK_SHADE, 2.6)} />;
    case "oops":
      return g2(<OpenMouth d={dMouth(y + 1, 6, 4, 102)} fill={MOUTH_IN} />, buck(1));
    case "wink":
      return g2(<path d={`M93 ${y} Q100 ${y + 6} 108 ${y - 2}`} {...line(PINK_SHADE, 2.6)} />, buck(1.6));
    default:
      return g2(<path d={curve(y, 7, 4)} {...line(PINK_SHADE, 2.6)} />, buck(1.8));
  }
};

/* ——— Tavi, a girl of about ten: the loudest member ——— */

const TAVI_SKIN = "#c98d60";
const TAVI_SHADE = "#a96f45";
const TAVI_HAIR = "#9c3b1e";
const TAVI_HAIR_HI = "#c65a33";
const TAVI_LIP = "#8a4030";

const palTavi = palette(TAVI_SKIN, TAVI_SKIN, TAVI_SKIN, TAVI_SHADE, {
  line: "none",
  ink: INK,
  hair: TAVI_HAIR,
  hairHi: TAVI_HAIR_HI,
  eye: INK,
  top: C.clothes,
  topAlt: "#fff3de",
  bottom: C.deep,
  shoe: C.deep,
  accent: C.accent,
  blush: "#ec8a86",
});

/** Her hair is always blown back, as if she has just arrived at a run: a mass streaming to the
 *  left in points. */
const TAVI_MASS =
  "M142 100 C150 64 128 36 98 36 C74 36 56 46 44 60 C34 56 20 58 10 68 C24 70 32 76 36 82 C22 86 12 96 8 110 C22 104 34 104 42 108 C34 116 30 126 30 138 C40 128 50 126 58 128 L60 142 L140 142 C148 128 146 112 142 100 Z";

function TaviBack() {
  return (
    <g>
      <Two d={TAVI_MASS} fill={TAVI_HAIR} shade={mix(TAVI_HAIR, "black", 75)} k={2} />
      <path d="M118 46 C98 40 72 46 54 62 M98 54 C80 56 62 66 44 84 M74 74 C60 80 48 92 40 104" {...line(TAVI_HAIR_HI, 2.6)} opacity={0.75} />
    </g>
  );
}

function TaviHead() {
  return (
    <g>
      <circle cx={142} cy={110} r={7} fill={TAVI_SKIN} />
      <circle cx={143} cy={111} r={3} fill={TAVI_SHADE} />
      <ellipse cx={101.5} cy={106} rx={41} ry={39.5} fill={TAVI_SHADE} />
      <ellipse cx={99.5} cy={103.5} rx={40} ry={38} fill={TAVI_SKIN} />
      {/* the fringe's shadow, then the fringe, swept back and to the left */}
      <path d="M64 90 Q100 98 138 88 L138 93 Q100 102 64 95 Z" fill={TAVI_SHADE} opacity={0.35} />
      <path
        d="M58 94 C56 62 80 50 104 52 C130 54 146 72 142 96 C134 84 122 78 110 76 C106 84 96 90 82 90 C88 84 90 80 90 76 C78 82 68 88 58 94 Z"
        fill={TAVI_HAIR}
      />
      <path d="M78 62 Q96 54 114 58" {...line(TAVI_HAIR_HI, 3.2)} />
      {/* a plaster across her nose: she arrives at speed, and not always upright */}
      <g transform="rotate(-16 100 118)">
        <rect x={92} y={115.5} width={16} height={5.6} rx={2.8} fill="#f3d6b3" />
        <rect x={98} y={115.5} width={4} height={5.6} fill="#e9c49b" />
      </g>
    </g>
  );
}

/** Tavi: almond eyes with an amber-brown iris and a keen top lash line; thick auburn brows angled
 *  in, as if she is already on her way. */
const taviEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 15 - raise;
    return (
      <path
        d={`M${x - 8} ${by + 2} Q${x - 1} ${by - 3} ${x + 8} ${by - 0.5}`}
        {...line(TAVI_HAIR, 4.4)}
        transform={`${turnAt(s, tilt - 6, x, by)} ${s === 1 ? `scale(-1 1) translate(${-2 * x} 0)` : ""}`}
      />
    );
  };
  const open = (top = 0, bottom = 0, tilt = 0, k = 1, extra = false) => {
    const rx = 8.4 * k;
    const ry = 7.6 * k;
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={EYE_WHITE} lid={{ top, bottom, tilt, color: TAVI_SKIN }} edge={{ color: INK, width: 1.6 }}>
          <circle cx={x + dx} cy={y + 0.8 + dy} r={5.8 * k} fill="#9a5a22" />
          <circle cx={x + dx} cy={y + 0.8 + dy} r={2.8 * k} fill={INK} />
          <circle cx={x - 2.2 + dx} cy={y - 2 + dy} r={2.1 * k} fill={EYE_WHITE} />
          {extra && <circle cx={x + 2.6 + dx} cy={y + 2.8 + dy} r={1.2} fill={EYE_WHITE} />}
        </Orb>
        {top === 0 && <path d={`M${x - rx} ${y} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1} l${s * 2.6} -2.2`} {...line(INK, 2.8)} />}
      </g>
    );
  };
  const shut = (d: string) => <path d={d} {...line(INK, 3)} />;
  switch (mood) {
    case "happy":
      return g2(shut(arcUp(x, y + 1, 7.5, 4.5)), brow(4, 4));
    case "delighted":
      return g2(open(0, 0, 0, 1.15, true), brow(8, 6));
    case "curious":
      return g2(open(0, 0, 0, s === 1 ? 1.08 : 0.94), s === 1 ? brow(8, -2) : brow(0, 8));
    case "thinking":
      return g2(open(0.32, 0.1), s === -1 ? brow(6, 12) : brow(-1, 0));
    case "focused":
      return g2(open(0.4, 0.12, -8), brow(-3, -6));
    case "worried":
      return g2(open(0.08, 0, 14, 1, true), brow(3, 26));
    case "oops":
      return g2(shut(chevron(x, y, s, 6, 5.5)), brow(4, 22));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y + 1, 7.5, 4.5)), brow(-1, -2)) : g2(open(0, 0.1), brow(5, 6));
    default:
      return g2(open(0.08, 0.06), brow(1, 2));
  }
};

/** Tavi: a wide, lopsided grin with one front tooth missing. */
const taviMouth: MouthKit = ({ mood, y, viseme }) => {
  if (viseme) return talk(viseme, mood, y, { W: 11, H: 9, inside: MOUTH_IN, lip: TAVI_LIP, lipW: 3, teeth: EYE_WHITE, gap: true });
  const grin = (w: number, h: number, cx = 101) => (
    <g>
      <OpenMouth d={dMouth(y - 1, w, h, cx)} fill={MOUTH_IN} tongue={[cx, y + h * 1.3, w * 0.45, h * 0.35]} />
      <rect x={cx - w * 0.62} y={y - 1.4} width={w * 0.5} height={3.8} rx={1} fill={EYE_WHITE} />
      <rect x={cx + w * 0.16} y={y - 1.4} width={w * 0.46} height={3.8} rx={1} fill={EYE_WHITE} />
    </g>
  );
  switch (mood) {
    case "happy":
      return grin(11, 7);
    case "delighted":
      return grin(13, 10);
    case "curious":
      return <ellipse cx={102} cy={y + 2} rx={3.6} ry={4.4} fill={MOUTH_IN} />;
    case "thinking":
      return g2(<path d={`M92 ${y + 1} Q100 ${y + 3} 108 ${y - 1}`} {...line(TAVI_LIP, 3)} />, <ellipse cx={95} cy={y + 3} rx={2.6} ry={1.6} fill={TONGUE_PINK} />);
    case "focused":
      /* tongue poked out at the corner: concentrating */
      return g2(<path d={`M93 ${y + 1} L107 ${y}`} {...line(TAVI_LIP, 3)} />, <ellipse cx={106} cy={y + 3} rx={2.8} ry={2.4} fill={TONGUE_PINK} />);
    case "worried":
      return <path d={`M92 ${y + 3} Q96 ${y - 1} 100 ${y + 2} Q104 ${y + 5} 108 ${y + 1}`} {...line(TAVI_LIP, 3)} />;
    case "oops":
      return <OpenMouth d={`M91 ${y + 4} Q100 ${y - 4} 109 ${y + 4} Q100 ${y + 2} 91 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "wink":
      return grin(10, 6, 103);
    default:
      return grin(9.5, 4.6, 102);
  }
};

/* ——— Grit, a small gargoyle: three hundred years on one corner of the dome ——— */

const STONE = mix(C.mid, "#8d8780", 50);
const STONE_SHADE = mix(C.deep, "#6b665f", 45);
const STONE_LIGHT = mix(C.soft, "#bcb6ad", 50);

const GRIT: Body = {
  ...CHIBI,
  id: "grit",
  j: {
    ...J,
    head: [100, 156],
    shoulderL: [78, 164],
    elbowL: [70, 190],
    wristL: [68, 214],
    shoulderR: [122, 164],
    elbowR: [130, 190],
    wristR: [132, 214],
    hipL: [88, 216],
    kneeL: [82, 246],
    footL: [84, 272],
    hipR: [112, 216],
    kneeR: [118, 246],
    footR: [116, 272],
    tail: [112, 214],
    earL: [56, 98],
    earR: [144, 98],
  },
  torso: "M80 152 Q100 146 120 152 Q135 162 133 192 Q131 224 100 226 Q69 224 67 192 Q65 162 80 152 Z",
  headFit: "translate(0 8)",
  headVB: "24 28 152 152",
  w: { upper: 14, fore: 14, thigh: 16, shin: 15, hand: 9.5, cloth: 1.2 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

const GRIT_HEAD = "M56 92 C56 70 72 62 100 62 C128 62 144 70 144 92 L146 120 C146 142 128 152 100 152 C72 152 54 142 54 120 Z";

function GritHead() {
  return (
    <g>
      {/* stubby horns, the left one chipped flat with a crack */}
      <path d="M70 72 C62 60 60 46 66 36 C74 44 82 56 84 66 Z" fill={STONE_SHADE} />
      <path d="M68 70 C61 60 60 50 64 42 L70 48 C74 54 79 60 82 66 Z" fill={STONE} />
      <path d="M66 46 L71 53" {...line(STONE_SHADE, 1.6)} />
      <path d="M130 72 C138 58 142 42 136 28 C126 38 118 54 116 66 Z" fill={STONE_SHADE} />
      <path d="M132 70 C139 58 141 44 136 32 C128 42 120 56 118 66 Z" fill={STONE} />
      {/* pointed ears out to the sides */}
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, GRIT.j)}>
          <path d={`M${mirror(s, 58)} 90 L${mirror(s, 32)} 84 L${mirror(s, 56)} 108 Z`} fill={STONE_SHADE} />
          <path d={`M${mirror(s, 57)} 92 L${mirror(s, 38)} 88 L${mirror(s, 56)} 104 Z`} fill={STONE} />
        </g>
      ))}
      <Two d={GRIT_HEAD} fill={STONE} shade={STONE_SHADE} k={2.5} />
      {/* a lighter, worn face, and two spots of lichen */}
      <path d="M70 112 C70 96 86 92 100 98 C114 92 130 96 130 112 C130 134 116 144 100 144 C84 144 70 134 70 112 Z" fill={STONE_LIGHT} opacity={0.45} />
      <circle cx={126} cy={74} r={3.4} fill={C.accent} opacity={0.75} />
      <circle cx={131} cy={79} r={2} fill={C.accent} opacity={0.75} />
      <circle cx={74} cy={138} r={2.4} fill={C.accent} opacity={0.6} />
      {/* its snout: two flared nostrils */}
      <path d="M92 116 Q100 110 108 116 Q106 121 100 121 Q94 121 92 116 Z" fill={STONE_SHADE} />
      <circle cx={96.5} cy={117} r={1.5} fill={MOUTH_IN} />
      <circle cx={103.5} cy={117} r={1.5} fill={MOUTH_IN} />
    </g>
  );
}

function GritBehind() {
  return (
    <g data-joint="tail" style={pivot("tail", GRIT.j)}>
      <Taper
        segs={[
          [
            [112, 214],
            [136, 228],
            [160, 226],
            [164, 202],
          ],
        ]}
        w0={12}
        w1={5}
        fill={STONE_SHADE}
      />
      {/* the spade at its tip */}
      <path d="M164 202 L156 194 L164 178 L172 194 Z" fill={STONE_SHADE} />
      <path d="M163 198 L157 193 L163 182 L169 193 Z" fill={STONE} />
    </g>
  );
}

/** Grit: big round white eyes — its sweet heart — under a heavy stone brow ledge that sits low, so
 *  at rest it looks grumpy. The ledges carry every mood. */
const gritEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const ledge = (raise: number, tilt: number) => {
    const by = y - 10 - raise;
    return (
      <g transform={turnAt(s, tilt, x, by)}>
        <path d={`M${x - 12} ${by + 3} Q${x} ${by - 5} ${x + 12} ${by + 3} L${x + 12} ${by + 7} Q${x} ${by + 1} ${x - 12} ${by + 7} Z`} fill={STONE_SHADE} />
      </g>
    );
  };
  const open = (top = 0, k = 1, pupil = 3.6, extra = false) => (
    <Orb id={id} x={x} y={y} rx={9 * k} ry={9.4 * k} s={s} fill={EYE_WHITE} lid={{ top, color: STONE }}>
      <circle cx={x + dx} cy={y + 1 + dy} r={pupil * k} fill={INK} />
      <circle cx={x - 1.4 + dx} cy={y - 0.6 + dy} r={1.3 * k} fill={EYE_WHITE} />
      {extra && <circle cx={x + 2 + dx} cy={y + 3 + dy} r={0.9} fill={EYE_WHITE} />}
    </Orb>
  );
  const shut = (d: string) => <path d={d} {...line(INK, 3)} />;
  switch (mood) {
    case "happy":
      return g2(shut(arcUp(x, y + 1, 7, 4)), ledge(6, 0));
    case "delighted":
      return g2(open(0, 1.12, 4.6, true), ledge(10, 4));
    case "curious":
      return g2(open(0, 1.05, 3), s === 1 ? ledge(9, -4) : ledge(1, 10));
    case "thinking":
      return g2(open(0.36, 1, 3.4), s === -1 ? ledge(5, 6) : ledge(-1, -4));
    case "focused":
      return g2(open(0.5, 1, 3), ledge(-3, -16));
    case "worried":
      return g2(open(0.06, 1.06, 2.6, true), ledge(6, 26));
    case "oops":
      return g2(shut(chevron(x, y, s, 6, 5)), ledge(5, 18));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y + 1, 7, 4)), ledge(-1, -8)) : g2(open(0.2), ledge(4, 0));
    default:
      /* grumpy: lids low, ledges down at the middle */
      return g2(open(0.34, 1, 3.6), ledge(-2, -14));
  }
};

/** Grit: a jutting underbite — the lower jaw wider than the top, two little tusks standing up from
 *  it. Talking, the jaw drops on its hinge and the tusks go with it. */
const gritMouth: MouthKit = ({ mood, y, viseme }) => {
  const jaw = (drop: number, smile = 0, wide = 1) => {
    const w = 16 * wide;
    const top = y - smile * 0.4;
    return (
      <g>
        {drop > 0.5 && (
          <OpenMouth
            d={`M${100 - w + 2} ${top} Q100 ${top - 2 + smile * 0.3} ${100 + w - 2} ${top} L${100 + w - 3} ${top + drop} Q100 ${top + drop + 3} ${100 - w + 3} ${top + drop} Z`}
            fill={MOUTH_IN}
            tongue={[100, top + drop, w * 0.45, Math.max(1.5, drop * 0.4)]}
          />
        )}
        {/* the lower lip of the jaw, then the tusks standing on it */}
        <path d={`M${100 - w} ${top + drop - 1} Q100 ${top + drop + 7 + smile} ${100 + w} ${top + drop - 1}`} {...line(STONE_SHADE, 4.2)} />
        <path d={`M${100 - w * 0.62} ${top + drop + 1} l1.6 -6.4 l2.6 6`} fill={EYE_WHITE} />
        <path d={`M${100 + w * 0.62} ${top + drop + 1} l-1.6 -6.4 l-2.6 6`} fill={EYE_WHITE} />
      </g>
    );
  };
  if (viseme) {
    const sh = SHAPE[viseme];
    const lift = SMILE[mood] ?? 0;
    return jaw(sh.h * 10, lift, sh.round ? 0.7 : sh.w);
  }
  switch (mood) {
    case "happy":
      return jaw(5, 4);
    case "delighted":
      return jaw(10, 5);
    case "curious":
      return jaw(4, 0, 0.6);
    case "thinking":
      return jaw(0, -1, 0.9);
    case "focused":
      return jaw(0, -2, 0.8);
    case "worried":
      return jaw(2, -3, 0.85);
    case "oops":
      return jaw(6, -2, 0.9);
    case "wink":
      return jaw(3, 3);
    default:
      return jaw(0, -2);
  }
};

/* ——— Lyra, a lyrebird: the performer ——— */

const LYRA_BODY = C.primary;
const LYRA_SHADE = C.deep;
const LYRA_MASK = C.soft;

const LYRA: Body = {
  ...CHIBI,
  id: "lyra",
  j: { ...J, tail: [100, 206] },
  torso: "M84 148 Q100 142 116 148 Q129 158 127 186 Q123 216 100 219 Q77 216 73 186 Q71 158 84 148 Z",
  headVB: "34 34 132 132",
  w: { upper: 13, fore: 11, thigh: 6.5, shin: 5.5, hand: 7, cloth: 1 },
  neck: { x: 94, y: 134, w: 12, h: 20 },
};

/** One of the two lyre feathers: out from the rump, up past its head, curling out at the top.
 *  Banded with notches, as a lyrebird's are. */
function Lyrate({ s }: { s: number }) {
  const m = (x: number) => mirror(s, x);
  const segs: Cubic[] = [
    [
      [m(98), 206],
      [m(70), 190],
      [m(56), 150],
      [m(64), 100],
    ],
    [
      [m(64), 100],
      [m(70), 64],
      [m(52), 30],
      [m(32), 34],
    ],
  ];
  return (
    <g>
      <Taper segs={segs} w0={13} w1={9} fill={LYRA_SHADE} />
      <g transform={`translate(${-1.4 * s} -1.2)`}>
        <Taper segs={segs} w0={10.5} w1={7} fill={C.accent} />
      </g>
      {[0.25, 0.45, 0.65, 0.85].map((t) => {
        const [x, y] = bez(segs[0], t);
        return <circle key={`a${t}`} cx={x} cy={y} r={3.2} fill={LYRA_SHADE} />;
      })}
      {[0.15, 0.4, 0.65].map((t) => {
        const [x, y] = bez(segs[1], t);
        return <circle key={`b${t}`} cx={x} cy={y} r={2.8} fill={LYRA_SHADE} />;
      })}
      <circle cx={m(32)} cy={34} r={5} fill={C.accent} />
    </g>
  );
}

function LyraBehind() {
  return (
    <g data-joint="tail" style={pivot("tail", LYRA.j)}>
      {/* the filmy plumes between the lyre feathers */}
      <g {...line(C.soft, 6)} opacity={0.75}>
        <path d="M100 206 C92 160 84 110 78 52" />
        <path d="M100 206 C100 150 98 100 96 40" />
        <path d="M100 206 C108 150 112 100 120 44" />
        <path d="M100 206 C114 170 124 120 132 66" />
        <path d="M100 206 C86 170 76 130 70 80" />
      </g>
      <g {...line(C.hi, 2.4)} opacity={0.8}>
        <path d="M100 206 C96 150 90 110 86 60" />
        <path d="M100 206 C104 150 106 110 110 56" />
      </g>
      <Lyrate s={1} />
      <Lyrate s={-1} />
    </g>
  );
}

const LYRA_HEAD = "M64 108 C64 80 80 66 100 66 C120 66 136 80 136 108 C136 132 120 146 100 146 C80 146 64 132 64 108 Z";

function LyraHead() {
  return (
    <g>
      {/* a small swept crest of two feathers */}
      <path d="M100 70 C96 56 104 44 116 42 C110 50 108 58 108 68 Z" fill={LYRA_SHADE} />
      <path d="M96 70 C90 60 92 50 100 44 C98 52 100 60 104 68 Z" fill={LYRA_BODY} />
      <Two d={LYRA_HEAD} fill={LYRA_BODY} shade={LYRA_SHADE} k={2.2} />
      {/* the pale mask round the eyes: a performer's make-up */}
      <ellipse cx={83} cy={103} rx={13} ry={11} fill={LYRA_MASK} />
      <ellipse cx={117} cy={103} rx={13} ry={11} fill={LYRA_MASK} />
      <path d="M78 130 Q100 140 122 130 Q118 142 100 144 Q82 142 78 130 Z" fill={C.mid} />
    </g>
  );
}

/** Lyra: big glossy eyes with three long lashes and a flick of liner at the outer corner; heavy
 *  lids in the body's colour when it acts bored, or proud. */
const lyraEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const lashes = (by: number) => (
    <path
      d={`M${x + s * 4} ${by} l${s * 4} -5 M${x + s * 7} ${by + 1.6} l${s * 5} -3.6 M${x + s * 9} ${by + 4} l${s * 5.4} -1.6`}
      {...line(INK, 1.9)}
    />
  );
  const open = (top = 0, bottom = 0, tilt = 0, k = 1, extra = false) => {
    const rx = 7.6 * k;
    const ry = 8.4 * k;
    return (
      <g>
        <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={INK} lid={{ top, bottom, tilt, color: C.mid }}>
          <circle cx={x + dx} cy={y + 1 + dy} r={5 * k} fill={mix(C.primary, INK, 40)} />
          <circle cx={x - 2.4 + dx} cy={y - 2.6 + dy} r={2.4 * k} fill={EYE_WHITE} />
          {extra && <circle cx={x + 2.4 + dx} cy={y + 3 + dy} r={1.2} fill={EYE_WHITE} />}
        </Orb>
        <path d={`M${x + s * rx * 0.7} ${y - 2} l${s * 5} -3`} {...line(INK, 2.2)} />
        {lashes(top > 0 ? y - ry + 2 * ry * top - 3 : y - ry + 1)}
      </g>
    );
  };
  const shut = (d: string, by: number) => g2(<path d={d} {...line(INK, 3)} />, lashes(by));
  switch (mood) {
    case "happy":
      return shut(arcUp(x, y + 1, 7, 4.5), y - 3);
    case "delighted":
      return open(0, 0, 0, 1.14, true);
    case "curious":
      return open(0, 0, 0, s === 1 ? 1.08 : 0.96);
    case "thinking":
      return open(0.42, 0, s * 4);
    case "focused":
      return open(0.48, 0, -6);
    case "worried":
      return open(0.1, 0, 16, 1, true);
    case "oops":
      return shut(chevron(x, y, s, 6, 5), y - 5);
    case "wink":
      return s === 1 ? shut(arcDown(x, y - 1, 7, 4), y - 3) : open(0.15);
    default:
      /* at rest, a little pleased with itself: lids half down, chin up */
      return open(0.3, 0, 4);
  }
};

/** Lyra: a short dark beak. It speaks by opening it: the lower half drops on its hinge. */
const lyraMouth: MouthKit = ({ mood, y, viseme }) => {
  const beak = (open: number, tilt = 0) => (
    <g transform={`rotate(${tilt} 100 ${y - 6})`}>
      {open > 0.3 && <path d={`M93 ${y - 4} L107 ${y - 4} L100 ${y + 4 + open} Z`} fill={MOUTH_IN} />}
      <path d={`M93 ${y - 4} Q100 ${y - 1 + open * 0.8 + 4} 107 ${y - 4} Q100 ${y + 6 + open} 93 ${y - 4} Z`} fill={LYRA_SHADE} transform={`translate(0 ${open * 0.6})`} />
      <path d={`M92 ${y - 6} Q100 ${y - 10} 108 ${y - 6} L100 ${y + 4} Z`} fill={LYRA_SHADE} />
      <path d={`M95 ${y - 6.4} Q100 ${y - 8.6} 105 ${y - 6.4} L100 ${y - 1} Z`} fill={mix(C.deep, "white", 82)} />
    </g>
  );
  if (viseme) return beak(SHAPE[viseme].h * 7);
  switch (mood) {
    case "happy":
    case "delighted":
      return beak(mood === "delighted" ? 7 : 4);
    case "curious":
    case "oops":
      return beak(3);
    case "thinking":
      return beak(0, 8);
    case "worried":
      return beak(1.5, -4);
    case "wink":
      return beak(2.5, 6);
    default:
      return beak(0);
  }
};

/* ——— Nox, a cat: owns the roof ——— */

const NOX_FUR = mix(C.deep, "#34323d", 55);
const NOX_SHADE = mix(C.deep, "#1e1c26", 40);
const NOX_WHITE = C.tint;

const NOX: Body = {
  ...CHIBI,
  id: "nox",
  j: {
    ...J,
    head: [100, 152],
    shoulderL: [80, 166],
    elbowL: [78, 188],
    wristL: [84, 206],
    shoulderR: [120, 166],
    elbowR: [122, 188],
    wristR: [116, 206],
    hipL: [86, 216],
    kneeL: [84, 246],
    footL: [84, 272],
    hipR: [114, 216],
    kneeR: [116, 246],
    footR: [116, 272],
    tail: [118, 218],
    earL: [72, 74],
    earR: [128, 74],
  },
  /* a round loaf */
  torso: "M78 146 Q100 138 122 146 Q143 162 141 196 Q137 228 100 228 Q63 228 59 196 Q57 162 78 146 Z",
  headFit: "translate(0 4)",
  headVB: "32 42 136 136",
  w: { upper: 13, fore: 12.5, thigh: 15, shin: 14, hand: 8.4, cloth: 1.2 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

const NOX_HEAD = "M56 108 C56 80 76 66 100 66 C124 66 144 80 144 108 C150 116 152 124 146 128 C140 142 124 150 100 150 C76 150 60 142 54 128 C48 124 50 116 56 108 Z";

function NoxHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, NOX.j)}>
          {/* small ears with round tips; the left one has a notch out of it */}
          <path
            d={
              s === -1
                ? "M62 88 L61.4 74 L67 71 L61 67 Q61 58 70 54 Q80 58 90 72 Z"
                : `M${mirror(s, 62)} 88 Q${mirror(s, 60)} 58 ${mirror(s, 70)} 54 Q${mirror(s, 80)} 58 ${mirror(s, 90)} 72 Z`
            }
            fill={NOX_FUR}
          />
          <path d={`M${mirror(s, 67)} 82 Q${mirror(s, 66)} 64 ${mirror(s, 71)} 62 Q${mirror(s, 77)} 66 ${mirror(s, 83)} 74 Z`} fill={PINK} opacity={0.7} />
        </g>
      ))}
      <Two d={NOX_HEAD} fill={NOX_FUR} shade={NOX_SHADE} k={2.2} />
      {/* the white muzzle and chin */}
      <path d="M82 124 C82 112 92 108 100 114 C108 108 118 112 118 124 C118 138 110 146 100 146 C90 146 82 138 82 124 Z" fill={NOX_WHITE} />
      <path d="M95 116 L105 116 L100 121 Z" fill={PINK} />
      <g {...line(mix(C.hi, "white", 60), 1.4)} opacity={0.9}>
        <path d="M82 124 L56 120 M82 128 L58 130 M118 124 L144 120 M118 128 L142 130" />
      </g>
    </g>
  );
}

function NoxBelly() {
  return <path d="M88 152 Q100 160 112 152 Q118 180 110 206 Q100 212 90 206 Q82 180 88 152 Z" fill={NOX_WHITE} />;
}

function NoxBehind() {
  return (
    <g data-joint="tail" style={pivot("tail", NOX.j)}>
      {/* a long tail that curls up into a question mark */}
      <Taper
        segs={[
          [
            [118, 218],
            [150, 236],
            [172, 214],
            [166, 176],
          ],
          [
            [166, 176],
            [162, 152],
            [142, 150],
            [146, 166],
          ],
        ]}
        w0={13}
        w1={9}
        fill={NOX_FUR}
      />
    </g>
  );
}

/** Nox: round eyes in the accent with a slit pupil, lids heavy at rest — unimpressed. The slit
 *  widens to a disc when it is delighted, and it will not admit to that. */
const noxEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const open = (top = 0, bottom = 0, tilt = 0, pupil = 2, k = 1) => (
    <Orb id={id} x={x} y={y} rx={8.4 * k} ry={8.6 * k} s={s} fill={mix(C.accent, "white", 85)} lid={{ top, bottom, tilt, color: NOX_FUR }}>
      <ellipse cx={x + dx} cy={y + dy} rx={pupil} ry={7} fill={INK} />
      <circle cx={x - 3 + dx} cy={y - 3 + dy} r={1.7} fill={EYE_WHITE} />
    </Orb>
  );
  const shut = (d: string) => <path d={d} {...line(NOX_WHITE, 3)} />;
  switch (mood) {
    case "happy":
      return shut(arcDown(x, y - 1, 7, 3.4));
    case "delighted":
      return open(0, 0, 0, 6.4, 1.08);
    case "curious":
      return open(0.1, 0, 0, 3.2);
    case "thinking":
      return open(0.5, 0.1, s * 4, 1.6);
    case "focused":
      return open(0.52, 0.18, -6, 1.4);
    case "worried":
      return open(0.12, 0, 14, 4.4);
    case "oops":
      return shut(chevron(x, y, s, 6, 5));
    case "wink":
      return s === 1 ? shut(arcDown(x, y - 1, 7, 3.4)) : open(0.5, 0, 0, 1.8);
    default:
      return open(0.46, 0.08, 0, 1.8);
  }
};

/** Nox: a cat's “ω” under its nose; talking, it opens beneath, with two small fangs. */
const noxMouth: MouthKit = ({ mood, y, viseme }) => {
  const omega = (dy = 0) => <path d={`M92 ${y + dy} Q96 ${y + 4 + dy} 100 ${y + dy} Q104 ${y + 4 + dy} 108 ${y + dy}`} {...line(NOX_SHADE, 2.2)} />;
  const open = (h: number, w = 6) => (
    <g>
      <OpenMouth d={`M${100 - w} ${y + 1} Q100 ${y + 3} ${100 + w} ${y + 1} Q${100 + w * 0.8} ${y + 2 + h} 100 ${y + 3 + h} Q${100 - w * 0.8} ${y + 2 + h} ${100 - w} ${y + 1} Z`} fill={MOUTH_IN} tongue={[100, y + 2 + h, w * 0.5, Math.max(1.4, h * 0.35)]} />
      <path d={`M${100 - w * 0.6} ${y + 1.4} l1 3 l1.2 -3 M${100 + w * 0.6} ${y + 1.4} l-1 3 l-1.2 -3`} fill={EYE_WHITE} />
      {omega()}
    </g>
  );
  if (viseme) {
    const sh = SHAPE[viseme];
    return sh.h === 0 ? omega(sh.pressed ? -0.4 : 0) : open(sh.h * 8, sh.round ? 4 : 6 * sh.w);
  }
  switch (mood) {
    case "happy":
      return open(3);
    case "delighted":
      return open(7, 7);
    case "curious":
      return open(2.4, 3.6);
    case "worried":
      return <path d={wave(y + 3, 7, 2.4)} {...line(NOX_SHADE, 2.2)} />;
    case "oops":
      return open(4, 5);
    default:
      return omega();
  }
};

/* ——— Pim, a fennec fox kit: the newest member ——— */

const PIM_FUR = mix(C.accent, "#e9d3b0", 55);
const PIM_SHADE = mix(C.accentDeep, "#c4a27a", 45);
const PIM_INNER = "#f7c4c0";

const PIM: Body = {
  ...CHIBI,
  id: "pim",
  j: {
    ...J,
    head: [100, 154],
    shoulderL: [86, 166],
    elbowL: [82, 186],
    wristL: [80, 204],
    shoulderR: [114, 166],
    elbowR: [118, 186],
    wristR: [120, 204],
    hipL: [93, 214],
    kneeL: [92, 244],
    footL: [91, 272],
    hipR: [107, 214],
    kneeR: [108, 244],
    footR: [109, 272],
    tail: [108, 210],
    earL: [80, 82],
    earR: [120, 82],
  },
  torso: "M86 152 Q100 148 114 152 Q122 158 121 176 L119 206 Q118 220 100 221 Q82 220 81 206 L79 176 Q78 158 86 152 Z",
  headFit: "translate(0 6)",
  headVB: "4 4 192 192",
  w: { upper: 11.5, fore: 11, thigh: 13, shin: 12, hand: 7.6, cloth: 1 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

/** How far the ears turn with the mood: they flatten out when it is shy or startled and stand up
 *  tall when it is delighted. [left, right] in degrees, outward positive. */
const PIM_EARS: Partial<Record<Mood, [number, number]>> = {
  worried: [-42, 42],
  oops: [-50, 50],
  thinking: [-6, 18],
  curious: [8, -14],
  delighted: [10, -10],
  happy: [4, -4],
  focused: [0, 0],
};

function PimHead({ mood }: Ctx) {
  const [l, r] = (mood && PIM_EARS[mood]) ?? [-2, 0];
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, PIM.j)}>
          <g transform={`rotate(${s === -1 ? l : r} ${mirror(s, 80)} 82)`}>
            {/* ears bigger than its head: two dishes, turned out to listen */}
            <path d={`M${mirror(s, 72)} 100 C${mirror(s, 46)} 86 ${mirror(s, 22)} 56 ${mirror(s, 18)} 14 C${mirror(s, 52)} 18 ${mirror(s, 86)} 42 ${mirror(s, 102)} 76 Z`} fill={PIM_SHADE} />
            <path d={`M${mirror(s, 73)} 97 C${mirror(s, 48)} 84 ${mirror(s, 25)} 56 ${mirror(s, 21)} 17 C${mirror(s, 53)} 21 ${mirror(s, 84)} 44 ${mirror(s, 99)} 75 Z`} fill={PIM_FUR} />
            <path d={`M${mirror(s, 77)} 88 C${mirror(s, 56)} 76 ${mirror(s, 38)} 54 ${mirror(s, 32)} 30 C${mirror(s, 56)} 34 ${mirror(s, 78)} 52 ${mirror(s, 90)} 74 Z`} fill={PIM_INNER} />
            <path d={`M${mirror(s, 80)} 80 C${mirror(s, 64)} 70 ${mirror(s, 50)} 58 ${mirror(s, 40)} 44`} {...line(FACE, 2.4)} opacity={0.9} />
          </g>
        </g>
      ))}
      <Two d="M66 112 C66 88 82 76 100 76 C118 76 134 88 134 112 C134 136 120 148 100 148 C80 148 66 136 66 112 Z" fill={PIM_FUR} shade={PIM_SHADE} k={2} />
      {/* the cream face and a fennec's dark tear lines */}
      <path d="M70 116 C76 104 90 102 100 110 C110 102 124 104 130 116 C128 136 116 146 100 146 C84 146 72 136 70 116 Z" fill={FACE} />
      <path d="M88 112 Q86 120 90 126 M112 112 Q114 120 110 126" {...line(PIM_SHADE, 2)} />
      <ellipse cx={100} cy={124} rx={4.4} ry={3.2} fill={INK} />
      <circle cx={98.6} cy={123} r={1} fill={EYE_WHITE} />
    </g>
  );
}

function PimBehind() {
  return (
    <g data-joint="tail" style={pivot("tail", PIM.j)}>
      <Taper
        segs={[
          [
            [108, 210],
            [130, 220],
            [146, 210],
            [150, 188],
          ],
        ]}
        w0={14}
        w1={18}
        fill={PIM_FUR}
      />
      {/* a fennec's dark tail tip */}
      <circle cx={150} cy={186} r={10} fill={PIM_SHADE} />
      <circle cx={151} cy={182} r={7} fill={mix(C.accentDeep, "#5b4636", 40)} />
    </g>
  );
}

function PimBelly() {
  return <ellipse cx={100} cy={186} rx={13} ry={22} fill={FACE} />;
}

/** Pim: big dark glossy eyes that look away — down and to the side — when it is shy, which is most
 *  of the time; two shines and a bottom glint that make it look on the edge of tears or wonder. */
const pimEyes: EyeKit = ({ mood, s, x, y, look, id }) => {
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 14 - raise;
    return <path d={`M${x - 5} ${by} Q${x} ${by - 2} ${x + 5} ${by}`} {...line(PIM_SHADE, 2.6)} transform={turnAt(s, tilt, x, by)} />;
  };
  const open = (k = 1, top = 0, lx = 0, ly = 0, extra = true) => (
    <Orb id={id} x={x} y={y} rx={7.6 * k} ry={8.4 * k} s={s} fill={INK} lid={{ top, color: FACE }}>
      <circle cx={x - 2.4 + dx + lx} cy={y - 2.8 + dy + ly} r={2.8 * k} fill={EYE_WHITE} />
      <circle cx={x + 2.6 + dx + lx} cy={y + 1.6 + dy + ly} r={1.2 * k} fill={EYE_WHITE} />
      {extra && <path d={`M${x - 4} ${y + 5.6} Q${x} ${y + 7.2} ${x + 4} ${y + 5.6}`} {...line(EYE_WHITE, 1.2)} opacity={0.7} />}
    </Orb>
  );
  const shut = (d: string) => <path d={d} {...line(INK, 2.8)} />;
  switch (mood) {
    case "happy":
      return g2(shut(arcUp(x, y + 1, 6.4, 4)), brow(3, 0));
    case "delighted":
      return g2(open(1.16), brow(7, 0));
    case "curious":
      return g2(open(1.06, 0, 1.4, -1), s === 1 ? brow(6, -10) : brow(1, 4));
    case "thinking":
      return g2(open(1, 0.2, 2, -2.4), brow(3, s * -8));
    case "focused":
      return g2(open(0.96, 0.32), brow(-1, -10));
    case "worried":
      return g2(open(1.08, 0.04, -1.8, 1.6), brow(3, 22));
    case "oops":
      return g2(shut(chevron(x, y, s, 5.6, 5)), brow(4, 18));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y + 1, 6.4, 4)), brow(0, 0)) : g2(open(), brow(3, 0));
    default:
      /* shy: looking down and away */
      return g2(open(1, 0.06, -2, 1.8), brow(2, 12));
  }
};

/** Pim: a small mouth on its muzzle, under the black nose; a little tongue shows when it laughs. */
const pimMouth: MouthKit = ({ mood, y, viseme }) => {
  const c = PIM_SHADE;
  if (viseme) return talk(viseme, mood, y, { W: 7.6, H: 7, inside: MOUTH_IN, lip: c, lipW: 2.4 });
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 6, 5)} fill={MOUTH_IN} tongue={[100, y + 7, 3.4, 2.2]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 8, 7)} fill={MOUTH_IN} tongue={[100, y + 9, 4.4, 2.8]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.4} ry={3} fill={MOUTH_IN} />;
    case "thinking":
      return <path d={`M95 ${y + 2} Q100 ${y + 1} 105 ${y - 0.6}`} {...line(c, 2.2)} />;
    case "focused":
      return <path d={`M96 ${y + 1} L104 ${y + 1}`} {...line(c, 2.2)} />;
    case "worried":
      return <path d={wave(y + 2, 5, 2)} {...line(c, 2.2)} />;
    case "oops":
      return <ellipse cx={100} cy={y + 2.4} rx={3.2} ry={2.6} fill={MOUTH_IN} />;
    case "wink":
      return <path d={`M94 ${y} Q100 ${y + 5} 106 ${y - 1}`} {...line(c, 2.2)} />;
    default:
      /* a small, shy smile, pressed to one side */
      return <path d={`M96 ${y + 1} Q99 ${y + 3} 103 ${y + 1}`} {...line(c, 2.2)} />;
  }
};

/* ——— The club ——— */

export const OBSERVATORY: Candidate[] = [
  {
    id: "obs-hob",
    kind: "animal",
    frame: HOB,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -4, hands: { L: [92, 196], R: [138, 146], outL: false, outR: true } },
    label: "Hob",
    signature: "A low, wide star-nosed mole with huge pink spade hands — he burrows",
    pitch:
      "The keeper. He built the observatory with his own paws and has rebuilt the dome's hinge a hundred times. Wants everyone to see what he sees; can barely see a thing himself without the telescope, and won't admit it — his spectacles live pushed up on his forehead, crooked, and he squints instead. Fussy, proud, and the softest touch on the hill. At rest he squints with one eye, one spade hand raised to make a point. Species-true: the star of twenty-two pink rays on his nose, velvet fur that stands up on top, and digging hands bigger than his head. His ability is Burrow: he dives into the ground and pops up anywhere else.",
    risk: "A grown-up the club pushes against, never a scold: on an incorrect answer he is gentle. The star must read at 32px; it is what he is named by.",
    pal: pal(HOB_FUR, PINK, { skin: HOB_FUR, skinShade: HOB_SHADE, blush: "#ff9fb5" }),
    body: HOB_FUR,
    face: face({ eyeY: 98, eyeGap: 19, mouthY: 140, lid: HOB_SOCKET, kit: hobEyes, mouthKit: hobMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    head: () => <HobHead />,
    top: () => <HobTop />,
  },
  {
    id: "obs-tavi",
    kind: "human",
    frame: { ...CHIBI, id: "tavi", w: CHUNKY, headVB: "18 26 152 152" },
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: 6, hands: { L: [66, 186], R: [132, 200], outL: true, outR: true } },
    label: "Tavi",
    signature: "A girl with auburn hair blown back in points and a plaster on her nose — she zooms",
    pitch:
      "The club's loudest member, about ten. She means to discover a comet and name it after herself, and has named three already; none was a comet. Wants to be first to everything; rushes, is wrong often and out loud, and laughs it off — the one who makes a wrong answer safe. At rest she is already on her way: arms up and ready, head tipped, grinning. Her imperfections tell you who she is: one front tooth missing, a plaster across her nose, hair blown back as if she has just arrived at a run, a jumper too big for her. Her ability is Zoom: she runs so fast she blurs, and arrives in a skid.",
    risk: "Speed kept small: a blur and a skid, never a celebration that grows. Being wrong is funny because she laughs first, never because anyone laughs at her.",
    pal: palTavi,
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 104, eyeGap: 17, mouthY: 129, nose: "dot", lid: TAVI_SKIN, kit: taviEyes, mouthKit: taviMouth }),
    outfit: "hoodie",
    outfits: PERSON_OUTFITS,
    headBack: () => <TaviBack />,
    head: () => <TaviHead />,
  },
  {
    id: "obs-grit",
    kind: "animal",
    frame: GRIT,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -3, hands: { L: [112, 190], R: [88, 192], outL: false, outR: false } },
    label: "Grit",
    signature: "A squat stone gargoyle with stubby horns, one chipped, and a big underbite — it turns to stone",
    pitch:
      "Carved last and smallest, it has sat on the same corner of the dome for three hundred years, and comes alive at night. Wants to see the town below; too scared to leave its corner. A grumpy face and the sweetest heart: under the heavy stone brows are big round eyes. At rest it crouches with its arms folded, brows down. Species-true: horns, pointed ears, a spade-tipped tail, worn stone with spots of lichen, a chipped horn with a crack. No wings, so it never reads as Wisp. Its ability is Turn to stone: when it is startled or embarrassed it freezes solid mid-pose, then cracks back out.",
    risk: "Grumpy-looking, never frightening: a six-year-old should want to pick it up. Alive, it is drawn in the scheme's colour; only its ability turns it grey.",
    pal: pal(STONE, STONE, { skin: STONE, skinShade: STONE_SHADE, limb: STONE, paw: STONE_SHADE, blush: "#e7a3a8" }),
    body: STONE,
    face: face({ eyeY: 104, eyeGap: 19, mouthY: 130, lid: STONE, kit: gritEyes, mouthKit: gritMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <GritBehind />,
    head: () => <GritHead />,
  },
  {
    id: "obs-lyra",
    kind: "animal",
    frame: LYRA,
    outline: false,
    attitude: { mood: "neutral", tilt: 8, hands: { L: [96, 178], R: [150, 122], outL: false, outR: true } },
    label: "Lyra",
    signature: "An upright lyrebird with a lyre of a tail taller than itself — it can do any voice",
    pitch:
      "The performer, named after the constellation. Does a show every night whether anyone asked or not. Wants applause; can do anyone's voice but has never found its own — what it really wants is to be liked as itself. At rest, chin up, one wing flung out mid-flourish, lids half down: pleased with itself. Species-true: the two banded lyre feathers that curl out at the top, filmy plumes between them, long thin legs; a pale mask round its eyes like stage make-up, and three long lashes. Its ability is Mimic: any voice or sound — another character's, the dome creaking, a camera shutter.",
    risk: "It only mimics fixed lines, never anything generated, and never mocks: mimicry is affection. The tail must not crowd a surface that carries material.",
    pal: pal(LYRA_BODY, LYRA_BODY, { skin: LYRA_BODY, skinShade: LYRA_SHADE, limb: LYRA_BODY, paw: LYRA_BODY, blush: "#ffa3c4" }),
    body: LYRA_BODY,
    face: face({ eyeY: 103, eyeGap: 17, mouthY: 128, lid: C.mid, kit: lyraEyes, mouthKit: lyraMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <LyraBehind />,
    head: () => <LyraHead />,
  },
  {
    id: "obs-nox",
    kind: "animal",
    frame: NOX,
    outline: false,
    attitude: { mood: "neutral", tilt: -5, hands: { L: [94, 208], R: [106, 208], outL: false, outR: false } },
    label: "Nox",
    signature: "A round charcoal loaf of a cat with a white bib and a question-mark tail — it pours",
    pitch:
      "Lives on the dome's roof; was there before the club and acts as if it still owns the place. Wants company and would rather die than say so. Deadpan and unimpressed — Lyra's one audience it can't win. At rest it sits like a loaf, paws together, lids heavy, head on one side. Species-true: a white muzzle, bib and socks, whiskers, small round-tipped ears (the left one notched), a long tail curled into a question mark, slit pupils that open to discs when it is secretly delighted. Its ability is Pour: it goes liquid and pours itself into anything — a teacup, the telescope tube, a gap under a door.",
    risk: "Unimpressed, never unkind: its deadpan is a joke the learner is in on. Its ears are small and round so it never reads as Pim.",
    pal: pal(NOX_FUR, NOX_WHITE, { skin: NOX_FUR, skinShade: NOX_SHADE, limb: NOX_FUR, paw: NOX_WHITE, blush: "#ff9fb5" }),
    body: NOX_FUR,
    face: face({ eyeY: 102, eyeGap: 19, mouthY: 124, lid: NOX_FUR, kit: noxEyes, mouthKit: noxMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <NoxBehind />,
    belly: () => <NoxBelly />,
    head: () => <NoxHead />,
  },
  {
    id: "obs-pim",
    kind: "animal",
    frame: PIM,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: 9, hands: { L: [97, 192], R: [104, 184], outL: false, outR: false } },
    label: "Pim",
    signature: "A small fennec fox kit under two enormous ears — it hears anything",
    pitch:
      "The newest member, new to the hill this term — new to everything, like the learner. Wants to belong; so shy it hides behind its own ears. At rest it looks down and away, head on one side, one paw holding the other. Species-true: ears bigger than its head with pale fur inside, a cream face with a fennec's dark tear lines, a black nose, a bushy tail with a dark tip. Its ability is Radar ears: they swivel to hear anything, anywhere, like the observatory's dishes, and flatten when it is shy.",
    risk: "Shy, never sad: its stake is belonging, and it is always found, never left out. Ears must stay huge and pointed so it never reads as Nox.",
    pal: pal(PIM_FUR, PIM_FUR, { skin: PIM_FUR, skinShade: PIM_SHADE, limb: PIM_FUR, paw: PIM_SHADE, blush: "#ffa3b5" }),
    body: PIM_FUR,
    face: face({ eyeY: 108, eyeGap: 16, mouthY: 132, lid: FACE, kit: pimEyes, mouthKit: pimMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <PimBehind />,
    belly: () => <PimBelly />,
    head: (c) => <PimHead {...c} />,
  },
];
