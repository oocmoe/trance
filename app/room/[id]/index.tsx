import { HighlightedAssistantText } from "@/components/highlighted";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonSpinner } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon, TrashIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { Messages } from "@/db/schema/message";
import { useCharacterById } from "@/hook/character";
import { useMessageByRoomId } from "@/hook/message";
import { useRoomById } from "@/hook/room";
import { useThemeRoom, useThemeStack, useTranceTheme } from "@/hook/theme";
import { modalAtom } from "@/store/core";
import { type RoomOptions, roomOptionsAtom } from "@/store/roomOptions";
import { colorModeAtom, tranceThemeAtom } from "@/store/theme";
import {
	createMessage,
	deleteMessageById,
	readMessageDescByIdOffset,
} from "@/utils/db/message";
import { tranceHi } from "@/utils/message/middleware";
import { transformRenderMessage } from "@/utils/message/transform";
import * as Clipboard from "expo-clipboard";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { atom, useAtom } from "jotai";
import {
	BookCopyIcon,
	CopyIcon,
	EllipsisIcon,
	SendHorizonalIcon,
} from "lucide-react-native";
import React from "react";
import { FlatList, Image, Pressable } from "react-native";
import { toast } from "sonner-native";

const actionBubbleAtom = atom<number>();

export default function RoomScreen() {
	const { id } = useLocalSearchParams();
	const [, setRoomOptions] = useAtom(roomOptionsAtom);
	const [colorMode] = useAtom(colorModeAtom);
	const [themeConfig] = useAtom(tranceThemeAtom);
	const room = useRoomById(Number(id));
	React.useEffect(() => {
		if (room) {
			setRoomOptions({
				id: Number(id),
				model: room.model,
				prompt: room.prompt,
				personnel: room.personnel,
			});
		}
	}, [id, room, setRoomOptions]);
	if (room)
		return (
			<Box className="h-full">
				<Stack.Screen
					options={{
						title: room.name,
						headerRight: () => <HeaderRight />,
					}}
				/>
				<MessagesList />
				<ActionBar />
				<ChatBubbleLongPressModal />
			</Box>
		);
	return <RoomSkeleton />;
}

const RoomSkeleton = () => {
	return (
		<Box className="h-full">
			<Skeleton className="h-full" />
		</Box>
	);
};

const HeaderRight = () => {
	const { id } = useLocalSearchParams();
	const themeConfig = useThemeStack();
	return (
		<Button onPress={() => router.push(`/room/${id}/detail`)} variant="link">
			<ButtonIcon
				style={{
					color: themeConfig.options.headerTintColor,
				}}
				as={EllipsisIcon}
			/>
		</Button>
	);
};

const MessagesList = () => {
	const { id } = useLocalSearchParams();
	const [messageLists, setMessageLists] = React.useState<Messages[]>([]);
	const [offset, setOffset] = React.useState<number>(0);
	const [isMessageLoading, setIsMessageLoading] =
		React.useState<boolean>(false);

	const handleOnEndReached = async () => {
		try {
			if (isMessageLoading) return;
			setIsMessageLoading(true);
			const newMessages = readMessageDescByIdOffset(Number(id), offset);
			setMessageLists([...messageLists, ...(await newMessages)]);
			setOffset(offset + 10);
			setIsMessageLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<FlatList
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: "flex-end",
				padding: 16,
			}}
			data={messageLists}
			onEndReachedThreshold={0.2}
			onEndReached={handleOnEndReached}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => <ChatBubble item={item} />}
			ItemSeparatorComponent={() => <Box style={{ height: 16 }} />}
			inverted
		/>
	);
};

const ChatBubble = ({ item }: { item: Messages }) => {
	const [, setRoomOptions] = useAtom(roomOptionsAtom);
	const [actionBubble, setActionBubble] = useAtom(actionBubbleAtom);
	const [roomOptions] = useAtom(roomOptionsAtom);
	const [assistantaAvatar, setAssistantaAvatar] = React.useState<string>();
	const [assistantaName, setAssistantaName] = React.useState<string>();
	const [chatBubbleModal, setChatBubbleModal] = useAtom(
		modalAtom("chatBubbleModal"),
	);
	const [content, setContent] = React.useState<string>();
	const themeConfig = useTranceTheme();
	if (roomOptions.personnel) {
		const character = useCharacterById(Number(roomOptions.personnel[0]));
		React.useEffect(() => {
			setAssistantaAvatar(character?.cover);
			setAssistantaName(character?.name);
		}, [character]);
	}
	const handleLongPressBubble = (id: number) => {
		setActionBubble(id);
		setChatBubbleModal(true);
	};
	React.useEffect(() => {
		const pureMessage = async () => {
			const result = await transformRenderMessage(item.content);
			setContent(result);
		};
		pureMessage();
	}, [item.content]);
	// Assistant
	if (item.is_Sender === 0) {
		return (
			<Pressable onLongPress={() => handleLongPressBubble(item.id)}>
				<Box>
					<HStack className="max-w-[80%]" space="md">
						{assistantaAvatar ? (
							<Image
								source={{ uri: assistantaAvatar }}
								alt="avatar"
								style={themeConfig.Room?.componentStyle?.assistantAvatar}
							/>
						) : (
							<Skeleton
								style={themeConfig.Room?.componentStyle?.assistantAvatar}
							/>
						)}
						{content ? (
							<VStack>
								<Text style={themeConfig.Room.componentStyle?.assistantName}>
									{assistantaName}
								</Text>

								<Box
									style={themeConfig.Room?.componentStyle?.assistantChatBubble}
								>
									<HighlightedAssistantText str={content} />
								</Box>
							</VStack>
						) : (
							<Skeleton
								className="w-32 h-8 rounded-sm"
								style={themeConfig.Room?.componentStyle?.assistantChatBubble}
							/>
						)}
					</HStack>
				</Box>
			</Pressable>
		);
	}
	// User
	if (item.is_Sender === 1) {
		return (
			<Pressable onLongPress={() => handleLongPressBubble(item.id)}>
				<Box>
					<HStack className="max-w-[75%] self-end">
						{content ? (
							<Box style={themeConfig.Room?.componentStyle?.userChatBubble}>
								<HighlightedAssistantText str={content} />
							</Box>
						) : (
							<Skeleton
								className="w-24 h-8  rounded-sm"
								style={themeConfig.Room?.componentStyle?.userChatBubble}
							/>
						)}
					</HStack>
				</Box>
			</Pressable>
		);
	}
};

