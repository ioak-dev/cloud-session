"use client";

import * as React from "react";

import { antennaTip, flameTip, WispTurn, type ArmPose, type ArmsTo, type Mouth } from "./wisp-turn";

/**
 * Wisp's moments around signing in (proposals): three reactions each for a sign-in that did not
 * match, a sign-in that worked, and a new account. Like the blanket at the password, every one
 * comes from Wisp's own body — its lantern, sparks, ribbons, antennae and the light it casts —
 * never a prop.
 *
 * Each plays on a small sign-in card, lit as the lit form proposes, and loops. A reaction is
 * declared keyframes: every frame is a pure function of one loop clock (`key` tracks), as the
 * flight is. Under reduced motion each holds one still frame: its peak.
 *
 * Wisp's rules say it never reacts to whether an entry is valid, and that it appears only on the
 * sign-up form. These answer a server's reply, and two of them play on a sign-in form, so
 * choosing any of them changes those rules (`docs/cast.md`).
 */

/* ——— the stage ——— */

const W = 330;
const H = 250;
const SIZE = { w: 46, h: 62 };
const VIEW = "-10 20 220 280";
const K = SIZE.w / 220;
const CARD = { x: 66, y: 28, w: 254, h: 210 };
/** Rows inside the card, px from its top: title, answer, the two fields, the button. */
const ROW = { title: 14, answer: 36, email: 56, user: 72, password: 108, pass: 124, button: 168, field: 30 };
/** Wisp's box, resting beside each row of the card: the username, the password, the button. */
const AT = {
  user: CARD.y + ROW.user + ROW.field / 2 - 26,
  pass: CARD.y + ROW.pass + ROW.field / 2 - 26,
};
const GX = 10;
const GLOW = "#ffcf4a";
const SPARK_LIFE = 650;
const LOOP_REST = 900;

/* ——— declared keyframes ——— */

type Ease = "io" | "out" | "in" | "back" | "lin" | "hold";
const EASE: Record<Ease, (p: number) => number> = {
  io: (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2),
  out: (p) => 1 - (1 - p) ** 3,
  in: (p) => p * p * p,
  /* overshoot and settle */
  back: (p) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2,
  lin: (p) => p,
  hold: () => 0,
};
/** A track: [time ms, value, easing into this key]. Before the first key it holds the first. */
type Key = [number, number, Ease?];
function key(t: number, ...k: Key[]): number {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    const [t1, v1, e = "io"] = k[i];
    const [t0, v0] = k[i - 1];
    if (t <= t1) return v0 + (v1 - v0) * EASE[e]((t - t0) / (t1 - t0 || 1));
  }
  return k[k.length - 1][1];
}
const on = (t: number, a: number, b: number) => t >= a && t < b;
const wave = (t: number, ms: number, phase = 0) => Math.sin((t / ms) * Math.PI * 2 + phase);

/** A hop between rows, bowed out through the gutter: as the form's hop. */
function hop(t: number, t0: number, dur: number, from: number, to: number) {
  const p = Math.min(1, Math.max(0, (t - t0) / dur));
  const settle = p > 0.72 ? 0.05 * Math.sin((Math.PI * (p - 0.72)) / 0.28) : 0;
  const y = from + (to - from) * (EASE.io(p) + settle);
  const bow = -12 * Math.sin(Math.PI * p);
  const gather = p > 0 && p < 0.14 ? Math.sin((Math.PI * p) / 0.14) : 0;
  return { y, x: GX + bow, gather, arc: Math.sin(Math.PI * p), moving: p > 0 && p < 1 };
}

/* ——— arm poses: [outward, height, forward] on the right; the left mirrors ——— */

const POSE = {
  cup: { elbow: [34, 196, 10], hand: [20, 230, 24] },
  scratch: { elbow: [48, 128, 0], hand: [44, 82, 8] },
  shrug: { elbow: [34, 172, 6], hand: [46, 166, 14] },
  stretch: { elbow: [46, 128, 0], hand: [64, 96, 0] },
  cheer: { elbow: [38, 126, 6], hand: [42, 82, 8] },
  wave: { elbow: [44, 140, 6], hand: [50, 104, 10] },
  sweep: { elbow: [42, 182, 8], hand: [62, 198, 12] },
  across: { elbow: [26, 182, 14], hand: [-4, 186, 26] },
  present: { elbow: [36, 180, 8], hand: [52, 188, 16] },
  tie: { elbow: [40, 112, 4], hand: [14, 48, 10] },
  pull: { elbow: [36, 104, 6], hand: [30, 46, 12] },
} satisfies Record<string, ArmPose>;

/* ——— a frame ——— */

type Frame = {
  /** Wisp's box in the stage, px. */
  x: number;
  y: number;
  yaw: number;
  head?: number;
  look?: number;
  lookX?: number;
  /** Wing beat: 0.35 at rest, 1 in flight, more when flung. */
  beat?: number;
  sx?: number;
  sy?: number;
  rot?: number;
  shut?: number;
  shutAs?: "happy" | "sleep";
  wink?: number;
  mouth?: Mouth;
  glow?: number;
  armsTo?: ArmsTo;
  knot?: number;
  curl?: number;
  bow?: number;
  blanket?: number;
  wiggle?: number;
  tips?: readonly [number, number];
  tipBob?: readonly [number, number];
  hug?: number;
  /** Sparks are left behind on this frame. */
  trail?: boolean;
};

/** What the server answered: no match, signed in (big or quiet), a new account, a workspace. */
export type Event = "error" | "signin" | "quiet" | "signup" | "workspace";
type Moment = {
  id: string;
  event: Event;
  label: string;
  note: string;
  /** The act's length, ms; the loop rests a beat after it. */
  dur: number;
  /** The frame held under reduced motion. */
  still: number;
  /** When the server's answer lands, ms: the card shows it from here. */
  answer: number;
  at: (t: number) => Frame;
  /** Anything the act leaves in the stage beyond Wisp and its sparks: smoke, lamps, a star. */
  fx?: (t: number, uid: string) => React.ReactNode;
  /** Extra light on the card, 0–1, from a point (the housewarming). */
  wash?: (t: number) => { x: number; y: number; r: number; o: number } | null;
  /** Pools of light left lit (the lamplighter). */
  lamps?: (t: number) => { x: number; y: number; o: number }[];
  /** Draw `fx` over Wisp rather than under it (a spark held in its hands). */
  fxFront?: boolean;
};

