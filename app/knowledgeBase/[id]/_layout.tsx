import { stackScreenOptionsAtom } from "@/store/theme";
import { Stack } from "expo-router/stack";
import { useAtomValue } from "jotai";

export default function KnowledgeBaseLayout() {
	return (
		<Stack screenOptions={useAtomValue(stackScreenOptionsAtom)}>
			<Stack.Screen name="index" options={{ title: "知识库信息" }} />
			<Stack.Screen name="entry/[entryId]" options={{ title: "知识库条目" }} />
		</Stack>
	);
}
