import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, GlowGrad, palette } from "./firefly-variants";
import { WISP } from "./firefly-wisp";
import { WHITE, type Palette } from "./rig/palette";
import { pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Wispy fireflies, round two — each drawn from nothing, each floating, each with its light in a
 * place of its own: a comet's mane, a bubble's core, a dandelion's seed, a star's points, the orb
 * a crescent holds. What they share with the bench firefly is the spark trail (`rig/sparks.tsx`):
 * every one leaves glowing sparks behind it as it flies.
 */

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];
const FACE = "#fff4e8";

const pal: Palette = palette(C.primary, C.deep, C.mid, C.primary, {
  line: C.line,
  eye: "#1f1a36",
  glow: "#ffd23f",
  top: C.clothes,
  bottom: C.clothes,
  shoe: C.clothes,
  accent: C.clothes,
  blush: "#ffa3b5",
});

const face = (over: Partial<Candidate["face"]> = {}): Candidate["face"] => ({
  eyes: "anime",
  eyeY: 106,
  eyeGap: 18,
  eyeSize: 1.12,
  mouthY: 124,
  nose: "none",
  brows: true,
  lid: C.mid,
  ...over,
});

const sides = [
  ["L", -1],
  ["R", 1],
] as const;

/** A head that is its colour to the rim: light centre, mid-tone, primary edge — no outline. */
function Orb({
  id,
  cx = 100,
  cy = 104,
  r = 42,
}: {
  id: string;
  cx?: number;
  cy?: number;
  r?: number;
}) {
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="50%" cy="58%" r="60%">
          <stop offset="0%" stopColor={C.soft} />
          <stop offset="70%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.primary} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
      <path
        d={`M${cx - r * 0.66} ${cy - r * 0.2} Q${cx - r * 0.55} ${cy - r * 0.6} ${cx - r * 0.2} ${cy - r * 0.78}`}
        stroke={WHITE}
        strokeOpacity={0.7}
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Halo({ cx, cy, r, mood }: { cx: number; cy: number; r: number; mood?: Ctx["mood"] }) {
  return (
    <circle data-joint="glow" cx={cx} cy={cy} r={r} fill={pal.glow} opacity={0.32 * bright(mood)} />
  );
}

function Wings({ frame, y = 156 }: { frame: Body; y?: number }) {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side}>
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, frame.j)}>
            <ellipse
              cx={100 + 28 * s}
              cy={y + 22}
              rx={11}
              ry={6.5}
              transform={`rotate(${22 * s} ${100 + 28 * s} ${y + 22})`}
              fill={C.tint}
              fillOpacity={0.75}
              stroke={C.hi}
              strokeWidth={1.8}
            />
          </g>
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, frame.j)}>
            <ellipse
              cx={100 + 34 * s}
              cy={y}
              rx={17}
              ry={9}
              transform={`rotate(${-22 * s} ${100 + 34 * s} ${y})`}
              fill={C.tint}
              fillOpacity={0.75}
              stroke={C.hi}
              strokeWidth={2}
            />
          </g>
        </g>
      ))}
    </>
  );
}

const TEARDROP_BODY =
  "M86 150 Q100 144 114 150 Q122 164 114 184 Q106 200 100 208 Q94 200 86 184 Q78 164 86 150 Z";

/* ——— Comet: its light is a mane that streams back from its head ——— */

const COMET: Body = { ...WISP, id: "comet", torso: TEARDROP_BODY };

function CometHead({ uid }: Ctx) {
  const g = `${uid}-mane`;
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={WHITE} />
          <stop offset="35%" stopColor={pal.glow} />
          <stop offset="100%" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      {/* the mane: three tongues of light swept back, as if it is always flying forward */}
      <g data-joint="hairSway" style={pivot("hairSway")}>
        <path
          d="M128 76 C126 44 104 22 70 14 C86 28 90 38 88 48 C78 32 60 26 42 28 C60 38 66 50 64 62 C56 54 44 52 34 56 C52 64 60 78 64 92 Z"
          fill={`url(#${g})`}
          stroke={C.glowEdge}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </g>
      <Orb id={`${uid}-comethead`} />
    </g>
  );
}

function CometBehind({ mood }: Ctx) {
  return (
    <g>
      <Wings frame={COMET} />
      <Halo cx={48} cy={50} r={34} mood={mood} />
    </g>
  );
}

