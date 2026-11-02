/**
 * Tessy: four logo concepts for an educational app that helps students solve logical reasoning
 * puzzles. The name comes from tessellations, so every concept is built from a different real
 * tessellation, and each carries one small "puzzle" in it:
 *
 * 1. Pinwheel T: four T-tetrominoes tile a 4×4 square; the top one is the letter T.
 * 2. Missing piece: a honeycomb with one hexagon lifted out, about to click into its slot.
 * 3. Tess the tile: an Escher-style tile whose bump fits its neighbour's notch, with a face.
 * 4. Odd one out: a rhombille cube of twelve rhombi, one of them a different colour.
 *
 * Tessy is not Sparkles, so these do not follow the header's colour schemes: each concept has its
 * own fixed palette. Every mark is drawn on a 128 grid with two sizes: `full` (64px and up, on its
 * tile) and `small` (16–32px, simplified: wider gaps, fewer parts).
 */
import * as React from "react";

type Palette = {
  /** The tile, and the gaps between pieces (so the gaps read as the ground). */
  bg: string;
  /** Pieces, from the lead colour down. */
  a: string;
  b: string;
  c: string;
  d: string;
  /** Eyes and fine marks. */
  ink: string;
};

type MarkProps = { p: Palette; small?: boolean; tile?: boolean };

type Concept = {
  id: string;
  name: string;
  tiling: string;
  idea: string;
  puzzle: string;
  palette: Palette;
  font: { family: string; css: string; weight: number; tracking: string };
  Mark: (props: MarkProps) => React.ReactElement;
};

const TILE = "M28 0H100Q128 0 128 28V100Q128 128 100 128H28Q0 128 0 100V28Q0 0 28 0Z";

/** A one-colour palette: every piece in `fg`, gaps in the ground. */
function mono(fg: string, ground: string): Palette {
  return { bg: ground, a: fg, b: fg, c: fg, d: fg, ink: ground };
}

const pts = (list: [number, number][]) => list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/* ---------------------------------------------------------------- 1. Pinwheel T */

