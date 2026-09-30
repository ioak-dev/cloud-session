"use client";

import * as React from "react";

import type { Candidate } from "../candidates";
import { Face, type Mood } from "./face";
import { Hair, type HairId } from "./hair";
import { useJointMotion } from "./motion";
import { outfitParts, type Cloth, type OutfitId } from "./outfit";
import { motionFor, POSES, type PoseId } from "./poses";
import { Backpack, Book, HeadProps, type PropId } from "./props";
import { SparkTrail } from "./sparks";
import { CHIBI, FIGURE_VB, HEAD_VB, lerp, pivot, type P } from "./skeleton";

/**
 * One candidate on the shared rig (`skeleton.ts`), in a pose, a mood, an outfit and a hair style.
 * Forward kinematics by nesting: each segment is a `<g data-joint>` drawn at rest with its origin on
 * the joint it hangs from, so rotating a shoulder carries the elbow and hand. The torso and head are
 * split into a behind group and a front group sharing one joint name, so hair and tails sit behind
 * the body and faces in front of it, and both move together.
 */
export type FigureProps = {
  c: Candidate;
  pose?: PoseId;
  mood?: Mood;
  outfit?: OutfitId;
  hair?: HairId;
  props?: PropId[];
  still?: boolean;
  viewBox?: string;
  silhouette?: boolean;
  className?: string;
  /** Present when the figure is the only carrier on screen; decorative otherwise. */
  label?: string;
};

function Seg({ a, b, w, color, ink }: { a: P; b: P; w: number; color: string; ink: string }) {
  return (
    <g strokeLinecap="round">
      {ink !== "none" && (
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={ink} strokeWidth={w + 3} />
      )}
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} />
    </g>
  );
}

/**
 * A mitten: a soft oval along the forearm with a thumb on the side toward the body. No outline —
 * the thumb is the same colour, so it reads as one rounded shape with a bump.
 */
function Mitten({ el, wr, at, r, color }: { el: P; wr: P; at: P; r: number; color: string }) {
  const dx = wr[0] - el[0];
  const dy = wr[1] - el[1];
  const len = Math.hypot(dx, dy) || 1;
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  // the thumb sits on the side of the hand nearer the body's centre line
  let nx = -dy / len;
  let ny = dx / len;
  if (Math.sign(nx) !== Math.sign(100 - at[0])) {
    nx = -nx;
    ny = -ny;
  }
  const tx = at[0] + nx * r * 0.85 - (dx / len) * r * 0.35;
  const ty = at[1] + ny * r * 0.85 - (dy / len) * r * 0.35;
  return (
    <g>
      <circle cx={tx} cy={ty} r={r * 0.5} fill={color} />
      <ellipse
        cx={at[0]}
        cy={at[1]}
        rx={r * 1.18}
        ry={r * 0.98}
        transform={`rotate(${deg} ${at[0]} ${at[1]})`}
        fill={color}
      />
    </g>
  );
}

function ClothOn({ a, b, cloth, ink }: { a: P; b: P; cloth: Cloth; ink: string }) {
  if (!cloth) return null;
  return (
    <Seg
      a={lerp(a, b, cloth.from)}
      b={lerp(a, b, cloth.to)}
      w={cloth.w}
      color={cloth.color}
      ink={ink}
    />
  );
}

