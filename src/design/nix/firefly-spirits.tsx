import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, GlowGrad, palette } from "./firefly-variants";
import { WISP } from "./firefly-wisp";
import { WHITE, type Palette } from "./rig/palette";
import { pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Wispy fireflies drawn from scratch, not from Wisp's droplet: a cloud, a jellyfish bell, a
 * bellflower. Each floats (no legs) and keeps a firefly's antennae, wings and light — but puts the
 * light somewhere of its own: at the core, at the tendril tips, hanging below the petals.
 */

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

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

function GlowTip({ x, y, r, mood }: { x: number; y: number; r: number; mood?: Ctx["mood"] }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2} fill={pal.glow} opacity={0.35 * bright(mood)} />
      <circle cx={x} cy={y} r={r} fill={pal.glow} stroke={C.glowEdge} strokeWidth={1.2} />
    </g>
  );
}

/* ——— Puff: a cloud that floats, with its light at its core ——— */

const PUFF: Body = {
  ...WISP,
  id: "puff",
  torso:
    "M82 152 C76 150 72 160 76 168 C68 172 70 186 80 188 C78 200 92 206 100 200 C108 206 122 200 120 188 C130 186 132 172 124 168 C128 160 124 150 118 152 C112 144 88 144 82 152 Z",
};

const CLOUD = [
  [100, 104, 40],
  [64, 112, 20],
  [136, 112, 20],
  [76, 78, 22],
  [124, 78, 22],
  [100, 66, 25],
] as const;

function PuffHead() {
  return (
    <g>
      {CLOUD.map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={C.mid} />
      ))}
      {/* the sunlit tops of the puffs */}
      <circle cx={92} cy={58} r={11} fill={C.soft} />
      <circle cx={72} cy={74} r={8} fill={C.soft} />
      <circle cx={120} cy={70} r={7} fill={C.soft} />
    </g>
  );
}

function PuffAntennae({ mood }: Ctx) {
  return (
    <g>
      {sides.map(([side, s]) => (
        <Antenna key={side} side={side} base={[100 + 10 * s, 46]} mood={mood}>
          <path
            d={`M${100 + 10 * s} 46 C${100 + 12 * s} 34 ${100 + 20 * s} 32 ${100 + 26 * s} 30`}
            stroke={C.thin}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          {/* each tip a tiny puff with a spark in it */}
          <circle cx={100 + 28 * s} cy={29} r={6} fill={C.mid} />
          <circle cx={100 + 28 * s} cy={29} r={2.6} fill={pal.glow} />
        </Antenna>
      ))}
    </g>
  );
}

function PuffBehind({ mood }: Ctx) {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side}>
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, PUFF.j)}>
            <ellipse
              cx={100 + 30 * s}
              cy={184}
              rx={11}
              ry={7}
              transform={`rotate(${20 * s} ${100 + 30 * s} 184)`}
              fill={C.tint}
              fillOpacity={0.75}
              stroke={C.hi}
              strokeWidth={1.8}
            />
          </g>
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, PUFF.j)}>
            <ellipse
              cx={100 + 36 * s}
              cy={156}
              rx={16}
              ry={10}
              transform={`rotate(${-24 * s} ${100 + 36 * s} 156)`}
              fill={C.tint}
              fillOpacity={0.75}
              stroke={C.hi}
              strokeWidth={2}
            />
          </g>
        </g>
      ))}
      {/* the trail it leaves: puffs thinning out behind */}
      <g data-joint="tail" style={pivot("tail", PUFF.j)}>
        {[
          [92, 214, 10, 0.85],
          [106, 228, 8, 0.7],
          [96, 242, 6, 0.55],
          [104, 254, 4, 0.4],
        ].map(([x, y, r, o]) => (
          <circle key={y} cx={x} cy={y} r={r} fill={C.mid} opacity={o} />
        ))}
      </g>
      <circle
        data-joint="glow"
        cx={100}
        cy={178}
        r={30}
        fill={pal.glow}
        opacity={0.3 * bright(mood)}
      />
    </g>
  );
}

function PuffCore({ uid }: Ctx) {
  const g = `${uid}-puffcore`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      {/* a light at its core, showing through anything it wears */}
      <circle cx={100} cy={178} r={9} fill={`url(#${g})`} stroke={C.glowEdge} strokeWidth={1.6} />
    </g>
  );
}

/* ——— Jelly: a floating bell with glowing tendrils ——— */

