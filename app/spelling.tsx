import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLang, t } from '../src/i18n';
import { playSound, playSoundSequence } from '../src/sound';
import { getAudio, CELEBRATIONS, pickRandom } from '../src/assets';
import { saveHistoryEntry, recordSpellingResult, recordSpellingMistake } from '../src/history';
import { SPELLING_AUDIO, ALL_WORDS } from '../src/spelling-words';
import { Image } from 'react-native';

const CORRECT_CLIPS = [
  require('../assets/audio/en/spelling/correct-1.mp3'),
  require('../assets/audio/en/spelling/correct-2.mp3'),
  require('../assets/audio/en/spelling/correct-3.mp3'),
  require('../assets/audio/en/spelling/correct-4.mp3'),
  require('../assets/audio/en/spelling/correct-5.mp3'),
  require('../assets/audio/en/spelling/correct-6.mp3'),
];
const NOT_CORRECT_AUDIO = require('../assets/audio/en/spelling/not-correct.mp3');
const ROUND_SIZE = 5;
const TIMER_EASY = 30;
const TIMER_HARD = 20;
const TIMER_WARN = 8;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWords(count: number): string[] {
  return shuffle(ALL_WORDS).slice(0, count);
}

function jumbleLetters(word: string): string[] {
  const letters = word.split('');
  let jumbled = shuffle(letters);
  while (jumbled.join('') === word && word.length > 1) jumbled = shuffle(letters);
  return jumbled;
}

type SpellingMode = 'EASY' | 'HARD';

