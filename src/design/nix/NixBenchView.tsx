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
import { WispForm } from "./wisp-form";
import { WispFlight, WispTurnScrub, WispView } from "./wisp-views";
import { FIREFLY_KEPT } from "./firefly-variants";
import { MOODS, type Mood } from "./rig/face";
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
const ALL: Candidate[] = [
  WISP_MAIN,
  ...SPIRITS,
  ...SPIRITS_2,
  ...PIP_FAMILY,
  ...REFERENCE,
  ...CANDIDATES,
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="instrument text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
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

      {(
        [
          ["Main character — Wisp", [WISP_MAIN]],
          ["Reference — wispy directions", [...SPIRITS, ...SPIRITS_2]],
          ["Reference — Pip", PIP_FAMILY],
          ["Reference — inspiration for the main or a side character", REFERENCE],
          ["Side candidates (and the original bench firefly)", CANDIDATES],
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
