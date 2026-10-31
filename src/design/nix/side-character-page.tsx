/**
 * One side character's page, in the structure of Sparkles' `/design/character/<name>`: who it is,
 * its silhouette at the sizes the product draws it, its own eyes and mouth, its fixed lines in its
 * own voice, and every companion state with each variant. Noor's, Haru's, Margot's and Nell's states are drawn so far
 * (`side-reactions.ts`); every other character shows "Coming soon" in their place.
 */
import * as React from "react";

import { FilterSegment, FilterSet } from "@/components/ui/filter-segment";
import type { Candidate } from "./candidates";
import { MOODS, type Mood } from "./rig/face";
import type { Grips } from "./rig/grip";
import { NixFigure } from "./rig/NixFigure";
import type { Pose } from "./rig/poses";
import { HEAD_VB } from "./rig/skeleton";
import { pauseAfter, VISEMES, wordSeconds, wordVisemes, words, visemeAt, type Viseme } from "./rig/visemes";
import { CAST, type CastMember } from "./side-companion";
import { HaruScene, type HaruSceneId } from "./side-haru";
import { MargotScene, type MargotSceneId } from "./side-margot";
import { NellScene, type NellSceneId } from "./side-nell";
import { NoorScene, type NoorSceneId } from "./side-noor";
import {
  endGrip,
  gripAt,
  poseAt,
  REACTION_VARIANTS,
  reactionsFor,
  restGrip,
  STATE_INFO,
  type Reaction,
  type ReactionSetting,
} from "./side-reactions";

const SECTION = "mt-10 text-lg font-semibold leading-tight text-foreground";
const LEDE = "mt-1 max-w-[64ch] text-sm text-muted-foreground";
const GROUNDS = [
  ["Light ground", "#ffffff"],
  ["Dark ground", "#15171c"],
] as const;

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A variant's own scene — a duckling at her feet, a mark in the air — as the figure's two layers. */
function scene(a: Reaction): { under?: React.ReactNode; over?: React.ReactNode } {
  if (!a.scene?.length) return {};
  /* each character's scene draws only its own ids */
  const noor = a.scene as readonly NoorSceneId[];
  const haru = a.scene as readonly HaruSceneId[];
  const margot = a.scene as readonly MargotSceneId[];
  const nell = a.scene as readonly NellSceneId[];
  return {
    under: (
      <>
        <NoorScene ids={noor} layer="under" />
        <HaruScene ids={haru} layer="under" />
        <MargotScene ids={margot} layer="under" />
        <NellScene ids={nell} layer="under" />
      </>
    ),
    over: (
      <>
        <NoorScene ids={noor} layer="over" />
        <HaruScene ids={haru} layer="over" />
        <MargotScene ids={margot} layer="over" />
        <NellScene ids={nell} layer="over" />
      </>
    ),
  };
}

/** A reaction on its own clock: the act loops, and its face and hands change at the offsets it
 *  declares — a thumb kept pointing up as the arm turns. */
function ReactionFigure({ c, a, rest, className }: { c: Candidate; a: Reaction; rest?: Grips; className?: string }) {
  const box = React.useRef<HTMLDivElement>(null);
  const [mood, setMood] = React.useState<Mood | undefined>(a.faces[0]?.[1]);
  const [still, setStill] = React.useState(false);
  const [grip, setGrip] = React.useState<Grips | undefined>(() => gripAt(a, 0));

  React.useEffect(() => {
    if (!a.act) return;
    if (reducedMotion()) {
      setStill(true);
      setMood(a.rest);
      setGrip(endGrip(a));
      return;
    }
    const ms = a.act.motion.duration * 1000;
    let clock: Animation | undefined;
    const find = () => box.current?.getAnimations({ subtree: true }).find((x) => x.effect?.getTiming().duration === ms);
    const id = window.setInterval(() => {
      if (!clock || clock.playState === "idle") clock = find();
      const t = typeof clock?.currentTime === "number" ? (clock.currentTime % ms) / ms : 0;
      let m = a.faces[0]?.[1];
      for (const [o, f] of a.faces) if (t >= o) m = f;
      setMood((prev) => (prev === m ? prev : m));
      const g = gripAt(a, t);
      setGrip((prev) => (JSON.stringify(prev) === JSON.stringify(g) ? prev : g));
    }, 40);
    return () => window.clearInterval(id);
  }, [a]);

  return (
    <div ref={box} className={className}>
      <NixFigure c={c} act={still ? finalPose(a) ?? a.act : a.act} mood={a.act ? mood : undefined} still={still} grip={grip ?? rest} {...scene(a)} className="h-full w-full" />
    </div>
  );
}