/** Four T-tetrominoes tile a 4×4 square as a pinwheel, in cell units. */
const PINWHEEL: [number, number][][] = [
  [[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [1, 2], [1, 1], [0, 1]], // the T, upright
  [[3, 0], [4, 0], [4, 3], [3, 3], [3, 2], [2, 2], [2, 1], [3, 1]],
  [[0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [1, 3], [1, 4], [0, 4]],
  [[2, 2], [3, 2], [3, 3], [4, 3], [4, 4], [1, 4], [1, 3], [2, 3]],
];

function PinwheelMark({ p, small, tile = true }: MarkProps) {
  const cell = small ? 24 : 21;
  const o = 64 - cell * 2;
  const fills = [p.a, p.b, p.c, p.d];
  return (
    <>
      {tile && <path d={TILE} fill={p.bg} />}
      {PINWHEEL.map((poly, i) => (
        <polygon
          key={i}
          points={pts(poly.map(([x, y]) => [o + x * cell, o + y * cell]))}
          fill={fills[i]}
          stroke={p.bg}
          strokeWidth={small ? 9 : 5}
          strokeLinejoin="round"
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- 2. Missing piece */

function hex(cx: number, cy: number, r: number, rot = 0) {
  return pts(
    Array.from({ length: 6 }, (_, i) => {
      const a = ((-90 + 60 * i + rot) * Math.PI) / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
    }),
  );
}

function MissingMark({ p, small, tile = true }: MarkProps) {
  const r = small ? 19 : 17;
  const d = r * Math.sqrt(3); // centre to neighbour
  const cx = small ? 60 : 62;
  const cy = small ? 68 : 66;
  const at = (deg: number): [number, number] => [cx + d * Math.cos((deg * Math.PI) / 180), cy + d * Math.sin((deg * Math.PI) / 180)];
  // Neighbours of a pointy-top hexagon are at 0°, ±60°, ±120°, 180°; the one at −60° is lifted out.
  const cells: { c: [number, number]; fill: string }[] = [
    { c: [cx, cy], fill: p.b },
    { c: at(0), fill: p.c },
    { c: at(60), fill: p.d },
    { c: at(120), fill: p.c },
    { c: at(180), fill: p.d },
    { c: at(-120), fill: p.c },
  ];
  const slot = at(-60);
  const lift = small ? 9 : 11;
  const piece: [number, number] = [slot[0] + lift * 0.7, slot[1] - lift];
  const inset = small ? 4 : 2.5;
  return (
    <>
      {tile && <path d={TILE} fill={p.bg} />}
      {cells.map(({ c, fill }, i) => (
        <polygon key={i} points={hex(c[0], c[1], r - inset)} fill={fill} stroke={fill} strokeWidth={3} strokeLinejoin="round" />
      ))}
      {!small && (
        <polygon
          points={hex(slot[0], slot[1], r - inset - 1)}
          fill="none"
          stroke={p.c}
          strokeWidth={2.5}
          strokeDasharray="4 4"
          strokeLinejoin="round"
          opacity={0.7}
        />
      )}
      <polygon
        points={hex(piece[0], piece[1], r - inset, 14)}
        fill={p.a}
        stroke={p.a}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </>
  );
}

/* ---------------------------------------------------------------- 3. Tess the tile */

/**
 * An Escher-style tile on a square of side `s`, its top-left corner at (x, y): the top edge has a
 * bump and the bottom the same bump as a notch; the right edge an S-curve and the left the same.
 * So it tiles the plane by translation, each head fitting the notch above it.
 */
function tessPath(x: number, y: number, s: number) {
  const X = (u: number) => (x + u * s).toFixed(2);
  const Y = (v: number) => (y + v * s).toFixed(2);
  const P = (u: number, v: number) => `${X(u)} ${Y(v)}`;
  return [
    `M${P(0, 0)}`,
    // top: a head bump
    `C${P(0.22, 0)} ${P(0.18, -0.36)} ${P(0.5, -0.36)}`,
    `C${P(0.82, -0.36)} ${P(0.78, 0)} ${P(1, 0)}`,
    // right: an S
    `C${P(1.3, 0.3)} ${P(0.7, 0.7)} ${P(1, 1)}`,
    // bottom: the bump as a notch (the top, reversed, one tile down)
    `C${P(0.78, 1)} ${P(0.82, 0.64)} ${P(0.5, 0.64)}`,
    `C${P(0.18, 0.64)} ${P(0.22, 1)} ${P(0, 1)}`,
    // left: the S, reversed, one tile left
    `C${P(-0.3, 0.7)} ${P(0.3, 0.3)} ${P(0, 0)}`,
    "Z",
  ].join(" ");
}

function TessFace({ x, y, s, ink, small }: { x: number; y: number; s: number; ink: string; small?: boolean }) {
  const ex = s * 0.15;
  const ey = y + s * (small ? 0.02 : 0.0);
  const er = s * (small ? 0.085 : 0.065);
  const cx = x + s * 0.5;
  return (
    <>
      <ellipse cx={cx - ex} cy={ey} rx={er} ry={er * 1.25} fill={ink} />
      <ellipse cx={cx + ex} cy={ey} rx={er} ry={er * 1.25} fill={ink} />
      {!small && (
        <path
          d={`M${cx - s * 0.08} ${y + s * 0.17} Q${cx} ${y + s * 0.25} ${cx + s * 0.08} ${y + s * 0.17}`}
          fill="none"
          stroke={ink}
          strokeWidth={s * 0.045}
          strokeLinecap="round"
        />
      )}
    </>
  );
}

function TessMark({ p, small, tile = true }: MarkProps) {
  const id = React.useId();
  if (small) {
    // One tile, alone and larger, so the bump, the notch and the eyes hold at 16px.
    const s = 66;
    const x = 64 - s / 2;
    const y = 64 - s * 0.32;
    return (
      <>
        {tile && <path d={TILE} fill={p.bg} />}
        <path d={tessPath(x, y, s)} fill={p.a} />
        <TessFace x={x} y={y} s={s} ink={p.ink} small />
      </>
    );
  }
  const s = 46;
  const x0 = 64 - s / 2;
  const y0 = 64 - s * 0.32;
  const neighbours: React.ReactElement[] = [];
  for (let j = -2; j <= 2; j++)
    for (let i = -2; i <= 2; i++) {
      if (i === 0 && j === 0) continue;
      neighbours.push(
        <path
          key={`${i},${j}`}
          d={tessPath(x0 + i * s, y0 + j * s, s)}
          fill={(i + j) % 2 === 0 ? p.b : p.c}
          stroke={p.bg}
          strokeWidth={3}
        />,
      );
    }
  return (
    <>
      <defs>
        <clipPath id={id}>
          <path d={TILE} />
        </clipPath>
      </defs>
      {tile && <path d={TILE} fill={p.bg} />}
      <g clipPath={tile ? `url(#${id})` : undefined} opacity={tile ? 1 : 0}>
        {neighbours}
      </g>
      <path d={tessPath(x0, y0, s)} fill={p.a} stroke={p.bg} strokeWidth={3} />
      <TessFace x={x0} y={y0} s={s} ink={p.ink} />
    </>
  );
}

/* ---------------------------------------------------------------- 4. Odd one out */

type V = [number, number];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k];

function CubeMark({ p, small, tile = true }: MarkProps) {
  const R = small ? 48 : 44;
  const C: V = [64, 64];
  const v = (deg: number): V => [64 + R * Math.cos((deg * Math.PI) / 180), 64 + R * Math.sin((deg * Math.PI) / 180)];
  const ur = v(-30), bot = v(90), ul = v(210);
  // Each face is a rhombus from C, spanned by two edges; split 2×2 (or not at all when small).
  const faces: { u: V; w: V; fill: string }[] = [
    { u: ul, w: ur, fill: p.b }, // top
    { u: ul, w: bot, fill: p.c }, // left
    { u: ur, w: bot, fill: p.d }, // right
  ];
  const n = small ? 1 : 2;
  const odd = { face: 0, i: 1, j: 1 }; // the far corner of the top face
  const rhombi: React.ReactElement[] = [];
  faces.forEach((f, fi) => {
    const U = sub(f.u, C);
    const W = sub(f.w, C);
    const P = (a: number, b: number) => add(C, add(mul(U, a / n), mul(W, b / n)));
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const isOdd = fi === odd.face && (small || (i === odd.i && j === odd.j));
        rhombi.push(
          <polygon
            key={`${fi}-${i}-${j}`}
            points={pts([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)])}
            fill={isOdd ? p.a : f.fill}
            stroke={p.bg}
            strokeWidth={small ? 7 : 4}
            strokeLinejoin="round"
          />,
        );
      }
  });
  return (
    <>
      {tile && <path d={TILE} fill={p.bg} />}
      {rhombi}
    </>
  );
}


/* ================================================================ round two */

/* ---------------------------------------------------------------- 5. Truchet trail */

/**
 * Truchet tiles: each square holds two quarter-circle arcs, in one of two orientations. Sides are
 * 0 top, 1 right, 2 bottom, 3 left; orientation 0 joins left–top and right–bottom, 1 joins
 * left–bottom and right–top. This 4×4 grid was searched for the longest single trail that enters
 * on the left and leaves on the right: it passes through 20 of the 32 arcs.
 */
const TRUCHET = [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
const TRUCHET_EXIT: Record<number, Record<number, number>> = {
  0: { 3: 0, 0: 3, 1: 2, 2: 1 },
  1: { 3: 2, 2: 3, 1: 0, 0: 1 },
};
const STEP: V[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];

/** The trail from the left side of row 1, as (column, row, in, out) steps. */
function truchetTrail() {
  const steps: [number, number, number, number][] = [];
  let col = 0, row = 1, side = 3;
  while (col >= 0 && col < 4 && row >= 0 && row < 4 && steps.length < 40) {
    const out = TRUCHET_EXIT[TRUCHET[row * 4 + col]][side];
    steps.push([col, row, side, out]);
    col += STEP[out][0];
    row += STEP[out][1];
    side = (out + 2) % 4;
  }
  return steps;
}
const TRAIL = truchetTrail();

/** A quarter circle inside one cell, centred on the corner shared by sides a and b. */
function quarter(x: number, y: number, s: number, a: number, b: number) {
  const mid = (k: number): V => [[x + s / 2, y], [x + s, y + s / 2], [x + s / 2, y + s], [x, y + s / 2]][k] as V;
  const A = mid(a), B = mid(b);
  const corner: V = [a === 1 || b === 1 ? x + s : x, a === 2 || b === 2 ? y + s : y];
  const k = 0.5523;
  const c1 = add(A, mul(sub(B, corner), k));
  const c2 = add(B, mul(sub(A, corner), k));
  return `M${A[0].toFixed(2)} ${A[1].toFixed(2)}C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${B[0].toFixed(2)} ${B[1].toFixed(2)}`;
}

function TruchetMark({ p, small, tile = true }: MarkProps) {
  const s = small ? 24 : 21;
  const o = 64 - 2 * s;
  const isMono = p.a === p.c;
  const onTrail = new Set(TRAIL.map(([c, r, a, b]) => `${c},${r},${Math.min(a, b)},${Math.max(a, b)}`));
  const rest: string[] = [];
  if (!small)
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) {
        const pairs = TRUCHET[r * 4 + c] === 0 ? [[0, 3], [1, 2]] : [[2, 3], [0, 1]];
        for (const [a, b] of pairs)
          if (!onTrail.has(`${c},${r},${a},${b}`)) rest.push(quarter(o + c * s, o + r * s, s, a, b));
      }
  const trail = TRAIL.map(([c, r, a, b]) => quarter(o + c * s, o + r * s, s, a, b)).join(" ");
  const start: V = [o, o + 1.5 * s];
  const [ec, er, , eo] = TRAIL[TRAIL.length - 1];
  const end: V = add([o + ec * s + s / 2, o + er * s + s / 2], mul(STEP[eo], s / 2));
  return (
    <>
      {tile && <path d={TILE} fill={p.bg} />}
      {!small && !isMono && (
        <rect x={o} y={o} width={4 * s} height={4 * s} rx={6} fill={p.d} />
      )}
      {rest.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={p.c} strokeWidth={4} strokeLinecap="round" opacity={isMono ? 0.35 : 1} />
      ))}
      <path d={trail} fill="none" stroke={p.a} strokeWidth={small ? 10 : 7} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={start[0]} cy={start[1]} r={small ? 9 : 7} fill={p.a} />
      <circle cx={end[0]} cy={end[1]} r={small ? 9 : 7} fill={p.a} />
      {!small && <circle cx={end[0]} cy={end[1]} r={3} fill={isMono ? p.bg : p.d} />}
    </>
  );
}

/* ---------------------------------------------------------------- 6. Penrose sun */

/**
 * Five Penrose kites round a point: the "sun" vertex of the kite-and-dart tiling, which covers the
 * plane but never repeats. Each kite is O and three points on a circle at θ−36°, θ, θ+36°, so its
 * sides are in the golden ratio and its angles 72°, 72°, 72°, 144°.
 */
function PenroseMark({ p, small, tile = true }: MarkProps) {
  const rho = small ? 56 : 50;
  const P = (deg: number): V => [64 + rho * Math.cos((deg * Math.PI) / 180), 64 + rho * Math.sin((deg * Math.PI) / 180)];
  const fills = [p.a, p.b, p.c, p.b, p.d];
  return (
    <>
      {tile && <path d={TILE} fill={p.bg} />}
      {fills.map((fill, i) => {
        const t = -90 + 72 * i;
        return (
          <polygon
            key={i}
            points={pts([[64, 64], P(t - 36), P(t), P(t + 36)])}
            fill={fill}
            stroke={p.bg}
            strokeWidth={small ? 8 : 4.5}
            strokeLinejoin="round"
          />
        );
      })}
      {!small && <circle cx={64} cy={64} r={5} fill={p.bg} />}
    </>
  );
}

/* ---------------------------------------------------------------- 7. Bright idea */

/** A flat-top hexagon of 24 triangles from the triangular tiling, as a light bulb on a base. */
function bulbTriangles(cx: number, cy: number, t: number) {
  const h = (t * Math.sqrt(3)) / 2;
  const top = cy - 2 * h;
  const out: { pts: V[]; up: boolean; key: string }[] = [];
  for (let k = 0; k < 4; k++) {
    const y0 = top + k * h;
    const off = k % 2 ? t / 2 : 0;
    for (let m = -4; m <= 4; m++) {
      const a = cx + off + m * t;
      const tris: { pts: V[]; up: boolean }[] = [
        { pts: [[a, y0], [a + t / 2, y0 + h], [a - t / 2, y0 + h]], up: true },
        { pts: [[a, y0], [a + t, y0], [a + t / 2, y0 + h]], up: false },
      ];
      for (const tri of tris) {
        const gx = (tri.pts[0][0] + tri.pts[1][0] + tri.pts[2][0]) / 3 - cx;
        const gy = (tri.pts[0][1] + tri.pts[1][1] + tri.pts[2][1]) / 3 - cy;
        if (Math.abs(gy) <= 2 * h && Math.sqrt(3) * Math.abs(gx) + Math.abs(gy) <= Math.sqrt(3) * 2 * t - 0.01)
          out.push({ ...tri, key: `${k},${m},${tri.up ? "u" : "d"}` });
      }
    }
  }
  return out;
}

function BulbMark({ p, small, tile = true }: MarkProps) {
  const t = small ? 21 : 19;
  const cx = 64;
  const cy = small ? 52 : 50;
  const tris = bulbTriangles(cx, cy, t);
  const lit = "1,0,u"; // the triangle that lights up: just right of centre
  const h = (t * Math.sqrt(3)) / 2;
  const base = cy + 2 * h + (small ? 5 : 5);
  return (
    <>
      {tile && <path d={TILE} fill={p.bg} />}
      {tris.map((tri) => {
        const on = tri.key === lit;
        return (
          <polygon
            key={tri.key}
            points={pts(tri.pts)}
            fill={on ? p.a : small ? p.b : tri.up ? p.b : p.c}
            stroke={small && !on ? p.b : p.bg}
            strokeWidth={small ? (on ? 5 : 1) : 2.5}
            strokeLinejoin="round"
          />
        );
      })}
      <rect x={cx - 17} y={base} width={34} height={small ? 10 : 8} rx={4} fill={p.d} />
      {small ? (
        <rect x={cx - 10} y={base + 13} width={20} height={9} rx={4} fill={p.d} />
      ) : (
        <>
          <rect x={cx - 14} y={base + 11} width={28} height={7} rx={3.5} fill={p.d} />
          <rect x={cx - 8} y={base + 21} width={16} height={6} rx={3} fill={p.d} />
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- 8. Star and cross */

/** An eight-pointed star (two squares) of outer radius R; its inner corners at 22.5° + 45°k. */
function star8(cx: number, cy: number, R: number) {
  const r = (R * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  return pts(
    Array.from({ length: 16 }, (_, i) => {
      const a = (i * Math.PI) / 8;
      const d = i % 2 ? r : R;
      return [cx + d * Math.cos(a), cy + d * Math.sin(a)] as V;
    }),
  );
}

function StarMark({ p, small, tile = true }: MarkProps) {
  const id = React.useId();
  if (small) {
    return (
      <>
        {tile && <path d={TILE} fill={p.bg} />}
        <polygon points={star8(64, 64, 52)} fill={p.a} strokeLinejoin="round" stroke={p.a} strokeWidth={4} />
        <circle cx={64} cy={64} r={13} fill={p.bg} />
      </>
    );
  }
  const L = 52;
  const stars: React.ReactElement[] = [];
  for (let j = -2; j <= 2; j++)
    for (let i = -2; i <= 2; i++)
      if (i || j)
        stars.push(<polygon key={`${i},${j}`} points={star8(64 + i * L, 64 + j * L, L / 2)} fill={p.b} stroke={p.bg} strokeWidth={3} strokeLinejoin="round" />);
  return (
    <>
      <defs>
        <clipPath id={id}>
          <path d={TILE} />
        </clipPath>
      </defs>
      {tile && (
        <g clipPath={`url(#${id})`}>
          <path d={TILE} fill={p.c} />
          {stars}
        </g>
      )}
      <polygon points={star8(64, 64, L / 2)} fill={p.a} stroke={tile ? p.bg : "none"} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={64} cy={64} r={6} fill={tile ? p.c : p.bg} />
    </>
  );
}

/* ---------------------------------------------------------------- the four */

export const TESSY_CONCEPTS: Concept[] = [
  {
    id: "pinwheel",
    name: "Pinwheel T",
    tiling: "T-tetrominoes, four to a square",
    idea:
      "Four identical T-shaped pieces lock together into a perfect square, turning like a pinwheel. The top piece stands upright and is the letter T, so the name is spelled by the tiling itself.",
    puzzle: "Look twice: all four shapes are the same piece, rotated. That second look is the app.",
    palette: { bg: "#1b2547", a: "#ffb627", b: "#4c7dff", c: "#2ec4b6", d: "#ff5d8f", ink: "#1b2547" },
    font: { family: "Lexend", css: "Lexend:wght@700", weight: 700, tracking: "-0.02em" },
    Mark: PinwheelMark,
  },
  {
    id: "missing",
    name: "Missing piece",
    tiling: "Hexagons (the honeycomb)",
    idea:
      "A honeycomb with one cell lifted out, tilted, a moment before it clicks into place. The dashed slot shows where it goes. It is the instant every puzzle builds toward: you see where the piece fits.",
    puzzle: "The empty slot asks a question; the floating piece is the answer.",
    palette: { bg: "#fff6e8", a: "#ff6b35", b: "#0f8b8d", c: "#2bb3a8", d: "#7fd1c7", ink: "#143642" },
    font: { family: "Nunito", css: "Nunito:wght@800", weight: 800, tracking: "-0.01em" },
    Mark: MissingMark,
  },
  {
    id: "tess",
    name: "Tess the tile",
    tiling: "An Escher-style translation tile",
    idea:
      "One tile, shaped so its head fits exactly into the notch of the tile above, and its sides interlock with its neighbours, the way Escher's lizards and birds do. Give it eyes and it becomes Tess, a friendly guide who is literally a piece of the puzzle.",
    puzzle: "Every bump has a matching notch: the shape is its own proof that it tiles.",
    palette: { bg: "#4b32c3", a: "#ffd166", b: "#6b55e0", c: "#8a77ee", d: "#8a77ee", ink: "#2a1a6e" },
    font: { family: "Fredoka", css: "Fredoka:wght@600", weight: 600, tracking: "0em" },
    Mark: TessMark,
  },
  {
    id: "cube",
    name: "Odd one out",
    tiling: "Rhombi (the rhombille tiling)",
    idea:
      "Twelve identical rhombi in three tones make a hexagon, and the eye folds that hexagon into a cube. One rhombus is a different colour. It is a 2D tiling that reads as 3D, and a spot-the-difference in one mark.",
    puzzle: "Flat or solid? Which piece doesn't belong? Two reasoning questions in one glance.",
    palette: { bg: "#11131c", a: "#ff4f6d", b: "#8ee6c8", c: "#3fb68b", d: "#1f7a63", ink: "#11131c" },
    font: { family: "Space Grotesk", css: "Space+Grotesk:wght@700", weight: 700, tracking: "-0.03em" },
    Mark: CubeMark,
  },
];


/** Round two: four more, each on a tiling round one did not use. */
export const TESSY_CONCEPTS_2: Concept[] = [
  {
    id: "truchet",
    name: "Truchet trail",
    tiling: "Truchet tiles (quarter circles on squares)",
    idea:
      "Sixteen square tiles, each holding two quarter-circle arcs turned one of two ways. Turn them just right and a single trail winds from one side to the other through twenty of the arcs. Every logic puzzle is this: many small, simple choices that join into one path.",
    puzzle: "Trace it: does the trail from the left dot really reach the right one? (It does, without lifting your finger.)",
    palette: { bg: "#0d3b4c", a: "#ffcc33", b: "#ffcc33", c: "#2a7f96", d: "#134b5e", ink: "#0d3b4c" },
    font: { family: "Outfit", css: "Outfit:wght@700", weight: 700, tracking: "-0.02em" },
    Mark: TruchetMark,
  },
  {
    id: "penrose",
    name: "Penrose sun",
    tiling: "Penrose kites (aperiodic)",
    idea:
      "Five Penrose kites meet at a point, the 'sun' of the kite-and-dart tiling: a pattern that covers the floor forever and never repeats. One kite is red. It promises what the app gives: endless puzzles, never the same twice.",
    puzzle: "Every angle is 72° or 144°, every side in the golden ratio: the order is hidden in plain sight.",
    palette: { bg: "#fff8f0", a: "#e63946", b: "#1d3557", c: "#457b9d", d: "#8ec5cf", ink: "#1d3557" },
    font: { family: "Sora", css: "Sora:wght@700", weight: 700, tracking: "-0.03em" },
    Mark: PenroseMark,
  },
  {
    id: "bulb",
    name: "Bright idea",
    tiling: "Equilateral triangles",
    idea:
      "A light bulb built from 24 triangles of the triangular tiling, its glass a hexagon, on a three-step base. One triangle is lit. An idea arrives a piece at a time: the moment one piece clicks, the rest light up.",
    puzzle: "Which piece lit first? The bright triangle is where the thinking started.",
    palette: { bg: "#2b2d42", a: "#fffbe6", b: "#ffd23f", c: "#f4a300", d: "#8d99ae", ink: "#2b2d42" },
    font: { family: "Baloo 2", css: "Baloo+2:wght@700", weight: 700, tracking: "-0.01em" },
    Mark: BulbMark,
  },
  {
    id: "star",
    name: "Star and cross",
    tiling: "Eight-pointed stars and crosses (girih)",
    idea:
      "The star-and-cross pattern of Islamic geometric tiling: eight-pointed stars touch point to point, and the space left between them is itself a tile, a cross. One star is red. A centuries-old proof that careful reasoning makes beauty.",
    puzzle: "Look at the gold, not the stars: the leftover space is a shape of its own.",
    palette: { bg: "#f6f1e7", a: "#d1495b", b: "#00798c", c: "#edae49", d: "#edae49", ink: "#30343f" },
    font: { family: "DM Serif Display", css: "DM+Serif+Display", weight: 400, tracking: "0em" },
    Mark: StarMark,
  },
];

const ALL = [...TESSY_CONCEPTS, ...TESSY_CONCEPTS_2];

const FONT_HREF = `https://fonts.googleapis.com/css2?${ALL.map((c) => `family=${c.font.css}`).join("&")}&display=swap`;

function useTessyFonts() {
  React.useEffect(() => {
    if (document.querySelector("link[data-tessy-fonts]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    link.dataset.tessyFonts = "true";
    document.head.appendChild(link);
  }, []);
}

/* ---------------------------------------------------------------- the page */

function Svg({ size, children, label }: { size: number; children: React.ReactNode; label?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ display: "block", flex: "none" }}
    >
      {children}
    </svg>
  );
}

function Wordmark({ c, color }: { c: Concept; color: string }) {
  return (
    <span
      style={{
        fontFamily: `"${c.font.family}", system-ui, sans-serif`,
        fontWeight: c.font.weight,
        letterSpacing: c.font.tracking,
        fontSize: 40,
        lineHeight: 1,
        color,
      }}
    >
      tessy
    </span>
  );
}

function Lockup({ c, ground, text }: { c: Concept; ground: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-5 py-4" style={{ background: ground }}>
      <Svg size={48}>
        <c.Mark p={c.palette} />
      </Svg>
      <Wordmark c={c} color={text} />
    </div>
  );
}

function Cap({ children }: { children: React.ReactNode }) {
  return <p className="spec-cap m-0 mt-2 text-center text-muted-foreground">{children}</p>;
}

/** Whether a hex colour is light enough to need dark text. */
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 160;
}

function ConceptCard({ c, n }: { c: Concept; n: number }) {
  const light = isLight(c.palette.bg);
  const lightText = light ? c.palette.ink : c.palette.bg;
  return (
    <section className="mt-8 rounded-[var(--radius)] border border-border bg-card p-6" aria-labelledby={`tessy-${c.id}`}>
      <p className="spec-cap m-0 text-muted-foreground">
        Concept {n} · {c.tiling}
      </p>
      <h2 id={`tessy-${c.id}`} className="material-heading mt-1 text-lg text-foreground">
        {c.name}
      </h2>

      <div className="mt-5 grid gap-6 md:grid-cols-[auto_1fr]">
        <div>
          <Svg size={176} label={`Tessy app icon, ${c.name}`}>
            <c.Mark p={c.palette} />
          </Svg>
          <Cap>App icon</Cap>
        </div>
        <div className="min-w-0">
          <p className="material m-0 max-w-[60ch] text-foreground">{c.idea}</p>
          <p className="material mt-3 max-w-[60ch] text-muted-foreground">
            <strong className="text-foreground">The puzzle in it:</strong> {c.puzzle}
          </p>

          <div className="mt-5 flex flex-wrap items-end gap-6">
            <div>
              <div className="flex items-end gap-3">
                <Svg size={64}>
                  <c.Mark p={c.palette} />
                </Svg>
                <Svg size={32}>
                  <c.Mark p={c.palette} small />
                </Svg>
                <Svg size={16}>
                  <c.Mark p={c.palette} small />
                </Svg>
              </div>
              <Cap>64 · 32 · 16</Cap>
            </div>
            <div>
              <div className="flex items-end gap-2">
                <div className="rounded-xl border border-border bg-white p-2">
                  <Svg size={56}>
                    <c.Mark p={mono(lightText, "#ffffff")} tile={false} />
                  </Svg>
                </div>
                <div className="rounded-xl p-2" style={{ background: "#0b0b0f" }}>
                  <Svg size={56}>
                    <c.Mark p={mono("#ffffff", "#0b0b0f")} tile={false} />
                  </Svg>
                </div>
              </div>
              <Cap>One colour</Cap>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Lockup c={c} ground="#ffffff" text={lightText} />
        <Lockup c={c} ground="#0e0f14" text="#ffffff" />
        <Lockup c={c} ground={c.palette.bg} text={light ? c.palette.ink : "#ffffff"} />
      </div>
      <p className="spec-cap m-0 mt-2 text-muted-foreground">
        Wordmark: {c.font.family} {c.font.weight}, lowercase
      </p>
    </section>
  );
}

function Overview({ list, from }: { list: Concept[]; from: number }) {
  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {list.map((c, i) => (
        <a
          key={c.id}
          href={`#tessy-${c.id}`}
          className="no-underline"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(`tessy-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <Svg size={88} label={c.name}>
            <c.Mark p={c.palette} />
          </Svg>
          <Cap>
            {from + i}. {c.name}
          </Cap>
        </a>
      ))}
    </div>
  );
}

export function TessyLogoPage() {
  useTessyFonts();
  const n2 = TESSY_CONCEPTS.length + 1;
  return (
    <>
      <p className="spec-cap m-0 text-muted-foreground">Tessy / logo concepts</p>
      <h1 className="display mt-1">Tessy</h1>
      <p className="material mt-3 max-w-[64ch] text-muted-foreground">
        Eight logo concepts, in two rounds of four, for Tessy, an app that helps students solve
        logical reasoning puzzles. The name comes from tessellations, so each concept is built from a
        different real tiling, and each hides one small puzzle: a reason to look twice. Shown as the
        app icon, at favicon sizes, in one colour, and with a wordmark. Tessy is a separate product,
        so these keep their own palettes and ignore the header&apos;s colour schemes.
      </p>
      <p className="spec-cap m-0 mt-6 text-muted-foreground">Round one</p>
      <Overview list={TESSY_CONCEPTS} from={1} />
      <p className="spec-cap m-0 mt-6 text-muted-foreground">Round two</p>
      <Overview list={TESSY_CONCEPTS_2} from={n2} />

      <h2 className="material-heading mt-12 text-lg text-foreground">Round one</h2>
      {TESSY_CONCEPTS.map((c, i) => (
        <ConceptCard key={c.id} c={c} n={i + 1} />
      ))}
      <h2 className="material-heading mt-12 text-lg text-foreground">Round two</h2>
      {TESSY_CONCEPTS_2.map((c, i) => (
        <ConceptCard key={c.id} c={c} n={n2 + i} />
      ))}
    </>
  );
}
