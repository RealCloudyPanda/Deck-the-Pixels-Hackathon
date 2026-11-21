import { h } from './dom';
import { getState, subscribe, visibleImages } from './store';

export function mountContinuity(root: HTMLElement): void {
  let last = '';
  const checks = ['Same ivory 11:59 shapes and colon', 'Same unfinished final stitches and loose yarn', 'Same bar gap, bell, bands and sleeve motifs', 'Chest survives folds without changing the joke'];
  function render(): void {
    const state = getState();
    const { sweater, card } = visibleImages(state);
    const key = [state.sample, sweater?.url, card?.url].join(':');
    if (key === last) return;
    last = key;
    root.replaceChildren(
      h('h2', { class: 'section-h' }, 'Continuity workbench'),
      h('p', { class: 'hint' }, 'Manual comparison only. These checks do not measure similarity or produce an AI score.'),
      h('div', { class: 'continuity-pair' }, ...[sweater, card].map((image) => image ? h('figure', {}, h('img', { src: image.url, alt: `${image.kind}: ${image.name}` }), h('figcaption', {}, image.kind)) : h('p', {}, 'Load both images to compare.'))),
      ...checks.map((text, i) => h('label', { class: 'continuity-check', for: `continuity-${i}` }, h('input', { type: 'checkbox', id: `continuity-${i}` }), text)),
      h('p', { class: 'hint' }, state.sample ? 'Sketch rehearsal only; actual exports have not been reviewed.' : 'Checklist resets when either image changes. Check the real exports side by side at full size too.'),
    );
  }
  subscribe(render);
  render();
}
