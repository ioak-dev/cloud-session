import { arms, fade, lift, rot, squash, type Hands, type Motion } from "./motion";
import { CHIBI, type Body } from "./skeleton";
import type { Mood } from "./face";

/**
 * The bench's poses — the same seven on every candidate. Each names where in the product it would be
 * used (§9.4.3's catalog is closed by row; these rows are proposals until a character is picked).
 * Secondary joints (tail, ears, hair, antennae, wings) are driven on every candidate; a candidate
 * without that part simply has nothing tagged with the joint.
 */
export type PoseId = "idle" | "wave" | "cheer" | "think" | "read" | "point" | "shrug";

const secondary = (k = 1) => ({
  tail: rot(-5 * k, 6 * k, -5 * k),
  hairSway: rot(-3 * k, 4 * k, -3 * k),
  braidL: rot(2 * k, -3 * k, 2 * k),
  braidR: rot(-2 * k, 3 * k, -2 * k),
  antL: rot(-7 * k, 5 * k, -7 * k),
  antR: rot(7 * k, -5 * k, 7 * k),
  earL: rot(0, 0, -8, 0, 0, 0),
  earR: rot(0, 0, 0, 8, 0, 0),
  wingL: rot(0, -14, 0, -14, 0, -14, 0),
  wingR: rot(0, 14, 0, 14, 0, 14, 0),
  /* The lower wings beat twice for each stroke of the upper pair, half a beat behind it: the
     two pairs move on their own joints but to one rhythm. */
  hindL: rot(0, 10, -16, 10, -16, 10, -16, 10, -16, 10, -16, 10, 0),
  hindR: rot(0, -10, 16, -10, 16, -10, 16, -10, 16, -10, 16, -10, 0),
  glow: fade(0.35, 0.8, 0.35),
});

export type Pose = {
  id: PoseId;
  title: string;
  mood: Mood;
  use: string;
  hands: Hands[];
  motion: Motion;
};

export const POSES: Pose[] = [
  {
    id: "idle",
    title: "Idle",
    mood: "neutral",
    use: "Home greeting, a lesson opening, anywhere the guide simply stands by.",
    hands: [
      { L: [76, 206], R: [124, 206] },
      { L: [77, 204], R: [123, 204] },
      { L: [76, 206], R: [124, 206] },
    ],
    motion: {
      duration: 4,
      tracks: {
        torso: lift(0, -1.4, 0),
        head: rot(-2, 2, -2),
        shadow: squash([1, 1], [0.96, 1], [1, 1]),
        ...secondary(),
      },
    },
  },
  {
    id: "wave",
    title: "Wave",
    mood: "happy",
    use: "Sign-in, create account, onboarding's first step.",
    hands: [
      { L: [76, 206], R: [146, 120] },
      { L: [76, 206], R: [130, 114] },
      { L: [76, 206], R: [146, 120] },
    ],
    motion: {
      duration: 1.1,
      tracks: {
        head: rot(3, 5, 3),
        ...secondary(1.4),
      },
    },
  },
  {
    id: "cheer",
    title: "Cheer",
    mood: "delighted",
    use: "Level unlock, session complete — Celebration-class moments only.",
    hands: [
      { L: [62, 120], R: [138, 120] },
      { L: [58, 110], R: [142, 110] },
      { L: [62, 120], R: [138, 120] },
    ],
    motion: {
      duration: 0.9,
      easing: "cubic-bezier(.3,.7,.4,1)",
      still: 1,
      tracks: {
        root: lift(0, -18, 0),
        shadow: squash([1, 1], [0.7, 0.8], [1, 1]),
        head: rot(-3, 3, -3),
        hipL: rot(0, 8, 0),
        hipR: rot(0, -8, 0),
        ...secondary(2),
      },
    },
  },
  {
    id: "think",
    title: "Think",
    mood: "thinking",
    use: "A wait while a run works — outline, generation, a scenario being formed.",
    hands: [
      { L: [104, 198], R: [114, 141], outL: true, outR: true },
      { L: [104, 197], R: [113, 139], outL: true, outR: true },
      { L: [104, 198], R: [114, 141], outL: true, outR: true },
    ],
    motion: {
      duration: 3.6,
      tracks: {
        head: rot(6, 9, 6),
        torso: rot(-1, -2, -1),
        ...secondary(0.6),
      },
    },
  },
  {
    id: "read",
    title: "Read",
    mood: "focused",
    use: "Ingestion and review waits; an empty library inviting the first source.",
    hands: [
      { L: [86, 194], R: [114, 194], outL: true, outR: true },
      { L: [86, 193], R: [114, 195], outL: true, outR: true },
      { L: [86, 194], R: [114, 194], outL: true, outR: true },
    ],
    motion: {
      duration: 3.2,
      tracks: {
        head: rot(-3, -1, -3),
        torso: lift(0, -1, 0),
        ...secondary(0.6),
      },
    },
  },
  {
    id: "point",
    title: "Point",
    mood: "curious",
    use: "Onboarding tips, an empty state pointing at the one control that fills it.",
    hands: [
      { L: [92, 196], R: [162, 146], outL: true },
      { L: [92, 196], R: [164, 142], outL: true },
      { L: [92, 196], R: [162, 146], outL: true },
    ],
    motion: {
      duration: 2.4,
      tracks: {
        torso: rot(2, 3, 2),
        head: rot(-4, -2, -4),
        ...secondary(),
      },
    },
  },
  {
    id: "shrug",
    title: "Shrug",
    mood: "oops",
    use: "Not-found, a recoverable error, a run that failed and can be re-run.",
    hands: [
      { L: [70, 196], R: [130, 196] },
      { L: [56, 180], R: [144, 180] },
      { L: [70, 196], R: [130, 196] },
    ],
    motion: {
      duration: 1.8,
      still: 1,
      tracks: {
        torso: lift(0, -3, 0),
        head: rot(0, -8, 0),
        ...secondary(),
      },
    },
  },
];

/** A pose's motion on one body: its own tracks plus its arms, solved for that body. */
export function motionFor(pose: Pose, body: Body = CHIBI): Motion {
  return { ...pose.motion, tracks: { ...pose.motion.tracks, ...arms(pose.hands, body) } };
}
