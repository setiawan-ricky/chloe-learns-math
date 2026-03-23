import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CHARACTERS, EXPLOSION, LASER, MENU_AUDIO, TITLE_AUDIO } from '../src/assets';
import { BOUNCE } from '../src/config';
import { playSound, unloadAll } from '../src/sound';

const { IMG_SIZE, SPEED_MIN, SPEED_RANGE, SPEED_MULTIPLIER, MIN_COMPONENT_SPEED,
        EXPLOSION_DISPLAY_MS, EXPLOSION_FADE_MS } = BOUNCE;

const BOUNCER_COUNT = 2;

interface PhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  charIdx: number;
  exploding: boolean;
}

function makeVelocity(): { vx: number; vy: number } {
  const speed = (SPEED_MIN + Math.random() * SPEED_RANGE) * SPEED_MULTIPLIER;
  const angle = Math.random() * 2 * Math.PI;
  let vx = speed * Math.cos(angle);
  let vy = speed * Math.sin(angle);
  if (Math.abs(vx) < MIN_COMPONENT_SPEED) vx = vx >= 0 ? MIN_COMPONENT_SPEED : -MIN_COMPONENT_SPEED;
  if (Math.abs(vy) < MIN_COMPONENT_SPEED) vy = vy >= 0 ? MIN_COMPONENT_SPEED : -MIN_COMPONENT_SPEED;
  return { vx, vy };
}

function pickDifferentIndex(exclude: number): number {
  if (CHARACTERS.length <= 1) return 0;
  let idx: number;
  do { idx = Math.floor(Math.random() * CHARACTERS.length); } while (idx === exclude);
  return idx;
}

function makeInitialPhysics(count: number): PhysicsState[] {
  return Array.from({ length: count }, (_, i) => ({
    x: 0, y: 0, vx: 0, vy: 0, charIdx: i % CHARACTERS.length, exploding: false,
  }));
}

