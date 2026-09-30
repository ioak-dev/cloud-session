import type { ReactNode } from "react";

import { arcUp, chevron, EYE_WHITE, line, turnAt, type EyeArgs, type EyeKit } from "./rig/eyes";
import type { Mood } from "./rig/face";
import { C } from "./theme";

/**
 * Eye styles for Wisp, warmer — proposals. Each draws the shared nine expressions and Wisp's own
 * five (sly, silly, surprised, proud, party; `MORE_MOODS`), so the range runs from composed to
 * clowning. What an eye does in each mood (where it looks, how far each lid closes, how the brows
 * sit) is one acting table, `act`; each style only decides how an eye and a brow are drawn.
 *
 * Lids cut the eye rather than being painted over it, so an eye holds on any face colour, warm
 * or cool. Eyes, brows and lash lines are dark ink, like every face feature.
 */

const GLOW = "#ffcf4a";
const AMBER = "var(--char-glow-edge)";
const HONEY = "#b86f1c";
const HONEY_LIGHT = "#e3a24a";

type Lids = { top?: number; bottom?: number; tilt?: number };
type Brow = { tilt: number; lift: number };

/** How an eye acts in a mood, for the eye on side `s`. */
type Act = {
  eye: "open" | "closed" | "squeeze";
  lid?: Lids;
  look?: readonly [number, number];
  /** The eye's own scale, and its pupil's. */
  size?: number;
  pupil?: number;
  brow: Brow;
  /** The delighted sparkle; the party eye; pupils crossed toward the nose. */
  spark?: boolean;
  party?: boolean;
  cross?: boolean;
};

export function act(mood: Mood, s: -1 | 1): Act {
  const right = s === 1;
  switch (mood) {
    case "happy":
      return { eye: "closed", brow: { tilt: 0, lift: 4 } };
    case "delighted":
      return { eye: "open", size: 1.08, pupil: 1.15, spark: true, brow: { tilt: 0, lift: 6 } };
    case "curious":
      return {
        eye: "open",
        look: [2, -2],
        size: right ? 1.1 : 0.95,
        brow: right ? { tilt: 0, lift: 7 } : { tilt: 4, lift: 0 },
      };
    case "thinking":
      return {
        eye: "open",
        look: [-2.6, -3],
        lid: { top: 0.16 },
        brow: right ? { tilt: -8, lift: -1 } : { tilt: -2, lift: 5 },
      };
    case "focused":
      return { eye: "open", look: [0, 0.6], lid: { top: 0.3, bottom: 0.14, tilt: -6 }, brow: { tilt: -10, lift: -2 } };
    case "worried":
      return { eye: "open", look: [0, 1], pupil: 0.8, lid: { top: 0.14, tilt: 16 }, brow: { tilt: 18, lift: 2 } };
    case "oops":
      return { eye: "squeeze", brow: { tilt: 14, lift: 0 } };
    case "wink":
      return right
        ? { eye: "closed", brow: { tilt: -6, lift: 0 } }
        : { eye: "open", look: [0.8, 0], brow: { tilt: 0, lift: 5 } };
    case "sly":
      /* side-eye under low lids, one brow up: up to something */
      return {
        eye: "open",
        look: [3.4, 0.4],
        lid: { top: 0.46, bottom: 0.1, tilt: -8 },
        brow: right ? { tilt: -12, lift: 0 } : { tilt: -4, lift: 7 },
      };
    case "silly":
      /* cross-eyed, one eye bigger, brows at odds */
      return {
        eye: "open",
        cross: true,
        size: right ? 0.88 : 1.12,
        brow: right ? { tilt: -10, lift: -1 } : { tilt: 6, lift: 8 },
      };
    case "surprised":
      return { eye: "open", size: 1.16, pupil: 0.55, brow: { tilt: 0, lift: 10 } };
    case "proud":
      /* lids low, looking down its nose, brows up: composed and pleased */
      return { eye: "open", look: [0, -1.4], lid: { top: 0.5, tilt: 6 }, brow: { tilt: -2, lift: 6 } };
    case "party":
      return { eye: "open", party: true, size: 1.08, brow: { tilt: 0, lift: 7 } };
    default:
      return { eye: "open", brow: { tilt: 0, lift: 1 } };
  }
}

