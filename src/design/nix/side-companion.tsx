/**
 * The seven side characters as drawn Sparkles-ready: each spec of `side-cast.ts` (product name,
 * temperament, ability, voice, fixed lines) with the studio's drawing, Noor with the product's layer
 * over her (`side-noor.tsx`). The studio's names and ids stay the drawings' own.
 */
import type { Candidate } from "./candidates";
import { CAST_SPECS, type CastLines, type CastSpec } from "./side-cast";
import { refineHaru } from "./side-haru";
import { refineMargot } from "./side-margot";
import { refineNell } from "./side-nell";
import { refineOtto } from "./side-otto";
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
  margot: [
    "A tall printed headwrap in the primary's mid tone, knotted into a fan, in place of the white curls; gold hoops kept, glasses gone",
    "A long wrap dress in the same print, a sash at the side",
    "A lighter, warmer skin tone",
    "Her own eyes: almond, under heavy lids with a wing, thin arched brows; happy is a knowing half-close",
    "Longer arms, so a dancer's arms read: hands on her hips at rest, a flourish beside her head",
  ],
  nell: [
    "Her own cloud of silver curls and half-moon spectacles kept",
    "A chunky cardigan in the deep accent with deep pockets, over a long skirt, in place of the cream dress",
    "Her own eyes: smiling crescents with laughter crinkles; happy is a deeper crescent",
    "Longer arms, so a cup reaches her lips: hands folded over her middle at rest",
    "A teacup she can hold (a new grip, `cup`), from her tea stall",
  ],
  otto: [
    "The only lab coat on the shortlist (Haru's went), longer and flared past the knee",
    "A bow tie in the accent, chalk on one cuff",
    "His own eyes: small dark beads with no whites, under big bushy white brows; happy squeezes them shut",
    "Longer arms, so a finger can go up beside his head: at rest one finger is up, a thought arriving",
    "A stick of chalk he can hold (a new grip, `chalk`); it only ever leaves dust",
  ],
  haru: [
    "Out of the lab coat (Otto's alone now): a knitted sweater vest in the deep primary over a cream shirt, sleeves rolled",
    "Pens clipped to the vest — the pen he clicks, taps and points with",
    "His own eyes: round and wide, filling his lenses, small irises, thick straight brows; happy is small neat curves, oops shrinks the pupils to dots",
  ],
  noor: [
    "A hijab with real fabric: an underscarf band, a wrap crossing under the chin, folds, a brooch and a drape",
    "A long-sleeved plum dress with gold cuffs and hem, a bow at the hip and a pencil in a pocket",
    "Longer arms and bigger hands, so a thumbs-up or a point reads at size",
    "A resting smile that lifts on one side, with a dimple",
  ],
};

const STUDIO = [...SCIENTISTS, ...WOMEN, ...ELDERS, ...TEACHERS, ...SHORTLISTED];
const REFINED: Partial<Record<CastSlug, (c: Candidate) => Candidate>> = { noor: refineNoor, haru: refineHaru, margot: refineMargot, nell: refineNell, otto: refineOtto };

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
