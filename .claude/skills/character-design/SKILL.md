---
name: character-design
description: >-
  Design and revise the Sparkles characters in the cloud-session studio: one main
  character (the firefly) and six side characters (otter, red panda, chameleon,
  and three open slots). Use when drawing, rigging, recolouring, or posing a
  character, adding a side character, or judging one against the product rules. Read docs/brief.md and
  docs/cast.md first.
---

# Character design

This repo designs characters for Sparkles. It does not change the Sparkles repo.

The cast is one main character and six side characters, in `docs/cast.md` and `src/design/nix/candidates.tsx`. The firefly is the main character. The otter, red panda and chameleon are side characters; three side slots are open. Do not bring back the koala, the 52 practice-item characters, the human Nix-bench candidates, or Mabel.

Read `docs/brief.md` for audience, use case, and the bounds.

## Main and side

- The main character is the face of the product. Keep its silhouette, palette and signature fixed; vary only pose, expression and authored wardrobe.
- A side character has its own stable identity and is never the larger presence when it shares a surface with the main character.
- Each character must read apart from the others by silhouette alone, at small size. Do not reuse the firefly’s glow-yellow as a body field, and do not use a status hue.
- Fill an open side slot only when the user names the animal. Add it as a new entry in `candidates.tsx`, on the shared rig, and record it in `docs/cast.md`.
- Roles in the product are undecided; do not assign them unprompted.

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

A change is done when the studio shows it, both grounds, and `docs/cast.md` still matches the drawn cast unless the user changed it. `npm run typecheck` passes.