/* ——— drawing helpers ——— */

/** A four-point sparkle centred on (x, y). */
const sparkle = (x: number, y: number, r: number, q = 0.3) =>
  `M${x} ${y - r} L${x + r * q} ${y - r * q} L${x + r} ${y} L${x + r * q} ${y + r * q} L${x} ${y + r} L${x - r * q} ${y + r * q} L${x - r} ${y} L${x - r * q} ${y - r * q} Z`;

/**
 * An eye cut by its lids. `shape` is the eye's outline; `inside` is drawn clipped to it (white,
 * iris, pupil, shine); `rim` is drawn clipped only by the lids, so a rim line runs round the open
 * part. With `lidFill`, the top lid is painted in that colour instead of cutting the eye.
 */
function LidCut({
  id,
  x,
  y,
  rx,
  ry,
  s,
  lids,
  shape,
  inside,
  rim,
  lash,
  lidFill,
  ink,
}: {
  id: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  s: -1 | 1;
  lids?: Lids;
  shape: ReactNode;
  inside: ReactNode;
  rim?: ReactNode;
  lash?: number;
  lidFill?: string;
  ink: string;
}) {
  const top = lids?.top ?? 0;
  const bottom = lids?.bottom ?? 0;
  const t = Math.tan(((lids?.tilt ?? 0) * Math.PI) / 180);
  const yt = top > 0 ? y - ry + 2 * ry * top : y - ry - 4;
  const yb = bottom > 0 ? y + ry - 2 * ry * bottom : y + ry + 4;
  const xl = x - rx - 4;
  const xr = x + rx + 4;
  /* positive tilt lifts the lid's inner end, toward the face's centre line */
  const at = (xp: number) => yt + s * t * (xp - x);
  const open = `M${xl} ${at(xl)} L${xr} ${at(xr)} L${xr} ${yb} Q${x} ${yb - (bottom > 0 ? 3 : 0)} ${xl} ${yb} Z`;
  const lid = `M${xl} ${y - ry - 6} L${xr} ${y - ry - 6} L${xr} ${at(xr)} L${xl} ${at(xl)} Z`;
  return (
    <g>
      <clipPath id={`${id}-open`}>
        <path d={lidFill ? `M${xl} ${y - ry - 6} H${xr} V${yb} Q${x} ${yb - 3} ${xl} ${yb} Z` : open} />
      </clipPath>
      <clipPath id={`${id}-eye`}>{shape}</clipPath>
      <clipPath id={`${id}-near`}>
        <ellipse cx={x} cy={y} rx={rx + 2.2} ry={ry + 2.2} />
      </clipPath>
      <g clipPath={`url(#${id}-open)`}>
        <g clipPath={`url(#${id}-eye)`}>
          {inside}
          {lidFill && top > 0 && <path d={lid} fill={lidFill} />}
        </g>
        {rim}
      </g>
      {lash && top > 0 && (
        <g clipPath={`url(#${id}-near)`}>
          <path d={`M${xl} ${at(xl)} L${xr} ${at(xr)}`} {...line(ink, lash)} />
        </g>
      )}
      {lash && bottom > 0 && (
        <g clipPath={`url(#${id}-near)`}>
          <path d={`M${xl} ${yb} Q${x} ${yb - 3} ${xr} ${yb}`} {...line(ink, lash * 0.7)} />
        </g>
      )}
    </g>
  );
}

