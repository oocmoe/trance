import {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useKnowledgeBaseEntryById } from "@/hook/knowledgeBase";
import {
	deleteKnowledgeBaseEntry,
	updateKnowledgeBaseEntriesFiled,
} from "@/utils/db/knowledgeBase";
import { router, useLocalSearchParams } from "expo-router";
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
			<DeleteEntry />
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

const DeleteEntry = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const { id, entryId } = useLocalSearchParams();
	const handleDelete = async () => {
		try {
			const rows = await deleteKnowledgeBaseEntry(Number(id), Number(entryId));
			if (rows) {
				setIsOpen(false);
				router.push(`/knowledgeBase/${id}`);
				toast.success("删除成功");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	return (
		<Box>
			<Button onPress={() => setIsOpen(true)} action="negative">
				<ButtonText className="text-white">删除条目</ButtonText>
			</Button>
			<AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<AlertDialogBackdrop />
				<AlertDialogContent>
					<AlertDialogHeader>
						<Heading>你确定吗？</Heading>
					</AlertDialogHeader>
					<AlertDialogBody className="mt-3 mb-4">
						<Text size="sm">它将永远离你而去</Text>
					</AlertDialogBody>
					<AlertDialogFooter className="">
						<Button
							variant="outline"
							action="secondary"
							onPress={() => setIsOpen(false)}
							size="sm"
						>
							<ButtonText>算了</ButtonText>
						</Button>
						<Button onPress={handleDelete} action="negative" size="sm">
							<ButtonText className="text-white">删除</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Box>
	);
};
