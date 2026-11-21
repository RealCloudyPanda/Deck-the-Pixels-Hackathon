import { BUDGET_KEY, change, DAILY_LIMIT, msUntilMidnight, parseBudget, rollover, type BudgetState } from '../lib/budget';
import { h } from './dom';

export function mountBudget(root: HTMLElement, announce: (msg: string) => void): void {
  const read = (): BudgetState => {
    try {
      return rollover(parseBudget(localStorage.getItem(BUDGET_KEY)), new Date());
    } catch {
      return rollover(null, new Date());
    }
  };
  let state = read();

  const save = (): void => {
    try {
      localStorage.setItem(BUDGET_KEY, JSON.stringify(state));
    } catch {

    }
  };

  const value = h('span', { class: 'budget__value mono' });
  const pips = h('span', { class: 'budget__pips', 'aria-hidden': 'true' });
  const minus = h('button', { type: 'button', class: 'budget__btn', 'aria-label': 'Undo one Generation' }, '−');
  const plus = h('button', { type: 'button', class: 'budget__btn', 'aria-label': 'Log one Generation' }, '+');

  const render = (): void => {
    value.textContent = `${state.used} / ${DAILY_LIMIT}`;
    pips.replaceChildren(...Array.from({ length: DAILY_LIMIT }, (_, i) => h('span', { class: `pip${i < state.used ? ' is-used' : ''}` })));
    minus.toggleAttribute('disabled', state.used === 0);
    plus.toggleAttribute('disabled', state.used >= DAILY_LIMIT);
    root.classList.toggle('is-spent', state.used >= DAILY_LIMIT);
  };

  const step = (delta: number): void => {
    state = change(state, delta, new Date());
    save();
    render();
    announce(state.used >= DAILY_LIMIT ? 'All five Generations used today.' : `${state.used} of ${DAILY_LIMIT} Generations used today.`);
  };
  minus.addEventListener('click', () => step(-1));
  plus.addEventListener('click', () => step(1));

  root.replaceChildren(
    h('div', { class: 'budget__text' }, h('span', { class: 'budget__label' }, 'Nano Banana today'), value),
    pips,
    h('div', { class: 'budget__ctrl', role: 'group', 'aria-label': 'Generation Budget' }, minus, plus),
  );
  root.setAttribute('title', 'Free Photoshop web: 5 generations per day. Resets at local midnight.');
  render();

  const scheduleReset = (): void => {
    window.setTimeout(() => {
      state = read();
      render();
      scheduleReset();
    }, msUntilMidnight(new Date()) + 1000);
  };
  scheduleReset();
}
