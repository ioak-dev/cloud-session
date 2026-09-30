import type { ReactNode } from "react";

import type { Mood } from "./rig/face";
import type { PoseId } from "./rig/poses";

import { C } from "./theme";

/**
 * Each side candidate's ability, previewed over its figure. The ability is not painted into the
 * character: it is its own layer, the way Wisp's sparks are drawn by the rig.
 */
export type Ability = {
  /** The candidate it belongs to. */
  id: string;
  name: string;
  line: string;
  mood?: Mood;
  /** Fades the figure, for an ability that is transparency. */
  fade?: number;
  /** Turns the figure's hue, for a colour change. */
  hue?: number;
  /** Draws the preview behind the figure rather than over it. */
  behind?: boolean;
  /** A pose from the rig, when the ability is a gesture. */
  pose?: PoseId;
  /** Turns the figure (degrees) and scales it, for a cartwheel, a slide, hanging. */
  turn?: number;
  scale?: number;
  /** Moves the frame so a preview has room above the head. */
  viewBox?: string;
  fx: () => ReactNode;
};

const TALL = "0 -40 200 340";

export const SIDE_ABILITIES: Ability[] = [
  {
    id: "chameleon",
    name: "Colour change",
    line: "Takes the colour of what it lands on — here, the colour for correct, always with words or a status mark beside it.",
    mood: "delighted",
    hue: -115,
    fx: () => null,
  },
  {
    id: "side-octopus",
    name: "Ink",
    line: "Draws a mark in the air — an arrow, a circle, an underline — to show where to look.",
    mood: "curious",
    fx: () => (
      <g stroke={C.deep} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M172 196 C192 176 192 146 172 140 C154 136 154 160 170 160 C186 160 190 128 184 96" />
        <path d="M176 104 L184 94 L192 106" />
      </g>
    ),
  },
  {
    id: "side-bat",
    name: "Upside-down",
    line: "Hangs from anything — a heading, the edge of a card — and sees it the other way round.",
    turn: 180,
    mood: "happy",
    fx: () => <rect x={36} y={12} width={128} height={7} rx={3.5} fill={C.deep} opacity={0.6} />,
  },
  {
    id: "side-juno",
    name: "Cartwheel",
    line: "Arrives, and leaves, with a cartwheel.",
    turn: -70,
    scale: 0.85,
    mood: "delighted",
    fx: () => (
      <path
        d="M30 230 A 80 80 0 0 1 170 110"
        stroke={C.hi}
        strokeWidth={3}
        strokeDasharray="2 9"
        fill="none"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: "side-chick",
    name: "Fluff up",
    line: "Shakes itself and fluffs every feather out into a round ball, twice its size, then smooths back down.",
    mood: "delighted",
    behind: true,
    fx: () => (
      <g fill={C.hi}>
        {Array.from({ length: 18 }, (_, i) => {
          const a = ((170 + i * 11.8) * Math.PI) / 180;
          return <circle key={i} cx={100 + Math.cos(a) * 60} cy={124 + Math.sin(a) * 58} r={13} />;
        })}
        <circle cx={100} cy={124} r={62} />
      </g>
    ),
  },
  {
    id: "side-lulu",
    name: "Puppy eyes",
    line: "When she wants something, her eyes swell huge, glossy and brimming — and no one can say no.",
    mood: "curious",
    fx: () => (
      <g>
        {[79.5, 120.5].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={104} rx={13.5} ry={15} fill="#fffdf8" />
            <circle cx={x} cy={106} r={11.4} fill="#7b5cc4" />
            <ellipse cx={x} cy={112} rx={8.4} ry={4.6} fill="#a98ce0" />
            <circle cx={x} cy={106} r={5} fill="#241a2e" />
            <circle cx={x - 4.4} cy={101} r={4.2} fill="#fffdf8" />
            <circle cx={x + 4.4} cy={100.6} r={2.2} fill="#fffdf8" />
            <circle cx={x + 3.6} cy={111} r={1.8} fill="#fffdf8" />
            <circle cx={x - 3.4} cy={112.4} r={1.3} fill="#fffdf8" />
            <path d={`M${x - 11} ${116} Q${x} ${121} ${x + 11} ${116}`} stroke="#9fd4f2" strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <path d={`M${x - 13.5} ${103} A13.5 15 0 0 1 ${x + 13.5} ${103}`} stroke="#2a1d22" strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    ),
  },
  {
    id: "panda",
    name: "Stand tall",
    line: "A red panda's own startle: it rears up on its hind legs, arms thrown wide, tail fluffed, to look as big as it can.",
    mood: "curious",
    pose: "cheer",
    fx: () => (
      <g stroke={C.hi} strokeWidth={2.8} strokeLinecap="round" fill="none">
        <path d="M30 70 l-10 -6 M26 86 l-12 -1 M170 70 l10 -6 M174 86 l12 -1 M100 22 v-12 M84 26 l-4 -10 M116 26 l4 -10" />
      </g>
    ),
  },
];