const rest = (t: number, y: number): Frame => ({ x: GX, y: y + 2 * Math.sin(t / 600), yaw: 28, lookX: 1 });

/* ——— a sign-in that did not match ——— */

const FIZZLE: Moment = {
  id: "fizzle",
  event: "error",
  label: "Fizzle",
  note: "Its lantern sputters like a match that didn't catch and puffs a little smoke. It blinks at its tail, cups the flame and blows; it catches with a flare, and it hops back to the username.",
  dur: 3600,
  still: 1700,
  answer: 250,
  at: (t) => {
    const h = hop(t, 2750, 520, AT.pass, AT.user);
    const glow = key(t, [300, 1], [380, 0.4, "lin"], [450, 0.9, "lin"], [520, 0.25, "lin"], [600, 0.6, "lin"], [720, 0.08, "out"], [1500, 0.08], [1650, 0.3], [1750, 0.15], [1900, 0.35], [2050, 1.6, "back"], [2400, 1]);
    const blow = on(t, 1500, 2050);
    return {
      ...rest(t, t < 2750 ? AT.pass : h.y),
      x: t < 2750 ? GX : h.x,
      yaw: key(t, [380, 28], [700, 8], [2500, 8], [2750, 28]),
      look: key(t, [380, 0], [600, 5], [2200, 5], [2400, 0]),
      lookX: key(t, [380, 1], [600, 0], [2400, 0], [2600, 1]),
      shut: key(t, [760, 0], [820, 1, "lin"], [900, 0, "lin"], [2250, 0], [2350, 1], [2650, 1], [2750, 0]),
      mouth: on(t, 720, 1100) || blow ? "o" : on(t, 2100, 2750) ? "grin" : "smile",
      glow,
      armsTo: { l: POSE.cup, r: POSE.cup, w: key(t, [1100, 0], [1450, 1], [2200, 1], [2550, 0]) },
      rot: blow ? -4 : 0,
      sx: blow ? 1 + 0.03 * (wave(t, 160) + 1) : 1,
      sy: h.moving ? 1 - 0.08 * h.gather + 0.05 * h.arc : key(t, [2050, 1], [2150, 1.06, "out"], [2300, 1]),
      beat: h.moving ? 1 : 0.35,
      trail: h.moving,
    };
  },
  fx: (t) => {
    /* the puff of smoke from the lantern, rising and spreading as it fades */
    if (!on(t, 700, 1700)) return null;
    const p = (t - 700) / 1000;
    const [fx, fy] = flameTip(8);
    const x0 = GX + (fx + 10) * K;
    const y0 = AT.pass + (fy - 20) * K;
    return [0, 1, 2].map((i) => (
      <circle
        key={i}
        cx={x0 + (i - 1) * 4 + 6 * p * (i - 1)}
        cy={y0 - 4 - 22 * p - i * 5}
        r={2.4 + 4 * p + i}
        fill="var(--char-tint)"
        opacity={0.55 * (1 - p)}
      />
    ));
  },
};

const KNOT: Moment = {
  id: "knot",
  event: "error",
  label: "Ribbon knot",
  note: "Its ribbons tie themselves in a knot behind it, as if the strands didn't match. It looks over its shoulder, wriggles, and the knot pops loose with a boing; a sheepish shrug, and back to the username.",
  dur: 3800,
  still: 1500,
  answer: 250,
  at: (t) => {
    const h = hop(t, 3000, 520, AT.pass, AT.user);
    const wriggle = on(t, 1300, 2100);
    return {
      ...rest(t, t < 3000 ? AT.pass : h.y),
      x: (t < 3000 ? GX : h.x) + (wriggle ? 1.2 * wave(t, 90) : 0),
      yaw: key(t, [800, 28], [1150, 62], [2300, 62], [2600, 0], [2900, 0], [3050, 28]),
      head: key(t, [800, 28], [1050, -30], [2300, -30], [2500, 0], [2900, 0], [3050, 28]),
      lookX: key(t, [800, 1], [1050, -4], [2300, -4], [2500, 0], [3000, 0], [3100, 1]),
      knot: key(t, [300, 0], [700, 1, "back"], [2100, 1], [2250, -0.3, "out"], [2600, 0, "back"]),
      mouth: on(t, 400, 900) ? "o" : on(t, 900, 2100) ? "wobble" : on(t, 2250, 2600) ? "grin" : on(t, 2600, 3000) ? "wobble" : "smile",
      rot: wriggle ? 7 * wave(t, 180) : 0,
      sy: key(t, [300, 1], [380, 0.92, "out"], [520, 1, "back"], [2600, 1], [2700, 1.04], [2900, 1]),
      y: (t < 3000 ? AT.pass : h.y) + key(t, [2600, 0], [2700, -3, "out"], [2900, 0]),
      armsTo: { l: POSE.shrug, r: POSE.shrug, w: key(t, [2550, 0], [2700, 1, "back"], [2850, 1], [3000, 0]) },
      beat: on(t, 2100, 2700) ? 1.6 : h.moving || wriggle ? 1 : 0.35,
      trail: h.moving,
    };
  },
  fx: (t) => {
    /* the boing: a ring of four sparks where the knot was */
    if (!on(t, 2120, 2700)) return null;
    const p = (t - 2120) / 580;
    const cx = GX + 20;
    const cy = AT.pass + 44;
    return [0, 1, 2, 3].map((i) => {
      const a = (i / 4) * Math.PI * 2 + 0.6;
      return <circle key={i} cx={cx + Math.cos(a) * 14 * p} cy={cy + Math.sin(a) * 14 * p} r={1.8 * (1 - p) + 0.4} fill={GLOW} stroke="var(--char-glow-edge)" strokeWidth={0.5} opacity={1 - p} />;
    });
  },
};

