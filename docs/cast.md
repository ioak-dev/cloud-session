# Cast

Target shape, after Duolingo: **one main character and six side characters**. The product is known by the main character. Each side character has a stable identity of its own and never competes with the main one.

**Nothing is final.** The drawings from Sparkles’ `/design/nix` bench are starting points, not finished characters. The 52 practice-item characters, the human candidates, Mabel and the koala are not part of the cast.

## One ability per character

Every character has **one special feature or ability that no other character in the cast has**. It is what the character is remembered by, and what it can do on screen that no one else can. Two characters must never share an ability, and a new candidate needs one before it is drawn.

| Character | Ability |
|---|---|
| Firefly (Wisp line) | Glow, and the sparks it leaves behind as it flies |
| Chameleon | Colour change: it takes the colour of what it lands on, including semantic colours |
| Octopus *(proposed)* | Ink: draws a mark in the air (an arrow, a circle, an underline) with its own ink, to show where to look |
| Fruit bat *(proposed)* | Upside-down: hangs by its feet from anything and sees it the other way round |
| Chick *(proposed)* | Fluff up: fluffs every feather out into a round ball, twice its size |
| Juno *(proposed)* | Cartwheel: arrives, and leaves, with a cartwheel |
| Lulu *(proposed)* | Puppy eyes: her eyes swell huge, glossy and brimming |
| Red panda *(proposed)* | Stand tall: rears up on its hind legs, arms wide, tail fluffed, to look big |

**Abilities come from the character itself.** An ability is part of the character's body and nature — its spirit — never a prop it holds or an outside object it uses. The chameleon changes its own colour; the octopus draws with its own ink; the fruit bat hangs by its own feet; the red panda rears up on its own legs. A pair of headphones, a card to peek over, a thing to balance or carry are not abilities.

## Main character: Wisp (decided)

The firefly is the natural fit for the main character, because Sparkles’ guide is a small light. The bench drawing is too plain. It needs a heavy rework into a more detailed, sturdier character that holds up under costumes, props and movement.

### Colour

A character has no colours of its own. Every firefly draws with the product’s **primary** and **accent** (`src/design/nix/theme.ts`), and in Sparkles those are the product’s own tokens. The studio header switches the scheme for every character at once, and a custom pair can be picked. *Sparkles* is the product’s light-mode primary and accent, fixed, so a character keeps its colour on both grounds instead of following the lighter dark-mode primary. Deeper and lighter shades are derived from the primary in `studio.css`. **The glow is the one fixed colour**, because it is the firefly’s ability. Never make per-character colourways.

**Clothes** have their own global switch in the header: the accent, a deep primary, stone or charcoal (`CLOTHES` in `theme.ts`, drawn with `C.clothes`). Trims keep the accent. The product’s current accent is a yellow close to the glow, so in the Sparkles scheme accent clothes sit against the light. Which option the product uses is still open.

### Outlines

**Decision: no black outlines.** Shapes are told apart by colour and tone, the way Duolingo’s characters are: flat shapes, no black line around them. A black line also disappears on the dark ground, which is what made the antennae vanish. Where an edge is needed, it is a shade of the part’s own colour, never black:

| Where | Edge |
|---|---|
| The body and limbs, and clothes on them | A translucent dark (`C.line`) that reads as a deeper shade of whatever it lies on; soft on either ground |
| Pale parts that meet a pale ground: wings, Wisp’s head | A mid shade of the product colour (`C.hi`) |
| The glow | Its own deeper amber (`C.glowEdge`) |
| Thin parts drawn as a line: antennae | No outline; the line is drawn in `C.thin`, the body colour on light and a lighter shade on dark |
| Eyes, mouth, brows | Stay dark ink: they sit on the cream face, which is the same on both grounds |

In the rig, `Palette.line` is the outline colour for the body, limbs, clothes and props; `Palette.ink` is kept for the face’s features. The reference drawings and bench animals still use black outlines.

### Wisp

