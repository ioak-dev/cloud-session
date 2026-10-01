import type { ReactNode } from "react";

import type { Candidate } from "./candidates";
import { palette } from "./firefly-variants";
import {
  ANIMAL_OUTFITS,
  arcBrow,
  blob,
  cute,
  dashBrow,
  dMouth,
  eyesOf,
  face,
  g2,
  INK,
  mirror,
  mix,
  MOUTH_IN,
  pal,
  PERSON_OUTFITS,
  sides,
  talk,
  Taper,
  Two,
  UNFIT,
  wave,
} from "./observatory";
import { EYE_WHITE, line, OpenMouth, TONGUE_PINK, type MouthKit } from "./rig/eyes";
import type { Palette } from "./rig/palette";
import { pivot } from "./rig/skeleton";
import { C } from "./theme";

/**
 * More candidates to shortlist against the Lantern Pond six: four animals (Mischa, a raccoon;
 * Thistle, a hedgehog; Cappy, a capybara; Pebble, a seal pup) and three people (Bodhi, a boy of
 * about nine; Ada, a grandmother; Kai, a boy of about fourteen). Drawn on the cute frame to
 * `docs/character-guidelines.md`, each with its own eyes and mouth (which also talks). Static
 * figures and faces only, until some are picked.
 */

/** A mouth for every mood, in a character's own colours and quirks — teeth, a gap, a fang, buck
 *  teeth — and the talking shapes. */
function mouthOf(o: { lip: string; W: number; H: number; teeth?: boolean; gap?: boolean; fang?: boolean; buck?: boolean; rest?: (y: number) => ReactNode }): MouthKit {
  return ({ mood, y, viseme }) => {
    if (viseme) return talk(viseme, mood, y, { W: o.W, H: o.H, inside: MOUTH_IN, lip: o.lip, lipW: 2.6, teeth: o.teeth || o.buck ? EYE_WHITE : undefined, gap: o.gap });
    const extra = (dy = 0) =>
      g2(
        o.fang && <path d={`M${104} ${y + dy - 0.6} l1.2 3.4 l1.6 -3.4 Z`} fill={EYE_WHITE} />,
        o.buck && (
          <g fill={EYE_WHITE}>
            <rect x={97} y={y + dy - 0.6} width={2.8} height={3.8} rx={0.8} />
            <rect x={100.2} y={y + dy - 0.6} width={2.8} height={3.8} rx={0.8} />
          </g>
        ),
      );
    const w = o.W;
    switch (mood) {
      case "happy":
        return g2(<OpenMouth d={dMouth(y, w * 0.95, w * 0.62)} fill={MOUTH_IN} teeth={o.teeth ? [100 - w * 0.7, y - 1.2, w * 1.4, 3.2] : undefined} tongue={[100, y + w * 0.85, w * 0.45, w * 0.28]} />, extra());
      case "delighted":
        return g2(<OpenMouth d={dMouth(y - 1, w * 1.2, w)} fill={MOUTH_IN} teeth={o.teeth ? [100 - w * 0.9, y - 2, w * 1.8, 3.6] : undefined} tongue={[100, y + w * 1.3, w * 0.55, w * 0.34]} />, extra(-1));
      case "curious":
        return <ellipse cx={101} cy={y + 2.2} rx={w * 0.3} ry={w * 0.38} fill={MOUTH_IN} />;
      case "thinking":
        return <path d={`M${100 - w * 0.6} ${y + 1.6} Q101 ${y + 2.6} ${100 + w * 0.8} ${y - 1.6}`} {...line(o.lip, 2.6)} />;
      case "focused":
        return <path d={`M${100 - w * 0.6} ${y + 1} L${100 + w * 0.6} ${y + 1}`} {...line(o.lip, 2.6)} />;
      case "worried":
        return <path d={wave(y + 2, w * 0.7, 2.4)} {...line(o.lip, 2.6)} />;
      case "oops":
        return <OpenMouth d={`M${100 - w * 0.75} ${y + 4} Q100 ${y - 3} ${100 + w * 0.75} ${y + 4} Q100 ${y + 2} ${100 - w * 0.75} ${y + 4} Z`} fill={MOUTH_IN} />;
      case "wink":
        return g2(<path d={`M${100 - w * 0.8} ${y} Q100 ${y + 5} ${100 + w * 0.9} ${y - 2}`} {...line(o.lip, 2.6)} />, <ellipse cx={104} cy={y + 3.6} rx={2.4} ry={2} fill={TONGUE_PINK} />);
      default:
        return o.rest ? o.rest(y) : g2(<path d={`M${100 - w * 0.7} ${y} Q100 ${y + 4.6} ${100 + w * 0.7} ${y}`} {...line(o.lip, 2.6)} />, extra(1.2));
    }
  };
}

