/**
 * User-customizable market watchlist.
 *
 * Stores a list of ticker symbols in localStorage. Used by Market panel
 * to fetch quotes for the user-selected set.
 */

const STORAGE_KEY = 'wm-market-watchlist-v1';
const EVENT_NAME = 'wm-market-watchlist-changed';

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

function normalizeSymbol(raw: string): string {
  // Allow common finnhub/yahoo formats: ^GSPC, BRK-B, GC=F, BTCUSD, etc.
  // We only trim whitespace and remove internal spaces.
  return raw.trim().replace(/\s+/g, '');
}

export function getMarketWatchlistSymbols(): string[] {
  try {
    const parsed = safeParseJson<unknown>(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(parsed)) {
      return parsed
        .map((s) => (typeof s === 'string' ? normalizeSymbol(s) : ''))
        .filter(Boolean);
    }
  } catch {
    // ignore
  }
  return [];
}

export function setMarketWatchlistSymbols(symbols: string[]): void {
  const cleaned = symbols
    .map(normalizeSymbol)
    .filter(Boolean);

  // De-dupe but keep order
  const seen = new Set<string>();
  const uniq: string[] = [];
  for (const s of cleaned) {
    if (seen.has(s)) continue;
    seen.add(s);
    uniq.push(s);
    if (uniq.length >= 50) break;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uniq));
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { symbols: uniq } }));
}

export function resetMarketWatchlist(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { symbols: [] } }));
}

export function subscribeMarketWatchlistChange(cb: (symbols: string[]) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as { symbols?: string[] } | undefined;
    cb(Array.isArray(detail?.symbols) ? detail!.symbols! : getMarketWatchlistSymbols());
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export function parseMarketSymbolsInput(text: string): string[] {
  // Accept comma, newline, or space separated.
  return text
    .split(/[\n,]+/g)
    .flatMap((chunk) => chunk.split(/\s+/g))
    .map(normalizeSymbol)
    .filter(Boolean);
}
