import type { Verdict } from '../lib/tally';
import { h } from './dom';

const VERDICTS: { v: Verdict; label: string }[] = [
  { v: 'got', label: 'Got it' },
  { v: 'partly', label: 'Partly' },
  { v: 'missed', label: 'Missed' },
];

export function verdictGroup(index: number, who: string, current: Verdict | null | undefined, onPick: (v: Verdict, buttonId: string) => void): HTMLElement {
  const group = h('div', { class: 'seg', role: 'group', 'aria-label': `Verdict for ${who}` });
  for (const { v, label } of VERDICTS) {
    const id = `verdict-${index}-${v}`;
    const b = h('button', { type: 'button', class: `seg__btn seg__btn--${v}`, 'aria-pressed': String(current === v), id }, label);
    b.addEventListener('click', () => onPick(v, id));
    group.append(b);
  }
  return group;
}
