import type { ReactNode } from "react";

import type { Candidate, Ctx } from "./candidates";
import {
  arcDown,
  arcUp,
  chevron,
  EYE_WHITE,
  line,
  OpenMouth,
  Orb,
  TONGUE_PINK,
  turnAt,
  type EyeArgs,
  type EyeKit,
  type MouthKit,
} from "./rig/eyes";
import type { Mood } from "./rig/face";
import { curve, dMouth, Puffs, sides, Taper, wave } from "./side-candidates";
import { BIG, face, g2, human, MOUTH_IN, OUTFITS } from "./side-humans";
import { C } from "./theme";

/**
 * More of Lulu's line: tiny girls with big heads (`BIG`), huge coloured eyes and a rubbery gag face
 * for every mood. What they share is the build and the spirit; what each owns is her hair (her
 * silhouette), her eyes, her mouth and her ability — something a child naturally does.
 *
 * The eyes are built from one recipe (`bigEyes`) so the line reads as a family, but every girl sets
 * her own shape, iris, shine, lashes and brows, and replaces the moods that are her gags.
 */

/* ——— The eye recipe ——— */

type Shine = "dots" | "oval" | "sparkle" | "twin";
type Lash = "flick" | "three" | "thick" | "lower";

type Recipe = {
  skin: string;
  iris: string;
  /** A lighter band in the lower iris. */
  glow?: string;
  rx: number;
  ry: number;
  shine: Shine;
  lash: Lash;
  brow: { color: string; w: number; kind: "arc" | "dash" | "dot" };
  /** The whole eye tipped so the outer corner sits lower: a softer, sadder-sweet look. */
  droop?: number;
};

type Tools = {
  open: (o?: { k?: number; top?: number; bottom?: number; tilt?: number; iris?: number; extra?: boolean; px?: number; py?: number }) => ReactNode;
  brow: (raise: number, tilt: number, drift?: number) => ReactNode;
  shut: (d: string, w?: number) => ReactNode;
};

type Gags = Partial<Record<Mood, (a: EyeArgs, t: Tools) => ReactNode>>;

