import { LADDER } from '../lib/ladder';
import { SLOT_SPECS, type SlotKind } from '../lib/validate';
import { h } from './dom';
import { getState, subscribe, visibleImages, type AppState } from './store';
import { stepDown } from './render';

const KINDS: SlotKind[] = ['sweater', 'card'];
const TIER_NOTE: Record<number, string> = {
  64: 'Tier 1 — "11:59" must read',
  128: 'Tier 2 — the bar stuck at 97%',
  256: 'Faces and silhouette',
  512: 'Tier 3 — the rewards',
};

/** Extra per-render hooks (legibility checks add the contrast readout). */
type Decorator = (figure: HTMLElement, canvas: HTMLCanvasElement, kind: SlotKind, size: number) => void;
const decorators: Decorator[] = [];
export function addDecorator(fn: Decorator): void {
  decorators.push(fn);
}

function cell(state: AppState, kind: SlotKind, size: number): HTMLElement {
  const image = visibleImages(state)[kind];
  const spec = SLOT_SPECS[kind];
  if (!image) {
    const ph = h('div', {
      class: 'thumb__empty',
      style: `width:${size}px; aspect-ratio:${spec.aspect[0]} / ${spec.aspect[1]}`,
      'aria-hidden': 'true',
    });
    return h('figure', { class: 'thumb is-empty' }, ph, h('figcaption', { class: 'hint' }, `No ${spec.label}`));
  }
  const canvas = stepDown(image.img, size);
  canvas.className = 'thumb__img';
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${spec.label} at ${size} pixels wide`);
  const frame = h('div', { class: 'thumb__frame' }, canvas);
  const figure = h('figure', { class: 'thumb' }, frame, h('figcaption', { class: 'thumb__cap' }, spec.label, image.sample ? ' · Sample' : ''));
  for (const d of decorators) d(figure, canvas, kind, size);
  return figure;
}

export function mountLadder(root: HTMLElement): void {
  const render = (state: AppState): void => {
    const rows = LADDER.map((size) =>
      h(
        'div',
        { class: 'rung' },
        h('div', { class: 'rung__label' }, h('span', { class: 'rung__px mono' }, `${size} px`), h('span', { class: 'hint' }, TIER_NOTE[size] ?? '')),
        h(
          'div',
          { class: 'rung__thumbs', tabindex: size >= 256 ? 0 : undefined, role: 'group', 'aria-label': `${size} pixel thumbnails` },
          ...KINDS.map((k) => cell(state, k, size)),
        ),
      ),
    );
    root.replaceChildren(...rows);
  };
  subscribe((s) => {
    // only re-render when images change, checks are pure CSS
    const key = imageKey(s);
    if (key !== lastKey) {
      lastKey = key;
      render(s);
    }
  });
  function imageKey(state: AppState): string {
    return KINDS.map((k) => visibleImages(state)[k]?.url ?? '').join('|');
  }
  let lastKey = imageKey(getState());
  render(getState());
}
