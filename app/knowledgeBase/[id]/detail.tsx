import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon, TrashIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@/components/ui/modal";
import { deleteKnowledgeBaseById } from "@/utils/db/knowledgeBase";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { toast } from "sonner-native";
export default function KnowledgeBaseDetailScreen() {
	return (
		<Box className="p-3">
			<DeleteKnowledgeBase />
		</Box>
	);
}

const DeleteKnowledgeBase = () => {
	const { id } = useLocalSearchParams();
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const handleDelete = async () => {
		try {
			const rows = await deleteKnowledgeBaseById(Number(id));
			if (rows) {
				setIsOpen(false);
				router.push("/(drawer)/knowledgeBase");
				toast.success("删除成功");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("删除知识库失败,未知错误");
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<Text>删除</Text>
						<Icon as={TrashIcon} />
					</HStack>
				</Card>
			</Pressable>
			<Modal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				size="md"
			>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader>
						<Heading size="md" className="text-typography-950">
							删除知识库
						</Heading>
					</ModalHeader>
					<ModalBody>
						<Text size="sm" className="text-typography-500">
							确定删除吗，它将永远离你而去
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="outline"
							action="secondary"
							onPress={() => {
								setIsOpen(false);
							}}
						>
							<ButtonText>算了</ButtonText>
						</Button>
						<Button action="negative" onPress={handleDelete}>
							<ButtonText className="text-white">永别了</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