export default function HomeScreen() {
  const router = useRouter();

  const zoneSizeRef = useRef({ width: 0, height: 0 });
  const physicsRef = useRef<PhysicsState[]>(makeInitialPhysics(BOUNCER_COUNT));
  const animRefs = useRef(Array.from({ length: BOUNCER_COUNT }, () => new Animated.ValueXY({ x: 0, y: 0 }))).current;
  const alphaRefs = useRef(Array.from({ length: BOUNCER_COUNT }, () => new Animated.Value(1))).current;
  const [sources, setSources] = useState<ImageSourcePropType[]>(
    () => physicsRef.current.map(p => CHARACTERS[p.charIdx]),
  );

  const rafRef = useRef<number | null>(null);
  const started = useRef(false);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const trackedTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    }, ms);
    timeoutsRef.current.add(id);
    return id;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    const physics = physicsRef.current;
    const loop = () => {
      const { width: zw, height: zh } = zoneSizeRef.current;
      const maxX = Math.max(0, zw - IMG_SIZE);
      const maxY = Math.max(0, zh - IMG_SIZE);

      for (const p of physics) {
        if (p.exploding) continue;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0)    { p.x = 0;    p.vx =  Math.abs(p.vx); }
        if (p.y <= 0)    { p.y = 0;    p.vy =  Math.abs(p.vy); }
        if (p.x >= maxX) { p.x = maxX; p.vx = -Math.abs(p.vx); }
        if (p.y >= maxY) { p.y = maxY; p.vy = -Math.abs(p.vy); }
      }

      // Pairwise elastic collisions
      for (let i = 0; i < physics.length; i++) {
        for (let j = i + 1; j < physics.length; j++) {
          const a = physics[i];
          const b = physics[j];
          if (a.exploding || b.exploding) continue;
          const dx = (a.x + IMG_SIZE / 2) - (b.x + IMG_SIZE / 2);
          const dy = (a.y + IMG_SIZE / 2) - (b.y + IMG_SIZE / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= IMG_SIZE || dist === 0) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (dot >= 0) continue;
          a.vx -= dot * nx;
          a.vy -= dot * ny;
          b.vx += dot * nx;
          b.vy += dot * ny;
          const overlap = IMG_SIZE - dist;
          a.x += nx * overlap / 2;
          a.y += ny * overlap / 2;
          b.x -= nx * overlap / 2;
          b.y -= ny * overlap / 2;
        }
      }

      for (let i = 0; i < physics.length; i++) {
        animRefs[i].setValue({ x: physics[i].x, y: physics[i].y });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [animRefs]);

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const onZoneLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (started.current) return;
    started.current = true;
    zoneSizeRef.current = { width, height };

    const maxX = Math.max(0, width - IMG_SIZE);
    const maxY = Math.max(0, height - IMG_SIZE);
    const physics = physicsRef.current;
    const usedIndices: number[] = [];

    for (let i = 0; i < physics.length; i++) {
      const xFraction = (i + 1) / (physics.length + 1);
      let charIdx: number;
      do { charIdx = Math.floor(Math.random() * CHARACTERS.length); } while (usedIndices.includes(charIdx));
      usedIndices.push(charIdx);

      physics[i] = { x: maxX * xFraction, y: maxY / 2, charIdx, exploding: false, ...makeVelocity() };
      animRefs[i].setValue({ x: physics[i].x, y: physics[i].y });
    }

    setSources(physics.map(p => CHARACTERS[p.charIdx]));
    startLoop();
  }, [animRefs, startLoop]);

  useEffect(() => {
    return () => {
      stopLoop();
      for (const id of timeoutsRef.current) clearTimeout(id);
      timeoutsRef.current.clear();
      unloadAll();
    };
  }, [stopLoop]);

  const triggerExplosion = useCallback((index: number) => {
    const physics = physicsRef.current;
    const p = physics[index];
    if (p.exploding) return;
    p.exploding = true;

    setSources(prev => { const next = [...prev]; next[index] = EXPLOSION; return next; });
    playSound(LASER);
    alphaRefs[index].setValue(1);

    trackedTimeout(() => {
      Animated.timing(alphaRefs[index], {
        toValue: 0, duration: EXPLOSION_FADE_MS, useNativeDriver: true,
      }).start(() => {
        const { width: zw, height: zh } = zoneSizeRef.current;
        const maxX = Math.max(10, zw - IMG_SIZE);
        const maxY = Math.max(10, zh - IMG_SIZE);
        p.x = Math.random() * maxX;
        p.y = Math.random() * maxY;
        const otherIndices = physics.filter((_, i) => i !== index).map(o => o.charIdx);
        let newIdx: number;
        do { newIdx = Math.floor(Math.random() * CHARACTERS.length); } while (otherIndices.includes(newIdx));
        p.charIdx = newIdx;
        Object.assign(p, makeVelocity());
        animRefs[index].setValue({ x: p.x, y: p.y });
        setSources(prev => { const next = [...prev]; next[index] = CHARACTERS[newIdx]; return next; });
        requestAnimationFrame(() => {
          alphaRefs[index].setValue(1);
          p.exploding = false;
        });
      });
    }, EXPLOSION_DISPLAY_MS);
  }, [alphaRefs, animRefs, trackedTimeout]);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => playSound(TITLE_AUDIO)}>
        <Text style={styles.title}>Chloe Learns Math</Text>
      </TouchableOpacity>

      <View style={styles.bounceZone} onLayout={onZoneLayout} pointerEvents="box-none">
        {animRefs.map((anim, i) => (
          <Animated.View key={i} style={[styles.bounceImg, { transform: anim.getTranslateTransform(), opacity: alphaRefs[i] }]}>
            <TouchableOpacity activeOpacity={1} onPress={() => triggerExplosion(i)}>
              <Image source={sources[i]} style={styles.imgSize} resizeMode="contain" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.col}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => playSound(MENU_AUDIO.addition)}>
            <Text style={styles.colLabel}>ADDITION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gameBtn, styles.easy]}
            onPress={() => { playSound(MENU_AUDIO.easy); router.push({ pathname: '/game', params: { game: 'Addition', mode: 'EASY' } }); }}>
            <Text style={styles.gameBtnText}>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gameBtn, styles.hard]}
            onPress={() => { playSound(MENU_AUDIO.hard); router.push({ pathname: '/game', params: { game: 'Addition', mode: 'HARD' } }); }}>
            <Text style={styles.gameBtnText}>Hard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.col}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => playSound(MENU_AUDIO.minus)}>
            <Text style={styles.colLabel}>MINUS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gameBtn, styles.easy]}
            onPress={() => { playSound(MENU_AUDIO.easy); router.push({ pathname: '/game', params: { game: 'Minus', mode: 'EASY' } }); }}>
            <Text style={styles.gameBtnText}>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gameBtn, styles.hard]}
            onPress={() => { playSound(MENU_AUDIO.hard); router.push({ pathname: '/game', params: { game: 'Minus', mode: 'HARD' } }); }}>
            <Text style={styles.gameBtnText}>Hard</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.historyBtn} onPress={() => router.push('/history')}>
        <Text style={styles.historyBtnText}>History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#FAFAFA' },
  title:         { textAlign: 'center', fontSize: 38, fontWeight: 'bold', color: '#3F51B5', paddingTop: 24, paddingBottom: 12 },
  bounceZone:    { flex: 1, overflow: 'hidden' },
  bounceImg:     { position: 'absolute', width: IMG_SIZE, height: IMG_SIZE },
  imgSize:       { width: IMG_SIZE, height: IMG_SIZE },
  buttonRow:     { flexDirection: 'row', paddingHorizontal: 24, paddingBottom: 16 },
  col:           { flex: 1, alignItems: 'center' },
  colLabel:      { fontSize: 15, fontWeight: 'bold', color: '#9E9E9E', letterSpacing: 1.5, marginBottom: 10 },
  gameBtn:       { width: '90%', height: 64, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  easy:          { backgroundColor: '#43A047' },
  hard:          { backgroundColor: '#E53935' },
  gameBtnText:   { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  divider:       { width: 1, backgroundColor: '#E0E0E0', marginHorizontal: 12 },
  historyBtn:    { alignSelf: 'center', backgroundColor: '#3F51B5', borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14, marginBottom: 20 },
  historyBtnText:{ color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
