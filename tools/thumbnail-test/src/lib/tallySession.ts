import { loadRevision, saveRevision, REVISION_KEY, type Revision } from './revision';
import { deserialize, emptyTally, MAX_TESTERS, STORAGE_KEY, tallyReducer, toMarkdown, type TallyAction, type Verdict } from './tally';
import type { SlotKind } from './validate';

type Context = { subject: SlotKind; practice: boolean; revision: Revision | null; image: unknown };
type Dependencies = {
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  schedule: (tick: () => void) => unknown;
  unschedule: (timer: unknown) => void;
  storageFailed: () => void;
};

export function createTallySession(deps: Dependencies) {
  let archive: string | null = null;
  let warning = false;
  try { archive = deps.storage.getItem(REVISION_KEY); } catch { warning = true; }
  let context: Context = { subject: 'sweater', practice: false, revision: null, image: null };
  let tally = emptyTally();
  let timer: unknown;
  let pending: { name: string; answering: boolean } | null = null;
  const cancel = () => {
    if (timer !== undefined) deps.unschedule(timer);
    timer = undefined;
    pending = null;
  };
  const dispatch = (action: TallyAction) => {
    tally = tallyReducer(tally, action);
    if (!context.practice && context.revision) {
      archive = saveRevision(archive, context.revision, tally);
      try { deps.storage.setItem(REVISION_KEY, archive); }
      catch { warning = true; deps.storageFailed(); }
    }
  };
  return {
    snapshot: () => structuredClone({ subject: context.subject, practice: context.practice, revision: context.revision, tally, warning, active: pending !== null }),
    sync(next: Context) {
      if (next.subject === context.subject && next.practice === context.practice && next.image === context.image) return false;
      cancel();
      context = { ...next, revision: next.revision ? { ...next.revision } : null };
      tally = next.practice || !next.revision ? emptyTally() : loadRevision(archive, next.revision);
      return true;
    },
    reveal(name: string, tick: (seconds: number) => void, answer: () => void) {
      if (!context.image || pending || tally.entries.length >= MAX_TESTERS) return false;
      pending = { name, answering: false };
      let left = 3;
      timer = deps.schedule(() => {
        left -= 1;
        if (left > 0) { tick(left); return; }
        deps.unschedule(timer);
        timer = undefined;
        if (!pending) return;
        pending.answering = true;
        answer();
      });
      return true;
    },
    answer(text: string) {
      if (!pending?.answering || !text.trim()) return false;
      const name = pending.name;
      cancel();
      dispatch({ type: 'add', id: `t${Date.now().toString(36)}`, name, answer: text });
      return true;
    },
    mark(id: string, verdict: Verdict) { dispatch({ type: 'mark', id, verdict }); },
    reset() { cancel(); dispatch({ type: 'reset' }); },
    cancel,
    legacyMarkdown() {
      let legacy = emptyTally();
      try { legacy = deserialize(deps.storage.getItem(STORAGE_KEY)); } catch { }
      return legacy.entries.length ? `UNBOUND LEGACY ARCHIVE: image and revision unknown. Do not count toward current readiness.\n\n${toMarkdown(legacy, 'legacy date unknown')}` : null;
    },
    markdown(date: string) {
      const r = context.revision;
      return [toMarkdown(tally, date), '', r ? `Subject: ${r.subject} · File: ${r.name.replace(/\s+/g, ' ')} · ${r.width} × ${r.height} px\nSHA-256: ${r.digest}` : 'Practice sketch: not evidence for an actual export.'].join('\n');
    },
    export(exportedAt: string) {
      return structuredClone({ version: 2, exportedAt, revision: context.revision, practice: context.practice, responses: tally.entries });
    },
  };
}
