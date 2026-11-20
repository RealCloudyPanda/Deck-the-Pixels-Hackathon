import { describe, expect, it } from 'vitest';
import { halvingSteps, LADDER, targetSize } from './ladder';

describe('targetSize', () => {
  it('keeps a square square', () => {
    expect(targetSize({ width: 2400, height: 2400 }, 64)).toEqual({ width: 64, height: 64 });
  });
  it('keeps 5:7 for the card', () => {
    expect(targetSize({ width: 1500, height: 2100 }, 128)).toEqual({ width: 128, height: 179 });
    expect(targetSize({ width: 1500, height: 2100 }, 64)).toEqual({ width: 64, height: 90 });
  });
  it('rejects empty sources', () => {
    expect(() => targetSize({ width: 0, height: 10 }, 64)).toThrow();
  });
  it('covers the four Read Sizes', () => {
    expect([...LADDER]).toEqual([64, 128, 256, 512]);
  });
});

describe('halvingSteps', () => {
  it('halves 2400 down to 64 and ends exactly on the target', () => {
    const steps = halvingSteps({ width: 2400, height: 2400 }, { width: 64, height: 64 });
    expect(steps.map((s) => s.width)).toEqual([1200, 600, 300, 150, 75, 64]);
  });
  it('does not repeat the target when a halving lands on it', () => {
    const steps = halvingSteps({ width: 512, height: 512 }, { width: 128, height: 128 });
    expect(steps.map((s) => s.width)).toEqual([256, 128]);
  });
  it('goes straight to the target when it is already close', () => {
    expect(halvingSteps({ width: 100, height: 100 }, { width: 64, height: 64 })).toEqual([{ width: 64, height: 64 }]);
  });
  it('never makes an intermediate smaller than the target', () => {
    const target = { width: 128, height: 179 };
    for (const s of halvingSteps({ width: 1500, height: 2100 }, target)) {
      expect(s.width).toBeGreaterThanOrEqual(target.width);
      expect(s.height).toBeGreaterThanOrEqual(target.height);
    }
  });
});
