# Character design guidelines — cute and expressive

What the industry does when it designs a cast meant to be loved by children and tolerated by adults (Duolingo, Sanrio, Nintendo's Animal Crossing and Pokémon, Pixar and Disney feature animation, Toca Boca), boiled down to rules this studio can check. Every side character is drawn to them; `docs/cast.md` says how each one meets them.

## 1. Cute is a proportion: the baby schema

Konrad Lorenz's *Kindchenschema* is the reason a drawing reads as cute, and every cute-character house works from it:

| Feature | Rule here |
|---|---|
| A big head on a small body | The head is about **half the height** of the figure (two heads tall, not two and a half). The body is a small soft bean under it |
| A big, high forehead; features low | The eyes sit **below the middle of the head**; the forehead above them is empty |
| Big round eyes, set wide | Each eye is about a fifth of the head's width; the gap between them is at least one eye wide |
| A small nose and mouth, close under the eyes | The mouth is small at rest and opens big when it acts; nose and mouth sit in the lower third |
| Round cheeks | A soft jowl at the sides of the face, and blush on the cheeks |
| Short, thick limbs; small hands and feet | Arms and legs are nubs, thicker than long; round paws or mitts |
| Round, soft shapes | No sharp corners anywhere a child would touch; even a horn or an ear tip is rounded |

Too much of it reads as a baby and nothing else; a character still needs an attitude (§4).

## 2. Shape language, one dominant shape each

Animators teach three primary shapes, and a cast reads best when each character is built mostly from one:

- **Circle** — friendly, soft, warm: Hob, Nox.
- **Square** (rounded) — steady, stubborn, dependable: Grit.
- **Triangle** (rounded) — energy, mischief, alertness: Tavi's hair, Pim's ears.
- An **S-curve or teardrop** — grace, show: Lyra.

## 3. Silhouette first, and variety in the line-up

- Each character is recognisable **filled in black at 32px**. The one feature it is named by (the hook: Hob's star nose and spectacles, Tavi's swept hair, Grit's horns, Lyra's lyre, Nox's loaf and question-mark tail, Pim's ears) must be in the silhouette.
- Stood in a row, the cast varies in **size and mass** (big, medium, small; wide, tall, round), so no two have the same outline. Pim is the smallest; Hob and Nox the widest; Lyra the tallest with its tail.
- **One hook, not five.** Detail that does not survive at 48px is cut.

## 4. Appeal is somebody, not something

Disney's twelfth principle, *appeal*, is what makes a design want to be looked at:

- **An attitude at rest**: a tilt, a lean, a habit. Nobody stands dead level and symmetric.
- **One imperfection or asymmetry**: a chipped horn, a notched ear, a gap tooth, one ear or curl that won't lie down.
- **A temperament in one line** (a want and a flaw) that the drawing shows before it moves.

## 5. Expression: eyes and brows do most of the acting

- **Every character has brows**, animals too — floating brows in a darker tone of its own colour. Brows carry about half of every expression.
- The two eyes **may do different things** (one wide, one narrow) — curiosity and doubt live there.
- Expressions **change shape, not just position**: happy eyes close into arcs (^ ^), delight adds a big sparkle, shock shrinks the pupils, a fright squeezes them into > <.
- The mouth is **small at rest and big in action**; it can leave the face's centre line (a sideways smirk, a mouth pulled to one side when thinking).
- **Squash and stretch** applies to faces: cheeks lift when it smiles, the face drops when it sags.
- Every expression is checked at 48px: if it only reads large, it is too subtle.

## 6. Finish: flat colour, soft form, no outlines

- **Flat shapes with one shade tone** (the part's own colour, darker, offset down-right) and, where it helps, one soft light tone on the cheeks or crown. No black outlines (`docs/brief.md`).
- **A small palette per character**: one main colour, one secondary, one accent for the hook (60–30–10). The main colours come from the product's scheme.
- **Shine in the eyes**: two catchlights, one big and one small, on the same side for the whole cast (upper left), so they look lit by one light.
- Features (eyes, mouth, brows) are dark ink on a lighter face patch, so they read on both grounds.

## 7. Built to move and talk

- Shapes are separate parts on joints (head, ears, tail, arms), so a pose is joint data, not a new drawing.
- The mouth has a talking set (eight shapes, `rig/visemes.ts`) drawn in the character's own mouth, and the mood colours it.
- A hook that can act should: Pim's ears follow its mood; Tavi's cowlick does too.

## Sources

- Konrad Lorenz, the baby schema (*Kindchenschema*), 1943, and later studies of it in cartoon design.
- Frank Thomas and Ollie Johnston, *The Illusion of Life* (1981): the twelve principles, among them squash and stretch, and appeal.
- Tom Bancroft, *Creating Characters with Personality* (2006): shape language, silhouette, the cast line-up and the range from iconic to realistic.
- Duolingo's published notes on its world characters: simple geometric shapes in flat colour, big heads, expressive brows and eyes, and lip-sync to visemes.
