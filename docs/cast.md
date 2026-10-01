# Cast

Target shape, after Duolingo: **one main character and six side characters**. The product is known by the main character. Each side character has a stable identity of its own and never competes with the main one.

**Nothing is final.** The drawings from Sparkles’ `/design/nix` bench are starting points, not finished characters. The 52 practice-item characters, the human candidates, Mabel and the koala are not part of the cast.

## One ability per character

Every character has **one special feature or ability that no other character in the cast has**. It is what the character is remembered by, and what it can do on screen that no one else can. Two characters must never share an ability, and a new candidate needs one before it is drawn.

| Character | Ability |
|---|---|
| Firefly (Wisp line) | Glow, and the sparks it leaves behind as it flies |
| Chameleon | Colour change: it takes the colour of what it lands on, including semantic colours |
| Fruit bat | Upside-down: hangs by its feet from anything and sees it the other way round |
| Chick | Fluff up: fluffs every feather out into a round ball, twice its size |
| Juno | Cartwheel: arrives, and leaves, with a cartwheel |
| Lulu | Puppy eyes: her eyes swell huge, glossy and brimming |

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
| Scamp | Attitude: the drop's tip swept into a curl, one antenna flopped over in a soft curl that bounces, a lopsided smile with a dimple, tongue at the corner when focused | Curious and a bit cheeky, slightly too pleased with itself. Head tipped, one hand up in a hey |
| Moony | Face: big round eyes with warm honey irises, thick ink brows that lift and knit, a bigger mouth that is open at rest | Wears every feeling on its face; cannot keep a secret. Arms a little out, about to tell you something |
| Snug | Softness: a rounder drop, a ruff of fuzz hiding the neck, a rounder body, chunkier arms with bigger tips | Cosy and patient, a homebody. Content, eyes closed in a smile, hands together |
| Wisp · warmer | All four, each turned down | Warm-hearted, curious and a bit cheeky |

**The warmer's antennae** (and Scamp's) are soft stalks in three segments on their own joints (`antL` → `antMidL` → `antTipL`, and R; `rig/skeleton.ts`). The left stands up; the right flops over in a smooth curl, not a kink. In every pose each segment follows through, turning a little later and further than the one it hangs from (`secondary` in `rig/poses.ts`). At rest they have a habit of their own (`attitude.motion`, laid over the idle pose on its clock): once a loop the left one twitches, and a beat later the flopped one's tip flicks up and springs back in shrinking bounces. Declared keyframes (`rotAt`); stilled or under reduced motion they hold the first frame.

**Wisp · Ribbon wings — proposal, not adopted.** `WISP_MAIN` is unchanged. The first Wisp (bench `firefly-bodies.tsx`, commit `1cc3b0d`) had one pair of **ribbon wings** that left the shoulders, swelled out and trailed down past the body to a point, like a scarf or a ghost's hem; they matched the drop head and the flame, so every outline tapered to a wisp. “Finalise Wisp” (`43969ae`) replaced them with the two pairs of spotted wings, which read as butterfly or fairy wings. `src/design/nix/wisp-ribbon.tsx` (`WISP_RIBBON`) puts the ribbons back on today's Wisp and on Wisp, warmer, with nothing else changed, redrawn to today's rules: `C.tint` at 82%, a hairline `C.hi` edge and fold line, no ink outline. A ribbon is one pair, on `wingL`/`wingR` only, so adopting it would mean changing the two-pair rule for Wisp.

