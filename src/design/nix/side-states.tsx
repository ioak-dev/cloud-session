import type { ReactNode } from "react";

import type { Mood } from "./rig/face";
import { lift, rot, squash, type Hands, type Motion } from "./rig/motion";
import type { Pose } from "./rig/poses";
import { C } from "./theme";

/**
 * The practice states: how each side character reacts while a learner answers a question, and to
 * the answer. Four states, five variants each, so the reaction is never the same twice in a row:
 *
 *   writing   — the question is up and the learner is still writing
 *   correct   — the answer is right
 *   incorrect — the answer is wrong; always gentle, never a scold
 *   partial   — the answer is partly right; “nearly”
 *
 * Every character uses three kinds of variant: its own `feature` (what only it has), `body` (face
 * and body acting) and a `prop`. Across the cast no two characters share an action or a prop —
 * only facial expressions may repeat. See `docs/cast.md`.
 *
 * A variant is data: a mood, an act for the rig (joint keyframes and arm targets on one clock),
 * whole-figure moves and effects as declared CSS keyframes (`.fx-*` in `studio.css`), and drawings
 * over, behind or on the head. Everything stops under reduced motion.
 */

export type PracticeState = "writing" | "correct" | "incorrect" | "partial";
export type Kind = "feature" | "body" | "prop";

export type Variant = {
  state: PracticeState;
  kind: Kind;
  title: string;
  line: string;
  act: Pose;
  /** A class from `studio.css` moving the whole figure: `fx-cartwheel`, `fx-hang`… */
  move?: string;
  /** A static turn or scale of the whole figure. */
  turn?: number;
  scale?: number;
  /** The chameleon's colour: a filter on the figure itself, so only the character changes
   *  (`half`: only its top half). */
  tint?: { filter: string; half?: boolean };
  /** A filter animation on the figure (the rainbow ripple). */
  figureClass?: string;
  /** Drawings in figure space, over or behind the figure; in head space, on the face. */
  over?: () => ReactNode;
  behind?: () => ReactNode;
  head?: () => ReactNode;
  viewBox?: string;
};

export type Sheet = { id: string; variants: Variant[] };

export const STATES: { id: PracticeState; title: string; use: string }[] = [
  { id: "writing", title: "Still writing", use: "The question is up; the learner is writing their answer." },
  { id: "correct", title: "Correct", use: "The answer is right." },
  { id: "incorrect", title: "Incorrect", use: "The answer is wrong. Always gentle: never a scold." },
  { id: "partial", title: "Partly correct", use: "Some of it is right: nearly." },
];

/* ——— Building acts ——— */

type Tracks = Motion["tracks"];
const REST: Hands = { L: [76, 206], R: [124, 206] };

function act(mood: Mood, duration: number, tracks: Tracks = {}, hands: Hands[] = [REST]): Pose {
  return { id: "idle", title: "", use: "", mood, hands, motion: { duration, tracks } };
}

/** A small breath so no act is ever dead still. */
const breathe = (k = 1): Tracks => ({ torso: lift(0, -1.2 * k, 0), shadow: squash([1, 1], [0.97, 1], [1, 1]) });
const hop = (h: number, n = 1): Tracks => ({
  root: lift(...Array.from({ length: n }, () => [0, -h]).flat(), 0),
  shadow: squash(...Array.from({ length: n }, () => [[1, 1], [0.8, 1]] as [number, number][]).flat(), [1, 1]),
});

const fx = (cls: string, children: ReactNode, extra = "") => <g className={`fx ${cls} ${extra}`}>{children}</g>;

/* ——— Props: small, flat, in the product's colours and a few of their own ——— */

const WOOD = "#b98a5a";
const CREAM = "#fff3de";
const INK = "#2a1d22";

function Hourglass({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 9} y={y - 16} width={18} height={4} rx={2} fill={WOOD} />
      <rect x={x - 9} y={y + 12} width={18} height={4} rx={2} fill={WOOD} />
      <path d={`M${x - 7} ${y - 12} L${x + 7} ${y - 12} L${x + 1.5} ${y} L${x + 7} ${y + 12} L${x - 7} ${y + 12} L${x - 1.5} ${y} Z`} fill={C.tint} />
      <path d={`M${x - 5} ${y + 12} Q${x} ${y + 5} ${x + 5} ${y + 12} Z`} fill={C.accent} />
      {fx("fx-fall fx-slow", <circle cx={x} cy={y + 2} r={1} fill={C.accent} />)}
    </g>
  );
}

function PartyHorn({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x + 26} ${y - 8} L${x + 26} ${y + 8} Z`} fill={C.accent} />
      <path d={`M${x + 8} ${y - 3} l0 6 M${x + 16} ${y - 5} l0 10`} stroke={C.primary} strokeWidth={2} />
      {fx("fx-grow", <path d={`M${x + 26} ${y} q10 -10 16 0 q6 10 12 0`} stroke={C.primary} strokeWidth={3} fill="none" strokeLinecap="round" />)}
    </g>
  );
}

function Eraser({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`rotate(-20 ${x} ${y})`}>
      <rect x={x - 12} y={y - 6} width={24} height={12} rx={3} fill="#f19aa8" />
      <rect x={x + 2} y={y - 6} width={10} height={12} rx={2} fill={C.primary} />
    </g>
  );
}

function PuzzlePiece({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 10} ${y - 10} h7 a3.5 3.5 0 1 1 6 0 h7 v7 a3.5 3.5 0 1 1 0 6 v7 h-20 Z`}
      fill={C.accent}
    />
  );
}

function Bubble({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={C.tint} fillOpacity={0.5} stroke={C.hi} strokeWidth={1.6} />
      <path d={`M${x - r * 0.5} ${y - r * 0.3} a${r * 0.5} ${r * 0.5} 0 0 1 ${r * 0.4} -${r * 0.35}`} stroke="#fff" strokeWidth={1.6} fill="none" />
    </g>
  );
}