const JELLY: Body = {
  ...WISP,
  id: "jelly",
  j: {
    ...WISP.j,
    shoulderL: [87, 136],
    elbowL: [80, 154],
    wristL: [77, 170],
    shoulderR: [113, 136],
    elbowR: [120, 154],
    wristR: [123, 170],
    wingL: [90, 138],
    wingR: [110, 138],
    hindL: [90, 152],
    hindR: [110, 152],
    torso: [100, 170],
  },
  torso:
    "M85 122 Q100 116 115 122 Q121 144 115 164 Q106 176 100 176 Q94 176 85 164 Q79 144 85 122 Z",
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

const BELL =
  "M50 118 C50 70 74 48 100 48 C126 48 150 70 150 118 C142 126 136 120 128 126 C120 132 114 124 106 128 C100 132 94 124 86 128 C78 132 72 122 64 126 C58 128 54 124 50 118 Z";

function JellyHead({ uid }: Ctx) {
  const g = `${uid}-bell`;
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.primary} />
          <stop offset="70%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.soft} />
        </linearGradient>
      </defs>
      <path d={BELL} fill={`url(#${g})`} />
      {/* the frilled rim, a shade lighter */}
      <path
        d="M52 116 C58 124 64 122 68 120 C76 126 82 124 88 122 C96 128 104 128 112 122 C118 124 124 126 132 120 C136 122 142 124 148 116"
        stroke={C.tint}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M66 82 Q76 62 96 56"
        stroke={C.hi}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function JellyAntennae({ mood }: Ctx) {
  return (
    <g>
      {sides.map(([side, s]) => (
        <Antenna key={side} side={side} base={[100 + 10 * s, 50]} mood={mood}>
          <path
            d={`M${100 + 10 * s} 50 C${100 + 8 * s} 36 ${100 + 18 * s} 28 ${100 + 26 * s} 30`}
            stroke={C.thin}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <GlowTip x={100 + 28 * s} y={30} r={3.2} mood={mood} />
        </Antenna>
      ))}
    </g>
  );
}

function JellyBehind({ mood }: Ctx) {
  const xs = [80, 92, 108, 120];
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side}>
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, JELLY.j)}>
            <ellipse
              cx={100 + 24 * s}
              cy={158}
              rx={11}
              ry={6}
              transform={`rotate(${22 * s} ${100 + 24 * s} 158)`}
              fill={C.tint}
              fillOpacity={0.75}
              stroke={C.hi}
              strokeWidth={1.8}
            />
          </g>
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, JELLY.j)}>
            <ellipse
              cx={100 + 30 * s}
              cy={140}
              rx={17}
              ry={9}
              transform={`rotate(${-20 * s} ${100 + 30 * s} 140)`}
              fill={C.tint}
              fillOpacity={0.75}
              stroke={C.hi}
              strokeWidth={2}
            />
          </g>
        </g>
      ))}
      {/* tendrils that trail and sway; the light is at their tips */}
      <g data-joint="tail" style={pivot("tail", JELLY.j)}>
        <circle
          data-joint="glow"
          cx={100}
          cy={240}
          r={40}
          fill={pal.glow}
          opacity={0.25 * bright(mood)}
        />
        {xs.map((x, i) => {
          const end = 228 + (i % 2) * 14;
          return (
            <g key={x}>
              <path
                d={`M${x} 140 C${x - 10} 170 ${x + 10} 196 ${x} ${end}`}
                stroke={C.hi}
                strokeWidth={5}
                strokeOpacity={0.85}
                fill="none"
                strokeLinecap="round"
              />
              <GlowTip x={x} y={end + 4} r={4.2} mood={mood} />
            </g>
          );
        })}
      </g>
    </g>
  );
}

/* ——— Bloom: a bellflower spirit; its light hangs below the petals like a lamp ——— */

const BLOOM: Body = {
  ...WISP,
  id: "bloom",
  torso:
    "M86 150 Q100 146 114 150 C124 158 130 176 136 196 C128 192 124 200 118 196 C112 202 106 196 100 202 C94 196 88 202 82 196 C76 200 72 192 64 196 C70 176 76 158 86 150 Z",
};

