import { describe, expect, it } from 'vitest';
import { deserialize, emptyTally, MAX_TESTERS, serialize, summarize, tallyReducer, toMarkdown, type TallyState } from './tally';

const add = (s: TallyState, id: string, answer = 'deadline joke', name = '') => tallyReducer(s, { type: 'add', id, name, answer });

describe('tallyReducer', () => {
  it('adds a tester with a default name', () => {
    const s = add(emptyTally(), 'a');
    expect(s.entries).toEqual([{ id: 'a', name: 'Tester 1', answer: 'deadline joke', verdict: null }]);
  });
  it('ignores empty answers', () => {
    expect(add(emptyTally(), 'a', '   ').entries).toHaveLength(0);
  });
  it('caps at three testers', () => {
    let s = emptyTally();
    for (const id of ['a', 'b', 'c', 'd']) s = add(s, id);
    expect(s.entries).toHaveLength(MAX_TESTERS);
  });
  it('marks, removes and resets', () => {
    let s = add(add(emptyTally(), 'a'), 'b', 'x', 'Sam');
    s = tallyReducer(s, { type: 'mark', id: 'b', verdict: 'got' });
    expect(s.entries[1]?.verdict).toBe('got');
    s = tallyReducer(s, { type: 'remove', id: 'a' });
    expect(s.entries.map((e) => e.name)).toEqual(['Sam']);
    expect(tallyReducer(s, { type: 'reset' })).toEqual(emptyTally());
  });
});

describe('summarize', () => {
  it('counts verdicts', () => {
    let s = add(add(add(emptyTally(), 'a'), 'b'), 'c');
    s = tallyReducer(s, { type: 'mark', id: 'a', verdict: 'got' });
    s = tallyReducer(s, { type: 'mark', id: 'b', verdict: 'partly' });
    expect(summarize(s)).toEqual({ got: 1, partly: 1, missed: 0, unmarked: 1, total: 3 });
  });
});

describe('serialisation', () => {
  it('round-trips', () => {
    const s = tallyReducer(add(emptyTally(), 'a'), { type: 'mark', id: 'a', verdict: 'missed' });
    expect(deserialize(serialize(s))).toEqual(s);
  });
  it('survives junk', () => {
    expect(deserialize(null)).toEqual(emptyTally());
    expect(deserialize('{nope')).toEqual(emptyTally());
    expect(deserialize('{"entries":[{"id":1}]}')).toEqual(emptyTally());
    expect(deserialize('{"entries":[{"id":"a","name":"x","answer":"y","verdict":"maybe"}]}')).toEqual(emptyTally());
  });
});

describe('toMarkdown', () => {
  it('writes a table and escapes pipes', () => {
    const s = tallyReducer(add(emptyTally(), 'a', 'a | b', 'Ana'), { type: 'mark', id: 'a', verdict: 'got' });
    const md = toMarkdown(s, '2026-11-25');
    expect(md).toContain('1 of 3 got it');
    expect(md).toContain('| Ana | a \\| b | Got it |');
    expect(md).toContain('not a public metric');
  });
});
