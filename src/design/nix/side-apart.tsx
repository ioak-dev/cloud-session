import type { ReactNode } from "react";

import type { Candidate } from "./candidates";
import { EYE_WHITE, line } from "./rig/eyes";
import type { OutfitParts } from "./rig/outfit";
import { blob, mix, Two } from "./side-kit";
import { SCIENTISTS, WOMEN } from "./side-more";
import { AdaBunBack, AdaBunHead, ELDERS } from "./side-people";
import { SHORTLISTED } from "./side-shortlist";
import { C } from "./theme";

/**
 * Told apart (proposals, 2026-10-28): the five shortlisted people who read alike on the Side page.
 * Grace, Ada and Sofia stood in the same cream dress with the same belt, hands clasped at the
 * chest; Haru and Otto wore the same lab coat, trousers and shoes; Grace, Ada and Otto had the same
 * white cloud of hair; Haru, Grace and Ada all wore glasses. Each proposal keeps the face, eyes,
 * mouth and ability of the drawing it comes from and changes only the body's cut, the hair and the
 * pose, so the line-up differs in silhouette. The drawings they come from stay as they are.
 *
 * Clothes are drawn in `C.clothes` and its own lighter and darker tones (so every clothes switch
 * keeps them apart), trims in `C.accent`; Otto keeps the lab coat, the one place a person leaves the
 * clothes colour.
 */

const CREAM = "#fff3de";
const LAB = "#f3f1ec";
const CLOTH_DEEP = mix(C.clothes, "#231c33", 62);
const CLOTH_LIGHT = mix(C.clothes, "#ffffff", 45);
const CLOTH_EDGE = mix(C.clothes, "#231c33", 80);
const TROUSERS = C.deep;

const by = (list: Candidate[], id: string) => {
  const c = list.find((x) => x.id === id);
  if (!c) throw new Error(`side-apart: no drawing ${id}`);
  return c;
};

/** A cloth shape on the torso, in torso space. */
const fill = (d: string, color: string) => <path d={d} fill={color} />;

/* ——— Haru: out of the lab coat, into a sweater vest ——— */

const HARU = by(SCIENTISTS, "more-haru");
const HARU_TORSO = HARU.frame!.torso;
/** His vest is in the primary's deep tone, his trousers in the clothes colour's dark tone, so his
 *  torso is not the clothes colour that Grace's dress and Ada's cardigan wear. */
const VEST = C.deep;
const VEST_LIGHT = mix(C.deep, "#ffffff", 70);

/** A knitted vest over a cream shirt, a collar's two points, pens clipped to the vest's edge. */
function haruWear(o: OutfitParts): OutfitParts {
  return {
    ...o,
    back: undefined,
    hem: undefined,
    collar: undefined,
    torso: (
      <g>
        {fill(HARU_TORSO, CREAM)}
        <path d="M84 150 L100 172 L116 150 Q124 156 124 172 L122 212 Q121 222 100 222 Q79 222 78 212 L76 172 Q76 156 84 150 Z" fill={VEST} />
        <path d="M80 212 Q100 218 120 212" {...line(VEST_LIGHT, 3)} />
        <path d="M84 152 L100 174 L116 152" {...line(VEST_LIGHT, 2.4)} />
        {[186, 198].map((y) => (
          <path key={y} d={`M82 ${y} q4 -3 8 0 q4 3 8 0 q4 -3 8 0 q4 3 8 0 q4 -3 8 0 q4 3 8 0`} {...line(VEST_LIGHT, 1.6)} opacity={0.7} />
        ))}
        <path d="M90 148 L96 158 L100 152 Z M110 148 L104 158 L100 152 Z" fill={CREAM} />
        <path d="M108 162 L108 176 M112 160 L112 174" {...line(C.primary, 2.2)} />
        <path d="M112 160 L112 166" {...line(C.accent, 2.2)} />
      </g>
    ),
    upper: { from: 0, to: 1, w: 15, color: CREAM },
    fore: { from: 0, to: 0.45, w: 15.5, color: CREAM, cap: "butt" },
    thigh: { from: 0, to: 1, w: 15, color: CLOTH_DEEP },
    shin: { from: 0, to: 0.9, w: 14, color: CLOTH_DEEP },
    shoe: TROUSERS,
  };
}

