import type { Candidate, Ctx } from "./candidates";
import {
  arcUp,
  chevron,
  EYE_WHITE,
  line,
  TONGUE_PINK,
  type EyeKit,
  type MouthKit,
} from "./rig/eyes";
import { CHIBI, J, pivot, type Body } from "./rig/skeleton";
import { face, NO_NECK, pal, Puffs, sides } from "./side-candidates";
import { C } from "./theme";

/**
 * The chick: from Puff's body of soft round puffs, the animal itself — a ball of fluff just
 * hatched, still standing in the bottom of its eggshell. Its own eyes and beak, and an ability that
 * is what a chick naturally does.
 */

const CHICK: Body = {
  ...CHIBI,
  id: "chick",
  neck: NO_NECK,
  headVB: "36 50 128 128",
  w: { ...CHIBI.w, thigh: 5, shin: 5 },
};
const palChick = pal(C.accent, C.accent);
const SHELL = "#f6e7d6";
const SHELL_SHADE = "#e6cfb8";

/** The fluff: one soft ball, fluffier along the top, with a paler face and front. */
function ChickHead({ mood }: Ctx) {
  const droop = mood === "worried" || mood === "oops" ? 40 : mood === "delighted" ? -16 : 0;
  const fluff = Array.from({ length: 9 }, (_, i) => {
    const a = ((200 + i * 17.5) * Math.PI) / 180;
    return [100 + Math.cos(a) * 46, 126 + Math.sin(a) * 46, 10] as const;
  });
  return (
    <g>
      {/* the tuft: three soft feathers that stand up, and droop when it is worried */}
      <g transform={`rotate(${droop} 100 80)`}>
        <path d="M100 82 C94 68 86 64 80 68" {...line(C.primary, 6)} />
        <path d="M100 82 C100 64 106 56 113 57" {...line(C.primary, 6)} />
        <path d="M101 82 C106 70 114 68 121 72" {...line(C.primary, 5)} />
      </g>
      <Puffs at={fluff} fill={C.hi} />
      <circle cx={100} cy={126} r={50} fill={C.hi} />
      <ellipse cx={100} cy={140} rx={37} ry={30} fill={C.soft} />
    </g>
  );
}

/** The bottom of the eggshell it hatched from, with its wings resting on the rim. */
function ChickShell() {
  return (
    <g>
      <path
        d="M52 166 L61 156 L70 166 L79 156 L88 166 L97 156 L106 166 L115 156 L124 166 L133 156 L142 166 L148 160 C150 198 128 220 100 220 C72 220 50 198 52 166 Z"
        fill={SHELL}
      />
      <path d="M54 186 C60 208 80 220 100 220 C120 220 140 208 146 186 C136 206 118 212 100 212 C82 212 64 206 54 186 Z" fill={SHELL_SHADE} />
      {[
        [78, 190, 3],
        [118, 196, 2.6],
        [102, 182, 2.2],
        [130, 180, 1.8],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={C.hi} />
      ))}
      {sides.map(([side, s]) => (
        <g key={side} data-joint={`wing${side}`} style={pivot(`wing${side}`, { ...J, wingL: [62, 160], wingR: [138, 160] })}>
          <ellipse
            cx={100 + s * 40}
            cy={160}
            rx={12}
            ry={7}
            transform={`rotate(${s * -22} ${100 + s * 40} 160)`}
            fill={C.mid}
          />
        </g>
      ))}
    </g>
  );
}

/** Chick: big round black eyes with the shine set high, so they always look up at you. They pinch
 *  to “^”, squash flat, go wobbly when worried; the tuft does the rest. */
