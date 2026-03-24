import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { loadMistakes, loadQuestionStats, MistakeEntry, QuestionStat, resetAllData } from '../src/history';
import { useLang, t } from '../src/i18n';

type SortKey = 'question' | 'accuracy' | 'attempts';
type SortDir = 'asc' | 'desc';

function accuracy(s: QuestionStat): number {
  if (s.attempts === 0) return 0;
  const correct = (s.score + s.attempts) / 2;
  return Math.round((correct / s.attempts) * 100);
}

function accuracyColor(pct: number): string {
  if (pct >= 80) return '#43A047';
  if (pct >= 60) return '#66BB6A';
  if (pct >= 40) return '#FFA726';
  if (pct >= 20) return '#EF5350';
  return '#E53935';
}

export default function StatsScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<QuestionStat[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('accuracy');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const { lang } = useLang();
  const str = t(lang);
  const [resetCount, setResetCount] = useState(0);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const RESET_TAPS = 7;

  const load = useCallback(() => { loadQuestionStats().then(setStats); }, []);
  useEffect(() => { load(); }, [load]);

  async function onRowTap(key: string) {
    if (expandedKey === key) { setExpandedKey(null); return; }
    const m = await loadMistakes(key);
    setMistakes(m);
    setExpandedKey(key);
  }

  const sorted = [...stats].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'question') cmp = a.key.localeCompare(b.key);
    else if (sortKey === 'accuracy') cmp = accuracy(a) - accuracy(b);
    else cmp = a.attempts - b.attempts;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'accuracy' ? 'asc' : 'desc'); }
  }

  function arrow(key: SortKey) {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  }

  function formatQuestion(s: QuestionStat) {
    const op = s.game === 'Minus' ? ' − ' : ' + ';
    const ans = s.game === 'Minus' ? s.num1 - s.num2 : s.num1 + s.num2;
    return `${s.num1}${op}${s.num2} = ${ans}`;
  }

  async function onResetTap() {
    const next = resetCount + 1;
    if (next >= RESET_TAPS) {
      if (Platform.OS === 'web') {
        if (confirm(str.resetConfirm)) {
          await resetAllData();
          setStats([]);
          setResetCount(0);
        } else {
          setResetCount(0);
        }
      } else {
        Alert.alert(str.resetTitle, str.resetConfirm, [
          { text: str.cancel, onPress: () => setResetCount(0) },
          { text: str.reset, style: 'destructive', onPress: async () => {
            await resetAllData();
            setStats([]);
            setResetCount(0);
          }},
        ]);
      }
    } else {
      setResetCount(next);
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← {str.stats}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {sorted.length === 0 ? (
          <Text style={styles.empty}>{str.noQuestionsYet}</Text>
        ) : (
          <>
            <View style={[styles.row, styles.headerRow]}>
              <TouchableOpacity style={{ flex: 3 }} onPress={() => toggleSort('question')}>
                <Text style={[styles.cell, styles.headerCell]}>{str.question}{arrow('question')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleSort('accuracy')}>
                <Text style={[styles.cell, styles.headerCell, { textAlign: 'center' }]}>{str.accuracy}{arrow('accuracy')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleSort('attempts')}>
                <Text style={[styles.cell, styles.headerCell, { textAlign: 'center' }]}>{str.tries}{arrow('attempts')}</Text>
              </TouchableOpacity>
            </View>

            {sorted.map(s => {
              const pct = accuracy(s);
              const isExpanded = expandedKey === s.key;
              return (
                <View key={s.key}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => onRowTap(s.key)}>
                    <View style={[styles.row, isExpanded && styles.rowExpanded]}>
                      <Text style={[styles.cell, { flex: 3 }]}>{formatQuestion(s)}</Text>
                      <Text style={[styles.cell, { flex: 1, textAlign: 'center', color: accuracyColor(pct) }]}>{pct}%</Text>
                      <Text style={[styles.cell, { flex: 1, textAlign: 'center' }]}>{s.attempts}</Text>
                    </View>
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.detailPanel}>
                      {mistakes.length === 0 ? (
                        <Text style={styles.detailEmpty}>{str.noMistakes}</Text>
                      ) : (
                        mistakes.map((m, i) => (
                          <View key={i} style={styles.detailRow}>
                            <Text style={styles.detailText}>
                              {m.answer === null ? str.timeout : str.answered(m.answer)}
                            </Text>
                            <Text style={styles.detailDate}>{m.date}</Text>
                          </View>
                        ))
                      )}
                    </View>
                  )}
                  <View style={styles.separator} />
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={onResetTap} activeOpacity={0.7}>
          <Text style={styles.resetBtnText}>{str.reset}</Text>
        </TouchableOpacity>
        <Text style={styles.resetHint}>{str.resetHint(RESET_TAPS, resetCount)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#FAFAFA' },
  header:     { backgroundColor: '#3F51B5', paddingHorizontal: 20, paddingVertical: 16 },
  back:       { color: '#fff', fontSize: 22, fontFamily: 'BubblegumSans_400Regular' },
  empty:      { textAlign: 'center', fontSize: 20, fontFamily: 'BubblegumSans_400Regular', color: '#9E9E9E', marginTop: 48 },
  row:        { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  headerRow:  { backgroundColor: '#EEEEEE' },
  cell:       { fontSize: 17, fontFamily: 'BubblegumSans_400Regular', color: '#212121' },
  headerCell: { fontSize: 15, color: '#757575' },
  rowExpanded:{ backgroundColor: '#F5F5F5' },
  separator:  { height: 1, backgroundColor: '#E0E0E0' },
  detailPanel:{ backgroundColor: '#FAFAFA', paddingHorizontal: 24, paddingVertical: 8, borderLeftWidth: 4, borderLeftColor: '#E53935' },
  detailEmpty:{ fontSize: 14, fontFamily: 'BubblegumSans_400Regular', color: '#9E9E9E', paddingVertical: 4 },
  detailRow:  { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  detailText: { fontSize: 15, fontFamily: 'BubblegumSans_400Regular', color: '#E53935' },
  detailDate: { fontSize: 14, fontFamily: 'BubblegumSans_400Regular', color: '#9E9E9E' },
  footer:     { padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  resetBtn:   { backgroundColor: '#BDBDBD', borderBottomColor: '#757575', borderBottomWidth: 4, borderRadius: 20, paddingHorizontal: 28, paddingVertical: 10, marginBottom: 8 },
  resetBtnText: { color: '#fff', fontSize: 16, fontFamily: 'BubblegumSans_400Regular' },
  resetHint:  { fontSize: 12, fontFamily: 'BubblegumSans_400Regular', color: '#9E9E9E', textAlign: 'center' },
});