type Style = {
  /** The eye's half-width and half-height at rest. */
  rx: number;
  ry: number;
  brow: { w: number; arch: number; weight: number; gap: number };
  closed: number;
  /** The open eye: its shape, what is inside it, and an optional rim. */
  open: (o: {
    a: EyeArgs;
    act: Act;
    rx: number;
    ry: number;
    look: readonly [number, number];
  }) => { shape: ReactNode; inside: ReactNode; rim?: ReactNode; lash?: number; lidFill?: string; lidBase?: number };
};

function kit(style: Style): EyeKit {
  return (a) => {
    const { mood, s, x, y, pal, id } = a;
    const ink = pal.ink;
    const m = act(mood, s);
    const k = m.size ?? 1;
    const rx = style.rx * k;
    const ry = style.ry * k;
    const b = style.brow;
    const by = y - ry - b.gap - m.brow.lift;
    const brow = (
      <path
        d={`M${x - b.w} ${by + b.arch * 0.3} Q${x} ${by - b.arch} ${x + b.w} ${by + b.arch * 0.3}`}
        transform={turnAt(s, m.brow.tilt, x, by)}
        {...line(ink, b.weight)}
      />
    );
    if (m.eye === "closed")
      return (
        <g>
          <path d={arcUp(x, y + 1, style.rx * 0.9, 5)} {...line(ink, style.closed)} />
          {brow}
        </g>
      );
    if (m.eye === "squeeze")
      return (
        <g>
          <path d={chevron(x, y, s, 6.5, 6)} {...line(ink, style.closed)} />
          {brow}
        </g>
      );
    const look: readonly [number, number] = m.cross ? [-s * 3.2, 0.6] : (m.look ?? a.look);
    const o = style.open({ a, act: m, rx, ry, look });
    const base = o.lidBase ?? 0;
    const lids: Lids = { ...m.lid, top: Math.max(m.lid?.top ?? 0, base) };
    return (
      <g>
        <LidCut
          id={id}
          x={x}
          y={y}
          rx={rx}
          ry={ry}
          s={s}
          lids={lids}
          shape={o.shape}
          inside={o.inside}
          rim={o.rim}
          lash={o.lash}
          lidFill={o.lidFill}
          ink={ink}
        />
        {brow}
      </g>
    );
  };
}

/* ——— the styles ——— */

/** Honey: the warmer's eyes as drawn — big dark eyes, honey irises, two shines. Warm and soft. */
export const HONEY_EYES = kit({
  rx: 9.6,
  ry: 11.4,
  brow: { w: 8, arch: 5, weight: 3.2, gap: 3 },
  closed: 3.4,
  open: ({ a, act: m, rx, ry, look }) => {
    const { x, y, pal } = a;
    const [dx, dy] = look;
    const p = m.pupil ?? 1;
    return {
      shape: <ellipse cx={x} cy={y} rx={rx} ry={ry} />,
      lash: 2.4,
      inside: (
        <g>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={pal.ink} />
          <ellipse cx={x + dx} cy={y + 2.6 + dy} rx={rx - 2.6} ry={ry - 3.6} fill={HONEY} />
          <ellipse cx={x + dx} cy={y + 5 + dy} rx={rx - 4.4} ry={ry - 7} fill={HONEY_LIGHT} opacity={0.7} />
          <circle cx={x + dx} cy={y + 2.6 + dy} r={3.4 * p} fill={pal.ink} />
          {m.party ? (
            <path d={sparkle(x - 2.6 + dx, y - 3 + dy, 5.4)} fill={EYE_WHITE} />
          ) : (
            <circle cx={x - 3 + dx} cy={y - 4 + dy} r={3.2 * (m.pupil && m.pupil < 1 ? 0.7 : 1)} fill={EYE_WHITE} />
          )}
          <circle cx={x + 3.4 + dx} cy={y + 4.4 + dy} r={1.4} fill={EYE_WHITE} />
          {m.spark && <path d={sparkle(x + 3.5, y - 5.5, 3.6)} fill={EYE_WHITE} />}
        </g>
      ),
    };
  },
});

