import type { Candidate, Ctx } from "./candidates";
import { Antenna, bright, GlowGrad, palette } from "./firefly-variants";
import { WHITE } from "./rig/palette";
import { J, pivot, type Body } from "./rig/skeleton";

/**
 * Round two of firefly bodies. Each is built from nothing on a frame of its own, and each puts the
 * light somewhere no other variant does: in the wings, in the whole body, in the last segment of
 * a three-part insect, behind a window, inside a cloak.
 */

const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

/* ——— Flutter: a fairy-slight body under four great wings; the light lives in the wings ——— */

const FLT_BODY = "#3b3fa8";
const palFlutter = palette(FLT_BODY, "#272a7a", "#fdeee4", "#e8cfbf", {
  eye: "#2b2f86",
  glow: "#ffd54f",
  top: "#ff8f7a",
  topAlt: "#fff3de",
  bottom: FLT_BODY,
  shoe: "#ff8f7a",
  accent: "#ff8f7a",
  blush: "#ff9fb0",
});

const FLUTTER: Body = {
  id: "flutter",
  j: {
    ...J,
    shoulderL: [87, 158],
    elbowL: [83, 180],
    wristL: [81, 200],
    shoulderR: [113, 158],
    elbowR: [117, 180],
    wristR: [119, 200],
    hipL: [94, 210],
    kneeL: [93, 240],
    footL: [92, 270],
    hipR: [106, 210],
    kneeR: [107, 240],
    footR: [108, 270],
    torso: [100, 210],
  },
  torso:
    "M88 150 Q100 146 112 150 Q118 154 117 168 L115 200 Q114 212 100 213 Q86 212 85 200 L83 168 Q82 154 88 150 Z",
  headVB: "34 4 132 132",
  w: { upper: 8, fore: 7.5, thigh: 9, shin: 8.5, hand: 5.6, cloth: 0.8 },
  neck: { x: 94, y: 132, w: 12, h: 22 },
};

function FlutterHead({ pal }: Ctx) {
  return (
    <g>
      <ellipse cx={100} cy={100} rx={44} ry={41} fill={FLT_BODY} />
      <path
        d="M60 110 C60 90 78 80 100 80 C122 80 140 90 140 110 C140 130 122 140 100 140 C78 140 60 130 60 110 Z"
        fill={pal.skin}
      />
      {/* one kiss-curl on the forehead */}
      <path
        d="M100 80 C100 70 112 70 112 78 C112 84 104 84 104 79"
        stroke={FLT_BODY}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M72 70 Q84 62 96 62"
        stroke="#6b6fd6"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={100} rx={44} ry={41} fill="none" stroke={pal.ink} strokeWidth={2.5} />
    </g>
  );
}

function FlutterAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M90 60 C82 34 58 20 40 30 C34 34 34 42 40 44", [40, 44]],
          ["R", "M110 60 C118 34 142 20 160 30 C166 34 166 42 160 44", [160, 44]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 90 : 110, 60]} mood={mood}>
          {/* long, willowy, drooping at the ends like whiskers */}
          <path d={d} stroke={pal.ink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={3} fill={pal.accent} stroke={pal.ink} strokeWidth={1.4} />
        </Antenna>
      ))}
    </g>
  );
}

