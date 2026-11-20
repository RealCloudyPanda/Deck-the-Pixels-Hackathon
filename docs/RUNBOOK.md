# Photoshop runbook

Follow with Photoshop on one screen and this file on the other. Prompts live in [PROMPTS.md](PROMPTS.md);
log every Generation in [GEN_LOG.md](GEN_LOG.md) the moment it finishes. Terms are in
[GLOSSARY.md](../GLOSSARY.md).

## 0. Setup (once)

1. Create a local folder `work/` in this repo (git ignores it). All PSDs and exports live there.
2. Photoshop: Edit > Color Settings (or the document's colour mode) → **RGB, sRGB IEC61966-2.1, 8 bits/channel**.
3. New document **`SWEATER_1159.psd`**: 2400 x 2400 px, 300 ppi, sRGB, 8-bit, background `#F2EADB`.
4. Save immediately as `work/SWEATER_1159_v01.psd`.

### Before every generation

1. Make the selection exactly as PROMPTS.md says (tool, size, feather).
2. Start **Generative Fill** (Contextual Task Bar or Edit > Generative Fill).
3. Open the **model dropdown** and select **Nano Banana** (the rules page confirms this is how Nano Banana
   is used). Firefly is the default, so check the dropdown **every time**. Which Gemini version is offered
   on the free web tier: **Verify** in your account and write it in the Generation Log.
4. Paste the prompt block, generate, review the variations in the Properties panel.
5. Keep or reject per PROMPTS.md; rename the kept layer `GF <id> <short name>`; add a Generation Log row.

### How to tell which model made a layer

Select a generative layer and open the **Properties** panel: it shows the prompt and the variations. The
model name shown there for partner-model layers: **Verify** in your build. If it is not shown, your
Generation Log row (date, time, model) is the record, which is why you fill it in immediately.

## 1. Sweater layer tree

Create these groups now (empty), top to bottom, and keep every new layer inside its group:

```
SWEATER_1159.psd
├─ 00 NOTES (hidden)            annotation lines for S05
├─ 50 TYPE                      T 11:59 (hidden, source of truth) · T PM · T 97% · T Submitting…
├─ 40 EXTRAS                    GF S07 holly + pom-poms
├─ 30 CHEST                     GF S03 knit 11:59 · GF S04 progress bar · progress-bar guide (hidden)
├─ 20 SLEEVES + BANDS           GF S05 cables · GF S02 shoulder band · GF S08 hem band · GF S06 hem tag
├─ 10 BASE                      GF S01 base sweater
└─ Background                   #F2EADB
```

`GF` = generative layer (renamed, prompt still visible in Properties). `T` = live type.

## 2. Sweater session, step by step

### S01 Base (Nov 20–21)

1. Select group `10 BASE`. Cmd/Ctrl+A.
2. Generative Fill → Nano Banana → paste **S01**. Generate.
3. Keep the best variation; rename layer `GF S01 base sweater`.
4. Check the generated layer's pixel size (Image > Image Size is the canvas; for the layer, Cmd/Ctrl-click
   its thumbnail and read the selection size in the Info panel). Note it in the log (RESEARCH §5 **Verify**).
5. Save `work/SWEATER_1159_v02.psd`.

### S02 Shoulder bands

1. Select group `20 SLEEVES + BANDS`.
2. Rectangular Marquee over the shoulder band + 60 px above and below; Select > Modify > Feather 8 px.
3. If the selection is wider than ~1500 px, do the left half first, then the right half overlapping by 150 px.
4. Generate with **S02**. Rename `GF S02 shoulder band`.

### S08 Hem band

1. Rectangular Marquee over the green hem ribbing + 40 px. Feather 8 px. Halves if > 1500 px.
2. Generate with **S08**. Rename `GF S08 hem band`.
3. Save `work/SWEATER_1159_v03.psd`.

### Set the type (no Generation)

