# Creative brief — The 11:59 Sweater

Keep this open beside Photoshop. Terms in **bold** are defined in [GLOSSARY.md](../GLOSSARY.md).

## The joke in one sentence

A calm, wholesome holiday portrait of the owner as their messy brown **Panda Self**, wearing a sweater
that celebrates the worst minute of finals season: **11:59 PM, upload frozen at 97%**.

Title: **The 11:59 Sweater** · Tagline: **"Peace on Earth, and a successful upload."**

## Joke Hierarchy

Each tier must be understood at its **Read Size** (displayed width of the whole image). Check every tier
in the [Thumbnail Test](../tools/thumbnail-test/) before moving on.

| Tier | Read Size | Element | Lives in |
|---|---|---|---|
| 1 | 64 px | Giant glittery knit **"11:59"** across the chest, Snow Ivory on Cranberry Wool; small "PM" beside it | both images |
| 2 | 128 px | Frozen red progress bar under the digits, stuck at **97%**, a 3D jingle bell sewn at the stuck end | both images |
| 3 | 512 px+ | Knit hem tag "Submitting…"; tangled generic charger cables down both sleeves ending in pom-poms; Fair Isle bands of loading-spinner snowflakes and tiny hourglasses; coffee-cup band at the hem | both images |
| Card extra | 512 px+ | A closed laptop (no logo) on the sofa wrapped with a red bow; cocoa mug with steam | **Finished Card** only |

If only tier 1 reads, the joke still lands. Never trade tier 1 legibility for tier 3 detail.

## Palette

### Sweater (loud)

| Name | Hex | Use |
|---|---|---|
| Cranberry Wool | `#B3263A` | sweater body, behind the digits |
| Pine Ribbing | `#1F5B3A` | collar, cuffs, hem, band ground |
| Snow Ivory | `#F2EADB` | digits, bar track, Fair Isle motifs |
| Tinsel Gold | `#D4A62A` | glitter accent only |
| Frozen-Bar Red | `#E5383B` | progress-bar fill |
| Cable Charcoal | `#3A3A3C` | sleeve cables |
| Bell Silver | `#C9CCD1` | jingle bell |

### Card (quiet)

| Name | Hex | Use |
|---|---|---|
| Candle Cream | `#F6EFE3` | border paper, headline ground |
| Hearth Brown | `#6B4A35` | headline ink, wood |
| Evergreen | `#23402F` | tree, garland, second line |
| Lamplight | `#F2C46D` | tree lights, candle glow |
| Night Window | `#2B3550` | window, night sky |

Enter the hex codes in the Photoshop Color Picker; they are the source of truth.

### Contrast rule

- Digits are **always Snow Ivory on Cranberry Wool**: WCAG contrast 5.4:1 (computed from the hex values).
- Tinsel Gold on Cranberry Wool is only 2.85:1, so it disappears at 64 px. Gold is a glitter accent on the
  ivory digits, **never the digit fill**.

## Knit motifs

| Motif | What it means | Tier | Banned variants |
|---|---|---|---|
| "11:59" + small "PM" | the deadline minute | 1 | gold digits, script lettering, any clock-app look |
| Progress bar at 97% + jingle bell | the upload that will not finish | 2 | any OS, browser or LMS styling; a percentage drawn by the model (type it) |
| "Submitting…" hem tag | the button you keep staring at | 3 | any real app's button shape or colour |
| Tangled charger cables ending in pom-poms | the last-minute laptop charge | 3 | connector logos, recognisable connector shapes tied to one brand |
| Loading-spinner snowflakes | Fair Isle made of waiting | 3 | a spinner copied from a known product |
| Tiny hourglasses | time running out | 3 | — |
| Coffee cups with steam (hem band) | the all-nighter | 3 | cups with café logos or sleeves |
| Closed laptop with red bow (card) | the gift is that it is closed | card extra | any logo, any fruit, any lid sticker |
| Cocoa mug (card) | calm after the deadline | card extra | brand mugs |

## Card copy (Hand-set Lettering)

```
Peace on Earth
```
```
and a successful upload.
```

The headline is sincere and large; the second line is small, a beat later. Both are type layers.

## Type guidance

- **Every word or number is Hand-set Lettering** (editable type), never generated.
- **Digits "11:59":** a heavy, rounded slab or stitch-style display face from Photoshop's included fonts.
  Open counters (the loops in 9 and the colon dots must stay open at 64 px). Tracking slightly loose.
- **"PM", "97%", "Submitting…":** the same family, a lighter weight.
- **Card headline:** a warm serif from Photoshop's included fonts; second line in the same serif, italic
  or small caps, about 35–40% of the headline size.
- **Test at 64 px** before committing to a face: set it, flatten a copy, view it in the Thumbnail Test.

## What reads at 128 px — checklist

- [ ] "11:59" is recognisable as a time, not "11:39" or "1159".
- [ ] The colon is visible as two dots.
- [ ] The progress bar reads as a bar that is almost, but not quite, full.
- [ ] The bar is clearly below the digits, not touching them.
- [ ] Sweater silhouette reads as a sweater (sleeves spread, ribbed hem).
- [ ] On the card: the face reads as a person with panda styling, and the chest digits survive the folds.
- [ ] Grayscale: digits still separate from the red body.

## Do not

- No brands, logos, trademarks or slogans anywhere (fonts must come from Photoshop's own library).
- No other people: no family, crowds, celebrities, or background figures. Only the owner's likeness.
- No generated text, numbers or letters. If the model draws text, mask it out and set type.
- No Firefly or non-Nano-Banana model for any pixels that end up in a **Contest Asset**.
- No contest images in this repository (they stay in `work/`, which git ignores).
