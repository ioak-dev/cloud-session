/**
 * One candidate's colours — the bench's stand-in for the `--guide-*` tokens §9.4.3 owes once a
 * character is picked. Theme-invariant: a candidate reads the same on both grounds, and its `ink`
 * outline is what carries the 3:1 edge against either canvas.
 */
export type Palette = {
  /** Eyes, mouth, brows: the face's features. */
  ink: string;
  /** Outlines of the body, limbs, clothes and props. Falls back to `ink`; a character drawn
   *  without black outlines sets a tonal line here. */
  line?: string;
  /** Face and, for a human, every bare limb. */
  skin: string;
  skinShade: string;
  /** Arms and legs where they differ from the face (a red panda's dark legs). */
  limb: string;
  /** Hands and feet when bare. */
  paw: string;
  hair: string;
  hairHi: string;
  eye: string;
  blush: string;
  /** Clothes: the everyday top, a second top colour, the bottom, shoes. */
  top: string;
  topAlt: string;
  bottom: string;
  shoe: string;
  /** The candidate's own accent — ties, trims, the party hat. */
  accent: string;
  /** Anything that glows: a pebble, a firefly's tail, a boing star. */
  glow: string;
};

export const WHITE = "#fffdf8";
export const TONGUE = "#e5707e";
export const DROP = "#9fd4f2";
