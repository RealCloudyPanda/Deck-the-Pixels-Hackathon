import { checkDimensions, checkFile, formatBytes, SLOT_SPECS, type Issue, type SlotKind } from '../lib/validate';
import { h } from './dom';
import { getState, setImage, subscribe, type LoadedImage } from './store';

const KINDS: SlotKind[] = ['sweater', 'card'];

export async function decode(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  return img;
}

/** Called when the owner loads a real image; Sample Mode hooks in here. */
let onRealImage: (kind: SlotKind) => void = () => {};
export function setOnRealImage(fn: (kind: SlotKind) => void): void {
  onRealImage = fn;
}

async function loadFile(kind: SlotKind, file: File, announce: (msg: string) => void): Promise<void> {
  const fileIssues = checkFile(file.name, file.type, file.size);
  if (fileIssues.some((i) => i.level === 'error')) {
    renderErrorOnly(kind, file.name, fileIssues);
    announce(`${file.name} was not loaded: ${fileIssues[0]?.message ?? ''}`);
    return;
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await decode(url);
    const issues = [...fileIssues, ...checkDimensions(kind, img.naturalWidth, img.naturalHeight)];
    const loaded: LoadedImage = {
      kind,
      name: file.name,
      url,
      width: img.naturalWidth,
      height: img.naturalHeight,
      bytes: file.size,
      img,
      sample: false,
      issues,
    };
    onRealImage(kind);
    setImage(kind, loaded);
    announce(`${SLOT_SPECS[kind].label} loaded: ${loaded.width} by ${loaded.height} pixels.`);
  } catch {
    URL.revokeObjectURL(url);
    const issues: Issue[] = [{ level: 'error', message: 'The browser could not decode this file. Re-export it as PNG.' }];
    renderErrorOnly(kind, file.name, issues);
    announce(`${file.name} could not be decoded.`);
  }
}

const pendingErrors: Partial<Record<SlotKind, { name: string; issues: Issue[] }>> = {};
let rerender: () => void = () => {};

function renderErrorOnly(kind: SlotKind, name: string, issues: Issue[]): void {
  pendingErrors[kind] = { name, issues };
  rerender();
}

function issueList(issues: Issue[]): HTMLElement | null {
  if (!issues.length) return null;
  return h(
    'ul',
    { class: 'issues' },
    ...issues.map((i) => h('li', { class: `issue issue--${i.level}` }, h('span', { class: 'issue__tag' }, i.level === 'error' ? 'Error' : 'Check'), i.message)),
  );
}

function slot(kind: SlotKind, announce: (msg: string) => void): HTMLElement {
  const spec = SLOT_SPECS[kind];
  const image = getState().images[kind];
  const error = pendingErrors[kind];
  const inputId = `file-${kind}`;

  const input = h('input', { type: 'file', id: inputId, accept: 'image/png,image/jpeg', class: 'visually-hidden', tabindex: -1 });
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) {
      delete pendingErrors[kind];
      void loadFile(kind, file, announce);
    }
    input.value = '';
  });

  const choose = h('button', { type: 'button', class: 'btn' }, image ? 'Replace file' : 'Choose file');
  choose.addEventListener('click', () => input.click());

  const preview = image
    ? h('img', { src: image.url, alt: `${spec.label} preview: ${image.name}`, width: image.width, height: image.height })
    : h(
        'div',
        { class: 'drop__empty' },
        h('span', { class: 'drop__big' }, 'Drop a PNG or JPEG'),
        h('span', { class: 'hint' }, `${spec.expected} · ${spec.aspectLabel}`),
      );

  const drop = h('div', { class: 'drop', style: `aspect-ratio: ${spec.aspect[0]} / ${spec.aspect[1]}` }, preview);
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('is-over');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('is-over');
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      delete pendingErrors[kind];
      void loadFile(kind, file, announce);
    }
  });

  const meta = image
    ? h(
        'p',
        { class: 'slot__meta mono' },
        h('span', { class: 'slot__name', title: image.name }, image.name),
        h('span', {}, `${image.width} × ${image.height} px`),
        h('span', {}, image.bytes === null ? 'sample' : formatBytes(image.bytes)),
      )
    : error
      ? h('p', { class: 'slot__meta mono' }, h('span', { class: 'slot__name', title: error.name }, error.name))
      : h('p', { class: 'slot__meta hint' }, 'Nothing loaded yet.');

  const issues = image ? image.issues : (error?.issues ?? []);
  const ok = image && !issues.length ? h('p', { class: 'slot__ok' }, 'Size and format look right.') : null;

  return h(
    'article',
    { class: 'slot panel', 'aria-labelledby': `${kind}-h` },
    h(
      'header',
      { class: 'slot__head' },
      h('div', {}, h('h3', { id: `${kind}-h`, class: 'slot__title' }, spec.label), h('p', { class: 'hint' }, kind === 'sweater' ? 'Image 1' : 'Image 2')),
      choose,
      input,
    ),
    drop,
    meta,
    issueList(issues),
    ok,
  );
}

export function mountIntake(root: HTMLElement, announce: (msg: string) => void): void {
  rerender = () => root.replaceChildren(...KINDS.map((k) => slot(k, announce)));
  subscribe(rerender);
  rerender();
}
