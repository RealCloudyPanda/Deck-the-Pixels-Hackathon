import { createTallySession } from '../lib/tallySession';
import type { SlotKind } from '../lib/validate';
import { MAX_TESTERS, summarize, type Verdict } from '../lib/tally';
import { h } from './dom';
import { getState, subscribe, visibleImages } from './store';
import { stepDown } from './render';

const REVEAL_SECONDS = 3;
const VERDICTS: { v: Verdict; label: string }[] = [
  { v: 'got', label: 'Got it' },
  { v: 'partly', label: 'Partly' },
  { v: 'missed', label: 'Missed' },
];

export function mountTally(root: HTMLElement, announce: (msg: string) => void): void {
  let selected: SlotKind = 'sweater';
  const session = createTallySession({
    storage: { getItem: (key) => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) },
    schedule: (tick) => window.setInterval(tick, 1000),
    unschedule: (timer) => window.clearInterval(timer as number),
    storageFailed: () => announce('Browser storage is unavailable. Export responses before closing this tab.'),
  });
  const currentTally = () => session.snapshot().tally;
  const sync = () => {
    const image = visibleImages(getState())[selected];
    return session.sync({ subject: selected, practice: getState().sample, image,
      revision: image?.digest ? { subject: selected, digest: image.digest, name: image.name, width: image.width, height: image.height } : null });
  };
  let focusAfter: string | null = null;
  const dialog = h('dialog', { class: 'tally-dialog', 'aria-label': 'Thumbnail Tally' });
  root.after(dialog);

  const cancel = (): void => {
    session.cancel();
    dialog.close();
    root.querySelector<HTMLInputElement>('#tally-name')?.focus();
  };
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    cancel();
  });

  const subject = () => {
    return visibleImages(getState())[selected];
  };

  const cancelButton = () => {
    const button = h('button', { type: 'button', class: 'btn btn--quiet' }, 'Cancel');
    button.addEventListener('click', cancel);
    return button;
  };

  const startReveal = (name: string, img: NonNullable<ReturnType<typeof subject>>): void => {
    const canvas = stepDown(img.img, 128);
    canvas.className = 'thumb__img';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', img.sample ? 'Sample composition sketch at 128 pixels' : 'The image at 128 pixels, shown briefly');
    const left = REVEAL_SECONDS;
    const count = h('p', { class: 'reveal__count mono', 'aria-hidden': 'true' }, String(left));
    dialog.replaceChildren(h('div', { class: 'reveal' }, img.sample ? h('p', { class: 'hint' }, 'Practice · Sample sketch') : '', canvas, count, cancelButton()));
    dialog.showModal();
    announce(`Showing the image for ${REVEAL_SECONDS} seconds.`);
    session.reveal(name, (seconds) => { count.textContent = String(seconds); }, () => showAnswer(name));
  };

  function showAnswer(name: string): void {
    const area = h('textarea', { id: 'tally-answer', rows: 3, placeholder: 'In their words…', required: true });
    const form = h(
      'form',
      { class: 'tally__form' },
      h('label', { for: 'tally-answer', class: 'field__label' }, `${selected === 'sweater' ? 'What is unfinished, and why?' : 'What is happening in this holiday portrait?'} ${name ? `(${name})` : ''}`),
      area,
      h('div', { class: 'tally__actions' }, h('button', { type: 'submit', class: 'btn btn--primary' }, 'Save answer'), cancelButton()),
    );
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!area.value.trim()) {
        area.focus();
        return;
      }
      dialog.close();
      focusAfter = `verdict-${currentTally().entries.length}-got`;
      if (!session.answer(area.value)) return;
      render();
      announce('Answer saved. Mark it Got it, Partly or Missed.');
    });
    dialog.replaceChildren(form);
    area.focus();
    announce('Image hidden. Type what the joke is.');
  }

  function flow(): HTMLElement {
    const count = currentTally().entries.length;
    const img = subject();
    const subjectSelect = h('select', { id: 'tally-subject' },
      h('option', { value: 'sweater' }, 'Sweater design'), h('option', { value: 'card' }, 'Finished card'));
    subjectSelect.value = selected;
    subjectSelect.addEventListener('change', () => {
      selected = subjectSelect.value as SlotKind;
      sync();
      render();
      root.querySelector<HTMLElement>('#tally-subject')?.focus();
    });
    const subjectControl = h('div', {},
      h('label', { for: 'tally-subject', class: 'field__label' }, 'Choose the image to test'), subjectSelect);
    if (count >= MAX_TESTERS) {
      return h('div', {}, subjectControl,
        h('p', { class: 'tally__done' }, `All ${MAX_TESTERS} testers recorded. Mark each answer below.`));
    }
    const nameInput = h('input', { id: 'tally-name', type: 'text', autocomplete: 'off', placeholder: 'Optional' });
    nameInput.value = root.querySelector<HTMLInputElement>('#tally-name')?.value ?? '';
    const go = h('button', { type: 'submit', class: 'btn btn--primary', disabled: !img }, `Show for ${REVEAL_SECONDS} seconds`);
    const form = h(
      'form',
      { class: 'tally__form' },
      h('label', { for: 'tally-name', class: 'field__label' }, `Tester ${count + 1} of ${MAX_TESTERS}`),
      nameInput,
      subjectControl,
      h('p', { class: 'hint' }, selected === 'sweater' ? 'Question after three seconds: What is unfinished, and why?' : 'Question after three seconds: What is happening in this holiday portrait?'),
      go,
      img ? h('p', { class: 'hint' }, `Hand the screen to the tester as you start. Shows the ${img.kind === 'card' ? 'Finished Card' : 'Sweater Design'} at 128 px, then hides it.`) : h('p', { class: 'hint' }, 'Load an image first.'),
    );
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!img || dialog.open) return;
      const name = nameInput.value.trim();
      nameInput.value = '';
      startReveal(name, img);
    });
    return form;
  }

  function entries(): HTMLElement | null {
    const { entries } = currentTally();
    if (!entries.length) return h('p', { class: 'tally__empty hint' }, 'No answers yet. Three people who have not seen the idea, one at a time.');
    return h(
      'ol',
      { class: 'tally__list' },
      ...entries.map((e, i) =>
        h(
          'li',
          { class: 'entry' },
          h('p', { class: 'entry__who' }, e.name),
          h('p', { class: 'entry__answer' }, `“${e.answer}”`),
          (() => {
            const group = h('div', { class: 'seg', role: 'group', 'aria-label': `Verdict for ${e.name}` });
            VERDICTS.forEach(({ v, label }) => {
              const b = h('button', { type: 'button', class: `seg__btn seg__btn--${v}`, 'aria-pressed': String(e.verdict === v), id: `verdict-${i}-${v}` }, label);
              b.addEventListener('click', () => {
                focusAfter = b.id;
                session.mark(e.id, v);
                render();
              });
              group.append(b);
            });
            return group;
          })(),
        ),
      ),
    );
  }

  function footer(): HTMLElement {
    const tally = currentTally();
    const { practice: sampleMode, warning: storageWarning } = session.snapshot();
    const legacy = session.legacyMarkdown();
    const legacyCopy = h('button', { type: 'button', class: 'btn btn--quiet', disabled: !legacy }, 'Copy legacy unbound archive');
    legacyCopy.addEventListener('click', () => { window.prompt('Copy unbound archive:', legacy ?? ''); });
    const s = summarize(tally);
    const copy = h('button', { type: 'button', class: 'btn', disabled: !tally.entries.length }, 'Copy as Markdown');
    copy.addEventListener('click', async () => {
      const md = session.markdown(new Date().toLocaleDateString('en-CA'));
      try {
        await navigator.clipboard.writeText(md);
        copy.textContent = 'Copied';
        announce('Tally copied as Markdown.');
        window.setTimeout(() => (copy.textContent = 'Copy as Markdown'), 1600);
      } catch {
        window.prompt('Copy the Tally:', md);
      }
    });
    const reset = h('button', { type: 'button', class: 'btn btn--quiet', disabled: !tally.entries.length }, 'Reset');
    reset.addEventListener('click', () => {
      const message = sampleMode ? 'Clear the practice Tally?' : 'Delete all Tally answers saved in this browser? This cannot be undone.';
      if (window.confirm(message)) {
        focusAfter = 'tally-name';
        session.reset();
        render();
        announce('Tally reset.');
      }
    });
    const download = h('button', { type: 'button', class: 'btn', disabled: !tally.entries.length }, 'Export revision + responses');
    download.addEventListener('click', () => {
      const data = session.export(new Date().toISOString());
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = h('a', { href: url, download: `thumbnail-${selected}-feedback.json` });
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    return h(
      'div',
      { class: 'tally__foot' },
      h('p', { class: 'tally__score' }, h('span', { class: 'mono tally__big' }, `${s.got} of ${MAX_TESTERS}`), ' got it'),
      h('div', { class: 'tally__actions' }, sampleMode ? null : copy, sampleMode ? null : download, reset, legacy ? legacyCopy : null),
      storageWarning ? h('p', { role: 'status', class: 'hint' }, 'Storage unavailable: export responses before closing this tab.') : null,
      h('p', { class: 'hint' }, sampleMode ? 'Practice answers stay in this tab until you reload.' : 'Private: for your own decisions, never a public metric. Saved only in this browser.'),
    );
  }

  function render(): void {
    const focused = root.contains(document.activeElement) ? document.activeElement?.id : undefined;
    root.replaceChildren(flow(), entries() ?? '', footer());
    const target = focusAfter || focused;
    if (target) document.getElementById(target)?.focus({ preventScroll: !focusAfter });
    focusAfter = null;
  }

  sync();
  subscribe(() => {
    if (!sync()) return;
    if (dialog.open) cancel();
    render();
  });
  render();
}
