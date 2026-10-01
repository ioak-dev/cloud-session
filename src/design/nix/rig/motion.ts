"use client";

import * as React from "react";

import { CHIBI, J, reach, type Body, type JointName, type P } from "./skeleton";

/**
 * Motion as data (`ui-design-language.md` §9.4.3 — "a pose is data", "one declared clock"). A
 * `Motion` is per-joint keyframe tracks over one loop; `useJointMotion` plays them with the Web
 * Animations API on every `<g data-joint>` in the figure. Nothing here simulates — it interpolates
 * declared keyframes, so a motion can be read and bounded by inspection.
 */
export type Track = Keyframe[];
export type Target = JointName | "shadow" | "glow";

export type Motion = {
  /** Seconds per loop. */
  duration: number;
  easing?: string;
  /** The keyframe held as a still pose — under reduced motion, or when the guide is stilled. */
  still?: number;
  tracks: Partial<Record<Target, Track>>;
};

export const rot = (...d: number[]): Track => d.map((v) => ({ rotate: `${v}deg` }));
export const lift = (...y: number[]): Track => y.map((v) => ({ translate: `0px ${v}px` }));
export const squash = (...k: [number, number][]): Track =>
  k.map(([x, y]) => ({ scale: `${x} ${y}` }));
export const fade = (...o: number[]): Track => o.map((v) => ({ opacity: v }));
/** One keyframe of a whole-joint move: offset, rotation, scale and opacity. */
export type Key = { x?: number; y?: number; r?: number; sx?: number; sy?: number; o?: number; e?: string };

/**
 * A track with its timing declared — [offset 0–1, key] pairs — so a joint can hold, snap and
 * overshoot rather than ease evenly. `e` is the easing of the segment that starts at that key.
 */
export const keys = (...k: [number, Key][]): Track =>
  k.map(([offset, v]) => ({
    offset,
    translate: `${v.x ?? 0}px ${v.y ?? 0}px`,
    rotate: `${v.r ?? 0}deg`,
    scale: `${v.sx ?? 1} ${v.sy ?? 1}`,
    ...(v.o !== undefined ? { opacity: v.o } : {}),
    ...(v.e ? { easing: v.e } : {}),
  }));

/** Opacity with its timing declared: [offset, opacity] pairs. */
export const fadeAt = (...k: [number, number][]): Track => k.map(([offset, opacity]) => ({ offset, opacity }));


/**
 * Hand targets over time: [offset, hands] keys sampled into `n` evenly spaced frames for `arms`,
 * moving straight between keys and holding where two keys repeat.
 */
export function handsAt(k: [number, Required<Pick<Hands, "L" | "R">> & Hands][], n = 24): Hands[] {
  const out: Hands[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let a = k[0];
    let b = k[k.length - 1];
    for (let q = 0; q < k.length - 1; q++) {
      if (t >= k[q][0] && t <= k[q + 1][0]) {
        a = k[q];
        b = k[q + 1];
        break;
      }
    }
    const u = b[0] === a[0] ? 0 : (t - a[0]) / (b[0] - a[0]);
    const mix = (p: P, q: P): P => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
    out.push({ ...a[1], L: mix(a[1].L, b[1].L), R: mix(a[1].R, b[1].R) });
  }
  return out;
}

/** A rotation track with its timing declared: [offset 0–1, degrees] pairs, so a joint can lag
 *  another, hold, or flick. */
export const rotAt = (...k: [number, number][]): Track =>
  k.map(([offset, v]) => ({ offset, rotate: `${v}deg` }));

/** One keyframe's hand targets, in chibi space. */
/* ——— The principles: anticipation, overshoot, squash and stretch ———
 * Still declared keyframes on one clock — nothing simulates. An action winds up the other way
 * before it goes (anticipation), passes its mark and comes back (overshoot and settle), and a body
 * that leaves or meets the ground squashes and stretches, keeping its volume. */

/** Easings. `overshoot` passes the target and settles back; `anticipate` pulls back before it
 *  goes; `snap` arrives fast and eases in; `settle` is a gentle finish. */
export const EASE = {
  overshoot: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  anticipate: "cubic-bezier(0.36, 0, 0.66, -0.56)",
  snap: "cubic-bezier(0.2, 0.9, 0.3, 1)",
  settle: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  /** A fall that picks up speed: slow off the top, fast into the ground. */
  fall: "cubic-bezier(0.6, 0, 0.9, 0.4)",
} as const;

/** Scale that keeps volume: stretch one way and the other gives. */
const vol = (y: number): [number, number] => [Math.round((1 / Math.sqrt(y)) * 1000) / 1000, y];
const sc = ([x, y]: [number, number]) => `${x} ${y}`;

type ActionOpts = {
  /** Where in the loop the wind-up starts (0–1). */
  at?: number;
  /** How far the wind-up pulls the other way, as a share of the move. */
  wind?: number;
  /** How far it passes its mark before settling, as a share of the move. */
  over?: number;
  /** Where in the loop it lets go and returns to rest. */
  back?: number;
};

