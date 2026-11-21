import type { SlotKind } from '../lib/validate';
import { decode } from './intake';
import { getState, subscribe, update, type LoadedImage } from './store';

const SAMPLE_KEY = 'thumbnail-test.sample.v1';
const KINDS: SlotKind[] = ['sweater', 'card'];

async function loadSample(kind: SlotKind): Promise<LoadedImage> {
  const name = `sketch-${kind}.svg`;
  const url = `${import.meta.env.BASE_URL}samples/${name}`;
  const img = await decode(url);
  return { kind, name, url, width: img.naturalWidth, height: img.naturalHeight, bytes: null, img, sample: true, issues: [] };
}


export function mountSample(toggle: HTMLInputElement, ribbon: HTMLElement, announce: (msg: string) => void): void {
  let mode: boolean | undefined;
  let loading = false;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(SAMPLE_KEY);
  } catch {

  }

  subscribe(({ sample, samples }) => {
    if (sample === mode) return;
    const initial = mode === undefined;
    mode = sample;
    toggle.checked = sample;
    ribbon.hidden = !sample;
    if (!initial) {
      try {
        localStorage.setItem(SAMPLE_KEY, sample ? 'on' : 'off');
      } catch {

      }
    }
    if (!sample) {
      if (!initial) announce('Sample Mode off.');
      return;
    }
    if (samples.card && samples.sweater) {
      announce('Sample Mode on. Composition sketches loaded.');
      return;
    }
    if (loading) return;
    loading = true;
    void Promise.all(KINDS.map(loadSample)).then((loaded) => {
      loading = false;
      update((state) => {
        for (const image of loaded) state.samples[image.kind] = image;
      });
      if (getState().sample) announce('Sample Mode on. Composition sketches loaded.');
    }, () => {
      loading = false;
      if (getState().sample) {
        update((state) => { state.sample = false; });
        announce('The composition sketches could not be loaded.');
      }
    });
  });

  toggle.addEventListener('change', () => {
    update((state) => { state.sample = toggle.checked; });
  });
  update((state) => { state.sample = stored !== 'off'; });
}
