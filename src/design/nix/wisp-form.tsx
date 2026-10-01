"use client";

import * as React from "react";

import { flameTip, WispTurn } from "./wisp-turn";

/**
 * Wisp on the sign-up form — the one place it appears. It lives in the gutter to the left of the
 * form, turned toward it.
 *
 *   between fields   a hop, not a flight: it waits a beat after focus moves, gathers, arcs out
 *                    through the gutter (away from the form) with its eyes on where it is going,
 *                    and settles beside the new field. No turn. Moves retarget, never queue.
 *   while typing     it turns further into the field and its eyes follow the text as it grows.
 *   the password     once it lands beside the password field it turns its back — right round,
 *                    continuously — and faces the form again when focus leaves.
 *
 * Its turn and gaze ease toward their targets frame by frame (the head a little quicker than the
 * body), so every change of attention is a turn, not a cut. Under reduced motion it does not
 * travel or ease: it reappears beside the new field and faces the right way at once.
 *
 * Lit (proposal, `lit`): its glow lights what is around it — the gutter, the card, the fields —
 * from the lantern at the tip of its flame. The light falls off fast near the lantern and trails
 * off slowly; it dips as Wisp gathers for a hop, swells a little mid-arc, and each spark leaves a
 * faint pool of light where it falls that outlasts the spark. Wisp itself is never lit (its
 * drawing has nothing lighting-dependent). The light is drawn in the glow's own yellow, stronger
 * on the dark ground than on the light one (`--wisp-light-peak` in studio.css).
 * It publishes where it is as `--wisp-x`, `--wisp-y`, `--wisp-reach` (px, in the form's box) and
 * `--wisp-glow` (0–1), so the page's own HTML can light its elements from the same source; the
 * fields here do it with `litField`. Under reduced motion the light holds still beside the field.
 */

const FIELDS = [
  { id: "name", label: "Your name", type: "text", auto: "name", demo: "Asha Rao" },
  { id: "email", label: "Email", type: "email", auto: "email", demo: "asha@school.org" },
  { id: "password", label: "Password", type: "password", auto: "new-password", demo: "sparkle42" },
  {
    id: "team",
    label: "Team name",
    type: "text",
    auto: "organization",
    demo: "Year 8 Science",
    hint: "A school, a class, a household — or just you.",
  },
] as const;

const SIZE = { w: 46, h: 62 };
const VIEW = "-10 20 220 280";
const GUTTER_X = 10;
const DELAY = 90;
/** How Wisp holds itself: turned toward the form, further while you type, away for a password. */
const YAW = { attend: 28, typing: 50, away: 180 };

/** The light (proposal): reach in px, the swell mid-hop, the dip as it gathers, spark pools. */
const LIGHT = { reach: 160, arc: 0.3, gather: 0.15, pool: 9, linger: 1100 };
const SPARK_LIFE = 650;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

type Hop = { from: number; to: number; t0: number; dur: number };
type Spark = { x: number; y: number; born: number; r: number };
type Pose = { yaw: number; head: number; lookX: number; t: number };
export type Light = { x: number; y: number; reach: number; glow: number };

/**
 * How brightly a light lands on an element, and where, in the element's own box: what the page's
 * HTML reads to light a field. Strength falls off with the distance to the nearest point of the
 * element, squared, so a field lights from the edge facing Wisp.
 */
export function litField(el: HTMLElement, light: Light): React.CSSProperties {
  const l = el.offsetLeft;
  const t = el.offsetTop;
  const dx = Math.max(l - light.x, 0, light.x - (l + el.offsetWidth));
  const dy = Math.max(t - light.y, 0, light.y - (t + el.offsetHeight));
  const lit = light.glow * Math.max(0, 1 - Math.hypot(dx, dy) / light.reach) ** 2;
  return {
    "--lx": `${light.x - l}px`,
    "--ly": `${light.y - t}px`,
    "--lr": `${light.reach}px`,
    "--lit": `${Math.round(lit * 100)}%`,
  } as React.CSSProperties;
}

function along(h: Hop, now: number) {
  const p = clamp((now - h.t0) / h.dur, 0, 1);
  const d = h.to - h.from;
  const settle = p > 0.72 ? 0.05 * Math.sin((Math.PI * (p - 0.72)) / 0.28) : 0;
  const y = h.from + d * (inOut(p) + settle);
  // bowed out to the left, away from the form
  const bow = -12 * Math.min(1, Math.abs(d) / 120) * Math.sin(Math.PI * p);
  const gather = p > 0 && p < 0.14 ? Math.sin((Math.PI * p) / 0.14) : 0;
  return { p, y, bow, gather, dir: Math.sign(d) };
}

