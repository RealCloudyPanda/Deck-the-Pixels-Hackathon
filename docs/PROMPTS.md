# Prompts — Nano Banana in Generative Fill

Every prompt here is finished before the session. Copy, paste, generate; never improvise with a scarce
**Generation**. Terms in **bold** are in [GLOSSARY.md](../GLOSSARY.md).

## How to read this file

Each entry has:

- **Id** — use it in the [Generation Log](GEN_LOG.md) and as the layer name prefix (e.g. `GF S03 knit 11:59`).
- **Goal** — what the result must achieve, tied to a Joke Hierarchy tier.
- **Selection** — tool, size in px, feather. Partner models see **only what is inside the selection**, so
  select generously around the target (RESEARCH §3).
- **Prompt** — a fenced block. Copy the whole block into the Generative Fill prompt box.
- **Variants** — 1–2 alternative prompts for a second try. Use one only after a reject.
- **Keep if / Reject if** — decide in under a minute, then log it.
- **Budget** — expected Generations.

Before **every** generation: confirm the model dropdown shows **Nano Banana** (Firefly is the default).

## Two rules from the research

1. **Not a chat model.** A new prompt edits the pixels currently inside the selection; it does not remember
   the previous prompt. To build on a result: keep it, reselect, prompt again with the full instruction.
2. **Annotation prompting.** Draw red guide lines on a separate layer (`00 NOTES`), make it visible for the
   generation, and end the prompt with "Remove the red lines when done." Without that clause the lines can
   survive into the output. Hide `00 NOTES` afterwards.

## Negative Clause

Appended to the end of every prompt (already included in each block below):

```
No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Exception for **S03** (the digits are the shapes being knitted):

```
Keep these exact shapes. Do not add any other characters, logos or marks.
```

---

# Part 1 — Sweater Design (`SWEATER_1159.psd`, 2400 x 2400 px)

## S01 Base

- **Goal:** the whole flat-lay sweater with an empty red chest. Everything else is built on it.
- **Selection:** Select All (Cmd/Ctrl+A). Note: the partner model output may be lower than 2400 px;
  check the generated layer's pixel size (**Verify**, RESEARCH §5). If it is soft, keep it as the base anyway:
  the chest is rebuilt by S03/S04 at higher local resolution.
- **Budget:** 2–4

```
Flat-lay photo, shot from directly above, of a hand-knitted ugly Christmas sweater with the sleeves spread out on a plain warm off-white background, soft even light. Chunky cranberry red wool body, forest green ribbed collar, cuffs and hem, ivory Fair Isle bands across the shoulders. The large centre of the chest is plain red wool, left empty. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant A (if the chest is busy):

```
Flat-lay photo from directly above of a chunky hand-knitted cranberry red Christmas sweater, sleeves spread, plain warm off-white background, soft even light. Forest green ribbed collar, cuffs and hem. Ivory Fair Isle band across the shoulders only. The chest and belly are completely plain red stitches with nothing on them. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant B (if the angle is wrong):

```
Make this a perfectly top-down flat-lay of the same red knitted sweater, symmetrical, sleeves straight out to the sides, the whole sweater inside the frame with even margins. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** top-down, symmetrical enough, chest centre is plain red, stitches visible at 100%.
- **Reject if:** any pattern or text on the chest, a person or hanger visible, perspective view, cropped sleeves.

## S02 Shoulder bands

- **Goal:** tier 3 Fair Isle of loading-spinner snowflakes and hourglasses across the shoulders.
- **Selection:** Rectangular Marquee over the existing ivory band, full sweater width, band height
  + 60 px above and below (about 2000 x 320 px). Feather 8 px. Do two halves if wider than 1500 px.
- **Budget:** 2–3

```
Replace this knitted band with a Fair Isle pattern of repeating snowflakes built from loading-spinner dots, alternating with tiny hourglasses, ivory and green on red wool. Match the stitch size and texture of the rest of the sweater. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant:

```
Knit a classic Fair Isle band here: small snowflakes made of a ring of eight dots, alternating with small hourglass shapes, ivory and pine green stitches on cranberry wool, same stitch scale as the surrounding knit. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** reads as knitted (stitch grid visible), motifs repeat evenly, edges blend into the body.
- **Reject if:** printed look, motifs larger than ~80 px, any letters or numbers.

