import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useKnowledgeBaseEntryById } from "@/hook/knowledgeBase";
import { updateKnowledgeBaseEntriesFiled } from "@/utils/db/knowledgeBase";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";

export default function KnowledgeBaseEntryScreen() {
	return (
		<Box className="h-full p-3 flex flex-col gap-y-3">
			<KnowledgeBaseEntryName />
			<HStack className="justify-between items-center">
				<Text>启用</Text>
				<KnowledgeBaseEntrySwitch />
			</HStack>
			<HStack className="justify-between items-center">
				<Text>触发规则</Text>
				<KnowledgeBaseEntryTrigger />
			</HStack>
			<KnowledgeBaseEntryKeyWords />
			<KnowledgeBaseEntryContent />
		</Box>
	);
}

const KnowledgeBaseEntryName = () => {
	const { id, entryId } = useLocalSearchParams();
	const entry = useKnowledgeBaseEntryById(Number(id), Number(entryId));
	if (entry) return <Heading>{entry.name}</Heading>;
};

const KnowledgeBaseEntrySwitch = () => {
	const { id, entryId } = useLocalSearchParams();
	const entry = useKnowledgeBaseEntryById(Number(id), Number(entryId));
	const handleUpdate = async (value: boolean) => {
		const result = await updateKnowledgeBaseEntriesFiled(
			Number(id),
			Number(entryId),
			"is_Enable",
			value,
		);
		if (!result) {
			toast.error("更改失败");
		}
	};
	if (entry)
		return (
			<Switch
				onChange={(e) => handleUpdate(e.nativeEvent.value)}
				value={entry.is_Enable}
			/>
		);
};

const KnowledgeBaseEntryTrigger = () => {
	const { id, entryId } = useLocalSearchParams();
	const entry = useKnowledgeBaseEntryById(Number(id), Number(entryId));
	if (entry)
		return (
			<Box>
				{entry.trigger === "always" && (
					<Text className="text-blue-500">始终触发</Text>
				)}
				{entry.trigger === "key" && (
					<Text className="text-green-500">关键词触发</Text>
				)}
			</Box>
		);
};

const KnowledgeBaseEntryKeyWords = () => {
	const { id, entryId } = useLocalSearchParams();
	const entry = useKnowledgeBaseEntryById(Number(id), Number(entryId));
	if (entry?.trigger === "key")
		return (
			<Box>
				<HStack space="md">
					{entry.keywords.map((content) => (
						<Badge key={content} size="md" variant="solid" action="success">
							<BadgeText>{content}</BadgeText>
						</Badge>
					))}
				</HStack>
			</Box>
		);
};

const KnowledgeBaseEntryContent = () => {
	const { id, entryId } = useLocalSearchParams();
	const entry = useKnowledgeBaseEntryById(Number(id), Number(entryId));
	if (entry?.content)
		return (
			<ScrollView>
				<Card>
					<Text>{entry.content}</Text>
				</Card>
			</ScrollView>
		);
};
