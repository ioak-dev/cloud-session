import type { Candidate, Ctx } from "./candidates";
import { PIP, PipGlow } from "./firefly-bodies";
import { Antenna, bright, palette } from "./firefly-variants";
import type { Palette } from "./rig/palette";
import { WHITE } from "./rig/palette";
import { pivot, type Body } from "./rig/skeleton";

/**
 * Pip, refined: the bean body with firefly wings (hard wing cases over clear flying wings) in
 * three colourways. Then three Pip–Wisp hybrids: Pip's legged bean body with Wisp's droplet, its
 * smoke-thin antennae or its flame.
 */

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

type Colourway = {
  id: string;
  name: string;
  body: string;
  shade: string;
  /** The wing cases. */
  cases: string;
  clothes: string;
  note: string;
};

const face = (pal: Palette): Candidate["face"] => ({
  eyes: "bead",
  eyeY: 106,
  eyeGap: 16,
  eyeSize: 1.3,
  mouthY: 124,
  nose: "none",
  brows: false,
  lid: pal.skin,
});

/** The upper bean, filled down over the body so there is no seam, outlined only on top. */
const BEAN_TOP =
  "M54 160 C54 126 54 98 60 82 C68 62 84 52 100 52 C116 52 132 62 140 82 C146 98 146 126 146 160";

function BeanHead({ pal, body, top = BEAN_TOP }: { pal: Palette; body: string; top?: string }) {
  return (
    <g>
      <path d={`${top} Z`} fill={body} />
      <path
        d={top}
        fill="none"
        stroke={pal.ink}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 80 Q80 66 94 62"
        stroke={WHITE}
        strokeOpacity={0.5}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={110} rx={36} ry={29} fill={pal.skin} />
    </g>
  );
}

function SpringAntennae({ pal, mood, tip }: Ctx & { tip: string }) {
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
          <path d={d} stroke={pal.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={4.5} fill={tip} stroke={pal.ink} strokeWidth={1.8} />
        </Antenna>
      ))}
    </g>
  );
}

/** Wisp's antennae: thin as smoke, each tipped with a spark. */
function SmokeAntennae({ pal, mood, base }: Ctx & { base: readonly [number, number] }) {
  const [bx, by] = base;
  return (
    <g>
      {(["L", "R"] as const).map((side) => {
        const s = side === "L" ? -1 : 1;
        const x = bx + 18 * s;
        const y = by - 26;
        return (
          <Antenna key={side} side={side} base={[bx + 3 * s, by]} mood={mood}>
            <path
              d={`M${bx + 3 * s} ${by} C${bx + 10 * s} ${by - 10} ${bx + 20 * s} ${by - 8} ${bx + 24 * s} ${by - 18} C${bx + 26 * s} ${by - 24} ${bx + 22 * s} ${by - 28} ${x} ${y}`}
              stroke={pal.ink}
              strokeWidth={2.2}
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

function GlowHalo({
  pal,
  mood,
  cx = 100,
  cy = 244,
  r = 46,
}: Ctx & { cx?: number; cy?: number; r?: number }) {
  return (
    <circle data-joint="glow" cx={cx} cy={cy} r={r} fill={pal.glow} opacity={0.3 * bright(mood)} />
  );
}

/* ——— Pip refined: firefly wings ——— */

/** Hard wing cases lifted open over clear flying wings, as a firefly holds them in flight. */
function FireflyWings({ pal, cases, frame }: { pal: Palette; cases: string; frame: Body }) {
  return (
    <>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j, frame.j)}>
          {/* the flying wing, clear and veined, spread out and down below the case */}
          <g transform={`rotate(${-38 * s} ${100 + 62 * s} 160)`}>
            <ellipse
              cx={100 + 62 * s}
              cy={160}
              rx={15}
              ry={32}
              fill="#f4f8ff"
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
          {/* the wing case, lifted up and out as a firefly holds it in flight, with the cream
              edge stripe a real firefly has */}
          <g transform={`rotate(${38 * s} ${100 + 64 * s} 112)`}>
            <ellipse
              cx={100 + 64 * s}
              cy={112}
              rx={17}
              ry={40}
              fill={cases}
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
              strokeOpacity={0.35}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>
      ))}
    </>
  );
}

const COLOURWAYS: Colourway[] = [
  {
    id: "dusk",
    name: "Dusk",
    body: "#6a6fd0",
    shade: "#4b50b0",
    cases: "#3a3d8f",
    clothes: "#ff8f7a",
    note: "Indigo, the colour of the sky fireflies come out in. Calm and grown-up enough for a teacher; the yellow glow has the most contrast against it.",
  },
  {
    id: "sea",
    name: "Sea",
    body: "#3a9ab8",
    shade: "#27789a",
    cases: "#1f5670",
    clothes: "#f58a6c",
    note: "A clear sea blue: fresh and friendly, reads well on both grounds. The nearest to an info hue, so it must stay out of status use.",
  },
  {
    id: "mauve",
    name: "Mauve",
    body: "#c4829f",
    shade: "#a3607f",
    cases: "#6f3a58",
    clothes: "#3a4f8a",
    note: "Pip's pink, grown up: a dusty rose with plum wing cases. Keeps Pip's warmth without the candy.",
  },
];

function refined(cw: Colourway): Candidate {
  const pal = palette(cw.shade, cw.cases, "#fff4e8", "#efd8c6", {
    eye: "#2a1d32",
    glow: "#ffd84a",
    top: cw.clothes,
    bottom: cw.clothes,
    shoe: cw.clothes,
    accent: cw.clothes,
    blush: "#ff9aae",
  });
  return {
    id: `firefly-pip-${cw.id}`,
    kind: "animal",
    frame: PIP,
    label: `Pip refined · ${cw.name}`,
    signature: "A bean with firefly wing cases, clear wings, and a bottom that glows",
    pitch: `Pip with real firefly wings: hard wing cases lifted open, cream-striped at the edge, over clear flying wings — the silhouette now says firefly, not bean. Rings above the glow read as an insect's abdomen. ${cw.note}`,
    risk: "The wing cases widen the silhouette; they must fold flat when the guide sits beside material.",
    pal,
    body: cw.body,
    face: face(pal),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <FireflyWings pal={c.pal} cases={cw.cases} frame={PIP} />
        <GlowHalo {...c} />
      </g>
    ),
    head: (c) => <BeanHead pal={c.pal} body={cw.body} />,
    top: (c) => <SpringAntennae {...c} tip={cw.cases} />,
    belly: () => (
      <path
        d="M62 206 Q100 218 138 206 M58 220 Q100 232 142 220"
        stroke={cw.shade}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />
    ),
    pendant: (c) => <PipGlow {...c} />,
  };
}

