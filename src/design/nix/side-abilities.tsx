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
  /** Drawn in the head's own space, so it moves with the head (a change to the face). */
  head?: () => ReactNode;
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
    fx: () => null,
    /* drawn on her face, in her head's own space, so the eyes move with her head */
    head: () => (
      <g>
        {[82, 118].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={109} rx={12} ry={13.4} fill="#fffdf8" />
            <circle cx={x} cy={111} r={10.2} fill="#7b5cc4" />
            <ellipse cx={x} cy={116} rx={7.4} ry={4} fill="#a98ce0" />
            <circle cx={x} cy={111} r={4.4} fill="#241a2e" />
            <circle cx={x - 4} cy={106.4} r={3.8} fill="#fffdf8" />
            <circle cx={x + 4} cy={106} r={2} fill="#fffdf8" />
            <circle cx={x + 3.2} cy={115.4} r={1.6} fill="#fffdf8" />
            <circle cx={x - 3} cy={116.6} r={1.2} fill="#fffdf8" />
            <path d={`M${x - 10} 120 Q${x} 124.5 ${x + 10} 120`} stroke="#9fd4f2" strokeWidth={2.2} fill="none" strokeLinecap="round" />
            <path d={`M${x - 12} 108 A12 13.4 0 0 1 ${x + 12} 108`} stroke="#2a1d22" strokeWidth={2.8} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* brows up in the middle: please */}
        <path d="M74 91 Q80 86 88 88 M126 91 Q120 86 112 88" stroke={"#c9894a"} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "side-sunny",
    name: "Hair",
    line: "Her impossibly long hair is part of her: it curls with her feelings, and whips out like a rope to catch what she reaches for.",
    mood: "delighted",
    fx: () => null,
    /* the hair is hers, so it rides her head */
    head: () => (
      <g>
        <path d="M140 100 C176 92 196 60 180 40 C168 26 146 40 158 54 C166 64 184 58 190 46" stroke="#e3a94a" strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d="M146 98 C170 90 186 72 184 56" stroke="#f6d489" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "side-poppy",
    name: "Dance",
    line: "When she is happy it comes out of her: a spin, a stamp and a flourish.",
    mood: "delighted",
    pose: "cheer",
    turn: -6,
    fx: () => (
      <g stroke={C.hi} strokeWidth={2.8} strokeLinecap="round" fill="none">
        <path d="M44 272 A56 12 0 0 0 156 272" strokeDasharray="3 7" />
        <path d="M30 150 q-8 10 -2 22 M170 150 q8 10 2 22 M26 118 l-8 -4 M174 118 l8 -4" />
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
