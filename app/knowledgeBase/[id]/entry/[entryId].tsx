import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import { useKnowledgeBaseEntryById } from "@/hook/knowledgeBase";
import { updateKnowledgeBaseEntriesFiled } from "@/utils/db/knowledgeBase";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { toast } from "sonner-native";

export default function KnowledgeBaseEntryScreen() {
	return (
		<Box>
			<KnowledgeBaseEntrySwitch />
			<KnowledgeBaseEntryName />
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
