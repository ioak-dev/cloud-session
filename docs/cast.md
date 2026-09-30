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

### Shortlist

| Variant | File | Body plan | Where the light is |
|---|---|---|---|
| Pip | `firefly-bodies.tsx` | A bean: head and body are one shape, stubby limbs, spring antennae | The bean’s whole bottom, through any outfit |
| Wisp | `firefly-bodies.tsx` | Floats with no legs; a droplet head, ribbon wings | The body ends in a flame of light |
| Fuzzy | `firefly-variants.tsx` | Shared chibi frame; fuzzy head, ruff, feathery antennae, long wings | A round glow bulb tail |

**Recommendation (not decided):** Pip first, Wisp second, Fuzzy third.

- **Pip** passes the most of the brief’s tests. It has the simplest shape to keep consistent and to animate. Its glow shows through every outfit, so the signature survives wardrobe. Its head reads at 16px. Before it is final, two things need work: it reads as a bean more than a firefly, and the pink leans young for secondary-school learners and teachers. Fixes to try: bigger, more firefly wings; a less candy colour.
- **Wisp** has the most distinctive silhouette, and floating suits a guide that appears across the product. It has no legs, though, so trousers, shoes and dungarees are lost. Its pale body is the weakest at 16px and on the light ground, and it can read as a ghost or a candle flame.
- **Fuzzy** reads most clearly as a firefly and is the most huggable. It is also the most generic (a child in a bug suit). Its glow tail hides behind a leg from the front, so the signature is weakest, and the fuzz edge is busy at small sizes.

### Pip refinement round

In `src/design/nix/firefly-pip.tsx`. Pip leads the shortlist, so it gets two branches, three variants each.

**Pip refined:** firefly wings, three colourways. Hard wing cases are lifted up and out as a firefly holds them in flight, with a cream edge stripe. Clear flying wings spread below them, and rings above the glow read as an abdomen.

| Colourway | Body | Wing cases | Clothes |
|---|---|---|---|
| Dusk | Indigo | Deep indigo | Coral |
| Sea | Sea blue | Deep teal-blue | Coral |
| Mauve | Dusty rose (Pip’s pink, grown up) | Plum | Navy |

**Pip × Wisp hybrids:** all keep Pip’s legs, so the whole wardrobe works.

| Hybrid | What it takes from Wisp | Where the light is |
|---|---|---|
| Droplet | The droplet head, on Pip’s bean body; ribbon wings; smoke antennae | Pip’s glowing bottom |
| Flame-top | One bean whose top rises to Wisp’s point; smoke antennae; firefly wings | Pip’s glowing bottom |
| Comet | The droplet head, the ribbon wings, and Wisp’s flame as a comet tail | The tail, which no outfit covers |

### Reference

Kept as inspiration for the main character or a side character, not as candidates. If one inspires a side character, redraw it as a different species with its own ability.

| Variant | File | Idea worth keeping |
|---|---|---|
| Chonk | `firefly-bodies.tsx` | A low, wide body in a domed shell; lamps set into the shell |
| Cube | `firefly-bodies-2.tsx` | Everything square; a lit window in the chest |
| Hood | `firefly-bodies-2.tsx` | A cone of a cloak, a floppy hood, light from inside the cloak |

Dropped: Lantern, Spark, Flicker, Nightlight, Bulb, Glowworm, Strider, Flutter, Lampion, Trio.

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

## Cast structure: recommended, not decided

Recommended: **one firefly as the main character, and every side character a different species.** No second firefly.

- **The ability rule.** Glow is the firefly’s one ability. A second firefly either shares it, which breaks the rule, or glows differently, which weakens what the main character is known for.
- **Recognition.** A child names the character the product is known by. Two or three fireflies turn “the firefly” into “which firefly?”, and the main one stops being the face of the product.
- **Duolingo’s shape.** Duo is the only owl. The rest of the cast are different species and people, each told apart by silhouette alone.
- **The loser variants are not wasted.** Several of the body plans already carry a side character’s idea without being a firefly. A domed shell (Chonk), a cloak and hood (Hood), a floating spirit (Wisp) or a square toy (Cube) can be redrawn as another species with its own ability.

One exception is worth keeping open: **a younger firefly-family member** (a glowworm, say) as the learner’s companion. It would need an ability other than glow, and a story that never turns growing up into a reward. Decide this only after the main firefly is chosen.

A side character must be told apart from the main character and from every other side character by silhouette alone, at small size.

Which side character plays which role in the product is not decided. Record it here when it is.

### The chameleon’s colour change

Colour change is the chameleon’s ability, and it is meant to be semantic: green for a correct answer, a “not yet” colour for an incorrect one, and other meaningful colours where the product defines them. This is a deliberate exception to the brief’s “no large field in a status hue” rule, and it applies **only** to the chameleon. It carries three conditions:

- The colour is never the only signal. The outcome is also given in words or a status mark (see the brief).
- An incorrect answer is still gentle. A harsh alarm-red body can read as a scold to a child, so the incorrect colour needs to be tested and may need to be a softer hue.
- At rest, the chameleon wears its own non-status colour. It changes colour only on one of the three practice events.
