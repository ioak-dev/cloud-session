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
 * The side characters' kit: what every side character is drawn with, to
 * `docs/character-guidelines.md`. The cute frame (two heads tall, nub limbs), soft head shapes,
 * two-tone parts, the eye builder (one acting table, each character's own drawing), brows, the
 * talking mouth, and a mouth builder for every mood.
 *
 * Every side character is drawn in the product's scheme (the `C` tokens, and mixes of them with a
 * neutral; a person's skin and hair are their own), with no outlines: parts are told apart by
 * colour and tone, each main part in two tones (its own shade beneath, offset down and right).
 * None glows, flies or leaves a trail: that is Wisp's.
 */

/* ——— Shared ——— */

export const FACE = "#fff4e8";
export const INK = "#231c33";
export const MOUTH_IN = "#3a1d2c";
export const PINK = "#f29ab0";
export const PINK_SHADE = "#d9718f";

/** Chunky limbs: rounder reads softer at small sizes. */
const CHUNKY = { upper: 13.5, fore: 12.5, thigh: 15, shin: 14, hand: 8.6, cloth: 1.15 };

export const ANIMAL_OUTFITS: Candidate["outfits"] = ["bare", "dungarees", "hoodie", "raincoat", "winter", "party"];
export const PERSON_OUTFITS: Candidate["outfits"] = ["hoodie", "dungarees", "raincoat", "dress", "winter", "party"];

export const mix = (a: string, b: string, k: number) => `color-mix(in oklab, ${a} ${k}%, ${b})`;

export const pal = (body: string, paw: string, over: Partial<Palette> = {}): Palette =>
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

export const face = (over: Partial<Candidate["face"]> & { lid: string }): Candidate["face"] => ({
  eyes: "bead",
  eyeY: 104,
  eyeGap: 18,
  mouthY: 128,
  nose: "none",
  brows: false,
  ...over,
});

export const g2 = (...a: ReactNode[]) => createElement("g", null, ...a);
export const sides = [
  ["L", -1],
  ["R", 1],
] as const;
export const mirror = (s: number, x: number) => 100 + (x - 100) * s;

export type Cubic = readonly [P, P, P, P];

export function bez([a, b, c, d]: Cubic, t: number): P {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}

/** One filled shape along cubics, narrowing from `w0` to `w1`, with round ends. */
export function Taper({ segs, w0, w1, fill }: { segs: Cubic[]; w0: number; w1: number; fill: string }) {
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
export function Two({ d, fill, shade, k = 2 }: { d: string; fill: string; shade: string; k?: number }) {
  return (
    <g>
      <path d={d} fill={shade} />
      <path d={d} fill={fill} transform={`translate(${-k} ${-k * 0.8})`} />
    </g>
  );
}

export const dMouth = (y: number, w: number, h: number, cx = 100) =>
  `M${cx - w} ${y} Q${cx} ${y + h * 1.6} ${cx + w} ${y} Q${cx} ${y + h * 0.15} ${cx - w} ${y} Z`;
export const curve = (y: number, w: number, d: number, cx = 100) => `M${cx - w} ${y} Q${cx} ${y + d} ${cx + w} ${y}`;
export const wave = (y: number, w: number, a: number, cx = 100) =>
  `M${cx - w} ${y} Q${cx - w / 2} ${y - a} ${cx} ${y} Q${cx + w / 2} ${y + a} ${cx + w} ${y}`;

/** How far a mood lifts the corners of a talking mouth: a happy line is said smiling. */
export const SMILE: Partial<Record<Mood, number>> = { happy: 3, delighted: 4, wink: 2, curious: 1, worried: -2.5, oops: -1.5, focused: -0.5 };

/**
 * A talking mouth with lips: `W` its widest half-width and `H` its most open depth, drawn in the
 * kit's own colours. `teeth` is the top row's colour; `gap` leaves a tooth out.
 */
export function talk(
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
export const UNFIT = "translate(100 148) scale(0.8475 1.1111) translate(-100 -196)";

export function cute(
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
export const blob = (cx: number, cy: number, rx: number, ry: number, jowl = 1.04) =>
  `M${cx - rx} ${cy} C${cx - rx} ${cy - ry * 0.78} ${cx - rx * 0.56} ${cy - ry} ${cx} ${cy - ry} C${cx + rx * 0.56} ${cy - ry} ${cx + rx} ${cy - ry * 0.78} ${cx + rx} ${cy} C${cx + rx * jowl} ${cy + ry * 0.62} ${cx + rx * 0.62} ${cy + ry} ${cx} ${cy + ry} C${cx - rx * 0.62} ${cy + ry} ${cx - rx * jowl} ${cy + ry * 0.62} ${cx - rx} ${cy} Z`;

/* ——— Eyes: one acting table, each character's own drawing ———
 * What an eye does in each mood is the same idea for everyone (§5): happy closes into an arc,
 * delight adds a sparkle, curiosity widens one eye, thinking looks up and away, focus lowers the
 * lids, worry lifts the brows' inner ends and shrinks the pupils, a fright squeezes them shut, a
 * wink closes one. How an eye, its pupil, its shine and its brow are drawn is each character's own. */

export type Brow = (a: { x: number; y: number; s: -1 | 1; raise: number; tilt: number }) => ReactNode;

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

/**
 * Lashes at the outer corner: tapered flicks that fan out from the end of the lash line, each a
 * little shorter than the last. When the lid is down they sit on the lid's edge, turned with it.
 */
function Lashes({ x, y, s, rx, ry, top, tilt, n, color, w }: { x: number; y: number; s: -1 | 1; rx: number; ry: number; top: number; tilt: number; n: number; color: string; w: number }) {
  if (n === 0) return null;
  const lid = top >= 0.05;
  const y0 = lid ? y - ry + 2 * ry * top : y - ry * 0.12;
  const bx = x + s * (lid ? rx * 0.98 : rx + 0.2);
  return (
    <g transform={lid ? `rotate(${s * tilt} ${x} ${y0})` : undefined}>
      {Array.from({ length: n }, (_, i) => {
        const a = ((-28 - i * 26) * Math.PI) / 180;
        const len = 4.6 - i * 0.7;
        const sx = bx - s * i * 1.6;
        const sy = y0 - (lid ? 0 : i * 1.4);
        const ex = sx + s * Math.cos(a) * len;
        const ey = sy + Math.sin(a) * len;
        return (
          <path
            key={i}
            d={`M${sx} ${sy} Q${(sx + ex) / 2 + s * 0.6} ${(sy + ey) / 2 + 0.8} ${ex} ${ey}`}
            {...line(color, w * (0.78 - i * 0.12))}
          />
        );
      })}
    </g>
  );
}

export function eyesOf(st: EyeStyle): EyeKit {
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
          <Orb
            id={id}
            x={x}
            y={y}
            rx={rx}
            ry={ry}
            s={s}
            fill={st.fill}
            lid={{ top, bottom: o.bottom ?? 0, tilt: o.tilt ?? 0, color: st.lid }}
            edge={st.rim && top >= 0.05 ? { color: st.rim.color, width: st.rim.w * 0.6 } : undefined}
          >
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
            <path d={`M${x - rx - 0.4} ${y - ry * 0.12} A${rx + 0.4} ${ry + 0.4} 0 0 1 ${x + rx + 0.4} ${y - ry * 0.12}`} {...line(st.rim.color, st.rim.w)} />
          )}
          {st.rim && <Lashes x={x} y={y} s={s} rx={rx} ry={ry} top={top} tilt={o.tilt ?? 0} n={st.rim.lashes} color={st.rim.color} w={st.rim.w} />}
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
export const arcBrow =
  (color: string, w: number, len: number): Brow =>
  ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return <path d={`M${x - len} ${by + 1.6} Q${x} ${by - 2.6} ${x + len} ${by + 1.6}`} {...line(color, w)} transform={turnAt(s, tilt, x, by)} />;
  };

/** A short pill of a brow: a floating dash, for an animal. */
export const dashBrow =
  (color: string, w: number, len: number): Brow =>
  ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return <path d={`M${x - len} ${by} L${x + len} ${by}`} {...line(color, w)} transform={turnAt(s, tilt, x, by)} />;
  };

/** A mouth for every mood, in a character's own colours and quirks — teeth, a gap, a fang, buck
 *  teeth — and the talking shapes. */
export function mouthOf(o: { lip: string; W: number; H: number; teeth?: boolean; gap?: boolean; fang?: boolean; buck?: boolean; rest?: (y: number) => ReactNode }): MouthKit {
  return ({ mood, y, viseme }) => {
    if (viseme) return talk(viseme, mood, y, { W: o.W, H: o.H, inside: MOUTH_IN, lip: o.lip, lipW: 2.6, teeth: o.teeth || o.buck ? EYE_WHITE : undefined, gap: o.gap });
    const extra = (dy = 0) =>
      g2(
        o.fang && <path d={`M${104} ${y + dy - 0.6} l1.2 3.4 l1.6 -3.4 Z`} fill={EYE_WHITE} />,
        o.buck && (
          <g fill={EYE_WHITE}>
            <rect x={97} y={y + dy - 0.6} width={2.8} height={3.8} rx={0.8} />
            <rect x={100.2} y={y + dy - 0.6} width={2.8} height={3.8} rx={0.8} />
          </g>
        ),
      );
    const w = o.W;
    switch (mood) {
      case "happy":
        return g2(<OpenMouth d={dMouth(y, w * 0.95, w * 0.62)} fill={MOUTH_IN} teeth={o.teeth ? [100 - w * 0.7, y - 1.2, w * 1.4, 3.2] : undefined} tongue={[100, y + w * 0.85, w * 0.45, w * 0.28]} />, extra());
      case "delighted":
        return g2(<OpenMouth d={dMouth(y - 1, w * 1.2, w)} fill={MOUTH_IN} teeth={o.teeth ? [100 - w * 0.9, y - 2, w * 1.8, 3.6] : undefined} tongue={[100, y + w * 1.3, w * 0.55, w * 0.34]} />, extra(-1));
      case "curious":
        return <ellipse cx={101} cy={y + 2.2} rx={w * 0.3} ry={w * 0.38} fill={MOUTH_IN} />;
      case "thinking":
        return <path d={`M${100 - w * 0.6} ${y + 1.6} Q101 ${y + 2.6} ${100 + w * 0.8} ${y - 1.6}`} {...line(o.lip, 2.6)} />;
      case "focused":
        return <path d={`M${100 - w * 0.6} ${y + 1} L${100 + w * 0.6} ${y + 1}`} {...line(o.lip, 2.6)} />;
      case "worried":
        return <path d={wave(y + 2, w * 0.7, 2.4)} {...line(o.lip, 2.6)} />;
      case "oops":
        return <OpenMouth d={`M${100 - w * 0.75} ${y + 4} Q100 ${y - 3} ${100 + w * 0.75} ${y + 4} Q100 ${y + 2} ${100 - w * 0.75} ${y + 4} Z`} fill={MOUTH_IN} />;
      case "wink":
        return g2(<path d={`M${100 - w * 0.8} ${y} Q100 ${y + 5} ${100 + w * 0.9} ${y - 2}`} {...line(o.lip, 2.6)} />, <ellipse cx={104} cy={y + 3.6} rx={2.4} ry={2} fill={TONGUE_PINK} />);
      default:
        return o.rest ? o.rest(y) : g2(<path d={`M${100 - w * 0.7} ${y} Q100 ${y + 4.6} ${100 + w * 0.7} ${y}`} {...line(o.lip, 2.6)} />, extra(1.2));
    }
  };
}

export const person = (skin: string, shade: string, hair: string, hairHi: string, over: Partial<Palette> = {}): Palette =>
  palette(skin, skin, skin, shade, {
    line: "none",
    ink: INK,
    hair,
    hairHi,
    eye: INK,
    top: C.clothes,
    topAlt: "#fff3de",
    bottom: C.deep,
    shoe: C.deep,
    accent: C.accent,
    blush: "#ee8f8f",
    ...over,
  });

