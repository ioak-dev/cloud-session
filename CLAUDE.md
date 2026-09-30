# Cloud session — Sparkles character studio

This repo is character design for the sibling product Sparkles. It is not the product. Do not edit the `sparkles` repo from here.

Read `docs/brief.md` before drawing anything. The cast is `docs/cast.md`: one main character and six side characters, none final. The main character is Wisp, a floating firefly; the chameleon is a confirmed side character; the otter and red panda are backups. The rules for how a character may behave are `.claude/skills/character-design/SKILL.md`; read that skill before adding or changing a drawing.

## Run

```
npm install
npm start
```

`npm start` runs `node studio.mjs`, which serves the studio at http://127.0.0.1:5173. Light, dark, and system change the ground only. The colour schemes in the header recolour every firefly at once.

`npm run typecheck` is `tsc --noEmit`.

## What is here

| Path | Owns |
|---|---|
| `src/design/nix/firefly-wisp.tsx` | Wisp, the main character (one drawing, `WISP_MAIN`) |
| `src/design/nix/wisp-views.tsx` | Wisp's three-quarter, side and back views, and Wisp in flight |
| `src/design/nix/firefly-spirits.tsx` | Wispy directions (reference): Puff, Jelly, Bloom |
| `src/design/nix/firefly-spirits-2.tsx` | Wispy directions (reference): Comet, Bubble, Dandelion, Star, Crescent |
| `src/design/nix/firefly-pip.tsx` | Pip, Wing cases, Plump (reference) |
| `src/design/nix/theme.ts` | The colour tokens every firefly draws with, and the header's schemes |
| `src/design/nix/firefly-bodies.tsx` | Chonk (reference) |
| `src/design/nix/firefly-bodies-2.tsx` | Cube and Hood (reference), each on its own body |
| `src/design/nix/firefly-variants.tsx` | Fuzzy (reference, chibi frame); shared antenna, glow and palette helpers |
| `src/design/nix/candidates.tsx` | Bench animals: otter, red panda, original firefly, chameleon |
| `src/design/nix/rig/` | The shared rig: joints, poses, expressions, outfits, props, and the spark trail |
| `src/design/nix/NixBenchView.tsx` | The studio page |
| `src/styles/studio.css` | The surface colour tokens |
| `docs/brief.md` | Audience, use case, why the characters exist, the bounds |
| `docs/cast.md` | Status of every character, the one-ability rule |

The 52 characters used beside practice items are not in this repo. Neither are the human candidates from the Nix bench, nor Mabel.

## What this repo does not do

It does not generate lessons, run practice, or own accounts. A character that cannot satisfy `docs/brief.md`’s bounds is not ready to move back.
