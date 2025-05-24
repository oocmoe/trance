import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useKnowledgeEntryById } from "@/hook/useKnowledgeBase";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { CardNavItem } from "@/components/card-navItem";
import { updateKnowledgeEntryField } from "@/db/client";
import { toast } from "sonner-native";
import { Switch } from "@/components/ui/switch";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import { ArrowRight } from "lucide-react-native";
export default function KnowledgeEntryIdScreen() {
	const entry = useKnowledgeEntryById(Number(useLocalSearchParams().knowledgeEntryId));
	return (
		<>
			<Stack.Screen options={{ title: entry.name }} />
			<View className="flex-1">
				<EntryDetail />
			</View>
		</>
	);
}

function EntryDetail() {
	return (
		<View className="p-3 flex flex-col gap-y-2">
			<EntryIsEnabled />
			<EntryType />
			<EntryContent />
		</View>
	);
}

function EntryIsEnabled() {
	const entry = useKnowledgeEntryById(Number(useLocalSearchParams().knowledgeEntryId));
	const handleChange = async (value: boolean) => {
		try {
			await updateKnowledgeEntryField(entry.id, "is_enabled", value);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center">
			<Heading>启用</Heading>
			<Switch checked={entry.is_enabled} onCheckedChange={handleChange} />
		</View>
	);
}

function EntryContent() {
	const { id, knowledgeEntryId } = useLocalSearchParams();
	return (
		<View className="flex flex-col gap-y-4">
			<View className="flex flex-row justify-between items-center">
				<Heading>条目内容</Heading>
				<Pressable onPress={() => router.push(`/knowledgeBase/${id}/${knowledgeEntryId}/contentModal`)}>
					<Icon as={ArrowRight} />
				</Pressable>
			</View>
		</View>
	);
}

function EntryType() {
	const knowledgeEntry = useKnowledgeEntryById(Number(useLocalSearchParams().knowledgeEntryId));
	return (
		<View className="flex flex-row justify-between items-center">
			<Heading>条目规则</Heading>
			<Badge className={knowledgeEntry.trigger === "always" ? "bg-blue-400" : "bg-yellow-400"}>
				<Text>{knowledgeEntry.trigger === "always" ? "始终触发" : "关键词触发"}</Text>
			</Badge>
		</View>
	);
}
