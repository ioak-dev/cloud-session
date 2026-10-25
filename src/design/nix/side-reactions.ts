/**
 * The session companion's states and their variants (`ui-design-language.md` §9.4.5, *The
 * companion's states* and *Variations*, 2026-10-03). A variant is data on the shared rig
 * (`lib/wisp/rig`): hand targets over time, joint tracks and the faces it wears on its own clock.
 * Hand targets are authored in chibi space and retargeted onto each character's body by the rig,
 * so a move authored on one character can seed the next; a character's own variant is drawn from
 * its temperament and ability. **Drawn so far: Noor** (`DRAWN`) — nearly all hers since 2026-10-04. Every variant ends on a held pose (`end`, `rest`) — the frame reduced
 * motion shows.
 *
 * Selection is the product's (shuffle bag, never the same twice running, never by streak); this file
 * only declares what there is to draw from.
 */
import type { Mood } from "./rig/face";
import type { Grip, GripShape, Grips } from "./rig/grip";
import { arms, EASE, keys, rot, rotAt, type Hands } from "./rig/motion";
import type { Pose } from "./rig/poses";
import { J, reach, type Body, type P } from "./rig/skeleton";

import { castMember, type CastSlug } from "./side-companion";
import type { NoorSceneId } from "./side-noor";

export type ReactionState =
  | "greet"
  | "idle"
  | "attend"
  | "notice"
  | "think"
  | "doze"
  | "anticipate"
  | "correct"
  | "partial"
  | "incorrect"
  | "unlock"
  | "travel";

/** `constants.md` §6.8 — how many variants each state draws from, per character. */
export const REACTION_VARIANTS: Record<ReactionState, number> = {
  greet: 3,
  idle: 1,
  attend: 1,
  notice: 1,
  think: 1,
  doze: 1,
  anticipate: 1,
  correct: 4,
  partial: 2,
  incorrect: 3,
  unlock: 1,
  travel: 1,
};

export const STATE_INFO: { state: ReactionState; title: string; when: string; bound: string }[] = [
  { state: "greet", title: "Greet", when: "The session's first screen", bound: "The largest figure on that screen; once per session" },
  { state: "idle", title: "Idle", when: "Always", bound: "Its own attitude at rest. One drawing; varied only by jitter in code" },
  { state: "attend", title: "Attend", when: "Focus or pointer on an option", bound: "Looks where the learner points — never toward the key unprompted" },
  { state: "notice", title: "Notice", when: "An option chosen", bound: "A beat, not a verdict. Rich: a nod. Minimal: a hop and a glance at Check" },
  { state: "think", title: "Think", when: "No input for constants.md §6.8's first delay", bound: "Never hurry up" },
  { state: "doze", title: "Doze", when: "No input for the second delay", bound: "Wakes on the next input" },
  { state: "anticipate", title: "Anticipate", when: "Check pressed", bound: "Under 150ms, before the result is on screen" },
  { state: "correct", title: "Correct", when: "§9.4.1 event 1", bound: "Not cumulative — the fifth in a row draws from the same bag as the first" },
  { state: "partial", title: "Partly correct", when: "§9.4.1 event 4 (2026-10-03)", bound: "Never a sag — part of it was right. Never says how much" },
  { state: "incorrect", title: "Incorrect", when: "§9.4.1 event 2", bound: "Never a frown, a head-shake or a sigh. Ends looking at (rich: pointing to) the key" },
  { state: "unlock", title: "Unlock", when: "§9.4.1 event 3", bound: "Once, with the unlock" },
  { state: "travel", title: "Travel", when: "Between perches — minimal only", bound: "No travel under reduced motion" },
];

export type ReactionSetting = "both" | "minimal" | "rich";

export interface Reaction {
  id: string;
  state: ReactionState;
  title: string;
  note: string;
  /** Absent: the character's own idle (its attitude). */
  act?: Act;
  /** The face over the act's clock: [offset, mood], each held until the next. */
  faces: [number, Mood][];
  /** The face it holds at the end, and when stilled. */
  rest: Mood;
  /** Its hands at the end — the held pose reduced motion shows. Absent: its attitude. */
  end?: Required<Pick<Hands, "L" | "R">> & Hands;
  /** Which character-involvement setting plays it. */
  setting: ReactionSetting;
  /** A character's own variant rather than the cast's shared move. */
  signature?: boolean;
  /** What the hands are doing over the act's clock: [offset, shapes], each held until the next;
   *  a side left out is the character's own mitten. */
  grips?: [number, HandShapes][];
  /** The character's own scene for this variant (2026-10-04): a duckling at her feet, a mark her
   *  pencil draws in the air. Drawn by the character's scene component; moved by `fx-…` tracks. */
  scene?: readonly NoorSceneId[];
}

export type HandShapes = Partial<Record<"L" | "R", GripShape>>;

/** [offset, hands] — or [offset, hands, "line"]: the hands reach this key along a straight line
 *  rather than an arc, for a small precise stroke (a tick, a ring, a tap, a clap). */
type HandKey = [number, Required<Pick<Hands, "L" | "R">> & Hands, "line"?];
type Tracks = Pose["motion"]["tracks"];

/* Hand targets are authored in the body space of the character they were drawn on — Noor's frame:
   shoulders at 84/116 × 196 under a head that fills y 74–184, arms about 45 long (`noor.tsx`), so a
   hand reaches her mouth, chin and cheeks but never over her head — a move that needs the top of the
   head (a scratch) is not hers to make. `toChibi` turns them into the chibi-space targets the rig retargets. */
const BODY: Body = castMember("noor")!.figure.frame!;

const armLen = (j: Body["j"], s: "L" | "R") =>
  Math.hypot(j[`elbow${s}`][0] - j[`shoulder${s}`][0], j[`elbow${s}`][1] - j[`shoulder${s}`][1]) +
  Math.hypot(j[`wrist${s}`][0] - j[`elbow${s}`][0], j[`wrist${s}`][1] - j[`elbow${s}`][1]);

function chibiPoint(side: "L" | "R", t: P): P {
  const S0 = J[`shoulder${side}`];
  const S = BODY.j[`shoulder${side}`];
  const k = armLen(BODY.j, side) / armLen(J, side);
  return [S0[0] + (t[0] - S[0]) / k, S0[1] + (t[1] - S[1]) / k];
}

function toChibi<H extends Required<Pick<Hands, "L" | "R">> & Hands>(h: H): H {
  return { ...h, L: chibiPoint("L", h.L), R: chibiPoint("R", h.R) };
}

const DOWN = { L: [76, 238], R: [124, 238] } as const satisfies HandKey[1];
/** Both hands up beside her face, clear of it. */
const UP = { L: [56, 168], R: [144, 168] } as const satisfies HandKey[1];
/* Every elbow on her bends away from the body, which on her frame is also downward: an elbow that
   bends toward the body points up into her chest, and a move between the two flips the arm over. */
/** Hands folded in front of her waist — low enough to sit clear of her chin and brooch, and for the
 *  elbows to hang open rather than fold tight. */
const CHEST = { L: [96, 226], R: [104, 226] } as const satisfies HandKey[1];
/** Thinking: right index finger up to her chin, left hand across her waist under the right elbow. */
const CHIN = { L: [118, 222], R: [128, 190] } as const satisfies HandKey[1];

/* ——— Body mechanics, not squash and stretch ———
 * The studio rig's `jump`, `pop` and `sag` scale the body to show weight. On a person that reads as
 * the drawing being squeezed, so Noor's moves carry weight the way a body does instead: a crouch is
 * the torso lowering over bent knees, a launch extends the legs and drags the head a beat behind, a
 * landing is absorbed by the knees and the head settles last, a lift of feeling is a breath that
 * raises the chest and rocks onto the toes. Nothing scales but the ground shadow. */

type Key = Parameters<typeof keys>[0][1];
const at = (o: number, k: Key = {}): [number, Key] => [o, k];

/**
 * A hop: crouch over bent knees, push off with the legs extending, tuck in the air, reach for the
 * ground, land into the knees, recover a touch past standing and settle. The head lags the body on
 * the way up and settles after it on the way down. `n` hops share the loop.
 */