/**
 * Bean: white eyes with a dark pupil that roams — the cartoon eye that shows exactly where it is
 * looking, so a side-glance, a cross-eyed face and a shocked pinprick all read. The most range.
 */
export const BEAN_EYES = kit({
  rx: 9.4,
  ry: 12,
  brow: { w: 7, arch: 3, weight: 4.2, gap: 3.5 },
  closed: 3.8,
  open: ({ a, act: m, rx, ry, look }) => {
    const { x, y, pal } = a;
    const px = x + look[0] * 1.5;
    const py = y + 1 + look[1] * 1.4;
    const r = 5.4 * (m.pupil ?? 1);
    return {
      shape: <ellipse cx={x} cy={y} rx={rx} ry={ry} />,
      lash: 2.6,
      rim: <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={pal.ink} strokeWidth={1.8} />,
      inside: (
        <g>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={EYE_WHITE} />
          {m.party ? (
            <path d={sparkle(px, py, 7.4, 0.36)} fill={pal.ink} />
          ) : (
            <circle cx={px} cy={py} r={r} fill={pal.ink} />
          )}
          <circle cx={px - r * 0.4} cy={py - r * 0.45} r={Math.max(1.2, r * 0.32)} fill={EYE_WHITE} />
          {m.spark && <path d={sparkle(px + 2, py - 2, 3)} fill={EYE_WHITE} />}
        </g>
      ),
    };
  },
});

/**
 * Gumdrop: solid glossy eyes with no white, that change shape instead — lids cut them flat,
 * surprise stretches them tall, curiosity makes one bigger, a party turns them into sparks.
 * Reads at the smallest size.
 */
export const GUMDROP_EYES = kit({
  rx: 7.6,
  ry: 10.2,
  brow: { w: 5.4, arch: 2.4, weight: 3.6, gap: 4.5 },
  closed: 4.2,
  open: ({ a, act: m, rx, ry, look }) => {
    const { x, y, pal } = a;
    const [dx, dy] = look;
    const tall = m.pupil && m.pupil < 1 ? 1.1 : 1;
    const party = m.party;
    const shape = party ? (
      <path d={sparkle(x, y, ry * 1.1, 0.34)} />
    ) : (
      <ellipse cx={x} cy={y} rx={rx / tall} ry={ry * tall} />
    );
    return {
      shape,
      inside: (
        <g>
          <rect x={x - rx - 4} y={y - ry * 1.3} width={2 * rx + 8} height={ry * 2.6} fill={pal.ink} />
          <circle cx={x - 2.6 + dx * 0.6} cy={y - 3.8 + dy * 0.6} r={party ? 2 : 3} fill={EYE_WHITE} />
          <circle cx={x + 2.6 + dx * 0.6} cy={y + 3.6 + dy * 0.6} r={1.3} fill={EYE_WHITE} />
          {m.spark && <path d={sparkle(x + 3, y - 5, 3.4)} fill={EYE_WHITE} />}
        </g>
      ),
    };
  },
});

/**
 * Lidded: white eyes with small pupils under heavy lids in its own colour — the lids do the
 * acting. Droll, knowing and the best at sly and proud; it has to open wide to look sweet.
 */
export const LIDDED_EYES = kit({
  rx: 10,
  ry: 11,
  brow: { w: 9, arch: 3, weight: 2.8, gap: 3.5 },
  closed: 3.4,
  open: ({ a, act: m, rx, ry, look }) => {
    const { x, y, pal } = a;
    const px = x + look[0] * 1.5;
    const py = y + 2 + look[1] * 1.3;
    const r = 4 * (m.pupil ?? 1);
    const wide = m.spark || m.party || (m.size ?? 1) > 1.1;
    return {
      shape: <ellipse cx={x} cy={y} rx={rx} ry={ry} />,
      lash: 2.6,
      lidFill: C.mid,
      lidBase: wide ? 0.06 : 0.26,
      rim: <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={pal.ink} strokeWidth={1.6} />,
      inside: (
        <g>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={EYE_WHITE} />
          {m.party ? (
            <path d={sparkle(px, py, 6.4, 0.36)} fill={pal.ink} />
          ) : (
            <circle cx={px} cy={py} r={r} fill={pal.ink} />
          )}
          <circle cx={px - 1.4} cy={py - 1.6} r={1.2} fill={EYE_WHITE} />
          {m.spark && <path d={sparkle(px + 2, py - 2, 2.8)} fill={EYE_WHITE} />}
        </g>
      ),
    };
  },
});

