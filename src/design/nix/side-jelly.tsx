import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import {
  arcDown,
  arcUp,
  EYE_WHITE,
  line,
  OpenMouth,
  TONGUE_PINK,
  turnAt,
  type EyeKit,
  type MouthKit,
} from "./rig/eyes";
import { CHIBI, pivot, type Body } from "./rig/skeleton";
import {
  dMouth,
  face,
  NO_NECK,
  pal,
  Taper,
  wave,
  type Cubic,
} from "./side-candidates";
import { C } from "./theme";

/**
 * The jellyfish: from Jelly's bell-and-tendrils body plan, the animal itself rather than a spirit —
 * no wings, no antennae, no light. It has its own eyes and mouth, and an ability that is what the
 * animal naturally does. (The octopus, from the same plan, is in `side-candidates.tsx`.)
 */

const g2 = (a: ReactNode, b: ReactNode) => (
  <g>
    {a}
    {b}
  </g>
);

const FLOAT: Body = {
  ...CHIBI,
  id: "float",
  torso: "M88 150 Q100 146 112 150 Q114 158 100 160 Q86 158 88 150 Z",
  neck: NO_NECK,
};

/* ——— Jellyfish: a moon jelly; its bell is clear, so what it carries shows through ——— */

const JELLY_BELL =
  "M42 114 C42 62 68 34 100 34 C132 34 158 62 158 114 C152 124 144 118 138 124 C130 132 122 122 114 128 C108 134 92 134 86 128 C78 122 70 132 62 124 C56 118 48 124 42 114 Z";

function JellyHead({ uid }: Ctx) {
  const g = `${uid}-jbell`;
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.hi} />
        </linearGradient>
      </defs>
      <path d={JELLY_BELL} fill={`url(#${g})`} />
      {/* a moon jelly's four rings, on the crown of the bell */}
      {[
        [91, 52],
        [109, 52],
        [91, 66],
        [109, 66],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={5.4} {...line(C.tint, 2.6)} />
      ))}
    </g>
  );
}

function JellyBehind() {
  const ribbon = (x: number, k: number): Cubic[] => [
    [
      [x, 124],
      [x + 10 * k, 150],
      [x - 10 * k, 176],
      [x + 2 * k, 204],
    ],
    [
      [x + 2 * k, 204],
      [x + 10 * k, 222],
      [x - 4 * k, 236],
      [x + 4 * k, 250],
    ],
  ];
  return (
    <g data-joint="tail" style={pivot("tail", { ...CHIBI.j, tail: [100, 130] })}>
      {/* fine tentacles from the rim */}
      {[52, 66, 134, 148].map((x, i) => (
        <path
          key={x}
          d={`M${x} 120 C${x - 6} 150 ${x + 6} 176 ${x - 2} ${206 + (i % 2) * 14}`}
          {...line(C.hi, 3)}
        />
      ))}
      {/* four frilly oral arms under the bell */}
      {[
        [82, 1],
        [94, -1],
        [106, 1],
        [118, -1],
      ].map(([x, k]) => (
        <Taper key={x} segs={ribbon(x, k)} w0={12} w1={4} fill={C.mid} />
      ))}
    </g>
  );
}

/** Jellyfish: half-moon eyes, flat on top, round below — sleepy and content at rest. They round
 *  out, flip, tilt and squash; no brows. */
