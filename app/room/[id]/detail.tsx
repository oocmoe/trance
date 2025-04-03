import { ModelSelect } from "@/components/modelSelect";
import {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import {
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@/components/ui/modal";
import {
	Select,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { usePromptList } from "@/hook/prompt";
import { modalAtom } from "@/store/core";
import type { ConvertSillyTavernChatHistory } from "@/types/result";
import { readPromptFieldById } from "@/utils/db/prompt";
import {
	deleteRoomById,
	readRoomFieldById,
	updateRoomFieldById,
} from "@/utils/db/room";
import { pickSillyTavernChatHistory } from "@/utils/file/picker";
import { importSillyTavernChatHistory } from "@/utils/message/importChatHistory";
import { router, useLocalSearchParams } from "expo-router";
import { useAtom } from "jotai";
import {
	HammerIcon,
	ImportIcon,
	MessageSquareTextIcon,
	Trash2Icon,
} from "lucide-react-native";
import React from "react";
import { InteractionManager, Pressable } from "react-native";
import { toast } from "sonner-native";

export default function RoomDetailScreen() {
	return (
		<Box className="h-full p-3">
			<VStack space="sm">
				<Box className="gap-y-3">
					<Text>房间选项</Text>
					<Card>
						<VStack space="4xl">
							<ModelSelect />
							<PromptSelect />
							<ImportSillyTavernChatHistory />
							<DeleteRoomButton />
						</VStack>
					</Card>
				</Box>
			</VStack>
			<DeleteRoomModal />
		</Box>
	);
}

const PromptSelect = () => {
	const { id } = useLocalSearchParams();
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [promptId, setPromptId] = React.useState<number>();
	const [placeholder, setPlaceholder] = React.useState<string>("");
	const prompt = usePromptList();
	const handleSavePrompt = async () => {
		const result = await updateRoomFieldById(
			Number(id),
			"prompt",
			Number(promptId),
		);
		if (!result) {
			toast.error("保存失败");
			return;
		}
		setIsOpen(false);
		toast.success("保存成功");
	};
	React.useEffect(() => {
		const initPrompt = async () => {
			const result = await readRoomFieldById(Number(id), "prompt");
			const placeholder = await readPromptFieldById(Number(result), "name");
			setPlaceholder(placeholder as string);
			setPromptId(Number(result));
		};
		initPrompt();
	}, [id]);
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<HStack className="items-center" space="sm">
					<Icon as={HammerIcon} />
					<Text>选择提示词</Text>
				</HStack>
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
							选择提示词
						</Heading>
					</ModalHeader>
					<ModalBody>
						<Select onValueChange={(value) => setPromptId(Number(value))}>
							<SelectTrigger>
								<SelectInput placeholder={placeholder} />
							</SelectTrigger>
							<SelectPortal>
								<SelectBackdrop />
								<SelectContent>
									<SelectDragIndicatorWrapper>
										<SelectDragIndicator />
									</SelectDragIndicatorWrapper>
									{prompt.map((item) => (
										<SelectItem
											key={item.id}
											value={String(item.id)}
											label={item.name}
										/>
									))}
								</SelectContent>
							</SelectPortal>
						</Select>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="outline"
							action="secondary"
							onPress={() => {
								setIsOpen(false);
							}}
						>
							<ButtonText>取消</ButtonText>
						</Button>
						<Button onPress={handleSavePrompt}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const DeleteRoomButton = () => {
	const { id } = useLocalSearchParams();
	const [, setIsOpen] = useAtom(modalAtom("deleteRoom"));
	return (
		<Pressable onPress={() => setIsOpen(true)}>
			<HStack space="sm" className="items-center">
				<Icon as={Trash2Icon} />
				<Text>删除房间</Text>
			</HStack>
		</Pressable>
	);
};

const DeleteRoomModal = () => {
	const [isOpen, setIsOpen] = useAtom(modalAtom("deleteRoom"));
	const { id } = useLocalSearchParams();
	const handleDeleteRoom = async () => {
		try {
			const result = await deleteRoomById(Number(id));
			if (!result) throw new Error("删除失败");
			toast.success("删除成功");
			setIsOpen(false);
			router.push("/(drawer)/message");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	return (
		<AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
			<AlertDialogBackdrop />
			<AlertDialogContent>
				<AlertDialogHeader>
					<Heading className="text-typography-950 font-semibold" size="md">
						你确定吗？
					</Heading>
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
					<Button action="negative" size="sm" onPress={handleDeleteRoom}>
						<ButtonText className="text-white">永别了</ButtonText>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

const ImportSillyTavernChatHistory = () => {
	const { id } = useLocalSearchParams();
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [historyPreview, setHistoryPreview] = React.useState<
		ConvertSillyTavernChatHistory[] | undefined
	>(undefined);
	const handlePick = async () => {
		try {
			const result = await pickSillyTavernChatHistory();
			if (result) {
				setHistoryPreview(result);
				toast.success("导入成功");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	const handleImport = async () => {
		try {
			if (!historyPreview) throw new Error("数据未准备");
			const result = await importSillyTavernChatHistory(
				Number(id),
				historyPreview,
			);
			if (result) {
				InteractionManager.runAfterInteractions(() => {
					setIsOpen(false);
					toast.success("导入成功");
					router.push("/(drawer)/message");
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
			console.log(error);
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<HStack space="sm" className="items-center">
					<Icon as={MessageSquareTextIcon} />
					<Text>导入酒馆 SillyTavern 记录</Text>
				</HStack>
			</Pressable>
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader>
						<HStack className="w-full justify-between items-center">
							<Heading>选择聊天记录文件</Heading>
							<Button onPress={handlePick}>
								<ButtonIcon as={ImportIcon} />
							</Button>
						</HStack>
					</ModalHeader>
					<ModalBody>
						<Text className="text-red-400">
							注意:此操作会覆盖房间聊天记录,当前版本导入长内容如卡死请重启应用
						</Text>
						{historyPreview && (
							<Box>
								<Text>{`共找到 ${historyPreview.length} 条记录`}</Text>
							</Box>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							variant="outline"
							action="secondary"
							onPress={() => setIsOpen(false)}
							size="sm"
						>
							<ButtonText>算了</ButtonText>
						</Button>

						<Button onPress={handleImport} isDisabled={!historyPreview}>
							<ButtonText>导入</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
