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
