import { afterEach, expect, it, vi } from 'vitest';
import { createTallySession } from './tallySession';
import { REVISION_KEY, type Revision } from './revision';
import { STORAGE_KEY } from './tally';

const revision: Revision = { subject: 'sweater', digest: 'abc', name: 'first.png', width: 2400, height: 2400 };
function setup(data = new Map<string, string>()) {
  vi.useFakeTimers();
  const storageFailed = vi.fn();
  const session = createTallySession({
    storage: { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); } },
    schedule: (tick) => setInterval(tick, 1000), unschedule: (timer) => clearInterval(timer as ReturnType<typeof setInterval>), storageFailed,
  });
  const sync = (r: Revision | null = revision, practice = false) => session.sync({ subject: r?.subject ?? 'sweater', revision: r, practice, image: {} });
  const answer = (text = 'unfinished knitting') => {
    session.reveal('Tester', vi.fn(), vi.fn());
    vi.advanceTimersByTime(3000);
    expect(session.answer(text)).toBe(true);
  };
  sync();
  return { session, data, sync, answer };
}
afterEach(() => vi.useRealTimers());

it('isolates bytes and subjects and restores the same bytes under a new filename', () => {
  const { session, data, sync, answer } = setup();
  answer();
  session.mark(session.snapshot().tally.entries[0]!.id, 'got');
  sync({ ...revision, digest: 'replacement' });
  expect(session.snapshot().tally.entries).toEqual([]);
  answer('replacement answer');
  sync({ ...revision, subject: 'card' });
  expect(session.snapshot().tally.entries).toEqual([]);
  sync({ ...revision, name: 'renamed.png' });
  expect(session.snapshot().tally.entries).toMatchObject([{ answer: 'unfinished knitting', verdict: 'got' }]);
  expect(session.export('today').revision?.name).toBe('renamed.png');
  expect(session.markdown('today')).toContain('SHA-256: abc');
  expect(setup(data).session.snapshot().tally.entries).toHaveLength(1);
});

it('cancels reveals on replacement, mode change, subject change and explicit cancellation', () => {
  const { session, sync } = setup();
  const ready = vi.fn();
  const tick = vi.fn();
  for (const transition of [() => sync({ ...revision, digest: 'next' }), () => sync(null, true), () => sync({ ...revision, subject: 'card' }), () => session.cancel()]) {
    sync();
    expect(session.reveal('Tester', tick, ready)).toBe(true);
    expect(session.answer('too early')).toBe(false);
    transition();
    vi.advanceTimersByTime(5000);
    expect(session.answer('stale answer')).toBe(false);
  }
  expect(ready).not.toHaveBeenCalled();
  expect(tick).not.toHaveBeenCalled();
});

it('keeps practice transient and preserves actual revisions through practice and resets', () => {
  const { session, data, sync, answer } = setup();
  answer('actual answer');
  const saved = data.get(REVISION_KEY);
  sync(null, true);
  answer('practice answer');
  expect(data.get(REVISION_KEY)).toBe(saved);
  expect(session.export('today')).toMatchObject({ practice: true, revision: null });
  session.reset();
  expect(data.get(REVISION_KEY)).toBe(saved);
  sync();
  expect(session.snapshot().tally.entries[0]!.answer).toBe('actual answer');
  session.reset();
  expect(setup(data).session.snapshot().tally.entries).toEqual([]);
});

it('retains answers and exports when storage fails and keeps unbound archives separate', () => {
  vi.useFakeTimers();
  const failed = vi.fn();
  const legacy = JSON.stringify({ entries: [{ id: 'old', name: 'Old', answer: 'unbound', verdict: 'got' }] });
  const session = createTallySession({ storage: { getItem: (key) => key === STORAGE_KEY ? legacy : null, setItem: () => { throw Error('quota'); } }, schedule: (tick) => setInterval(tick, 1000), unschedule: (timer) => clearInterval(timer as ReturnType<typeof setInterval>), storageFailed: failed });
  session.sync({ subject: 'sweater', practice: false, revision, image: {} });
  expect(session.snapshot().tally.entries).toEqual([]);
  expect(session.legacyMarkdown()).toContain('UNBOUND LEGACY ARCHIVE');
  session.reveal('', vi.fn(), vi.fn());
  vi.advanceTimersByTime(3000);
  session.answer('new answer');
  expect(session.snapshot().warning).toBe(true);
  expect(failed).toHaveBeenCalledOnce();
  expect(session.export('today').responses[0]!.answer).toBe('new answer');
  session.sync({ subject: 'card', practice: false, revision: { ...revision, subject: 'card' }, image: {} });
  session.sync({ subject: 'sweater', practice: false, revision, image: {} });
  expect(session.snapshot().tally.entries[0]!.answer).toBe('new answer');
});

it('owns revision metadata and isolates snapshots and exports from caller mutation', () => {
  const { session, answer } = setup();
  const metadata = { ...revision };
  session.sync({ subject: 'sweater', practice: false, revision: metadata, image: {} });
  metadata.digest = 'mutated input';
  answer();
  const snapshot = session.snapshot();
  snapshot.tally.entries[0]!.answer = 'mutated snapshot';
  snapshot.revision!.digest = 'mutated snapshot';
  const exported = session.export('today');
  exported.responses.length = 0;
  exported.revision!.digest = 'mutated export';
  expect(session.export('today')).toMatchObject({ revision: { digest: 'abc' }, responses: [{ answer: 'unfinished knitting' }] });
});
