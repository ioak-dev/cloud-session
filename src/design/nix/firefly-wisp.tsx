import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, palette } from "./firefly-variants";
import type { Palette } from "./rig/palette";
import { J, pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Wisp — the main character. A floating firefly: a droplet head, no legs, a body that ends in a
 * flame of light, two pairs of wings, and the sparks it leaves behind as it flies (`rig/sparks`).
 *
 * Drawing rules it settles:
 * - Colour is the product's (`theme.ts`); only the flame and sparks are the firefly's own.
 * - No outline on the body, head, limbs or hands: parts are told apart by colour. The translucent
 *   parts (wings) and the flame keep a hairline edge in their own tone.
 * - No specular highlights: nothing that depends on where light comes from, so nothing that would
 *   have to move, fade or flicker when it animates. Details are fixed anatomy: the wing spots and
 *   veins, the rings on the flame.
 * - The antennae grow from behind the head.
 */

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

/** Every edge that remains is this weight: a hairline at the figure's scale. */
const HAIR = 1.2;
const AMBER = "var(--char-glow-edge)";

const pal: Palette = palette(C.primary, C.deep, C.mid, C.primary, {
  line: C.line,
  eye: "#241a3a",
  glow: "#ffcf4a",
  top: C.accent,
  bottom: C.accent,
  shoe: C.accent,
  accent: C.accent,
  blush: "#ffb3c4",
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
    tail: [100, 188],
    wingL: [90, 156],
    wingR: [110, 156],
    hindL: [90, 170],
    hindR: [110, 170],
  },
  headFit: "translate(100 146) scale(1.12) translate(-100 -150)",
  /* the pack sized to a short, rounded body */
  packFit: "translate(100 150) scale(0.8 0.7) translate(-100 -150)",
  /* A short body, rounded below: the flame continues it rather than hanging from a point. */
  torso:
    "M84 150 Q100 146 116 150 Q124 156 122 172 Q121 186 112 192 Q100 197 88 192 Q79 186 78 172 Q76 156 84 150 Z",
  headVB: "34 -6 132 132",
  w: { upper: 9, fore: 8.5, thigh: 0, shin: 0, hand: 6.2, cloth: 0.9 },
  neck: { x: 94, y: 134, w: 12, h: 20 },
};

const DROPLET =
  "M100 44 C110 62 146 72 146 106 C146 130 126 144 100 144 C74 144 54 130 54 106 C54 72 90 62 100 44 Z";

/* ——— head: antennae first, so they grow from behind it ——— */

function Antennae({ mood }: Ctx) {
  return (
    <g>
      {sides.map(([side, s]) => {
        const bx = 100 + 3 * s;
        const by = 58;
        const x = 100 + 21 * s;
        const y = 32;
        return (
          <Antenna key={side} side={side} base={[bx, by]} mood={mood}>
            <path
              d={`M${bx} ${by} C${bx + 4 * s} 46 ${100 + 18 * s} 46 ${100 + 22 * s} 38 C${100 + 24 * s} 34 ${100 + 23 * s} 31 ${x} ${y}`}
              stroke={C.thin}
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={x} cy={y} r={6.5} fill={pal.glow} opacity={0.35 * bright(mood)} />
            <circle cx={x} cy={y} r={3} fill={pal.glow} stroke={AMBER} strokeWidth={HAIR} />
          </Antenna>
        );
      })}
    </g>
  );
}

function Head(c: Ctx) {
  const g = `${c.uid}-wisphead`;
  return (
    <g>
      <Antennae {...c} />
      <defs>
        {/* its colour, light at the heart and full at the rim; the rim is the edge */}
        <radialGradient id={g} cx="50%" cy="62%" r="62%">
          <stop offset="0%" stopColor={C.tint} />
          <stop offset="40%" stopColor={C.soft} />
          <stop offset="78%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.primary} />
        </radialGradient>
      </defs>
      <path d={DROPLET} fill={`url(#${g})`} />
    </g>
  );
}

/* ——— wings: two pairs on their own joints, each with a fixed pattern of spots ——— */

/** Spots on the upper wing, as offsets from the body's centre line: outward, down, radius. */
const UPPER_SPOTS = [
  [62, 124, 4.2],
  [52, 136, 2.8],
  [70, 138, 2],
  [44, 148, 1.5],
  [60, 112, 1.3],
] as const;
const LOWER_SPOTS = [
  [44, 190, 2.8],
  [36, 182, 1.7],
  [48, 200, 1.3],
] as const;

function Wings() {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side}>
          {/* the lower pair: small paddles that beat twice to each stroke of the upper */}
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, WISP.j)}>
            <path
              d={`M${100 + 12 * s} 166 C${100 + 30 * s} 166 ${100 + 50 * s} 178 ${100 + 55 * s} 194 C${100 + 58 * s} 206 ${100 + 42 * s} 208 ${100 + 32 * s} 198 C${100 + 22 * s} 188 ${100 + 14 * s} 178 ${100 + 12 * s} 172 Z`}
              fill={C.tint}
              fillOpacity={0.82}
              stroke={C.hi}
              strokeWidth={HAIR}
              strokeLinejoin="round"
            />
            <path
              d={`M${100 + 14 * s} 170 Q${100 + 34 * s} 178 ${100 + 50 * s} 198`}
              stroke={C.hi}
              strokeWidth={HAIR}
              fill="none"
            />
            {LOWER_SPOTS.map(([dx, y, r]) => (
              <circle key={dx} cx={100 + dx * s} cy={y} r={r} fill={C.hi} />
            ))}
          </g>
          {/* the upper pair: long, swept up and out, rounded at the tip */}
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, WISP.j)}>
            <path
              d={`M${100 + 10 * s} 154 C${100 + 26 * s} 128 ${100 + 56 * s} 106 ${100 + 74 * s} 112 C${100 + 88 * s} 118 ${100 + 78 * s} 146 ${100 + 52 * s} 162 C${100 + 36 * s} 172 ${100 + 20 * s} 168 ${100 + 10 * s} 162 Z`}
              fill={C.tint}
              fillOpacity={0.82}
              stroke={C.hi}
              strokeWidth={HAIR}
              strokeLinejoin="round"
            />
            <path
              d={`M${100 + 12 * s} 158 Q${100 + 42 * s} 132 ${100 + 72 * s} 118 M${100 + 30 * s} 150 Q${100 + 50 * s} 148 ${100 + 66 * s} 140`}
              stroke={C.hi}
              strokeWidth={HAIR}
              fill="none"
            />
            {UPPER_SPOTS.map(([dx, y, r]) => (
              <circle key={`${dx}${y}`} cx={100 + dx * s} cy={y} r={r} fill={C.hi} />
            ))}
          </g>
        </g>
      ))}
    </>
  );
}

