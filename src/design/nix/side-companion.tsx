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

export type CastMember = Omit<CastSpec, "slug"> & { slug: CastSlug; figure: Candidate };

const STUDIO = [...SCIENTISTS, ...WOMEN, ...ELDERS, ...TEACHERS, ...SHORTLISTED];
const REFINED: Partial<Record<CastSlug, (c: Candidate) => Candidate>> = { noor: refineNoor };

export const CAST: readonly CastMember[] = CAST_SPECS.map((s) => {
  const base = STUDIO.find((x) => x.id === s.studio.id);
  if (!base) throw new Error(`cast: no studio drawing ${s.studio.id}`);
  const slug = s.slug as CastSlug;
  const drawn = { ...base, label: s.name };
  return { ...s, slug, figure: REFINED[slug]?.(drawn) ?? drawn };
});

export function castMember(slug: string): CastMember | undefined {
  return CAST.find((m) => m.slug === slug || m.studio.id === slug);
}
