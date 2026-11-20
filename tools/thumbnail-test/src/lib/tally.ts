/** The three-person "what's the joke?" Tally. Pure reducer + (de)serialisation; storage lives in the UI. */

export const MAX_TESTERS = 3;
export const STORAGE_KEY = 'thumbnail-test.tally.v1';

export type Verdict = 'got' | 'partly' | 'missed';

export interface TallyEntry {
  id: string;
  name: string;
  answer: string;
  verdict: Verdict | null;
}

export interface TallyState {
  entries: TallyEntry[];
}

export type TallyAction =
  | { type: 'add'; id: string; name: string; answer: string }
  | { type: 'mark'; id: string; verdict: Verdict }
  | { type: 'remove'; id: string }
  | { type: 'reset' };

export const emptyTally = (): TallyState => ({ entries: [] });

export function tallyReducer(state: TallyState, action: TallyAction): TallyState {
  switch (action.type) {
    case 'add': {
      if (state.entries.length >= MAX_TESTERS) return state;
      const answer = action.answer.trim();
      if (!answer) return state;
      const name = action.name.trim() || `Tester ${state.entries.length + 1}`;
      return { entries: [...state.entries, { id: action.id, name, answer, verdict: null }] };
    }
    case 'mark':
      return { entries: state.entries.map((e) => (e.id === action.id ? { ...e, verdict: action.verdict } : e)) };
    case 'remove':
      return { entries: state.entries.filter((e) => e.id !== action.id) };
    case 'reset':
      return emptyTally();
  }
}

export interface TallySummary {
  got: number;
  partly: number;
  missed: number;
  unmarked: number;
  total: number;
}

export function summarize(state: TallyState): TallySummary {
  const s: TallySummary = { got: 0, partly: 0, missed: 0, unmarked: 0, total: state.entries.length };
  for (const e of state.entries) {
    if (e.verdict === null) s.unmarked += 1;
    else s[e.verdict] += 1;
  }
  return s;
}

export function serialize(state: TallyState): string {
  return JSON.stringify(state);
}

const VERDICTS = new Set<unknown>(['got', 'partly', 'missed', null]);

/** Parses stored JSON defensively; anything malformed becomes an empty Tally. */
export function deserialize(raw: string | null): TallyState {
  if (!raw) return emptyTally();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as TallyState).entries)) return emptyTally();
    const entries = (parsed as { entries: unknown[] }).entries
      .filter((e): e is TallyEntry => {
        if (!e || typeof e !== 'object') return false;
        const r = e as Record<string, unknown>;
        return typeof r.id === 'string' && typeof r.name === 'string' && typeof r.answer === 'string' && VERDICTS.has(r.verdict);
      })
      .slice(0, MAX_TESTERS)
      .map((e) => ({ id: e.id, name: e.name, answer: e.answer, verdict: e.verdict }));
    return { entries };
  } catch {
    return emptyTally();
  }
}

const VERDICT_LABEL: Record<Verdict, string> = { got: 'Got it', partly: 'Partly', missed: 'Missed' };

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

/** Markdown for the owner's notes. Private: not a public metric. */
export function toMarkdown(state: TallyState, date: string): string {
  const s = summarize(state);
  const lines = [
    `## Tally — ${date}`,
    '',
    `${s.got} of ${MAX_TESTERS} got it (${s.partly} partly, ${s.missed} missed${s.unmarked ? `, ${s.unmarked} unmarked` : ''}).`,
    '',
    '| Tester | Answer | Verdict |',
    '|---|---|---|',
    ...state.entries.map((e) => `| ${cell(e.name)} | ${cell(e.answer)} | ${e.verdict ? VERDICT_LABEL[e.verdict] : '—'} |`),
    '',
    '_Private check for the owner’s decisions; not a public metric._',
  ];
  return lines.join('\n');
}
