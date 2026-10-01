import type { ReactNode } from "react";

import type { Mood } from "./rig/face";
import { keys, rotAt, type Hands } from "./rig/motion";
import type { Pose } from "./rig/poses";
import type { Viseme } from "./rig/visemes";
import { C } from "./theme";

/**
 * Each side character's ability, previewed. The ability is its own layer around the figure — a whole-
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
  /** A mouth shape held for the whole preview (a yawn). */
  mouth?: Viseme;
  act?: Pose;
  behind?: () => ReactNode;
  over?: () => ReactNode;
};

const BUN_STAND: Hands = { L: [78, 200], R: [122, 200], outL: true, outR: true };

const STAR: Hands = { L: [24, 150], R: [176, 150], outL: true, outR: true };
const REACH_UP: Hands = { L: [88, 30], R: [112, 30], outL: true, outR: true };
const GIGGLE: Hands = { L: [96, 186], R: [104, 186], outL: false, outR: false };

export const SIDE_ABILITIES: Ability[] = [
  {
    id: "garden-bun",
    name: "Thump",
    line: "One stamp of her foot and everything round her jumps — here, the leaves.",
    behind: () => (
      <g fill={C.hi}>
        {[
          [40, 250, -20],
          [160, 246, 24],
          [56, 222, 10],
          [148, 218, -12],
        ].map(([x, y, r]) => (
          <path key={x} className="fx fx-hop" d={`M${x} ${y} q8 -10 16 0 q-8 10 -16 0 Z`} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </g>
    ),
    over: () => (
      <g className="fx fx-impact" {...{ stroke: C.hi, strokeWidth: 3, fill: "none", strokeLinecap: "round" }}>
        <path d="M118 286 L132 278 M122 290 L140 290 M82 286 L68 278 M78 290 L60 290" />
      </g>
    ),
    act: {
      id: "idle",
      title: "Thump",
      mood: "focused",
      use: "Its ability preview.",
      hands: [BUN_STAND, BUN_STAND],
      motion: {
        duration: 1.6,
        tracks: {
          /* the foot lifts (anticipation), stamps past the ground, and the body jolts and settles */
          hipR: rotAt([0, 0], [0.18, -34], [0.36, -38], [0.44, 4], [0.5, 0], [1, 0]),
          kneeR: rotAt([0, 0], [0.18, 30], [0.36, 34], [0.44, -2], [0.5, 0], [1, 0]),
          torso: keys([0, {}], [0.36, { y: -3 }], [0.44, { y: 1.5, sy: 0.96 }], [0.56, {}], [1, {}]),
          earL: rotAt([0, 0], [0.44, 0], [0.5, -16], [0.62, 8], [0.74, 0], [1, 0]),
          earR: rotAt([0, 0], [0.44, 0], [0.5, 16], [0.62, -8], [0.74, 0], [1, 0]),
        },
      },
    },
  },
  {
    id: "pond-ines",
    name: "Stretch",
    line: "Bends like rubber: from a star, up as tall as she goes, then down into a squash, and back.",
    act: {
      id: "idle",
      title: "Stretch",
      mood: "delighted",
      use: "Its ability preview.",
      hands: [STAR, REACH_UP, REACH_UP, STAR, STAR],
      motion: {
        duration: 2.4,
        tracks: {
          torso: keys([0, {}], [0.25, { sy: 1.16, sx: 0.88, y: -6, e: "cubic-bezier(0.34, 1.56, 0.64, 1)" }], [0.5, { sy: 1.16, sx: 0.88, y: -6 }], [0.66, { sy: 0.84, sx: 1.14, y: 4 }], [0.8, { sy: 1.03, sx: 0.98 }], [1, {}]),
          head: keys([0, {}], [0.25, { y: -8 }], [0.5, { y: -8 }], [0.66, { y: 4 }], [1, {}]),
          hipL: rotAt([0, 24], [0.25, 4], [0.5, 4], [0.66, 30], [1, 24]),
          hipR: rotAt([0, -24], [0.25, -4], [0.5, -4], [0.66, -30], [1, -24]),
        },
      },
    },
  },
  {
    id: "pond-mina",
    name: "Giggle",
    line: "A laugh so catching that everyone round her joins in — she shakes with it.",
    talk: true,
    over: () => (
      <g {...{ stroke: C.hi, strokeWidth: 3, fill: "none", strokeLinecap: "round" }}>
        <path className="fx fx-pulse" d="M30 70 q-6 8 0 16 M18 64 q-8 14 0 28" />
        <path className="fx fx-pulse fx-slow" d="M170 70 q6 8 0 16 M182 64 q8 14 0 28" />
      </g>
    ),
    act: {
      id: "idle",
      title: "Giggle",
      mood: "delighted",
      use: "Its ability preview.",
      hands: [GIGGLE, GIGGLE],
      motion: {
        duration: 0.6,
        tracks: {
          torso: keys([0, {}], [0.25, { y: -2, sy: 1.02 }], [0.5, {}], [0.75, { y: -2, sy: 1.02 }], [1, {}]),
          head: rotAt([0, -4], [0.25, 3], [0.5, -4], [0.75, 3], [1, -4]),
        },
      },
    },
  },
  {
    id: "garden-bean",
    name: "Yawn",
    line: "A yawn so big everyone round it yawns too.",
    mood: "happy",
    mouth: "ai",
    act: {
      id: "idle",
      title: "Yawn",
      mood: "happy",
      use: "Its ability preview.",
      hands: [
        { L: [92, 204], R: [108, 200], outL: false, outR: false },
        { L: [60, 140], R: [140, 140], outL: true, outR: true },
        { L: [60, 140], R: [140, 140], outL: true, outR: true },
        { L: [92, 204], R: [108, 200], outL: false, outR: false },
      ],
      motion: {
        duration: 3.2,
        tracks: {
          head: keys([0, {}], [0.3, { r: -10, y: -3 }], [0.7, { r: -10, y: -3 }], [0.85, { r: 2 }], [1, {}]),
          torso: keys([0, {}], [0.3, { sy: 1.05, sx: 0.97 }], [0.7, { sy: 1.05, sx: 0.97 }], [0.85, { sy: 0.97, sx: 1.02 }], [1, {}]),
        },
      },
    },
  },
];
