import { describe, expect, it } from 'vitest';
import { change, DAILY_LIMIT, localDateKey, msUntilMidnight, parseBudget, remaining, rollover } from './budget';

const nov20 = new Date(2026, 10, 20, 23, 59, 0);
const nov21 = new Date(2026, 10, 21, 0, 0, 30);

describe('budget', () => {
  it('uses the local calendar date', () => {
    expect(localDateKey(nov20)).toBe('2026-11-20');
  });
  it('starts at zero', () => {
    expect(rollover(null, nov20)).toEqual({ date: '2026-11-20', used: 0 });
  });
  it('keeps same-day usage', () => {
    expect(rollover({ date: '2026-11-20', used: 3 }, nov20).used).toBe(3);
  });
  it('resets after local midnight', () => {
    const late = change(change(null, 1, nov20), 1, nov20);
    expect(late.used).toBe(2);
    expect(rollover(late, nov21)).toEqual({ date: '2026-11-21', used: 0 });
  });
  it('clamps between 0 and the daily limit', () => {
    let s = change(null, -1, nov20);
    expect(s.used).toBe(0);
    for (let i = 0; i < 8; i++) s = change(s, 1, nov20);
    expect(s.used).toBe(DAILY_LIMIT);
    expect(remaining(s)).toBe(0);
  });
  it('parses stored state defensively', () => {
    expect(parseBudget('{"date":"2026-11-20","used":2}')).toEqual({ date: '2026-11-20', used: 2 });
    expect(parseBudget('nope')).toBeNull();
    expect(parseBudget('{"date":5}')).toBeNull();
    expect(parseBudget(null)).toBeNull();
  });
  it('computes time to midnight', () => {
    expect(msUntilMidnight(nov20)).toBe(60_000);
  });
});
