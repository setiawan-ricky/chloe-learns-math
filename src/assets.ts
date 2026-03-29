// Static asset registries — add a line here when you drop a new file in the folder

export const CHARACTERS = [
  require('../assets/images/characters/car.png'),
  require('../assets/images/characters/dolphin.png'),
  require('../assets/images/characters/elephant.png'),
  require('../assets/images/characters/giraffe.png'),
  require('../assets/images/characters/heart.png'),
  require('../assets/images/characters/magic_wand.png'),
  require('../assets/images/characters/mermaid.png'),
  require('../assets/images/characters/princess.png'),
  require('../assets/images/characters/rainbow.png'),

  require('../assets/images/characters/snowflake.png'),
  require('../assets/images/characters/star.png'),
  require('../assets/images/characters/unicorn.png'),
  require('../assets/images/characters/penguin.png'),
  require('../assets/images/characters/panda.png'),
  require('../assets/images/characters/kitten.png'),
  require('../assets/images/characters/bunny.png'),
  require('../assets/images/characters/owl.png'),
];

export const CELEBRATIONS = [
  require('../assets/images/celebration/celebration_1.png'),
  require('../assets/images/celebration/celebration_2.png'),
  require('../assets/images/celebration/celebration_3.png'),
  require('../assets/images/celebration/celebration_4.png'),
  require('../assets/images/celebration/celebration_5.png'),
  require('../assets/images/celebration/celebration_6.png'),
  require('../assets/images/celebration/celebration_7.png'),
  require('../assets/images/celebration/celebration_8.png'),
  require('../assets/images/celebration/celebration_9.png'),
  require('../assets/images/celebration/celebration_10.png'),
  require('../assets/images/celebration/celebration_11.png'),
  require('../assets/images/celebration/celebration_12.png'),
  require('../assets/images/celebration/celebration_13.png'),
  require('../assets/images/celebration/celebration_14.png'),
  require('../assets/images/celebration/celebration_15.png'),
  require('../assets/images/celebration/celebration_16.png'),
  require('../assets/images/celebration/celebration_17.png'),
  require('../assets/images/celebration/celebration_18.png'),
  require('../assets/images/celebration/celebration_19.png'),
  require('../assets/images/celebration/celebration_20.png'),
  require('../assets/images/celebration/celebration_21.png'),
  require('../assets/images/celebration/celebration_22.png'),
  require('../assets/images/celebration/celebration_23.png'),
  require('../assets/images/celebration/celebration_24.png'),
];

export const EXPLOSION = require('../assets/images/explosion.png');

export const LASER = require('../assets/audio/laser.mp3');

import type { Lang } from './i18n';

