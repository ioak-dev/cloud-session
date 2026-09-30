import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, palette } from "./firefly-variants";
import { WHITE, type Palette } from "./rig/palette";
import { J, pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Wisp: it floats. A droplet head, no legs, and a body that ends in a flame of light. Every Wisp
 * draws in the product's colours (`theme.ts`) — lightened, so it still reads as a pale spirit —
 * and only the flame is its own.
 */

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];
const FACE = "#fbf8ff";

const pal: Palette = palette(C.hi, C.deep, FACE, C.tint, {
  eye: "#241a3a",
  glow: "#ffcf4a",
  top: C.accent,
  bottom: C.accent,
  shoe: C.accent,
  accent: C.accent,
  blush: "#ffb3c4",
});

const face = (over: Partial<Candidate["face"]> = {}): Candidate["face"] => ({
  eyes: "anime",
  eyeY: 108,
  eyeGap: 19,
  eyeSize: 1.15,
  mouthY: 126,
  nose: "none",
  brows: true,
  lid: FACE,
  ...over,
});

const sides = [
  ["L", -1],
  ["R", 1],
] as const;

export const WISP: Body = {
  id: "wisp",
  j: {
    ...J,
    head: [100, 146],
    shoulderL: [84, 160],
    elbowL: [76, 178],
    wristL: [72, 194],
    shoulderR: [116, 160],
    elbowR: [124, 178],
    wristR: [128, 194],
    torso: [100, 200],
    tail: [100, 204],
    wingL: [90, 156],
    wingR: [110, 156],
    hindL: [90, 176],
    hindR: [110, 176],
  },
  headFit: "translate(100 146) scale(1.12) translate(-100 -150)",
  torso:
    "M84 150 Q100 146 116 150 Q124 156 122 172 Q118 194 104 208 Q100 212 96 208 Q82 194 78 172 Q76 156 84 150 Z",
  headVB: "34 -6 132 132",
  w: { upper: 9, fore: 8.5, thigh: 0, shin: 0, hand: 6.2, cloth: 0.9 },
  neck: { x: 94, y: 134, w: 12, h: 20 },
};

/* ——— shared parts ——— */

const DROPLET =
  "M100 44 C110 62 146 72 146 106 C146 130 126 144 100 144 C74 144 54 130 54 106 C54 72 90 62 100 44 Z";

function Head({ uid, d = DROPLET }: Ctx & { d?: string }) {
  const g = `${uid}-wisphead`;
  return (
    <g>
      <defs>
        <radialGradient id={g} cx="50%" cy="62%" r="62%">
          <stop offset="0%" stopColor={FACE} />
          <stop offset="55%" stopColor={C.tint} />
          <stop offset="100%" stopColor={C.soft} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${g})`} stroke={pal.ink} strokeWidth={2.4} strokeLinejoin="round" />
      <path
        d="M70 90 Q76 74 92 64"
        stroke={WHITE}
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function SmokeAntennae({ mood, base = [100, 50] }: Ctx & { base?: readonly [number, number] }) {
  const [bx, by] = base;
  return (
    <g>
      {sides.map(([side, s]) => {
        const x = bx + 18 * s;
        const y = by - 26;
        return (
          <Antenna key={side} side={side} base={[bx + 3 * s, by]} mood={mood}>
            {/* thin as smoke, each tipped with a spark */}
            <path
              d={`M${bx + 3 * s} ${by} C${bx + 10 * s} ${by - 10} ${bx + 20 * s} ${by - 8} ${bx + 24 * s} ${by - 18} C${bx + 26 * s} ${by - 24} ${bx + 22 * s} ${by - 28} ${x} ${y}`}
              stroke={pal.ink}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={x} cy={y} r={6.5} fill={pal.glow} opacity={0.35 * bright(mood)} />
            <circle cx={x} cy={y} r={3} fill={pal.glow} stroke={pal.ink} strokeWidth={1.2} />
          </Antenna>
        );
      })}
    </g>
  );
}

function FlameGrad({ id, dir = [0, 0, 0.3, 1] }: { id: string; dir?: number[] }) {
  const [x1, y1, x2, y2] = dir;
  return (
    <defs>
      <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
        <stop offset="0%" stopColor={WHITE} />
        <stop offset="35%" stopColor={pal.glow} />
        <stop offset="100%" stopColor="#ffb547" />
      </linearGradient>
    </defs>
  );
}

/* ——— Wisp: the original ——— */

function RibbonWings() {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, WISP.j)}>
          {/* ribbon wings that trail like a scarf */}
          <path
            d={`M${100 + 10 * s} 156 C${100 + 40 * s} 136 ${100 + 66 * s} 146 ${100 + 62 * s} 172 C${100 + 60 * s} 192 ${100 + 44 * s} 204 ${100 + 44 * s} 228 C${100 + 34 * s} 206 ${100 + 32 * s} 180 ${100 + 10 * s} 166 Z`}
            fill={C.tint}
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 16 * s} 160 C${100 + 40 * s} 150 ${100 + 56 * s} 160 ${100 + 50 * s} 186`}
            stroke={C.soft}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
    </>
  );
}

