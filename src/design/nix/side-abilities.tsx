import type { ReactNode } from "react";

import type { Mood } from "./rig/face";
import { FACE, FACE_SHADE } from "./side-candidates";
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
    id: "side-lamb",
    name: "Knit",
    line: "Draws a strand from its own fleece and knits it into a thing.",
    mood: "happy",
    fx: () => (
      <g>
        <path
          d="M122 186 C146 200 158 170 150 150 C144 134 156 124 160 132"
          stroke={C.hi}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <path d="M160 150 C140 132 146 110 160 118 C174 110 180 132 160 150 Z" fill={C.accent} />
        <path
          d="M150 122 l4 5 l4 -5 M158 122 l4 5 l4 -5 M154 131 l4 5 l4 -5 M162 131 l4 5 l4 -5"
          stroke={C.accentDeep}
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
        />
        <path d="M142 106 L176 146 M178 106 L144 146" stroke={C.deep} strokeWidth={2.6} strokeLinecap="round" />
      </g>
    ),
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
    id: "side-axolotl",
    name: "Mend",
    line: "Puts a broken thing back together. It regrows what it loses, so it knows how.",
    mood: "happy",
    fx: () => (
      <g>
        <path
          d="M164 88 L170 104 L187 104 L174 114 L179 131 L164 121 L149 131 L154 114 L141 104 L158 104 Z"
          fill={C.accent}
        />
        <path d="M164 90 L160 102 L167 110 L161 120 L164 124" stroke={C.accentDeep} strokeWidth={1.8} fill="none" />
        <g transform="rotate(-28 164 110)">
          <rect x={152} y={105} width={24} height={10} rx={4} fill={FACE} />
          <circle cx={161} cy={110} r={1} fill={FACE_SHADE} />
          <circle cx={167} cy={110} r={1} fill={FACE_SHADE} />
        </g>
      </g>
    ),
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
    id: "side-amara",
    name: "Telescope",
    line: "Opens a telescope and looks at what is coming next.",
    mood: "curious",
    fx: () => (
      <g>
        <path d="M112 62 L150 44 L154 52 L116 70 Z" fill={C.deep} />
        <path d="M148 42 L176 30 L181 42 L153 54 Z" fill={C.primary} />
        <rect x={147} y={41} width={6} height={15} rx={2} transform="rotate(-25 150 48)" fill={C.accent} />
      </g>
    ),
  },
  {
    id: "side-wren",
    name: "Headphones",
    line: "Puts them on, and everything goes quiet: the one character for focus.",
    mood: "focused",
    fx: () => (
      <g>
        <path d="M50 108 C48 34 152 34 150 108" stroke={C.primary} strokeWidth={7} fill="none" strokeLinecap="round" />
        <rect x={40} y={94} width={16} height={30} rx={8} fill={C.accent} />
        <rect x={144} y={94} width={16} height={30} rx={8} fill={C.accent} />
      </g>
    ),
  },
  {
    id: "side-sloane",
    name: "Paper plane",
    line: "Folds a note and sends it where it needs to go.",
    mood: "happy",
    fx: () => (
      <g>
        <path
          d="M124 168 C150 150 146 110 170 92"
          stroke={C.hi}
          strokeWidth={2.4}
          strokeDasharray="3 6"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M166 90 L196 70 L180 98 Z" fill={C.tint} />
        <path d="M166 90 L196 70 L176 92 Z" fill={C.hi} />
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