function Fruit({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 11} ${y} a11 11 0 0 0 22 0 Z`} fill="#f2a33a" />
      <path d={`M${x - 8} ${y} a8 7 0 0 0 16 0 Z`} fill="#ffd27a" />
      <path d={`M${x - 11} ${y} h22`} stroke="#7aa84a" strokeWidth={2.4} />
    </g>
  );
}

function Teacup({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 10} ${y - 4} h20 v6 a10 9 0 0 1 -20 0 Z`} fill={CREAM} />
      <path d={`M${x + 10} ${y - 1} a5 5 0 0 1 0 8`} stroke={CREAM} strokeWidth={3} fill="none" />
      <ellipse cx={x} cy={y - 4} rx={10} ry={2.4} fill="#b77a4a" />
      {fx("fx-float", <path d={`M${x - 3} ${y - 10} q-3 -5 0 -10 M${x + 3} ${y - 10} q3 -5 0 -10`} stroke={C.hi} strokeWidth={2} fill="none" strokeLinecap="round" />)}
    </g>
  );
}

function Magnifier({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x + 8} y1={y + 8} x2={x + 18} y2={y + 18} stroke={WOOD} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x} cy={y} r={11} fill={C.tint} fillOpacity={0.55} stroke={C.deep} strokeWidth={3.4} />
    </g>
  );
}

function OpenBook({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y - 10} L${x - 20} ${y - 13} L${x - 20} ${y + 8} L${x} ${y + 11} Z`} fill={CREAM} />
      <path d={`M${x} ${y - 10} L${x + 20} ${y - 13} L${x + 20} ${y + 8} L${x} ${y + 11} Z`} fill="#f4e6cc" />
      <path d={`M${x - 20} ${y + 8} L${x} ${y + 11} L${x + 20} ${y + 8} L${x + 20} ${y + 11} L${x} ${y + 14} L${x - 20} ${y + 11} Z`} fill={C.primary} />
    </g>
  );
}

function Pencil({ x, y, a = -30 }: { x: number; y: number; a?: number }) {
  return (
    <g transform={`rotate(${a} ${x} ${y})`}>
      <rect x={x - 14} y={y - 3} width={22} height={6} fill={C.accent} />
      <path d={`M${x + 8} ${y - 3} L${x + 15} ${y} L${x + 8} ${y + 3} Z`} fill="#f2d2a6" />
      <path d={`M${x + 13} ${y - 1} L${x + 15} ${y} L${x + 13} ${y + 1} Z`} fill={INK} />
      <rect x={x - 18} y={y - 3} width={4} height={6} rx={1} fill="#f19aa8" />
    </g>
  );
}

function Balloon({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} q-6 -20 2 -40`} stroke={C.deep} strokeWidth={1.4} fill="none" />
      {fx(
        "fx-bob",
        <g>
          <ellipse cx={x + 2} cy={y - 54} rx={14} ry={17} fill={C.accent} />
          <path d={`M${x} ${y - 37} l2 3 l2 -3 Z`} fill={C.accent} />
          <path d={`M${x - 5} ${y - 62} q3 -5 8 -5`} stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>,
      )}
    </g>
  );
}

function Pillow({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 20} ${y - 12} Q${x} ${y - 18} ${x + 20} ${y - 12} Q${x + 24} ${y} ${x + 20} ${y + 12} Q${x} ${y + 18} ${x - 20} ${y + 12} Q${x - 24} ${y} ${x - 20} ${y - 12} Z`} fill={C.tint} />
      <path d={`M${x - 8} ${y - 2} q8 5 16 0`} stroke={C.hi} strokeWidth={1.6} fill="none" />
    </g>
  );
}

function HalfGlass({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 9} ${y - 14} h18 l-2 28 h-14 Z`} fill={C.tint} fillOpacity={0.6} />
      <path d={`M${x - 8} ${y} h16 l-1 14 h-14 Z`} fill={C.hi} />
      <path d={`M${x - 9} ${y - 14} h18`} stroke={C.hi} strokeWidth={1.6} />
    </g>
  );
}

function WaterBottle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 6} y={y - 16} width={12} height={28} rx={4} fill={C.primary} />
      <rect x={x - 4} y={y - 21} width={8} height={6} rx={2} fill={C.accent} />
      <rect x={x - 6} y={y - 4} width={12} height={5} fill={C.tint} />
    </g>
  );
}

function PomPom({ x, y }: { x: number; y: number }) {
  return fx(
    "fx-wiggle",
    <g>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <circle key={i} cx={x + Math.cos(a) * 7} cy={y + Math.sin(a) * 7} r={6} fill={i % 2 ? C.accent : C.primary} />;
      })}
      <circle cx={x} cy={y} r={6} fill={C.accent} />
    </g>,
  );
}

function Towel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 14} ${y - 12} h16 v34 h-16 Z`} fill={C.tint} />
      <path d={`M${x - 14} ${y + 16} h16`} stroke={C.hi} strokeWidth={2.4} />
    </g>
  );
}

function Baton({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`rotate(30 ${x} ${y})`}>
      <rect x={x - 16} y={y - 4} width={32} height={8} rx={4} fill={C.accent} />
      <rect x={x - 3} y={y - 4} width={6} height={8} fill={C.primary} />
    </g>
  );
}

function Peanut({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`rotate(-30 ${x} ${y})`}>
      <ellipse cx={x - 5} cy={y} rx={6.4} ry={5.4} fill="#d9a66a" />
      <ellipse cx={x + 5} cy={y} rx={6.4} ry={5.4} fill="#d9a66a" />
      <path d={`M${x - 8} ${y - 1} l2 2 M${x + 6} ${y - 2} l2 2 M${x - 3} ${y + 2} l2 1`} stroke="#b07f48" strokeWidth={1.2} />
    </g>
  );
}

function Lollipop({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 26} stroke={CREAM} strokeWidth={3} strokeLinecap="round" />
      {fx(
        "fx-spin",
        <g>
          <circle cx={x} cy={y - 34} r={11} fill={C.accent} />
          <path d={`M${x} ${y - 34} m-7 0 a7 7 0 0 1 14 0 a4.5 4.5 0 0 1 -9 0 a2 2 0 0 1 4 0`} stroke={C.primary} strokeWidth={2.4} fill="none" />
        </g>,
      )}
    </g>
  );
}

function StickyNote({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`rotate(-8 ${x} ${y})`}>
      <rect x={x - 13} y={y - 13} width={26} height={26} rx={2} fill={C.accent} />
      <path d={`M${x - 8} ${y - 4} h16 M${x - 8} ${y + 2} h12`} stroke={C.accentDeep} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function HalfCookie({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 12} ${y} a12 12 0 0 1 24 0 l-4 -2 l-3 4 l-4 -3 l-3 4 l-4 -3 l-3 3 Z`} fill="#d89a5a" transform={`rotate(-20 ${x} ${y})`} />
      <circle cx={x - 4} cy={y - 6} r={1.8} fill="#5a3420" />
      <circle cx={x + 4} cy={y - 4} r={1.6} fill="#5a3420" />
    </g>
  );
}