function BloomHead() {
  return (
    <g>
      {/* a crown of petals behind the head */}
      {[-56, -28, 0, 28, 56].map((a) => (
        <ellipse
          key={a}
          cx={100}
          cy={50}
          rx={13}
          ry={24}
          transform={`rotate(${a} 100 100)`}
          fill={C.primary}
        />
      ))}
      <ellipse cx={100} cy={104} rx={44} ry={40} fill={C.mid} />
      <path
        d="M68 86 Q76 72 92 68"
        stroke={C.soft}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function BloomAntennae({ mood }: Ctx) {
  return (
    <g>
      {sides.map(([side, s]) => (
        <Antenna key={side} side={side} base={[100 + 10 * s, 64]} mood={mood}>
          {/* tendrils that curl like a vine, each ending in a bud */}
          <path
            d={`M${100 + 10 * s} 64 C${100 + 16 * s} 48 ${100 + 30 * s} 46 ${100 + 32 * s} 36 C${100 + 34 * s} 28 ${100 + 24 * s} 26 ${100 + 24 * s} 32`}
            stroke={C.thin}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx={100 + 24 * s} cy={33} rx={3.4} ry={4.6} fill={C.primary} />
        </Antenna>
      ))}
    </g>
  );
}

function BloomBehind({ mood }: Ctx) {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side}>
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, BLOOM.j)}>
            <path
              d={`M${100 + 18 * s} 176 C${100 + 34 * s} 170 ${100 + 50 * s} 178 ${100 + 56 * s} 190 C${100 + 42 * s} 194 ${100 + 28 * s} 188 ${100 + 18 * s} 182 Z`}
              fill={C.tint}
              fillOpacity={0.75}
              stroke={C.hi}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          </g>
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, BLOOM.j)}>
            {/* leaf wings, with a midrib */}
            <path
              d={`M${100 + 14 * s} 158 C${100 + 40 * s} 140 ${100 + 64 * s} 146 ${100 + 70 * s} 132 C${100 + 66 * s} 160 ${100 + 44 * s} 172 ${100 + 14 * s} 166 Z`}
              fill={C.tint}
              fillOpacity={0.75}
              stroke={C.hi}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <path
              d={`M${100 + 16 * s} 162 Q${100 + 44 * s} 154 ${100 + 66 * s} 136`}
              stroke={C.hi}
              strokeWidth={1.4}
              fill="none"
            />
          </g>
        </g>
      ))}
      <circle
        data-joint="glow"
        cx={100}
        cy={234}
        r={36}
        fill={pal.glow}
        opacity={0.35 * bright(mood)}
      />
    </g>
  );
}

function BloomLamp({ uid }: Ctx) {
  const g = `${uid}-bloomlamp`;
  return (
    <g data-joint="tail" style={pivot("tail", { ...BLOOM.j, tail: [100, 200] })}>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      {/* the stamen hangs from the flower, and its tip is the light */}
      <path d="M100 198 L100 224" stroke={C.deep} strokeWidth={3} strokeLinecap="round" />
      <circle cx={100} cy={235} r={11} fill={`url(#${g})`} stroke={C.glowEdge} strokeWidth={1.8} />
      <path
        d="M93 225 Q100 221 107 225"
        stroke={C.deep}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M94 232 Q96 228 100 227"
        stroke={WHITE}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export const SPIRITS: Candidate[] = [
  {
    id: "firefly-puff",
    kind: "animal",
    frame: PUFF,
    legs: false,
    trail: [100, 256],
    label: "Puff",
    signature: "A cloud that floats, with a light at its core and a trail of little puffs",
    pitch:
      "A cloud rather than a droplet: a head of soft puffs, a small cloud body, and a trail of puffs thinning out behind as it drifts. Its light sits at its core, in its chest, and shows through anything it wears. Puff-tipped antennae each hold a spark.",
    risk: "Reads as weather before a firefly; clouds are common in kids' apps.",
    pal,
    body: C.mid,
    face: face(),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <PuffBehind {...c} />,
    head: () => <PuffHead />,
    top: (c) => <PuffAntennae {...c} />,
    pendant: (c) => <PuffCore {...c} />,
  },
  {
    id: "firefly-jelly",
    kind: "animal",
    frame: JELLY,
    legs: false,
    trail: [100, 248],
    label: "Jelly",
    signature: "A floating bell with a frilled rim, and tendrils whose tips glow",
    pitch:
      "A jellyfish-shaped firefly: the head is a bell with a frilled rim, and beneath it tendrils trail and sway — each tipped with a point of light, so the glow is scattered like bioluminescence. The bell shades from the product's primary at the crown to its mid-tone at the rim.",
    risk: "Jellyfish can read as stinging; many light points make the signature less single.",
    pal,
    body: C.mid,
    face: face({ eyeY: 100, eyeGap: 19, mouthY: 115 }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <JellyBehind {...c} />,
    head: (c) => <JellyHead {...c} />,
    top: (c) => <JellyAntennae {...c} />,
  },
  {
    id: "firefly-bloom",
    kind: "animal",
    frame: BLOOM,
    legs: false,
    trail: [100, 248],
    label: "Bloom",
    signature:
      "A bellflower spirit: a crown of petals, a petal skirt, and its light hanging below like a lamp",
    pitch:
      "A flower that flies: a crown of petals frames the face, the body is an upturned bellflower, leaf wings beat in two pairs, and the light hangs from the flower's centre like a stamen — a lamp it carries beneath it. Vine-curl antennae end in buds.",
    risk: "Reads as a fairy or a flower before a firefly; the petal crown competes with hats.",
    pal,
    body: C.primary,
    face: face({ eyeY: 108, mouthY: 126 }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <BloomBehind {...c} />,
    head: () => <BloomHead />,
    top: (c) => <BloomAntennae {...c} />,
    pendant: (c) => <BloomLamp {...c} />,
  },
];
