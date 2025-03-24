import { useThemeStackOptions } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";

export default function SettingLayout() {
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
      <Stack.Screen name="about" options={{ title: "关于" }} />
      <Stack.Screen name="theme" options={{ title: "主题" }} />
    </Stack>
  );
}