const QUERY: Moment = {
  id: "query",
  event: "error",
  label: "Question mark",
  note: "It ducks under its ribbon blanket to the nose. One antenna curls into a question mark and the other hand scratches its head; then it pops out, ready to try again, and hops back to the username.",
  dur: 3800,
  still: 1700,
  answer: 250,
  at: (t) => {
    const h = hop(t, 3000, 520, AT.pass, AT.user);
    const scratching = on(t, 1500, 2300);
    return {
      ...rest(t, t < 3000 ? AT.pass : h.y),
      x: t < 3000 ? GX : h.x,
      y: (t < 3000 ? AT.pass : h.y) + key(t, [300, 0], [600, 4], [2350, 4], [2500, -6, "out"], [2750, 0, "back"]),
      yaw: key(t, [300, 28], [600, 6], [2600, 6], [2900, 28]),
      blanket: key(t, [300, 0], [700, 0.38, "back"], [2350, 0.38], [2550, 0, "out"]),
      wiggle: on(t, 700, 2350) ? 1.5 * wave(t, 300) : 0,
      curl: key(t, [800, 0], [1300, 1, "back"], [2350, 1], [2700, 0, "back"]),
      look: key(t, [800, 0], [1100, -4], [2350, -4], [2500, 0]),
      lookX: key(t, [800, 1], [1100, 3], [2350, 3], [2500, 1]),
      armsTo: {
        l: { ...POSE.scratch, hand: [44, 82 + (scratching ? 4 * wave(t, 220) : 0), 8] },
        w: key(t, [1300, 0], [1550, 1], [2300, 1], [2500, 0]),
      },
      mouth: on(t, 2400, 3000) ? "grin" : "smile",
      shut: key(t, [2450, 0], [2550, 1], [2800, 1], [2900, 0]),
      beat: on(t, 2350, 2700) ? 1.4 : h.moving ? 1 : 0.35,
      trail: h.moving,
    };
  },
};

/* ——— a sign-in that worked ——— */

const CODE: Moment = {
  id: "code",
  event: "signin",
  label: "Firefly code",
  note: "Fireflies know each other by their flashes. Wisp turns to you and flashes its own pattern — blink, blink, pause, blink — like a secret knock between old friends, then beams and waves.",
  dur: 3600,
  still: 1900,
  answer: 250,
  at: (t) => {
    const flash = (at: number, long = false) => (t >= at ? Math.max(0, 1 - (t - at) / (long ? 420 : 240)) ** 1.5 : 0) * (t >= at - 80 ? Math.min(1, (t - at + 80) / 80) : 0);
    const dim = on(t, 850, 2300) ? 0.35 : 1;
    const glow = t < 850 ? key(t, [600, 1], [850, 0.35]) : t < 2300 ? dim + 2 * (flash(1000) + flash(1350) + flash(1900, true)) : key(t, [2300, 0.35], [2500, 1.2, "back"], [2700, 1]);
    return {
      ...rest(t, AT.pass),
      yaw: key(t, [350, 28], [750, 0]),
      head: key(t, [300, 28], [650, 0]),
      lookX: key(t, [350, 1], [650, 0]),
      glow,
      shut: key(t, [2300, 0], [2400, 1], [3100, 1], [3250, 0]),
      mouth: t > 2300 ? "grin" : "smile",
      y: AT.pass + 2 * Math.sin(t / 600) + key(t, [2300, 0], [2420, -5, "out"], [2650, 0, "back"]),
      armsTo: { r: { ...POSE.wave, hand: [50 + 6 * wave(t, 260), 104, 10] }, w: key(t, [2450, 0], [2650, 1], [3150, 1], [3400, 0]) },
    };
  },
};

const WAKE: Moment = {
  id: "wake",
  event: "signin",
  label: "Woken up",
  note: "Waiting for you, it has dozed off under its ribbons — a little ghost, slowly breathing, its lantern low. It startles awake (“oh! you're back!”), throws the ribbons off and stretches wide.",
  dur: 4200,
  still: 2650,
  answer: 1550,
  at: (t) => {
    const asleep = t < 1600;
    return {
      ...rest(t, AT.pass),
      yaw: key(t, [1600, 6], [2900, 6], [3200, 0]),
      blanket: key(t, [1650, 1], [1850, 0, "out"]),
      wiggle: 0,
      sx: asleep ? 1 + 0.02 * wave(t, 1600) : key(t, [1600, 1], [1700, 0.9, "out"], [1950, 1], [2250, 1], [2320, 1.1, "out"], [2500, 1, "back"]),
      sy: asleep ? 1 + 0.035 * wave(t, 1600) : key(t, [1600, 1], [1700, 1.12, "out"], [1950, 1], [2250, 1], [2320, 0.88, "out"], [2500, 1, "back"]),
      y: AT.pass + 2 * Math.sin(t / 600) + key(t, [1600, 0], [1760, -16, "out"], [2050, -16], [2300, 0, "in"], [3000, 0], [3100, -5, "out"], [3300, 0, "back"]),
      glow: asleep ? 0.35 + 0.1 * wave(t, 1600) : key(t, [1600, 0.4], [1700, 1.5, "out"], [2000, 1]),
      shut: asleep ? 1 : key(t, [1600, 1], [1660, 0, "lin"], [2600, 0], [2700, 1], [2950, 1], [3050, 0]),
      shutAs: asleep ? "sleep" : "happy",
      mouth: on(t, 1600, 2000) ? "o" : on(t, 2300, 2650) ? "o" : t >= 2650 ? "grin" : "smile",
      armsTo: { l: POSE.stretch, r: POSE.stretch, w: key(t, [2300, 0], [2550, 1, "back"], [2850, 1], [3050, 0]) },
      beat: on(t, 1650, 2100) ? 1.7 : asleep ? 0 : 0.35,
    };
  },
  fx: (t) => {
    /* asleep, a mote of its own light drifts up now and then: a firefly's snore */
    if (t > 1600) return null;
    return [0, 1].map((i) => {
      const p = ((t + i * 800) % 1600) / 1600;
      return <circle key={i} cx={GX + 30 + 6 * p} cy={AT.pass + 4 - 22 * p} r={1.6 + p} fill={GLOW} opacity={0.7 * Math.sin(Math.PI * p)} />;
    });
  },
};

