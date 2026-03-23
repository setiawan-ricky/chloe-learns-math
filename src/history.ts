import AsyncStorage from '@react-native-async-storage/async-storage';
import { HISTORY } from './config';

export interface HistoryEntry {
  game:    string;
  mode:    string;
  correct: number;
  total:   number;
  secs:    number;
  date:    string;
}

export async function getScore(): Promise<number> {
  try {
    const v = await AsyncStorage.getItem(HISTORY.SCORE_KEY);
    return v ? parseInt(v, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function incrementScore(): Promise<number> {
  const score = (await getScore()) + 1;
  await AsyncStorage.setItem(HISTORY.SCORE_KEY, String(score));
  return score;
}

export async function saveHistoryEntry(entry: Omit<HistoryEntry, 'date'>): Promise<void> {
  try {
    const date = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const record: HistoryEntry = { ...entry, date };
    const raw = await AsyncStorage.getItem(HISTORY.STORAGE_KEY);
    let entries: HistoryEntry[] = [];
    if (raw) {
      try { entries = JSON.parse(raw); } catch { entries = []; }
    }
    entries.unshift(record);
    if (entries.length > HISTORY.MAX_ENTRIES) entries.length = HISTORY.MAX_ENTRIES;
    await AsyncStorage.setItem(HISTORY.STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY.STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e: unknown): e is HistoryEntry =>
        typeof e === 'object' && e !== null &&
        'game' in e && 'correct' in e && 'total' in e && 'secs' in e && 'date' in e,
    );
  } catch {
    return [];
  }
}