/* ——— Pip–Wisp hybrids ——— */

const DROPLET =
  "M100 44 C110 62 146 72 146 106 C146 130 126 144 100 144 C74 144 54 130 54 106 C54 72 90 62 100 44 Z";

function DropletHead({ pal, body }: { pal: Palette; body: string }) {
  return (
    <g>
      <path d={DROPLET} fill={body} stroke={pal.ink} strokeWidth={2.5} strokeLinejoin="round" />
      <path
        d="M60 112 C60 94 78 86 100 86 C122 86 140 94 140 112 C140 132 122 142 100 142 C78 142 60 132 60 112 Z"
        fill={pal.skin}
      />
      <path d={DROPLET} fill="none" stroke={pal.ink} strokeWidth={2.5} strokeLinejoin="round" />
      <path
        d="M72 88 Q78 72 94 62"
        stroke={WHITE}
        strokeOpacity={0.6}
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Wisp's ribbon wings, shortened to suit a body that stands. */
function RibbonWings({ pal, tint, frame }: { pal: Palette; tint: string; frame: Body }) {
  return (
    <>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j, frame.j)}>
          <path
            d={`M${100 + 30 * s} 150 C${100 + 58 * s} 124 ${100 + 84 * s} 132 ${100 + 80 * s} 156 C${100 + 78 * s} 176 ${100 + 64 * s} 186 ${100 + 64 * s} 206 C${100 + 54 * s} 188 ${100 + 50 * s} 168 ${100 + 30 * s} 162 Z`}
            fill={tint}
            fillOpacity={0.88}
            stroke={pal.ink}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </g>
      ))}
    </>
  );
}

