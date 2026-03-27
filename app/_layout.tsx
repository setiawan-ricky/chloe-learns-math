import { useCallback, useEffect, useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts, BubblegumSans_400Regular } from '@expo-google-fonts/bubblegum-sans';
import { AppMode, Lang, LangContext, loadLang, loadMode, saveLang, saveMode } from '../src/i18n';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ BubblegumSans_400Regular });
  const [lang, setLangState] = useState<Lang>('en');
  const [mode, setModeState] = useState<AppMode>('math');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([loadLang(), loadMode()]).then(([l, m]) => {
      setLangState(l); setModeState(m); setReady(true);
    });
  }, []);

  const setLang = useCallback((l: Lang) => { setLangState(l); saveLang(l); }, []);
  const setMode = useCallback((m: AppMode) => { setModeState(m); saveMode(m); }, []);
  const ctx = useMemo(() => ({ lang, setLang, mode, setMode }), [lang, setLang, mode, setMode]);

  if (!fontsLoaded || !ready) return null;

  return (
    <LangContext.Provider value={ctx}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="spelling" />
        <Stack.Screen name="history" />
        <Stack.Screen name="stats" />
      </Stack>
    </LangContext.Provider>
  );
}
