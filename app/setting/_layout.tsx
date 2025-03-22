import { stackScreenOptionsAtom } from "@/store/theme";
import { Stack } from "expo-router/stack";
import { useAtomValue } from "jotai";

export default function SettingLayout() {
	return (
		<Stack screenOptions={useAtomValue(stackScreenOptionsAtom)}>
			<Stack.Screen name="about" />
			<Stack.Screen name="theme" />
		</Stack>
	);
}