The studio gives it its own page (**Wisp · Ribbon**, `#/ribbon`): a clone of the Wisp page with the ribbons as the main character, shown in the recommended pairings (Wisp · Ribbon, Warmer · Ribbon, and Warmer · Ribbon, no ruff). Every figure on that page wears the ribbons — the warmer proposals, the eye styles and the acting (`WISP_WARM_RIBBON`, `WISP_EYES_RIBBON`), and the turn puppet, back view, flight and form, which read `WingStyleContext` (`wisp-turn.tsx`). In the puppet the ribbons flap with the upper pair's beat and sweep back in depth like the other wings, so side-on they stream behind. **Warmer · Ribbon, no ruff** (recommended) is the warmer slimmed back to Wisp's line so the ribbons carry it: no ruff, Wisp's own drop with the curl (`CURL`) instead of the rounder one, and Wisp's narrow body, neck and arms instead of Snug's. It keeps the warmer's temperament: the chest flame and the warmth in the face, the curl, the stalks with the flopped antenna, honey eyes and talking brows, the lopsided smile, the tipped head and the hey, and the alive idle. At 48 and 32px its silhouette keeps a neck and the ribbons flare to points, where the ruffed warmer reads as one rounder mass. It is drawn facing front only; the puppet, flight and form on that page still show plain Wisp · Ribbon.

**Ribbon finishes — proposals** (`WISP_RIBBON_FINISHES`, on Warmer · Ribbon, no ruff; facing front only):

| Finish | What changes |
|---|---|
| No outline · dots | The hairline edge goes. The ribbon is shaded instead — `C.soft` at the shoulder, frost (`C.tint`) through the middle, `C.soft` again at the point — so its own colour is its edge on both grounds. Five fixed dots in `C.hi` |
| No outline · sparkles | The same shaded ribbon with four small fixed four-point stars in the glow's colour: the firefly's light caught in its wings. Never animated, never a highlight |
| Spirit | The ribbons dissolve: longer, the tails curling out like smoke, a thinner strand trailing inside each, fading from `C.soft` through frost to a last `C.hi` wisp and then nothing. A few motes fade with them. Every edge below the head now dissolves |

**Spirit — variations** (`WISP_SPIRITS`; `SpiritForm` in `wisp-ribbon.tsx`). The spirit as drawn and **Clean** (one ribbon each side, no strand, no motes) are kept; long tails, curl in, frayed and starry motes were tried and dropped. Each of the rest adds one distinctive thing to Clean:

| Variation | What it adds | Reads at 48 / 32px |
|---|---|---|
| Glow tips | The mist turns the glow's gold as it fades: its light leaking out through the ribbons. The only Wisp whose wings carry its ability | Colour only; silhouette as Clean |
| Lantern bands | Two faint amber bands across each ribbon (clipped to it), echoing the flame's rings | Colour only; silhouette as Clean |
| Ghost hem | Each ribbon ends in a small, tapered scalloped hem, like a ghost's sheet | Slightly; the scallops merge |
| Swept up | The ribbons rise above the shoulders, nearly to the cheeks, before they fall | Yes: the widest shoulders of any Wisp |
| Breeze | The right ribbon is blown out and its tail lifted: an asymmetry with the curl and flopped antenna | Yes: the most distinctive silhouette |

Dropping the wing edge for these finishes departs from Wisp's rule of a hairline edge on the wings; it applies to the proposals only.

The Wisp page (`#/wisp`) still shows Wisp as drawn, with two pairs; the side characters have their own page (`#/side`).

**Wisp's own expressions.** The shared nine cannot say mischief, surprise or clowning. `MORE_MOODS` (`rig/face.tsx`) adds five for the main character only: sly, silly, surprised, proud, party. Side characters' kits are not asked to draw them.

**Eye styles for the warmer — proposals** (`src/design/nix/wisp-eyes.tsx`, shown as `WISP_EYES`). One acting table (`act`) says what an eye does in each of the fourteen moods; each style only decides how an eye and a brow are drawn. Lids cut the eye instead of being painted over it, so every style holds on the warm face and on both grounds.

| Style | What it is | Strongest at |
|---|---|---|
| Honey | Dark eyes, honey irises, two shines (as drawn) | Warm, sweet; weaker at side-eye |
| Bean | White eyes, a roaming pupil, chunky brows | The widest range: side-eye, cross-eyed, a pinprick of shock. Closest to Duolingo's look — keep it clear of Duo |
| Gumdrop | Solid glossy eyes that change shape | Reads smallest; sparks at a party |
| Lidded | White eyes, small pupils, heavy lids in its own colour | Sly, proud, professional; rests cooler |
| Starry | Dark eyes with a spark of its own light for a catchlight | Ties the eyes to the glow; the eye becomes a spark at a party |

