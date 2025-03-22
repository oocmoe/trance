import { stackScreenOptionsAtom } from "@/store/theme";
import { Stack } from "expo-router/stack";
import { useAtomValue } from "jotai";

export default function CharacterLayout() {
	return (
		<Stack screenOptions={useAtomValue(stackScreenOptionsAtom)}>
			<Stack.Screen name="index" options={{ title: "角色卡信息" }} />
		</Stack>
	);
}