/**
 * Starry: dark eyes with a spark of its own light as the catchlight — the firefly's glow, in its
 * eyes. The spark grows with delight, shrinks to a point in surprise, and at a party the whole
 * eye becomes a spark.
 */
export const STARRY_EYES = kit({
  rx: 9.2,
  ry: 11.2,
  brow: { w: 7, arch: 6, weight: 3, gap: 3 },
  closed: 3.4,
  open: ({ a, act: m, rx, ry, look }) => {
    const { x, y, pal } = a;
    const [dx, dy] = look;
    const p = m.pupil ?? 1;
    if (m.party)
      return {
        shape: <path d={sparkle(x, y, ry * 1.12, 0.36)} />,
        inside: (
          <g>
            <rect x={x - rx - 4} y={y - ry * 1.4} width={2 * rx + 8} height={ry * 2.8} fill={GLOW} />
            <circle cx={x + dx} cy={y + dy} r={3} fill={pal.ink} />
          </g>
        ),
        rim: <path d={sparkle(x, y, ry * 1.12, 0.36)} fill="none" stroke={AMBER} strokeWidth={1.2} />,
      };
    const spark = m.spark ? 6.6 : p < 1 ? 2.2 : 4.6;
    return {
      shape: <ellipse cx={x} cy={y} rx={rx} ry={ry} />,
      lash: 2.4,
      inside: (
        <g>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={pal.ink} />
          <ellipse cx={x + dx} cy={y + 2.4 + dy} rx={rx - 2.4} ry={ry - 3.2} fill={C.deep} />
          <ellipse cx={x + dx} cy={y + 2.4 + dy} rx={(rx - 5.4) * p} ry={(ry - 6.4) * p} fill={pal.ink} />
          <path d={sparkle(x - 2.6 + dx, y - 3.4 + dy, spark, 0.28)} fill={GLOW} />
          <circle cx={x + 3.4 + dx} cy={y + 4.4 + dy} r={1.3} fill={EYE_WHITE} />
        </g>
      ),
    };
  },
});

export const EYE_STYLES: { id: string; label: string; kit: EyeKit; note: string }[] = [
  {
    id: "honey",
    label: "Honey",
    kit: HONEY_EYES,
    note: "As drawn on Wisp · warmer: dark eyes with honey irises. Warm and sweet; the pupil barely shows where it looks, so sly and silly lean on the lids and brows.",
  },
  {
    id: "bean",
    label: "Bean",
    kit: BEAN_EYES,
    note: "White eyes, a roaming pupil, chunky brows. The widest range: side-eye, cross-eyed, a pinprick of shock. The most cartoon-funny; the most Duolingo-like, so watch it does not read as Duo.",
  },
  {
    id: "gumdrop",
    label: "Gumdrop",
    kit: GUMDROP_EYES,
    note: "Solid glossy eyes that change shape: cut flat, stretched tall, one bigger, sparks at a party. Reads best at 16–32px; less subtle up close.",
  },
  {
    id: "lidded",
    label: "Lidded",
    kit: LIDDED_EYES,
    note: "Heavy lids in its own colour do the acting. Droll and knowing — the best at sly, proud and professional — but it rests cooler, so it must open wide to look sweet.",
  },
  {
    id: "starry",
    label: "Starry",
    kit: STARRY_EYES,
    note: "Its own light as the catchlight: a spark that grows with delight and shrinks in surprise; at a party the eye becomes a spark. Ties the eyes to the ability.",
  },
];