const person = (skin: string, shade: string, hair: string, hairHi: string, over: Partial<Palette> = {}): Palette =>
  palette(skin, skin, skin, shade, {
    line: "none",
    ink: INK,
    hair,
    hairHi,
    eye: INK,
    top: C.clothes,
    topAlt: "#fff3de",
    bottom: C.deep,
    shoe: C.deep,
    accent: C.accent,
    blush: "#ee8f8f",
    ...over,
  });

/* ——— Mischa, a raccoon: the night visitor who "borrows" things ——— */

const RAC = mix(C.mid, "#8d8a90", 50);
const RAC_SHADE = mix(C.deep, "#5e5a63", 45);
const RAC_MASK = mix(C.deep, "#2c2a33", 40);
const RAC_LIGHT = "#f1ede6";

const MISCHA = cute("mischa", { k: 1.44, neck: 204, torso: "M80 152 Q100 144 120 152 Q132 164 130 190 Q127 222 100 222 Q73 222 70 190 Q68 164 80 152 Z", j: { earL: [70, 76], earR: [130, 76], tail: [112, 250] } });

function MischaHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, MISCHA.j)}>
          <path d={`M${mirror(s, 60)} 94 Q${mirror(s, 56)} 62 ${mirror(s, 70)} 56 Q${mirror(s, 84)} 62 ${mirror(s, 90)} 80 Z`} fill={RAC_SHADE} />
          <path d={`M${mirror(s, 65)} 86 Q${mirror(s, 64)} 68 ${mirror(s, 71)} 64 Q${mirror(s, 79)} 68 ${mirror(s, 83)} 80 Z`} fill={RAC_LIGHT} />
        </g>
      ))}
      <path d="M58 124 L46 130 L58 134 L50 142 L66 138 Z M142 124 L154 130 L142 134 L150 142 L134 138 Z" fill={RAC_LIGHT} />
      <Two d={blob(100, 112, 44, 38, 1.08)} fill={RAC} shade={RAC_SHADE} k={2.2} />
      {/* the white brows and cheeks, then the bandit's mask across both eyes */}
      <path d="M62 112 C66 96 86 96 100 104 C114 96 134 96 138 112 C134 126 116 128 100 120 C84 128 66 126 62 112 Z" fill={RAC_MASK} />
      <path d="M70 98 Q82 90 94 98 M106 98 Q118 90 130 98" {...line(RAC_LIGHT, 4)} />
      <path d={blob(100, 134, 18, 12, 1.04)} fill={RAC_LIGHT} />
      <ellipse cx={100} cy={127} rx={5.4} ry={3.8} fill={INK} />
    </g>
  );
}

function MischaBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", MISCHA.j)}>
        {/* a big bushy tail in rings, curving up behind */}
        <Taper segs={[[[114, 254], [150, 262], [170, 232], [160, 196]]]} w0={16} w1={22} fill={RAC} />
        {[0.3, 0.55, 0.8].map((t) => {
          const x = 114 + (160 - 114) * t + 12 * Math.sin(t * 3);
          const y = 254 - (254 - 196) * t;
          return <ellipse key={t} cx={x} cy={y} rx={11} ry={4} transform={`rotate(${-60 + t * 50} ${x} ${y})`} fill={RAC_MASK} />;
        })}
        <circle cx={160} cy={194} r={10} fill={RAC_MASK} />
      </g>
    </g>
  );
}

const mischaEyes = eyesOf({
  rx: 8.6,
  ry: 9.6,
  fill: EYE_WHITE,
  iris: { r: 6.4, color: mix(C.accentDeep, "#5a3e2a", 50) },
  pupil: { r: 3.2 },
  shine: 2.4,
  lid: RAC_MASK,
  closed: RAC_LIGHT,
  browY: 16,
  brow: dashBrow(RAC_LIGHT, 3.2, 4.6),
  /* sly: looking sideways, one brow up */
  rest: { look: [2.4, 0], top: 0.18, raise: 2, browTilt: -8, k: [0.96, 1.04] },
});