function bigEyes(r: Recipe, gags: Gags = {}): EyeKit {
  return (a) => {
    const { mood, s, x, y, look, id, pal: p } = a;
    const ink = p.ink;
    const [dx, dy] = look;
    const brow: Tools["brow"] = (raise, tilt, drift = 0) => {
      const by = y - r.ry - 7 - raise;
      const bx = x - s * drift;
      if (r.brow.kind === "dot") return <ellipse cx={bx} cy={by} rx={3.2} ry={2.4} fill={r.brow.color} />;
      const d =
        r.brow.kind === "dash"
          ? `M${bx - 5} ${by} L${bx + 5} ${by}`
          : `M${bx - 6.5} ${by + 1.5} Q${bx} ${by - 2.5} ${bx + 6.5} ${by + 1.5}`;
      return <path d={d} {...line(r.brow.color, r.brow.w)} transform={turnAt(s, tilt, bx, by)} />;
    };
    const lashes = (bx: number, by: number): ReactNode => {
      switch (r.lash) {
        case "three":
          return <path d={`M${bx} ${by} l${s * 4} -2.4 M${bx - s * 1.2} ${by - 2.6} l${s * 3.4} -3.6 M${bx - s * 3.6} ${by - 4.6} l${s * 2} -3.8`} {...line(ink, 1.8)} />;
        case "lower":
          return <path d={`M${x + s * 5} ${y + r.ry * 0.85} l${s * 2.4} 2.4 M${x + s * 7.8} ${y + r.ry * 0.6} l${s * 2.8} 1.4`} {...line(ink, 1.6)} />;
        case "flick":
          return <path d={`M${bx} ${by} l${s * 3.4} -3`} {...line(ink, 2.6)} />;
        default:
          return null;
      }
    };
    const open: Tools["open"] = ({ k = 1, top = 0, bottom = 0, tilt = 0, iris = 1, extra = false, px = 0, py = 0 } = {}) => {
      const rx = r.rx * k;
      const ry = r.ry * k;
      const ir = Math.min(rx, ry) * 0.74 * iris;
      const cx = x + dx + px;
      const cy = y + 1 + dy + py;
      const shine = (() => {
        switch (r.shine) {
          case "oval":
            return <ellipse cx={cx - ir * 0.38} cy={cy - ir * 0.4} rx={ir * 0.36} ry={ir * 0.48} fill={EYE_WHITE} />;
          case "twin":
            return (
              <g fill={EYE_WHITE}>
                <circle cx={cx - ir * 0.4} cy={cy - ir * 0.38} r={ir * 0.34} />
                <circle cx={cx + ir * 0.34} cy={cy - ir * 0.44} r={ir * 0.2} />
              </g>
            );
          case "sparkle":
            return (
              <g fill={EYE_WHITE}>
                <circle cx={cx - ir * 0.38} cy={cy - ir * 0.38} r={ir * 0.34} />
                <circle cx={cx + ir * 0.44} cy={cy + ir * 0.4} r={ir * 0.16} />
                <circle cx={cx + ir * 0.38} cy={cy - ir * 0.52} r={ir * 0.12} />
                <circle cx={cx - ir * 0.5} cy={cy + ir * 0.46} r={ir * 0.1} />
              </g>
            );
          default:
            return (
              <g fill={EYE_WHITE}>
                <circle cx={cx - ir * 0.38} cy={cy - ir * 0.36} r={ir * 0.36} />
                <circle cx={cx + ir * 0.42} cy={cy + ir * 0.48} r={ir * 0.17} />
              </g>
            );
        }
      })();
      const edgeY = top === 0 ? y - ry * 0.5 : y - ry + 2 * ry * top;
      return (
        <g transform={r.droop ? `rotate(${-s * r.droop} ${x} ${y})` : undefined}>
          <Orb id={id} x={x} y={y} rx={rx} ry={ry} s={s} fill={EYE_WHITE} lid={{ top, bottom, tilt, color: r.skin }} edge={{ color: ink, width: r.lash === "thick" ? 2.4 : 1.8 }}>
            <circle cx={cx} cy={cy} r={ir} fill={r.iris} />
            {r.glow && ir > 3 && <ellipse cx={cx} cy={cy + ir * 0.5} rx={ir * 0.72} ry={ir * 0.4} fill={r.glow} />}
            <circle cx={cx} cy={cy} r={Math.min(ir * 0.46, 3.4)} fill={ink} />
            {ir > 3 && shine}
            {extra && <circle cx={cx + ir * 0.1} cy={cy + ir * 0.62} r={ir * 0.13} fill={EYE_WHITE} />}
          </Orb>
          {top === 0 && (
            <path d={`M${x - rx} ${y - 1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - 1}`} {...line(ink, r.lash === "thick" ? 3.8 : 3)} />
          )}
          {lashes(x + s * (rx - 1), edgeY)}
        </g>
      );
    };
    const shut: Tools["shut"] = (d, w = 3.4) => <path d={d} {...line(ink, w)} />;
    const t = { open, brow, shut };
    const gag = gags[mood];
    if (gag) return gag(a, t);
    switch (mood) {
      case "happy":
        return g2(shut(arcUp(x, y, r.rx * 0.82, 5)), brow(3, 0));
      case "delighted":
        return g2(open({ k: 1.1, iris: 1.08, extra: true }), brow(7, 0));
      case "curious":
        return g2(open({ k: 1.04 }), s === 1 ? brow(7, -10) : brow(0, 3));
      case "thinking":
        return g2(open({ top: 0.36, px: 2.4, py: -1.6 }), s === -1 ? brow(5, 10) : brow(-1, -6));
      case "focused":
        return g2(open({ top: 0.4, tilt: -8 }), brow(-3, -14, 1));
      case "worried":
        return g2(open({ k: 1.04, top: 0.08, tilt: 14, iris: 0.8, extra: true }), brow(3, 18, -1));
      case "oops":
        return g2(shut(chevron(x, y, s, 6.5, 6)), brow(3, 14));
      case "wink":
        return s === 1 ? g2(shut(arcUp(x, y, r.rx * 0.82, 5)), brow(0, 0)) : g2(open(), brow(3, 0));
      default:
        return g2(open(), brow(0, 0));
    }
  };
}

/* ——— Suki: navy low bunches with pompom ties; she whistles ——— */

