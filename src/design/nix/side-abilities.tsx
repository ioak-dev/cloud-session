import type { ReactNode } from "react";

import type { Mood } from "./rig/face";

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
    id: "side-penguin",
    name: "Slide",
    line: "Drops onto its belly and slides to where it is going.",
    turn: 90,
    scale: 0.8,
    mood: "delighted",
    fx: () => (
      <g stroke={C.hi} strokeWidth={3.4} strokeLinecap="round">
        <path d="M18 132 h26 M10 150 h34 M20 168 h24" />
      </g>
    ),
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
    id: "side-jellyfish",
    name: "See-through",
    line: "Its bell is clear, so whatever it carries shows through.",
    mood: "happy",
    fx: () => (
      <g>
        <circle cx={100} cy={59} r={15} fill={C.tint} opacity={0.75} />
        <path
          d="M100 48 L103.5 55 L111 56 L105.5 61 L107 68.5 L100 65 L93 68.5 L94.5 61 L89 56 L96.5 55 Z"
          fill={C.accent}
        />
      </g>
    ),
  },
  {
    id: "side-chick",
    name: "Shell",
    line: "When it is shy, it ducks down into its eggshell until only its eyes show, and pops out again.",
    mood: "worried",
    fx: () => (
      <g>
        <path
          d="M46 132 L56 122 L66 132 L76 122 L86 132 L96 122 L106 132 L116 122 L126 132 L136 122 L146 132 L154 126 C158 190 132 222 100 222 C68 222 42 190 46 132 Z"
          fill="#f6e7d6"
        />
        <circle cx={78} cy={176} r={3} fill={C.hi} />
        <circle cx={120} cy={186} r={2.6} fill={C.hi} />
      </g>
    ),
  },
  {
    id: "side-lulu",
    name: "Peekaboo",
    line: "Peeks over the edge of anything — a card, a heading — just her eyes and fingers showing.",
    mood: "curious",
    fx: () => (
      <g>
        <rect x={10} y={146} width={180} height={160} rx={12} fill={C.soft} />
        <ellipse cx={74} cy={147} rx={7} ry={5} fill="#f7dcca" />
        <ellipse cx={126} cy={147} rx={7} ry={5} fill="#f7dcca" />
      </g>
    ),
  },
  {
    id: "side-mimi",
    name: "Tiptoe",
    line: "Sneaks in, spy-style, on tiptoe — and is suddenly there.",
    turn: -6,
    mood: "thinking",
    fx: () => (
      <g fill={C.hi}>
        {[
          [30, 288],
          [46, 280],
          [18, 272],
          [36, 264],
        ].map(([x, y]) => (
          <ellipse key={`${x}${y}`} cx={x} cy={y} rx={4} ry={2.6} />
        ))}
      </g>
    ),
  },
  {
    id: "side-pia",
    name: "Statue",
    line: "Freezes mid-move, like the game, and holds it until it is her turn: the one for waiting.",
    mood: "focused",
    turn: 6,
    fx: () => (
      <g stroke={C.hi} strokeWidth={3} fill="none" strokeLinecap="round">
        <path d="M34 40 v-16 h16 M166 40 v-16 h-16 M34 268 v16 h16 M166 268 v16 h-16" />
      </g>
    ),
  },
  {
    id: "side-nell",
    name: "Twirl",
    line: "Spins on the spot, twin tails flying.",
    mood: "delighted",
    fx: () => (
      <g stroke={C.hi} strokeWidth={3} fill="none" strokeLinecap="round">
        <path d="M40 226 A60 14 0 0 0 160 226" />
        <path d="M52 238 A48 11 0 0 0 148 238" strokeDasharray="3 7" />
        <path d="M20 96 q-8 10 -2 22 M180 96 q8 10 2 22" />
      </g>
    ),
  },
  {
    id: "side-koko",
    name: "Hiccup",
    line: "Gets the hiccups, and hops a little with each one.",
    mood: "oops",
    viewBox: "0 14 200 300",
    fx: () => (
      <g stroke={C.hi} strokeWidth={3} fill="none" strokeLinecap="round">
        <path d="M78 300 l-6 8 M100 302 v10 M122 300 l6 8" />
        <path d="M150 58 l8 -8 M156 72 l11 -2" />
      </g>
    ),
  },
  {
    id: "side-tami",
    name: "Daydream",
    line: "Drifts off, eyes up and away, and a small cloud of a thought appears — then she is back.",
    mood: "thinking",
    viewBox: "0 -20 200 320",
    fx: () => (
      <g fill={C.hi}>
        <circle cx={140} cy={46} r={4} />
        <circle cx={150} cy={30} r={6} />
        <circle cx={166} cy={6} r={14} />
        <circle cx={182} cy={0} r={11} />
        <circle cx={152} cy={-2} r={10} />
        <circle cx={170} cy={-12} r={12} />
      </g>
    ),
  },
  {
    id: "panda",
    name: "Balance",
    line: "Balances anything on its head and tail: a proposal for the backup red panda.",
    viewBox: TALL,
    mood: "focused",
    fx: () => (
      <g>
        <rect x={76} y={26} width={48} height={12} rx={2} fill={C.accent} />
        <circle cx={100} cy={12} r={13} fill={C.primary} />
        <rect x={90} y={-20} width={20} height={20} rx={3} fill={C.mid} />
      </g>
    ),
  },
];
