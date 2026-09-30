import type { Candidate, Ctx } from "./candidates";
import { WHITE, type Palette } from "./rig/palette";
import { pivot } from "./rig/skeleton";

/**
 * Three directions for the main character, the firefly. Each is drawn on the shared chibi rig, so
 * every outfit, prop, pose and expression works on it unchanged. The glow is the firefly's own
 * ability — fire sparkles — and belongs to no other character. It is a signature, never a status.
 */

const INK = "#2a1d22";
const CREAM = "#fff3de";
const MAGENTA = "#d93f8e";
const OUTFITS: Candidate["outfits"] = [
  "bare",
  "dungarees",
  "hoodie",
  "raincoat",
  "winter",
  "party",
];

/** A four-point sparkle centred on (x, y). */
const star = (x: number, y: number, r: number) => {
  const q = r * 0.28;
  return `M${x} ${y - r} L${x + q} ${y - q} L${x + r} ${y} L${x + q} ${y + q} L${x} ${y + r} L${x - q} ${y + q} L${x - r} ${y} L${x - q} ${y - q} Z`;
};

function palette(
  body: string,
  bodyHi: string,
  face: string,
  faceShade: string,
  over: Partial<Palette>,
): Palette {
  return {
    ink: INK,
    skin: face,
    skinShade: faceShade,
    limb: body,
    paw: bodyHi,
    hair: body,
    hairHi: bodyHi,
    eye: INK,
    blush: "#f28fa6",
    top: MAGENTA,
    topAlt: CREAM,
    bottom: body,
    shoe: MAGENTA,
    accent: MAGENTA,
    glow: "#ffd84a",
    ...over,
  };
}

/* ——— A · Lantern: a round beetle with a lantern for a tail ——— */

const LAN_BODY = "#27407a";
const LAN_HELMET = "#ef8fb0";
const palLantern = palette(LAN_BODY, "#1b2d5a", "#f8e9d2", "#dcc3a2", {
  eye: "#2c2a5c",
  glow: "#ffd84a",
});

function LanternHead({ pal }: Ctx) {
  return (
    <g>
      <ellipse cx={100} cy={100} rx={46} ry={41} fill={LAN_BODY} />
      <path
        d="M60 110 C60 90 78 82 100 82 C122 82 140 90 140 110 C140 130 122 139 100 139 C78 139 60 130 60 110 Z"
        fill={pal.skin}
      />
      {/* the pronotum: a real firefly's rosy head shield, worn like a helmet */}
      <path
        d="M55 98 C55 62 78 52 100 52 C122 52 145 62 145 98 C132 86 118 82 100 82 C82 82 68 86 55 98 Z"
        fill={LAN_HELMET}
        stroke={pal.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <ellipse cx={88} cy={66} rx={5} ry={4} fill={pal.ink} />
      <ellipse cx={112} cy={66} rx={5} ry={4} fill={pal.ink} />
      <path
        d="M72 64 Q80 58 90 57"
        stroke={WHITE}
        strokeOpacity={0.6}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={100} rx={46} ry={41} fill="none" stroke={pal.ink} strokeWidth={2.5} />
    </g>
  );
}

function LanternAntennae({ pal }: Ctx) {
  return (
    <g>
      {(
        [
          [
            "antL",
            "M86 56 C82 44 76 36 68 32",
            [
              [80, 42],
              [74, 36],
            ],
            [66, 30],
          ],
          [
            "antR",
            "M114 56 C118 44 124 36 132 32",
            [
              [120, 42],
              [126, 36],
            ],
            [134, 30],
          ],
        ] as const
      ).map(([j, d, beads, tip]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <path d={d} stroke={pal.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
          {beads.map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={2.6} fill={pal.ink} />
          ))}
          <circle
            cx={tip[0]}
            cy={tip[1]}
            r={4.5}
            fill={LAN_BODY}
            stroke={pal.ink}
            strokeWidth={2}
          />
        </g>
      ))}
    </g>
  );
}

