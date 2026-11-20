# Grill — The 11:59 Sweater

Self-interview run by the planner on 2026-11-20 (grill-with-docs: grilling + domain modeling).
The owner is asleep; their standing instruction is **"accept the recommended answer."**
Format: question → ➡️ recommended answer → ✅ decision. Terms in **bold** are in
[GLOSSARY.md](../GLOSSARY.md).

## Round 1 — What is this repo?

**1.1 Can the repo contain the contest images?**
➡️ No. The rules require every image to be made by the entrant in Photoshop with Nano Banana. The repo
is a **Production Kit**: brief, prompts, runbook, submission drafts, a helper tool. Contest PSDs and
exports live in an ignored `work/` folder and go straight to Devpost.
✅ Accepted. `.gitignore` excludes `work/`, `exports/`, `*.psd`, `*.psb`.

**1.2 Who is the user of the kit?**
➡️ The owner, in two short Photoshop sessions per day at a 5-generation budget. Every doc is written to be
followed with Photoshop open on one screen and the doc on the other: numbered steps, exact layer names,
copy-paste prompts.
✅ Accepted.

**1.3 Which prize is the kit optimised for?**
➡️ The Worst Noel (best ugly sweater) first, Top Banana (best use of Nano Banana) second, overall placing
as a by-product. The sweater gets most of the budget; the written answers are built to argue skill
with Nano Banana.
✅ Accepted.

**1.4 Does the repo need any code?**
➡️ One small local tool, the **Thumbnail Test**: drop the two images, see them at 64/128/256/512 px,
in grayscale and blurred, and record a 3-person "what's the joke?" **Tally**. Judges and community voters
see thumbnails first; the joke has to survive that. Nothing else.
✅ Accepted.

## Round 2 — The joke

**2.1 What is the one-sentence joke?**
➡️ A calm, wholesome holiday portrait of the owner (as their messy brown panda self) wearing a sweater
that celebrates the worst minute of finals season: 11:59 PM, upload frozen.
✅ Accepted.

**2.2 What is the reading order (the Joke Hierarchy)?**
➡️ Three tiers, each tied to a **Read Size**:
1. **64 px** — a giant glittery knit "11:59" on the chest. If only this reads, the joke still lands.
2. **128 px** — the frozen red progress bar under it, stuck at 97%.
3. **512 px and up** — the rewards: "Submitting…" knit tag, tangled generic charger cables down the
   sleeves, loading-spinner snowflakes, tiny hourglasses, coffee cups.
✅ Accepted.

**2.3 "11:59" or "11:59 PM"?**
➡️ "11:59" huge, "PM" small beside it. Huge digits keep tier 1; "PM" removes the "morning?" ambiguity at
full size without costing thumbnail space.
✅ Accepted.

**2.4 Where does the card's greeting carry the joke?**
➡️ The card itself stays sincere. Headline: **"Peace on Earth"**. Under it, small: **"and a successful
upload."** The sincere frame is the setup; the sweater and the last line are the punchline.
✅ Accepted.

**2.5 How is the owner's likeness handled?**
➡️ The owner supplies their own photo or self-made avatar; Nano Banana restyles it into the "messy brown
panda" look while keeping their face recognisable. Nobody else's likeness appears; no crowd, no family
members, no celebrities. Any background people are removed.
✅ Accepted.

**2.6 Any brands at all?**
➡️ None. Cables are generic (no connector logos), the laptop motif has no logo, the progress bar is a plain
bar (no LMS or OS look), fonts come from Photoshop's own font library. Every prompt ends with the
**Negative Clause**.
✅ Accepted.

## Round 3 — Production in Photoshop

**3.1 Which order: sweater or card?**
➡️ Sweater first, fully finished and exported as Image 1, then the card reuses it. The card never
regenerates the sweater from text. (ADR 0001.)
✅ Accepted.

**3.2 How does the sweater stay identical in the card?**
➡️ The **Reference Layer** technique: place the approved sweater PSD as a linked Smart Object beside the
portrait inside the card canvas, select across portrait and reference, prompt "dress the person in exactly
the sweater shown on the right", keep the best result, then hide the reference. Re-apply the
**Hand-set Lettering** on top with Warp so the digits are pixel-identical. If Photoshop Beta desktop's
partner reference-image button is available, use it as well.
✅ Accepted.