function FlameTail({ uid, mood }: Ctx) {
  const g = `${uid}-wisptail`;
  return (
    <g data-joint="tail" style={pivot("tail", WISP.j)}>
      <FlameGrad id={g} />
      <circle
        data-joint="glow"
        cx={104}
        cy={232}
        r={40}
        fill={pal.glow}
        opacity={0.35 * bright(mood)}
      />
      {/* the body ends in light: a flame that flicks to one side */}
      <path
        d="M80 186 Q100 198 120 186 C130 206 126 234 104 250 C98 256 100 266 110 268 C94 270 88 258 92 248 C78 234 74 206 80 186 Z"
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d="M92 204 C90 218 94 230 102 238"
        stroke={WHITE}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/* ——— Wisp · Moth: two pairs of round wings that beat apart; a short, curled flame ——— */

const MOTH: Body = {
  ...WISP,
  id: "wisp-moth",
  torso:
    "M84 150 Q100 144 116 150 C128 160 126 190 112 204 Q100 212 88 204 C74 190 72 160 84 150 Z",
};

function MothWings() {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side}>
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, MOTH.j)}>
            <ellipse
              cx={100 + 40 * s}
              cy={190}
              rx={18}
              ry={14}
              transform={`rotate(${24 * s} ${100 + 40 * s} 190)`}
              fill={C.tint}
              fillOpacity={0.92}
              stroke={pal.ink}
              strokeWidth={2}
            />
            <circle cx={100 + 44 * s} cy={192} r={3.4} fill={C.soft} />
          </g>
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, MOTH.j)}>
            <ellipse
              cx={100 + 48 * s}
              cy={150}
              rx={28}
              ry={22}
              transform={`rotate(${-22 * s} ${100 + 48 * s} 150)`}
              fill={C.tint}
              fillOpacity={0.92}
              stroke={pal.ink}
              strokeWidth={2.2}
            />
            {/* a soft eyespot in the product colour */}
            <circle cx={100 + 54 * s} cy={146} r={7} fill={C.soft} />
            <circle cx={100 + 54 * s} cy={146} r={3} fill={C.primary} />
          </g>
        </g>
      ))}
    </>
  );
}

function CurlTail({ uid, mood }: Ctx) {
  const g = `${uid}-mothtail`;
  return (
    <g data-joint="tail" style={pivot("tail", MOTH.j)}>
      <FlameGrad id={g} />
      <circle
        data-joint="glow"
        cx={100}
        cy={226}
        r={36}
        fill={pal.glow}
        opacity={0.35 * bright(mood)}
      />
      {/* shorter than the original's, curling back on itself like a comma */}
      <path
        d="M86 196 Q100 206 114 196 C122 214 118 234 104 242 C94 248 94 258 104 260 C86 264 78 248 86 236 C76 224 78 208 86 196 Z"
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d="M96 206 C94 216 96 226 102 232"
        stroke={WHITE}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/* ——— Wisp · Swirl: the point of its head curls over; the body is one S of a flame ——— */

const SWIRL_HEAD =
  "M102 58 C94 46 102 32 116 34 C124 36 126 44 120 48 C114 50 110 46 114 42 C120 52 128 66 138 80 C144 90 146 98 146 108 C146 132 126 144 100 144 C74 144 54 132 54 108 C54 80 84 72 102 58 Z";

const SWIRL: Body = {
  ...WISP,
  id: "wisp-swirl",
  torso:
    "M84 150 Q100 144 116 150 C124 170 120 194 108 210 C98 224 106 238 124 244 C104 252 86 240 88 222 C90 206 78 186 80 168 C80 160 80 154 84 150 Z",
};

function FinWings() {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side}>
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, SWIRL.j)}>
            <path
              d={`M${100 + 16 * s} 176 C${100 + 30 * s} 176 ${100 + 44 * s} 186 ${100 + 46 * s} 200 C${100 + 34 * s} 198 ${100 + 22 * s} 190 ${100 + 16 * s} 184 Z`}
              fill={C.tint}
              fillOpacity={0.92}
              stroke={pal.ink}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </g>
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, SWIRL.j)}>
            {/* fins, swept back like a flame's licks */}
            <path
              d={`M${100 + 14 * s} 154 C${100 + 32 * s} 140 ${100 + 56 * s} 132 ${100 + 70 * s} 130 C${100 + 62 * s} 148 ${100 + 40 * s} 164 ${100 + 16 * s} 168 Z`}
              fill={C.tint}
              fillOpacity={0.92}
              stroke={pal.ink}
              strokeWidth={2.2}
              strokeLinejoin="round"
            />
          </g>
        </g>
      ))}
    </>
  );
}

