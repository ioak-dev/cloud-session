"use client";

import * as React from "react";

import { flameTip, WispTurn } from "./wisp-turn";

/**
 * Wisp beside a form: how it moves between fields. A hop, not a flight — it keeps facing the form
 * (no turn) and travels a short arc in the gutter.
 *
 *   wait      a beat after focus moves, so it follows the person rather than leading them
 *   gather    a small squash before it lifts
 *   hop       an arc bowed out, away from the form; eyes on where it is going; wings beat fast;
 *             a few sparks left behind
 *   settle    a slight overshoot, then back into the idle bob, head turned toward the field
 *
 * It is never over a field and never larger than a field row. If focus moves again mid-hop it
 * retargets from where it is; moves never queue. Under reduced motion it does not travel: it
 * fades out and reappears beside the new field.
 */

const FIELDS = [
  { id: "name", label: "Your name", kind: "input", placeholder: "Asha Rao" },
  { id: "email", label: "Email", kind: "input", placeholder: "asha@school.org" },
  { id: "team", label: "Team name", kind: "input", placeholder: "Year 8 Science" },
  { id: "teach", label: "What will you teach?", kind: "area", placeholder: "Forces, cells, …" },
  { id: "password", label: "Password", kind: "input", placeholder: "••••••••" },
] as const;

/** Wisp's box on the page, in px, and where its centre sits within it. */
const SIZE = { w: 46, h: 62 };
const VIEW = "-10 20 220 280";
const DELAY = 90;
const REST_YAW = -18;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

type Hop = { from: number; to: number; t0: number; dur: number };
type Spark = { x: number; y: number; born: number; r: number };

/** Where Wisp is along a hop at time `now`: position, squash, and how far through it is. */
function along(h: Hop, now: number) {
  const p = clamp((now - h.t0) / h.dur, 0, 1);
  const d = h.to - h.from;
  // arrive slightly past the mark, then settle back onto it
  const settle = p > 0.72 ? 0.05 * Math.sin((Math.PI * (p - 0.72)) / 0.28) : 0;
  const y = h.from + d * (inOut(p) + settle);
  const bow = 12 * Math.min(1, Math.abs(d) / 120) * Math.sin(Math.PI * p);
  const gather = p > 0 && p < 0.14 ? Math.sin((Math.PI * p) / 0.14) : 0;
  return { p, y, bow, gather, dir: Math.sign(d) };
}

/** Everything about Wisp at time `now`: a pure function of the hop, the gutter and the clock. */
function frameAt(h: Hop, now: number, gutter: number, still: boolean) {
  const a = still ? { p: 1, y: h.to, bow: 0, gather: 0, dir: 0 } : along(h, now);
  const moving = a.p > 0 && a.p < 1;
  const arc = Math.sin(Math.PI * a.p);
  const bob = still ? 0 : 2 * Math.sin(now / 600) * (1 - arc);
  const amp = moving ? 1 : 0.35;
  const yaw = moving ? REST_YAW + 8 * arc : REST_YAW;
  return {
    moving,
    x: gutter + a.bow,
    y: a.y - SIZE.h * 0.42 + bob,
    sx: 1 + 0.07 * a.gather - 0.03 * arc,
    sy: 1 - 0.08 * a.gather + 0.05 * arc,
    yaw,
    look: moving ? 5 * a.dir * arc : 0,
    flapU: -12 * amp * Math.sin((now / 500) * Math.PI * 2),
    flapL: 16 * amp * Math.sin((now / 250) * Math.PI * 2 + 1),
  };
}

