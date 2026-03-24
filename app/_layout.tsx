import { Stack } from 'expo-router';
import { useFonts, BubblegumSans_400Regular } from '@expo-google-fonts/bubblegum-sans';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ BubblegumSans_400Regular });

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="game" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
