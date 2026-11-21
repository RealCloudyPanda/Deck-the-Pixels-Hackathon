

export const LADDER = [64, 128, 256, 512] as const;

export interface Size {
  width: number;
  height: number;
}


export function targetSize(src: Size, width: number): Size {
  if (src.width <= 0 || src.height <= 0) throw new Error('source size must be positive');
  return { width, height: Math.max(1, Math.round((width * src.height) / src.width)) };
}


export function halvingSteps(src: Size, target: Size): Size[] {
  const steps: Size[] = [];
  let w = src.width;
  let h = src.height;
  while (w / 2 >= target.width && h / 2 >= target.height) {
    w = Math.round(w / 2);
    h = Math.round(h / 2);
    if (w === target.width && h === target.height) break;
    steps.push({ width: w, height: h });
  }
  steps.push(target);
  return steps;
}
