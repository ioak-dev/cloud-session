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

/* ——— The cute frame (`docs/character-guidelines.md` §1) ———
 * About two heads tall: the head is drawn in chibi head space and scaled up by `headFit` about the
 * neck, so it is half the figure; the body is a small bean under it, and the arms and legs are
 * short, thick nubs. Outfits are drawn on the chibi torso and carried onto the small body by
 * `torsoFit`. */

const TORSO_FIT = "translate(100 196) scale(1.18 0.9) translate(-100 -148)";
/** Undoes `TORSO_FIT`, so a tail or wings behind the body are authored in figure space. */
const UNFIT = "translate(100 148) scale(0.8475 1.1111) translate(-100 -196)";

function cute(
  id: string,
  o: { k?: number; neck?: number; torso: string; headVB?: string; w?: Partial<Body["w"]>; j?: Partial<Body["j"]> },
): Body {
  const k = o.k ?? 1.5;
  const neck = o.neck ?? 200;
  return {
    ...CHIBI,
    id,
    j: {
      ...J,
      root: [100, 284],
      torso: [100, 244],
      head: [100, neck],
      shoulderL: [84, 210],
      elbowL: [78, 226],
      wristL: [75, 240],
      shoulderR: [116, 210],
      elbowR: [122, 226],
      wristR: [125, 240],
      hipL: [91, 254],
      kneeL: [90, 264],
      footL: [89, 273],
      hipR: [109, 254],
      kneeR: [110, 264],
      footR: [111, 273],
      tail: [112, 250],
      wingL: [92, 212],
      wingR: [108, 212],
      ...o.j,
    },
    headFit: `translate(100 ${neck}) scale(${k}) translate(-100 -150)`,
    torsoFit: TORSO_FIT,
    hemFit: TORSO_FIT,
    handsFit: "translate(100 214) scale(0.9) translate(-100 -158)",
    packFit: "translate(0 2)",
    torso: o.torso,
    headVB: o.headVB ?? "18 36 164 164",
    w: { upper: 14, fore: 13, thigh: 18, shin: 17, hand: 8.6, cloth: 1.15, ...o.w },
    neck: { x: 100, y: 150, w: 0, h: 0 },
  };
}

/** A soft head: rounder at the top, a little fuller at the cheeks. */
const blob = (cx: number, cy: number, rx: number, ry: number, jowl = 1.04) =>
  `M${cx - rx} ${cy} C${cx - rx} ${cy - ry * 0.78} ${cx - rx * 0.56} ${cy - ry} ${cx} ${cy - ry} C${cx + rx * 0.56} ${cy - ry} ${cx + rx} ${cy - ry * 0.78} ${cx + rx} ${cy} C${cx + rx * jowl} ${cy + ry * 0.62} ${cx + rx * 0.62} ${cy + ry} ${cx} ${cy + ry} C${cx - rx * 0.62} ${cy + ry} ${cx - rx * jowl} ${cy + ry * 0.62} ${cx - rx} ${cy} Z`;

/* ——— Eyes: one acting table, each character's own drawing ———
 * What an eye does in each mood is the same idea for everyone (§5): happy closes into an arc,
 * delight adds a sparkle, curiosity widens one eye, thinking looks up and away, focus lowers the
 * lids, worry lifts the brows' inner ends and shrinks the pupils, a fright squeezes them shut, a
 * wink closes one. How an eye, its pupil, its shine and its brow are drawn is each character's own. */

type Brow = (a: { x: number; y: number; s: -1 | 1; raise: number; tilt: number }) => ReactNode;

type EyeStyle = {
  rx: number;
  ry: number;
  /** The eye's own fill: white for an eye with an iris, a colour for a solid one. */
  fill: string;
  iris?: { r: number; color: string };
  pupil: { r: number; color?: string; slit?: boolean };
  /** The big catchlight's radius; a small one sits lower right. Both upper left for the cast. */
  shine: number;
  lid: string;
  /** A lash line along the top of the open eye, and lashes at its outer corner. */
  rim?: { color: string; w: number; lashes: number };
  /** Ink for the closed shapes. */
  closed: string;
  brow: Brow;
  /** How far above the eye's centre the brow sits. */
  browY: number;
  /** The eye at rest: lids, a look, and the brows' raise and tilt. */
  rest?: { top?: number; bottom?: number; tilt?: number; look?: P; raise?: number; browTilt?: number; k?: [number, number] };
};

function eyesOf(st: EyeStyle): EyeKit {
  return ({ mood, s, x, y, look, id }) => {
    const b = (raise: number, tilt: number) => st.brow({ x, y: y - st.browY, s, raise, tilt });
    const open = (o: { top?: number; bottom?: number; tilt?: number; k?: number; look?: P; pupil?: number; sparkle?: boolean } = {}) => {
      const k = o.k ?? 1;
      const rx = st.rx * k;
      const ry = st.ry * k;
      const [dx, dy] = o.look ?? look;
      const pr = st.pupil.r * (o.pupil ?? 1) * k;
      const top = o.top ?? 0;
      return (
        <g>
          <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={st.fill} lid={{ top, bottom: o.bottom ?? 0, tilt: o.tilt ?? 0, color: st.lid }}>
            {st.iris && <circle cx={x + dx} cy={y + dy + 0.6} r={st.iris.r * k} fill={st.iris.color} />}
            {st.pupil.slit && (o.pupil ?? 1) < 1.4 ? (
              <ellipse cx={x + dx} cy={y + dy} rx={pr * 0.42} ry={ry * 0.8} fill={st.pupil.color ?? INK} />
            ) : (
              <circle cx={x + dx} cy={y + dy + 0.6} r={pr} fill={st.pupil.color ?? INK} />
            )}
            <circle cx={x - rx * 0.32 + dx * 0.6} cy={y - ry * 0.34 + dy * 0.6} r={st.shine * k} fill={EYE_WHITE} />
            <circle cx={x + rx * 0.36 + dx * 0.6} cy={y + ry * 0.32 + dy * 0.6} r={st.shine * 0.42 * k} fill={EYE_WHITE} />
            {o.sparkle && (
              <path
                d={`M${x + rx * 0.3} ${y - ry * 0.62} l1.2 2.8 l2.8 1.2 l-2.8 1.2 l-1.2 2.8 l-1.2 -2.8 l-2.8 -1.2 l2.8 -1.2 Z`}
                fill={EYE_WHITE}
              />
            )}
          </Orb>
          {st.rim && top < 0.05 && (
            <path d={`M${x - rx - 0.6} ${y - ry * 0.1} A${rx + 0.6} ${ry + 0.6} 0 0 1 ${x + rx + 0.6} ${y - ry * 0.1}`} {...line(st.rim.color, st.rim.w)} />
          )}
          {st.rim &&
            Array.from({ length: st.rim.lashes }, (_, i) => {
              const a = (-0.42 + i * 0.22) * Math.PI;
              const ex = x + s * rx * Math.cos(a + 0.9);
              const ey = y - ry * Math.sin(a + 0.9) + (top > 0 ? ry * top * 1.6 : 0);
              return <path key={i} d={`M${ex} ${ey} l${s * 3.4} ${-2.6 + i * 1.4}`} {...line(st.rim!.color, st.rim!.w * 0.75)} />;
            })}
        </g>
      );
    };
    const shut = (d: string) => <path d={d} {...line(st.closed, Math.max(2.6, st.rx * 0.36))} />;
    const r = st.rest ?? {};
    const restK = r.k ? (s === -1 ? r.k[0] : r.k[1]) : 1;
    switch (mood) {
      case "happy":
        return g2(shut(arcUp(x, y + st.ry * 0.2, st.rx * 0.9, st.ry * 0.5)), b(4, 0));
      case "delighted":
        return g2(open({ k: 1.14, pupil: 1.35, sparkle: true }), b(8, -2));
      case "curious":
        return s === 1 ? g2(open({ k: 1.12 }), b(9, -6)) : g2(open({ k: 0.9, top: 0.16 }), b(0, 8));
      case "thinking":
        return g2(open({ top: 0.3, look: [s === 1 ? 2.4 : 2.4, -2.6] }), s === -1 ? b(6, 12) : b(-1, -4));
      case "focused":
        return g2(open({ top: 0.42, bottom: 0.08, tilt: -8, pupil: 0.86 }), b(-3, -16));
      case "worried":
        return g2(open({ top: 0.06, tilt: 14, pupil: 0.62, look: [0, 1.4] }), b(4, 24));
      case "oops":
        return g2(shut(chevron(x, y, s, st.rx * 0.7, st.ry * 0.55)), b(5, 18));
      case "wink":
        return s === 1 ? g2(shut(arcUp(x, y + st.ry * 0.2, st.rx * 0.9, st.ry * 0.5)), b(-1, -6)) : g2(open(), b(5, 0));
      default:
        return g2(open({ top: r.top, bottom: r.bottom, tilt: r.tilt, look: r.look, k: restK }), b(r.raise ?? 0, r.browTilt ?? 0));
    }
  };
}

