import {
  deserialize,
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
import { getState, subscribe } from './store';
import { stepDown } from './render';

const REVEAL_SECONDS = 3;
const VERDICTS: { v: Verdict; label: string }[] = [
  { v: 'got', label: 'Got it' },
  { v: 'partly', label: 'Partly' },
  { v: 'missed', label: 'Missed' },
];

type Phase = { kind: 'idle' } | { kind: 'reveal'; name: string; left: number } | { kind: 'answer'; name: string };

function load(): TallyState {
  try {
    return deserialize(localStorage.getItem(STORAGE_KEY));
  } catch {
    return deserialize(null);
  }
}

export function mountTally(root: HTMLElement, announce: (msg: string) => void): void {
  let tally = load();
  let phase: Phase = { kind: 'idle' };
  let timer: number | undefined;
  let focusAfter: string | null = null;

  const dispatch = (action: TallyAction): void => {
    tally = tallyReducer(tally, action);
    try {
      localStorage.setItem(STORAGE_KEY, serialize(tally));
    } catch {
      /* storage full or blocked: keep in memory */
    }
    render();
  };

  const subject = () => getState().images.card ?? getState().images.sweater;

  const startReveal = (name: string): void => {
    phase = { kind: 'reveal', name, left: REVEAL_SECONDS };
    announce(`Showing the image for ${REVEAL_SECONDS} seconds.`);
    render();
    timer = window.setInterval(() => {
      if (phase.kind !== 'reveal') return;
      const left = phase.left - 1;
      if (left <= 0) {
        window.clearInterval(timer);
        phase = { kind: 'answer', name: phase.name };
        focusAfter = 'tally-answer';
        announce('Image hidden. Type what the joke is.');
      } else {
        phase = { ...phase, left };
      }
      render();
    }, 1000);
  };

  function flow(): HTMLElement {
    const count = tally.entries.length;
    if (count >= MAX_TESTERS) {
      return h('p', { class: 'tally__done' }, `All ${MAX_TESTERS} testers recorded. Mark each answer below, then copy the result.`);
    }
    const img = subject();
    if (phase.kind === 'reveal' && img) {
      const canvas = stepDown(img.img, 128);
      canvas.className = 'thumb__img';
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'The image at 128 pixels, shown briefly');
      return h(
        'div',
        { class: 'reveal' },
        canvas,
        h('p', { class: 'reveal__count mono', 'aria-hidden': 'true' }, String(phase.left)),
        h('p', { class: 'hint' }, `Hand the screen to ${phase.name || 'the tester'}. No hints.`),
      );
    }
    if (phase.kind === 'answer') {
      const name = phase.name;
      const area = h('textarea', { id: 'tally-answer', rows: 3, placeholder: 'In their words…', required: true });
      const form = h(
        'form',
        { class: 'tally__form' },
        h('label', { for: 'tally-answer', class: 'field__label' }, `What's the joke? ${name ? `(${name})` : ''}`),
        area,
        h('div', { class: 'tally__actions' }, h('button', { type: 'submit', class: 'btn btn--primary' }, 'Save answer'), h('button', { type: 'button', class: 'btn btn--quiet', 'data-cancel': '' }, 'Cancel')),
      );
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!area.value.trim()) {
          area.focus();
          return;
        }
        phase = { kind: 'idle' };
        focusAfter = `verdict-${tally.entries.length}`;
        dispatch({ type: 'add', id: `t${Date.now().toString(36)}`, name, answer: area.value });
        announce('Answer saved. Mark it Got it, Partly or Missed.');
      });
      form.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          phase = { kind: 'idle' };
          focusAfter = 'tally-name';
          render();
        }
      });
      form.querySelector('[data-cancel]')?.addEventListener('click', () => {
        focusAfter = 'tally-name';
        phase = { kind: 'idle' };
        render();
      });
      return form;
    }
    const nameInput = h('input', { id: 'tally-name', type: 'text', autocomplete: 'off', placeholder: 'Optional' });
    const go = h('button', { type: 'submit', class: 'btn btn--primary', disabled: !img }, `Show for ${REVEAL_SECONDS} seconds`);
    const form = h(
      'form',
      { class: 'tally__form' },
      h('label', { for: 'tally-name', class: 'field__label' }, `Tester ${count + 1} of ${MAX_TESTERS}`),
      nameInput,
      go,
      img ? h('p', { class: 'hint' }, `Shows the ${img.kind === 'card' ? 'Finished Card' : 'Sweater Design'} at 128 px, then hides it.`) : h('p', { class: 'hint' }, 'Load an image first.'),
    );
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      startReveal(nameInput.value.trim());
    });
    return form;
  }

  function entries(): HTMLElement | null {
    if (!tally.entries.length) return h('p', { class: 'tally__empty hint' }, 'No answers yet. Three people who have not seen the idea, one at a time.');
    return h(
      'ol',
      { class: 'tally__list' },
      ...tally.entries.map((e, i) =>
        h(
          'li',
          { class: 'entry' },
          h('p', { class: 'entry__who' }, e.name),
          h('p', { class: 'entry__answer' }, `“${e.answer}”`),
          (() => {
            const group = h('div', { class: 'seg', role: 'group', 'aria-label': `Verdict for ${e.name}` });
            VERDICTS.forEach(({ v, label }, j) => {
              const b = h('button', { type: 'button', class: `seg__btn seg__btn--${v}`, 'aria-pressed': String(e.verdict === v), id: j === 0 ? `verdict-${i}` : undefined }, label);
              b.addEventListener('click', () => {
                focusAfter = b.id || null;
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
      if (window.confirm('Delete all Tally answers saved in this browser? This cannot be undone.')) {
        window.clearInterval(timer);
        phase = { kind: 'idle' };
        dispatch({ type: 'reset' });
        announce('Tally reset.');
      }
    });
    return h(
      'div',
      { class: 'tally__foot' },
      h('p', { class: 'tally__score' }, h('span', { class: 'mono tally__big' }, `${s.got} of ${MAX_TESTERS}`), ' got it'),
      h('div', { class: 'tally__actions' }, copy, reset),
      h('p', { class: 'hint' }, 'Private: for your own decisions, never a public metric. Saved only in this browser.'),
    );
  }

  function render(): void {
    root.replaceChildren(flow(), entries() ?? '', footer());
    if (focusAfter) {
      document.getElementById(focusAfter)?.focus();
      focusAfter = null;
    }
  }

  subscribe(() => {
    if (phase.kind === 'idle') render();
  });
  render();
}
