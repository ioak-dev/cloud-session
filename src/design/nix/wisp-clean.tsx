import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import { FLAME, Flame, Head, WISP, WISP_MAIN } from "./firefly-wisp";
import type { Body } from "./rig/skeleton";
import { FinishedRibbons, RIBBON_VARIANTS, withRibbon } from "./wisp-ribbon";

/**
 * Wisp · Ribbon, Clean — proposals. Clean is the chosen ribbon variant (`RIBBON_VARIANTS`); each
 * proposal here changes one thing on it and nothing else, so it can be judged alone.
 *
 * Tail patterns: the flame keeps its shape and its two rings; only the light inside it is drawn
 * differently, from what a firefly's lantern and a flame actually look like.
 * - Lantern — the light organ: on a real firefly only the last segments light, so the segment
 *   above the first ring dims to amber and the segment between the rings is the brightest.
 * - Core — the heart of a flame: a paler tongue inside the flame, following its curl, as the
 *   hottest part of a candle's flame is paler than its edge.
 *
 * Head shapes: the face, the bulb it sits in and the antennae stay; only the tip changes, toward
 * one of the two things a wisp is, a flame or a drop.
 * - Candle — the tip rises a little taller and leans, as a candle's flame does in still air.
 * - Dewdrop — the tip is short and softly rounded, the drop heavier below: a drop of light about
 *   to fall.
 *
 * Arms:
 * - Snug arms — Snug's thicker arms and bigger soft tips on Clean's slim body: Wisp's own joints
 *   and torso, only the limb widths change.
 *
 * Front only: the turn puppet, back view, flight and form still draw Clean.
 */

const CLEAN = RIBBON_VARIANTS.find((v) => v.id === "clean")!;
const BASE = withRibbon(WISP_MAIN, CLEAN);

/** The flame's own light, paler than the glow: its hottest part. */
const PALE = "#fff4cc";
/** The flame's amber, as at its tip. */
const EMBER = "#ffb547";

/** The flame's patterns, each clipped to the flame so it never leaves its edge. */
function Lantern({ uid }: Ctx) {
  const clip = `${uid}-lantern`;
  return (
    <g>
      <clipPath id={clip}>
        <path d={FLAME} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {/* the segment above the first ring, unlit: a dimmer amber */}
        <path d="M70 190 Q100 204 130 186 L130 212 Q102 222 70 214 Z" fill={EMBER} opacity={0.42} />
        {/* the light organ, between the rings: the brightest */}
        <path d="M70 216 Q102 224 130 212 L130 228 Q102 238 70 231 Z" fill={PALE} opacity={0.6} />
      </g>
    </g>
  );
}

function Core({ uid }: Ctx) {
  const g = `${uid}-core`;
  return (
    <g>
      <defs>
        <linearGradient id={g} gradientUnits="userSpaceOnUse" x1="100" y1="204" x2="104" y2="262">
          <stop offset="0" stopColor={PALE} stopOpacity={0} />
          <stop offset="0.3" stopColor={PALE} stopOpacity={0.75} />
          <stop offset="0.8" stopColor={PALE} stopOpacity={0.55} />
          <stop offset="1" stopColor={PALE} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* a tongue inside the flame, narrowing into its curl */}
      <path
        d="M100 206 C110 212 113 230 105 242 C101 248 101 256 106 262 C98 260 95 252 97 244 C91 234 91 214 100 206 Z"
        fill={`url(#${g})`}
      />
    </g>
  );
}

/** The candle's tip: taller, leaning a little to its right, with a soft S in its sides. */
const CANDLE =
  "M106 34 C104 52 146 68 146 106 C146 130 126 144 100 144 C74 144 54 130 54 106 C54 76 86 66 96 52 C101 45 104 40 106 34 Z";
/** The dewdrop: a short, rounded tip, a fuller drop below. */
const DEWDROP =
  "M100 48 C108 48 116 58 124 68 C138 84 148 92 148 112 C148 134 126 146 100 146 C74 146 52 134 52 112 C52 92 62 84 76 68 C84 58 92 48 100 48 Z";

