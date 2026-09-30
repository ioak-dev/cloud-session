import type { ReactNode } from "react";

import { pivot } from "./skeleton";
import type { Palette } from "./palette";

/**
 * Six hair styles on one head (face centred 100,98, rx 43 ry 40), each split into the part behind
 * the head and the part in front of the face. Any human candidate can wear any of them — the bench
 * tests that a candidate stays recognisable through a hair change, which is why no candidate's
 * signature is its hair.
 */
export type HairId = "puffs" | "pony" | "braids" | "bob" | "long" | "curls";

export const HAIRS: { id: HairId; title: string }[] = [
  { id: "puffs", title: "Puffs" },
  { id: "pony", title: "Ponytail" },
  { id: "braids", title: "Braids" },
  { id: "bob", title: "Bob" },
  { id: "long", title: "Long" },
  { id: "curls", title: "Curls" },
];

const CAP_BACK =
  "M52 104 C46 54 76 44 100 44 C124 44 154 54 148 104 C146 112 140 116 134 116 L66 116 C60 116 54 112 52 104 Z";

/** Circles drawn outline-first, then fill-over, so a cluster reads as one scalloped mass. */
function Cloud({
  circles,
  fill,
  ink,
}: {
  circles: [number, number, number][];
  fill: string;
  ink: string;
}) {
  return (
    <g>
      {circles.map(([x, y, r], i) => (
        <circle key={`o${i}`} cx={x} cy={y} r={r} fill={fill} stroke={ink} strokeWidth={2.5} />
      ))}
      {circles.map(([x, y, r], i) => (
        <circle key={`f${i}`} cx={x} cy={y} r={r - 1.25} fill={fill} />
      ))}
    </g>
  );
}

function curlRing(): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let a = 150; a <= 390; a += 20) {
    const t = (a * Math.PI) / 180;
    out.push([100 + 52 * Math.cos(t), 96 + 50 * Math.sin(t), 18]);
  }
  return out;
}

function braid(x: number, lean: number, pal: Palette): ReactNode {
  return [0, 1, 2, 3].map((i) => (
    <ellipse
      key={i}
      cx={x + lean * i}
      cy={116 + i * 13}
      rx={8.5 - i * 0.6}
      ry={8}
      fill={pal.hair}
      stroke={pal.ink}
      strokeWidth={2.2}
      transform={`rotate(${i % 2 ? 18 : -18} ${x + lean * i} ${116 + i * 13})`}
    />
  ));
}

