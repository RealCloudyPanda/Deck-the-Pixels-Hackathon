import { describe, expect, it } from 'vitest';
import { describeContrast, luminance, rmsContrast } from './contrast';

function pixels(...colors: [number, number, number, number?][]): number[] {
  return colors.flatMap(([r, g, b, a = 255]) => [r, g, b, a]);
}

describe('luminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(luminance(0, 0, 0)).toBe(0);
    expect(luminance(255, 255, 255)).toBeCloseTo(1, 6);
  });
});

describe('rmsContrast', () => {
  it('is 0 for a uniform image', () => {
    expect(rmsContrast(pixels([179, 38, 58], [179, 38, 58], [179, 38, 58]))).toBeCloseTo(0, 6);
  });
  it('is 0.5 for half black, half white', () => {
    expect(rmsContrast(pixels([0, 0, 0], [255, 255, 255], [0, 0, 0], [255, 255, 255]))).toBeCloseTo(0.5, 6);
  });
  it('ranks ivory-on-cranberry above gold-on-cranberry', () => {
    const ivory = rmsContrast(pixels([242, 234, 219], [179, 38, 58]));
    const gold = rmsContrast(pixels([212, 166, 42], [179, 38, 58]));
    expect(ivory).toBeGreaterThan(gold);
  });
  it('skips fully transparent pixels and handles empty input', () => {
    expect(rmsContrast(pixels([0, 0, 0, 0], [255, 255, 255]))).toBe(0);
    expect(rmsContrast([])).toBe(0);
  });
});

describe('describeContrast', () => {
  it('labels low, mid and high', () => {
    expect(describeContrast(0.05)).toBe('flat');
    expect(describeContrast(0.15)).toBe('moderate');
    expect(describeContrast(0.4)).toBe('punchy');
  });
});