**Wisp is the main character**, in `src/design/nix/firefly-wisp.tsx`. It is the former “True colour” variant. It floats with no legs, has a droplet head, and its body ends in a flame of light. It leaves glowing sparks behind as it flies. The original pale Wisp, Moth, Solid and Curly are dropped.

How it is drawn. These rules also apply to anything added to Wisp later:

| Part | Rule |
|---|---|
| Head | Its colour runs from a light heart to the primary at the rim; the rim is the edge. No outline |
| Highlights | None. No white reflection lines on the head or flame: nothing that depends on where light comes from, so nothing that has to move, fade or flicker when it animates. A shine, if wanted later, is an effect or prop |
| Antennae | Grow from behind the head (drawn before it), in `C.thin`, each tipped with a spark |
| Body, arms | No outline; parts are told apart by colour: the body in `C.mid`, the arms in the primary |
| Hands | Wispy: the forearm tapers like a tendril of smoke and ends in a soft round tip of the same colour. No fingers, no thumb (`hands: "wisp"` in the rig) |
| Wings | Two pairs on their own joints: long upper wings swept up and out, small lower paddles. Frosted (`C.tint`, 82% opaque), with veins and a fixed pattern of spots of varying size in `C.hi` |
| Body and flame | One body turning into light. The body is short and rounded below. The flame starts up inside it in the body’s own colour, so there is no seam at any angle of sway. It pivots where they meet and turns to glow, then amber, below the body. It carries **two rings**, like a firefly’s lantern: fixed anatomy. No edge line on the flame |
| Edges | Only the translucent parts (wings) and the antenna tips keep an edge, and it is a **hairline** (1.2 at figure scale) in the part’s own tone, never black |
| Props | A backpack sits behind the wings and flame, fitted to the short body (`packFit`) |

**Turning, views and flight.** Wisp turns continuously. `src/design/nix/wisp-turn.tsx` is Wisp as a 2.5D puppet: every part (face, antennae, wings, arms, flame) has a place on a simple body in depth, and is projected for any yaw from −90° (left profile) through 0° (front) to 90° (right profile). The face slides round the head and the far eye foreshortens and fades. The wings sweep back in depth, and parts swap in front of or behind the body by depth. The head can lead the body. At 0° it matches the front rig. The turnaround (`wisp-views.tsx`) shows the front rig, the puppet at 40° and 90°, and the back view, plus a slider to scrub the turn.

**How Wisp moves between places** (the rule for the product):

1. At rest, and wherever it arrives, Wisp **faces front**.
2. To travel, it **turns continuously**, head first, to face its way, rising a little as it sets off. It never flips.
3. It **flies side-on** toward where it is going, banking gently, wings beating as two pairs, and leaves sparks where it has been.
4. On arrival it settles and **turns back** to face front.

**Where Wisp appears: the sign-up form only.** It lives in the gutter to the **left** of the form, turned toward it. The demo is `src/design/nix/wisp-form.tsx`.

| Moment | What Wisp does |
|---|---|
| Resting beside a field | Faces the form at about 28°, with an idle bob. Never over a field, never taller than a row |
| Focus moves to another field | Waits a beat (about 90 ms), gathers, then **hops** in a short arc bowed out to the left, eyes on where it is going, wings beating fast, a few sparks left behind. **No turn.** It settles with a slight overshoot. 320–620 ms by distance. A new focus mid-hop retargets from where it is; moves never queue |
| Typing | Turns **further into the field** (about 50°, a little more as the text grows), and its **eyes follow the text** |
| The password field | Once it has landed beside the field, it **turns its back** (right round to 180°, continuously) and stays turned while the password is typed. It turns back to face the form when focus leaves |
| Reduced motion | No travel and no easing: it reappears beside the new field, already facing the right way |

Wisp never reacts to what is typed: nothing for a valid or an invalid entry.

The flight demo plays this across a stage and back. Every frame is a pure function of one loop clock: position, yaw (the head a beat ahead), wing beats and each spark. Under reduced motion it shows one still frame with the trail.