const HARU_APART: Candidate = {
  ...HARU,
  id: "apart-haru",
  label: "Haru · vest",
  signature: "Haru out of the lab coat: a knitted sweater vest over a cream shirt, sleeves rolled, pens clipped to the vest",
  pitch: HARU.pitch,
  risk: "The lab coat is Otto's alone now; Haru keeps his square glasses as his hook.",
  pal: { ...HARU.pal, top: VEST, topAlt: CREAM, bottom: CLOTH_DEEP, shoe: TROUSERS },
  body: CREAM,
  outfit: "blazer",
  pendant: undefined,
  wear: haruWear,
};

/* ——— Otto: the lab coat, longer, with a bow tie ——— */

const OTTO = by(SCIENTISTS, "more-otto");

/** His coat falls past his knees and flares; a bow tie in the accent; chalk on one cuff. */
function ottoWear(o: OutfitParts): OutfitParts {
  return {
    ...o,
    hem: (
      <g>
        <path d="M74 196 L126 196 L136 246 Q100 252 64 246 Z" fill={LAB} />
        <path d="M100 206 L100 248" {...line(mix(LAB, C.mid, 70), 2.2)} />
        <rect x={80} y={212} width={12} height={10} rx={1.6} fill={mix(LAB, C.mid, 82)} />
      </g>
    ),
    collar: (
      <g>
        <path d="M100 152 L88 145 L88 159 Z M100 152 L112 145 L112 159 Z" fill={C.accent} />
        <circle cx={100} cy={152} r={3.2} fill={C.accentDeep} />
      </g>
    ),
    fore: o.fore && { ...o.fore, trim: { color: mix(LAB, C.mid, 60), len: 0.12 } },
    thigh: null,
  };
}

const OTTO_APART: Candidate = {
  ...OTTO,
  id: "apart-otto",
  label: "Professor Otto · long coat",
  signature: "Otto in a long lab coat that flares past his knees, a bow tie in the accent and chalk on one cuff",
  risk: "Now the only lab coat on the shortlist; the long coat widens him at the hem, against his wide hair.",
  wear: ottoWear,
};

/* ——— Grace: a printed headwrap and a long wrap dress; no glasses ——— */

const GRACE = by(ELDERS, "people-grace");
const GRACE_SKIN = GRACE.pal.skin;
const GRACE_SHADE = GRACE.pal.skinShade;
const GRACE_TORSO = GRACE.frame!.torso;

/** A bold print: dots and rings in the clothes colour's own light and dark tones. */
function Print({ at, r = 3.4 }: { at: readonly (readonly [number, number])[]; r?: number }) {
  return (
    <g>
      {at.map(([x, y], i) =>
        i % 2 ? (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} {...line(CLOTH_LIGHT, 1.8)} />
        ) : (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r * 0.7} fill={CLOTH_DEEP} />
        ),
      )}
    </g>
  );
}

/** A tall headwrap, knotted into a fan at the top, gold hoops below it. */
function GraceWrapHead(): ReactNode {
  const crown = "M60 104 C54 76 66 50 98 42 C130 36 146 60 140 104 Q100 86 60 104 Z";
  return (
    <g>
      <Two d={blob(100, 114, 40, 38, 1.04)} fill={GRACE_SKIN} shade={GRACE_SHADE} k={2.2} />
      <path d={crown} fill={CLOTH_DEEP} transform="translate(2.4 2)" />
      <path d={crown} fill={C.clothes} />
      <path d="M64 94 Q100 78 136 94" {...line(CLOTH_EDGE, 3)} />
      <path d="M72 70 Q96 52 126 58 M66 84 Q98 64 134 74" {...line(CLOTH_EDGE, 1.8)} opacity={0.6} />
      {/* the knot's two fans, leaning to her left */}
      <path d="M104 46 C96 26 112 16 124 24 C130 30 122 42 108 48 Z" fill={C.clothes} />
      <path d="M110 48 C124 34 142 38 142 50 C140 58 124 56 112 52 Z" fill={C.clothes} />
      <path d="M108 46 Q114 34 122 28 M114 50 Q128 44 138 48" {...line(CLOTH_EDGE, 1.6)} />
      <circle cx={109} cy={49} r={5} fill={CLOTH_DEEP} />
      <Print at={[[80, 62], [96, 56], [124, 60], [76, 76], [96, 70], [116, 66], [132, 80], [88, 88], [110, 84]]} />
      <circle cx={58} cy={132} r={8} {...line(C.accent, 3)} />
      <circle cx={142} cy={132} r={8} {...line(C.accent, 3)} />
    </g>
  );
}

