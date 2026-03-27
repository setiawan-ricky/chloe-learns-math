import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext } from 'react';

export type Lang = 'en' | 'zh';
export type AppMode = 'math' | 'english';

const LANG_KEY = 'app_language';
const MODE_KEY = 'app_mode';

export async function loadLang(): Promise<Lang> {
  try {
    const v = await AsyncStorage.getItem(LANG_KEY);
    return v === 'zh' ? 'zh' : 'en';
  } catch { return 'en'; }
}

export async function saveLang(lang: Lang): Promise<void> {
  await AsyncStorage.setItem(LANG_KEY, lang);
}

export async function loadMode(): Promise<AppMode> {
  try {
    const v = await AsyncStorage.getItem(MODE_KEY);
    return v === 'english' ? 'english' : 'math';
  } catch { return 'math'; }
}

export async function saveMode(mode: AppMode): Promise<void> {
  await AsyncStorage.setItem(MODE_KEY, mode);
}

interface LangContextValue {
  lang: Lang; setLang: (l: Lang) => void;
  mode: AppMode; setMode: (m: AppMode) => void;
}
export const LangContext = createContext<LangContextValue>({ lang: 'en', setLang: () => {}, mode: 'math', setMode: () => {} });
export const useLang = () => useContext(LangContext);

const T = {
  en: {
    title: 'chloe learns math',
    titleChloe: 'chloe ',
    titleRest: 'learns math',
    addition: 'addition',
    minus: 'minus',
    easy: 'easy',
    hard: 'hard',
    history: 'history',
    stats: 'stats',
    score: 'score',
    playAgain: 'play again',
    quit: 'quit',
    ok: 'ok',
    noGamesYet: 'no games played yet!',
    noQuestionsYet: 'no questions answered yet!',
    noMistakes: 'no mistakes recorded',
    question: 'question',
    accuracy: 'accuracy',
    tries: 'tries',
    game: 'game',
    mode: 'mode',
    time: 'time',
    date: 'date',
    reset: 'reset',
    resetHint: (taps: number, count: number) =>
      `tap ${taps} times to reset all scores and history${count > 0 ? ` (${count}/${taps})` : ''}`,
    resetConfirm: 'reset all scores and history?',
    resetTitle: 'reset all data',
    cancel: 'cancel',
    amazing: 'amazing!\nperfect score! 🎉',
    keepPractising: (c: number, t: number) => `keep practising!\n${c} out of ${t} correct`,
    goodJob: (c: number, t: number) => `good job!\n${c} out of ${t} correct`,
    answered: (a: number) => `answered ${a}`,
    timeout: 'timeout',
    gamesToday: 'times played today',
    titleEnglish: 'chloe learns english',
    titleRestEnglish: 'learns english',
    spelling: 'spelling',
    hearWord: 'word',
    hearSentence: 'sentence',
    spelledCorrectly: 'well done!',
    wrongLetter: 'try again!',
    switchToEnglish: 'chloe learns english',
    switchToMath: 'chloe learns math',
  },
  zh: {
    title: '紫怡学数学',
    titleChloe: '紫怡',
    titleRest: '学数学',
    addition: '加法',
    minus: '减法',
    easy: '简单',
    hard: '困难',
    history: '历史',
    stats: '统计',
    score: '分数',
    playAgain: '再来一次',
    quit: '退出',
    ok: '确定',
    noGamesYet: '还没有玩过游戏！',
    noQuestionsYet: '还没有回答过问题！',
    noMistakes: '没有错误记录',
    question: '题目',
    accuracy: '准确率',
    tries: '次数',
    game: '游戏',
    mode: '难度',
    time: '时间',
    date: '日期',
    reset: '重置',
    resetHint: (taps: number, count: number) =>
      `点击${taps}次重置所有分数和历史${count > 0 ? ` (${count}/${taps})` : ''}`,
    resetConfirm: '重置所有分数和历史？',
    resetTitle: '重置所有数据',
    cancel: '取消',
    amazing: '太厉害了！\n满分！🎉',
    keepPractising: (c: number, t: number) => `继续加油！\n${t}题对了${c}题`,
    goodJob: (c: number, t: number) => `做得好紫怡！\n${t}题对了${c}题`,
    answered: (a: number) => `回答了 ${a}`,
    timeout: '超时',
    gamesToday: '今天玩的次数',
    titleEnglish: '紫怡学英语',
    titleRestEnglish: '学英语',
    spelling: '拼写',
    hearWord: '单词',
    hearSentence: '句子',
    spelledCorrectly: '太棒了！',
    wrongLetter: '再试试！',
    switchToEnglish: '紫怡学英语',
    switchToMath: '紫怡学数学',
  },
};

export type Strings = typeof T.en;
export function t(lang: Lang): Strings { return T[lang]; }
