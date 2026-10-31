import type { P } from "./skeleton";

/**
 * What a mitten hand is doing (2026-10-03, added in the product for the session companion): a hand
 * that only ever reads as a soft oval cannot give a thumbs-up, point at the key, or rest a fist under
 * a chin. A grip changes the hand's shape; `turn` is the arm's total rotation at that moment
 * (shoulder plus elbow, CSS degrees), so a thumb can be drawn pointing up the screen whatever angle
 * the forearm is at. Absent, the hand is the character's own mitten. `finger` is an index finger
 * held up the screen the same way — tapping a chin. `pinch` is finger over thumb, both pointing out
 * from the body and held a hair apart — "this close". Every grip carries a thin darker edge, so a hand
 * still reads where it crosses its own face.
 *
 * 2026-10-04: `clasp` is a resting hand folded over the other, its four fingers lying across toward
 * the body's centre. `pencil` holds a pencil tip-up and tipped a little outward, as for marking in
 * the air; `pencilPoint` holds it along the forearm, pointing. The pencil is drawn under the fist.
 *
 * 2026-10-31: `cup` holds a teacup upright on the hand, whatever angle the forearm is at — Nell's,
 * from her tea stall. The cup sits on the hand, its foot behind the fingers. `chalk` holds a short
 * stick of chalk tip-up, like `pencil` — Otto's.
 */
export type GripShape = "mitt" | "fist" | "thumb" | "point" | "palm" | "finger" | "pinch" | "clasp" | "pencil" | "pencilPoint" | "cup" | "chalk";
export type Grip = { shape: GripShape; turn?: number };
export type Grips = Partial<Record<"L" | "R", Grip>>;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** A rounded digit: a capsule from `a` along `angle` (degrees, screen space), `len` long. */
function Digit({ a, angle, len, w, color }: { a: P; angle: number; len: number; w: number; color: string }) {
  const b: P = [a[0] + Math.cos(rad(angle)) * len, a[1] + Math.sin(rad(angle)) * len];
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeLinecap="round" />;
}

const WOOD = "#f1d3a0";
const LEAD = "#3a3340";
const BARREL = "#e9b730";
const BARREL_EDGE = "#b98a12";
const CHINA = "#fffaf2";
const CHINA_EDGE = "#c9b79a";
const CHINA_BAND = "#e48a7a";
const TEA = "#a9643a";

/** A short stick of chalk from `a` along `angle`, a little worn at its tip. */
function Chalk({ a, angle, len, w }: { a: P; angle: number; len: number; w: number }) {
  const b: P = [a[0] + Math.cos(rad(angle)) * len, a[1] + Math.sin(rad(angle)) * len];
  return (
    <g strokeLinecap="round">
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={CHINA_EDGE} strokeWidth={w + 1.2} />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={CHINA} strokeWidth={w} />
    </g>
  );
}

/** A teacup standing upright at `a` (the bottom of its bowl), `w` across, turned `rot` degrees so it
 *  stays upright on screen whatever the hand's frame is. */