/** A wrap dress to the ankle in the same print, tied at the side with a sash. */
function graceWear(o: OutfitParts): OutfitParts {
  return {
    ...o,
    torso: (
      <g>
        {fill(GRACE_TORSO, C.clothes)}
        <path d="M84 150 L104 186 M116 150 L96 178" {...line(CLOTH_EDGE, 2.4)} />
        <path d="M88 150 L100 170 L112 150 Q100 146 88 150 Z" fill={GRACE_SKIN} />
        <Print at={[[84, 168], [116, 166], [92, 196], [110, 202], [82, 210], [118, 214]]} r={3} />
        <path d="M76 190 Q100 196 124 190 L124 198 Q100 204 76 198 Z" fill={CLOTH_DEEP} />
        <path d="M118 196 Q128 206 124 220 M120 196 Q132 200 134 212" {...line(CLOTH_DEEP, 3.4)} />
      </g>
    ),
    hem: (
      <g>
        <path d="M78 198 L122 198 L138 258 Q100 266 62 258 Z" fill={C.clothes} />
        <path d="M100 204 Q96 230 88 260" {...line(CLOTH_EDGE, 2)} opacity={0.5} />
        <Print at={[[84, 216], [106, 220], [120, 236], [92, 242], [74, 250], [114, 254], [100, 232]]} r={3.2} />
      </g>
    ),
    upper: { from: 0, to: 0.7, w: 18, color: C.clothes, cap: "butt" },
    fore: null,
    thigh: null,
    shin: null,
    shoe: C.accentDeep,
  };
}

const GRACE_APART: Candidate = {
  ...GRACE,
  id: "apart-grace",
  label: "Grace · headwrap",
  signature: "Grace in a tall printed headwrap knotted into a fan, gold hoops, a long wrap dress in the same print — no glasses",
  risk: "The headwrap is drawn neatly and in the scheme's clothes colour; it is hers, never a costume. Her glasses go so the hoops and the wrap carry her.",
  frame: { ...GRACE.frame!, headVB: "14 8 172 172" },
  top: undefined,
  head: () => <GraceWrapHead />,
  attitude: { mood: "happy", tilt: 8, hands: { L: [78, 202], R: [152, 150], outL: true, outR: true } },
  wear: graceWear,
};

/* ——— Ada: hair up in a bun, a cardigan with deep pockets, mid-laugh ——— */

const ADA = by(SHORTLISTED, "cand-ada");
const ADA_TORSO = ADA.frame!.torso;

/** A chunky cardigan, open over a cream blouse, with two deep pockets; a long skirt below. */
function adaWear(o: OutfitParts): OutfitParts {
  return {
    ...o,
    torso: (
      <g>
        {fill(ADA_TORSO, CREAM)}
        <path d="M80 150 Q90 148 94 152 L96 222 Q80 222 75 212 L72 178 Q71 158 80 150 Z" fill={C.clothes} />
        <path d="M120 150 Q110 148 106 152 L104 222 Q120 222 125 212 L128 178 Q129 158 120 150 Z" fill={C.clothes} />
        <path d="M94 152 L96 222 M106 152 L104 222" {...line(CLOTH_EDGE, 2.6)} />
        <path d="M74 214 Q85 220 96 218 M104 218 Q115 220 126 214" {...line(CLOTH_LIGHT, 3)} />
        {[168, 182, 196].map((y) => (
          <circle key={y} cx={93} cy={y} r={2.2} fill={C.accent} />
        ))}
        <rect x={76} y={194} width={14} height={14} rx={3} fill={CLOTH_DEEP} />
        <rect x={110} y={194} width={14} height={14} rx={3} fill={CLOTH_DEEP} />
        <path d="M112 196 Q117 190 122 196" {...line(EYE_WHITE, 2)} />
        <path d="M90 150 Q100 160 110 150" {...line(mix(CREAM, C.mid, 70), 2)} />
      </g>
    ),
    hem: (
      <g>
        <path d="M80 210 L120 210 L126 250 Q100 255 74 250 Z" fill={TROUSERS} />
        <path d="M76 244 Q100 250 124 244" {...line(C.accent, 2.4)} />
      </g>
    ),
    upper: { from: 0, to: 1, w: 17, color: C.clothes },
    fore: { from: 0, to: 0.8, w: 16, color: C.clothes, cap: "butt", trim: { color: CLOTH_LIGHT, len: 0.18 } },
    thigh: null,
    shin: null,
    shoe: CLOTH_DEEP,
  };
}

