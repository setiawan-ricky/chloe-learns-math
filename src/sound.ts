import { Audio, AVPlaybackStatus } from 'expo-av';
import { pickRandom } from './assets';

let currentSound: Audio.Sound | null = null;
let sequenceId = 0;

async function stopCurrent(): Promise<void> {
  if (currentSound) {
    const s = currentSound;
    currentSound = null;
    try { await s.stopAsync(); } catch {}
    try { await s.unloadAsync(); } catch {}
  }
}

export async function playSound(source: number): Promise<void> {
  sequenceId++;
  await stopCurrent();
  try {
    const { sound } = await Audio.Sound.createAsync(source);
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        if (currentSound === sound) currentSound = null;
        sound.unloadAsync();
      }
    });
    await sound.playAsync();
  } catch {}
}

export async function playSoundSequence(sources: number[]): Promise<void> {
  const myId = ++sequenceId;
  for (const src of sources) {
    if (sequenceId !== myId) return;
    await stopCurrent();
    if (sequenceId !== myId) return;
    await new Promise<void>((resolve) => {
      Audio.Sound.createAsync(src).then(({ sound }) => {
        if (sequenceId !== myId) {
          sound.unloadAsync();
          resolve();
          return;
        }
        currentSound = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            if (currentSound === sound) currentSound = null;
            sound.unloadAsync();
            resolve();
          }
        });
        sound.playAsync();
      }).catch(() => resolve());
    });
  }
}

export async function playRandomSound(clips: number[]): Promise<void> {
  if (clips.length === 0) return;
  return playSound(pickRandom(clips));
}

export async function unloadAll(): Promise<void> {
  sequenceId++;
  await stopCurrent();
}
