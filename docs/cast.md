# Cast

Target shape, after Duolingo: **one main character and six side characters**. The product is known by the main character. Each side character has a stable identity of its own and never competes with the main one.

**Nothing is final.** The drawings from Sparkles’ `/design/nix` bench are starting points, not finished characters. The 52 practice-item characters, the human candidates, Mabel and the koala are not part of the cast. The side characters are the club at the Observatory on the hill (`docs/world.md`).

## One ability per character

Every character has **one special feature or ability that no other character in the cast has**. It is what the character is remembered by, and what it can do on screen that no one else can. Two characters must never share an ability, and a new candidate needs one before it is drawn.

| Character | Ability |
|---|---|
| Firefly (Wisp line) | Glow, and the sparks it leaves behind as it flies |
| Hob, a star-nosed mole | Burrow: dives into the ground and pops up anywhere else |
| Tavi, a girl of about ten | Zoom: runs so fast she blurs, and arrives in a skid |
| Grit, a small gargoyle | Turn to stone: freezes solid when startled or embarrassed, then cracks back out |
| Lyra, a lyrebird | Mimic: does any voice or sound — only ever a fixed line, in that character's voice |
| Nox, a cat | Pour: goes liquid and pours itself into anything |
| Pim, a fennec fox kit | Radar ears: ears bigger than its head swivel to hear anything, and flatten when it is shy |

**Abilities come from the character itself.** An ability is part of the character's body and nature — its spirit — never a prop it holds or an outside object it uses. Hob digs with his own hands; Grit turns its own body to stone; Pim's ears are its own. A pair of headphones, a card to peek over, a thing to balance or carry are not abilities.

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

**Wisp lights its surroundings — proposal, not adopted** (`<WispForm lit />`, shown under the form as “lighting its surroundings”). The glow lights what is around Wisp from the lantern at the tip of its flame: the gutter, the card, and the near edge of the field. The form's rules above are unchanged.

| Part | What it does |
|---|---|
| The pool | The glow's own yellow, centred on the flame tip (the point the sparks come from). It is brightest at the lantern, drops quickly and then fades slowly, reaching about 160 px. It is stronger on the dark ground than on the light one (`--wisp-light-peak` in `studio.css`). It breathes with a slow shimmer |
| During a hop | Dips a little as Wisp gathers and swells about 30% mid-arc (and reaches a little further), then settles |
| Where sparks fall | Each spark leaves a small, faint pool of light where it lands, which outlasts the spark (about 1.1 s) |
| Wisp itself | Never lit: its drawing has nothing that depends on lighting |
| The page's HTML | The form publishes the light as `--wisp-x`, `--wisp-y`, `--wisp-reach` (px, in the form's box) and `--wisp-glow` (0–1). `litField` gives a field its own `--lit`, `--lx`, `--ly`, `--lr`, and the fields here (`.wisp-lit-field`) warm their surface and the rim facing Wisp from them. In Sparkles that part is the product's HTML, not the character |
| Reduced motion | No shimmer and no hop: the light holds still beside the field |

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

Dropping the wing edge for these finishes departs from Wisp's rule of a hairline edge on the wings; it applies to the proposals only.

The Wisp page (`#/wisp`) shows the main character on its ribbons; Wisp with two pairs is on Wisp · Butterfly (reference, `#/butterfly`); the side characters have their own page (`#/side`).

**Wisp's own expressions.** The shared nine cannot say mischief, surprise or clowning. `MORE_MOODS` (`rig/face.tsx`) adds five for the main character only: sly, silly, surprised, proud, party. Side characters' kits are not asked to draw them.

**Eye styles for the warmer — proposals** (`src/design/nix/wisp-eyes.tsx`, shown as `WISP_EYES`). One acting table (`act`) says what an eye does in each of the fourteen moods; each style only decides how an eye and a brow are drawn. Lids cut the eye instead of being painted over it, so every style holds on the warm face and on both grounds.

| Style | What it is | Strongest at |
|---|---|---|
| Honey | Dark eyes, honey irises, two shines (as drawn) | Warm, sweet; weaker at side-eye |
| Bean | White eyes, a roaming pupil, chunky brows | The widest range: side-eye, cross-eyed, a pinprick of shock. Closest to Duolingo's look — keep it clear of Duo |
| Gumdrop | Solid glossy eyes that change shape | Reads smallest; sparks at a party |
| Lidded | White eyes, small pupils, heavy lids in its own colour | Sly, proud, professional; rests cooler |
| Starry | Dark eyes with a spark of its own light for a catchlight | Ties the eyes to the glow; the eye becomes a spark at a party |

The eye style is between **Bean and Gumdrop**; the user will decide later. Honey, Lidded and Starry stay as reference. **Recommended: Bean.** Wisp's one job on the sign-up form is to watch: its eyes follow the text as it is typed, and look away at the password. Bean's pupil moves inside a white eye, so where it looks reads at a glance, even small; Gumdrop's solid eyes show a glance only by their shine and shape. Bean also has the widest acting range (side-eye, a pinprick of shock), and its white eyes with ink pupils are the icon face that keeps white and still reads (Glow · Light · Bean eyes). The risk is Duolingo: keep Bean's whites tall ovals with small round pupils, never Duo's big round whites. Gumdrop is the runner-up: the cutest and the best at the smallest sizes, if gaze matters less than charm.