const ADA_APART: Candidate = {
  ...ADA,
  id: "apart-ada",
  label: "Ada · cardigan",
  signature: "Ada with her silver hair up in a lopsided bun (from Ada · Bun), half-moon spectacles kept on, a chunky cardigan with deep pockets, mid-laugh",
  risk: "She keeps her half-moon spectacles: of the three who wore glasses, only Haru and Ada still do, and their frames differ in shape.",
  frame: { ...ADA.frame!, headVB: "12 12 176 176" },
  headBack: () => <AdaBunBack />,
  head: () => <AdaBunHead />,
  attitude: { mood: "delighted", tilt: -8, hands: { L: [96, 206], R: [128, 158], outL: false, outR: true } },
  wear: adaWear,
};

/* ——— Sofia: a striped top and wide trousers, a scarf in her curls, mid-clap ——— */

const SOFIA = by(WOMEN, "more-sofia");
const SOFIA_TORSO = SOFIA.frame!.torso;

function sofiaWear(o: OutfitParts): OutfitParts {
  return {
    ...o,
    torso: (
      <g>
        {fill(SOFIA_TORSO, CREAM)}
        {[160, 172, 184, 196].map((y) => (
          <path key={y} d={`M74 ${y} L126 ${y}`} {...line(C.clothes, 6)} />
        ))}
        <path d="M88 150 Q100 158 112 150" {...line(mix(CREAM, C.mid, 70), 2)} />
        <path d="M76 204 L124 204 L124 222 Q100 226 76 222 Z" fill={TROUSERS} />
      </g>
    ),
    hem: undefined,
    upper: { from: 0, to: 1, w: 15, color: CREAM, trim: { color: C.clothes, len: 0.3 } },
    fore: { from: 0, to: 0.5, w: 14, color: CREAM, cap: "butt", trim: { color: C.clothes, len: 0.2 } },
    thigh: { from: 0, to: 1, w: 18, color: TROUSERS },
    shin: { from: 0, to: 0.86, w: 19, color: TROUSERS, cap: "butt" },
    shoe: C.accentDeep,
  };
}

const SOFIA_APART: Candidate = {
  ...SOFIA,
  id: "apart-sofia",
  label: "Sofia · stripes",
  signature: "Sofia in a striped top and wide trousers, a scarf tied in her red curls with the knot on top, hands up mid-clap",
  risk: "The only one of the five in trousers and the only stripes; the scarf's knot adds a bump to her cloud of curls.",
  head: (c) => (
    <g>
      {SOFIA.head(c)}
      <path d="M60 96 Q100 72 140 96" {...line(C.accent, 7)} />
      <path d="M118 78 C114 62 126 56 132 64 C134 70 128 76 120 80 Z M122 80 C134 70 146 74 144 82 C140 88 130 86 122 82 Z" fill={C.accent} />
      <circle cx={121} cy={80} r={3.6} fill={C.accentDeep} />
    </g>
  ),
  outfit: "hoodie",
  attitude: { mood: "delighted", tilt: -8, hands: { L: [112, 156], R: [124, 150], outL: false, outR: true } },
  wear: sofiaWear,
};

/** The five proposals, each beside the drawing it comes from, with what changed. */
export const APART: readonly { before: Candidate; after: Candidate; changes: readonly string[] }[] = [
  {
    before: GRACE,
    after: GRACE_APART,
    changes: ["A tall printed headwrap in place of the white curls", "No glasses: the hoops and the wrap carry her", "A long wrap dress in the same print, a sash at the side", "One hand on her hip, the other raised to the side: a dancer's flourish"],
  },
  {
    before: ADA,
    after: ADA_APART,
    changes: ["Hair up in a lopsided bun (from Ada · Bun)", "A chunky cardigan with deep pockets over a long skirt", "Mid-laugh, one hand raised"],
  },
  {
    before: SOFIA,
    after: SOFIA_APART,
    changes: ["A striped top and wide trousers in place of the cream dress", "A scarf tied in her curls", "Hands up to one side, mid-clap"],
  },
  {
    before: HARU,
    after: HARU_APART,
    changes: ["A knitted sweater vest over a cream shirt, sleeves rolled", "Pens clipped to the vest instead of a lab-coat pocket"],
  },
  {
    before: OTTO,
    after: OTTO_APART,
    changes: ["The only lab coat now, longer and flared past the knee", "A bow tie in the accent, chalk on one cuff"],
  },
];
