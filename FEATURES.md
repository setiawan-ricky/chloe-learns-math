# Features

Canonical feature list for Chloe Learns Math.
Keep this in sync with the legacy Android project (`chloe-learns-math-legacy/FEATURES.md`).
Changes are always made here first, then ported to legacy.

## Home Screen

- [x] Title with heart icon before "chloe" (light pink) and unicorn icon after "learns math" (light purple)
- [x] Title plays `chloe-learns-math.mp3` on tap
- [x] Bubblegum Sans font applied throughout all screens
- [x] All text lowercase throughout the app
- [x] Blob-shaped image buttons (green=easy, red=hard, blue=history/stats)
- [x] Two bouncing character images with elastic collision physics
- [x] Tap a character to explode it (shows explosion image, fades out, respawns)
- [x] Laser sound (`laser.mp3`) plays on character tap
- [x] Explosion image: asymmetric jagged burst (not a star)
- [x] Bouncing speed: base (3.5 + rand*2.5) * 1.5 * 0.75
- [x] Game selection: Addition (Easy/Hard), Minus (Easy/Hard)
- [x] "ADDITION" / "MINUS" labels play corresponding audio on tap
- [x] Easy/Hard buttons play corresponding audio on tap
- [x] History button

## Math Game

- [x] 5-question rounds
- [x] Landscape orientation lock (Android/iOS)
- [x] Web: responsive portrait layout (keypad below question area)
- [x] Custom number keypad (0-9, backspace, OK)
- [x] Max 2-digit input
- [x] Number range: 1-10
- [x] Subtraction: num1 >= num2 (no negatives)
- [x] Timer: 30s (Easy), 20s (Hard)
- [x] Timer warning color at <=8s (Easy), <=5s (Hard)
- [x] Correct answer: green checkmark splash (1s), then advance
- [x] Wrong answer (Easy): red flash, reset input after 600ms
- [x] Wrong answer (Hard): red flash, advance after 800ms
- [x] Timeout: advance after 800ms
- [x] Audio feedback: random clip from correct/incorrect/timeout pools
- [x] Score tracking (persisted)
- [x] Mode + game type label with color coding
- [x] End screen: score summary, Play Again, Quit
- [x] Perfect score: celebration image + "all correct" audio
- [x] Score <= 1: "completion bad" audio
- [x] Other scores: "completion" audio

- [x] Game pauses timer when app is minimized, resumes on return

## Stats Screen

- [x] Per-question score tracking (+1 correct, -1 wrong/timeout)
- [x] Sortable table (by question, score, attempts) with tap-to-toggle direction
- [x] Color-coded scores (green=good, red=struggling)
- [x] Reset button requiring 7 taps to reset all data (scores, history, stats)
- [x] Explanation text showing tap progress

## History Screen

- [x] Table: Game, Mode, Score, Time, Date columns
- [x] Color-coded game type (blue=Addition, purple=Minus)
- [x] Color-coded mode (green=Easy, red=Hard)
- [x] Max 50 entries stored
- [x] Empty state: "No games played yet!"
- [x] Back navigation

## Audio Assets

- [x] correct/ (11 clips)
- [x] incorrect/ (7 clips)
- [x] all-correct/ (2 clips)
- [x] completion/ (1 clip)
- [x] completion-bad/ (2 clips)
- [x] timeout/ (2 clips)
- [x] laser.mp3
- [x] chloe-learns-math.mp3
- [x] menu/ (4 clips: easy, hard, addition, minus)

## Image Assets

- [x] characters/ (13 PNGs: car, dolphin, elephant, giraffe, heart, magic_wand, mermaid, princess, rainbow, smiley, snowflake, star, unicorn)
- [x] celebration/ (16 PNGs)
- [x] explosion.png (asymmetric jagged burst)
