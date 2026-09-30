import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import {
  arcDown,
  arcUp,
  EYE_WHITE,
  line,
  OpenMouth,
  Orb,
  TONGUE_PINK,
  turnAt,
  type EyeKit,
  type MouthKit,
} from "./rig/eyes";
import { CHIBI, pivot, type Body } from "./rig/skeleton";
import {
  curve,
  dMouth,
  face,
  FACE,
  NO_NECK,
  pal,
  sides,
  Taper,
  wave,
  type Cubic,
} from "./side-candidates";
import { C } from "./theme";

/**
 * The jelly family: three species from Jelly's bell-and-tendrils body plan, each the animal itself
 * rather than a spirit — no wings, no antennae, no light. A jellyfish, a squid, a mushroom. Each
 * has its own eyes and mouth, and an ability that is what the animal naturally does.
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

/* ——— Squid: an arrowhead mantle, big gold-ringed eyes; it jets ——— */

const palSquid = pal(C.mid, C.mid);
const SQUID: Body = { ...FLOAT, id: "squid", headVB: "30 26 140 140" };

function SquidHead() {
  return (
    <g>
      {/* the fins make an arrowhead of the top of the mantle */}
      <path d="M100 18 L150 70 Q128 70 116 62 Z" fill={C.primary} />
      <path d="M100 18 L50 70 Q72 70 84 62 Z" fill={C.primary} />
      <path
        d="M100 26 C122 26 134 56 136 86 C138 112 136 132 128 144 C120 154 110 156 100 156 C90 156 80 154 72 144 C64 132 62 112 64 86 C66 56 78 26 100 26 Z"
        fill={C.mid}
      />
      <path d="M100 32 C110 40 114 56 114 70" {...line(C.hi, 3)} />
    </g>
  );
}

function SquidBehind() {
  const arm = (x: number, s: number, len: number): Cubic[] => [
    [
      [x, 146],
      [x + s * 4, 166],
      [x + s * 8, 182],
      [x + s * 6, 146 + len],
    ],
  ];
  const tentacle = (s: number): Cubic[] => [
    [
      [100 + s * 20, 146],
      [100 + s * 36, 180],
      [100 + s * 30, 220],
      [100 + s * 42, 248],
    ],
  ];
  return (
    <g data-joint="tail" style={pivot("tail", { ...CHIBI.j, tail: [100, 150] })}>
      {sides.map(([side, s]) => (
        <g key={side}>
          <Taper segs={tentacle(s)} w0={8} w1={5} fill={C.primary} />
          {/* the tentacle's club */}
          <ellipse
            cx={100 + s * 44}
            cy={252}
            rx={6.5}
            ry={11}
            transform={`rotate(${-s * 20} ${100 + s * 44} 252)`}
            fill={C.primary}
          />
        </g>
      ))}
      {[
        [84, -1, 48],
        [94, -1, 58],
        [106, 1, 58],
        [116, 1, 48],
      ].map(([x, s, len]) => (
        <Taper key={x} segs={arm(x, s, len)} w0={12} w1={5} fill={C.mid} />
      ))}
    </g>
  );
}

/** Squid: big round eyes — a gold ring round a black pupil, no white — that dilate, narrow and
 *  dart; the mantle closes over them as a lid. */
const squidEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const [dx, dy] = look;
  const open = (pupil: number, top = 0, tilt = 0, bottom = 0) => (
    <Orb id={id} x={x} y={y} rx={10} ry={10} s={s} fill={C.accent} lid={{ top, tilt, bottom, color: C.mid }}>
      <circle cx={x + dx * 0.8} cy={y + dy * 0.8} r={pupil} fill={p.ink} />
      <circle cx={x - 3 + dx} cy={y - 3.4 + dy} r={2.4} fill={EYE_WHITE} />
      <circle cx={x + 3 + dx} cy={y + 3 + dy} r={1} fill={EYE_WHITE} />
    </Orb>
  );
  const shut = (d: string) => <path d={d} {...line(C.deep, 3.4)} />;
  switch (mood) {
    case "happy":
      return open(6.4, 0.06, 0, 0.44);
    case "delighted":
      return open(8.2);
    case "curious":
      return open(4.8);
    case "thinking":
      return open(6, 0.34, -6);
    case "focused":
      return open(4, 0.46, -10);
    case "worried":
      return open(3.2, 0.16, 16);
    case "oops":
      return shut(`M${x - 7} ${y - 2} L${x + 7} ${y + 2} M${x - 7} ${y + 2} L${x + 7} ${y - 2}`);
    case "wink":
      return s === 1 ? shut(arcUp(x, y, 7, 4.5)) : open(6.4, 0.12);
    default:
      return open(6.4, 0.12);
  }
};

