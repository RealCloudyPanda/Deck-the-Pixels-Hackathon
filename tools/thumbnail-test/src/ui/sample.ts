import type { SlotKind } from '../lib/validate';
import { decode, setOnRealImage } from './intake';
import { getState, setImage, update } from './store';

const SAMPLE_KEY = 'thumbnail-test.sample.v1';
const SAMPLES: Record<SlotKind, { url: string; name: string }> = {
  sweater: { url: `${import.meta.env.BASE_URL}samples/sketch-sweater.svg`, name: 'sketch-sweater.svg (composition sketch)' },
  card: { url: `${import.meta.env.BASE_URL}samples/sketch-card.svg`, name: 'sketch-card.svg (composition sketch)' },
};

async function loadSamples(): Promise<void> {
  for (const kind of Object.keys(SAMPLES) as SlotKind[]) {
    const { url, name } = SAMPLES[kind];
    const img = await decode(url);
    setImage(kind, { kind, name, url, width: img.naturalWidth, height: img.naturalHeight, bytes: null, img, sample: true, issues: [] });
  }
}

function clearSamples(): void {
  for (const kind of Object.keys(SAMPLES) as SlotKind[]) {
    if (getState().images[kind]?.sample) setImage(kind, undefined);
  }
}

function remember(on: boolean): void {
  try {
    localStorage.setItem(SAMPLE_KEY, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
}

/** Sample Mode: on by default on first visit, off once the owner loads a real image. */
export function mountSample(toggle: HTMLInputElement, ribbon: HTMLElement, announce: (msg: string) => void): void {
  const setMode = async (on: boolean, persist: boolean): Promise<void> => {
    update((s) => {
      s.sample = on;
    });
    toggle.checked = on;
    ribbon.hidden = !on;
    document.body.classList.toggle('is-sample', on);
    if (persist) remember(on);
    if (on) await loadSamples();
    else clearSamples();
  };

  toggle.addEventListener('change', () => {
    void setMode(toggle.checked, true);
    announce(toggle.checked ? 'Sample Mode on: composition sketches loaded.' : 'Sample Mode off.');
  });

  setOnRealImage(() => {
    if (getState().sample) {
      void setMode(false, true);
      announce('Sample Mode switched off because you loaded your own image.');
    }
  });

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(SAMPLE_KEY);
  } catch {
    /* ignore */
  }
  void setMode(stored !== 'off', false);
}
