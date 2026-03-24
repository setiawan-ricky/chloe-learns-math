import { useCallback, useEffect, useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts, BubblegumSans_400Regular } from '@expo-google-fonts/bubblegum-sans';
import { Lang, LangContext, loadLang, saveLang } from '../src/i18n';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ BubblegumSans_400Regular });
  const [lang, setLangState] = useState<Lang>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => { loadLang().then(l => { setLangState(l); setReady(true); }); }, []);

  const setLang = useCallback((l: Lang) => { setLangState(l); saveLang(l); }, []);
  const ctx = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  if (!fontsLoaded || !ready) return null;

  return (
    <LangContext.Provider value={ctx}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="history" />
        <Stack.Screen name="stats" />
      </Stack>
    </LangContext.Provider>
  );
}