function Bamboo({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`rotate(-14 ${x} ${y})`}>
      <rect x={x - 3.5} y={y - 30} width={7} height={40} rx={3} fill="#9cc46a" />
      <path d={`M${x - 3.5} ${y - 16} h7 M${x - 3.5} ${y - 2} h7`} stroke="#6f9a44" strokeWidth={2} />
      <path d={`M${x + 3} ${y - 22} q10 -6 16 -2 q-8 6 -16 2 Z`} fill="#7ab04a" />
    </g>
  );
}

function MapleLeaf({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y - 12} l3 7 l6 -3 l-2 7 l7 1 l-6 4 l2 5 l-7 -2 l-3 6 l-3 -6 l-7 2 l2 -5 l-6 -4 l7 -1 l-2 -7 l6 3 Z`}
      fill="#e8743a"
    />
  );
}

function Blanket({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 36} ${y - 30} Q${x} ${y - 40} ${x + 36} ${y - 30} L${x + 40} ${y + 30} Q${x} ${y + 38} ${x - 40} ${y + 30} Z`} fill={C.hi} />
      <path d={`M${x - 36} ${y - 12} Q${x} ${y - 20} ${x + 38} ${y - 12} M${x - 38} ${y + 8} Q${x} ${y} ${x + 39} ${y + 8}`} stroke={C.tint} strokeWidth={4} fill="none" />
    </g>
  );
}