function SwirlGlow({ uid }: Ctx) {
  const g = `${uid}-swirlglow`;
  return (
    <g>
      <FlameGrad id={g} dir={[0, 0, 1, 1]} />
      {/* the end of the S is the light, and it shows over any outfit */}
      <path
        d="M104 214 C100 226 108 238 124 244 C104 252 86 240 88 222 C89 216 92 210 96 206 Q100 212 104 214 Z"
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
    </g>
  );
}

export const WISP_FAMILY: Candidate[] = [
  {
    id: "firefly-wisp",
    kind: "animal",
    frame: WISP,
    legs: false,
    label: "Wisp",
    signature: "A droplet head and a body that ends in a flame of light — it floats",
    pitch:
      "The original: never touches the ground. No legs, just a flame of light where a body would end, and ribbon wings that trail like a scarf. Now tinted from the product colour, so it holds on the light ground and at 16px while still reading as a pale spirit.",
    risk: "Could read as a ghost or a candle flame; trousers and shoes have nowhere to go.",
    pal,
    body: C.soft,
    face: face(),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <RibbonWings />
        <FlameTail {...c} />
      </g>
    ),
    head: (c) => <Head {...c} />,
    top: (c) => <SmokeAntennae {...c} />,
  },
  {
    id: "firefly-wisp-moth",
    kind: "animal",
    frame: MOTH,
    legs: false,
    label: "Wisp · Moth",
    signature: "Two pairs of round wings with eyespots, and a short flame curled like a comma",
    pitch:
      "The softest Wisp: a rounder body, two pairs of round wings — the big upper pair stroking slowly, the small lower pair beating twice to each stroke — with eyespots in the product colour. The flame is shorter and curls back on itself, so it reads as a tail rather than a ghost's hem.",
    risk: "Round wings and eyespots lean moth; the widest Wisp.",
    pal,
    body: C.soft,
    face: face(),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <MothWings />
        <CurlTail {...c} />
      </g>
    ),
    head: (c) => <Head {...c} />,
    top: (c) => <SmokeAntennae {...c} />,
  },
  {
    id: "firefly-wisp-swirl",
    kind: "animal",
    frame: SWIRL,
    legs: false,
    label: "Wisp · Swirl",
    signature:
      "A head whose point curls over like a licked flame, and a body that is one S of fire",
    pitch:
      "The most flame-like: the tip of the droplet curls over like the lick of a flame, the body is a single S that ends in light, and swept-back fins stand in for wings. It has the most movement standing still — a character drawn as one stroke.",
    risk: "Reads as a flame or a genie before a firefly; the curl sits where hats go.",
    pal,
    body: C.soft,
    face: face(),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <FinWings />
        <circle
          data-joint="glow"
          cx={104}
          cy={228}
          r={34}
          fill={pal.glow}
          opacity={0.35 * bright(c.mood)}
        />
      </g>
    ),
    head: (c) => <Head {...c} d={SWIRL_HEAD} />,
    top: (c) => <SmokeAntennae {...c} base={[104, 54]} />,
    pendant: (c) => <SwirlGlow {...c} />,
  },
];