export function Hair({ id, pal }: { id: HairId; pal: Palette }): {
  back: ReactNode;
  front: ReactNode;
} {
  const s = { fill: pal.hair, stroke: pal.ink, strokeWidth: 2.5, strokeLinejoin: "round" as const };
  const hi = { stroke: pal.hairHi, strokeWidth: 3, fill: "none", strokeLinecap: "round" as const };
  switch (id) {
    case "puffs":
      return {
        back: (
          <g>
            <Cloud
              circles={[
                [60, 52, 25],
                [140, 52, 25],
              ]}
              fill={pal.hair}
              ink={pal.ink}
            />
            <path d="M48 44 Q52 34 62 32" {...hi} />
            <path d="M128 32 Q140 32 148 42" {...hi} />
            <path d={CAP_BACK} {...s} />
          </g>
        ),
        front: (
          <g>
            <path
              d="M56 102 C50 60 74 48 100 48 C126 48 150 60 144 102 C140 86 132 76 122 72 C116 80 104 82 97 76 C91 82 80 84 70 80 C63 86 58 94 56 102 Z"
              {...s}
            />
            <path d="M84 58 Q96 53 110 56" {...hi} />
            <ellipse
              cx={74}
              cy={62}
              rx={6}
              ry={4}
              fill={pal.accent}
              stroke={pal.ink}
              strokeWidth={1.8}
              transform="rotate(-40 74 62)"
            />
            <ellipse
              cx={126}
              cy={62}
              rx={6}
              ry={4}
              fill={pal.accent}
              stroke={pal.ink}
              strokeWidth={1.8}
              transform="rotate(40 126 62)"
            />
          </g>
        ),
      };
    case "pony":
      return {
        back: (
          <g>
            <g data-joint="hairSway" style={pivot("hairSway")}>
              <path
                d="M118 52 C162 36 178 82 164 122 C156 144 146 154 152 172 C128 162 132 128 136 106 C140 84 132 66 118 62 Z"
                {...s}
              />
              <path d="M150 62 Q164 84 158 112" {...hi} />
            </g>
            <path d={CAP_BACK} {...s} />
          </g>
        ),
        front: (
          <g>
            <path
              d="M56 102 C50 58 76 46 102 46 C130 46 150 62 144 102 C138 80 124 66 104 64 C92 78 74 84 60 92 C58 96 57 99 56 102 Z"
              {...s}
            />
            <path d="M80 60 Q96 52 116 56" {...hi} />
            <circle cx={122} cy={52} r={5.5} fill={pal.accent} stroke={pal.ink} strokeWidth={1.8} />
          </g>
        ),
      };
    case "braids":
      return {
        back: <path d={CAP_BACK} {...s} />,
        front: (
          <g>
            <g data-joint="braidL" style={pivot("braidL")}>
              {braid(58, -0.6, pal)}
              <circle cx={56} cy={166} r={4} fill={pal.accent} stroke={pal.ink} strokeWidth={1.6} />
              <path
                d="M52 170 L50 180 M56 170 L56 182 M60 170 L62 180"
                stroke={pal.hair}
                strokeWidth={4}
                strokeLinecap="round"
              />
            </g>
            <g data-joint="braidR" style={pivot("braidR")}>
              {braid(142, 0.6, pal)}
              <circle
                cx={144}
                cy={166}
                r={4}
                fill={pal.accent}
                stroke={pal.ink}
                strokeWidth={1.6}
              />
              <path
                d="M140 170 L138 180 M144 170 L144 182 M148 170 L150 180"
                stroke={pal.hair}
                strokeWidth={4}
                strokeLinecap="round"
              />
            </g>
            <path
              d="M56 104 C50 58 74 48 100 48 C126 48 150 58 144 104 C140 82 128 66 100 62 C72 66 60 82 56 104 Z"
              {...s}
            />
            <path d="M100 50 L100 62" stroke={pal.ink} strokeWidth={2} strokeLinecap="round" />
            <path d="M74 60 Q84 54 94 53" {...hi} />
          </g>
        ),
      };
    case "bob":
      return {
        back: (
          <path
            d="M50 106 C42 52 74 42 100 42 C126 42 158 52 150 106 C152 122 148 134 138 140 C120 134 80 134 62 140 C52 134 48 122 50 106 Z"
            {...s}
          />
        ),
        front: (
          <g>
            <path
              d="M56 98 C52 60 76 48 100 48 C124 48 148 60 144 98 C140 90 137 86 133 83 C118 87 82 87 67 83 C63 86 60 90 56 98 Z"
              {...s}
            />
            <path d="M78 58 Q100 50 122 58" {...hi} />
          </g>
        ),
      };
    case "long":
      return {
        back: (
          <g data-joint="hairSway" style={{ ...pivot("hairSway"), transformOrigin: "100px 60px" }}>
            <path
              d="M52 100 C44 50 76 42 100 42 C124 42 156 50 148 100 C150 140 158 176 152 198 C132 206 68 206 48 198 C42 176 50 140 52 100 Z"
              {...s}
            />
          </g>
        ),
        front: (
          <g>
            <path
              d="M56 106 C50 58 74 46 100 46 C126 46 150 58 144 106 C146 126 148 142 146 154 C140 132 138 110 132 92 C124 76 110 66 100 60 C90 66 76 76 68 92 C62 110 60 132 54 154 C52 142 54 126 56 106 Z"
              {...s}
            />
            <path d="M112 54 Q126 60 134 74" {...hi} />
          </g>
        ),
      };
    case "curls":
      return {
        back: (
          <g>
            <ellipse cx={100} cy={96} rx={52} ry={50} fill={pal.hair} />
            <Cloud circles={curlRing()} fill={pal.hair} ink={pal.ink} />
            <ellipse cx={100} cy={96} rx={50} ry={48} fill={pal.hair} />
          </g>
        ),
        front: (
          <Cloud
            circles={[
              [64, 80, 10],
              [72, 66, 11],
              [86, 58, 11],
              [100, 55, 11],
              [114, 58, 11],
              [128, 66, 11],
              [136, 80, 10],
            ]}
            fill={pal.hair}
            ink={pal.ink}
          />
        ),
      };
  }
}