**Wisp, warmer — proposals, not adopted.** `WISP_MAIN` is unchanged. Beside the side characters, Wisp is the only one who is nobody at rest: all cool blue with its only warmth at its tail, a small face low on a perfectly symmetric drop that reads as a logo, a stick body and neck, and no temperament. `src/design/nix/wisp-warm.tsx` (`WISP_WARM`) proposes five answers. Each of the first four changes one thing so it can be judged alone; the fifth combines them. All keep the drop, the two pairs of wings, the ringed flame and the spark trail. The studio shows them next to Wisp as it is, at rest and in every expression.

| Variation | What it changes | Temperament and attitude |
|---|---|---|
| Hearth | Warmth: a small flame in its chest, the same light as its tail, that breathes and brightens with the mood; a peach warmth through the face, fading before the rim; warmer cheeks | Warm-hearted and eager to help; worries it is too small to. Hands held together under its heart |
| Scamp | Attitude: the drop's tip swept into a curl, one antenna bent at a kink, a lopsided smile with a dimple, tongue at the corner when focused | Curious and a bit cheeky, slightly too pleased with itself. Head tipped, one hand up in a hey |
| Moony | Face: big round eyes with warm honey irises, thick ink brows that lift and knit, a bigger mouth that is open at rest | Wears every feeling on its face; cannot keep a secret. Arms a little out, about to tell you something |
| Snug | Softness: a rounder drop, a ruff of fuzz hiding the neck, a rounder body, chunkier arms with bigger tips | Cosy and patient, a homebody. Content, eyes closed in a smile, hands together |
| Wisp · warmer | All four, each turned down | Warm-hearted, curious and a bit cheeky |

None of them is in the turn puppet, the views, the flight or the form: that waits until one, or a mix, is picked into `WISP_MAIN`.

**Wispy directions — reference.** These were drawn from scratch rather than from the droplet. Each floats, puts its light somewhere of its own, and leaves a spark trail. They are kept as inspiration for side characters or later details. Round one is in `src/design/nix/firefly-spirits.tsx`:

| Variant | Shape | Where the light is |
|---|---|---|
| Puff | A cloud: a head of puffs, a cloud body, a trail of puffs thinning out behind | At its core, in the chest, through any outfit |
| Jelly | A jellyfish bell with a frilled rim, and tendrils beneath | At the tip of every tendril |
| Bloom | A bellflower: a crown of petals, a petal skirt, leaf wings | Hanging below the petals like a stamen, a lamp it carries |

Round two is in `src/design/nix/firefly-spirits-2.tsx`:

| Variant | Shape | Where the light is |
|---|---|---|
| Comet | A round head with a mane of light swept back | The mane itself; sparks peel off its end |
| Bubble | A soap-bubble head around a coloured heart; a smaller bubble for a body | A light floating at the core of the body bubble |
| Dandelion | A parachute of filaments over its head, a slim stem | The seed at the bottom |
| Star | A plush five-pointed star with a cream face; no rig arms | Its two lower points |
| Crescent | A small moon whose body curls round from behind its head | The pearl it cradles in the curve |

**Wings move as two pairs.** Where a character has upper and lower wings, the upper pair rides `wingL`/`wingR` and the lower pair `hindL`/`hindR`. The upper pair strokes slowly; the lower pair beats twice to each stroke, half a beat behind. The two pairs are never one piece.

### Reference

Kept as inspiration for the main character or a side character, not as candidates. If one inspires a side character, redraw it as a different species with its own ability.

| Variant | File | Idea worth keeping |
|---|---|---|
| Pip, Wing cases, Plump | `firefly-pip.tsx` | The bean that stands; a glow at its bottom through any outfit; wing cases over flying wings |
| Fuzzy | `firefly-variants.tsx` | Fuzz, a ruff and feathery antennae: the most huggable firefly |
| Chonk | `firefly-bodies.tsx` | A low, wide body in a domed shell; lamps set into the shell |
| Cube | `firefly-bodies-2.tsx` | Everything square; a lit window in the chest |
| Hood | `firefly-bodies-2.tsx` | A cone of a cloak, a floppy hood, light from inside the cloak |

