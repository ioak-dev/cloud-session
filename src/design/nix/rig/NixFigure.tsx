"use client";

import * as React from "react";

import type { Candidate } from "../candidates";
import { Face, type Mood } from "./face";
import { GripHand, type Grips } from "./grip";
import { Hair, type HairId } from "./hair";
import { useJointMotion } from "./motion";
import { outfitParts, type Cloth, type OutfitId } from "./outfit";
import { motionFor, POSES, type Pose, type PoseId } from "./poses";
import { Backpack, Book, HeadProps, type PropId } from "./props";
import { SparkTrail } from "./sparks";
import type { Viseme } from "./visemes";
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
  /** Drawn in the head's own space, after the face, so it moves with the head: an ability's
   *  preview that is part of the face. */
  headFx?: React.ReactNode;
  /** A one-off act: its own mood, motion and arms, in place of a catalogue pose. */
  act?: Pose;
  /** The mouth shape while it talks (`visemes.ts`); drawn by the character's own mouth kit. */
  viseme?: Viseme;
  /** What each hand is doing (`grip.tsx`): a fist, a thumbs-up, a point, an open palm. */
  grip?: Grips;
  /** Carry the hand's thin edge up the bare arm too, so a forearm crossing the face still reads. */
  armEdge?: boolean;
  /** A character's own scene, in figure space, outside its body (2026-10-04): `under` is drawn on
   *  the ground behind it (a duckling at its feet), `over` in front of everything (a tick it draws
   *  in the air). Elements carry `data-joint="fx-…"` to move on the act's clock. */
  under?: React.ReactNode;
  over?: React.ReactNode;
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

/**
 * A wispy forearm: it tapers from the elbow like a tendril of smoke and ends in a soft round tip of
 * the same colour — no fingers, no thumb. One shape, so it reads as a limb at any size.
 */
function Tendril({ a, b, w, tip, color }: { a: P; b: P; w: number; tip: number; color: string }) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const w0 = w / 2;
  const w1 = tip * 0.55;
  const d = [
    `M${a[0] + nx * w0} ${a[1] + ny * w0}`,
    `L${b[0] + nx * w1} ${b[1] + ny * w1}`,
    `L${b[0] - nx * w1} ${b[1] - ny * w1}`,
    `L${a[0] - nx * w0} ${a[1] - ny * w0}`,
    "Z",
  ].join(" ");
  return (
    <g fill={color}>
      <circle cx={a[0]} cy={a[1]} r={w0} />
      <path d={d} />
      <circle cx={b[0]} cy={b[1]} r={tip * 0.95} />
    </g>
  );
}

/**
 * A chameleon's grip: two fat toes in a V, splayed about the forearm's line — the way a chameleon
 * holds a branch. One colour, no outline.
 */
function Tongs({ el, wr, at, r, color }: { el: P; wr: P; at: P; r: number; color: string }) {
  const deg = (Math.atan2(wr[1] - el[1], wr[0] - el[0]) * 180) / Math.PI;
  return (
    <g fill={color}>
      {[-34, 34].map((a) => {
        const t = ((deg + a) * Math.PI) / 180;
        const cx = at[0] + Math.cos(t) * r * 0.55;
        const cy = at[1] + Math.sin(t) * r * 0.55;
        return <ellipse key={a} cx={cx} cy={cy} rx={r * 0.95} ry={r * 0.56} transform={`rotate(${deg + a} ${cx} ${cy})`} />;
      })}
      <circle cx={at[0]} cy={at[1]} r={r * 0.62} />
    </g>
  );
}

