import { colorModeAtom } from "@/store/core";
import { Stack } from "expo-router/stack";
import { useAtom } from "jotai";

export default function ModelLayout() {
	const [colorMode] = useAtom(colorModeAtom);
	return (
		<Stack
			screenOptions={{
				headerTintColor: colorMode === "light" ? "#000" : "#fff",
				headerStyle: {
					backgroundColor: colorMode === "light" ? "#fff" : "#000",
				},
				contentStyle: {
					backgroundColor: colorMode === "light" ? "#fff" : "#000",
				},
			}}
		>
			<Stack.Screen name="gemini" options={{ title: "Gemini配置" }} />
		</Stack>
	);
}
