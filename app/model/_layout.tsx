import { Box } from '@/components/ui/box';
import { colorModeAtom } from '@/store/core';
import { Stack } from 'expo-router/stack';
import { useAtom } from 'jotai';

export default function ModelLayout() {
  const [colorMode] = useAtom(colorModeAtom);
  return (
    <Stack
      screenOptions={{
        headerTintColor: colorMode === 'light' ? '#000' : '#fff',
        headerBackground: () => <CustomGeminiHeaderBackground />
      }}>
      <Stack.Screen name="gemini" options={{ title: 'Gemini配置' }} />
    </Stack>
  );
}

const CustomGeminiHeaderBackground = () => {
  return <Box className="flex-1 dark:bg-slate-800" />;
};