function hop(height: number, { at: start = 0.08, n = 1 }: { at?: number; n?: number } = {}): Tracks {
  const root: [number, Key][] = [at(0)];
  const torso: [number, Key][] = [at(0)];
  const head: [number, Key][] = [at(0)];
  const hip: [number, number][] = [[0, 0]];
  const knee: [number, number][] = [[0, 0]];
  const shadow: Keyframe[] = [{ scale: "1 1", offset: 0 }];
  const span = (1 - start) / n;
  for (let i = 0; i < n; i++) {
    const t = (k: number) => Math.min(1, start + i * span + span * k);
    const h = height;
    root.push(
      at(t(0), { e: EASE.settle }),
      at(t(0.16), { e: "cubic-bezier(0.2, 0.8, 0.4, 1)" }),
      at(t(0.3), { y: -h * 0.7, e: "ease-out" }),
      at(t(0.42), { y: -h, e: "ease-in" }),
      at(t(0.6), { y: 0, e: EASE.settle }),
      at(t(0.86)),
    );
    torso.push(
      at(t(0), { e: EASE.settle }),
      at(t(0.16), { y: 3.2, r: 0, e: EASE.snap }),
      at(t(0.3), { y: -1.2, e: "ease-out" }),
      at(t(0.42), { y: -0.4, e: "ease-in" }),
      at(t(0.6), { y: 0, e: EASE.snap }),
      at(t(0.68), { y: 2.6, e: EASE.settle }),
      at(t(0.78), { y: -0.5, e: EASE.settle }),
      at(t(0.86)),
    );
    head.push(
      at(t(0), { e: EASE.settle }),
      at(t(0.18), { y: 0.8, e: EASE.snap }),
      at(t(0.3), { y: 1.6, e: "ease-out" }),
      at(t(0.46), { y: -1.2, e: "ease-in" }),
      at(t(0.62), { y: -0.6, e: EASE.snap }),
      at(t(0.72), { y: 1.4, e: EASE.settle }),
      at(t(0.86)),
    );
    hip.push([t(0), 0], [t(0.16), 9], [t(0.3), 0], [t(0.42), 5], [t(0.56), 0], [t(0.68), 8], [t(0.86), 0]);
    knee.push([t(0), 0], [t(0.16), -16], [t(0.3), -2], [t(0.42), -12], [t(0.56), 0], [t(0.68), -14], [t(0.86), 0]);
    shadow.push(
      { scale: "1 1", offset: t(0) },
      { scale: "1.04 1", offset: t(0.16) },
      { scale: "0.74 0.8", offset: t(0.42) },
      { scale: "1.04 1", offset: t(0.68) },
      { scale: "1 1", offset: t(0.86) },
    );
  }
  root.push(at(1));
  torso.push(at(1));
  head.push(at(1));
  hip.push([1, 0]);
  knee.push([1, 0]);
  shadow.push({ scale: "1 1", offset: 1 });
  const mirror = (k: [number, number][]) => k.map(([o, v]): [number, number] => [o, -v]);
  return {
    root: keys(...root),
    torso: keys(...torso),
    head: keys(...head),
    hipL: turn(...hip),
    kneeL: turn(...knee),
    hipR: turn(...mirror(hip)),
    kneeR: turn(...mirror(knee)),
    shadow,
  };
}

/**
 * A lift of feeling without leaving the ground: a small breath in that settles the body, then the
 * chest rises and she rocks onto her toes, and comes back down with the smallest give at the knees.
 */
function lift(amount = 1, { at: start = 0.1 }: { at?: number } = {}): Tracks {
  const a = amount;
  return {
    torso: keys(
      at(0), at(start, { e: EASE.settle }),
      at(start + 0.08, { y: 0.8 * a, e: EASE.snap }),
      at(start + 0.2, { y: -2.2 * a, e: EASE.settle }),
      at(start + 0.34, { y: 0.4 * a, e: EASE.settle }),
      at(start + 0.46), at(1),
    ),
    root: keys(
      at(0), at(start + 0.08, { e: EASE.snap }),
      at(start + 0.2, { y: -1.6 * a, e: EASE.settle }),
      at(start + 0.36), at(1),
    ),
    shadow: [
      { scale: "1 1", offset: 0 },
      { scale: "1 1", offset: start + 0.08 },
      { scale: "0.94 1", offset: start + 0.2 },
      { scale: "1 1", offset: start + 0.36 },
      { scale: "1 1", offset: 1 },
    ],
  };
}

/**
 * A let-down taken softly: the breath goes out and the torso settles lower, shoulders with it; she
 * holds a beat, then draws a breath in that lifts her past standing and settles — trying again.
 */
function slump({ at: start = 0.1 }: { at?: number } = {}): Tracks {
  return {
    torso: keys(
      at(0), at(start, { e: EASE.settle }),
      at(start + 0.22, { y: 2.8, e: EASE.settle }),
      at(start + 0.45, { y: 2.4, e: EASE.settle }),
      at(start + 0.6, { y: -1, e: EASE.settle }),
      at(start + 0.74), at(1),
    ),
  };
}

/* ——— Laying one move over another ———
 * A hop moves the head (it lags, then settles) and a variant turns it (a tilt toward the learner):
 * both must play. `combine` adds same-joint tracks by sampling each on its own easing at a fine
 * step and summing translation and rotation, so neither overwrites the other. */

const BEZ: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
};

function easing(e: unknown): (t: number) => number {
  const m = typeof e === "string" ? /cubic-bezier\(([^)]+)\)/.exec(e) : null;
  const [x1, y1, x2, y2] = m ? (m[1].split(",").map(Number) as [number, number, number, number]) : (BEZ[String(e ?? "linear")] ?? BEZ.linear);
  const c = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (c(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return c(y1, y2, (lo + hi) / 2);
  };
}

type Sample = { x: number; y: number; r: number; o?: number };

function read(k: Keyframe): Sample {
  const [x = 0, y = 0] = String(k.translate ?? "0px 0px").split(" ").map((v) => parseFloat(v) || 0);
  return { x, y, r: parseFloat(String(k.rotate ?? "0")) || 0, o: k.opacity === undefined ? undefined : Number(k.opacity) };
}

function sample(track: Keyframe[], o: number): Sample {
  const n = track.length;
  const at = (i: number) => (typeof track[i].offset === "number" ? (track[i].offset as number) : n === 1 ? 0 : i / (n - 1));
  if (o <= at(0)) return read(track[0]);
  for (let i = 0; i < n - 1; i++) {
    const a = at(i);
    const b = at(i + 1);
    if (o >= a && o <= b) {
      const u = b === a ? 1 : easing(track[i].easing)((o - a) / (b - a));
      const p = read(track[i]);
      const q = read(track[i + 1]);
      const op = p.o !== undefined && q.o !== undefined ? p.o + (q.o - p.o) * u : (p.o ?? q.o);
      return { x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u, r: p.r + (q.r - p.r) * u, o: op };
    }
  }
  return read(track[n - 1]);
}

const STEP = 1 / 60;

function combine(...sets: Tracks[]): Tracks {
  const out: Tracks = {};
  const joints = new Set(sets.flatMap((t) => Object.keys(t))) as Set<keyof Tracks>;
  for (const j of joints) {
    const list = sets.map((t) => t[j]).filter((t): t is Keyframe[] => !!t);
    if (list.length === 1) {
      out[j] = list[0];
      continue;
    }
    const frames: Keyframe[] = [];
    for (let i = 0; i <= 60; i++) {
      const o = Math.min(1, i * STEP);
      const sum = list.map((t) => sample(t, o)).reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y, r: a.r + b.r }));
      frames.push({ offset: o, translate: `${sum.x.toFixed(2)}px ${sum.y.toFixed(2)}px`, rotate: `${sum.r.toFixed(2)}deg` });
    }
    out[j] = frames;
  }
  return out;
}

/** A rotation that eases in and out of every key, as a joint does — never a constant swing. */
const SMOOTH = "cubic-bezier(0.45, 0, 0.55, 1)";
const turn = (...k: [number, number][]): Keyframe[] => rotAt(...k).map((f) => ({ ...f, easing: SMOOTH }));

/** Forward kinematics on Noor's body: where the elbow and wrist sit for these joint angles. */
function limb(side: "L" | "R", sh: number, el: number): { E: P; W: P } {
  const S = BODY.j[`shoulder${side}`];
  const E0 = BODY.j[`elbow${side}`];
  const W0 = BODY.j[`wrist${side}`];
  const turn = (v: P, d: number): P => {
    const r = (d * Math.PI) / 180;
    return [v[0] * Math.cos(r) - v[1] * Math.sin(r), v[0] * Math.sin(r) + v[1] * Math.cos(r)];
  };
  const e = turn([E0[0] - S[0], E0[1] - S[1]], sh);
  const w = turn([W0[0] - E0[0], W0[1] - E0[1]], sh + el);
  const E: P = [S[0] + e[0], S[1] + e[1]];
  return { E, W: [E[0] + w[0], E[1] + w[1]] };
}

const wrist = (side: "L" | "R", sh: number, el: number): P => limb(side, sh, el).W;

/**
 * The hand at `base` with the forearm swung `deg` about the elbow, the upper arm still — how a
 * wave actually moves: from the elbow, not the shoulder.
 */
function swing(side: "L" | "R", base: P, deg: number): P {
  const { shoulder, elbow } = reach(side, base, true, BODY.j, BODY.elbows);
  const { E, W } = limb(side, shoulder, elbow);
  const r = (deg * Math.PI) / 180;
  const v: P = [W[0] - E[0], W[1] - E[1]];
  return [E[0] + v[0] * Math.cos(r) - v[1] * Math.sin(r), E[1] + v[0] * Math.sin(r) + v[1] * Math.cos(r)];
}

/**
 * Hands that travel in arcs. The rig's own `handsAt` slides a hand along a straight line between
 * targets, which no arm does; here each key is solved to shoulder and elbow angles on Noor's body,
 * the angles ease from one key to the next, and the wrist is read back off the arm — so the hand
 * swings about the shoulder and the elbow opens and closes on the way, slowing as it arrives.
 */
type Arm = { shoulder: number; elbow: number };
type ArmFrame = { L: Arm; R: Arm };