/** A brow as a thick rounded stroke, an arc that tilts about its middle. */
const arcBrow =
  (color: string, w: number, len: number): Brow =>
  ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return <path d={`M${x - len} ${by + 1.6} Q${x} ${by - 2.6} ${x + len} ${by + 1.6}`} {...line(color, w)} transform={turnAt(s, tilt, x, by)} />;
  };

/** A short pill of a brow: a floating dash, for an animal. */
const dashBrow =
  (color: string, w: number, len: number): Brow =>
  ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return <path d={`M${x - len} ${by} L${x + len} ${by}`} {...line(color, w)} transform={turnAt(s, tilt, x, by)} />;
  };

/* ——— Hob, a star-nosed mole: the keeper. A circle ——— */

const HOB_FUR = C.deep;
const HOB_SHADE = mix(C.deep, "black", 72);
const HOB_FACE = C.mid;
const HOB_BELLY = C.primary;
const HOB_WHITE = "#f4eee2";

const HOB = cute("hob", {
  k: 1.42,
  neck: 204,
  torso: "M76 152 Q100 140 124 152 Q140 168 138 196 Q134 226 100 226 Q66 226 62 196 Q60 168 76 152 Z",
  w: { upper: 15, fore: 14, thigh: 20, shin: 19, hand: 10.5, cloth: 1.3 },
  j: { shoulderL: [80, 214], elbowL: [72, 228], wristL: [68, 241], shoulderR: [120, 214], elbowR: [128, 228], wristR: [132, 241], hipL: [88, 256], kneeL: [87, 265], hipR: [112, 256], kneeR: [113, 265], footL: [86, 273], footR: [114, 273] },
});

/** The star on his nose: ten soft pink rays round a button, drawn small and round. */
function StarNose({ x, y }: { x: number; y: number }) {
  const rays = Array.from({ length: 10 }, (_, i) => (i / 10) * 360 + 18);
  const at = (a: number, r: number) => [x + r * Math.cos((a * Math.PI) / 180), y + r * Math.sin((a * Math.PI) / 180)] as const;
  return (
    <g>
      {rays.map((a) => {
        const [px, py] = at(a, 6.6);
        return <ellipse key={a} cx={px + 0.6} cy={py + 0.6} rx={4.6} ry={2.8} transform={`rotate(${a} ${px + 0.6} ${py + 0.6})`} fill={PINK_SHADE} />;
      })}
      {rays.map((a) => {
        const [px, py] = at(a, 6.6);
        return <ellipse key={a} cx={px} cy={py} rx={4.4} ry={2.5} transform={`rotate(${a} ${px} ${py})`} fill={PINK} />;
      })}
      <circle cx={x} cy={y} r={4.6} fill={PINK_SHADE} />
      <circle cx={x - 1.4} cy={y - 1.4} r={1.4} fill="#ffd0dc" />
    </g>
  );
}

function HobHead() {
  return (
    <g>
      <Two d={blob(100, 108, 46, 44, 1.08)} fill={HOB_FUR} shade={HOB_SHADE} k={2.4} />
      {/* an old man's tuft, three white wisps, the right one won't lie down */}
      <path d="M92 66 C88 56 92 50 98 52 M100 64 C100 52 106 48 110 54 M108 66 C114 58 122 60 124 52" {...line(HOB_WHITE, 3.2)} />
      {/* a lighter face, so his features read on dark fur */}
      <path d={blob(100, 122, 36, 26, 1.02)} fill={HOB_FACE} />
      {/* his spectacles' lenses, under the eyes */}
      <circle cx={81} cy={114} r={13} fill={EYE_WHITE} opacity={0.45} />
      <circle cx={119} cy={114} r={13} fill={EYE_WHITE} opacity={0.45} />
    </g>
  );
}

/** Over the eyes: the frames, the nose, and the star. */
function HobTop() {
  return (
    <g>
      <g {...line(C.accent, 3.2)}>
        <circle cx={81} cy={114} r={13} />
        <circle cx={119} cy={114} r={13} />
        <path d="M94 112 Q100 108 106 112" />
      </g>
      <StarNose x={100} y={134} />
    </g>
  );
}

const hobEyes = eyesOf({
  rx: 6.4,
  ry: 7.4,
  fill: INK,
  pupil: { r: 0 },
  shine: 2.4,
  lid: HOB_FACE,
  closed: INK,
  browY: 16,
  /** Fluffy white brows that stick out past his frames. */
  brow: ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return (
      <g transform={turnAt(s, tilt, x, by)}>
        <path
          d={`M${x - 11} ${by + 2.4} Q${x - 8} ${by - 4.6} ${x - 1} ${by - 3.4} Q${x + 6} ${by - 6} ${x + 11} ${by} Q${x + 4} ${by + 1} ${x - 2} ${by + 2.6} Q${x - 7} ${by + 4} ${x - 11} ${by + 2.4} Z`}
          fill={HOB_WHITE}
        />
        <path d={`M${x + s * 10} ${by - 1} l${s * 4} -2.6`} {...line(HOB_WHITE, 2.4)} />
      </g>
    );
  },
  rest: { k: [0.92, 1.04], top: 0.12, raise: 1 },
});

