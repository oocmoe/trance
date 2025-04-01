import { useTranceTheme } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PromptLayout() {
	const themeConfig = useTranceTheme();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Stack screenOptions={themeConfig.Stack.options}>
				<Stack.Screen name="index" options={{ title: "提示词信息" }} />
			</Stack>
		</SafeAreaView>
	);
}