/** Clean's frame with Snug's limb widths: the same joints and torso, thicker arms, bigger tips. */
const SNUG_ARMS: Body = {
  ...WISP,
  id: "wisp-clean-snug-arms",
  w: { ...WISP.w, upper: 11.5, fore: 11, hand: 8.4 },
};

type Change = {
  id: string;
  label: string;
  pattern?: (c: Ctx) => ReactNode;
  head?: string;
  frame?: Body;
  signature: string;
  pitch: string;
  risk: string;
};

const clean = (x: Change): Candidate => ({
  ...BASE,
  id: `wisp-clean-${x.id}`,
  label: `Clean · ${x.label}`,
  signature: x.signature,
  pitch: x.pitch,
  risk: x.risk,
  frame: x.frame ?? BASE.frame,
  head: x.head ? (c) => <Head {...c} d={x.head} /> : BASE.head,
  behind: (c) => (
    <g>
      <FinishedRibbons frame={x.frame} uid={c.uid} form={CLEAN.form} />
      <Flame {...c}>{x.pattern?.(c)}</Flame>
    </g>
  ),
});

export const CLEAN_TAILS: Candidate[] = [
  clean({
    id: "lantern",
    label: "Lantern",
    pattern: (c) => <Lantern {...c} />,
    signature: "The tail lit like a real firefly's lantern: the segment between the rings brightest",
    pitch:
      "On a firefly only the last segments of the abdomen light. Here the segment above the first ring dims to amber and the segment between the two rings is the palest, brightest light, so the rings read as the joins of a lantern rather than stripes painted on a flame. The glow and the sparks are unchanged.",
    risk: "A brighter band can read as a belt at 32px; keep it soft, and keep the rings, which are what it is known by.",
  }),
  clean({
    id: "core",
    label: "Core",
    pattern: (c) => <Core {...c} />,
    signature: "A paler heart inside the flame, following its curl",
    pitch:
      "A flame is palest at its heart. A soft, paler tongue runs down the middle of the tail and narrows into its curl, so the tail reads as a flame with depth rather than a flat gold shape, and its curl is drawn twice, once in the light inside it. The rings cross it, as they cross the flame.",
    risk: "The pale core must not read as a highlight (nothing lighting-dependent): it is fixed and follows the flame's own shape, never the light's direction.",
  }),
];

export const CLEAN_HEADS: Candidate[] = [
  clean({
    id: "candle",
    label: "Candle",
    head: CANDLE,
    signature: "The drop's tip rises a little taller and leans, like a candle's flame",
    pitch:
      "The base drop is perfectly symmetric, a logo shape. A candle flame in still air is never quite straight: its tip rises, thins and leans a little. The bulb that holds the face is unchanged; the tip is a few units taller and leans to Wisp's left with a soft S in its sides, so the head reads as a flame first and a drop second, and it has an asymmetry of its own.",
    risk: "The lean must stay slight, or it becomes Scamp's curl; check it at 32px beside the antennae.",
  }),
  clean({
    id: "dewdrop",
    label: "Dewdrop",
    head: DEWDROP,
    signature: "A short, softly rounded tip and a fuller drop: a drop of light about to fall",
    pitch:
      "The other thing a wisp is: a drop. The point is gone; the tip is short and round, and the drop is a little fuller below, as a dewdrop hangs heavy before it falls. Softer and younger than the base, with the face unchanged.",
    risk: "Without its point the head loses some of its flame; the flame tail and the ribbons must carry the wisp. Close to Snug's rounder drop, so judge them side by side.",
  }),
];

export const CLEAN_ARMS: Candidate[] = [
  clean({
    id: "snug-arms",
    label: "Snug arms",
    frame: SNUG_ARMS,
    signature: "Clean's slim body with Snug's thicker arms and bigger soft hand tips",
    pitch:
      "Wisp's stick arms are its weakest part at small sizes: at 32px they thin to a hairline and the hands vanish. These are Snug's arms — a little thicker at the shoulder and forearm, with bigger round tips — on Clean's own slim body, at Wisp's own shoulders and elbows, so the figure keeps its taper and its neck and only the arms carry more weight. Gestures (a wave, a point, hands under its heart) read from further away.",
    risk: "Thicker arms on a narrow body can look borrowed; check the shoulders join cleanly and that the arms do not crowd the ribbons at the sides.",
  }),
];
