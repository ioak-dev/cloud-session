import type { ReactNode } from "react";

import type { Candidate } from "./candidates";
import { arcDown, arcUp, chevron, EYE_WHITE, line, turnAt, type EyeArgs, type EyeKit } from "./rig/eyes";
import { arcBrow, dashBrow, eyesOf, g2, INK, mix, type Brow } from "./side-kit";
import { C } from "./theme";

/**
 * Eyes told apart (proposals, 2026-10-28). On the shortlist every face was drawn with one eye: the
 * same almond white with a dark rim, a round iris and two catchlights, closing into the same ^ ^
 * when happy and the same > < for oops, under nearly the same thin arc of a brow. Colour and size
 * changed, and neither survives at the perch size. Each kit here gives a character an eye of its own
 * shape and its own happy and oops, and a brow of its own:
 *
 * - Otto: small dark bead eyes with no whites, under big bushy white brows; happy squeezes them shut.
 * - Ada: smiling crescents (the lower lid always up) with laughter crinkles at the corners.
 * - Haru: round, wide eyes with small irises, magnified behind his glasses; thick straight brows.
 * - Grace: almond eyes under heavy lids with a little wing; happy is a knowing half-close, not ^ ^.
 * - Kai: flat-topped and half-lidded under short straight brows; happy is lopsided, oops deadpan.
 * - Sofia: big round green eyes with long lashes; happy keeps the lashes.
 *
 * Noor's eyes already read as hers and stay. Shines stay upper left for the whole cast.
 */

type Style = Parameters<typeof eyesOf>[0];

/** Draws one eye in a given mood with another kit — for a mood drawn as another one looks. */
const as = (kit: EyeKit, a: EyeArgs, mood: EyeArgs["mood"]) => kit({ ...a, mood });

/** A thick shut stroke. */
const shut = (d: string, w = 2.8, color = INK) => <path d={d} {...line(color, w)} />;

/* ——— Brows ——— */

/** A big, bushy brow: overlapping tufts, heavier at the outer end. */
const bushyBrow =
  (color: string, shade: string): Brow =>
  ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    const tufts: [number, number, number][] = [
      [-6, 1.4, 3.4],
      [-1, -0.6, 4],
      [4.6, 0.2, 4.2],
      [8.4, 2.4, 3],
    ];
    return (
      <g transform={turnAt(s, tilt, x, by)}>
        {tufts.map(([dx, dy, r]) => (
          <circle key={dx} cx={x + s * dx} cy={by + dy + 0.9} r={r} fill={shade} />
        ))}
        {tufts.map(([dx, dy, r]) => (
          <circle key={`h${dx}`} cx={x + s * dx} cy={by + dy} r={r} fill={color} />
        ))}
      </g>
    );
  };

/** A thin, high arch: drawn on, a little lifted at its outer end. */
const archBrow =
  (color: string): Brow =>
  ({ x, y, s, raise, tilt }) => {
    const by = y - raise;
    return (
      <path
        d={`M${x - s * 7} ${by + 2} Q${x + s * 1} ${by - 4.6} ${x + s * 8} ${by + 0.6}`}
        {...line(color, 2.2)}
        transform={turnAt(s, tilt, x, by)}
      />
    );
  };

/* ——— Otto: dark bead eyes under bushy white brows ——— */

function ottoEyes(c: Candidate): EyeKit {
  const white = "#f2f2f0";
  const brow = bushyBrow(white, mix(white, C.mid, 60));
  const st: Style = {
    rx: 5.2,
    ry: 6.2,
    fill: "#2b2230",
    pupil: { r: 0.01, color: "#2b2230" },
    shine: 1.9,
    lid: c.pal.skin,
    closed: INK,
    browY: 14,
    brow,
    rest: { raise: 2, browTilt: 8 },
  };
  const base = eyesOf(st);
  return (a) => {
    const { x, y, s } = a;
    const b = (raise: number, tilt: number) => brow({ x, y: y - st.browY, s, raise, tilt });
    /* squeezed shut under the brows, a crease below */
    const squeeze = g2(shut(arcUp(x, y + 1.4, 5.4, 3.2), 3.2), <path d={`M${x + s * 4} ${y + 6.4} q${s * 2.6} -0.4 ${s * 4} -2.4`} {...line(mix(c.pal.skin, INK, 70), 1.6)} />);
    switch (a.mood) {
      case "happy":
        return g2(squeeze, b(-2, 4));
      case "wink":
        return s === 1 ? g2(squeeze, b(-3, -2)) : as(base, a, "neutral");
      case "oops":
        return g2(shut(`M${x - 4.4} ${y} L${x + 4.4} ${y}`, 3), b(5, 20));
      default:
        return base(a);
    }
  };
}

/* ——— Ada: smiling crescents with laughter crinkles ——— */

