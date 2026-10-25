/**
 * Noor, refined for the product (2026-10-03). The studio drawing (`lib/wisp/side-people.tsx`,
 * `people-noor`) stays vendored untouched so it re-syncs; this file lays the product's own layer
 * over it: a hijab with real fabric in it — an underscarf band, a wrap that crosses under the chin,
 * folds where it gathers, a brooch where it is fastened and a drape that falls to a point — and a
 * long-sleeved plum dress in place of the studio's cream, which disappeared on a light ground: gold
 * at the cuffs and along the hem, a bow at the hip and a pencil in a pocket. The sleeves, cuffs and
 * hem ride the rig's `wear` hook and `armLine` on the candidate.
 *
 * 2026-10-04 detailing: a resting smile that lifts on one side with a dimple (her quiet humour on her
 * face before she moves), brows in a deep brown rather than near-black, a pleat where the wrap turns
 * at each temple, the brooch on the wrap's crossing, a worn eraser on the pencil — which leaves its
 * pocket when a hand holds it — and her scene: the duckling she is too nice to shoo, and the marks
 * her pencil draws in the air (`NoorScene`).
 *
 * Colour on both grounds: the cast is drawn without outlines, so every edge that meets the canvas
 * is carried by the fill alone. Each such fill sits in the luminance middle band — dark enough to
 * hold against white, light enough to hold against the dark canvas — and `noor.test.ts` checks it.
 */
import type { CSSProperties, ReactNode } from "react";

import { EYE_WHITE, line } from "./rig/eyes";
import type { Grips } from "./rig/grip";
import type { OutfitParts } from "./rig/outfit";
import { J, type Body, type P } from "./rig/skeleton";
import type { Candidate } from "./candidates";
import { arcBrow, blob, eyesOf, INK, mouthOf, Two } from "./side-kit";

/** The rig's torso fit for this frame (`side-kit.tsx` `cute`): torso space into figure space. */
const TORSO_FIT = "translate(100 196) scale(1.18 0.9) translate(-100 -148)";
import { C } from "./theme";

const SKIN = "#c99068";
const SKIN_SHADE = "#ad7450";

/** The hijab: the product's blue hue at moderate chroma — a soft periwinkle, not the brand primary at
 *  full strength, so it reads as hers rather than as a uniform. Lighter than the dress, darker
 *  than her face, so the figure steps face → hijab → dress. Values are checked by `noor.test.ts`. */
export const HIJAB = "#738edc"; // oklch(0.66 0.12 268)
/** The back layer that falls to the shoulders, and her shoes. */
export const HIJAB_BACK = "#516ab4"; // oklch(0.54 0.12 268)
const HIJAB_FOLD = "#485fa2"; // oklch(0.50 0.11 268)
const HIJAB_LIT = "#bbcaef"; // oklch(0.84 0.055 268)
/** The underscarf: a narrow band of a deeper tone where the wrap meets the brow. */
const UNDERSCARF = "#3b4f8a"; // oklch(0.44 0.10 268)

/** Her dress: a deep plum, with a deeper tone for the cuffs, sash, hem band and stockings. */
export const DRESS = "#b3487e"; // oklch(0.56 0.15 352)
export const DRESS_DEEP = "#953c68"; // oklch(0.49 0.13 352)

/** Her brows: a deep warm brown, softer than the studio's near-black, so they frame the eyes
 *  rather than compete with them at the perch size. */
const BROW = "#5b3a2a";
const LIP = "#8a4438";

/** The duckling: ochre, so its edge holds 3:1 on both grounds (`noor.test.ts`), with the soft
 *  yellow of a duckling on its crown and breast inside that edge. */
export const DUCK = "#b8860b";
const DUCK_LIT = "#f0c64a";
const DUCK_WING = "#94690a";
const BEAK = "#e0702c";
/** What her pencil draws in the air: a warm gold stroke over a deep plum-ink edge, so the mark reads
 *  over her hijab, on the light ground (by its edge) and on the dark one (by its gold). */
export const MARK = "#f2bf3a";
export const MARK_EDGE = "#3b2a4f";

/** Gold, the scheme's accent: the brooch, the hem's embroidery and the cuffs' trim, so the one
 *  bright note runs from her chin to her hem. */
