import type { SlotKind } from './validate';
import { deserialize, emptyTally, serialize, type TallyState } from './tally';

export interface Revision { subject: SlotKind; digest: string; name: string; width: number; height: number }
export const REVISION_KEY = 'thumbnail-test.revisions.v2';
export const revisionId = (r: Revision): string => `${r.subject}:${r.digest}`;
export async function imageDigest(file: Blob): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export function loadRevision(raw: string | null, revision: Revision): TallyState {
  try {
    const archive: unknown = JSON.parse(raw ?? '{}');
    if (!archive || typeof archive !== 'object' || Array.isArray(archive)) return emptyTally();
    return deserialize(JSON.stringify((archive as Record<string, unknown>)[revisionId(revision)]));
  } catch { return emptyTally(); }
}
export function saveRevision(raw: string | null, revision: Revision, tally: TallyState): string {
  let archive: Record<string, unknown> = {};
  try { const parsed: unknown = JSON.parse(raw ?? '{}'); if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) archive = parsed as Record<string, unknown>; } catch {  }
  archive[revisionId(revision)] = { ...JSON.parse(serialize(tally)), revision };
  return JSON.stringify(archive);
}
