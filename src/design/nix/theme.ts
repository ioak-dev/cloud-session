/**
 * Character colours come from the product's scheme, not from the character. Every firefly draws
 * with these tokens; the studio header sets `--char-primary` and `--char-accent` on the root, and
 * `studio.css` derives the rest. In Sparkles they would be the product's primary and accent.
 *
 * The glow is not here: it is the firefly's ability and stays the same yellow in every scheme.
 */
export const C = {
  /** The body. */
  primary: "var(--char-primary)",
  /** Limbs, wing cases, outlines of dark parts. */
  deep: "var(--char-deep)",
  /** A lighter body, for a character that should read pale (Wisp). */
  soft: "var(--char-soft)",
  /** Near-white tint: wings, highlights on a pale body. */
  tint: "var(--char-tint)",
  /** Highlight strokes on the body. */
  hi: "var(--char-hi)",
  /** Clothes and small trims. */
  accent: "var(--char-accent)",
  accentDeep: "var(--char-accent-deep)",
} as const;

export type Scheme = { id: string; label: string; primary: string; accent: string };

/** `sparkles` uses the product's own tokens; the rest are for trying the cast against others. */
export const SCHEMES: Scheme[] = [
  { id: "sparkles", label: "Sparkles", primary: "var(--primary)", accent: "var(--accent)" },
  { id: "indigo", label: "Indigo · coral", primary: "#5b5fc7", accent: "#ff8f7a" },
  { id: "sea", label: "Sea · tangerine", primary: "#2f8fb0", accent: "#ff9a4d" },
  { id: "plum", label: "Plum · pink", primary: "#7a4fa3", accent: "#f06a9a" },
];