/* ——— the flame: its light, with rings that are part of its body ——— */

/**
 * The flame is the lower body turning into light. It starts up inside the body in the body's own
 * colour, so where the two overlap there is no seam at any angle of sway, and only below the body
 * does it turn to glow and then amber. No edge line: a line would show where it is still body.
 */
function Flame({ uid, mood }: Ctx) {
  const g = `${uid}-wispflame`;
  return (
    <g data-joint="tail" style={pivot("tail", WISP.j)}>
      <defs>
        <linearGradient id={g} gradientUnits="userSpaceOnUse" x1="100" y1="170" x2="106" y2="270">
          <stop offset="0" stopColor={C.mid} />
          <stop offset="0.24" stopColor={C.mid} />
          <stop offset="0.4" stopColor={pal.glow} />
          <stop offset="0.8" stopColor={pal.glow} />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <circle
        data-joint="glow"
        cx={104}
        cy={236}
        r={38}
        fill={pal.glow}
        opacity={0.35 * bright(mood)}
      />
      <path
        d="M84 170 C84 164 116 164 116 170 C126 200 126 232 104 250 C98 256 100 266 110 268 C94 270 88 258 92 248 C76 234 74 202 84 170 Z"
        fill={`url(#${g})`}
      />
      {/* two rings, as on a firefly's lantern: fixed anatomy */}
      <path
        d="M84 214 Q102 222 122 212 M88 231 Q102 237 116 228"
        stroke={AMBER}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export const WISP_MAIN: Candidate = {
  id: "firefly-wisp",
  kind: "animal",
  frame: WISP,
  legs: false,
  outline: false,
  hands: "wisp",
  trail: [104, 264],
  label: "Wisp",
  signature: "A floating firefly: a droplet head, a flame of light for a body, sparks left behind",
  pitch:
    "The main character. Its colour runs from a light heart to the product's primary at the rim, so the colour is its edge. Antennae grow from behind the head; two pairs of spotted wings beat apart; the flame carries two fixed rings like a firefly's lantern, and it leaves glowing sparks behind it as it flies.",
  risk: "Trousers and shoes have nowhere to go on a body without legs.",
  pal,
  body: C.mid,
  face: {
    eyes: "anime",
    eyeY: 108,
    eyeGap: 19,
    eyeSize: 1.15,
    mouthY: 126,
    nose: "none",
    brows: true,
    lid: C.soft,
  },
  outfit: "bare",
  outfits: OUTFITS,
  behind: (c) => (
    <g>
      <Wings />
      <Flame {...c} />
    </g>
  ),
  head: (c) => <Head {...c} />,
};
