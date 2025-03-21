import { colorModeAtom } from "@/store/core";
import { Stack } from "expo-router/stack";
import { useAtom } from "jotai";

export default function PromptLayout() {
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
			<Stack.Screen name="index" options={{ title: "提示词信息" }} />
		</Stack>
	);
}
