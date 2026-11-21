// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../lib/tally';
import { REVISION_KEY } from '../lib/revision';
vi.mock('../lib/revision', async (original) => ({
  ...await original<typeof import('../lib/revision')>(),
  imageDigest: async (file: File) => `fixture-digest-${file.name}`,
}));

const decodes = new Map<string, Promise<void>>();
const revokeObjectURL = vi.fn();

function element<T extends HTMLElement>(selector: string): T {
  return document.querySelector<T>(selector)!;
}

function chooseFile(name: string, type = 'image/png'): void {
  const input = element<HTMLInputElement>('#file-sweater');
  Object.defineProperty(input, 'files', { configurable: true, value: [new File([], name, { type })] });
  input.dispatchEvent(new Event('change'));
}

function submit(selector: string): void {
  element(selector).dispatchEvent(new Event('submit', { cancelable: true }));
}

function stopDecodeAt(url: string): () => void {
  let finish!: () => void;
  decodes.set(url, new Promise<void>((resolve) => { finish = resolve; }));
  return finish;
}

async function mount() {
  const { mountIntake } = await import('./intake');
  const { mountSample } = await import('./sample');
  const { mountTally } = await import('./tally');
  const announce = vi.fn();
  mountIntake(element('#intake'), announce);
  mountTally(element('#tally'), announce);
  mountSample(element('#sample'), element('#ribbon'), announce);
}