const AUDIO_EN = {
  title: require('../assets/audio/en/chloe-learns-math.mp3'),
  titleEnglish: require('../assets/audio/en/chloe-learns-english.mp3'),
  menu: {
    easy: require('../assets/audio/en/menu/easy.mp3'),
    hard: require('../assets/audio/en/menu/hard.mp3'),
    addition: require('../assets/audio/en/menu/addition.mp3'),
    minus: require('../assets/audio/en/menu/minus.mp3'),
    gamesToday: require('../assets/audio/en/menu/games-today.mp3'),
    spelling: require('../assets/audio/en/menu/spelling.mp3'),
    lscwc: require('../assets/audio/en/menu/lscwc.mp3'),
  },
  correct: [
    require('../assets/audio/en/correct/absolutely-right.mp3'),
    require('../assets/audio/en/correct/amazing.mp3'),
    require('../assets/audio/en/correct/looks-good-to-me.mp3'),
    require('../assets/audio/en/correct/nice-work.mp3'),
    require('../assets/audio/en/correct/thats-correct-chloe.mp3'),
    require('../assets/audio/en/correct/too-easy-for-you.mp3'),
    require('../assets/audio/en/correct/yay-good-job.mp3'),
    require('../assets/audio/en/correct/yes-yes-yes.mp3'),
    require('../assets/audio/en/correct/yes-you-got-it.mp3'),
    require('../assets/audio/en/correct/youre-right-chloe.mp3'),
    require('../assets/audio/en/correct/youre-a-superstar.mp3'),
    require('../assets/audio/en/correct/wow-clever-girl.mp3'),
    require('../assets/audio/en/correct/thats-it-well-done.mp3'),
    require('../assets/audio/en/correct/woohoo-you-nailed-it.mp3'),
    require('../assets/audio/en/correct/you-make-it-look-easy.mp3'),
  ],
  incorrect: [
    require('../assets/audio/en/incorrect/almost-not-correct.mp3'),
    require('../assets/audio/en/incorrect/dont-rush.mp3'),
    require('../assets/audio/en/incorrect/hmm-think-more.mp3'),
    require('../assets/audio/en/incorrect/not-quite.mp3'),
    require('../assets/audio/en/incorrect/doesnt-seem-right.mp3'),
    require('../assets/audio/en/incorrect/looks-a-little-wrong.mp3'),
    require('../assets/audio/en/incorrect/think-again.mp3'),
    require('../assets/audio/en/incorrect/oopsie-try-again.mp3'),
    require('../assets/audio/en/incorrect/so-close.mp3'),
    require('../assets/audio/en/incorrect/thats-okay.mp3'),
    require('../assets/audio/en/incorrect/nearly-there.mp3'),
    require('../assets/audio/en/incorrect/not-that-one.mp3'),
  ],
  incorrectHard: [
    require('../assets/audio/en/incorrect/almost-not-correct.mp3'),
    require('../assets/audio/en/incorrect/not-quite.mp3'),
    require('../assets/audio/en/incorrect/doesnt-seem-right.mp3'),
    require('../assets/audio/en/incorrect/looks-a-little-wrong.mp3'),
    require('../assets/audio/en/incorrect/so-close.mp3'),
    require('../assets/audio/en/incorrect/not-that-one.mp3'),
    require('../assets/audio/en/incorrect/oh-no.mp3'),
    require('../assets/audio/en/incorrect/oopsie.mp3'),
    require('../assets/audio/en/incorrect/not-this-time.mp3'),
    require('../assets/audio/en/incorrect/uh-oh.mp3'),
  ],
  allCorrect: [
    require('../assets/audio/en/all-correct/too-easy-for-chloe.mp3'),
    require('../assets/audio/en/all-correct/yay-everything-correct.mp3'),
    require('../assets/audio/en/all-correct/perfect-score.mp3'),
    require('../assets/audio/en/all-correct/not-a-single-mistake.mp3'),
    require('../assets/audio/en/all-correct/every-single-one.mp3'),
    require('../assets/audio/en/all-correct/all-right-super-proud.mp3'),
    require('../assets/audio/en/all-correct/perfect-round.mp3'),
  ],
  completion: [
    require('../assets/audio/en/completion/great-work.mp3'),
    require('../assets/audio/en/completion/good-try.mp3'),
    require('../assets/audio/en/completion/well-done-finishing.mp3'),
    require('../assets/audio/en/completion/nice-effort.mp3'),
    require('../assets/audio/en/completion/good-round.mp3'),
    require('../assets/audio/en/completion/getting-better.mp3'),
  ],
  completionBad: [
    require('../assets/audio/en/completion-bad/not-so-good.mp3'),
    require('../assets/audio/en/completion-bad/must-be-tired.mp3'),
  ],
  timeout: [
    require('../assets/audio/en/timeout/slow-coach.mp3'),
    require('../assets/audio/en/timeout/be-faster.mp3'),
    require('../assets/audio/en/timeout/times-up.mp3'),
    require('../assets/audio/en/timeout/too-slow.mp3'),
    require('../assets/audio/en/timeout/clock-ran-out.mp3'),
    require('../assets/audio/en/timeout/hurry-up.mp3'),
    require('../assets/audio/en/timeout/tick-tock.mp3'),
  ],
};

