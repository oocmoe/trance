import { Card } from "@/components/ui/card";
import { usePromptGroupById, usePromptListById } from "@/hook/usePrompt";
import { router, Stack, useLocalSearchParams, usePathname } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import StatusBadge from "@/components/StatusBadge";
import Icon from "@/components/Icon";
import { Settings2 } from "lucide-react-native";
export default function PromptGroupIdScreen() {
	const { promptGroupId } = useLocalSearchParams();
	const prompt = usePromptGroupById(Number(promptGroupId));
	return (
		<>
			<Stack.Screen
				options={{
					title: prompt.name,
					headerRight: () => (
						<Pressable onPress={() => router.push(`/prompt/${promptGroupId}/option`)}>
							<Icon as={Settings2} />
						</Pressable>
					),
				}}
			/>
			<View className="flex-1">
				<PromptList />
			</View>
		</>
	);
}

function PromptList() {
	const { promptGroupId } = useLocalSearchParams();
	const prompt = usePromptListById(Number(promptGroupId));
	return (
		<View className="flex-1">
			<ScrollView>
				<View className="flex flex-col gap-y-2 p-3">
					{prompt.map((item) => (
						<Pressable onPress={() => router.push(`/prompt/${promptGroupId}/${item.id}`)} key={item.id}>
							<Card className="p-3">
								<View className="flex flex-row">
									<StatusBadge status={item.is_enabled ? "active" : "offline"} />
									<Text>{item.name}</Text>
								</View>
							</Card>
						</Pressable>
					))}
				</View>
			</ScrollView>
		</View>
	);
}
