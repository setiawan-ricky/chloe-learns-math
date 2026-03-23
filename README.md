# Chloe Learns Math

A React Native (Expo) app for kids learning addition and subtraction. Supports Android, iOS, and web from a single codebase.

## Features

- **Addition and Minus** games, each with Easy and Hard modes
- **Easy mode** — 30-second timer; wrong answers let you try again (only a timeout counts as wrong)
- **Hard mode** — 20-second timer; wrong answer immediately skips the question and marks it wrong
- 5-question rounds with audio feedback for correct answers, wrong answers, timeouts, and round completion
- Perfect-score rounds show a celebration image
- Persistent score and game history
- Home screen with two animated characters bouncing around and colliding

## Running the app

```bash
cd ~/Dev/chloe-learns
npm install

npx expo start          # opens Expo dev server — scan QR with Expo Go
npx expo run:android    # builds and installs native Android APK
npx expo run:ios        # builds and installs native iOS app
npx expo start --web    # opens in browser
```

---

## Adding new assets

All asset registries live in **`src/assets.ts`**. Drop your file into the right folder, then add one line to that file.

### Bouncing character images

Characters are the images that bounce around the home screen. Any PNG works — square images look best at 110×110 logical pixels.

1. Drop your PNG into `assets/images/characters/`
2. Open `src/assets.ts` and add a line to the `CHARACTERS` array:

```ts
export const CHARACTERS = [
  require('../assets/images/characters/car.png'),
  require('../assets/images/characters/dolphin.png'),
  // ← add your new file here:
  require('../assets/images/characters/butterfly.png'),
  ...
];
```

That's it — the home screen picks from this array at random.

### Celebration images

Celebrations appear as a full-screen image when the player gets a perfect 5/5 score.

1. Drop your PNG into `assets/images/celebration/`
2. Add a line to the `CELEBRATIONS` array in `src/assets.ts`:

```ts
export const CELEBRATIONS = [
  require('../assets/images/celebration/celebration_1.png'),
  // ← add your new file here:
  require('../assets/images/celebration/celebration_17.png'),
  ...
];
```

### Audio clips

Audio is organised by event. Each array can have any number of clips — one is chosen at random each time. Drop your MP3 into the matching folder and add a line to the corresponding array in `src/assets.ts`.

| Event | Folder | When it plays |
|---|---|---|
| Correct answer | `assets/audio/correct/` | Player enters the right answer |
| Wrong answer | `assets/audio/incorrect/` | Player enters a wrong answer |
| Timeout | `assets/audio/timeout/` | Timer runs out before an answer |
| Perfect round (5/5) | `assets/audio/all-correct/` | Round ends with all 5 correct |
| Good round (2–4/5) | `assets/audio/completion/` | Round ends with 2, 3, or 4 correct |
| Poor round (0–1/5) | `assets/audio/completion-bad/` | Round ends with 0 or 1 correct |

Example — adding a new "correct" sound:

```ts
export const AUDIO = {
  correct: [
    require('../assets/audio/correct/absolutely-right.mp3'),
    // ← add your new file here:
    require('../assets/audio/correct/brilliant.mp3'),
    ...
  ],
  ...
};
```

---

## Project structure

```
chloe-learns/
├── app/
│   ├── _layout.tsx       # Stack navigator root
│   ├── index.tsx         # Home screen (bouncing characters + game buttons)
│   ├── game.tsx          # Math game screen
│   └── history.tsx       # Game history screen
├── src/
│   ├── assets.ts         # Static registries for images and audio
│   └── history.ts        # AsyncStorage persistence helpers
└── assets/
    ├── audio/
    │   ├── correct/
    │   ├── incorrect/
    │   ├── timeout/
    │   ├── all-correct/
    │   ├── completion/
    │   └── completion-bad/
    └── images/
        ├── characters/   # Bouncing home-screen images
        ├── celebration/  # Perfect-score celebration images
        └── explosion.png
```
