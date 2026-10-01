"use client";

/**
 * The cast studio: Wisp (the main character) and its variants, new wispy directions, reference
 * drawings, then the side candidates.
 * One rig, one set of poses, expressions and outfits.
 */
import * as React from "react";

import { FilterSegment, FilterSet } from "@/components/ui/filter-segment";

import { CANDIDATES, type Candidate } from "./candidates";
import { FIREFLY_BODIES } from "./firefly-bodies";
import { FIREFLY_BODIES_2 } from "./firefly-bodies-2";
import { PIP_FAMILY } from "./firefly-pip";
import { SPIRITS } from "./firefly-spirits";
import { SPIRITS_2 } from "./firefly-spirits-2";
import { WISP_MAIN } from "./firefly-wisp";
import { WISP_EYES, WISP_WARM } from "./wisp-warm";
import { WISP_RIBBON } from "./wisp-ribbon";
import { EYE_STYLES } from "./wisp-eyes";
import { ActFigure, WISP_ACTS } from "./wisp-acts";
import { WispForm } from "./wisp-form";
import { WispFlight, WispTurnScrub, WispView } from "./wisp-views";
import { FIREFLY_KEPT } from "./firefly-variants";
import { SIDE_ABILITIES, type Ability } from "./side-abilities";
import { PRACTICE, STATES, type Variant } from "./side-states";
import { SIDE_CANDIDATES, SIDE_REFERENCE } from "./side-candidates";
import { SIDE_HUMANS } from "./side-humans";
import { PUFF_FAMILY } from "./side-puff";
import { ALL_MOODS, MOODS, type Mood } from "./rig/face";
import { NixFigure } from "./rig/NixFigure";
import { OUTFITS, type OutfitId } from "./rig/outfit";
import { POSES, type PoseId } from "./rig/poses";
import { PROPS, type PropId } from "./rig/props";
import { HEAD_VB } from "./rig/skeleton";

const TESTS = [
  ["Silhouette", "A solid fill at 48px still reads as this character."],
  ["Signature", "One feature people describe it by, surviving every outfit."],
  ["Favicon", "The head alone is recognisable at 16px."],
  ["Wardrobe", "Outfits change it without erasing it."],
  ["Range", "Warm to a six-year-old, not embarrassing for a teacher."],
  ["Not taken", "No clash with a well-known mascot."],
] as const;

/** Wisp, the main character; then the drawings kept as reference. */
const FIREFLIES = new Map(
  [...FIREFLY_BODIES, ...FIREFLY_BODIES_2, ...FIREFLY_KEPT].map((c) => [c.id, c]),
);
const REFERENCE = ["firefly-fuzzy", "firefly-chonk", "firefly-cube", "firefly-hood"].map(
  (id) => FIREFLIES.get(id)!,
);
const byId = (list: Candidate[], id: string) => list.find((x) => x.id === id)!;
const ANIMAL_POOL = [...SIDE_CANDIDATES, ...PUFF_FAMILY, ...CANDIDATES];

/** The side candidates still in the running, with the confirmed chameleon first. */
const CAST: Candidate[] = [
  byId(CANDIDATES, "chameleon"),
  byId(ANIMAL_POOL, "side-bat"),
  byId(ANIMAL_POOL, "side-chick"),
  byId(SIDE_HUMANS, "side-juno"),
  byId(SIDE_HUMANS, "side-lulu"),
];

/** Animal drawings kept as reference: the penguin, the otter and the bench's original firefly. */
const ANIMAL_REFERENCE: Candidate[] = [
  byId(CANDIDATES, "panda"),
  byId(ANIMAL_POOL, "side-octopus"),
  ...SIDE_REFERENCE,
  byId(CANDIDATES, "otter"),
  byId(CANDIDATES, "firefly"),
];