function Teacup({ a, w, rot }: { a: P; w: number; rot: number }) {
  const h = w * 0.62;
  const bowl = `M${-w / 2} ${-h} L${w / 2} ${-h} Q${w * 0.46} 0 0 0 Q${-w * 0.46} 0 ${-w / 2} ${-h} Z`;
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${rot})`}>
      {/* the handle, on the side away from the body for a right hand */}
      <ellipse cx={w * 0.52} cy={-h * 0.55} rx={w * 0.2} ry={h * 0.28} fill="none" stroke={CHINA_EDGE} strokeWidth={w * 0.13} />
      <path d={bowl} fill={CHINA_EDGE} transform={`translate(0.6 0.6)`} />
      <path d={bowl} fill={CHINA} />
      <path d={`M${-w * 0.47} ${-h * 0.62} L${w * 0.47} ${-h * 0.62}`} stroke={CHINA_BAND} strokeWidth={w * 0.1} />
      <ellipse cx={0} cy={-h} rx={w / 2} ry={h * 0.16} fill={CHINA_EDGE} />
      <ellipse cx={0} cy={-h + h * 0.02} rx={w * 0.42} ry={h * 0.11} fill={TEA} />
    </g>
  );
}

/** A pencil from `a` along `angle`, the tip at the far end. */
function Pencil({ a, angle, len, w }: { a: P; angle: number; len: number; w: number }) {
  const u: P = [Math.cos(rad(angle)), Math.sin(rad(angle))];
  const at = (k: number): P => [a[0] + u[0] * k, a[1] + u[1] * k];
  const n: P = [-u[1] * (w / 2), u[0] * (w / 2)];
  const cone = len * 0.78;
  const tip = at(len);
  const b = at(cone);
  return (
    <g>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={BARREL_EDGE} strokeWidth={w + 1.2} strokeLinecap="butt" />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={BARREL} strokeWidth={w} strokeLinecap="butt" />
      <path d={`M${b[0] + n[0]} ${b[1] + n[1]} L${tip[0]} ${tip[1]} L${b[0] - n[0]} ${b[1] - n[1]} Z`} fill={WOOD} />
      <path
        d={`M${tip[0]} ${tip[1]} L${at(len * 0.92)[0] + n[0] * 0.32} ${at(len * 0.92)[1] + n[1] * 0.32} L${at(len * 0.92)[0] - n[0] * 0.32} ${at(len * 0.92)[1] - n[1] * 0.32} Z`}
        fill={LEAD}
      />
    </g>
  );
}

/**
 * One hand in a grip, drawn in the forearm's rest frame (`el` → `wr`) at `at`, radius `r`. `side`
 * is which hand, so a thumb sits on the side toward the body.
 */
export function GripHand({
  grip,
  el,
  wr,
  at,
  r,
  color,
  crease,
  side,
}: {
  grip: Grip;
  el: P;
  wr: P;
  at: P;
  r: number;
  color: string;
  crease: string;
  side: "L" | "R";
}) {
  const fore = deg(Math.atan2(wr[1] - el[1], wr[0] - el[0]));
  /* screen-up in the hand's own frame: undo the arm's rotation */
  const up = -90 - (grip.turn ?? 0);
  /* toward the body's centre line, across the forearm */
  const inward = fore + (side === "L" ? -90 : 90);
  const along = (k: number): P => [at[0] + Math.cos(rad(fore)) * k, at[1] + Math.sin(rad(fore)) * k];
  const upFrom = (k: number): P => [at[0] + Math.cos(rad(up)) * k, at[1] + Math.sin(rad(up)) * k];
  /* toward the body's centre in screen space, a touch downward, in the hand's own frame */
  const across = (side === "R" ? 186 : -6) - (grip.turn ?? 0);

  /** The hand's silhouette in one colour, grown by `g` — drawn once dark and wider as its edge,
   *  then in skin over it. */
  const shape = (fill: string, g: number) => {
    const fist = <ellipse cx={at[0]} cy={at[1]} rx={r * 1.08 + g} ry={r * 0.96 + g} transform={`rotate(${fore} ${at[0]} ${at[1]})`} fill={fill} />;
    switch (grip.shape) {
      case "mitt": {
        /* the relaxed mitten, its thumb on the side toward the body */
        const t: P = [at[0] + Math.cos(rad(inward)) * r * 0.85 - Math.cos(rad(fore)) * r * 0.35, at[1] + Math.sin(rad(inward)) * r * 0.85 - Math.sin(rad(fore)) * r * 0.35];
        return (
          <g>
            <circle cx={t[0]} cy={t[1]} r={r * 0.5 + g} fill={fill} />
            <ellipse cx={at[0]} cy={at[1]} rx={r * 1.18 + g} ry={r * 0.98 + g} transform={`rotate(${fore} ${at[0]} ${at[1]})`} fill={fill} />
          </g>
        );
      }
      case "fist":
      case "pencil":
      case "pencilPoint":
      case "cup":
      case "chalk":
        return fist;
      case "clasp":
        /* folded over the other hand: four fingers stacked up the screen, lying across toward the
           body's centre and a touch downward, whatever angle the forearm is at */
        return (
          <g>
            {fist}
            {[-0.48, -0.16, 0.16, 0.48].map((k) => (
              <Digit key={k} a={upFrom(r * k)} angle={across} len={r * 0.95} w={r * 0.48 + 2 * g} color={fill} />
            ))}
          </g>
        );
      case "thumb":
        return (
          <g>
            {fist}
            <Digit a={upFrom(r * 0.5)} angle={up} len={r * 1.15} w={r * 0.78 + 2 * g} color={fill} />
          </g>
        );
      case "finger":
        return (
          <g>
            {fist}
            <Digit a={upFrom(r * 0.45)} angle={up} len={r * 1.35} w={r * 0.56 + 2 * g} color={fill} />
          </g>
        );
      case "pinch": {
        /* out from the body, in screen space, then into the hand's frame */
        const out = (side === "R" ? 0 : 180) - (grip.turn ?? 0);
        const off = (k: number): P => upFrom(k);
        return (
          <g>
            {fist}
            <Digit a={off(r * 0.62)} angle={out} len={r * 1.6} w={r * 0.5 + 2 * g} color={fill} />
            <Digit a={off(-r * 0.32)} angle={out} len={r * 1.3} w={r * 0.56 + 2 * g} color={fill} />
          </g>
        );
      }
      case "point":
        return (
          <g>
            {fist}
            <Digit a={along(r * 0.55)} angle={fore} len={r * 1.35} w={r * 0.62 + 2 * g} color={fill} />
          </g>
        );
      case "palm": {
        /* an open hand facing out: a wide palm, four short fingers fanned, the thumb out to the side */
        const palm = along(r * 0.1);
        return (
          <g>
            {[-24, -8, 8, 24].map((a, i) => (
              <Digit key={a} a={along(r * 0.5)} angle={fore + a} len={r * (i === 0 || i === 3 ? 0.95 : 1.15)} w={r * 0.5 + 2 * g} color={fill} />
            ))}
            <Digit a={palm} angle={inward - 10 * (side === "L" ? -1 : 1)} len={r * 1.05} w={r * 0.56 + 2 * g} color={fill} />
            <ellipse cx={palm[0]} cy={palm[1]} rx={r * 1.05 + g} ry={r + g} transform={`rotate(${fore} ${palm[0]} ${palm[1]})`} fill={fill} />
          </g>
        );
      }
    }
  };

  /* curled fingers: two creases across the front of a closed hand; a clasp shows the gaps between
     its fingers instead */
  const creases =
    grip.shape === "palm" || grip.shape === "mitt"
      ? null
      : grip.shape === "clasp"
        ? [-0.32, 0, 0.32].map((k) => {
            const a = upFrom(r * k);
            const o = rad(across);
            const b: P = [a[0] + Math.cos(o) * r * 1.25, a[1] + Math.sin(o) * r * 1.25];
            const m: P = [a[0] + Math.cos(o) * r * 0.45, a[1] + Math.sin(o) * r * 0.45];
            return <path key={k} d={`M${m[0]} ${m[1]} L${b[0]} ${b[1]}`} stroke={crease} strokeWidth={1.1} strokeLinecap="round" opacity={0.55} />;
          })
        : [-0.32, 0.18].map((k) => {
          const c = along(r * 0.35);
          const o = rad(inward);
          const x = c[0] + Math.cos(o) * r * k * 1.6;
          const y = c[1] + Math.sin(o) * r * k * 1.6;
          const dx = Math.cos(rad(fore)) * r * 0.42;
          const dy = Math.sin(rad(fore)) * r * 0.42;
          return <path key={k} d={`M${x - dx} ${y - dy} L${x + dx} ${y + dy}`} stroke={crease} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />;
        });

  /* a held pencil sits under the fist: tip-up and a little outward, or along the forearm */
  const pencil =
    grip.shape === "pencil" ? (
      <Pencil a={upFrom(-r * 0.2)} angle={up + (side === "R" ? 22 : -22)} len={r * 3.1} w={r * 0.46} />
    ) : grip.shape === "pencilPoint" ? (
      <Pencil a={along(-r * 0.1)} angle={fore} len={r * 3.1} w={r * 0.46} />
    ) : grip.shape === "chalk" ? (
      <Chalk a={upFrom(-r * 0.1)} angle={up + (side === "R" ? 18 : -18)} len={r * 2.2} w={r * 0.62} />
    ) : grip.shape === "cup" ? (
      <Teacup a={upFrom(r * 0.55)} w={r * 2.9} rot={up + 90} />
    ) : null;

  return (
    <g>
      {pencil}
      {shape(crease, 1.1)}
      {shape(color, 0)}
      {creases}
    </g>
  );
}
