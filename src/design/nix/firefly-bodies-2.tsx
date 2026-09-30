import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, GlowGrad, palette } from "./firefly-variants";
import { C } from "./theme";
import { WHITE } from "./rig/palette";
import { J, pivot, type Body } from "./rig/skeleton";

/**
 * Round two of firefly bodies, kept as reference: each on a frame of its own, with the light
 * behind a window or inside a cloak.
 */

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

/* ——— Cube: everything square — head, body, antennae — and a lit window in its chest ——— */

const CUBE_BODY = C.primary;
const CUBE_DARK = C.deep;
const palCube = palette(CUBE_DARK, C.deep, "#fff4e4", "#ead6bd", {
  eye: "#10384a",
  glow: "#ffd23f",
  top: C.clothes,
  topAlt: "#fff3de",
  bottom: C.clothes,
  shoe: C.clothes,
  accent: C.clothes,
  blush: "#ff9fb0",
});

const CUBE: Body = {
  id: "cube",
  j: { ...J, torso: [100, 214] },
  torso:
    "M80 150 L120 150 Q126 150 126 156 L126 214 Q126 220 120 220 L80 220 Q74 220 74 214 L74 156 Q74 150 80 150 Z",
  headVB: "34 12 132 132",
  w: { upper: 11, fore: 10, thigh: 13, shin: 12, hand: 6.6, cloth: 1 },
  neck: { x: 93, y: 136, w: 14, h: 18 },
};

function CubeHead({ pal }: Ctx) {
  return (
    <g>
      <rect
        x={52}
        y={60}
        width={96}
        height={80}
        rx={12}
        fill={CUBE_BODY}
        stroke={pal.ink}
        strokeWidth={2.6}
      />
      <rect x={60} y={82} width={80} height={50} rx={8} fill={pal.skin} />
      {/* a pixel highlight, not a curve */}
      <rect x={62} y={66} width={16} height={5} rx={1.5} fill={WHITE} opacity={0.7} />
      <rect x={82} y={66} width={5} height={5} rx={1.5} fill={WHITE} opacity={0.7} />
    </g>
  );
}

function CubeAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M84 60 L84 42 L68 42", [62, 36]],
          ["R", "M116 60 L116 42 L132 42", [126, 36]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 84 : 116, 60]} mood={mood}>
          {/* right-angled, with a square light on the end */}
          <path d={d} stroke={pal.ink} strokeWidth={3.2} fill="none" strokeLinejoin="round" />
          <rect
            x={x - 5}
            y={y - 5}
            width={22}
            height={22}
            rx={4}
            fill={pal.glow}
            opacity={0.3 * bright(mood)}
          />
          <rect
            x={x}
            y={y}
            width={12}
            height={12}
            rx={2.5}
            fill={pal.glow}
            stroke={pal.ink}
            strokeWidth={1.8}
          />
        </Antenna>
      ))}
    </g>
  );
}

function CubeBehind({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          {/* wings as two stacked panels */}
          <rect
            x={s < 0 ? 44 : 118}
            y={146}
            width={38}
            height={24}
            rx={6}
            transform={`rotate(${-16 * s} ${100 + 20 * s} 158)`}
            fill={C.tint}
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
          <rect
            x={s < 0 ? 52 : 118}
            y={172}
            width={30}
            height={18}
            rx={5}
            transform={`rotate(${12 * s} ${100 + 20 * s} 180)`}
            fill={C.tint}
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
        </g>
      ))}
      <rect
        data-joint="glow"
        x={64}
        y={156}
        width={72}
        height={60}
        rx={16}
        fill={pal.glow}
        opacity={0.25 * bright(mood)}
      />
    </g>
  );
}

function CubeWindow({ pal, uid }: Ctx) {
  const g = `${uid}-cubewin`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      {/* its light is a four-paned window, lit from inside; it shows through any outfit */}
      <rect
        x={88}
        y={172}
        width={24}
        height={24}
        rx={4}
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.2}
      />
      <path d="M100 172 L100 196 M88 184 L112 184" stroke={pal.ink} strokeWidth={1.8} />
    </g>
  );
}

/* ——— Hood: a cone of a cloak with a pointed hood; the light glows from inside the cloak ——— */

const HOOD_CLOAK = C.deep;
const HOOD_LINE = C.primary;
const palHood = palette(HOOD_CLOAK, C.deep, "#fdeede", "#e8cdb4", {
  eye: "#173a52",
  glow: "#ffd23f",
  top: C.clothes,
  topAlt: "#fff3de",
  bottom: C.clothes,
  shoe: C.clothes,
  accent: C.clothes,
  blush: "#f7a3a3",
});

