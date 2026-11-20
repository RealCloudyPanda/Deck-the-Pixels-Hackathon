/**
 * Generation Budget: Nano Banana Generations used today on the free Photoshop web tier.
 * The rules page (read 2026-11-18) states five image generations per day for free accounts.
 * Resets at local midnight.
 */

export const DAILY_LIMIT = 5;
export const BUDGET_KEY = 'thumbnail-test.budget.v1';

export interface BudgetState {
  /** local calendar date, YYYY-MM-DD */
  date: string;
  used: number;
}

export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Returns today's state: same-day state is kept, anything older (or malformed) starts at 0. */
export function rollover(state: BudgetState | null, now: Date): BudgetState {
  const today = localDateKey(now);
  if (!state || state.date !== today || !Number.isFinite(state.used)) return { date: today, used: 0 };
  return { date: today, used: clamp(state.used) };
}

function clamp(n: number): number {
  return Math.min(DAILY_LIMIT, Math.max(0, Math.round(n)));
}

export function change(state: BudgetState | null, delta: number, now: Date): BudgetState {
  const s = rollover(state, now);
  return { date: s.date, used: clamp(s.used + delta) };
}

export function remaining(state: BudgetState): number {
  return DAILY_LIMIT - state.used;
}

export function parseBudget(raw: string | null): BudgetState | null {
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    if (v && typeof v === 'object') {
      const r = v as Record<string, unknown>;
      if (typeof r.date === 'string' && typeof r.used === 'number') return { date: r.date, used: r.used };
    }
  } catch {
    /* fall through */
  }
  return null;
}

/** Milliseconds until the next local midnight. */
export function msUntilMidnight(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return next.getTime() - now.getTime();
}