function reachAt(k: HandKey[], n = 48): { hands: Hands[]; angles: ArmFrame[] } {
  const s = (u: number) => u * u * (3 - 2 * u);
  const solve = (h: HandKey[1]) => ({
    L: reach("L", h.L, h.outL ?? true, BODY.j, BODY.elbows),
    R: reach("R", h.R, h.outR ?? true, BODY.j, BODY.elbows),
  });
  const angles = k.map(([, h]) => solve(h));
  const out: Hands[] = [];
  const angleFrames: ArmFrame[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let q = k.findIndex((_, x) => x < k.length - 1 && t >= k[x][0] && t <= k[x + 1][0]);
    if (q < 0) q = t < k[0][0] ? 0 : k.length - 2;
    const q1 = Math.min(q + 1, k.length - 1);
    const [oa, h] = k[q];
    const ob = k[q1][0];
    const u = ob === oa ? 0 : s(Math.min(1, Math.max(0, (t - oa) / (ob - oa))));
    const side = (x: "L" | "R"): Arm => {
      if (k[q1][2] === "line" && q1 !== q) {
        /* a stroke: the hand moves straight from key to key and the arm is solved along the way */
        const A = h[x];
        const B = k[q1][1][x];
        return reach(x, [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u], k[q1][1][`out${x}`] ?? true, BODY.j, BODY.elbows);
      }
      const a = angles[q][x];
      const b = angles[q1][x];
      /* the short way round: -170° to 170° is 20° of travel, not 340° */
      const d = (from: number, to: number) => ((((to - from + 180) % 360) + 360) % 360) - 180;
      /* fold before you lift, lower before you straighten: when the elbow is bending, it leads
         and the shoulder follows; when it is opening, the shoulder leads. An arm never passes
         straight out to the side on its way up or down. */
      const lin = ob === oa ? 0 : Math.min(1, Math.max(0, (t - oa) / (ob - oa)));
      const bending = Math.abs(b.elbow) > Math.abs(a.elbow);
      /* an elbow changing sides straightens through on the way, so it travels far: the leading
         joint still leads (or the arm passes straight out to the side), over a longer window */
      const crossing = Math.sign(a.elbow) !== Math.sign(b.elbow) && Math.min(Math.abs(a.elbow), Math.abs(b.elbow)) > 10;
      const lead = crossing ? 0.8 : 0.65;
      const first = s(Math.min(1, lin / lead));
      const second = s(Math.max(0, (lin - (1 - lead)) / lead));
      const ue = bending ? first : second;
      const us = bending ? second : first;
      /* the elbow never takes the short way round: both angles are in (-180, 180], so the plain
         difference passes through straight (0), never through ±180 — which would fold the forearm
         through the upper arm on its way from one side to the other */
      return { shoulder: a.shoulder + d(a.shoulder, b.shoulder) * us, elbow: a.elbow + (b.elbow - a.elbow) * ue };
    };
    const flags = u < 0.5 ? h : k[q1][1];
    const L = side("L");
    const R = side("R");
    angleFrames.push({ L, R });
    out.push({ ...flags, L: wrist("L", L.shoulder, L.elbow), R: wrist("R", R.shoulder, R.elbow) });
  }
  return { hands: out, angles: angleFrames };
}

/** The secondary joints' sway, so hair and ears follow through on every variant. */
const sway = (k = 1): Tracks => ({
  hairSway: rot(-3 * k, 4 * k, -3 * k),
  braidL: rot(2 * k, -3 * k, 2 * k),
  braidR: rot(-2 * k, 3 * k, -2 * k),
  tail: rot(-5 * k, 6 * k, -5 * k),
});

/** An act on Noor's body. Its arms play the joint angles `reachAt` eased between keys — not the
 *  rig's per-frame reach, which re-solves each frame on its own and can pop an elbow from one side
 *  to the other in a single frame where two solutions tie. Played from the angles, an elbow only
 *  ever changes sides by straightening through. `hands` (the wrists, in chibi space) stays for
 *  what reads hand positions; `angles` gives a grip the arm's turn. */
type Act = Pose & { angles: ArmFrame[] };

function act(id: string, duration: number, hands: HandKey[], tracks: Tracks | Tracks[], still = 0): Act {
  const solved = reachAt(hands);
  const arm: Tracks = {};
  for (const s of ["L", "R"] as const) {
    arm[`shoulder${s}`] = rot(...solved.angles.map((f) => +f[s].shoulder.toFixed(2)));
    arm[`elbow${s}`] = rot(...solved.angles.map((f) => +f[s].elbow.toFixed(2)));
  }
  return {
    id: "idle",
    title: id,
    use: "",
    mood: "neutral",
    /* empty, so the rig adds no arm tracks of its own over these */
    hands: [],
    angles: solved.angles,
    motion: { duration, easing: "linear", still, tracks: { ...sway(), ...combine(...(Array.isArray(tracks) ? tracks : [tracks])), ...arm } },
  } as Act;
}

const r = (
  state: ReactionState,
  id: string,
  title: string,
  note: string,
  a: Act | undefined,
  faces: [number, Mood][],
  rest: Mood,
  end?: HandKey[1],
  setting: ReactionSetting = "both",
  grips?: [number, HandShapes][],
): Reaction => ({ id, state, title, note, act: a, faces, rest, end: end && toChibi(end), setting, grips });

/** The shapes in effect at `t`. */
function shapesAt(list: [number, HandShapes][] | undefined, t: number): HandShapes {
  let cur: HandShapes = {};
  for (const [o, g] of list ?? []) if (t >= o) cur = g;
  return { ...RELAXED, ...cur };
}

/** A hand doing nothing in particular: her mitten, with the edge every grip carries. */
const RELAXED: HandShapes = { L: "mitt", R: "mitt" };

/** Each hand's shape with the arm's rotation for `hands`, so a thumb is drawn pointing up. */
function withTurn(shapes: HandShapes, hands: Hands): Grips {
  const solved = arms([hands], BODY);
  const turn = (side: "L" | "R") => {
    const v = (j: "shoulder" | "elbow") => parseFloat(String(solved[`${j}${side}`]?.[0]?.rotate ?? "0")) || 0;
    return v("shoulder") + v("elbow");
  };
  const out: Grips = {};
  for (const side of ["L", "R"] as const) {
    const shape = shapes[side];
    if (shape) out[side] = { shape, turn: turn(side) } satisfies Grip;
  }
  return out;
}

/** The hands at moment `t` of a variant's loop. */
export function gripAt(a: Reaction, t: number): Grips | undefined {
  if (!a.act) return undefined;
  const frames = a.act.angles;
  const f = frames[Math.round(t * (frames.length - 1))];
  const shapes = shapesAt(a.grips, t);
  const out: Grips = {};
  for (const side of ["L", "R"] as const) {
    const shape = shapes[side];
    if (shape) out[side] = { shape, turn: f[side].shoulder + f[side].elbow };
  }
  return out;
}

/** The hands it ends on: the last shapes it makes, on its held pose. */
export function endGrip(a: Reaction): Grips | undefined {
  if (!a.end) return undefined;
  const last = [...(a.grips ?? [])].reverse().find(([, g]) => Object.keys(g).length > 0)?.[1];
  return withTurn({ ...RELAXED, ...last }, a.end);
}


/* ——— The moves, authored on Noor first; hand targets retarget, so they can seed the next character ——— */

/* Where her hands go, in her body space. Wave and welcome show an open palm; a cheer, a fist; a
   point, a finger; a thumbs-up, the thumb. Every gesture stays clear of her face unless touching it
   is the gesture (thinking, oops), and every one is reachable on her frame. */
/** The wave: the hand up beside her head, clear of the hijab's edge, swinging from the elbow. */
const WAVE_HAND: P = [152, 170];
const WAVE_OUT = swing("R", WAVE_HAND, 16);
const WAVE_IN = swing("R", WAVE_HAND, -12);
const WAVE = (R: P) => ({ L: DOWN.L, R });
const OPEN = { L: [48, 204], R: [152, 204] } as const satisfies HandKey[1];
const SHRUG = { L: [52, 206], R: [148, 206] } as const satisfies HandKey[1];
const PUMP = { L: DOWN.L, R: [140, 166] } as const satisfies HandKey[1];
const THUMB = { L: DOWN.L, R: [156, 186] } as const satisfies HandKey[1];
/** Oops: both hands up to her cheeks, elbows out. */
const CHEEKS = { L: [76, 174], R: [124, 174] } as const satisfies HandKey[1];
/** The left hand stays easy at her side while the right points. */
const POINT = { L: [78, 236], R: [160, 190] } as const satisfies HandKey[1];
/** So nearly: one hand up beside her face, finger and thumb held a hair apart. */
const PINCH = { L: DOWN.L, R: [150, 178] } as const satisfies HandKey[1];

/* The cast's shared moves, authored on Noor's frame (2026-10-03). As of 2026-10-04 Noor plays only
   three of them (Idle, So nearly, Oops) — the rest of hers are her own, below — but they stay here,
   retargetable, to seed the characters drawn next. No page shows them. */