export function WispForm({ lit = false }: { lit?: boolean }) {
  const uid = React.useId().replace(/:/g, "");
  const rows = React.useRef<(HTMLDivElement | null)[]>([]);
  const hop = React.useRef<Hop>({ from: 0, to: 0, t0: 0, dur: 1 });
  const pose = React.useRef<Pose>({ yaw: YAW.attend, head: YAW.attend, lookX: 1, t: 0 });
  const sparks = React.useRef<Spark[]>([]);
  const lastSpark = React.useRef(0);
  const typingUntil = React.useRef(0);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [active, setActive] = React.useState(0);
  const [auto, setAuto] = React.useState(true);
  const [reduce, setReduce] = React.useState(false);
  const [now, setNow] = React.useState(0);

  const targetY = React.useCallback((i: number) => {
    const el = rows.current[i];
    const input = (el?.querySelector("input") as HTMLElement | null) ?? el;
    return input ? input.offsetTop + input.offsetHeight / 2 : 0;
  }, []);

  React.useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const y = targetY(0);
    hop.current = { from: y, to: y, t0: 0, dur: 1 };
  }, [targetY]);

  // a new field: start a hop from wherever Wisp is right now
  React.useEffect(() => {
    const t = performance.now();
    const cur = along(hop.current, t).y;
    const to = targetY(active);
    hop.current = {
      from: cur,
      to,
      t0: t + DELAY,
      dur: clamp(320 + Math.abs(to - cur) * 0.9, 320, 620),
    };
  }, [active, targetY]);

  // the demo: move to each field, type into it, move on — until someone uses the form
  React.useEffect(() => {
    if (!auto) return;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)));
    (async () => {
      for (let round = 0; !cancelled; round++) {
        setValues({});
        for (let i = 0; i < FIELDS.length && !cancelled; i++) {
          setActive(i);
          await wait(800);
          const text = FIELDS[i].demo;
          for (let k = 1; k <= text.length && !cancelled; k++) {
            setValues((v) => ({ ...v, [FIELDS[i].id]: text.slice(0, k) }));
            typingUntil.current = performance.now() + 700;
            await wait(90);
          }
          await wait(900);
        }
      }
    })();
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [auto]);

  const field = FIELDS[active];
  const target = React.useCallback(
    (t: number) => {
      const h = hop.current;
      const landed = t >= h.t0 + h.dur;
      if (field.id === "password" && landed) return { yaw: YAW.away, lookX: 0 };
      if (t < typingUntil.current) {
        const len = (values[field.id] ?? "").length;
        return { yaw: YAW.typing + Math.min(16, len * 0.8), lookX: 2 + Math.min(4, len * 0.2) };
      }
      return { yaw: YAW.attend, lookX: 1 };
    },
    [field.id, values],
  );
  const targetRef = React.useRef(target);
  targetRef.current = target;

  React.useEffect(() => {
    let frame = 0;
    const tick = (t: number) => {
      const p = pose.current;
      const dt = p.t ? Math.min(64, t - p.t) : 16;
      const goal = targetRef.current(t);
      const ease = (tau: number) => (reduce ? 1 : 1 - Math.exp(-dt / tau));
      p.head += (goal.yaw - p.head) * ease(110);
      p.yaw += (goal.yaw - p.yaw) * ease(170);
      p.lookX += (goal.lookX - p.lookX) * ease(120);
      p.t = t;
      if (!reduce) {
        const a = along(hop.current, t);
        if (a.p > 0 && a.p < 1 && t - lastSpark.current > 70) {
          lastSpark.current = t;
          const [fx, fy] = flameTip(p.yaw);
          const k = SIZE.w / 220;
          sparks.current.push({
            x: GUTTER_X + a.bow + (fx + 10) * k,
            y: a.y - SIZE.h * 0.42 + (fy - 20) * k,
            born: t,
            r: [2.2, 1.6, 2][sparks.current.length % 3],
          });
        }
      }
      const life = lit ? LIGHT.linger : SPARK_LIFE;
      sparks.current = sparks.current.filter((sp) => t - sp.born < life);
      setNow(t);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce, lit]);

  const a = reduce
    ? { p: 1, y: hop.current.to, bow: 0, gather: 0, dir: 0 }
    : along(hop.current, now);
  const moving = a.p > 0 && a.p < 1;
  const arc = Math.sin(Math.PI * a.p);
  const bob = reduce ? 0 : 2 * Math.sin(now / 600) * (1 - arc);
  const amp = moving ? 1 : 0.35;
  const typing = now < typingUntil.current;
  const x = GUTTER_X + a.bow;
  const y = a.y - SIZE.h * 0.42 + bob;
  const p = pose.current;

  // the light rides on the lantern: where the sparks come from
  const [fx, fy] = flameTip(p.yaw);
  const k = SIZE.w / 220;
  const shimmer = reduce ? 1 : 1 + 0.04 * Math.sin(now / 430) + 0.03 * Math.sin(now / 170 + 2);
  const light: Light = {
    x: x + (fx + 10) * k,
    y: y + (fy - 20) * k,
    reach: LIGHT.reach * (1 + 0.12 * arc),
    glow: Math.min(1, (0.75 + LIGHT.arc * arc - LIGHT.gather * a.gather) * shimmer),
  };
  const fieldLight = (i: number) => {
    const el = rows.current[i]?.querySelector("input");
    return lit && el ? litField(el, light) : undefined;
  };

  const use = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div
      className="relative flex max-w-[30rem] gap-0"
      style={
        lit
          ? ({
              "--wisp-x": `${light.x}px`,
              "--wisp-y": `${light.y}px`,
              "--wisp-reach": `${light.reach}px`,
              "--wisp-glow": light.glow,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className="w-[72px] shrink-0" aria-hidden />
      <form
        className="flex w-full flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Create your account"
      >
        <h3 className="material-heading m-0 text-base text-foreground">Create your account</h3>
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
            <input
              id={`${uid}-${f.id}`}
              type={f.type}
              autoComplete={f.auto}
              value={values[f.id] ?? ""}
              onFocus={() => use(i)}
              onChange={(e) => {
                setAuto(false);
                setValues((v) => ({ ...v, [f.id]: e.target.value }));
                typingUntil.current = performance.now() + 800;
              }}
              data-on={active === i}
              style={fieldLight(i)}
              className="wisp-lit-field h-10 rounded-[var(--radius-control)] border border-border bg-canvas px-3 text-sm text-foreground data-[on=true]:border-primary"
            />
            {"hint" in f && <span className="text-xs text-muted-foreground">{f.hint}</span>}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="h-10 rounded-[var(--radius-control)] bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Create account
          </button>
          <button
            type="button"
            className="filter-seg"
            aria-pressed={auto}
            onClick={() => setAuto((v) => !v)}
          >
            {auto ? "Pause the demo" : "Play the demo"}
          </button>
        </div>
      </form>

      {lit && (
        <svg
          className="wisp-light pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            {/* fast near the lantern, a long soft tail: light, not a disc */}
            <radialGradient id={`${uid}-light`}>
              <stop offset="0" stopColor="#ffcf4a" stopOpacity={1} />
              <stop offset="0.1" stopColor="#ffcf4a" stopOpacity={0.75} />
              <stop offset="0.3" stopColor="#ffcf4a" stopOpacity={0.45} />
              <stop offset="0.55" stopColor="#ffcf4a" stopOpacity={0.2} />
              <stop offset="0.8" stopColor="#ffcf4a" stopOpacity={0.06} />
              <stop offset="1" stopColor="#ffcf4a" stopOpacity={0} />
            </radialGradient>
          </defs>
          <g style={{ opacity: "var(--wisp-light-peak)" }}>
            <circle
              cx={light.x}
              cy={light.y}
              r={light.reach}
              fill={`url(#${uid}-light)`}
              opacity={light.glow}
            />
            {sparks.current.map((s, i) => {
              const age = (now - s.born) / LIGHT.linger;
              return (
                <circle
                  key={i}
                  cx={s.x}
                  cy={s.y + 10 * Math.min(1, (now - s.born) / SPARK_LIFE)}
                  r={LIGHT.pool * s.r}
                  fill={`url(#${uid}-light)`}
                  opacity={0.6 * (1 - age) ** 1.5}
                />
              );
            })}
          </g>
        </svg>
      )}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        {sparks.current.map((s, i) => {
          const age = (now - s.born) / SPARK_LIFE;
          if (age >= 1) return null;
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
        data-yaw={Math.round(p.yaw)}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SIZE.w,
          height: SIZE.h,
          transformOrigin: "50% 100%",
          transform: `translate(${x}px, ${y}px) scale(${1 + 0.07 * a.gather - 0.03 * arc}, ${1 - 0.08 * a.gather + 0.05 * arc})`,
        }}
      >
        <svg viewBox={VIEW} className="h-full w-full overflow-visible">
          <WispTurn
            yaw={p.yaw}
            headYaw={p.head}
            flapU={-12 * amp * Math.sin((now / 500) * Math.PI * 2)}
            flapL={16 * amp * Math.sin((now / 250) * Math.PI * 2 + 1)}
            look={moving ? 5 * a.dir * arc : typing ? 2 : 0}
            lookX={p.lookX}
            uid={`${uid}-w`}
          />
        </svg>
      </div>
    </div>
  );
}
