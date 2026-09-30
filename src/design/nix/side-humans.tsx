import type { ReactNode } from "react";

import type { Candidate } from "./candidates";
import { palette } from "./firefly-variants";
import { arcDown, arcUp, EYE_WHITE, line, Orb, roundRect, turnAt, type EyeKit } from "./rig/eyes";
import type { Palette } from "./rig/palette";
import { ADULT, CHIBI } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Human side candidates. Two are inspired by the bright, animated teenage girl of Duolingo's cast
 * (Zari), two by its deadpan, half-lidded one (Lily) — the spirit, not the look: each has its own
 * hair, face and eyes. One of each pair is a girl on the chibi frame, the other a young woman on
 * the adult frame.
 *
 * No outlines. Hair and eyes are each character's own: hair is drawn per character (the head's
 * back and front), not from the shared hair kit, and every character has its own eye kit.
 */

const g2 = (a: ReactNode, b: ReactNode) => (
  <g>
    {a}
    {b}
  </g>
);

const OUTFITS: Candidate["outfits"] = [
  "dungarees",
  "hoodie",
  "raincoat",
  "dress",
  "blazer",
  "winter",
  "party",
];

function human(skin: string, shade: string, hair: string, hairHi: string): Palette {
  return palette(skin, skin, skin, shade, {
    line: "none",
    hair,
    hairHi,
    eye: "#1f1a36",
    top: C.clothes,
    topAlt: "#fff3de",
    bottom: C.deep,
    shoe: C.deep,
    accent: C.accent,
    blush: "#f08f9b",
  });
}

const face = (over: Partial<Candidate["face"]> & { lid: string }): Candidate["face"] => ({
  eyes: "anime",
  eyeY: 106,
  eyeGap: 17,
  mouthY: 127,
  nose: "dot",
  brows: false,
  ...over,
});

/* ——— Juno — bright and animated (Zari-inspired), a girl ——— */

const JUNO_SKIN = "#8a5634";
const JUNO_HAIR = "#4a2e24";
const palJuno = human(JUNO_SKIN, "#6e4127", JUNO_HAIR, "#4a3128");

const CURL_FRINGE = [
  [64, 76, 10],
  [74, 68, 11],
  [86, 64, 11],
  [100, 62, 11],
  [114, 64, 11],
  [126, 68, 11],
  [136, 76, 10],
  [58, 90, 9],
  [142, 90, 9],
] as const;

