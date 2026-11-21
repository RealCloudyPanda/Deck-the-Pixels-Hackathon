import { h } from './dom';
import { getState, subscribe } from './store';
export function mountReadiness(root: HTMLElement): void {
  function render(): void {
    const state = getState();
    const actual = Object.values(state.images).filter((image) => !image.sample);
    const valid = actual.filter((image) => !image.issues.some((issue) => issue.level === 'error'));
    root.replaceChildren(h('h2', { class: 'section-h' }, 'Export readiness'),
      h('p', {}, `${actual.length} of 2 actual exports loaded; ${valid.length} pass format and dimension checks.`),
      h('p', { class: 'hint' }, state.sample ? 'Viewing sketches. Sample answers and sample previews do not establish readiness.' : 'These checks cover file constraints only. Confirm likeness, continuity, blind responses, layers evidence and submission answers manually.'));
  }
  subscribe(render);
  render();
}