/* ——— Thistle, a hedgehog: the head gardener, fussy and tender ——— */

const SPINE = mix(C.accentDeep, "#7a5a44", 45);
const SPINE_SHADE = mix(C.deep, "#4e3a2e", 35);
const HOG_FACE = "#f6dcc4";
const HOG_SHADE = "#e3bea0";

const THISTLE = cute("thistle", { k: 1.44, neck: 206, torso: "M78 152 Q100 144 122 152 Q134 166 132 192 Q128 222 100 222 Q72 222 68 192 Q66 166 78 152 Z", headVB: "10 30 180 180" });

function ThistleBack() {
  /* a crown of soft spines all round the back of her head */
  const spikes = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI * (1.02 + (i / 12) * 0.96);
    const x = 100 + 48 * Math.cos(a);
    const y = 110 + 46 * Math.sin(a);
    const tx = 100 + 70 * Math.cos(a);
    const ty = 110 + 66 * Math.sin(a);
    const nx = -Math.sin(a) * 9;
    const ny = Math.cos(a) * 9;
    return `M${x - nx} ${y - ny} Q${tx} ${ty} ${tx} ${ty} L${x + nx} ${y + ny} Z`;
  });
  return (
    <g>
      <g fill={SPINE_SHADE} transform="translate(2 2)">
        {spikes.map((d) => (
          <path key={d} d={d} strokeLinejoin="round" stroke={SPINE_SHADE} strokeWidth={4} />
        ))}
      </g>
      <g fill={SPINE}>
        {spikes.map((d) => (
          <path key={d} d={d} strokeLinejoin="round" stroke={SPINE} strokeWidth={4} />
        ))}
      </g>
      <path d={blob(100, 108, 50, 46, 1.02)} fill={SPINE} />
    </g>
  );
}

function ThistleHead() {
  return (
    <g>
      <circle cx={64} cy={90} r={8} fill={HOG_SHADE} />
      <circle cx={136} cy={90} r={8} fill={HOG_SHADE} />
      <Two d={blob(100, 116, 38, 34, 1.08)} fill={HOG_FACE} shade={HOG_SHADE} k={2} />
      {/* a peak of spines on her forehead, and a big button nose */}
      <path d="M74 92 Q86 76 100 84 Q114 76 126 92 Q112 86 100 92 Q88 86 74 92 Z" fill={SPINE} />
      <ellipse cx={100} cy={130} rx={6.4} ry={5} fill={INK} />
      <circle cx={98.2} cy={128.4} r={1.4} fill={EYE_WHITE} />
    </g>
  );
}

const thistleEyes = eyesOf({
  rx: 7,
  ry: 8.2,
  fill: INK,
  pupil: { r: 0 },
  shine: 2.4,
  lid: HOG_FACE,
  closed: INK,
  browY: 13,
  brow: arcBrow(SPINE, 3, 5),
  /* fussing: brows knitted up at the middle */
  rest: { raise: 2, browTilt: 14 },
});

/* ——— Cappy, a capybara: unbothered by anything ——— */

const CAPY = mix(C.accentDeep, "#9a6e4c", 40);
const CAPY_SHADE = mix(C.deep, "#6a4a34", 35);
const CAPY_NOSE = mix(C.deep, "#4a3426", 40);

const CAPPY = cute("cappy", {
  k: 1.4,
  neck: 206,
  torso: "M74 154 Q100 144 126 154 Q140 168 138 196 Q134 224 100 224 Q66 224 62 196 Q60 168 74 154 Z",
  w: { upper: 14, fore: 13, thigh: 18, shin: 17, hand: 8.6, cloth: 1.2 },
  j: { earL: [72, 74], earR: [128, 74] },
});

/** A rounded box of a head: the capybara's square snout is its silhouette. */
const CAPY_HEAD = "M60 92 C60 70 76 64 100 64 C124 64 140 70 140 92 L142 132 C142 152 124 158 100 158 C76 158 58 152 58 132 Z";

