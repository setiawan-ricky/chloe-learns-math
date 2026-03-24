# Chloe Learns Math

A React Native (Expo) bilingual math app for kids learning addition and subtraction. Supports Android, iOS, and web from a single codebase. Chloe's Chinese name is 紫怡.

## Features

- **Bilingual** — English and Chinese (Mandarin), switchable via flag icons on the home screen
- **Addition and Minus** games, each with Easy and Hard modes
- **Easy mode** — 30-second timer; wrong answers let you try again
- **Hard mode** — 20-second timer; wrong answer immediately advances to next question
- 5-question rounds with audio feedback (correct, incorrect, timeout, round completion)
- Perfect-score rounds show a celebration image with special audio
- Persistent score, game history, per-question stats, and detailed mistake log
- **Stats screen** — sortable table by question/accuracy/attempts, expandable rows showing each mistake with timestamp, 7-tap reset
- **History screen** — game results with color-coded game type and difficulty
- **Times played today** counter on home screen (resets at midnight, device-local time)
- Home screen with three animated characters bouncing with elastic collision physics
- Tap a bouncing character to explode it (laser sound + explosion image + respawn)
- Bubblegum Sans font throughout, all text lowercase
- Blob-shaped game buttons (green=easy, red=hard, orange=history, blue=stats)
- Title row: heart icon + "chloe" (pink) + "learns math" (purple) + blackboard icon
- Web: responsive portrait layout
- Game timer pauses when app is minimized

## Audio

All audio is organized into language directories (`assets/audio/en/` and `assets/audio/zh/`), with 54 clips per language:

| Category | Count | When it plays |
|---|---|---|
| correct/ | 15 | Player enters the right answer |
| incorrect/ | 12 | Player enters a wrong answer |
| timeout/ | 7 | Timer runs out |
| all-correct/ | 7 | Perfect 5/5 round |
| completion/ | 6 | Round ends with 2-4 correct |
| completion-bad/ | 2 | Round ends with 0-1 correct |
| menu/ | 5 | Menu button/label taps (easy, hard, addition, minus, games-today) |
| chloe-learns-math.mp3 | 1 | Title tap |

Plus `assets/audio/laser.mp3` (language-independent, plays on character explosion).

**Voices:** Ana (en-US-AnaNeural) for English, Xiaoxiao (zh-CN-XiaoxiaoNeural) for Chinese. Generated with edge-tts.

## Running the app

```bash
npm install
npx expo start          # Expo dev server
npx expo run:android    # native Android build
npx expo run:ios        # native iOS build
npx expo start --web    # web browser
```

## Asset generation scripts

### Audio (edge-tts)

Batch-generate all audio clips:

```bash
bash scripts/gen-all-audio.sh
```

Uses edge-tts with Ana (English) and Xiaoxiao (Chinese) voices. Requires `pip install edge-tts`.

### Images (Google Vertex AI / Imagen 3)

Generate cartoon images with transparent backgrounds:

```bash
npm run gen:image -- "panda"
npm run gen:image -- "princess girl, pink dress, tiara"
```

Images save to `assets/images/library/`. White backgrounds are auto-removed via `scripts/remove-bg.py` (requires Pillow).

**Override style:** Set `STYLE_PREFIX` and `STYLE_SUFFIX` env vars. Default prepends "cute chibi" and appends standard cartoon style instructions.

**Symlink into app:**
```bash
npm run use:image -- characters panda
npm run use:image -- celebration fireworks
```

Then add to `src/assets.ts`.

**Setup:** `gcloud auth application-default login` (GCP project: `droid-api-491000`, ~30 RPM, ~$0.02-0.04/image)

## Project structure

```
chloe-learns-math/
├── app/
│   ├── _layout.tsx       # Stack navigator + LangContext provider
│   ├── index.tsx         # Home screen (bouncing characters, game buttons, flag selector, today counter)
│   ├── game.tsx          # Math game screen
│   ├── history.tsx       # Game history table
│   └── stats.tsx         # Per-question stats with expandable mistake details
├── src/
│   ├── assets.ts         # Static registries for images and audio (bilingual: getAudio(lang))
│   ├── config.ts         # Game constants (timers, speeds, storage keys)
│   ├── history.ts        # AsyncStorage persistence (scores, history, stats, mistakes, today count)
│   ├── i18n.ts           # Internationalization (Lang type, LangContext, translations, persistence)
│   └── sound.ts          # Audio playback helpers
├── assets/
│   ├── audio/
│   │   ├── en/           # 54 English audio clips (Ana voice)
│   │   ├── zh/           # 54 Chinese audio clips (Xiaoxiao voice, uses 紫怡)
│   │   └── laser.mp3
│   ├── images/
│   │   ├── characters/   # 17 bouncing character PNGs
│   │   ├── celebration/  # 16 celebration PNGs
│   │   ├── library/      # Source images (blobs, flags, heart, blackboard, unicorn, etc.)
│   │   └── explosion.png
│   └── fonts/
│       └── BubblegumSans-Regular.ttf
├── scripts/
│   ├── gen-all-audio.sh  # Batch generate all 109 audio files
│   ├── generate-image.sh # Imagen 3 image generation + bg removal
│   ├── use-image.sh      # Symlink library images into app
│   └── remove-bg.py      # Python flood-fill white background removal
├── FEATURES.md           # Canonical feature checklist
└── vercel.json           # Web SPA deployment config
```

## Legacy Android

A native Kotlin/XML implementation exists at `../chloe-learns-math-legacy-android` for older Android devices (API 19+). See AGENTS.md for sync instructions.
