import { Audio, AVPlaybackStatus } from 'expo-av';
import { pickRandom } from './assets';

const activeSounds = new Set<Audio.Sound>();

function onPlaybackStatus(sound: Audio.Sound, status: AVPlaybackStatus) {
  if (status.isLoaded && status.didJustFinish) {
    activeSounds.delete(sound);
    sound.unloadAsync();
  }
}

export async function playSound(source: number): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(source);
    activeSounds.add(sound);
    sound.setOnPlaybackStatusUpdate(s => onPlaybackStatus(sound, s));
    await sound.playAsync();
  } catch {}
}

export async function playSoundSequence(sources: number[]): Promise<void> {
  for (const src of sources) {
    await new Promise<void>((resolve) => {
      Audio.Sound.createAsync(src).then(({ sound }) => {
        activeSounds.add(sound);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            activeSounds.delete(sound);
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
  const pending = [...activeSounds].map(s => s.unloadAsync().catch(() => {}));
  activeSounds.clear();
  await Promise.all(pending);
}
