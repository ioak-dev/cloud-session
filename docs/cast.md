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

**Decision: Wisp's wings are the ribbons.** The main character is Wisp on one pair of ribbon wings (Clean), with the Core tail and Snug's thicker arms: `CLEAN_PICK` in `src/design/nix/wisp-clean.tsx`, on the studio's **Wisp** page (`#/wisp`). Wisp on two pairs of spotted butterfly wings (`WISP_MAIN`) is kept as an **alternate main character, for reference**, on the **Wisp · Butterfly (reference)** page (`#/butterfly`). The old `#/ribbon` link opens the Wisp page. Everything below that is not about the wings still holds for both; the wing rules are the ribbons' (see “Wisp · Ribbon wings”).

**Wisp is the main character**, in `src/design/nix/firefly-wisp.tsx` (the body, head, flame and face; the wings are the ribbons in `wisp-ribbon.tsx`). It is the former “True colour” variant. It floats with no legs, has a droplet head, and its body ends in a flame of light. It leaves glowing sparks behind as it flies. The original pale Wisp, Moth, Solid and Curly are dropped.

How it is drawn. These rules also apply to anything added to Wisp later:

| Part | Rule |
|---|---|
| Head | Its colour runs from a light heart to the primary at the rim; the rim is the edge. No outline |
| Highlights | None. No white reflection lines on the head or flame: nothing that depends on where light comes from, so nothing that has to move, fade or flicker when it animates. A shine, if wanted later, is an effect or prop |
| Antennae | Grow from behind the head (drawn before it), in `C.thin`, each tipped with a spark |
| Body, arms | No outline; parts are told apart by colour: the body in `C.mid`, the arms in the primary |
| Hands | Wispy: the forearm tapers like a tendril of smoke and ends in a soft round tip of the same colour. No fingers, no thumb (`hands: "wisp"` in the rig) |
| Wings | One pair of ribbons on `wingL`/`wingR` (Clean, `wisp-ribbon.tsx`): no outline, shaded from `C.soft` at the shoulder through frost to nothing at the tips, the tails drifting like smoke. The alternate (butterfly) Wisp: two pairs on their own joints: long upper wings swept up and out, small lower paddles. Frosted (`C.tint`, 82% opaque), with veins and a fixed pattern of spots of varying size in `C.hi` |
| Body and flame | One body turning into light. The body is short and rounded below. The flame starts up inside it in the body’s own colour, so there is no seam at any angle of sway. It pivots where they meet and turns to glow, then amber, below the body. It carries **two rings**, like a firefly’s lantern: fixed anatomy. No edge line on the flame |
| Edges | Only the translucent parts (wings) and the antenna tips keep an edge, and it is a **hairline** (1.2 at figure scale) in the part’s own tone, never black |
| Props | A backpack sits behind the wings and flame, fitted to the short body (`packFit`) |

**Turning, views and flight.** Wisp turns continuously. `src/design/nix/wisp-turn.tsx` is Wisp as a 2.5D puppet: every part (face, antennae, wings, arms, flame) has a place on a simple body in depth, and is projected for any yaw from −90° (left profile) through 0° (front) to 90° (right profile). The face slides round the head and the far eye foreshortens and fades. The wings sweep back in depth, and parts swap in front of or behind the body by depth. The head can lead the body. At 0° it matches the front rig. The turnaround (`wisp-views.tsx`) shows the front rig, the puppet at 40° and 90°, and the back view, plus a slider to scrub the turn.

**How Wisp moves between places** (the rule for the product):