/** Wisp's flame, as a tail that sweeps out behind like a comet. */
function CometTail({ pal, uid }: Ctx) {
  const g = `${uid}-comet`;
  return (
    <g data-joint="tail" style={pivot("tail", PIP.j)}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor={WHITE} />
          <stop offset="40%" stopColor={pal.glow} />
          <stop offset="100%" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <circle data-joint="glow" cx={150} cy={226} r={40} fill={pal.glow} opacity={0.35} />
      <path
        d="M130 196 C156 200 178 214 184 244 C176 240 170 246 174 254 C156 250 140 242 132 232 C124 222 124 206 130 196 Z"
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d="M136 208 C150 212 162 220 168 232"
        stroke={WHITE}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/** The droplet sits on the bean at full size, overlapping its shoulders. */
const PIP_DROPLET: Body = {
  ...PIP,
  id: "pip-droplet",
  headFit: "translate(100 150) scale(0.95) translate(-100 -150)",
  headVB: "34 4 132 132",
};

/** One bean whose top rises to a flame's point. */
const FLAME_TOP =
  "M54 160 C54 124 58 102 68 88 C80 72 94 64 100 38 C106 64 120 72 132 88 C142 102 146 124 146 160";

const HYBRID_PAL = (shade: string, clothes: string) =>
  palette(shade, shade, "#fff6ee", "#eed9c8", {
    eye: "#2a2350",
    glow: "#ffd23f",
    top: clothes,
    bottom: clothes,
    shoe: clothes,
    accent: clothes,
    blush: "#ffa3b5",
  });

const palDroplet = HYBRID_PAL("#9a93dc", "#f58a6c");
const palFlame = HYBRID_PAL("#5a8fc8", "#f2a93b");
const palComet = HYBRID_PAL("#5c4088", "#f2b134");

export const FIREFLY_PIP: Candidate[] = [
  ...COLOURWAYS.map(refined),
  {
    id: "firefly-pipwisp-droplet",
    kind: "animal",
    frame: PIP_DROPLET,
    label: "Pip × Wisp · Droplet",
    signature: "Wisp's droplet head on Pip's legged bean, with a glowing bottom",
    pitch:
      "Wisp's most distinctive feature — the droplet head — on a body that stands, so the whole wardrobe works again. The glow stays in Pip's place, through any outfit. Lavender rather than Wisp's white, so it holds on the light ground and at 16px. Smoke-thin antennae rise from the point.",
    risk: "Two stacked rounded shapes read more like a snowman than Pip's single bean did.",
    pal: palDroplet,
    body: "#c3bff2",
    face: {
      eyes: "anime",
      eyeY: 110,
      eyeGap: 18,
      eyeSize: 1.1,
      mouthY: 128,
      nose: "none",
      brows: true,
      lid: palDroplet.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <RibbonWings pal={c.pal} tint="#f1efff" frame={PIP_DROPLET} />
        <GlowHalo {...c} />
      </g>
    ),
    head: (c) => <DropletHead pal={c.pal} body="#c3bff2" />,
    top: (c) => <SmokeAntennae {...c} base={[100, 50]} />,
    pendant: (c) => <PipGlow {...c} />,
  },
  {
    id: "firefly-pipwisp-flame",
    kind: "animal",
    frame: PIP,
    label: "Pip × Wisp · Flame-top",
    signature: "One bean that rises to a flame's point, lit at the bottom",
    pitch:
      "The truest merge: still one shape like Pip, but the top draws up into Wisp's point, so the whole character is a little upturned flame — light at the bottom, flame at the top. The point gives the silhouette a direction and a face-forward eagerness Pip lacked. Sky blue, with smoke antennae from the tip.",
    risk: "The point sits where every hat goes; hats must be authored to sit on or around it.",
    pal: palFlame,
    body: "#7fb2e6",
    face: face(palFlame),
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <FireflyWings pal={c.pal} cases="#3f6fa8" frame={PIP} />
        <GlowHalo {...c} />
      </g>
    ),
    head: (c) => <BeanHead pal={c.pal} body="#7fb2e6" top={FLAME_TOP} />,
    top: (c) => <SmokeAntennae {...c} base={[100, 44]} />,
    pendant: (c) => <PipGlow {...c} />,
  },
  {
    id: "firefly-pipwisp-comet",
    kind: "animal",
    frame: PIP_DROPLET,
    label: "Pip × Wisp · Comet",
    signature: "A droplet head on a bean body, with Wisp's flame streaming behind as a tail",
    pitch:
      "Takes the most from Wisp while keeping Pip's legs: the droplet head, the ribbon wings, and Wisp's flame — now a comet tail that streams out behind, so it looks in motion even standing still. The glow moves from Pip's bottom to the tail, which stays visible whatever it wears. Plum.",
    risk: "The busiest of the three; the tail widens it to one side and competes with material for space.",
    pal: palComet,
    body: "#7a5aa8",
    face: {
      eyes: "anime",
      eyeY: 110,
      eyeGap: 18,
      eyeSize: 1.1,
      mouthY: 128,
      nose: "none",
      brows: true,
      lid: palComet.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => (
      <g>
        <RibbonWings pal={c.pal} tint="#efe6ff" frame={PIP_DROPLET} />
        <CometTail {...c} />
      </g>
    ),
    head: (c) => <DropletHead pal={c.pal} body="#7a5aa8" />,
    top: (c) => <SmokeAntennae {...c} base={[100, 50]} />,
    belly: () => (
      <path
        d="M62 214 Q100 226 138 214 M60 230 Q100 242 140 230"
        stroke="#5c4088"
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />
    ),
  },
];
