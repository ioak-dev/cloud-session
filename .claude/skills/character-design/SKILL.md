---
name: character-design
description: >-
  Design and revise the Sparkles animal characters in the cloud-session studio:
  otter, red panda, firefly, and chameleon, from the /design/nix bench.
  Use when drawing, rigging, recolouring, or posing one of those characters, or
  judging a character against the product rules. Read docs/brief.md and
  docs/cast.md first.
---

# Character design

This repo designs characters for Sparkles. It does not change the Sparkles repo.

The cast is the four animals in `docs/cast.md` and `src/design/nix/candidates.tsx`. Do not bring back the koala, the 52 practice-item characters, the human Nix-bench candidates, or Mabel.

Read `docs/brief.md` for audience, use case, and the bounds.

## Where to work

- A character’s head, tail, and signature: `src/design/nix/candidates.tsx`.
- Joints, poses, expressions, outfits, props: `src/design/nix/rig/`.
- The page that shows them: `src/design/nix/NixBenchView.tsx`.

A pose is joint data on the shared rig. Do not add a new drawing per pose.

Run the studio with `npm start` (`node studio.mjs`) and look at the drawing on both the light and the dark ground.

## Bounds

- Learner is often a child. Incorrect is gentle, never a scold. Warmth does not make the product loud.
- The guide’s job is across the product, never beside an item being answered, and never the largest element on a surface that carries material.
- Practice reactions, if a character is used there, are three events only — correct, incorrect, level unlock. The same reaction the first time and the fiftieth. No streak, rank, session-complete, or app-open reaction.
- Never reacts to an editor’s approval, a count, or an emptied queue, and never states that material is approved.
- Speech is fixed copy, rendered as text beside the figure. Never generated text, never lettering inside the SVG.
- Clothes are authored for the moment. They are not bought or earned.
- No large field in a status hue. A green body must not read as correct.
- Motion is declared keyframes. No canvas, WebGL, or physics. Reduced motion holds a rest pose; the expression may still change.
- Figures are `aria-hidden`.

## Done

A change is done when the studio shows it, both grounds, and `docs/cast.md` still names the same four animals unless the user changed the cast. `npm run typecheck` passes.