function adaEyes(c: Candidate): EyeKit {
  const crinkle = mix(c.pal.skin, INK, 72);
  const brow = arcBrow(mix(c.pal.hair, C.mid, 70), 3.2, 6);
  const st: Style = {
    rx: 7.8,
    ry: 8.2,
    fill: EYE_WHITE,
    iris: { r: 5.8, color: "#4a6a7a" },
    pupil: { r: 2.8 },
    shine: 2.1,
    lid: c.pal.skin,
    rim: { color: INK, w: 2.4, lashes: 1 },
    closed: INK,
    browY: 15,
    brow,
    rest: { bottom: 0.46, raise: 3, browTilt: 4 },
  };
  const base = eyesOf(st);
  return (a) => {
    const { x, y, s } = a;
    const b = (raise: number, tilt: number) => brow({ x, y: y - st.browY, s, raise, tilt });
    const lines = (n: 2 | 3) => (
      <path
        d={`M${x + s * 10.4} ${y - 2.4} l${s * 4.6} -2.4 M${x + s * 11} ${y + 1.2} l${s * 5} 0.4${n === 3 ? ` M${x + s * 10.2} ${y + 4.8} l${s * 4.2} 2.8` : ""}`}
        {...line(crinkle, 1.8)}
      />
    );
    /* crescents: a happy eye is an arc with its lower lid pushed up under it */
    const crescent = g2(shut(arcUp(x, y + 1, 7, 3.6), 2.8), <path d={arcDown(x, y + 4.2, 4.6, 1.2)} {...line(crinkle, 1.4)} />, lines(3));
    switch (a.mood) {
      case "happy":
        return g2(crescent, b(4, 0));
      case "wink":
        return s === 1 ? g2(crescent, b(-1, -6)) : g2(base(a), lines(2));
      case "oops":
        return g2(shut(arcUp(x, y + 1.6, 5.4, 2.4), 2.8), lines(3), b(6, 16));
      default:
        return g2(base(a), lines(2));
    }
  };
}

/* ——— Haru: round, wide eyes behind his glasses ——— */

function haruEyes(c: Candidate): EyeKit {
  const brow = dashBrow(c.pal.hair, 4.2, 5.2);
  const st: Style = {
    rx: 9.2,
    ry: 9.2,
    fill: EYE_WHITE,
    iris: { r: 4, color: "#3a2a1e" },
    pupil: { r: 2.1 },
    shine: 1.7,
    lid: c.pal.skin,
    rim: { color: INK, w: 2, lashes: 0 },
    closed: INK,
    browY: 17,
    brow,
    rest: { raise: 2, browTilt: 10, look: [0, 0.6] },
  };
  const base = eyesOf(st);
  return (a) => {
    const { x, y, s } = a;
    const b = (raise: number, tilt: number) => brow({ x, y: y - st.browY, s, raise, tilt });
    switch (a.mood) {
      case "happy":
        /* small, neat arcs — content rather than beaming */
        return g2(shut(arcUp(x, y + 1, 4.4, 2.4), 2.6), b(4, 6));
      case "wink":
        return s === 1 ? g2(shut(arcUp(x, y + 1, 4.4, 2.4), 2.6), b(1, -4)) : as(base, a, "neutral");
      case "oops":
        /* wide, pupils shrunk to dots */
        return g2(
          <circle cx={x} cy={y} r={9.2} fill={EYE_WHITE} />,
          <circle cx={x} cy={y} r={9.2} {...line(INK, 2)} />,
          <circle cx={x} cy={y + 0.6} r={1.7} fill={INK} />,
          b(7, 10),
        );
      default:
        return base(a);
    }
  };
}

/* ——— Grace: almond eyes, heavy lids and a wing ——— */

function graceEyes(c: Candidate): EyeKit {
  const brow = archBrow(mix("#ece8e2", C.mid, 60));
  const st: Style = {
    rx: 8.4,
    ry: 7.4,
    fill: EYE_WHITE,
    iris: { r: 5.8, color: "#3a2214" },
    pupil: { r: 2.8 },
    shine: 2,
    lid: c.pal.skin,
    rim: { color: INK, w: 3, lashes: 0 },
    closed: INK,
    browY: 17,
    brow,
    rest: { top: 0.32, raise: 3, browTilt: -6, k: [0.98, 1.04] },
  };
  const base = eyesOf(st);
  /* content: lids most of the way down, still looking at you */
  const knowing = eyesOf({ ...st, rest: { top: 0.6, bottom: 0.14, raise: 5, browTilt: -2 } });
  const wide = eyesOf({ ...st, rest: { k: [1.16, 1.16], raise: 8, browTilt: 10 } });
  return (a) => {
    const { x, y, s } = a;
    const b = (raise: number, tilt: number) => brow({ x, y: y - st.browY, s, raise, tilt });
    const wing = <path d={`M${x + s * st.rx * 0.9} ${y - 1.6} q${s * 3} -0.8 ${s * 5.6} -4`} {...line(INK, 2.4)} />;
    switch (a.mood) {
      case "happy":
        return g2(as(knowing, a, "neutral"), wing);
      case "wink":
        return s === 1 ? g2(shut(arcUp(x, y + 1, 7, 3), 3), wing, b(-1, -6)) : g2(as(knowing, a, "neutral"), wing);
      case "oops":
        /* one eye squeezed, one wide */
        return s === -1 ? g2(shut(arcUp(x, y + 1, 6, 2.6), 3), wing, b(2, 14)) : g2(as(wide, a, "neutral"), wing);
      default:
        return g2(base(a), wing);
    }
  };
}

