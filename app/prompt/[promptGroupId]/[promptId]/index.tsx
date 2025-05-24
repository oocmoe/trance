import { router, Stack, useLocalSearchParams, usePathname } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { usePromptById } from "@/hook/usePrompt";
import StatusBadge from "@/components/StatusBadge";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner-native";
import { updatePromptField } from "@/db/client";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import { ArrowRight, Edit } from "lucide-react-native";
export default function PromptIdScreen() {
	const { promptId } = useLocalSearchParams();
	const prompt = usePromptById(Number(promptId));
	return (
		<>
			<Stack.Screen options={{ title: prompt.name }} />
			<View className="flex-1">
				<PromptDetail />
			</View>
		</>
	);
}

function PromptDetail() {
	return (
		<View className="flex-1">
			<PromptIsEnabled />

			<PromptContent />
		</View>
	);
}

function PromptIsEnabled() {
	const { promptId } = useLocalSearchParams();
	const prompt = usePromptById(Number(promptId));
	const handleChange = async () => {
		try {
			await updatePromptField(Number(promptId), "is_enabled", !prompt.is_enabled);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Heading>启用</Heading>
			<Switch checked={prompt.is_enabled} onCheckedChange={handleChange} />
		</View>
	);
}

function PromptContent() {
	const { promptId, promptGroupId } = useLocalSearchParams();
	const prompt = usePromptById(Number(promptId));
	return (
		<View className="flex flex-1  flex-col gap-y-2">
			<View className="flex flex-row justify-between items-center p-3">
				<Heading>内容</Heading>
				<Pressable onPress={() => router.push(`/prompt/${promptGroupId}/${promptId}/promptContentEditModal`)}>
					<Icon as={ArrowRight} />
				</Pressable>
			</View>
			<ScrollView>
				<View className="p-3">
					<Text>{prompt.content}</Text>
				</View>
			</ScrollView>
		</View>
	);
}
