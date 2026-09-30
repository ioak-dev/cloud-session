import type { ReactNode } from "react";

import { Star } from "./outfit";
import { WHITE, type Palette } from "./palette";

/**
 * Props a candidate can wear or carry, each drawn only when switched on. Head props sit in front of
 * the hair; the backpack sits behind the torso with its straps in front; the book is the read pose's.
 */
export type PropId = "glasses" | "headphones" | "beanie" | "partyHat" | "flower" | "backpack";

export const PROPS: { id: PropId; title: string; use: string }[] = [
  { id: "glasses", title: "Glasses", use: "Reviewing, reading closely" },
  { id: "headphones", title: "Headphones", use: "Long waits, focus" },
  { id: "beanie", title: "Beanie", use: "Winter — the winter outfit brings it" },
  {
    id: "partyHat",
    title: "Party hat",
    use: "Unlock, session complete — the party outfit brings it",
  },
  { id: "flower", title: "Flower", use: "Spring, a welcome" },
  { id: "backpack", title: "Backpack", use: "Onboarding, a journey starting" },
];

export function HeadProps({
  on,
  pal,
  eyeY,
  eyeGap,
}: {
  on: Set<PropId>;
  pal: Palette;
  eyeY: number;
  eyeGap: number;
}): ReactNode {
  const ink = pal.line ?? pal.line ?? pal.ink;
  return (
    <g>
      {on.has("glasses") && (
        <g stroke={ink} strokeWidth={2.4} fill={WHITE} fillOpacity={0.18}>
          <circle cx={100 - eyeGap} cy={eyeY} r={11.5} />
          <circle cx={100 + eyeGap} cy={eyeY} r={11.5} />
          <path
            d={`M${100 - eyeGap + 11.5} ${eyeY - 1} Q100 ${eyeY - 5} ${100 + eyeGap - 11.5} ${eyeY - 1}`}
            fill="none"
          />
        </g>
      )}
      {on.has("headphones") && (
        <g>
          <path
            d="M54 104 C46 40 154 40 146 104"
            stroke={ink}
            strokeWidth={8.5}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M54 104 C46 40 154 40 146 104"
            stroke="#4a4861"
            strokeWidth={5.5}
            fill="none"
            strokeLinecap="round"
          />
          <rect
            x={44}
            y={92}
            width={15}
            height={26}
            rx={7}
            fill={pal.accent}
            stroke={ink}
            strokeWidth={2.2}
          />
          <rect
            x={141}
            y={92}
            width={15}
            height={26}
            rx={7}
            fill={pal.accent}
            stroke={ink}
            strokeWidth={2.2}
          />
        </g>
      )}
      {on.has("beanie") && (
        <g>
          <path
            d="M54 84 C50 44 76 32 100 32 C124 32 150 44 146 84 Z"
            fill={pal.topAlt}
            stroke={ink}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <rect
            x={51}
            y={74}
            width={98}
            height={14}
            rx={7}
            fill={pal.accent}
            stroke={ink}
            strokeWidth={2.4}
          />
          <path
            d="M66 48 L68 72 M84 38 L85 72 M100 35 L100 72 M116 38 L115 72 M134 48 L132 72"
            stroke={ink}
            strokeOpacity={0.2}
            strokeWidth={2}
          />
          <circle cx={100} cy={28} r={9} fill={WHITE} stroke={ink} strokeWidth={2.2} />
        </g>
      )}
      {on.has("partyHat") && (
        <g transform="rotate(14 112 50)">
          <path
            d="M94 56 L112 8 L130 56 Q112 62 94 56 Z"
            fill={pal.glow}
            stroke={ink}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <path d="M100 40 L124 40 M106 26 L118 26" stroke={pal.accent} strokeWidth={4} />
          <circle cx={112} cy={8} r={5.5} fill={pal.accent} stroke={ink} strokeWidth={2} />
        </g>
      )}
      {on.has("flower") && (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={134}
              cy={60}
              rx={4.4}
              ry={7}
              fill={WHITE}
              stroke={ink}
              strokeWidth={1.6}
              transform={`rotate(${a} 134 66)`}
            />
          ))}
          <circle cx={134} cy={66} r={4} fill={pal.glow} stroke={ink} strokeWidth={1.6} />
        </g>
      )}
    </g>
  );
}

export function Backpack({ pal, part }: { pal: Palette; part: "back" | "straps" }) {
  if (part === "back")
    return (
      <g>
        <rect
          x={72}
          y={150}
          width={56}
          height={60}
          rx={14}
          fill={pal.accent}
          stroke={pal.line ?? pal.ink}
          strokeWidth={2.5}
        />
        <rect
          x={80}
          y={188}
          width={40}
          height={18}
          rx={7}
          fill={pal.accent}
          stroke={pal.line ?? pal.ink}
          strokeWidth={2}
        />
      </g>
    );
  return (
    <g stroke={pal.line ?? pal.ink} strokeWidth={2} fill={pal.accent}>
      <path d="M84 151 L88 151 L92 200 L87 200 Z" strokeLinejoin="round" />
      <path d="M116 151 L112 151 L108 200 L113 200 Z" strokeLinejoin="round" />
    </g>
  );
}

export function Book({ pal }: { pal: Palette }) {
  return (
    <g>
      <path
        d="M78 178 L100 184 L122 178 L122 204 L100 210 L78 204 Z"
        fill={pal.accent}
        stroke={pal.line ?? pal.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d="M81 176 L100 182 L100 206 L81 200 Z M119 176 L100 182 L100 206 L119 200 Z"
        fill={WHITE}
        stroke={pal.line ?? pal.ink}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path
        d="M85 184 L96 187 M85 190 L96 193 M104 187 L115 184 M104 193 L115 190"
        stroke={pal.line ?? pal.ink}
        strokeOpacity={0.3}
        strokeWidth={1.4}
      />
      <Star x={112} y={196} r={3} fill={pal.glow} />
    </g>
  );
}