/* ——— Bubble: a soap bubble of a head, a smaller bubble of a body, a light at its core ——— */

const BUBBLE_BODY =
  "M100 152 C114 152 124 164 124 178 C124 192 114 202 100 202 C86 202 76 192 76 178 C76 164 86 152 100 152 Z";
const BUBBLE: Body = { ...WISP, id: "bubble", torso: BUBBLE_BODY };
const BUBBLE_FILL = "color-mix(in oklab, var(--char-tint) 55%, transparent)";

function BubbleHead({ uid }: Ctx) {
  return (
    <g>
      <circle cx={100} cy={100} r={47} fill={BUBBLE_FILL} stroke={C.hi} strokeWidth={2.2} />
      {/* the coloured heart of the bubble, so the face reads on either ground */}
      <Orb id={`${uid}-bubbleface`} cy={110} r={33} />
      {/* iridescence on the skin of the bubble */}
      <path
        d="M62 76 Q76 58 98 54"
        stroke={C.accent}
        strokeOpacity={0.6}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M138 82 Q146 100 142 120"
        stroke={C.hi}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx={74}
        cy={70}
        rx={7}
        ry={4}
        transform="rotate(-40 74 70)"
        fill={WHITE}
        opacity={0.85}
      />
    </g>
  );
}

function BubbleAntennae({ mood }: Ctx) {
  return (
    <g>
      {sides.map(([side, s]) => (
        <Antenna key={side} side={side} base={[100 + 12 * s, 56]} mood={mood}>
          <path
            d={`M${100 + 12 * s} 56 C${100 + 14 * s} 44 ${100 + 22 * s} 38 ${100 + 26 * s} 32`}
            stroke={C.thin}
            strokeWidth={2.6}
            fill="none"
            strokeLinecap="round"
          />
          {/* each tip a tiny bubble */}
          <circle
            cx={100 + 28 * s}
            cy={29}
            r={5}
            fill={BUBBLE_FILL}
            stroke={C.hi}
            strokeWidth={1.6}
          />
          <circle cx={100 + 26.5 * s} cy={27.5} r={1.4} fill={WHITE} />
        </Antenna>
      ))}
    </g>
  );
}

function BubbleCore({ uid }: Ctx) {
  const g = `${uid}-bubblecore`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      <circle cx={100} cy={182} r={10} fill={`url(#${g})`} stroke={C.glowEdge} strokeWidth={1.6} />
      <ellipse
        cx={86}
        cy={164}
        rx={5}
        ry={3}
        transform="rotate(-40 86 164)"
        fill={WHITE}
        opacity={0.8}
      />
    </g>
  );
}

/* ——— Dandelion: a seed spirit under a parachute of filaments; the seed is its light ——— */

const DANDELION: Body = {
  ...WISP,
  id: "dandelion",
  j: {
    ...WISP.j,
    shoulderL: [93, 158],
    elbowL: [86, 178],
    wristL: [82, 196],
    shoulderR: [107, 158],
    elbowR: [114, 178],
    wristR: [118, 196],
  },
  torso: "M92 150 Q100 146 108 150 Q110 176 106 200 Q100 204 94 200 Q90 176 92 150 Z",
};

function DandelionHead() {
  const n = 11;
  return (
    <g>
      {/* the pappus: a fan of fine filaments, each ending in a tuft — its wings and parachute */}
      <g data-joint="hairSway" style={pivot("hairSway")}>
        {Array.from({ length: n }, (_, i) => {
          const a = ((-80 + (160 / (n - 1)) * i) * Math.PI) / 180;
          const x = 100 + Math.sin(a) * 46;
          const y = 70 - Math.cos(a) * 46;
          return (
            <g key={i}>
              <path
                d={`M100 70 L${x} ${y}`}
                stroke={C.thin}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
              <circle cx={x} cy={y} r={4.4} fill={C.tint} stroke={C.hi} strokeWidth={1.4} />
            </g>
          );
        })}
      </g>
      <circle cx={100} cy={112} r={38} fill={C.mid} />
      <path
        d="M72 100 Q78 84 94 80"
        stroke={C.soft}
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function DandelionSeed({ uid }: Ctx) {
  const g = `${uid}-seed`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      <ellipse
        cx={100}
        cy={216}
        rx={9}
        ry={16}
        fill={`url(#${g})`}
        stroke={C.glowEdge}
        strokeWidth={1.6}
      />
      <path d="M100 202 L100 228" stroke={C.glowEdge} strokeOpacity={0.5} strokeWidth={1.2} />
    </g>
  );
}

/* ——— Star: a plush five-pointed star; its two lower points are lit ——— */

/** The star is the whole body: the rig's torso is kept, but empty, behind it. */
const STAR_BODY = "M100 160 Z";
const STAR: Body = { ...WISP, id: "star", torso: STAR_BODY, neck: { x: 100, y: 150, w: 0, h: 0 } };

const starPoints = (cx: number, cy: number, R: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const k = i % 2 === 0 ? R : r;
    return [cx + Math.cos(a) * k, cy + Math.sin(a) * k] as const;
  });