const HOOD: Body = {
  id: "hood",
  j: {
    ...J,
    shoulderL: [84, 160],
    elbowL: [76, 184],
    wristL: [72, 206],
    shoulderR: [116, 160],
    elbowR: [124, 184],
    wristR: [128, 206],
    torso: [100, 250],
    hipL: [92, 246],
    kneeL: [91, 258],
    footL: [90, 272],
    hipR: [108, 246],
    kneeR: [109, 258],
    footR: [110, 272],
  },
  torso:
    "M86 146 Q100 142 114 146 C124 170 136 214 144 250 Q100 262 56 250 C64 214 76 170 86 146 Z",
  headVB: "30 4 136 136",
  w: { upper: 10, fore: 9, thigh: 11, shin: 10, hand: 6.2, cloth: 1 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

function HoodHead({ pal }: Ctx) {
  return (
    <g>
      {/* the hood: a point that flops back to one side */}
      <path
        d="M50 130 C42 96 56 60 92 46 C110 38 128 30 150 26 C140 38 140 50 146 66 C156 90 158 114 150 130 C140 148 60 148 50 130 Z"
        fill={HOOD_CLOAK}
        stroke={pal.ink}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path
        d="M92 50 Q120 40 144 30"
        stroke={HOOD_LINE}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      {/* the opening, shadowed at its rim */}
      <ellipse cx={100} cy={108} rx={40} ry={35} fill={C.deep} />
      <ellipse cx={100} cy={110} rx={36} ry={31} fill={pal.skin} />
    </g>
  );
}

function HoodAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M80 66 C72 56 60 54 52 60 C48 64 52 70 58 66", [58, 66]],
          ["R", "M120 66 C128 56 140 54 148 60 C152 64 148 70 142 66", [142, 66]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 80 : 120, 66]} mood={mood}>
          {/* poking out through slits in the hood, curled like fern tips */}
          <path
            d={`M${side === "L" ? 76 : 116} 64 l8 4`}
            stroke={pal.ink}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <path d={d} stroke={pal.ink} strokeWidth={2.8} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={2.8} fill={pal.accent} stroke={pal.ink} strokeWidth={1.2} />
        </Antenna>
      ))}
    </g>
  );
}

function HoodBehind({ pal, mood }: Ctx) {
  return (
    <circle
      data-joint="glow"
      cx={100}
      cy={222}
      r={46}
      fill={pal.glow}
      opacity={0.3 * bright(mood)}
    />
  );
}

function HoodLight({ pal, uid }: Ctx) {
  const g = `${uid}-hoodlight`;
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb547" />
          <stop offset="55%" stopColor={pal.glow} />
          <stop offset="100%" stopColor={WHITE} />
        </linearGradient>
      </defs>
      {/* the cloak parts at the front, and the light inside shows through */}
      <path
        d="M100 168 C104 196 110 226 118 254 Q100 258 82 254 C90 226 96 196 100 168 Z"
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M92 150 L100 160 L108 150"
        stroke={pal.accent}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export const FIREFLY_BODIES_2: Candidate[] = [
  {
    id: "firefly-cube",
    kind: "animal",
    frame: CUBE,
    label: "Firefly · Cube",
    signature: "Square head, square body, square antenna-lights, and a lit window in its chest",
    pitch:
      "Everything else in the cast is round; this is all corners. A block of a head, right-angled antennae with square lights, panel wings, and a four-paned window in its chest that glows through any outfit. Toy-like and graphic — it would make the crispest app icon and stands apart from every mascot on a home screen.",
    risk: "Geometric can read as a robot, not a creature; the square window may look like a UI element.",
    pal: palCube,
    body: CUBE_BODY,
    face: {
      eyes: "bead",
      eyeY: 104,
      eyeGap: 20,
      eyeSize: 1.25,
      mouthY: 120,
      nose: "none",
      brows: true,
      lid: palCube.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <CubeBehind {...c} />,
    head: (c) => <CubeHead {...c} />,
    top: (c) => <CubeAntennae {...c} />,
    pendant: (c) => <CubeWindow {...c} />,
  },
  {
    id: "firefly-hood",
    kind: "animal",
    frame: HOOD,
    label: "Firefly · Hood",
    signature:
      "A cone of a cloak and a floppy pointed hood, with light spilling from the cloak's front",
    pitch:
      "A little traveller: a triangle of a cloak, a hood whose point flops to one side, antennae poking out through slits, and the light glowing from inside where the cloak parts — so it carries its light the way you'd carry a secret. The strongest triangle silhouette in the set; storybook rather than cartoon.",
    risk: "The hood frames the face but crowds hats; a cloak hides the body, so poses read mostly through the arms.",
    pal: palHood,
    body: HOOD_CLOAK,
    face: {
      eyes: "anime",
      eyeY: 108,
      eyeGap: 16,
      mouthY: 126,
      nose: "none",
      brows: true,
      lid: palHood.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <HoodBehind {...c} />,
    head: (c) => <HoodHead {...c} />,
    top: (c) => <HoodAntennae {...c} />,
    pendant: (c) => <HoodLight {...c} />,
  },
];