function FlutterBehind({ pal, uid, mood }: Ctx) {
  const w = `${uid}-fltwing`;
  const g = `${uid}-fltspot`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f59e2a" />
      <defs>
        <linearGradient id={w} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe9dc" />
          <stop offset="100%" stopColor="#ffc2b4" />
        </linearGradient>
      </defs>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          {/* four great lobes: the wings are the silhouette */}
          <path
            d={`M${100 + 6 * s} 160 C${100 + 30 * s} 120 ${100 + 60 * s} 84 ${100 + 84 * s} 100 C${100 + 100 * s} 116 ${100 + 82 * s} 160 ${100 + 6 * s} 168 Z`}
            fill={`url(#${w})`}
            stroke={pal.ink}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 6 * s} 170 C${100 + 50 * s} 170 ${100 + 80 * s} 196 ${100 + 66 * s} 222 C${100 + 54 * s} 240 ${100 + 26 * s} 214 ${100 + 6 * s} 178 Z`}
            fill={`url(#${w})`}
            stroke={pal.ink}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 10 * s} 162 Q${100 + 40 * s} 130 ${100 + 70 * s} 108 M${100 + 10 * s} 174 Q${100 + 40 * s} 190 ${100 + 58 * s} 216`}
            stroke="#e08f7e"
            strokeWidth={1.6}
            fill="none"
          />
          {/* eyespots that glow */}
          <circle
            data-joint="glow"
            cx={100 + 64 * s}
            cy={124}
            r={18}
            fill={pal.glow}
            opacity={0.4 * bright(mood)}
          />
          <circle
            cx={100 + 64 * s}
            cy={124}
            r={10}
            fill={`url(#${g})`}
            stroke={pal.ink}
            strokeWidth={2}
          />
          <circle
            cx={100 + 54 * s}
            cy={206}
            r={6}
            fill={`url(#${g})`}
            stroke={pal.ink}
            strokeWidth={1.8}
          />
        </g>
      ))}
    </g>
  );
}

/* ——— Lampion: the whole body is a paper lantern, lit from inside ——— */

const LMP_PAPER = "#ffe7a3";
const LMP_WOOD = "#6b3f2a";
const LMP_RIB = "#e08e3a";
const palLampion = palette(LMP_WOOD, "#4a2a1b", "#fff0dc", "#ecd2b4", {
  eye: "#3a2418",
  glow: "#ffd23f",
  top: "#3f6fd0",
  bottom: "#3f6fd0",
  shoe: "#3f6fd0",
  accent: "#d9483b",
  blush: "#f6a08c",
});

const LAMPION: Body = {
  id: "lampion",
  j: {
    ...J,
    head: [100, 160],
    shoulderL: [62, 190],
    elbowL: [54, 208],
    wristL: [52, 224],
    shoulderR: [138, 190],
    elbowR: [146, 208],
    wristR: [148, 224],
    torso: [100, 236],
    hipL: [88, 236],
    kneeL: [87, 254],
    footL: [86, 270],
    hipR: [112, 236],
    kneeR: [113, 254],
    footR: [114, 270],
    tail: [100, 240],
    wingL: [74, 176],
    wingR: [126, 176],
  },
  headFit: "translate(100 160) scale(0.85) translate(-100 -150)",
  torso:
    "M100 156 C124 156 142 174 142 198 C142 222 124 238 100 238 C76 238 58 222 58 198 C58 174 76 156 100 156 Z",
  headVB: "40 16 120 120",
  w: { upper: 8.5, fore: 8, thigh: 10, shin: 9.5, hand: 6, cloth: 1 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

function LampionHead({ pal }: Ctx) {
  return (
    <g>
      {/* the hanging loop: it could be hung up like any lantern */}
      <path
        d="M88 60 C88 36 112 36 112 60"
        stroke={pal.ink}
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M88 60 C88 36 112 36 112 60"
        stroke={LMP_RIB}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={102} rx={46} ry={40} fill={LMP_WOOD} />
      <path
        d="M58 112 C58 94 76 86 100 86 C124 86 142 94 142 112 C142 130 122 140 100 140 C78 140 58 130 58 112 Z"
        fill={pal.skin}
      />
      <path
        d="M66 82 Q80 68 98 66"
        stroke="#8f5a3f"
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={102} rx={46} ry={40} fill="none" stroke={pal.ink} strokeWidth={2.5} />
    </g>
  );
}

function LampionAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M78 70 C70 60 64 56 56 56", [52, 58]],
          ["R", "M122 70 C130 60 136 56 144 56", [148, 58]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 78 : 122, 70]} mood={mood}>
          <path d={d} stroke={pal.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* tassels, like the ones that hang from a lantern */}
          <path
            d={`M${x} ${y - 4} L${x - 4} ${y + 8} L${x + 4} ${y + 8} Z`}
            fill={pal.accent}
            stroke={pal.ink}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </Antenna>
      ))}
    </g>
  );
}