Dropped: Lantern, Spark, Flicker, Nightlight, Bulb, Glowworm, Strider, Flutter, Lampion, Trio; Pip’s per-character colourways; the Pip × Wisp hybrids (Droplet, Flame-top, Comet); Pip · Cap; Wisp · Swirl; the pale Wisp, Wisp · Moth, Wisp · Solid, Wisp · Curly.

The antennae and glow follow the expression: they droop and dim when worried, perk up and brighten when delighted, and one antenna lifts when curious. The rig passes the mood to each character’s parts through `Ctx.mood`.

The original bench firefly stays in `candidates.tsx` for reference. **Next step:** pick one variant, or combine parts of several. Motion and extra poses wait until a variant is chosen.

**The spark trail is the firefly’s ability.** Every Wisp-line character leaves glowing sparks behind as it flies. It is the one thing kept from the bench firefly. It is drawn once, by the rig (`rig/sparks.tsx`), and never painted into a drawing. A character names where its sparks come from with `trail`. The sparks drift down and back from that point, shrink and fade on declared keyframes, and are left behind rather than carried by the body. Stilled, or under reduced motion, they show as a frozen trail. **Every other flourish** (bursts, confetti, celebration effects) is still a separate layer, to be designed later for any character.

Once one is chosen, the main character’s silhouette, palette and ability stay fixed across every context. Only pose, expression and authored wardrobe change. The glow is its signature, not a status.

## Side characters

| # | Character | Ability | Status |
|---|---|---|---|
| 1 | Chameleon | Colour change | **Confirmed.** The design itself can still be reworked |
| — | Otter | (a glowing pebble; too close to the firefly’s glow — needs its own ability) | Backup, no preference |
| — | Red panda | Stand tall *(proposed)* | Candidate, competing |
| 2–6 | Octopus, fruit bat, chick, Juno, Lulu (and the red panda) | See below | **Candidates**, not decided |

### Rules for every side character

- **No outlines, as far as possible.** Parts are told apart by colour and tone alone. A side character's palette sets `line: "none"`, which the rig's clothes and shoes follow too. The chameleon has had its black outlines removed.
- **Its own eyes and its own mouth.** No two characters share either. Each side character has an eye kit (`face.kit`) and a mouth kit (`face.mouthKit`) of its own (`rig/eyes.tsx`): its own eye shape, colour, shine, lids and brows, and its own lips, beak or muzzle, drawn for every expression — neutral, happy, delighted, curious, thinking, focused, worried, oops, wink. The studio shows them side by side under “Eyes and mouths — each character's own”.
- **The ability comes from the character itself** — its body and its nature — never a prop or an outside object.
- **Legible small and on both grounds.** Check the recognition sheet (silhouettes at 96, 48 and 32px, the head at 32, 24 and 16px) on the light and the dark ground.

### What makes a side character loved

Duolingo's cast is loved for something the drawings here were missing: each of them is *somebody* before they do anything. Our candidates had abilities, their own faces and clean shapes, but at rest they stood like mannequins — the same idle stance, arms down, a neutral face, dead level — and they were drawn in flat single tones. The missing quality is **character**: a temperament you can read from across the room, and a finish that makes the shapes feel solid and soft enough to hug. Every side character now has, and every new one must have:

