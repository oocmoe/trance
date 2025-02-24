import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { StatusBar } from 'react-native';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

const db = SQLite.openDatabaseSync('trance.db');

export default function RootLayout() {
  useDrizzleStudio(db);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="light">
        <StatusBar translucent backgroundColor="transparent" />
        <Stack
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </GluestackUIProvider>
      <Toaster richColors />
    </GestureHandlerRootView>
  );
}
