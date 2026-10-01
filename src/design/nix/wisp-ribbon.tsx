import type { Candidate, Ctx } from "./candidates";
import { Flame, HAIR, pal as WISP_PAL, WISP, WISP_MAIN } from "./firefly-wisp";
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

const GLOW = WISP_PAL.glow;

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

/* ——— ribbon finishes: no outline, and the ribbon moving toward a spirit ——— */

/**
 * - `dots`: no edge; the ribbon is shaded instead, its colour at the shoulder fading to frost and
 *   back to the soft shade at the point, so it still separates from a pale ground. A few dots in `C.hi`, fixed like the
 *   current wings' spots.
 * - `sparkles`: the same, with four small four-point stars in the glow's colour: fixed anatomy, the
 *   firefly's light caught in its wings, never animated, never a highlight.
 * - `spirit`: the ribbon dissolves. It runs longer, its tail curls out like smoke, a thinner strand
 *   trails beside it, and it fades from its colour at the shoulder to nothing at the tips; a few
 *   motes inside fade with it.
 */
export type RibbonFinish = "dots" | "sparkles" | "spirit";

/** Dots and stars on the ribbon: outward offset, height, size. */
const RIBBON_DOTS = [
  [44, 160, 2.6],
  [55, 170, 1.8],
  [40, 182, 1.5],
  [49, 192, 2.1],
  [42, 212, 1.3],
] as const;
const RIBBON_STARS = [
  [46, 162, 4.4],
  [52, 186, 3],
  [40, 176, 1.8],
  [43, 210, 2.4],
] as const;
const SPIRIT_MOTES = [
  [46, 164, 2.2, 1],
  [55, 176, 1.4, 0.9],
  [44, 196, 1.6, 0.7],
  [50, 220, 1.2, 0.45],
  [30, 222, 1.1, 0.4],
] as const;

/**
 * The spirit's shape, so its variations can each change one thing:
 * - `tail`: `out`, curling out like smoke; `swept`, rising above the shoulder like a lifted shawl
 *   before it falls; `hem`, ending in a ghost's scalloped hem instead of one tail.
 * - `strands`: 1, the ribbon alone; 2, a thinner strand inside it.
 * - `motes`: fading dots in `C.hi`, or none.
 * - `glow`: the mist turns the glow's colour as it fades, as if its light leaks out of the ribbon.
 * - `bands`: two faint amber bands across each ribbon, the flame's lantern rings echoed.
 * - `breeze`: the right ribbon is caught in a breeze and blown out: an asymmetry, like the curl
 *   and the flopped antenna.
 */
export type SpiritForm = {
  tail: "out" | "swept" | "hem";
  strands: 1 | 2;
  motes: "dots" | "none";
  glow?: boolean;
  bands?: boolean;
  breeze?: boolean;
};
export const SPIRIT: SpiritForm = { tail: "out", strands: 2, motes: "dots" };
/** The spirit's simplest form: one ribbon each side, nothing inside. */
export const CLEAN: SpiritForm = { tail: "out", strands: 1, motes: "none" };

type Pt = readonly [number, number];
/** A closed curve through outward offsets and heights: a start point, then cubic triples. */
const curve = ([p0, ...rest]: readonly Pt[], X: (dx: number) => number) => {
  let d = `M${X(p0[0])} ${p0[1]}`;
  for (let i = 0; i < rest.length; i += 3) {
    d += ` C${rest
      .slice(i, i + 3)
      .map(([dx, y]) => `${X(dx)} ${y}`)
      .join(" ")}`;
  }
  return `${d} Z`;
};

const SPIRIT_TAIL: Record<SpiritForm["tail"] | "blown", readonly Pt[]> = {
  out: [
    [10, 156], [40, 136], [66, 146], [64, 172], [62, 194], [50, 208], [48, 226],
    [46, 240], [52, 250], [60, 254], [48, 258], [38, 248], [38, 232], [37, 210], [32, 182], [10, 166],
  ],
  swept: [
    [10, 156], [28, 122], [58, 112], [66, 138], [72, 162], [54, 200], [50, 224],
    [48, 240], [54, 250], [60, 254], [48, 258], [38, 248], [38, 232], [37, 210], [32, 182], [10, 166],
  ],
  hem: [
    [10, 156], [40, 136], [66, 146], [64, 172], [62, 196], [58, 220], [56, 238],
    [55, 248], [51, 253], [47, 245], [45, 253], [41, 254], [39, 245],
    [37, 252], [33, 251], [35, 236], [36, 212], [30, 184], [10, 166],
  ],
  /* the out tail with the breeze in it: carried out and up at the end */
  blown: [
    [10, 156], [40, 136], [68, 144], [72, 166], [76, 186], [74, 204], [80, 216],
    [84, 226], [90, 228], [94, 220], [92, 236], [78, 240], [66, 228], [56, 210], [36, 184], [10, 166],
  ],
};
const STRAND_INNER: readonly Pt[] = [
  [30, 182], [28, 204], [20, 222], [24, 240], [26, 248], [32, 250], [34, 247],
  [29, 243], [29, 230], [33, 216], [36, 204], [36, 192], [30, 182],
];
/** The lantern bands: across the ribbon where it narrows, as the flame's rings cross the flame. */
const BANDS = (X: (dx: number) => number) =>
  `M${X(30)} 192 Q${X(48)} 202 ${X(70)} 190 M${X(32)} 214 Q${X(44)} 222 ${X(60)} 210`;