1. Select group `50 TYPE`. Type tool, Snow Ivory `#F2EADB`, the digit face chosen in [BRIEF](BRIEF.md#type-guidance).
2. Type `11:59`, about 520 px cap height, centred on the chest, upper third of the body.
3. Type `PM` at about 30% of the digit height, right of the digits, baseline aligned.
4. Type `97%` (small, ivory) to sit at the right end of the bar later; `Submitting…` for the hem tag.
5. Flatten a copy (File > Export > Quick Export as PNG to `work/`) and drop it into the Thumbnail Test:
   "11:59" must read at **64 px** before any knit generation is spent.

### S03 Knit digits — the type → rasterised copy → knit pass method

1. Right-click `T 11:59` → **Duplicate Layer**. Right-click the copy → **Rasterize Type**. Move the copy into
   `30 CHEST` and name it `11:59 raster`.
2. **Hide** the live `T 11:59` layer. It stays in `50 TYPE` forever: it is the source of truth and the proof
   in the **Layers Screenshot** that the digits were set as type, not generated.
3. Cmd/Ctrl-click the `11:59 raster` thumbnail to load its shape as a selection.
4. Select > Modify > Expand **150 px**; Select > Modify > Feather 10 px.
5. With `11:59 raster` visible, Generative Fill → Nano Banana → **S03**.
6. Compare: toggle `T 11:59` on and off over the result. Any shape drift = reject.
7. Keep → rename `GF S03 knit 11:59`. Hide `11:59 raster` (do not delete it).
8. Repeat for `PM` only if it does not already look knitted.

### S04 Progress bar

1. In `30 CHEST`, draw the guide with the Rounded Rectangle tool: track 1100 x 110 px, Snow Ivory, centred
   120 px under the digits. Duplicate it, fill Frozen-Bar Red `#E5383B`, and shorten it to **97%** of the
   track (1067 px). Group both as `progress-bar guide`.
2. Rectangular Marquee around the guide + 100 px. Feather 8 px.
3. Generate with **S04**. Keep → `GF S04 progress bar`. Hide `progress-bar guide`.
4. Move `T 97%` just right of the stuck end, or drop it if it crowds the bell at 128 px.

### S07 Ugly extras

1. Group `40 EXTRAS`. Lasso a ring around the bar; Alt/Option-drag to subtract the bar and the digits.
2. Feather 10 px. Generate with **S07**. Keep → `GF S07 holly + pom-poms`.
3. Thumbnail Test: tier 1 at 64 px and tier 2 at 128 px must still pass. If not, mask the extras back.
4. Save `work/SWEATER_1159_v04.psd`.

### S05 Sleeve cables (annotation prompting)

1. Show `00 NOTES`. Brush, pure red `#FF0000`, 14 px hard: draw a wavy line down each sleeve from shoulder
   to cuff with one loop per sleeve (that becomes the tangle).
2. Lasso the left sleeve generously (+80 px). Feather 12 px.
3. Generate with **S05** (the prompt ends with "Remove the red lines when done").
4. Zoom to 100%: if any red remains, reject or clean it with Clone Stamp.
5. Repeat for the right sleeve. Keep → `GF S05 cables`. **Hide `00 NOTES`.**

### S06 Hem tag

1. Rectangular Marquee ~420 x 160 px at the lower right hem + 60 px. Feather 6 px.
2. Generate with **S06**. Keep → `GF S06 hem tag`.
3. Move `T Submitting…` onto the tag, colour Cranberry Wool `#B3263A`.
   Edit > Transform > **Warp** to follow the label's curve; blend mode Multiply at 90% so the weave shows.

### Save versions

Save a new version after every kept generation: `work/SWEATER_1159_v01.psd`, `_v02`, `_v03`, … Never
overwrite; a bad save must not cost Generations.

### Export Image 1 (Nov 26)

1. Check: every group named as in the tree, `T 11:59` hidden but present, `00 NOTES` hidden.
2. File > Export > **Export As**: PNG, 2400 x 2400 px, **Convert to sRGB** on, metadata as offered.
   Keep Content Credentials if Photoshop offers it (**Verify** whether the web version attaches them).
3. Save as `work/exports/IMAGE1_SWEATER_1159.png`.
4. Run the Thumbnail Test on it. The sweater is now **locked** (ADR 0001); later ideas go to the card only.

---

## 3. Card setup

1. New document **`CARD_1159.psd`**: 1500 x 2100 px (5 x 7 in at 300 ppi), sRGB, 8-bit.
2. Save as `work/CARD_1159_v01.psd`.
3. Create the groups, top to bottom:

```
CARD_1159.psd
├─ 60 LETTERING                 T Peace on Earth · T and a successful upload. · T 11:59 chest overlay (warped)
├─ 50 FRAME                     GF C05 border
├─ 40 SWEATER ON BODY           GF C03 dress · GF C04 fixes (masked)
├─ 30 PANDA SELF                GF C01 restyle · owner photo original (hidden)
├─ 20 ROOM                      GF C02 room · GF C06 props
├─ 10 REFERENCE (hidden)        SO SWEATER_1159 (linked Smart Object)
└─ Background
```

`SO` = Smart Object.

## 4. Card session, step by step

### C01 Panda Self (Nov 27–28)

1. File > Place Embedded the owner's **own** photo (or self-made avatar). Only the owner's likeness:
   if anyone else is in the photo, crop or mask them out before any generation.
2. Put it in `30 PANDA SELF`, name it `owner photo original`. Duplicate it; generate on the duplicate.
3. Select > Subject; Select > Modify > Expand 120 px; Feather 15 px.
4. Generative Fill → Nano Banana → **C01 variant A**. Next day (or next generation) try **variant B** on a
   fresh duplicate. Compare both in the Thumbnail Test at 256 px.
5. Keep → `GF C01 restyle`. Hide `owner photo original` (keep it as proof of the source).

### C02 Room

1. Select the `GF C01 restyle` layer. Select > Subject → Select > Inverse → Select > Modify > Contract
   **20 px**; Feather 10 px.
2. Select group `20 ROOM`. Generate with **C02**. Keep → `GF C02 room`.
3. Zoom to 100% around the hair: if the edge is rough, C04 later fixes it.

### C03 Dress — the Reference Layer technique

This is the core technique of the entry (and of the Top Banana argument). Partner models see only the
pixels inside the selection, so the approved sweater must be **inside the canvas** next to the person.

1. Save first (`work/CARD_1159_v04.psd`).
2. Image > **Canvas Size**: Width **+1500 px**, Relative on, anchor **left-middle**. Canvas is now 3000 x 2100.
3. File > **Place Linked** → `work/SWEATER_1159_vNN.psd` (the locked version). It becomes `SO SWEATER_1159`
   in `10 REFERENCE`. Scale it to about the person's torso width and move it into the new right half,
   vertically level with the torso.
4. Make `10 REFERENCE` **visible** for this step.
5. Lasso the person's torso and arms (+40 px). Shift-drag to **add** a band across the reference sweater
   (chest, bands, one sleeve). One selection, spanning both. Feather 12 px. If the combined selection is wider
   than ~1500 px, shrink the reference and move it closer; do not split this one.
6. Select group `40 SWEATER ON BODY`. Generative Fill → Nano Banana → **C03**.
7. Review only the left half. Keep the variation whose colours, bands, bar and cables match Image 1.
   Rename `GF C03 dress`. Add a layer mask that hides everything right of x = 1500.
8. **Hide `10 REFERENCE`.**
9. Image > Canvas Size: Width **−1500 px**, anchor **left-middle** (or Crop tool to 1500 x 2100 from the left).
   Confirm Image > Image Size reads 1500 x 2100.
10. Save `work/CARD_1159_v05.psd`.

**Optional (Photoshop Beta desktop only):** if the reference-image button appears right of the model
picker, attach `IMAGE1_SWEATER_1159.png` as a reference **as well** and use the same prompt (RESEARCH §4,
**Verify** availability on your plan). Log which method produced the kept layer.

### C04 Fix

1. Zoom to 100% and inspect hands, cuffs, collar, hairline.
2. Small Lasso + 40 px, feather 8 px, **C04**. Keep → mask to the problem area → `GF C04 fixes`.

### C05 Border

1. Group `50 FRAME`. Select All → Select > Modify > Contract **90 px** → Select > Inverse.
2. Generate with **C05**. Keep → `GF C05 border`.

### C06 Props

1. Group `20 ROOM`. Lasso on the sofa cushion (~400 x 260 px + 60 px), **C06 laptop prompt**.
2. Lasso on the side table (~260 x 260 px + 60 px), **C06 cocoa prompt**.
3. Keep → `GF C06 props` (two layers are fine: `GF C06 laptop`, `GF C06 cocoa`).

### Re-apply the 11:59 so the card matches Image 1

The generated sweater on the body will have soft or drifted digits. The digits are **Hand-set Lettering**,
so they are re-applied from type:

1. Copy `T 11:59` (and `T PM`) from `SWEATER_1159.psd` into `60 LETTERING`. Name it `T 11:59 chest overlay`.
2. Scale to the chest; Edit > Transform > **Warp** (or Puppet Warp on a Smart Object copy) so it follows the
   folds of the sweater.
3. Blend mode **Multiply** or **Overlay**, opacity 80–95%, whichever lets the knit texture show through while
   the digits stay Snow Ivory. Add a small Inner Shadow (2 px, 30%) to sit it in the wool.
4. Thumbnail Test: the card at 64 px must read "11:59".

### Card lettering

1. `T Peace on Earth`: warm serif, Hearth Brown `#6B4A35` on the cream border or a calm wall area, top third.
2. `T and a successful upload.`: same serif, 35–40% of the headline size, Evergreen `#23402F`, directly under.
3. Neither line may cover the face or the chest digits.

## 5. Export

| Image | File | Size | Format |
|---|---|---|---|
| Image 1 Sweater Design | `work/exports/IMAGE1_SWEATER_1159.png` | 2400 x 2400 | PNG, sRGB |
| Image 2 Finished Card | `work/exports/IMAGE2_CARD_1159.png` | 1500 x 2100 | PNG, sRGB |

1. File > Export > Export As → PNG, **Convert to sRGB** on.
2. If a file is over the Devpost upload limit (**Verify** the limit on the submission form), export JPEG
   quality 90 instead, same pixel size.
3. Keep Content Credentials if Photoshop offers it (**Verify**).
4. Never upscale with Generative Upscale (it is Firefly, not Nano Banana). Plain Image Size resampling only.

## 6. Layers Screenshot recipe

1. Open `CARD_1159.psd` (the final version).
2. Widen the Layers panel to about one third of the screen. Panel menu > Panel Options > **Medium** thumbnails.
3. Expand every group. Make sure these are visible in the list: `10 REFERENCE (hidden)` with
   `SO SWEATER_1159`, the `GF …` layers, the hidden `owner photo original`, the `T …` type layers.
4. Select one Nano Banana layer (e.g. `GF C03 dress`) so the **Properties** panel shows its prompt (and model
   if shown — **Verify**).
5. Take the screenshot (macOS Cmd+Shift+4, Windows Win+Shift+S).
6. Crop out the account avatar, email address and any other personal data. Save as
   `work/exports/LAYERS_CARD_1159.png`.
7. Optional: do the same for `SWEATER_1159.psd` with `50 TYPE` expanded to show the hidden `T 11:59`.
