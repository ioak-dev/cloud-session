import type { Candidate, Ctx } from "./candidates";
import { Flame, HAIR, WISP, WISP_MAIN } from "./firefly-wisp";
import { CURL, variant, WARMER_PARTS, WISP_EYES, WISP_WARM, withStalks } from "./wisp-warm";
import { pivot, type Body } from "./rig/skeleton";
import { C } from "./theme";

/**
 * Wisp · Ribbon — a proposal, not adopted. `WISP_MAIN` is untouched.
 *
 * The first Wisp (the bench's `firefly-bodies.tsx`, commit 1cc3b0d) did not have insect wings.
 * It had one pair of ribbons that left the shoulders, swelled out and then trailed down past the
 * body to a point, like a scarf in a draught or the hem of a ghost's sheet. That shape went with
 * the drop head and the flame: every outline on the figure tapered to a wisp. "Finalise Wisp"
 * (43969ae) swapped them for two pairs of spotted, rounded wings, which read as a butterfly or a
 * fairy.
 *
 * Here everything else is today's Wisp — head, antennae, face, body, arms, flame, sparks — and
 * only the wings go back to the ribbons, redrawn to today's rules: the scheme's `C.tint`, frosted
 * as the current wings are, a hairline edge in `C.hi`, no ink outline, one fold line as fixed
 * anatomy. A ribbon is one pair, so it rides `wingL`/`wingR` alone; `hindL`/`hindR` carry nothing.
 *
 * The studio's ribbon page shows this line as the main character: the turn puppet, back view,
 * flight and form draw ribbons there too (`WingStyleContext` in `wisp-turn.tsx`).
 */

const sides = [
  ["L", -1],
  ["R", 1],
] as const;

/** The original ribbon wings, on whichever frame they are hung from. */
export function RibbonWings({ frame = WISP }: { frame?: Body }) {
  return (
    <>
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, frame.j)}>
          {/* a ribbon that trails like a scarf: out from the shoulder, then down to a point */}
          <path
            d={`M${100 + 10 * s} 156 C${100 + 40 * s} 136 ${100 + 66 * s} 146 ${100 + 62 * s} 172 C${100 + 60 * s} 192 ${100 + 44 * s} 204 ${100 + 44 * s} 228 C${100 + 34 * s} 206 ${100 + 32 * s} 180 ${100 + 10 * s} 166 Z`}
            fill={C.tint}
            fillOpacity={0.82}
            stroke={C.hi}
            strokeWidth={HAIR}
            strokeLinejoin="round"
          />
          {/* the fold the ribbon turns on */}
          <path
            d={`M${100 + 16 * s} 160 C${100 + 40 * s} 150 ${100 + 56 * s} 160 ${100 + 50 * s} 186`}
            stroke={C.hi}
            strokeWidth={HAIR}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
    </>
  );
}

/** Any Wisp with its wings swapped for the ribbons, and nothing else changed. */
export function withRibbon(c: Candidate, more: Partial<Candidate> = {}): Candidate {
  return {
    ...c,
    id: `${c.id}-ribbon`,
    label: `${c.label} · Ribbon`,
    behind: (x: Ctx) => (
      <g>
        <RibbonWings frame={c.frame} />
        <Flame {...x} />
      </g>
    ),
    ...more,
  };
}

const WARMER = WISP_WARM.find((x) => x.id === "wisp-warmer")!;

/**
 * The warmer, slimmed back to Wisp's line so the ribbons carry it: no ruff, Wisp's own drop (with
 * the curl) rather than the rounder one, and Wisp's narrow body, neck and arms rather than Snug's.
 * It keeps the warmer's character: the flame in its chest and the warmth in its face, the curl, the
 * stalks with the flopped antenna, the honey eyes and talking brows, the lopsided smile, the
 * tipped head and the hey, and its alive idle.
 */
const WARMER_SLIM = variant({
  ...WARMER_PARTS,
  id: "wisp-warmer-slim",
  label: "Wisp · warmer, slim",
  frame: withStalks(WISP, "wisp-warmer-slim", "26 0 148 152"),
  head: CURL,
  ruff: false,
  signature: "A flame for a heart, a curl, a flopped antenna, honey eyes — on Wisp's own slim line",
  pitch: "",
  risk: "",
});

/** The recommended pairings: today's Wisp, Wisp, warmer, and the warmer without its ruff, each on the ribbons. */
export const WISP_RIBBON: Candidate[] = [
  withRibbon(WISP_MAIN, {
    id: "wisp-ribbon",
    label: "Wisp · Ribbon",
    signature: "Today's Wisp with its first wings: ribbons that trail like a ghost's hem",
    pitch:
      "Wisp exactly as it is, with one change: the two pairs of spotted wings go back to the single pair of ribbon wings it started with. They leave the shoulders, swell out, then trail down beside the flame to a point, so the whole figure tapers — drop head, ribbons, flame — and it reads as a little spirit rather than a bug with butterfly wings.",
    risk: "One pair, not two: the flight loses the two-pair beat, and the ribbons must still read as wings (they flap) and not as a cape or arms. Check at 32px that the ribbon tips and the flame do not merge into one skirt.",
  }),
  withRibbon(WARMER, {
    label: "Warmer · Ribbon",
    signature: "Wisp, warmer, with the ribbon wings",
    pitch:
      "The warmer proposal (curl, flopped antenna, honey eyes, ruff, a flame for a heart) on the ribbon wings, to see whether the ghostly line survives the rounder, softer body.",
    risk: "The ruff and the rounder body already soften the silhouette; the ribbons may have to carry all of the wispiness on their own.",
  }),
  withRibbon(WARMER_SLIM, {
    label: "Warmer · Ribbon, no ruff",
    pitch:
      "The warmer's character on Wisp's line. The ruff, the rounder drop and Snug's fuller body and chunky arms are gone, so the neck shows again and the figure tapers from the curl's tip through the ribbons to the flame, as the first Wisp did. Everything that gave the warmer a temperament stays: the small flame in its chest and the warmth it throws on the face, the curl, the stalks with one antenna flopped, honey eyes and talking brows, the lopsided smile, the tipped head and the little hey, and its alive idle. Temperament: warm-hearted, curious and a bit cheeky.",
    risk: "Without the ruff and the softer body it is less huggable than the warmer; the face and the chest flame now carry all of the warmth. The thin neck and arms are Wisp's, so check the arms still read at 32px against the ribbons.",
  }),
];

/** The warmer proposals on the ribbons; the combined warmer is the second pairing above. */
export const WISP_WARM_RIBBON: Candidate[] = WISP_WARM.map((c) =>
  c.id === WARMER.id ? WISP_RIBBON[1] : withRibbon(c),
);

/** The warmer's eye styles on the ribbons. */
export const WISP_EYES_RIBBON: Candidate[] = WISP_EYES.map((c) => withRibbon(c));
