import type { ReactNode } from "react";

import type { Mood } from "./rig/face";
import type { Pose, PoseId } from "./rig/poses";
import { rot } from "./rig/motion";

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
  /** A class from `studio.css` moving the whole figure (a spin). */
  move?: string;
  /** A one-off act for the rig, when the ability is a whole-body gesture. */
  act?: Pose;
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
    id: "new-frog",
    name: "Throat balloon",
    line: "When he is bursting to say something, the pale throat under his chin swells up round like a balloon.",
    mood: "delighted",
    fx: () => null,
    head: () => (
      <g className="fx fx-grow">
        <ellipse cx={101.5} cy={154} rx={31} ry={24} fill={C.hi} />
        <ellipse cx={100} cy={152} rx={30} ry={23} fill={C.tint} />
        <path d="M80 142 Q88 136 98 136" stroke="#ffffff" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "new-goat",
    name: "Climb",
    line: "Scrambles up onto the top of anything — a card, a heading — and stands there, proud.",
    mood: "delighted",
    viewBox: "0 26 200 300",
    behind: true,
    fx: () => (
      <g>
        <rect x={34} y={282} width={132} height={20} rx={6} fill={C.hi} />
        <rect x={48} y={302} width={104} height={20} rx={6} fill={C.mid} />
      </g>
    ),
  },
  {
    id: "new-tortoise",
    name: "Shell spin",
    line: "Flips onto his back and spins on his shell like a breakdancer — then pretends it never happened.",
    mood: "delighted",
    move: "fx fx-spin",
    scale: 0.78,
    fx: () => (
      <g stroke={C.hi} strokeWidth={3} strokeLinecap="round" fill="none">
        <path d="M22 150 A80 80 0 0 1 60 72 M178 150 A80 80 0 0 1 140 228" />
      </g>
    ),
  },
  {
    id: "new-robot",
    name: "Screen face",
    line: "Its face is a screen, so it can become any shape — here, a pair of hearts it is very proud of.",
    mood: "happy",
    fx: () => null,
    head: () => (
      <g>
        <rect x={66} y={62} width={68} height={66} rx={12} fill="#1c2242" />
        {[82, 118].map((x) => (
          <path
            key={x}
            d={`M${x} ${104} l-10 -10 a6 6 0 0 1 10 -7 a6 6 0 0 1 10 7 Z`}
            fill="#ff8fb0"
            className="fx fx-grow"
          />
        ))}
        <path d="M88 114 q12 8 24 0" stroke="#9fe2ff" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "new-boy",
    name: "Drama",
    line: "Every feeling at full size — here, the swoon: a hand to his brow, the other flung out, overcome.",
    mood: "happy",
    act: {
      id: "idle",
      title: "",
      use: "",
      mood: "happy",
      hands: [{ L: [60, 150], R: [116, 126], outR: true }],
      motion: { duration: 2.4, tracks: { torso: rot(-6, -10, -6), head: rot(-8, -14, -8) } },
    },
    fx: () => null,
  },
];