function CappyHead() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`ear${side}`} style={pivot(`ear${side}`, CAPPY.j)}>
          <ellipse cx={mirror(s, 70)} cy={70} rx={8} ry={7} fill={CAPY_SHADE} />
        </g>
      ))}
      <Two d={CAPY_HEAD} fill={CAPY} shade={CAPY_SHADE} k={2.4} />
      {/* a broad, dark nose with nostrils at the very top of the snout */}
      {/* a lighter snout end, and two nostrils set high on it */}
      <path d={blob(100, 136, 30, 18, 1.04)} fill={mix(CAPY, "#e9cdb0", 55)} />
      <path d="M90 126 q-3 3 0 6 M110 126 q3 3 0 6" {...line(CAPY_NOSE, 3)} />
    </g>
  );
}

const cappyEyes = eyesOf({
  rx: 6.4,
  ry: 7,
  fill: INK,
  pupil: { r: 0 },
  shine: 2,
  lid: CAPY,
  closed: INK,
  browY: 12,
  brow: dashBrow(CAPY_SHADE, 3, 4.4),
  /* perfectly at peace: lids nearly shut */
  rest: { top: 0.52, raise: 0 },
});

/* ——— Pebble, a seal pup: round, soft, delighted by everything ——— */

const SEAL = mix(C.soft, "#e9ecef", 40);
const SEAL_SHADE = mix(C.hi, "#b9c0c8", 40);
const SEAL_SPOT = mix(C.mid, "#a8b0ba", 40);

const PEBBLE = cute("pebble", {
  k: 1.46,
  neck: 222,
  torso: "M76 156 Q100 146 124 156 Q140 170 138 196 Q134 224 100 224 Q66 224 62 196 Q60 170 76 156 Z",
  w: { upper: 16, fore: 15, thigh: 16, shin: 15, hand: 10, cloth: 1.2 },
  j: { shoulderL: [80, 226], elbowL: [72, 240], wristL: [68, 252], shoulderR: [120, 226], elbowR: [128, 240], wristR: [132, 252], tail: [100, 262] },
  headVB: "16 46 168 168",
});

function PebbleHead() {
  return (
    <g>
      <Two d={blob(100, 112, 44, 40, 1.1)} fill={SEAL} shade={SEAL_SHADE} k={2.4} />
      {[
        [74, 84, 3],
        [124, 80, 2.4],
        [132, 94, 1.8],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={SEAL_SPOT} />
      ))}
      {/* two puffy whisker pads and a little dark nose */}
      <ellipse cx={92} cy={134} rx={9} ry={7} fill={EYE_WHITE} />
      <ellipse cx={108} cy={134} rx={9} ry={7} fill={EYE_WHITE} />
      {[88, 92, 96, 104, 108, 112].map((x) => (
        <circle key={x} cx={x} cy={x < 100 ? 136 : 136} r={0.9} fill={SEAL_SHADE} />
      ))}
      <path d="M95 126 Q100 123 105 126 Q103 131 100 131 Q97 131 95 126 Z" fill={INK} />
      <g {...line(SEAL_SHADE, 1.4)}>
        <path d="M82 134 L64 130 M82 138 L66 142 M118 134 L136 130 M118 138 L134 142" />
      </g>
    </g>
  );
}

function PebbleBehind() {
  return (
    <g transform={UNFIT}>
      <g data-joint="tail" style={pivot("tail", PEBBLE.j)}>
        {/* hind flippers fanned behind, in place of legs */}
        <path d="M100 262 Q78 272 70 286 Q88 286 100 274 Q112 286 130 286 Q122 272 100 262 Z" fill={SEAL_SHADE} />
      </g>
    </g>
  );
}

const pebbleEyes = eyesOf({
  rx: 11,
  ry: 12.4,
  fill: INK,
  iris: { r: 8.4, color: mix(C.deep, INK, 50) },
  pupil: { r: 0 },
  shine: 4,
  lid: SEAL,
  closed: INK,
  browY: 18,
  brow: dashBrow(SEAL_SPOT, 3, 4),
  /* wide open to the world */
  rest: { raise: 3, look: [0, -0.6] },
});

/* ——— Bodhi, a boy of about nine: muddy knees, first into everything ——— */

const BODHI_SKIN = "#7d4b2f";
const BODHI_SHADE = "#623820";
const BODHI_HAIR = "#2a1d1d";
const BODHI_HI = "#5a4040";

