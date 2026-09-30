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
    id: "side-cloud",
    name: "Rain",
    line: "A small shower that waters what is below, so things grow. Never on an incorrect answer.",
    mood: "happy",
    fx: () => (
      <g fill={C.hi}>
        {[
          [70, 196],
          [92, 214],
          [114, 198],
          [132, 220],
          [80, 238],
          [106, 246],
          [124, 262],
        ].map(([x, y]) => (
          <path key={`${x}${y}`} d={`M${x} ${y} q-4 7 -4 10 a4 4 0 0 0 8 0 q0 -3 -4 -10 Z`} />
        ))}
      </g>
    ),
  },
  {
    id: "side-flower",
    name: "Sprout",
    line: "Plants a seed, and it grows.",
    mood: "curious",
    fx: () => (
      <g>
        <ellipse cx={164} cy={274} rx={22} ry={7} fill={C.deep} opacity={0.35} />
        <path d="M164 272 C164 258 162 250 166 238" stroke={C.deep} strokeWidth={3} fill="none" strokeLinecap="round" />
        <ellipse cx={156} cy={246} rx={9} ry={4.5} transform="rotate(-30 156 246)" fill={C.primary} />
        <ellipse cx={174} cy={238} rx={9} ry={4.5} transform="rotate(30 174 238)" fill={C.mid} />
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
    id: "side-squid",
    name: "Jet",
    line: "Squeezes and shoots off, mantle first, in a rush of water: the fastest in the cast.",
    turn: 35,
    scale: 0.85,
    mood: "delighted",
    fx: () => (
      <g fill={C.hi}>
        {[
          [40, 250, 6],
          [28, 272, 4.5],
          [54, 276, 3.5],
          [22, 240, 3],
          [46, 292, 2.6],
        ].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
        <path d="M60 230 l-26 18 M70 244 l-24 20" stroke={C.hi} strokeWidth={3} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "side-mushroom",
    name: "Umbrella",
    line: "Its cap keeps off the rain and shelters whatever stands under it.",
    mood: "happy",
    fx: () => (
      <g fill={C.hi}>
        {[
          [60, 2],
          [96, -6],
          [134, 4],
          [168, 60],
          [30, 58],
        ].map(([x, y]) => (
          <path key={`${x}${y}`} d={`M${x} ${y} q-4 7 -4 10 a4 4 0 0 0 8 0 q0 -3 -4 -10 Z`} />
        ))}
        <path d="M24 100 l-5 -5 M24 100 l0 -7 M176 100 l5 -5 M176 100 l0 -7" stroke={C.hi} strokeWidth={2.2} strokeLinecap="round" />
      </g>
    ),
    viewBox: "0 -20 200 320",
  },
  {
    id: "side-poodle",
    name: "Fetch",
    line: "Runs off and brings the thing back.",
    mood: "happy",
    fx: () => (
      <g>
        <path d="M150 116 h22 M146 128 h28 M152 140 h18" stroke={C.hi} strokeWidth={3} strokeLinecap="round" />
        <circle cx={100} cy={128} r={9} fill={C.accent} />
        <path d="M92 124 Q100 130 108 124" stroke={C.accentDeep} strokeWidth={1.8} fill="none" />
      </g>
    ),
  },
  {
    id: "side-pufferfish",
    name: "Puff up",
    line: "Gulps and swells into a spiky ball, then lets it out again: surprise, made visible.",
    mood: "curious",
    fx: () => (
      <g fill={C.primary}>
        {Array.from({ length: 22 }, (_, i) => {
          const r = (i / 22) * Math.PI * 2;
          const [ox, oy] = [Math.cos(r), Math.sin(r)];
          const [cx, cy] = [100 + ox * 52, 112 + oy * 52];
          return (
            <path
              key={i}
              d={`M${cx - oy * 5} ${cy + ox * 5} L${cx + ox * 12} ${cy + oy * 12} L${cx + oy * 5} ${cy - ox * 5} Z`}
            />
          );
        })}
      </g>
    ),
  },
  {
    id: "side-chick",
    name: "Shell",
    line: "When it is shy, it ducks down into its eggshell, and pops out again.",
    mood: "worried",
    fx: () => (
      <path
        d="M50 100 L58 110 L66 100 L74 110 L82 100 L90 110 L98 100 L106 110 L114 100 L122 110 L130 100 L138 110 L146 100 L151 104 C150 60 128 40 100 40 C72 40 50 60 50 100 Z"
        fill="#efd8c6"
        transform="rotate(-10 100 80)"
      />
    ),
  },
  {
    id: "side-wren",
    name: "Nap",
    line: "Dozes off anywhere — standing up, mid-sentence — and wakes with a start. For a long wait.",
    mood: "focused",
    fx: () => (
      <g>
        <circle cx={124} cy={120} r={8} fill={C.tint} opacity={0.85} />
        <circle cx={122} cy={117} r={2} fill="#ffffff" />
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
