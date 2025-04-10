import { useTranceTheme } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";

export default function CharacterEditorLayout() {
	const themeConfig = useTranceTheme();
	return (
		<Stack screenOptions={themeConfig.Stack.options}>
			<Stack.Screen name="index" options={{ title: "编辑角色卡" }} />
			<Stack.Screen name="description" options={{ title: "角色卡描述" }} />
		</Stack>
	);
}
