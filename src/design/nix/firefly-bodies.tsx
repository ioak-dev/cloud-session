import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, GlowGrad, palette } from "./firefly-variants";
import { WHITE } from "./rig/palette";
import { J, pivot, type Body } from "./rig/skeleton";

/**
 * Five firefly directions, each on a body of its own. Where the kept variants share the chibi
 * frame and differ in the head, these differ from the ground up: body plan, silhouette, where the
 * light lives, how the antennae behave. Each is still a rig (joints, poses, outfits, props), so
 * it can be dressed and moved once chosen.
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

/* ——— Pip: a bean. Head and body are one shape; the bottom of the bean glows ——— */

const PIP_BODY = "#f4a9c0";
const palPip = palette("#e27fa0", "#c95f84", "#fff1e6", "#f0d2c2", {
  eye: "#3b2440",
  glow: "#ffd84a",
  top: "#6c4bc7",
  bottom: "#6c4bc7",
  shoe: "#6c4bc7",
  accent: "#6c4bc7",
  blush: "#ff8fae",
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
    wingL: [74, 132],
    wingR: [126, 132],
  },
  torso:
    "M56 150 C56 140 70 136 100 136 C130 136 144 140 144 150 C144 170 142 182 146 202 C148 236 128 256 100 256 C72 256 52 236 54 202 C58 182 56 170 56 150 Z",
  headVB: "34 8 132 132",
  w: { upper: 10, fore: 9.5, thigh: 14, shin: 13, hand: 7.4, cloth: 1 },
  neck: NO_NECK,
};

function PipHead({ pal }: Ctx) {
  const top =
    "M54 160 C54 126 54 98 60 82 C68 62 84 52 100 52 C116 52 132 62 140 82 C146 98 146 126 146 160";
  return (
    <g>
      {/* the upper bean: filled down over the body so there is no seam, outlined only on top */}
      <path d={`${top} Z`} fill={PIP_BODY} />
      <path d={top} fill="none" stroke={pal.ink} strokeWidth={2.6} strokeLinecap="round" />
      <path
        d="M70 76 Q80 62 94 60"
        stroke={WHITE}
        strokeOpacity={0.6}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={110} rx={36} ry={29} fill={pal.skin} />
    </g>
  );
}

function PipAntennae({ pal, mood }: Ctx) {
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
          <circle cx={x} cy={y} r={4.5} fill={PIP_BODY} stroke={pal.ink} strokeWidth={1.8} />
        </Antenna>
      ))}
    </g>
  );
}

function PipBehind({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j, PIP.j)}>
          {/* stubby wings, too small to fly by the look of them */}
          <ellipse
            cx={100 + 52 * s}
            cy={124}
            rx={13}
            ry={19}
            transform={`rotate(${34 * s} ${100 + 52 * s} 124)`}
            fill="#fff6fb"
            fillOpacity={0.92}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
        </g>
      ))}
      <circle
        data-joint="glow"
        cx={100}
        cy={244}
        r={46}
        fill={pal.glow}
        opacity={0.3 * bright(mood)}
      />
    </g>
  );
}

export function PipGlow({ pal, uid }: Ctx) {
  const g = `${uid}-pipglow`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      {/* the light is the bean's own bottom, and it shines through any outfit */}
      <path
        d="M57 228 Q100 242 143 228 C140 246 124 256 100 256 C76 256 60 246 57 228 Z"
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
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

/* ——— Wisp: floats. A droplet head, ribbon wings, and a body that ends in a flame of light ——— */

const WISP_BODY = "#eef0ff";
const palWisp = palette("#d6daf6", "#aab1e6", "#f7f7ff", "#d6daf6", {
  eye: "#3a3f8f",
  glow: "#ffcf4a",
  top: "#5b6ee0",
  bottom: "#5b6ee0",
  shoe: "#5b6ee0",
  accent: "#5b6ee0",
  blush: "#ffb3c4",
});

const WISP: Body = {
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
    wingL: [90, 158],
    wingR: [110, 158],
  },
  headFit: "translate(100 146) scale(1.12) translate(-100 -150)",
  torso:
    "M84 150 Q100 146 116 150 Q124 156 122 172 Q118 194 104 208 Q100 212 96 208 Q82 194 78 172 Q76 156 84 150 Z",
  headVB: "34 -6 132 132",
  w: { upper: 9, fore: 8.5, thigh: 0, shin: 0, hand: 6.2, cloth: 0.9 },
  neck: { x: 94, y: 134, w: 12, h: 20 },
};