const SUKI_SKIN = "#f6dccb";
const SUKI_HAIR = "#3d4a78";
const palSuki = human(SUKI_SKIN, "#e6bca6", SUKI_HAIR, "#5a6aa0");

function SukiBack() {
  return (
    <g>
      {sides.map(([side, s]) => (
        <g key={side}>
          <ellipse cx={100 + s * 52} cy={136} rx={13} ry={18} transform={`rotate(${s * -18} ${100 + s * 52} 136)`} fill={SUKI_HAIR} />
          <circle cx={100 + s * 46} cy={118} r={6.5} fill={C.accent} />
        </g>
      ))}
      <path d="M52 128 C44 70 70 46 100 46 C130 46 156 70 148 128 Q124 136 100 134 Q76 136 52 128 Z" fill={SUKI_HAIR} />
    </g>
  );
}

function SukiHead() {
  return (
    <g>
      <ellipse cx={100} cy={108} rx={42} ry={40} fill={SUKI_SKIN} />
      <path d="M58 92 C58 62 78 52 100 52 C122 52 142 62 142 92 Z" fill={SUKI_HAIR} />
      <path d="M56 88 L68 88 L66 124 Q60 126 56 122 Z" fill={SUKI_HAIR} />
      <path d="M144 88 L132 88 L134 124 Q140 126 144 122 Z" fill={SUKI_HAIR} />
    </g>
  );
}

/** Suki: round eyes, a rose iris with a pale band below, three lashes. Startled, the pupils go to
 *  pinpricks in wide white; whistling, she shuts her eyes, content. */
const sukiEyes = bigEyes(
  { skin: SUKI_SKIN, iris: "#c9567a", glow: "#eaa0b6", rx: 9.8, ry: 11, shine: "dots", lash: "three", brow: { color: SUKI_HAIR, w: 2.4, kind: "arc" } },
  {
    curious: ({ x, y, s }, t) => g2(t.shut(arcDown(x, y, 7, 3.4), 3.2), t.brow(4, s === 1 ? -6 : 6)),
    happy: ({ x, y, s, pal: p }, t) =>
      g2(
        g2(t.shut(arcUp(x, y, 8, 5)), <path d={`M${x + s * 7.6} ${y + 1.6} l${s * 3.6} -1.6 M${x + s * 6.6} ${y - 1.6} l${s * 3} -3`} {...line(p.ink, 1.8)} />),
        t.brow(3, 0),
      ),
    oops: ({ x, y }, t) => g2(t.shut(`M${x - 5.5} ${y - 5.5} L${x + 5.5} ${y + 5.5} M${x + 5.5} ${y - 5.5} L${x - 5.5} ${y + 5.5}`), t.brow(3, 14)),
    worried: ({ x, y, s, pal: p }, t) =>
      g2(
        <g>
          <ellipse cx={x} cy={y} rx={9.8} ry={11.6} fill={EYE_WHITE} />
          <circle cx={x} cy={y + 1} r={2} fill={p.ink} />
          <path d={`M${x - 9.8} ${y - 1} A9.8 11.6 0 0 1 ${x + 9.8} ${y - 1}`} {...line(p.ink, 2.6)} />
        </g>,
        t.brow(5, s === 1 ? 20 : 20),
      ),
  },
);

