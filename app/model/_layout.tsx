import { useTranceTheme } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";

export default function ModelLayout() {
	const themeConfig = useTranceTheme();
	return (
		<Stack screenOptions={themeConfig.Stack.options}>
			<Stack.Screen name="gemini" options={{ title: "Gemini配置" }} />
			<Stack.Screen name="grok" options={{ title: "Grok配置" }} />
			<Stack.Screen
				name="customOpenAI"
				options={{ title: "自定义接口[OpenAI格式]" }}
			/>
		</Stack>
	);
}