1. **A temperament in one line.** A want and a flaw, not a job: “busy, clever and a little scatterbrained”. It is written first in the character's pitch.
2. **An attitude at rest** (`attitude` in `candidates.tsx`, applied by the rig in the idle pose): its own resting expression, a habitual head tilt, and a stance of its own. Nobody stands neutral and dead level. Lily slouches; Duo leans in.
3. **Asymmetry and one imperfection.** An arm that is always up, a head that tips, two strands that won't lie down, a hairline crack in a shell. Perfect symmetry reads as a logo; a small flaw reads as a friend.
4. **Form, in two tones.** Each main part is drawn in its own shade first, then its colour over it, offset up and to the left, so a crescent of shade sits lower right. Hair casts a shadow on the brow; hair and fluff catch a shine. Still no outlines, and no black: the shade is a tone of the part's own colour.
5. **Chunky, soft shapes.** Thicker limbs and bigger hands and feet (`CHUNKY`): rounder reads as softer and friendlier at small sizes.
6. **Species-true detail, a little of it.** The things that make it *that* animal: a flying fox's golden collar and dog's nose, a chameleon's rosettes and scaled belly, the octopus's suckers large to small, the red panda's ear fluff, dark mask and whisker dots. Enough to be precise; never so much it stops reading at 32px.
7. **Its own face and its own ability** — the rules above still hold.

### The candidates

Seven characters are in the running for the six places: the chameleon (confirmed) and six more.

| Candidate | Temperament | At rest | Ability | Refined with |
|---|---|---|---|---|
| **Chameleon** | Shy, thoughtful, easily flustered: it blushes, literally, and would rather blend in | Its two eyes look two ways at once; a hand at its chest while it thinks; head tipped | Colour change | Two-tone head and casque, a scalloped crest, shaded turret eyes, rosettes, a scaled jaw and belly, nostrils |
| **Octopus** | Busy, clever, a little scatterbrained: six arms, six things on the go | Happy; one arm always up in a wave it never finishes; mantle tipped | Ink | Two-tone mantle and arms, suckers large to small, a paler underside, more spots |
| **Fruit bat** | A night owl: dozy and droll by day, awake at the wrong times, sees things differently | Heavy-lidded, head on one side, hands folded | Upside-down | A flying fox's golden collar, a soft muzzle and dog's nose, ridged ears, two-tone wings with thumb claws |
| **Chick** | Brand new to everything: earnest, eager, easily overwhelmed, proud of every small thing | Gazing up at you, wide-eyed, head on one side | Fluff up | Two-tone fluff, cheek tufts that stick out, feather marks, a crack in its shell |
| **Juno** | A big-hearted show-off: first to try, first to cheer someone else on | Hands on hips, a grin, head tipped | Cartwheel | Curl texture in her puff, freckles, two-tone skin, the fringe's shadow on her brow |
| **Lulu** | A small schemer with a big face: smug when plotting, huge-eyed when she wants something, never as sneaky as she thinks | The smug look, hands clasped sweetly in front | Puppy eyes | A shine across her hair, two strands that won't lie down, a bow on her side pony, the fringe's shadow |
| **Red panda** | Gentle, cosy, easily startled: it would rather be curled up in its tail | Paws up at its chest, a small contented smile | Stand tall | Two-tone head and ears, ear fluff, a darker mask round the eyes, whisker dots, a shaded, dark-tipped tail |

The eyes and mouth of each are as described in their files and on the studio's eyes-and-mouths sheet.

**Removed:** the jellyfish; every other girl (Mimi, Pia, Nell, Koko, Tami, Suki, Rue, Momo, Tess, Bibi, Wren, Amara, Sloane) and the lamb, axolotl, cloud, flower, squid, mushroom, poodle and pufferfish.

**Reference — other animals** (shown in the studio, not candidates): the penguin (`SIDE_REFERENCE` in `side-candidates.tsx`), the otter and the bench's original firefly.

**Anya.** Lulu takes the spirit of Spy × Family's Anya — a tiny girl with a big head and huge, rubbery gag faces — and none of her look. Anya is a copyrighted character; a drawing of her cannot move into Sparkles and would fail the studio's “Not taken” test. So: no pink hair, no black cone hair clips, no green eyes, no school uniform.

**Next step:** choose six from the eight (the chameleon is one), then refine each.

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
