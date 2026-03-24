import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HistoryEntry, loadHistory } from '../src/history';

export default function HistoryScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => { loadHistory().then(setEntries); }, []);

  function gameColor(game: string) { return game === 'Addition' ? '#3F51B5' : '#9C27B0'; }
  function modeColor(mode: string) { return mode === 'EASY'     ? '#43A047' : '#E53935'; }
  function fmtTime(secs: number)   { return secs >= 60 ? `${Math.floor(secs/60)}m ${secs%60}s` : `${secs}s`; }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← history</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {entries.length === 0 ? (
          <Text style={styles.empty}>no games played yet!</Text>
        ) : (
          <>
            {/* Column headers */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell, { flex: 1.4 }]}>game</Text>
              <Text style={[styles.cell, styles.headerCell]}>mode</Text>
              <Text style={[styles.cell, styles.headerCell]}>score</Text>
              <Text style={[styles.cell, styles.headerCell]}>time</Text>
              <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>date</Text>
            </View>

            {entries.map((e, i) => (
              <View key={i}>
                <View style={styles.row}>
                  <Text style={[styles.cell, { flex: 1.4, color: gameColor(e.game), fontWeight: 'bold' }]}>{e.game}</Text>
                  <Text style={[styles.cell, { color: modeColor(e.mode), fontWeight: 'bold' }]}>{e.mode}</Text>
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