export default function SpellingScreen() {
  const router = useRouter();
  const { mode: modeParam } = useLocalSearchParams<{ mode: string }>();
  const mode = (modeParam ?? 'EASY') as SpellingMode;
  const isHard = mode === 'HARD';
  const timerSecs = isHard ? TIMER_HARD : TIMER_EASY;
  const { lang } = useLang();
  const s = t(lang);
  const audio = getAudio(lang);

  const [words] = useState(() => pickWords(ROUND_SIZE));
  const [questionIdx, setQuestionIdx] = useState(0);
  const [filled, setFilled] = useState<string[]>([]);
  const [available, setAvailable] = useState<(string | null)[]>([]);
  const [timer, setTimer] = useState(timerSecs);
  const [roundDone, setRoundDone] = useState(false);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [celebrationImg, setCelebrationImg] = useState<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advancing = useRef(false);

  const word = words[questionIdx] ?? '';
  const letters = useMemo(() => word.split(''), [word]);
  const wordAudio = SPELLING_AUDIO[word];

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimerOnly = useCallback(() => {
    stopTimer();
    setTimer(timerSecs);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer, timerSecs]);

  const startWord = useCallback((idx: number) => {
    stopTimer();
    advancing.current = false;
    const w = words[idx];
    setQuestionIdx(idx);
    setFilled([]);
    setAvailable(jumbleLetters(w));
    setTimer(timerSecs);
    setTimeout(() => {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            stopTimer();
            advancing.current = true;
            recordSpellingResult(w, false);
            setTimeout(() => advanceQuestion(idx), 800);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      const wa = SPELLING_AUDIO[w];
      if (wa) playSoundSequence([wa.word, wa.sentence, wa.word]);
    }, 2000);
  }, [words, stopTimer]);

  const advanceQuestion = useCallback((currentIdx: number) => {
    const next = currentIdx + 1;
    if (next >= ROUND_SIZE) {
      endRound();
    } else {
      startWord(next);
    }
  }, [startWord]);

  const startTimeRef = useRef(Date.now());

  const endRound = useCallback(() => {
    stopTimer();
    setRoundDone(true);
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    setRoundCorrect(prev => {
      saveHistoryEntry({ game: 'Spelling', mode, correct: prev, total: ROUND_SIZE, secs: elapsed });
      if (prev === ROUND_SIZE) {
        playSound(pickRandom(audio.allCorrect));
        setCelebrationImg(pickRandom(CELEBRATIONS));
      } else if (prev <= 1) {
        playSound(pickRandom(audio.completionBad));
      } else {
        playSound(pickRandom(audio.completion));
      }
      return prev;
    });
  }, [stopTimer, audio]);

  useEffect(() => { startWord(0); return stopTimer; }, []);

  const onLetterTap = useCallback((letter: string, index: number) => {
    if (roundDone || advancing.current) return;
    const newFilled = [...filled, letter];
    setFilled(newFilled);
    setAvailable(prev => { const next = [...prev]; next[index] = null; return next; });

    if (newFilled.length === letters.length) {
      stopTimer();
      if (newFilled.join('') === word) {
        recordSpellingResult(word, true);
        setRoundCorrect(prev => prev + 1);
        playSound(pickRandom(CORRECT_CLIPS));
        advancing.current = true;
        setTimeout(() => advanceQuestion(questionIdx), 1000);
      } else if (isHard) {
        recordSpellingResult(word, false);
        recordSpellingMistake(word, newFilled.join(''));
        playSound(pickRandom(audio.incorrectHard));
        advancing.current = true;
        setTimeout(() => advanceQuestion(questionIdx), 1500);
      } else {
        recordSpellingMistake(word, newFilled.join(''));
        playSound(NOT_CORRECT_AUDIO);
        advancing.current = true;
        setTimeout(() => {
          advancing.current = false;
          setFilled([]);
          setAvailable(jumbleLetters(word));
          startTimerOnly();
        }, 1500);
      }
    }
  }, [filled, letters, word, roundDone, questionIdx, stopTimer, advanceQuestion, startWord, endRound]);

  const onFilledTap = useCallback((index: number) => {
    if (roundDone || advancing.current) return;
    const removed = filled.slice(index);
    const newFilled = filled.slice(0, index);
    setFilled(newFilled);
    setAvailable(prev => {
      const next = [...prev];
      for (const letter of removed) {
        const emptyIdx = next.indexOf(null);
        if (emptyIdx !== -1) next[emptyIdx] = letter;
      }
      return next;
    });
  }, [filled, roundDone]);

  const restartRound = useCallback(() => {
    setRoundDone(false);
    setRoundCorrect(0);
    setCelebrationImg(null);
    startTimeRef.current = Date.now();
    const newWords = pickWords(ROUND_SIZE);
    (words as any).splice(0, words.length, ...newWords);
    startWord(0);
  }, [words, startWord]);

  const { width: screenW } = useWindowDimensions();
  const SIDE_PAD = 48;
  const maxTile = Math.floor((screenW - SIDE_PAD * 2) / letters.length);
  const tileSize = Math.min(120, maxTile);
  const blankW = Math.round(tileSize * 0.65);
  const fontSize = Math.round(tileSize * 0.8);
  const underW = Math.round(blankW * 0.85);
  const underH = Math.max(4, Math.round(tileSize * 0.067));

  const endMessage = roundCorrect === ROUND_SIZE
    ? s.amazing
    : roundCorrect <= 1
      ? s.keepPractising(roundCorrect, ROUND_SIZE)
      : s.goodJob(roundCorrect, ROUND_SIZE);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { stopTimer(); router.back(); }}>
          <Text style={styles.back}>← {s.spelling} • {isHard ? s.hard : s.easy}</Text>
        </TouchableOpacity>
      </View>

      {!roundDone ? (
        <View style={styles.content}>
          {/* Progress + timer row */}
          <View style={styles.topRow}>
            <Text style={styles.progress}>{questionIdx + 1} / {ROUND_SIZE}</Text>
            <Text style={[styles.timer, timer <= TIMER_WARN && styles.timerWarn]}>{timer}</Text>
          </View>

          {/* Blanks / filled letters */}
          <View style={styles.blanksRow}>
            {letters.map((_, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={filled[i] ? 0.6 : 1}
                onPress={() => filled[i] ? onFilledTap(i) : undefined}
                style={[styles.blankBox, { width: blankW }]}>
                <Text style={[styles.blankLetter, { fontSize, height: tileSize }]}>{filled[i] ?? ''}</Text>
                {!filled[i] && <View style={[styles.underline, { width: underW, height: underH }]} />}
              </TouchableOpacity>
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

          {/* Jumbled letters */}
          <View style={[styles.lettersRow, { gap: 10 }]}>
            {available.map((letter, i) => (
              letter ? (
                <TouchableOpacity key={i} style={[styles.letterBtn, { width: tileSize, height: tileSize, borderRadius: Math.round(tileSize / 6) }]} onPress={() => onLetterTap(letter, i)}>
                  <Text style={[styles.letterText, { fontSize: Math.round(fontSize * 0.67) }]}>{letter}</Text>
                </TouchableOpacity>
              ) : (
                <View key={i} style={[styles.letterBtn, styles.letterUsed, { width: tileSize, height: tileSize, borderRadius: Math.round(tileSize / 6) }]} />
              )
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          {celebrationImg && (
            <Image source={celebrationImg} style={styles.celebration} resizeMode="contain" />
          )}
          <Text style={styles.endMessage}>{endMessage}</Text>
          <View style={styles.doneRow}>
            <TouchableOpacity style={styles.playAgainBtn} onPress={restartRound}>
              <Text style={styles.playAgainText}>{s.playAgain}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quitBtn} onPress={() => router.back()}>
              <Text style={styles.quitText}>{s.quit}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#FAFAFA' },
  header:     { backgroundColor: '#3F51B5', paddingHorizontal: 20, paddingVertical: 16 },
  back:       { color: '#fff', fontSize: 22, fontFamily: 'BubblegumSans_400Regular' },
  content:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  topRow:     { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 24 },
  progress:   { fontSize: 28, fontFamily: 'BubblegumSans_400Regular', color: '#3F51B5' },
  timer:      { fontSize: 34, fontFamily: 'BubblegumSans_400Regular', color: '#757575' },
  timerWarn:  { color: '#F44336' },
  blanksRow:  { flexDirection: 'row', marginBottom: 32 },
  blankBox:   { alignItems: 'center' },
  blankLetter:{ fontFamily: 'BubblegumSans_400Regular', color: '#3F51B5', textAlign: 'center' },
  underline:  { backgroundColor: '#9E9E9E', borderRadius: 4 },
  audioRow:   { flexDirection: 'row', gap: 16, marginBottom: 32 },
  audioBtn:   { backgroundColor: '#E3F2FD', paddingHorizontal: 32, paddingVertical: 18, borderRadius: 20, borderWidth: 3, borderColor: '#90CAF9' },
  audioBtnText:{ fontSize: 28, fontFamily: 'BubblegumSans_400Regular', color: '#1565C0' },
  lettersRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  letterBtn:  { backgroundColor: '#FFF9C4', borderWidth: 4, borderColor: '#F9A825', justifyContent: 'center', alignItems: 'center' },
  letterUsed: { backgroundColor: '#EEEEEE', borderColor: '#E0E0E0' },
  letterText: { fontFamily: 'BubblegumSans_400Regular', color: '#F57F17' },
  endMessage: { fontSize: 28, fontFamily: 'BubblegumSans_400Regular', color: '#3F51B5', textAlign: 'center', marginBottom: 24 },
  celebration:{ width: 200, height: 200, marginBottom: 16 },
  doneRow:    { flexDirection: 'row', gap: 20 },
  playAgainBtn:{ backgroundColor: '#43A047', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 },
  playAgainText:{ fontSize: 22, fontFamily: 'BubblegumSans_400Regular', color: '#fff' },
  quitBtn:    { backgroundColor: '#E53935', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 },
  quitText:   { fontSize: 22, fontFamily: 'BubblegumSans_400Regular', color: '#fff' },
});
