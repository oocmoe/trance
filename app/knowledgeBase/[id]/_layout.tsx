import { useTranceTheme } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";

export default function KnowledgeBaseLayout() {
	const themeConfig = useTranceTheme();
	return (
		<Stack screenOptions={themeConfig.Stack.options}>
			<Stack.Screen name="index" options={{ title: "知识库信息" }} />
			<Stack.Screen name="detail" options={{ title: "知识库信息" }} />
			<Stack.Screen name="entry/[entryId]" options={{ title: "知识库条目" }} />
		</Stack>
	);
}