export const CAST_MOVES: Reaction[] = [
  /* greet ×3 */
  r("greet", "greet-wave", "Wave", "An open hand comes up beside her face and waves from the elbow, head tipped toward the learner.",
    act("greet-wave", 2.4, [
      [0, DOWN], [0.16, WAVE(WAVE_HAND)], [0.27, WAVE(WAVE_OUT)], [0.38, WAVE(WAVE_IN)], [0.49, WAVE(WAVE_OUT)], [0.6, WAVE(WAVE_IN)],
      [0.7, WAVE(WAVE_HAND)], [0.84, WAVE(WAVE_HAND)], [1, DOWN],
    ], [lift(0.6, { at: 0.04 }), {
      head: turn([0, 0], [0.16, 5], [0.27, 6], [0.38, 4.5], [0.49, 6], [0.6, 4.5], [0.84, 5], [1, 0]),
      torso: turn([0, 0], [0.16, -2], [0.84, -2], [1, 0]),
    }]),
    [[0, "happy"]], "happy", WAVE(WAVE_HAND), "both", [[0.08, { R: "palm" }], [0.92, {}]]),
  r("greet", "greet-hop", "Hop hello", "A small hop with both hands up and open, landing in a wave.",
    act("greet-hop", 2.4, [
      [0, DOWN], [0.1, DOWN], [0.26, UP], [0.5, UP], [0.62, WAVE(WAVE_HAND)],
      [0.72, WAVE(WAVE_OUT)], [0.84, WAVE(WAVE_HAND)], [1, DOWN],
    ], [hop(12, { at: 0.06 }), { head: turn([0, 0], [0.3, -4], [0.6, 4], [1, 0]) }]),
    [[0, "happy"], [0.2, "delighted"], [0.6, "happy"]], "happy", WAVE(WAVE_HAND), "both",
    [[0.16, { L: "palm", R: "palm" }], [0.56, { R: "palm" }], [0.92, {}]]),
  r("greet", "greet-welcome", "Welcome", "Hands gather at her chest, then open out wide, palms up — come in.",
    act("greet-welcome", 2.6, [
      [0, DOWN], [0.16, CHEST], [0.3, CHEST], [0.5, OPEN], [0.84, OPEN], [1, DOWN],
    ], {
      head: turn([0, 0], [0.14, -3], [0.48, 4], [0.86, 4], [1, 0]),
      /* draws in toward the chest, then opens and rises onto her toes as the hands go out */
      torso: keys([0, {}], [0.14, { y: 1, e: EASE.settle }], [0.3, { y: 1.2, e: EASE.settle }], [0.48, { y: -1.4, e: EASE.settle }], [0.86, { y: -1, e: EASE.settle }], [1, {}]),
      root: keys([0, {}], [0.3, { e: EASE.settle }], [0.48, { y: -1.2, e: EASE.settle }], [0.86, { y: -1, e: EASE.settle }], [1, {}]),
    }),
    [[0, "neutral"], [0.14, "happy"], [0.48, "delighted"], [0.86, "happy"]], "happy", OPEN, "both",
    [[0.36, { L: "palm", R: "palm" }], [0.92, {}]]),

  /* idle ×1: the character's own attitude */
  r("idle", "idle", "At rest", "Its attitude: own expression, head tilt and stance. Breathes and blinks; jitter in code varies it.", undefined, [], "neutral"),

  /* attend */
  r("attend", "attend-follow", "Follows the pointer", "Head turns to where the learner points — here, left then right.",
    act("attend-follow", 3.6, [[0, CHEST], [1, CHEST]], {
      head: turn([0, 0], [0.12, -7], [0.42, -7], [0.56, 7], [0.86, 7], [1, 0]),
      torso: turn([0, 0], [0.12, -1.5], [0.42, -1.5], [0.56, 1.5], [0.86, 1.5], [1, 0]),
    }),
    [[0, "curious"]], "curious"),

  /* notice — staged per setting */
  r("notice", "notice-nod", "Nod", "A small nod: it saw the choice. No verdict in it.",
    act("notice-nod", 1.8, [[0, CHEST], [1, CHEST]], {
      head: keys([0, {}], [0.1, { y: 3, r: 2, e: EASE.settle }], [0.2, { y: -1, e: EASE.settle }], [0.3, {}], [1, {}]),
    }),
    [[0, "neutral"], [0.1, "curious"], [0.4, "neutral"]], "neutral", undefined, "rich"),
  r("notice", "notice-hop", "Hop and glance", "A small hop, then a glance toward Check.",
    act("notice-hop", 2, [[0, CHEST], [1, CHEST]], [hop(6, { at: 0.04 }), { head: turn([0, 0], [0.4, 0], [0.5, 8], [0.85, 8], [1, 0]) }]),
    [[0, "neutral"], [0.04, "happy"], [0.45, "curious"]], "curious", undefined, "minimal"),

  /* think, doze */
  r("think", "think-chin", "Finger to chin", "Right finger to her chin, the other arm across her waist, eyes up and head tipped. Never hurry up.",
    act("think-chin", 3.6, [[0, CHIN], [0.3, { ...CHIN, R: [128, 187] }], [0.36, CHIN], [0.62, { ...CHIN, R: [128, 187] }], [0.68, CHIN], [1, CHIN]], {
      head: turn([0, 7], [0.5, 10], [1, 7]),
      torso: turn([0, -1], [0.5, -2], [1, -1]),
    }),
    [[0, "thinking"]], "thinking", CHIN, "both", [[0, { R: "finger", L: "fist" }]]),
  r("doze", "doze-nod", "Nodding off", "Eyes shut, hands folded, head drooping on a slow breath.",
    act("doze-nod", 5, [[0, CHEST], [1, CHEST]], {
      head: keys([0, { y: 2, r: -4 }], [0.5, { y: 5, r: -8, e: "ease-in-out" }], [1, { y: 2, r: -4 }]),
      torso: keys([0, {}], [0.5, { y: 1.8, r: -0.6, e: "ease-in-out" }], [1, {}]),
      ...sway(0.3),
    }),
    [[0, "happy"]], "happy", CHEST),

  /* anticipate */
  r("anticipate", "anticipate-lean", "Leans in", "Hands clasp and she leans in — before the result is known.",
    act("anticipate-lean", 1.6, [[0, DOWN], [0.1, CHEST], [1, CHEST]], {
      torso: keys([0, {}], [0.1, { r: 3, y: 1.4, e: EASE.snap }], [1, { r: 3, y: 1.4 }]),
      head: keys([0, {}], [0.1, { r: 4, y: 2, e: EASE.snap }], [1, { r: 4, y: 2 }]),
    }, 1),
    [[0, "focused"]], "focused", CHEST),

  /* correct ×3 shared (the fourth is the character's own) */
  r("correct", "correct-hop", "Hop, fists up", "Crouch into the knees, jump with both fists up, land soft and settle.",
    act("correct-hop", 1.8, [[0, DOWN], [0.1, DOWN], [0.24, UP], [0.7, UP], [1, DOWN]], [hop(18, { at: 0.06 }), { head: turn([0, 0], [0.2, -4], [0.5, 4], [1, 0]) }]),
    [[0, "happy"], [0.1, "delighted"]], "delighted", UP, "both", [[0.12, { L: "fist", R: "fist" }], [0.86, {}]]),
  r("correct", "correct-pump", "Fist pump", "A fist comes up, pulls down hard once — yes — and holds.",
    act("correct-pump", 1.6, [[0, DOWN], [0.12, PUMP], [0.24, { L: DOWN.L, R: [136, 190] }], [0.34, PUMP], [0.8, PUMP], [1, DOWN]],
      [lift(1, { at: 0.2 }), {
        head: turn([0, 0], [0.24, -6], [0.8, -6], [1, 0]),
        /* leans into the pull-down, then straightens with the fist held */
        torso: turn([0, 0], [0.12, -1], [0.24, 3], [0.34, 1.5], [0.8, 1.5], [1, 0]),
      }]),
    [[0, "happy"], [0.22, "delighted"], [0.8, "happy"]], "happy", PUMP, "both", [[0.06, { R: "fist" }], [0.9, {}]]),
  r("correct", "correct-double", "Bounce bounce", "Two small bounces with hands clasped at her chest.",
    act("correct-double", 1.8, [[0, DOWN], [0.1, CHEST], [0.85, CHEST], [1, DOWN]], [hop(8, { at: 0.06, n: 2 }), { head: turn([0, 0], [0.25, 4], [0.5, -4], [0.75, 4], [1, 0]) }]),
    [[0, "happy"], [0.1, "delighted"], [0.85, "happy"]], "happy", CHEST),

  /* partly correct ×2 */
  r("partial", "partial-halfhop", "Half a hop", "A hop that stops short, an open hand half up — then a look at what's left.",
    act("partial-halfhop", 2.2, [[0, DOWN], [0.1, DOWN], [0.24, WAVE([146, 184])], [0.55, WAVE([146, 184])], [0.7, WAVE([132, 204])], [1, WAVE([132, 204])]],
      [hop(6, { at: 0.06 }), {
        head: turn([0, 0], [0.24, -3], [0.6, -3], [0.72, 7], [1, 7]),
        torso: turn([0, 0], [0.6, 0], [0.72, 1.5], [1, 1.5]),
      }], 1),
    [[0, "happy"], [0.6, "curious"]], "curious", WAVE([132, 204]), "both", [[0.16, { R: "palm" }], [0.66, {}]]),
  r("partial", "partial-nearly", "So nearly", "A hand comes up beside her face, finger and thumb a hair apart — this close — with a tipped head and a wink.",
    act("partial-nearly", 2.4, [[0, DOWN], [0.18, PINCH], [0.3, { L: DOWN.L, R: [151, 176] }], [0.4, PINCH], [0.82, PINCH], [1, DOWN]],
      [lift(0.4, { at: 0.14 }), {
        head: turn([0, 0], [0.2, 7], [0.82, 7], [1, 0]),
        torso: turn([0, 0], [0.2, -1.5], [0.82, -1.5], [1, 0]),
      }]),
    [[0, "curious"], [0.34, "wink"], [0.78, "curious"]], "curious", PINCH, "both", [[0.1, { R: "pinch" }], [0.9, {}]]),

  /* incorrect ×3, plus the rich ending */
  r("incorrect", "incorrect-sag", "Sheepish sag", "Breath out, hands drop, sinks a little; breathes in, lifts back — then looks at the key.",
    act("incorrect-sag", 2.4, [[0, CHEST], [0.14, DOWN], [0.6, DOWN], [0.74, CHEST], [1, CHEST]], [slump({ at: 0.06 }), {
      head: turn([0, 0], [0.16, -6], [0.6, -6], [0.72, 6], [1, 6]),
    }, {
      /* the head drops with the breath out before it turns to the key */
      head: keys([0, {}], [0.16, { y: 1.6, e: EASE.settle }], [0.6, { y: 1.2, e: EASE.settle }], [0.72, {}], [1, {}]),
    }], 2),
    [[0, "oops"], [0.62, "curious"]], "curious", CHEST),
  r("incorrect", "incorrect-oops", "Oops", "Both hands up to her cheeks — oops — a little giggle in the shoulders, and the hands come down.",
    /* down at her sides with the elbows still out, then hanging: never flung out wide on the way */
    act("incorrect-oops", 2.4, [[0, DOWN], [0.18, CHEEKS], [0.56, CHEEKS], [0.74, { L: [64, 210], R: [136, 210] }], [0.9, DOWN], [1, DOWN]], {
      head: turn([0, 0], [0.18, -4], [0.3, -2.5], [0.42, -4], [0.62, -3], [0.84, 0], [1, 0]),
      /* the giggle: two small lifts of the shoulders */
      torso: keys([0, {}], [0.18, { y: 1, e: EASE.settle }], [0.28, { y: -0.8, e: EASE.settle }], [0.38, { y: 0.8, e: EASE.settle }],
        [0.48, { y: -0.8, e: EASE.settle }], [0.62, { y: 0.4, e: EASE.settle }], [0.84, {}], [1, {}]),
    }),
    [[0, "oops"], [0.66, "happy"]], "happy", undefined, "both", [[0.1, { L: "palm", R: "palm" }], [0.76, {}]]),
  r("incorrect", "incorrect-shrug", "Small shrug", "Palms turn up at her sides, shoulders lift softly, head tips — never a shake.",
    act("incorrect-shrug", 2.2, [[0, DOWN], [0.16, SHRUG], [0.5, SHRUG], [0.8, DOWN], [1, DOWN]], {
      torso: keys([0, {}], [0.16, { y: -2, e: EASE.overshoot }], [0.5, { y: -2, e: EASE.settle }], [0.7, {}], [1, {}]),
      head: turn([0, 0], [0.16, -7], [0.5, -7], [0.8, 0], [1, 0]),
    }),
    [[0, "oops"], [0.55, "neutral"]], "neutral", SHRUG, "both", [[0.08, { L: "palm", R: "palm" }], [0.74, {}]]),
  r("incorrect", "incorrect-point", "Sag, then point", "Rich only: the sag ends with a finger pointing to the key beside her.",
    act("incorrect-point", 2.6, [[0, CHEST], [0.14, DOWN], [0.5, DOWN], [0.68, POINT], [1, POINT]], [slump({ at: 0.04 }), {
      head: turn([0, 0], [0.14, -6], [0.5, -6], [0.66, 7], [1, 7]),
      /* turns her shoulders toward the key as she points */
      torso: turn([0, 0], [0.5, 0], [0.66, 3], [1, 3]),
    }], 2),
    [[0, "oops"], [0.55, "curious"]], "curious", POINT, "rich", [[0.56, { R: "point" }]]),

  /* unlock */
  r("unlock", "unlock-cheer", "Cheer", "As the guide's cheer: a bigger jump, fists up, then hands flung open — once with the unlock.",
    act("unlock-cheer", 2, [[0, DOWN], [0.06, DOWN], [0.2, UP], [0.32, { L: [48, 170], R: [152, 170] }], [0.44, UP], [0.56, { L: [48, 170], R: [152, 170] }], [0.8, UP], [1, DOWN]],
      [hop(22, { at: 0.04 }), { head: turn([0, 0], [0.2, -3], [0.5, 3], [1, 0]) }]),
    [[0, "happy"], [0.08, "delighted"]], "delighted", UP, "both", [[0.1, { L: "fist", R: "fist" }], [0.3, { L: "palm", R: "palm" }], [0.9, {}]]),

  /* travel — minimal only */
  r("travel", "travel-skip", "Skip across", "Dock to verdict: two skips sideways, arms swinging, and a settle, facing front on arrival.",
    act("travel-skip", 2.4, [[0, DOWN], [0.1, { L: [64, 228], R: [132, 236] }], [0.25, { L: [70, 234], R: [138, 226] }], [0.38, { L: [64, 228], R: [132, 236] }],
      [0.52, { L: [70, 234], R: [138, 226] }], [0.66, { L: [66, 230], R: [134, 230] }], [0.8, DOWN], [1, DOWN]], {
      root: keys(
        [0, { x: -28 }], [0.1, { x: -28, e: "ease-out" }], [0.25, { x: -12, y: -10, e: "ease-in" }], [0.38, { x: 2, e: "ease-out" }],
        [0.52, { x: 16, y: -10, e: "ease-in" }], [0.66, { x: 28, e: EASE.settle }], [0.76, { x: 28 }], [0.9, { x: 28 }], [1, { x: -28 }],
      ),
      /* each contact is taken in the knees: the torso dips as she lands and pushes off */
      torso: keys([0, {}], [0.1, { y: 2.4, e: EASE.snap }], [0.2, { y: -0.6, e: "ease-out" }], [0.38, { y: 2.4, e: EASE.snap }],
        [0.46, { y: -0.6, e: "ease-out" }], [0.66, { y: 2.6, e: EASE.settle }], [0.76, {}], [1, {}]),
      head: turn([0, 0], [0.1, 6], [0.66, 6], [0.8, 0], [1, 0]),
      /* a skip: the lead leg reaches, the trailing one tucks, and they swap on the second */
      hipL: turn([0, 0], [0.1, 6], [0.25, -10], [0.38, 6], [0.52, 8], [0.66, 6], [0.76, 0], [1, 0]),
      kneeL: turn([0, 0], [0.1, -10], [0.25, 4], [0.38, -10], [0.52, -14], [0.66, -10], [0.76, 0], [1, 0]),
      hipR: turn([0, 0], [0.1, -6], [0.25, -8], [0.38, -6], [0.52, 10], [0.66, -6], [0.76, 0], [1, 0]),
      kneeR: turn([0, 0], [0.1, 10], [0.25, 14], [0.38, 10], [0.52, -4], [0.66, 10], [0.76, 0], [1, 0]),
    }),
    [[0, "happy"]], "happy", undefined, "minimal"),
];

