import { h } from './dom';

export function downloadJson(data: unknown, fileName: string): void {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  h('a', { href: url, download: fileName }).click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
