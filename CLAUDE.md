# Cloud session — Sparkles character studio

This repo is character design for the sibling product Sparkles. It is not the product. Do not edit the `sparkles` repo from here.

Read `docs/brief.md` before drawing anything. The cast is `docs/cast.md`: one main character and six side characters, none final. The main character is Wisp, a floating firefly on one pair of ribbon wings (the butterfly-winged Wisp is kept as an alternate, for reference); the side characters chosen so far are the chameleon, fruit bat, chick, Juno and Lulu, and the sixth place is open; the otter is a backup. The rules for how a character may behave are `.claude/skills/character-design/SKILL.md`; read that skill before adding or changing a drawing.

## Run

```
npm install
npm start
```

`npm start` runs `node studio.mjs`, which serves the studio at http://127.0.0.1:5173. It has four pages, switched in the header: **Wisp** (`#/wisp`, only the chosen: Wisp on its ribbon wings, Clean, with the Core tail, Snug's thicker arms and Feather eyes, at rest and in every expression; its app icon, Glow · Light with Feather eyes, with its circle and one-colour mark in the primary, black and white; its wordmark, Gabarito 700; its turnaround, flight and sign-up form, and three ways not to look at a password (proposals); the old `#/ribbon` link opens it), **Side characters** (`#/side`), **References** (`#/references`, everything the chosen Wisp was picked from, kept as backup: the proposals on Clean, Bean, softer, the app icon eyes and proposals and the wordmark candidates not chosen, the ribbon variants Glow tips and Spirit, the warmer proposals with their eye styles and acting, then the wispy directions, Pip and the earlier fireflies) and **Wisp · Butterfly (reference)** (`#/butterfly`, the same page with Wisp's two pairs of spotted wings, kept as an alternate main character). Light, dark, and system change the ground only. The colour schemes and the clothes switch in the header recolour every firefly at once.

`npm run typecheck` is `tsc --noEmit`.

## What is here

| Path | Owns |
|---|---|
| `src/design/nix/firefly-wisp.tsx` | Wisp's body, head, flame and face; `WISP_MAIN`, Wisp on two pairs of butterfly wings, is the alternate main character (reference) |
| `src/design/nix/wisp-turn.tsx` | Wisp as a 2.5D puppet that turns continuously from left profile to right; `WingStyleContext` picks its wings (two pairs, or ribbons) and `RibbonFormContext` the ribbon variant |
| `src/design/nix/wisp-views.tsx` | Wisp's turnaround (with a turn slider), back view, and Wisp in flight |
| `src/design/nix/wisp-warm.tsx` | Wisp, warmer: five proposed variations (Hearth, Scamp, Moony, Snug, and the four combined); Wisp itself unchanged |
| `src/design/nix/wisp-ribbon.tsx` | Wisp's ribbon wings: the three kept variants (Clean, chosen; Glow tips and Spirit, reference) and `withRibbon`, which puts them on any Wisp |
| `src/design/nix/wisp-clean.tsx` | Proposals on Clean: tail patterns (Lantern, Core), head shapes (Candle, Dewdrop) and Snug's thicker arms; `CLEAN_PICK`, the main character (Clean ribbons, Core tail, Snug arms, drop head, Feather eyes) |
| `src/design/nix/wisp-wordmark.tsx` | The wordmark: Gabarito 700, lowercase “sparkles”, −0.01em (`WORDMARK`), beside the app icon on the Wisp page; the faces it was chosen from (`WORDMARKS_REFERENCE`) on the References page |
| `src/design/nix/wisp-eyes.tsx` | Eye styles proposed for Wisp, warmer: Honey, Bean, Gumdrop, Lidded, Starry, each for every expression; Bean, softer (`BEAN_STYLES`: Soft, Feather, Blue brows, Round), shown on the main character. Feather (`BEAN_FEATHER`) is the main character's eyes |
| `src/design/nix/wisp-acts.tsx` | Wisp, warmer acting (proposals): its alive idle, a surprise take, a sneak peek, a hiccup, lights out, password eyes-shut |
| `src/design/nix/wisp-form.tsx` | Wisp on the sign-up form: hops between fields, watches you type, turns its back for the password; `PASSWORD_FIELDS`, three ways not to look at a password (turns its back, hands over its eyes, hides under its ribbons), as proposals |
| `src/design/nix/wisp-logo.tsx` | The app icon: Glow · Light with Feather eyes (`APP_ICON`), with its circle and one-colour mark in the primary, black and white (`APP_ICON_SET`), on the Wisp page; on the References page, the eyes not chosen (`APP_ICON_EYES_REFERENCE`), Glow · Light with ink eyes (`APP_ICON_INK`) and the proposals it was chosen from (Drop, Glow, Peek, Ember and variations on Drop and Glow; Figure and Flight, retired with the butterfly wings), each with a favicon-size drawing; `npm run logos` exports them to `docs/logo/`, the chosen set as `app-icon*.svg` |
| `src/design/nix/firefly-spirits.tsx` | Wispy directions (reference): Puff, Jelly, Bloom |
| `src/design/nix/firefly-spirits-2.tsx` | Wispy directions (reference): Comet, Bubble, Dandelion, Star, Crescent |
| `src/design/nix/firefly-pip.tsx` | Pip, Wing cases, Plump (reference) |
| `src/design/nix/theme.ts` | The colour tokens every firefly draws with, and the header's schemes |
| `src/design/nix/firefly-bodies.tsx` | Chonk (reference) |
| `src/design/nix/firefly-bodies-2.tsx` | Cube and Hood (reference), each on its own body |
| `src/design/nix/firefly-variants.tsx` | Fuzzy (reference, chibi frame); shared antenna, glow and palette helpers |
| `src/design/nix/candidates.tsx` | Bench animals: the chameleon (side character); red panda, otter and original firefly (reference) |
| `src/design/nix/side-candidates.tsx`, `side-puff.tsx`, `side-humans.tsx`, `side-abilities.tsx` | The side characters (fruit bat; chick; Juno, Lulu), the octopus and penguin as reference, and every ability preview |
| `src/design/nix/side-states.tsx` | The practice states: 5 variants × 4 states for each of the six side characters |
| `src/design/nix/rig/` | The shared rig: joints, poses, expressions, outfits, props, and the spark trail |
| `src/design/nix/NixBenchView.tsx` | The studio pages: `WispPage` (the chosen Wisp only, or the full butterfly reference page), `SidePage` and `ReferencesPage` (the backup, with `CleanProposals`, `BeanSofter` and `WarmerSections`), sharing one bench |
| `src/App.tsx` | Routes the four pages by hash (and `#/ribbon` to the Wisp page) |
| `src/styles/studio.css` | The surface colour tokens |
| `docs/brief.md` | Audience, use case, why the characters exist, the bounds |
| `docs/cast.md` | Status of every character, the one-ability rule |

The 52 characters used beside practice items are not in this repo. Neither are the human candidates from the Nix bench, nor Mabel. The people among the side candidates are new characters.

## What this repo does not do

It does not generate lessons, run practice, or own accounts. A character that cannot satisfy `docs/brief.md`’s bounds is not ready to move back.