/** Squid: a small beak of a “v”, which opens into a triangle. */
const squidMouth: MouthKit = ({ mood, y }) => {
  const c = C.deep;
  const v = (w: number, d: number, dx = 0) => (
    <path d={`M${100 - w + dx} ${y} L${100 + dx} ${y + d} L${100 + w + dx} ${y}`} {...line(c, 2.4)} />
  );
  switch (mood) {
    case "happy":
      return <OpenMouth d={`M93 ${y} L107 ${y} L100 ${y + 8} Z`} fill={c} tongue={[100, y + 6, 3, 2]} />;
    case "delighted":
      return <OpenMouth d={`M90 ${y - 1} L110 ${y - 1} L100 ${y + 12} Z`} fill={c} tongue={[100, y + 9, 4, 2.6]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.6} ry={3} fill={c} />;
    case "thinking":
      return v(4, 3, 4);
    case "focused":
      return <path d={`M96 ${y + 1} L104 ${y + 1}`} {...line(c, 2.4)} />;
    case "worried":
      return <path d={`M94 ${y + 3} L100 ${y} L106 ${y + 3}`} {...line(c, 2.4)} />;
    case "oops":
      return g2(v(5, 4), <ellipse cx={101} cy={y + 6} rx={2.4} ry={2.6} fill={TONGUE_PINK} />);
    case "wink":
      return v(6, 5, 1);
    default:
      return v(5, 4);
  }
};

/* ——— Mushroom: a spotted cap over a shy face; its cap is an umbrella ——— */

const SHROOM: Body = {
  ...CHIBI,
  id: "mushroom",
  torso:
    "M82 150 Q100 146 118 150 Q126 170 124 200 Q122 218 100 219 Q78 218 76 200 Q74 170 82 150 Z",
  headVB: "30 34 140 140",
  neck: NO_NECK,
};
const palShroom = pal(C.hi, C.hi);

function ShroomHead() {
  return (
    <g>
      {/* the stem is the face */}
      <path d="M68 104 L132 104 Q136 128 130 146 Q116 156 100 156 Q84 156 70 146 Q64 128 68 104 Z" fill={FACE} />
      {/* the gills, under the cap's rim */}
      <ellipse cx={100} cy={104} rx={56} ry={9} fill={C.hi} />
      <path d="M58 104 L66 110 M72 104 L78 111 M86 104 L90 112 M114 104 L110 112 M128 104 L122 111 M142 104 L134 110" {...line(C.mid, 1.6)} />
      <path d="M34 98 C34 48 64 24 100 24 C136 24 166 48 166 98 C166 106 156 106 148 104 L52 104 C44 106 34 106 34 98 Z" fill={C.primary} />
      {[
        [76, 50, 9],
        [112, 40, 7],
        [134, 70, 8],
        [56, 80, 6],
        [100, 72, 5],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={C.tint} />
      ))}
    </g>
  );
}

/** Mushroom: tall, narrow, shy eyes in the shade of its cap, glancing down at rest; they blush
 *  with little lines when it is flustered. No brows: the cap's shadow is its brow. */
const shroomEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const blush = <path d={`M${x + s * 6} ${y + 9} l${s * 2} -3 M${x + s * 9.5} ${y + 9} l${s * 2} -3`} {...line("#e57f92", 1.6)} />;
  const open = (k = 1, top = 0, tilt = 0, down = 1.2) => (
    <Orb id={id} x={x} y={y} rx={3.8 * k} ry={7 * k} s={s} fill={ink} lid={{ top, tilt, color: FACE }}>
      <ellipse cx={x - 1 + dx * 0.5} cy={y - 3 * k + down + dy * 0.5} rx={1.4} ry={2} fill={EYE_WHITE} />
    </Orb>
  );
  switch (mood) {
    case "happy":
      return <path d={arcUp(x, y, 4.5, 3.4)} {...line(ink, 3)} />;
    case "delighted":
      return open(1.25, 0, 0, 0);
    case "curious":
      return open(1.12, 0, 0, 0);
    case "thinking":
      return open(0.95, 0.3);
    case "focused":
      return open(1, 0.45, -6);
    case "worried":
      return g2(open(0.9, 0.12, 14), blush);
    case "oops":
      return g2(<path d={arcDown(x, y, 4.5, 3)} {...line(ink, 3)} />, blush);
    case "wink":
      return s === 1 ? <path d={arcUp(x, y, 4.5, 3.4)} {...line(ink, 3)} /> : open();
    default:
      return open();
  }
};