**Bean, softer — proposals** (`BEAN_STYLES` in `wisp-eyes.tsx`; on the Wisp page, on the main character, at rest and in every expression). Bean read as chunky because of its line, not its acting: a 4.2 ink brow of even weight, a 1.8 ink rim round each eye, a 2.6 lash. Every variant keeps the same acting table (`act`): the roaming pupil, the lids, the brows' tilt and lift, so each is as expressive.

| Variant | What changes |
|---|---|
| Soft | Every line lighter: the rim a translucent hairline (`C.line`, 1.1), brows 2.8, lash 1.8 |
| Feather | Soft's rim and lash; the brows tapered, full in the middle and thinning to round tips, like a brush stroke |
| Blue brows | Feather's brows in the body's own deep blue (`C.deep`) instead of ink: only the pupils and mouth are dark |
| Round | A rounder eye with a bigger pupil and a second small shine, rimmed in the face's own blue (`C.hi`), tapered brows. Youngest; the pupil has less room to roam |

**At the password — three ways not to look (proposals)** (`PASSWORD_FIELDS` in `wisp-form.tsx`, a three-field demo under the sign-up form on the Wisp page). Each password field names its way (`hide`); Wisp hops to it, and once it lands it stops looking in that way, and faces the form again when focus leaves. None of them peeks; none reacts to what is typed.

| Way | What it does |
|---|---|
| Turns its back (`back`, as chosen) | Turns right round, head first, continuously |
| Hands over its eyes (`hands`) | Faces you and lifts both hands over its eyes, like hide and seek: the elbows lift out, the soft hand tips come up in front of the eyes and grow a little (`cover` on the turn puppet) |
| Hides under its ribbons (`blanket`, new) | Pulls its own ribbons up over its head like a blanket: a sheet in the ribbons' frost rises from the shoulders to a peak over the drop's tip, the side ribbons fade into it, the antennae poke out on top, and it wiggles, giggling, while you type (`blanket` and `wiggle` on the turn puppet). A little ghost: the ribbons started as a ghost's hem, so this is its own body doing it |

Under reduced motion each holds its pose without easing or wiggling.

**Around signing in, and a new workspace — fifteen reactions (proposals)** (`MOMENTS` in `src/design/nix/wisp-moments.tsx`, three demos under the password fields on the Wisp page). Three each for a sign-in that did not match, a sign-in that worked (bigger, and quieter), a new account, and a new workspace. Each plays on a small sign-in card, lit as the lit form proposes, and loops. Like the blanket, each comes from Wisp's own body: its lantern, sparks, ribbons, antennae and the light it casts, never a prop. Each is declared keyframes on one loop clock (`key` tracks), and under reduced motion holds one still frame at its peak. They use new controls on the turn puppet: `shut` and `wink` (eyes closed as a beam or asleep), `mouth` (smile, grin, “o”, a sheepish wobble), `glow` (the lantern dimmed, or flashed above 1), `armsTo` (an arm eased toward a pose), `knot`, `curl`, `bow`, `tips` and `tipBob` (each antenna tip lit and bobbed) and `hug`.

| Moment | Reaction | What it does |
|---|---|---|
| Didn't match | Fizzle | The lantern sputters like a match that didn't catch and puffs a little smoke. It blinks at its tail, cups the flame and blows; it catches with a flare, and it hops back to the username |
| Didn't match | Ribbon knot | The ribbons swing in, cross under the flame and tie in a knot behind (`knot`), as if the strands didn't match. It looks over its shoulder, wriggles, and the knot pops loose with a boing and four sparks; a sheepish shrug, then back to the username |
| Didn't match | Question mark | It ducks under its ribbon blanket to the nose; one antenna curls into a question mark (`curl`) while a hand scratches its head; then it pops out, ready to try again, and hops back to the username |
| Signed in | Firefly code | Fireflies know each other by their flashes. It turns to you, dims, and flashes its own pattern — blink, blink, pause, blink — then beams and waves |
| Signed in | Woken up | Waiting, it has dozed off under its ribbons, breathing slowly, its lantern low, a mote of light drifting up now and then. It startles awake, throws the ribbons off and stretches wide |
| Signed in | Lamplighter | It zips ahead along the top of the card; each spot its lantern passes stays lit a while, like lamps down a hallway. At the far end it turns to you and bows |
| Signed up | Constellation | It flies one loop; its sparks hang instead of falling, draw together into a small five-pointed star that twinkles once, and fade |
| Signed up | Ribbon bow | It ties its ribbons into a bow on top of its head (`bow`), like a present, with a wink. Then it pulls one end and the bow falls away into a twirl, a full continuous turn |
| Signed up | Housewarming | It hops to the button and touches the tip of its flame to it, as you light a wick. The light swells across the whole card, then settles to a glow |

