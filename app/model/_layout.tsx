import { stackScreenOptionsAtom } from "@/store/theme";
import { Stack } from "expo-router/stack";
import { useAtomValue } from "jotai";

export default function ModelLayout() {
	return (
		<Stack screenOptions={useAtomValue(stackScreenOptionsAtom)}>
			<Stack.Screen name="gemini" options={{ title: "Gemini配置" }} />
			<Stack.Screen
				name="customOpenAI"
				options={{ title: "自定义接口[OpenAI格式]" }}
			/>
		</Stack>
	);
}
