"use client";

import * as React from "react";

import { APP_ICON, K_SPARKLES, LogoMark } from "./wisp-logo";

/**
 * Wordmark candidates for “sparkles”, set beside the chosen app icon (Glow · Light). A fresh round,
 * after Fraunces, Fredoka, Nunito, Baloo 2, Lexend and Quicksand (`docs/logo/wordmarks.png`).
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
  note: string;
};

export const WORDMARKS: Wordmark[] = [
  {
    id: "mplus",
    family: "M PLUS Rounded 1c",
    weight: 800,
    css: "M+PLUS+Rounded+1c:wght@800",
    note: "Fully rounded terminals, like the antennae's caps, at a weight close to the stalks. Sturdy and warm without being bubbly; the closest match to the mark.",
  },
  {
    id: "varela",
    family: "Varela Round",
    weight: 400,
    css: "Varela+Round",
    tracking: 0.01,
    note: "Geometric and fully rounded, one weight. Calm and clear; lighter than the mark, so the icon leads and the name follows.",
  },
  {
    id: "comfortaa",
    family: "Comfortaa",
    weight: 700,
    css: "Comfortaa:wght@700",
    tracking: 0.01,
    note: "Built from circles, as the drop is: the most geometric match. Airy; its round 'a' and 'e' echo the eyes. Thin at 16px.",
  },
  {
    id: "sniglet",
    family: "Sniglet",
    weight: 800,
    css: "Sniglet:wght@800",
    note: "Plump and soft, a cousin of the drop. The most playful here; check it does not read as a toddler's toy for teachers and parents.",
  },
  {
    id: "rubik",
    family: "Rubik",
    weight: 600,
    css: "Rubik:wght@600",
    note: "Slightly rounded corners on a sturdy sans: friendly, grown-up, and holds at every size. Less round than the mark, so it reads as the product beside the character.",
  },
  {
    id: "figtree",
    family: "Figtree",
    weight: 800,
    css: "Figtree:wght@800",
    tracking: -0.01,
    note: "Clean geometric with open, round bowls; crisp at small sizes. The most neutral fit — modern, and lets the yellow drop carry the warmth.",
  },
  {
    id: "atkinson",
    family: "Atkinson Hyperlegible Next",
    weight: 700,
    css: "Atkinson+Hyperlegible+Next:wght@700",
    note: "Drawn for low-vision readers, and a cousin of the studio's own body face. The most accessible name; the least round, so it pairs by clarity rather than by shape.",
  },
  {
    id: "gabarito",
    family: "Gabarito",
    weight: 700,
    css: "Gabarito:wght@700",
    tracking: -0.01,
    note: "Geometric with soft, round counters and a little bounce. Friendly and modern; a good middle between Figtree's clarity and M PLUS's roundness.",
  },
];

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
          <span style={{ ...font, fontSize: 14, color: K.ink }}>Sparkles</span>
        </div>
      </div>
      <figcaption className="text-sm">
        <span className="material-heading text-foreground">
          {w.family} {w.weight}
        </span>
        <span className="material mt-1 block text-muted-foreground">{w.note}</span>
      </figcaption>
    </figure>
  );
}

export function WordmarkSheet() {
  useWordmarkFonts();
  return (
    <div className="mt-3 grid gap-4 sm:max-w-[64rem] sm:grid-cols-2">
      {WORDMARKS.map((w) => (
        <Lockup key={w.id} w={w} />
      ))}
    </div>
  );
}
