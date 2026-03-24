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

## Asset generation scripts

### TTS audio (TikTok voices)

Generate voice clips using TikTok TTS voices via the gesserit.co API (free, no auth):

```bash
npm run tts -- <event> "your text here"

# Examples:
npm run tts -- correct 'Yay, you did it'
npm run tts -- incorrect 'Oopsie, try again'
npm run tts -- timeout 'Too slow, be quicker next time'
```

Events: `correct`, `incorrect`, `timeout`, `all-correct`, `completion`, `completion-bad`, `menu`

Change voice with `export TIKTOK_VOICE=en_us_stitch`. Voice codes: https://github.com/oscie57/tiktok-voice/wiki/Voice-Codes

### Image generation (Google Vertex AI / Imagen 3)

Generate cartoon character and celebration images using Imagen 3 on Vertex AI.

**Setup** (one-time):
```bash
gcloud auth application-default login
```

**Generate images into the library:**
```bash
npm run gen:image -- "panda"
npm run gen:image -- "princess girl, pink dress, tiara"
npm run gen:image -- "fireworks and confetti"
```

Images are saved to `assets/images/library/` with transparent backgrounds (white background is auto-removed after generation). This is your image repository -- generate as many as you like.

**Use an image in the app** (symlinks from library into the active folder):
```bash
npm run use:image -- characters panda
npm run use:image -- celebration fireworks-and-confetti
```

Then add the new image to `src/assets.ts` (the script will remind you).

**Remove backgrounds manually** (for images not generated through the pipeline):
```bash
python3 scripts/remove-bg.py assets/images/library/my-image.png    # single file
python3 scripts/remove-bg.py --all                                  # all library images
```

The default prompt template is:
```
cute chibi [SUBJECT], flat colors, thick black outlines, funny proportions, big head, cartoon, white background, no text
```

Override with `STYLE_PREFIX` and `STYLE_SUFFIX` env vars. Requires a GCP project with billing enabled (defaults to `droid-api-491000`). Override with `GCP_PROJECT` env var.

**Rate limit:** ~30 requests per minute for Imagen 3. Cost: ~$0.02-0.04 per image.

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