/**
 * One action on one channel, with the principles built in: rest → a wind-up the other way → a
 * snap past the mark → back to the mark → hold → return. `rotate` in degrees, `lift` in px (negative
 * is up).
 */
export function action(
  channel: "rotate" | "lift",
  from: number,
  to: number,
  { at = 0.12, wind = 0.25, over = 0.18, back = 0.8 }: ActionOpts = {},
): Track {
  const d = to - from;
  const v = (x: number) => (channel === "rotate" ? { rotate: `${x}deg` } : { translate: `0px ${x}px` });
  return [
    { ...v(from), offset: 0 },
    { ...v(from), offset: at, easing: EASE.anticipate },
    { ...v(from - d * wind), offset: at + 0.1, easing: EASE.snap },
    { ...v(to + d * over), offset: at + 0.2, easing: EASE.settle },
    { ...v(to), offset: at + 0.3 },
    { ...v(to), offset: back, easing: EASE.settle },
    { ...v(from), offset: 1 },
  ];
}

/**
 * A jump with squash and stretch, on the root (whose pivot is the feet, so the body squashes into
 * the ground): crouch and squash (anticipation), launch and stretch, round at the top, stretch as
 * it falls, squash on landing, rebound past round (overshoot), settle. The shadow shrinks as it
 * rises. `n` jumps share the loop.
 */
export function jump(height: number, { at = 0.08, n = 1 }: { at?: number; n?: number } = {}): Partial<Record<Target, Track>> {
  const root: Keyframe[] = [{ translate: "0px 0px", scale: "1 1", offset: 0 }];
  const shadow: Keyframe[] = [{ scale: "1 1", offset: 0 }];
  const span = (1 - at) / n;
  for (let i = 0; i < n; i++) {
    const t = (k: number) => Math.min(1, at + i * span + span * k);
    const h = height;
    root.push(
      { translate: "0px 0px", scale: "1 1", offset: t(0), easing: EASE.anticipate },
      { translate: "0px 3px", scale: sc(vol(0.82)), offset: t(0.14), easing: EASE.snap },
      { translate: `0px ${-h * 0.55}px`, scale: sc(vol(1.16)), offset: t(0.26), easing: "ease-out" },
      { translate: `0px ${-h}px`, scale: "1 1", offset: t(0.42), easing: "ease-in" },
      { translate: `0px ${-h * 0.4}px`, scale: sc(vol(1.12)), offset: t(0.56), easing: "ease-in" },
      { translate: "0px 2px", scale: sc(vol(0.8)), offset: t(0.64), easing: EASE.snap },
      { translate: "0px 0px", scale: sc(vol(1.06)), offset: t(0.74), easing: EASE.settle },
      { translate: "0px 0px", scale: "1 1", offset: t(0.86) },
    );
    shadow.push(
      { scale: "1 1", offset: t(0) },
      { scale: "1.08 1", offset: t(0.14) },
      { scale: "0.72 0.8", offset: t(0.42) },
      { scale: "1.12 1", offset: t(0.64) },
      { scale: "1 1", offset: t(0.86) },
    );
  }
  root.push({ translate: "0px 0px", scale: "1 1", offset: 1 });
  shadow.push({ scale: "1 1", offset: 1 });
  return { root, shadow };
}

/**
 * A pop: a sudden feeling taken in the body without leaving the ground — a quick squash (the
 * breath in), a stretch taller than rest (the feeling), a small overshoot back through round, and
 * settle. On the torso, whose pivot is its base.
 */
export function pop(amount = 1, { at = 0.1 }: { at?: number } = {}): Partial<Record<Target, Track>> {
  const a = amount;
  return {
    torso: [
      { scale: "1 1", offset: 0 },
      { scale: "1 1", offset: at, easing: EASE.anticipate },
      { scale: sc(vol(1 - 0.12 * a)), offset: at + 0.08, easing: EASE.snap },
      { scale: sc(vol(1 + 0.14 * a)), offset: at + 0.2, easing: EASE.settle },
      { scale: sc(vol(1 - 0.04 * a)), offset: at + 0.32, easing: EASE.settle },
      { scale: "1 1", offset: at + 0.44 },
      { scale: "1 1", offset: 1 },
    ],
  };
}

/**
 * A sag: a let-down taken gently — the body sinks and widens a little, holds, then lifts back with a
 * small overshoot, as if taking a breath and trying again. For an incorrect answer: soft, never a
 * collapse.
 */
export function sag({ at = 0.1 }: { at?: number } = {}): Partial<Record<Target, Track>> {
  return {
    torso: [
      { scale: "1 1", translate: "0px 0px", offset: 0 },
      { scale: "1 1", translate: "0px 0px", offset: at, easing: EASE.settle },
      { scale: sc(vol(0.93)), translate: "0px 2px", offset: at + 0.2, easing: EASE.settle },
      { scale: sc(vol(0.93)), translate: "0px 2px", offset: at + 0.45, easing: EASE.overshoot },
      { scale: sc(vol(1.03)), translate: "0px -1px", offset: at + 0.62, easing: EASE.settle },
      { scale: "1 1", translate: "0px 0px", offset: at + 0.74 },
      { scale: "1 1", translate: "0px 0px", offset: 1 },
    ],
  };
}

