import { describeContrast, rmsContrast } from '../lib/contrast';
import { h } from './dom';
import { addDecorator } from './ladder';
import { getState, update, type Checks } from './store';

const TOGGLES: { key: keyof Checks; label: string; hint: string }[] = [
  { key: 'grayscale', label: 'Grayscale', hint: 'Does the joke survive without colour?' },
  { key: 'squint', label: 'Squint', hint: 'Blur, like a glance at a gallery grid' },
  { key: 'dark', label: 'Dark gallery', hint: 'Swap to a dark background' },
  { key: 'crop', label: '3:2 crop', hint: 'Approximate gallery card crop' },
];

export function mountChecks(bar: HTMLElement, ladder: HTMLElement): void {
  const apply = (c: Checks): void => {
    ladder.classList.toggle('is-gray', c.grayscale);
    ladder.classList.toggle('is-squint', c.squint);
    ladder.classList.toggle('is-dark', c.dark);
    ladder.classList.toggle('is-crop', c.crop);
  };

  const buttons = TOGGLES.map((t) => {
    const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', title: t.hint }, h('span', { class: 'chip__dot', 'aria-hidden': 'true' }), t.label);
    b.addEventListener('click', () => {
      update((s) => {
        s.checks[t.key] = !s.checks[t.key];
      });
      const on = getState().checks[t.key];
      b.setAttribute('aria-pressed', String(on));
      apply(getState().checks);
    });
    return b;
  });

  bar.replaceChildren(
    h('div', { class: 'chips', role: 'group', 'aria-label': 'Legibility checks' }, ...buttons),
    h('p', { class: 'hint' }, 'The 3:2 crop is approximate: it shows the centre band a gallery card might keep.'),
  );
  apply(getState().checks);


  addDecorator((figure, canvas, _kind, size) => {
    if (size !== 128) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const value = rmsContrast(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
    figure.append(
      h(
        'p',
        { class: 'metric', title: 'RMS luminance contrast of the 128 px render. Heuristic, higher is punchier.' },
        h('span', { class: 'mono metric__value' }, value.toFixed(2)),
        h('span', {}, ` ${describeContrast(value)} · heuristic, higher is punchier`),
      ),
    );
  });
}
