import { useTranceTheme } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";

export default function RegexLayout() {
	const themeConfig = useTranceTheme();
	return (
		<Stack
			screenOptions={{
				...themeConfig.Stack.options,
			}}
		>
			<Stack.Screen name="index" options={{ title: "正则信息" }} />
		</Stack>
	);
}