const ALL: Candidate[] = [
  WISP_MAIN,
  ...WISP_WARM,
  ...WISP_RIBBON,
  ...WISP_EYES,
  ...SPIRITS,
  ...SPIRITS_2,
  ...PIP_FAMILY,
  ...REFERENCE,
  ...CAST,
  ...ANIMAL_REFERENCE,
];

/** Every character with eyes of its own. */
/** Every candidate has eyes and a mouth of its own. */
const EYED = CAST;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="instrument text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

/** A side candidate with its ability previewed: drawn over the figure, or the figure hung from a bar. */
function AbilityTile({ a }: { a: Ability }) {
  const c = ALL.find((x) => x.id === a.id)!;
  const vb = a.viewBox ?? "0 0 200 300";
  return (
    <figure className="m-0 flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
      <div className="relative h-56 w-full">
        {a.behind && (
          <svg viewBox={vb} className="absolute inset-0 h-full w-full" aria-hidden>
            {a.fx()}
          </svg>
        )}
        <div
          className={`absolute inset-0 ${a.move ?? ""}`}
          style={{
            transform: a.turn || a.scale ? `rotate(${a.turn ?? 0}deg) scale(${a.scale ?? 1})` : undefined,
            opacity: a.fade,
            filter: a.hue ? `hue-rotate(${a.hue}deg)` : undefined,
          }}
        >
          <NixFigure c={c} mood={a.mood} pose={a.pose} act={a.act} viewBox={vb} headFx={a.head?.()} className="h-full w-full" />
        </div>
        {!a.behind && (
          <svg viewBox={vb} className="absolute inset-0 h-full w-full" aria-hidden>
            {a.fx()}
          </svg>
        )}
      </div>
      <figcaption className="text-sm">
        <span className="material-heading text-foreground">
          {c.label} · {a.name}
        </span>
        <span className="material mt-1 block text-muted-foreground">{a.line}</span>
      </figcaption>
    </figure>
  );
}

const KIND_LABEL = { feature: "Its own feature", body: "Face and body", prop: "A prop" } as const;

/** One practice-state variant, animated: the rig plays its act; whole-figure moves, the
 *  chameleon's colour and the props and effects are declared keyframes around it. */
function StateTile({ c, v }: { c: Candidate; v: Variant }) {
  const vb = v.viewBox ?? "0 0 200 300";
  return (
    <figure className="m-0 flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
      <div className="relative h-48 w-full overflow-hidden" style={{ isolation: "isolate" }}>
        {v.behind && (
          <svg viewBox={vb} className="absolute inset-0 h-full w-full" aria-hidden>
            {v.behind()}
          </svg>
        )}
        <div
          className={`absolute inset-0 ${v.move ?? ""}`}
          style={v.turn || v.scale ? { transform: `rotate(${v.turn ?? 0}deg) scale(${v.scale ?? 1})` } : undefined}
        >
          <div
            className={`h-full w-full ${v.figureClass ?? ""}`}
            style={v.tint && !v.tint.half ? { filter: v.tint.filter } : undefined}
          >
            <NixFigure c={c} act={v.act} viewBox={vb} headFx={v.head?.()} className="h-full w-full" />
          </div>
          {v.tint?.half && (
            <div className="absolute inset-0" style={{ filter: v.tint.filter, clipPath: "inset(0 0 50% 0)" }}>
              <NixFigure c={c} act={v.act} viewBox={vb} className="h-full w-full" />
            </div>
          )}
        </div>
        {v.over && (
          <svg viewBox={vb} className="absolute inset-0 h-full w-full" aria-hidden>
            {v.over()}
          </svg>
        )}
      </div>
      <figcaption className="text-sm">
        <span className="instrument block text-xs text-muted-foreground">{KIND_LABEL[v.kind]}</span>
        <span className="material-heading text-foreground">{v.title}</span>
        <span className="material mt-1 block text-muted-foreground">{v.line}</span>
      </figcaption>
    </figure>
  );
}

