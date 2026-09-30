import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, GlowGrad, palette } from "./firefly-variants";
import { WHITE, type Palette } from "./rig/palette";
import { J, pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Pip: a bean. Head and body are one shape, it stands on stubby legs, and the bottom of the bean
 * glows — through any outfit. Every Pip draws in the product's colours (`theme.ts`); only the glow
 * is its own.
 *
 * Where a Pip has two pairs of wings, the upper pair rides `wingL`/`wingR` and the lower pair
 * `hindL`/`hindR`, so the two move apart but to one rhythm (`poses.ts`).
 */

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];
const NO_NECK = { x: 100, y: 150, w: 0, h: 0 };
const FACE = "#fff4e8";

const pal: Palette = palette(C.deep, C.deep, FACE, "#efd8c6", {
  eye: "#241a2e",
  glow: "#ffd84a",
  top: C.accent,
  bottom: C.accent,
  shoe: C.accent,
  accent: C.accent,
  blush: "#ff9aae",
});

const face = (over: Partial<Candidate["face"]> = {}): Candidate["face"] => ({
  eyes: "bead",
  eyeY: 106,
  eyeGap: 16,
  eyeSize: 1.3,
  mouthY: 124,
  nose: "none",
  brows: false,
  lid: FACE,
  ...over,
});

export const PIP: Body = {
  id: "pip",
  j: {
    ...J,
    shoulderL: [58, 176],
    elbowL: [50, 194],
    wristL: [47, 210],
    shoulderR: [142, 176],
    elbowR: [150, 194],
    wristR: [153, 210],
    torso: [100, 230],
    hipL: [86, 240],
    kneeL: [85, 255],
    footL: [84, 269],
    hipR: [114, 240],
    kneeR: [115, 255],
    footR: [116, 269],
    tail: [100, 236],
    wingL: [62, 140],
    wingR: [138, 140],
    hindL: [58, 136],
    hindR: [142, 136],
  },
  torso:
    "M56 150 C56 140 70 136 100 136 C130 136 144 140 144 150 C144 170 142 182 146 202 C148 236 128 256 100 256 C72 256 52 236 54 202 C58 182 56 170 56 150 Z",
  headVB: "34 8 132 132",
  w: { upper: 10, fore: 9.5, thigh: 14, shin: 13, hand: 7.4, cloth: 1 },
  neck: NO_NECK,
};

/* ——— shared parts ——— */

const BEAN_TOP =
  "M54 160 C54 126 54 98 60 82 C68 62 84 52 100 52 C116 52 132 62 140 82 C146 98 146 126 146 160";
const BEAN_GLOW = "M57 228 Q100 242 143 228 C140 246 124 256 100 256 C76 256 60 246 57 228 Z";

/** The upper bean, filled down over the body so there is no seam, outlined only on top. */
function BeanTop({
  d = BEAN_TOP,
  faceAt = [100, 110, 36, 29],
  shine = "M70 80 Q80 66 94 62",
}: {
  d?: string;
  faceAt?: number[];
  shine?: string;
}) {
  const [cx, cy, rx, ry] = faceAt;
  return (
    <g>
      <path d={`${d} Z`} fill={C.primary} />
      <path d={d} fill="none" stroke={pal.ink} strokeWidth={2.6} strokeLinecap="round" />
      <path d={shine} stroke={C.hi} strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={FACE} />
    </g>
  );
}

/** The light is the bean's own bottom, and it shines through any outfit. */
function BottomGlow({ uid, d = BEAN_GLOW }: Ctx & { d?: string }) {
  const g = `${uid}-pipglow`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      <path d={d} fill={`url(#${g})`} stroke={pal.ink} strokeWidth={2.4} strokeLinejoin="round" />
      <path
        d="M72 238 Q80 244 90 246"
        stroke={WHITE}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Halo({ mood, cy = 244 }: Ctx & { cy?: number }) {
  return (
    <circle
      data-joint="glow"
      cx={100}
      cy={cy}
      r={46}
      fill={pal.glow}
      opacity={0.3 * bright(mood)}
    />
  );
}

function SpringAntennae({ mood }: Ctx) {
  return (
    <g>
      {(
        [
          [
            "L",
            "M90 56 C88 46 80 44 80 36 C80 28 90 28 90 34 C90 40 80 40 76 30 C74 24 76 20 78 18",
            [78, 17],
          ],
          [
            "R",
            "M110 56 C112 46 120 44 120 36 C120 28 110 28 110 34 C110 40 120 40 124 30 C126 24 124 20 122 18",
            [122, 17],
          ],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 90 : 110, 56]} mood={mood}>
          {/* a coiled spring: boing */}
          <path d={d} stroke={pal.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={4.5} fill={C.deep} stroke={pal.ink} strokeWidth={1.8} />
        </Antenna>
      ))}
    </g>
  );
}