const jellyEyes: EyeKit = ({ mood, s, x, y, look, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const half = (r: number, tilt = 0, flip = false) => (
    <g transform={turnAt(s, tilt, x + dx, y + dy)}>
      <path
        d={
          flip
            ? `M${x + dx - r} ${y + dy + r * 0.3} A${r} ${r} 0 0 1 ${x + dx + r} ${y + dy + r * 0.3} Z`
            : `M${x + dx - r} ${y + dy - r * 0.3} A${r} ${r} 0 0 0 ${x + dx + r} ${y + dy - r * 0.3} Z`
        }
        fill={ink}
      />
      <circle cx={x + dx - r * 0.35} cy={y + dy + (flip ? -r * 0.2 : r * 0.15)} r={r * 0.24} fill={EYE_WHITE} />
    </g>
  );
  const round = (r: number) => (
    <g>
      <circle cx={x + dx} cy={y + dy} r={r} fill={ink} />
      <circle cx={x + dx - r * 0.35} cy={y + dy - r * 0.35} r={r * 0.32} fill={EYE_WHITE} />
      <circle cx={x + dx + r * 0.4} cy={y + dy + r * 0.35} r={r * 0.14} fill={EYE_WHITE} />
    </g>
  );
  switch (mood) {
    case "happy":
      return <path d={arcUp(x, y, 6, 4)} {...line(ink, 3.2)} />;
    case "delighted":
      return round(7.4);
    case "curious":
      return round(6.2);
    case "thinking":
      return half(6.4, 10);
    case "focused":
      return <path d={`M${x - 6} ${y} Q${x} ${y + 3} ${x + 6} ${y}`} {...line(ink, 3.6)} />;
    case "worried":
      return half(6, 18, true);
    case "oops":
      return <path d={arcDown(x, y, 6, 3)} {...line(ink, 3.2)} />;
    case "wink":
      return s === 1 ? <path d={arcUp(x, y, 6, 4)} {...line(ink, 3.2)} /> : half(6.6);
    default:
      return half(6.6);
  }
};

/** Jellyfish: a tiny cat's “w” in the bell's deep tone. */
const jellyMouth: MouthKit = ({ mood, y }) => {
  const c = C.deep;
  const w = (dy = 0) => (
    <path d={`M94 ${y + dy} Q97 ${y + 3.5 + dy} 100 ${y + dy} Q103 ${y + 3.5 + dy} 106 ${y + dy}`} {...line(c, 2.2)} />
  );
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 6, 5)} fill={c} tongue={[100, y + 7, 3, 2.2]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 1, 8, 8)} fill={c} tongue={[100, y + 10, 4, 2.8]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 1.5} rx={2.2} ry={2.8} fill={c} />;
    case "thinking":
      return <path d={`M96 ${y + 2} Q100 ${y} 106 ${y + 1}`} {...line(c, 2.2)} />;
    case "focused":
      return <path d={`M97 ${y + 1} L103 ${y + 1}`} {...line(c, 2.2)} />;
    case "worried":
      return <path d={wave(y + 2, 5, 2.2)} {...line(c, 2.2)} />;
    case "oops":
      return g2(w(), <ellipse cx={102} cy={y + 4} rx={2.2} ry={2.4} fill={TONGUE_PINK} />);
    default:
      return w();
  }
};

/* ——— The jelly family ——— */

export const JELLY_FAMILY: Candidate[] = [
  {
    id: "side-jellyfish",
    kind: "animal",
    frame: FLOAT,
    legs: false,
    arms: false,
    outline: false,
    label: "Jellyfish",
    signature: "A moon jelly: a scalloped bell with four rings on its crown, frilly arms beneath",
    pitch:
      "Jelly as the animal itself: a moon jelly's bell with a scalloped rim and the four rings on its crown, four frilly oral arms and fine tentacles beneath. No wings, no antennae, no light. Its ability is See-through, which is what a jellyfish is: it can go clear, fading until you can see right through its bell, and come back. Half-moon eyes, sleepy and content at rest, and a tiny cat's mouth.",
    risk: "Jellyfish can read as stinging; the soft half-moon eyes and round rim keep it gentle. It floats, like Wisp; the bell's silhouette is its own.",
    pal: pal(C.mid, C.mid),
    body: C.mid,
    face: face({ eyeY: 94, eyeGap: 20, mouthY: 108, kit: jellyEyes, mouthKit: jellyMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    behind: () => <JellyBehind />,
    head: (c) => <JellyHead {...c} />,
  },
];