function StarHead({ uid }: Ctx) {
  const pts = starPoints(100, 110, 54, 29);
  const d = `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
  const g = `${uid}-star`;
  const lit = [pts[4], pts[6]];
  return (
    <g>
      <defs>
        <radialGradient id={g} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.primary} />
        </radialGradient>
      </defs>
      {/* a thick stroke in the same fill rounds every point: plush, not sharp */}
      <path d={d} fill={`url(#${g})`} stroke={C.primary} strokeWidth={14} strokeLinejoin="round" />
      <path d={d} fill={`url(#${g})`} />
      {lit.map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={11} fill={pal.glow} opacity={0.4} />
          <circle cx={x} cy={y} r={6.5} fill={pal.glow} stroke={C.glowEdge} strokeWidth={1.4} />
        </g>
      ))}
      <circle cx={100} cy={114} r={25} fill={FACE} />
      <path
        d="M86 70 Q92 60 100 58"
        stroke={C.soft}
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function StarAntennae({ mood }: Ctx) {
  return (
    <g>
      {sides.map(([side, s]) => (
        <Antenna key={side} side={side} base={[100 + 5 * s, 52]} mood={mood}>
          <path
            d={`M${100 + 5 * s} 52 C${100 + 8 * s} 42 ${100 + 16 * s} 38 ${100 + 20 * s} 32`}
            stroke={C.thin}
            strokeWidth={2.6}
            fill="none"
            strokeLinecap="round"
          />
          <circle cx={100 + 21 * s} cy={30} r={3.2} fill={C.primary} />
        </Antenna>
      ))}
    </g>
  );
}

/* ——— Crescent: a small moon that cradles its light like a pearl ——— */

const CRESCENT: Body = {
  ...WISP,
  id: "crescent",
  torso:
    "M88 148 Q100 144 112 148 Q118 160 114 176 Q106 186 100 186 Q94 186 86 176 Q82 160 88 148 Z",
};

function CrescentBehind({ uid, mood }: Ctx) {
  const g = `${uid}-moon`;
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.primary} />
          <stop offset="100%" stopColor={C.mid} />
        </linearGradient>
      </defs>
      <Wings frame={CRESCENT} y={150} />
      {/* the crescent: its body curls down and round from behind its head */}
      <g data-joint="tail" style={pivot("tail", CRESCENT.j)}>
        <path
          d="M70 138 C38 170 44 238 100 254 C134 262 158 244 164 220 C148 238 118 240 100 232 C70 218 64 174 86 150 Z"
          fill={`url(#${g})`}
        />
      </g>
      <Halo cx={128} cy={222} r={30} mood={mood} />
    </g>
  );
}