const GOLD = C.accent;
const PIN_SHINE = "#fff6d8";
/** The shadowed side of the sash's bow. */
const BOW_SHADE = "#7d3157";

function HijabBack() {
  return (
    <g>
      {/* the wrap's back falls past the jaw and spreads over the shoulders, a soft bell */}
      <path
        d="M100 56 C132 56 153 80 151 112 C150 134 146 150 140 162 Q122 172 100 172 Q78 172 60 162 C54 150 50 134 49 112 C47 80 68 56 100 56 Z"
        fill={HIJAB_BACK}
      />
    </g>
  );
}

/** Where the brooch is pinned, in head space: on the wrap's crossing under her chin, clear of her
 *  right shoulder. It is on the hijab, so the shoulder (under the hijab) is behind it and a hand
 *  raised in front of her chest passes over it. */
type Pt = [number, number];
const BROOCH: Pt = [106, 150];

/** A small five-petal flower, the pin that fastens the wrap. */
function Brooch({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => {
        const r = ((a - 90) * Math.PI) / 180;
        return <circle key={a} cx={2.6 * Math.cos(r)} cy={2.6 * Math.sin(r)} r={2.3} fill={GOLD} />;
      })}
      <circle r={1.6} fill={PIN_SHINE} />
    </g>
  );
}

function HijabFront() {
  return (
    <g>
      {/* the wrap round the face: symmetric, so neither side hangs lower than the other */}
      <path
        d="M100 58 C129 58 149 79 149 109 C149 129 143 144 133 153 Q100 160 67 153 C57 144 51 129 51 109 C51 79 71 58 100 58 Z"
        fill={HIJAB}
      />
      {/* the crown catches the light: a soft band across the top, left of centre */}
      <path d="M62 92 C66 70 84 60 104 60 C116 60 126 64 132 70 C118 66 104 66 92 70 C78 75 68 84 62 92 Z" fill={HIJAB_LIT} opacity={0.45} />
      {/* where the fabric gathers at each side of the face: soft shadow, not a line */}
      <path d="M58 100 C54 120 58 138 70 150 C64 136 62 118 64 100 Z" fill={HIJAB_FOLD} opacity={0.45} />
      <path d="M142 100 C146 120 142 138 130 150 C136 136 138 118 136 100 Z" fill={HIJAB_FOLD} opacity={0.45} />
      {/* a pleat where the wrap turns at each temple: a crisp fold with the light on its upper side */}
      <path d="M70 80 Q61 92 59 110" {...line(HIJAB_FOLD, 1.5)} opacity={0.7} />
      <path d="M72 82 Q64 93 62 106" {...line(HIJAB_LIT, 1)} opacity={0.45} />
      <path d="M130 80 Q139 92 141 110" {...line(HIJAB_FOLD, 1.5)} opacity={0.7} />
      <path d="M128 82 Q136 93 138 106" {...line(HIJAB_LIT, 1)} opacity={0.45} />
      {/* the face opening, a little shadow under the wrap's edge first */}
      <path d={blob(100, 119, 35, 34, 1.04)} fill={HIJAB_FOLD} opacity={0.55} />
      <Two d={blob(100, 118, 34, 33, 1.04)} fill={SKIN} shade={SKIN_SHADE} k={1.8} />
      {/* the underscarf: a thin band that sits on the opening's top edge, tapering to nothing */}
      <path d="M66 105 Q100 58 134 105 Q100 69 66 105 Z" fill={UNDERSCARF} />
      <path d="M72 98 Q100 64 128 98" {...line(HIJAB_LIT, 0.9)} opacity={0.35} />
      {/* the wrap crosses under her chin, the top layer sweeping up to her right */}
      <path d="M74 146 Q96 162 128 140 Q122 156 100 162 Q82 160 74 146 Z" fill={HIJAB} />
      <path d="M80 152 Q100 162 124 144 Q112 158 98 159 Q86 158 80 152 Z" fill={HIJAB_FOLD} opacity={0.5} />
      {/* pinned on the wrap's crossing, where a pin would hold it */}
      <Brooch x={BROOCH[0]} y={BROOCH[1]} />
    </g>
  );
}