/** Hob: a small mouth under the star, with two old front teeth. */
const hobMouth: MouthKit = ({ mood, y, viseme }) => {
  if (viseme) return talk(viseme, mood, y, { W: 8, H: 7, inside: MOUTH_IN, lip: PINK_SHADE, lipW: 2.4, teeth: EYE_WHITE });
  const buck = (dy = 0) => (
    <g fill={EYE_WHITE}>
      <rect x={97} y={y + dy - 0.4} width={2.8} height={3.6} rx={0.9} />
      <rect x={100.4} y={y + dy - 0.4} width={2.8} height={3.6} rx={0.9} />
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y, 7, 5)} fill={MOUTH_IN} tongue={[100, y + 7, 3.4, 2.2]} />, buck());
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 1, 9, 8)} fill={MOUTH_IN} tongue={[100, y + 10, 4.4, 2.8]} />, buck(-1));
    case "curious":
      return <ellipse cx={101} cy={y + 2} rx={2.4} ry={3} fill={MOUTH_IN} />;
    case "thinking":
      return <path d={`M95 ${y + 2} Q100 ${y + 1} 106 ${y - 1}`} {...line(PINK_SHADE, 2.4)} />;
    case "focused":
      return <path d={`M96 ${y + 1} L104 ${y + 1}`} {...line(PINK_SHADE, 2.6)} />;
    case "worried":
      return <path d={wave(y + 2, 6, 2.4)} {...line(PINK_SHADE, 2.4)} />;
    case "oops":
      return g2(<OpenMouth d={dMouth(y + 1, 5, 3.6, 101)} fill={MOUTH_IN} />, buck(1));
    case "wink":
      return g2(<path d={`M94 ${y} Q100 ${y + 5} 107 ${y - 2}`} {...line(PINK_SHADE, 2.4)} />, buck(1.4));
    default:
      return g2(<path d={`M95 ${y} Q97.5 ${y + 3} 100 ${y} Q102.5 ${y + 3} 105 ${y}`} {...line(PINK_SHADE, 2.2)} />, buck(1.6));
  }
};

/* ——— Tavi, a girl of about ten: the loudest member. Triangles, softened ——— */

const TAVI_SKIN = "#d39a6c";
const TAVI_SHADE = "#b77d50";
const TAVI_HAIR = "#a8401f";
const TAVI_HAIR_SHADE = "#80301a";
const TAVI_HAIR_HI = "#d06a3f";
const TAVI_LIP = "#94463a";

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
  blush: "#f08a86",
});

const TAVI = cute("tavi", {
  k: 1.5,
  torso: "M84 150 Q100 146 116 150 Q124 156 123 172 L121 210 Q120 222 100 222 Q80 222 79 210 L77 172 Q76 156 84 150 Z",
  w: { upper: 12.5, fore: 11.5, thigh: 13, shin: 12, hand: 7.8, cloth: 1.05 },
  headVB: "8 26 176 176",
});

/** Her hair: a big soft mass, blown back to the left in rounded points as if she has just arrived
 *  at a run. */
const TAVI_MASS =
  "M146 108 C152 70 130 46 100 44 C80 44 64 52 54 64 C42 58 28 60 16 70 C30 74 38 80 42 86 C28 90 18 102 14 116 C28 110 40 110 48 114 C40 124 38 136 42 148 C50 138 58 136 64 136 L136 136 C146 128 148 118 146 108 Z";

function TaviBack() {
  return (
    <g>
      <Two d={TAVI_MASS} fill={TAVI_HAIR} shade={TAVI_HAIR_SHADE} k={2.4} />
      <path d="M116 54 C96 50 74 56 58 68 M88 62 C70 66 56 76 44 90" {...line(TAVI_HAIR_HI, 3)} opacity={0.7} />
    </g>
  );
}

/** Her cowlick acts: it springs up when she is pleased, hooks into a question when she is
 *  curious, and droops when she is worried. */
const TAVI_COWLICK: Partial<Record<Mood, string>> = {
  happy: "M104 58 C100 40 110 30 120 34",
  delighted: "M104 58 C98 36 106 22 118 24",
  curious: "M104 58 C100 40 116 32 120 42 C122 48 114 50 112 46",
  worried: "M104 58 C110 50 122 52 126 60",
  oops: "M104 58 C112 52 124 56 126 64",
  thinking: "M104 58 C104 44 112 38 118 42",
};

function TaviHead({ mood }: Ctx) {
  return (
    <g>
      <circle cx={145} cy={120} r={8} fill={TAVI_SHADE} />
      <circle cx={144} cy={119} r={7} fill={TAVI_SKIN} />
      <Two d={blob(100, 112, 42, 40, 1.06)} fill={TAVI_SKIN} shade={TAVI_SHADE} k={2.2} />
      {/* the fringe's shadow, then the fringe: a swoop to the left with a parting on the right */}
      <path d="M56 108 C52 70 76 56 102 56 C130 56 150 74 144 104 C138 92 128 84 116 82 C112 92 96 98 78 98 C84 92 86 88 86 84 C74 90 64 98 56 108 Z" fill={TAVI_HAIR} />
      <path d="M76 70 Q94 62 112 64" {...line(TAVI_HAIR_HI, 3.4)} />
      <path d={TAVI_COWLICK[mood ?? "neutral"] ?? "M104 58 C102 42 110 34 120 38"} {...line(TAVI_HAIR, 5)} />
      {/* a star clip in her hair, and a plaster on her cheek: she arrives at speed */}
      <path d="M128 72 l2.2 4.6 l5 0.7 l-3.6 3.5 l0.9 5 l-4.5 -2.4 l-4.5 2.4 l0.9 -5 l-3.6 -3.5 l5 -0.7 Z" fill={C.accent} />
      <g transform="rotate(-24 128 132)">
        <rect x={120} y={129} width={16} height={6} rx={3} fill="#f6dcbc" />
        <circle cx={126} cy={132} r={0.8} fill="#d9b48c" />
        <circle cx={130} cy={132} r={0.8} fill="#d9b48c" />
      </g>
    </g>
  );
}

const taviEyes = eyesOf({
  rx: 9.4,
  ry: 11,
  fill: EYE_WHITE,
  iris: { r: 7.6, color: "#8a4b1e" },
  pupil: { r: 3.6 },
  shine: 2.8,
  lid: TAVI_SKIN,
  rim: { color: INK, w: 3, lashes: 2 },
  closed: INK,
  browY: 17,
  brow: arcBrow(TAVI_HAIR, 4.6, 7),
  rest: { look: [1.2, 0], raise: 2, browTilt: -4 },
});