**3.3 How is text made?**
➡️ Never generated. "11:59", "PM", "97%", "Submitting…", "Peace on Earth", "and a successful upload." are
editable type layers. For the knit look: a rasterised copy of the type gets a Nano Banana pass ("turn these
exact shapes into raised knitted intarsia stitches, keep the shapes"), the live type layer stays hidden in
the same group as the source of truth and as proof in the **Layers Screenshot**.
✅ Accepted.

**3.4 Canvas sizes?**
➡️ Sweater Design: 2400 x 2400 px flat-lay. Finished Card: 1500 x 2100 px portrait (5 x 7 in at 300 ppi).
Each generation covers at most ~1500 px on its long side; large areas are built from several overlapping
selections.
✅ Accepted.

**3.5 How many generations?**
➡️ About 85 free Nano Banana generations exist before the deadline (17 days x 5). Plan: 30 sweater,
30 card, 25 reserve. Start the 7-day free trial only for the final polish week if the reserve runs low,
and cancel before it bills (owner action; never automated).
✅ Accepted.

**3.6 How is work logged?**
➡️ A **Generation Log** row for every generation (date, image, selection, model, prompt id, kept?). The
written answers quote real numbers from it; nothing is invented.
✅ Accepted.

## Round 4 — The Thumbnail Test tool

**4.1 Stack?**
➡️ Vite + vanilla TypeScript, Vitest for pure logic. No framework, no server, no network. `npm install`
then `npm run dev` from the repo root.
✅ Accepted.

**4.2 Where do images go?**
➡️ Nowhere. Files are read with object URLs in the browser; nothing is uploaded or stored except the
Tally and budget counters in localStorage.
✅ Accepted.

**4.3 What does it show without the owner's images (Sample Mode)?**
➡️ The two **Composition Sketches** (SVG wireframes, labelled "composition sketch, not a contest asset")
load as samples so the tool demos and screenshots honestly.
✅ Accepted.

**4.4 What legibility checks?**
➡️ Size ladder 64/128/256/512, grayscale, blur ("squint"), light/dark gallery background, an
approximate 3:2 gallery crop, and a measured luminance-contrast number at 128 px, labelled as a heuristic.
✅ Accepted.

**4.5 How does the Tally work?**
➡️ Up to 3 testers. Each sees the 128 px card for 3 seconds, then types "what's the joke?" and the owner
marks Got it / Partly / Missed. Saved in localStorage, exportable as Markdown. Results are for the owner's
decisions only and are never quoted as public metrics.
✅ Accepted.

**4.6 Anything else in the tool?**
➡️ A tiny **Generation Budget** counter (x/5 today, resets at local midnight). Cheap, and it is the
constraint that shapes the whole project.
✅ Accepted.

**4.7 Visual direction?**
➡️ "Knitting chart paper": warm paper background with a faint stitch grid, ink text, one cranberry accent,
pine green for success states, mono numerals for pixel sizes. No gradients, no emoji headers.
✅ Accepted.

## Round 5 — Submission and compliance

**5.1 Title and tagline?**
➡️ Title: **The 11:59 Sweater**. Tagline: **"Peace on Earth, and a successful upload."**
✅ Accepted.

**5.2 What goes in the Layers Screenshot?**
➡️ The card PSD with groups expanded to show named generative layers, the hidden reference layer, live
type layers, and the Properties panel showing a Nano Banana generative layer's prompt and model.
✅ Accepted.

**5.3 Are the written answers drafted ahead of time?**
➡️ Yes as templates, with `[[PLACEHOLDER]]` for every fact only the owner knows (counts, what failed,
which variant was kept). The owner must replace every placeholder; a checklist line enforces it.
✅ Accepted.

**5.4 Is AI help with the kit disclosed?**
➡️ Yes, in the README "How this was built": the kit (docs, prompts, tool) was planned and written with an
AI coding assistant; the contest images were made by the owner in Photoshop with Nano Banana.
✅ Accepted.
