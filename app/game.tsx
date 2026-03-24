import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AUDIO, CELEBRATIONS, pickRandom } from '../src/assets';
import { getScore, incrementScore, saveHistoryEntry } from '../src/history';
import { GAME } from '../src/config';
import { playRandomSound, unloadAll } from '../src/sound';

type GameType = 'Addition' | 'Minus';
type ModeType = 'EASY' | 'HARD';

const { ROUND_SIZE, TIMER_EASY, TIMER_HARD, TIMER_WARN_EASY, TIMER_WARN_HARD,
        MAX_DIGITS, NUMBER_RANGE, CORRECT_SPLASH_MS, WRONG_ADVANCE_MS, WRONG_RESET_MS } = GAME;

function randomQuestion(game: GameType): { num1: number; num2: number } {
  const { min, max } = NUMBER_RANGE;
  if (game === 'Minus') {
    const num1 = Math.floor(Math.random() * max) + min;
    const num2 = Math.floor(Math.random() * (num1 + 1));
    return { num1, num2 };
  }
  return {
    num1: Math.floor(Math.random() * max) + min,
    num2: Math.floor(Math.random() * max) + min,
  };
}

export default function GameScreen() {
  const router = useRouter();
  const { game: gameParam, mode: modeParam } = useLocalSearchParams<{ game: string; mode: string }>();
  const game  = (gameParam  ?? 'Addition') as GameType;
  const mode  = (modeParam  ?? 'EASY')     as ModeType;
  const timerSecs = mode === 'EASY' ? TIMER_EASY : TIMER_HARD;
  const warnAt = mode === 'EASY' ? TIMER_WARN_EASY : TIMER_WARN_HARD;

  const [score,         setScore]         = useState(0);
  const [input,         setInput]         = useState('');
  const [answerColor,   setAnswerColor]   = useState('#212121');
  const [question,      setQuestion]      = useState(() => randomQuestion(game));
  const [questionIdx,   setQuestionIdx]   = useState(0);
  const [timeLeft,      setTimeLeft]      = useState<number>(timerSecs);
  const [timerColor,    setTimerColor]    = useState('#757575');
  const [phase,         setPhase]         = useState<'playing' | 'correct-splash' | 'end'>('playing');
  const [roundCorrect,  setRoundCorrect]  = useState(0);
  const [endMessage,    setEndMessage]    = useState('');
  const [celebration,   setCelebration]   = useState<ImageSourcePropType | null>(null);

  const inputRef        = useRef('');
  const questionRef     = useRef(question);
  const questionIdxRef  = useRef(0);
  const roundCorrectRef = useRef(0);
  const phaseRef        = useRef<'playing' | 'correct-splash' | 'end'>('playing');
  const roundStartRef   = useRef(Date.now());
  const scoreRef        = useRef(0);
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef     = useRef<number>(timerSecs);
  const timeoutsRef     = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const mountedRef      = useRef(true);

  useEffect(() => { questionRef.current = question; }, [question]);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => { ScreenOrientation.unlockAsync(); };
  }, []);

  useEffect(() => {
    getScore().then(s => { scoreRef.current = s; setScore(s); });
  }, []);

  const trackedTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id);
      if (mountedRef.current) fn();
    }, ms);
    timeoutsRef.current.add(id);
    return id;
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const endRound = useCallback(() => {
    stopTimer();
    phaseRef.current = 'end';
    setPhase('end');
    const correct = roundCorrectRef.current;
    const elapsed = Math.round((Date.now() - roundStartRef.current) / 1000);
    saveHistoryEntry({ game, mode, correct, total: ROUND_SIZE, secs: elapsed });
    if (correct === ROUND_SIZE) {
      playRandomSound(AUDIO.allCorrect);
      setCelebration(pickRandom(CELEBRATIONS));
      setEndMessage(`Amazing!\nPerfect score! 🎉`);
    } else if (correct <= 1) {
      playRandomSound(AUDIO.completionBad);
      setCelebration(null);
      setEndMessage(`Keep practising!\n${correct} out of ${ROUND_SIZE} correct`);
    } else {
      playRandomSound(AUDIO.completion);
      setCelebration(null);
      setEndMessage(`Good job!\n${correct} out of ${ROUND_SIZE} correct`);
    }
  }, [game, mode, stopTimer]);

  const nextQuestionOrEnd = useCallback(() => {
    const nextIdx = questionIdxRef.current + 1;
    if (nextIdx >= ROUND_SIZE) {
      endRound();
      return;
    }
    questionIdxRef.current = nextIdx;
    setQuestionIdx(nextIdx);
    inputRef.current = '';
    setInput('');
    setAnswerColor('#212121');
    const q = randomQuestion(game);
    questionRef.current = q;
    setQuestion(q);
  }, [game, endRound]);

  const startTimer = useCallback(() => {
    stopTimer();
    timeLeftRef.current = timerSecs;
    setTimeLeft(timerSecs);
    setTimerColor('#757575');

    timerRef.current = setInterval(() => {
      const next = timeLeftRef.current - 1;
      timeLeftRef.current = next;
      setTimeLeft(next);
      setTimerColor(next <= warnAt ? '#F44336' : '#757575');
      if (next <= 0) {
        stopTimer();
        playRandomSound(AUDIO.timeout);
        setAnswerColor('#F44336');
        trackedTimeout(() => nextQuestionOrEnd(), WRONG_ADVANCE_MS);
      }
    }, 1000);
  }, [timerSecs, warnAt, stopTimer, trackedTimeout, nextQuestionOrEnd]);

  const startRound = useCallback(() => {
    stopTimer();
    roundCorrectRef.current = 0;
    questionIdxRef.current  = 0;
    inputRef.current        = '';
    roundStartRef.current   = Date.now();
    setRoundCorrect(0);
    setQuestionIdx(0);
    setInput('');
    setAnswerColor('#212121');
    const q = randomQuestion(game);
    questionRef.current = q;
    setQuestion(q);
    phaseRef.current = 'playing';
    setPhase('playing');
    setCelebration(null);
    startTimer();
  }, [game, startTimer, stopTimer]);

  useEffect(() => {
    startRound();
    return () => {
      mountedRef.current = false;
      stopTimer();
      for (const id of timeoutsRef.current) clearTimeout(id);
      timeoutsRef.current.clear();
      unloadAll();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEnter = useCallback(() => {
    if (phaseRef.current !== 'playing' || !inputRef.current) return;
    const answer  = parseInt(inputRef.current, 10);
    const { num1, num2 } = questionRef.current;
    const correct = game === 'Minus' ? num1 - num2 : num1 + num2;

    if (answer === correct) {
      stopTimer();
      incrementScore().then(s => { scoreRef.current = s; setScore(s); });
      roundCorrectRef.current += 1;
      setRoundCorrect(c => c + 1);
      playRandomSound(AUDIO.correct);
      phaseRef.current = 'correct-splash';
      setPhase('correct-splash');
      trackedTimeout(() => {
        phaseRef.current = 'playing';
        setPhase('playing');
        nextQuestionOrEnd();
        if (phaseRef.current === 'playing') startTimer();
      }, CORRECT_SPLASH_MS);
    } else {
      playRandomSound(AUDIO.incorrect);
      setAnswerColor('#F44336');
      if (mode === 'HARD') {
        trackedTimeout(() => {
          nextQuestionOrEnd();
          if (phaseRef.current === 'playing') startTimer();
        }, WRONG_ADVANCE_MS);
      } else {
        trackedTimeout(() => {
          inputRef.current = '';
          setInput('');
          setAnswerColor('#212121');
        }, WRONG_RESET_MS);
      }
    }
  }, [game, mode, nextQuestionOrEnd, stopTimer, startTimer, trackedTimeout]);

  const onDigit = useCallback((d: string) => {
    if (phaseRef.current !== 'playing' || inputRef.current.length >= MAX_DIGITS) return;
    inputRef.current += d;
    setInput(inputRef.current);
    setAnswerColor('#212121');
  }, []);

  const onBackspace = useCallback(() => {
    if (phaseRef.current !== 'playing' || !inputRef.current) return;
    inputRef.current = inputRef.current.slice(0, -1);
    setInput(inputRef.current);
    setAnswerColor('#212121');
  }, []);

  const { width, height } = useWindowDimensions();
  const isPortrait = Platform.OS === 'web' && height > width;

  const operator = game === 'Minus' ? '−' : '+';
  const modeColor = mode === 'EASY' ? '#43A047' : '#E53935';

  return (
    <View style={[styles.root, isPortrait && styles.rootPortrait]}>
      <View style={[styles.left, isPortrait && styles.leftPortrait]}>
        <View style={styles.topRow}>
          <Text style={[styles.score, isPortrait && styles.scorePortrait]}>Score: {score}</Text>
          <Text style={[styles.modeLabel, { color: modeColor }, isPortrait && styles.modeLabelPortrait]}>{game} • {mode}</Text>
          <Text style={[styles.progress, isPortrait && styles.progressPortrait]}>{questionIdx + 1} / {ROUND_SIZE}</Text>
          <Text style={[styles.timer, { color: timerColor }, isPortrait && styles.timerPortrait]}>{timeLeft}</Text>
        </View>
        <View style={styles.equation}>
          <Text style={[styles.num, isPortrait && styles.numPortrait]}>{question.num1}</Text>
          <Text style={[styles.op, isPortrait && styles.opPortrait]}>{operator}</Text>
          <Text style={[styles.num, isPortrait && styles.numPortrait]}>{question.num2}</Text>
          <Text style={[styles.equals, isPortrait && styles.opPortrait]}>=</Text>
          <Text style={[styles.answer, { color: answerColor }, isPortrait && styles.answerPortrait]}>{input || '?'}</Text>
        </View>
      </View>

      <View style={[styles.keypad, isPortrait && styles.keypadPortrait]}>
        {[['7','8','9'],['4','5','6'],['1','2','3']].map(row => (
          <View key={row[0]} style={styles.krow}>
            {row.map(d => (
              <TouchableOpacity key={d} style={[styles.kbtn, isPortrait && styles.kbtnPortrait]} onPress={() => onDigit(d)}>
                <Text style={styles.knum}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.krow}>
          <TouchableOpacity style={[styles.kbtn, styles.kbtnSide, isPortrait && styles.kbtnPortrait]} onPress={() => onDigit('0')}>
            <Text style={styles.knum}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.kbtn, styles.kbtnSide, isPortrait && styles.kbtnPortrait]} onPress={onBackspace}>
            <Text style={styles.knum}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.kbtn, styles.kenter, isPortrait && styles.kbtnPortrait]} onPress={onEnter}>
            <Text style={[styles.knum, styles.kenterText]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>

      {phase === 'correct-splash' && (
        <View style={styles.splash}>
          <Text style={styles.tick}>✓</Text>
        </View>
      )}

      {phase === 'end' && (
        <View style={styles.endScreen}>
          {celebration && <Image source={celebration} style={styles.celebImg} resizeMode="contain" />}
          <Text style={styles.endMsg}>{endMessage}</Text>
          <TouchableOpacity style={styles.playAgainBtn} onPress={startRound}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quitBtn} onPress={() => router.back()}>
            <Text style={styles.quitText}>Quit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1, flexDirection: 'row', backgroundColor: '#FAFAFA' },
  rootPortrait: { flexDirection: 'column' },
  left:         { flex: 1, padding: 20 },
  leftPortrait: { flex: 1, padding: 16, justifyContent: 'center' },
  topRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  score:        { fontSize: 22, fontWeight: 'bold', color: '#3F51B5' },
  scorePortrait:{ fontSize: 18 },
  modeLabel:    { fontSize: 18, fontWeight: 'bold' },
  modeLabelPortrait: { fontSize: 14 },
  progress:     { fontSize: 22, color: '#757575' },
  progressPortrait: { fontSize: 18 },
  timer:        { fontSize: 38, fontWeight: 'bold', minWidth: 56, textAlign: 'right' },
  timerPortrait:{ fontSize: 28, minWidth: 44 },
  equation:     { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  num:          { fontSize: 80, fontWeight: 'bold', color: '#212121' },
  numPortrait:  { fontSize: 48 },
  op:           { fontSize: 72, color: '#757575' },
  opPortrait:   { fontSize: 40 },
  equals:       { fontSize: 72, color: '#757575' },
  answer:       { fontSize: 80, fontWeight: 'bold', minWidth: 100, textAlign: 'center',
                  borderBottomWidth: 3, borderBottomColor: '#BDBDBD' },
  answerPortrait: { fontSize: 48, minWidth: 60 },
  keypad:       { width: 280, padding: 12, justifyContent: 'center', gap: 8 },
  keypadPortrait: { width: '100%', flex: 0, padding: 8, gap: 6 },
  krow:         { flexDirection: 'row', gap: 8 },
  kbtn:         { flex: 1, height: 64, backgroundColor: '#E8EAF6', borderRadius: 10,
                  justifyContent: 'center', alignItems: 'center' },
  kbtnPortrait: { height: 52 },
  kbtnSide:     { backgroundColor: '#E8EAF6' },
  kenter:       { flex: 1, backgroundColor: '#3F51B5' },
  knum:         { fontSize: 28, fontWeight: 'bold', color: '#212121' },
  kenterText:   { color: '#fff' },
  splash:       { ...StyleSheet.absoluteFillObject, backgroundColor: '#43A04799',
                  justifyContent: 'center', alignItems: 'center' },
  tick:         { fontSize: 160, color: '#fff' },
  endScreen:    { ...StyleSheet.absoluteFillObject, backgroundColor: '#FAFAFA',
                  justifyContent: 'center', alignItems: 'center', gap: 16 },
  celebImg:     { width: 220, height: 220 },
  endMsg:       { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#212121' },
  playAgainBtn: { backgroundColor: '#43A047', borderRadius: 12, paddingHorizontal: 40, paddingVertical: 16 },
  playAgainText:{ color: '#fff', fontSize: 22, fontWeight: 'bold' },
  quitBtn:      { backgroundColor: '#9E9E9E', borderRadius: 12, paddingHorizontal: 40, paddingVertical: 16 },
  quitText:     { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});