export function WispForm() {
  const uid = React.useId().replace(/:/g, "");
  const box = React.useRef<HTMLDivElement>(null);
  const rows = React.useRef<(HTMLDivElement | null)[]>([]);
  const hop = React.useRef<Hop>({ from: 0, to: 0, t0: 0, dur: 1 });
  const sparks = React.useRef<Spark[]>([]);
  const lastSpark = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [auto, setAuto] = React.useState(true);
  const [reduce, setReduce] = React.useState(false);
  const [now, setNow] = React.useState(0);
  const [gutter, setGutter] = React.useState(0);
  const gutterRef = React.useRef(0);
  gutterRef.current = gutter;

  const targetY = React.useCallback((i: number) => {
    const el = rows.current[i];
    if (!el) return 0;
    // the input's own box, measured from the same container the rows are
    const input = (el.querySelector("input, textarea") as HTMLElement | null) ?? el;
    return input.offsetTop + input.offsetHeight / 2;
  }, []);

  React.useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const measure = () => {
      const form = box.current?.querySelector("form");
      if (form) setGutter(form.offsetLeft + form.offsetWidth + 14);
    };
    measure();
    const y = targetY(0);
    hop.current = { from: y, to: y, t0: 0, dur: 1 };
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [targetY]);

  // a new field: start a hop from wherever Wisp is right now
  React.useEffect(() => {
    const t = performance.now();
    const cur = along(hop.current, t).y;
    const to = targetY(active);
    const d = Math.abs(to - cur);
    hop.current = { from: cur, to, t0: t + DELAY, dur: clamp(320 + d * 0.9, 320, 620) };
  }, [active, targetY]);

  // autoplay through the fields until someone uses the form
  React.useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % FIELDS.length), 1500);
    return () => window.clearInterval(id);
  }, [auto]);

  React.useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const tick = (t: number) => {
      // leave a few sparks along a hop, from the flame's tip
      const f = frameAt(hop.current, t, gutterRef.current, false);
      if (f.moving && t - lastSpark.current > 70) {
        lastSpark.current = t;
        const [fx, fy] = flameTip(f.yaw);
        const k = SIZE.w / 220;
        sparks.current.push({
          x: f.x + (fx + 10) * k,
          y: f.y + (fy - 20) * k,
          born: t,
          r: [2.2, 1.6, 2][sparks.current.length % 3],
        });
      }
      sparks.current = sparks.current.filter((sp) => t - sp.born < 650);
      setNow(t);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  const { x, y, sx, sy, yaw, look, flapU, flapL } = frameAt(hop.current, now, gutter, reduce);

  return (
    <div ref={box} className="relative flex gap-4">
      <form
        className="flex w-full max-w-[22rem] flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {FIELDS.map((f, i) => (
          <div
            key={f.id}
            ref={(el) => {
              rows.current[i] = el;
            }}
            className="flex flex-col gap-1"
          >
            <label htmlFor={`${uid}-${f.id}`} className="instrument text-xs text-muted-foreground">
              {f.label}
            </label>
            {f.kind === "area" ? (
              <textarea
                id={`${uid}-${f.id}`}
                rows={3}
                placeholder={f.placeholder}
                onFocus={() => {
                  setAuto(false);
                  setActive(i);
                }}
                className="rounded-[var(--radius-control)] border border-border bg-canvas px-3 py-2 text-sm text-foreground data-[on=true]:border-primary"
                data-on={active === i}
              />
            ) : (
              <input
                id={`${uid}-${f.id}`}
                placeholder={f.placeholder}
                onFocus={() => {
                  setAuto(false);
                  setActive(i);
                }}
                className="h-10 rounded-[var(--radius-control)] border border-border bg-canvas px-3 text-sm text-foreground data-[on=true]:border-primary"
                data-on={active === i}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          className="filter-seg self-start"
          aria-pressed={auto}
          onClick={() => setAuto((v) => !v)}
        >
          {auto ? "Pause the demo" : "Play the demo"}
        </button>
      </form>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        {sparks.current.map((s, i) => {
          const age = (now - s.born) / 650;
          return (
            <g key={i} opacity={1 - age}>
              <circle cx={s.x} cy={s.y + 10 * age} r={s.r * 2.4} fill="#ffcf4a" opacity={0.3} />
              <circle
                cx={s.x}
                cy={s.y + 10 * age}
                r={s.r * (1 - 0.5 * age)}
                fill="#ffcf4a"
                stroke="var(--char-glow-edge)"
                strokeWidth={0.6}
              />
            </g>
          );
        })}
      </svg>

      <div
        key={reduce ? active : "live"}
        className={reduce ? "wisp-appear" : undefined}
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SIZE.w,
          height: SIZE.h,
          transformOrigin: "50% 100%",
          transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`,
        }}
      >
        <svg viewBox={VIEW} className="h-full w-full overflow-visible">
          <WispTurn
            yaw={yaw}
            headYaw={yaw - 6}
            flapU={flapU}
            flapL={flapL}
            look={look}
            uid={`${uid}-w`}
          />
        </svg>
      </div>
    </div>
  );
}