export function NixFigure({
  c,
  pose = "idle",
  mood,
  outfit,
  hair,
  props = [],
  still = false,
  viewBox = FIGURE_VB,
  silhouette = false,
  className,
  label,
}: FigureProps) {
  const ref = React.useRef<SVGSVGElement>(null);
  const uid = React.useId().replace(/:/g, "");
  const f = c.frame ?? CHIBI;
  const j = f.j;
  const p = POSES.find((x) => x.id === pose) ?? POSES[0];
  const motion = React.useMemo(() => motionFor(p, f), [p, f]);
  useJointMotion(ref, motion, still, `${c.id}|${outfit ?? ""}|${props.join(",")}`);

  const pal = c.pal;
  /** Outlines; the face keeps `pal.ink` for its features. */
  const ink = pal.line ?? pal.ink;
  /** The body's own outline: none when the character is drawn by colour alone. */
  const bodyLine = c.outline === false ? "none" : ink;
  const o = outfitParts(outfit ?? c.outfit, pal, f.torso);
  const on = new Set<PropId>([...(c.props ?? []), ...props, ...(o.brings ?? [])]);
  const h = c.kind === "animal" ? null : Hair({ id: hair ?? c.hair ?? "bob", pal });
  const face = mood ?? p.mood;
  const ctx = { pal, uid, mood: face };
  const k = f.w.cloth;
  const scaled = (cl: Cloth): Cloth => (cl ? { ...cl, w: cl.w * k } : null);

  const leg = (s: "L" | "R") => {
    const hip = j[`hip${s}`];
    const knee = j[`knee${s}`];
    const foot = j[`foot${s}`];
    const out = s === "L" ? -1 : 1;
    const shoe = o.shoe ?? pal.paw;
    const fx = foot[0] + out * 3 * k;
    const fy = foot[1] + 5;
    return (
      <g data-joint={`hip${s}`} style={pivot(`hip${s}`, j)}>
        <Seg a={hip} b={knee} w={f.w.thigh} color={pal.limb} ink={bodyLine} />
        <ClothOn a={hip} b={knee} cloth={scaled(o.thigh)} ink={ink} />
        <g data-joint={`knee${s}`} style={pivot(`knee${s}`, j)}>
          <Seg a={knee} b={foot} w={f.w.shin} color={pal.limb} ink={bodyLine} />
          <ClothOn a={knee} b={foot} cloth={scaled(o.shin)} ink={ink} />
          <ellipse
            cx={fx}
            cy={fy}
            rx={10 * Math.max(k, 0.8)}
            ry={6 * Math.max(k, 0.8)}
            fill={shoe}
            stroke={ink}
            strokeWidth={2.4}
          />
          {o.shoe && (
            <path
              d={`M${fx - 8} ${fy + 2} L${fx + 8} ${fy + 2}`}
              stroke={ink}
              strokeOpacity={0.35}
              strokeWidth={2}
            />
          )}
        </g>
      </g>
    );
  };

  const arm = (s: "L" | "R") => {
    const sh = j[`shoulder${s}`];
    const el = j[`elbow${s}`];
    const wr = j[`wrist${s}`];
    const hand: P = lerp(el, wr, 1.12);
    return (
      <g data-joint={`shoulder${s}`} style={pivot(`shoulder${s}`, j)}>
        <Seg a={sh} b={el} w={f.w.upper} color={pal.limb} ink={bodyLine} />
        <ClothOn a={sh} b={el} cloth={scaled(o.upper)} ink={ink} />
        <g data-joint={`elbow${s}`} style={pivot(`elbow${s}`, j)}>
          <Seg a={el} b={wr} w={f.w.fore} color={pal.limb} ink={bodyLine} />
          <ClothOn a={el} b={wr} cloth={scaled(o.fore)} ink={ink} />
          {c.hands === "mitten" ? (
            <Mitten el={el} wr={wr} at={hand} r={f.w.hand} color={pal.paw} />
          ) : (
            <circle
              cx={hand[0]}
              cy={hand[1]}
              r={f.w.hand}
              fill={pal.paw}
              stroke={bodyLine}
              strokeWidth={2.2}
            />
          )}
        </g>
      </g>
    );
  };

  return (
    <svg
      ref={ref}
      viewBox={viewBox === HEAD_VB ? f.headVB : viewBox}
      className={className}
      style={silhouette ? { filter: "brightness(0)" } : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-still={still ? "true" : undefined}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        data-joint="shadow"
        style={pivot("root", j)}
        cx={100}
        cy={282}
        rx={42}
        ry={6}
        fill={pal.ink}
        opacity={0.12}
      />
      {c.trail && <SparkTrail at={c.trail} glow={pal.glow} edge="var(--char-glow-edge)" />}
      <g data-joint="root" style={pivot("root", j)}>
        <g data-joint="torso" style={pivot("torso", j)}>
          <g transform={f.torsoFit}>
            {c.behind?.(ctx)}
            {on.has("backpack") && <Backpack pal={pal} part="back" />}
          </g>
          <g data-joint="head" style={pivot("head", j)}>
            <g transform={f.headFit}>
              {o.back}
              {h?.back}
            </g>
          </g>
        </g>

        {c.legs !== false && leg("L")}
        {c.legs !== false && leg("R")}

        <g data-joint="torso" style={pivot("torso", j)}>
          <rect
            x={f.neck.x}
            y={f.neck.y}
            width={f.neck.w}
            height={f.neck.h}
            rx={f.neck.w / 3}
            fill={pal.skin}
            stroke={bodyLine}
            strokeWidth={2.2}
          />
          <g transform={f.torsoFit}>
            <path
              d={f.torso}
              fill={c.body}
              stroke={bodyLine}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            {c.belly?.(ctx)}
            {o.torso}
          </g>
          <g transform={f.hemFit}>{o.hem}</g>
          <g transform={f.torsoFit}>
            {o.collar}
            {on.has("backpack") && <Backpack pal={pal} part="straps" />}
            {c.pendant?.(ctx)}
          </g>
          {pose === "read" && (
            <g transform={f.handsFit}>
              <Book pal={pal} />
            </g>
          )}

          <g data-joint="head" style={pivot("head", j)}>
            <g transform={f.headFit}>
              {c.head(ctx)}
              {h?.front}
              <Face
                mood={face}
                style={c.face}
                pal={pal}
                browColor={c.kind === "animal" ? undefined : pal.hair}
              />
              <HeadProps on={on} pal={pal} eyeY={c.face.eyeY} eyeGap={c.face.eyeGap} />
              {/* the signature rides over any hat — it is what keeps the character itself */}
              {c.top?.(ctx)}
            </g>
          </g>

          {c.arms !== false && arm("L")}
          {c.arms !== false && arm("R")}
        </g>
      </g>
    </svg>
  );
}
