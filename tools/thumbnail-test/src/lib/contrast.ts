/**
 * RMS luminance contrast: the standard deviation of per-pixel relative luminance (0..1).
 * A heuristic for "punchiness" at small sizes, not a WCAG ratio. Uniform image = 0, half black / half white = 0.5.
 */

function linear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

const LUT = Array.from({ length: 256 }, (_, i) => linear(i));

/** Relative luminance of one sRGB pixel (0..255 channels). */
export function luminance(r: number, g: number, b: number): number {
  return 0.2126 * (LUT[r] ?? 0) + 0.7152 * (LUT[g] ?? 0) + 0.0722 * (LUT[b] ?? 0);
}

/** RGBA pixel data as from CanvasRenderingContext2D.getImageData().data. Transparent pixels are skipped. */
export function rmsContrast(data: ArrayLike<number>): number {
  let n = 0;
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i + 3 < data.length; i += 4) {
    if ((data[i + 3] ?? 0) === 0) continue;
    const y = luminance(data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0);
    n += 1;
    sum += y;
    sumSq += y * y;
  }
  if (n === 0) return 0;
  const mean = sum / n;
  return Math.sqrt(Math.max(0, sumSq / n - mean * mean));
}

/** Words for the readout; thresholds are rough rules of thumb, labelled as such in the UI. */
export function describeContrast(value: number): string {
  if (value < 0.12) return 'flat';
  if (value < 0.22) return 'moderate';
  return 'punchy';
}
