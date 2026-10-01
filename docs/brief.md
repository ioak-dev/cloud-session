# Sparkles — background for character design

Copied from the sibling `sparkles` repo at `edf7b46c` (2026-09-29, “Merge pull request #11 from ioak-io/ux-design”). Sparkles itself is unchanged. This file is the background a character drawing needs. It is not a second product spec: where it and a Sparkles document disagree, the Sparkles document wins.

## Who it is for

Teaching, at every scale that has subject knowledge and no assessment-design specialist. A secondary school department. A homeschooling parent. A small institution or a tutoring practice. One person preparing a course alone.

The workspace is a *team*, and that is the only word the product uses. A school is a team. A household is a team. One person is a team. There is no school, class, year group, or household entity.

| Role | Usually |
|---|---|
| Learner | A student or a child |
| Editor | A teacher, a tutor, or a parent |
| Team admin | Whoever created the team |

Two consequences bind the characters.

- The editor is a teacher, not a compliance officer, often reviewing at the end of a working day.
- The learner is often a child. That constrains tone. It is not a licence to make the product loud. An incorrect answer is acknowledged gently — never disappointed, never a scold. This is the one place tone can fail a whole surface.

## What the product is

Sparkles turns source material — a chapter, a syllabus, notes, a deck, a topic list — into a lesson with practice, then owns the learner’s practice loop.

Two constraints make it a product rather than a generator. A Practice session mixes cognitive levels to a declared proportion, so practice does not drift into the recall items that are easiest to write. And nothing generated reaches a learner until an editor approves it.

A team’s catalog is a flat list of lessons. There is no course or module a learner is enrolled into. Progression inside a lesson is earned: later material stays closed until earlier mastery is shown.

It is not an LMS, not a tutor, and not a conversation. It does not diagnose why a learner is stuck.

## Why there are characters

A product whose learner is often a child, and whose catalog is a flat list of lessons, has nothing that makes the product itself recognisable. Nothing a child names. Nothing that makes the tenth screen feel like the same place as the first. A character is the cheapest thing that does that job. A character that only appears after an answer does not.

The reference shape for the work in this repo is Duolingo’s: one main character the product is known by, and a small supporting cast with stable identities. Sparkles does not have that shape yet.

### What this studio keeps

The target is one main character and six side characters, and no character is final yet. Wisp, a firefly, is the main character; the six side characters are the club at the Observatory on the hill (`docs/world.md`), listed in `docs/cast.md`. Each character has one ability no other character has, and it comes from the character itself, never from a prop. See `docs/cast.md`.

The 52 characters that appear beside practice items are not in this studio, and they are not the cast. The human candidates from that same bench — the girls and the young teacher — are not here either, and neither is the later Mabel experiment.

## Bounds on any new drawing

These are the product’s rules. A drawing that breaks one of them cannot move back into Sparkles as-is.

**Warmth stays subordinate to the material.** On a surface that carries material, the character is never the largest element. Mid-item, the guide is absent; that slot is the practice character’s.

**Reactions do not accumulate.** The fiftieth correct answer gets the same reaction as the first. No reaction to a score, a streak’s length, a rank, or a session count. The guide does not react to a rank at all.

**Three practice events, and no fourth.** Correct answer. Incorrect answer (gentle). Level unlock, once, with the unlock itself. Not a streak, not a rank change, not opening the app, not session complete. Session complete may show the guide beside the ornament; it does not show a quiz character.

**The guide never rewards the editor.** No reaction to an approval, an approval count, a throughput figure, or an emptied queue.

**The guide carries no claim about material.** Not that an item is approved, not that a level is met, beyond the unlock event itself. Anything she conveys is also in words or a status mark.

**Speech is fixed product copy.** Never generated text. A character voicing model output would skip the review gate.

**Wardrobe is authored.** The guide dresses by context — the moment, the season — the same way every time. A learner cannot buy or earn a change of clothes. (A separate cosmetic currency dresses the learner’s own avatar, not the guide.)

**The guide is rigged.** A pose is joint data, not a new drawing. Forward-kinematic joints, pivot on the joint each piece hangs from. Motion is declared keyframes on one clock. No canvas, no WebGL, no physics engine. Under reduced motion, and when a person stills the guide, it holds a rest pose. Expressions may still change.

**No black outlines.** Shapes are separated by colour and tone; any edge is a tone of the part’s own colour, so the character holds on both grounds. See `docs/cast.md`.

**Colours are the product’s.** A character is drawn in the product’s primary and accent, the same scheme for every character; only a character’s ability colour (the firefly’s glow) is its own.

**No large field in a status hue.** A green body must not read as “correct”. (The studio's one exception, the chameleon’s semantic colour change, left with the chameleon; no character in the cast has a status hue.)

**Decorative by default.** `aria-hidden`. A speech line is real text beside the figure, never drawn onto it.

## Where the drawings are

`src/design/nix/firefly-wisp.tsx` and the `wisp-*.tsx` files draw the main character; `src/design/nix/observatory.tsx` draws the side characters. `src/design/nix/rig/` is the shared rig: joints, poses, expressions, outfits, props. The page is `src/design/nix/NixBenchView.tsx`. Surface colours are `src/styles/studio.css`.
