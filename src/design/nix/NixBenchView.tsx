"use client";

/**
 * The cast studio, as pages on one rig, one set of poses, expressions and outfits:
 * - Wisp: the main character on its ribbon wings (Clean, with the picks in `wisp-clean.tsx`), its
 *   app icon proposals, warmer proposals, eye styles and acting; every view, the flight and the
 *   form draw ribbons.
 * - Wisp · Butterfly (reference): the same page with Wisp's two pairs of spotted wings, kept as an
 *   alternate main character.
 * - Side characters: the side candidates, their abilities, practice states, eyes and mouths.
 * - References: the ribbon variants not chosen, the wispy directions, Pip and earlier fireflies.
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
import { RIBBON_VARIANTS, withRibbon, type RibbonVariantId } from "./wisp-ribbon";
import { CLEAN_ARMS, CLEAN_BASE, CLEAN_HEADS, CLEAN_PICK, CLEAN_TAILS } from "./wisp-clean";
import { BEAN_STYLES, EYE_STYLES } from "./wisp-eyes";
import { ActFigure, WISP_ACTS } from "./wisp-acts";
import { WispForm } from "./wisp-form";
import { APP_ICON, APP_ICON_EYES, APP_ICON_FACES, APP_ICON_SET, K_SPARKLES, LOGO_VARIANTS, LOGOS, LOGOS_BUTTERFLY, LogoMark, type K, type Logo } from "./wisp-logo";
import { WispFlight, WispTurnScrub, WispView } from "./wisp-views";
import { WORDMARK, WORDMARKS_REFERENCE, WordmarkSheet } from "./wisp-wordmark";
import { RibbonFormContext, WingStyleContext, type WingStyle } from "./wisp-turn";
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

/** Every drawing in the studio, for looking one up by id. */
const ALL: Candidate[] = [
  WISP_MAIN,
  ...WISP_WARM,
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

/** One app icon proposal: large, then at the sizes a browser and a phone use, on both grounds. */
function LogoCard({ logo, k }: { logo: Logo; k?: K }) {
  return (
    <figure className="m-0 flex flex-col gap-3 rounded-[var(--radius)] bg-muted p-3">
      <div className="flex items-end gap-3">
        <LogoMark logo={logo} k={k} px={128} />
        <div className="flex flex-col gap-2">
          {(["#ffffff", "#15171c"] as const).map((ground) => (
            <div
              key={ground}
              className="flex items-end gap-2 rounded-md p-2"
              style={{ background: ground }}
            >
              <LogoMark logo={logo} k={k} px={64} />
              <LogoMark logo={logo} k={k} px={32} />
              <LogoMark logo={logo} k={k} px={16} />
            </div>
          ))}
        </div>
      </div>
      <figcaption className="text-sm">
        <span className="material-heading text-foreground">{logo.label}</span>
        <span className="material mt-1 block text-muted-foreground">{logo.line}</span>
        <span className="material mt-1 block text-xs text-muted-foreground">{logo.note}</span>
      </figcaption>
    </figure>
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

type Group = readonly [title: string, list: Candidate[]];

/**
 * The bench: pick a drawing from the page's groups, then pose it, change its expression, outfit
 * and props, and see its expressions, wardrobe and the recognition test for the page's drawings.
 */
function Bench({ groups }: { groups: Group[] }) {
  /* a drawing may sit in two groups (the ribbon page's warmer is a pairing and a proposal) */
  const all = [...new Map(groups.flatMap(([, list]) => list).map((x) => [x.id, x])).values()];
  const [id, setId] = React.useState(all[0].id);
  const c = all.find((x) => x.id === id) ?? all[0];
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
    <>
      {groups.map(([title, group]) => (
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
        {all.map((x) => (
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
    </>
  );
}

function Tests() {
  return (
    <dl className="mt-5 grid max-w-[64rem] gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
      {TESTS.map(([t, d]) => (
        <div key={t}>
          <dt className="instrument text-foreground">{t}</dt>
          <dd className="material m-0 text-muted-foreground">{d}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Figures at rest, then each in every expression. */
function MoodSheet({ list, name }: { list: Candidate[]; name: (x: Candidate) => string }) {
  return (
    <>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {list.map((x) => (
          <Tile key={x.id} title={name(x)}>
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
            {list.map((x) => (
              <tr key={x.id}>
                <th className="instrument pr-2 text-left text-xs font-normal text-foreground">
                  {name(x)}
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
    </>
  );
}

/** What differs between the Wisp page and its ribbon clone. */
type Line = {
  /** The main character. */
  main: Candidate;
  warm: Candidate[];
  eyes: Candidate[];
};

const PAIRS: Line = { main: WISP_MAIN, warm: WISP_WARM, eyes: WISP_EYES };

/** The Wisp line with the ribbons of one variant in place of the wings: nothing else changes. */
const ribbonLine = (v: (typeof RIBBON_VARIANTS)[number]): Line => ({
  /* on Clean, the picks: the Core tail and Snug's arms (`wisp-clean.tsx`) */
  main: v.id === "clean" ? CLEAN_PICK : withRibbon(WISP_MAIN, v),
  warm: WISP_WARM.map((c) => withRibbon(c, v)),
  eyes: WISP_EYES.map((c) => withRibbon(c, v)),
});
const RIBBON_LINES = Object.fromEntries(RIBBON_VARIANTS.map((v) => [v.id, ribbonLine(v)])) as Record<
  RibbonVariantId,
  Line
>;

/** The softer Beans on the main character: only the eye kit changes. */
const BEAN_ON_MAIN: Candidate[] = BEAN_STYLES.map((e) => ({
  ...CLEAN_PICK,
  id: `${CLEAN_PICK.id}-${e.id}`,
  label: `Wisp · ${e.label}`,
  face: { ...CLEAN_PICK.face, kit: e.kit, eyeSize: 1, eyeGap: 20, eyeY: 107 },
}));

const REFERENCE_GROUPS: Group[] = [
  ["Reference — wispy directions", [...SPIRITS, ...SPIRITS_2]],
  ["Reference — Pip", PIP_FAMILY],
  ["Reference — inspiration for the main or a side character", REFERENCE],
];

/** The main character's page: Wisp as drawn (`pairs`), or its ribbon clone (`ribbon`). */
export function WispPage({ wings }: { wings: WingStyle }) {
  /* Clean is the chosen ribbon variant; Glow tips and Spirit are on the reference page */
  const variant: RibbonVariantId = "clean";
  const ribbon = wings === "ribbon";
  const v = RIBBON_VARIANTS.find((x) => x.id === variant)!;
  const line = ribbon ? RIBBON_LINES[variant] : PAIRS;
  const front = line.main;
  const asIs = (x: Candidate) => (x.id === front.id ? `${front.label} (as is)` : x.label);
  const actEyes = ["bean", "gumdrop"].map(
    (id) => line.eyes[WISP_EYES.findIndex((x) => x.id === `wisp-warmer-eyes-${id}`)],
  );
  return (
    <WingStyleContext.Provider value={wings}>
    <RibbonFormContext.Provider value={v.form}>
      <p className="spec-cap m-0 text-muted-foreground">Sparkles / the guide bench</p>
      <h1 className="display mt-1">{ribbon ? "Wisp" : "Wisp · Butterfly wings (reference)"}</h1>
      {ribbon ? (
        <>
          <p className="material mt-3 max-w-[64ch] text-muted-foreground">
            The main character is Wisp: a floating firefly that leaves glowing sparks behind it as
            it flies. Colours come from the scheme in the header; only its flame and sparks are its
            own. Its wings are one pair of ribbons that trail down past the body, like a scarf or a
            ghost’s hem — the wings it started with. The two pairs of spotted butterfly wings it
            had since “Finalise Wisp” are kept as an alternate main character on{" "}
            <a href="#/butterfly" className="text-foreground underline">
              Wisp · Butterfly
            </a>
            . The ribbons are Clean: one ribbon each side, fading to nothing, its
            tail swaying and a little mist leaving the tips. Every figure on the page — the
            turnaround, the flight, the form, the warmer proposals, the eye styles and the acting —
            wears them. The main character, its turnaround, flight and form also carry the picks on
            Clean: a paler core in the flame and Snug’s thicker arms. Glow tips and Spirit are on the{" "}
            <a href="#/references" className="text-foreground underline">
              References
            </a>{" "}
            page.
          </p>

          <h2 className="material-heading mt-10 text-lg text-foreground">
            Clean — tail patterns, head shapes and arms (proposals)
          </h2>
          <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
            Chosen: the Core tail and Snug’s arms, with the drop head kept — the main character on
            this page, and what the turnaround, flight and form draw. Then Clean as it was, and the
            proposals, each changing one thing on it. Two tail patterns drawn from
            what a firefly’s light really looks like — Lantern, where only the segment between the
            rings is lit brightest, as on a real firefly; and Core, a paler heart inside the flame,
            following its curl. Two head shapes that move the drop’s tip toward one of the things a
            wisp is — Candle, a taller tip that leans like a candle’s flame; and Dewdrop, a short
            rounded tip, a drop about to fall. Last, Snug arms: Snug’s thicker arms and bigger soft
            hand tips on Clean’s slim body. Front only. Shown at rest, then in every expression.
          </p>
          <MoodSheet
            list={[CLEAN_PICK, CLEAN_BASE, ...CLEAN_TAILS, ...CLEAN_HEADS, ...CLEAN_ARMS]}
            name={(x) =>
              x.id === CLEAN_PICK.id
                ? "Chosen"
                : x.id === CLEAN_BASE.id
                  ? "Clean (before)"
                  : x.label.replace("Clean · ", "")
            }
          />
        </>
      ) : (
        <p className="material mt-3 max-w-[64ch] text-muted-foreground">
          Reference: an alternate main character. Wisp with two pairs of spotted butterfly wings,
          as it was from “Finalise Wisp” until the ribbon wings were chosen. The main character
          is{" "}
          <a href="#/wisp" className="text-foreground underline">
            Wisp
          </a>
          , on one pair of ribbon wings. Everything else on this page — the turnaround, flight,
          form, warmer proposals, eye styles and acting — is the same, on the butterfly wings.
        </p>
      )}
      <Tests />

      {/* the app icon is the main character's: on the Wisp page only */}
      {ribbon && (
      <>
        <h2 className="material-heading mt-10 text-lg text-foreground">
          Wisp — app icon: {APP_ICON.label} (chosen)
        </h2>
        <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
          Wisp’s drop drawn as its own light — a solid yellow drop with eyes and two antennae — on a
          solid primary tile. Its eyes are being redrawn after Feather (below). Solid colours only: no gradient, no halo, no shine, so it stays
          crisp from the store listing to a 16px tab, and platforms can recolour it. Always in the
          product’s own colours (shown here in the Sparkles scheme, whatever the header says).
          Contrast: the yellow on the primary 3.9:1, the ink eyes on the yellow 11.1:1, the tile
          5.7:1 on a white home screen and 3.1:1 on a dark one; blue and yellow hold up under the
          common colour blindnesses. Its circle and one-colour shapes, and every other icon
          proposal, are on the{" "}
          <a href="#/references" className="text-foreground underline">
            References
          </a>{" "}
          page until the eyes are chosen. Files: <code>docs/logo/app-icon*.svg</code>.
        </p>
        <div className="mt-3 grid gap-4 sm:max-w-[64rem] sm:grid-cols-2 lg:grid-cols-3">
          <LogoCard logo={APP_ICON} k={K_SPARKLES} />
        </div>

        <h3 className="material-heading mt-8 text-base text-foreground">
          The icon’s eyes, after Feather (proposals)
        </h3>
        <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
          Wisp’s eyes are now Feather: a white eye, a soft rim, an ink pupil with its shine, tapered
          brows. These are the ways the icon’s eyes could follow — from solid ink, through Feather’s
          white eye with different rims, to an outline with no white. Everything else is Glow ·
          Light. Each is shown as the app icon and at 64, 32 and 16px on white and on dark; at 32px
          and under each switches to its own simplified drawing.
        </p>
        <div className="mt-3 grid gap-4 sm:max-w-[64rem] sm:grid-cols-2 lg:grid-cols-3">
          {APP_ICON_EYES.map((l) => (
            <LogoCard key={l.id} logo={l} k={K_SPARKLES} />
          ))}
        </div>

        <h3 className="material-heading mt-8 text-base text-foreground">
          Wordmark: {WORDMARK.family} {WORDMARK.weight} (chosen)
        </h3>
        <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
          “sparkles”, set in lowercase in {WORDMARK.family} {WORDMARK.weight} with −0.01em
          tracking: in the primary on light grounds, white on dark and on the primary. Geometric
          with soft, round counters and a little bounce, so it sits beside the round, solid mark
          without competing with it. Shown beside the icon on white, on dark, on the primary and at
          16px. The faces it was chosen from are on the{" "}
          <a href="#/references" className="text-foreground underline">
            References
          </a>{" "}
          page.
        </p>
        <WordmarkSheet list={[WORDMARK]} />

      </>
      )}
      {!ribbon && (
        <>
          <h2 className="material-heading mt-10 text-lg text-foreground">
            App icons with the butterfly wings (retired)
          </h2>
          <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
            Proposals drawn from the whole figure, so they carry the two pairs of wings. Retired
            with the butterfly Wisp; the chosen app icon is on the Wisp page.
          </p>
          <div className="mt-3 grid gap-4 sm:max-w-[64rem] sm:grid-cols-2 lg:grid-cols-3">
            {LOGOS_BUTTERFLY.map((l) => (
              <LogoCard key={l.id} logo={l} />
            ))}
          </div>
        </>
      )}

      <h2 className="material-heading mt-10 text-lg text-foreground">{front.label} — turnaround</h2>
      <div className="mt-2 grid grid-cols-2 gap-4 sm:max-w-[52rem] sm:grid-cols-4">
        <Tile title="Front">
          <NixFigure c={front} still className="h-56 w-full" />
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

      <h2 className="material-heading mt-10 text-lg text-foreground">{front.label} — in flight</h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        It hovers facing us, turns — continuously, head first — to face its way, and flies to the
        other side, where it turns back to face us and hovers; then home the same way. It never
        flips. {ribbon ? "Its ribbons beat as one pair" : "Its wings beat as two pairs"}, and it
        leaves sparks where it has been. Under reduced motion, one still frame.
      </p>
      <div className="mt-3">
        <WispFlight />
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">
        {front.label} — on the sign-up form
      </h2>
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
        Wisp, warmer — proposals{ribbon ? " on the ribbons" : ""}
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        Wisp itself is unchanged. Beside the side characters it is the only one who is nobody at
        rest: all cool blue with its warmth at its tail, a small face on a perfectly symmetric drop,
        a stick body, no temperament. Each of the first four changes one thing — warmth, attitude,
        face, softness — so it can be judged alone; the last puts them together. Each is shown at
        rest, then in every expression.
      </p>
      <MoodSheet list={[front, ...line.warm]} name={asIs} />

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
        {line.eyes.map((x, i) => (
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
            {line.eyes.map((x, i) => (
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

      {ribbon && (
        <>
          <h2 className="material-heading mt-10 text-lg text-foreground">
            Bean, softer — on Wisp (proposals)
          </h2>
          <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
            Bean’s acting with a lighter hand. What made it chunky is its line — a 4.2 ink brow of
            even weight, a 1.8 ink rim round each eye, a 2.6 lash — not its acting: the roaming
            pupil, the lids and the brows’ tilt and lift are the same table in every variant, so
            each is as expressive. Soft lightens every line; Feather tapers the brows to round
            tips; Blue brows draws Feather’s brows in the body’s deep blue; Round makes the eye
            rounder with a bigger pupil and two shines. Shown on Wisp, at rest and in every
            expression.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {BEAN_ON_MAIN.map((x, i) => (
              <figure key={x.id} className="m-0 flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
                <NixFigure c={x} className="h-56 w-full" />
                <figcaption className="text-sm">
                  <span className="material-heading text-foreground">{BEAN_STYLES[i].label}</span>
                  <span className="material mt-1 block text-muted-foreground">{BEAN_STYLES[i].note}</span>
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
                {BEAN_ON_MAIN.map((x, i) => (
                  <tr key={x.id} data-bean={BEAN_STYLES[i].id}>
                    <th className="instrument pr-2 text-left text-xs font-normal text-foreground">
                      {BEAN_STYLES[i].label}
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
        </>
      )}

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
              {actEyes.map((x) => (
                <ActFigure key={x.id} c={x} a={a} className="h-56" />
              ))}
            </div>
            <figcaption className="text-sm">
              <span className="material-heading text-foreground">{a.title}</span>
              <span className="material mt-1 block text-muted-foreground">{a.line}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Bench
        groups={[
          [ribbon ? "Main character — Wisp" : "Alternate main character — Wisp · Butterfly (reference)", [line.main]],
          [ribbon ? "Wisp, warmer — proposals on the ribbons" : "Wisp, warmer — proposals", line.warm],
          ["Wisp, warmer — eye styles", line.eyes],
        ]}
      />
    </RibbonFormContext.Provider>
    </WingStyleContext.Provider>
  );
}

/** The reference page: the drawings kept beside Wisp, moved off the Wisp pages. */
export function ReferencesPage() {
  return (
    <>
      <p className="spec-cap m-0 text-muted-foreground">Sparkles / the guide bench</p>
      <h1 className="display mt-1">References</h1>
      <p className="material mt-3 max-w-[64ch] text-muted-foreground">
        Drawings kept as reference, not candidates: the other wispy directions, Pip and the earlier
        fireflies. Wisp and its ribbon wings are on their own pages.
      </p>
      <h2 className="material-heading mt-10 text-lg text-foreground">
        Reference — app icon proposals
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        The marks the app icon (Glow · Light, on the Wisp page) was chosen from; its circle and
        one-colour shapes, drawn with ink eyes, to be redrawn with the chosen eyes; and the earlier
        face options. Each is shown as the app icon and at 64, 32 and 16px, in the header’s scheme.
      </p>
      <div className="mt-3 grid gap-4 sm:max-w-[64rem] sm:grid-cols-2 lg:grid-cols-3">
        {[...APP_ICON_SET.slice(1), ...APP_ICON_FACES.slice(1), ...LOGOS, ...LOGO_VARIANTS].map((l) => (
          <LogoCard key={l.id} logo={l} />
        ))}
      </div>

      <h2 className="material-heading mt-10 text-lg text-foreground">
        Reference — wordmark candidates
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        The faces the wordmark was chosen from; {WORDMARK.family} {WORDMARK.weight} is on the Wisp
        page. The top three were M PLUS Rounded 1c, Gabarito and Figtree. Earlier rounds:{" "}
        <code>docs/logo/wordmarks.png</code> and <code>wordmarks-2.png</code>.
      </p>
      <WordmarkSheet list={WORDMARKS_REFERENCE} />

      <h2 className="material-heading mt-10 text-lg text-foreground">
        Reference — ribbon variants
      </h2>
      <p className="material mt-1 max-w-[64ch] text-sm text-muted-foreground">
        The ribbon variants not chosen. Clean is the main character’s; these two stay
        as reference.
      </p>
      <div className="mt-3 grid gap-4 sm:max-w-[48rem] sm:grid-cols-2">
        {RIBBON_VARIANTS.filter((v) => v.id !== "clean").map((v) => (
          <figure key={v.id} className="m-0 flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
            <NixFigure c={RIBBON_LINES[v.id].main} className="h-64 w-full" />
            <figcaption className="text-sm">
              <span className="material-heading text-foreground">{v.label}</span>
              <span className="material mt-1 block text-muted-foreground">{v.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <Bench groups={REFERENCE_GROUPS} />
    </>
  );
}

/** The side characters' page. */
export function SidePage() {
  return (
    <>
      <p className="spec-cap m-0 text-muted-foreground">Sparkles / the guide bench</p>
      <h1 className="display mt-1">Side characters</h1>
      <p className="material mt-3 max-w-[64ch] text-muted-foreground">
        Six places beside Wisp, each a different species or a person, each with one ability no
        other character has. The chameleon is confirmed; the fruit bat, chick, Juno and Lulu are
        chosen so far, and the sixth place is open.
      </p>
      <Tests />

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

      <Bench
        groups={[
          ["Side candidates", CAST],
          ["Reference — other animals", ANIMAL_REFERENCE],
        ]}
      />
    </>
  );
}