const chickEyes: EyeKit = ({ mood, s, x, y, look, pal: p }) => {
  const ink = p.ink;
  const [dx, dy] = look;
  const eye = (rx: number, ry: number, rot = 0, extra = false) => (
    <g transform={`rotate(${rot} ${x + dx} ${y + dy})`}>
      <ellipse cx={x + dx} cy={y + dy} rx={rx} ry={ry} fill={ink} />
      <circle cx={x + dx - rx * 0.28} cy={y + dy - ry * 0.42} r={Math.min(rx, ry) * 0.42} fill={EYE_WHITE} />
      <circle cx={x + dx + rx * 0.4} cy={y + dy - ry * 0.1} r={Math.min(rx, ry) * 0.18} fill={EYE_WHITE} />
      {extra && <circle cx={x + dx - rx * 0.1} cy={y + dy + ry * 0.45} r={Math.min(rx, ry) * 0.16} fill={EYE_WHITE} />}
    </g>
  );
  switch (mood) {
    case "happy":
      return <path d={`M${x - 6.5} ${y + 3} L${x} ${y - 4} L${x + 6.5} ${y + 3}`} {...line(ink, 3.6)} />;
    case "delighted":
      return eye(8.6, 9.4, 0, true);
    case "curious":
      return eye(7.6, 8.6);
    case "thinking":
      return eye(6.4, s === -1 ? 3.4 : 7.4);
    case "focused":
      return eye(7.6, 3.4);
    case "worried":
      return eye(6.2, 7.4, -s * 14, true);
    case "oops":
      return <path d={chevron(x, y, s, 5, 5)} {...line(ink, 3.4)} />;
    case "wink":
      return s === 1 ? <path d={arcUp(x, y, 6.5, 4.5)} {...line(ink, 3.6)} /> : eye(7.2, 8);
    default:
      return eye(7.2, 8);
  }
};

/** Chick: a round little beak in the accent, which opens wide to cheep. */
const chickMouth: MouthKit = ({ mood, y, pal: p }) => {
  const closed = (dx = 0, rot = 0) => (
    <path
      d={`M${93 + dx} ${y} Q${100 + dx} ${y - 7} ${107 + dx} ${y} Q${100 + dx} ${y + 7} ${93 + dx} ${y} Z`}
      fill={C.accent}
      transform={`rotate(${rot} ${100 + dx} ${y})`}
    />
  );
  const open = (gap: number, tongue = false) => (
    <g>
      <path d={`M93 ${y} L107 ${y} Q100 ${y + gap + 6} 93 ${y} Z`} fill={p.ink} />
      {tongue && <ellipse cx={100} cy={y + gap} rx={2.6} ry={1.8} fill={TONGUE_PINK} />}
      <path d={`M92 ${y} Q100 ${y - 7} 108 ${y} Z`} fill={C.accent} />
      <path d={`M95 ${y + gap} Q100 ${y + gap + 6} 105 ${y + gap} Z`} fill={C.accent} />
    </g>
  );
  switch (mood) {
    case "happy":
      return open(4);
    case "delighted":
      return open(7, true);
    case "curious":
      return open(2);
    case "thinking":
      return closed(3, -12);
    case "focused":
      return closed(0, 0);
    case "worried":
      return closed(0, 8);
    case "oops":
      return open(5, true);
    case "wink":
      return open(3);
    default:
      return closed();
  }
};

/* ——— The puff family ——— */

export const PUFF_FAMILY: Candidate[] = [
  {
    id: "side-chick",
    kind: "animal",
    frame: CHICK,
    arms: false,
    outline: false,
    label: "Chick",
    signature: "A ball of fluff with a feathery tuft, standing in the bottom of its eggshell — it ducks into its shell",
    pitch:
      "From Puff: one soft ball of fluff with a paler face and front, a tuft of three feathers, standing in the bottom half of the eggshell it hatched from on thin legs, its wings resting on the rim. Its ability is Shell: when it is shy it ducks down into its shell until only its eyes show, and pops out again. Big round eyes with the shine set high, a round beak that opens to cheep, and a tuft that droops when it is worried.",
    risk: "A chick is a baby; it must never make hatching or growing up a reward.",
    pal: palChick,
    body: C.hi,
    face: face({ eyeY: 122, eyeGap: 19, mouthY: 140, kit: chickEyes, mouthKit: chickMouth }),
    outfit: "bare",
    outfits: ["bare", "winter", "party"],
    head: (c) => <ChickHead {...c} />,
    top: () => <ChickShell />,
  },
];
