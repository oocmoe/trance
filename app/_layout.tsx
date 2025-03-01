// app/_layout.tsx
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { colorModeAtom } from '@/store/core';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useAtom } from 'jotai';
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

const db = SQLite.openDatabaseSync('trance.db');

export default function RootLayout() {
  const [colorMode] = useAtom(colorModeAtom);
  useDrizzleStudio(db);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode={colorMode}>
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