/** The drape over her chest and shoulders, in torso space, over the dress's collar: it falls to a
 *  soft point a little off centre, the way a wrap's tail hangs. */
function Drape() {
  return (
    <g>
      <path d="M71 146 Q100 139 129 146 C131 165 119 182 105 192 Q100 196 95 191 C84 179 71 166 71 146 Z" fill={HIJAB} />
      {/* the fabric gathers toward the point */}
      <path d="M86 154 C90 168 94 180 99 190 C92 182 84 170 80 156 Z" fill={HIJAB_FOLD} opacity={0.4} />
      <path d="M116 154 C112 168 108 180 103 191 C110 182 118 170 122 156 Z" fill={HIJAB_FOLD} opacity={0.4} />
      <path d="M78 153 Q100 147 122 153" {...line(HIJAB_LIT, 1.4)} opacity={0.4} />
    </g>
  );
}

const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0],
  (1 - t) ** 2 * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1],
];

/* The hem band's two edges, as curves in hem space. */
const bandTop = (t: number) => quad([68.3, 233], [100, 239], [131.7, 233], t);
const bandBottom = (t: number) => quad([66, 240], [100, 247], [134, 240], t);
/** A point `k` of the way down the band (0 its top edge, 1 its bottom), `t` along it. */
const inBand = (t: number, k: number): Pt => {
  const a = bandTop(t);
  const b = bandBottom(t);
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
};

/** An eight-pointed star of the shared geometric tradition — tilework and textiles across the
 *  cultures her name belongs to, and no one nation's — its points between the tile-star's and a
 *  sparkle's, so it still reads as a star at the perch size. Her name means *light*. */
