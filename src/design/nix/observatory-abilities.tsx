import type { ReactNode } from "react";

import type { Mood } from "./rig/face";
import { rotAt, type Hands } from "./rig/motion";
import type { Pose } from "./rig/poses";
import { C } from "./theme";

/**
 * Each club member's ability, previewed. The ability is its own layer around the figure — a whole-
 * figure move (`.fx-*` in `studio.css`), something drawn behind or over it, or an act for the rig —
 * never painted into the character. Every move is declared keyframes and stops under reduced motion.
 */
export type Ability = {
  id: string;
  name: string;
  line: string;
  mood?: Mood;
  /** A class from `studio.css` that moves the whole figure. */
  move?: string;
  /** The figure holds still while the move plays (a freeze, a pour). */
  still?: boolean;
  /** Its beak or mouth flaps while the preview plays: it is talking. */
  talk?: boolean;
  act?: Pose;
  behind?: () => ReactNode;
  over?: () => ReactNode;
};

const EARTH = "#8b6a4e";
const EARTH_SHADE = "#6e523b";

function Mound({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 46} 300 Q${x - 30} 268 ${x} 266 Q${x + 30} 268 ${x + 46} 300 Z`} fill={EARTH_SHADE} />
      <path d={`M${x - 42} 300 Q${x - 28} 272 ${x - 2} 270 Q${x + 26} 272 ${x + 40} 300 Z`} fill={EARTH} />
      {[
        [-14, 262, 3],
        [10, 256, 2.4],
        [24, 264, 2],
        [-28, 270, 2.2],
      ].map(([dx, y, r]) => (
        <circle key={`${dx}`} className="fx fx-fall fx-slow" cx={x + dx} cy={y} r={r} fill={EARTH} />
      ))}
    </g>
  );
}

const PIM_LISTEN: Hands = { L: [97, 192], R: [104, 184], outL: false, outR: false };

export const OBSERVATORY_ABILITIES: Ability[] = [
  {
    id: "obs-hob",
    name: "Burrow",
    line: "Dives into the ground and pops up somewhere else — here, from one side of the hill to the other.",
    mood: "focused",
    move: "mv mv-burrow",
    over: () => (
      <g>
        <Mound x={56} />
        <Mound x={144} />
      </g>
    ),
  },
  {
    id: "obs-tavi",
    name: "Zoom",
    line: "Runs so fast she blurs, and arrives in a skid. Leaves the same way.",
    mood: "delighted",
    move: "mv mv-zoom",
    behind: () => (
      <g className="fx fx-zoomlines" {...{ stroke: C.hi, strokeWidth: 4, strokeLinecap: "round" }}>
        <path d="M10 120 L70 120 M0 160 L60 160 M16 200 L66 200 M4 240 L58 240" />
      </g>
    ),
    over: () => (
      <g className="fx fx-skid" fill="#d8cfc2">
        <circle cx={70} cy={276} r={8} />
        <circle cx={58} cy={270} r={6} />
        <circle cx={48} cy={278} r={5} />
      </g>
    ),
  },
  {
    id: "obs-grit",
    name: "Turn to stone",
    line: "Startled or embarrassed, it freezes solid mid-pose — grey, cracked — then cracks back out.",
    mood: "oops",
    move: "mv mv-stone",
    still: true,
    over: () => (
      <g className="fx fx-crack" {...{ stroke: "#4c4843", strokeWidth: 1.8, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }}>
        <path d="M84 70 L90 84 L86 94 L92 104" />
        <path d="M120 176 L114 188 L120 196 L116 210" />
        <path d="M70 196 L78 204 L74 214" />
      </g>
    ),
  },
  {
    id: "obs-lyra",
    name: "Mimic",
    line: "Does any voice or sound. Here it is doing Hob — only ever a fixed line of his, in his voice.",
    mood: "delighted",
    talk: true,
    over: () => (
      <g>
        <g className="fx fx-pulse" {...{ stroke: C.hi, strokeWidth: 3, fill: "none", strokeLinecap: "round" }}>
          <path d="M120 126 Q128 136 120 146 M128 120 Q140 136 128 152" />
        </g>
        {/* a speech bubble with Hob's star in it: whose voice this is */}
        <g transform="translate(150 70)">
          <path d="M-26 -20 H26 Q34 -20 34 -12 V12 Q34 20 26 20 H-6 L-16 30 L-14 20 H-26 Q-34 20 -34 12 V-12 Q-34 -20 -26 -20 Z" fill="var(--card, #fff)" opacity={0.95} />
          {Array.from({ length: 11 }, (_, i) => (i / 11) * 360).map((a) => (
            <ellipse key={a} cx={6 * Math.cos((a * Math.PI) / 180)} cy={6 * Math.sin((a * Math.PI) / 180)} rx={4} ry={1.7} transform={`rotate(${a} ${6 * Math.cos((a * Math.PI) / 180)} ${6 * Math.sin((a * Math.PI) / 180)})`} fill="#f29ab0" />
          ))}
          <circle r={4} fill="#d9718f" />
        </g>
      </g>
    ),
  },
  {
    id: "obs-nox",
    name: "Pour",
    line: "Goes liquid and pours itself into anything. A teacup will do.",
    mood: "neutral",
    move: "mv mv-pour",
    still: true,
    over: () => (
      <g className="fx fx-cup">
        <path d="M58 248 H142 Q140 290 100 292 Q60 290 58 248 Z" fill="#f4ede2" />
        <path d="M60 258 H140" stroke={C.accent} strokeWidth={5} />
        <path d="M140 256 Q162 256 160 270 Q158 282 136 280" fill="none" stroke="#f4ede2" strokeWidth={7} strokeLinecap="round" />
        <ellipse cx={100} cy={296} rx={52} ry={4} fill="#e4dacb" />
      </g>
    ),
  },
  {
    id: "obs-pim",
    name: "Radar ears",
    line: "Its ears swivel to hear anything, anywhere — a whisper from the left, then from the right.",
    behind: () => (
      <g {...{ stroke: C.hi, strokeWidth: 3, fill: "none", strokeLinecap: "round" }}>
        <path className="fx fx-hearL" d="M12 40 Q4 56 12 72 M24 34 Q12 56 24 78" />
        <path className="fx fx-hearR" d="M188 40 Q196 56 188 72 M176 34 Q188 56 176 78" />
      </g>
    ),
    act: {
      id: "idle",
      title: "Listening",
      mood: "curious",
      use: "Its ability preview.",
      hands: [PIM_LISTEN, PIM_LISTEN],
      motion: {
        duration: 4,
        tracks: {
          /* both dishes swing to the left, hold, then sweep to the right: anticipation and overshoot */
          earL: rotAt([0, 0], [0.08, 6], [0.2, -30], [0.24, -26], [0.46, -26], [0.54, -20], [0.64, 22], [0.68, 18], [0.88, 18], [1, 0]),
          earR: rotAt([0, 0], [0.08, 6], [0.2, -30], [0.24, -26], [0.46, -26], [0.54, -20], [0.64, 22], [0.68, 18], [0.88, 18], [1, 0]),
          head: rotAt([0, 0], [0.2, -5], [0.46, -5], [0.64, 5], [0.88, 5], [1, 0]),
        },
      },
    },
  },
];
