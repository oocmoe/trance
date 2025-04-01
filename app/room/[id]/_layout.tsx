import { useTranceTheme } from "@/hook/theme";
import { Stack } from "expo-router/stack";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoomLayout() {
	const themeConfig = useTranceTheme();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Stack screenOptions={themeConfig.Room.options}>
				<Stack.Screen name="index" />
				<Stack.Screen name="detail" options={{ title: "房间信息" }} />
			</Stack>
		</SafeAreaView>
	);
}