const star = (x: number, y: number, r: number) => {
  const k = r * 0.28;
  return `M${x} ${y - r} Q${x + k} ${y - k} ${x + r} ${y} Q${x + k} ${y + k} ${x} ${y + r} Q${x - k} ${y + k} ${x - r} ${y} Q${x - k} ${y - k} ${x} ${y - r} Z`;
};

/** The ribbons in one of the finishes, on whichever frame they are hung from. */
export function FinishedRibbons({
  frame = WISP,
  uid,
  finish,
  form = SPIRIT,
}: {
  frame?: Body;
  uid: string;
  finish: RibbonFinish;
  /** The spirit's shape; ignored by the other finishes. */
  form?: SpiritForm;
}) {
  const spirit = finish === "spirit";
  /* the hem's scallops sit low, so its fade runs longer to keep them */
  const reach = spirit && form.tail === "hem" ? 300 : 256;
  return (
    <>
      {sides.map(([side, s]) => {
        const X = (dx: number) => 100 + dx * s;
        const g = `${uid}-ribbon-${finish}-${side}`;
        const tail = form.breeze && s === 1 ? "blown" : form.tail;
        const fade = spirit && form.glow ? GLOW : C.hi;
        return (
          <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, frame.j)}>
            <defs>
              {/* shaded from the shoulder down: the colour is the edge */}
              <linearGradient id={g} gradientUnits="userSpaceOnUse" x1={X(14)} y1={150} x2={X(44)} y2={spirit ? reach : 228}>
                <stop offset="0" stopColor={C.soft} stopOpacity={0.95} />
                <stop offset={spirit ? 0.35 : 0.45} stopColor={C.tint} stopOpacity={0.88} />
                {/* toward the tip it turns back to the product colour (or, glowing, to the glow),
                    so a fade still reads on a pale ground */}
                {spirit && <stop offset="0.72" stopColor={fade} stopOpacity={form.glow ? 0.7 : 0.5} />}
                <stop offset="1" stopColor={spirit ? fade : C.soft} stopOpacity={spirit ? 0 : 0.7} />
              </linearGradient>
            </defs>
            {spirit ? (
              <>
                {form.strands >= 2 && (
                  /* a thinner strand trailing inside the ribbon, fading sooner */
                  <path d={curve(STRAND_INNER, X)} fill={`url(#${g})`} />
                )}
                {/* the ribbon, longer, its tail curling like smoke */}
                <path d={curve(SPIRIT_TAIL[tail], X)} fill={`url(#${g})`} />
                {form.bands && (
                  <clipPath id={`${g}-clip`}>
                    <path d={curve(SPIRIT_TAIL[tail], X)} />
                  </clipPath>
                )}
                {form.bands && (
                  <path
                    clipPath={`url(#${g}-clip)`}
                    d={BANDS(X)}
                    stroke="var(--char-glow-edge)"
                    strokeWidth={1.8}
                    strokeOpacity={0.75}
                    fill="none"
                    strokeLinecap="round"
                  />
                )}
                {form.motes === "dots" &&
                  SPIRIT_MOTES.map(([dx, y, r, o]) => (
                    <circle key={`${dx}${y}`} cx={X(dx)} cy={y} r={r} fill={C.hi} opacity={o} />
                  ))}
              </>
            ) : (
              <>
                <path
                  d={`M${X(10)} 156 C${X(40)} 136 ${X(66)} 146 ${X(62)} 172 C${X(60)} 192 ${X(44)} 204 ${X(44)} 228 C${X(34)} 206 ${X(32)} 180 ${X(10)} 166 Z`}
                  fill={`url(#${g})`}
                />
                {finish === "dots"
                  ? RIBBON_DOTS.map(([dx, y, r]) => (
                      <circle key={`${dx}${y}`} cx={X(dx)} cy={y} r={r} fill={C.hi} />
                    ))
                  : RIBBON_STARS.map(([dx, y, r]) => (
                      <path key={`${dx}${y}`} d={star(X(dx), y, r)} fill={GLOW} />
                    ))}
              </>
            )}
          </g>
        );
      })}
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

const SLIM = WISP_RIBBON[2];

