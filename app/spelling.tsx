import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLang, t } from '../src/i18n';
import { playSound, playSoundSequence } from '../src/sound';
import { getAudio, CELEBRATIONS, pickRandom } from '../src/assets';
import { saveHistoryEntry, recordSpellingResult, recordSpellingMistake } from '../src/history';
import { Image } from 'react-native';

const SPELLING_AUDIO: Record<string, { word: any; sentence: any }> = {
  the:    { word: require('../assets/audio/en/spelling/the-word.mp3'),    sentence: require('../assets/audio/en/spelling/the-sentence.mp3') },
  of:     { word: require('../assets/audio/en/spelling/of-word.mp3'),     sentence: require('../assets/audio/en/spelling/of-sentence.mp3') },
  and:    { word: require('../assets/audio/en/spelling/and-word.mp3'),    sentence: require('../assets/audio/en/spelling/and-sentence.mp3') },
  a:      { word: require('../assets/audio/en/spelling/a-word.mp3'),      sentence: require('../assets/audio/en/spelling/a-sentence.mp3') },
  to:     { word: require('../assets/audio/en/spelling/to-word.mp3'),     sentence: require('../assets/audio/en/spelling/to-sentence.mp3') },
  in:     { word: require('../assets/audio/en/spelling/in-word.mp3'),     sentence: require('../assets/audio/en/spelling/in-sentence.mp3') },
  is:     { word: require('../assets/audio/en/spelling/is-word.mp3'),     sentence: require('../assets/audio/en/spelling/is-sentence.mp3') },
  you:    { word: require('../assets/audio/en/spelling/you-word.mp3'),    sentence: require('../assets/audio/en/spelling/you-sentence.mp3') },
  that:   { word: require('../assets/audio/en/spelling/that-word.mp3'),   sentence: require('../assets/audio/en/spelling/that-sentence.mp3') },
  it:     { word: require('../assets/audio/en/spelling/it-word.mp3'),     sentence: require('../assets/audio/en/spelling/it-sentence.mp3') },
  he:     { word: require('../assets/audio/en/spelling/he-word.mp3'),     sentence: require('../assets/audio/en/spelling/he-sentence.mp3') },
  for:    { word: require('../assets/audio/en/spelling/for-word.mp3'),    sentence: require('../assets/audio/en/spelling/for-sentence.mp3') },
  was:    { word: require('../assets/audio/en/spelling/was-word.mp3'),    sentence: require('../assets/audio/en/spelling/was-sentence.mp3') },
  on:     { word: require('../assets/audio/en/spelling/on-word.mp3'),     sentence: require('../assets/audio/en/spelling/on-sentence.mp3') },
  are:    { word: require('../assets/audio/en/spelling/are-word.mp3'),    sentence: require('../assets/audio/en/spelling/are-sentence.mp3') },
  as:     { word: require('../assets/audio/en/spelling/as-word.mp3'),     sentence: require('../assets/audio/en/spelling/as-sentence.mp3') },
  with:   { word: require('../assets/audio/en/spelling/with-word.mp3'),   sentence: require('../assets/audio/en/spelling/with-sentence.mp3') },
  his:    { word: require('../assets/audio/en/spelling/his-word.mp3'),    sentence: require('../assets/audio/en/spelling/his-sentence.mp3') },
  they:   { word: require('../assets/audio/en/spelling/they-word.mp3'),   sentence: require('../assets/audio/en/spelling/they-sentence.mp3') },
  at:     { word: require('../assets/audio/en/spelling/at-word.mp3'),     sentence: require('../assets/audio/en/spelling/at-sentence.mp3') },
  be:     { word: require('../assets/audio/en/spelling/be-word.mp3'),     sentence: require('../assets/audio/en/spelling/be-sentence.mp3') },
  this:   { word: require('../assets/audio/en/spelling/this-word.mp3'),   sentence: require('../assets/audio/en/spelling/this-sentence.mp3') },
  from:   { word: require('../assets/audio/en/spelling/from-word.mp3'),   sentence: require('../assets/audio/en/spelling/from-sentence.mp3') },
  I:      { word: require('../assets/audio/en/spelling/I-word.mp3'),      sentence: require('../assets/audio/en/spelling/I-sentence.mp3') },
  have:   { word: require('../assets/audio/en/spelling/have-word.mp3'),   sentence: require('../assets/audio/en/spelling/have-sentence.mp3') },
  or:     { word: require('../assets/audio/en/spelling/or-word.mp3'),     sentence: require('../assets/audio/en/spelling/or-sentence.mp3') },
  by:     { word: require('../assets/audio/en/spelling/by-word.mp3'),     sentence: require('../assets/audio/en/spelling/by-sentence.mp3') },
  one:    { word: require('../assets/audio/en/spelling/one-word.mp3'),    sentence: require('../assets/audio/en/spelling/one-sentence.mp3') },
  had:    { word: require('../assets/audio/en/spelling/had-word.mp3'),    sentence: require('../assets/audio/en/spelling/had-sentence.mp3') },
  not:    { word: require('../assets/audio/en/spelling/not-word.mp3'),    sentence: require('../assets/audio/en/spelling/not-sentence.mp3') },
  but:    { word: require('../assets/audio/en/spelling/but-word.mp3'),    sentence: require('../assets/audio/en/spelling/but-sentence.mp3') },
  what:   { word: require('../assets/audio/en/spelling/what-word.mp3'),   sentence: require('../assets/audio/en/spelling/what-sentence.mp3') },
  all:    { word: require('../assets/audio/en/spelling/all-word.mp3'),    sentence: require('../assets/audio/en/spelling/all-sentence.mp3') },
  were:   { word: require('../assets/audio/en/spelling/were-word.mp3'),   sentence: require('../assets/audio/en/spelling/were-sentence.mp3') },
  when:   { word: require('../assets/audio/en/spelling/when-word.mp3'),   sentence: require('../assets/audio/en/spelling/when-sentence.mp3') },
  we:     { word: require('../assets/audio/en/spelling/we-word.mp3'),     sentence: require('../assets/audio/en/spelling/we-sentence.mp3') },
  there:  { word: require('../assets/audio/en/spelling/there-word.mp3'),  sentence: require('../assets/audio/en/spelling/there-sentence.mp3') },
  can:    { word: require('../assets/audio/en/spelling/can-word.mp3'),    sentence: require('../assets/audio/en/spelling/can-sentence.mp3') },
  an:     { word: require('../assets/audio/en/spelling/an-word.mp3'),     sentence: require('../assets/audio/en/spelling/an-sentence.mp3') },
  your:   { word: require('../assets/audio/en/spelling/your-word.mp3'),   sentence: require('../assets/audio/en/spelling/your-sentence.mp3') },
  which:  { word: require('../assets/audio/en/spelling/which-word.mp3'),  sentence: require('../assets/audio/en/spelling/which-sentence.mp3') },
  their:  { word: require('../assets/audio/en/spelling/their-word.mp3'),  sentence: require('../assets/audio/en/spelling/their-sentence.mp3') },
  said:   { word: require('../assets/audio/en/spelling/said-word.mp3'),   sentence: require('../assets/audio/en/spelling/said-sentence.mp3') },
  if:     { word: require('../assets/audio/en/spelling/if-word.mp3'),     sentence: require('../assets/audio/en/spelling/if-sentence.mp3') },
  do:     { word: require('../assets/audio/en/spelling/do-word.mp3'),     sentence: require('../assets/audio/en/spelling/do-sentence.mp3') },
  will:   { word: require('../assets/audio/en/spelling/will-word.mp3'),   sentence: require('../assets/audio/en/spelling/will-sentence.mp3') },
  each:   { word: require('../assets/audio/en/spelling/each-word.mp3'),   sentence: require('../assets/audio/en/spelling/each-sentence.mp3') },
  about:  { word: require('../assets/audio/en/spelling/about-word.mp3'),  sentence: require('../assets/audio/en/spelling/about-sentence.mp3') },
  how:    { word: require('../assets/audio/en/spelling/how-word.mp3'),    sentence: require('../assets/audio/en/spelling/how-sentence.mp3') },
  up:     { word: require('../assets/audio/en/spelling/up-word.mp3'),     sentence: require('../assets/audio/en/spelling/up-sentence.mp3') },
  out:    { word: require('../assets/audio/en/spelling/out-word.mp3'),    sentence: require('../assets/audio/en/spelling/out-sentence.mp3') },
  them:   { word: require('../assets/audio/en/spelling/them-word.mp3'),   sentence: require('../assets/audio/en/spelling/them-sentence.mp3') },
  then:   { word: require('../assets/audio/en/spelling/then-word.mp3'),   sentence: require('../assets/audio/en/spelling/then-sentence.mp3') },
  she:    { word: require('../assets/audio/en/spelling/she-word.mp3'),    sentence: require('../assets/audio/en/spelling/she-sentence.mp3') },
  many:   { word: require('../assets/audio/en/spelling/many-word.mp3'),   sentence: require('../assets/audio/en/spelling/many-sentence.mp3') },
  some:   { word: require('../assets/audio/en/spelling/some-word.mp3'),   sentence: require('../assets/audio/en/spelling/some-sentence.mp3') },
  so:     { word: require('../assets/audio/en/spelling/so-word.mp3'),     sentence: require('../assets/audio/en/spelling/so-sentence.mp3') },
  these:  { word: require('../assets/audio/en/spelling/these-word.mp3'),  sentence: require('../assets/audio/en/spelling/these-sentence.mp3') },
  would:  { word: require('../assets/audio/en/spelling/would-word.mp3'),  sentence: require('../assets/audio/en/spelling/would-sentence.mp3') },
  other:  { word: require('../assets/audio/en/spelling/other-word.mp3'),  sentence: require('../assets/audio/en/spelling/other-sentence.mp3') },
  into:   { word: require('../assets/audio/en/spelling/into-word.mp3'),   sentence: require('../assets/audio/en/spelling/into-sentence.mp3') },
  has:    { word: require('../assets/audio/en/spelling/has-word.mp3'),    sentence: require('../assets/audio/en/spelling/has-sentence.mp3') },
  more:   { word: require('../assets/audio/en/spelling/more-word.mp3'),   sentence: require('../assets/audio/en/spelling/more-sentence.mp3') },
  her:    { word: require('../assets/audio/en/spelling/her-word.mp3'),    sentence: require('../assets/audio/en/spelling/her-sentence.mp3') },
  two:    { word: require('../assets/audio/en/spelling/two-word.mp3'),    sentence: require('../assets/audio/en/spelling/two-sentence.mp3') },
  like:   { word: require('../assets/audio/en/spelling/like-word.mp3'),   sentence: require('../assets/audio/en/spelling/like-sentence.mp3') },
  him:    { word: require('../assets/audio/en/spelling/him-word.mp3'),    sentence: require('../assets/audio/en/spelling/him-sentence.mp3') },
  see:    { word: require('../assets/audio/en/spelling/see-word.mp3'),    sentence: require('../assets/audio/en/spelling/see-sentence.mp3') },
  time:   { word: require('../assets/audio/en/spelling/time-word.mp3'),   sentence: require('../assets/audio/en/spelling/time-sentence.mp3') },
  could:  { word: require('../assets/audio/en/spelling/could-word.mp3'),  sentence: require('../assets/audio/en/spelling/could-sentence.mp3') },
  no:     { word: require('../assets/audio/en/spelling/no-word.mp3'),     sentence: require('../assets/audio/en/spelling/no-sentence.mp3') },
  make:   { word: require('../assets/audio/en/spelling/make-word.mp3'),   sentence: require('../assets/audio/en/spelling/make-sentence.mp3') },
  than:   { word: require('../assets/audio/en/spelling/than-word.mp3'),   sentence: require('../assets/audio/en/spelling/than-sentence.mp3') },
  first:  { word: require('../assets/audio/en/spelling/first-word.mp3'),  sentence: require('../assets/audio/en/spelling/first-sentence.mp3') },
  been:   { word: require('../assets/audio/en/spelling/been-word.mp3'),   sentence: require('../assets/audio/en/spelling/been-sentence.mp3') },
  its:    { word: require('../assets/audio/en/spelling/its-word.mp3'),    sentence: require('../assets/audio/en/spelling/its-sentence.mp3') },
  who:    { word: require('../assets/audio/en/spelling/who-word.mp3'),    sentence: require('../assets/audio/en/spelling/who-sentence.mp3') },
  now:    { word: require('../assets/audio/en/spelling/now-word.mp3'),    sentence: require('../assets/audio/en/spelling/now-sentence.mp3') },
  people: { word: require('../assets/audio/en/spelling/people-word.mp3'), sentence: require('../assets/audio/en/spelling/people-sentence.mp3') },
  my:     { word: require('../assets/audio/en/spelling/my-word.mp3'),     sentence: require('../assets/audio/en/spelling/my-sentence.mp3') },
  made:   { word: require('../assets/audio/en/spelling/made-word.mp3'),   sentence: require('../assets/audio/en/spelling/made-sentence.mp3') },
  over:   { word: require('../assets/audio/en/spelling/over-word.mp3'),   sentence: require('../assets/audio/en/spelling/over-sentence.mp3') },
  did:    { word: require('../assets/audio/en/spelling/did-word.mp3'),    sentence: require('../assets/audio/en/spelling/did-sentence.mp3') },
  down:   { word: require('../assets/audio/en/spelling/down-word.mp3'),   sentence: require('../assets/audio/en/spelling/down-sentence.mp3') },
  only:   { word: require('../assets/audio/en/spelling/only-word.mp3'),   sentence: require('../assets/audio/en/spelling/only-sentence.mp3') },
  way:    { word: require('../assets/audio/en/spelling/way-word.mp3'),    sentence: require('../assets/audio/en/spelling/way-sentence.mp3') },
  find:   { word: require('../assets/audio/en/spelling/find-word.mp3'),   sentence: require('../assets/audio/en/spelling/find-sentence.mp3') },
  use:    { word: require('../assets/audio/en/spelling/use-word.mp3'),    sentence: require('../assets/audio/en/spelling/use-sentence.mp3') },
  may:    { word: require('../assets/audio/en/spelling/may-word.mp3'),    sentence: require('../assets/audio/en/spelling/may-sentence.mp3') },
  water:  { word: require('../assets/audio/en/spelling/water-word.mp3'),  sentence: require('../assets/audio/en/spelling/water-sentence.mp3') },
  long:   { word: require('../assets/audio/en/spelling/long-word.mp3'),   sentence: require('../assets/audio/en/spelling/long-sentence.mp3') },
  little: { word: require('../assets/audio/en/spelling/little-word.mp3'), sentence: require('../assets/audio/en/spelling/little-sentence.mp3') },
  very:   { word: require('../assets/audio/en/spelling/very-word.mp3'),   sentence: require('../assets/audio/en/spelling/very-sentence.mp3') },
  after:  { word: require('../assets/audio/en/spelling/after-word.mp3'),  sentence: require('../assets/audio/en/spelling/after-sentence.mp3') },
  words:  { word: require('../assets/audio/en/spelling/words-word.mp3'),  sentence: require('../assets/audio/en/spelling/words-sentence.mp3') },
  called: { word: require('../assets/audio/en/spelling/called-word.mp3'), sentence: require('../assets/audio/en/spelling/called-sentence.mp3') },
  just:   { word: require('../assets/audio/en/spelling/just-word.mp3'),   sentence: require('../assets/audio/en/spelling/just-sentence.mp3') },
  where:  { word: require('../assets/audio/en/spelling/where-word.mp3'),  sentence: require('../assets/audio/en/spelling/where-sentence.mp3') },
  most:   { word: require('../assets/audio/en/spelling/most-word.mp3'),   sentence: require('../assets/audio/en/spelling/most-sentence.mp3') },
  know:   { word: require('../assets/audio/en/spelling/know-word.mp3'),   sentence: require('../assets/audio/en/spelling/know-sentence.mp3') },
  cat:    { word: require('../assets/audio/en/spelling/cat-word.mp3'),    sentence: require('../assets/audio/en/spelling/cat-sentence.mp3') },
  dog:    { word: require('../assets/audio/en/spelling/dog-word.mp3'),    sentence: require('../assets/audio/en/spelling/dog-sentence.mp3') },
  hat:    { word: require('../assets/audio/en/spelling/hat-word.mp3'),    sentence: require('../assets/audio/en/spelling/hat-sentence.mp3') },
  bed:    { word: require('../assets/audio/en/spelling/bed-word.mp3'),    sentence: require('../assets/audio/en/spelling/bed-sentence.mp3') },
  run:    { word: require('../assets/audio/en/spelling/run-word.mp3'),    sentence: require('../assets/audio/en/spelling/run-sentence.mp3') },
  man:    { word: require('../assets/audio/en/spelling/man-word.mp3'),    sentence: require('../assets/audio/en/spelling/man-sentence.mp3') },
  sit:    { word: require('../assets/audio/en/spelling/sit-word.mp3'),    sentence: require('../assets/audio/en/spelling/sit-sentence.mp3') },
  sun:    { word: require('../assets/audio/en/spelling/sun-word.mp3'),    sentence: require('../assets/audio/en/spelling/sun-sentence.mp3') },
  top:    { word: require('../assets/audio/en/spelling/top-word.mp3'),    sentence: require('../assets/audio/en/spelling/top-sentence.mp3') },
  red:    { word: require('../assets/audio/en/spelling/red-word.mp3'),    sentence: require('../assets/audio/en/spelling/red-sentence.mp3') },
  bat:    { word: require('../assets/audio/en/spelling/bat-word.mp3'),    sentence: require('../assets/audio/en/spelling/bat-sentence.mp3') },
  cap:    { word: require('../assets/audio/en/spelling/cap-word.mp3'),    sentence: require('../assets/audio/en/spelling/cap-sentence.mp3') },
  pen:    { word: require('../assets/audio/en/spelling/pen-word.mp3'),    sentence: require('../assets/audio/en/spelling/pen-sentence.mp3') },
};
const CORRECT_CLIPS = [
  require('../assets/audio/en/spelling/correct-1.mp3'),
  require('../assets/audio/en/spelling/correct-2.mp3'),
  require('../assets/audio/en/spelling/correct-3.mp3'),
  require('../assets/audio/en/spelling/correct-4.mp3'),
  require('../assets/audio/en/spelling/correct-5.mp3'),
  require('../assets/audio/en/spelling/correct-6.mp3'),
];
const NOT_CORRECT_AUDIO = require('../assets/audio/en/spelling/not-correct.mp3');