/** Suki: a small cat's “v” at rest; she whistles through a round pucker. */
const sukiMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 10, 8)} fill={MOUTH_IN} tongue={[100, y + 11, 5, 3]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 2, 13, 12)} fill={MOUTH_IN} teeth={[88, y - 3, 24, 3.4]} tongue={[100, y + 15, 6, 3.8]} />;
    case "curious":
      return g2(<ellipse cx={101} cy={y + 2} rx={4} ry={4} fill="#e27d92" />, <circle cx={101} cy={y + 2} r={1.8} fill={MOUTH_IN} />);
    case "thinking":
      return <path d={`M95 ${y + 2} L101 ${y} L107 ${y + 1}`} {...line(ink, 2.4)} />;
    case "focused":
      return <path d={`M96 ${y + 1} L104 ${y + 1}`} {...line(ink, 2.4)} />;
    case "worried":
      return <OpenMouth d={`M95 ${y + 4} Q100 ${y - 2} 105 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "oops":
      return g2(<path d={wave(y + 1, 7, 2.6)} {...line(ink, 2.4)} />, <ellipse cx={103} cy={y + 5} rx={2.4} ry={2.6} fill={TONGUE_PINK} />);
    case "wink":
      return <OpenMouth d={dMouth(y, 8, 6, 102)} fill={MOUTH_IN} tongue={[102, y + 8, 3.6, 2.4]} />;
    default:
      return <path d={`M95 ${y} L100 ${y + 3} L105 ${y}`} {...line(ink, 2.4)} />;
  }
};

/* ——— Rue: long plum hair with a blunt fringe and hime side-locks; she pouts ——— */

const RUE_SKIN = "#f1cdb4";
const RUE_HAIR = "#7a4a86";
const palRue = human(RUE_SKIN, "#ddb096", RUE_HAIR, "#9a6aa6");

function RueBack() {
  return <path d="M52 100 C48 56 76 44 100 44 C124 44 152 56 148 100 L152 190 Q100 198 48 190 Z" fill={RUE_HAIR} />;
}

function RueHead() {
  return (
    <g>
      <ellipse cx={100} cy={108} rx={41} ry={40} fill={RUE_SKIN} />
      <path d="M58 88 C58 60 78 50 100 50 C122 50 142 60 142 88 Z" fill={RUE_HAIR} />
      <rect x={55} y={84} width={13} height={58} fill={RUE_HAIR} />
      <rect x={132} y={84} width={13} height={58} fill={RUE_HAIR} />
      <path d="M60 62 Q100 34 140 62" {...line(C.accent, 5)} />
    </g>
  );
}

/** Rue: soft eyes whose outer corners droop, with a gold iris and a heavy lash line. Pouting, she
 *  side-eyes you; startled, her eyes go round with one big shine. */
const rueEyes = bigEyes(
  { skin: RUE_SKIN, iris: "#c9962a", glow: "#e8c46a", rx: 9.6, ry: 10.2, shine: "oval", lash: "thick", brow: { color: RUE_HAIR, w: 2.6, kind: "arc" }, droop: 8 },
  {
    focused: (_a, t) => g2(t.open({ top: 0.46, px: 3.6 }), t.brow(-2, -12)),
    happy: ({ x, y, s }, t) => g2(<g transform={`rotate(${-s * 12} ${x} ${y})`}>{t.shut(arcUp(x, y, 8, 4.4))}</g>, t.brow(2, 6)),
    oops: ({ x, y, s, pal: p }, t) =>
      g2(g2(t.shut(`M${x - 7} ${y} L${x + 7} ${y}`, 3.6), <path d={`M${x + s * 7} ${y} l${s * 3} -2.6`} {...line(p.ink, 2.4)} />), t.brow(1, 16)),
  },
);

/** Rue: a small soft mouth; her pout pushes her lips out and puffs both cheeks. */
const rueMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const lip = "#c9607a";
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 9, 7)} fill={MOUTH_IN} tongue={[100, y + 10, 4.5, 3]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 2, 12, 11)} fill={MOUTH_IN} tongue={[100, y + 13, 6, 3.6]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.6} ry={3.2} fill={ink} />;
    case "thinking":
      return <path d={curve(y + 1, 4, 2, 104)} {...line(ink, 2.4)} />;
    case "focused":
      return (
        <g>
          {/* the pout: cheeks puffed past the face, lips pushed out */}
          <ellipse cx={62} cy={120} rx={10} ry={11} fill={RUE_SKIN} />
          <ellipse cx={138} cy={120} rx={10} ry={11} fill={RUE_SKIN} />
          <ellipse cx={100} cy={y + 2} rx={4.6} ry={3.6} fill={lip} />
          <path d={`M96 ${y + 2} L104 ${y + 2}`} {...line(MOUTH_IN, 1.2)} />
        </g>
      );
    case "worried":
      return <path d={wave(y + 2, 6, 2.4)} {...line(ink, 2.4)} />;
    case "oops":
      return g2(<path d={curve(y, 6, 3)} {...line(ink, 2.4)} />, <ellipse cx={103} cy={y + 4.6} rx={2.4} ry={2.6} fill={TONGUE_PINK} />);
    case "wink":
      return <path d={`M93 ${y} Q100 ${y + 6} 108 ${y - 2}`} {...line(ink, 2.4)} />;
    default:
      return <path d={curve(y, 5, 3.4)} {...line(ink, 2.4)} />;
  }
};

/* ——— Momo: a cloud of strawberry curls and a little beret; she gets the giggles ——— */

const MOMO_SKIN = "#fbe3d4";
const MOMO_HAIR = "#e0835c";
const palMomo = human(MOMO_SKIN, "#efc2ac", MOMO_HAIR, "#f0a27e");

const CURL_RING = Array.from({ length: 14 }, (_, i) => {
  const a = ((150 + i * 18.5) * Math.PI) / 180;
  return [100 + Math.cos(a) * 50, 100 + Math.sin(a) * 48, 15] as const;
});

function MomoBack() {
  return (
    <g>
      <Puffs at={CURL_RING} fill={MOMO_HAIR} />
      <ellipse cx={100} cy={98} rx={48} ry={48} fill={MOMO_HAIR} />
    </g>
  );
}

function MomoHead() {
  return (
    <g>
      <ellipse cx={100} cy={110} rx={42} ry={39} fill={MOMO_SKIN} />
      <Puffs
        at={[
          [66, 82, 12],
          [80, 72, 12],
          [96, 68, 12],
          [112, 70, 12],
          [126, 76, 12],
          [138, 88, 10],
          [60, 96, 9],
        ]}
        fill={MOMO_HAIR}
      />
      <ellipse cx={82} cy={50} rx={28} ry={10} transform="rotate(-14 82 50)" fill={C.deep} />
      <circle cx={80} cy={40} r={4} fill={C.deep} />
    </g>
  );
}

/** Momo: the biggest, glossiest eyes of the line — a teal iris with four shines. Giggling, they
 *  squeeze into crescents with a tear of laughter at the corner. */
const momoEyes = bigEyes(
  { skin: MOMO_SKIN, iris: "#2f9aa0", glow: "#7cc9cc", rx: 10.6, ry: 12, shine: "sparkle", lash: "flick", brow: { color: MOMO_HAIR, w: 2.4, kind: "arc" } },
  {
    happy: ({ x, y, s }, t) =>
      g2(
        g2(t.shut(arcUp(x, y, 8.4, 5.4), 3.6), <path d={`M${x + s * 10} ${y + 2} q${s * 2} 3 0 5 q${-s * 2} -2 0 -5 Z`} fill="#9fd4f2" />),
        t.brow(4, 0),
      ),
    oops: ({ x, y, s }, t) =>
      g2(g2(t.shut(arcDown(x, y, 7.4, 3.6), 3.6), <path d={`M${x - s * 6} ${y + 4} q2 3 0 5 q-2 -2 0 -5 Z`} fill="#9fd4f2" />), t.brow(3, 16)),
  },
);

/** Momo: a wide open laugh, never far off; a small “ω” at rest. */
const momoMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y - 1, 12, 11)} fill={MOUTH_IN} tongue={[100, y + 13, 6, 3.6]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 2, 14, 13)} fill={MOUTH_IN} teeth={[86, y - 3, 28, 3.6]} tongue={[100, y + 16, 7, 4]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={3} ry={3.6} fill={ink} />;
    case "thinking":
      return <path d={`M103 ${y - 2.5} q3.2 1.6 0 3 q3.2 1.6 0 3`} {...line(ink, 2.2)} />;
    case "focused":
      return <path d={`M96 ${y + 1} L104 ${y + 1}`} {...line(ink, 2.4)} />;
    case "worried":
      return <path d={wave(y + 2, 7, 3)} {...line(ink, 2.4)} />;
    case "oops":
      return <OpenMouth d={`M92 ${y + 2} Q96 ${y - 2} 100 ${y + 2} Q104 ${y - 2} 108 ${y + 2} Q100 ${y + 10} 92 ${y + 2} Z`} fill={MOUTH_IN} />;
    case "wink":
      return <OpenMouth d={dMouth(y, 9, 7, 102)} fill={MOUTH_IN} tongue={[102, y + 9, 4, 2.6]} />;
    default:
      return <path d={`M93 ${y} Q96.5 ${y + 3.5} 100 ${y} Q103.5 ${y + 3.5} 107 ${y}`} {...line(ink, 2.4)} />;
  }
};

/* ——— Tess: a side braid over one shoulder and a swept fringe; she salutes ——— */

const TESS_SKIN = "#d9a27e";
const TESS_HAIR = "#5a3f36";
const palTess = human(TESS_SKIN, "#c28866", TESS_HAIR, "#7a5a4e");

function TessBack() {
  return <ellipse cx={100} cy={98} rx={48} ry={48} fill={TESS_HAIR} />;
}

function TessHead() {
  return (
    <g>
      <ellipse cx={100} cy={108} rx={42} ry={40} fill={TESS_SKIN} />
      <path d="M60 104 C54 60 80 48 104 50 C128 52 146 66 142 100 C136 84 126 74 112 72 C98 80 80 90 60 104 Z" fill={TESS_HAIR} />
      {/* one thick braid over her shoulder */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={140 + i * 0.8} cy={110 + i * 15} rx={10 - i * 0.6} ry={10} fill={TESS_HAIR} />
      ))}
      <path d="M138 184 l-8 8 M140 184 l8 8" {...line(C.accent, 4.4)} />
      <rect x={70} y={72} width={14} height={5} rx={2.5} fill={C.accent} transform="rotate(24 77 74)" />
    </g>
  );
}

/** Tess: round, level eyes with a thick lid line and a grey-blue iris; dash brows that set hard
 *  when she means it. Startled, she goes wide and white. */
const tessEyes = bigEyes(
  { skin: TESS_SKIN, iris: "#4f76a6", glow: "#8fb0d6", rx: 9.4, ry: 10.4, shine: "twin", lash: "thick", brow: { color: TESS_HAIR, w: 3.6, kind: "dash" } },
  {
    worried: ({ x, y, s, pal: p }, t) =>
      g2(
        <g>
          <ellipse cx={x} cy={y} rx={10.4} ry={11.4} fill={EYE_WHITE} />
          <circle cx={x} cy={y + 1} r={3.4} fill={p.ink} />
          <path d={`M${x - 10.4} ${y - 1} A10.4 11.4 0 0 1 ${x + 10.4} ${y - 1}`} {...line(p.ink, 3)} />
        </g>,
        t.brow(5, s === 1 ? 16 : 16),
      ),
  },
);

/** Tess: a straight, cheerful mouth: a wide flat grin with teeth when she means business. */
const tessMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  switch (mood) {
    case "happy":
      return <OpenMouth d={dMouth(y, 10, 7)} fill={MOUTH_IN} teeth={[88, y - 1, 24, 3.4]} tongue={[100, y + 10, 4.6, 2.8]} />;
    case "delighted":
      return <OpenMouth d={dMouth(y - 2, 13, 11)} fill={MOUTH_IN} teeth={[86, y - 3, 28, 3.8]} tongue={[100, y + 14, 6, 3.6]} />;
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.6} ry={3.2} fill={ink} />;
    case "thinking":
      return <path d={`M95 ${y + 2} L107 ${y}`} {...line(ink, 2.6)} />;
    case "focused":
      return (
        <g>
          <rect x={89} y={y - 2} width={22} height={7} rx={3.5} fill={MOUTH_IN} />
          <rect x={90.5} y={y - 1} width={19} height={3.4} rx={1.2} fill={EYE_WHITE} />
        </g>
      );
    case "worried":
      return <OpenMouth d={`M93 ${y + 4} Q100 ${y - 3} 107 ${y + 4} Z`} fill={MOUTH_IN} />;
    case "oops":
      return <path d={`M90 ${y + 2} l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3`} {...line(ink, 2.4)} />;
    case "wink":
      return <OpenMouth d={dMouth(y, 9, 6, 102)} fill={MOUTH_IN} teeth={[94, y - 1, 16, 3]} />;
    default:
      return <path d={curve(y, 7, 4.6)} {...line(ink, 2.6)} />;
  }
};

/* ——— Bibi: a high ponytail with a scrunchie, long side-bangs; she skips ——— */

const BIBI_SKIN = "#a86a48";
const BIBI_HAIR = "#2e5a6e";
const palBibi = human(BIBI_SKIN, "#8e5638", BIBI_HAIR, "#4a7a8e");

function BibiBack() {
  return (
    <g>
      <Taper
        segs={[
          [
            [104, 44],
            [140, 30],
            [162, 70],
            [150, 120],
          ],
        ]}
        w0={28}
        w1={12}
        fill={BIBI_HAIR}
      />
      <ellipse cx={100} cy={96} rx={47} ry={48} fill={BIBI_HAIR} />
      <ellipse cx={108} cy={46} rx={11} ry={7} transform="rotate(-20 108 46)" fill={C.accent} />
    </g>
  );
}

function BibiHead() {
  return (
    <g>
      <ellipse cx={100} cy={108} rx={42} ry={40} fill={BIBI_SKIN} />
      <path d="M58 92 C58 60 80 50 100 50 C120 50 142 60 142 92 C132 72 114 66 100 70 C86 66 68 72 58 92 Z" fill={BIBI_HAIR} />
      <Taper segs={[[[62, 80], [54, 100], [56, 118], [60, 134]]]} w0={11} w1={6} fill={BIBI_HAIR} />
      <Taper segs={[[[138, 80], [146, 100], [144, 118], [140, 134]]]} w0={11} w1={6} fill={BIBI_HAIR} />
    </g>
  );
}

/** Bibi: wide eyes — wider than tall — with a warm chocolate iris and twin shines, and dot brows
 *  that bounce. Mid-skip, her eyes pinch to happy tents. */
const bibiEyes = bigEyes(
  { skin: BIBI_SKIN, iris: "#5a3420", glow: "#9a6440", rx: 11, ry: 9.4, shine: "twin", lash: "lower", brow: { color: BIBI_HAIR, w: 0, kind: "dot" } },
  {
    happy: ({ x, y, pal: p }, t) => g2(<path d={`M${x - 7.5} ${y + 3} L${x} ${y - 5} L${x + 7.5} ${y + 3}`} {...line(p.ink, 3.6)} />, t.brow(4, 0)),
    oops: ({ x, y, pal: p }, t) => g2(<circle cx={x} cy={y} r={2.6} fill={p.ink} />, t.brow(6, 0)),
  },
);

/** Bibi: a wide, bright smile that takes her cheeks, with a dimple. */
const bibiMouth: MouthKit = ({ mood, y, pal: p }) => {
  const ink = p.ink;
  const dimple = <path d={`M113 ${y - 3} q2 2 0 4`} {...line("#7a4a30", 1.8)} />;
  switch (mood) {
    case "happy":
      return g2(<OpenMouth d={dMouth(y - 1, 12, 9)} fill={MOUTH_IN} teeth={[87, y - 2, 26, 3.4]} tongue={[100, y + 12, 5.6, 3.2]} />, dimple);
    case "delighted":
      return g2(<OpenMouth d={dMouth(y - 2, 14, 13)} fill={MOUTH_IN} teeth={[85, y - 3, 30, 3.8]} tongue={[100, y + 16, 7, 4]} />, dimple);
    case "curious":
      return <ellipse cx={100} cy={y + 2} rx={2.8} ry={3.4} fill={ink} />;
    case "thinking":
      return <path d={curve(y + 1, 5, 2.4, 103)} {...line(ink, 2.4)} />;
    case "focused":
      return <path d={`M95 ${y + 1} L105 ${y + 1}`} {...line(ink, 2.4)} />;
    case "worried":
      return <path d={wave(y + 2, 7, 2.6)} {...line(ink, 2.4)} />;
    case "oops":
      return g2(<path d={curve(y, 8, 4)} {...line(ink, 2.4)} />, <ellipse cx={104} cy={y + 5} rx={2.6} ry={2.8} fill={TONGUE_PINK} />);
    case "wink":
      return g2(<path d={`M90 ${y} Q100 ${y + 8} 111 ${y - 2}`} {...line(ink, 2.6)} />, dimple);
    default:
      return g2(<path d={curve(y, 9, 6)} {...line(ink, 2.6)} />, dimple);
  }
};

/* ——— The five ——— */

const girl = (
  id: string,
  label: string,
  signature: string,
  pitch: string,
  risk: string,
  pal: Candidate["pal"],
  skin: string,
  kit: EyeKit,
  mouthKit: MouthKit,
  outfit: Candidate["outfit"],
  back: () => ReactNode,
  head: (c: Ctx) => ReactNode,
): Candidate => ({
  id,
  kind: "human",
  frame: BIG,
  outline: false,
  hands: "mitten",
  label,
  signature,
  pitch,
  risk,
  pal,
  body: C.clothes,
  face: face({ eyeY: 110, eyeGap: 18, mouthY: 131, lid: skin, kit, mouthKit }),
  outfit,
  outfits: OUTFITS,
  headBack: back,
  head,
});

export const LULU_LINE: Candidate[] = [
  girl(
    "side-suki",
    "Suki",
    "Navy low bunches with pompom ties and a blunt fringe — she whistles",
    "Lulu's line: a tiny girl with a big head, navy hair in two low bunches tied with pompoms in the accent, a blunt fringe and straight side-locks. Her ability is Whistle: she purses her lips and whistles a little tune, eyes shut, content. Round eyes with a rose iris and three lashes; startled, her pupils go to pinpricks. A cat's “v” of a mouth at rest.",
    "A tune is a moment, never a fanfare: no sound tied to a score.",
    palSuki,
    SUKI_SKIN,
    sukiEyes,
    sukiMouth,
    "dungarees",
    () => <SukiBack />,
    () => <SukiHead />,
  ),
  girl(
    "side-rue",
    "Rue",
    "Long plum hair, a blunt fringe, straight side-locks and a headband — she pouts",
    "Lulu's line: a tiny girl with a big head and long plum hair cut blunt, straight side-locks framing her cheeks, a headband in the accent. Her ability is Pout: she puffs out both cheeks and pushes out her lips, and side-eyes you until she gets her way. Soft eyes whose outer corners droop, with a gold iris and a heavy lash line.",
    "A pout is comic, never sulking at the learner or at a wrong answer.",
    palRue,
    RUE_SKIN,
    rueEyes,
    rueMouth,
    "dress",
    () => <RueBack />,
    () => <RueHead />,
  ),
  girl(
    "side-momo",
    "Momo",
    "A cloud of strawberry curls and a little beret — she gets the giggles",
    "Lulu's line: a tiny girl with a big head, a cloud of strawberry curls and a little beret in the deep primary. Her ability is Giggle: she gets the giggles and can't stop, eyes squeezed to crescents with a tear of laughter. The biggest, glossiest eyes of the line — a teal iris with four shines — and a laugh that is never far off.",
    "Giggles must never be at someone: they come from her, not at the learner.",
    palMomo,
    MOMO_SKIN,
    momoEyes,
    momoMouth,
    "hoodie",
    () => <MomoBack />,
    () => <MomoHead />,
  ),
  girl(
    "side-tess",
    "Tess",
    "A side braid over one shoulder, a swept fringe and a hair clip — she salutes",
    "Lulu's line, spy-game side: a tiny girl with a big head, a thick braid over one shoulder, a swept fringe and a clip in the accent. Her ability is Salute: she snaps to attention with a salute — ready, reporting for duty. Round, level eyes with a grey-blue iris, a thick lid line and dash brows that set hard when she means it; a wide flat grin with teeth.",
    "Salutes and duty must stay a game; she never salutes an approval or a score.",
    palTess,
    TESS_SKIN,
    tessEyes,
    tessMouth,
    "raincoat",
    () => <TessBack />,
    () => <TessHead />,
  ),
  girl(
    "side-bibi",
    "Bibi",
    "A high ponytail with a scrunchie and long side-bangs — she skips",
    "Lulu's line: a tiny girl with a big head, a high ponytail swinging behind, a scrunchie in the accent and long side-bangs framing her face. Her ability is Skip: she skips along instead of walking, ponytail bouncing. Wide eyes — wider than tall — with a warm chocolate iris, twin shines and dot brows that bounce; a bright smile with a dimple.",
    "Skipping is how she gets about, never a celebration of a result.",
    palBibi,
    BIBI_SKIN,
    bibiEyes,
    bibiMouth,
    "dress",
    () => <BibiBack />,
    () => <BibiHead />,
  ),
];
