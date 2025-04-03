import { useThemeStack } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";
export default function SettingLayout() {
	const themeConfig = useThemeStack();
	return (
		<Stack screenOptions={themeConfig.options}>
			<Stack.Screen name="about" options={{ title: "关于" }} />
			<Stack.Screen name="theme" options={{ title: "主题" }} />
		</Stack>
	);
}