function Kite({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} Q${x + 20} ${y - 40} ${x + 34} ${y - 70}`} stroke={C.deep} strokeWidth={1.2} fill="none" />
      {fx(
        "fx-drift",
        <g>
          <path d={`M${x + 34} ${y - 94} l14 18 l-14 18 l-14 -18 Z`} fill={C.accent} />
          <path d={`M${x + 34} ${y - 94} v36 M${x + 20} ${y - 76} h28`} stroke={C.primary} strokeWidth={1.6} />
          <path d={`M${x + 34} ${y - 58} q-4 8 2 12 q6 4 0 10`} stroke={C.primary} strokeWidth={1.6} fill="none" />
        </g>,
      )}
    </g>
  );
}

/* ——— Small effect marks ——— */

const lines = (d: string, cls = "fx-pulse") => fx(cls, <path d={d} stroke={C.hi} strokeWidth={2.6} fill="none" strokeLinecap="round" />);
const BAR = <rect x={36} y={12} width={128} height={7} rx={3.5} fill={C.deep} opacity={0.6} />;

/* ——— The chameleon: its colour, its turret eyes, its tongue and tail, its grips ——— */

/* Its own violet turned to the green of correct, or to a soft, calm not-yet blue-grey. */
const GREEN = "hue-rotate(-118deg) saturate(1.15)";
const NOT_YET = "hue-rotate(-38deg) saturate(0.55) brightness(1.05)";

const chameleon: Variant[] = [
  { state: "writing", kind: "feature", title: "One eye each", line: "One turret eye reads the question, the other watches your pencil — and they swap.", act: act("thinking", 3, { head: rot(-4, 4, -4), ...breathe() }) },
  { state: "writing", kind: "feature", title: "Blends in", line: "It fades almost into the page so it won't distract you, then comes back.", act: act("focused", 3.2, breathe()), move: "fx fx-camo" },
  { state: "writing", kind: "body", title: "Chin tap", line: "Taps its chin with a grip, thinking along with you.", act: act("curious", 1.2, breathe(), [{ ...REST, R: [106, 160], outR: false }, { ...REST, R: [108, 166], outR: false }, { ...REST, R: [106, 160], outR: false }]) },
  { state: "writing", kind: "prop", title: "Tiny hourglass", line: "Holds a tiny hourglass and watches the sand, unhurried — take your time.", act: act("neutral", 3, breathe(), [{ L: [92, 192], R: [110, 192], outL: false, outR: false }]), over: () => <Hourglass x={101} y={186} /> },
  { state: "writing", kind: "body", title: "Hums and sways", line: "Sways gently on its bowed legs, humming to itself.", act: act("happy", 2.6, { torso: rot(-4, 4, -4), head: rot(3, -3, 3) }) },

  { state: "correct", kind: "feature", title: "Goes green", line: "Its whole body flushes the colour of correct — with the words beside it.", act: act("delighted", 1.4, hop(4)), tint: { filter: GREEN } },
  { state: "correct", kind: "feature", title: "Tongue snap", line: "Its long tongue flicks out and snaps up a floating bubble. Pop.", act: act("delighted", 1.4, breathe()), over: () => <g>{fx("fx-pop", <Bubble x={150} y={110} r={9} />)}{fx("fx-grow", <path d="M112 124 C128 124 140 116 148 112" stroke="#ef7f8e" strokeWidth={4} fill="none" strokeLinecap="round" />)}</g> },
  { state: "correct", kind: "body", title: "Grip clap", line: "Claps its two grips together, fast and happy.", act: act("happy", 0.5, breathe(), [{ L: [96, 176], R: [104, 176], outL: false, outR: false }, { L: [84, 180], R: [116, 180], outL: false, outR: false }, { L: [96, 176], R: [104, 176], outL: false, outR: false }]) },
  { state: "correct", kind: "prop", title: "Party horn", line: "Blows a party horn — once.", act: act("delighted", 1.2, breathe(), [{ ...REST, R: [106, 150], outR: false }]), over: () => <PartyHorn x={106} y={130} /> },
  { state: "correct", kind: "feature", title: "Rainbow ripple", line: "Colours ripple through it, one after another, from its crest to its tail.", act: act("delighted", 2, breathe()), figureClass: "fx fx-hue" },

  { state: "incorrect", kind: "feature", title: "Not-yet blue", line: "It turns a soft, calm blue-grey — the not-yet colour, never an alarm red.", act: act("worried", 3, breathe()), tint: { filter: NOT_YET } },
  { state: "incorrect", kind: "body", title: "Fist bump", line: "Holds out a grip for a fist bump: next one.", act: act("happy", 2, breathe(), [{ ...REST, R: [146, 176] }, { ...REST, R: [150, 176] }, { ...REST, R: [146, 176] }]) },
  { state: "incorrect", kind: "feature", title: "Tail tucks", line: "Its tail curls in tight, a bit sheepish, then relaxes.", act: act("oops", 2.4, { tail: rot(0, -24, -24, 0), ...breathe() }) },
  { state: "incorrect", kind: "prop", title: "Eraser", line: "Holds up a little eraser: we can rub that out.", act: act("curious", 2, breathe(), [{ ...REST, R: [128, 150] }]), over: () => fx("fx-shake", <Eraser x={132} y={138} />) },
  { state: "incorrect", kind: "body", title: "Shrug", line: "A small shrug and one eye rolled up — tricky one.", act: act("thinking", 1.8, { torso: lift(0, -3, 0), head: rot(0, -8, 0) }, [{ L: [70, 196], R: [130, 196] }, { L: [56, 180], R: [144, 180] }, { L: [70, 196], R: [130, 196] }]) },

  { state: "partial", kind: "feature", title: "Half green", line: "Only its top half turns green: part of it is right.", act: act("curious", 2.4, breathe()), tint: { filter: GREEN, half: true } },
  { state: "partial", kind: "feature", title: "Tail points", line: "Its tail uncurls and points to the part you got right.", act: act("happy", 2, { tail: rot(0, 30, 30, 0), ...breathe() }) },
  { state: "partial", kind: "body", title: "So-so", line: "Rocks a flat grip side to side: so-so.", act: act("thinking", 0.9, breathe(), [{ ...REST, R: [140, 170] }, { ...REST, R: [142, 162] }, { ...REST, R: [140, 170] }]) },
  { state: "partial", kind: "prop", title: "Puzzle piece", line: "Holds up one puzzle piece: just this bit to go.", act: act("curious", 2, breathe(), [{ ...REST, R: [132, 150] }]), over: () => fx("fx-bob", <PuzzlePiece x={136} y={140} />) },
  { state: "partial", kind: "body", title: "Hides a giggle", line: "Covers its mouth with a grip, giggling: so close!", act: act("happy", 0.8, { torso: lift(0, -1.6, 0) }, [{ ...REST, R: [104, 150], outR: false }]) },
];

/* ——— The fruit bat: hanging, its ears, its wings ——— */

const bat: Variant[] = [
  { state: "writing", kind: "feature", title: "Hangs and waits", line: "Hangs upside down from the top of the card, swaying gently while you write.", act: act("neutral", 3, breathe()), move: "fx fx-hang", over: () => BAR },
  { state: "writing", kind: "feature", title: "Ears swivel", line: "Its tall ears swivel, listening for your answer.", act: act("curious", 2.4, { earL: rot(0, -14, 8, 0), earR: rot(0, 8, -14, 0), ...breathe() }) },
  { state: "writing", kind: "body", title: "Dozes", line: "Heavy-lidded, it nods off a little and jerks awake — it's daytime, after all.", act: act("focused", 3.4, { head: rot(0, 0, 10, 12, 0), ...breathe() }) },
  { state: "writing", kind: "prop", title: "Reads", line: "Reads a tiny book of its own, waiting quietly.", act: act("thinking", 3, breathe(), [{ L: [90, 190], R: [110, 190], outL: false, outR: false }]), over: () => <OpenBook x={100} y={186} /> },
  { state: "writing", kind: "body", title: "Foot tap", line: "Taps one foot, patient, keeping time.", act: act("neutral", 0.8, { kneeR: rot(0, -10, 0), hipR: rot(0, 4, 0) }) },

  { state: "correct", kind: "feature", title: "Wing flutter", line: "Throws its wings wide and flutters them.", act: act("delighted", 0.6, { wingL: rot(0, -30, 0), wingR: rot(0, 30, 0), ...hop(3) }) },
  { state: "correct", kind: "feature", title: "Ears shoot up", line: "Its ears shoot straight up and quiver.", act: act("delighted", 1, { earL: rot(0, 12, 8, 12, 0), earR: rot(0, -12, -8, -12, 0), ...breathe() }) },
  { state: "correct", kind: "body", title: "Shimmy", line: "A happy shoulder shimmy.", act: act("happy", 0.5, { torso: rot(-4, 4, -4), head: rot(4, -4, 4) }) },
  { state: "correct", kind: "body", title: "Hugs itself", line: "Hugs itself, squeezing with delight.", act: act("happy", 1.2, { torso: squash([1, 1], [1.04, 0.97], [1, 1]) }, [{ L: [112, 176], R: [88, 176], outL: false, outR: false }]) },
  { state: "correct", kind: "prop", title: "Mango", line: "Takes a happy bite of a mango slice.", act: act("delighted", 1.6, breathe(), [{ ...REST, R: [110, 150], outR: false }]), over: () => fx("fx-bob", <Fruit x={112} y={140} />) },

  { state: "incorrect", kind: "feature", title: "Ears droop", line: "Its ears droop gently — oh — then lift again.", act: act("worried", 2.6, { earL: rot(0, -30, -30, 0), earR: rot(0, 30, 30, 0), ...breathe() }) },
  { state: "incorrect", kind: "feature", title: "Peeks over a wing", line: "Pulls a wing up to its nose and peeks over it, kindly.", act: act("oops", 2.4, { wingR: rot(0, -40, -40, 0), ...breathe() }) },
  { state: "incorrect", kind: "body", title: "Scratches its head", line: "Scratches its head: hm, let's look again.", act: act("thinking", 0.7, breathe(), [{ ...REST, R: [128, 118] }, { ...REST, R: [124, 112] }, { ...REST, R: [128, 118] }]) },
  { state: "incorrect", kind: "prop", title: "Cup of tea", line: "Offers you a cup of tea. No rush.", act: act("happy", 2.6, breathe(), [{ ...REST, R: [134, 176] }]), over: () => <Teacup x={138} y={172} /> },
  { state: "incorrect", kind: "body", title: "Taps its temple", line: "Taps its temple: think it through.", act: act("curious", 0.8, breathe(), [{ ...REST, R: [126, 124] }, { ...REST, R: [124, 128] }, { ...REST, R: [126, 124] }]) },

  { state: "partial", kind: "feature", title: "Sees it sideways", line: "Tips itself right over to look at your answer from another angle.", act: act("curious", 2.4, breathe()), turn: 70, scale: 0.86 },
  { state: "partial", kind: "feature", title: "One ear up", line: "One ear up, one ear down: half there.", act: act("thinking", 2.4, { earL: rot(0, 10, 10, 0), earR: rot(0, 30, 30, 0), ...breathe() }) },
  { state: "partial", kind: "body", title: "Slow wink", line: "Gives you a slow, knowing wink.", act: act("wink", 2.4, breathe()) },
  { state: "partial", kind: "prop", title: "Magnifier", line: "Looks closer through a magnifying glass.", act: act("curious", 2, breathe(), [{ ...REST, R: [126, 132] }]), over: () => fx("fx-bob", <Magnifier x={120} y={116} />) },
  { state: "partial", kind: "body", title: "Counts on its fingers", line: "Counts on its fingers: one, two… nearly all.", act: act("thinking", 1.6, breathe(), [{ L: [88, 180], R: [112, 176], outL: false, outR: false }, { L: [88, 180], R: [112, 184], outL: false, outR: false }, { L: [88, 180], R: [112, 176], outL: false, outR: false }]) },
];

/* ——— The chick: its fluff, its shell, its tuft and beak ——— */

const SHELL = "#f6e7d6";
const shellFront = (top: number) => (
  <g>
    <path
      d={`M46 ${top} L56 ${top - 10} L66 ${top} L76 ${top - 10} L86 ${top} L96 ${top - 10} L106 ${top} L116 ${top - 10} L126 ${top} L136 ${top - 10} L146 ${top} L154 ${top - 6} C158 ${top + 60} 132 222 100 222 C68 222 42 ${top + 60} 46 ${top} Z`}
      fill={SHELL}
    />
    <circle cx={78} cy={top + 40} r={3} fill={C.hi} />
    <circle cx={120} cy={top + 48} r={2.6} fill={C.hi} />
  </g>
);
const fluffHalo = (from = 170, to = 370) => (
  <g fill={C.hi}>
    {Array.from({ length: 16 }, (_, i) => {
      const a = ((from + ((to - from) * i) / 15) * Math.PI) / 180;
      return <circle key={i} cx={100 + Math.cos(a) * 60} cy={124 + Math.sin(a) * 58} r={13} />;
    })}
  </g>
);

const chick: Variant[] = [
  { state: "writing", kind: "feature", title: "Shell peek", line: "Sinks into its shell up to its eyes and watches you write.", act: act("curious", 3, breathe()), over: () => shellFront(140) },
  { state: "writing", kind: "feature", title: "Tuft bobs", line: "Its tuft bobs as it nods along with your pencil.", act: act("curious", 1.2, { head: rot(-3, 5, -3), ...breathe() }) },
  { state: "writing", kind: "body", title: "On tiptoe", line: "Stretches up on its thin legs to see.", act: act("curious", 2.4, { root: lift(0, -8, -8, 0), shadow: squash([1, 1], [0.86, 1], [0.86, 1], [1, 1]) }) },
  { state: "writing", kind: "prop", title: "Chews a pencil", line: "Nibbles the end of a tiny pencil, thinking hard.", act: act("thinking", 1.6, breathe()), over: () => fx("fx-wiggle", <Pencil x={124} y={140} a={-20} />) },
  { state: "writing", kind: "body", title: "Rocks on its heels", line: "Rocks back and forth on its heels, eager.", act: act("neutral", 1.4, { root: rot(-4, 4, -4) }) },

  { state: "correct", kind: "feature", title: "Fluff up!", line: "Fluffs every feather out into a round ball, twice its size.", act: act("delighted", 1.6, { torso: squash([1, 1], [1.06, 1.06], [1, 1]) }), behind: () => fx("fx-grow", fluffHalo()) },
  { state: "correct", kind: "feature", title: "Hatch hop", line: "Hops right out of its shell and back in.", act: act("delighted", 1.2, hop(18)) },
  { state: "correct", kind: "body", title: "Bounces", line: "Little happy bounces on the spot.", act: act("happy", 0.6, hop(6, 2)) },
  { state: "correct", kind: "prop", title: "Balloon", line: "Holds a balloon that bobs above it.", act: act("happy", 2, breathe()), over: () => <Balloon x={142} y={160} /> },
  { state: "correct", kind: "feature", title: "Cheep!", line: "Opens its beak wide: cheep!", act: act("delighted", 1, { head: rot(0, -6, 0), ...breathe() }), over: () => lines("M136 120 l10 -4 M138 132 l11 1 M136 144 l10 5") },

  { state: "incorrect", kind: "feature", title: "Tuft droops", line: "Its tuft droops, then perks back up.", act: act("worried", 2.6, breathe()) },
  { state: "incorrect", kind: "feature", title: "Shell hide", line: "Ducks right down into its shell — only its tuft showing — then peeks out again.", act: act("oops", 2.8, breathe()), move: "fx fx-duck", over: () => shellFront(150) },
  { state: "incorrect", kind: "body", title: "Wobble", line: "Wobbles on its thin legs, and steadies itself.", act: act("oops", 1.4, { root: rot(0, -6, 5, -3, 0) }) },
  { state: "incorrect", kind: "prop", title: "Pillow", line: "Hugs a small pillow for a second.", act: act("worried", 2.4, breathe()), over: () => <Pillow x={100} y={170} /> },
  { state: "incorrect", kind: "body", title: "Little sigh", line: "A little sigh — it deflates — then it sets its beak and tries again.", act: act("focused", 2.4, { torso: squash([1, 1], [1.04, 0.94], [1, 1]) }) },

  { state: "partial", kind: "feature", title: "Half fluffed", line: "Fluffs up on one side only.", act: act("curious", 2, breathe()), behind: () => fx("fx-grow", fluffHalo(250, 370)) },
  { state: "partial", kind: "feature", title: "Half in its shell", line: "Sinks halfway into its shell: halfway there.", act: act("thinking", 2.4, breathe()), over: () => shellFront(146) },
  { state: "partial", kind: "body", title: "Head tilts", line: "Tilts its head one way, then the other.", act: act("curious", 2, { head: rot(-10, 10, -10) }) },
  { state: "partial", kind: "prop", title: "Glass half full", line: "Holds up a glass, half full — that's the good way to look at it.", act: act("happy", 2, breathe()), over: () => <HalfGlass x={142} y={150} /> },
  { state: "partial", kind: "body", title: "Leans in", line: "Leans in close for another look, and back.", act: act("curious", 2, { root: rot(0, 8, 8, 0) }) },
];

/* ——— Juno: the cartwheel and her athlete's body ——— */

const juno: Variant[] = [
  { state: "writing", kind: "feature", title: "Warm-up stretch", line: "Stretches one side, then the other, like before a race.", act: act("focused", 3, { torso: rot(0, -8, 0, 8, 0) }, [{ L: [70, 120], R: [124, 206] }, { L: [76, 206], R: [130, 120] }]) },
  { state: "writing", kind: "feature", title: "Puff bounce", line: "Nods along, her puff of curls bouncing.", act: act("happy", 0.9, { head: rot(-3, 4, -3), ...breathe() }) },
  { state: "writing", kind: "body", title: "Arms crossed", line: "Arms crossed, a patient, confident smile: you've got this.", act: act("happy", 3, breathe(), [{ L: [110, 178], R: [90, 178], outL: false, outR: false }]) },
  { state: "writing", kind: "prop", title: "Water bottle", line: "Takes a sip from her water bottle while she waits.", act: act("neutral", 3, breathe(), [{ ...REST, R: [110, 150], outR: false }]), over: () => <WaterBottle x={116} y={146} /> },
  { state: "writing", kind: "body", title: "Quiet thumbs up", line: "Gives you a quiet thumbs up.", act: act("happy", 2, breathe(), [{ ...REST, R: [138, 172] }]) },

  { state: "correct", kind: "feature", title: "Cartwheel!", line: "Cartwheels right across the card.", act: act("delighted", 1.8), move: "fx fx-cartwheel", scale: 0.86 },
  { state: "correct", kind: "feature", title: "Victory lap", line: "Runs on the spot, knees high, arms pumping.", act: act("delighted", 0.5, { hipL: rot(0, -30, 0), hipR: rot(-30, 0, -30), kneeL: rot(0, 40, 0), kneeR: rot(40, 0, 40) }, [{ L: [70, 180], R: [130, 200] }, { L: [70, 200], R: [130, 180] }]), move: "fx fx-pace" },
  { state: "correct", kind: "body", title: "Fist pump", line: "A big fist pump: yes!", act: act("delighted", 0.6, breathe(), [{ ...REST, R: [138, 120] }, { ...REST, R: [134, 140] }, { ...REST, R: [138, 120] }]) },
  { state: "correct", kind: "prop", title: "Pom-poms", line: "Shakes a pair of pom-poms.", act: act("delighted", 0.6, hop(3), [{ L: [60, 140], R: [140, 140] }]), over: () => <g><PomPom x={56} y={130} /><PomPom x={144} y={130} /></g> },
  { state: "correct", kind: "body", title: "High five", line: "Holds up a hand for a high five.", act: act("happy", 1.6, breathe(), [{ ...REST, R: [142, 118] }]) },

  { state: "incorrect", kind: "feature", title: "Shake it off", line: "Shakes out her arms like an athlete after a miss: shake it off.", act: act("focused", 0.4, breathe(), [{ L: [70, 208], R: [130, 208] }, { L: [80, 204], R: [120, 204] }]) },
  { state: "incorrect", kind: "body", title: "Deep breath", line: "Breathes in deep, and out.", act: act("focused", 3, { torso: lift(0, -4, 0), shadow: squash([1, 1], [0.94, 1], [1, 1]) }) },
  { state: "incorrect", kind: "body", title: "Kneels to your level", line: "Crouches down to your level, kind and close.", act: act("happy", 3, { root: lift(0, 10, 10, 0) }) },
  { state: "incorrect", kind: "prop", title: "Towel", line: "Hangs a towel round her neck: take a breather.", act: act("happy", 3, breathe()), over: () => <Towel x={96} y={170} /> },
  { state: "incorrect", kind: "body", title: "Shoulders back", line: "Rolls her shoulders back, ready to go again.", act: act("focused", 1.6, { torso: rot(0, -3, 3, 0), head: rot(0, 3, -3, 0) }) },

  { state: "partial", kind: "feature", title: "Half a cartwheel", line: "Gets halfway through a cartwheel and holds it, grinning.", act: act("happy", 2, breathe()), turn: 90, scale: 0.86 },
  { state: "partial", kind: "feature", title: "One-foot balance", line: "Balances on one foot, wobbles, holds it.", act: act("focused", 1.8, { root: rot(0, -3, 3, 0), hipR: rot(-40, -40, -40), kneeR: rot(60, 60, 60) }, [{ L: [60, 170], R: [140, 170] }]) },
  { state: "partial", kind: "body", title: "This close", line: "Pinches her fingers: this close.", act: act("curious", 1.6, breathe(), [{ ...REST, R: [134, 150] }]), over: () => lines("M132 132 l6 0 M146 132 l-6 0") },
  { state: "partial", kind: "prop", title: "Relay baton", line: "Holds out the relay baton: your go again.", act: act("happy", 2, breathe(), [{ ...REST, R: [146, 176] }]), over: () => fx("fx-bob", <Baton x={152} y={172} />) },
  { state: "partial", kind: "body", title: "Points: nearly", line: "Points at you and nods: nearly!", act: act("wink", 1.6, { head: rot(0, 6, 0) }, [{ ...REST, R: [146, 150] }]) },
];

/* ——— Lulu: puppy eyes, the smug face, her stray strands ——— */

const puppyEyes = (left = true, right = true) => (
  <g>
    {[82, 118]
      .filter((x) => (x < 100 ? left : right))
      .map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={109} rx={12} ry={13.4} fill="#fffdf8" />
          <circle cx={x} cy={111} r={10.2} fill="#7b5cc4" />
          <circle cx={x} cy={111} r={4.4} fill="#241a2e" />
          <circle cx={x - 4} cy={106.4} r={3.8} fill="#fffdf8" />
          <circle cx={x + 4} cy={106} r={2} fill="#fffdf8" />
          <circle cx={x + 3.2} cy={115.4} r={1.6} fill="#fffdf8" />
          <path d={`M${x - 12} 108 A12 13.4 0 0 1 ${x + 12} 108`} stroke="#2a1d22" strokeWidth={2.8} fill="none" strokeLinecap="round" />
        </g>
      ))}
  </g>
);

const lulu: Variant[] = [
  { state: "writing", kind: "feature", title: "Scheming", line: "Watches you sideways with her smug look, strands curled. She has a plan.", act: act("thinking", 3, breathe()) },
  { state: "writing", kind: "feature", title: "Strands twitch", line: "Her two strands twitch into a question as she waits.", act: act("curious", 1.4, { head: rot(-2, 2, -2), ...breathe() }) },
  { state: "writing", kind: "body", title: "Holds her breath", line: "Holds her breath, cheeks puffed, eyes wide.", act: act("focused", 2, breathe()), head: () => <g fill="#f7dcca"><ellipse cx={62} cy={122} rx={9} ry={10} /><ellipse cx={138} cy={122} rx={9} ry={10} /></g> },
  { state: "writing", kind: "prop", title: "Peanut", line: "Munches a peanut, watching.", act: act("happy", 1, breathe(), [{ ...REST, R: [106, 158], outR: false }]), over: () => fx("fx-bob", <Peanut x={108} y={150} />) },
  { state: "writing", kind: "body", title: "Peeks through her fingers", line: "Covers her eyes and peeks through her fingers.", act: act("curious", 2, breathe(), [{ L: [90, 150], R: [110, 150], outL: false, outR: false }]) },

  { state: "correct", kind: "feature", title: "Puppy eyes of joy", line: "Her eyes go huge and sparkling.", act: act("delighted", 1.6, breathe()), head: () => puppyEyes() },
  { state: "correct", kind: "feature", title: "Smug “heh”", line: "The smug “heh”, strands springing tall: she knew you would.", act: act("thinking", 1.2, { head: rot(0, 5, 0), ...breathe() }) },
  { state: "correct", kind: "body", title: "Rubs her hands", line: "Rubs her hands together, very pleased with herself.", act: act("happy", 0.4, breathe(), [{ L: [96, 176], R: [104, 170], outL: false, outR: false }, { L: [96, 170], R: [104, 176], outL: false, outR: false }]) },
  { state: "correct", kind: "prop", title: "Lollipop", line: "Waves a swirly lollipop.", act: act("delighted", 1.4, breathe(), [{ ...REST, R: [134, 160] }]), over: () => <Lollipop x={138} y={158} /> },
  { state: "correct", kind: "body", title: "Peace signs", line: "Double peace signs, head tipped.", act: act("wink", 1.6, { head: rot(0, 6, 0) }, [{ L: [66, 140], R: [134, 140] }]) },

  { state: "incorrect", kind: "feature", title: "Strands bounce back", line: "Her strands flop — then spring right back up.", act: act("oops", 2.4, breathe()) },
  { state: "incorrect", kind: "feature", title: "Smug anyway", line: "Tips her head with the smug look: that one was tricky, she'd have got it wrong too.", act: act("thinking", 2.4, { head: rot(0, 8, 8, 0) }) },
  { state: "incorrect", kind: "body", title: "Blows her fringe", line: "Blows her fringe up with a puff of air.", act: act("focused", 1.4, breathe()), head: () => lines("M96 84 l-2 -8 M102 84 l0 -9 M108 84 l2 -8", "fx-float") },
  { state: "incorrect", kind: "prop", title: "Sticky note", line: "Sticks a note up for later: try again.", act: act("curious", 2, breathe(), [{ ...REST, R: [136, 150] }]), over: () => fx("fx-pop", <StickyNote x={142} y={140} />) },
  { state: "incorrect", kind: "body", title: "There, there", line: "Pats her own head: there, there.", act: act("happy", 0.6, breathe(), [{ ...REST, R: [120, 116] }, { ...REST, R: [118, 110] }, { ...REST, R: [120, 116] }]) },

  { state: "partial", kind: "feature", title: "One strand up", line: "One strand up, one strand down.", act: act("curious", 2, breathe()) },
  { state: "partial", kind: "feature", title: "Half puppy eyes", line: "One eye goes big and pleading, the other stays smug: so close.", act: act("thinking", 2, breathe()), head: () => puppyEyes(false, true) },
  { state: "partial", kind: "body", title: "Taps her nose", line: "Taps her nose: nearly!", act: act("wink", 0.8, breathe(), [{ ...REST, R: [104, 146], outR: false }, { ...REST, R: [104, 150], outR: false }, { ...REST, R: [104, 146], outR: false }]) },
  { state: "partial", kind: "prop", title: "Half a cookie", line: "Holds up half a cookie: half is still good.", act: act("happy", 2, breathe(), [{ ...REST, R: [134, 160] }]), over: () => fx("fx-bob", <HalfCookie x={138} y={152} />) },
  { state: "partial", kind: "body", title: "Scrunch, then grin", line: "Scrunches her face up — then grins.", act: act("oops", 1.8, breathe()) },
];

/* ——— The red panda: standing tall, its tail, its paws ——— */

const redPanda: Variant[] = [
  { state: "writing", kind: "feature", title: "Tail wrap", line: "Curls its big ringed tail round itself, cosy, and waits.", act: act("happy", 3, { tail: rot(0, -30, -30, 0), ...breathe() }) },
  { state: "writing", kind: "feature", title: "Tail swish", line: "Its tail swishes slowly, keeping it company.", act: act("neutral", 2.4, { tail: rot(-10, 10, -10), ...breathe() }) },
  { state: "writing", kind: "body", title: "Slow blink", line: "Gives you a slow, trusting blink.", act: act("focused", 3, breathe()) },
  { state: "writing", kind: "prop", title: "Bamboo", line: "Nibbles a shoot of bamboo.", act: act("happy", 1, breathe(), [{ L: [92, 170], R: [108, 170], outL: false, outR: false }]), over: () => <Bamboo x={104} y={162} /> },
  { state: "writing", kind: "body", title: "Kneads its paws", line: "Kneads its paws, one and then the other.", act: act("neutral", 0.8, breathe(), [{ L: [92, 176], R: [108, 180], outL: false, outR: false }, { L: [92, 180], R: [108, 176], outL: false, outR: false }]) },

  { state: "correct", kind: "feature", title: "Stand tall!", line: "Rears up on its hind legs, arms thrown wide, to look as big as it can.", act: act("delighted", 1.6, { root: lift(0, -6, -6, 0) }, [{ L: [60, 120], R: [140, 120] }]), move: "fx fx-rise" },
  { state: "correct", kind: "feature", title: "Tail puffs", line: "Its ringed tail puffs up to twice its size.", act: act("delighted", 1.4, { tail: squash([1, 1], [1.25, 1.25], [1, 1]), ...breathe() }) },
  { state: "correct", kind: "body", title: "Waves both paws", line: "Waves both paws at you.", act: act("happy", 0.6, breathe(), [{ L: [64, 132], R: [136, 132] }, { L: [70, 124], R: [130, 124] }]) },
  { state: "correct", kind: "prop", title: "Autumn leaf", line: "Tosses up a red autumn leaf.", act: act("delighted", 2, breathe(), [{ L: [70, 130], R: [130, 130] }]), over: () => fx("fx-drift", <MapleLeaf x={100} y={40} />) },
  { state: "correct", kind: "body", title: "Little bow", line: "A polite little bow.", act: act("happy", 1.8, { torso: rot(0, 14, 14, 0), head: rot(0, 6, 6, 0) }) },

  { state: "incorrect", kind: "feature", title: "Tail over its face", line: "Hides its face behind its tail for a moment, then peeks out.", act: act("oops", 2.6, { tail: rot(0, -60, -60, 0) }) },
  { state: "incorrect", kind: "feature", title: "Settles back down", line: "Half rears up — oh — then settles back down, calm.", act: act("worried", 3, { root: lift(0, -5, 0, 0) }) },
  { state: "incorrect", kind: "body", title: "Paws on its heart", line: "Holds both paws over its heart.", act: act("happy", 3, breathe(), [{ L: [98, 176], R: [106, 172], outL: false, outR: false }]) },
  { state: "incorrect", kind: "prop", title: "Blanket", line: "Wraps itself in a soft blanket.", act: act("worried", 3, breathe()), over: () => <Blanket x={100} y={190} /> },
  { state: "incorrect", kind: "body", title: "Washes its face", line: "Wipes its face with both paws, and starts fresh.", act: act("focused", 0.8, breathe(), [{ L: [92, 140], R: [108, 140], outL: false, outR: false }, { L: [92, 150], R: [108, 150], outL: false, outR: false }]) },

  { state: "partial", kind: "feature", title: "Half stand", line: "Rises halfway up on its hind legs, curious.", act: act("curious", 2, { root: lift(0, -4, -4, 0) }, [{ L: [80, 170], R: [120, 170], outL: false, outR: false }]) },
  { state: "partial", kind: "feature", title: "Half a tail wrap", line: "Its tail curls halfway round.", act: act("thinking", 2.4, { tail: rot(0, -16, -16, 0) }) },
  { state: "partial", kind: "body", title: "This much", line: "Holds its paws apart: this much more.", act: act("curious", 1.6, breathe(), [{ L: [72, 170], R: [128, 170] }, { L: [76, 170], R: [124, 170] }]) },
  { state: "partial", kind: "prop", title: "Kite", line: "Its kite is halfway up the sky.", act: act("happy", 2.4, breathe(), [{ ...REST, R: [128, 150] }]), over: () => <Kite x={130} y={150} /> },
  { state: "partial", kind: "body", title: "Sniffs the air", line: "Lifts its nose and sniffs: something's nearly right.", act: act("curious", 1, { head: rot(0, -6, 0, -6, 0) }) },
];

export const PRACTICE: Sheet[] = [
  { id: "chameleon", variants: chameleon },
  { id: "side-bat", variants: bat },
  { id: "side-chick", variants: chick },
  { id: "side-juno", variants: juno },
  { id: "side-lulu", variants: lulu },
  { id: "panda", variants: redPanda },
];