function LampionBehind({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j, LAMPION.j)}>
          <ellipse
            cx={100 + 48 * s}
            cy={166}
            rx={12}
            ry={20}
            transform={`rotate(${40 * s} ${100 + 48 * s} 166)`}
            fill="#fff6e6"
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2}
          />
        </g>
      ))}
      <circle
        data-joint="glow"
        cx={100}
        cy={198}
        r={60}
        fill={pal.glow}
        opacity={0.3 * bright(mood)}
      />
    </g>
  );
}

function LampionPaper({ uid, pal }: Ctx) {
  const g = `${uid}-lmppaper`;
  return (
    <g>
      <defs>
        <radialGradient id={g} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={WHITE} />
          <stop offset="55%" stopColor={LMP_PAPER} />
          <stop offset="100%" stopColor="#f7c35a" />
        </radialGradient>
      </defs>
      <path
        d="M100 156 C124 156 142 174 142 198 C142 222 124 238 100 238 C76 238 58 222 58 198 C58 174 76 156 100 156 Z"
        fill={`url(#${g})`}
      />
      {/* paper ribs */}
      <path
        d="M100 156 L100 238 M86 158 C72 180 72 216 86 236 M114 158 C128 180 128 216 114 236 M72 166 C58 186 58 212 72 230 M128 166 C142 186 142 212 128 230"
        stroke={LMP_RIB}
        strokeOpacity={0.55}
        strokeWidth={1.8}
        fill="none"
      />
      <path
        d="M78 176 Q84 168 94 166"
        stroke={WHITE}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M100 156 C124 156 142 174 142 198 C142 222 124 238 100 238 C76 238 58 222 58 198 C58 174 76 156 100 156 Z"
        fill="none"
        stroke={pal.ink}
        strokeWidth={2.5}
      />
    </g>
  );
}

function LampionCaps({ pal }: Ctx) {
  return (
    <g>
      {/* wooden rims top and bottom, and a tassel under */}
      <rect
        x={84}
        y={150}
        width={32}
        height={10}
        rx={4}
        fill={LMP_WOOD}
        stroke={pal.ink}
        strokeWidth={2.2}
      />
      <rect
        x={86}
        y={234}
        width={28}
        height={8}
        rx={3.5}
        fill={LMP_WOOD}
        stroke={pal.ink}
        strokeWidth={2.2}
      />
    </g>
  );
}

/* ——— Trio: head, thorax, abdomen — three spheres, like a real insect stood up ——— */

const TRI_BODY = "#8e7cc3";
const TRI_DARK = "#5f4f96";
const palTrio = palette(TRI_DARK, "#43357a", "#fdf0e6", "#e7d0c0", {
  eye: "#2d2350",
  glow: "#ffd23f",
  top: "#3f8fd0",
  topAlt: "#fff3de",
  bottom: TRI_DARK,
  shoe: "#3f8fd0",
  accent: "#f2b134",
  blush: "#f7a3b8",
});

const TRIO: Body = {
  id: "trio",
  j: {
    ...J,
    head: [100, 118],
    shoulderL: [84, 138],
    elbowL: [74, 156],
    wristL: [70, 174],
    shoulderR: [116, 138],
    elbowR: [126, 156],
    wristR: [130, 174],
    torso: [100, 244],
    hipL: [88, 242],
    kneeL: [87, 257],
    footL: [86, 271],
    hipR: [112, 242],
    kneeR: [113, 257],
    footR: [114, 271],
    tail: [100, 230],
    wingL: [96, 140],
    wingR: [104, 140],
  },
  headFit: "translate(100 118) scale(0.82) translate(-100 -150)",
  handsFit: "translate(0 -20)",
  torso:
    "M100 124 C114 124 120 132 118 142 C116 150 108 152 106 156 C128 160 142 180 142 204 C142 230 124 246 100 246 C76 246 58 230 58 204 C58 180 72 160 94 156 C92 152 84 150 82 142 C80 132 86 124 100 124 Z",
  headVB: "44 4 112 112",
  w: { upper: 8, fore: 7.5, thigh: 10, shin: 9.5, hand: 5.8, cloth: 0.85 },
  neck: { x: 95, y: 108, w: 10, h: 18 },
};