const sides = [
  ["L", -1],
  ["R", 1],
] as const;

/* ——— Pip: the original ——— */

function PipWings() {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, PIP.j)}>
          {/* stubby wings, too small to fly by the look of them */}
          <ellipse
            cx={100 + 52 * s}
            cy={124}
            rx={13}
            ry={19}
            transform={`rotate(${34 * s} ${100 + 52 * s} 124)`}
            fill={C.tint}
            fillOpacity={0.92}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
        </g>
      ))}
    </>
  );
}

/* ——— Pip · Wing cases: lifted cases over clear flying wings, each pair on its own joints ——— */

function CaseWings() {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side}>
          {/* the flying wing: clear, veined, spread out and down; it beats on its own joint */}
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, PIP.j)}>
            <g transform={`rotate(${-38 * s} ${100 + 62 * s} 160)`}>
              <ellipse
                cx={100 + 62 * s}
                cy={160}
                rx={15}
                ry={32}
                fill={C.tint}
                fillOpacity={0.88}
                stroke={pal.ink}
                strokeWidth={2}
              />
              <path
                d={`M${100 + 62 * s} 132 Q${100 + 66 * s} 160 ${100 + 62 * s} 188`}
                stroke={pal.ink}
                strokeOpacity={0.22}
                strokeWidth={1.4}
                fill="none"
              />
            </g>
          </g>
          {/* the wing case: lifted up and out as a firefly holds it in flight, with the cream
              edge stripe a real firefly has; it strokes slower, on the upper joint */}
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, PIP.j)}>
            <g transform={`rotate(${38 * s} ${100 + 64 * s} 112)`}>
              <ellipse
                cx={100 + 64 * s}
                cy={112}
                rx={17}
                ry={40}
                fill={C.deep}
                stroke={pal.ink}
                strokeWidth={2.4}
              />
              <path
                d={`M${100 + 72 * s} 80 Q${100 + 82 * s} 112 ${100 + 72 * s} 144`}
                stroke="#fff3de"
                strokeOpacity={0.85}
                strokeWidth={2.6}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M${100 + 56 * s} 86 Q${100 + 52 * s} 104 ${100 + 54 * s} 118`}
                stroke={WHITE}
                strokeOpacity={0.3}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>
      ))}
    </>
  );
}

const RINGS = (y: number) => (
  <path
    d={`M62 ${y} Q100 ${y + 12} 138 ${y} M58 ${y + 14} Q100 ${y + 26} 142 ${y + 14}`}
    stroke={C.deep}
    strokeOpacity={0.55}
    strokeWidth={2.6}
    fill="none"
    strokeLinecap="round"
  />
);

/* ——— Pip · Plump: a rounder egg, glowing antenna tips, two pairs of clear wings ——— */

const PLUMP: Body = {
  ...PIP,
  id: "pip-plump",
  j: {
    ...PIP.j,
    shoulderL: [52, 182],
    elbowL: [45, 200],
    wristL: [42, 216],
    shoulderR: [148, 182],
    elbowR: [155, 200],
    wristR: [158, 216],
    hipL: [84, 238],
    kneeL: [83, 254],
    footL: [82, 269],
    hipR: [116, 238],
    kneeR: [117, 254],
    footR: [118, 269],
    wingL: [74, 128],
    wingR: [126, 128],
    hindL: [72, 150],
    hindR: [128, 150],
  },
  torso:
    "M52 150 C52 142 70 138 100 138 C130 138 148 142 148 150 C148 172 150 186 150 204 C150 236 128 252 100 252 C72 252 50 236 50 204 C50 186 52 172 52 150 Z",
  headVB: "30 14 140 140",
};

const PLUMP_TOP =
  "M50 162 C50 128 56 104 66 90 C76 76 88 70 100 70 C112 70 124 76 134 90 C144 104 150 128 150 162";
const PLUMP_GLOW = "M51 220 Q100 238 149 220 C146 240 126 252 100 252 C74 252 54 240 51 220 Z";

function PlumpWings() {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side}>
          <g data-joint={`hind${side}`} style={pivot(`hind${side}`, PLUMP.j)}>
            <ellipse
              cx={100 + 58 * s}
              cy={170}
              rx={13}
              ry={18}
              transform={`rotate(${-28 * s} ${100 + 58 * s} 170)`}
              fill={C.tint}
              fillOpacity={0.9}
              stroke={pal.ink}
              strokeWidth={2}
            />
          </g>
          <g data-joint={`wing${side}`} style={pivot(`wing${side}`, PLUMP.j)}>
            <ellipse
              cx={100 + 62 * s}
              cy={116}
              rx={20}
              ry={27}
              transform={`rotate(${34 * s} ${100 + 62 * s} 116)`}
              fill={C.tint}
              fillOpacity={0.9}
              stroke={pal.ink}
              strokeWidth={2.2}
            />
            <path
              d={`M${100 + 50 * s} 130 Q${100 + 64 * s} 116 ${100 + 74 * s} 98`}
              stroke={pal.ink}
              strokeOpacity={0.22}
              strokeWidth={1.4}
              fill="none"
            />
          </g>
        </g>
      ))}
    </>
  );
}

function GlowAntennae({ uid, mood }: Ctx) {
  const g = `${uid}-plumptip`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      {(
        [
          ["L", "M90 74 C86 58 76 50 66 46", [64, 44]],
          ["R", "M110 74 C114 58 124 50 134 46", [136, 44]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 90 : 110, 74]} mood={mood}>
          <path d={d} stroke={pal.ink} strokeWidth={2.8} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={10} fill={pal.glow} opacity={0.3 * bright(mood)} />
          <circle cx={x} cy={y} r={5.5} fill={`url(#${g})`} stroke={pal.ink} strokeWidth={1.8} />
        </Antenna>
      ))}
    </g>
  );
}

