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
 *   the password     once it lands beside a password field it stops looking, in that field's way
 *                    (`hide`): `back` turns its back, right round, continuously (as chosen);
 *                    `hands` lifts its hands over its eyes; `blanket` pulls its ribbons up over
 *                    its head like a blanket, a little ghost with its antennae poking out, and
 *                    giggles under there while you type. It never peeks. When focus leaves it
 *                    faces the form again.
 *
 * Its turn and gaze ease toward their targets frame by frame (the head a little quicker than the
 * body), so every change of attention is a turn, not a cut. Under reduced motion it does not
 * travel or ease: it reappears beside the new field and faces the right way at once.
 */

/** How Wisp stops looking at a password field. */
export type Hide = "back" | "hands" | "blanket";

type Field = {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  auto: string;
  demo: string;
  hint?: string;
  hide?: Hide;
};

const FIELDS: Field[] = [
  { id: "name", label: "Your name", type: "text", auto: "name", demo: "Asha Rao" },
  { id: "email", label: "Email", type: "email", auto: "email", demo: "asha@school.org" },
  { id: "password", label: "Password", type: "password", auto: "new-password", demo: "sparkle42", hide: "back" },
  {
    id: "team",
    label: "Team name",
    type: "text",
    auto: "organization",
    demo: "Year 8 Science",
    hint: "A school, a class, a household — or just you.",
  },
];

/** Three password fields, one for each way of not looking (proposals). */
export const PASSWORD_FIELDS: Field[] = [
  {
    id: "pw-back",
    label: "Password — turns its back",
    type: "password",
    auto: "new-password",
    demo: "sparkle42",
    hide: "back",
    hint: "As chosen: it turns right round, head first, and faces you again when you leave.",
  },
  {
    id: "pw-hands",
    label: "Password — hands over its eyes",
    type: "password",
    auto: "new-password",
    demo: "glowworm7",
    hide: "hands",
    hint: "It faces you and covers its eyes with both hands, like a game of hide and seek.",
  },
  {
    id: "pw-blanket",
    label: "Password — hides under its ribbons",
    type: "password",
    auto: "new-password",
    demo: "moonbeam3",
    hide: "blanket",
    hint: "It pulls its ribbons up over its head like a blanket — a little ghost, antennae poking out — and giggles under there while you type.",
  },
];

const SIZE = { w: 46, h: 62 };
const VIEW = "-10 20 220 280";
const GUTTER_X = 10;
const DELAY = 90;
/** How Wisp holds itself: turned toward the form, further while you type, away for a password. */
const YAW = { attend: 28, typing: 50, away: 180, hands: 10, blanket: 6 };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

type Hop = { from: number; to: number; t0: number; dur: number };
type Spark = { x: number; y: number; born: number; r: number };
type Pose = { yaw: number; head: number; lookX: number; cover: number; blanket: number; t: number };

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

export function WispForm({
  fields: FORM = FIELDS,
  title = "Create your account",
}: {
  fields?: Field[];
  title?: string;
} = {}) {
  const uid = React.useId().replace(/:/g, "");
  const rows = React.useRef<(HTMLDivElement | null)[]>([]);
  const hop = React.useRef<Hop>({ from: 0, to: 0, t0: 0, dur: 1 });
  const pose = React.useRef<Pose>({ yaw: YAW.attend, head: YAW.attend, lookX: 1, cover: 0, blanket: 0, t: 0 });
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
        for (let i = 0; i < FORM.length && !cancelled; i++) {
          setActive(i);
          await wait(800);
          const text = FORM[i].demo;
          for (let k = 1; k <= text.length && !cancelled; k++) {
            setValues((v) => ({ ...v, [FORM[i].id]: text.slice(0, k) }));
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

  const field = FORM[active];
  const target = React.useCallback(
    (t: number) => {
      const h = hop.current;
      const landed = t >= h.t0 + h.dur;
      const none = { cover: 0, blanket: 0 };
      if (field.hide && landed) {
        if (field.hide === "hands") return { yaw: YAW.hands, lookX: 0, cover: 1, blanket: 0 };
        if (field.hide === "blanket") return { yaw: YAW.blanket, lookX: 0, cover: 0, blanket: 1 };
        return { yaw: YAW.away, lookX: 0, ...none };
      }
      if (t < typingUntil.current) {
        const len = (values[field.id] ?? "").length;
        return { yaw: YAW.typing + Math.min(16, len * 0.8), lookX: 2 + Math.min(4, len * 0.2), ...none };
      }
      return { yaw: YAW.attend, lookX: 1, ...none };
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
      /* the hands come up quickly; the blanket is pulled up more slowly */
      p.cover += (goal.cover - p.cover) * ease(150);
      p.blanket += (goal.blanket - p.blanket) * ease(260);
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
      sparks.current = sparks.current.filter((sp) => t - sp.born < 650);
      setNow(t);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

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

  const use = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div className="relative flex max-w-[30rem] gap-0">
      <div className="w-[72px] shrink-0" aria-hidden />
      <form
        className="flex w-full flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Create your account"
      >
        <h3 className="material-heading m-0 text-base text-foreground">{title}</h3>
        {FORM.map((f, i) => (
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
              className="h-10 rounded-[var(--radius-control)] border border-border bg-canvas px-3 text-sm text-foreground data-[on=true]:border-primary"
            />
            {f.hint && <span className="text-xs text-muted-foreground">{f.hint}</span>}
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
            cover={p.cover}
            blanket={p.blanket}
            /* under the blanket it giggles, more while you type */
            wiggle={reduce ? 0 : p.blanket * (typing ? 5 : 1.6) * Math.sin(now / (typing ? 90 : 200))}
            uid={`${uid}-w`}
          />
        </svg>
      </div>
    </div>
  );
}