const STAR_INNER = 0.58;
const star = ([x, y]: Pt, r: number) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * i) / 8 - Math.PI / 2;
    const rr = i % 2 ? r * STAR_INNER : r;
    return `${(x + rr * Math.cos(a)).toFixed(2)},${(y + rr * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

/** The embroidery (2026-10-04, option A): seven stars along the middle of the band with a small
 *  gold dot between each pair — a string of little lights. */
const STAR_AT = (i: number) => 0.08 + (i * 0.84) / 6;
const STARS = Array.from({ length: 7 }, (_, i) => star(inBand(STAR_AT(i), 0.5), 2.3));
const DOTS = Array.from({ length: 6 }, (_, i) => inBand(STAR_AT(i) + 0.07, 0.5));

/** Her skirt, in hem space: the dress outfit's cut, with an embroidered band at the hem. */
function Skirt() {
  return (
    <g>
      <path d="M80 198 L120 198 L134 240 Q100 247 66 240 Z" fill={DRESS} />
      <path d="M68.3 233 Q100 239 131.7 233 L134 240 Q100 247 66 240 Z" fill={DRESS_DEEP} />
      <path d="M92 204 L88 230 M108 204 L112 230" {...line(DRESS_DEEP, 1.8)} opacity={0.6} />
      {STARS.map((points) => (
        <polygon key={points} points={points} fill={GOLD} />
      ))}
      {DOTS.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={0.6} fill={GOLD} />
      ))}
    </g>
  );
}

/** The sash tied low at her hip, in torso space: just below where her hands rest, so the bow
 *  shows whether her hands are together or open. */
function SashBow() {
  return (
    <g transform="translate(5 9)">
      <path d="M121 196 Q117 206 115 216 L119 215 Q121 206 123 197 Z" fill={BOW_SHADE} />
      <path d="M122 196 Q126 205 128 213 L124.5 213.5 Q123 205 120.5 197 Z" fill={DRESS_DEEP} />
      <path d="M121 196 Q112 188 111 194 Q111 200 121 196 Z" fill={DRESS_DEEP} />
      <path d="M121 196 Q130 188 131 194 Q131 200 121 196 Z" fill={BOW_SHADE} />
      <circle cx={121} cy={196} r={2.4} fill={DRESS_DEEP} />
      <circle cx={120.4} cy={195.4} r={0.9} fill={DRESS} />
    </g>
  );
}

/** Whether either hand is holding her pencil. */
const holdsPencil = (grip?: Grips) => Object.values(grip ?? {}).some((g) => g?.shape.startsWith("pencil"));

/** A pencil in a small pocket on her skirt — the one sign she teaches. Its eraser is worn at a slant;
 *  when a hand holds the pencil, the pocket is empty. */
function Pocket({ out }: { out: boolean }) {
  return (
    <g>
      {!out && (
        <g transform="translate(95 209) rotate(10)">
          <rect x={-1.7} y={-12} width={3.4} height={12} fill={GOLD} />
          <rect x={-1.7} y={-13.6} width={3.4} height={1.6} fill="#cfd3dc" />
          <path d="M-1.7 -13.6 L-1.7 -13.9" {...line("#a3a9b6", 0.5)} />
          <path d="M-1.7 -12.8 L1.7 -12.8" {...line("#a3a9b6", 0.45)} />
          {/* worn down on one side, from rubbing out */}
          <path d="M-1.7 -13.6 L-1.7 -15.2 Q-1.6 -16 -0.6 -15.8 L1.7 -14.9 L1.7 -13.6 Z" fill="#ee8f8f" />
        </g>
      )}
      <path d="M89 207 L102 207 L101 217 Q95.5 220 90 217 Z" fill={DRESS_DEEP} />
      <path d="M89 207 L102 207" {...line(BOW_SHADE, 1.2)} />
    </g>
  );
}

/* ——— Her face, refined ——— */

const noorEyes = eyesOf({
  rx: 8.4,
  ry: 9.4,
  fill: EYE_WHITE,
  iris: { r: 6.8, color: "#3a2416" },
  pupil: { r: 3.2 },
  shine: 2.6,
  lid: SKIN,
  rim: { color: INK, w: 3, lashes: 3 },
  closed: INK,
  browY: 15,
  brow: arcBrow(BROW, 3.2, 6.4),
  rest: { top: 0.12, raise: 2, browTilt: 2 },
});

/** At rest her smile lifts on one side — her right, the learner's left is level — with a dimple at
 *  the lifted corner: the knowing look of someone quietly amused. */
function restSmile(y: number): ReactNode {
  return (
    <g>
      <path d={`M93.4 ${y + 0.6} Q99 ${y + 4.6} 106.4 ${y - 1.2}`} {...line(LIP, 2.6)} />
      <path d={`M108.4 ${y - 2.6} Q109.6 ${y - 1} 108.6 ${y + 0.8}`} {...line(SKIN_SHADE, 1.3)} />
    </g>
  );
}

/* ——— Her scene: the duckling and the pencil's marks, in figure space ——— */

const at = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" });

/** A duckling standing at (x, 282), facing her (left) unless `away`. `asleep`: head tucked, eye shut.
 *  `fx-duck` moves it; `fx-duckHead` pecks and looks. */
function Duckling({ x, away = false, asleep = false }: { x: number; away?: boolean; asleep?: boolean }) {
  const hx = asleep ? 4 : -6;
  const hy = asleep ? -9 : -15;
  return (
    <g data-joint="fx-duck" style={at(x, 282)}>
      <g transform={`translate(${x} 282) scale(${away ? -1.3 : 1.3} 1.3)`}>
        {/* feet */}
        {!asleep && <path d="M-4 -1 l-3 1.4 h5 Z M2 -1 l-3 1.4 h5 Z" fill={BEAK} />}
        {/* tail tuft, body, breast and wing */}
        <path d="M8 -10 Q14 -14 13 -8 Q11 -6 8 -6 Z" fill={DUCK} />
        <ellipse cx={1} cy={asleep ? -5.5 : -7} rx={10} ry={asleep ? 5.6 : 6.6} fill={DUCK} />
        <ellipse cx={-3.6} cy={asleep ? -6 : -8.4} rx={4.6} ry={3.4} fill={DUCK_LIT} opacity={0.8} />
        <path d={asleep ? "M0 -8 Q6 -10 9 -5 Q4 -4 0 -6 Z" : "M0 -10 Q7 -12 10 -6 Q5 -5 0 -7 Z"} fill={DUCK_WING} />
        {/* the neck, in the duckling's own (translated) space */}
        <g data-joint="fx-duckHead" style={{ transformOrigin: "-2px -10px", transformBox: "view-box" }}>
          <circle cx={hx} cy={hy} r={5.6} fill={DUCK} />
          <circle cx={hx + 0.6} cy={hy - 1.8} r={3} fill={DUCK_LIT} opacity={0.8} />
          <path d={`M${hx - 5} ${hy + 0.4} q-3.6 0.6 -4 1.8 q2.6 0.6 4.4 -0.2 Z`} fill={BEAK} />
          {asleep ? (
            <path d={`M${hx - 3} ${hy - 0.6} q1.4 1.2 2.8 0`} {...line(INK, 1)} />
          ) : (
            <circle cx={hx - 2.2} cy={hy - 1} r={1.15} fill={INK} />
          )}
        </g>
      </g>
    </g>
  );
}

/** A tick drawn in the air: the short stroke, then the long one, each its own `fx-` element so it
 *  appears as the pencil passes. */
function AirTick() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <g data-joint="fx-tickA">
        <path d="M148 159 L156 171" stroke={MARK_EDGE} strokeWidth={5.6} />
        <path d="M148 159 L156 171" stroke={MARK} strokeWidth={3.2} />
      </g>
      <g data-joint="fx-tickB">
        <path d="M156 171 L171 145" stroke={MARK_EDGE} strokeWidth={5.6} />
        <path d="M156 171 L171 145" stroke={MARK} strokeWidth={3.2} />
      </g>
      <g data-joint="fx-tickSpark" fill={MARK} stroke={MARK_EDGE} strokeWidth={0.8}>
        <circle cx={176} cy={139} r={1.6} />
        <circle cx={167} cy={136} r={1.1} />
        <circle cx={179} cy={148} r={0.9} />
      </g>
    </g>
  );
}

/** A small ring drawn round "this bit", below the tick. */
function AirCircle() {
  return (
    <g data-joint="fx-ring" fill="none" strokeDasharray="44 6">
      <ellipse cx={160} cy={189} rx={9} ry={7.5} stroke={MARK_EDGE} strokeWidth={4.6} />
      <ellipse cx={160} cy={189} rx={9} ry={7.5} stroke={MARK} strokeWidth={2.4} />
    </g>
  );
}

export type NoorSceneId = "duck" | "duckAway" | "duckAsleep" | "tick" | "tickCircle";

/** Noor's scene for a reaction: what sits on the ground behind her and what is drawn in front. */
export function NoorScene({ ids, layer }: { ids: readonly NoorSceneId[]; layer: "under" | "over" }) {
  const has = (id: NoorSceneId) => ids.includes(id);
  if (layer === "under")
    return (
      <>
        {has("duck") && <Duckling x={168} />}
        {has("duckAway") && <Duckling x={46} away />}
        {has("duckAsleep") && <Duckling x={160} asleep />}
      </>
    );
  return (
    <>
      {(has("tick") || has("tickCircle")) && <AirTick />}
      {has("tickCircle") && <AirCircle />}
    </>
  );
}

/** Long sleeves to the wrist, a gold-trimmed cuff in the deeper tone, stockings under the skirt.
 *  The limbs are drawn in `DRESS_DEEP` (the palette's `limb`, edged in the same tone), so where the
 *  square-ended sleeve stops short of the hand, that strip is the cuff. */
function wear(o: OutfitParts): OutfitParts {
  return {
    ...o,
    hem: <Skirt />,
    upper: { from: 0, to: 1, w: 15, color: DRESS },
    fore: { from: 0, to: 0.42, w: 14.5, color: DRESS, cap: "butt", trim: { color: GOLD, len: 0.05 } },
    shin: null,
    shoe: HIJAB_BACK,
  };
}

/* ——— Her arms come out from under the hijab ———
 * The rig draws arms over everything, so a sleeve's rounded top sat on the hijab, as if the arm grew
 * out of the fabric. Over each shoulder, in a soft oval about the joint, the hijab is drawn again over
 * the upper arm (`overUpperArms`): the back's colour, then the drape and the wrap — on an opaque base,
 * so every translucent fold is drawn once over it and no seam shows. An upper arm, lowered or raised, comes out from under the fabric; the
 * forearms and hands are drawn after it, so a hand in front of her stays in front. */
const SHOULDER_OVAL = { rx: 12, ry: 9.5, dy: 1.5 };

function OverShoulders({ frame, uid, tilt }: { frame: Body; uid: string; tilt?: number }) {
  const id = `${uid}-shoulders`;
  return (
    <g>
      <clipPath id={id}>
        {(["L", "R"] as const).map((s) => {
          const [x, y] = frame.j[`shoulder${s}`];
          return <ellipse key={s} cx={x} cy={y + SHOULDER_OVAL.dy} rx={SHOULDER_OVAL.rx} ry={SHOULDER_OVAL.ry} />;
        })}
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={0} y={150} width={200} height={80} fill={HIJAB_BACK} />
        <g transform={TORSO_FIT}>
          <Drape />
        </g>
        {/* the wrap, on the head's own joint and fit, so it moves with her head as the real one does */}
        <g data-joint="head" style={{ transformOrigin: `${frame.j.head[0]}px ${frame.j.head[1]}px`, transformBox: "view-box" }}>
          <g transform={tilt ? `rotate(${tilt} ${frame.j.head[0]} ${frame.j.head[1]})` : undefined}>
            <g transform={frame.headFit}>
              <HijabFront />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/** A hand target on her body, as the chibi-space target the rig retargets (the same conversion
 *  `reactions.ts` makes): measured from the shoulder, scaled by her arm's length over the chibi's. */
function chibiTarget(f: Body, side: "L" | "R", t: P): P {
  const len = (j: Body["j"]) =>
    Math.hypot(j[`elbow${side}`][0] - j[`shoulder${side}`][0], j[`elbow${side}`][1] - j[`shoulder${side}`][1]) +
    Math.hypot(j[`wrist${side}`][0] - j[`elbow${side}`][0], j[`wrist${side}`][1] - j[`elbow${side}`][1]);
  const k = len(f.j) / len(J);
  const S = f.j[`shoulder${side}`];
  const S0 = J[`shoulder${side}`];
  return [S0[0] + (t[0] - S[0]) / k, S0[1] + (t[1] - S[1]) / k];
}

/** The studio's Noor with the product's layer laid over her. */
export function refineNoor(c: Candidate): Candidate {
  /* longer arms and bigger hands than the studio's teacher frame, so a hand can reach her face
     and a thumbs-up, a fist or a point reads at the size she is drawn */
  const frame: Body | undefined = c.frame && {
    ...c.frame,
    j: { ...c.frame.j, elbowL: [79, 218], wristL: [76, 240], elbowR: [121, 218], wristR: [124, 240] },
    w: { ...c.frame.w, upper: 12, fore: 11, hand: 9.4 },
    /* her elbows hang outward and down, so a hand held at shoulder height never flips its elbow up */
    elbows: "natural",
  };
  return {
    ...c,
    signature:
      "A teacher in her twenties in a soft periwinkle hijab, pinned under the chin with a small gold flower and draped over her shoulders, in a long-sleeved plum dress — calm, hands together; her thumbs-up is the best in the world",
    frame,
    /* hands together at her waist, the right folded over the left — on her longer arms the studio's
       resting targets left them apart */
    attitude: frame && {
      ...c.attitude,
      hands: { L: chibiTarget(frame, "L", [96, 226]), R: chibiTarget(frame, "R", [104, 226]) },
    },
    headBack: () => <HijabBack />,
    head: () => <HijabFront />,
    face: { ...c.face, kit: noorEyes, mouthKit: mouthOf({ lip: LIP, W: 7.4, H: 7, teeth: true, rest: restSmile }) },
    pal: { ...c.pal, topAlt: DRESS, accent: DRESS_DEEP, shoe: HIJAB_BACK, limb: DRESS_DEEP, hair: BROW },
    pendant: ({ grip }) => (
      <>
        <Pocket out={holdsPencil(grip)} />
        <SashBow />
        <Drape />
      </>
    ),
    armLine: DRESS_DEEP,
    wear,
    /* her upper arms come out from under the hijab over her shoulders */
    overUpperArms: ({ uid }) => frame && <OverShoulders frame={frame} uid={uid} tilt={c.attitude?.tilt} />,
  };
}