function PracticeStates() {
  const [who, setWho] = React.useState(PRACTICE[0].id);
  const sheet = PRACTICE.find((x) => x.id === who) ?? PRACTICE[0];
  const c = ALL.find((x) => x.id === sheet.id)!;
  return (
    <section aria-labelledby="practice-states">
      <h2 id="practice-states" className="material-heading mt-10 text-lg text-foreground">
        Practice states — five of each, per character
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        How each side character reacts while a learner answers, and to the answer: still writing,
        correct, incorrect (always gentle), partly correct. Five variants each, so it is never the
        same twice in a row. Each character mixes its own feature, face-and-body acting and a prop,
        and no two characters share an action or a prop — only faces may repeat.
      </p>
      <div className="mt-3">
        <FilterSet className="flex-wrap">
          {PRACTICE.map((x) => (
            <FilterSegment key={x.id} pressed={x.id === who} onClick={() => setWho(x.id)}>
              {ALL.find((y) => y.id === x.id)?.label}
            </FilterSegment>
          ))}
        </FilterSet>
      </div>
      {STATES.map((st) => (
        <div key={st.id} className="mt-5">
          <h3 className="material-heading text-base text-foreground">{st.title}</h3>
          <p className="material m-0 text-sm text-muted-foreground">{st.use}</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {sheet.variants
              .filter((v) => v.state === st.id)
              .map((v) => (
                <StateTile key={v.title} c={c} v={v} />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Tile({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="m-0 flex flex-col items-center gap-1.5 rounded-[var(--radius)] bg-muted p-2">
      {children}
      <figcaption className="instrument text-xs text-muted-foreground">{title}</figcaption>
    </figure>
  );
}

export function NixBenchView() {
  const [id, setId] = React.useState(ALL[0].id);
  const c = ALL.find((x) => x.id === id) ?? ALL[0];
  const [pose, setPose] = React.useState<PoseId>("idle");
  const [mood, setMood] = React.useState<Mood | undefined>(undefined);
  const [outfit, setOutfit] = React.useState<OutfitId>(c.outfit);
  const [props, setProps] = React.useState<PropId[]>([]);
  const [still, setStill] = React.useState(false);

  const pick = (next: Candidate) => {
    setId(next.id);
    setOutfit(next.outfit);
    setProps([]);
  };
  const toggleProp = (p: PropId) =>
    setProps((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  return (
    <div>
      <p className="spec-cap m-0 text-muted-foreground">Sparkles / the guide bench</p>
      <h1 className="display mt-1">The cast</h1>
      <p className="material mt-3 max-w-[64ch] text-muted-foreground">
        The main character is Wisp: a floating firefly that leaves glowing sparks behind it as it
        flies. Colours come from the scheme in the header; only its flame and sparks are its own.
        The other wispy directions, Pip and the earlier fireflies stay as reference.
      </p>

      <dl className="mt-5 grid max-w-[64rem] gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {TESTS.map(([t, d]) => (
          <div key={t}>
            <dt className="instrument text-foreground">{t}</dt>
            <dd className="material m-0 text-muted-foreground">{d}</dd>
          </div>
        ))}
      </dl>

      <h2 className="material-heading mt-10 text-lg text-foreground">Wisp — turnaround</h2>
      <div className="mt-2 grid grid-cols-2 gap-4 sm:max-w-[52rem] sm:grid-cols-4">
        <Tile title="Front">
          <NixFigure c={WISP_MAIN} still className="h-56 w-full" />
        </Tile>
        <Tile title="Three-quarter">
          <WispView view="three-quarter" className="h-56 w-full" />
        </Tile>
        <Tile title="Side">
          <WispView view="side" className="h-56 w-full" />
        </Tile>
        <Tile title="Back">
          <WispView view="back" className="h-56 w-full" />
        </Tile>
      </div>

      <div className="mt-4 sm:max-w-[16rem]">
        <WispTurnScrub />
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">Wisp — in flight</h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        It hovers facing us, turns — continuously, head first — to face its way, and flies to the
        other side, where it turns back to face us and hovers; then home the same way. It never
        flips. Its wings beat as two pairs, and it leaves sparks where it has been. Under reduced
        motion, one still frame.
      </p>
      <div className="mt-3">
        <WispFlight />
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">Wisp — on the sign-up form</h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        The one place Wisp appears. It waits in the gutter to the left, turned toward the form.
        Between fields it hops rather than flies; while you type it turns into the field and its
        eyes follow the text; at the password it turns its back until you leave the field. Click
        into a field and type, or let the demo play. Under reduced motion it reappears rather than
        travels.
      </p>
      <div className="mt-3">
        <WispForm />
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">
        Wisp, warmer — proposals
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        Wisp itself is unchanged. Beside the side characters it is the only one who is nobody at
        rest: all cool blue with its warmth at its tail, a small face on a perfectly symmetric drop,
        a stick body, no temperament. Each of the first four changes one thing — warmth, attitude,
        face, softness — so it can be judged alone; the last puts them together. Each is shown at
        rest, then in every expression.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[WISP_MAIN, ...WISP_WARM].map((x) => (
          <Tile key={x.id} title={x.id === WISP_MAIN.id ? "Wisp (as is)" : x.label}>
            <NixFigure c={x} className="h-56 w-full" />
          </Tile>
        ))}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              <th />
              {MOODS.map((m) => (
                <th key={m.id} className="instrument text-xs font-normal text-muted-foreground">
                  {m.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[WISP_MAIN, ...WISP_WARM].map((x) => (
              <tr key={x.id}>
                <th className="instrument pr-2 text-left text-xs font-normal text-foreground">
                  {x.id === WISP_MAIN.id ? "Wisp (as is)" : x.label}
                </th>
                {MOODS.map((m) => (
                  <td key={m.id} className="rounded-[var(--radius)] bg-muted">
                    <NixFigure c={x} mood={m.id} still viewBox={HEAD_VB} className="h-24 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">
        Wisp · Ribbon wings — proposal
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        Wisp started with one pair of ribbon wings that trailed down like a scarf or a ghost’s hem;
        “Finalise Wisp” swapped them for two pairs of spotted wings. Here the current Wisp, and the
        warmer, keep everything they have and take the ribbons back, redrawn in the scheme with a
        hairline edge. Static figures only.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[WISP_MAIN, WISP_RIBBON[0], byId(WISP_WARM, "wisp-warmer"), WISP_RIBBON[1]].map((x) => (
          <Tile key={x.id} title={x.id === WISP_MAIN.id ? "Wisp (as is)" : x.label}>
            <NixFigure c={x} className="h-56 w-full" />
          </Tile>
        ))}
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">
        Wisp, warmer — eye styles
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        The warmer in five eye styles, each drawn for the shared nine expressions and five of
        Wisp's own — sly, silly, surprised, proud, party — so its range runs from composed to
        clowning. Everything but the eyes is the warmer as drawn. Its stalks sway, and once a loop
        the left one twitches and the flopped one boings.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {WISP_EYES.map((x, i) => (
          <figure key={x.id} className="m-0 flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
            <NixFigure c={x} className="h-56 w-full" />
            <figcaption className="text-sm">
              <span className="material-heading text-foreground">{EYE_STYLES[i].label}</span>
              <span className="material mt-1 block text-muted-foreground">{EYE_STYLES[i].note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              <th />
              {ALL_MOODS.map((m) => (
                <th key={m.id} className="instrument text-xs font-normal text-muted-foreground">
                  {m.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WISP_EYES.map((x, i) => (
              <tr key={x.id}>
                <th className="instrument pr-2 text-left text-xs font-normal text-foreground">
                  {EYE_STYLES[i].label}
                </th>
                {ALL_MOODS.map((m) => (
                  <td key={m.id} className="rounded-[var(--radius)] bg-muted">
                    <NixFigure c={x} mood={m.id} still viewBox={HEAD_VB} className="h-24 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">Wisp, warmer — acting</h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        What kept it laid back: it floated level and centred, on one slow even beat, always looking
        straight at you, never changing shape, and never playing with its own light. Each act
        breaks one of those — off balance, holds and snaps, glances, squash and stretch, its light as
        a toy. Its face changes on the act's own clock. Shown in both eye styles still in the
        running: Bean on the left, Gumdrop on the right.
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WISP_ACTS.map((a) => (
          <figure key={a.id} className="m-0 flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
            <div className="grid grid-cols-2 gap-1">
              {["wisp-warmer-eyes-bean", "wisp-warmer-eyes-gumdrop"].map((id) => (
                <ActFigure key={id} c={WISP_EYES.find((x) => x.id === id)!} a={a} className="h-56" />
              ))}
            </div>
            <figcaption className="text-sm">
              <span className="material-heading text-foreground">{a.title}</span>
              <span className="material mt-1 block text-muted-foreground">{a.line}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">
        Side candidates and their abilities
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        The side candidates still in the running, each with its ability — something that comes
        from the character itself, its body and its nature, never a prop or an outside object. The
        chameleon is confirmed; the rest compete for the other five places.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {SIDE_ABILITIES.map((a) => (
          <AbilityTile key={a.id} a={a} />
        ))}
      </div>

      <PracticeStates />

      <h2 className="material-heading mt-10 text-lg text-foreground">Eyes and mouths — each character's own</h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        No two characters share eyes or a mouth. Each has its own eye shape, colour, shine, lids
        and brows, and its own mouth or lips, beak or muzzle, and draws every expression with them.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              <th />
              {MOODS.map((m) => (
                <th key={m.id} className="instrument text-xs font-normal text-muted-foreground">
                  {m.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EYED.map((x) => (
              <tr key={x.id}>
                <th className="instrument pr-2 text-left text-xs font-normal text-foreground">
                  {x.label}
                </th>
                {MOODS.map((m) => (
                  <td key={m.id} className="rounded-[var(--radius)] bg-muted">
                    <NixFigure c={x} mood={m.id} still viewBox={HEAD_VB} className="h-24 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(
        [
          ["Main character — Wisp", [WISP_MAIN]],
          ["Wisp, warmer — proposals", WISP_WARM],
          ["Wisp · Ribbon wings — proposal", WISP_RIBBON],
          ["Wisp, warmer — eye styles", WISP_EYES],
          ["Reference — wispy directions", [...SPIRITS, ...SPIRITS_2]],
          ["Reference — Pip", PIP_FAMILY],
          ["Reference — inspiration for the main or a side character", REFERENCE],
          ["Side candidates", CAST],
          ["Reference — other animals", ANIMAL_REFERENCE],
        ] as const
      ).map(([title, group]) => (
        <React.Fragment key={title}>
          <h2 className="material-heading mt-10 text-lg text-foreground">{title}</h2>
          <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {group.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === id}
                onClick={() => pick(x)}
                className="flex flex-col items-center gap-2 rounded-[var(--radius-surface)] border border-border bg-card p-3 text-left aria-pressed:border-primary aria-pressed:ring-2 aria-pressed:ring-primary"
              >
                <NixFigure c={x} className="h-48 w-full" />
                <span className="material-heading text-sm text-foreground">{x.label}</span>
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}

      <section
        className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]"
        aria-labelledby="nix-bench"
      >
        <div className="rounded-[var(--radius-surface)] border border-border bg-card p-4">
          <NixFigure
            c={c}
            pose={pose}
            mood={mood}
            outfit={outfit}
            props={props}
            still={still}
            className="mx-auto h-[26rem] w-full"
            label={`${c.label}, ${POSES.find((p) => p.id === pose)?.title.toLowerCase()} pose`}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h2 id="nix-bench" className="material-heading text-lg text-foreground">
              {c.label}
            </h2>
            <p className="material mt-1 text-sm text-foreground">{c.signature}</p>
            <p className="material mt-2 text-sm text-muted-foreground">{c.pitch}</p>
            <p className="material mt-2 text-sm text-muted-foreground">
              <span className="instrument text-foreground">Risk · </span>
              {c.risk}
            </p>
          </div>

          <Row label="Pose">
            <FilterSet>
              {POSES.map((p) => (
                <FilterSegment
                  key={p.id}
                  pressed={pose === p.id}
                  onClick={() => {
                    setPose(p.id);
                    setMood(undefined);
                  }}
                  title={p.use}
                >
                  {p.title}
                </FilterSegment>
              ))}
            </FilterSet>
          </Row>
          <Row label="Expression">
            <FilterSet className="flex-wrap">
              {MOODS.map((m) => (
                <FilterSegment
                  key={m.id}
                  pressed={(mood ?? POSES.find((p) => p.id === pose)?.mood) === m.id}
                  onClick={() => setMood(m.id)}
                  title={m.use}
                >
                  {m.title}
                </FilterSegment>
              ))}
            </FilterSet>
          </Row>
          <Row label="Outfit">
            <FilterSet className="flex-wrap">
              {OUTFITS.filter((o) => c.outfits.includes(o.id)).map((o) => (
                <FilterSegment
                  key={o.id}
                  pressed={outfit === o.id}
                  onClick={() => setOutfit(o.id)}
                  title={o.use}
                >
                  {o.title}
                </FilterSegment>
              ))}
            </FilterSet>
          </Row>
          <Row label="Props">
            <FilterSet className="flex-wrap">
              {PROPS.filter((p) => p.id !== "beanie" && p.id !== "partyHat").map((p) => (
                <FilterSegment
                  key={p.id}
                  pressed={props.includes(p.id)}
                  onClick={() => toggleProp(p.id)}
                  title={p.use}
                >
                  {p.title}
                </FilterSegment>
              ))}
            </FilterSet>
          </Row>
          <Row label="Motion">
            <FilterSet>
              <FilterSegment pressed={!still} onClick={() => setStill(false)}>
                Moving
              </FilterSegment>
              <FilterSegment pressed={still} onClick={() => setStill(true)}>
                Stilled
              </FilterSegment>
            </FilterSet>
          </Row>
        </div>
      </section>

      <h2 className="material-heading mt-10 text-lg text-foreground">{c.label} — expressions</h2>
      <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
        {MOODS.map((m) => (
          <Tile key={m.id} title={m.title}>
            <NixFigure
              c={c}
              mood={m.id}
              outfit={outfit}
              props={props}
              still
              viewBox={HEAD_VB}
              className="h-20 w-20"
            />
          </Tile>
        ))}
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">{c.label} — wardrobe</h2>
      <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {OUTFITS.filter((o) => c.outfits.includes(o.id)).map((o) => (
          <Tile key={o.id} title={o.title}>
            <NixFigure c={c} outfit={o.id} still className="h-40 w-full" />
          </Tile>
        ))}
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">
        Recognition — every candidate
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        Silhouettes at 96, 48 and 32px, then the head in colour at 32, 24 and 16px — the favicon
        test.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ALL.map((x) => (
          <div key={x.id} className="flex items-end gap-4 rounded-[var(--radius)] bg-muted p-3">
            <NixFigure c={x} still silhouette className="h-24 w-16" />
            <NixFigure c={x} still silhouette className="h-12 w-8" />
            <NixFigure c={x} still silhouette className="h-8 w-6" />
            <span className="w-2" />
            <NixFigure c={x} still viewBox={HEAD_VB} className="h-8 w-8" />
            <NixFigure c={x} still viewBox={HEAD_VB} className="h-6 w-6" />
            <NixFigure c={x} still viewBox={HEAD_VB} className="h-4 w-4" />
            <span className="instrument ml-auto text-xs text-muted-foreground">{x.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
