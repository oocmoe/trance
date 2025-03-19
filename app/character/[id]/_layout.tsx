import { colorModeAtom } from "@/store/core";
import { Stack } from "expo-router/stack";
import { useAtom } from "jotai";

export default function CharacterLayout() {
	const [colorMode] = useAtom(colorModeAtom);
	return (
		<Stack
			screenOptions={{
				headerTintColor: colorMode === "light" ? "#000" : "#fff",
				headerStyle: {
					backgroundColor: colorMode === "light" ? "#FFF" : "#020617",
				},
				contentStyle: {
					backgroundColor: colorMode === "light" ? "#FFF" : "#020617",
				},
			}}
		>
			<Stack.Screen name="index" options={{ title: "角色卡信息" }} />
		</Stack>
	);
}