/** The lamplighter's way along the top of the card: where it rises, flies and bows. */
const LAMP_Y = 6;
const LAMPS = [96, 150, 204, 258];
const lampX = (t: number) => key(t, [650, GX], [1150, 60, "in"], [1850, 266, "lin"], [2050, 274, "out"]);
const LAMP: Moment = {
  id: "lamp",
  event: "signin",
  label: "Lamplighter",
  note: "It zips ahead along the card and lights the way, as if turning on the lamps down a hallway: each spot it passes stays lit a while. At the far end it turns to you and bows you through.",
  dur: 4600,
  still: 2600,
  answer: 250,
  at: (t) => {
    const flying = on(t, 650, 2050);
    const bowing = on(t, 2400, 3000);
    return {
      x: lampX(t),
      y: key(t, [650, AT.pass], [1150, LAMP_Y, "out"]) + (flying ? 0 : 2 * Math.sin(t / 600)) + (bowing ? key(t, [2400, 0], [2550, 5], [2850, 5], [3000, 0]) : 0),
      yaw: key(t, [300, 28], [650, 90], [2050, 90], [2400, 0]),
      head: key(t, [250, 28], [550, 90], [1950, 90], [2300, 0]),
      look: bowing ? 5 : 0,
      sy: key(t, [550, 1], [640, 0.92, "out"], [760, 1.04], [900, 1]) * (bowing ? key(t, [2400, 1], [2550, 0.92], [2850, 0.92], [3000, 1]) : 1),
      armsTo: { l: POSE.across, r: POSE.sweep, w: key(t, [2350, 0], [2550, 1], [2900, 1], [3100, 0]) },
      shut: key(t, [2550, 0], [2650, 1], [3200, 1], [3300, 0]),
      mouth: t > 2400 ? "grin" : "smile",
      beat: flying ? 1 : 0.35,
      trail: flying,
    };
  },
  lamps: (t) =>
    LAMPS.map((x) => {
      /* lit as the lantern passes; it stays lit, then fades slowly */
      const passed = lampTime(x);
      if (t < passed) return { x, y: 0, o: 0 };
      const age = t - passed;
      return { x: x + 24, y: LAMP_Y + 52, o: Math.min(1, age / 120) * (age < 1800 ? 1 : Math.max(0, 1 - (age - 1800) / 1400)) };
    }),
};
function lampTime(x: number) {
  for (let t = 650; t <= 2050; t += 10) if (lampX(t) >= x) return t;
  return 2050;
}

/* ——— a new account ——— */

const STAR = { x: 226, y: 158, r: 38 };
const LOOP = { x: 218, y: 158, r: 48 };
/** The ten points of a five-pointed star, outer and inner by turns, from the top. */
const STAR_PTS = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const r = i % 2 ? STAR.r * 0.45 : STAR.r;
  return [STAR.x + r * Math.cos(a), STAR.y + r * Math.sin(a)] as const;
});
const loopAt = (t: number) => {
  const p = key(t, [800, 0], [1700, 1, "io"]);
  const a = Math.PI + p * Math.PI * 2;
  return { x: LOOP.x + LOOP.r * Math.cos(a) - SIZE.w / 2, y: LOOP.y - LOOP.r * Math.sin(a) - SIZE.h / 2, p };
};
const tipOf = (f: { x: number; y: number }, yaw = 0) => {
  const [fx, fy] = flameTip(yaw);
  return [f.x + (fx + 10) * K, f.y + (fy - 20) * K] as const;
};
const STAR_BORN = STAR_PTS.map((_, i) => 820 + i * 88);

const CONSTELLATION: Moment = {
  id: "constellation",
  event: "signup",
  label: "Constellation",
  note: "It flies one loop, and this time its sparks hang in the air instead of falling. They draw together into a small star that twinkles once and fades: a mark for the start, in its own light.",
  dur: 4600,
  still: 2700,
  answer: 250,
  at: (t) => {
    const l = loopAt(t);
    const watch = { x: 110, y: 128 };
    const x = t < 800 ? key(t, [300, GX], [800, l.x, "in"]) : t < 1700 ? l.x : key(t, [1700, l.x], [2100, watch.x, "out"]);
    const y = t < 800 ? key(t, [300, AT.pass], [800, l.y, "in"]) : t < 1700 ? l.y : key(t, [1700, l.y], [2100, watch.y, "out"]);
    return {
      x,
      y: y + (t > 2100 ? 2 * Math.sin(t / 600) : 0),
      yaw: key(t, [300, 28], [700, 70], [1700, 70], [2100, 34]),
      head: key(t, [250, 28], [600, 70], [1650, 70], [2000, 40]),
      rot: on(t, 800, 1700) ? -360 * l.p : 0,
      lookX: t > 2100 ? 4 : 0,
      look: t > 2100 ? -2 : 0,
      shut: key(t, [2200, 0], [2300, 1], [2700, 1], [2800, 0]),
      mouth: t > 2200 ? "grin" : "smile",
      armsTo: { l: POSE.cheer, r: POSE.cheer, w: key(t, [2150, 0], [2350, 1, "back"], [2700, 1], [2950, 0]) },
      beat: on(t, 300, 2100) ? 1 : 0.35,
    };
  },
  fx: (t) => {
    if (t < 820) return null;
    const lines = key(t, [2150, 0], [2450, 0.7], [3300, 0.7], [3900, 0]);
    const fade = key(t, [3300, 1], [3900, 0]);
    const pts = STAR_PTS.map(([sx, sy], i) => {
      const born = STAR_BORN[i];
      if (t < born) return null;
      /* hung where it was left, then drawn to its place in the star */
      const [bx, by] = tipOf(loopAt(born), 70);
      const m = key(t, [1700, 0], [2200, 1, "io"]);
      const twinkle = on(t, 2450, 3300) ? 1 + 0.45 * Math.max(0, wave(t - i * 60, 500)) : 1;
      return { x: bx + (sx - bx) * m, y: by + (sy - by) * m, r: (i % 2 ? 1.5 : 2.2) * twinkle };
    });
    const live = pts.filter(Boolean) as { x: number; y: number; r: number }[];
    return (
      <g opacity={fade}>
        {lines > 0 && (
          <polygon
            points={STAR_PTS.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={GLOW}
            strokeWidth={0.8}
            strokeLinejoin="round"
            opacity={lines}
          />
        )}
        {live.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r * 2.4} fill={GLOW} opacity={0.3} />
            <circle cx={p.x} cy={p.y} r={p.r} fill={GLOW} stroke="var(--char-glow-edge)" strokeWidth={0.6} />
          </g>
        ))}
      </g>
    );
  },
};

