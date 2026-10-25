/**
 * The seven side characters as Sparkles names them (`/design/character`, synced 2026-10-25): a
 * product name, a want and a flaw, one ability, a voice and fixed lines. The studio keeps its
 * working names and ids (`studio.id`); the product names live here only. Lines are fixed copy.
 */
export type CastLines = {
  greet: string;
  right: readonly [string, string, string];
  nearly: readonly [string, string];
  gentle: readonly [string, string, string];
};

export type CastSpec = {
  slug: string;
  name: string;
  studio: { name: string; id: string };
  temperament: string;
  ability: { name: string; line: string };
  voice: { pitch: number; rate: number };
  lines: CastLines;
};

export const CAST_SPECS: CastSpec[] = [
  {
    slug: "haru",
    name: "Haru",
    studio: { name: "Haru", id: "more-haru" },
    temperament: "Shy, precise, quietly thrilled by numbers. Wants things to add up; corrects people mid-sentence, then apologises.",
    ability: { name: "Count", line: "Counts anything at a glance." },
    voice: { pitch: 1.1, rate: 1.02 },
    lines: {
      greet: "Hi, I’m Haru. I’ll count the questions — you answer them.",
      right: ["That adds up.", "Exactly right.", "Yes — precisely."],
      nearly: ["Most of it adds up. Check the rest.", "So close — a couple to fix."],
      gentle: ["Hm, not that one. Here’s how it works.", "I mix that up too, honestly.", "Let’s look at it again together."],
    },
  },
  {
    slug: "margot",
    name: "Margot",
    studio: { name: "Grace", id: "people-grace" },
    temperament: "A dancer once, and still: tall, regal, warm. Wants everyone standing tall and enjoying themselves; turns any moment into a dance lesson.",
    ability: { name: "Shimmy", line: "One shimmy and everyone is dancing." },
    voice: { pitch: 0.95, rate: 0.94 },
    lines: {
      greet: "Hello, darling. Chin up — shall we begin?",
      right: ["Bravo!", "Beautifully done.", "Now that’s style."],
      nearly: ["Lovely start — now finish the step.", "Almost on your toes!"],
      gentle: ["Every dancer slips. Here’s the step.", "Never mind, darling — watch this.", "Shake it off. Look here."],
    },
  },
  {
    slug: "nell",
    name: "Nell",
    studio: { name: "Ada", id: "cand-ada" },
    temperament: "Runs the tea stall on the bank and laughs the loudest. Wants everyone fed; can’t keep a secret.",
    ability: { name: "Hum", line: "One tune and everyone settles." },
    voice: { pitch: 1.05, rate: 0.96 },
    lines: {
      greet: "Hello, love! Pull up a chair — we’ll do this together.",
      right: ["There you go!", "Oh, well done you!", "Lovely, that’s it."],
      nearly: ["Nearly there, love — just a bit left.", "Half the pot’s brewed!"],
      gentle: ["Oh, that one’s sneaky. Here, look.", "Happens to us all, love.", "No harm done — let’s see why."],
    },
  },
  {
    slug: "otto",
    name: "Otto",
    studio: { name: "Professor Otto", id: "more-otto" },
    temperament: "Brilliant, absent-minded, delighted by every question — most of all the ones he can’t answer yet. Forgets what he came into the room for.",
    ability: { name: "Eureka", line: "His hair stands straight up when an idea lands." },
    voice: { pitch: 0.8, rate: 1.05 },
    lines: {
      greet: "Ah, hello! Questions — my favourite thing.",
      right: ["Eureka!", "Splendid thinking!", "Yes, yes — exactly!"],
      nearly: ["Part of it! The rest is hiding.", "Ooh, partly — let’s find the missing bit."],
      gentle: ["Fascinating! Here’s how it really works.", "I got that one wrong for years.", "A wrong turn is still a turn. Here’s why."],
    },
  },
  {
    slug: "noor",
    name: "Noor",
    studio: { name: "Noor", id: "people-noor" },
    temperament: "Calm, patient, quietly funny — waits as long as it takes. Wants everyone to feel they can ask; too nice to tell the ducks off.",
    ability: { name: "Thumbs-up", line: "A thumbs-up so warm it fills the frame." },
    voice: { pitch: 1.1, rate: 0.94 },
    lines: {
      greet: "Hi, I’m Noor. Take your time — I’ll be right here.",
      right: ["Lovely work.", "That’s exactly it.", "Well thought through."],
      nearly: ["Good — most of that is right.", "You’re nearly there. Look at the rest."],
      gentle: ["That’s okay. Let’s look at why.", "Good try. Here’s the idea.", "Mistakes are how we learn this."],
    },
  },
  {
    slug: "rio",
    name: "Rio",
    studio: { name: "Kai", id: "cand-kai" },
    temperament: "Cool, deadpan, says little — and secretly the kindest, the one who waits for the slow ones. Wants to look like he doesn’t care.",
    ability: { name: "Moonwalk", line: "Glides backwards as if the ground were ice." },
    voice: { pitch: 0.85, rate: 0.92 },
    lines: {
      greet: "Hey. Rio. Let’s do this.",
      right: ["Nice.", "Yep. That’s it.", "Cool. Called it."],
      nearly: ["Most of it. Not bad.", "Close. Fix the rest."],
      gentle: ["Eh, happens. Here’s why.", "Tricky one. Look.", "Yeah, that one’s sneaky."],
    },
  },
  {
    slug: "cleo",
    name: "Cleo",
    studio: { name: "Sofia", id: "more-sofia" },
    temperament: "Bubbly, musical, sings the instructions. Wants everyone joining in; can’t stand silence.",
    ability: { name: "Clap", line: "One clap and everyone’s on the beat." },
    voice: { pitch: 1.4, rate: 1.08 },
    lines: {
      greet: "Hiii, I’m Cleo! Ready? Let’s go!",
      right: ["Yes, yes, yes!", "Ooh, perfect!", "That’s music!"],
      nearly: ["So close — just a few off the beat.", "Almost the whole song!"],
      gentle: ["Oops! Let’s try the tune again.", "No worries — here’s how it goes.", "That one trips me up too!"],
    },
  },
];

export const castByStudioId = (id: string): CastSpec | undefined => CAST_SPECS.find((s) => s.studio.id === id);
