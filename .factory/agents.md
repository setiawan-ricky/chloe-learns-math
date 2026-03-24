<coding_guidelines>
# Agent Instructions

This is the canonical Expo React Native implementation of Chloe Learns Math — a bilingual (English/Chinese) children's math learning app.

## Key Context

- **Chloe's Chinese name is 紫怡** — use this in all Chinese audio and text, never "Chloe"
- **Font:** Bubblegum Sans throughout, all text lowercase
- **Audio voices:** Ana (en-US-AnaNeural) for English, Xiaoxiao (zh-CN-XiaoxiaoNeural) for Chinese, via edge-tts
- **Image generation:** Google Vertex AI Imagen 3 (GCP project: droid-api-491000, ~30 RPM)
- **Image style:** chibi, flat colors, thick black outlines, no shadows, white background (auto-removed)
- **Bilingual:** All UI text uses `src/i18n.ts` translations via `useLang()` hook. Audio loaded via `getAudio(lang)` from `src/assets.ts`
- **Date format:** History entries use `en-GB` locale format (`"23 Mar 2026, 22:41"`). Don't use timezone-specific `toLocaleString` tricks — Safari iOS doesn't support parsing them back

## Cross-Project Sync

A legacy native Android implementation exists at `../chloe-learns-math-legacy-android`. After making any feature or behavior change in this project:

1. Update `FEATURES.md` in this repo to reflect the change.
2. Implement the equivalent change in the legacy project's Kotlin/XML code.
3. Update `FEATURES.md` in the legacy project to match.
4. Copy any new or modified assets (images, audio) to the legacy project's `app/src/main/assets/` directory.

The legacy project targets Android 4.4 (API 19) using native Android APIs (no React Native), so not all changes will be portable. If a feature cannot be implemented in the legacy project, mark it with `[ ]` in the legacy `FEATURES.md` and add a note explaining why.

### Legacy project structure

- Activities: `MainActivity` (home), `MathGameActivity` (game), `HistoryActivity`, `StatsActivity`
- Layout XMLs in `app/src/main/res/layout/`
- Assets in `app/src/main/assets/` (audio/, images/, fonts/)
- SharedPreferences key: `"chloe_prefs"` for all persistent data
- Language stored in SharedPreferences as `"app_language"` ("en" or "zh")
- Build: `./gradlew assembleDebug` (or invoke gradle-wrapper.jar directly with Java 17)

### Legacy gotchas

- The `gradlew` script has a bug — the first two exec lines fail silently (`|| true`), only the third Java invocation works
- History entries use pipe-delimited format (`game|mode|correct|total|secs|date`), not JSON
- Question stats and mistake logs also use pipe-delimited SharedPreferences strings
- No mutex for concurrent writes (single-threaded UI, so not an issue)
- For expandable rows in StatsActivity, click listeners must be set on both the wrapper AND the inner row LinearLayout
- `detailContainer` visibility should NOT be set to GONE independently — only the `detailWrapper` controls expand/collapse

## Architecture Notes

- `src/i18n.ts` — `LangContext` provides `{ lang, setLang }`, consumed via `useLang()`. Strings accessed via `t(lang)`
- `src/assets.ts` — `getAudio(lang)` returns an `AudioSet` with title, menu, correct[], incorrect[], etc.
- `src/history.ts` — All persistence via AsyncStorage. `recordQuestionResult` uses a mutex. `getGamesToday()` compares date strings using the same `en-GB` locale format as `saveHistoryEntry`
- `src/config.ts` — All magic numbers (timers, speeds, storage keys, limits)
- `app/_layout.tsx` — Root layout loads font + language preference, provides `LangContext.Provider`
- Bounce physics in `index.tsx` — N-body pairwise elastic collisions, configurable via `src/config.ts` BOUNCE constants
</coding_guidelines>
