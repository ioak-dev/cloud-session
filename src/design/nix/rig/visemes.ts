/**
 * Lip-sync for fixed lines, without phoneme timings.
 *
 * Duolingo plays phoneme timings from its speech pipeline through 20+ mouth shapes per character.
 * Web Speech gives none of that: only `start`, `end` and a `boundary` event as each word begins.
 * So a word's mouth shapes are guessed from its letters and spread over its estimated length, and
 * each word starts on its boundary. Eight shapes are enough to read as these words being said.
 */

/** A mouth shape. `rest` is the mouth between words. */
export type Viseme = "rest" | "mbp" | "ai" | "e" | "o" | "u" | "fv" | "l";

export const VISEMES: { id: Viseme; title: string; sounds: string }[] = [
  { id: "rest", title: "Rest", sounds: "between words" },
  { id: "mbp", title: "M B P", sounds: "lips pressed" },
  { id: "ai", title: "A I", sounds: "open wide" },
  { id: "e", title: "E", sounds: "e, s, k, g, r — wide, teeth" },
  { id: "o", title: "O", sounds: "o, ow — round" },
  { id: "u", title: "U W", sounds: "oo, w, sh — small and round" },
  { id: "fv", title: "F V", sounds: "lip on teeth" },
  { id: "l", title: "L Th", sounds: "l, t, d, n, th — tongue up" },
];

/**
 * How open a mouth is for each shape, for a kit to draw in its own way: `w` width and `h` opening
 * (0–1, of the kit's own widest and most open), `round` pursed, `teeth` showing, `tongue` raised,
 * `bite` the lower lip under the teeth.
 */
export type Shape = { w: number; h: number; round?: boolean; teeth?: boolean; tongue?: boolean; bite?: boolean; pressed?: boolean };

export const SHAPE: Record<Viseme, Shape> = {
  rest: { w: 0.8, h: 0 },
  mbp: { w: 0.72, h: 0, pressed: true },
  ai: { w: 1, h: 1, teeth: true },
  e: { w: 1.05, h: 0.5, teeth: true },
  o: { w: 0.62, h: 0.85, round: true },
  u: { w: 0.42, h: 0.42, round: true },
  fv: { w: 0.86, h: 0.22, teeth: true, bite: true },
  l: { w: 0.86, h: 0.6, tongue: true, teeth: true },
};

const DIGRAPHS: [string, Viseme][] = [
  ["th", "l"],
  ["sh", "u"],
  ["ch", "u"],
  ["oo", "u"],
  ["ou", "o"],
  ["ow", "o"],
  ["ee", "e"],
  ["ea", "e"],
  ["ph", "fv"],
  ["wh", "u"],
];

const LETTER: Record<string, Viseme> = {
  a: "ai",
  i: "ai",
  e: "e",
  y: "e",
  o: "o",
  u: "u",
  w: "u",
  q: "u",
  m: "mbp",
  b: "mbp",
  p: "mbp",
  f: "fv",
  v: "fv",
  l: "l",
  t: "l",
  d: "l",
  n: "l",
};

/** A word's mouth shapes, guessed from its spelling: digraphs first, then letters; repeats
 *  collapse, and a word never needs more than one shape per letter pair. */
export function wordVisemes(word: string): Viseme[] {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  const out: Viseme[] = [];
  for (let i = 0; i < w.length; ) {
    const two = DIGRAPHS.find(([d]) => w.startsWith(d, i));
    const v: Viseme = two ? two[1] : (LETTER[w[i]] ?? "e");
    i += two ? 2 : 1;
    if (out[out.length - 1] !== v) out.push(v);
  }
  /* a long word is sampled evenly: about one shape per two letters, never a blur of every sound */
  const cap = Math.max(2, Math.ceil(w.length / 2));
  if (out.length <= cap) return out;
  return Array.from({ length: cap }, (_, i) => out[Math.floor((i * out.length) / cap)]);
}

/** Vowel groups, at least one: a word's syllables, near enough. */
export function syllables(word: string): number {
  const groups = word.toLowerCase().replace(/[^a-z]/g, "").replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups?.length ?? 1);
}

/** About five syllables a second at rate 1. */
export const SYLLABLE_S = 0.2;

/** How long a word takes to say, in seconds, at a speech rate. */
export const wordSeconds = (word: string, rate: number) => (syllables(word) * SYLLABLE_S) / rate;

/** A pause after a word: a comma is short, a full stop longer. */
export function pauseAfter(word: string, rate: number): number {
  if (/[.!?…]$/.test(word)) return 0.38 / rate;
  if (/[,;:—–-]$/.test(word)) return 0.2 / rate;
  return 0.04 / rate;
}

/** The words of a line with where each starts in it (the `charIndex` a boundary event reports). */
export function words(text: string): { word: string; at: number }[] {
  const out: { word: string; at: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push({ word: m[0], at: m.index });
  return out;
}

/** The shape at `t` seconds into a word: its shapes spread evenly, closing to rest at the end. */
export function visemeAt(seq: Viseme[], dur: number, t: number): Viseme {
  if (t < 0 || t >= dur || seq.length === 0) return "rest";
  return seq[Math.min(seq.length - 1, Math.floor((t / dur) * seq.length))];
}

/** Flap: open and close on a loop, for a voice that reports no words. */
export function flapAt(t: number): Viseme {
  const k = Math.floor(t / 0.11) % 4;
  return k === 0 ? "e" : k === 1 ? "ai" : k === 2 ? "o" : "mbp";
}