function WispHead({ pal, uid }: Ctx) {
  const g = `${uid}-wisphead`;
  const d =
    "M100 44 C110 62 146 72 146 106 C146 130 126 144 100 144 C74 144 54 130 54 106 C54 72 90 62 100 44 Z";
  return (
    <g>
      <defs>
        <radialGradient id={g} cx="50%" cy="62%" r="60%">
          <stop offset="0%" stopColor={WHITE} />
          <stop offset="100%" stopColor={WISP_BODY} />
        </radialGradient>
      </defs>
      {/* a droplet: the head comes to a point, like a flame held upside down */}
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

function WispAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M97 50 C90 40 80 42 76 32 C74 26 78 22 82 24", [82, 24]],
          ["R", "M103 50 C110 40 120 42 124 32 C126 26 122 22 118 24", [118, 24]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 97 : 103, 50]} mood={mood}>
          {/* thin as smoke */}
          <path d={d} stroke={pal.ink} strokeWidth={2} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={6} fill={pal.glow} opacity={0.35 * bright(mood)} />
          <circle cx={x} cy={y} r={2.8} fill={pal.glow} stroke={pal.ink} strokeWidth={1.2} />
        </Antenna>
      ))}
    </g>
  );
}

function WispBehind({ pal, uid, mood }: Ctx) {
  const g = `${uid}-wisptail`;
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={WHITE} />
          <stop offset="35%" stopColor={pal.glow} />
          <stop offset="100%" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j, WISP.j)}>
          {/* ribbon wings that trail like a scarf */}
          <path
            d={`M${100 + 10 * s} 156 C${100 + 40 * s} 136 ${100 + 66 * s} 146 ${100 + 62 * s} 172 C${100 + 60 * s} 192 ${100 + 44 * s} 204 ${100 + 44 * s} 228 C${100 + 34 * s} 206 ${100 + 32 * s} 180 ${100 + 10 * s} 166 Z`}
            fill="#ece8ff"
            fillOpacity={0.85}
            stroke={pal.ink}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 16 * s} 160 C${100 + 40 * s} 150 ${100 + 56 * s} 160 ${100 + 50 * s} 186`}
            stroke="#b9b0ee"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      <g data-joint="tail" style={pivot("tail", WISP.j)}>
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
    </g>
  );
}

/* ——— Chonk: low and wide under a domed shell, with a lamp on each side ——— */

const CHONK_SHELL = "#5a3b2e";
const CHONK_BELLY = "#f3d7a8";
const palChonk = palette(CHONK_SHELL, "#3e271e", "#fbe6cc", "#e5c9a6", {
  eye: "#2a1d22",
  glow: "#ffc83d",
  top: "#3f7fd0",
  bottom: "#3f7fd0",
  shoe: "#3f7fd0",
  accent: "#e0674a",
  blush: "#f2a08a",
});

const CHONK: Body = {
  id: "chonk",
  j: {
    ...J,
    head: [100, 168],
    shoulderL: [68, 186],
    elbowL: [60, 204],
    wristL: [58, 220],
    shoulderR: [132, 186],
    elbowR: [140, 204],
    wristR: [142, 220],
    torso: [100, 234],
    hipL: [82, 240],
    kneeL: [80, 257],
    footL: [78, 273],
    hipR: [118, 240],
    kneeR: [120, 257],
    footR: [122, 273],
    tail: [100, 210],
  },
  headFit: "translate(100 168) scale(0.8) translate(-100 -150)",
  torsoFit: "translate(0 18)",
  hemFit: "translate(0 22)",
  handsFit: "translate(0 30)",
  torso:
    "M100 146 C128 146 144 164 144 190 C144 214 128 230 100 230 C72 230 56 214 56 190 C56 164 72 146 100 146 Z",
  headVB: "46 50 108 108",
  w: { upper: 11, fore: 10, thigh: 14, shin: 13, hand: 7.2, cloth: 1.1 },
  neck: NO_NECK,
};

function ChonkHead({ pal }: Ctx) {
  return (
    <g>
      <ellipse cx={100} cy={102} rx={50} ry={39} fill={CHONK_SHELL} />
      <path
        d="M56 112 C56 94 74 86 100 86 C126 86 144 94 144 112 C144 130 124 140 100 140 C76 140 56 130 56 112 Z"
        fill={pal.skin}
      />
      <ellipse cx={100} cy={102} rx={50} ry={39} fill="none" stroke={pal.ink} strokeWidth={2.6} />
      <path
        d="M68 78 Q82 68 98 68"
        stroke="#8a5f4b"
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function ChonkAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M84 68 C80 58 74 52 68 48", [66, 44]],
          ["R", "M116 68 C120 58 126 52 132 48", [134, 44]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 84 : 116, 68]} mood={mood}>
          {/* short and clubbed, like a pair of drumsticks */}
          <path d={d} stroke={pal.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
          <ellipse
            cx={x}
            cy={y}
            rx={6.5}
            ry={8}
            transform={`rotate(${side === "L" ? -30 : 30} ${x} ${y})`}
            fill={CHONK_SHELL}
            stroke={pal.ink}
            strokeWidth={2}
          />
        </Antenna>
      ))}
    </g>
  );
}

function ChonkBehind({ pal, uid, mood }: Ctx) {
  const g = `${uid}-chonklamp`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f08c1e" />
      {/* the shell: a dome the whole body sits in */}
      <path
        d="M100 136 C140 136 160 164 160 198 C160 224 140 240 100 240 C60 240 40 224 40 198 C40 164 60 136 100 136 Z"
        fill={CHONK_SHELL}
        stroke={pal.ink}
        strokeWidth={2.6}
      />
      <path
        d="M50 176 Q58 150 84 142"
        stroke="#8a5f4b"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      {[
        [58, 170],
        [146, 176],
        [54, 224],
      ].map(([x, y]) => (
        <circle key={x + y} cx={x} cy={y} r={3.2} fill={CHONK_BELLY} opacity={0.8} />
      ))}
      {/* its light: two lamps set into the shell, one either side */}
      {[46, 154].map((x) => (
        <g key={x}>
          <circle
            data-joint="glow"
            cx={x}
            cy={206}
            r={20}
            fill={pal.glow}
            opacity={0.4 * bright(mood)}
          />
          <circle cx={x} cy={206} r={10} fill={`url(#${g})`} stroke={pal.ink} strokeWidth={2.2} />
        </g>
      ))}
    </g>
  );
}

