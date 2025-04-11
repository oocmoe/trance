import { HighlightedAssistantText } from "@/components/highlighted";
import { Box } from "@/components/ui/box";
import {
	Button,
	ButtonIcon,
	ButtonSpinner,
	ButtonText,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, CloseIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { Portal } from "@/components/ui/portal";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { Messages } from "@/db/schema/message";
import { useCharacterById } from "@/hook/character";
import {
	useMessageById,
	useMessageByRoomId,
	useMessageDescByRoomId,
	useMessageRecordByRoomId,
} from "@/hook/message";
import { useRoomById } from "@/hook/room";
import { useThemeRoom, useThemeStack, useTranceTheme } from "@/hook/theme";
import { USER_avtarAtom, USER_nameAtom, modalAtom } from "@/store/core";
import { type RoomOptions, roomOptionsAtom } from "@/store/roomOptions";
import { colorModeAtom, tranceThemeAtom } from "@/store/theme";
import {
	createMessage,
	deleteMessageById,
	readMessageContentById,
	updateMessageGroupToFirst,
	updateMessageGroupToLast,
	updatePushMessage,
} from "@/utils/db/message";
import { tranceHi } from "@/utils/message/middleware";
import { transformRenderMessage } from "@/utils/message/transform";
import * as Clipboard from "expo-clipboard";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { atom, useAtom } from "jotai";
import {
	ArrowLeft,
	ArrowRight,
	BookCopyIcon,
	CopyIcon,
	EllipsisIcon,
	MessageCircle,
	MessageCircleMore,
	MessageCirclePlus,
	SendHorizonalIcon,
} from "lucide-react-native";
import { Message } from "openai/resources/beta/threads/messages";
import React from "react";
import { FlatList, Image, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";

const actionBubbleAtom = atom<number>();
const actionBarLoadingAtom = atom<boolean>(false);
const chatBubbleMessageGroupModalAtom = atom<boolean>(false);

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
				model: room.model ?? undefined,
				prompt: room.prompt ?? undefined,
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
				<ChatBubbleMessageGroup />
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
	const [offset, setOffset] = React.useState<number>(10);
	const [isMessageLoading, setIsMessageLoading] =
		React.useState<boolean>(false);

	const messages = useMessageDescByRoomId(Number(id));

	React.useEffect(() => {
		setMessageLists(messages);
	}, [messages]);

	return (
		<FlatList
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: "flex-end",
				padding: 16,
			}}
			data={messageLists}
			onEndReachedThreshold={0.2}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => <ChatBubble item={item} />}
			ItemSeparatorComponent={() => <Box style={{ height: 16 }} />}
			inverted
		/>
	);
};