/* ——— Noor's own correct: her ability, Thumbs-up ——— */

const NOOR_SIGNATURE: Reaction = {
  ...r("correct", "noor-thumbs", "Thumbs-up", "Her fist comes up beside her, thumb high, held toward the learner with a nod and a wink.",
      act("noor-thumbs", 2.6, [[0, DOWN], [0.17, { L: DOWN.L, R: [136, 210] }], [0.28, THUMB], [0.34, { L: DOWN.L, R: [157, 183] }], [0.4, THUMB], [0.86, THUMB], [1, DOWN]],
        [lift(0.8, { at: 0.14 }), {
          /* the nod lands as the thumb arrives, and she leans a little toward it */
          head: keys([0, {}], [0.2, { r: 4, e: EASE.settle }], [0.3, { y: 2, r: 6, e: EASE.settle }], [0.42, { r: 5, e: EASE.settle }], [0.86, { r: 5, e: EASE.settle }], [1, {}]),
          torso: turn([0, 0], [0.2, 2.5], [0.86, 2.5], [1, 0]),
        }]),
      [[0, "neutral"], [0.16, "delighted"], [0.38, "wink"], [0.6, "delighted"]], "delighted", THUMB, "both", [[0.06, { R: "thumb" }], [0.92, {}]]),
  signature: true,
};

/* ——— Noor's own reactions (2026-10-04) ———
 * Drawn from who she is rather than from the cast's moves: calm, patient, quietly funny, waits as
 * long as it takes, wants everyone to feel they can ask, too nice to tell the ducks off. Nothing she
 * does is a hop or a fist pump. Three things carry her: the pencil in her pocket (a teacher's tick,
 * a ring round "this bit", a tap to start the class), the duckling she never shoos (it keeps her
 * company while the learner thinks, dozes beside her, follows her about), and patience itself —
 * she leans in to listen, blinks slowly, steps aside. Her thumbs-up stays the best in the world. */

function pick(id: string): Reaction {
  const a = CAST_MOVES.find((x) => x.id === id);
  if (!a) throw new Error(`reactions: no cast move ${id}`);
  return a;
}