const BOW: Moment = {
  id: "bow",
  event: "signup",
  label: "Ribbon bow",
  note: "It ties its ribbons into a big bow on top of its head, like a present (“I'm all yours”), and holds it with a wink. Then it pulls one end: the bow falls away into a twirl.",
  dur: 4400,
  still: 1700,
  answer: 250,
  at: (t) => {
    const spin = key(t, [2350, 0], [3100, 360, "io"]);
    return {
      ...rest(t, AT.pass),
      x: key(t, [300, GX], [650, 34, "out"]),
      y: AT.pass + 2 * Math.sin(t / 600) + key(t, [300, 0], [480, -8, "out"], [650, -4, "back"]),
      yaw: key(t, [300, 28], [650, 0]) + spin,
      head: key(t, [250, 28], [600, 0]) + key(t, [2300, 0], [3050, 360, "io"]),
      bow: key(t, [700, 0], [1250, 1, "back"], [2300, 1], [2600, 0, "out"]),
      armsTo:
        t < 1400
          ? { l: POSE.tie, r: POSE.tie, w: key(t, [600, 0], [900, 1], [1150, 1], [1400, 0]) }
          : t < 2000
            ? { l: POSE.present, r: POSE.present, w: key(t, [1400, 0], [1600, 1, "back"], [1850, 1], [2000, 0]) }
            : { r: POSE.pull, w: key(t, [2000, 0], [2250, 1], [2350, 1], [2600, 0]) },
      wink: key(t, [1450, 0], [1550, 1], [1900, 1], [2000, 0]),
      rot: on(t, 1400, 2000) ? key(t, [1400, 0], [1550, 7], [1900, 7], [2000, 0]) : 0,
      mouth: on(t, 1400, 2000) || t > 3100 ? "grin" : "smile",
      shut: key(t, [3100, 0], [3200, 1], [3700, 1], [3800, 0]),
      beat: on(t, 2350, 3100) ? 1.5 : 0.35,
      trail: on(t, 2400, 3050),
    };
  },
};

const BUTTON = { x: CARD.x + 18, y: CARD.y + ROW.button, w: 132, h: 28 };
const WARM: Moment = {
  id: "housewarming",
  event: "signup",
  label: "Housewarming",
  note: "It hops over to the button and touches the tip of its flame to it, as you light a wick. The light swells across the whole card — the lights coming on in your new place — then settles to a glow.",
  dur: 4400,
  still: 1500,
  answer: 250,
  at: (t) => {
    const over = { x: 98, y: BUTTON.y - 60 };
    const h = hop(t, 300, 560, AT.pass, over.y);
    return {
      x: t < 300 ? GX : key(t, [300, GX], [860, over.x, "io"]),
      y: (t < 860 ? h.y : over.y + key(t, [900, 0], [1150, 9, "in"], [1300, 9], [1600, -6, "back"], [1900, 0])) + (t > 1900 ? 2 * Math.sin(t / 600) : 0),
      yaw: key(t, [300, 28], [860, 0]),
      look: key(t, [860, 0], [1000, 5], [1300, 5], [1450, 0]),
      glow: key(t, [1000, 1], [1150, 1.6, "out"], [1500, 1.2], [2200, 1]),
      armsTo: { l: POSE.cheer, r: POSE.cheer, w: key(t, [1350, 0], [1600, 1, "back"], [2300, 1], [2600, 0]) },
      shut: key(t, [1400, 0], [1500, 1], [2100, 1], [2200, 0]),
      mouth: t > 1300 ? "grin" : "smile",
      sy: h.moving ? 1 - 0.08 * h.gather + 0.05 * h.arc : key(t, [1150, 1], [1200, 0.9, "out"], [1400, 1, "back"]),
      beat: h.moving ? 1 : 0.35,
      trail: h.moving,
    };
  },
  wash: (t) => {
    if (t < 1150) return null;
    const r = key(t, [1150, 10], [1900, 300, "out"]);
    const o = key(t, [1150, 0], [1300, 1], [2600, 0.9], [3600, 0.4]);
    return { x: BUTTON.x + 34, y: BUTTON.y, r, o };
  },
};

/* ——— signed in, quieter: Wisp and its own light, no travel ——— */

/** Where things on Wisp are in the stage, for a frame: its lantern, an antenna tip. */
const lanternOf = (f: Frame) => {
  const [fx] = flameTip(f.yaw);
  return [f.x + (fx - 4 + 10) * K, f.y + (236 - 20) * K] as const;
};
const tipAt = (f: Frame, side: -1 | 1) => {
  const [ax, ay] = antennaTip(side, f.head ?? f.yaw);
  return [f.x + (ax + 10) * K, f.y + (ay - 20) * K] as const;
};
/** A twinkle: a four-pointed glint in the glow's colour. */
function Twinkle({ x, y, s, o }: { x: number; y: number; s: number; o: number }) {
  const a = 6 * s;
  const b = 1.4 * s;
  return (
    <path
      d={`M${x} ${y - a} L${x + b} ${y - b} L${x + a} ${y} L${x + b} ${y + b} L${x} ${y + a} L${x - b} ${y + b} L${x - a} ${y} L${x - b} ${y - b} Z`}
      fill={GLOW}
      stroke="var(--char-glow-edge)"
      strokeWidth={0.5}
      opacity={o}
    />
  );
}
/** A repeatable scatter: the same “random” for the same index every loop. */
const hash = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const HELLO: Moment = {
  id: "antenna-hello",
  event: "quiet",
  label: "Antenna hello",
  note: "It turns to you and its antenna tips light up one after the other, left then right, and bob like a little wave; a small hop and a smile.",
  dur: 2600,
  still: 1150,
  answer: 250,
  at: (t) => {
    const lit = (at: number) => key(t, [at, 0], [at + 120, 1, "out"], [at + 900, 1], [at + 1200, 0]);
    const nod = (at: number) => (on(t, at, at + 900) ? 7 * Math.sin(((t - at) / 900) * Math.PI) * wave(t - at, 300) : 0);
    return {
      ...rest(t, AT.pass),
      y: AT.pass + 2 * Math.sin(t / 600) + key(t, [1150, 0], [1270, -5, "out"], [1470, 0, "back"]),
      yaw: key(t, [300, 28], [600, 0]),
      head: key(t, [250, 28], [520, 0]),
      lookX: key(t, [300, 1], [520, 0]),
      tips: [lit(600), lit(850)],
      tipBob: [nod(650), nod(900)],
      mouth: t > 900 ? "grin" : "smile",
      shut: key(t, [1350, 0], [1450, 1], [1850, 1], [1950, 0]),
      sy: key(t, [1100, 1], [1150, 0.95, "out"], [1270, 1.03], [1470, 1]),
    };
  },
};

