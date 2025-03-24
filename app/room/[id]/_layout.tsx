import { useThemeStackOptions } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";

export default function RoomLayout() {
  const [optionsReady, setOptionsReady] = React.useState(false);
  const stackOptions = useThemeStackOptions();
  React.useEffect(() => {
    if (stackOptions) {
      setOptionsReady(true);
    }
  });
  if (!optionsReady) return null;
  return (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="index" options={{ title: "对话" }} />
      <Stack.Screen name="detail" options={stackOptions} />
    </Stack>
  );
}