The eye style is between **Bean and Gumdrop**; the user will decide later. Honey, Lidded and Starry stay as reference.

**Wisp, warmer — acting (proposals).** What kept Wisp laid back, and what the acting does about it:

| What was missing | What the warmer does now |
|---|---|
| It floated level and centred | It leans; it sinks and peeks round an edge; it is never dead level at rest |
| One slow, even beat (a 1.4px bob over 4 s, every move eased the same) | Holds, then something sudden: snaps, drops and overshoots (`keys` with per-segment easing from `EASE` in `rig/motion.ts`) |
| It always looked straight at you | Its eyes wander — a side-glance, a look up — and snap back; it gets caught looking |
| It never changed shape | It gathers into a squash before it pops, stretches in surprise, squashes as it lands |
| Its light only dimmed and brightened with the mood | It plays with it: tucks its flame in and goes dark, hiccups flashes of it, flares |
| Its job was only polite | A few harmless gags with a place on the sign-up form (below) |

At rest the warmer now leans in, drifts up and hangs, then drops with a squash and pops back with an overshoot (`ALIVE_IDLE`), while its stalks twitch and boing. The acts are in `src/design/nix/wisp-acts.tsx` (`WISP_ACTS`); each is declared keyframes on one clock, and its face changes on that same clock (`ActFigure` reads the expression off the act's own animation time). Stilled or under reduced motion each holds its first frame and a resting face.

| Act | What happens | Where it could play on the sign-up form (proposed) |
|---|---|---|
| At rest — never still | The alive idle, with glances away and back | Beside a field nobody is typing in |
| Surprise take | Gathers, pops up stretched with arms thrown up and wings buzzing, hangs, lands with a squash, laughs at itself | The first time focus lands in the form |
| Sneak peek | Leans right over the form's edge with side-eye, freezes when caught, snaps back upright looking innocent | While the learner reads, before anything is typed |
| Hiccup | Off-beat jolts, each with a stretch and a flash of its glow; a silly face after the last | Now and then while nothing is happening |
| Lights out | Tucks its flame in with its hands and goes dark, then throws its arms wide and flares | Once, when the last field is filled in |
| Password — eyes shut | Ducks its head into its ruff, hands over its eyes, antennae drooped, giggles; pops back out | An alternative to turning its back; it never peeks |

None of them reacts to what is typed, and none says anything about a valid or an invalid entry. "Lights out" plays on the form being complete, not on the entries being right. These are proposals: the form's rules (hops, turning into the field, turning its back at the password) are unchanged until chosen.

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

**App icon — proposals.** Six marks made from Wisp's shape, not the full character, the way Duolingo's icon is Duo's head (`src/design/nix/wisp-logo.tsx`, `LOGOS`; shown in the studio as “Wisp — app icon”). Each has an app-icon drawing and a simplified one for 32px and under (favicon, tab, notification): no mouth, rings or wing spots, eyes without shines, nothing thinner than a pixel at 16px. Wisp's drawing rules hold: no black outlines, no highlights, the product's primary, the glow as its own colour. They draw with the scheme's tokens, so the header recolours them; `npm run logos` writes them in the Sparkles scheme to `docs/logo/` as `<id>.svg` and `<id>-favicon.svg`, with `sheet.png` showing all six at 220, 64, 32 and 16px on both grounds.

| Mark | What it is | Strong / weak |
|---|---|---|
| Drop | The head front on: droplet, eyes, smile, two glowing antennae, on a pale tile | The face is the icon; reads at 16px as a blue drop with two yellow dots |
| Figure | The whole figure reduced: head, wings, ringed flame, on the primary | The only one that says firefly; the head is small at 16px, the flame carries it |
| Flight | Side-on, leaning into its way, flame streaming, sparks behind, on a night tile | Motion and the spark trail; one eye, so less face |
| Glow | The drop and antennae as a primary silhouette in its own yellow light, pale eyes | Boldest and clearest at 16px; least character large. The yellow field is the glow, not a status hue |
| Peek | The top of the head rising from the bottom edge, looking up, on the deep primary | Most personality; cropped, so at 16px it is a blue hill with eyes |
| Ember | Head and flame as one shape: the drop's colour runs into light and curls off | An abstract mark that is still Wisp; works without the face as a wordmark's dot |

None is chosen. The eye style is still between Bean and Gumdrop; the marks use plain ink eyes until it is decided.

**Drop and Glow — variations** (`LOGO_VARIANTS`; `docs/logo/sheet-variants.png`):

| Mark | What changes |
|---|---|
| Drop · Night | Drop on a night tile, sparks haloed, a soft light rising from below: for dark home screens and dark mode |
| Drop · Scamp | One antenna flopped over in a curl, a wink, a lopsided grin: the asymmetry makes the silhouette only Wisp's |
| Drop · Flat | Two flat tones (mid, with its own deeper shade underneath) on white: for print and merchandise |
| Drop · Lit | The head warms toward its chin as if its flame were just below the frame, on the deep primary |
| Glow · Halo | The primary silhouette in a disc of its own light on a night tile |
| Glow · Scamp | Glow with the flopped antenna and a wink |
| Glow · Light | Reversed: a yellow drop with ink eyes on the primary. A mark only; the character's body stays in the primary |
| Glow · Round | In a circle, inside the inner 80% safe zone: for avatars and launchers that cut a circle |

**What the platforms require.** An app icon is solid: the App Store icon has no alpha; iOS 26 icons are layered in Icon Composer and the system adds the glass, so each layer is supplied flat and opaque; an Android adaptive or a PWA `maskable` icon needs an opaque background with the mark inside the inner 80%; an `apple-touch-icon` with transparency turns black on iOS. Only the browser favicon may be transparent, and then the mark must hold on both a light and a dark tab, which a drop in `C.mid` does. So the tile stays; Glow · Round shows the safe-zone layout.

**Wordmark — candidates** (`docs/logo/wordmarks.png`, “sparkles” beside Drop): Fraunces 600 with SOFT 100 (already the product's display face), Fredoka 600, Nunito 800, Baloo 2 700, Lexend 600, Quicksand 700. All are on Google Fonts under the OFL. None is chosen.

## Side characters

| # | Character | Ability | Status |
|---|---|---|---|
| 1 | Chameleon | Colour change | **Confirmed.** The design itself can still be reworked |
| — | Otter | (a glowing pebble; too close to the firefly’s glow — needs its own ability) | Backup, no preference |
| — | Red panda | Stand tall | **Dropped** — not expressive enough, no special character; kept as reference |
| 2–5 | Fruit bat, chick, Juno, Lulu | See below | **Chosen** |
| 6 | — | — | **Open** — to be chosen with the cast as a whole, once the six are designed as a connected world |

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

Five side characters are chosen — the chameleon, the fruit bat, the chick, Juno and Lulu — and the sixth place is open.

| Candidate | Temperament | At rest | Ability | Refined with |
|---|---|---|---|---|
| **Chameleon** | A small, fierce, loyal best friend who says everything with its face and hands — mimes, points, sulks, cheers; brave beyond its size, and it blushes, literally, when caught caring | One hand on its hip, the other up mid-gesture, its two eyes looking two ways; head tipped | Colour change | Redrawn in the spirit of the chameleon in *Tangled*, not its look: a rounder head rising to a low casque swept back to one side, a crest of small bumps, big turret eyes bulging past the head with an amber ring round each pupil, a pale scaled throat, a pear-shaped body with a scaled belly and pale flank stripes, two-toed grips on hands and feet (`hands: "tong"`), short bowed legs, a thick tail coiled tight with pale rings. Violet, not green |
| **Fruit bat** | A night owl: dozy and droll by day, awake at the wrong times, sees things differently | Heavy-lidded, head on one side, hands folded | Upside-down | A flying fox's golden collar, a soft muzzle and dog's nose, ridged ears, two-tone wings with thumb claws |
| **Chick** | Brand new to everything: earnest, eager, easily overwhelmed, proud of every small thing | Gazing up at you, wide-eyed, head on one side | Fluff up | Two-tone fluff, cheek tufts that stick out, feather marks, a crack in its shell |
| **Juno** | A big-hearted show-off: first to try, first to cheer someone else on | Hands on hips, a grin, head tipped | Cartwheel | Curl texture in her puff, freckles, two-tone skin, the fringe's shadow on her brow |
| **Lulu** | A small schemer with a big face: smug when plotting, huge-eyed when she wants something, never as sneaky as she thinks | The smug look with one small fang, hands pressed together under her chin — all sweetness, which is how you know | Puppy eyes | Two stray strands that act: curled when plotting, tall when delighted, hooked into a question when curious, flopped when worried; rosy cheeks always and blush marks when she is pleased with herself; a shine across her hair, a bow on her side pony. Her puppy eyes are drawn on her face now (`headFx`), so they move with her head |

The eyes and mouth of each are as described in their files and on the studio's eyes-and-mouths sheet.

**Removed:** Sunny and Poppy; the jellyfish; every other girl (Mimi, Pia, Nell, Koko, Tami, Suki, Rue, Momo, Tess, Bibi, Wren, Amara, Sloane) and the lamb, axolotl, cloud, flower, squid, mushroom, poodle and pufferfish.

**Reference — other animals** (shown in the studio, not candidates): the red panda (dropped: not expressive enough, no special character of its own), the octopus, the penguin (`SIDE_REFERENCE` in `side-candidates.tsx`), the otter and the bench's original firefly.

**Tangled.** The chameleon takes the spirit of the chameleon sidekick in *Tangled* and none of its look — it is violet, not green, with its own casque and eyes. The same “Not taken” test applies.

**Humans need to act.** What was missing from the earlier people was acting: their faces changed shape but not meaning. Any person in the cast should reach the bar the Rapunzel-inspired studies (since removed) set — brows that carry half of every expression, eyes that do different things from each other (a squint and a widen), mouths with business (a bitten lip, a tongue poked out, a lopsided grin), and hair, freckles or a paint smudge that tell you who she is before she moves.

**Anya.** Lulu takes the spirit of Spy × Family's Anya — a tiny girl with a big head and huge, rubbery gag faces — and none of her look. Anya is a copyrighted character; a drawing of her cannot move into Sparkles and would fail the studio's “Not taken” test. So: no pink hair, no black cone hair clips, no green eyes, no school uniform.



**Removed from the sixth place:** five concepts — Fizz (frog), Clover (goat), Tuck (tortoise), Bit (robot), Remy (boy). None was liked. The next ideas come as a connected cast, not one-offs: how the characters know each other is decided before any is drawn.

### Lessons from Duolingo

What the Duolingo cast does that this studio's first rounds did not (a summary of the conversation that led to the rules above):

- **One style, many silhouettes.** Every character is built from the same kit of simple, rounded geometric shapes in flat colour with a shadow tone, and big heads on small bodies — but each has a silhouette you could name in black (Lily's hair, Eddy's height, Oscar's moustache, Duo's round body).
- **An archetype with an attitude.** Each is a recognisable type pushed to a caricature, and each is *somebody* at rest: Lily bored, Zari bursting, Oscar pompous, Duo intense. Personality is in the posture before anything moves.
- **They talk.** In lessons the characters say the sentences, with their mouths moving to the words and their own voices — the strongest single hook. Here speech must stay fixed copy (`docs/brief.md`); lip-sync to fixed lines is still open to us.
- **They are alive between events**: breathing, blinking, glancing — and they react in real time, because each is a state machine (idle, talking, reacting) rather than a set of clips.
- **Animation principles, not just motion**: anticipation before an action, overshoot and settle after, squash and stretch, reactions under a second, timed to a sound. The rig now has them (`rig/motion.ts`): `EASE` (overshoot, anticipate, snap, settle), `jump` (crouch, stretch up, squash on landing, rebound — volume kept), `pop` (squash, stretch, overshoot, settle — the correct beat), `sag` (sink, hold, lift with a small overshoot — the gentle incorrect beat) and `action` (wind-up opposite, snap past the mark, settle). The cheer jumps, the wave overshoots, and every practice act that only breathed now pops on correct and sags on incorrect.
- **A world**: the characters know each other, have running jokes and stories; the absurd sentences are written for them.
- **Emotional stakes.** Duo's cast makes you care: the characters want things, need things from each other and from you, and you feel something when you let them down or come through. That is part of why they are loved, and it is **in scope for Sparkles**. An earlier version of this file said the brief rules it out; it does not, and that was wrong. Stakes here come from the characters — their wants, their relationships with each other and with the learner, their running stories — not from pressure. What the brief does bound is narrower: the practice reactions themselves (three events, the same reaction the first time and the fiftieth, gentle on an incorrect answer, never a scold). Any stake that would need a reaction to a streak, a score or a session is a change to those bounds, and belongs in Sparkles, not here.

## Practice states

Each side character reacts while a learner answers a question and to the answer, in four states, with **five variants each** so the reaction is never the same twice in a row: 120 acts in all. They are data in `src/design/nix/side-states.tsx` (`PRACTICE`) and play in the studio under “Practice states”.

| State | When |
|---|---|
| Still writing | The question is up and the learner is still writing |
| Correct | The answer is right |
| Incorrect | The answer is wrong — always gentle, never a scold |
| Partly correct | Some of it is right: nearly |

Every character mixes three kinds of variant: **its own feature** (what only it has — the chameleon's colour, the bat's hanging and ears, the chick's shell and fluff, Juno's cartwheel, Lulu's puppy eyes and strands, the red panda's tail and standing tall), **face and body** acting, and **a prop**. Motion is the rig's declared joint keyframes on one clock; whole-figure moves and props are declared CSS keyframes (`.fx-*` in `src/styles/studio.css`); everything holds still under reduced motion.

**No two characters share an action or a prop.** Facial expressions may repeat; nothing else does. The ledger, so a new variant can be checked against it:

| Character | Body actions | Props |
|---|---|---|
| Chameleon | chin tap, hum and sway, grip clap, fist bump, shrug, so-so hand, hand over a giggle | hourglass, party horn, eraser, puzzle piece |
| Fruit bat | doze, foot tap, shimmy, hug itself, scratch its head, tap its temple, slow wink, count on its fingers | book, mango, cup of tea, magnifying glass |
| Chick | on tiptoe, rock on its heels, bounce, wobble, sigh and deflate, head tilts, lean in | pencil, balloon, pillow, glass half full |
| Juno | arms crossed, thumbs up, fist pump, high five, shake it off, deep breath, kneel, roll shoulders, “this close” pinch, point | water bottle, pom-poms, towel, relay baton |
| Lulu | hold her breath, peek through fingers, rub her hands, peace signs, blow her fringe, pat her own head, tap her nose, scrunch then grin | peanut, lollipop, sticky note, half a cookie |
| Red panda | slow blink, knead its paws, wave both paws, bow, paws on its heart, wash its face, “this much”, sniff the air | bamboo, autumn leaf, blanket, kite |

**Against the brief.** `docs/brief.md` allows three practice events — correct, incorrect (gentle), level unlock — “and no fourth”, and says that mid-item the guide is absent and the slot is the practice character's. “Still writing” and “partly correct” are new events, and these side characters would be reacting mid-item. This was asked for here; it has to be reconciled with Sparkles before these states move back. The other bounds still hold: reactions do not escalate (a variant is picked, never built up), the chameleon's green is always paired with words or a status mark, no other character turns a status colour, and incorrect is never a scold. No prop is a reward (no medals, crowns or trophies).

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
