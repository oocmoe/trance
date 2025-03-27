import {
	HighlightedAssistantText,
	HighlightedUserText,
} from "@/components/highlighted";
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
import { useThemeRoomOptions } from "@/hook/theme";
import { modalAtom } from "@/store/core";
import { type RoomOptions, roomOptionsAtom } from "@/store/roomOptions";
import { createMessage, deleteMessageById } from "@/utils/db/message";
import { tranceHi } from "@/utils/message/middleware";
import { transformRenderMessage } from "@/utils/message/transform";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { atom, useAtom } from "jotai";
import { EllipsisIcon, SendIcon } from "lucide-react-native";
import React from "react";
import { Image, LogBox, Pressable, ScrollView } from "react-native";
import { toast } from "sonner-native";

if (__DEV__) {
	const ignoreErrors = ["Support for defaultProps will be removed"];

	const error = console.error;
	console.error = (...arg) => {
		for (const error of ignoreErrors) if (arg[0].includes(error)) return;
		error(...arg);
	};

	LogBox.ignoreLogs(ignoreErrors);
}

const actionBubbleAtom = atom<number>();

export default function RoomScreen() {
	const { id } = useLocalSearchParams();
	const [roomOptions, setRoomOptions] = useAtom(roomOptionsAtom);
	const themeRoomOptions = useThemeRoomOptions();
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
	console.log(roomOptions);
	if (room)
		return (
			<Box className="h-full">
				<Stack.Screen
					options={{
						...themeRoomOptions?.screenOptions,
						title: room.name,
						headerRight: () => {
							return <HeaderRight />;
						},
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
	return (
		<Button onPress={() => router.push(`/room/${id}/detail`)} variant="link">
			<ButtonIcon as={EllipsisIcon} />
		</Button>
	);
};

const MessagesList = () => {
	const { id } = useLocalSearchParams();
	const messages = useMessageByRoomId(Number(id));
	const scrollViewRef = React.useRef<ScrollView>(null);
	React.useEffect(() => {
		setTimeout(() => {
			if (scrollViewRef.current) {
				scrollViewRef.current.scrollToEnd({ animated: false });
			}
		}, 100);
	}, []);
	if (messages)
		return (
			<ScrollView ref={scrollViewRef}>
				<Box className="flex-1 p-3">
					<VStack space="md">
						{messages.map((item) => (
							<ChatBubble key={item.id} item={item} />
						))}
					</VStack>
				</Box>
			</ScrollView>
		);
};

const ChatBubble = ({ item }: { item: Messages }) => {
	const [actionBubble, setActionBubble] = useAtom(actionBubbleAtom);
	const [roomOptions] = useAtom(roomOptionsAtom);
	const [assistantaAvatar, setAssistantaAvatar] = React.useState<string>();
	const [chatBubbleModal, setChatBubbleModal] = useAtom(
		modalAtom("chatBubbleModal"),
	);
	const [content, setContent] = React.useState<string>();
	const themeRoomOptions = useThemeRoomOptions();
	if (roomOptions.personnel) {
		const character = useCharacterById(Number(roomOptions.personnel[0]));
		React.useEffect(() => {
			setAssistantaAvatar(character?.cover);
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
								style={themeRoomOptions?.componentOptions.assistantAvatar}
							/>
						) : (
							<Skeleton
								style={themeRoomOptions?.componentOptions.assistantAvatar}
							/>
						)}

						<Box style={themeRoomOptions?.componentOptions.assistantChatBubble}>
							{content ? (
								<HighlightedAssistantText str={content} />
							) : (
								<Skeleton className="w-24 h-4" />
							)}
						</Box>
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
						<Box style={themeRoomOptions?.componentOptions.userChatBubble}>
							{content ? (
								<HighlightedUserText str={content} />
							) : (
								<Skeleton className="w-full h-8" />
							)}
						</Box>
					</HStack>
				</Box>
			</Pressable>
		);
	}
};

const ChatBubbleLongPressModal = () => {
	const [actionBubble, setActionBubble] = useAtom(actionBubbleAtom);
	const [isOpen, setIsOpen] = useAtom(modalAtom("chatBubbleModal"));
	const handleDeleteMessage = async () => {
		try {
			if (!actionBubble) throw new Error("消息ID状态丢失");
			const rows = await deleteMessageById(actionBubble);
			if (rows) {
				setIsOpen(false);
				toast.success("删除成功");
			}
		} catch (error) {
			throw error instanceof Error
				? error.message
				: new Error("API远程请求失败");
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
				<ModalBackdrop />
				<ModalContent>
					<Pressable onPress={handleDeleteMessage}>
						<HStack className="justify-between items-center">
							<Text>删除</Text>
							<Icon as={TrashIcon} />
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
		<Box className="p-3">
			<HStack space="sm" className="justify-between items-center">
				<Input className="flex-1 h-auto min-h-[36px] max-h-[200px] overflow-y-auto resize-none">
					<InputField onChangeText={setUserInput} multiline value={userInput} />
				</Input>
				<Button
					onPress={handleSayHi}
					isDisabled={userInput?.length === 0 || isLoading}
				>
					{isLoading ? <ButtonSpinner /> : <ButtonIcon as={SendIcon} />}
				</Button>
			</HStack>
		</Box>
	);
};
