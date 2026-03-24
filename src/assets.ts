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
];

export const EXPLOSION = require('../assets/images/explosion.png');

export const LASER = require('../assets/audio/laser.mp3');

export const TITLE_AUDIO = require('../assets/audio/chloe-learns-math.mp3');

export const MENU_AUDIO = {
  easy: require('../assets/audio/menu/easy.mp3'),
  hard: require('../assets/audio/menu/hard.mp3'),
  addition: require('../assets/audio/menu/addition.mp3'),
  minus: require('../assets/audio/menu/minus.mp3'),
};

export const AUDIO = {
  correct: [
    require('../assets/audio/correct/absolutely-right.mp3'),
    require('../assets/audio/correct/amazing.mp3'),

    require('../assets/audio/correct/looks-good-to-me.mp3'),
    require('../assets/audio/correct/nice-work.mp3'),
    require('../assets/audio/correct/that-s-correct-chloe.mp3'),
    require('../assets/audio/correct/too-easy-for-you.mp3'),
    require('../assets/audio/correct/yay-good-job.mp3'),
    require('../assets/audio/correct/yes-yes-yes-correct.mp3'),
    require('../assets/audio/correct/yes-you-got-it.mp3'),
    require('../assets/audio/correct/you-re-right-chloe.mp3'),
    require('../assets/audio/correct/you-re-a-superstar-chloe.mp3'),
    require('../assets/audio/correct/wow-clever-girl.mp3'),
    require('../assets/audio/correct/that-s-it-well-done.mp3'),
    require('../assets/audio/correct/woohoo-you-nailed-it.mp3'),
    require('../assets/audio/correct/you-make-it-look-so-easy.mp3'),
  ],
  incorrect: [
    require('../assets/audio/incorrect/almost-but-not-correct.mp3'),
    require('../assets/audio/incorrect/don-t-rush-think-about-it-again.mp3'),
    require('../assets/audio/incorrect/hmm-think-about-it-a-bit-more.mp3'),
    require('../assets/audio/incorrect/not-quite-try-again.mp3'),
    require('../assets/audio/incorrect/that-doesn-t-seem-right.mp3'),
    require('../assets/audio/incorrect/that-looks-a-little-wrong.mp3'),
    require('../assets/audio/incorrect/think-about-it-again.mp3'),
    require('../assets/audio/incorrect/oopsie-try-again.mp3'),
    require('../assets/audio/incorrect/so-close-one-more-try.mp3'),
    require('../assets/audio/incorrect/that-s-okay-give-it-another-go.mp3'),
    require('../assets/audio/incorrect/nearly-there-you-ve-got-this.mp3'),
    require('../assets/audio/incorrect/hmm-not-that-one-try-again.mp3'),
  ],
  allCorrect: [
    require('../assets/audio/all-correct/that-was-too-easy-for-chloe-you-got-everything-right-great-work.mp3'),
    require('../assets/audio/all-correct/yay-good-job-chloe-everything-was-correct.mp3'),
    require('../assets/audio/all-correct/wow-chloe-perfect-score-you-re-a-genius.mp3'),
    require('../assets/audio/all-correct/not-a-single-mistake-incredible.mp3'),
    require('../assets/audio/all-correct/every-single-one-correct-chloe-you-re-amazing.mp3'),
    require('../assets/audio/all-correct/you-got-them-all-right-super-proud-of-you.mp3'),
    require('../assets/audio/all-correct/a-perfect-round-nothing-can-stop-you.mp3'),
  ],
  completion: [
    require('../assets/audio/completion/great-work-let-s-try-get-everything-right-next-time.mp3'),
    require('../assets/audio/completion/good-try-chloe-keep-practising.mp3'),
    require('../assets/audio/completion/well-done-for-finishing-you-did-great.mp3'),
    require('../assets/audio/completion/nice-effort-let-s-see-if-you-can-do-even-better.mp3'),
    require('../assets/audio/completion/that-was-a-good-round-chloe.mp3'),
    require('../assets/audio/completion/keep-going-you-re-getting-better-every-time.mp3'),
  ],
  completionBad: [
    require('../assets/audio/completion-bad/hmm-that-wasn-t-so-good-this-time-let-s-try-again.mp3'),
    require('../assets/audio/completion-bad/you-must-be-tired-chloe-not-so-good-this-time.mp3'),
  ],
  timeout: [
    require('../assets/audio/timeout/come-on-slow-coach.mp3'),
    require('../assets/audio/timeout/you-have-to-be-faster.mp3'),
    require('../assets/audio/timeout/oh-no-time-s-up.mp3'),
    require('../assets/audio/timeout/too-slow-be-quicker-next-time.mp3'),
    require('../assets/audio/timeout/the-clock-ran-out-try-to-be-faster.mp3'),
    require('../assets/audio/timeout/hurry-up-next-time-chloe.mp3'),
    require('../assets/audio/timeout/tick-tock-you-ran-out-of-time.mp3'),
  ],
};

export function pickRandom<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error('pickRandom called with empty array');
  return arr[Math.floor(Math.random() * arr.length)];
}
