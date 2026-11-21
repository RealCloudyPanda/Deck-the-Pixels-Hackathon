import { imageDigest } from '../lib/revision';
import { checkDimensions, checkFile, formatBytes, SLOT_SPECS, type Issue, type SlotKind } from '../lib/validate';
import { h } from './dom';
import { getState, setImage, subscribe, visibleImages, type LoadedImage } from './store';

const KINDS: SlotKind[] = ['sweater', 'card'];

export async function decode(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  return img;
}

const requests: Record<SlotKind, number> = { sweater: 0, card: 0 };

async function loadFile(kind: SlotKind, file: File, announce: (msg: string) => void): Promise<void> {
  const request = ++requests[kind];
  loading[kind] = true;
  rerender();
  if (pendingErrors[kind]) {
    delete pendingErrors[kind];
    rerender();
  }
  const fileIssues = checkFile(file.name, file.type, file.size);
  if (fileIssues.some((i) => i.level === 'error')) {
    loading[kind] = false;
    renderErrorOnly(kind, file.name, fileIssues);
    announce(`${file.name} was not loaded: ${fileIssues[0]?.message ?? ''}`);
    return;
  }
  const url = URL.createObjectURL(file);
  let img: HTMLImageElement;
  let digest: string;
  try {
    [img, digest] = await Promise.all([decode(url), imageDigest(file)]);
  } catch {
    URL.revokeObjectURL(url);
    if (request !== requests[kind]) return;
    loading[kind] = false;
    const issues: Issue[] = [{ level: 'error', message: 'The browser could not decode or fingerprint this file. Re-export as PNG and use localhost or HTTPS.' }];
    renderErrorOnly(kind, file.name, issues);
    announce(`${file.name} could not be loaded or fingerprinted.`);
    return;
  }
  if (request !== requests[kind]) {
    URL.revokeObjectURL(url);
    return;
  }
  const loaded: LoadedImage = {
    kind,
    digest,
    name: file.name,
    url,
    width: img.naturalWidth,
    height: img.naturalHeight,
    bytes: file.size,
    img,
    sample: false,
    issues: [...fileIssues, ...checkDimensions(kind, img.naturalWidth, img.naturalHeight)],
  };
  loading[kind] = false;
  setImage(kind, loaded);
  announce(`${SLOT_SPECS[kind].label} loaded: ${loaded.width} by ${loaded.height} pixels.`);
}

const loading: Partial<Record<SlotKind, boolean>> = {};
const pendingErrors: Partial<Record<SlotKind, Issue[]>> = {};
let rerender: () => void = () => {};

function renderErrorOnly(kind: SlotKind, name: string, issues: Issue[]): void {
  pendingErrors[kind] = issues.map((issue) => ({ ...issue, message: `${name}: ${issue.message}` }));
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
  const image = visibleImages(getState())[kind];
  const error = pendingErrors[kind];
  const inputId = `file-${kind}`;

  const input = h('input', { type: 'file', id: inputId, accept: 'image/png,image/jpeg', class: 'visually-hidden', tabindex: -1 });
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    input.value = '';
    if (file) void loadFile(kind, file, announce);
  });

  const choose = h('button', { type: 'button', id: `choose-${kind}`, class: 'btn' }, image && !image.sample ? 'Replace file' : 'Choose file');
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
  drop.addEventListener('click', () => input.click());
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('is-over');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('is-over');
    const file = e.dataTransfer?.files?.[0];
    if (file) void loadFile(kind, file, announce);
  });

  const meta = image
    ? h(
        'p',
        { class: 'slot__meta mono' },
        h('span', { class: 'slot__name', title: image.name }, image.name),
        h('span', {}, `${image.width} × ${image.height} px`),
        h('span', {}, image.bytes === null ? 'sample' : formatBytes(image.bytes)),
      )
    : h('p', { class: 'slot__meta hint' }, 'Nothing loaded yet.');

  const issues = [...(error ?? []), ...(image?.issues ?? [])];
  const ok = image?.sample
    ? h('p', { class: 'slot__sample' }, 'Composition sketch, not a contest asset. Choose your export to test it.')
    : image && !issues.length
      ? h('p', { class: 'slot__ok' }, 'Size and format look right.')
      : null;

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
    loading[kind] ? h('p', { role: 'status', class: 'hint' }, 'Loading and fingerprinting replacement…') : null,
    issueList(issues),
    ok,
  );
}

export function mountIntake(root: HTMLElement, announce: (msg: string) => void): void {
  rerender = () => {
    const focused = root.contains(document.activeElement) ? document.activeElement?.id : undefined;
    root.replaceChildren(...KINDS.map((k) => slot(k, announce)));
    if (focused) document.getElementById(focused)?.focus({ preventScroll: true });
  };
  subscribe(rerender);
  rerender();
}
