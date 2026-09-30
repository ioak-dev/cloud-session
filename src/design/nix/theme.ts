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
  /** A mid-tone of the primary: a body that is clearly coloured on either ground. */
  mid: "var(--char-mid)",
  /** Near-white tint: wings, highlights on a pale body. */
  tint: "var(--char-tint)",
  /** Highlight strokes on the body. */
  hi: "var(--char-hi)",
  /** Clothes and small trims. */
  accent: "var(--char-accent)",
  accentDeep: "var(--char-accent-deep)",
  /** Clothes: set for every character at once by the header (`CLOTHES`). */
  clothes: "var(--char-clothes)",
  /** Outlines where one is needed: a translucent dark, read as a deeper shade of what it is on. */
  line: "var(--char-line)",
  /** Thin parts drawn as a line (antennae): the body colour on light, lighter on dark. */
  thin: "var(--char-thin)",
  /** The edge of the glow: its own deeper amber, never a black line. */
  glowEdge: "var(--char-glow-edge)",
} as const;

export type Scheme = { id: string; label: string; primary: string; accent: string };

/** `sparkles` is the product's scheme; the rest are for trying the cast against others. */
export const SCHEMES: Scheme[] = [
  /* The product's light-mode primary and accent, fixed: a character keeps its colour on both
     grounds rather than following the lighter dark-mode primary. */
  {
    id: "sparkles",
    label: "Sparkles",
    primary: "oklch(0.520 0.195 260)",
    accent: "oklch(0.830 0.150 88)",
  },
  { id: "indigo", label: "Indigo · coral", primary: "#5b5fc7", accent: "#ff8f7a" },
  { id: "sea", label: "Sea · tangerine", primary: "#2f8fb0", accent: "#ff9a4d" },
  { id: "plum", label: "Plum · pink", primary: "#7a4fa3", accent: "#f06a9a" },
];

export type Clothes = { id: string; label: string; value: string };

/** What clothes are drawn in, for every character at once. */
export const CLOTHES: Clothes[] = [
  { id: "accent", label: "Accent", value: "var(--char-accent)" },
  { id: "deep", label: "Deep primary", value: "var(--char-deep)" },
  { id: "stone", label: "Stone", value: "#d9d1c3" },
  { id: "charcoal", label: "Charcoal", value: "#46434f" },
];
