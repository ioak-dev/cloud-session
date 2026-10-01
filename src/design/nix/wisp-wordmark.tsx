"use client";

import * as React from "react";

import { APP_ICON, K_SPARKLES, LogoMark } from "./wisp-logo";

/**
 * Wordmark candidates for “sparkles”, set beside the chosen app icon (Glow · Light). The top three
 * of round two (M PLUS Rounded 1c, Gabarito, Figtree) are kept; the rest are round three, fresh.
 * Not repeated: round one (Fraunces, Fredoka, Nunito, Baloo 2, Lexend, Quicksand,
 * `docs/logo/wordmarks.png`) and the five dropped from round two (Varela Round, Comfortaa,
 * Sniglet, Rubik, Atkinson Hyperlegible Next).
 *
 * What makes a face fit the mark: the icon is built from round things — a drop, two round
 * antenna tips on round-capped stalks, oval eyes, a curved smile — drawn solid, with no hairlines.
 * So a fit has round bowls (s, p, a, e), soft or round terminals that echo the antennae's caps,
 * a stroke weight near the stalks', and an open, even rhythm that stays legible for a child and at
 * small sizes. Every one is on Google Fonts under the OFL, set in lowercase as the name.
 */
export type Wordmark = {
  id: string;
  family: string;
  weight: number;
  /** The `family` parameter for the Google Fonts CSS API. */
  css: string;
  /** Tracking, in em: round faces set tight look heavy; the airy ones need none. */
  tracking?: number;
  /** One of the top three, kept from round two. */
  kept?: boolean;
  note: string;
};

export const WORDMARKS: Wordmark[] = [
  /* kept from round two: the top three */
  {
    id: "mplus",
    family: "M PLUS Rounded 1c",
    weight: 800,
    css: "M+PLUS+Rounded+1c:wght@800",
    kept: true,
    note: "Fully rounded terminals, like the antennae's caps, at a weight close to the stalks. Sturdy and warm without being bubbly; the closest match to the mark.",
  },
  {
    id: "gabarito",
    family: "Gabarito",
    weight: 700,
    css: "Gabarito:wght@700",
    tracking: -0.01,
    kept: true,
    note: "Geometric with soft, round counters and a little bounce. Friendly and modern; a good middle between Figtree's clarity and M PLUS's roundness.",
  },
  {
    id: "figtree",
    family: "Figtree",
    weight: 800,
    css: "Figtree:wght@800",
    tracking: -0.01,
    kept: true,
    note: "Clean geometric with open, round bowls; crisp at small sizes. The most neutral fit — modern, and lets the yellow drop carry the warmth.",
  },
  /* round three: fresh */
  {
    id: "zenmaru",
    family: "Zen Maru Gothic",
    weight: 700,
    css: "Zen+Maru+Gothic:wght@700",
    tracking: 0.01,
    note: "A Japanese 'maru' (round) gothic: every stroke end rounded, like M PLUS but calmer and a touch lighter. Quiet and kind; the softest of the sturdy faces.",
  },
  {
    id: "andika",
    family: "Andika",
    weight: 700,
    css: "Andika:wght@700",
    note: "Designed by SIL for beginning readers: letters that cannot be mistaken for each other, open and plain. The one drawn for the learner; less round than the mark, so it pairs by purpose.",
  },
  {
    id: "urbanist",
    family: "Urbanist",
    weight: 800,
    css: "Urbanist:wght@800",
    tracking: -0.005,
    note: "Geometric, built on circles, with a low, wide stance: the drop's roundness in a modern product face. Clean at 16px.",
  },
  {
    id: "jakarta",
    family: "Plus Jakarta Sans",
    weight: 800,
    css: "Plus+Jakarta+Sans:wght@800",
    tracking: -0.015,
    note: "Friendly modern sans with round bowls and a slightly bouncy rhythm; confident for parents and teachers, warm enough beside Wisp.",
  },
  {
    id: "bricolage",
    family: "Bricolage Grotesque",
    weight: 700,
    css: "Bricolage+Grotesque:wght@700",
    tracking: -0.01,
    note: "The most character here: ink-trap quirks and a hand-made warmth. Distinctive as a name, less round than the mark; check it stays calm at small sizes.",
  },
];

/**
 * The wordmark: Gabarito 700, set as lowercase “sparkles” with -0.01em tracking, in the primary
 * on light grounds and white on dark or on the primary. The other faces are on the References page.
 */
export const WORDMARK: Wordmark = WORDMARKS.find((w) => w.id === "gabarito")!;
/** The faces it was chosen from. */
export const WORDMARKS_REFERENCE: Wordmark[] = WORDMARKS.filter((w) => w !== WORDMARK);

const HREF = `https://fonts.googleapis.com/css2?${WORDMARKS.map((w) => `family=${w.css}`).join("&")}&display=swap`;

/** Loads the candidates' faces once, only where the sheet is shown. */
function useWordmarkFonts() {
  React.useEffect(() => {
    if (document.querySelector(`link[data-wordmarks]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = HREF;
    link.dataset.wordmarks = "true";
    document.head.appendChild(link);
  }, []);
}

const K = K_SPARKLES;

/** The name in one face: the icon and the name, on white, on dark, and reversed on the primary. */
function Lockup({ w }: { w: Wordmark }) {
  const font: React.CSSProperties = {
    fontFamily: `"${w.family}", system-ui, sans-serif`,
    fontWeight: w.weight,
    letterSpacing: w.tracking ? `${w.tracking}em` : undefined,
    lineHeight: 1,
  };
  return (
    <figure className="m-0 flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
      <div className="flex items-center gap-3 rounded-md bg-white p-3">
        <LogoMark logo={APP_ICON} k={K} px={64} />
        <span style={{ ...font, fontSize: 52, color: K.primary }}>sparkles</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-md p-2" style={{ background: "#15171c" }}>
          <LogoMark logo={APP_ICON} k={K} px={32} />
          <span style={{ ...font, fontSize: 26, color: "#ffffff" }}>sparkles</span>
        </div>
        <div className="flex items-center gap-2 rounded-md p-2" style={{ background: K.primary }}>
          <span style={{ ...font, fontSize: 26, color: "#ffffff" }}>sparkles</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-white p-2">
          <LogoMark logo={APP_ICON} k={K} px={16} />
          <span style={{ ...font, fontSize: 14, color: K.ink }}>sparkles</span>
        </div>
      </div>
      <figcaption className="text-sm">
        <span className="material-heading text-foreground">
          {w.family} {w.weight}
          {w === WORDMARK ? " · chosen" : w.kept ? " · top three" : ""}
        </span>
        <span className="material mt-1 block text-muted-foreground">{w.note}</span>
      </figcaption>
    </figure>
  );
}

export function WordmarkSheet({ list = WORDMARKS }: { list?: Wordmark[] }) {
  useWordmarkFonts();
  return (
    <div className="mt-3 grid gap-4 sm:max-w-[64rem] sm:grid-cols-2">
      {list.map((w) => (
        <Lockup key={w.id} w={w} />
      ))}
    </div>
  );
}
