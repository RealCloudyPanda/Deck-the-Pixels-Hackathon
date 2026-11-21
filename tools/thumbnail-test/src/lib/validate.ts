

export type SlotKind = 'sweater' | 'card';

export interface SlotSpec {
  label: string;

  aspect: readonly [number, number];
  aspectLabel: string;
  expected: string;
}

export const SLOT_SPECS: Record<SlotKind, SlotSpec> = {
  sweater: { label: 'Sweater Design', aspect: [1, 1], aspectLabel: '1:1', expected: '2400 × 2400 px' },
  card: { label: 'Finished Card', aspect: [5, 7], aspectLabel: '5:7', expected: '1500 × 2100 px' },
};


export const WARN_BYTES = 5 * 1024 * 1024;


export const ASPECT_TOLERANCE = 0.01;

export type IssueLevel = 'error' | 'warn';

export interface Issue {
  level: IssueLevel;
  message: string;
}

const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg']);
const ACCEPTED_EXT = /\.(png|jpe?g)$/i;

export function isAcceptedType(name: string, mime: string): boolean {
  if (mime) return ACCEPTED_TYPES.has(mime.toLowerCase());
  return ACCEPTED_EXT.test(name);
}


export function checkFile(name: string, mime: string, bytes: number): Issue[] {
  const issues: Issue[] = [];
  if (!isAcceptedType(name, mime)) {
    issues.push({ level: 'error', message: 'Only PNG or JPEG can be submitted. Export the image as PNG (or JPEG quality 90).' });
  }
  if (bytes > WARN_BYTES) {
    issues.push({
      level: 'warn',
      message: `${formatBytes(bytes)} is over 5 MB. Check the Devpost upload limit; if needed export JPEG quality 90.`,
    });
  }
  return issues;
}

export function aspectError(width: number, height: number, aspect: readonly [number, number]): number {
  if (width <= 0 || height <= 0) return Infinity;
  const actual = width / height;
  const expected = aspect[0] / aspect[1];
  return Math.abs(actual - expected) / expected;
}


export function checkDimensions(kind: SlotKind, width: number, height: number): Issue[] {
  const spec = SLOT_SPECS[kind];
  const issues: Issue[] = [];
  if (aspectError(width, height, spec.aspect) > ASPECT_TOLERANCE) {
    issues.push({
      level: 'warn',
      message: `${width} × ${height} px is not ${spec.aspectLabel}. The ${spec.label} plan is ${spec.expected}.`,
    });
  }
  const longSide = Math.max(width, height);
  if (longSide < 1024) {
    issues.push({ level: 'warn', message: `Only ${longSide} px on the long side; export at full size (${spec.expected}).` });
  }
  return issues;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
