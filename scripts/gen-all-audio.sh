#!/bin/bash
set -e
AUDIO_DIR="$(cd "$(dirname "$0")/../assets/audio" && pwd)"

gen() {
  local dir="$1" name="$2" text="$3" voice="$4"
  mkdir -p "$AUDIO_DIR/$dir"
  local out="$AUDIO_DIR/$dir/$name.mp3"
  if [ -f "$out" ]; then echo "SKIP $dir/$name"; return; fi
  edge-tts --text "$text" --voice "$voice" --write-media "$out" 2>/dev/null
  echo "OK   $dir/$name"
}

ANA="en-US-AnaNeural"
XIAO="zh-CN-XiaoxiaoNeural"

# === ENGLISH (Ana) ===
# correct
gen "en/correct" "absolutely-right" "Absolutely right!" "$ANA"
gen "en/correct" "amazing" "Amazing!" "$ANA"
gen "en/correct" "looks-good-to-me" "Looks good to me!" "$ANA"
gen "en/correct" "nice-work" "Nice work!" "$ANA"
gen "en/correct" "thats-correct-chloe" "That's correct, Chloe!" "$ANA"
gen "en/correct" "too-easy-for-you" "Too easy for you!" "$ANA"
gen "en/correct" "yay-good-job" "Yay, good job!" "$ANA"
gen "en/correct" "yes-yes-yes" "Yes yes yes, correct!" "$ANA"
gen "en/correct" "yes-you-got-it" "Yes, you got it!" "$ANA"
gen "en/correct" "youre-right-chloe" "You're right, Chloe!" "$ANA"
gen "en/correct" "youre-a-superstar" "You're a superstar, Chloe!" "$ANA"
gen "en/correct" "wow-clever-girl" "Wow, clever girl!" "$ANA"
gen "en/correct" "thats-it-well-done" "That's it, well done!" "$ANA"
gen "en/correct" "woohoo-you-nailed-it" "Woohoo, you nailed it!" "$ANA"
gen "en/correct" "you-make-it-look-easy" "You make it look so easy!" "$ANA"

# incorrect
gen "en/incorrect" "almost-not-correct" "Almost, but not correct." "$ANA"
gen "en/incorrect" "dont-rush" "Don't rush, think about it again." "$ANA"
gen "en/incorrect" "hmm-think-more" "Hmm, think about it a bit more." "$ANA"
gen "en/incorrect" "not-quite" "Not quite, try again!" "$ANA"
gen "en/incorrect" "doesnt-seem-right" "That doesn't seem right." "$ANA"
gen "en/incorrect" "looks-a-little-wrong" "That looks a little wrong." "$ANA"
gen "en/incorrect" "think-again" "Think about it again." "$ANA"
gen "en/incorrect" "oopsie-try-again" "Oopsie, try again!" "$ANA"
gen "en/incorrect" "so-close" "So close! One more try." "$ANA"
gen "en/incorrect" "thats-okay" "That's okay, give it another go!" "$ANA"
gen "en/incorrect" "nearly-there" "Nearly there, you've got this!" "$ANA"
gen "en/incorrect" "not-that-one" "Hmm, not that one, try again!" "$ANA"

# all-correct
gen "en/all-correct" "too-easy-for-chloe" "That was too easy for Chloe! You got everything right, great work!" "$ANA"
gen "en/all-correct" "yay-everything-correct" "Yay, good job Chloe! Everything was correct!" "$ANA"
gen "en/all-correct" "perfect-score" "Wow Chloe, perfect score! You're a genius!" "$ANA"
gen "en/all-correct" "not-a-single-mistake" "Not a single mistake, incredible!" "$ANA"
gen "en/all-correct" "every-single-one" "Every single one correct! Chloe, you're amazing!" "$ANA"
gen "en/all-correct" "all-right-super-proud" "You got them all right! Super proud of you!" "$ANA"
gen "en/all-correct" "perfect-round" "A perfect round! Nothing can stop you!" "$ANA"

# completion
gen "en/completion" "great-work" "Great work! Let's try get everything right next time." "$ANA"
gen "en/completion" "good-try" "Good try Chloe, keep practising!" "$ANA"
gen "en/completion" "well-done-finishing" "Well done for finishing, you did great!" "$ANA"
gen "en/completion" "nice-effort" "Nice effort! Let's see if you can do even better." "$ANA"
gen "en/completion" "good-round" "That was a good round, Chloe!" "$ANA"
gen "en/completion" "getting-better" "Keep going, you're getting better every time!" "$ANA"

# completion-bad
gen "en/completion-bad" "not-so-good" "Hmm, that wasn't so good this time. Let's try again!" "$ANA"
gen "en/completion-bad" "must-be-tired" "You must be tired Chloe, not so good this time." "$ANA"

# timeout
gen "en/timeout" "slow-coach" "Come on, slow coach!" "$ANA"
gen "en/timeout" "be-faster" "You have to be faster!" "$ANA"
gen "en/timeout" "times-up" "Oh no, time's up!" "$ANA"
gen "en/timeout" "too-slow" "Too slow! Be quicker next time." "$ANA"
gen "en/timeout" "clock-ran-out" "The clock ran out! Try to be faster." "$ANA"
gen "en/timeout" "hurry-up" "Hurry up next time, Chloe!" "$ANA"
gen "en/timeout" "tick-tock" "Tick tock! You ran out of time." "$ANA"

# menu
gen "en/menu" "easy" "Easy" "$ANA"
gen "en/menu" "hard" "Hard" "$ANA"
gen "en/menu" "addition" "Addition" "$ANA"
gen "en/menu" "minus" "Minus" "$ANA"

# title
gen "en" "chloe-learns-math" "Chloe learns math!" "$ANA"

