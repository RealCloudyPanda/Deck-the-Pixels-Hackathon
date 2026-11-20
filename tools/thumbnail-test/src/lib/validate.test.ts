import { describe, expect, it } from 'vitest';
import { aspectError, checkDimensions, checkFile, formatBytes, isAcceptedType, WARN_BYTES } from './validate';

describe('isAcceptedType', () => {
  it('accepts PNG and JPEG by mime type', () => {
    expect(isAcceptedType('a.png', 'image/png')).toBe(true);
    expect(isAcceptedType('a.jpg', 'image/jpeg')).toBe(true);
  });
  it('rejects other mime types even with a png name', () => {
    expect(isAcceptedType('a.png', 'image/webp')).toBe(false);
    expect(isAcceptedType('a.psd', 'image/vnd.adobe.photoshop')).toBe(false);
  });
  it('falls back to the extension when the browser gives no mime type', () => {
    expect(isAcceptedType('IMAGE1.JPEG', '')).toBe(true);
    expect(isAcceptedType('notes.txt', '')).toBe(false);
  });
});

describe('checkFile', () => {
  it('passes a small PNG', () => {
    expect(checkFile('a.png', 'image/png', 1000)).toEqual([]);
  });
  it('errors on an unsupported type', () => {
    const issues = checkFile('a.gif', 'image/gif', 1000);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.level).toBe('error');
  });
  it('warns above 5 MB', () => {
    const issues = checkFile('a.png', 'image/png', WARN_BYTES + 1);
    expect(issues.map((i) => i.level)).toEqual(['warn']);
  });
});

describe('checkDimensions', () => {
  it('accepts the planned sizes', () => {
    expect(checkDimensions('sweater', 2400, 2400)).toEqual([]);
    expect(checkDimensions('card', 1500, 2100)).toEqual([]);
  });
  it('warns when the card is not 5:7', () => {
    const issues = checkDimensions('card', 1500, 1500);
    expect(issues[0]?.message).toContain('5:7');
  });
  it('warns on small exports', () => {
    const issues = checkDimensions('sweater', 800, 800);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain('800 px');
  });
  it('tolerates a 1% aspect rounding error', () => {
    expect(aspectError(1500, 2110, [5, 7])).toBeLessThan(0.01);
    expect(checkDimensions('card', 1500, 2110)).toEqual([]);
  });
});

describe('formatBytes', () => {
  it('formats B, KB and MB', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2 KB');
    expect(formatBytes(3.25 * 1024 * 1024)).toBe('3.3 MB');
  });
});