/** Her own variant, with the scene it brings. */
const own = (a: Reaction, scene?: readonly NoorSceneId[]): Reaction => ({ ...a, signature: true, ...(scene ? { scene } : {}) });

/** Hands folded at rest: the right hand lies over the left. */
const FOLDED: [number, HandShapes][] = [[0, { R: "clasp" }]];

/** Her right hand on her heart — screen right, crossing her front — the other easy at her side. */
const HEART = { L: [106, 204], R: DOWN.R } as const satisfies HandKey[1];
/** Reaching to the pocket on her skirt for the pencil: the hand at the pencil's top, which stands
 *  out of the pocket at about (92, 238) in figure space — at the end of her reach. */
const POCKET = { L: DOWN.L, R: [97, 236] } as const satisfies HandKey[1];
/** Her left palm turned up in front of her waist, the pencil over it — low enough that neither
 *  forearm folds flat onto its upper arm, which a drawing with no foreshortening cannot hide. */
const PALM_L: P = [88, 222];
const TAP_UP = { L: PALM_L, R: [106, 212] } as const satisfies HandKey[1];
const TAP_DOWN = { L: PALM_L, R: [99, 220] } as const satisfies HandKey[1];
/** The pencil held up in front of her, tip by her chin — on the same side of the elbow as the taps,
 *  so the arm lifts it rather than sweeping out straight and back. */
const PENCIL_UP = { L: DOWN.L, R: [126, 214] } as const satisfies HandKey[1];
/** The air tick: in at the top of the short stroke, down to the corner, up along the long one. */
const TICK0 = { L: DOWN.L, R: [136, 184] } as const satisfies HandKey[1];
const TICK1 = { L: DOWN.L, R: [144, 196] } as const satisfies HandKey[1];
const TICK2 = { L: DOWN.L, R: [156, 174] } as const satisfies HandKey[1];
/** A small ring drawn round "this bit", lower and further out. */
const RING: P = [148, 214];
const ringAt = (dx: number, dy: number) => ({ L: DOWN.L, R: [RING[0] + dx, RING[1] + dy] as P });
/** After the tick, the pencil comes back down and away so the mark it left is seen. */
const ADMIRE = { L: DOWN.L, R: [150, 212] } as const satisfies HandKey[1];
/** Fingertips together under her chin: a held breath. */
const STEEPLE = { L: [97, 202], R: [103, 202] } as const satisfies HandKey[1];
/* fingertip claps in front of her waist, not her chest: at chest height a hand that close to the
   centre folds the forearm flat onto the upper arm */
const CLAP_OPEN = { L: [86, 220], R: [114, 220] } as const satisfies HandKey[1];
const CLAP_SHUT = { L: [97, 222], R: [103, 222] } as const satisfies HandKey[1];
/** Hands lowering from up by her face or out at shoulder height: they come down at her sides with
 *  the elbows still bent outward, and only then hang straight — never flung out wide on the way. */
const SIDES = { L: [64, 210], R: [136, 210] } as const satisfies HandKey[1];
/** Both thumbs: the right where her signature puts it, the left mirrored. */
const THUMBS = { L: [44, 186], R: THUMB.R } as const satisfies HandKey[1];
/** Her own hand up, like a student with a question. */
const RAISE_HAND: P = [146, 162];
const RAISE = { L: DOWN.L, R: RAISE_HAND } as const satisfies HandKey[1];
/** Half-turned beside the learner, an open palm toward the key. */
const TOGETHER = { L: [100, 206], R: [156, 204] } as const satisfies HandKey[1];
/** Holding the way open: one palm out to the side, the other at her chest. */
const DOOR = { L: [104, 206], R: [158, 200] } as const satisfies HandKey[1];

/** A mark's opacity over the loop: hidden, drawn at `on`, held, gone just before the loop ends. */
const shows = (on: number, off = 0.92): Keyframe[] =>
  keys([0, { o: 0 }], [Math.max(0, on - 0.05), { o: 0 }], [on, { o: 1 }], [off, { o: 1 }], [Math.min(1, off + 0.04), { o: 0 }], [1, { o: 0 }]);