function JunoBack() {
  return (
    <g fill={JUNO_HAIR}>
      <ellipse cx={100} cy={94} rx={52} ry={48} />
      {/* the high puff of curls */}
      {[
        [100, 30, 26],
        [78, 38, 18],
        [122, 38, 18],
        [88, 18, 16],
        [112, 18, 16],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

function JunoHead() {
  return (
    <g>
      <circle cx={58} cy={110} r={7} fill={JUNO_SKIN} />
      <circle cx={142} cy={110} r={7} fill={JUNO_SKIN} />
      <ellipse cx={100} cy={104} rx={42} ry={40} fill={JUNO_SKIN} />
      <g fill={JUNO_HAIR}>
        {CURL_FRINGE.map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <path d="M62 60 Q100 30 138 60" {...line(C.accent, 7)} />
      <circle cx={57} cy={124} r={5} {...line(C.accent, 2.2)} />
      <circle cx={143} cy={124} r={5} {...line(C.accent, 2.2)} />
    </g>
  );
}

/** Juno: big round eyes nearly filled by a warm brown iris, two shines, a bold lash line with two
 *  lashes, and thick, very mobile brows. */
const junoEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const lash = (bx: number, by: number) => (
    <path
      d={`M${bx} ${by} l${s * 3.6} -2.6 M${bx - s * 2} ${by - 2.4} l${s * 2.6} -3.2`}
      {...line(ink, 2)}
    />
  );
  const brow = (raise: number, tilt: number) => {
    const by = y - 17 - raise;
    return (
      <path
        d={`M${x - 7} ${by + 1.5} Q${x} ${by - 4} ${x + 7} ${by + 1.5}`}
        {...line(JUNO_HAIR, 4.2)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (top = 0, tilt = 0, bottom = 0, k = 1, extra = false) => {
    const rx = 8 * k;
    const ry = 9.6 * k;
    return (
      <g>
        <Orb
          id={id}
          x={x}
          y={y}
          rx={rx}
          ry={ry}
          s={s}
          fill={EYE_WHITE}
          lid={{ top, tilt, bottom, color: JUNO_SKIN }}
          edge={{ color: ink, width: 1.8 }}
        >
          <circle cx={x + dx} cy={y + 1 + dy} r={6.4 * k} fill="#5a3322" />
          <circle cx={x + dx} cy={y + 1 + dy} r={3 * k} fill={ink} />
          <circle cx={x - 2.4 + dx} cy={y - 2.4 + dy} r={2.4 * k} fill={EYE_WHITE} />
          <circle cx={x + 2.6 + dx} cy={y + 3.4 + dy} r={1.1} fill={EYE_WHITE} />
          {extra && <circle cx={x + 2.8 + dx} cy={y - 3 + dy} r={1.4} fill={EYE_WHITE} />}
        </Orb>
        {top === 0 && (
          <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1}`} {...line(ink, 3)} />
        )}
        {lash(x + s * (rx - 1.5), top === 0 ? y - ry * 0.55 : y - ry + 2 * ry * top)}
      </g>
    );
  };
  const shut = (d: string) => (
    <g>
      <path d={d} {...line(ink, 3)} />
      {lash(x + s * 6, y)}
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(open(0.1, 0, 0.42), brow(3, 0));
    case "delighted":
      return g2(open(0, 0, 0, 1.12, true), brow(7, 0));
    case "curious":
      return g2(open(), s === 1 ? brow(7, -10) : brow(0, 4));
    case "thinking":
      return g2(open(0.3), s === -1 ? brow(6, 10) : brow(-1, -8));
    case "focused":
      return g2(open(0.42, -8), brow(-3, -16));
    case "worried":
      return g2(open(0.12, 14, 0, 1, true), brow(2, 20));
    case "oops":
      return g2(shut(`M${x + s * 6} ${y - 5} L${x - s * 5} ${y} L${x + s * 6} ${y + 5}`), brow(3, 18));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y, 7, 4.5)), brow(-1, -4)) : g2(open(), brow(3, 0));
    default:
      return g2(open(), brow(0, 0));
  }
};

/* ——— Amara — bright and animated (Zari-inspired), a young woman ——— */

const AMARA_SKIN = "#5e3a26";
const AMARA_HAIR = "#40291f";
const palAmara = human(AMARA_SKIN, "#4a2c1c", AMARA_HAIR, "#3a2a24");

function AmaraBack() {
  return (
    <g>
      {/* box braids falling behind the shoulders, each with a bead */}
      {[-1, 1].flatMap((s) =>
        [0, 1, 2, 3].map((i) => {
          const x = 100 + s * (40 + i * 6);
          return (
            <g key={`${s}${i}`}>
              <path
                d={`M${x} 86 C${x + s * 6} 130 ${x + s * 2} 170 ${x + s * 4} ${200 + i * 6}`}
                {...line(AMARA_HAIR, 8)}
              />
              <circle cx={x + s * 4} cy={206 + i * 6} r={4.6} fill={C.accent} />
            </g>
          );
        }),
      )}
      <ellipse cx={100} cy={90} rx={46} ry={44} fill={AMARA_HAIR} />
      <circle cx={100} cy={40} r={22} fill={AMARA_HAIR} />
      <ellipse cx={100} cy={58} rx={17} ry={4.5} fill={C.accent} />
    </g>
  );
}

function AmaraHead() {
  return (
    <g>
      <circle cx={60} cy={110} r={7} fill={AMARA_SKIN} />
      <circle cx={140} cy={110} r={7} fill={AMARA_SKIN} />
      <ellipse cx={100} cy={104} rx={40} ry={42} fill={AMARA_SKIN} />
      <path
        d="M58 98 C56 60 80 50 100 50 C120 50 144 60 142 98 C136 78 120 68 100 68 C80 68 64 78 58 98 Z"
        fill={AMARA_HAIR}
      />
      <path
        d="M80 56 L76 70 M92 52 L90 67 M108 52 L110 67 M120 56 L124 70"
        {...line("#3a2a24", 1.6)}
      />
      <circle cx={60} cy={124} r={6} {...line(C.accent, 2.4)} />
      <circle cx={140} cy={124} r={6} {...line(C.accent, 2.4)} />
    </g>
  );
}

/** Amara: almond eyes, lifted at the outer corner, a winged liner, a hazel iris, and high arched
 *  brows. */
const amaraEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const almond = (k0: number) => {
    const k = k0 * 1.3;
    return (
    `M${x - 9 * s * k} ${y + 1} Q${x - 2 * s * k} ${y - 9 * k} ${x + 9 * s * k} ${y - 3} Q${x + 3 * s * k} ${y + 7 * k} ${x - 9 * s * k} ${y + 1} Z`
    );
  };
  const brow = (raise: number, tilt: number) => {
    const by = y - 17 - raise;
    return (
      <path
        d={`M${x - 9 * s} ${by + 3} Q${x - s} ${by - 5} ${x + 10 * s} ${by + 1}`}
        {...line(AMARA_HAIR, 3)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (top = 0, tilt = 0, bottom = 0, k0 = 1, iris = 6.4) => {
    const k = k0 * 1.3;
    return (
    <g>
      <Orb
        id={id}
        x={x}
        y={y}
        rx={12}
        ry={9}
        s={s}
        fill={EYE_WHITE}
        shape={almond(k)}
        lid={{ top, tilt, bottom, color: AMARA_SKIN }}
        edge={{ color: ink, width: 1.6 }}
      >
        <circle cx={x + dx} cy={y - 1 + dy} r={iris} fill="#6b3f22" />
        <circle cx={x + dx} cy={y - 1 + dy} r={3} fill={ink} />
        <circle cx={x - 2.2 + dx} cy={y - 3.4 + dy} r={2} fill={EYE_WHITE} />
      </Orb>
      {top === 0 && (
        <path
          d={`M${x - 9 * s * k} ${y + 1} Q${x - 2 * s * k} ${y - 9 * k} ${x + 9 * s * k} ${y - 3} l${s * 4} -3`}
          {...line(ink, 2.8)}
        />
      )}
    </g>
    );
  };
  const shut = (d: string) => (
    <g>
      <path d={d} {...line(ink, 3)} />
      <path d={`M${x + s * 9} ${y + 1} l${s * 4} -3`} {...line(ink, 2.6)} />
    </g>
  );
  switch (mood) {
    case "happy":
      return g2(shut(arcUp(x, y, 9, 4.5)), brow(3, 0));
    case "delighted":
      return g2(open(0, 0, 0, 1.12, 7), brow(6, 0));
    case "curious":
      return g2(open(), s === 1 ? brow(6, -10) : brow(0, 4));
    case "thinking":
      return g2(open(0.3), s === -1 ? brow(5, 10) : brow(-1, -6));
    case "focused":
      return g2(open(0.4, -6), brow(-2, -12));
    case "worried":
      return g2(open(0.1, 12), brow(1, 16));
    case "oops":
      return g2(shut(arcDown(x, y, 8.5, 3.5)), brow(2, 14));
    case "wink":
      return s === 1 ? g2(shut(arcUp(x, y, 9, 4.5)), brow(0, 0)) : g2(open(), brow(3, 0));
    default:
      return g2(open(), brow(0, 0));
  }
};

/* ——— Wren — deadpan (Lily-inspired), a girl ——— */

const WREN_SKIN = "#f2d6c4";
const WREN_SHADE = "#e0b9a3";
const palWren = human(WREN_SKIN, WREN_SHADE, C.deep, C.primary);

function WrenBack() {
  return (
    <path
      d="M48 146 L48 96 C48 58 72 44 100 44 C128 44 152 58 152 96 L152 146 Q126 150 100 148 Q74 150 48 146 Z"
      fill={C.deep}
    />
  );
}

function WrenHead() {
  return (
    <g>
      <ellipse cx={100} cy={106} rx={40} ry={40} fill={WREN_SKIN} />
      {/* the blunt fringe, down to the brows, and the straight side locks */}
      <path d="M58 88 C58 62 78 52 100 52 C122 52 142 62 142 88 Z" fill={C.deep} />
      <path d="M56 84 L70 84 L68 146 Q61 148 54 146 Z" fill={C.deep} />
      <path d="M144 84 L130 84 L132 146 Q139 148 146 146 Z" fill={C.deep} />
      <rect x={120} y={80} width={14} height={5} rx={2.5} fill={C.accent} transform="rotate(-18 127 82)" />
    </g>
  );
}

/** Wren: a heavy, flat top lid at rest — deadpan — over a small blue iris, a faint line under each
 *  eye, and thin straight brows. Her expressions are small, so a wide-open eye is her big one. */
const wrenEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 15 - raise;
    return (
      <path
        d={`M${x - 7} ${by} L${x + 7} ${by}`}
        {...line(C.deep, 2.4)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (top: number, tilt = 0, bottom = 0, k = 1) => (
    <g>
      <Orb
        id={id}
        x={x}
        y={y}
        rx={8}
        ry={8.5 * k}
        s={s}
        fill={EYE_WHITE}
        lid={{ top, tilt, bottom, color: WREN_SKIN }}
        edge={{ color: ink, width: 1.8 }}
      >
        <circle cx={x + dx} cy={y + 1 + dy} r={4} fill={C.primary} />
        <circle cx={x + dx} cy={y + 1 + dy} r={1.8} fill={ink} />
        <circle cx={x - 1.4 + dx} cy={y - 0.6 + dy} r={1.2} fill={EYE_WHITE} />
      </Orb>
      {top === 0 && (
        <path d={`M${x - 8} ${y - 1} A8 ${8.5 * k} 0 0 1 ${x + 8} ${y - 1}`} {...line(ink, 2.6)} />
      )}
      <path d={`M${x - 5} ${y + 11} Q${x} ${y + 12.5} ${x + 5} ${y + 11}`} {...line(WREN_SHADE, 1.4)} />
    </g>
  );
  const flat = <path d={`M${x - 7} ${y} L${x + 7} ${y}`} {...line(ink, 3)} />;
  switch (mood) {
    case "happy":
      return g2(open(0.4, 0, 0.35), brow(1, 0));
    case "delighted":
      return g2(open(0.06, 0, 0, 1.06), brow(5, 0));
    case "curious":
      return g2(open(0.3), s === 1 ? brow(6, -8) : brow(0, 0));
    case "thinking":
      return g2(open(0.5), s === -1 ? brow(2, 6) : brow(0, -4));
    case "focused":
      return g2(open(0.58), brow(-2, -8));
    case "worried":
      return g2(open(0.28, 12), brow(1, 14));
    case "oops":
      return g2(flat, brow(1, 10));
    case "wink":
      return s === 1 ? g2(flat, brow(-1, 0)) : g2(open(0.45), brow(1, 0));
    default:
      return g2(open(0.45), brow(0, 0));
  }
};

/* ——— Sloane — deadpan (Lily-inspired), a young woman ——— */

const SLOANE_SKIN = "#d9a88a";
const SLOANE_HAIR = "#3d3947";
const palSloane = human(SLOANE_SKIN, "#c08e72", SLOANE_HAIR, "#46424f");

function SloaneBack() {
  return (
    <path
      d="M52 100 C48 56 76 44 100 44 C124 44 152 56 148 100 L152 190 Q126 200 100 196 Q74 200 48 190 Z"
      fill={SLOANE_HAIR}
    />
  );
}

function SloaneHead() {
  return (
    <g>
      <ellipse cx={100} cy={106} rx={39} ry={41} fill={SLOANE_SKIN} />
      {/* a deep side part, swept across the forehead, with a streak of the product's colour */}
      <path
        d="M56 112 C50 66 76 46 104 48 C128 50 146 64 146 100 C140 80 130 70 118 68 C100 76 80 86 60 114 Z"
        fill={SLOANE_HAIR}
      />
      <path d="M68 94 C82 78 100 68 116 64" {...line(C.primary, 5)} />
    </g>
  );
}

/** Sloane: narrow, squared eyes with a thick liner, glancing aside at rest, and angled brows —
 *  one always a little raised. */
const sloaneEyes: EyeKit = ({ mood, s, x, y, look, id, pal: p }) => {
  const ink = p.ink;
  const [lx, ly] = look;
  const brow = (raise: number, tilt: number) => {
    const by = y - 13 - raise;
    return (
      <path
        d={`M${x - 7 * s} ${by + 1} L${x + 2 * s} ${by - 2.5} L${x + 7 * s} ${by + 0.5}`}
        {...line(SLOANE_HAIR, 2.8)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };
  const open = (top = 0, tilt = 0, bottom = 0, k = 1, glance = 1.8) => {
    const h = 9 * k;
    return (
      <g>
        <Orb
          id={id}
          x={x}
          y={y}
          rx={7.5}
          ry={h / 2}
          s={s}
          fill={EYE_WHITE}
          shape={roundRect(x, y, 15, h, 4.2)}
          lid={{ top, tilt, bottom, color: SLOANE_SKIN }}
          edge={{ color: ink, width: 2 }}
        >
          <circle cx={x + glance + lx} cy={y + 0.5 + ly} r={3.8 * k} fill={C.deep} />
          <circle cx={x + glance + lx} cy={y + 0.5 + ly} r={1.7} fill={ink} />
          <circle cx={x + glance - 1.3 + lx} cy={y - 1 + ly} r={1.1} fill={EYE_WHITE} />
        </Orb>
        {top === 0 && (
          <path
            d={`M${x - s * 7.5} ${y - h / 2 + 0.5} L${x + s * 7.5} ${y - h / 2 + 0.5} l${s * 3} -2.5`}
            {...line(ink, 2.6)}
          />
        )}
      </g>
    );
  };
  const shut = (d: string) => (
    <g>
      <path d={d} {...line(ink, 2.8)} />
      <path d={`M${x + s * 7} ${y + 1} l${s * 3} -2.5`} {...line(ink, 2.4)} />
    </g>
  );
  const skeptic = s === 1 ? 3 : 0;
  switch (mood) {
    case "happy":
      return g2(open(0, 0, 0.45), brow(2 + skeptic, 0));
    case "delighted":
      return g2(open(0, 0, 0, 1.3, 0), brow(6, 0));
    case "curious":
      return g2(open(), s === 1 ? brow(8, -10) : brow(0, 4));
    case "thinking":
      return g2(open(0.3, 0, 0, 1, 0), s === -1 ? brow(4, 8) : brow(-1, -6));
    case "focused":
      return g2(open(0.45, -4, 0, 1, 0), brow(-2, -10));
    case "worried":
      return g2(open(0.1, 12, 0, 1, 0), brow(1, 16));
    case "oops":
      return g2(shut(`M${x - 7} ${y + 1} Q${x} ${y + 4} ${x + 7} ${y + 1}`), brow(2, 12));
    case "wink":
      return s === 1 ? g2(shut(`M${x - 7} ${y} L${x + 7} ${y}`), brow(0, 0)) : g2(open(), brow(2, 0));
    default:
      return g2(open(), brow(skeptic, 0));
  }
};

/* ——— The four ——— */

export const SIDE_HUMANS: Candidate[] = [
  {
    id: "side-juno",
    kind: "human",
    frame: CHIBI,
    outline: false,
    hands: "mitten",
    label: "Juno",
    signature: "A high puff of curls, a headband and hoops — she cartwheels",
    pitch:
      "Inspired by Zari's brightness: quick, warm, all motion. A girl with a high puff of curls, a curly fringe and a headband in the accent. Her ability is Cartwheel: she arrives, and leaves, with a cartwheel. Big round eyes almost filled by a warm brown iris, and thick brows that do a lot of the talking.",
    risk: "Energy must not make the product loud: one cartwheel, never a celebration that grows. Too close to Zari if she wears Zari's colours or hair.",
    pal: palJuno,
    body: C.clothes,
    face: face({ lid: JUNO_SKIN, kit: junoEyes }),
    outfit: "dungarees",
    outfits: OUTFITS,
    headBack: () => <JunoBack />,
    head: () => <JunoHead />,
  },
  {
    id: "side-amara",
    kind: "human",
    frame: ADULT,
    outline: false,
    hands: "mitten",
    label: "Amara",
    signature: "Box braids up in a bun, beads, hoops — she looks ahead with a telescope",
    pitch:
      "Inspired by Zari, grown up: a young woman with box braids gathered into a high bun, beads at the ends in the accent. Her ability is Telescope: she opens a telescope and looks at what is coming next. Almond eyes with a winged liner and high arched brows: warm, confident, expressive.",
    risk: "Seeing ahead must never claim what the material holds; it only points at what is next.",
    pal: palAmara,
    body: C.clothes,
    face: face({ lid: AMARA_SKIN, kit: amaraEyes }),
    outfit: "blazer",
    outfits: OUTFITS,
    headBack: () => <AmaraBack />,
    head: () => <AmaraHead />,
  },
  {
    id: "side-wren",
    kind: "human",
    frame: CHIBI,
    outline: false,
    hands: "mitten",
    label: "Wren",
    signature: "A blunt bob in the product's colour, a heavy fringe, a flat gaze — headphones",
    pitch:
      "Inspired by Lily's deadpan: a girl with a blunt bob dyed in the product's deep blue, a fringe down to her brows and a hair clip in the accent. Her ability is Headphones: she puts them on and everything goes quiet, the one character for focus. Her lids sit heavy and flat at rest, so a wide-open eye is her big reaction.",
    risk: "Deadpan must never read as disappointed at an incorrect answer; her gentle face is the soft one, not the flat one.",
    pal: palWren,
    body: C.clothes,
    face: face({ eyeY: 108, eyeGap: 16, mouthY: 128, lid: WREN_SKIN, kit: wrenEyes }),
    outfit: "hoodie",
    outfits: OUTFITS,
    headBack: () => <WrenBack />,
    head: () => <WrenHead />,
  },
  {
    id: "side-sloane",
    kind: "human",
    frame: ADULT,
    outline: false,
    hands: "mitten",
    label: "Sloane",
    signature: "Long dark hair with a deep side part and a streak of blue — she sends paper planes",
    pitch:
      "Inspired by Lily, grown up: dry, unhurried, quietly kind. A young woman with long straight hair swept across her forehead, a streak in the product's primary. Her ability is Paper plane: she folds a note and sends it where it needs to go. Narrow squared eyes with a thick liner, glancing aside, one brow always a little raised.",
    risk: "A note is fixed copy beside the figure, never text drawn on the plane.",
    pal: palSloane,
    body: C.clothes,
    face: face({ eyeY: 108, mouthY: 128, lid: SLOANE_SKIN, kit: sloaneEyes }),
    outfit: "raincoat",
    outfits: OUTFITS,
    headBack: () => <SloaneBack />,
    head: () => <SloaneHead />,
  },
];