export const FIREFLY_BODIES: Candidate[] = [
  {
    id: "firefly-pip",
    kind: "animal",
    frame: PIP,
    label: "Firefly · Pip",
    signature: "A pink bean whose bottom glows, with coiled-spring antennae",
    pitch:
      "The simplest shape in the cast: head and body are one bean, so it reads at any size and could be a logo on its own. The glow is its whole lower half and shines through any outfit. Spring antennae boing with every mood. Toddler-friendly.",
    risk: "So simple it may feel generic; the tiny wings are a joke that has to land. Pink leans young for older learners.",
    pal: palPip,
    body: PIP_BODY,
    face: {
      eyes: "bead",
      eyeY: 106,
      eyeGap: 16,
      eyeSize: 1.3,
      mouthY: 124,
      nose: "none",
      brows: false,
      lid: palPip.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <PipBehind {...c} />,
    head: (c) => <PipHead {...c} />,
    top: (c) => <PipAntennae {...c} />,
    pendant: (c) => <PipGlow {...c} />,
  },
  {
    id: "firefly-wisp",
    kind: "animal",
    frame: WISP,
    legs: false,
    label: "Firefly · Wisp",
    signature: "A droplet head and a body that ends in a flame of light — it floats",
    pitch:
      "The most magical and the only one that never touches the ground: no legs, just a flame of light where a body would end. Ribbon wings trail like a scarf. Pale as moonlight, it looks like a friendly spirit, which fits a guide that appears and disappears across the product.",
    risk: "Could read as a ghost or a candle flame rather than a firefly; trousers and shoes have nowhere to go.",
    pal: palWisp,
    body: WISP_BODY,
    face: {
      eyes: "anime",
      eyeY: 108,
      eyeGap: 19,
      eyeSize: 1.15,
      mouthY: 126,
      nose: "none",
      brows: true,
      lid: palWisp.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <WispBehind {...c} />,
    head: (c) => <WispHead {...c} />,
    top: (c) => <WispAntennae {...c} />,
  },
  {
    id: "firefly-chonk",
    kind: "animal",
    frame: CHONK,
    label: "Firefly · Chonk",
    signature: "A wide domed shell with a lamp set in each side",
    pitch:
      "Low, wide and sturdy: the body sits in a domed shell like a beetle, the head peeks out the front, and the light is two lamps in the shell — headlamps for finding the way. Solid and dependable, the steady companion rather than the excitable one.",
    risk: "Brown shell sits near the otter and reads as a beetle or a ladybird before a firefly; the wide body makes clothes look like a tent.",
    pal: palChonk,
    body: CHONK_BELLY,
    face: {
      eyes: "bead",
      eyeY: 110,
      eyeGap: 22,
      mouthY: 126,
      nose: "dot",
      brows: true,
      lid: palChonk.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <ChonkBehind {...c} />,
    head: (c) => <ChonkHead {...c} />,
    top: (c) => <ChonkAntennae {...c} />,
    belly: () => (
      <path
        d="M66 184 Q100 192 134 184 M68 204 Q100 212 132 204"
        stroke="#d7b27a"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    ),
  },
];
