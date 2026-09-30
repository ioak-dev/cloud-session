---
name: character-design
description: >-
  Design and revise the Sparkles character cast in the cloud-session studio: one
  main character (Wisp, a floating firefly that leaves a spark trail, with its
  variants and wispy directions) and six side
  characters (the chameleon is confirmed; otter and red panda are backups; more
  are to be proposed). Use when drawing, rigging, recolouring or posing a
  character, proposing a new one, or judging one against the product rules.
  Read docs/brief.md and docs/cast.md first.
---

# Character design

This repo designs characters for Sparkles. It does not change the Sparkles repo.

The cast is one main character and six side characters; nothing is final. `docs/cast.md` holds each character’s status. Do not bring back the koala, the 52 practice-item characters, the human Nix-bench candidates, or Mabel.

Read `docs/brief.md` for audience, use case, and the bounds.

## Main and side

- **One ability each.** Every character has one special feature or ability no other character has: the firefly’s glow and fire sparkles, the chameleon’s colour change. A new candidate is not drawn until it has an ability, and it must not overlap one that is already taken.
- **Main character (firefly).** Wisp is the main character, and there is one of it: `WISP_MAIN` in `firefly-wisp.tsx`. Refine it there; don't add variants. The wispy directions in `firefly-spirits.tsx` and `firefly-spirits-2.tsx` are reference. Follow Wisp's drawing rules in `docs/cast.md`: no highlights or reflections (nothing lighting-dependent), antennae behind the head, no outline on the body, wispy hands (a tapering tendril with a soft tip), the flame continuing the body with no seam, and hairline tonal edges on the wings only. Its turn is the 2.5D puppet in `wisp-turn.tsx`, and its turnaround, back view and flight are in `wisp-views.tsx`. Change them together with the front, and keep the puppet at 0° matching the rig. Wisp faces front wherever it arrives, turns continuously (head first) to travel side-on, and never flips (`docs/cast.md`). Wisp appears only on the sign-up form, in the gutter to the left (`wisp-form.tsx`). Between fields it hops without turning. While typing it turns into the field and its eyes follow the text. At the password it turns its back. It never reacts to what is typed. Pip (`firefly-pip.tsx`), Fuzzy, Chonk, Cube and Hood are reference only; don't develop them as main-character candidates. A Wisp must read as a colour on the dark ground, not a white shape: draw its body in `C.mid` or `C.primary`, not in `C.soft` or `C.tint`. Reference drawings live in `firefly-bodies.tsx`, `firefly-bodies-2.tsx` and `firefly-variants.tsx`. A new round goes in its own file, and each variant must not resemble any other in body plan, silhouette, or where its light lives. `docs/cast.md` holds the current list. A variant that needs a different silhouette gets its own `Body` frame (joints, torso, fits, limb widths) rather than a new head on the chibi frame; `legs: false` makes a character float. Until the user picks one variant, draw only the static figure on the shared rig. Do not spend effort on new poses, motion or expression sets. After the pick, the silhouette and ability stay fixed across contexts.
- **Side characters.** Recommended: every side character is a different species, with no second firefly (see `docs/cast.md`). The chameleon is confirmed. Its colour change may use status hues, under the conditions in `docs/cast.md`. The otter and red panda are backups. New side candidates are welcome; propose them with an ability and a silhouette distinct from the rest of the cast.
- **Clothes use `C.clothes`**, set for every character by the header's clothes switch. Trims use `C.accent`.
- **Colour comes from the scheme.** Draw a firefly with the `C` tokens in `theme.ts` (primary, deep, mid, soft, tint, hi, accent), never hex. The header switches the scheme for every character at once. Never make per-character colourways. Only the glow keeps its own colour.
- **No black outlines.** Separate shapes by colour and tone. Where an edge is needed, use a tone of the part’s own colour: `C.line` for the body, limbs and clothes, `C.hi` for pale parts on a pale ground, `C.glowEdge` for the glow. Draw thin parts (antennae) in `C.thin` with no outline. Keep `pal.ink` for eyes, mouth and brows only, and set `line: C.line` in the palette. Check every change on the dark ground.
- **Two pairs of wings move apart.** Put the upper pair on `wingL`/`wingR` and the lower pair on `hindL`/`hindR`. Never draw both pairs on one joint.
- Each character must read apart from the others by silhouette alone, at small size. Only the chameleon may take a status hue, and only through its ability.
- **Every Wisp-line character leaves a spark trail.** Give it `trail: [x, y]`, the point its sparks come from, in figure space. Never draw sparks into the drawing: the rig's `SparkTrail` draws them. Other flourishes (bursts, confetti) are a separate effects layer.
- A signature part may read `Ctx.mood` to react to the expression, as the firefly antennae do. That is expression, not motion, so it is allowed before a variant is chosen.
- Record every decision in `docs/cast.md`. Do not assign product roles unprompted.

## Where to work

- Main-character variants: `src/design/nix/firefly-bodies.tsx` and `firefly-bodies-2.tsx` (own body frames) and `src/design/nix/firefly-variants.tsx` (chibi frame, plus the shared antenna, glow and palette helpers).
- Bench animals (head, tail, signature): `src/design/nix/candidates.tsx`.
- Side candidates, round one (lamb, octopus, axolotl, hamster, fruit bat) and the ability previews: `src/design/nix/side-candidates.tsx`.
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
- No large field in a status hue — a green body must not read as correct — except through the chameleon’s colour-change ability.
- Motion is declared keyframes. No canvas, WebGL, or physics. Reduced motion holds a rest pose; the expression may still change.
- Figures are `aria-hidden`.

## Done

A change is done when the studio shows it, both grounds, and `docs/cast.md` still matches the drawn cast unless the user changed it. `npm run typecheck` passes.