const BODHI = cute("bodhi", { k: 1.48, neck: 202, torso: "M84 150 Q100 146 116 150 Q124 156 123 172 L121 210 Q120 222 100 222 Q80 222 79 210 L77 172 Q76 156 84 150 Z", headVB: "12 22 176 176" });

const BODHI_CURLS = [
  [62, 96, 11],
  [66, 80, 12],
  [78, 68, 12],
  [92, 62, 12],
  [106, 60, 12],
  [120, 64, 12],
  [132, 74, 12],
  [138, 90, 11],
  [100, 52, 9],
  [116, 50, 8],
] as const;

function BodhiHead() {
  return (
    <g>
      <circle cx={57} cy={118} r={7} fill={BODHI_SKIN} />
      <circle cx={143} cy={118} r={7} fill={BODHI_SKIN} />
      <Two d={blob(100, 114, 42, 39, 1.06)} fill={BODHI_SKIN} shade={BODHI_SHADE} k={2.2} />
      {/* a mop of tight curls, one springing up on top */}
      <g fill={BODHI_HAIR}>
        {BODHI_CURLS.map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
        <path d="M60 100 Q100 76 140 98 L140 84 Q100 60 60 84 Z" />
      </g>
      <path d="M84 62 q4 -4 8 0 M104 56 q4 -4 8 0 M70 78 q4 -4 8 0 M124 70 q4 -4 8 0" {...line(BODHI_HI, 2.2)} />
      {/* a smudge of mud on his cheek */}
      <ellipse cx={126} cy={132} rx={5} ry={3} fill={BODHI_SHADE} opacity={0.6} />
    </g>
  );
}

const bodhiEyes = eyesOf({
  rx: 9.4,
  ry: 10.6,
  fill: EYE_WHITE,
  iris: { r: 7.6, color: "#3e2418" },
  pupil: { r: 3.8 },
  shine: 3,
  lid: BODHI_SKIN,
  rim: { color: INK, w: 3, lashes: 0 },
  closed: INK,
  browY: 17,
  brow: arcBrow(BODHI_HAIR, 4.4, 6.4),
  rest: { raise: 3, browTilt: -2, look: [0, -0.8] },
});

/* ——— Ada, a grandmother: runs the tea stall on the bank, laughs the loudest ——— */

const ADA_SKIN = "#f0c7a6";
const ADA_SHADE = "#d9a684";
const ADA_HAIR = "#e7e4ec";
const ADA_HI = "#ffffff";

const ADA = cute("ada", {
  k: 1.4,
  neck: 200,
  torso: "M80 150 Q100 144 120 150 Q130 158 129 178 L126 212 Q124 222 100 222 Q76 222 74 212 L71 178 Q70 158 80 150 Z",
  w: { upper: 13, fore: 12, thigh: 13, shin: 12, hand: 8, cloth: 1.1 },
  headVB: "12 22 176 176",
});

function AdaBack() {
  return (
    <g fill={mix(ADA_HAIR, C.mid, 80)}>
      {[
        [58, 110, 16],
        [142, 110, 16],
        [62, 88, 17],
        [138, 88, 17],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

function AdaHead() {
  return (
    <g>
      <Two d={blob(100, 114, 41, 38, 1.1)} fill={ADA_SKIN} shade={ADA_SHADE} k={2.2} />
      {/* a cloud of short silver curls */}
      <g fill={ADA_HAIR}>
        {[
          [64, 92, 13],
          [74, 76, 14],
          [90, 66, 14],
          [108, 64, 14],
          [124, 70, 14],
          [136, 86, 13],
          [62, 108, 10],
          [138, 106, 10],
        ].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <path d="M80 70 q5 -5 10 0 M102 62 q5 -5 10 0 M120 72 q4 -4 8 0" {...line(mix(ADA_HAIR, C.mid, 70), 2.2)} />
      {/* laughter lines at the corners of her eyes */}
      <path d="M62 112 l-5 -2 M62 118 l-5 1 M138 112 l5 -2 M138 118 l5 1" {...line(ADA_SHADE, 1.8)} />
    </g>
  );
}

/** Over her eyes: half-moon spectacles, worn low. */
function AdaTop() {
  return (
    <g {...line(C.accentDeep, 2.4)}>
      <path d="M71 118 Q71 130 82 130 Q93 130 93 118 Z" fill={EYE_WHITE} fillOpacity={0.3} />
      <path d="M107 118 Q107 130 118 130 Q129 130 129 118 Z" fill={EYE_WHITE} fillOpacity={0.3} />
      <path d="M93 119 Q100 116 107 119" />
    </g>
  );
}

const adaEyes = eyesOf({
  rx: 7.6,
  ry: 8.6,
  fill: EYE_WHITE,
  iris: { r: 6, color: "#4a6a7a" },
  pupil: { r: 3 },
  shine: 2.2,
  lid: ADA_SKIN,
  rim: { color: INK, w: 2.4, lashes: 1 },
  closed: INK,
  browY: 15,
  brow: arcBrow(mix(ADA_HAIR, C.mid, 60), 3.4, 6),
  /* twinkling: lower lids up, as if about to laugh */
  rest: { bottom: 0.18, raise: 3, browTilt: 4 },
});

/* ——— Kai, a boy of about fourteen: cool, deadpan, secretly the kindest ——— */

const KAI_SKIN = "#e2b48c";
const KAI_SHADE = "#c79470";
const KAI_HAIR = "#1f2733";
const KAI_HI = "#4a5a70";

const KAI = cute("kai", {
  k: 1.28,
  neck: 192,
  torso: "M82 148 Q100 142 118 148 Q127 156 126 174 L123 212 Q121 222 100 222 Q79 222 77 212 L74 174 Q73 156 82 148 Z",
  w: { upper: 11.5, fore: 10.5, thigh: 12.5, shin: 11.5, hand: 7.2, cloth: 1 },
  j: { hipL: [92, 250], kneeL: [91, 262], footL: [90, 273], hipR: [108, 250], kneeR: [109, 262], footR: [110, 273] },
  headVB: "20 30 160 160",
});

function KaiBack() {
  return <path d={blob(100, 104, 46, 44, 1.02)} fill={KAI_HAIR} />;
}

function KaiHead() {
  return (
    <g>
      <circle cx={60} cy={116} r={6.4} fill={KAI_SKIN} />
      <circle cx={140} cy={116} r={6.4} fill={KAI_SKIN} />
      <Two d={blob(100, 112, 39, 38, 1.02)} fill={KAI_SKIN} shade={KAI_SHADE} k={2} />
      {/* a long fringe swept across, hiding one eye's brow */}
      <path d="M56 104 C54 66 80 56 104 58 C130 60 146 76 144 102 C138 92 130 88 122 86 C112 98 92 108 64 110 C70 104 74 98 76 92 C68 96 62 100 56 104 Z" fill={KAI_HAIR} />
      <path d="M78 68 Q98 60 118 66" {...line(KAI_HI, 3)} />
    </g>
  );
}

/** Kai wears his headphones round his neck, always. */
function KaiPendant() {
  return (
    <g>
      <path d="M78 150 Q100 166 122 150" {...line(C.deep, 4)} />
      <circle cx={78} cy={152} r={7} fill={C.deep} />
      <circle cx={122} cy={152} r={7} fill={C.deep} />
      <circle cx={78} cy={152} r={3.4} fill={C.accent} />
      <circle cx={122} cy={152} r={3.4} fill={C.accent} />
    </g>
  );
}

const kaiEyes = eyesOf({
  rx: 8.2,
  ry: 8.8,
  fill: EYE_WHITE,
  iris: { r: 6.2, color: "#3a4a5e" },
  pupil: { r: 3 },
  shine: 2.2,
  lid: KAI_SKIN,
  rim: { color: INK, w: 2.8, lashes: 0 },
  closed: INK,
  browY: 15,
  brow: arcBrow(KAI_HAIR, 3.6, 6.4),
  /* deadpan: lids half down, brows flat */
  rest: { top: 0.4, raise: -1, look: [1.6, 0] },
});

/* ——— The candidates ——— */

export const SHORTLIST: Candidate[] = [
  {
    id: "cand-mischa",
    kind: "animal",
    frame: MISCHA,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -8, hands: { L: [86, 196], R: [114, 190], outL: false, outR: false } },
    label: "Mischa",
    signature: "A grey raccoon with a bandit's mask, white brows and a ringed tail — nimble hands",
    pitch: "The night visitor who “borrows” things and always brings them back, mostly. Cheeky, sly, quick; wants to be trusted; the flaw is that he can't leave a lid closed. At rest: rubbing his hands, looking sideways, one brow up. Ability: Nimble hands — opens any lid, unties any knot.",
    risk: "Sly, never a thief: what he borrows comes back. Never sneaky with the learner.",
    pal: pal(RAC, RAC_MASK, { skin: RAC, skinShade: RAC_SHADE, limb: RAC, paw: RAC_MASK }),
    body: RAC,
    face: face({ eyeY: 112, eyeGap: 19, mouthY: 141, lid: RAC_MASK, kit: mischaEyes, mouthKit: mouthOf({ lip: RAC_SHADE, W: 7, H: 6.4, fang: true, rest: (y) => <path d={`M93 ${y + 1} Q101 ${y + 4} 108 ${y - 2}`} {...line(RAC_SHADE, 2.6)} /> }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <MischaBehind />,
    belly: () => <ellipse cx={100} cy={190} rx={18} ry={22} fill={RAC_LIGHT} />,
    head: () => <MischaHead />,
  },
  {
    id: "cand-thistle",
    kind: "animal",
    frame: THISTLE,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: 6, hands: { L: [94, 184], R: [106, 184], outL: false, outR: false } },
    label: "Thistle",
    signature: "A small hedgehog with a crown of soft spines and a big button nose — she curls",
    pitch: "Fussy and tender: wants everything to grow properly, frets that it won't. At rest her paws are clasped and her brows knitted. Ability: Curl — rolls into a spiky ball and trundles off when it all gets too much.",
    risk: "Fussing is care, never nagging the learner.",
    pal: pal(HOG_FACE, HOG_SHADE, { skin: HOG_FACE, skinShade: HOG_SHADE, limb: HOG_FACE, paw: HOG_SHADE }),
    body: SPINE,
    face: face({ eyeY: 114, eyeGap: 16, mouthY: 140, lid: HOG_FACE, kit: thistleEyes, mouthKit: mouthOf({ lip: "#b36a5e", W: 6, H: 6 }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    headBack: () => <ThistleBack />,
    belly: () => <ellipse cx={100} cy={188} rx={18} ry={22} fill={HOG_FACE} />,
    head: () => <ThistleHead />,
  },
  {
    id: "cand-cappy",
    kind: "animal",
    frame: CAPPY,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: 3, hands: { L: [86, 206], R: [114, 206], outL: true, outR: true } },
    label: "Cappy",
    signature: "A square-snouted capybara, eyes nearly shut, perfectly at peace — it floats",
    pitch: "Unbothered by anything: wants everyone to calm down, and somehow they do. At rest, eyes nearly shut, a tiny content smile. A rounded box of a head (its silhouette), small round ears, a broad dark nose. Ability: Float — lies back and drifts on anything, and others climb aboard.",
    risk: "Calm, never bored or dismissive.",
    pal: pal(CAPY, CAPY_SHADE, { skin: CAPY, skinShade: CAPY_SHADE, limb: CAPY, paw: CAPY_SHADE }),
    body: CAPY,
    face: face({ eyeY: 104, eyeGap: 22, mouthY: 142, lid: CAPY, kit: cappyEyes, mouthKit: mouthOf({ lip: CAPY_NOSE, W: 7, H: 6, buck: true, rest: (y) => <path d={`M96 ${y} Q100 ${y + 3} 104 ${y}`} {...line(CAPY_NOSE, 2.4)} /> }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    head: () => <CappyHead />,
  },
  {
    id: "cand-pebble",
    kind: "animal",
    frame: PEBBLE,
    legs: false,
    outline: false,
    attitude: { mood: "happy", tilt: -6, hands: { L: [70, 196], R: [130, 196], outL: true, outR: true } },
    label: "Pebble",
    signature: "A round pale seal pup with huge dark eyes and flippers — it slides",
    pitch: "Delighted by everything, every time: wants to play. At rest, flippers out, beaming. Huge glossy eyes, whisker pads, a few spots, hind flippers fanned behind. Ability: Slide — whooshes along on its belly.",
    risk: "Pale on a pale ground: its shade must carry it. Delight never escalates.",
    pal: pal(SEAL, SEAL_SHADE, { skin: SEAL, skinShade: SEAL_SHADE, limb: SEAL, paw: SEAL_SHADE }),
    body: SEAL,
    face: face({ eyeY: 110, eyeGap: 20, mouthY: 142, lid: SEAL, kit: pebbleEyes, mouthKit: mouthOf({ lip: SEAL_SHADE, W: 6.4, H: 6 }) }),
    outfit: "bare",
    outfits: ANIMAL_OUTFITS,
    behind: () => <PebbleBehind />,
    head: () => <PebbleHead />,
  },
  {
    id: "cand-bodhi",
    kind: "human",
    frame: BODHI,
    outline: false,
    hands: "mitten",
    attitude: { mood: "delighted", tilt: 6, hands: { L: [66, 196], R: [150, 120], outL: true, outR: true } },
    label: "Bodhi",
    signature: "A boy of about nine with a mop of curls, mud on his cheek, one fist up — he bounces",
    pitch: "First into everything, muddy knees, a grin with a missing tooth: wants to explore; the flaw is he never looks before he leaps. Ability: Bounce — springs three times his own height.",
    risk: "Energy kept small; never a celebration that grows.",
    pal: person(BODHI_SKIN, BODHI_SHADE, BODHI_HAIR, BODHI_HI),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 18, mouthY: 138, nose: "dot", lid: BODHI_SKIN, kit: bodhiEyes, mouthKit: mouthOf({ lip: "#5a2a1e", W: 8.6, H: 8, teeth: true, gap: true }) }),
    outfit: "dungarees",
    outfits: PERSON_OUTFITS,
    head: () => <BodhiHead />,
  },
  {
    id: "cand-ada",
    kind: "human",
    frame: ADA,
    outline: false,
    hands: "mitten",
    attitude: { mood: "happy", tilt: -5, hands: { L: [92, 186], R: [108, 186], outL: false, outR: false } },
    label: "Ada",
    signature: "A grandmother with a cloud of silver curls and half-moon spectacles — she hums",
    pitch: "Runs the tea stall on the bank and laughs the loudest; wants everyone fed; the flaw is she can't keep a secret. Twinkling eyes, laughter lines, spectacles worn low. Ability: Hum — one tune and everyone settles.",
    risk: "A grown-up who is never strict; her “well done” is fixed copy on one event only.",
    pal: person(ADA_SKIN, ADA_SHADE, ADA_HAIR, ADA_HI),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 118, eyeGap: 18, mouthY: 138, nose: "dot", lid: ADA_SKIN, kit: adaEyes, mouthKit: mouthOf({ lip: "#a85a56", W: 8, H: 7, teeth: true }) }),
    outfit: "dress",
    outfits: PERSON_OUTFITS,
    headBack: () => <AdaBack />,
    head: () => <AdaHead />,
    top: () => <AdaTop />,
  },
  {
    id: "cand-kai",
    kind: "human",
    frame: KAI,
    outline: false,
    hands: "mitten",
    attitude: { mood: "neutral", tilt: -4, hands: { L: [84, 204], R: [116, 204], outL: true, outR: true } },
    label: "Kai",
    signature: "A boy of about fourteen with a swept fringe and headphones round his neck — he moonwalks",
    pitch: "Cool, deadpan, says little — and is secretly the kindest, the one who waits for the slow ones. Wants to look like he doesn't care. Hands in pockets, lids half down, a fringe over one brow. Ability: Moonwalk — glides backwards as if the ground were ice.",
    risk: "Cool, never dismissive of the learner.",
    pal: person(KAI_SKIN, KAI_SHADE, KAI_HAIR, KAI_HI),
    body: C.clothes,
    face: face({ eyes: "anime", eyeY: 116, eyeGap: 17, mouthY: 136, nose: "dot", lid: KAI_SKIN, kit: kaiEyes, mouthKit: mouthOf({ lip: "#9a5a4a", W: 7.4, H: 7, teeth: true, rest: (y) => <path d={`M95 ${y + 1} L105 ${y}`} {...line("#9a5a4a", 2.6)} /> }) }),
    outfit: "hoodie",
    outfits: PERSON_OUTFITS,
    headBack: () => <KaiBack />,
    head: () => <KaiHead />,
    pendant: () => <KaiPendant />,
  },
];

