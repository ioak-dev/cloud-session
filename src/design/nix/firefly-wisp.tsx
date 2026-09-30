import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, palette } from "./firefly-variants";
import { WHITE, type Palette } from "./rig/palette";
import { J, pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Wisp: it floats. A droplet head, no legs, and a body that ends in a flame of light. Every Wisp
 * draws in the product's colours (`theme.ts`); only the flame is its own. Wisp is the chosen main
 * character.
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
  line: C.line,
  eye: "#241a3a",
  glow: "#ffcf4a",
  top: C.accent,
  bottom: C.accent,
  shoe: C.accent,
  accent: C.accent,
  blush: "#ffb3c4",
});

/** Colour-corrected: limbs in the primary, the body in its mid-tone. */
const palTrue: Palette = {
  ...pal,
  skin: C.mid,
  skinShade: C.primary,
  limb: C.primary,
  paw: C.deep,
  hair: C.primary,
};
/** Solid: opaque primary, a cream face patch. */
const palSolid: Palette = {
  ...pal,
  skin: C.primary,
  skinShade: C.deep,
  limb: C.deep,
  paw: C.deep,
  hair: C.primary,
};

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

/**
 * `pale`: the original, a near-white spirit. `true`: colour-corrected — the body sits in the
 * product's mid-tones, so it is a colour on the dark ground rather than a white shape. `solid`:
 * flat and opaque, with a face patch for the features.
 */
type Look = "pale" | "true" | "solid";

function Head({ uid, d = DROPLET, look = "pale" }: Ctx & { d?: string; look?: Look }) {
  const g = `${uid}-wisphead`;
  if (look === "solid") {
    return (
      <g>
        <path d={d} fill={C.primary} />
        <path
          d="M62 112 C62 94 80 86 100 86 C120 86 138 94 138 112 C138 130 120 140 100 140 C80 140 62 130 62 112 Z"
          fill={FACE}
        />
        <path
          d="M72 88 Q78 74 92 64"
          stroke={C.hi}
          strokeWidth={3.4}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  }
  const stops =
    look === "true"
      ? [
          [0, C.tint],
          [45, C.soft],
          [100, C.mid],
        ]
      : [
          [0, FACE],
          [55, C.tint],
          [100, C.soft],
        ];
  return (
    <g>
      <defs>
        <radialGradient id={g} cx="50%" cy="62%" r="62%">
          {stops.map(([o, c]) => (
            <stop key={o} offset={`${o}%`} stopColor={c as string} />
          ))}
        </radialGradient>
      </defs>
      <path
        d={d}
        fill={`url(#${g})`}
        stroke={look === "true" ? C.primary : C.hi}
        strokeWidth={look === "true" ? 2 : 2.4}
        strokeLinejoin="round"
      />
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

/** Pip's coiled-spring antennae, rising from the droplet's point. */
function CurlyAntennae({ mood }: Ctx) {
  return (
    <g>
      {(
        [
          [
            "L",
            "M96 50 C95 46 90 45 90 41 C90 36 97 36 97 40 C97 44 90 44 88 38 C87 35 88 33 89 32",
            [89, 31],
          ],
          [
            "R",
            "M104 50 C105 46 110 45 110 41 C110 36 103 36 103 40 C103 44 110 44 112 38 C113 35 112 33 111 32",
            [111, 31],
          ],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 96 : 104, 50]} mood={mood}>
          <path d={d} stroke={C.thin} strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={6} fill={pal.glow} opacity={0.35 * bright(mood)} />
          <circle cx={x} cy={y} r={3.6} fill={pal.glow} stroke={C.glowEdge} strokeWidth={1.2} />
        </Antenna>
      ))}
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
              stroke={C.thin}
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={x} cy={y} r={6.5} fill={pal.glow} opacity={0.35 * bright(mood)} />
            <circle cx={x} cy={y} r={3} fill={pal.glow} stroke={C.glowEdge} strokeWidth={1.2} />
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

function RibbonWings({ opacity = 0.9 }: { opacity?: number }) {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, WISP.j)}>
          {/* ribbon wings that trail like a scarf */}
          <path
            d={`M${100 + 10 * s} 156 C${100 + 40 * s} 136 ${100 + 66 * s} 146 ${100 + 62 * s} 172 C${100 + 60 * s} 192 ${100 + 44 * s} 204 ${100 + 44 * s} 228 C${100 + 34 * s} 206 ${100 + 32 * s} 180 ${100 + 10 * s} 166 Z`}
            fill={C.tint}
            fillOpacity={opacity}
            stroke={C.hi}
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

function FlameTail({ uid, mood, solid = false }: Ctx & { solid?: boolean }) {
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
        fill={solid ? pal.glow : `url(#${g})`}
        stroke={C.glowEdge}
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
              stroke={C.hi}
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
              stroke={C.hi}
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
        stroke={C.glowEdge}
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
    id: "firefly-wisp-true",
    kind: "animal",
    frame: WISP,
    legs: false,
    label: "Wisp · True colour",
    signature: "The original Wisp, colour-corrected to sit in the product's mid-tones",
    pitch:
      "The base Wisp with its colour corrected: the head glows from a light centre out to the product's mid-tone, the body and limbs take the primary, and the head edge is the primary itself. On the dark ground it reads as a colour, not a white shape; on the light ground it keeps Wisp's luminous centre.",
    risk: "Less ghostly than the pale original; the soft gradient needs care at 16px.",
    pal: palTrue,
    body: C.mid,
    face: face({ lid: C.soft }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <RibbonWings opacity={0.8} />
        <FlameTail {...c} />
      </g>
    ),
    head: (c) => <Head {...c} look="true" />,
    top: (c) => <SmokeAntennae {...c} />,
  },
  {
    id: "firefly-wisp-solid",
    kind: "animal",
    frame: WISP,
    legs: false,
    label: "Wisp · Solid",
    signature: "Opaque, flat Wisp: only the wings and the glow's halo are translucent",
    pitch:
      "Everything is a flat, opaque shape in the product's primary — the Duolingo way — with a cream face patch so the eyes read. Only the wings and the glow's halo let the ground through. The flame is a solid yellow. The simplest to reproduce anywhere: an icon, a sticker, a print.",
    risk: "Loses the lit-from-within feel; the most like a generic mascot.",
    pal: palSolid,
    body: C.primary,
    face: face({ lid: FACE }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <RibbonWings opacity={0.6} />
        <FlameTail {...c} solid />
      </g>
    ),
    head: (c) => <Head {...c} look="solid" />,
    top: (c) => <SmokeAntennae {...c} />,
  },
  {
    id: "firefly-wisp-curly",
    kind: "animal",
    frame: WISP,
    legs: false,
    label: "Wisp · Curly",
    signature: "True-colour Wisp with Pip's coiled-spring antennae",
    pitch:
      "The colour-corrected Wisp wearing Pip's coiled antennae, each tipped with a spark. The springs add bounce to a character that otherwise drifts, and they react to every mood.",
    risk: "Busier head; the springs compete with hats.",
    pal: palTrue,
    body: C.mid,
    face: face({ lid: C.soft }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <RibbonWings opacity={0.8} />
        <FlameTail {...c} />
      </g>
    ),
    head: (c) => <Head {...c} look="true" />,
    top: (c) => <CurlyAntennae {...c} />,
  },
];