const HUG: Moment = {
  id: "ribbon-hug",
  event: "quiet",
  label: "Ribbon hug",
  note: "It wraps its ribbons round itself for a moment, a hug for itself, and squeezes; its lantern glows a little warmer. Then it lets go with a happy sigh.",
  dur: 2800,
  still: 1300,
  answer: 250,
  at: (t) => {
    const hug = key(t, [600, 0], [950, 1, "back"], [1750, 1], [2050, 0, "out"]);
    return {
      ...rest(t, AT.pass),
      y: AT.pass + 2 * Math.sin(t / 600) + key(t, [2000, 0], [2150, 2], [2400, 0]),
      yaw: key(t, [300, 28], [600, 0]),
      head: key(t, [250, 28], [520, 0]),
      lookX: key(t, [300, 1], [520, 0]),
      hug,
      armsTo: { l: POSE.across, r: POSE.across, w: hug },
      sx: key(t, [950, 1], [1050, 0.94, "out"], [1250, 1], [1350, 0.95, "out"], [1550, 1]),
      rot: on(t, 1000, 1700) ? 3 * wave(t, 700) : 0,
      glow: key(t, [900, 1], [1300, 1.45], [1800, 1.2], [2200, 1]),
      shut: key(t, [900, 0], [1000, 1], [1900, 1], [2000, 0]),
      mouth: on(t, 2000, 2250) ? "o" : t > 900 ? "grin" : "smile",
      beat: hug > 0.3 ? 0 : 0.35,
    };
  },
};

const WINK: Moment = {
  id: "spark-wink",
  event: "quiet",
  label: "Spark wink",
  note: "It winks, and one spark pops off its flame, drifts up past its face, twinkles once and is gone.",
  dur: 2600,
  still: 1700,
  answer: 250,
  at: (t) => ({
    ...rest(t, AT.pass),
    yaw: key(t, [300, 28], [600, 10]),
    head: key(t, [250, 28], [520, 10]),
    lookX: key(t, [300, 1], [520, 1], [1200, 1], [1500, 3]),
    look: key(t, [1200, 0], [1500, -4], [2000, -4], [2200, 0]),
    wink: key(t, [850, 0], [950, 1], [1400, 1], [1500, 0]),
    mouth: on(t, 850, 1900) ? "grin" : "smile",
    glow: key(t, [900, 1], [960, 1.5, "out"], [1200, 1]),
    sy: key(t, [900, 1], [960, 0.95, "out"], [1150, 1, "back"]),
  }),
  fx: (t) => {
    if (!on(t, 950, 2150)) return null;
    const f = WINK.at(950);
    const [x0, y0] = tipOf(f, f.yaw);
    const p = key(t, [950, 0], [1750, 1, "out"]);
    const x = x0 + 16 * p + 3 * Math.sin(p * 9);
    const y = y0 - 72 * p;
    const tw = key(t, [1700, 0], [1820, 1, "out"], [2050, 0]);
    return (
      <g>
        <circle cx={x} cy={y} r={4.5} fill={GLOW} opacity={0.3 * (1 - tw)} />
        <circle cx={x} cy={y} r={2} fill={GLOW} stroke="var(--char-glow-edge)" strokeWidth={0.6} opacity={1 - tw} />
        {tw > 0 && <Twinkle x={x} y={y} s={0.8 + 1.2 * tw} o={tw} />}
      </g>
    );
  },
};

/* ——— a workspace set up: small bits, with some glow and sparks ——— */

const BEATS = [1100, 1500, 1900];
const HEART: Moment = {
  id: "heartbeat",
  event: "workspace",
  label: "Heartbeat",
  note: "A happy little bounce, then three soft rings of light pulse out from its lantern — ba-dum, ba-dum, ba-dum — and fade.",
  dur: 3000,
  still: 1650,
  answer: 250,
  at: (t) => {
    const pulse = BEATS.reduce((a, b) => a + (t >= b ? Math.exp(-(t - b) / 160) : 0), 0);
    return {
      ...rest(t, AT.pass),
      y: AT.pass + 2 * Math.sin(t / 600) + key(t, [600, 0], [720, -6, "out"], [920, 0, "back"]),
      yaw: key(t, [300, 28], [600, 10]),
      head: key(t, [250, 28], [520, 10]),
      sy: key(t, [560, 1], [600, 0.93, "out"], [720, 1.05], [920, 1]) * (1 + 0.03 * pulse),
      glow: 1 + 0.7 * pulse,
      shut: key(t, [1000, 0], [1100, 1], [2300, 1], [2400, 0]),
      mouth: t > 700 ? "grin" : "smile",
    };
  },
  fx: (t) => {
    const f = HEART.at(1100);
    const [cx, cy] = lanternOf(f);
    return BEATS.map((b) => {
      if (!on(t, b, b + 1000)) return null;
      const p = (t - b) / 1000;
      return (
        <circle
          key={b}
          cx={cx}
          cy={cy}
          r={6 + 38 * EASE.out(p)}
          fill="none"
          stroke={GLOW}
          strokeWidth={1.8 * (1 - p) + 0.3}
          opacity={0.85 * (1 - p)}
        />
      );
    });
  },
};

const SPARKLER: Moment = {
  id: "sparkler",
  event: "workspace",
  label: "Sparkler antennae",
  note: "Its antenna tips fizz with tiny sparks like a pair of sparklers, and it giggles, wiggling, until they fizzle out.",
  dur: 2800,
  still: 1300,
  answer: 250,
  at: (t) => {
    const fizz = key(t, [650, 0], [760, 1, "out"], [1850, 1], [2150, 0]);
    const giggle = on(t, 800, 2000);
    return {
      ...rest(t, AT.pass),
      yaw: key(t, [300, 28], [600, 0]),
      head: key(t, [250, 28], [520, 0]),
      lookX: key(t, [300, 1], [520, 0]),
      look: key(t, [600, 0], [800, -3], [2000, -3], [2200, 0]),
      tips: [fizz, fizz],
      rot: giggle ? 4 * wave(t, 130) : 0,
      x: GX + (giggle ? 0.8 * wave(t, 90) : 0),
      shut: key(t, [850, 0], [950, 1], [1950, 1], [2050, 0]),
      mouth: on(t, 750, 2100) ? "grin" : "smile",
    };
  },
  fx: (t) => {
    if (!on(t, 700, 2300)) return null;
    const f = SPARKLER.at(1000);
    const out: React.ReactNode[] = [];
    for (let i = 0; i < 60; i++) {
      const born = 700 + i * 22;
      const life = 320;
      if (t < born || t > born + life || born > 1950) continue;
      const side: -1 | 1 = i % 2 ? 1 : -1;
      const [x0, y0] = tipAt(f, side);
      const a = -Math.PI / 2 + (hash(i) - 0.5) * 2.6;
      const p = (t - born) / life;
      const d = (8 + 12 * hash(i + 99)) * EASE.out(p);
      out.push(
        <circle key={i} cx={x0 + Math.cos(a) * d} cy={y0 + Math.sin(a) * d + 6 * p * p} r={1.3 * (1 - p) + 0.4} fill={GLOW} stroke="var(--char-glow-edge)" strokeWidth={0.3} opacity={1 - p} />,
      );
    }
    return out;
  },
};