| Signed in, quieter | Antenna hello | It turns to you; its antenna tips light up one after the other, left then right, and bob like a little wave (`tips`, `tipBob`); a small hop and a smile |
| Signed in, quieter | Ribbon hug | It wraps its ribbons round itself in front, arms crossed, a hug for itself (`hug`), and squeezes; its lantern glows a little warmer; then it lets go with a happy sigh |
| Signed in, quieter | Spark wink | It winks, and one spark pops off its flame, drifts up past its face, twinkles once and is gone |
| Workspace set up | Heartbeat | A happy little bounce, then three soft rings of light pulse out from its lantern — ba-dum, ba-dum, ba-dum — and fade |
| Workspace set up | Sparkler antennae | Its antenna tips fizz with tiny sparks like a pair of sparklers, and it giggles, wiggling, until they fizzle out |
| Workspace set up | A spark to keep | It cups its hands at its flame and peeks in at a spark it has caught, then opens them and lets it float up to the new workspace's name, where it twinkles once |

The sign-up three were thought too dramatic as a model for signing in, so the quieter sign-in three are subtler than signing up: no travel and nothing across the card, only Wisp and its own light, each over in about a second and a half. The workspace three are small character bits in the spirit of the blanket, with some play of glow and sparks. A workspace being set up is a new event beside the other three; like them it gets one reaction, the same every time. The ribbon knot and bow are drawn about twice the size they first were, so they read at the form's 46 px.

The error reactions never frown, shake their heads or turn a status colour: each treats the miss as Wisp's own hiccup. None of the success reactions is a reward (no medal, no confetti), and none grows with use: an event gets one reaction, the same every time.

**Open — two rules these would change.** Wisp's rules say it never reacts to whether an entry is valid, and that it appears only on the sign-up form. All fifteen answer the server (wrong details, signed in, signed up, a workspace set up); the nine sign-in ones put Wisp on a sign-in form too, and the workspace ones on a workspace form. Choosing any of them is choosing to change those rules; until then the form's behaviour is unchanged.

**The studio's pages after the choices.** The Wisp page (`#/wisp`) holds only what is chosen: Wisp (Clean ribbons, Core tail, Snug arms, drop head, Feather eyes) at rest and in every expression; the app icon (Glow · Light with Feather eyes, its circle and one-colour mark); the wordmark (Gabarito 700); the turnaround, flight and sign-up form; and the bench for the main character. Everything it was chosen from is on the References page (`#/references`) as backup: the proposals on Clean, Bean, softer, the app icon eyes and proposals not chosen, the wordmark candidates, Glow tips and Spirit, and the warmer proposals with their eye styles and acting (on the ribbons), then the wispy directions, Pip and the earlier fireflies. The butterfly-winged Wisp keeps its own full page (`#/butterfly`).