/* ——— Pip · Cap: a firefly's head shield worn as a cap; wing cases closed down the back ——— */

function CapTop() {
  return (
    <g>
      <BeanTop />
      {/* the pronotum: on a real firefly, the shield over its head */}
      <path
        d="M59 84 C67 63 84 52 100 52 C116 52 133 63 141 84 C128 78 114 75 100 75 C86 75 72 78 59 84 Z"
        fill={C.deep}
        stroke={pal.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d="M62 84 C76 78 88 76 100 76 C112 76 124 78 138 84"
        stroke={C.accent}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M76 66 Q86 58 98 57"
        stroke={C.hi}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function BeadAntennae({ mood }: Ctx) {
  return (
    <g>
      {(
        [
          [
            "L",
            "M90 56 L82 30",
            [
              [88, 48],
              [85, 39],
            ],
            [81, 27],
          ],
          [
            "R",
            "M110 56 L118 30",
            [
              [112, 48],
              [115, 39],
            ],
            [119, 27],
          ],
        ] as const
      ).map(([side, d, beads, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 90 : 110, 56]} mood={mood}>
          <path d={d} stroke={pal.ink} strokeWidth={3} strokeLinecap="round" />
          {beads.map(([bx, by]) => (
            <circle
              key={by}
              cx={bx}
              cy={by}
              r={2.8}
              fill={C.deep}
              stroke={pal.ink}
              strokeWidth={1}
            />
          ))}
          <ellipse
            cx={x}
            cy={y}
            rx={4.5}
            ry={5.5}
            fill={C.deep}
            stroke={pal.ink}
            strokeWidth={1.6}
          />
        </Antenna>
      ))}
    </g>
  );
}

function ClosedCases() {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side}>
          {/* flying-wing tips, peeking out under the closed cases, fluttering */}
          <g
            data-joint={`hind${side}`}
            style={pivot(`hind${side}`, { ...PIP.j, hindL: [58, 236], hindR: [142, 236] })}
          >
            <ellipse
              cx={100 + 50 * s}
              cy={252}
              rx={8}
              ry={15}
              transform={`rotate(${34 * s} ${100 + 50 * s} 252)`}
              fill={C.tint}
              fillOpacity={0.9}
              stroke={pal.ink}
              strokeWidth={2}
            />
          </g>
          {/* the closed wing cases: a split cape down the back, cream-edged; they don't flap */}
          <path
            d={`M${100 + 30 * s} 94 C${100 + 60 * s} 104 ${100 + 68 * s} 160 ${100 + 64 * s} 212 C${100 + 62 * s} 234 ${100 + 52 * s} 244 ${100 + 40 * s} 246 C${100 + 46 * s} 204 ${100 + 44 * s} 140 ${100 + 30 * s} 94 Z`}
            fill={C.deep}
            stroke={pal.ink}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 38 * s} 106 C${100 + 58 * s} 126 ${100 + 62 * s} 180 ${100 + 58 * s} 222`}
            stroke="#fff3de"
            strokeOpacity={0.8}
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
    </>
  );
}

export const PIP_FAMILY: Candidate[] = [
  {
    id: "firefly-pip",
    kind: "animal",
    frame: PIP,
    label: "Pip",
    signature: "A bean whose bottom glows, with coiled-spring antennae",
    pitch:
      "The original: head and body are one bean, so it reads at any size and could be a logo on its own. The glow is its whole lower half and shines through any outfit. Spring antennae boing with every mood.",
    risk: "Reads as a bean more than a firefly; the tiny wings are a joke that has to land.",
    pal,
    body: C.primary,
    face: face(),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <PipWings />
        <Halo {...c} />
      </g>
    ),
    head: () => <BeanTop />,
    top: (c) => <SpringAntennae {...c} />,
    pendant: (c) => <BottomGlow {...c} />,
  },
  {
    id: "firefly-pip-cases",
    kind: "animal",
    frame: PIP,
    label: "Pip · Wing cases",
    signature: "Wing cases lifted over clear flying wings, and a glowing bottom",
    pitch:
      "Pip with a firefly's real wings: hard cases lifted up and out, cream-edged, over clear flying wings spread below. The two pairs move apart — the cases stroke slowly, the flying wings beat twice to each stroke — so it reads as flight. Rings above the glow make the lower bean an abdomen.",
    risk: "The lifted cases widen it; they will need a folded rest pose for sitting beside material.",
    pal,
    body: C.primary,
    face: face(),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <CaseWings />
        <Halo {...c} />
      </g>
    ),
    head: () => <BeanTop />,
    top: (c) => <SpringAntennae {...c} />,
    belly: () => RINGS(206),
    pendant: (c) => <BottomGlow {...c} />,
  },
  {
    id: "firefly-pip-plump",
    kind: "animal",
    frame: PLUMP,
    label: "Pip · Plump",
    signature: "A round egg with a big face, glowing antenna tips and two pairs of clear wings",
    pitch:
      "Shorter and rounder, with the biggest face of the family: the most toy-like Pip. The light shows in two places — the bottom of the egg and the tips of its antennae — so the head alone still glows at 16px. Two pairs of clear wings, upper and lower, beat apart.",
    risk: "The roundest silhouette is the least distinctive; glowing antenna tips spread the signature thinner.",
    pal,
    body: C.primary,
    face: face({ eyeY: 112, eyeGap: 17, eyeSize: 1.35, mouthY: 130 }),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <PlumpWings />
        <Halo {...c} cy={240} />
      </g>
    ),
    head: () => <BeanTop d={PLUMP_TOP} faceAt={[100, 116, 38, 30]} shine="M68 100 Q76 86 90 80" />,
    top: (c) => <GlowAntennae {...c} />,
    pendant: (c) => <BottomGlow {...c} d={PLUMP_GLOW} />,
  },
  {
    id: "firefly-pip-cap",
    kind: "animal",
    frame: PIP,
    label: "Pip · Cap",
    signature: "A firefly's head shield worn as a cap, and wing cases closed down its back",
    pitch:
      "The most insect-literate Pip: the shield that covers a real firefly's head becomes a cap with an accent rim, beaded antennae rise through it, and the wing cases fold closed down the back like a split cape — with the tips of the flying wings fluttering out below. At rest it looks like a firefly that has landed.",
    risk: "The cap competes with hats in the wardrobe; closed cases hide the wings, so it reads less as a flyer.",
    pal,
    body: C.primary,
    face: face(),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <ClosedCases />
        <Halo {...c} />
      </g>
    ),
    head: () => <CapTop />,
    top: (c) => <BeadAntennae {...c} />,
    belly: () => RINGS(206),
    pendant: (c) => <BottomGlow {...c} />,
  },
];