/** Where a kept spark ends up: by the new workspace's name, like the dot of an i. */
const NAME_SPOT = { x: CARD.x + 120, y: CARD.y + ROW.answer - 1 };
const KEEP: Moment = {
  id: "spark-to-keep",
  event: "workspace",
  label: "A spark to keep",
  note: "It cups its hands at its flame, peeks in at a spark it has caught, then opens them and lets the spark float up to the new workspace's name, where it twinkles once.",
  dur: 3400,
  still: 1150,
  answer: 250,
  fxFront: true,
  at: (t) => {
    const cup = key(t, [400, 0], [700, 1], [1500, 1], [1700, 0]);
    return {
      ...rest(t, AT.pass),
      yaw: key(t, [300, 28], [600, 8]),
      head: key(t, [250, 28], [520, 8]),
      look: key(t, [600, 0], [800, 5], [1500, 5], [1800, -4], [2700, -4], [2900, 0]),
      lookX: key(t, [600, 1], [800, 0], [1000, 0], [1150, 2], [1350, 0], [1500, 0], [1800, 4], [2700, 4], [2900, 1]),
      rot: key(t, [900, 0], [1100, -6], [1350, -6], [1500, 0]),
      armsTo: { l: POSE.cup, r: POSE.cup, w: cup },
      mouth: on(t, 1000, 1400) ? "o" : t > 1600 ? "grin" : "smile",
      shut: key(t, [2450, 0], [2550, 1], [2900, 1], [3000, 0]),
    };
  },
  fx: (t) => {
    if (!on(t, 650, 3200)) return null;
    const f = KEEP.at(1000);
    /* in the cupped hands, just in front of the lantern */
    const [hx, hy] = [f.x + (110 + 10) * K, f.y + (226 - 20) * K];
    const p = key(t, [1550, 0], [2450, 1, "io"]);
    const x = hx + (NAME_SPOT.x - hx) * p;
    const y = hy + (NAME_SPOT.y - hy) * p - 26 * Math.sin(Math.PI * p);
    const glowIn = key(t, [650, 0], [850, 1]);
    const tw = key(t, [2450, 0], [2570, 1, "out"], [2850, 0]);
    const fade = key(t, [2850, 1], [3200, 0]);
    return (
      <g opacity={glowIn * fade}>
        <circle cx={x} cy={y} r={6.5 + (t < 1550 ? 1.5 * wave(t, 400) : 0)} fill={GLOW} opacity={0.45} />
        {/* a paler core than the lantern, so it reads in front of it */}
        <circle cx={x} cy={y} r={2.8} fill="#fff6d6" stroke="var(--char-glow-edge)" strokeWidth={0.7} />
        {tw > 0 && <Twinkle x={x} y={y} s={0.8 + 1.2 * tw} o={tw} />}
      </g>
    );
  },
};

export const MOMENTS: Moment[] = [FIZZLE, KNOT, QUERY, CODE, WAKE, LAMP, HELLO, HUG, WINK, CONSTELLATION, BOW, WARM, HEART, SPARKLER, KEEP];

/* ——— the stage ——— */

type Copy = { title: string; button: string; answer: string; fields: readonly [string, string][] };
const SIGN_IN: Copy["fields"] = [
  ["Email", "asha@school.org"],
  ["Password", "•••••••••"],
];
const COPY: Record<Event, Copy> = {
  error: { title: "Sign in", button: "Sign in", answer: "That didn't match. Try again?", fields: SIGN_IN },
  signin: { title: "Sign in", button: "Sign in", answer: "Welcome back, Asha.", fields: SIGN_IN },
  quiet: { title: "Sign in", button: "Sign in", answer: "Welcome back, Asha.", fields: SIGN_IN },
  signup: { title: "Create your account", button: "Create account", answer: "You're in. Welcome to Sparkles.", fields: SIGN_IN },
  workspace: {
    title: "Set up your workspace",
    button: "Create workspace",
    answer: "Year 8 Science is ready.",
    fields: [
      ["Workspace name", "Year 8 Science"],
      ["Who it's for", "A class"],
    ],
  },
};

function useLoop(len: number, reduce: boolean) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      setT((now - t0) % len);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [len, reduce]);
  return t;
}

