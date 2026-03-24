import AsyncStorage from '@react-native-async-storage/async-storage';
import { HISTORY } from './config';

// key format: "Addition:3+5" or "Minus:7-2"
export interface QuestionStat {
  key:     string;
  game:    string;
  num1:    number;
  num2:    number;
  score:   number;  // +1 correct, -1 wrong/timeout
  attempts: number;
}

function questionKey(game: string, num1: number, num2: number): string {
  const op = game === 'Minus' ? '-' : '+';
  return `${game}:${num1}${op}${num2}`;
}

export async function recordQuestionResult(
  game: string, num1: number, num2: number, correct: boolean,
): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY.QUESTION_STATS_KEY);
    const stats: Record<string, QuestionStat> = raw ? JSON.parse(raw) : {};
    const k = questionKey(game, num1, num2);
    if (!stats[k]) {
      stats[k] = { key: k, game, num1, num2, score: 0, attempts: 0 };
    }
    stats[k].score += correct ? 1 : -1;
    stats[k].attempts += 1;
    await AsyncStorage.setItem(HISTORY.QUESTION_STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export async function loadQuestionStats(): Promise<QuestionStat[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY.QUESTION_STATS_KEY);
    if (!raw) return [];
    const stats: Record<string, QuestionStat> = JSON.parse(raw);
    return Object.values(stats);
  } catch {
    return [];
  }
}

export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove([
    HISTORY.STORAGE_KEY,
    HISTORY.SCORE_KEY,
    HISTORY.QUESTION_STATS_KEY,
  ]);
}

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