/** The held pose a variant ends on: what reduced motion shows in its place. */
function finalPose(a: Reaction): Pose | undefined {
  if (!a.end) return undefined;
  return { id: "idle", title: `${a.id}-end`, use: "", mood: a.rest, hands: [a.end], motion: { duration: 1, tracks: {} } };
}

function FinalFrame({ c, a, rest, className }: { c: Candidate; a: Reaction; rest?: Grips; className?: string }) {
  return <NixFigure c={c} act={finalPose(a)} mood={a.rest} grip={endGrip(a) ?? rest} still {...scene(a)} className={className} />;
}

/** The move as a strip of held moments, so each beat — and what the hands are doing in it — can be
 *  read without catching it mid-loop. */
const BEATS = [0.15, 0.35, 0.55, 0.75, 0.95];

function KeyFrames({ c, a }: { c: Candidate; a: Reaction }) {
  if (!a.act) return null;
  return (
    <div className="flex gap-1" aria-label={`${a.title}, key frames`}>
      {BEATS.map((t) => (
        <NixFigure key={t} c={c} act={poseAt(a, t)} grip={gripAt(a, t)} mood={a.rest} still {...scene(a)} className="h-16 min-w-0 flex-1" />
      ))}
    </div>
  );
}

const SETTING_TAG: Record<ReactionSetting, string | null> = { both: null, minimal: "Minimal only", rich: "Rich only" };

function VariantTile({ c, a, frames, rest }: { c: Candidate; a: Reaction; frames: boolean; rest?: Grips }) {
  const tags = [a.signature ? "Own" : null, SETTING_TAG[a.setting]].filter(Boolean);
  return (
    <figure className="m-0 flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
      <div className="flex items-end gap-3">
        {frames ? (
          <FinalFrame c={c} a={a} rest={rest} className="h-44 flex-1" />
        ) : (
          <ReactionFigure c={c} a={a} rest={rest} className="h-44 flex-1" />
        )}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            {frames ? <FinalFrame c={c} a={a} rest={rest} className="h-12 w-12" /> : <ReactionFigure c={c} a={a} rest={rest} className="h-12 w-12" />}
            <span className="instrument text-[11px] text-muted-foreground">Perch</span>
          </div>
          {!frames && (
            <div className="flex flex-col items-center gap-1">
              <FinalFrame c={c} a={a} rest={rest} className="h-16 w-16" />
              <span className="instrument text-[11px] text-muted-foreground">Ends</span>
            </div>
          )}
        </div>
      </div>
      {frames && <KeyFrames c={c} a={a} />}
      <figcaption className="text-sm">
        <span className="font-semibold text-foreground">{a.title}</span>
        {tags.length > 0 && <span className="instrument ml-2 text-xs text-muted-foreground">{tags.join(" · ")}</span>}
        <span className="mt-1 block text-muted-foreground">{a.note}</span>
      </figcaption>
    </figure>
  );
}