/** Tavi: a big grin with one front tooth missing. */
const taviMouth: MouthKit = ({ mood, y, viseme }) => {
  if (viseme) return talk(viseme, mood, y, { W: 9, H: 8, inside: MOUTH_IN, lip: TAVI_LIP, lipW: 2.8, teeth: EYE_WHITE, gap: true });
  const grin = (w: number, h: number, cx = 101) => (
    <g>
      <OpenMouth d={dMouth(y - 1, w, h, cx)} fill={MOUTH_IN} tongue={[cx, y + h * 1.25, w * 0.5, h * 0.4]} />
      <rect x={cx - w * 0.62} y={y - 1.4} width={w * 0.5} height={3.6} rx={1} fill={EYE_WHITE} />
      <rect x={cx + w * 0.16} y={y - 1.4} width={w * 0.46} height={3.6} rx={1} fill={EYE_WHITE} />
    </g>
  );
  switch (mood) {
    case "happy":
      return grin(9, 6.4);
    case "delighted":
      return grin(11, 9);
    case "curious":
      return <ellipse cx={102} cy={y + 2} rx={3} ry={3.8} fill={MOUTH_IN} />;
    case "thinking":
      /* pulled to one side */
      return <path d={`M98 ${y + 2} Q103 ${y + 3} 108 ${y - 1}`} {...line(TAVI_LIP, 2.8)} />;
    case "focused":
      /* the tip of her tongue at the corner */
      return g2(<path d={`M94 ${y + 1} L106 ${y}`} {...line(TAVI_LIP, 2.8)} />, <ellipse cx={105} cy={y + 2.6} rx={2.6} ry={2.2} fill={TONGUE_PINK} />);
    case "worried":
      return <path d={`M94 ${y + 3} Q97 ${y} 100 ${y + 2} Q103 ${y + 4} 106 ${y + 1}`} {...line(TAVI_LIP, 2.8)} />;
    case "oops":
      return <OpenMouth d={`M93 ${y + 4} Q100 ${y - 3} 107 ${y + 4} Q100 ${y + 2} 93 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "wink":
      return grin(8, 5.6, 103);
    default:
      return grin(7.4, 4, 102);
  }
};

/* ——— Grit, a small gargoyle: three hundred years on one corner of the dome. A rounded square ——— */

const STONE = mix(C.mid, "#9a948c", 52);
const STONE_SHADE = mix(C.deep, "#6f6a63", 42);
const STONE_LIGHT = mix(C.soft, "#c9c3ba", 50);

const GRIT = cute("grit", {
  k: 1.46,
  neck: 204,
  torso: "M78 154 Q100 146 122 154 Q132 164 131 192 Q129 224 100 224 Q71 224 69 192 Q68 164 78 154 Z",
  w: { upper: 15, fore: 14, thigh: 19, shin: 18, hand: 9.6, cloth: 1.25 },
  j: { earL: [58, 104], earR: [142, 104], kneeL: [87, 265], kneeR: [113, 265], footL: [86, 273], footR: [114, 273] },
});

const GRIT_HEAD = "M58 92 C58 72 72 64 100 64 C128 64 142 72 142 92 L144 124 C144 144 128 152 100 152 C72 152 56 144 56 124 Z";

function GritHead() {
  return (
    <g>
      {/* stubby round horns; the left one chipped flat */}
      <path d="M72 76 C64 64 64 50 70 42 C78 46 86 58 88 70 Z" fill={STONE_SHADE} />
      <path d="M71 73 C65 63 65 54 68 48 L76 50 C80 56 84 62 86 69 Z" fill={STONE} />
      <path d="M68 48 L76 50" {...line(STONE_SHADE, 2)} />
      <path d="M128 76 C136 62 140 48 134 38 C124 44 116 58 112 70 Z" fill={STONE_SHADE} />
      <path d="M129 73 C135 62 138 50 134 42 C126 48 119 60 115 69 Z" fill={STONE} />
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, GRIT.j)}>
          <path d={`M${mirror(s, 60)} 96 Q${mirror(s, 40)} 90 ${mirror(s, 34)} 96 Q${mirror(s, 44)} 108 ${mirror(s, 60)} 116 Z`} fill={STONE_SHADE} />
          <path d={`M${mirror(s, 60)} 99 Q${mirror(s, 44)} 94 ${mirror(s, 39)} 98 Q${mirror(s, 47)} 106 ${mirror(s, 60)} 112 Z`} fill={STONE} />
        </g>
      ))}
      <Two d={GRIT_HEAD} fill={STONE} shade={STONE_SHADE} k={2.6} />
      {/* a worn, paler snout and chin, two spots of lichen, a hairline crack */}
      <path d={blob(100, 132, 28, 18, 1.02)} fill={STONE_LIGHT} />
      <circle cx={130} cy={78} r={3.4} fill={C.accent} opacity={0.8} />
      <circle cx={135} cy={84} r={2} fill={C.accent} opacity={0.8} />
      <path d="M62 120 L67 124 L64 129" {...line(STONE_SHADE, 1.6)} />
      <path d="M93 124 Q100 118 107 124 Q105 129 100 129 Q95 129 93 124 Z" fill={STONE_SHADE} />
      <circle cx={97} cy={125} r={1.3} fill={MOUTH_IN} />
      <circle cx={103} cy={125} r={1.3} fill={MOUTH_IN} />
    </g>
  );
}

function GritBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", GRIT.j)}>
        <Taper
          segs={[
            [
              [114, 254],
              [136, 266],
              [158, 260],
              [160, 236],
            ],
          ]}
          w0={11}
          w1={6}
          fill={STONE_SHADE}
        />
        <path d="M160 238 Q150 232 152 224 Q158 220 160 212 Q162 220 168 224 Q170 232 160 238 Z" fill={STONE_SHADE} />
      </g>
    </g>
  );
}

const gritEyes = eyesOf({
  rx: 9.6,
  ry: 10.4,
  fill: EYE_WHITE,
  pupil: { r: 5.2 },
  shine: 2.2,
  lid: STONE,
  closed: INK,
  browY: 14,
  /** A stone ledge for a brow: thick, square-ended, low. */
  brow: ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return (
      <path
        d={`M${x - 11} ${by + 2} Q${x} ${by - 4} ${x + 11} ${by + 2} L${x + 11} ${by + 6} Q${x} ${by + 1} ${x - 11} ${by + 6} Z`}
        fill={STONE_SHADE}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  },
  /* grumpy at rest: lids low, ledges down at the middle */
  rest: { top: 0.3, tilt: -6, raise: -1, browTilt: -14 },
});

/** Grit: a jutting underbite with one tusk standing up from it on the left; talking, the jaw drops
 *  on its hinge and the tusk goes with it. */
const gritMouth: MouthKit = ({ mood, y, viseme }) => {
  const jaw = (drop: number, smile = 0, wide = 1) => {
    const w = 13 * wide;
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
        <path d={`M${100 - w} ${top + drop - 1} Q100 ${top + drop + 6 + smile} ${100 + w} ${top + drop - 1}`} {...line(STONE_SHADE, 3.6)} />
        <path d={`M${100 - w * 0.55} ${top + drop + 1.2} l1.4 -6 l2.6 5.6`} fill={EYE_WHITE} />
        <path d={`M${100 + w * 0.5} ${top + drop + 1.6} l-1 -3 l-1.6 3`} fill={EYE_WHITE} />
      </g>
    );
  };
  if (viseme) {
    const sh = SHAPE[viseme];
    return jaw(sh.h * 9, SMILE[mood] ?? 0, sh.round ? 0.7 : sh.w);
  }
  switch (mood) {
    case "happy":
      return jaw(4, 4);
    case "delighted":
      return jaw(9, 5);
    case "curious":
      return jaw(3.4, 0, 0.6);
    case "thinking":
      return jaw(0, -1, 0.85);
    case "focused":
      return jaw(0, -2, 0.8);
    case "worried":
      return jaw(2, -3, 0.8);
    case "oops":
      return jaw(5, -2, 0.9);
    case "wink":
      return jaw(2.6, 3);
    default:
      return jaw(0, -2);
  }
};

/* ——— Lyra, a lyrebird: the performer. An S-curve ——— */

const LYRA_BODY = C.primary;
const LYRA_SHADE = C.deep;
const LYRA_MASK = C.soft;

const LYRA = cute("lyra", {
  k: 1.4,
  neck: 206,
  torso: "M80 150 Q100 140 120 150 Q134 164 132 192 Q128 224 100 224 Q72 224 68 192 Q66 164 80 150 Z",
  w: { upper: 14, fore: 13, thigh: 6, shin: 5.4, hand: 8, cloth: 1 },
  j: { hipL: [94, 258], kneeL: [93, 266], footL: [92, 273], hipR: [106, 258], kneeR: [107, 266], footR: [108, 273] },
  headVB: "14 30 172 172",
});

/** One lyre feather: up from the rump in a wide curve, past its head, curling out at the top.
 *  Banded, as a lyrebird's are. Figure space. */
function Lyrate({ s }: { s: number }) {
  const m = (x: number) => mirror(s, x);
  const segs: Cubic[] = [
    [
      [m(104), 250],
      [m(150), 244],
      [m(166), 176],
      [m(150), 118],
    ],
    [
      [m(150), 118],
      [m(140), 80],
      [m(156), 44],
      [m(180), 50],
    ],
  ];
  return (
    <g>
      <Taper segs={segs} w0={15} w1={10} fill={LYRA_SHADE} />
      <g transform={`translate(${-1.6 * s} -1.4)`}>
        <Taper segs={segs} w0={12} w1={8} fill={C.accent} />
      </g>
      {[0.3, 0.52, 0.74, 0.94].map((t) => {
        const [x, y] = bez(segs[0], t);
        return <ellipse key={`a${t}`} cx={x} cy={y} rx={5} ry={2.2} transform={`rotate(${-60 * s} ${x} ${y})`} fill={LYRA_SHADE} />;
      })}
      {[0.2, 0.46].map((t) => {
        const [x, y] = bez(segs[1], t);
        return <ellipse key={`b${t}`} cx={x} cy={y} rx={4.4} ry={2} transform={`rotate(${-80 * s} ${x} ${y})`} fill={LYRA_SHADE} />;
      })}
      <circle cx={m(180)} cy={50} r={6.4} fill={C.accent} />
    </g>
  );
}

function LyraBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", LYRA.j)}>
        {/* the filmy plumes between the lyre feathers: a soft fan */}
        {[-34, -18, -4, 10, 24, 38].map((a, i) => (
          <ellipse
            key={a}
            cx={100 + a * 0.9}
            cy={150}
            rx={9}
            ry={70}
            transform={`rotate(${a * 0.55} 100 250)`}
            fill={i % 2 ? C.soft : C.hi}
            opacity={0.85}
          />
        ))}
        <Lyrate s={1} />
        <Lyrate s={-1} />
      </g>
    </g>
  );
}

function LyraHead() {
  return (
    <g>
      {/* one curl of a crest */}
      <path d="M100 70 C96 54 104 40 118 42 C128 44 128 56 120 58 C114 60 112 54 116 52" {...line(LYRA_SHADE, 6)} />
      <circle cx={116} cy={52} r={3.6} fill={C.accent} />
      <Two d={blob(100, 110, 42, 42, 1.08)} fill={LYRA_BODY} shade={LYRA_SHADE} k={2.2} />
      {/* the pale mask round its eyes: stage make-up */}
      <path d="M100 124 C92 132 66 132 62 116 C60 102 74 96 84 100 C92 102 96 106 100 108 C104 106 108 102 116 100 C126 96 140 102 138 116 C134 132 108 132 100 124 Z" fill={LYRA_MASK} />
    </g>
  );
}

const lyraEyes = eyesOf({
  rx: 8.8,
  ry: 10.2,
  fill: INK,
  iris: { r: 6.2, color: mix(C.primary, INK, 45) },
  pupil: { r: 3.4 },
  shine: 2.8,
  lid: C.mid,
  rim: { color: INK, w: 2.6, lashes: 3 },
  closed: INK,
  browY: 17,
  brow: arcBrow(LYRA_SHADE, 3, 6.4),
  /* a little pleased with itself: lids half down, brows up */
  rest: { top: 0.28, tilt: 4, raise: 4, browTilt: 4 },
});

/** Lyra: a small yellow beak. It speaks by opening it: the lower half drops on its hinge. */
const lyraMouth: MouthKit = ({ mood, y, viseme }) => {
  const beak = (open: number, tilt = 0) => (
    <g transform={`rotate(${tilt} 100 ${y - 4})`}>
      {open > 0.3 && <path d={`M94 ${y - 3} L106 ${y - 3} L100 ${y + 3 + open} Z`} fill={MOUTH_IN} />}
      <path d={`M94 ${y - 3} Q100 ${y + 1 + open} 106 ${y - 3} Q100 ${y + 5 + open} 94 ${y - 3} Z`} fill={C.accentDeep} transform={`translate(0 ${open * 0.5})`} />
      <path d={`M92 ${y - 5} Q100 ${y - 10} 108 ${y - 5} Q104 ${y + 1} 100 ${y + 3} Q96 ${y + 1} 92 ${y - 5} Z`} fill={C.accent} />
    </g>
  );
  if (viseme) return beak(SHAPE[viseme].h * 6.4);
  switch (mood) {
    case "happy":
      return beak(3);
    case "delighted":
      return beak(6);
    case "curious":
    case "oops":
      return beak(2.6);
    case "thinking":
      return beak(0, 8);
    case "worried":
      return beak(1.4, -4);
    case "wink":
      return beak(2, 6);
    default:
      return beak(0);
  }
};

/* ——— Nox, a cat: owns the roof. A circle: a loaf ——— */

const NOX_FUR = mix(C.deep, "#34323d", 55);
const NOX_SHADE = mix(C.deep, "#1e1c26", 40);
const NOX_WHITE = C.tint;
const NOX_BROW = mix(C.hi, "white", 40);

const NOX = cute("nox", {
  k: 1.42,
  neck: 206,
  torso: "M74 152 Q100 140 126 152 Q144 168 142 198 Q138 228 100 228 Q62 228 58 198 Q56 168 74 152 Z",
  w: { upper: 14, fore: 13, thigh: 17, shin: 16, hand: 8.8, cloth: 1.2 },
  j: { tail: [118, 256], earL: [72, 80], earR: [128, 80], hipL: [86, 256], kneeL: [85, 265], footL: [84, 273], hipR: [114, 256], kneeR: [115, 265], footR: [116, 273] },
});

function NoxHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, NOX.j)}>
          {/* small ears with soft tips; the left one notched */}
          <path
            d={
              s === -1
                ? "M60 94 L58 78 L64 76 L58 72 Q58 60 68 58 Q80 64 90 78 Z"
                : `M${mirror(s, 60)} 94 Q${mirror(s, 56)} 62 ${mirror(s, 68)} 58 Q${mirror(s, 80)} 64 ${mirror(s, 90)} 78 Z`
            }
            fill={NOX_FUR}
          />
          <path d={`M${mirror(s, 65)} 86 Q${mirror(s, 64)} 70 ${mirror(s, 69)} 67 Q${mirror(s, 76)} 70 ${mirror(s, 82)} 78 Z`} fill={PINK} opacity={0.75} />
        </g>
      ))}
      {/* cheek fluff, then the head */}
      <path d="M58 122 L46 126 L56 132 L50 138 L64 136 Z M142 122 L154 126 L144 132 L150 138 L136 136 Z" fill={NOX_FUR} />
      <Two d={blob(100, 112, 46, 40, 1.08)} fill={NOX_FUR} shade={NOX_SHADE} k={2.2} />
      {/* the white muzzle: two puffs and a chin */}
      <ellipse cx={92} cy={134} rx={10} ry={8} fill={NOX_WHITE} />
      <ellipse cx={108} cy={134} rx={10} ry={8} fill={NOX_WHITE} />
      <ellipse cx={100} cy={140} rx={8} ry={6} fill={NOX_WHITE} />
      <path d="M96 127 L104 127 L100 131 Z" fill={PINK} />
      <g {...line(NOX_BROW, 1.4)} opacity={0.9}>
        <path d="M84 134 L64 130 M84 138 L66 140 M116 134 L136 130 M116 138 L134 140" />
      </g>
    </g>
  );
}

function NoxBelly() {
  return <path d="M90 154 Q100 160 110 154 Q116 182 108 206 Q100 212 92 206 Q84 182 90 154 Z" fill={NOX_WHITE} />;
}

function NoxBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", NOX.j)}>
        {/* a long tail that curls up into a question mark */}
        <Taper
          segs={[
            [
              [120, 262],
              [156, 276],
              [178, 248],
              [168, 214],
            ],
            [
              [168, 214],
              [162, 192],
              [140, 192],
              [146, 208],
            ],
          ]}
          w0={13}
          w1={10}
          fill={NOX_FUR}
        />
        <circle cx={146} cy={208} r={5.4} fill={NOX_WHITE} />
      </g>
    </g>
  );
}

const noxEyes = eyesOf({
  rx: 10.6,
  ry: 10.6,
  fill: mix(C.accent, "white", 70),
  iris: { r: 8.4, color: mix(C.accent, "white", 30) },
  pupil: { r: 4.6, slit: true },
  shine: 2.4,
  lid: NOX_FUR,
  closed: NOX_WHITE,
  browY: 16,
  brow: dashBrow(NOX_BROW, 3, 4.6),
  /* unimpressed: lids heavy, brows flat */
  rest: { top: 0.46, bottom: 0.06, raise: -1 },
});

/** Nox: a cat's “ω” under its nose; talking, it opens beneath, with two small fangs. */
const noxMouth: MouthKit = ({ mood, y, viseme }) => {
  const omega = (dy = 0) => <path d={`M93 ${y + dy} Q96.5 ${y + 3.6 + dy} 100 ${y + dy} Q103.5 ${y + 3.6 + dy} 107 ${y + dy}`} {...line(NOX_SHADE, 2.2)} />;
  const open = (h: number, w = 5.4) => (
    <g>
      <OpenMouth d={`M${100 - w} ${y + 1} Q100 ${y + 3} ${100 + w} ${y + 1} Q${100 + w * 0.8} ${y + 2 + h} 100 ${y + 3 + h} Q${100 - w * 0.8} ${y + 2 + h} ${100 - w} ${y + 1} Z`} fill={MOUTH_IN} tongue={[100, y + 2 + h, w * 0.5, Math.max(1.4, h * 0.35)]} />
      <path d={`M${100 - w * 0.6} ${y + 1.4} l1 2.8 l1.2 -2.8 M${100 + w * 0.6} ${y + 1.4} l-1 2.8 l-1.2 -2.8`} fill={EYE_WHITE} />
      {omega()}
    </g>
  );
  if (viseme) {
    const sh = SHAPE[viseme];
    return sh.h === 0 ? omega(sh.pressed ? -0.4 : 0) : open(sh.h * 7, sh.round ? 3.6 : 5.4 * sh.w);
  }
  switch (mood) {
    case "happy":
      return open(2.6);
    case "delighted":
      return open(6, 6.4);
    case "curious":
      return open(2.2, 3.4);
    case "worried":
      return <path d={wave(y + 3, 6, 2.2)} {...line(NOX_SHADE, 2.2)} />;
    case "oops":
      return open(3.6, 4.6);
    default:
      return omega();
  }
};

/* ——— Pim, a fennec fox kit: the newest member. Triangles: two great ears ——— */

const PIM_FUR = mix(C.accent, "#e9d3b0", 55);
const PIM_SHADE = mix(C.accentDeep, "#c4a27a", 45);
const PIM_INNER = "#f7c4c0";

const PIM = cute("pim", {
  k: 1.36,
  neck: 206,
  torso: "M84 152 Q100 146 116 152 Q124 160 123 178 L121 208 Q120 222 100 222 Q80 222 79 208 L77 178 Q76 160 84 152 Z",
  w: { upper: 12, fore: 11, thigh: 14, shin: 13, hand: 7.6, cloth: 1 },
  j: { tail: [108, 252], earL: [82, 88], earR: [118, 88] },
  headVB: "4 4 192 192",
});

/** How the ears turn with the mood: out and flat when it is shy or startled, up when it is
 *  delighted. [left, right] in degrees. */
const PIM_EARS: Partial<Record<Mood, [number, number]>> = {
  worried: [-38, 38],
  oops: [-46, 46],
  thinking: [-4, 16],
  curious: [8, -14],
  delighted: [10, -10],
  happy: [4, -4],
};

function PimHead({ mood }: Ctx) {
  const [l, r] = (mood && PIM_EARS[mood]) ?? [-6, 2];
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, PIM.j)}>
          <g transform={`rotate(${s === -1 ? l : r} ${mirror(s, 82)} 88)`}>
            {/* ears bigger than its head: two soft dishes */}
            <path d={`M${mirror(s, 72)} 104 C${mirror(s, 50)} 90 ${mirror(s, 30)} 58 ${mirror(s, 28)} 22 C${mirror(s, 60)} 26 ${mirror(s, 88)} 50 ${mirror(s, 100)} 82 Z`} fill={PIM_SHADE} />
            <path d={`M${mirror(s, 73)} 101 C${mirror(s, 52)} 88 ${mirror(s, 33)} 58 ${mirror(s, 31)} 25 C${mirror(s, 61)} 29 ${mirror(s, 86)} 52 ${mirror(s, 97)} 81 Z`} fill={PIM_FUR} />
            <path d={`M${mirror(s, 77)} 92 C${mirror(s, 60)} 80 ${mirror(s, 44)} 58 ${mirror(s, 40)} 38 C${mirror(s, 62)} 42 ${mirror(s, 80)} 58 ${mirror(s, 89)} 78 Z`} fill={PIM_INNER} />
            <path d={`M${mirror(s, 80)} 84 C${mirror(s, 68)} 74 ${mirror(s, 56)} 62 ${mirror(s, 48)} 50`} {...line(FACE, 2.6)} opacity={0.9} />
          </g>
        </g>
      ))}
      {/* fox cheeks that come to soft points */}
      <path d="M62 126 L52 132 L64 138 Z M138 126 L148 132 L136 138 Z" fill={PIM_FUR} />
      <Two d={blob(100, 118, 38, 34, 1.1)} fill={PIM_FUR} shade={PIM_SHADE} k={2} />
      {/* the cream face, and a fennec's dark tear lines */}
      <path d="M64 124 C70 110 88 108 100 116 C112 108 130 110 136 124 C134 142 118 152 100 152 C82 152 66 142 64 124 Z" fill={FACE} />
      <path d="M86 124 Q85 130 88 135 M114 124 Q115 130 112 135" {...line(PIM_SHADE, 1.8)} />
      <ellipse cx={100} cy={134} rx={4.2} ry={3} fill={INK} />
      <circle cx={98.8} cy={133} r={0.9} fill={EYE_WHITE} />
    </g>
  );
}

function PimBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", PIM.j)}>
        <Taper
          segs={[
            [
              [108, 256],
              [130, 266],
              [148, 254],
              [150, 228],
            ],
          ]}
          w0={14}
          w1={22}
          fill={PIM_FUR}
        />
        <circle cx={150} cy={224} r={11} fill={mix(C.accentDeep, "#5b4636", 40)} />
      </g>
    </g>
  );
}

function PimBelly() {
  return <ellipse cx={100} cy={188} rx={14} ry={24} fill={FACE} />;
}

const pimEyes = eyesOf({
  rx: 9,
  ry: 10.6,
  fill: INK,
  pupil: { r: 0 },
  shine: 3.4,
  lid: FACE,
  closed: INK,
  browY: 16,
  brow: dashBrow(PIM_SHADE, 2.8, 4),
  /* shy: looking down and away, brows up at the middle */
  rest: { look: [-1.8, 1.6], raise: 2, browTilt: 12 },
});

/** Pim: a small mouth under the black nose; a little tongue shows when it laughs. */
const pimMouth: MouthKit = ({ mood, y, viseme }) => {
  const c = PIM_SHADE;
  if (viseme) return talk(viseme, mood, y, { W: 6.6, H: 6, inside: MOUTH_IN, lip: c, lipW: 2.2 });
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 5.4, 4.6)} fill={MOUTH_IN} tongue={[100, y + 6, 3, 2]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 7, 6.4)} fill={MOUTH_IN} tongue={[100, y + 8, 4, 2.6]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.2} ry={2.8} fill={MOUTH_IN} />;
    case "thinking":
      return <path d={`M96 ${y + 2} Q100 ${y + 1} 104 ${y - 0.6}`} {...line(c, 2.2)} />;
    case "focused":
      return <path d={`M97 ${y + 1} L103 ${y + 1}`} {...line(c, 2.2)} />;
    case "worried":
      return <path d={wave(y + 2, 4.6, 1.8)} {...line(c, 2.2)} />;
    case "oops":
      return <ellipse cx={100} cy={y + 2.4} rx={3} ry={2.4} fill={MOUTH_IN} />;
    case "wink":
      return <path d={`M95 ${y} Q100 ${y + 4.4} 105 ${y - 1}`} {...line(c, 2.2)} />;
    default:
      return <path d={`M96 ${y + 0.6} Q98 ${y + 2.6} 100 ${y + 0.6} Q102 ${y + 2.6} 104 ${y + 0.6}`} {...line(c, 2)} />;
  }
};

/* ——— The club ——— */

const CLUB_ALL: Candidate[] = [
  {
    id: "obs-hob",
    kind: "animal",
    frame: HOB,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -5, hands: { L: [94, 196], R: [136, 150], outL: false, outR: true } },
    label: "Hob",
    signature: "A round velvet mole in big gold spectacles, with a pink star for a nose — he burrows",
    pitch:
      "The keeper, and a circle: round head, round body, round spectacles. He built the observatory with his own paws and has rebuilt the dome's hinge a hundred times. Wants everyone to see what he sees; can barely see a thing without his spectacles, which are so thick his eyes look enormous through them. Fussy, proud, the softest touch on the hill. At rest one spade paw is up to make a point, head tipped. Species-true: the star of pink rays on his nose, big pink digging paws, velvet fur; an old man's tuft and fluffy white brows that stick out past his frames. His ability is Burrow: he dives into the ground and pops up anywhere else.",
    risk: "A grown-up the club pushes against, never a scold: on an incorrect answer he is gentle. The spectacles must stay part of him (they are his silhouette), not a prop that comes off.",
    pal: pal(HOB_FUR, PINK, { skin: HOB_FUR, skinShade: HOB_SHADE, blush: "#ff9fb5" }),
    body: HOB_FUR,
    face: face({ eyeY: 114, eyeGap: 19, mouthY: 146, lid: HOB_FACE, kit: hobEyes, mouthKit: hobMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    head: () => <HobHead />,
    top: () => <HobTop />,
    belly: () => <ellipse cx={100} cy={194} rx={22} ry={24} fill={HOB_BELLY} />,
  },
  {
    id: "obs-tavi",
    kind: "human",
    frame: TAVI,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: 7, hands: { L: [76, 202], R: [126, 200], outL: true, outR: true } },
    label: "Tavi",
    signature: "A girl with a big swoosh of auburn hair blown back, a cowlick and a gap-toothed grin — she zooms",
    pitch:
      "The club's loudest member, about ten, and all triangles, softened: hair swept back in points, a cowlick, elbows out. She means to discover a comet and name it after herself, and has named three already; none was a comet. Wants to be first to everything; rushes, is wrong often and out loud, and laughs first — the one who makes a wrong answer safe. At rest her hands are on her hips, head tipped, grinning. Her imperfections: one front tooth missing, a plaster on her cheek, a cowlick that won't lie down and acts with her (up when she is pleased, a hook when she is curious, a droop when she is worried), a star clip, a jumper too big for her. Her ability is Zoom: she runs so fast she blurs, and arrives in a skid.",
    risk: "Speed kept small: a blur and a skid, never a celebration that grows. Being wrong is funny because she laughs first, never because anyone laughs at her.",
    pal: palTavi,
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 18, mouthY: 137, nose: "dot", lid: TAVI_SKIN, kit: taviEyes, mouthKit: taviMouth }),
    outfit: "hoodie",
    outfits: PERSON_OUTFITS,
    headBack: () => <TaviBack />,
    head: (c) => <TaviHead {...c} />,
  },
  {
    id: "obs-grit",
    kind: "animal",
    frame: GRIT,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -4, hands: { L: [110, 192], R: [90, 194], outL: false, outR: false } },
    label: "Grit",
    signature: "A small rounded-square stone gargoyle with stubby horns, one chipped, and one tusk — it turns to stone",
    pitch:
      "Carved last and smallest, a rounded square: it has sat on the same corner of the dome for three hundred years and comes alive at night. Wants to see the town below; too scared to leave its corner. A grumpy face and the sweetest heart: under its stone ledges of brows are big round eyes. At rest it sits with its arms folded and its brows down. Species-true: stubby horns (the left one chipped flat), small pointed ears, an underbite with one tusk standing up on the left, a spade-tipped tail, worn stone with spots of lichen and a hairline crack. No wings, so it never reads as Wisp. Its ability is Turn to stone: when it is startled or embarrassed it freezes solid mid-pose, then cracks back out.",
    risk: "Grumpy-looking, never frightening: a six-year-old should want to pick it up. Alive, it is drawn in the scheme's colour; only its ability turns it grey.",
    pal: pal(STONE, STONE, { skin: STONE, skinShade: STONE_SHADE, limb: STONE, paw: STONE_SHADE, blush: "#ec9ea4" }),
    body: STONE,
    face: face({ eyeY: 110, eyeGap: 20, mouthY: 137, lid: STONE, kit: gritEyes, mouthKit: gritMouth }),
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
    attitude: { mood: "neutral", tilt: 9, hands: { L: [94, 180], R: [150, 124], outL: false, outR: true } },
    label: "Lyra",
    signature: "A round little lyrebird with a curl of a crest and a lyre of a tail taller than itself — it can do any voice",
    pitch:
      "The performer, named after the constellation, and an S-curve: a curl on top, a body like an egg, and the two great curves of its tail. Does a show every night whether anyone asked or not. Wants applause; can do anyone's voice but has never found its own — what it really wants is to be liked as itself. At rest, chin up, lids half down, one wing flung out mid-flourish: pleased with itself. Species-true: two banded lyre feathers that curl out at the top with soft plumes fanned between them; a pale mask round its eyes like stage make-up, three long lashes, a small yellow beak. Its ability is Mimic: any voice or sound — another character's, the dome creaking, a camera shutter.",
    risk: "It only mimics fixed lines, never anything generated, and never mocks: mimicry is affection. The tail must not crowd a surface that carries material.",
    pal: pal(LYRA_BODY, LYRA_BODY, { skin: LYRA_BODY, skinShade: LYRA_SHADE, limb: LYRA_BODY, paw: LYRA_BODY, shoe: C.accentDeep, blush: "#ffa3c4" }),
    body: LYRA_BODY,
    face: face({ eyeY: 114, eyeGap: 18, mouthY: 132, lid: C.mid, kit: lyraEyes, mouthKit: lyraMouth }),
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
    attitude: { mood: "neutral", tilt: -6, hands: { L: [94, 206], R: [106, 206], outL: false, outR: false } },
    label: "Nox",
    signature: "A round charcoal loaf of a cat with a white bib, heavy lids and a question-mark tail — it pours",
    pitch:
      "Lives on the dome's roof; was there before the club and acts as if it still owns the place. A circle: a loaf with a round head on it. Wants company and would rather die than say so. Deadpan and unimpressed — Lyra's one audience it can't win. At rest it sits like a loaf, paws together, lids heavy, head on one side. Species-true: a white muzzle in two puffs, a bib and socks, whiskers, cheek fluff, small soft-tipped ears (the left one notched), a long tail curled into a question mark with a white tip, slit pupils that open to discs when it is secretly delighted. Its ability is Pour: it goes liquid and pours itself into anything — a teacup, the telescope tube, a gap under a door.",
    risk: "Unimpressed, never unkind: its deadpan is a joke the learner is in on. Its ears are small and soft so it never reads as Pim.",
    pal: pal(NOX_FUR, NOX_WHITE, { skin: NOX_FUR, skinShade: NOX_SHADE, limb: NOX_FUR, paw: NOX_WHITE, blush: "#ff9fb5" }),
    body: NOX_FUR,
    face: face({ eyeY: 116, eyeGap: 21, mouthY: 136, lid: NOX_FUR, kit: noxEyes, mouthKit: noxMouth }),
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
    attitude: { mood: "neutral", tilt: 10, hands: { L: [97, 190], R: [104, 182], outL: false, outR: false } },
    label: "Pim",
    signature: "A tiny fennec fox kit under two enormous ears, with big shiny eyes — it hears anything",
    pitch:
      "The newest member, new to the hill this term — new to everything, like the learner — and the smallest of the club, all ears: two great triangles over a small round face. Wants to belong; so shy it hides behind its own ears. At rest it looks down and away, head on one side, one paw holding the other. Species-true: ears bigger than its head with pale fur inside, pointed fox cheeks, a cream face with a fennec's dark tear lines, a black nose, a bushy tail with a dark tip. Its ability is Radar ears: they swivel to hear anything, anywhere, like the observatory's dishes, and flatten when it is shy.",
    risk: "Shy, never sad: its stake is belonging, and it is always found, never left out. Ears must stay huge and pointed so it never reads as Nox.",
    pal: pal(PIM_FUR, PIM_FUR, { skin: PIM_FUR, skinShade: PIM_SHADE, limb: PIM_FUR, paw: PIM_SHADE, blush: "#ffa3b5" }),
    body: PIM_FUR,
    face: face({ eyeY: 122, eyeGap: 17, mouthY: 140, lid: FACE, kit: pimEyes, mouthKit: pimMouth }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <PimBehind />,
    belly: () => <PimBelly />,
    head: (c) => <PimHead {...c} />,
  },
];

/** Shown in the studio: Hob and Tavi are being refined first; the other four are drawn but parked
 *  until those two are agreed (`CLUB_ALL`). */
export const OBSERVATORY: Candidate[] = CLUB_ALL.filter((c) => c.id === "obs-hob" || c.id === "obs-tavi");
export const OBSERVATORY_PARKED: Candidate[] = CLUB_ALL.filter((c) => !OBSERVATORY.includes(c));