function TrioHead({ pal }: Ctx) {
  return (
    <g>
      <ellipse cx={100} cy={100} rx={48} ry={40} fill={TRI_BODY} />
      <path
        d="M62 112 C62 94 80 88 100 88 C120 88 138 94 138 112 C138 130 120 139 100 139 C80 139 62 130 62 112 Z"
        fill={pal.skin}
      />
      <path
        d="M68 78 Q84 64 102 64"
        stroke="#b6a8e6"
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={100} rx={48} ry={40} fill="none" stroke={pal.ink} strokeWidth={2.5} />
    </g>
  );
}

function TrioAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          [
            "L",
            "M86 62 L78 36 L56 26",
            [
              [80, 44],
              [72, 33],
              [64, 30],
            ],
            [52, 24],
          ],
          [
            "R",
            "M114 62 L122 36 L144 26",
            [
              [120, 44],
              [128, 33],
              [136, 30],
            ],
            [148, 24],
          ],
        ] as const
      ).map(([side, d, beads, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 86 : 114, 62]} mood={mood}>
          {/* elbowed and beaded, the way a real insect's are */}
          <path
            d={d}
            stroke={pal.ink}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {beads.map(([bx, by]) => (
            <circle
              key={bx}
              cx={bx}
              cy={by}
              r={2.6}
              fill={TRI_DARK}
              stroke={pal.ink}
              strokeWidth={1}
            />
          ))}
          <ellipse cx={x} cy={y} rx={5} ry={4} fill={TRI_DARK} stroke={pal.ink} strokeWidth={1.6} />
        </Antenna>
      ))}
    </g>
  );
}

function TrioBehind({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j, TRIO.j)}>
          {/* clear wings folded back along the body, as a firefly rests */}
          <ellipse
            cx={100 + 30 * s}
            cy={188}
            rx={14}
            ry={52}
            transform={`rotate(${-18 * s} ${100 + 30 * s} 188)`}
            fill="#eef3ff"
            fillOpacity={0.85}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
          <path
            d={`M${100 + 22 * s} 144 Q${100 + 34 * s} 190 ${100 + 46 * s} 234`}
            stroke={pal.ink}
            strokeOpacity={0.25}
            strokeWidth={1.4}
            fill="none"
          />
        </g>
      ))}
      <circle
        data-joint="glow"
        cx={100}
        cy={232}
        r={50}
        fill={pal.glow}
        opacity={0.3 * bright(mood)}
      />
    </g>
  );
}

function TrioLantern({ pal, uid }: Ctx) {
  const g = `${uid}-trilamp`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      {/* the lantern: the last segments of the abdomen, as on a real firefly */}
      <path
        d="M62 218 Q100 232 138 218 C132 236 118 246 100 246 C82 246 68 236 62 218 Z"
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
    </g>
  );
}

/* ——— Cube: everything square — head, body, antennae — and a lit window in its chest ——— */

const CUBE_BODY = "#23a6c8";
const CUBE_DARK = "#157a96";
const palCube = palette(CUBE_DARK, "#0f5b70", "#fff4e4", "#ead6bd", {
  eye: "#10384a",
  glow: "#ffd23f",
  top: "#f06a8a",
  topAlt: "#fff3de",
  bottom: "#2d3a7a",
  shoe: "#f06a8a",
  accent: "#f06a8a",
  blush: "#ff9fb0",
});

const CUBE: Body = {
  id: "cube",
  j: { ...J, torso: [100, 214] },
  torso:
    "M80 150 L120 150 Q126 150 126 156 L126 214 Q126 220 120 220 L80 220 Q74 220 74 214 L74 156 Q74 150 80 150 Z",
  headVB: "34 12 132 132",
  w: { upper: 11, fore: 10, thigh: 13, shin: 12, hand: 6.6, cloth: 1 },
  neck: { x: 93, y: 136, w: 14, h: 18 },
};

