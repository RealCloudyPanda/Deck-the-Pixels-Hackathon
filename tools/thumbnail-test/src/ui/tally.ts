import {
  deserialize,
  emptyTally,
  MAX_TESTERS,
  serialize,
  STORAGE_KEY,
  summarize,
  tallyReducer,
  toMarkdown,
  type TallyAction,
  type TallyState,
  type Verdict,
} from '../lib/tally';
import { h } from './dom';
import { getState, subscribe, visibleImages } from './store';
import { stepDown } from './render';

const REVEAL_SECONDS = 3;
const VERDICTS: { v: Verdict; label: string }[] = [
  { v: 'got', label: 'Got it' },
  { v: 'partly', label: 'Partly' },
  { v: 'missed', label: 'Missed' },
];

function load(): TallyState {
  try {
    return deserialize(localStorage.getItem(STORAGE_KEY));
  } catch {
    return deserialize(null);
  }
}

export function mountTally(root: HTMLElement, announce: (msg: string) => void): void {
  let results = load();
  let practice = emptyTally();
  let sampleMode = getState().sample;
  const currentTally = (): TallyState => sampleMode ? practice : results;
  let timer: number | undefined;
  let focusAfter: string | null = null;
  const dialog = h('dialog', { class: 'tally-dialog', 'aria-label': 'Thumbnail Tally' });
  root.after(dialog);

  const cancel = (): void => {
    window.clearInterval(timer);
    dialog.close();
    root.querySelector<HTMLInputElement>('#tally-name')?.focus();
  };
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    cancel();
  });

  const dispatch = (action: TallyAction): void => {
    if (sampleMode) {
      practice = tallyReducer(practice, action);
    } else {
      results = tallyReducer(results, action);
      try {
        localStorage.setItem(STORAGE_KEY, serialize(results));
      } catch {
        /* storage full or blocked: keep in memory */
      }
    }
    render();
  };

  const subject = () => {
    const { card, sweater } = visibleImages(getState());
    return card ?? sweater;
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
    let left = REVEAL_SECONDS;
    const count = h('p', { class: 'reveal__count mono', 'aria-hidden': 'true' }, String(left));
    dialog.replaceChildren(h('div', { class: 'reveal' }, img.sample ? h('p', { class: 'hint' }, 'Practice · Sample sketch') : '', canvas, count, cancelButton()));
    dialog.showModal();
    announce(`Showing the image for ${REVEAL_SECONDS} seconds.`);
    timer = window.setInterval(() => {
      left -= 1;
      if (left > 0) {
        count.textContent = String(left);
        return;
      }
      window.clearInterval(timer);
      showAnswer(name);
    }, 1000);
  };

  function showAnswer(name: string): void {
    const area = h('textarea', { id: 'tally-answer', rows: 3, placeholder: 'In their words…', required: true });
    const form = h(
      'form',
      { class: 'tally__form' },
      h('label', { for: 'tally-answer', class: 'field__label' }, `What's the joke? ${name ? `(${name})` : ''}`),
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
      dispatch({ type: 'add', id: `t${Date.now().toString(36)}`, name, answer: area.value });
      announce('Answer saved. Mark it Got it, Partly or Missed.');
    });
    dialog.replaceChildren(form);
    area.focus();
    announce('Image hidden. Type what the joke is.');
  }

  function flow(): HTMLElement {
    const count = currentTally().entries.length;
    if (count >= MAX_TESTERS) {
      return h('p', { class: 'tally__done' }, `All ${MAX_TESTERS} testers recorded. Mark each answer below.`);
    }
    const img = subject();
    const nameInput = h('input', { id: 'tally-name', type: 'text', autocomplete: 'off', placeholder: 'Optional' });
    nameInput.value = root.querySelector<HTMLInputElement>('#tally-name')?.value ?? '';
    const go = h('button', { type: 'submit', class: 'btn btn--primary', disabled: !img }, `Show for ${REVEAL_SECONDS} seconds`);
    const form = h(
      'form',
      { class: 'tally__form' },
      h('label', { for: 'tally-name', class: 'field__label' }, `Tester ${count + 1} of ${MAX_TESTERS}`),
      nameInput,
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
                dispatch({ type: 'mark', id: e.id, verdict: v });
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
    const s = summarize(tally);
    const copy = h('button', { type: 'button', class: 'btn', disabled: !tally.entries.length }, 'Copy as Markdown');
    copy.addEventListener('click', async () => {
      const md = toMarkdown(tally, new Date().toLocaleDateString('en-CA'));
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
        dispatch({ type: 'reset' });
        announce('Tally reset.');
      }
    });
    return h(
      'div',
      { class: 'tally__foot' },
      h('p', { class: 'tally__score' }, h('span', { class: 'mono tally__big' }, `${s.got} of ${MAX_TESTERS}`), ' got it'),
      h('div', { class: 'tally__actions' }, sampleMode ? null : copy, reset),
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

  let lastSubject = subject();
  subscribe(({ sample }) => {
    const current = subject();
    if (current === lastSubject && sample === sampleMode) return;
    lastSubject = current;
    sampleMode = sample;
    if (dialog.open) cancel();
    render();
  });
  render();
}
