import { stackScreenOptionsAtom } from "@/store/theme";
import { Stack } from "expo-router/stack";
import { useAtomValue } from "jotai";

export default function RoomLayout() {
	return (
		<Stack screenOptions={useAtomValue(stackScreenOptionsAtom)}>
			<Stack.Screen name="index" options={{ title: "对话" }} />
			<Stack.Screen name="detail" options={{ title: "聊天信息" }} />
		</Stack>
	);
}
