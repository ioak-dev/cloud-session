# Cast

Target shape, after Duolingo: **one main character and six side characters**. The product is known by the main character. Each side character has a stable identity of its own and never competes with the main one.

**Nothing is final.** The drawings from Sparkles’ `/design/nix` bench are starting points, not finished characters. The 52 practice-item characters, the human candidates, Mabel and the koala are not part of the cast.

## One ability per character

Every character has **one special feature or ability that no other character in the cast has**. It is what the character is remembered by, and what it can do on screen that no one else can. Two characters must never share an ability, and a new candidate needs one before it is drawn.

| Character | Ability |
|---|---|
| Firefly | Glow and fire sparkles: its tail lights up and sheds sparkles |
| Chameleon | Colour change: it takes the colour of what it lands on, including semantic colours |

## Main character: firefly (being reworked)

The firefly is the natural fit for the main character, because Sparkles’ guide is a small light. The bench drawing is too plain. It needs a heavy rework into a more detailed, sturdier character that holds up under costumes, props and movement.

Eight candidates, in two groups. The rest (Lantern, Spark, Flicker) were dropped.

**New bodies**, in `src/design/nix/firefly-bodies.tsx`. Each is built from the ground up on a body frame of its own, not the shared chibi one, so they differ in silhouette, in where the light lives, and in how they stand:

| Variant | Body plan | Where the light is | Antennae |
|---|---|---|---|
| Pip | A pink bean: head and body are one shape, stubby limbs | The bean’s whole bottom glows, through any outfit | Coiled springs |
| Wisp | Floats, with no legs; a droplet-shaped head and ribbon wings | The body ends in a flame of light | Thin as smoke |
| Chonk | Low and wide, sitting in a domed beetle shell | Two lamps set into the sides of the shell | Short and clubbed |
| Glowworm | A firefly larva: a segmented body, a bare baby face, no wings | A pair of lights on every ring; the last ring glows | Nubs |
| Strider | Tall and lanky, long legs, a lopsided cap | The tail arcs over its shoulder like a lantern on a pole | Question marks |

**Kept from earlier rounds**, in `src/design/nix/firefly-variants.tsx`, all on the shared chibi frame:

| Variant | Direction |
|---|---|
| Fuzzy | The most huggable: fuzzy body, feathery antennae, a round glow bulb, long wings |
| Nightlight | Calm and tender: a constellation on its cap, heart-dipped bangs, glowing antenna bulbs, round starry wings |
| Bulb | The learning one: a lightbulb tail with a filament (a bright idea), a striped cap, glass-bead antennae, polka-dot wings |

The antennae and glow follow the expression: they droop and dim when worried, perk up and brighten when delighted, and one antenna lifts when curious. The rig passes the mood to each character’s parts through `Ctx.mood`.

The original bench firefly stays in `candidates.tsx` for reference. **Next step:** pick one variant, or combine parts of several. Motion and extra poses wait until a variant is chosen.

**Flourishes are not part of any character.** Sparkle trails, bursts, confetti and similar effects are a separate layer (props or animation), to be designed later. When they are, they can be applied to any character. Do not draw them into a character.

Once one is chosen, the main character’s silhouette, palette and ability stay fixed across every context. Only pose, expression and authored wardrobe change. The glow is its signature, not a status.

## Side characters

| # | Character | Ability | Status |
|---|---|---|---|
| 1 | Chameleon | Colour change | **Confirmed.** The design itself can still be reworked |
| — | Otter | (a glowing pebble; too close to the firefly’s glow — needs its own ability) | Backup, no preference |
| — | Red panda | (none yet — the ringed tail is a look, not an ability) | Backup, no preference |
| 2–6 | — | — | Open: new candidates are to be proposed in this repo |

A side character must be told apart from the main character and from every other side character by silhouette alone, at small size.

Which side character plays which role in the product is not decided. Record it here when it is.

### The chameleon’s colour change

Colour change is the chameleon’s ability, and it is meant to be semantic: green for a correct answer, a “not yet” colour for an incorrect one, and other meaningful colours where the product defines them. This is a deliberate exception to the brief’s “no large field in a status hue” rule, and it applies **only** to the chameleon. It carries three conditions:

- The colour is never the only signal. The outcome is also given in words or a status mark (see the brief).
- An incorrect answer is still gentle. A harsh alarm-red body can read as a scold to a child, so the incorrect colour needs to be tested and may need to be a softer hue.
- At rest, the chameleon wears its own non-status colour. It changes colour only on one of the three practice events.