export type Hands = { L?: P; R?: P; outL?: boolean; outR?: boolean };

const armLen = (j: Body["j"], s: "L" | "R") =>
  Math.hypot(j[`elbow${s}`][0] - j[`shoulder${s}`][0], j[`elbow${s}`][1] - j[`shoulder${s}`][1]) +
  Math.hypot(j[`wrist${s}`][0] - j[`elbow${s}`][0], j[`wrist${s}`][1] - j[`elbow${s}`][1]);

/**
 * Arms by hand target: one keyframe per entry, solved with two-bone reach on `body`. Targets are
 * authored in chibi space and carried onto another body about its shoulder, scaled by arm length,
 * so one pose drives every body.
 */
export function arms(frames: Hands[], body: Body = CHIBI): Partial<Record<Target, Track>> {
  const out: Partial<Record<Target, Track>> = {};
  for (const side of ["L", "R"] as const) {
    if (!frames.some((f) => f[side])) continue;
    const S0 = J[`shoulder${side}`];
    const S = body.j[`shoulder${side}`];
    const k = armLen(body.j, side) / armLen(J, side);
    const solved = frames.map((f) => {
      const t = f[side];
      if (!t) return { shoulder: 0, elbow: 0 };
      const target: P = [S[0] + (t[0] - S0[0]) * k, S[1] + (t[1] - S0[1]) * k];
      return reach(side, target, f[`out${side}`] ?? true, body.j);
    });
    out[`shoulder${side}`] = rot(...solved.map((s) => s.shoulder));
    out[`elbow${side}`] = rot(...solved.map((s) => s.elbow));
  }
  return out;
}

/** A blink every few seconds, laid over every motion so no pose has to carry it. */
const BLINK: Keyframe[] = [
  { scale: "1 1", offset: 0 },
  { scale: "1 1", offset: 0.9 },
  { scale: "1 0.1", offset: 0.93 },
  { scale: "1 1", offset: 0.96 },
  { scale: "1 1", offset: 1 },
];

function stillFrame(track: Track, index: number): Keyframe {
  return track[Math.min(index, track.length - 1)] ?? {};
}

function apply(el: SVGElement, frame: Keyframe) {
  el.style.rotate = (frame.rotate as string) ?? "";
  el.style.translate = (frame.translate as string) ?? "";
  el.style.scale = (frame.scale as string) ?? "";
  el.style.opacity = frame.opacity !== undefined ? String(frame.opacity) : "";
}

/**
 * Plays `motion` on the rig inside `ref`. Under `prefers-reduced-motion`, or when `still`, every
 * joint takes the motion's still keyframe and nothing loops (`brd.md` R99). Loops pause while the
 * figure is off-screen or the page is hidden.
 */
export function useJointMotion(
  ref: React.RefObject<SVGSVGElement | null>,
  motion: Motion,
  still = false,
  /** Changes when the drawing inside `ref` does (another character, outfit or prop), so joints
   *  that only the new drawing has are picked up. */
  drawing = "",
) {
  React.useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frozen = still || reduce;
    const touched: SVGElement[] = [];
    const running: Animation[] = [];

    for (const [target, track] of Object.entries(motion.tracks) as [Target, Track][]) {
      svg.querySelectorAll<SVGElement>(`[data-joint="${target}"]`).forEach((el) => {
        touched.push(el);
        if (frozen) {
          apply(el, stillFrame(track, motion.still ?? 0));
          return;
        }
        running.push(
          el.animate(track, {
            duration: motion.duration * 1000,
            iterations: Infinity,
            easing: motion.easing ?? "ease-in-out",
          }),
        );
      });
    }
    if (!frozen) {
      svg.querySelectorAll<SVGElement>(`[data-joint="blink"]`).forEach((el) => {
        running.push(el.animate(BLINK, { duration: 4200, iterations: Infinity }));
      });
    }

    /* Off screen, nothing moves: the joints pause, and the figure is marked so CSS stops its
       live spark trail too (`studio.css`). A page holds hundreds of figures; without this every
       one of their sparks keeps animating and starves what is on screen. */
    const io = new IntersectionObserver(([entry]) => {
      const on = entry.isIntersecting && document.visibilityState === "visible";
      /* cancelled rather than paused: a paused animation still holds its element as a layer of
         its own, and the browser re-checks every layer on the page each frame */
      for (const a of running) {
        if (on) a.play();
        else a.cancel();
      }
      if (on) svg.removeAttribute("data-offscreen");
      else svg.setAttribute("data-offscreen", "true");
    });
    io.observe(svg);

    return () => {
      io.disconnect();
      svg.removeAttribute("data-offscreen");
      running.forEach((a) => a.cancel());
      touched.forEach((el) => apply(el, {}));
    };
  }, [ref, motion, still, drawing]);
}