function ClothOn({ a, b, cloth, ink }: { a: P; b: P; cloth: Cloth; ink: string }) {
  if (!cloth) return null;
  const from = lerp(a, b, cloth.from);
  const to = lerp(a, b, cloth.to);
  const trim = cloth.trim && lerp(a, b, cloth.to + cloth.trim.len);
  if (cloth.cap !== "butt") return <Seg a={from} b={to} w={cloth.w} color={cloth.color} ink={ink} />;
  return (
    <g strokeLinecap="butt">
      {/* the upper end stays round, so it joins the cloth above it at the joint */}
      <circle cx={from[0]} cy={from[1]} r={cloth.w / 2} fill={cloth.color} />
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={cloth.color} strokeWidth={cloth.w} />
      {trim && (
        <line x1={to[0]} y1={to[1]} x2={trim[0]} y2={trim[1]} stroke={cloth.trim!.color} strokeWidth={cloth.w} />
      )}
    </g>
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
  headFx,
  act,
  viseme,
  grip,
  armEdge = true,
  under,
  over,
}: FigureProps) {
  const ref = React.useRef<SVGSVGElement>(null);
  const uid = React.useId().replace(/:/g, "");
  const f = c.frame ?? CHIBI;
  const j = f.j;
  const base = act ?? POSES.find((x) => x.id === pose) ?? POSES[0];
  /* At rest, a character stands and looks like itself: its own expression and stance. */
  const att = c.attitude;
  const p = React.useMemo(
    () =>
      !act && base.id === "idle" && att
        ? {
            ...base,
            mood: att.mood ?? base.mood,
            hands: att.hands ? base.hands.map(() => att.hands!) : base.hands,
            motion: att.motion
              ? { ...base.motion, tracks: { ...base.motion.tracks, ...att.motion } }
              : base.motion,
          }
        : base,
    [base, att, act],
  );
  const tilt = att?.tilt ? `rotate(${att.tilt} ${j.head[0]} ${j.head[1]})` : undefined;
  const motion = React.useMemo(() => motionFor(p, f), [p, f]);
  useJointMotion(ref, motion, still, `${c.id}|${outfit ?? ""}|${props.join(",")}`);

  const pal = c.pal;
  /** Outlines; the face keeps `pal.ink` for its features. */
  const ink = pal.line ?? pal.ink;
  /** The body's own outline: none when the character is drawn by colour alone. */
  const bodyLine = c.outline === false ? "none" : ink;
  const worn = outfitParts(outfit ?? c.outfit, pal, f.torso);
  const o = c.wear ? c.wear(worn) : worn;
  const on = new Set<PropId>([...(c.props ?? []), ...props, ...(o.brings ?? [])]);
  const h = c.kind === "animal" || c.hair === undefined ? null : Hair({ id: hair ?? c.hair, pal });
  const face = mood ?? p.mood;
  const ctx = { pal, uid, mood: face, grip };
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
          {c.hands === "tong" && !o.shoe ? (
            <g fill={shoe}>
              <ellipse cx={fx - 5} cy={fy} rx={7.5} ry={5.5} transform={`rotate(-18 ${fx - 5} ${fy})`} />
              <ellipse cx={fx + 5} cy={fy} rx={7.5} ry={5.5} transform={`rotate(18 ${fx + 5} ${fy})`} />
            </g>
          ) : (
            <ellipse
              cx={fx}
              cy={fy}
              rx={10 * Math.max(k, 0.8)}
              ry={6 * Math.max(k, 0.8)}
              fill={shoe}
              stroke={ink}
              strokeWidth={2.4}
            />
          )}
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

  /** One arm, or one part of it on the same joints: the upper arm alone, or the forearm and hand. */
  const arm = (s: "L" | "R", part: "all" | "upper" | "fore" = "all") => {
    const sh = j[`shoulder${s}`];
    const el = j[`elbow${s}`];
    const wr = j[`wrist${s}`];
    const hand: P = lerp(el, wr, 1.12);
    const edge = `color-mix(in oklab, ${pal.skinShade} 70%, #3a2416)`;
    const limbLine = armEdge && grip?.[s] ? (c.armLine ?? edge) : bodyLine;
    return (
      <g data-joint={`shoulder${s}`} style={pivot(`shoulder${s}`, j)}>
        {part !== "fore" && (
          <>
            <Seg a={sh} b={el} w={f.w.upper} color={pal.limb} ink={limbLine} />
            <ClothOn a={sh} b={el} cloth={scaled(o.upper)} ink={ink} />
          </>
        )}
        {part !== "upper" && (
        <g data-joint={`elbow${s}`} style={pivot(`elbow${s}`, j)}>
          {c.hands === "wisp" ? (
            <Tendril a={el} b={hand} w={f.w.fore} tip={f.w.hand} color={pal.limb} />
          ) : (
            <Seg a={el} b={wr} w={f.w.fore} color={pal.limb} ink={limbLine} />
          )}
          <ClothOn a={el} b={wr} cloth={scaled(o.fore)} ink={ink} />
          {grip?.[s] && c.hands !== "wisp" ? (
            <GripHand grip={grip[s]!} el={el} wr={wr} at={hand} r={f.w.hand} color={pal.paw} crease={edge} side={s} />
          ) : c.hands === "wisp" ? null : c.hands === "tong" ? (
            <Tongs el={el} wr={wr} at={hand} r={f.w.hand} color={pal.paw} />
          ) : c.hands === "mitten" ? (
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
        )}
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
        className="char-shadow"
        style={pivot("root", j)}
        cx={100}
        cy={282}
        rx={42}
        ry={6}
        fill={`var(--char-shadow, ${pal.ink})`}
      />
      {c.trail && <SparkTrail at={c.trail} glow={pal.glow} edge="var(--char-glow-edge)" />}
      {under}
      <g data-joint="root" style={pivot("root", j)}>
        <g data-joint="torso" style={pivot("torso", j)}>
          <g transform={f.torsoFit}>
            {/* the pack sits against the back, so wings and a tail are drawn over it */}
            {on.has("backpack") && (
              <g transform={f.packFit}>
                <Backpack pal={pal} part="back" />
              </g>
            )}
            {c.behind?.(ctx)}
          </g>
          <g data-joint="head" style={pivot("head", j)}>
            <g transform={tilt}>
            <g transform={f.headFit}>
              {o.back}
              {c.headBack?.(ctx)}
              {h?.back}
            </g>
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
            {on.has("backpack") && (
              <g transform={f.packFit}>
                <Backpack pal={pal} part="straps" />
              </g>
            )}
            {c.pendant?.(ctx)}
          </g>
          {pose === "read" && (
            <g transform={f.handsFit}>
              <Book pal={pal} />
            </g>
          )}

          <g data-joint="head" style={pivot("head", j)}>
            <g transform={tilt}>
            <g transform={f.headFit}>
              {c.head(ctx)}
              {h?.front}
              <Face
                mood={face}
                style={c.face}
                pal={pal}
                browColor={c.kind === "animal" ? undefined : pal.hair}
                uid={uid}
                viseme={viseme}
              />
              <HeadProps on={on} pal={pal} eyeY={c.face.eyeY} eyeGap={c.face.eyeGap} />
              {/* the signature rides over any hat — it is what keeps the character itself */}
              {c.top?.(ctx)}
              {headFx}
            </g>
            </g>
          </g>

          {c.arms !== false && c.overUpperArms ? (
            <>
              {arm("L", "upper")}
              {arm("R", "upper")}
              {c.overUpperArms(ctx)}
              {arm("L", "fore")}
              {arm("R", "fore")}
            </>
          ) : (
            c.arms !== false && (
              <>
                {arm("L")}
                {arm("R")}
              </>
            )
          )}
        </g>
      </g>
      {over}
    </svg>
  );
}
