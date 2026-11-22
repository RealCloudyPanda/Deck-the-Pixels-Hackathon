import { describe, expect, it } from 'vitest';
import { imageDigest, loadRevision, type Revision } from './revision';
const revision: Revision = { subject: 'sweater', digest: 'abc', name: 'one.png', width: 2400, height: 2400 };
describe('revision archives', () => {
  it('does not attribute old unbound feedback to a revision', () => {
    expect(loadRevision(JSON.stringify({ entries: [] }), revision).entries).toEqual([]);
    for (const raw of ['broken', 'null', '[]']) expect(loadRevision(raw, revision).entries).toEqual([]);
  });
  it('hashes content rather than filenames', async () => {
    expect(await imageDigest(new Blob(['abc']))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(await imageDigest(new Blob(['abd']))).not.toBe(await imageDigest(new Blob(['abc'])));
  });
});