**Wisp's eyes — chosen: Feather** (`BEAN_FEATHER`). Bean's acting (the roaming pupil, the lids, the brows' tilt and lift) with a translucent hairline rim (`C.line`), a 2.0 lash and tapered ink brows. On the main character (`CLEAN_PICK.face`), and drawn the same by the turn puppet on the Wisp page (`FeatherEye` in `wisp-turn.tsx`), so the turnaround, flight and form match; there the puppet's glance moves the pupil inside the white rather than the whole eye. The butterfly Wisp keeps its own eyes.

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

None of them is in the turn puppet, the views, the flight or the form: that waits until one, or a mix, is picked into the main character (`CLEAN_PICK`).

**Wisp — loading spinners (proposals).** Loops that say "one moment" with the main character as drawn (`CLEAN_PICK`), in place of a ring spinner. They are in `src/design/nix/wisp-spinners.tsx` (`WISP_SPINNERS`, drawn by `SpinnerFigure`) and shown on the Wisp page large and at 64 and 40px.

| Spinner | What happens | Loop |
|---|---|---|
| Tumble | Leans back (anticipation), tucks its hands in, turns a full somersault about its middle with wings buzzing and antennae trailing, overshoots, settles, hovers a beat | 2.4 s |
| Glow breath | Hands at its heart; on the in-breath it rises, grows a little taller, its flame swells and its glow comes up; then it all eases back | 3.6 s |
| Spark ring | Ten sparks round it light up one after another, clockwise from the top; its head and body lean after the lit one and its antennae trail | 2.4 s |
| Counting dots | Three sparks beside it hop in turn like a typing indicator; it nods to each with a boing of its antenna, then straightens | 2.4 s |

- Each loop is seamless and the same every time. A spinner reacts to nothing: not an answer, a count, an approval or an emptied queue.
- The tumble turns Wisp over in its own plane; it never mirrors, so it does not break "never flips".
- The ring's and the dots' sparks are an effects layer in the glow's colour with the glow's edge, not sparks drawn into the figure; the figure's own spark trail is unchanged. Their animations take the figure's start time, so the face, the joints and the dots run on one clock.
- A spinner's loop runs on linear time and each keyframe segment carries its own easing, so a tumble's one long ease is not bent by a second ease over the whole loop.
- Under reduced motion the figure holds its first frame and resting face, and the dots hold one still frame of the loop. The figure is `aria-hidden`; the spinner is a `role="status"` with a text label.
- **Open:** Wisp appears only on the sign-up form. Using any of these elsewhere (while a lesson loads, say) widens where Wisp appears, and that is the user's decision. Nothing here is adopted.

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

**App icon — chosen: Glow · Light** (`APP_ICON` in `wisp-logo.tsx`). Wisp's drop drawn as its own light: a solid yellow drop (the glow, `#ffcf4a`) with ink eyes, a smile and two antennae, on a solid primary tile. Why: it reads at 16px (two colours, one shape); the mark is the firefly's light, its ability; a primary tile holds on light and dark home screens, where the pale tiles glare on dark; and the product's colour is the tile, as the norm is for app icons. Decided with it:
- **Solid, never gradient.** No gradient, halo or shine in the logo: it stays crisp from the store listing to a 16px tab, prints in one colour, and platforms can recolour it (iOS dark and tinted icons, Android themed icons). The character keeps its gradients; it is an illustration, the logo is a mark.
- **On the primary, not the accent.** A full yellow tile is loud on a home screen (the brief: warmth must not make the product loud), sits close to warning colours, and puts a second yellow beside the glow, which should be the only yellow in the mark.
- **In the product's fixed colours** (`K_SPARKLES`), never the studio's scheme switch; the studio shows the chosen set in them whatever the header says.
- **Contrast** (Sparkles scheme): the glow on the primary 3.9:1 and the ink eyes on the glow 11.1:1, above the 3:1 for graphics; the primary tile 5.7:1 on a white home screen and 3.1:1 on a dark one. Blue and yellow is the pair that holds up under the common colour blindnesses.
- **Its set** (`APP_ICON_SET`): the app icon; **Glow · Light · Round**, the yellow drop on a primary disc inside the inner 80%, for launchers and avatars that cut a circle; and **Glow · Light · One colour**, the drop and antennae as one solid shape with the eyes cut out and no tile, for Android's themed layer, iOS tinted icons and one-colour print. Each has its 32px-and-under drawing. `npm run logos` writes them as `docs/logo/app-icon.svg`, `app-icon-round.svg` and `app-icon-mono.svg`, each with a `-favicon.svg`.
- **Figure and Flight are retired**: drawn from the whole figure, they carry the butterfly wings; they are shown on the Wisp · Butterfly (reference) page.

**App icon — the proposals it was chosen from.** Six marks made from Wisp's shape, not the full character, the way Duolingo's icon is Duo's head (`src/design/nix/wisp-logo.tsx`, `LOGOS`; shown in the studio as “Wisp — app icon”). Each has an app-icon drawing and a simplified one for 32px and under (favicon, tab, notification): no mouth, rings or wing spots, eyes without shines, nothing thinner than a pixel at 16px. Wisp's drawing rules hold: no black outlines, no highlights, the product's primary, the glow as its own colour. They draw with the scheme's tokens, so the header recolours them; `npm run logos` writes them in the Sparkles scheme to `docs/logo/` as `<id>.svg` and `<id>-favicon.svg`, with `sheet.png` showing all six at 220, 64, 32 and 16px on both grounds.

| Mark | What it is | Strong / weak |
|---|---|---|
| Drop | The head front on: droplet, eyes, smile, two glowing antennae, on a pale tile | The face is the icon; reads at 16px as a blue drop with two yellow dots |
| Figure | The whole figure reduced: head, wings, ringed flame, on the primary | The only one that says firefly; the head is small at 16px, the flame carries it |
| Flight | Side-on, leaning into its way, flame streaming, sparks behind, on a night tile | Motion and the spark trail; one eye, so less face |
| Glow | The drop and antennae as a primary silhouette in its own yellow light, pale eyes | Boldest and clearest at 16px; least character large. The yellow field is the glow, not a status hue |
| Peek | The top of the head rising from the bottom edge, looking up, on the deep primary | Most personality; cropped, so at 16px it is a blue hill with eyes |
| Ember | Head and flame as one shape: the drop's colour runs into light and curls off | An abstract mark that is still Wisp; works without the face as a wordmark's dot |

Glow · Light is chosen (above). The eye style is still between Bean and Gumdrop; the marks use plain ink eyes until it is decided.

**Drop and Glow — variations** (`LOGO_VARIANTS`; `docs/logo/sheet-variants.png`):

| Mark | What changes |
|---|---|
| Drop · Night | Drop on a night tile, sparks haloed, a soft light rising from below: for dark home screens and dark mode |
| Drop · Scamp | One antenna flopped over in a curl, a wink, a lopsided grin: the asymmetry makes the silhouette only Wisp's |
| Drop · Flat | Two flat tones (mid, with its own deeper shade underneath) on white: for print and merchandise |
| Drop · Lit | The head warms toward its chin as if its flame were just below the frame, on the deep primary |
| Glow · Halo | The primary silhouette in a disc of its own light on a night tile |
| Glow · Scamp | Glow with the flopped antenna and a wink |
| Glow · Light | **Chosen.** Reversed: a yellow drop with ink eyes on the primary. A mark only; the character's body stays in the primary |
| Glow · Round | In a circle, inside the inner 80% safe zone: for avatars and launchers that cut a circle |

**What the platforms require.** An app icon is solid: the App Store icon has no alpha; iOS 26 icons are layered in Icon Composer and the system adds the glass, so each layer is supplied flat and opaque; an Android adaptive or a PWA `maskable` icon needs an opaque background with the mark inside the inner 80%; an `apple-touch-icon` with transparency turns black on iOS. Only the browser favicon may be transparent, and then the mark must hold on both a light and a dark tab, which a drop in `C.mid` does. So the tile stays; Glow · Light · Round is the chosen icon's safe-zone layout.

**The icon's eyes, after Feather — proposals** (`APP_ICON_EYES` in `wisp-logo.tsx`; on the Wisp page under Glow · Light, which is now the only icon shown there; every other proposal, the circle and one-colour shapes and the earlier faces are on the References page until the eyes are chosen). Each is Glow · Light with only the eyes changed, with its own 32px-and-under drawing:

| Eyes | What it is |
|---|---|
| Ink | Solid ink ovals, as Glow · Light was drawn |
| Ink · shine | Solid ink ovals with a white shine: Feather's pupil without the white |
| Feather | Feather's eye: white, translucent hairline rim, ink pupil and shine |
| Feather · amber rim | The same, rimmed in the drop's own deeper amber |
| Feather · ink rim | Outline and eyeball: white ringed in ink, ink pupil |
| Eyeball on white | White eye, ink pupil, no rim (white on the glow is 1.47:1, so the edge fades) |
| Big pupil | A crescent of white round a big ink pupil, amber rim |
| Ring | An ink outline round the pupil, no white |
| Feather · brows | Feather · amber rim with tapered ink brows (left out at 32px and under) |

**Chosen: Feather** (`APP_ICON` in `wisp-logo.tsx`): Feather's white eye, its soft rim laid over the yellow as one solid tone (`#bd9945`, so the icon stays opaque), an ink pupil with its shine; icon and character share one face. The circle and the one-colour marks are redrawn with it (`APP_ICON_SET`). The one-colour mark comes in three colours: the primary and black (for light grounds) draw the eyes' whites and the smile in white, so the eyes are white on any ground, with pupils in the mark's own colour and a white shine; white (for dark grounds) cuts a thin ring round each eye to part it from the white head, and cuts the pupils and smile through to the ground. `npm run logos` writes them as `docs/logo/app-icon.svg`, `app-icon-round.svg`, `app-icon-mono.svg`, `app-icon-mono-black.svg` and `app-icon-mono-white.svg`. The other eyes, and Glow · Light with its first ink eyes, are on the References page. Recommended before the choice, top two: Big pupil, then Ink · shine. Big pupil is Feather's eye at icon scale: the white, the amber rim and the shine say it is Wisp up close, and because the pupil fills the eye it reads like Ink at 16px; it is also the warmest and youngest. Ink · shine is the strongest at every size and still carries Feather's catchlight; choose it if the 16px tab matters most. The plain white-eye versions make the eyes look small and the pupils float on the yellow; the ink rim brings back the chunky line Feather removed.

**The icon's face — ink, white, or Bean's white eyes** (`APP_ICON_FACES` in `wisp-logo.tsx`; `docs/logo/app-icon-faces.png`). Asked: white eyes and mouth. Drawn as **Glow · Light · White face**: white on the glow is 1.47:1, under the 3:1 a graphic needs, so the face washes out and is gone at 16px. The alternative that keeps white in the face is **Glow · Light · Bean eyes**: white eyes, each with an ink pupil, and an ink smile; the pupils carry the contrast (ink on white 16.4:1, on the glow 11.1:1), so it holds at every size, and it is the Bean eye style, one of the two left for the character. Undecided between ink (as chosen) and Bean eyes; white alone is not recommended.

**Wordmark — chosen: Gabarito 700** (`WORDMARK` in `wisp-wordmark.tsx`). “sparkles” set in lowercase, always, with −0.01em tracking: in the primary on light grounds, white on dark and on the primary. Geometric with soft, round counters and a little bounce, so it sits beside the round, solid icon without competing with it. The Wisp page shows it beside the icon on white, dark, the primary and at 16px; every other face is on the References page.

**Wordmark — the candidates it was chosen from: the top three and round three** (`src/design/nix/wisp-wordmark.tsx`, `WORDMARKS`; shown on the Wisp page beside the chosen icon; `docs/logo/wordmarks-3.png`). Chosen to fit the mark: round bowls, round or soft terminals like the antennae's caps, a stroke near the stalks' weight, open letters that stay legible for a child and at 16px. Each is set in lowercase beside the icon on white, on dark, reversed on the primary, and at 16px; all on Google Fonts under the OFL.

| Face | | Fit |
|---|---|---|
| M PLUS Rounded 1c 800 | Top three | Fully rounded terminals like the antennae's caps, at a weight close to the stalks: the closest match to the mark |
| Gabarito 700 | Top three | Geometric with soft round counters and a little bounce; between Figtree's clarity and M PLUS's roundness |
| Figtree 800 | Top three | Clean geometric with round bowls; the most neutral, crisp small |
| Zen Maru Gothic 700 | New | A round ('maru') gothic: every stroke end rounded, like M PLUS but calmer and lighter |
| Andika 700 | New | Designed by SIL for beginning readers: letters that cannot be confused. Pairs by purpose, less by shape |
| Urbanist 800 | New | Geometric on circles, low and wide; the drop's roundness in a modern product face |
| Plus Jakarta Sans 800 | New | Friendly modern sans, round bowls, slightly bouncy; confident for parents and teachers |
| Bricolage Grotesque 700 | New | The most character: ink-trap quirks, hand-made warmth; less round, check it at small sizes |

Round two's other five (Varela Round, Comfortaa, Sniglet, Rubik, Atkinson Hyperlegible Next) are dropped; `docs/logo/wordmarks-2.png` keeps that round. Gabarito 700 is chosen (above).

**Wordmark — candidates, round one** (`docs/logo/wordmarks.png`, “sparkles” beside Drop): Fraunces 600 with SOFT 100 (already the product's display face), Fredoka 600, Nunito 800, Baloo 2 700, Lexend 600, Quicksand 700. All are on Google Fonts under the OFL. None is chosen.

## Side characters — Lantern Pond (2026-10-01)

**The world is Lantern Pond** (`docs/world.md`). The six: **Marlowe**, an old heron, the grown-up who keeps the pond school (Long reach); **Bun**, a rabbit (Thump); **Ines**, a girl acrobat of about twelve (Stretch); **Mina**, a girl of about eight, the learner's friend (Giggle); **Bean**, a baby hippo (Yawn); **Ollie**, a snail, the newcomer (Tuck). All six are drawn on the cute frame to `docs/character-guidelines.md`, each with its own eyes, mouth, talking shapes and lip-sync lines: Bun and Bean in `side-garden.tsx`, the other four in `side-pond.tsx` (`POND` is the cast in order). Ability previews exist for Bun and Bean only so far. Proposals; none final.

### Round three (how Bun and Bean were picked)

The Observatory cast was set aside: the user asked for a different world and characters. Three worlds were proposed (the Night Garden, the Moonlight Caravan, the Sky Harbour; none chosen), and two characters were picked from their casts for expression first: **Bun**, a bossy rabbit whose ears act (one folds over at the tip; ability: Thump), and **Bean**, a sleepy baby hippo with a big snout and the widest mouth (ability: Yawn). They are drawn in `src/design/nix/side-garden.tsx` (`GARDEN`) to `docs/character-guidelines.md`, with ability previews, eyes, mouths, talking shapes and lip-sync lines, and are the only side characters shown in the studio. The world and the other four are chosen after these two are agreed.

The Observatory six below are kept in `observatory.tsx` (not shown) as reference.

## Side characters: the club at the Observatory on the hill (set aside)

**Approved (2026-10-01) and drawn.** The six are new; none of the earlier side characters carries over (the chameleon, fruit bat, chick, Juno, Lulu, the otter, red panda, octopus and penguin were removed from the studio; they are in git history). The world, the relationships, the running jokes and the stakes are in `docs/world.md`. The drawings are in `src/design/nix/observatory.tsx` (`OBSERVATORY`), the ability previews in `observatory-abilities.tsx`, and they speak in the lip-sync demo (`lip-sync.tsx`). They are proposals in the sense that nothing is final; the cast itself is decided.

| Character | Temperament (a want and a flaw) | At rest | Ability | Species-true detail, imperfection |
|---|---|---|---|---|
| **Hob**, a star-nosed mole — the keeper | Wants everyone to see what he sees; can barely see without the telescope and won't admit it. Fussy, proud, a soft touch | Squints with one eye, one spade hand raised to make a point, head tipped | Burrow | The star of 22 pink rays on his nose; velvet fur standing up on top; digging hands bigger than his head; bushy pale brows that do his acting. His spectacles live pushed up on his forehead, crooked, never worn |
| **Tavi**, a girl of about ten | Wants to be first to everything; rushes, is wrong out loud and laughs first — the one who makes a wrong answer safe | Arms up and ready to run, grinning, head tipped | Zoom | Auburn hair always blown back in points; a plaster across her nose; one front tooth missing; a jumper too big for her (the hoodie outfit) |
| **Grit**, a small gargoyle | Wants to see the town; too scared to leave its corner of the dome. Grumpy face, sweetest heart | Crouched, arms folded, stone brows down | Turn to stone | Stubby horns, the left one chipped with a crack; pointed ears; a jutting underbite with two tusks; a spade-tipped tail; spots of lichen; no wings. Alive it is drawn in the scheme; only its ability turns it grey |
| **Lyra**, a lyrebird — the performer | Wants applause; can do anyone's voice but has never found its own | Chin up, lids half down, one wing flung out mid-flourish | Mimic | Two banded lyre feathers that curl out at the top, filmy plumes between them, long thin legs; a pale mask round the eyes like stage make-up; three long lashes |
| **Nox**, a cat — owns the roof | Wants company and would rather die than say so. Deadpan | Sits like a loaf, paws together, lids heavy, head on one side | Pour | White muzzle, bib and socks; whiskers; small round-tipped ears, the left one notched; a tail curled into a question mark; slit pupils that open to discs when it is secretly delighted |
| **Pim**, a fennec fox kit — the newest | Wants to belong; so shy it hides behind its own ears | Looks down and away, one paw holding the other, head on one side | Radar ears | Ears bigger than its head with pale fur inside, a cream face with a fennec's dark tear lines, a black nose, a bushy tail with a dark tip. Its ears follow its mood (`Ctx.mood`): flat when it is shy or startled, tall when delighted |

**Colour.** Every one is drawn with the scheme's tokens (`C`) or a mix of one with a neutral, so the header's scheme recolours them all: Hob in the deep primary, Lyra in the primary with accent lyre feathers, Grit in a stone mixed from the mid tone, Nox in a charcoal mixed from the deep, Pim in a sand mixed from the accent. Tavi is a person: her skin and hair are her own, her clothes follow the clothes switch. The only fixed colours are small species details (Hob's pink star, inner ears, noses). No character has a status hue, and none has a status-colour ability: the brief's one exception (the chameleon's colour change) no longer applies to anyone.

**Silhouettes.** At 32px each is told apart in black: Hob low and wide with a spiked crown; Tavi's hair streaming one way; Grit's horns and ears; Lyra's lyre; Nox's loaf and question-mark tail; Pim's two great ears. Nox's ears are small and round-tipped so it never reads as Pim.

### Rules for every side character

- **No outlines.** Parts are told apart by colour and tone alone; the palette sets `line: "none"`, which the rig's clothes and shoes follow too, and `outline: false` on the body.
- **Its own eyes and its own mouth.** No two characters share either. Each has an eye kit (`face.kit`) and a mouth kit (`face.mouthKit`) of its own (`rig/eyes.tsx`), drawn for every expression — neutral, happy, delighted, curious, thinking, focused, worried, oops, wink. The studio shows them side by side under “Eyes and mouths — each character's own”.
- **Its mouth talks.** Every mouth kit also draws the eight talking shapes (`viseme` in `MouthArgs`, `rig/visemes.ts`) in its own mouth — lips, a beak, a stone jaw, a cat's ω — coloured by the mood, so a worried character still talks worried. The studio shows them under “Talking mouths”.
- **The ability comes from the character itself** — its body and its nature — never a prop or an outside object.
- **Legible small and on both grounds.** Check the recognition sheet (silhouettes at 96, 48 and 32px, the head at 32, 24 and 16px) on the light and the dark ground. A character whose head is not in the chibi crop gives its frame a `headVB`.

### What makes a side character loved

Duolingo's cast is loved because each of them is *somebody* before they do anything. Every side character has, and every new one must have:

1. **A temperament in one line.** A want and a flaw, not a job. It is written first in the character's pitch.
2. **An attitude at rest** (`attitude`, applied by the rig in the idle pose): its own resting expression, a habitual head tilt, and a stance of its own. Nobody stands neutral and dead level.
3. **Asymmetry and one imperfection.** Hob's crooked spectacles, Tavi's missing tooth and plaster, Grit's chipped horn, Nox's notched ear. Perfect symmetry reads as a logo; a small flaw reads as a friend.
4. **Form, in two tones.** Each main part is drawn in its own shade first, then its colour over it, offset up and to the left. No outlines and no black: the shade is a tone of the part's own colour.
5. **Chunky, soft shapes.** Thick limbs and big hands and feet: rounder reads softer at small sizes.
6. **Species-true detail, a little of it.** Enough to be precise; never so much it stops reading at 32px.
7. **Its own face and its own ability** — the rules above still hold.

**People need to act.** Tavi's brows carry half of every expression, her two eyes may do different things (one widens while the other narrows when she is curious), and her mouth has business: a tongue poked out at the corner when she concentrates, a gap-toothed grin.

### Abilities, previewed

`observatory-abilities.tsx` shows each ability as its own layer round the figure: a whole-figure move (`.mv-*` in `studio.css`), effects behind or over it (`.fx-*`), or an act for the rig. Every move is declared keyframes with anticipation and overshoot, and stops under reduced motion.

| Ability | Preview |
|---|---|
| Burrow | Crouches, dives into a mound, travels under the hill, pops up past the mark at the other mound and settles; then back |
| Zoom | Arrives from the left in a blur with speed lines, skids past the mark in a puff of dust and back; leans, and goes |
| Turn to stone | A jolt, then frozen grey with cracks; a shake, and it cracks back out |
| Mimic | Talks (its beak flaps) with a speech bubble holding Hob's star: whose voice it is doing |
| Pour | Stretches up, then pours down into a teacup as a puddle with ears; springs back out |
| Radar ears | Both ears swing left to a sound, hold, then sweep right to another (the rig's ear joints) |

### Lessons from Duolingo

What the Duolingo cast does that this studio's first rounds did not (a summary of the conversation that led to the rules above):

- **One style, many silhouettes.** Every character is built from the same kit of simple, rounded geometric shapes in flat colour with a shadow tone, and big heads on small bodies — but each has a silhouette you could name in black (Lily's hair, Eddy's height, Oscar's moustache, Duo's round body).
- **An archetype with an attitude.** Each is a recognisable type pushed to a caricature, and each is *somebody* at rest: Lily bored, Zari bursting, Oscar pompous, Duo intense. Personality is in the posture before anything moves.
- **They talk.** In lessons the characters say the sentences, with their mouths moving to the words and their own voices — the strongest single hook. Here speech must stay fixed copy (`docs/brief.md`); the club now speaks fixed lines, lip-synced with Web Speech (below).
- **They are alive between events**: breathing, blinking, glancing — and they react in real time, because each is a state machine (idle, talking, reacting) rather than a set of clips.
- **Animation principles, not just motion**: anticipation before an action, overshoot and settle after, squash and stretch, reactions under a second, timed to a sound. The rig now has them (`rig/motion.ts`): `EASE` (overshoot, anticipate, snap, settle), `jump` (crouch, stretch up, squash on landing, rebound — volume kept), `pop` (squash, stretch, overshoot, settle — the correct beat), `sag` (sink, hold, lift with a small overshoot — the gentle incorrect beat) and `action` (wind-up opposite, snap past the mark, settle). The cheer jumps, the wave overshoots, and every practice act that only breathed now pops on correct and sags on incorrect.
- **A world**: the characters know each other, have running jokes and stories; the absurd sentences are written for them.
- **Emotional stakes.** Duo's cast makes you care: the characters want things, need things from each other and from you, and you feel something when you let them down or come through. That is part of why they are loved, and it is **in scope for Sparkles**. An earlier version of this file said the brief rules it out; it does not, and that was wrong. Stakes here come from the characters — their wants, their relationships with each other and with the learner, their running stories — not from pressure. What the brief does bound is narrower: the practice reactions themselves (three events, the same reaction the first time and the fiftieth, gentle on an incorrect answer, never a scold). Any stake that would need a reaction to a streak, a score or a session is a change to those bounds, and belongs in Sparkles, not here.

## Speech and lip-sync

The characters speak (decided 2026-10-01): fixed lines, each in a voice of its own, with the mouth moving to the words. The line is real text beside the figure. The demo is `src/design/nix/lip-sync.tsx`, under “Lip-sync” on the Side characters page.

| | |
|---|---|
| How Duolingo does it | Phoneme timings for each line, mapped to visemes (20+ mouth shapes per character), blended in a Rive state machine in time with the audio |
| What Web Speech gives | `start`, `end`, and a `boundary` as each word begins (with `charIndex`). No phoneme timings; its audio cannot be measured. Some voices report no words |
| What the demo does (**word-synced**) | Each word starts its mouth on its boundary and plays shapes guessed from its letters (`wordVisemes`), spread over its estimated length (syllables ÷ rate); the mouth rests at commas and full stops. A voice that reports no words within 0.7 s falls back to the **flap**. With no voices, or a voice that does not start, or **Silent**, the same words are timed by estimate |
| The eight shapes | Rest, M B P (pressed), A I (wide), E (wide, teeth), O (round), U W (small, round), F V (lip on teeth), L Th (tongue up) — `SHAPE` in `rig/visemes.ts`; each kit draws them its own way |
| Each voice | A preference among the device's voices, a pitch and a rate (`VOICES` in `lip-sync.tsx`): Hob low and slow, Tavi high and fast, Grit lowest, Lyra theatrical, Nox flat and slow, Pim highest. The voice itself still varies by device |
| Exact sync | Needs a voice service that returns viseme timings (Azure Speech, Amazon Polly) instead of Web Speech: a decision for Sparkles |
| Reduced motion | The body holds its rest pose; the mouth still moves, as an expression may |

**Against the brief.** Speech is fixed product copy (`docs/brief.md`). Sparkles' scenarios voiced with Web Speech may be lip-synced only if their text is editor-approved; that widens the brief's rule and is recorded in `docs/world.md` for Sparkles to confirm. Lyra's mimicry only ever repeats another character's fixed line, in that character's voice.

**Practice states** for the new six are not drawn yet. The earlier set (five variants of four states per character) was removed with the earlier characters; its rule stands for the next round: no two characters share an action or a prop, incorrect is always gentle, no prop is a reward, and “still writing” and “partly correct” are events beyond the brief's three, to be reconciled with Sparkles.

## Cast structure: recommended, not decided

Recommended, and followed by the club: **one firefly as the main character, and every side character a different species or a person.** No second firefly.

- **The ability rule.** Glow is the firefly’s one ability. A second firefly either shares it, which breaks the rule, or glows differently, which weakens what the main character is known for.
- **Recognition.** A child names the character the product is known by. Two or three fireflies turn “the firefly” into “which firefly?”, and the main one stops being the face of the product.
- **Duolingo’s shape.** Duo is the only owl. The rest of the cast are different species and people, each told apart by silhouette alone.
- **The loser variants are not wasted.** Several of the body plans already carry a side character’s idea without being a firefly. A domed shell (Chonk), a cloak and hood (Hood), a floating spirit (Wisp) or a square toy (Cube) can be redrawn as another species with its own ability.

One exception is worth keeping open: **a younger firefly-family member** (a glowworm, say) as the learner’s companion. It would need an ability other than glow, and a story that never turns growing up into a reward. Decide this only after the main firefly is chosen.

A side character must be told apart from the main character and from every other side character by silhouette alone, at small size.

Which side character plays which role in the product is not decided. Record it here when it is.