beforeEach(() => {
  vi.resetModules();
  Object.defineProperty(File.prototype, 'arrayBuffer', { configurable: true, value: function(this: File) { return Promise.resolve(new TextEncoder().encode(this.name).buffer); } });

  vi.useFakeTimers();
  decodes.clear();
  revokeObjectURL.mockClear();
  localStorage.clear();
  document.body.innerHTML = '<input id="sample" type="checkbox"><div id="ribbon"></div><div id="intake"></div><div id="tally"></div>';

  vi.stubGlobal('Image', class {
    src = '';
    naturalWidth = 1000;
    naturalHeight = 1000;

    decode(): Promise<void> {
      return decodes.get(this.src) ?? Promise.resolve();
    }
  });
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL(file: File): string {
      return `blob:${file.name}`;
    }

    static revokeObjectURL = revokeObjectURL;
  });
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);


  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true; } },
    close: { configurable: true, value(this: HTMLDialogElement) { this.open = false; } },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Thumbnail Test demo', () => {
  it('keeps a real export when delayed sketches finish and when Sample Mode is toggled', async () => {
    const finishSketch = stopDecodeAt(`${import.meta.env.BASE_URL}samples/sketch-sweater.svg`);
    await mount();
    const toggle = element<HTMLInputElement>('#sample');
    expect(toggle.checked).toBe(true);

    chooseFile('working-export.png');
    await vi.advanceTimersByTimeAsync(0);
    expect(toggle.checked).toBe(false);
    finishSketch();
    await vi.advanceTimersByTimeAsync(0);
    expect(element('#intake').textContent).toContain('working-export.png');
    expect(element('#intake').textContent).not.toContain('sketch-card.svg');

    toggle.click();
    expect(element('#intake').textContent).toContain('sketch-card.svg');
    expect(element('#intake').textContent).not.toContain('working-export.png');
    toggle.click();
    expect(element('#intake').textContent).toContain('working-export.png');
    expect(revokeObjectURL).not.toHaveBeenCalledWith('blob:working-export.png');
  });

  it('keeps the current preview and reports a failed replacement even after an older decode completes', async () => {
    await mount();
    chooseFile('working-export.png');
    await vi.advanceTimersByTimeAsync(0);
    const finishOld = stopDecodeAt('blob:slow.png');
    chooseFile('slow.png');

    let fail!: (reason: Error) => void;
    decodes.set('blob:corrupt.png', new Promise<void>((_, reject) => { fail = reject; }));
    chooseFile('corrupt.png');
    fail(new Error('Corrupt file'));
    await vi.advanceTimersByTimeAsync(0);
    expect(element('.issue--error').textContent).toContain('corrupt.png');
    expect(element<HTMLImageElement>('#intake .drop img').src).toBe('blob:working-export.png');

    finishOld();
    await vi.advanceTimersByTimeAsync(0);
    expect(element<HTMLImageElement>('#intake .drop img').src).toBe('blob:working-export.png');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:slow.png');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:corrupt.png');
  });

  it('hides the 128 px reveal after three seconds and keeps practice answers out of saved results', async () => {
    await mount();
    await vi.advanceTimersByTimeAsync(0);

    submit('#tally form');
    const dialog = element<HTMLDialogElement>('dialog');
    expect(dialog.open).toBe(true);
    await vi.advanceTimersByTimeAsync(2999);
    expect(dialog.querySelector('canvas')?.width).toBe(128);
    await vi.advanceTimersByTimeAsync(1);
    expect(dialog.querySelector('canvas')).toBeNull();
    const answer = element<HTMLTextAreaElement>('#tally-answer');
    expect(document.activeElement).toBe(answer);
    answer.value = 'Practice answer';
    submit('dialog form');
    expect(dialog.open).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    chooseFile('working-export.png');
    await vi.advanceTimersByTimeAsync(0);
    expect(element('#tally').textContent).not.toContain('Practice answer');
    submit('#tally form');
    await vi.advanceTimersByTimeAsync(3000);
    element<HTMLTextAreaElement>('#tally-answer').value = 'A deadline upload stalled';
    submit('dialog form');
    element('#verdict-0-partly').click();
    expect(document.activeElement?.id).toBe('verdict-0-partly');
    expect(Object.values(JSON.parse(localStorage.getItem(REVISION_KEY)!))[0]).toMatchObject({ entries: [
      { answer: 'A deadline upload stalled', verdict: 'partly' },
    ] });
  });
  it('starts fresh for replacement bytes and restores an identical earlier revision', async () => {
    await mount();
    chooseFile('first.png');
    await vi.advanceTimersByTimeAsync(0);
    submit('#tally form');
    await vi.advanceTimersByTimeAsync(3000);
    element<HTMLTextAreaElement>('#tally-answer').value = 'Only the final stitch is missing';
    submit('dialog form');
    chooseFile('second.png');
    await vi.advanceTimersByTimeAsync(0);
    expect(element('#tally').textContent).not.toContain('Only the final stitch');
    chooseFile('first.png');
    await vi.advanceTimersByTimeAsync(0);
    expect(element('#tally').textContent).toContain('Only the final stitch');
    element<HTMLSelectElement>('#tally-subject').value = 'card';
    element('#tally-subject').dispatchEvent(new Event('change'));
    expect(element('#tally').textContent).not.toContain('Only the final stitch');
    expect(element<HTMLButtonElement>('#tally button[type=submit]').disabled).toBe(true);
  });

  it('can test the card after completing all three sweater responses without clearing them', async () => {
    await mount();
    chooseFile('sweater.png');
    await vi.advanceTimersByTimeAsync(0);
    const cardInput = element<HTMLInputElement>('#file-card');
    Object.defineProperty(cardInput, 'files', { configurable: true, value: [new File([], 'card.png', { type: 'image/png' })] });
    cardInput.dispatchEvent(new Event('change'));
    await vi.advanceTimersByTimeAsync(0);
    for (let i = 0; i < 3; i++) {
      submit('#tally form');
      await vi.advanceTimersByTimeAsync(3000);
      element<HTMLTextAreaElement>('#tally-answer').value = `Sweater response ${i + 1}`;
      submit('dialog form');
    }
    expect(element('#tally').textContent).toContain('All 3 testers recorded');
    const select = element<HTMLSelectElement>('#tally-subject');
    expect(select).not.toBeNull();
    select.value = 'card';
    select.dispatchEvent(new Event('change'));
    expect(element('#tally').textContent).not.toContain('Sweater response');
    expect(element<HTMLButtonElement>('#tally button[type=submit]').disabled).toBe(false);
    submit('#tally form');
    await vi.advanceTimersByTimeAsync(3000);
    element<HTMLTextAreaElement>('#tally-answer').value = 'Card response';
    submit('dialog form');
    const back = element<HTMLSelectElement>('#tally-subject');
    back.value = 'sweater';
    back.dispatchEvent(new Event('change'));
    expect(element('#tally').textContent).toContain('Sweater response 3');
    expect(element('#tally').textContent).not.toContain('Card response');
    expect(element('#tally').textContent).toContain('Export revision + responses');
  });

});