function MomentStage({ m }: { m: Moment }) {
  const uid = React.useId().replace(/:/g, "");
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  const len = m.dur + LOOP_REST;
  const clock = useLoop(len, reduce);
  const t = reduce ? m.still : clock;
  const f = m.at(t);
  /* the loop comes round with a short fade, not a jump */
  const fadeIn = reduce ? 1 : Math.min(1, t / 200);
  const fadeOut = reduce ? 1 : Math.min(1, (len - t) / 250);
  const vis = Math.min(fadeIn, fadeOut);
  const copy = COPY[m.event];
  const answered = t >= m.answer;
  const success = m.event !== "error" && answered;

  const [lx, ly] = tipOf(f, f.yaw);
  const lamp = Math.max(0, f.glow ?? 1);
  const light = Math.min(1.6, 0.75 * lamp);
  const reach = 120 * (0.85 + 0.15 * Math.min(lamp, 1.6));

  /* sparks: every 70 ms of a frame that leaves a trail, falling and fading as the form's do */
  const sparks: { x: number; y: number; age: number; r: number }[] = [];
  if (!reduce)
    for (let k = Math.max(0, Math.floor((t - SPARK_LIFE) / 70)); k * 70 <= t; k++) {
      const tk = k * 70;
      const fk = m.at(tk);
      if (!fk.trail) continue;
      const [sx, sy] = tipOf(fk, fk.yaw);
      sparks.push({ x: sx, y: sy, age: (t - tk) / SPARK_LIFE, r: [2.2, 1.6, 2][k % 3] });
    }
  const wash = m.wash?.(t);
  const lamps = m.lamps?.(t) ?? [];

  return (
    <div className="relative overflow-visible" style={{ width: W, height: H }} data-moment={m.id} data-t={Math.round(t)}>
      <div
        className="absolute rounded-[var(--radius)] border border-border bg-card"
        style={{ left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h }}
      >
        <div className="material-heading absolute left-[18px] text-sm text-foreground" style={{ top: ROW.title }}>
          {copy.title}
        </div>
        <div
          className="absolute left-[18px] right-[18px] text-xs text-muted-foreground"
          style={{ top: ROW.answer, opacity: answered && !success ? vis : 0 }}
        >
          {copy.answer}
        </div>
        <div className="transition-opacity duration-300" style={{ opacity: success ? 0 : 1 }}>
          {copy.fields.map(([label, v], i) => [label, i ? ROW.password : ROW.email, i ? ROW.pass : ROW.user, v] as const).map(([label, ly, fy, v]) => (
            <React.Fragment key={label}>
              <span className="instrument absolute left-[18px] text-[11px] text-muted-foreground" style={{ top: ly }}>
                {label}
              </span>
              <div
                className="absolute left-[18px] right-[18px] flex items-center rounded-[var(--radius-control)] border border-border bg-canvas px-2 text-xs text-foreground"
                style={{ top: fy, height: ROW.field }}
              >
                {v}
              </div>
            </React.Fragment>
          ))}
        </div>
        {success && (
          <div className="absolute left-[18px] right-[18px] text-sm text-foreground" style={{ top: ROW.answer + 8, opacity: vis }}>
            {copy.answer}
          </div>
        )}
        <div
          className="absolute flex items-center justify-center rounded-[var(--radius-control)] bg-primary text-xs font-semibold text-primary-foreground"
          style={{ left: BUTTON.x - CARD.x, top: BUTTON.y - CARD.y, width: BUTTON.w, height: BUTTON.h }}
        >
          {copy.button}
        </div>
      </div>

      {/* the light it casts, over the card and the ground, under Wisp */}
      <svg className="pointer-events-none absolute inset-0 overflow-visible" width={W} height={H} aria-hidden style={{ opacity: vis }}>
        <defs>
          <radialGradient id={`${uid}-l`}>
            <stop offset="0" stopColor={GLOW} stopOpacity={1} />
            <stop offset="0.1" stopColor={GLOW} stopOpacity={0.75} />
            <stop offset="0.3" stopColor={GLOW} stopOpacity={0.45} />
            <stop offset="0.55" stopColor={GLOW} stopOpacity={0.2} />
            <stop offset="0.8" stopColor={GLOW} stopOpacity={0.06} />
            <stop offset="1" stopColor={GLOW} stopOpacity={0} />
          </radialGradient>
          <clipPath id={`${uid}-card`}>
            <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={12} />
          </clipPath>
        </defs>
        <g style={{ opacity: "var(--wisp-light-peak)" }}>
          <circle cx={lx} cy={ly} r={reach} fill={`url(#${uid}-l)`} opacity={Math.min(1, light)} />
          {light > 1 && <circle cx={lx} cy={ly} r={reach * 1.3} fill={`url(#${uid}-l)`} opacity={light - 1} />}
          {lamps.map((l, i) => l.o > 0 && <circle key={i} cx={l.x} cy={l.y} r={46} fill={`url(#${uid}-l)`} opacity={0.8 * l.o} />)}
          {wash && (
            <g clipPath={`url(#${uid}-card)`}>
              <circle cx={wash.x} cy={wash.y} r={wash.r} fill={`url(#${uid}-l)`} opacity={wash.o} />
              <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} fill={GLOW} opacity={0.12 * wash.o * Math.min(1, wash.r / 300)} />
            </g>
          )}
          {sparks.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y + 10 * s.age} r={9 * s.r} fill={`url(#${uid}-l)`} opacity={0.5 * (1 - s.age)} />
          ))}
        </g>
      </svg>

      <svg className="pointer-events-none absolute inset-0 overflow-visible" width={W} height={H} aria-hidden style={{ opacity: vis }}>
        {!m.fxFront && m.fx?.(t, uid)}
        {sparks.map((s, i) => (
          <g key={i} opacity={1 - s.age}>
            <circle cx={s.x} cy={s.y + 10 * s.age} r={s.r * 2.4} fill={GLOW} opacity={0.3} />
            <circle cx={s.x} cy={s.y + 10 * s.age} r={s.r * (1 - 0.5 * s.age)} fill={GLOW} stroke="var(--char-glow-edge)" strokeWidth={0.6} />
          </g>
        ))}
      </svg>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SIZE.w,
          height: SIZE.h,
          opacity: vis,
          transformOrigin: "50% 60%",
          transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rot ?? 0}deg) scale(${f.sx ?? 1}, ${f.sy ?? 1})`,
        }}
      >
        <svg viewBox={VIEW} className="h-full w-full overflow-visible">
          <WispTurn
            yaw={f.yaw}
            headYaw={f.head ?? f.yaw}
            look={f.look ?? 0}
            lookX={f.lookX ?? 0}
            flapU={-12 * (f.beat ?? 0.35) * Math.sin((t / 500) * Math.PI * 2)}
            flapL={16 * (f.beat ?? 0.35) * Math.sin((t / 250) * Math.PI * 2 + 1)}
            shut={f.shut ?? 0}
            shutAs={f.shutAs}
            wink={f.wink ?? 0}
            mouth={f.mouth}
            glow={f.glow ?? 1}
            armsTo={f.armsTo}
            knot={f.knot ?? 0}
            curl={f.curl ?? 0}
            bow={f.bow ?? 0}
            tips={f.tips}
            tipBob={f.tipBob}
            hug={f.hug ?? 0}
            blanket={f.blanket ?? 0}
            wiggle={f.wiggle ?? 0}
            uid={`${uid}-w`}
          />
        </svg>
      </div>

      {m.fxFront && (
        <svg className="pointer-events-none absolute inset-0 overflow-visible" width={W} height={H} aria-hidden style={{ opacity: vis }}>
          {m.fx?.(t, uid)}
        </svg>
      )}
    </div>
  );
}

/** One event's three reactions side by side, each looping on its own card. */
export function WispMoments({ event }: { event: Event }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      {MOMENTS.filter((m) => m.event === event).map((m) => (
        <figure key={m.id} className="m-0 flex flex-col gap-2">
          <MomentStage m={m} />
          <figcaption className="max-w-[330px] text-sm">
            <span className="font-semibold text-foreground">{m.label}.</span>{" "}
            <span className="text-muted-foreground">{m.note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