1. At rest, and wherever it arrives, Wisp **faces front**.
2. To travel, it **turns continuously**, head first, to face its way, rising a little as it sets off. It never flips.
3. It **flies side-on** toward where it is going, banking gently, its ribbons beating as one pair (the alternate's wings as two pairs), and leaves sparks where it has been.
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

**Wisp · Ribbon wings — adopted.** These are now the main character's wings; `WISP_MAIN`, with two pairs, is the alternate main character (reference). The first Wisp (bench `firefly-bodies.tsx`, commit `1cc3b0d`) had one pair of **ribbon wings** that left the shoulders, swelled out and trailed down past the body to a point, like a scarf or a ghost's hem; they matched the drop head and the flame, so every outline tapered to a wisp. “Finalise Wisp” (`43969ae`) replaced them with the two pairs of spotted wings, which read as butterfly or fairy wings. `src/design/nix/wisp-ribbon.tsx` (`WISP_RIBBON`) puts the ribbons back on today's Wisp and on Wisp, warmer, with nothing else changed, redrawn to today's rules: `C.tint` at 82%, a hairline `C.hi` edge and fold line, no ink outline. A ribbon is one pair, on `wingL`/`wingR` only; the two-pair rule now applies only to the alternate (butterfly) Wisp.

On the studio's **Wisp** page (`#/wisp`, formerly the separate Wisp · Ribbon page) every figure wears the ribbons in the chosen variant, **Clean**. It applies to the whole page — the main character and its turnaround, back view, flight and form (`WingStyleContext` and `RibbonFormContext` in `wisp-turn.tsx`), the warmer proposals, the eye styles and the acting — so every ability and possibility of Wisp can be judged on Clean. In the puppet the ribbons flap with the upper pair's beat and sweep back in depth like the other wings, so side-on they stream behind. Everything is drawn with no outline: the colour is the edge (`C.soft` at the shoulder, frost `C.tint` through the middle, fading to nothing). One ribbon pair rides `wingL`/`wingR` only.

**Ribbon variants** (`RIBBON_VARIANTS` in `wisp-ribbon.tsx`). **Clean is chosen** and is the main character's. Glow tips and Spirit move to the References page (`#/references`) as reference. Dots, sparkles, lantern bands, ghost hem, swept up and breeze were tried and dropped.

| Variant | What it is |
|---|---|
| Clean | One ribbon each side, fading to nothing, nothing inside it. Its tails sway slowly (`smoke: "calm"`) and soft frost puffs leave the tips |
| Glow tips | Clean, but the mist turns the glow's gold as it fades: its light leaking out through the ribbons, and a little of it drifting off each tip as soft gold puffs. The tails sway as Clean's do. The only Wisp whose wings carry its ability |
| Spirit | A thinner strand trailing inside each ribbon, and a few `C.hi` motes rising slowly through it. The trailing edges drift on their own like smoke (`smoke: "full"`), and soft frost puffs peel off each tip, drift out and up, swell and thin to nothing |

**The drift** (`smoke` in `wisp-ribbon.tsx`). On top of the wing's flap, each ribbon's tail moves on its own: the drift grows from nothing at the shoulder to full at the tip, and runs down the ribbon as a wave (a point's phase follows its height), so the tip lags the middle and the tail rolls and curls instead of swinging stiff, while an anchor and its handles move together and the edge stays smooth. Each point turns a small loop with a second beat at twice the speed, and the tail breathes wider and narrower. Each ribbon and strand has its own seed; one 8 s loop. Spirit drifts wide and lags far; Clean and Glow tips only sway. The puffs ride the tip as it drifts, so the smoke always leaves from the end. The puppet (turn, flight, form) drifts the same way but draws no puffs. Every term is zero at rest, so a stilled figure shows the drawing as drawn; the figure's motion pauses the drift off screen, and under reduced motion nothing drifts and the puffs are gone.

**The smoke's colour** (`--char-smoke` in `studio.css`) is set per ground so it is seen on both and never competes with the glow and the sparks: on light, a mid tint of the product colour (42%) peaking at 0.5 opacity, so it shows on the pale ground; on dark, a paler tint (30%) held to 0.38, so it does not shine. It stays smaller and fainter than a spark's halo. Glow tips' puffs keep the glow's gold.

**Clean — proposals** (`wisp-clean.tsx`, on the Wisp page; tail, head and arms; front only, the puppet still draws Clean). Each changes one thing on Clean.

| Proposal | What changes |
|---|---|
| Lantern (tail) | Lit like a real firefly's lantern, where only the last segments light: the segment above the first ring dims to amber, the segment between the rings is the palest and brightest. The rings stay |
| Core (tail) | A paler tongue inside the flame, narrowing into its curl, as a flame is palest at its heart. Fixed anatomy, not a highlight: it follows the flame's shape, never the light's direction |
| Candle (head) | The drop's tip rises a few units taller and leans to Wisp's left with a soft S, as a candle's flame does in still air. The bulb and face are unchanged |
| Dewdrop (head) | The point goes: a short, rounded tip with straight flanks and a fuller drop below, a drop of light about to fall. Close to Snug's rounder drop; judge them side by side |
| Snug arms (arms) | Snug's limb widths (upper arm 11.5, forearm 11, hand tip 8.4) on Clean's own frame: Wisp's joints and slim torso, so only the arms change. Gestures read from further away; Wisp's stick arms are its weakest part at 32px |

**Picked on Clean: the Core tail and Snug arms; the head stays the drop** (`CLEAN_PICK` in `wisp-clean.tsx`). It is the main character on the Wisp page, and the turn puppet, back view, flight and form there draw the same (`wisp-turn.tsx`, `wisp-views.tsx`, when the wing style is `ribbon`). The Wisp · Butterfly (reference) page is unchanged.
- **Core over Lantern and the current tail**: depth along the flame rather than bands across it; Lantern's dim amber band drew a seam where the body turns into the flame, against the no-seam rule. Core disappears at 32px, so it refines the larger figure only.
- **The drop head over Candle and Dewdrop**: the drop is Wisp's most recognisable shape and the app icon's. Candle's taller tip crowds the antennae at small sizes and overlaps Scamp's curl; Dewdrop loses the flame's point and sits close to Snug's drop.
- **Snug arms over Wisp's stick arms**: the stick arms were the first thing lost at small sizes; Snug's widths read at 48px, on Wisp's own joints and slim body, so the silhouette and the taper are unchanged.

Lantern, Candle and Dewdrop stay on the Wisp page beside Clean as it was, for comparison.
