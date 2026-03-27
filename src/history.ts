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

function spellingKey(word: string): string {
  return `Spelling:${word}`;
}

let statsMutex: Promise<void> = Promise.resolve();

export function recordQuestionResult(
  game: string, num1: number, num2: number, correct: boolean,
): Promise<void> {
  statsMutex = statsMutex.then(async () => {
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
  });
  return statsMutex;
}

export function recordSpellingResult(
  word: string, correct: boolean,
): Promise<void> {
  statsMutex = statsMutex.then(async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY.QUESTION_STATS_KEY);
      const stats: Record<string, QuestionStat> = raw ? JSON.parse(raw) : {};
      const k = spellingKey(word);
      if (!stats[k]) {
        stats[k] = { key: k, game: 'Spelling', num1: 0, num2: 0, score: 0, attempts: 0 };
      }
      stats[k].score += correct ? 1 : -1;
      stats[k].attempts += 1;
      await AsyncStorage.setItem(HISTORY.QUESTION_STATS_KEY, JSON.stringify(stats));
    } catch {}
  });
  return statsMutex;
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

export interface MistakeEntry {
  key:      string;  // e.g. "Addition:3+5" or "Spelling:cat"
  game:     string;
  num1:     number;
  num2:     number;
  answer:   number | null;  // null = timeout
  correct:  number;
  date:     string;
  word?:    string;    // spelling: the target word
  attempt?: string;    // spelling: what was spelled
}

export async function recordMistake(
  game: string, num1: number, num2: number, answer: number | null,
): Promise<void> {
  try {
    const k = questionKey(game, num1, num2);
    const correctAns = game === 'Minus' ? num1 - num2 : num1 + num2;
    const date = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const entry: MistakeEntry = { key: k, game, num1, num2, answer, correct: correctAns, date };
    const raw = await AsyncStorage.getItem(HISTORY.MISTAKE_LOG_KEY);
    let log: MistakeEntry[] = [];
    if (raw) { try { log = JSON.parse(raw); } catch { log = []; } }
    log.unshift(entry);
    if (log.length > HISTORY.MAX_MISTAKES) log.length = HISTORY.MAX_MISTAKES;
    await AsyncStorage.setItem(HISTORY.MISTAKE_LOG_KEY, JSON.stringify(log));
  } catch {}
}

export async function recordSpellingMistake(
  word: string, attempt: string,
): Promise<void> {
  try {
    const k = spellingKey(word);
    const date = fmtDate(new Date());
    const entry: MistakeEntry = {
      key: k, game: 'Spelling', num1: 0, num2: 0,
      answer: null, correct: 0, date,
      word, attempt,
    };
    const raw = await AsyncStorage.getItem(HISTORY.MISTAKE_LOG_KEY);
    let log: MistakeEntry[] = [];
    if (raw) { try { log = JSON.parse(raw); } catch { log = []; } }
    log.unshift(entry);
    if (log.length > HISTORY.MAX_MISTAKES) log.length = HISTORY.MAX_MISTAKES;
    await AsyncStorage.setItem(HISTORY.MISTAKE_LOG_KEY, JSON.stringify(log));
  } catch {}
}

export async function loadMistakes(questionKey?: string): Promise<MistakeEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY.MISTAKE_LOG_KEY);
    if (!raw) return [];
    const log: MistakeEntry[] = JSON.parse(raw);
    if (questionKey) return log.filter(m => m.key === questionKey);
    return log;
  } catch {
    return [];
  }
}

export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove([
    HISTORY.STORAGE_KEY,
    HISTORY.SCORE_KEY,
    HISTORY.QUESTION_STATS_KEY,
    HISTORY.MISTAKE_LOG_KEY,
  ]);
}

export interface HistoryEntry {
  game:    string;
  mode:    string;
  correct: number;
  total:   number;
  secs:    number;
  date:    string;
  ts?:     number; // epoch ms, added for reliable date comparison
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

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mmm = MONTHS[d.getMonth()];
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${dd} ${mmm} ${yyyy} ${hh}:${mm}`;
}

function fmtDateOnly(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mmm = MONTHS[d.getMonth()];
  const yyyy = d.getFullYear();
  return `${dd} ${mmm} ${yyyy}`;
}

export async function saveHistoryEntry(entry: Omit<HistoryEntry, 'date'>): Promise<void> {
  try {
    const now = new Date();
    const date = fmtDate(now);
    const record: HistoryEntry = { ...entry, date, ts: now.getTime() };
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

function parseEntryDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Handle formats: "23 Mar 2026 22:41" or "23 Mar 2026, 22:41"
  const m = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const monIdx = MONTHS.indexOf(m[2]);
  const year = parseInt(m[3], 10);
  if (monIdx < 0 || isNaN(day) || isNaN(year)) return null;
  return new Date(year, monIdx, day);
}

export async function getGamesToday(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY.STORAGE_KEY);
    if (!raw) return 0;
    const entries: HistoryEntry[] = JSON.parse(raw);
    if (!Array.isArray(entries)) return 0;
    const now = new Date();
    const todayY = now.getFullYear();
    const todayM = now.getMonth();
    const todayD = now.getDate();
    const startOfDay = new Date(todayY, todayM, todayD).getTime();
    const endOfDay = startOfDay + 86400000;
    return entries.filter(e => {
      if (e.ts) return e.ts >= startOfDay && e.ts < endOfDay;
      const parsed = parseEntryDate(e.date);
      if (!parsed) return false;
      return parsed.getFullYear() === todayY && parsed.getMonth() === todayM && parsed.getDate() === todayD;
    }).length;
  } catch { return 0; }
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
