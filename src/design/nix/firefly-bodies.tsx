import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, GlowGrad, palette } from "./firefly-variants";
import { C } from "./theme";
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

/* ——— Chonk: low and wide under a domed shell, with a lamp on each side ——— */

const CHONK_SHELL = C.primary;
const CHONK_BELLY = "#f3d7a8";
const palChonk = palette(C.deep, C.deep, "#fbe6cc", "#e5c9a6", {
  eye: "#2a1d22",
  glow: "#ffc83d",
  top: C.accent,
  bottom: C.accent,
  shoe: C.accent,
  accent: C.accent,
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
        stroke={C.hi}
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
        stroke={C.hi}
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