function CubeHead({ pal }: Ctx) {
  return (
    <g>
      <rect
        x={52}
        y={60}
        width={96}
        height={80}
        rx={12}
        fill={CUBE_BODY}
        stroke={pal.ink}
        strokeWidth={2.6}
      />
      <rect x={60} y={82} width={80} height={50} rx={8} fill={pal.skin} />
      {/* a pixel highlight, not a curve */}
      <rect x={62} y={66} width={16} height={5} rx={1.5} fill={WHITE} opacity={0.7} />
      <rect x={82} y={66} width={5} height={5} rx={1.5} fill={WHITE} opacity={0.7} />
    </g>
  );
}

function CubeAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M84 60 L84 42 L68 42", [62, 36]],
          ["R", "M116 60 L116 42 L132 42", [126, 36]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 84 : 116, 60]} mood={mood}>
          {/* right-angled, with a square light on the end */}
          <path d={d} stroke={pal.ink} strokeWidth={3.2} fill="none" strokeLinejoin="round" />
          <rect
            x={x - 5}
            y={y - 5}
            width={22}
            height={22}
            rx={4}
            fill={pal.glow}
            opacity={0.3 * bright(mood)}
          />
          <rect
            x={x}
            y={y}
            width={12}
            height={12}
            rx={2.5}
            fill={pal.glow}
            stroke={pal.ink}
            strokeWidth={1.8}
          />
        </Antenna>
      ))}
    </g>
  );
}

function CubeBehind({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          {/* wings as two stacked panels */}
          <rect
            x={s < 0 ? 44 : 118}
            y={146}
            width={38}
            height={24}
            rx={6}
            transform={`rotate(${-16 * s} ${100 + 20 * s} 158)`}
            fill="#e2f6fb"
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
          <rect
            x={s < 0 ? 52 : 118}
            y={172}
            width={30}
            height={18}
            rx={5}
            transform={`rotate(${12 * s} ${100 + 20 * s} 180)`}
            fill="#e2f6fb"
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
        </g>
      ))}
      <rect
        data-joint="glow"
        x={64}
        y={156}
        width={72}
        height={60}
        rx={16}
        fill={pal.glow}
        opacity={0.25 * bright(mood)}
      />
    </g>
  );
}

function CubeWindow({ pal, uid }: Ctx) {
  const g = `${uid}-cubewin`;
  return (
    <g>
      <GlowGrad id={g} glow={pal.glow} rim="#f5a623" />
      {/* its light is a four-paned window, lit from inside; it shows through any outfit */}
      <rect
        x={88}
        y={172}
        width={24}
        height={24}
        rx={4}
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.2}
      />
      <path d="M100 172 L100 196 M88 184 L112 184" stroke={pal.ink} strokeWidth={1.8} />
    </g>
  );
}

/* ——— Hood: a cone of a cloak with a pointed hood; the light glows from inside the cloak ——— */

const HOOD_CLOAK = "#1e4d6b";
const HOOD_LINE = "#3f7aa0";
const palHood = palette(HOOD_CLOAK, "#123349", "#fdeede", "#e8cdb4", {
  eye: "#173a52",
  glow: "#ffd23f",
  top: "#e8b04a",
  topAlt: "#fff3de",
  bottom: HOOD_CLOAK,
  shoe: "#e8b04a",
  accent: "#e8b04a",
  blush: "#f7a3a3",
});

const HOOD: Body = {
  id: "hood",
  j: {
    ...J,
    shoulderL: [84, 160],
    elbowL: [76, 184],
    wristL: [72, 206],
    shoulderR: [116, 160],
    elbowR: [124, 184],
    wristR: [128, 206],
    torso: [100, 250],
    hipL: [92, 246],
    kneeL: [91, 258],
    footL: [90, 272],
    hipR: [108, 246],
    kneeR: [109, 258],
    footR: [110, 272],
  },
  torso:
    "M86 146 Q100 142 114 146 C124 170 136 214 144 250 Q100 262 56 250 C64 214 76 170 86 146 Z",
  headVB: "30 4 136 136",
  w: { upper: 10, fore: 9, thigh: 11, shin: 10, hand: 6.2, cloth: 1 },
  neck: { x: 100, y: 150, w: 0, h: 0 },
};