const AUDIO_ZH = {
  title: require('../assets/audio/zh/chloe-learns-math.mp3'),
  titleEnglish: require('../assets/audio/zh/chloe-learns-english.mp3'),
  menu: {
    easy: require('../assets/audio/zh/menu/easy.mp3'),
    hard: require('../assets/audio/zh/menu/hard.mp3'),
    addition: require('../assets/audio/zh/menu/addition.mp3'),
    minus: require('../assets/audio/zh/menu/minus.mp3'),
    gamesToday: require('../assets/audio/zh/menu/games-today.mp3'),
    spelling: require('../assets/audio/zh/menu/spelling.mp3'),
    lscwc: require('../assets/audio/zh/menu/lscwc.mp3'),
  },
  correct: [
    require('../assets/audio/zh/correct/da-dui-le.mp3'),
    require('../assets/audio/zh/correct/tai-bang-le.mp3'),
    require('../assets/audio/zh/correct/hen-hao.mp3'),
    require('../assets/audio/zh/correct/zuo-de-hao.mp3'),
    require('../assets/audio/zh/correct/dui-le-chloe.mp3'),
    require('../assets/audio/zh/correct/tai-jian-dan.mp3'),
    require('../assets/audio/zh/correct/ye-zuo-dui-le.mp3'),
    require('../assets/audio/zh/correct/dui-dui-dui.mp3'),
    require('../assets/audio/zh/correct/ni-da-dui-le.mp3'),
    require('../assets/audio/zh/correct/chloe-ni-dui-le.mp3'),
    require('../assets/audio/zh/correct/ni-shi-xiao-ming-xing.mp3'),
    require('../assets/audio/zh/correct/wa-hao-cong-ming.mp3'),
    require('../assets/audio/zh/correct/jiu-shi-zhe-yang.mp3'),
    require('../assets/audio/zh/correct/tai-li-hai-le.mp3'),
    require('../assets/audio/zh/correct/kan-qi-lai-hen-jian-dan.mp3'),
  ],
  incorrect: [
    require('../assets/audio/zh/incorrect/cha-yi-dian.mp3'),
    require('../assets/audio/zh/incorrect/bie-ji-zai-xiang-xiang.mp3'),
    require('../assets/audio/zh/incorrect/en-zai-xiang-xiang.mp3'),
    require('../assets/audio/zh/incorrect/bu-tai-dui-zai-shi.mp3'),
    require('../assets/audio/zh/incorrect/hao-xiang-bu-dui.mp3'),
    require('../assets/audio/zh/incorrect/you-dian-bu-dui.mp3'),
    require('../assets/audio/zh/incorrect/zai-xiang-yi-xiang.mp3'),
    require('../assets/audio/zh/incorrect/ai-ya-zai-shi.mp3'),
    require('../assets/audio/zh/incorrect/hen-jie-jin.mp3'),
    require('../assets/audio/zh/incorrect/mei-guan-xi.mp3'),
    require('../assets/audio/zh/incorrect/kuai-yao-dui-le.mp3'),
    require('../assets/audio/zh/incorrect/bu-shi-zhe-ge.mp3'),
  ],
  incorrectHard: [
    require('../assets/audio/zh/incorrect/cha-yi-dian.mp3'),
    require('../assets/audio/zh/incorrect/hao-xiang-bu-dui.mp3'),
    require('../assets/audio/zh/incorrect/you-dian-bu-dui.mp3'),
    require('../assets/audio/zh/incorrect/hen-jie-jin.mp3'),
    require('../assets/audio/zh/incorrect/bu-shi-zhe-ge.mp3'),
    require('../assets/audio/zh/incorrect/ai-ya.mp3'),
    require('../assets/audio/zh/incorrect/bu-dui-o.mp3'),
    require('../assets/audio/zh/incorrect/zhe-ci-bu-dui.mp3'),
    require('../assets/audio/zh/incorrect/zao-gao.mp3'),
  ],
  allCorrect: [
    require('../assets/audio/zh/all-correct/tai-jian-dan-le.mp3'),
    require('../assets/audio/zh/all-correct/ye-quan-dui.mp3'),
    require('../assets/audio/zh/all-correct/man-fen.mp3'),
    require('../assets/audio/zh/all-correct/yi-ge-dou-mei-cuo.mp3'),
    require('../assets/audio/zh/all-correct/quan-bu-da-dui.mp3'),
    require('../assets/audio/zh/all-correct/dou-dui-le.mp3'),
    require('../assets/audio/zh/all-correct/wan-mei.mp3'),
  ],
  completion: [
    require('../assets/audio/zh/completion/zuo-de-hao-xia-ci.mp3'),
    require('../assets/audio/zh/completion/hao-de-ji-xu.mp3'),
    require('../assets/audio/zh/completion/wan-cheng-le.mp3'),
    require('../assets/audio/zh/completion/bu-cuo-geng-hao.mp3'),
    require('../assets/audio/zh/completion/hao-de-yi-lun.mp3'),
    require('../assets/audio/zh/completion/yue-lai-yue-bang.mp3'),
  ],
  completionBad: [
    require('../assets/audio/zh/completion-bad/zhe-ci-bu-tai-hao.mp3'),
    require('../assets/audio/zh/completion-bad/lei-le-ba.mp3'),
  ],
  timeout: [
    require('../assets/audio/zh/timeout/kuai-dian.mp3'),
    require('../assets/audio/zh/timeout/yao-kuai-yi-dian.mp3'),
    require('../assets/audio/zh/timeout/shi-jian-dao-le.mp3'),
    require('../assets/audio/zh/timeout/tai-man-le.mp3'),
    require('../assets/audio/zh/timeout/shi-jian-mei-le.mp3'),
    require('../assets/audio/zh/timeout/xia-ci-kuai-dian.mp3'),
    require('../assets/audio/zh/timeout/di-da-di-da.mp3'),
  ],
};

type AudioSet = typeof AUDIO_EN;
const AUDIO_SETS: Record<Lang, AudioSet> = { en: AUDIO_EN, zh: AUDIO_ZH };

export function getAudio(lang: Lang): AudioSet { return AUDIO_SETS[lang]; }
export type { AudioSet };

export function pickRandom<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error('pickRandom called with empty array');
  return arr[Math.floor(Math.random() * arr.length)];
}
