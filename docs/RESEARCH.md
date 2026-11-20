# Research — Nano Banana in Photoshop Generative Fill

Collected 2026-11-20 with web search. Photoshop's partner-model features change between releases,
so every line marked **Verify** must be checked in the owner's own Photoshop before relying on it.
The Devpost pages (`deckthepixels.devpost.com`, `/rules`) returned HTTP 403 to automated fetches;
contest facts below come from the coordinator's brief and must be re-read on the live rules page.

## 1. Contest facts (from the brief, re-read on Devpost before submitting)

| Fact | Value | Source |
|---|---|---|
| Deadline | Dec 7 2026, 4:00 PM ET | coordinator brief / Devpost |
| Deliverables | 2 images (PNG/JPEG): sweater design, finished card | brief |
| Also required | Written answers on how Nano Banana + Photoshop made each image; screenshot of the Photoshop file with the Layers panel visible | brief |
| Tool rule | All images created in Adobe Photoshop using Nano Banana selected as the Generative Fill model | brief |
| Eligibility | Individuals; new original work made during the contest period | brief |
| Likeness | Only the entrant's own likeness | brief |
| IP | No third-party logos, trademarks or slogans | brief |
| Free tier | Photoshop web free: 5 generations/day; 7-day free trial available | brief, **Verify** in account |
| Prizes | 1st $8k, 2nd $5k, 3rd $3k; The Worst Noel (best ugly sweater) $2k x3; Top Banana (best use of Nano Banana) $2.5k; Community Choice $500 | brief |
| Judging | Technological implementation; Innovation / idea; Design | brief |

## 2. Model selection

- In Photoshop, start **Generative Fill** from the Contextual Task Bar (or Edit > Generative Fill)
  and pick **Gemini (Nano Banana)** from the model dropdown. Firefly Fill & Expand is the default,
  so the dropdown must be checked on **every** generation.
  [Adobe Learn: Nano Banana generative edits](https://www.adobe.com/learn/photoshop/web/nano-banana-generative-edits)
- The partner list has grown over 2026: Gemini 2.5 (Nano Banana), Gemini 3 (Nano Banana Pro),
  Gemini 3.1 (Nano Banana 2), FLUX Kontext Pro, FLUX.2 pro. One source reports Gemini 2.5 retired.
  [rangy.ai comparison](https://rangy.ai/blog/photoshop-generative-fill-alternatives),
  [chatcut.io guide](https://chatcut.io/blog/how-to-use-nano-banana-in-photoshop)
- Only "Nano Banana"-family models count for this contest. Never use FLUX or Firefly for a
  generation that ends up in a submitted image. **Verify** which Gemini versions the free web tier offers.
- photoshopcafe recommends Nano Banana 2 for most work and reports Nano Banana Pro returns lower
  resolution inside Photoshop. [photoshopcafe](https://photoshopcafe.com/how-to-use-gemini-3-nano-banana-pro-in-photoshop/)

## 3. Selections and prompts

- **Partner models see only what is inside the selection.** Select generously around the target so
  the model gets context; tight selections give results that look pasted on.
  [Adobe Learn](https://www.adobe.com/learn/photoshop/web/nano-banana-generative-edits)
- Use soft, loose selections (Selection Brush with low hardness) to reduce seams.
  [Adobe community thread](https://community.adobe.com/questions-712/gemini-2-5-nano-banana-and-flux-kontext-pro-models-now-in-photoshop-max-update-27-0-1183321/index2.html)
- Select All (Cmd+A) to edit the whole image, e.g. a background swap.
- Write instructions, not keywords: say what changes **and what must stay the same** ("keep the
  same pose, same face, same sweater").
  [chatcut.io](https://chatcut.io/blog/how-to-use-nano-banana-in-photoshop)
- **Nano Banana is not a chat model inside Photoshop.** A new prompt edits the current pixels in the
  selection, not the previous conversation. To build on a result, keep it, reselect, prompt again.
- **Annotation prompting:** draw red arrows/notes on a separate layer, then prompt
  "Follow the red notes in the image. Remove them after you're done." Without the removal clause,
  the notes can survive into the output. Useful for placing motifs exactly.
- Generated text is unreliable. Set every word and number with Photoshop type layers (see BRIEF).

## 4. Reference images

- Adobe announced reference-image support for partner models in **Photoshop Beta (desktop)**:
  click the reference icon right of the model picker; up to 8 references with Gemini 3.
  [Adobe announcement](https://community.adobe.com/announcements-698/3rd-party-generative-fill-reference-image-support-now-available-in-beta-1556597)
- Not documented for Photoshop on the web. **Fallback that works anywhere:** place the approved
  sweater as a layer *inside the canvas next to the portrait*, select across both, prompt
  "dress the person in exactly the sweater shown on the right", then mask the reference away.
  This is the "reference layer" technique the runbook uses.

## 5. Resolution and cost

- Firefly Fill & Expand moved to 2K output; partner-model resolution is not documented and is
  reported lower for some models. Plan canvases so each generation covers at most ~1500 px on its
  long side, and assemble the rest with masks. **Verify** by checking a generated layer's pixel size.
  [9to5Mac on 2K output](https://9to5mac.com/2026/01/27/photoshops-ai-tools-now-offer-higher-resolution-output-fewer-artifacts-more-control/)
- Partner-model Generative Fill is premium: about 10 generative credits per generation versus 1 for
  Firefly (Adobe help, via search summary). Free-plan credits are monthly and expire.
  [Adobe generative credits FAQ](https://helpx.adobe.com/ie/firefly/using/generative-credits-faq.html)
- Generative Upscale (Firefly, up to 6144 px) is a separate feature and is **not** Nano Banana, so it
  must not be the source of any submitted pixels' content. Plain Image Size resampling is fine.
  [Photoshop Essentials](https://www.photoshopessentials.com/photo-editing/how-to-use-generative-upscale-in-photoshop-2026/)

## 6. Implications for this kit

1. Budget is the binding constraint: ~5 Nano Banana generations/day on free web. 17 calendar days
   remain (Nov 20 → Dec 7). Prompts must be finished before the session, never improvised.
2. Lock the sweater first, reuse it in the card as a reference layer (ADR 0001).
3. All lettering is type layers; prompts include "no text, no letters, no logos".
4. Log every generation (date, model, selection, prompt, kept?) as it happens: the written answers
   and the "Top Banana" case are built from that log.

## Further reading

- [Photoshop Roadmap: Christmas lettering with Photoshop and Nano Banana](https://photoshoproadmap.com/create-elegant-christmas-lettering-for-your-holiday-designs-with-photoshop-and-nano-banana/)
- [Adobe Design: Behind the design of partner models](https://adobe.design/ideas/behind-the-design-partner-models-in-adobe-photoshop)
- [PHLEARN on Nano Banana Pro in Photoshop](https://phlearn.com/?p=1677366)