function CrescentPearl({ uid }: Ctx) {
  const g = `${uid}-pearl`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      <circle cx={128} cy={222} r={13} fill={`url(#${g})`} stroke={C.glowEdge} strokeWidth={1.6} />
      <path
        d="M121 216 Q124 211 130 210"
        stroke={WHITE}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function CrescentAntenna({ mood }: Ctx) {
  // one antenna only, curling to the side the crescent curls from
  return (
    <Antenna side="R" base={[116, 64]} mood={mood}>
      <path
        d="M116 64 C122 50 136 44 142 34 C146 26 138 20 134 26"
        stroke={C.thin}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={134} cy={27} r={3.6} fill={pal.glow} stroke={C.glowEdge} strokeWidth={1.2} />
    </Antenna>
  );
}

export const SPIRITS_2: Candidate[] = [
  {
    id: "firefly-comet",
    kind: "animal",
    frame: COMET,
    legs: false,
    trail: [36, 42],
    label: "Comet",
    signature: "A mane of light that streams back from its head, shedding sparks",
    pitch:
      "The light is its hair: three tongues of flame swept back from the head, as if it is always flying forward, and the sparks peel off the end of the mane. The head is its colour to the rim — no outline. Reads as speed and eagerness even standing still.",
    risk: "Fire on the head can read as hot or angry; the mane competes with every hat.",
    pal,
    body: C.primary,
    face: face({ lid: C.soft }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <CometBehind {...c} />,
    head: (c) => <CometHead {...c} />,
  },
  {
    id: "firefly-bubble",
    kind: "animal",
    frame: BUBBLE,
    legs: false,
    trail: [100, 204],
    label: "Bubble",
    signature:
      "A soap-bubble head around a coloured heart, and a light at the core of its body bubble",
    pitch:
      "Two bubbles, one inside the other: a clear, iridescent bubble for a head with a coloured heart inside it where the face lives, and a smaller bubble of a body with its light floating at the centre. Bubble-tipped antennae. The lightest, most weightless of the set.",
    risk: "A translucent head is fragile at 16px and on busy backgrounds; bubbles pop, which is a sad metaphor.",
    pal,
    body: BUBBLE_FILL,
    face: face({ eyeY: 108, eyeGap: 14, eyeSize: 1, mouthY: 122, lid: C.soft }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <Halo cx={100} cy={182} r={30} mood={c.mood} />,
    head: (c) => <BubbleHead {...c} />,
    top: (c) => <BubbleAntennae {...c} />,
    pendant: (c) => <BubbleCore {...c} />,
  },
  {
    id: "firefly-dandelion",
    kind: "animal",
    frame: DANDELION,
    legs: false,
    trail: [100, 230],
    label: "Dandelion",
    signature: "A parachute of filaments over its head, a slim stem, and a glowing seed",
    pitch:
      "A dandelion seed that came alive: a fan of fine filaments tipped with tufts carries it on the wind in place of wings, its body is a slim stem, and its light is the seed at the bottom — the thing a child blows a wish on. Sparks trail from the seed.",
    risk: "The thinnest body: clothes hang oddly on a stem; the filaments are fine at 16px.",
    pal,
    body: C.primary,
    face: face({ eyeY: 114, eyeGap: 16, eyeSize: 1.05, mouthY: 130 }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <Halo cx={100} cy={216} r={30} mood={c.mood} />,
    head: () => <DandelionHead />,
    pendant: (c) => <DandelionSeed {...c} />,
  },
  {
    id: "firefly-star",
    kind: "animal",
    frame: STAR,
    legs: false,
    arms: false,
    trail: [100, 176],
    label: "Star",
    signature: "A plush five-pointed star whose two lower points glow",
    pitch:
      "The product is called Sparkles; this character is one. A soft, rounded star — every point blunted — with a cream face at its centre, stubby antennae at the top point, and its two lower points lit, so it trails sparks from its feet like a shooting star. The strongest silhouette of the set, and the most obvious app icon.",
    risk: "A star is a common symbol, not a creature — it may read as a sticker or a reward badge, which the brief does not want the guide to be.",
    pal,
    body: C.primary,
    face: face({ eyeY: 110, eyeGap: 12, eyeSize: 0.95, mouthY: 124, lid: FACE }),
    outfit: "bare",
    outfits: OUTFITS,
    head: (c) => <StarHead {...c} />,
    top: (c) => <StarAntennae {...c} />,
  },
  {
    id: "firefly-crescent",
    kind: "animal",
    frame: CRESCENT,
    legs: false,
    trail: [150, 236],
    label: "Crescent",
    signature: "A small moon whose body curls round to cradle its light like a pearl",
    pitch:
      "A crescent moon with a face: the body curls down and round from behind its head, and in the curve it carries its light like a pearl. One antenna curls to the side it curls from. Sparks fall from the tip of the crescent. Calm, a night-time companion.",
    risk: "Moon and night can read as bedtime; the one-sided silhouette needs mirroring for some layouts.",
    pal,
    body: C.primary,
    face: face({ lid: C.soft }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <CrescentBehind {...c} />,
    head: (c) => <Orb id={`${c.uid}-crescenthead`} cy={100} r={40} />,
    top: (c) => <CrescentAntenna {...c} />,
    pendant: (c) => <CrescentPearl {...c} />,
  },
];