## S03 Knit digits (type-to-knit pass)

- **Goal:** tier 1. The "11:59" type becomes raised glittery ivory intarsia, shapes unchanged.
- **Selection:** on a **rasterised copy** of the `11:59` type layer (method in RUNBOOK). Cmd/Ctrl-click the
  copy's thumbnail, Select > Modify > Expand **150 px**, feather 10 px. If wider than ~1500 px, do "11" and
  ":59" as two generations with overlapping selections.
- **Budget:** 3–5 (the most important generations in the project)

```
Turn these exact white shapes into raised, slightly glittery ivory knitted intarsia stitches with a little gold tinsel yarn, sitting naturally in the red wool. Keep these exact shapes. Do not add any other characters, logos or marks.
```

Variant:

```
Knit these exact ivory shapes into the red sweater as thick raised intarsia, each stitch visible, a few sparkling gold tinsel threads mixed into the ivory yarn. The outline of every shape must stay exactly the same. Keep these exact shapes. Do not add any other characters, logos or marks.
```

- **Keep if:** digits keep their exact silhouette (toggle the hidden live type on to compare), ivory not gold,
  reads as "11:59" in the Thumbnail Test at 64 px.
- **Reject if:** any digit changes shape, extra characters appear, gold fill dominates, colon dots merge.

## S04 Progress bar

- **Goal:** tier 2. A sewn appliqué bar stuck at 97% with a jingle bell at the stuck end.
- **Selection:** first draw the guide (RUNBOOK): ivory rounded rectangle track ~1100 x 110 px, red fill at
  97% of its length. Then Rectangular Marquee around it + 100 px all sides. Feather 8 px.
- **Budget:** 2–3

```
Turn this bar into a sewn-on appliqué progress bar: ivory felt track, red knitted fill that stops just before the end, green chain stitch outline, a small silver jingle bell sewn where the fill stops, and a short knitting needle holding the final two unfinished loops with a loose ivory yarn tail. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant:

```
Make this a felt appliqué patch stitched onto the sweater: a long ivory felt strip with a red knitted section filling almost all of it, leaving a small empty gap at the right end, outlined in green chain stitch, with one small shiny silver jingle bell at the end of the red section, two live loops on a short knitting needle and a loose ivory yarn tail. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** the empty gap, live loops and loose yarn at the end are visible at 128 px, the bell is at the stuck end, looks sewn.
- **Reject if:** bar is full, bell is elsewhere, any numbers or OS-like styling.

## S05 Sleeve cables (annotation prompting)

- **Goal:** tier 3. Tangled generic charger cables down each sleeve ending in pom-poms.
- **Selection:** make `00 NOTES` visible with red guide lines drawn down each sleeve (RUNBOOK). Lasso one
  sleeve generously (whole sleeve + 80 px). Feather 12 px. One sleeve per generation.
- **Budget:** 2–3

```
Follow the red lines: knit tangled generic charging cables down each sleeve as raised charcoal cord appliqué, knotted, ending in small pom-poms instead of plugs. Remove the red lines when done. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant:

```
Follow the red lines in the image: stitch a thick dark charcoal yarn cord along them like a tangled cable, with two loose knots, ending in a fluffy red pom-pom. Keep the sleeve knit unchanged elsewhere. Remove the red lines when done. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** red lines are gone, cords look stitched on, ends are pom-poms, no plug shapes.
- **Reject if:** any red line remains, a recognisable connector appears, sleeve pattern destroyed.

## S06 Hem tag

- **Goal:** tier 3. A blank woven label at the hem; "Submitting…" is then set as type and warped onto it.
- **Selection:** Rectangular Marquee ~420 x 160 px at the lower right hem, + 60 px margin. Feather 6 px.
- **Budget:** 1–2

```
Add a small sewn-on woven fabric label at the hem, cream with a red border, blank, attached with visible stitches. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant:

```
Place a small blank cream woven clothing tag here, sewn onto the ribbed hem with visible red stitches at each corner, slightly curved with the fabric. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** label is blank and flat enough to warp type onto.
- **Reject if:** any marks on the label.

## S07 Ugly extras

- **Goal:** tier 3 decoration around the bar; makes it an *ugly* sweater without hiding tiers 1–2.
- **Selection:** Lasso a ring around the progress bar, **excluding** the bar itself and the digits (Alt/Option
  drag to subtract). Feather 10 px.
