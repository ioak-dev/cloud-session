---
name: character-design
description: >-
  Design and revise the Sparkles character cast in the cloud-session studio: one
  main character (Wisp, a floating firefly that leaves a spark trail, with its
  variants and wispy directions) and six side
  characters (the club at the Observatory on the hill: Hob, Tavi, Grit, Lyra, Nox
  and Pim, who speak fixed lines, lip-synced). Use when drawing, rigging,
  recolouring or posing a character, proposing a new one, giving one lines or
  talking shapes, or judging one against the product rules. Read docs/brief.md,
  docs/cast.md and docs/world.md first.
---

# Character design

This repo designs characters for Sparkles. It does not change the Sparkles repo.

The cast is one main character and six side characters; nothing is final. `docs/cast.md` holds each character’s status. Do not bring back the koala, the 52 practice-item characters, the human Nix-bench candidates, or Mabel.

Read `docs/brief.md` for audience, use case, and the bounds.

## Main and side

- **One ability each.** Every character has one special feature or ability no other character has: the firefly’s glow and fire sparkles, Hob's burrow, Pim's radar ears (the full list is in `docs/cast.md`). A new candidate is not drawn until it has an ability, and it must not overlap one that is already taken.
- **Main character (firefly).** Wisp is the main character, and there is one of it: Wisp on one pair of ribbon wings (Clean) with the Core tail and Snug's thicker arms, `CLEAN_PICK` in `wisp-clean.tsx`, built on `firefly-wisp.tsx` and `wisp-ribbon.tsx`. Refine it there; don't add variants. `WISP_MAIN` (two pairs of butterfly wings) is an alternate main character kept for reference on the Wisp · Butterfly page. The wispy directions in `firefly-spirits.tsx` and `firefly-spirits-2.tsx` are reference. Follow Wisp's drawing rules in `docs/cast.md`: no highlights or reflections (nothing lighting-dependent), antennae behind the head, no outline on the body, wispy hands (a tapering tendril with a soft tip), the flame continuing the body with no seam, and hairline tonal edges on the wings only. Its turn is the 2.5D puppet in `wisp-turn.tsx`, and its turnaround, back view and flight are in `wisp-views.tsx`. Change them together with the front, and keep the puppet at 0° matching the rig. Wisp faces front wherever it arrives, turns continuously (head first) to travel side-on, and never flips (`docs/cast.md`). Wisp appears only on the sign-up form, in the gutter to the left (`wisp-form.tsx`). Between fields it hops without turning. While typing it turns into the field and its eyes follow the text. At the password it turns its back. It never reacts to what is typed. Pip (`firefly-pip.tsx`), Fuzzy, Chonk, Cube and Hood are reference only; don't develop them as main-character candidates. A Wisp must read as a colour on the dark ground, not a white shape: draw its body in `C.mid` or `C.primary`, not in `C.soft` or `C.tint`. Reference drawings live in `firefly-bodies.tsx`, `firefly-bodies-2.tsx` and `firefly-variants.tsx`. A new round goes in its own file, and each variant must not resemble any other in body plan, silhouette, or where its light lives. `docs/cast.md` holds the current list. A variant that needs a different silhouette gets its own `Body` frame (joints, torso, fits, limb widths) rather than a new head on the chibi frame; `legs: false` makes a character float. Until the user picks one variant, draw only the static figure on the shared rig. Do not spend effort on new poses, motion or expression sets. After the pick, the silhouette and ability stay fixed across contexts.
- **Side characters.** The six are the club at the Observatory on the hill (`docs/world.md`): Hob, Tavi, Grit, Lyra, Nox and Pim, in `observatory.tsx`. Each is a different species or a person, with no second firefly. Their relationships, running jokes and stakes are in `docs/world.md`; keep new lines and acts true to them. Do not bring back the earlier side characters (chameleon, fruit bat, chick, Juno, Lulu, otter, red panda, octopus, penguin). No side character has a status hue.
- **Clothes use `C.clothes`**, set for every character by the header's clothes switch. Trims use `C.accent`.
- **Colour comes from the scheme.** Draw a firefly with the `C` tokens in `theme.ts` (primary, deep, mid, soft, tint, hi, accent), never hex. The header switches the scheme for every character at once. Never make per-character colourways. Only the glow keeps its own colour.
- **No black outlines.** Separate shapes by colour and tone. Where an edge is needed, use a tone of the part’s own colour: `C.line` for the body, limbs and clothes, `C.hi` for pale parts on a pale ground, `C.glowEdge` for the glow. Draw thin parts (antennae) in `C.thin` with no outline. Keep `pal.ink` for eyes, mouth and brows only, and set `line: C.line` in the palette. Check every change on the dark ground.
- **Side characters avoid outlines as far as possible**: palette `line: "none"`, parts told apart by colour alone.
- **Every side character has its own eyes and mouth.** Give it an eye kit (`face.kit`) and a mouth kit (`face.mouthKit`) designed for it (`rig/eyes.tsx`) — eye shape, colour, shine, lids, brows; lips, beak or muzzle — that draw every mood. Never reuse another character's kit or fall back to the shared face. Check the studio's eyes-and-mouths sheet.
- **Every side character talks.** Its mouth kit also draws the eight talking shapes when `viseme` is set (`rig/visemes.ts`), in its own mouth and coloured by the mood. Check the “Talking mouths” sheet and the lip-sync demo. Lines are fixed copy, shown as text beside the figure; never generated text. Lip-sync is word-synced on Web Speech's boundaries, falling back to a flap (`docs/cast.md`).
- **Every side character is somebody at rest.** Give it a one-line temperament (a want and a flaw), an `attitude` (resting mood, head tilt, stance), one asymmetry or imperfection, two-tone form (its own shade under its colour, never black), chunky limbs (`CHUNKY`) and a little species-true detail. See “What makes a side character loved” in `docs/cast.md`.
- **People must act.** Brows carry half of every expression; the two eyes may do different things; mouths have business (a bitten lip, a tongue out, a lopsided grin); hair or a detail tells you who she is.
- **Practice states** are not drawn for the club yet. When they are: four states (still writing, correct, incorrect, partly correct), variants mixing the character's own feature, face-and-body acting and a prop; no two characters share an action or a prop; incorrect is always gentle; no prop is a reward. Record new states against the brief's three-event bound.
- **Ability previews** (`observatory-abilities.tsx`) are their own layer: a whole-figure move (`.mv-*` in `studio.css`), effects behind or over the figure (`.fx-*`), or an act for the rig. A preview that changes the face is drawn in the head's own space (`headFx`), so it moves with the head.
- **An ability comes from the character itself** — its body and nature, its spirit — never a prop it holds or an outside object it uses.
- **Legible small, on both grounds**: check the recognition sheet on light and dark.
- **Never copy a copyrighted character** (Anya, Duolingo's cast): take the spirit, not the look.
- **People are allowed as side characters**; Tavi is one. They are new characters, not the Nix bench's humans, and each draws its own hair (leave `hair` unset so the shared hair kit is not drawn too).
- **Wisp's ribbons are one pair** on `wingL`/`wingR`; `hindL`/`hindR` carry nothing. **Two pairs of wings move apart** (the butterfly alternate and any other two-winged character): put the upper pair on `wingL`/`wingR` and the lower pair on `hindL`/`hindR`. Never draw both pairs on one joint.
- Each character must read apart from the others by silhouette alone, at small size. No side character takes a status hue.
- **Every Wisp-line character leaves a spark trail.** Give it `trail: [x, y]`, the point its sparks come from, in figure space. Never draw sparks into the drawing: the rig's `SparkTrail` draws them. Other flourishes (bursts, confetti) are a separate effects layer.
- A signature part may read `Ctx.mood` to react to the expression, as the firefly antennae do. That is expression, not motion, so it is allowed before a variant is chosen.
- Record every decision in `docs/cast.md`. Do not assign product roles unprompted.

## Where to work

- Main-character variants: `src/design/nix/firefly-bodies.tsx` and `firefly-bodies-2.tsx` (own body frames) and `src/design/nix/firefly-variants.tsx` (chibi frame, plus the shared antenna, glow and palette helpers).
- The `Candidate` type and the bench's original firefly: `src/design/nix/candidates.tsx`.
- Side characters: `src/design/nix/observatory.tsx` (the six, with their eye and mouth kits), `observatory-abilities.tsx` (ability previews), `lip-sync.tsx` (the demo). Talking shapes: `src/design/nix/rig/visemes.ts`.
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
- No large field in a status hue — a green body must not read as correct.
- Motion is declared keyframes. No canvas, WebGL, or physics. Reduced motion holds a rest pose; the expression may still change.
- Motion follows the animation principles: anticipation before an action, overshoot and settle after, squash and stretch that keeps volume. Build acts from the rig's helpers in `rig/motion.ts` (`EASE`, `jump`, `pop`, `sag`, `action`) rather than a bare up-and-down.
- Figures are `aria-hidden`.

## Done

A change is done when the studio shows it, both grounds, and `docs/cast.md` still matches the drawn cast unless the user changed it. `npm run typecheck` passes.