function States({ m }: { m: CastMember }) {
  const byState = reactionsFor(m.slug);
  const [setting, setSetting] = React.useState<"all" | "minimal" | "rich">("all");
  const [frames, setFrames] = React.useState(false);

  if (!byState) {
    return (
      <>
        <h2 className={SECTION}>States and variations</h2>
        <p className={LEDE}>
          Not drawn yet. Noor&apos;s, Haru&apos;s, Margot&apos;s and Nell&apos;s are drawn (<a href="#/side/noor">Noor</a>,{" "}
          <a href="#/side/haru">Haru</a>, <a href="#/side/margot">Margot</a>, <a href="#/side/nell">Nell</a>); {m.name}&apos;s
          follow, one character at a time.
        </p>
        {STATE_INFO.map((info) => (
          <section key={info.state} className="mt-8">
            <h3 className="text-base font-semibold text-foreground">{info.title}</h3>
            <p className="mt-1 max-w-[72ch] text-sm text-muted-foreground">
              <span className="text-foreground">{info.when}.</span> {info.bound}.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="m-0 flex h-44 items-center justify-center rounded-[var(--radius)] bg-muted p-3">
                <span className="instrument text-sm text-muted-foreground">Coming soon</span>
              </div>
            </div>
          </section>
        ))}
      </>
    );
  }

  const shown = (a: Reaction) => setting === "all" || a.setting === "both" || a.setting === setting;

  return (
    <>
      <h2 className={SECTION}>States and variations</h2>
      <p className={LEDE}>
        Every state §9.4.5 closes, with each variant {m.name} draws from. Event reactions rotate from a
        shuffle bag, never the same twice running and never by streak; the line rotates separately. The
        big figure is the rich size, Perch is the minimal size on the dock, Ends is the held pose reduced
        motion shows.
      </p>
      <div className="mt-4 flex flex-wrap gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="instrument text-xs text-muted-foreground">Character involvement</span>
          <FilterSet>
            {(["all", "minimal", "rich"] as const).map((s) => (
              <FilterSegment key={s} pressed={setting === s} onClick={() => setSetting(s)}>
                {s === "all" ? "Both" : s === "minimal" ? "Minimal" : "Rich"}
              </FilterSegment>
            ))}
          </FilterSet>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="instrument text-xs text-muted-foreground">Show</span>
          <FilterSet>
            <FilterSegment pressed={!frames} onClick={() => setFrames(false)}>
              Playing
            </FilterSegment>
            <FilterSegment pressed={frames} onClick={() => setFrames(true)}>
              Final and key frames
            </FilterSegment>
          </FilterSet>
        </div>
      </div>

      {STATE_INFO.map((info) => {
        const list = byState[info.state].filter(shown);
        if (list.length === 0) return null;
        return (
          <section key={info.state} className="mt-8">
            <h3 className="text-base font-semibold text-foreground">
              {info.title}
              <span className="instrument ml-2 text-xs font-normal text-muted-foreground">
                {REACTION_VARIANTS[info.state]} {REACTION_VARIANTS[info.state] === 1 ? "variant" : "variants"}
              </span>
            </h3>
            <p className="mt-1 max-w-[72ch] text-sm text-muted-foreground">
              <span className="text-foreground">{info.when}.</span> {info.bound}.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <VariantTile key={a.id} c={m.figure} a={a} frames={frames} rest={restGrip(m.slug)} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

type LineKind = "greet" | "right" | "nearly" | "gentle";
const LINE_MOOD: Record<LineKind, Mood> = { greet: "happy", right: "delighted", nearly: "curious", gentle: "neutral" };
const LINE_TITLE: Record<LineKind, string> = {
  greet: "Greeting",
  right: "Right answer",
  nearly: "Partly right",
  gentle: "Wrong answer",
};

/**
 * Speaks a line in the character's voice and drives its mouth word by word off the engine's
 * boundary events, falling back to a timed estimate where the engine reports none.
 */
function useVoice(m: CastMember) {
  const [speaking, setSpeaking] = React.useState<string | null>(null);
  const [viseme, setViseme] = React.useState<Viseme>("rest");
  const raf = React.useRef(0);

  const stop = React.useCallback(() => {
    window.speechSynthesis?.cancel();
    cancelAnimationFrame(raf.current);
    setSpeaking(null);
    setViseme("rest");
  }, []);

  React.useEffect(() => stop, [stop]);

  const say = React.useCallback(
    (text: string) => {
      stop();
      const list = words(text);
      const rate = m.voice.rate;
      /* the timed estimate: when each word starts, if the engine never says */
      let t = 0;
      const plan = list.map(({ word }) => {
        const start = t;
        const dur = wordSeconds(word, rate);
        t += dur + pauseAfter(word, rate);
        return { start, dur, seq: wordVisemes(word) };
      });
      let current = { at: 0, i: -1 };
      let started = 0;
      let heard = false;
      const tick = (now: number) => {
        const el = (now - started) / 1000;
        let v: Viseme = "rest";
        if (heard && current.i >= 0) {
          const p = plan[current.i];
          v = visemeAt(p.seq, p.dur, (now - current.at) / 1000);
        } else {
          const p = plan.find((x) => el >= x.start && el < x.start + x.dur);
          if (p) v = visemeAt(p.seq, p.dur, el - p.start);
        }
        setViseme((prev) => (prev === v ? prev : v));
        raf.current = requestAnimationFrame(tick);
      };
      setSpeaking(text);
      if (!("speechSynthesis" in window)) {
        started = performance.now();
        raf.current = requestAnimationFrame(tick);
        globalThis.setTimeout(stop, t * 1000);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = m.voice.pitch;
      u.rate = rate;
      u.onstart = () => {
        started = performance.now();
        raf.current = requestAnimationFrame(tick);
      };
      u.onboundary = (e) => {
        if (e.name !== "word") return;
        heard = true;
        const i = list.findIndex((w) => w.at === e.charIndex);
        if (i >= 0) current = { at: performance.now(), i };
      };
      u.onend = stop;
      u.onerror = stop;
      window.speechSynthesis.speak(u);
    },
    [m.voice, stop],
  );

  return { speaking, viseme, say, stop };
}

function Lines({ m }: { m: CastMember }) {
  const { speaking, viseme, say, stop } = useVoice(m);
  const groups: [LineKind, readonly string[]][] = [
    ["greet", [m.lines.greet]],
    ["right", m.lines.right],
    ["nearly", m.lines.nearly],
    ["gentle", m.lines.gentle],
  ];
  const kind = groups.find(([, list]) => speaking && list.includes(speaking))?.[0] ?? "greet";

  return (
    <>
      <h2 className={SECTION}>Lines, in {m.name}&apos;s voice</h2>
      <p className={LEDE}>
        Fixed copy (R101): a greeting, three right, two partly right and three gentle — rotating, never
        escalating, never the verdict&apos;s own title. Voice: pitch {m.voice.pitch}, rate {m.voice.rate}.
        Sound off silences it; the words still show.
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-[var(--radius)] bg-muted p-3">
          <NixFigure c={m.figure} mood={LINE_MOOD[kind]} viseme={viseme} grip={restGrip(m.slug)} className="h-40 w-40" />
          <span className="instrument text-xs text-muted-foreground">{speaking ? "Talking" : "Press Hear"}</span>
        </div>
        <dl className="m-0 grid flex-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {groups.map(([k, list]) => (
            <div key={k}>
              <dt className="instrument text-xs text-muted-foreground">{LINE_TITLE[k]}</dt>
              {list.map((line) => {
                const on = speaking === line;
                return (
                  <dd key={line} className="m-0 mt-1.5 flex items-center gap-2">
                    <button type="button" className="filter-seg" onClick={() => (on ? stop() : say(line))} aria-label={`${on ? "Stop" : "Hear"}: ${line}`}>
                      {on ? "Stop" : "Hear"}
                    </button>
                    <span className="text-sm text-foreground">{line}</span>
                  </dd>
                );
              })}
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

/** The refinement: the character as refined so far, beside the studio drawing it started from. */
function Refinement({ m }: { m: CastMember }) {
  const refined = m.refinements.length > 0;
  return (
    <>
      <h2 className={SECTION}>Refinement</h2>
      <p className={LEDE}>
        {m.name} as refined so far. {refined ? "Beside it, the studio drawing it started from." : "Not refined yet: this is the studio drawing, and refinements will land here first."}
      </p>
      <div className="mt-3 flex flex-wrap gap-4">
        <figure className="m-0 flex flex-col gap-1.5">
          <div className="rounded-[var(--radius)] bg-muted p-3">
            <NixFigure c={m.figure} grip={restGrip(m.slug)} className="h-72 w-56" label={`${m.name}, refined`} />
          </div>
          <figcaption className="instrument text-xs text-muted-foreground">{refined ? "Refined" : "Current version"}</figcaption>
        </figure>
        {refined && (
          <figure className="m-0 flex flex-col gap-1.5">
            <div className="rounded-[var(--radius)] bg-muted p-3">
              <NixFigure c={m.base} className="h-72 w-56" label={`${m.name}, studio drawing`} />
            </div>
            <figcaption className="instrument text-xs text-muted-foreground">Studio drawing</figcaption>
          </figure>
        )}
        <div className="max-w-[48ch] text-sm">
          <div className="instrument text-xs text-muted-foreground">What changed</div>
          {refined ? (
            <ul className="m-0 mt-1.5 list-disc pl-5 text-foreground">
              {m.refinements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : (
            <p className="m-0 mt-1.5 text-muted-foreground">Coming soon</p>
          )}
        </div>
      </div>
    </>
  );
}

function Identity({ m }: { m: CastMember }) {
  return (
    <>
      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
        <figure className="m-0 flex shrink-0 justify-center rounded-[var(--radius)] bg-muted p-3 md:w-72">
          <NixFigure c={m.figure} grip={restGrip(m.slug)} className="h-72 w-full" label={`${m.name} at rest`} />
        </figure>
        <dl className="m-0 grid max-w-[60ch] gap-3 text-sm">
          <div>
            <dt className="instrument text-xs text-muted-foreground">Temperament</dt>
            <dd className="m-0 text-foreground">{m.temperament}</dd>
          </div>
          <div>
            <dt className="instrument text-xs text-muted-foreground">Ability · {m.ability.name}</dt>
            <dd className="m-0 text-foreground">{m.ability.line}</dd>
          </div>
          <div>
            <dt className="instrument text-xs text-muted-foreground">Looks</dt>
            <dd className="m-0 text-foreground">{m.figure.signature}</dd>
          </div>
          <div>
            <dt className="instrument text-xs text-muted-foreground">Keep it</dt>
            <dd className="m-0 text-foreground">{m.figure.risk}</dd>
          </div>
          <div>
            <dt className="instrument text-xs text-muted-foreground">In the studio</dt>
            <dd className="m-0 text-muted-foreground">
              Drawn as {m.studio.name} (<code>{m.studio.id}</code>) in this studio.
            </dd>
          </div>
        </dl>
      </div>

      <h2 className={SECTION}>Silhouette and size</h2>
      <p className={LEDE}>
        The rich figure, the minimal perch and the smallest a face is drawn — in colour and as a solid
        fill, on both grounds. Each must still read as {m.name}.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {GROUNDS.map(([label, ground]) => (
          <figure key={ground} className="m-0 flex flex-col gap-1.5">
            <div className="flex items-end gap-3 rounded-[var(--radius)] p-3" style={{ background: ground }}>
              {[96, 48, 32].map((px) => (
                <div key={px} style={{ width: px, height: px }}>
                  <NixFigure c={m.figure} grip={restGrip(m.slug)} still className="h-full w-full" />
                </div>
              ))}
              {[96, 48, 32].map((px) => (
                <div key={`s${px}`} style={{ width: px, height: px }}>
                  <NixFigure c={m.figure} still silhouette className="h-full w-full" />
                </div>
              ))}
              <div style={{ width: 24, height: 24 }}>
                <NixFigure c={m.figure} still viewBox={HEAD_VB} className="h-full w-full" />
              </div>
            </div>
            <figcaption className="instrument text-xs text-muted-foreground">{label}</figcaption>
          </figure>
        ))}
      </div>

      <h2 className={SECTION}>Eyes and mouth — {m.name}&apos;s own</h2>
      <p className={LEDE}>Every expression the states draw from, then the eight talking shapes.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {MOODS.map((md) => (
          <figure key={md.id} className="m-0 flex flex-col items-center gap-1 rounded-[var(--radius)] bg-muted p-1.5">
            <NixFigure c={m.figure} mood={md.id} still viewBox={HEAD_VB} className="h-20 w-20" />
            <figcaption className="instrument text-[11px] text-muted-foreground">{md.title}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {VISEMES.map((v) => (
          <figure key={v.id} className="m-0 flex flex-col items-center gap-1 rounded-[var(--radius)] bg-muted p-1.5" title={v.sounds}>
            <NixFigure c={m.figure} mood="neutral" viseme={v.id} still viewBox={HEAD_VB} className="h-20 w-20" />
            <figcaption className="instrument text-[11px] text-muted-foreground">{v.title}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

function CastNav({ current }: { current: string }) {
  return (
    <nav aria-label="Characters" className="mt-4">
      <FilterSet className="flex-wrap">
        <a href="#/side" className="filter-seg no-underline">
          All
        </a>
        <a href="#/wisp" className="filter-seg no-underline">
          Wisp
        </a>
        {CAST.map((c) => (
          <a
            key={c.slug}
            href={`#/side/${c.slug}`}
            aria-current={c.slug === current ? "page" : undefined}
            className="filter-seg no-underline"
          >
            {c.name}
          </a>
        ))}
      </FilterSet>
    </nav>
  );
}

export function CharacterPage({ m }: { m: CastMember }) {
  return (
    <>
      <p className="instrument m-0 text-xs text-muted-foreground">Side characters / Side character</p>
      <h1 className="display mt-1 text-3xl font-semibold text-foreground">{m.name}</h1>
      <CastNav current={m.slug} />
      <Refinement m={m} />
      <Identity m={m} />
      <Lines m={m} />
      <States m={m} />
    </>
  );
}