const NOOR: Reaction[] = [
  /* ——— greet ×3 ——— */
  own(r("greet", "noor-wave", "Slow wave", "An unhurried wave from the elbow, head tipped toward the learner, and a slow blink in the middle of it — take your time.",
    act("noor-wave", 2.8, [
      [0, DOWN], [0.18, WAVE(WAVE_HAND)], [0.32, WAVE(WAVE_OUT)], [0.46, WAVE(WAVE_IN)], [0.6, WAVE(WAVE_OUT)],
      [0.72, WAVE(WAVE_HAND)], [0.86, WAVE(WAVE_HAND)], [1, DOWN],
    ], [lift(0.5, { at: 0.04 }), {
      head: turn([0, 0], [0.18, 5], [0.86, 6], [1, 0]),
      torso: turn([0, 0], [0.18, -1.5], [0.86, -1.5], [1, 0]),
    }]),
    [[0, "neutral"], [0.24, "happy"], [0.46, "neutral"]], "neutral", WAVE(WAVE_HAND), "both", [[0.1, { R: "palm" }], [0.92, {}]])),
  own(r("greet", "noor-heart", "Hand to heart", "Her right hand comes to her heart and her head bows a little — sincere, unhurried — then rises, tipped toward the learner.",
    act("noor-heart", 2.8, [[0, DOWN], [0.2, HEART], [0.72, HEART], [1, DOWN]], {
      head: keys([0, {}], [0.22, { e: EASE.settle }], [0.36, { y: 2.4, r: 2, e: EASE.settle }], [0.56, { y: 2, r: 2, e: EASE.settle }], [0.7, { r: 5, e: EASE.settle }], [0.9, { r: 5, e: EASE.settle }], [1, {}]),
      torso: keys([0, {}], [0.22, { e: EASE.settle }], [0.36, { y: 1.2, r: 1, e: EASE.settle }], [0.56, { y: 1, r: 1, e: EASE.settle }], [0.7, {}], [1, {}]),
    }),
    [[0, "neutral"], [0.3, "happy"], [0.62, "neutral"]], "neutral", HEART, "both", [[0.1, { L: "palm" }], [0.92, {}]])),
  own(r("greet", "noor-pencil-tap", "Pencil tap", "Takes the pencil from her pocket, taps her palm twice like a teacher starting class, holds it up with a wink and tucks it back.",
    act("noor-pencil-tap", 3.6, [
      [0, DOWN], [0.14, POCKET], [0.24, TAP_UP], [0.31, TAP_DOWN, "line"], [0.38, TAP_UP, "line"], [0.45, TAP_DOWN, "line"], [0.52, TAP_UP, "line"],
      [0.66, PENCIL_UP], [0.78, PENCIL_UP], [0.92, POCKET], [1, DOWN],
    ], {
      head: turn([0, 0], [0.2, -4], [0.56, -4], [0.66, 6], [0.84, 6], [1, 0]),
      /* a small dip of the head with each tap */
      torso: keys([0, {}], [0.32, { y: 0.8, e: EASE.settle }], [0.4, {}], [0.48, { y: 0.8, e: EASE.settle }], [0.56, {}], [0.66, { y: -1, e: EASE.settle }], [0.84, { y: -0.6 }], [1, {}]),
    }),
    [[0, "neutral"], [0.22, "focused"], [0.64, "wink"], [0.84, "neutral"]], "wink", PENCIL_UP, "both",
    [[0.14, { R: "pencilPoint" }], [0.2, { L: "palm", R: "pencilPoint" }], [0.6, { R: "pencil" }], [0.96, {}]])),

  /* ——— idle ——— */
  pick("idle"),

  /* ——— attend ——— */
  own(r("attend", "noor-listen", "Leans in to listen", "Leans and tips her head toward the option the learner points at, as she would lean in to hear someone — a beat behind them, never ahead.",
    act("noor-listen", 3.6, [[0, CHEST], [1, CHEST]], {
      head: turn([0, 0], [0.14, -3], [0.22, -8], [0.42, -8], [0.56, 3], [0.64, 8], [0.86, 8], [1, 0]),
      torso: turn([0, 0], [0.22, -1.5], [0.42, -1.5], [0.64, 1.5], [0.86, 1.5], [1, 0]),
      root: keys([0, {}], [0.22, { x: -1.6, e: EASE.settle }], [0.42, { x: -1.6, e: EASE.settle }], [0.64, { x: 1.6, e: EASE.settle }], [0.86, { x: 1.6, e: EASE.settle }], [1, {}]),
    }),
    [[0, "neutral"]], "neutral", CHEST, "both", FOLDED)),

  /* ——— notice, staged per setting ——— */
  own(r("notice", "noor-blink-nod", "Slow-blink nod", "A nod with a slow blink in it — I see it — the nod of someone who trusts the choice. No verdict.",
    act("noor-blink-nod", 1.8, [[0, CHEST], [1, CHEST]], {
      head: keys([0, {}], [0.12, { e: EASE.settle }], [0.28, { y: 2.4, r: 2, e: EASE.settle }], [0.46, { y: -0.4, e: EASE.settle }], [0.56, {}], [1, {}]),
    }),
    [[0, "neutral"], [0.14, "happy"], [0.42, "neutral"]], "neutral", CHEST, "rich", FOLDED)),
  own(r("notice", "noor-toes-glance", "Up on her toes", "Rises onto her toes, hands still folded, and glances at Check — no hop.",
    act("noor-toes-glance", 2, [[0, CHEST], [1, CHEST]], [lift(0.8, { at: 0.04 }), { head: turn([0, 0], [0.36, 0], [0.48, 8], [0.85, 8], [1, 0]) }]),
    [[0, "neutral"], [0.44, "curious"]], "curious", CHEST, "minimal", FOLDED)),

  /* ——— think, doze: the duckling ——— */
  own(r("think", "noor-duckling", "Watching a duckling", "A duckling pecks about at her feet and she watches it, too fond to shoo it; when it looks up at her, she giggles. Nobody here is in a hurry. The product fades the duckling in when Think begins.",
    act("noor-duckling", 7, [[0, CHEST], [1, CHEST]], {
      head: turn([0, 7], [0.3, 9], [0.5, 11], [0.72, 11], [0.86, 8], [1, 7]),
      torso: keys([0, {}], [0.52, { e: EASE.settle }], [0.56, { y: -0.8, e: EASE.settle }], [0.6, { y: 0.6, e: EASE.settle }], [0.64, { y: -0.6, e: EASE.settle }], [0.68, {}], [1, {}]),
      "fx-duck": keys(
        [0, {}], [0.3, { e: EASE.settle }], [0.34, { x: -3, y: -1, r: -4, e: EASE.settle }], [0.38, { x: -6, r: 3, e: EASE.settle }], [0.42, { x: -6 }],
        [0.8, { x: -6, e: EASE.settle }], [0.86, { x: -3, y: -1, r: 4, e: EASE.settle }], [0.92, { r: -3, e: EASE.settle }], [0.96, {}], [1, {}],
      ),
      /* pecks, pecks, looks up at her, holds her look, goes back to pecking */
      "fx-duckHead": turn([0, 0], [0.06, -26], [0.1, 0], [0.14, -26], [0.18, 0], [0.44, 0], [0.5, 20], [0.72, 20], [0.78, 0], [0.88, 0], [0.92, -26], [0.96, 0], [1, 0]),
    }),
    [[0, "neutral"], [0.5, "happy"], [0.72, "neutral"]], "neutral", CHEST, "both", FOLDED), ["duck"]),
  own(r("doze", "noor-doze", "Dozing with the duckling", "Eyes shut, hands folded, head drooping on a slow breath — and the duckling asleep beside her foot.",
    act("noor-doze", 5, [[0, CHEST], [1, CHEST]], {
      head: keys([0, { y: 2, r: -4 }], [0.5, { y: 5, r: -8, e: "ease-in-out" }], [1, { y: 2, r: -4 }]),
      torso: keys([0, {}], [0.5, { y: 1.8, r: -0.6, e: "ease-in-out" }], [1, {}]),
      /* the duckling breathes on a slower count than she does */
      "fx-duck": keys([0, {}], [0.25, { y: 0.7, e: "ease-in-out" }], [0.5, {}], [0.75, { y: 0.7, e: "ease-in-out" }], [1, {}]),
      ...sway(0.3),
    }),
    [[0, "happy"]], "happy", CHEST, "both", FOLDED), ["duckAsleep"]),

  /* ——— anticipate ——— */
  own(r("anticipate", "noor-held-breath", "Held breath", "Fingertips together under her chin and a held breath as she leans in — before the result is known.",
    act("noor-held-breath", 1.6, [[0, DOWN], [0.1, STEEPLE], [1, STEEPLE]], {
      torso: keys([0, {}], [0.1, { r: 2, y: 1, e: EASE.snap }], [1, { r: 2, y: 1 }]),
      head: keys([0, {}], [0.1, { r: 3, y: 1.6, e: EASE.snap }], [1, { r: 3, y: 1.6 }]),
    }, 1),
    [[0, "curious"]], "curious", STEEPLE, "both", [[0.04, { L: "finger", R: "finger" }]])),

  /* ——— correct ×4 ——— */
  NOOR_SIGNATURE,
  own(r("correct", "noor-two-thumbs", "And the other one", "One thumb up, a beat — then the other joins, as if she couldn't help it.",
    act("noor-two-thumbs", 3, [
      [0, DOWN], [0.16, { L: DOWN.L, R: [136, 210] }], [0.26, THUMB], [0.31, { L: DOWN.L, R: [157, 183] }], [0.36, THUMB], [0.44, THUMB],
      [0.58, THUMBS], [0.63, { L: [43, 183], R: THUMB.R }], [0.68, THUMBS], [0.78, THUMBS], [0.88, SIDES], [1, DOWN],
    ], [lift(0.7, { at: 0.5 }), {
      head: turn([0, 0], [0.2, 5], [0.46, 5], [0.56, -1], [0.88, 0], [1, 0]),
      torso: turn([0, 0], [0.2, 2], [0.46, 2], [0.58, 0], [1, 0]),
    }]),
    [[0, "neutral"], [0.16, "happy"], [0.5, "oops"], [0.6, "delighted"]], "delighted", THUMBS, "both",
    [[0.06, { R: "thumb" }], [0.5, { L: "thumb", R: "thumb" }], [0.94, {}]])),
  own(r("correct", "noor-air-tick", "A tick in the air", "Draws her pencil and ticks the air — a teacher's tick — and the tick stays a moment.",
    act("noor-air-tick", 3.2, [[0, DOWN], [0.12, POCKET], [0.32, TICK0], [0.41, TICK1, "line"], [0.52, TICK2, "line"], [0.64, ADMIRE], [0.84, ADMIRE], [1, DOWN]], [lift(0.5, { at: 0.46 }), {
      head: turn([0, 0], [0.24, 4], [0.5, 6], [0.84, 6], [1, 0]),
      "fx-tickA": shows(0.41, 0.86),
      "fx-tickB": shows(0.52, 0.86),
      "fx-tickSpark": shows(0.56, 0.84),
    }]),
    [[0, "neutral"], [0.3, "focused"], [0.5, "delighted"]], "delighted", ADMIRE, "both", [[0.14, { R: "pencil" }], [0.94, {}]]), ["tick"]),
  own(r("correct", "noor-applause", "Soft applause", "Three small fingertip claps at her chest, eyes closed in a smile — a teacher's applause.",
    act("noor-applause", 2.4, [
      [0, DOWN], [0.14, CLAP_OPEN], [0.21, CLAP_SHUT, "line"], [0.28, CLAP_OPEN, "line"], [0.36, CLAP_SHUT, "line"], [0.44, CLAP_OPEN, "line"], [0.52, CLAP_SHUT, "line"], [0.86, CLAP_SHUT], [1, DOWN],
    ], [lift(0.4, { at: 0.5 }), {
      head: keys([0, {}], [0.2, { y: 1.2, e: EASE.settle }], [0.28, {}], [0.36, { y: 1.2, e: EASE.settle }], [0.44, {}], [0.52, { y: 1.2, e: EASE.settle }], [0.62, { r: 4, e: EASE.settle }], [0.86, { r: 4 }], [1, {}]),
    }]),
    [[0, "neutral"], [0.14, "happy"]], "happy", CLAP_SHUT, "both", [[0.06, { L: "palm", R: "palm" }], [0.94, {}]])),

  /* ——— partly correct ×2 ——— */
  pick("partial-nearly"),
  own(r("partial", "noor-tick-circle", "Tick, and this bit", "Ticks the air with her pencil, then draws a small ring below it — this bit — and taps the ring. Never says how much.",
    act("noor-tick-circle", 3.8, [
      [0, DOWN], [0.1, POCKET], [0.24, TICK0], [0.31, TICK1, "line"], [0.4, TICK2, "line"],
      [0.48, ringAt(5, 0)], [0.53, ringAt(0, 5), "line"], [0.58, ringAt(-5, 0), "line"], [0.63, ringAt(0, -5), "line"], [0.68, ringAt(5, 0), "line"],
      [0.72, ringAt(0, 0), "line"], [0.76, ringAt(-1, 3), "line"], [0.8, ringAt(0, 0), "line"], [0.95, POCKET], [1, DOWN],
    ], {
      head: turn([0, 0], [0.2, 4], [0.4, 4], [0.48, 8], [0.7, 8], [0.84, 7], [1, 0]),
      torso: turn([0, 0], [0.4, 0], [0.48, 1.5], [0.84, 1.5], [1, 0]),
      "fx-tickA": shows(0.31, 0.86),
      "fx-tickB": shows(0.4, 0.86),
      "fx-ring": shows(0.68, 0.86),
    }),
    [[0, "neutral"], [0.3, "happy"], [0.46, "curious"]], "curious", ringAt(0, 0), "both", [[0.12, { R: "pencil" }], [0.94, {}]]), ["tickCircle"]),

  /* ——— incorrect ×3, plus the rich ending ——— */
  pick("incorrect-oops"),
  own(r("incorrect", "noor-hand-up", "Hand up", "Puts her own hand up, like a student with a question — a miss is only a question — then lowers it and turns to look at the key.",
    act("noor-hand-up", 2.8, [
      [0, DOWN], [0.16, RAISE], [0.24, { L: DOWN.L, R: swing("R", RAISE_HAND, 8) }], [0.32, { L: DOWN.L, R: swing("R", RAISE_HAND, -8) }],
      [0.4, { L: DOWN.L, R: swing("R", RAISE_HAND, 8) }], [0.48, RAISE], [0.62, RAISE], [0.78, DOWN], [1, DOWN],
    ], [lift(0.8, { at: 0.1 }), {
      head: turn([0, 0], [0.16, -4], [0.5, -4], [0.66, 0], [0.8, 7], [1, 7]),
      torso: turn([0, 0], [0.7, 0], [0.82, 1.5], [1, 1.5]),
    }]),
    [[0, "curious"], [0.2, "happy"], [0.62, "curious"]], "curious", DOWN, "both", [[0.1, { R: "palm" }], [0.72, {}]])),
  own(r("incorrect", "noor-look-together", "Let's look together", "Half-turns beside the learner and opens a palm toward the key, with a small nod — come, let's look at it together.",
    act("noor-look-together", 3, [[0, CHEST], [0.2, CHEST], [0.42, TOGETHER], [0.8, TOGETHER], [1, CHEST]], [{
      head: turn([0, 0], [0.14, -3], [0.3, -3], [0.44, 8], [0.8, 8], [1, 0]),
      torso: turn([0, 0], [0.2, 0], [0.42, 3], [0.8, 3], [1, 0]),
      root: keys([0, {}], [0.2, { e: EASE.settle }], [0.42, { x: 3, e: EASE.settle }], [0.8, { x: 3, e: EASE.settle }], [1, {}]),
    }, {
      head: keys([0, {}], [0.6, { e: EASE.settle }], [0.68, { y: 1.6, e: EASE.settle }], [0.78, {}], [1, {}]),
    }]),
    [[0, "oops"], [0.3, "neutral"], [0.5, "curious"]], "neutral", TOGETHER, "both", [[0, { R: "clasp" }], [0.3, { R: "palm" }], [0.94, { R: "clasp" }]])),
  own(r("incorrect", "noor-pencil-point", "Pencil to the key", "Rich only: she draws her pencil and points it at the key beside her, turning her shoulders to it.",
    act("noor-pencil-point", 3, [[0, CHEST], [0.16, POCKET], [0.36, POINT], [0.74, POINT], [0.88, { L: CHEST.L, R: POCKET.R }], [1, CHEST]], {
      head: turn([0, 0], [0.14, -4], [0.3, -4], [0.4, 7], [0.74, 7], [1, 0]),
      torso: turn([0, 0], [0.3, 0], [0.4, 3], [0.74, 3], [1, 0]),
    }),
    [[0, "oops"], [0.3, "neutral"], [0.42, "curious"]], "curious", POINT, "rich", [[0, { R: "clasp" }], [0.18, { R: "pencilPoint" }], [0.9, { R: "clasp" }]])),

  /* ——— unlock ——— */
  own(r("unlock", "noor-after-you", "After you", "Steps aside and holds the way open with a small bow — after you. The new material is the learner's; she only opens the door.",
    act("noor-after-you", 3.2, [[0, DOWN], [0.22, DOOR], [0.84, DOOR], [1, DOWN]], {
      /* a step aside, and back again only as the loop closes */
      root: keys([0, {}], [0.08, { e: EASE.settle }], [0.22, { x: -8, e: EASE.settle }], [0.86, { x: -8, e: EASE.settle }], [1, {}]),
      hipL: turn([0, 0], [0.08, 0], [0.14, -8], [0.22, 0], [1, 0]),
      kneeL: turn([0, 0], [0.08, 0], [0.14, -10], [0.22, 0], [1, 0]),
      hipR: turn([0, 0], [0.86, 0], [0.92, 8], [1, 0]),
      kneeR: turn([0, 0], [0.86, 0], [0.92, 10], [1, 0]),
      head: keys([0, {}], [0.24, { e: EASE.settle }], [0.36, { y: 2.6, r: 3, e: EASE.settle }], [0.56, { y: 2.2, r: 3, e: EASE.settle }], [0.7, { r: 5, e: EASE.settle }], [0.86, { r: 5, e: EASE.settle }], [1, {}]),
      torso: keys([0, {}], [0.24, { e: EASE.settle }], [0.36, { y: 1.4, r: 2, e: EASE.settle }], [0.56, { y: 1.2, r: 2, e: EASE.settle }], [0.7, {}], [1, {}]),
    }),
    [[0, "delighted"], [0.3, "happy"], [0.7, "delighted"]], "delighted", DOOR, "both", [[0.1, { L: "palm", R: "palm" }], [0.94, {}]])),

  /* ——— travel, minimal only ——— */
  own(r("travel", "noor-walk", "A calm walk", "Dock to verdict at a calm walk — no skipping — with the duckling waddling after her; on arrival she smooths her dress.",
    act("noor-walk", 3, [
      [0, DOWN], [0.16, { L: [72, 236], R: [128, 234] }], [0.26, { L: [80, 234], R: [120, 236] }], [0.36, { L: [72, 236], R: [128, 234] }],
      [0.46, { L: [80, 234], R: [120, 236] }], [0.56, { L: [72, 236], R: [128, 234] }], [0.66, DOWN],
      [0.77, { L: [95, 214], R: [105, 214] }], [0.85, { L: [96, 228], R: [104, 228] }], [0.94, DOWN], [1, DOWN],
    ], {
      root: keys(
        [0, { x: -28 }], [0.06, { x: -28 }], [0.16, { x: -18, y: -1.2 }], [0.26, { x: -8 }], [0.36, { x: 2, y: -1.2 }],
        [0.46, { x: 12 }], [0.56, { x: 20, y: -1.2 }], [0.66, { x: 28, e: EASE.settle }], [0.94, { x: 28 }], [1, { x: -28 }],
      ),
      hipL: turn([0, 0], [0.06, 0], [0.16, 8], [0.26, -6], [0.36, 8], [0.46, -6], [0.56, 8], [0.66, 0], [1, 0]),
      hipR: turn([0, 0], [0.06, 0], [0.16, -6], [0.26, 8], [0.36, -6], [0.46, 8], [0.56, -6], [0.66, 0], [1, 0]),
      kneeL: turn([0, 0], [0.16, -6], [0.26, 0], [0.36, -6], [0.46, 0], [0.56, -6], [0.66, 0], [1, 0]),
      kneeR: turn([0, 0], [0.16, 0], [0.26, 6], [0.36, 0], [0.46, 6], [0.56, 0], [0.66, 0], [1, 0]),
      head: turn([0, 0], [0.1, 4], [0.66, 4], [0.76, -3], [0.88, 0], [1, 0]),
      "fx-duck": keys(
        [0, { x: -28 }], [0.14, { x: -28 }], [0.2, { x: -21, y: -1.5, r: 5 }], [0.26, { x: -14, r: -5 }], [0.32, { x: -7, y: -1.5, r: 5 }],
        [0.38, { x: 0, r: -5 }], [0.44, { x: 7, y: -1.5, r: 5 }], [0.5, { x: 14, r: -5 }], [0.56, { x: 20, y: -1.5, r: 4 }],
        [0.62, { x: 24, r: -3 }], [0.7, { x: 26, e: EASE.settle }], [0.94, { x: 26 }], [1, { x: -28 }],
      ),
    }),
    [[0, "neutral"], [0.66, "happy"], [0.9, "neutral"]], "neutral", undefined, "minimal", [[0.72, { L: "palm", R: "palm" }], [0.93, {}]]), ["duckAway"]),
];