const ChatBubble = ({ item }: { item: Messages }) => {
	const [, setRoomOptions] = useAtom(roomOptionsAtom);
	const [roomOptions] = useAtom(roomOptionsAtom);
	const [assistantaAvatar, setAssistantaAvatar] = React.useState<string>();
	const [assistantaName, setAssistantaName] = React.useState<string>();
	const [userAvatar] = useAtom(USER_avtarAtom);
	const [userName] = useAtom(USER_nameAtom);
	const [actionBubble, setActionBubble] = useAtom(actionBubbleAtom);
	const [chatBubbleModal, setChatBubbleModal] = useAtom(
		modalAtom("chatBubbleModal"),
	);
	const [content, setContent] = React.useState<string>();
	const themeConfig = useTranceTheme();
	if (roomOptions.personnel) {
		const character = useCharacterById(Number(roomOptions.personnel));
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
			const result = await transformRenderMessage(item.content[0]);
			setContent(result);
		};
		pureMessage();
	}, [item.content]);
	// Assistant
	if (item.is_Sender === 0) {
		return (
			<Pressable onLongPress={() => handleLongPressBubble(item.id)}>
				<Box>
					<HStack className="max-w-[80%]" space="sm">
						{themeConfig.Room.profile.is_AssistantAvatarShow &&
							(assistantaAvatar ? (
								<Pressable
									onPress={() =>
										router.push(`/character/${roomOptions.personnel}`)
									}
								>
									<Image
										source={{ uri: assistantaAvatar }}
										alt="avatar"
										style={themeConfig.Room?.componentStyle?.assistantAvatar}
									/>
								</Pressable>
							) : (
								<Skeleton
									style={themeConfig.Room?.componentStyle?.assistantAvatar}
								/>
							))}

						{content ? (
							<VStack>
								{themeConfig.Room.profile.is_AssistantNameShow && (
									<Text style={themeConfig.Room.componentStyle?.assistantName}>
										{assistantaName}
									</Text>
								)}

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
				<Box className="max-w-[70%] ml-[30%]">
					<HStack space="sm" className="self-end">
						{content ? (
							<VStack className="items-end">
								{themeConfig.Room.profile.is_UserNameShow && (
									<Text style={themeConfig.Room.componentStyle?.assistantName}>
										{userName}
									</Text>
								)}
								<Box
									className=""
									style={themeConfig.Room?.componentStyle?.userChatBubble}
								>
									<HighlightedAssistantText str={content} />
								</Box>
							</VStack>
						) : (
							<Skeleton
								className="w-24 h-8  rounded-sm"
								style={themeConfig.Room?.componentStyle?.userChatBubble}
							/>
						)}
						{themeConfig.Room.profile.is_UserAvatarShow &&
							(userAvatar ? (
								<Image
									source={{ uri: userAvatar }}
									alt="avatar"
									style={themeConfig.Room?.componentStyle?.userAvatar}
								/>
							) : (
								<Skeleton
									style={themeConfig.Room?.componentStyle?.userAvatar}
								/>
							))}
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
	const messages = useMessageByRoomId(Number(id));
	const message = messages.find((item) => item.id === actionBubble);
	const [isActionBarLoading, setIsActionBarLoading] =
		useAtom(actionBarLoadingAtom);
	const [isOpen, setIsOpen] = useAtom(modalAtom("chatBubbleModal"));
	const [isChatBubbleMessageGroupModal, setIsChatBubbleMessageGroupModal] =
		useAtom(chatBubbleMessageGroupModalAtom);
	const handleDeleteMessage = async () => {
		try {
			if (!actionBubble) throw new Error("消息ID状态丢失");
			const rows = await deleteMessageById(actionBubble);
			if (rows) {
				setIsOpen(false);
				toast.success("删除成功");
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : "未知错误";
			toast.error(message);
		}
	};
	const handleCopySource = async () => {
		try {
			if (!actionBubble) throw new Error("消息ID状态丢失");
			const message = messages.find((item) => item.id === actionBubble);
			if (!message) throw new Error("消息状态丢失");
			await Clipboard.setStringAsync(message.content[0]);
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
			const result = await transformRenderMessage(message.content[0]);
			await Clipboard.setStringAsync(result);
			setIsOpen(false);
			toast.success("复制成功");
		} catch (error) {
			throw error instanceof Error ? error.message : new Error("未知错误");
		}
	};
	const handleAnotherMessage = async () => {
		try {
			setIsActionBarLoading(true);
			if (!actionBubble) throw new Error("消息ID状态丢失");
			const lastUserContent = messages.at(-2)?.content[0];
			if (!lastUserContent) throw new Error("暂不支持首个消息或无用户回复");
			const message = messages.find((item) => item.id === actionBubble);
			if (!message) throw new Error("消息状态丢失");
			setIsOpen(false);
			const result = await tranceHi(
				lastUserContent,
				"text",
				roomOptions as RoomOptions,
				actionBubble,
			);
			if (!result) {
				toast.error("生成新消息失败");
				return;
			}
			const rows = await updatePushMessage(actionBubble, result as string);
			if (rows) {
				toast.success("生成新消息成功");
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : "未知错误";
			toast.error(message);
		} finally {
			setIsActionBarLoading(false);
		}
	};

	const handleBubbleMessageGroup = () => {
		setIsOpen(false);
		setIsChatBubbleMessageGroupModal(true);
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
					{message?.is_Sender === 0 && (
						<Pressable onPress={handleAnotherMessage}>
							<HStack className="justify-between items-center">
								<Text>生成新消息</Text>
								<Icon as={MessageCirclePlus} />
							</HStack>
						</Pressable>
					)}
					{message?.is_Sender === 0 && (
						<Pressable onPress={handleBubbleMessageGroup}>
							<HStack className="justify-between items-center">
								<Text>查看消息组</Text>
								<Icon as={MessageCircleMore} />
							</HStack>
						</Pressable>
					)}
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

const ChatBubbleMessageGroup = () => {
	const [isOpen, setIsOpen] = useAtom(chatBubbleMessageGroupModalAtom);
	const [actionBubble] = useAtom(actionBubbleAtom);

	const handleChangeMessage = async (way: "left" | "right") => {
		if (!actionBubble) {
			toast.error("消息状态丢失");
			return;
		}
		try {
			if (way === "left") {
				await updateMessageGroupToLast(actionBubble);
			}
			await updateMessageGroupToFirst(actionBubble);
		} catch (error) {
			const message = error instanceof Error ? error.message : "未知错误";
			toast.error(message);
		}
	};
	if (isOpen)
		return (
			<Box>
				<Fab
					onPress={() => handleChangeMessage("left")}
					size="sm"
					placement="bottom left"
					isHovered={false}
					isDisabled={false}
					isPressed={false}
				>
					<FabIcon as={ArrowLeft} />
				</Fab>
				<Fab
					onPress={() => setIsOpen(false)}
					size="sm"
					placement="bottom center"
					isHovered={false}
					isDisabled={false}
					isPressed={false}
				>
					<FabIcon as={CloseIcon} />
				</Fab>
				<Fab
					onPress={() => handleChangeMessage("right")}
					size="sm"
					placement="bottom right"
					isHovered={false}
					isDisabled={false}
					isPressed={false}
				>
					<FabIcon as={ArrowRight} />
				</Fab>
			</Box>
		);
};

const ActionBar = () => {
	const [userInput, setUserInput] = React.useState<string>();
	const [isLoading, setIsLoading] = useAtom(actionBarLoadingAtom);
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
				{themeConfig.componentStyle?.sendButtonText ? (
					<Button
						onPress={handleSayHi}
						isDisabled={userInput?.length === 0 || isLoading}
						style={themeConfig.componentStyle?.sendButton}
					>
						{isLoading ? (
							<ButtonSpinner />
						) : (
							<ButtonText style={themeConfig.componentStyle?.sendButtonText}>
								发送
							</ButtonText>
						)}
					</Button>
				) : (
					<Button
						onPress={handleSayHi}
						isDisabled={userInput?.length === 0 || isLoading}
						style={themeConfig.componentStyle?.sendButton}
					>
						{isLoading ? (
							<ButtonSpinner />
						) : (
							<ButtonIcon
								style={themeConfig.componentStyle?.sendButtonIcon}
								as={SendHorizonalIcon}
							/>
						)}
					</Button>
				)}
			</HStack>
		</Box>
	);
};