# === CHINESE (Xiaoxiao) ===
# correct
gen "zh/correct" "da-dui-le" "答对了！" "$XIAO"
gen "zh/correct" "tai-bang-le" "太棒了！" "$XIAO"
gen "zh/correct" "hen-hao" "很好！" "$XIAO"
gen "zh/correct" "zuo-de-hao" "做得好！" "$XIAO"
gen "zh/correct" "dui-le-chloe" "对了，Chloe！" "$XIAO"
gen "zh/correct" "tai-jian-dan" "太简单了吧！" "$XIAO"
gen "zh/correct" "ye-zuo-dui-le" "耶，做对了！" "$XIAO"
gen "zh/correct" "dui-dui-dui" "对对对，答对了！" "$XIAO"
gen "zh/correct" "ni-da-dui-le" "你答对了！" "$XIAO"
gen "zh/correct" "chloe-ni-dui-le" "Chloe，你对了！" "$XIAO"
gen "zh/correct" "ni-shi-xiao-ming-xing" "你是小明星，Chloe！" "$XIAO"
gen "zh/correct" "wa-hao-cong-ming" "哇，好聪明！" "$XIAO"
gen "zh/correct" "jiu-shi-zhe-yang" "就是这样，做得好！" "$XIAO"
gen "zh/correct" "tai-li-hai-le" "太厉害了！" "$XIAO"
gen "zh/correct" "kan-qi-lai-hen-jian-dan" "看起来很简单嘛！" "$XIAO"

# incorrect
gen "zh/incorrect" "cha-yi-dian" "差一点，但不对哦。" "$XIAO"
gen "zh/incorrect" "bie-ji-zai-xiang-xiang" "别急，再想想。" "$XIAO"
gen "zh/incorrect" "en-zai-xiang-xiang" "嗯，再想想看。" "$XIAO"
gen "zh/incorrect" "bu-tai-dui-zai-shi" "不太对，再试试！" "$XIAO"
gen "zh/incorrect" "hao-xiang-bu-dui" "好像不对哦。" "$XIAO"
gen "zh/incorrect" "you-dian-bu-dui" "有点不对呢。" "$XIAO"
gen "zh/incorrect" "zai-xiang-yi-xiang" "再想一想。" "$XIAO"
gen "zh/incorrect" "ai-ya-zai-shi" "哎呀，再试一次！" "$XIAO"
gen "zh/incorrect" "hen-jie-jin" "很接近了！再来一次。" "$XIAO"
gen "zh/incorrect" "mei-guan-xi" "没关系，再试试看！" "$XIAO"
gen "zh/incorrect" "kuai-yao-dui-le" "快要对了，加油！" "$XIAO"
gen "zh/incorrect" "bu-shi-zhe-ge" "嗯，不是这个，再试试！" "$XIAO"

# all-correct
gen "zh/all-correct" "tai-jian-dan-le" "对Chloe来说太简单了！全部答对，太棒了！" "$XIAO"
gen "zh/all-correct" "ye-quan-dui" "耶，好棒Chloe！全部都对了！" "$XIAO"
gen "zh/all-correct" "man-fen" "哇Chloe，满分！你是小天才！" "$XIAO"
gen "zh/all-correct" "yi-ge-dou-mei-cuo" "一个都没错，太厉害了！" "$XIAO"
gen "zh/all-correct" "quan-bu-da-dui" "全部答对！Chloe你太棒了！" "$XIAO"
gen "zh/all-correct" "dou-dui-le" "你都答对了！好骄傲！" "$XIAO"
gen "zh/all-correct" "wan-mei" "完美的一轮！你太强了！" "$XIAO"

# completion
gen "zh/completion" "zuo-de-hao-xia-ci" "做得好！下次争取全对！" "$XIAO"
gen "zh/completion" "hao-de-ji-xu" "不错哦Chloe，继续加油！" "$XIAO"
gen "zh/completion" "wan-cheng-le" "做完了，你很棒！" "$XIAO"
gen "zh/completion" "bu-cuo-geng-hao" "不错！看看能不能做得更好。" "$XIAO"
gen "zh/completion" "hao-de-yi-lun" "这轮不错，Chloe！" "$XIAO"
gen "zh/completion" "yue-lai-yue-bang" "继续加油，你越来越棒了！" "$XIAO"

# completion-bad
gen "zh/completion-bad" "zhe-ci-bu-tai-hao" "嗯，这次不太好，再试一次吧！" "$XIAO"
gen "zh/completion-bad" "lei-le-ba" "你是不是累了Chloe，这次不太好呢。" "$XIAO"

# timeout
gen "zh/timeout" "kuai-dian" "快点呀，小慢虫！" "$XIAO"
gen "zh/timeout" "yao-kuai-yi-dian" "你要快一点！" "$XIAO"
gen "zh/timeout" "shi-jian-dao-le" "哎呀，时间到了！" "$XIAO"
gen "zh/timeout" "tai-man-le" "太慢了！下次快一点。" "$XIAO"
gen "zh/timeout" "shi-jian-mei-le" "时间没了！试试更快一点。" "$XIAO"
gen "zh/timeout" "xia-ci-kuai-dian" "下次快一点哦，Chloe！" "$XIAO"
gen "zh/timeout" "di-da-di-da" "滴答滴答，时间用完了！" "$XIAO"

# menu
gen "zh/menu" "easy" "简单" "$XIAO"
gen "zh/menu" "hard" "困难" "$XIAO"
gen "zh/menu" "addition" "加法" "$XIAO"
gen "zh/menu" "minus" "减法" "$XIAO"

# title
gen "zh" "chloe-learns-math" "Chloe学数学！" "$XIAO"

echo ""
echo "All done!"