function LanternBehind({ pal }: Ctx) {
  return (
    <g>
      {/* hard wing cases, flared like a little cape; a cream edge stripe as on a real Photinus */}
      {(
        [
          [
            "wingL",
            "M90 150 C68 150 50 176 50 208 C58 218 72 214 84 204 Z",
            "M84 156 C68 162 56 184 55 206",
          ],
          [
            "wingR",
            "M110 150 C132 150 150 176 150 208 C142 218 128 214 116 204 Z",
            "M116 156 C132 162 144 184 145 206",
          ],
        ] as const
      ).map(([j, d, edge]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <ellipse
            cx={j === "wingL" ? 60 : 140}
            cy={150}
            rx={20}
            ry={11}
            transform={`rotate(${j === "wingL" ? 30 : -30} ${j === "wingL" ? 60 : 140} 150)`}
            fill="#dcecff"
            fillOpacity={0.85}
            stroke={pal.ink}
            strokeWidth={2}
          />
          <path d={d} fill={LAN_BODY} stroke={pal.ink} strokeWidth={2.4} strokeLinejoin="round" />
          <path
            d={edge}
            stroke={CREAM}
            strokeOpacity={0.8}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      <g data-joint="tail" style={pivot("tail")}>
        <circle data-joint="glow" cx={124} cy={236} r={40} fill={pal.glow} opacity={0.35} />
        <path
          d="M104 214 C124 206 148 216 148 236 C148 256 128 262 114 254 C104 248 100 230 104 214 Z"
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* segment rings make it read as a lantern, not a ball */}
        <path
          d="M110 222 Q128 218 144 226 M110 238 Q128 236 146 242"
          stroke="#e7b21e"
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
        />
        <path d={star(124, 230, 6)} fill={WHITE} />
      </g>
    </g>
  );
}

/* ——— B · Spark: a quick, magical firefly that sheds sparkles ——— */

const SPK_BODY = "#4b3aa0";
const SPK_WING = "#e6dcff";
const palSpark = palette(SPK_BODY, "#33267a", "#f7e7d4", "#dcc4a6", {
  eye: "#4b3aa0",
  glow: "#ffcf3f",
  accent: "#ff8a4c",
});

function SparkHead({ pal }: Ctx) {
  return (
    <g>
      <ellipse cx={100} cy={100} rx={45} ry={42} fill={SPK_BODY} />
      {/* a widow's-peak face: the point makes the head read as pointing forward, eager */}
      <path
        d="M61 108 C61 88 76 78 90 76 L100 66 L110 76 C124 78 139 88 139 108 C139 130 122 139 100 139 C78 139 61 130 61 108 Z"
        fill={pal.skin}
      />
      <ellipse cx={100} cy={100} rx={45} ry={42} fill="none" stroke={pal.ink} strokeWidth={2.5} />
      <path
        d="M74 66 Q84 60 94 60"
        stroke="#7a6ad0"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      {/* glow freckles */}
      {[
        [72, 116],
        [77, 121],
        [128, 116],
        [123, 121],
      ].map(([x, y]) => (
        <circle
          key={`${x}${y}`}
          cx={x}
          cy={y}
          r={1.8}
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={0.6}
        />
      ))}
    </g>
  );
}

function SparkAntennae({ pal }: Ctx) {
  return (
    <g>
      {(
        [
          ["antL", "M88 60 C80 40 62 36 60 24 C58 14 70 12 72 20", [72, 20]],
          ["antR", "M112 60 C120 40 138 36 140 24 C142 14 130 12 128 20", [128, 20]],
        ] as const
      ).map(([j, d, [x, y]]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          <path d={d} stroke={pal.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r={9} fill={pal.glow} opacity={0.35} />
          <path
            d={star(x, y, 8)}
            fill={pal.glow}
            stroke={pal.ink}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </g>
      ))}
    </g>
  );
}

function SparkBehind({ pal }: Ctx) {
  return (
    <g>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          {/* two pairs: a long upper wing and a short lower one */}
          <path
            d={`M${100 + 8 * s} 158 C${100 + 30 * s} 126 ${100 + 64 * s} 124 ${100 + 66 * s} 142 C${100 + 66 * s} 156 ${100 + 40 * s} 166 ${100 + 8 * s} 164 Z`}
            fill={SPK_WING}
            fillOpacity={0.85}
            stroke={pal.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 8 * s} 168 C${100 + 34 * s} 168 ${100 + 52 * s} 178 ${100 + 50 * s} 192 C${100 + 46 * s} 202 ${100 + 24 * s} 190 ${100 + 8 * s} 172 Z`}
            fill={SPK_WING}
            fillOpacity={0.85}
            stroke={pal.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <path
            d={`M${100 + 12 * s} 160 Q${100 + 40 * s} 144 ${100 + 58 * s} 140 M${100 + 12 * s} 170 Q${100 + 30 * s} 176 ${100 + 44 * s} 188`}
            stroke={pal.ink}
            strokeOpacity={0.3}
            strokeWidth={1.5}
            fill="none"
          />
        </g>
      ))}
      <g data-joint="tail" style={pivot("tail")}>
        <circle data-joint="glow" cx={128} cy={232} r={34} fill={pal.glow} opacity={0.35} />
        {/* a comet tail: the bulb, then the sparkles it sheds */}
        <path
          d="M108 212 C126 206 146 218 144 236 C142 252 124 256 114 246 C106 238 104 224 108 212 Z"
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d="M112 220 Q124 214 136 220"
          stroke={SPK_BODY}
          strokeWidth={4.5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={star(154, 258, 7)}
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d={star(166, 244, 4.5)}
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
        <path
          d={star(146, 274, 4)}
          fill={pal.glow}
          stroke={pal.ink}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        <path d={star(126, 230, 5)} fill={WHITE} />
      </g>
    </g>
  );
}

/* ——— C · Fuzzy: a soft, huggable firefly — answers "some children dislike bugs" ——— */

const FUZ_BODY = "#6a4d82";
const FUZ_HI = "#9677ae";
const FUZ_CORAL = "#f08a6c";
const palFuzzy = palette(FUZ_BODY, "#35253f", "#fbe8d8", "#e2c6ae", {
  eye: "#4a3657",
  glow: "#ffd35a",
  accent: FUZ_CORAL,
  blush: "#f59c8c",
});

/** A scalloped fuzz edge round an ellipse: stroked puffs, then the fill laid over their seams. */
function Fuzz({
  cx,
  cy,
  rx,
  ry,
  n,
  r,
  fill,
  ink,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  n: number;
  r: number;
  fill: string;
  ink: string;
}) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as const;
  });
  return (
    <g>
      {pts.map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={r} fill={fill} stroke={ink} strokeWidth={2.4} />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={`f${i}`} cx={x} cy={y} r={r - 1.3} fill={fill} />
      ))}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />
    </g>
  );
}

function FuzzyHead({ pal }: Ctx) {
  return (
    <g>
      <Fuzz cx={100} cy={100} rx={42} ry={37} n={22} r={8} fill={FUZ_BODY} ink={pal.ink} />
      <path
        d="M62 110 C62 88 80 80 100 80 C120 80 138 88 138 110 C138 130 120 138 100 138 C80 138 62 130 62 110 Z"
        fill={pal.skin}
      />
      {/* a tuft on the crown */}
      <path
        d="M92 64 C90 54 98 50 100 58 C102 48 112 52 108 64"
        fill={FUZ_BODY}
        stroke={pal.ink}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M74 72 Q84 66 94 66"
        stroke={FUZ_HI}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function FuzzyAntennae({ pal }: Ctx) {
  return (
    <g>
      {(
        [
          ["antL", -1],
          ["antR", 1],
        ] as const
      ).map(([j, s]) => {
        const bx = 100 + 14 * s;
        const tx = 100 + 36 * s;
        return (
          <g key={j} data-joint={j} style={pivot(j)}>
            {/* feathery, like a moth's: soft rather than wiry */}
            <path
              d={`M${bx} 64 C${bx + 4 * s} 46 ${tx - 6 * s} 34 ${tx} 26`}
              stroke={pal.ink}
              strokeWidth={2.6}
              fill="none"
              strokeLinecap="round"
            />
            {[0.3, 0.5, 0.7].map((t) => {
              const x = bx + (tx - bx) * t;
              const y = 64 - 38 * t;
              return (
                <path
                  key={t}
                  d={`M${x} ${y} l${-7 * s} -6 M${x} ${y} l${7 * s} 2`}
                  stroke={FUZ_BODY}
                  strokeWidth={3.4}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx={tx} cy={24} r={5} fill={FUZ_CORAL} stroke={pal.ink} strokeWidth={1.8} />
          </g>
        );
      })}
    </g>
  );
}

function FuzzyBehind({ pal }: Ctx) {
  return (
    <g>
      {(
        [
          ["wingL", -1],
          ["wingR", 1],
        ] as const
      ).map(([j, s]) => (
        <g key={j} data-joint={j} style={pivot(j)}>
          {/* short petal wings — flutter without looking like a wasp */}
          <ellipse
            cx={100 + 34 * s}
            cy={160}
            rx={20}
            ry={15}
            transform={`rotate(${-24 * s} ${100 + 34 * s} 160)`}
            fill="#fbe3ef"
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
          <ellipse
            cx={100 + 30 * s}
            cy={180}
            rx={14}
            ry={10}
            transform={`rotate(${20 * s} ${100 + 30 * s} 180)`}
            fill="#fbe3ef"
            fillOpacity={0.9}
            stroke={pal.ink}
            strokeWidth={2.2}
          />
        </g>
      ))}
      <g data-joint="tail" style={pivot("tail")}>
        <circle data-joint="glow" cx={126} cy={234} r={38} fill={pal.glow} opacity={0.35} />
        {/* a round glow-bulb with a fuzzy cuff where it meets the body */}
        <circle cx={126} cy={236} r={22} fill={pal.glow} stroke={pal.ink} strokeWidth={2.5} />
        <Fuzz cx={114} cy={216} rx={9} ry={5} n={7} r={5} fill={FUZ_BODY} ink={pal.ink} />
        <path
          d="M114 232 Q118 224 126 222"
          stroke={WHITE}
          strokeOpacity={0.8}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <path d={star(130, 240, 6)} fill={WHITE} />
      </g>
    </g>
  );
}

function FuzzyRuff({ pal }: Ctx) {
  return <Fuzz cx={100} cy={152} rx={16} ry={4} n={8} r={6} fill={FUZ_BODY} ink={pal.ink} />;
}

export const FIREFLY_VARIANTS: Candidate[] = [
  {
    id: "firefly-lantern",
    kind: "animal",
    label: "Firefly A · Lantern",
    signature: "A lantern for a tail, a rosy helmet, and cream-striped wing cases",
    pitch:
      "The truest to a real firefly: the rosy head shield with two dark spots and the striped wing cases are Photinus markings, turned into a helmet and a cape. Round and sturdy — the hard wing cases hold their shape under a hoodie or raincoat, and the lantern tail reads at 16px.",
    risk: "The closest to a beetle; the helmet has to stay rosy, not red, or it drifts toward a status hue.",
    pal: palLantern,
    body: LAN_BODY,
    face: {
      eyes: "anime",
      eyeY: 108,
      eyeGap: 17,
      mouthY: 126,
      nose: "none",
      brows: true,
      lid: palLantern.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <LanternBehind {...c} />,
    head: (c) => <LanternHead {...c} />,
    top: (c) => <LanternAntennae {...c} />,
    belly: ({ pal }) => (
      <path
        d="M82 176 Q100 180 118 176 M81 190 Q100 194 119 190 M82 204 Q100 208 118 204"
        stroke={pal.skin}
        strokeOpacity={0.55}
        strokeWidth={3}
        fill="none"
      />
    ),
  },
  {
    id: "firefly-spark",
    kind: "animal",
    label: "Firefly B · Spark",
    signature: "A comet tail that sheds sparkles, and star-tipped antennae",
    pitch:
      "The most magical: its ability is made visible — the tail leaves a trail of sparkles and the antennae end in stars, so the name Sparkles is literally on the character. Two pairs of long wings give it the most range in motion; it reads as quick and eager.",
    risk: "The busiest silhouette; the sparkle trail must stay small beside material, and the stars may clash with product ornaments that also use a four-point star.",
    pal: palSpark,
    body: SPK_BODY,
    face: {
      eyes: "anime",
      eyeY: 104,
      eyeGap: 17,
      mouthY: 124,
      nose: "none",
      brows: true,
      lid: palSpark.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <SparkBehind {...c} />,
    head: (c) => <SparkHead {...c} />,
    top: (c) => <SparkAntennae {...c} />,
    belly: ({ pal }) => (
      <path
        d="M86 178 L100 186 L114 178 M86 194 L100 202 L114 194"
        stroke={pal.glow}
        strokeOpacity={0.8}
        strokeWidth={3}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: "firefly-fuzzy",
    kind: "animal",
    label: "Firefly C · Fuzzy",
    signature: "A fuzzy body, feathery antennae and a round glow-bulb tail",
    pitch:
      "The most huggable: fuzz, a crown tuft, a ruff and petal wings take the bug out of the bug, answering the bench's worry that some children dislike insects. It reads as a plush toy, which suits a character a child names.",
    risk: "The fuzz edge is fiddly at 16px and may read as a bumblebee or a moth; the plum body is the darkest on the bench.",
    pal: palFuzzy,
    body: FUZ_BODY,
    face: {
      eyes: "anime",
      eyeY: 108,
      eyeGap: 17,
      mouthY: 126,
      nose: "none",
      brows: false,
      lid: palFuzzy.skin,
    },
    outfit: "bare",
    outfits: OUTFITS,
    behind: (c) => <FuzzyBehind {...c} />,
    head: (c) => <FuzzyHead {...c} />,
    top: (c) => <FuzzyAntennae {...c} />,
    belly: ({ pal }) => (
      <Fuzz cx={100} cy={188} rx={10} ry={15} n={10} r={4.5} fill={pal.skin} ink={pal.ink} />
    ),
    pendant: (c) => <FuzzyRuff {...c} />,
  },
];
