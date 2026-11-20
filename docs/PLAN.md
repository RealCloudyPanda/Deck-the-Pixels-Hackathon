# Implementation plan — The 11:59 Sweater production kit

Read first: the coordinator's COMMON_BRIEF.md (hard rules, design refs), [GRILL.md](GRILL.md) (all decisions),
[GLOSSARY.md](../GLOSSARY.md) (use these terms exactly), [RESEARCH.md](RESEARCH.md),
[ADR 0001](adr/0001-lock-sweater-before-card.md).

## Ground rules for the implementer

- **Never produce, generate, or commit a contest image.** No AI image generation of any kind in this repo.
  The only images you make are the Composition Sketches (hand-written SVG wireframes, labelled) and
  screenshots of the Thumbnail Test tool.
- One task = one commit, conventional-commit message as given. No AI attribution trailers. Do not push.
- Docs are used live next to Photoshop: numbered steps, exact layer names, copy-paste prompt blocks
  (fenced code blocks so they copy cleanly), no filler.
- Mark anything not confirmed in RESEARCH.md with **Verify** rather than asserting it.
- Anything that only the owner knows is written as `[[PLACEHOLDER: what to fill]]`.
- Tool design: apply `REFS/pbakaus_impeccable/.github/skills/impeccable/SKILL.md`,
  `REFS/emilkowalski_skills/skills/emil-design-eng/SKILL.md`,
  `REFS/jakubkrehel_skills/skills/better-ui/SKILL.md` and `better-interface/SKILL.md`
  (REFS path is in the coordinator's common brief).

## Shared creative spec (source for tasks 1–7)

### Joke and hierarchy

| Tier | Read Size | Element |
|---|---|---|
| 1 | 64 px | Giant glittery knit **"11:59"** across the chest, ivory on cranberry; small "PM" beside it |
| 2 | 128 px | Frozen red progress bar under the digits, stuck at **97%**, a 3D jingle bell sewn at the stuck end |
| 3 | 512 px+ | Knit hem tag "Submitting…"; tangled generic charger cables down both sleeves ending in pom-poms; Fair Isle bands of loading-spinner snowflakes and tiny hourglasses; coffee-cup band at the hem |
| Card extra | 512 px+ | A closed laptop (no logo) on the sofa wrapped with a red bow; cocoa mug with steam |

Card copy (Hand-set Lettering): headline **"Peace on Earth"**, second line small **"and a successful upload."**
Title **The 11:59 Sweater**. Tagline **"Peace on Earth, and a successful upload."**

### Palette

Sweater (loud): Cranberry Wool `#B3263A`, Pine Ribbing `#1F5B3A`, Snow Ivory `#F2EADB`,
Tinsel Gold `#D4A62A`, Frozen-Bar Red `#E5383B`, Cable Charcoal `#3A3A3C`, Bell Silver `#C9CCD1`.
Card (quiet): Candle Cream `#F6EFE3`, Hearth Brown `#6B4A35`, Evergreen `#23402F`,
Lamplight `#F2C46D`, Night Window `#2B3550`.
Rule: digits are always Snow Ivory on Cranberry (contrast ≈ 5.7:1); gold is only a glitter accent, never
the digit fill (gold on red ≈ 2.7:1 disappears at 64 px).

### Canvases

- `SWEATER_1159.psd` — 2400 x 2400 px, sRGB, 8-bit, flat-lay from directly above.
- `CARD_1159.psd` — 1500 x 2100 px portrait (5 x 7 in at 300 ppi), sRGB, 8-bit. During C03 the canvas is
  temporarily extended 1500 px to the right to hold the Reference Layer, then cropped back.
- Each generation covers ≤ ~1500 px on its long side (partner-model resolution, see RESEARCH §5).

### Negative Clause (appended to every prompt)

```
No text, no letters, no numbers, no logos, no brand marks, no watermarks, no extra people.
```
For S03 (the digits) use instead: `Keep these exact shapes. Do not add any other characters, logos or marks.`

### Seed prompts (task 2 and 3 expand each into: goal, selection, prompt, 1–2 variants, what to keep/reject)

Sweater:
- **S01 Base** (Select All): "Flat-lay photo, shot from directly above, of a hand-knitted ugly Christmas
  sweater with the sleeves spread out on a plain warm off-white background, soft even light. Chunky
  cranberry red wool body, forest green ribbed collar, cuffs and hem, ivory Fair Isle bands across the
  shoulders. The large centre of the chest is plain red wool, left empty."
- **S02 Bands**: "Replace this knitted band with a Fair Isle pattern of repeating snowflakes built from
  loading-spinner dots, alternating with tiny hourglasses, ivory and green on red wool. Match the stitch
  size and texture of the rest of the sweater."
- **S03 Knit digits** (on a rasterised copy of the type, selection padded ~150 px): "Turn these exact
  white shapes into raised, slightly glittery ivory knitted intarsia stitches with a little gold tinsel
  yarn, sitting naturally in the red wool."
- **S04 Progress bar** (over a shape-layer guide, track ivory, fill 97%): "Turn this bar into a sewn-on
  appliqué progress bar: ivory felt track, red knitted fill that stops just before the end, green chain
  stitch outline, a small silver jingle bell sewn where the fill stops, as if stuck."
- **S05 Cables** (annotation prompting, red guide lines on a hidden NOTES layer): "Follow the red lines:
  knit tangled generic charging cables down each sleeve as raised charcoal cord appliqué, knotted,
  ending in small pom-poms instead of plugs. Remove the red lines when done."
- **S06 Hem tag**: "Add a small sewn-on woven fabric label at the hem, cream with a red border, blank,
  attached with visible stitches." (the word "Submitting…" is then set as type and warped onto it)
- **S07 Ugly extras**: "Add stitched-on 3D extras around the progress bar: small felt holly leaves, two red
  pom-poms and a short strand of tinsel garland. Keep everything else unchanged."
- **S08 Hem band**: "Replace this band with a repeating knitted pattern of tiny steaming coffee cups and
  hourglasses, ivory on green."
- **S09 Optional light-up variant**: "Outline the digits with tiny knitted-in Christmas light bulbs that
  glow warm white." (only if budget allows; A/B with the Thumbnail Test)

Card:
- **C01 Panda Self** (owner's own photo, subject + generous margin). Variant A: "Restyle this person for a
  cosy holiday portrait with a messy brown panda look: fluffy brown panda-ear beanie, soft brown-and-cream
  panda face paint around the eyes, messy hair. Keep the same face, identity, expression and pose."
  Variant B: "Turn this person into a stylised soft 3D brown panda character that keeps their facial
  features, hairstyle and expression, same pose."
- **C02 Room** (subject selected, inverted, contracted 20 px): "A calm, wholesome living room at night for a
  holiday card portrait: softly glowing Christmas tree with warm white lights, a window with gentle
  snowfall, a wooden mantel with candles and pine garland, shallow depth of field, warm cream and pine
  green tones."
- **C03 Dress** (Reference Layer technique): "Dress the person on the left in exactly the sweater shown on
  the right: same cranberry wool, same Fair Isle bands, same progress bar and bell, same cables on the
  sleeves, same hem tag. Keep the person's face, pose and the room unchanged. Fit the sweater naturally to
  the body with folds and the room's warm light."
- **C04 Fix** (hands, cuffs, seams; small selections): "Fix this area so the sleeve cuff and hand look
  natural; keep the sweater pattern unchanged."
- **C05 Border** (frame-shaped selection, 90 px): "A vintage holiday card border: thin gold foil line, small
  pine sprigs in the corners, cream paper texture."
- **C06 Props**: "A closed plain silver laptop with no logo, wrapped with a red satin bow, resting on the
  sofa cushion." and "A mug of cocoa with gentle steam on the side table."

### Generation Budget calendar (free tier: 5/day; Nov 20 → Dec 7 = 17 full days + deadline morning)

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

Trial week: if by Nov 29 the reserve is projected short, the owner (not the kit) starts the 7-day trial on
Nov 30 to cover Nov 30–Dec 6, and sets a reminder to cancel on Dec 5. Partner models cost premium credits
even in trial (**Verify** in the account).

### Layer trees (task 4 and 5 use these names exactly)

```
SWEATER_1159.psd
├─ 00 NOTES (hidden)            annotation lines for S05
├─ 50 TYPE                      T 11:59 (hidden, source of truth) · T PM · T 97% · T Submitting…
├─ 40 EXTRAS                    GF S07 holly + pom-poms
├─ 30 CHEST                     GF S03 knit 11:59 · GF S04 progress bar · progress-bar guide (hidden)
├─ 20 SLEEVES + BANDS           GF S05 cables · GF S02 shoulder band · GF S08 hem band · GF S06 hem tag
├─ 10 BASE                      GF S01 base sweater
└─ Background                   #F2EADB
CARD_1159.psd
├─ 60 LETTERING                 T Peace on Earth · T and a successful upload. · T 11:59 chest overlay (warped)
├─ 50 FRAME                     GF C05 border
├─ 40 SWEATER ON BODY           GF C03 dress · GF C04 fixes (masked)
├─ 30 PANDA SELF                GF C01 restyle · owner photo original (hidden)
├─ 20 ROOM                      GF C02 room · GF C06 props
├─ 10 REFERENCE (hidden)        SO SWEATER_1159 (linked Smart Object)
└─ Background
```
`GF` = generative layer, renamed but with its prompt still visible in the Properties panel. `T` = live type.

## Tasks

Each task: what to build, acceptance check, commit message.

### Docs (owner-facing)

**1. Creative brief** — `docs/BRIEF.md`: the joke in one sentence, Joke Hierarchy table, palette with hex
swatches (markdown table) and the contrast rule, knit motif list (each motif: what it means, tier, banned
variants e.g. no connector logos), card copy, type guidance (heavy rounded slab or stitch-style display
face from Photoshop's included fonts for digits; warm serif for the card headline; test at 64 px), "what
reads at 128 px" checklist, do-not list (brands, other people, generated text).
Accept: every term matches GLOSSARY. Commit `docs: write creative brief for the 11:59 sweater`.

**2. Sweater prompts** — `docs/PROMPTS.md` part 1: how to read the file, Negative Clause, S01–S09 each with
id, goal, selection (tool, size in px, feather), the exact prompt block, 1–2 variants, keep/reject criteria,
expected budget. Add the "not a chat model" rule and annotation-prompting rule from RESEARCH §3.
Accept: every prompt is a fenced block ending with the Negative Clause (or the S03 exception).
Commit `docs: add sweater Generative Fill prompts S01-S09`.

**3. Card prompts and budget** — `docs/PROMPTS.md` part 2: C01–C06 in the same format, then the budget
calendar and trial-week rule, and a "when a generation fails" decision table (reselect wider / simplify
prompt / split selection / accept and fix with C04 / stop for the day).
Commit `docs: add card prompts C01-C06 and generation budget calendar`.

**4. Runbook: sweater session** — `docs/RUNBOOK.md` part 1: setup (canvas, colour mode, Nano Banana in the
model dropdown before every run, how to tell which model made a layer), the SWEATER layer tree, numbered
steps S01→S08 with selection instructions, the type → rasterised copy → S03 knit pass method, how to keep
the live type hidden as proof, saving versions (`SWEATER_1159_v01.psd` in `work/`), Image 1 export.
Commit `docs: write Photoshop runbook for the sweater session`.

**5. Runbook: card session** — `docs/RUNBOOK.md` part 2: CARD layer tree, C01→C06 steps, the Reference Layer
technique in detail (Canvas Size +1500 px right, place linked Smart Object, select across, generate, keep,
hide, crop back), optional Beta reference-image button, re-applying the 11:59 type with Warp/Puppet Warp and
Multiply/Overlay blend so digits match Image 1, export settings (PNG sRGB, Image 1 2400², Image 2 1500x2100;
if over the upload limit export JPEG quality 90; keep Content Credentials), Layers Screenshot recipe (panel
widened, medium thumbnails, groups expanded, Properties panel showing a Nano Banana layer, crop out the
account avatar/email). Commit `docs: write card runbook, export and layers screenshot steps`.

**6. Submission drafts** — `docs/SUBMISSION.md`: title, tagline, 2-sentence description; Written Answer
templates for Image 1 and Image 2 (150–250 words each, specific steps, `[[PLACEHOLDER]]` for counts, failures,
kept variants, taken from the Generation Log); a "Top Banana" paragraph on technique (reference layer,
annotation prompting, type-to-knit pass); final checklist (both images, sizes, formats, screenshot, answers
with zero placeholders left, submitted before Dec 7 12:00 ET as margin); rules compliance table (rule → how
the kit satisfies it → owner check). Plus `docs/GEN_LOG.md`: an empty log table with one example row
marked "example, delete". Commit `docs: draft submission answers, checklist and generation log`.

**7. Composition Sketches** — `docs/images/sketch-sweater.svg` (square) and `docs/images/sketch-card.svg`
(5:7): grey wireframe boxes and labels only (tier 1/2/3 zones, sleeves, tag; card: portrait, room, border,
headline zones), a visible banner "COMPOSITION SKETCH — NOT A CONTEST ASSET". No illustrations, no
generated imagery. Accept: valid SVG, opens in a browser, ≤ 20 KB each.
Commit `docs: add composition sketch SVGs for sweater and card`.

### Thumbnail Test tool (`tools/thumbnail-test/`)

Stack: Vite + vanilla TypeScript + Vitest; root `package.json` with `dev` (`vite tools/thumbnail-test`),
`build`, `test`, `typecheck`. Fonts self-hosted via `@fontsource` (no network at runtime). Pure logic in
`src/lib/*.ts` with tests in `src/lib/*.test.ts`; DOM in `src/ui/*.ts`. No images ever leave the browser.

**8. Scaffold** — package.json, tsconfig (strict), vite config, index.html, empty main.ts, one trivial test.
Accept: `npm install && npm test && npm run build` pass. Commit `chore: scaffold thumbnail test tool with vite and vitest`.

**9. Design system + shell** — CSS tokens (paper `#F6EFE3`, ink `#1E1B18`, cranberry `#B3263A`, pine
`#23402F`, faint stitch-grid background), type scale (Fraunces display, IBM Plex Sans body, IBM Plex Mono
numerals), layout: header with title + Sample Mode switch + budget counter slot, two intake slots, ladder
area, checks toolbar, Tally panel. Visible focus rings, `prefers-reduced-motion` respected.
Commit `feat: add knitting-chart design tokens and app shell`.

**10. Image intake** — drop zone and keyboard-accessible "Choose file" button per slot (Sweater Design,
Finished Card); `lib/validate.ts` checks type (PNG/JPEG), size (warn > 5 MB, **Verify** Devpost limit),
reads pixel dimensions, expected aspect (1:1, 5:7) with warnings; shows filename, px, MB.
Tests for validation. Commit `feat: load sweater and card images with validation`.

**11. Size ladder** — `lib/ladder.ts` computes target sizes 64/128/256/512 preserving aspect; renders by
step-down halving on canvas for honest downscale (not CSS scaling); both images side by side per row with
mono size labels. Tests for size math. Commit `feat: render 64-512 px size ladder with step-down scaling`.

**12. Legibility checks** — toggles: Grayscale, Squint (blur), Dark/Light gallery background, approximate
3:2 gallery crop overlay (labelled "approximate"); `lib/contrast.ts` computes RMS luminance contrast of the
128 px render and shows it with a label "heuristic, higher is punchier". Tests for the metric on synthetic
pixel arrays. Commit `feat: add grayscale, squint, background and crop legibility checks`.

**13. Tally** — "What's the joke?" flow: tester name (optional), 3-second reveal of the 128 px card (then
hidden), free-text answer, owner marks Got it / Partly / Missed; up to 3 testers; summary "x of 3 got it";
`lib/tally.ts` reducer + localStorage persistence + Markdown export (copy button). Reset with confirm.
Note in UI: private, for the owner's decisions, not a public metric. Tests for reducer and serialisation.
Commit `feat: add three-person joke tally saved in localStorage`.

**14. Generation Budget counter** — header widget "Nano Banana today: x / 5", +/− buttons, resets at local
midnight; `lib/budget.ts` with tests for rollover. Commit `feat: add daily generation budget counter`.

**15. Sample Mode** — loads the two Composition Sketches (copied into the tool's `public/`) into both slots,
with a persistent "Sample — composition sketch, not a contest asset" ribbon; default on first visit, off
once real images are loaded. Commit `feat: add sample mode using composition sketches`.

**16. Polish pass** — run impeccable critique + audit: spacing rhythm, empty states, hover/press states,
150–200 ms ease-out transitions, keyboard path through every control, contrast ≥ 4.5:1 for text, no layout
shift on image load, responsive down to 900 px wide. Fix what it finds.
Commit `style: polish thumbnail test spacing, states and accessibility`.

### Release

**17. Screenshots** — start `npm run dev` in background, capture with headless Chrome at 1440x900:
`docs/images/tool-hero.png` (Sample Mode, ladder), `tool-checks.png` (grayscale + squint on),
`tool-tally.png` (tally panel with sample entries entered during capture, cleared afterwards). Kill server.
Commit `docs: add thumbnail test screenshots`.

**18. README** — full README per common brief, adapted to a no-code contest: pitch, hero (tool-hero.png and
the sketch), The problem (one student, 5 generations a day, a joke that must read at 128 px), What it does
(kit contents table linking each doc), The demo moment (the 64 px "11:59" test), How it works (Mermaid:
BRIEF → PROMPTS → Photoshop + Nano Banana → Thumbnail Test → SUBMISSION), Sponsor tech & why (Nano Banana
in Generative Fill; reference-layer, annotation prompting, type-to-knit), Quickstart, Sample mode vs real
images, Judging criteria → where to see proof (table), Project structure, Known limitations (no contest
images in repo; Photoshop features marked Verify; Devpost pages not machine-readable), How this was built
(AI disclosure as in GRILL 5.4), License. Commit `docs: write full README`.

**19. Final verification** — `npm test`, `npm run typecheck`, `npm run build` pass; `git log` has no
AI trailers; no `*.psd`, `work/`, or raster contest-like images tracked (`git ls-files`); all doc links
resolve; README Known limitations updated with anything skipped. Commit `chore: final verification pass`
(only if a fix was needed; otherwise no commit).
