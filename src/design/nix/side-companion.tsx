/**
 * The seven side characters as drawn Sparkles-ready: each spec of `side-cast.ts` (product name,
 * temperament, ability, voice, fixed lines) with the studio's drawing, Noor with the product's layer
 * over her (`side-noor.tsx`). The studio's names and ids stay the drawings' own.
 */
import type { Candidate } from "./candidates";
import { CAST_SPECS, type CastLines, type CastSpec } from "./side-cast";
import { refineNoor } from "./side-noor";
import { SCIENTISTS, WOMEN } from "./side-more";
import { ELDERS, TEACHERS } from "./side-people";
import { SHORTLISTED } from "./side-shortlist";

export type CastSlug = "haru" | "margot" | "nell" | "otto" | "noor" | "rio" | "cleo";
export type { CastLines };

export type CastMember = Omit<CastSpec, "slug"> & {
  slug: CastSlug;
  /** The drawing as refined so far: what every page of the studio shows. */
  figure: Candidate;
  /** The studio drawing before any refinement. */
  base: Candidate;
  /** What the refinement changed, one line each; empty until the character is refined. */
  refinements: readonly string[];
};

/** What each refinement changed. Add a line here with every change to a character. */
const REFINEMENTS: Partial<Record<CastSlug, readonly string[]>> = {
  noor: [
    "A hijab with real fabric: an underscarf band, a wrap crossing under the chin, folds, a brooch and a drape",
    "A long-sleeved plum dress with gold cuffs and hem, a bow at the hip and a pencil in a pocket",
    "Longer arms and bigger hands, so a thumbs-up or a point reads at size",
    "A resting smile that lifts on one side, with a dimple",
  ],
};

const STUDIO = [...SCIENTISTS, ...WOMEN, ...ELDERS, ...TEACHERS, ...SHORTLISTED];
const REFINED: Partial<Record<CastSlug, (c: Candidate) => Candidate>> = { noor: refineNoor };

export const CAST: readonly CastMember[] = CAST_SPECS.map((s) => {
  const base = STUDIO.find((x) => x.id === s.studio.id);
  if (!base) throw new Error(`cast: no studio drawing ${s.studio.id}`);
  const slug = s.slug as CastSlug;
  const drawn = { ...base, label: s.name };
  return { ...s, slug, base: drawn, figure: REFINED[slug]?.(drawn) ?? drawn, refinements: REFINEMENTS[slug] ?? [] };
});

export function castMember(slug: string): CastMember | undefined {
  return CAST.find((m) => m.slug === slug || m.studio.id === slug);
}