/** The recommended pairing in the ribbon finishes: no outline with dots or sparkles, and a spirit. */
export const WISP_RIBBON_FINISHES: Candidate[] = (
  [
    [
      "dots",
      "No outline · dots",
      "The ribbon without its edge: shaded from its colour at the shoulder through frost, with a few dots",
      "The hairline edge goes. To keep the ribbon apart from a pale ground without it, the ribbon is shaded: the product colour's soft shade where it leaves the shoulder, frost through the middle, and the soft shade again at the point, so its own colour is its edge — as the head's is. A few dots in a mid shade, fixed in place like the current wings' spots, give it a little pattern.",
      "Without an edge the tip fades toward the ground; check the light ground at 32px.",
    ],
    [
      "sparkles",
      "No outline · sparkles",
      "The same shaded ribbon with four small stars in the glow's colour",
      "As the dots, but the pattern is four small four-point stars in the firefly's own glow: its light caught in its wings, so the ribbons belong to the same creature as the flame and the sparks. Fixed anatomy, never animated.",
      "Stars can read as shine; they must stay fixed and few, and never twinkle, or they become highlights and compete with the spark trail.",
    ],
    [
      "spirit",
      "Spirit",
      "Ribbons that dissolve: longer, curling out like smoke, fading to nothing at the tips",
      "Further toward a spirit. The ribbons run longer and their tails curl out like smoke; a thinner strand trails inside each; they fade from the product colour at the shoulder, through frost, to a last blue wisp and then nothing at the tips, so Wisp seems to be made of light and mist from the shoulders down. A few motes in the ribbon fade with it. With the wispy hands and the flame, every edge of the figure below the head now dissolves.",
      "The most ghostly: check it stays a friendly spirit, never a spooky one, at the incorrect face; the faded tips vanish at small sizes, so the silhouette is shorter than it looks.",
    ],
  ] as const
).map(([finish, label, signature, pitch, risk]) => ({
  ...SLIM,
  id: `wisp-ribbon-${finish}`,
  label: `Ribbon, no ruff · ${label}`,
  signature,
  pitch,
  risk,
  behind: (x: Ctx) => (
    <g>
      <FinishedRibbons frame={SLIM.frame} uid={x.uid} finish={finish} />
      <Flame {...x} />
    </g>
  ),
}));

const SPIRIT_BASE = WISP_RIBBON_FINISHES.find((x) => x.id === "wisp-ribbon-spirit")!;

/**
 * Variations of the spirit. Clean is the spirit at its simplest; each of the others adds one
 * distinctive thing to Clean.
 */
export const WISP_SPIRITS: Candidate[] = (
  [
    [
      "clean",
      "Clean",
      CLEAN,
      "The ribbon alone: no inner strand, no motes",
      "The simplest spirit: one ribbon each side, fading to nothing, nothing inside it. The fade does all the work.",
    ],
    [
      "glow",
      "Glow tips",
      { ...CLEAN, glow: true },
      "The mist turns gold as it fades: its light leaking out through the ribbons",
      "Clean, but as the ribbons fade they turn from the product colour to the glow's gold, as if the firefly's light seeps out through its wings and is left in the air. The ribbons and the flame become one light: the only Wisp whose wings carry its ability.",
    ],
    [
      "bands",
      "Lantern bands",
      { ...CLEAN, bands: true },
      "Two faint amber bands across each ribbon, echoing the flame's rings",
      "Clean, with the lantern's rings carried up into the ribbons: two faint amber bands across each, where it narrows. Fixed anatomy, like the rings on the flame, so ribbon and flame read as one firefly's body.",
    ],
    [
      "hem",
      "Ghost hem",
      { ...CLEAN, tail: "hem" },
      "Each ribbon ends in a scalloped hem, like a ghost's sheet",
      "Clean, but each ribbon ends in the classic scalloped hem of a ghost's sheet rather than a single tail: the most immediately 'spirit' shape there is, kept small and soft so it reads friendly.",
    ],
    [
      "swept",
      "Swept up",
      { ...CLEAN, tail: "swept" },
      "The ribbons rise above the shoulders like a lifted shawl before they fall",
      "Clean, with the ribbons rising above the shoulders, nearly to the cheeks, before they fall and fade: a lifted shawl, or a spirit spreading itself. A new silhouette, taller at the shoulders than any Wisp.",
    ],
    [
      "breeze",
      "Breeze",
      { ...CLEAN, breeze: true },
      "One ribbon caught in a breeze and blown out",
      "Clean, but the right ribbon is caught in a breeze and blown out, its tail lifted: an asymmetry that belongs with the curl and the flopped antenna, so the whole figure leans one way. At rest it looks mid-drift.",
    ],
  ] as const
).map(([key, title, form, signature, pitch]) => ({
  ...SPIRIT_BASE,
  id: `wisp-spirit-${key}`,
  label: `Spirit · ${title}`,
  signature,
  pitch,
  behind: (x: Ctx) => (
    <g>
      <FinishedRibbons frame={SLIM.frame} uid={x.uid} finish="spirit" form={form} />
      <Flame {...x} />
    </g>
  ),
}));