const ChatBubbleLongPressModal = () => {
	const { id } = useLocalSearchParams();
	const [roomOptions] = useAtom(roomOptionsAtom);
	const [actionBubble, setActionBubble] = useAtom(actionBubbleAtom);
	const [isOpen, setIsOpen] = useAtom(modalAtom("chatBubbleModal"));
	const messages = useMessageByRoomId(Number(id));
	const handleDeleteMessage = async () => {
		try {
			if (!actionBubble) throw new Error("消息ID状态丢失");
			const rows = await deleteMessageById(actionBubble);
			if (rows) {
				setIsOpen(false);
				toast.success("删除成功");
			}
		} catch (error) {
			throw error instanceof Error ? error.message : new Error("未知错误");
		}
	};
	const handleCopySource = async () => {
		try {
			if (!actionBubble) throw new Error("消息ID状态丢失");
			const message = messages.find((item) => item.id === actionBubble);
			if (!message) throw new Error("消息状态丢失");
			await Clipboard.setStringAsync(message.content);
			setIsOpen(false);
			toast.success("复制成功");
		} catch (error) {
			throw error instanceof Error ? error.message : new Error("未知错误");
		}
	};

	const handleCopy = async () => {
		try {
			if (!actionBubble) throw new Error("消息ID状态丢失");
			const message = messages.find((item) => item.id === actionBubble);
			if (!message) throw new Error("消息状态丢失");
			const result = await transformRenderMessage(message.content);
			await Clipboard.setStringAsync(result);
			setIsOpen(false);
			toast.success("复制成功");
		} catch (error) {
			throw error instanceof Error ? error.message : new Error("未知错误");
		}
	};
	return (
		<Box>
			<Modal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
					setActionBubble(undefined);
				}}
				size="xs"
			>
				<ModalBackdrop className="bg-transparent" />
				<ModalContent className="gap-y-8">
					<Pressable onPress={handleCopy}>
						<HStack className="justify-between items-center">
							<Text>复制消息</Text>
							<Icon as={CopyIcon} />
						</HStack>
					</Pressable>
					<Pressable onPress={handleCopySource}>
						<HStack className="justify-between items-center">
							<Text>复制源消息</Text>
							<Icon as={BookCopyIcon} />
						</HStack>
					</Pressable>
					<Pressable onPress={handleDeleteMessage}>
						<HStack className="justify-between items-center">
							<Text className="text-red-500">删除</Text>
							<Icon color="red" as={TrashIcon} />
						</HStack>
					</Pressable>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const ActionBar = () => {
	const [userInput, setUserInput] = React.useState<string>();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [roomOptions] = useAtom(roomOptionsAtom);
	const themeConfig = useThemeRoom();
	const handleSayHi = async () => {
		const userInputTemp = userInput;
		try {
			setIsLoading(true);
			if (!userInput) throw new Error("输入内容不能为空");
			if (!roomOptions.id) throw new Error("房间未初始化");

			setUserInput("");
			const saveUserInputResult = await createMessage(
				roomOptions.id,
				"text",
				1,
				userInput,
				"user",
			);
			if (!saveUserInputResult) throw new Error("保存用户输入失败");
			const result = await tranceHi(
				userInput,
				"text",
				roomOptions as RoomOptions,
			);
			const rows = await createMessage(
				roomOptions.id,
				"text",
				0,
				result as string,
				"assistant",
			);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				setUserInput(userInputTemp);
				return;
			}
			setUserInput(userInputTemp);
			toast.error("未知错误");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Box style={themeConfig.componentStyle?.actionBar} className="p-3">
			<HStack space="sm" className="justify-between items-center">
				<Input className="flex-1 h-auto min-h-[36px] max-h-[200px] overflow-y-auto resize-none">
					<InputField
						style={themeConfig.componentStyle?.userInputField}
						onChangeText={setUserInput}
						multiline
						value={userInput}
					/>
				</Input>
				<Button
					onPress={handleSayHi}
					isDisabled={userInput?.length === 0 || isLoading}
					style={themeConfig.componentStyle?.sendButton}
				>
					{isLoading ? (
						<ButtonSpinner />
					) : (
						<ButtonIcon as={SendHorizonalIcon} />
					)}
				</Button>
			</HStack>
		</Box>
	);
};