const ALL_WORDS = Object.keys(SPELLING_AUDIO);
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
                style={styles.blankBox}>
                <Text style={styles.blankLetter}>{filled[i] ?? ''}</Text>
                {!filled[i] && <View style={styles.underline} />}
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
          <View style={styles.lettersRow}>
            {available.map((letter, i) => (
              letter ? (
                <TouchableOpacity key={i} style={styles.letterBtn} onPress={() => onLetterTap(letter, i)}>
                  <Text style={styles.letterText}>{letter}</Text>
                </TouchableOpacity>
              ) : (
                <View key={i} style={[styles.letterBtn, styles.letterUsed]} />
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
  blanksRow:  { flexDirection: 'row', gap: 20, marginBottom: 32 },
  blankBox:   { alignItems: 'center', width: 120 },
  blankLetter:{ fontSize: 96, fontFamily: 'BubblegumSans_400Regular', color: '#3F51B5', height: 120, textAlign: 'center' },
  underline:  { width: 100, height: 8, backgroundColor: '#9E9E9E', borderRadius: 4 },
  audioRow:   { flexDirection: 'row', gap: 16, marginBottom: 32 },
  audioBtn:   { backgroundColor: '#E3F2FD', paddingHorizontal: 32, paddingVertical: 18, borderRadius: 20, borderWidth: 3, borderColor: '#90CAF9' },
  audioBtnText:{ fontSize: 28, fontFamily: 'BubblegumSans_400Regular', color: '#1565C0' },
  lettersRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'center' },
  letterBtn:  { width: 120, height: 120, backgroundColor: '#FFF9C4', borderRadius: 20, borderWidth: 4, borderColor: '#F9A825', justifyContent: 'center', alignItems: 'center' },
  letterUsed: { backgroundColor: '#EEEEEE', borderColor: '#E0E0E0' },
  letterText: { fontSize: 64, fontFamily: 'BubblegumSans_400Regular', color: '#F57F17' },
  endMessage: { fontSize: 28, fontFamily: 'BubblegumSans_400Regular', color: '#3F51B5', textAlign: 'center', marginBottom: 24 },
  celebration:{ width: 200, height: 200, marginBottom: 16 },
  doneRow:    { flexDirection: 'row', gap: 20 },
  playAgainBtn:{ backgroundColor: '#43A047', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 },
  playAgainText:{ fontSize: 22, fontFamily: 'BubblegumSans_400Regular', color: '#fff' },
  quitBtn:    { backgroundColor: '#E53935', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 },
  quitText:   { fontSize: 22, fontFamily: 'BubblegumSans_400Regular', color: '#fff' },
});