- **Budget:** 1–2

```
Add stitched-on 3D extras around the progress bar: small felt holly leaves, two red pom-poms and a short strand of tinsel garland. Keep everything else unchanged. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** extras sit outside the bar and digits; tier 1 and 2 still pass at 64/128 px.
- **Reject if:** extras overlap the digits or the gap at the end of the bar.

## S08 Hem band

- **Goal:** tier 3 coffee cups and hourglasses on the green hem.
- **Selection:** Rectangular Marquee over the hem ribbing, full width (two halves if > 1500 px), + 40 px.
  Feather 8 px.
- **Budget:** 1–2

```
Replace this band with a repeating knitted pattern of tiny steaming coffee cups and hourglasses, ivory on green. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** knitted, repeating, still reads as ribbing at the edge.
- **Reject if:** printed look, cups with any marks.

## S09 Optional light-up variant

- **Goal:** optional; A/B against the plain digits in the Thumbnail Test. Only if budget allows.
- **Selection:** same as S03 on the already knitted digits, Expand 60 px.
- **Budget:** 0–2

```
Outline the digits with tiny knitted-in Christmas light bulbs that glow warm white. Keep these exact shapes. Do not add any other characters, logos or marks.
```

- **Keep if:** the Thumbnail Test shows it reads better at 64 px than without.
- **Reject if:** glow blurs the colon or the digit counters.

**Sweater total:** about 15–26 Generations; the plan allows 35 (Nov 20–26).

---

# Part 2 — Finished Card (`CARD_1159.psd`, 1500 x 2100 px)

Start only after the Sweater Design is exported as Image 1 ([ADR 0001](adr/0001-lock-sweater-before-card.md)).

## C01 Panda Self

- **Goal:** the owner's own likeness, restyled into a messy brown panda look, face still recognisable.
  The only likeness allowed in either image.
- **Selection:** on the owner's own photo layer: Select Subject, then Expand **120 px**, feather 15 px
  (subject plus generous margin so hair and ears have room).
- **Budget:** 4–6 (variant A and B are an A/B pair; try both before choosing)

Variant A (styled human):

```
Restyle this person for a cosy holiday portrait with a messy brown panda look: fluffy brown panda-ear beanie, soft brown-and-cream panda face paint around the eyes, messy hair. Keep the same face, identity, expression and pose. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant B (soft 3D character):

```
Turn this person into a stylised soft 3D brown panda character that keeps their facial features, hairstyle and expression, same pose. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** the owner recognises themself, the panda look reads at 256 px, hands and shoulders intact.
- **Reject if:** identity drifts, a second face appears, any text on clothing.

## C02 Room

- **Goal:** the sincere setup: a calm, warm living room at night.
- **Selection:** Select Subject → Select > Inverse → Select > Modify > Contract **20 px**, feather 10 px.
  If the area is over ~1500 px on its long side, do top and bottom halves with overlap.
- **Budget:** 2–4

```
A calm, wholesome living room at night for a holiday card portrait: softly glowing Christmas tree with warm white lights, a window with gentle snowfall, a wooden mantel with candles and pine garland, shallow depth of field, warm cream and pine green tones. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant:

```
Behind the person, a cosy night-time living room photographed with a shallow depth of field: a decorated tree with warm white lights on the left, a snowy window, candles on a wooden mantel, soft warm light, calm and quiet. Keep the person unchanged. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** no people or faces in the background, light direction matches the portrait.
- **Reject if:** a second person, a TV screen with content, framed photos of people.

## C03 Dress (Reference Layer technique)

