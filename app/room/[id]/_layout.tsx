import { Stack } from 'expo-router/stack';

export default function RoomLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="detail" />
    </Stack>
  );
}
