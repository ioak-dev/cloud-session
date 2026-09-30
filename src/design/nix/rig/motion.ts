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

/** One keyframe's hand targets, in chibi space. */
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

    const io = new IntersectionObserver(([entry]) => {
      for (const a of running) {
        if (entry.isIntersecting && document.visibilityState === "visible") a.play();
        else a.pause();
      }
    });
    io.observe(svg);

    return () => {
      io.disconnect();
      running.forEach((a) => a.cancel());
      touched.forEach((el) => apply(el, {}));
    };
  }, [ref, motion, still, drawing]);
}
