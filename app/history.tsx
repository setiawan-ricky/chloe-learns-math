import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HistoryEntry, loadHistory } from '../src/history';
import { useLang, t } from '../src/i18n';

export default function HistoryScreen() {
  const router = useRouter();
  const { lang } = useLang();
  const s = t(lang);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => { loadHistory().then(setEntries); }, []);

  function gameColor(game: string) { return game === 'Addition' ? '#3F51B5' : '#9C27B0'; }
  function modeColor(mode: string) { return mode === 'EASY'     ? '#43A047' : '#E53935'; }
  function fmtTime(secs: number)   { return secs >= 60 ? `${Math.floor(secs/60)}m ${secs%60}s` : `${secs}s`; }
  function gameLabel(game: string) { return game === 'Addition' ? s.addition : s.minus; }
  function modeLabel(mode: string) { return mode === 'EASY' ? s.easy : s.hard; }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← {s.history}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {entries.length === 0 ? (
          <Text style={styles.empty}>{s.noGamesYet}</Text>
        ) : (
          <>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell, { flex: 1.4 }]}>{s.game}</Text>
              <Text style={[styles.cell, styles.headerCell]}>{s.mode}</Text>
              <Text style={[styles.cell, styles.headerCell]}>{s.score}</Text>
              <Text style={[styles.cell, styles.headerCell]}>{s.time}</Text>
              <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>{s.date}</Text>
            </View>

            {entries.map((e, i) => (
              <View key={i}>
                <View style={styles.row}>
                  <Text style={[styles.cell, { flex: 1.4, color: gameColor(e.game) }]}>{gameLabel(e.game)}</Text>
                  <Text style={[styles.cell, { color: modeColor(e.mode) }]}>{modeLabel(e.mode)}</Text>
                  <Text style={styles.cell}>{e.correct} / {e.total}</Text>
                  <Text style={styles.cell}>{fmtTime(e.secs)}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{e.date}</Text>
                </View>
                <View style={styles.separator} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#FAFAFA' },
  header:     { backgroundColor: '#3F51B5', paddingHorizontal: 20, paddingVertical: 16 },
  back:       { color: '#fff', fontSize: 22, fontFamily: 'BubblegumSans_400Regular' },
  empty:      { textAlign: 'center', fontSize: 20, fontFamily: 'BubblegumSans_400Regular', color: '#9E9E9E', marginTop: 48 },
  row:        { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff' },
  headerRow:  { backgroundColor: '#EEEEEE' },
  cell:       { flex: 1, fontSize: 17, fontFamily: 'BubblegumSans_400Regular', color: '#212121' },
  headerCell: { fontSize: 15, color: '#757575' },
  separator:  { height: 1, backgroundColor: '#E0E0E0' },
});
