import { halvingSteps, targetSize } from '../lib/ladder';


export function stepDown(img: HTMLImageElement, width: number): HTMLCanvasElement {
  const src = { width: img.naturalWidth, height: img.naturalHeight };
  const target = targetSize(src, width);
  let current: CanvasImageSource = img;
  let canvas = document.createElement('canvas');
  for (const step of halvingSteps(src, target)) {
    canvas = document.createElement('canvas');
    canvas.width = step.width;
    canvas.height = step.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) break;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(current, 0, 0, step.width, step.height);
    current = canvas;
  }
  return canvas;
}
