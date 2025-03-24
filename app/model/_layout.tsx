import { useThemeStackOptions } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";

export default function ModelLayout() {
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
      <Stack.Screen name="gemini" options={{ title: "Gemini配置" }} />
      <Stack.Screen
        name="customOpenAI"
        options={{ title: "自定义接口[OpenAI格式]" }}
      />
    </Stack>
  );
}
