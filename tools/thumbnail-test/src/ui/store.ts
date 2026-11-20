import type { Issue, SlotKind } from '../lib/validate';

export interface LoadedImage {
  kind: SlotKind;
  name: string;
  url: string;
  width: number;
  height: number;
  /** null for bundled samples */
  bytes: number | null;
  img: HTMLImageElement;
  sample: boolean;
  issues: Issue[];
}

export interface Checks {
  grayscale: boolean;
  squint: boolean;
  dark: boolean;
  crop: boolean;
}

export interface AppState {
  images: Partial<Record<SlotKind, LoadedImage>>;
  sample: boolean;
  checks: Checks;
}

type Listener = (state: AppState) => void;

const state: AppState = {
  images: {},
  sample: false,
  checks: { grayscale: false, squint: false, dark: false, crop: false },
};
const listeners = new Set<Listener>();

export function getState(): AppState {
  return state;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function update(mutator: (s: AppState) => void): void {
  mutator(state);
  for (const fn of listeners) fn(state);
}

export function setImage(kind: SlotKind, image: LoadedImage | undefined): void {
  update((s) => {
    const prev = s.images[kind];
    if (prev && !prev.sample && prev.url !== image?.url) URL.revokeObjectURL(prev.url);
    if (image) s.images[kind] = image;
    else delete s.images[kind];
  });
}
