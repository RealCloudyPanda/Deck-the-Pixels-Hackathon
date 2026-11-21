import { describe, expect, it } from 'vitest';
import { imageDigest, loadRevision, saveRevision, type Revision } from './revision';
const revision: Revision = { subject: 'sweater', digest: 'abc', name: 'one.png', width: 2400, height: 2400 };
const tally = { entries: [{ id: 'one', name: 'Tester', answer: 'unfinished knitting', verdict: 'got' as const }] };
describe('revision archives', () => {
  it('isolates bytes and subjects, but ignores filename-only changes', () => {
    const raw = saveRevision(null, revision, tally);
    expect(loadRevision(raw, revision)).toEqual(tally);
    expect(loadRevision(raw, { ...revision, digest: 'def' }).entries).toEqual([]);
    expect(loadRevision(raw, { ...revision, subject: 'card' }).entries).toEqual([]);
    expect(loadRevision(raw, { ...revision, name: 'renamed.png' })).toEqual(tally);
  });
  it('retains an earlier revision after recording a replacement', () => {
    const replacement = { ...revision, digest: 'def' };
    const raw = saveRevision(saveRevision(null, revision, tally), replacement, { entries: [] });
    expect(loadRevision(raw, revision)).toEqual(tally);
    expect(loadRevision(raw, replacement).entries).toEqual([]);
  });
  it('does not attribute old unbound feedback to a revision', () => {
    expect(loadRevision(JSON.stringify(tally), revision).entries).toEqual([]);
    for (const raw of ['broken', 'null', '[]']) expect(loadRevision(raw, revision).entries).toEqual([]);
  });
  it('hashes content rather than filenames', async () => {
    expect(await imageDigest(new Blob(['abc']))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(await imageDigest(new Blob(['abd']))).not.toBe(await imageDigest(new Blob(['abc'])));
  });
});