function HoodHead({ pal }: Ctx) {
  return (
    <g>
      {/* the hood: a point that flops back to one side */}
      <path
        d="M50 130 C42 96 56 60 92 46 C110 38 128 30 150 26 C140 38 140 50 146 66 C156 90 158 114 150 130 C140 148 60 148 50 130 Z"
        fill={HOOD_CLOAK}
        stroke={pal.ink}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path
        d="M92 50 Q120 40 144 30"
        stroke={HOOD_LINE}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      {/* the opening, shadowed at its rim */}
      <ellipse cx={100} cy={108} rx={40} ry={35} fill="#123349" />
      <ellipse cx={100} cy={110} rx={36} ry={31} fill={pal.skin} />
    </g>
  );
}

function HoodAntennae({ pal, mood }: Ctx) {
  return (
    <g>
      {(
        [
          ["L", "M80 66 C72 56 60 54 52 60 C48 64 52 70 58 66", [58, 66]],
          ["R", "M120 66 C128 56 140 54 148 60 C152 64 148 70 142 66", [142, 66]],
        ] as const
      ).map(([side, d, [x, y]]) => (
        <Antenna key={side} side={side} base={[side === "L" ? 80 : 120, 66]} mood={mood}>
          {/* poking out through slits in the hood, curled like fern tips */}
          <path
            d={`M${side === "L" ? 76 : 116} 64 l8 4`}
            stroke={pal.ink}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <path d={d} stroke={pal.ink} strokeWidth={2.8} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={2.8} fill={pal.accent} stroke={pal.ink} strokeWidth={1.2} />
        </Antenna>
      ))}
    </g>
  );
}

function HoodBehind({ pal, mood }: Ctx) {
  return (
    <circle
      data-joint="glow"
      cx={100}
      cy={222}
      r={46}
      fill={pal.glow}
      opacity={0.3 * bright(mood)}
    />
  );
}