/** Characters whose reactions are drawn so far (2026-10-03: Noor first; the rest follow). */
const DRAWN: Partial<Record<CastSlug, Reaction[]>> = {
  noor: NOOR,
};

/** Every variant a character draws from, by state, in `STATE_INFO`'s order. */
export function reactionsFor(slug: CastSlug): Record<ReactionState, Reaction[]> | undefined {
  const all = DRAWN[slug];
  if (!all) return undefined;
  const out = {} as Record<ReactionState, Reaction[]>;
  for (const { state } of STATE_INFO) out[state] = all.filter((x) => x.state === state);
  return out;
}

/** A variant held at one moment of its loop (`t`, 0–1): every joint sampled there and the hands
 *  at that frame — for a storyboard of the move, or a still at a chosen beat. */
export function poseAt(a: Reaction, t: number): Pose | undefined {
  if (!a.act) return undefined;
  const tracks: Tracks = {};
  for (const [j, track] of Object.entries(a.act.motion.tracks) as [keyof Tracks, Keyframe[]][]) {
    if (j === "shadow" || !track?.length) continue;
    const v = sample(track, t);
    tracks[j] = [{ translate: `${v.x}px ${v.y}px`, rotate: `${v.r}deg`, ...(v.o !== undefined ? { opacity: v.o } : {}) }];
  }
  return { ...a.act, hands: [], motion: { duration: 1, still: 0, tracks } };
}

/** A drawn character's hands at rest — its mitten with the grips' edge — for figures outside a
 *  reaction (its portrait, its lines), so its hands look the same everywhere it is drawn. */
export function restGrip(slug: CastSlug): Grips | undefined {
  const hands = castMember(slug)?.figure.attitude?.hands;
  if (!DRAWN[slug] || !hands) return undefined;
  /* the right hand folded over the left, its fingers laid across with the arm's turn undone */
  return withTurn({ L: "mitt", R: "clasp" }, hands);
}