- **Goal:** the Panda Self wears exactly the Image 1 sweater. Steps in [RUNBOOK](RUNBOOK.md#c03-dress--the-reference-layer-technique).
- **Selection:** canvas temporarily extended 1500 px to the right with the **Reference Layer** visible there.
  Lasso the torso and arms of the person **and** a band across the reference sweater in one selection
  (Shift-drag to add). Feather 12 px.
- **Budget:** 4–6

```
Dress the person on the left in exactly the sweater shown on the right: same cranberry wool, same Fair Isle bands, same unfinished final loops, needle and yarn tail, same progress bar and bell, same cables on the sleeves, same hem tag. Keep the person's face, pose and the room unchanged. Fit the sweater naturally to the body with folds and the room's warm light. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant:

```
Copy the knitted sweater on the right onto the person on the left so it fits their body: identical colours, bands, chest progress bar with bell, and sleeve cables, with natural folds. Leave the chest centre plain red where the digits go. Do not change the face, hands or background. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** colours, bands, bar and cables match Image 1; the digits are re-applied as type afterwards anyway.
- **Reject if:** face changes, sweater drifts to a different design.

## C04 Fix

- **Goal:** clean seams at hands, cuffs and edges.
- **Selection:** small Lasso around the problem area + 40 px, feather 8 px.
- **Budget:** 1–3

```
Fix this area so the sleeve cuff and hand look natural; keep the sweater pattern unchanged. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

## C05 Border

- **Goal:** a vintage card frame.
- **Selection:** Select All, then Select > Modify > Contract **90 px**, then Select > Inverse (a 90 px frame).
  Feather 0. If the frame fails as one generation, do two halves (top + right, bottom + left).
- **Budget:** 1–2

```
A vintage holiday card border: thin gold foil line, small pine sprigs in the corners, cream paper texture. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

## C06 Props

- **Goal:** the card extra tier (laptop with bow, cocoa).
- **Selection:** Lasso on the sofa cushion ~400 x 260 px + 60 px; second Lasso on the side table ~260 x 260 px + 60 px.
- **Budget:** 2

```
A closed plain silver laptop with no logo, wrapped with a red satin bow, resting on the sofa cushion. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

```
A mug of cocoa with gentle steam on the side table. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Reject if:** any logo or mark on the laptop or mug.

**Card total:** about 14–23 Generations.

---

# Generation Budget calendar

Free Photoshop web: **5 Generations per day** (official rules page, read 2026-11-18). Nov 20 → Dec 7 is
17 full days plus the deadline morning.

| Dates | Phase | Generations | Exit criterion |
|---|---|---|---|
| Nov 20–22 | Sweater base + bands (S01, S02, S08) | 15 | Base sweater kept, bands read as Fair Isle |
| Nov 23–25 | Chest joke (S03, S04, S07) + Thumbnail Test | 15 | Tier 1 reads at 64 px, tier 2 at 128 px |
| Nov 26 | Sleeves + tag (S05, S06); **export Image 1** | 5 | Sweater locked (ADR 0001) |
| Nov 27–28 | Panda Self (C01 A/B) | 10 | Likeness kept, look approved |
| Nov 29–Dec 1 | Room + dress (C02, C03) | 15 | Sweater on body matches Image 1 |
| Dec 2 | Fixes, border, props (C04–C06) | 5 | No visible seams at 100% |
| Dec 3–5 | Reserve / redo weakest tier; Tally with 3 people | 15 | ≥ 2/3 testers name the joke |
| Dec 6 | Export, Layers Screenshot, Written Answers | 0–5 | Checklist complete |
| Dec 7 (before 12:00 ET) | Submit with 4 h margin | 0 | Submitted |

Unused Generations do not carry over (they reset daily), so spend reserve days on the weakest tier.

## Trial-week rule

If by **Nov 29** the reserve is projected short, the owner (never the kit, never automated) starts the
7-day free trial on **Nov 30** to cover Nov 30–Dec 6, and sets a reminder to cancel on **Dec 5**.
Partner models may cost premium generative credits even in the trial (**Verify** in the account).

## When a generation fails

| Symptom | Do this next | Costs |
|---|---|---|
| Result looks pasted on, hard edge | **Reselect wider** (+50% margin), feather +5 px, same prompt | 1 |
| Model ignored part of the prompt | **Simplify the prompt**: one change per generation, use the Variant | 1 |
| Area too big, soft or low detail | **Split the selection** into overlapping halves ≤ 1500 px | 2 |
| Almost right, one small flaw | **Accept and fix with C04** on a small selection, or mask by hand | 0–1 |
| Two rejects in a row on the same step | **Stop for the day.** Rewrite the prompt offline, log both rejects | 0 |
| Text or a logo appeared | Mask it out by hand with Clone Stamp (avoid the Remove tool: it is a Firefly feature, **Verify**) and re-run only if it is in a tier 1–2 area | 0–1 |
