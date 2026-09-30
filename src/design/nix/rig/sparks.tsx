import type { CSSProperties } from "react";

import type { P } from "./skeleton";

/**
 * The spark trail: glowing sparks a firefly leaves behind as it flies. It is the one thing every
 * Wisp-line character keeps from the bench firefly, so it lives here, in the rig, rather than in
 * any one drawing. A character opts in by naming where its sparks come from (`Candidate.trail`).
 *
 * The sparks are drawn behind the figure, in the figure's own space, and are not carried by the
 * body's joints — they are left behind. Motion is declared CSS keyframes (`studio.css`,
 * `spark-drift`): each spark drifts down and back, shrinks and fades, on one clock with staggered
 * starts. Under reduced motion, or when the figure is stilled, the live sparks are replaced by the
 * same trail frozen part-way, fading with distance.
 */

type Spark = { dx: number; dy: number; delay: number; r: number; star?: boolean };

const SPARKS: Spark[] = [
  { dx: -12, dy: 36, delay: 0, r: 4.6 },
  { dx: 10, dy: 50, delay: 0.3, r: 3.8, star: true },
  { dx: -26, dy: 58, delay: 0.6, r: 4.2 },
  { dx: -4, dy: 70, delay: 0.9, r: 3.2, star: true },
  { dx: 18, dy: 32, delay: 1.2, r: 3.8 },
  { dx: -18, dy: 44, delay: 1.5, r: 4.4, star: true },
  { dx: 6, dy: 62, delay: 1.8, r: 3.2 },
  { dx: -32, dy: 34, delay: 2.1, r: 3 },
];

/** Where each spark sits in the frozen trail: fraction of its drift, and how bright it still is. */
const FROZEN = [0.2, 0.55, 0.8, 0.95, 0.35, 0.65, 0.45, 0.9];

function Mark({
  x,
  y,
  r,
  star,
  glow,
  edge,
}: Spark & { x: number; y: number; glow: string; edge: string }) {
  if (star) {
    const q = r * 0.35;
    const R = r * 1.9;
    return (
      <g>
        <circle cx={x} cy={y} r={r * 2.4} fill={glow} opacity={0.3} />
        <path
          d={`M${x} ${y - R} L${x + q} ${y - q} L${x + R} ${y} L${x + q} ${y + q} L${x} ${y + R} L${x - q} ${y + q} L${x - R} ${y} L${x - q} ${y - q} Z`}
          fill={glow}
          stroke={edge}
          strokeWidth={0.8}
          strokeLinejoin="round"
        />
      </g>
    );
  }
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.4} fill={glow} opacity={0.3} />
      <circle cx={x} cy={y} r={r} fill={glow} stroke={edge} strokeWidth={0.8} />
    </g>
  );
}

export function SparkTrail({ at, glow, edge }: { at: P; glow: string; edge: string }) {
  const [x, y] = at;
  return (
    <g aria-hidden>
      <g className="spark-live">
        {SPARKS.map((s, i) => (
          <g
            key={i}
            className="spark"
            style={
              {
                "--dx": `${s.dx}px`,
                "--dy": `${s.dy}px`,
                animationDelay: `${s.delay}s`,
              } as CSSProperties
            }
          >
            <Mark {...s} x={x} y={y} glow={glow} edge={edge} />
          </g>
        ))}
      </g>
      <g className="spark-still">
        {SPARKS.map((s, i) => {
          const t = FROZEN[i];
          return (
            <g key={i} opacity={1 - t * 0.75}>
              <Mark
                {...s}
                r={s.r * (1 - t * 0.5)}
                x={x + s.dx * t}
                y={y + s.dy * t}
                glow={glow}
                edge={edge}
              />
            </g>
          );
        })}
      </g>
    </g>
  );
}
