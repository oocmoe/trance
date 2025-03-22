import { stackScreenOptionsAtom } from "@/store/theme";
import { Stack } from "expo-router/stack";
import { useAtomValue } from "jotai";

export default function PromptLayout() {
	return (
		<Stack screenOptions={useAtomValue(stackScreenOptionsAtom)}>
			<Stack.Screen name="index" options={{ title: "提示词信息" }} />
		</Stack>
	);
}