/** Mushroom: a small mouth with one front tooth that shows whenever it opens. */
const shroomMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const tooth = (top: number) => <rect x={98} y={top} width={4} height={3.4} rx={0.8} fill={EYE_WHITE} />;
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y, 6, 5.5)} fill={ink} tongue={[100, y + 7.5, 3, 2.2]} />, tooth(y + 0.4));
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 1, 8, 8)} fill={ink} tongue={[100, y + 10, 4, 2.8]} />, tooth(y - 0.4));
    case "curious":
      return <ellipse cx={100} cy={y + 1.5} rx={2.2} ry={2.8} fill={ink} />;
    case "thinking":
      return <path d={curve(y + 1, 3, 1.5, 104)} {...line(ink, 2.2)} />;
    case "focused":
      return <path d={`M97 ${y + 1} L103 ${y + 1}`} {...line(ink, 2.2)} />;
    case "worried":
      return <path d={wave(y + 2, 4.5, 2)} {...line(ink, 2.2)} />;
    case "oops":
      return g2(<path d={curve(y, 5, 3)} {...line(ink, 2.2)} />, tooth(y + 1.4));
    case "wink":
      return <path d={curve(y, 5, 4, 101)} {...line(ink, 2.4)} />;
    default:
      return <path d={curve(y, 4, 3)} {...line(ink, 2.4)} />;
  }
};

/* ——— The three ——— */

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
      "Jelly as the animal itself: a moon jelly's bell with a scalloped rim and the four rings on its crown, four frilly oral arms and fine tentacles beneath. No wings, no antennae, no light. Its ability is See-through: its bell is clear, so whatever it carries shows through it. Half-moon eyes, sleepy and content at rest, and a tiny cat's mouth.",
    risk: "Jellyfish can read as stinging; the soft half-moon eyes and round rim keep it gentle. It floats, like Wisp; the bell's silhouette is its own.",
    pal: pal(C.mid, C.mid),
    body: C.mid,
    face: face({ eyeY: 94, eyeGap: 20, mouthY: 108, kit: jellyEyes, mouthKit: jellyMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    behind: () => <JellyBehind />,
    head: (c) => <JellyHead {...c} />,
  },
  {
    id: "side-squid",
    kind: "animal",
    frame: SQUID,
    legs: false,
    arms: false,
    outline: false,
    label: "Squid",
    signature: "An arrowhead mantle, big gold-ringed eyes, short arms and two long clubbed tentacles",
    pitch:
      "From Jelly's bell and tendrils, stretched: the bell becomes a squid's mantle, its fins an arrowhead on top, and the tendrils short arms and two long tentacles with clubs. Its ability is Jet: it squeezes and shoots off, mantle first, in a rush of water — the fastest in the cast. Its eyes are a squid's: a gold ring round a big black pupil.",
    risk: "Beside the octopus it must stay told apart by the arrowhead, which reads at small size.",
    pal: palSquid,
    body: C.mid,
    face: face({ eyeY: 108, eyeGap: 17, mouthY: 132, kit: squidEyes, mouthKit: squidMouth }),
    outfit: "bare",
    outfits: ["bare", "winter"],
    behind: () => <SquidBehind />,
    head: () => <SquidHead />,
  },
  {
    id: "side-mushroom",
    kind: "animal",
    frame: SHROOM,
    outline: false,
    label: "Mushroom",
    signature: "A wide spotted cap over a shy face on its stem — its cap is an umbrella",
    pitch:
      "From Jelly's bell, planted: the bell becomes a spotted cap with gills under its rim, and the face is on the stem, in the cap's shade. Its ability is Umbrella: its cap keeps off the rain, and it shelters whatever stands under it — a natural pair with the cloud. Tall, shy eyes that blush with little lines, and one front tooth.",
    risk: "Mushrooms can suggest poison or toadstools; the soft blue cap and pale spots keep it a toy.",
    pal: palShroom,
    body: C.soft,
    face: face({ eyeY: 124, eyeGap: 14, mouthY: 142, kit: shroomEyes, mouthKit: shroomMouth }),
    outfit: "bare",
    outfits: ["bare", "dungarees", "hoodie", "raincoat", "winter"],
    head: () => <ShroomHead />,
  },
];