/* ——— Kai: flat-topped, half-lidded ——— */

function kaiEyes(c: Candidate): EyeKit {
  const brow = dashBrow(c.pal.hair, 3.4, 4.6);
  const st: Style = {
    rx: 8.2,
    ry: 8.4,
    fill: EYE_WHITE,
    iris: { r: 6.2, color: "#3a4a5e" },
    pupil: { r: 3 },
    shine: 2,
    lid: c.pal.skin,
    rim: { color: INK, w: 3, lashes: 0 },
    closed: INK,
    browY: 14,
    brow,
    rest: { top: 0.5, raise: -1, look: [1.6, 0] },
  };
  const base = eyesOf(st);
  const lazy = eyesOf({ ...st, rest: { top: 0.62, bottom: 0.1, raise: 1, browTilt: 4, look: [1, 0] } });
  return (a) => {
    const { x, y, s } = a;
    const b = (raise: number, tilt: number) => brow({ x, y: y - st.browY, s, raise, tilt });
    switch (a.mood) {
      case "happy":
        /* lopsided: one eye closes, the other only half */
        return s === 1 ? g2(shut(arcUp(x, y + 1, 6.6, 2.6), 3), b(2, -4)) : as(lazy, a, "neutral");
      case "oops":
        /* deadpan */
        return g2(shut(`M${x - 6} ${y + 0.6} L${x + 6} ${y + 0.6}`, 3), b(0, 0));
      default:
        return base(a);
    }
  };
}

/* ——— Sofia: big round green eyes, long lashes ——— */

function sofiaEyes(c: Candidate): EyeKit {
  const brow = arcBrow("#8a3a22", 3, 6.6);
  const st: Style = {
    rx: 9.4,
    ry: 10.2,
    fill: EYE_WHITE,
    iris: { r: 7.2, color: "#4a7a3a" },
    pupil: { r: 3.4 },
    shine: 3,
    lid: c.pal.skin,
    rim: { color: INK, w: 2.6, lashes: 3 },
    closed: INK,
    browY: 17,
    brow,
    rest: { raise: 3, browTilt: 4 },
  };
  const base = eyesOf(st);
  return (a) => {
    const { x, y, s } = a;
    const b = (raise: number, tilt: number) => brow({ x, y: y - st.browY, s, raise, tilt });
    /* lashes flick off a closed eye's outer end */
    const lashes = (ex: number, ey: number) => (
      <path d={`M${ex} ${ey} l${s * 3.6} -2.6 M${ex - s * 1} ${ey - 1.8} l${s * 2.6} -3.4`} {...line(INK, 2)} />
    );
    const closed = (w: number, h: number) => g2(shut(arcUp(x, y + 1.6, w, h), 2.8), lashes(x + s * w, y + 1.6 + h * 0.5));
    switch (a.mood) {
      case "happy":
        return g2(closed(8, 4.4), b(5, 0));
      case "wink":
        return s === 1 ? g2(closed(8, 4.4), b(0, -6)) : as(base, a, "neutral");
      case "oops":
        return g2(shut(chevron(x, y, s, 6.4, 5), 2.8), lashes(x + s * 6.4, y - 5), b(6, 18));
      default:
        return base(a);
    }
  };
}

/** Each shortlisted character's proposed eyes, by the studio drawing's id. */
export const EYES: Record<string, (c: Candidate) => EyeKit> = {
  "more-otto": ottoEyes,
  "cand-ada": adaEyes,
  "more-haru": haruEyes,
  "people-grace": graceEyes,
  "cand-kai": kaiEyes,
  "more-sofia": sofiaEyes,
};

/** A candidate with its proposed eyes, drawn with its own skin and hair. */
export function withEyes(c: Candidate, from: string): Candidate {
  const kit = EYES[from];
  return kit ? { ...c, face: { ...c.face, kit: kit(c) } } : c;
}

/** One line per character on what its eyes became. */
export const EYE_NOTES: Record<string, ReactNode> = {
  "more-otto": "Small dark bead eyes, no whites, under bushy white brows; happy squeezes them shut",
  "cand-ada": "Smiling crescents with laughter crinkles; happy is a deeper crescent",
  "more-haru": "Round and wide with small irises behind his glasses, thick straight brows; oops shrinks the pupils",
  "people-grace": "Almond eyes under heavy lids with a wing, thin arched brows; happy is a knowing half-close",
  "cand-kai": "Flat-topped and half-lidded, short straight brows; happy is lopsided, oops deadpan",
  "more-sofia": "Big round green eyes with long lashes, kept when they close",
};