function HoodLight({ pal, uid }: Ctx) {
  const g = `${uid}-hoodlight`;
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb547" />
          <stop offset="55%" stopColor={pal.glow} />
          <stop offset="100%" stopColor={WHITE} />
        </linearGradient>
      </defs>
      {/* the cloak parts at the front, and the light inside shows through */}
      <path
        d="M100 168 C104 196 110 226 118 254 Q100 258 82 254 C90 226 96 196 100 168 Z"
        fill={`url(#${g})`}
        stroke={pal.ink}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M92 150 L100 160 L108 150"
        stroke={pal.accent}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export const FIREFLY_BODIES_2: Candidate[] = [
  {
    id: "firefly-flutter",
    kind: "animal",
    frame: FLUTTER,
    label: "Firefly · Flutter",
    signature: "Four great peach wings with glowing eyespots",
    pitch:
      "The wings are the character: a slight body under four big lobes, and the light lives in eyespots on them — so every flap is a flash. Willowy antennae droop like whiskers. The most graceful silhouette, and the one that best says 'it flies'.",
    risk: "Reads as a butterfly or a fairy before a firefly; the wide wings make it the widest figure and hard to fit beside material.",
    pal: palFlutter,
    body: FLT_BODY,
    face: {
      eyes: "anime",
      eyeY: 110,
      eyeGap: 18,
      eyeSize: 1.05,
      mouthY: 128,
      nose: "none",
      brows: true,
      lashes: true,
      lid: palFlutter.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <FlutterBehind {...c} />,
    head: (c) => <FlutterHead {...c} />,
    top: (c) => <FlutterAntennae {...c} />,
    belly: () => (
      <path
        d="M88 178 Q100 182 112 178 M88 192 Q100 196 112 192"
        stroke="#ffc2b4"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: "firefly-lampion",
    kind: "animal",
    frame: LAMPION,
    label: "Firefly · Lampion",
    signature:
      "A body that is a ribbed paper lantern, lit from inside, with a hanging loop on its head",
    pitch:
      "The light is not a part of it; it is all of it. A round paper-lantern body glows through its ribs, wooden rims cap it, and a loop on its head means it could be hung up. Tassel antennae finish the object-turned-creature. Warm and festive; it suits seasonal wardrobe especially well.",
    risk: "An outfit hides the lantern — only the halo survives clothes. Paper lanterns carry strong cultural associations to use with care.",
    pal: palLampion,
    body: LMP_PAPER,
    face: {
      eyes: "bead",
      eyeY: 110,
      eyeGap: 17,
      eyeSize: 1.2,
      mouthY: 126,
      nose: "none",
      brows: false,
      lid: palLampion.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <LampionBehind {...c} />,
    head: (c) => <LampionHead {...c} />,
    top: (c) => <LampionAntennae {...c} />,
    belly: (c) => <LampionPaper {...c} />,
    pendant: (c) => <LampionCaps {...c} />,
  },
  {
    id: "firefly-trio",
    kind: "animal",
    frame: TRIO,
    label: "Firefly · Trio",
    signature:
      "Head, thorax and a big round abdomen — three spheres — with a lantern in the last segment",
    pitch:
      "The most true to the insect: three pinched segments, elbowed beaded antennae, clear wings folded along its back, and the light exactly where a real firefly's is. A science-literate design that still reads as cute: a pear-shaped body that is fun to squash and stretch.",
    risk: "The pear body makes clothes look like a onesie; the true-to-life antennae are fussier at 16px.",
    pal: palTrio,
    body: TRI_BODY,
    face: {
      eyes: "anime",
      eyeY: 112,
      eyeGap: 18,
      eyeSize: 1.2,
      mouthY: 129,
      nose: "none",
      brows: true,
      lid: palTrio.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <TrioBehind {...c} />,
    head: (c) => <TrioHead {...c} />,
    top: (c) => <TrioAntennae {...c} />,
    belly: () => (
      <path
        d="M66 184 Q100 196 134 184 M60 202 Q100 216 140 202"
        stroke={TRI_DARK}
        strokeOpacity={0.6}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    ),
    pendant: (c) => <TrioLantern {...c} />,
  },
  {
    id: "firefly-cube",
    kind: "animal",
    frame: CUBE,
    label: "Firefly · Cube",
    signature: "Square head, square body, square antenna-lights, and a lit window in its chest",
    pitch:
      "Everything else in the cast is round; this is all corners. A block of a head, right-angled antennae with square lights, panel wings, and a four-paned window in its chest that glows through any outfit. Toy-like and graphic — it would make the crispest app icon and stands apart from every mascot on a home screen.",
    risk: "Geometric can read as a robot, not a creature; the square window may look like a UI element.",
    pal: palCube,
    body: CUBE_BODY,
    face: {
      eyes: "bead",
      eyeY: 104,
      eyeGap: 20,
      eyeSize: 1.25,
      mouthY: 120,
      nose: "none",
      brows: true,
      lid: palCube.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <CubeBehind {...c} />,
    head: (c) => <CubeHead {...c} />,
    top: (c) => <CubeAntennae {...c} />,
    pendant: (c) => <CubeWindow {...c} />,
  },
  {
    id: "firefly-hood",
    kind: "animal",
    frame: HOOD,
    label: "Firefly · Hood",
    signature:
      "A cone of a cloak and a floppy pointed hood, with light spilling from the cloak's front",
    pitch:
      "A little traveller: a triangle of a cloak, a hood whose point flops to one side, antennae poking out through slits, and the light glowing from inside where the cloak parts — so it carries its light the way you'd carry a secret. The strongest triangle silhouette in the set; storybook rather than cartoon.",
    risk: "The hood frames the face but crowds hats; a cloak hides the body, so poses read mostly through the arms.",
    pal: palHood,
    body: HOOD_CLOAK,
    face: {
      eyes: "anime",
      eyeY: 108,
      eyeGap: 16,
      mouthY: 126,
      nose: "none",
      brows: true,
      lid: palHood.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <HoodBehind {...c} />,
    head: (c) => <HoodHead {...c} />,
    top: (c) => <HoodAntennae {...c} />,
    pendant: (c) => <HoodLight {...c} />,
  },
];
