# Agent Instructions

This is the canonical Expo React Native implementation of Chloe Learns Math.

## Cross-Project Sync

A legacy native Android implementation exists at `../chloe-learns-math-legacy`. After making any feature or behavior change in this project:

1. Update `FEATURES.md` in this repo to reflect the change.
2. Implement the equivalent change in the legacy project's Kotlin/XML code.
3. Update `FEATURES.md` in the legacy project to match.
4. Copy any new or modified assets (images, audio) to the legacy project's `app/src/main/assets/` directory.

The legacy project targets Android 4.4 (API 19) using native Android APIs (no React Native), so not all changes will be portable. If a feature cannot be implemented in the legacy project, mark it with `[ ]` in the legacy `FEATURES.md` and add a note explaining why.
