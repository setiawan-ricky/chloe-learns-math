import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useLang, t } from '../src/i18n';
import { playSound } from '../src/sound';
import { SPELLING_AUDIO, ALL_WORDS } from '../src/spelling-words';

const HISTORY_SIZE = 3;

function pickNextWord(recent: string[]): string {
  const pool = ALL_WORDS.filter(w => !recent.includes(w));
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function LscwcScreen() {
  const router = useRouter();
  const { lang } = useLang();
  const s = t(lang);
  const recentRef = useRef<string[]>([]);

  const [word, setWord] = useState(() => {
    const w = pickNextWord([]);
    recentRef.current = [w];
    return w;
  });
  const [hidden, setHidden] = useState(false);

  const wordAudio = SPELLING_AUDIO[word];

  const onNext = useCallback(() => {
    const next = pickNextWord(recentRef.current);
    recentRef.current = [...recentRef.current.slice(-(HISTORY_SIZE - 1)), next];
    setWord(next);
    setHidden(false);
  }, []);

  const { width: screenW } = useWindowDimensions();
  const SIDE_PAD = 48;
  const maxW = screenW - SIDE_PAD * 2;
  const letterSize = Math.min(120, Math.floor(maxW / word.length));
  const boxW = Math.round(letterSize * 0.65);
  const fontSize = Math.round(letterSize * 0.8);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← {s.lscwc}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Word display */}
        <View style={styles.wordRow}>
          {word.split('').map((ch, i) => (
            <View key={i} style={[styles.letterBox, { width: boxW, height: letterSize }]}>
              {hidden
                ? <View style={[styles.cover, { borderRadius: Math.round(letterSize / 6) }]} />
                : <Text style={[styles.letter, { fontSize }]}>{ch}</Text>
              }
            </View>
          ))}
        </View>

        {/* Audio buttons */}
        <View style={styles.audioRow}>
          <TouchableOpacity style={styles.audioBtn} onPress={() => wordAudio && playSound(wordAudio.word)}>
            <Text style={styles.audioBtnText}>🔊 {s.hearWord}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioBtn} onPress={() => wordAudio && playSound(wordAudio.sentence)}>
            <Text style={styles.audioBtnText}>📖 {s.hearSentence}</Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, hidden ? styles.showBtn : styles.hideBtn]}
            onPress={() => setHidden(!hidden)}>
            <Text style={styles.actionBtnText}>{hidden ? s.show : s.hide}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.nextBtn]} onPress={onNext}>
            <Text style={styles.actionBtnText}>{s.next}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#FAFAFA' },
  header:      { backgroundColor: '#3F51B5', paddingHorizontal: 20, paddingVertical: 16 },
  back:        { color: '#fff', fontSize: 22, fontFamily: 'BubblegumSans_400Regular' },
  content:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  wordRow:     { flexDirection: 'row', marginBottom: 40 },
  letterBox:   { alignItems: 'center', justifyContent: 'center' },
  letter:      { fontFamily: 'BubblegumSans_400Regular', color: '#3F51B5', textAlign: 'center' },
  cover:       { width: '100%', height: '100%', backgroundColor: '#BDBDBD' },
  audioRow:    { flexDirection: 'row', gap: 16, marginBottom: 32 },
  audioBtn:    { backgroundColor: '#E3F2FD', paddingHorizontal: 32, paddingVertical: 18, borderRadius: 20, borderWidth: 3, borderColor: '#90CAF9' },
  audioBtnText:{ fontSize: 28, fontFamily: 'BubblegumSans_400Regular', color: '#1565C0' },
  actionRow:   { flexDirection: 'row', gap: 20 },
  actionBtn:   { paddingHorizontal: 36, paddingVertical: 16, borderRadius: 20, borderBottomWidth: 4 },
  hideBtn:     { backgroundColor: '#FFA726', borderBottomColor: '#E65100' },
  showBtn:     { backgroundColor: '#66BB6A', borderBottomColor: '#2E7D32' },
  nextBtn:     { backgroundColor: '#42A5F5', borderBottomColor: '#1565C0' },
  actionBtnText:{ fontSize: 26, fontFamily: 'BubblegumSans_400Regular', color: '#fff' },
});
