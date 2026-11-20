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
Turn this bar into a sewn-on appliqué progress bar: ivory felt track, red knitted fill that stops just before the end, green chain stitch outline, a small silver jingle bell sewn where the fill stops, as if stuck. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

Variant:

```
Make this a felt appliqué patch stitched onto the sweater: a long ivory felt strip with a red knitted section filling almost all of it, leaving a small empty gap at the right end, outlined in green chain stitch, with one small shiny silver jingle bell sewn at the end of the red section. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```

- **Keep if:** the empty gap at the end is visible at 128 px, the bell is at the stuck end, looks sewn.
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
