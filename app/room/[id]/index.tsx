import Icon from "@/components/Icon";
import { ChatBubbleAssistantImage } from "@/components/room-chatbubbleImage";
import { ChatBubbleAssistantText, ChatBubbleUserText } from "@/components/room-chatbubbleText";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { TRANCE_THEME_PROFILE_DEFAULT } from "@/constant/theme/default";
import { TRANCE_THEME_PROFILE_OCEAN } from "@/constant/theme/ocean";
import { TRANCE_THEME_PROFILE_PEACH } from "@/constant/theme/peach";
import {
	createRoomFloorMessage,
	createRoomNewMessage,
	deleteRoomFloorById,
	readRegexWithTranceHiTextRender,
	readRoomMessageRespawnUser,
	updateRoomFloorMessagePagination,
} from "@/db/client";
import type { RoomFloorTable, RoomMessageTable } from "@/db/schema";
import { useCharacterCoverById } from "@/hook/useCharacter";
import {
	useRoomById,
	useRoomFloorListByRoomId,
	useRoomMessageByRoomFloorId,
	useRoomOptionsById,
	useRoomTheme,
} from "@/hook/useRoom";
import { tranceUserAvatarAtom } from "@/store/core";
import { TranceRoomThemeConfig, type TranceChatBubbleMessage, type TranceHi } from "@/types/trance.types";
import { tranceHi } from "@/utils/message";
import { transformChatBubbleMessage, transformRegexText, transformUserPlaceholder } from "@/utils/transform";
import { Image, ImageBackground } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { atom, useAtom, useAtomValue } from "jotai";
import {
	ArrowLeftCircle,
	ArrowRightCircle,
	CircleChevronDown,
	Ellipsis,
	MessageSquareDiff,
	MessageSquareHeart,
	Pen,
	PlusCircle,
	Send,
	Settings,
	Trash,
	X,
} from "lucide-react-native";
import { cssInterop } from "nativewind";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "~/components/ui/context-menu";

// nativewind
cssInterop(Input, { className: "style" });

// jotai
const isSendingAtom = atom<boolean>(false);
// const theme = TRANCE_THEME_PROFILE_OCEAN.light;

export default function RoomScreen() {
	const { id } = useLocalSearchParams();
	const room = useRoomById(Number(id));
	const theme = useRoomTheme(Number(id));
	if (theme)
		return (
			<>
				<Stack.Screen
					options={{
						title: room.name,
						headerRight: () => (
							<Pressable onPress={() => router.push(`/room/${id}/option`)}>
								<Icon as={Ellipsis} style={{ color: theme.stackOptions.headerTintColor }} />
							</Pressable>
						),
						...theme.stackOptions,
					}}
				/>
				<View className="flex-1 w-full">
					{theme.imageBackground.render === "character" && (
						<View className="flex-1">
							<ImageBackground
								source={theme.imageBackground.customImage ? theme.imageBackground.customImage : room.cover}
								style={theme.imageBackground.backgroundStyle}
								blurRadius={theme.imageBackground.blurRadius}
							>
								<View style={theme.imageBackground.overlay} />
								{theme.stackOptions.headerShown === false && <SafeAreaView />}
								<RoomFloorList />
								<UserActionBar />
							</ImageBackground>
						</View>
					)}
					{theme.imageBackground.render === "none" && (
						<>
							<RoomFloorList />
							<UserActionBar />
						</>
					)}
				</View>
			</>
		);
}

function RoomFloorList() {
	const { id } = useLocalSearchParams();
	const roomFloor = useRoomFloorListByRoomId(Number(id));
	if (roomFloor.length > 0)
		return (
			<FlatList
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "flex-end",
					padding: 16,
				}}
				data={roomFloor}
				renderItem={({ item }) => <RoomFloor roomFloor={item} />}
				inverted
			/>
		);
}

function RoomFloor({ roomFloor }: { roomFloor: RoomFloorTable }) {
	const { id } = useLocalSearchParams();
	const theme = useRoomTheme(Number(id));
	if (theme) {
		if (roomFloor.is_sender === 0) {
			return (
				<View style={theme.roomFloor.sender0}>
					{theme.avatar.is_ShowAssistantAvatar && (
						<ChatCharacterAvatar character_id={roomFloor.character_id as number} />
					)}

					<ChatBubble roomFloor={roomFloor} />
				</View>
			);
		}
		if (roomFloor.is_sender === 1) {
			return (
				<View style={theme.roomFloor.sender1}>
					<ChatBubble roomFloor={roomFloor} />
					{theme.avatar.is_ShowUserAvatar && <ChatUserAvatar />}
				</View>
			);
		}
	}
}

function ChatBubble({ roomFloor }: { roomFloor: RoomFloorTable }) {
	const { id } = useLocalSearchParams();
	// context menu
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom + 24,
		left: 12,
		right: 12,
	};

	// message init
	const messages = useRoomMessageByRoomFloorId(roomFloor.id);
	const [message, setMessage] = React.useState<RoomMessageTable | undefined>(undefined);
	const [messageIndex, setMessageIndex] = React.useState<number>(0);
	const room = useRoomById(Number(id));
	const roomOptions = useRoomOptionsById(Number(id));
	React.useEffect(() => {
		if (!messages) return;
		setMessage(messages.find((item) => item.id === roomFloor.room_message_sort[0]));
	}, [roomFloor, messages]);

	React.useEffect(() => {
		const transformMessage = async () => {
			try {
				if (!message) {
					return;
				}
				const regex = await readRegexWithTranceHiTextRender(roomFloor.character_id as number);
				const transformRegexMessage = transformRegexText(message.content, regex);
				message.content = transformRegexMessage;
				setMessage(message);
			} catch (error) {
				console.log(error);
				toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
			}
		};
		if (!message) return;
		transformMessage();
	}, [message, roomFloor.character_id]);

	// action
	const [isMessageIndexChangeShow, setIsMessageIndexChangeShow] = React.useState<boolean>(false);
	const [isSending, setIsSending] = useAtom(isSendingAtom);
	const handleRespawnMessage = async () => {
		setIsSending(true);
		if(!messages) return
		try {
			const userLatestInput = await readRoomMessageRespawnUser(Number(id),roomFloor.id)
			const hi: TranceHi = {
				userLatestInput:userLatestInput.content,
				userLatestInputId:userLatestInput.id,
				type: "text",
				room_id: Number(id),
				room_floor_id: roomFloor.id,
				personnel: room.personnel,
				prompt_group_id: roomOptions.prompt_group_id || undefined,
				is_Respawn: true,
				model: {
					model_name: roomOptions.model?.name as string,
					model_version: roomOptions.model?.version as string,
					is_Stream: false,
				},
			};
			const result = await tranceHi(hi);
			if (result) {
				const props = {
					role: "assistant" as const,
					content: result,
					type: "text" as const,
					room_floor_id: roomFloor.id,
				};
				await createRoomFloorMessage(roomFloor.id, props);
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		} finally {
			setIsSending(false);
		}
	};
	if (message)
		return (
			<View>
				<ContextMenu>
					<ContextMenuTrigger className="active:opacity-80">
						{message ? (
							<View>
								<ChatBubbleMessageMiddleware roomFloor={roomFloor} messages={message} />
							</View>
						) : (
							<Skeleton className="w-64 h-16" />
						)}
					</ContextMenuTrigger>

					<ContextMenuContent align="start" insets={contentInsets} className="w-64 p-2">
						<ContextMenuItem
							onPress={() =>
								router.push({
									pathname: "/room/[id]/roomFloorMessageContentEditModal",
									params: { id: id as string, roomMessageId: roomFloor.room_message_sort[0] },
								})
							}
							className="flex flex-row items-center gap-x-2"
						>
							<Icon as={Pen} />
							<Text>编辑内容</Text>
						</ContextMenuItem>
						{/* <ContextMenuItem className="flex flex-row items-center gap-x-2">
						<Icon as={Copy} />
						<Text>复制消息</Text>
					</ContextMenuItem>
					<ContextMenuItem className="flex flex-row items-center gap-x-2">
						<Icon as={BookCopy} />
						<Text>复制源消息</Text>
					</ContextMenuItem> */}
						{roomFloor.is_sender === 0 && (
							<ContextMenuItem onPress={handleRespawnMessage} className="flex flex-row items-center gap-x-2">
								<Icon as={MessageSquareDiff} />
								<Text>再次生成</Text>
							</ContextMenuItem>
						)}
						<ContextMenuItem
							onPress={() => setIsMessageIndexChangeShow(true)}
							className="flex flex-row items-center gap-x-2"
						>
							<Icon as={MessageSquareHeart} />
							<Text>选择回复</Text>
						</ContextMenuItem>
						<ContextMenuItem
							onPress={async () => await deleteRoomFloorById(roomFloor.id)}
							className="flex flex-1 flex-row items-center gap-x-2"
						>
							<Icon as={Trash} />
							<Text className="text-red-400">删除消息</Text>
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
				{isMessageIndexChangeShow && (
					<ChatBubbleFloorMessagePagination
						floor={roomFloor}
						messageIndex={messageIndex}
						setIsShow={setIsMessageIndexChangeShow}
						setMessageIndex={setMessageIndex}
					/>
				)}
			</View>
		);
}

function ChatBubbleFloorMessagePagination({
	floor,
	messageIndex,
	setIsShow,
	setMessageIndex,
}: {
	floor: RoomFloorTable;
	messageIndex: number;
	setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
	setMessageIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
	const maxIndex = floor.room_message_sort.length;
	const handlePagination = async (direction: "next" | "previous") => {
		try {
			const result = await updateRoomFloorMessagePagination(floor.id, direction);
			if (!result) return;
			if (direction === "next") {
				setMessageIndex(messageIndex === maxIndex - 1 ? 0 : messageIndex + 1);
			} else {
				setMessageIndex(messageIndex === 0 ? maxIndex - 1 : messageIndex - 1);
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center px-2 mt-4">
			<View className="flex flex-row items-center gap-x-4">
				<Pressable onPress={() => setIsShow(false)}>
					<Icon as={X} />
				</Pressable>
				<Text>
					{messageIndex + 1} / {maxIndex}
				</Text>
			</View>
			<View className="flex flex-row items-center gap-x-4">
				<Pressable onPress={() => handlePagination("previous")}>
					<Icon as={ArrowLeftCircle} />
				</Pressable>
				<Pressable onPress={() => handlePagination("next")}>
					<Icon as={ArrowRightCircle} />
				</Pressable>
			</View>
		</View>
	);
}

function ChatBubbleMessageMiddleware({
	roomFloor,
	messages,
}: { roomFloor: RoomFloorTable; messages: RoomMessageTable }) {
	const { id } = useLocalSearchParams();
	const [renderMessage, setRenderMessage] = React.useState<TranceChatBubbleMessage | undefined>(undefined);
	const theme = useRoomTheme(Number(id));
	React.useEffect(() => {
		const initMessage = async () => {
			try {
				const regex = await readRegexWithTranceHiTextRender(roomFloor.character_id as number);
				const transformRegexMessage = transformRegexText(messages.content, regex);
				const userRegexContent = await transformUserPlaceholder(transformRegexMessage);
				messages.content = userRegexContent;
				const transformMessage = transformChatBubbleMessage(messages);
				setRenderMessage(transformMessage);
			} catch (error) {
				console.error(error);
				toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
			}
		};
		initMessage();
	}, [messages, roomFloor]);
	if (theme) {
		if (renderMessage?.role === "assistant") {
			return (
				<View className="flex flex-col gap-y-0.5">
					{renderMessage.message.map((item) => {
						if (item.type === "text")
							return <ChatBubbleAssistantText key={item.id} str={item.content[0]} theme={theme} />;
						if (item.type === "image") return <ChatBubbleAssistantImage key={item.id} gallery={item.content} />;
					})}
				</View>
			);
		}
		if (renderMessage?.role === "user") {
			return (
				<View>
					{renderMessage.message.map((item) => (
						<ChatBubbleUserText key={item.id} str={item.content[0]} theme={theme} />
					))}
				</View>
			);
		}
		if (renderMessage?.role === "system") {
			return (
				<View>
					<Text>System</Text>
				</View>
			);
		}
	}
}

function UserActionBar() {
	const { id } = useLocalSearchParams();
	const [isFold, setIsFold] = React.useState<boolean>(false);
	const [inputHeight, setInputHeight] = React.useState<number>(32);
	const [userInputText, setUserInputText] = React.useState<string>("");
	const [isSending, setIsSending] = useAtom(isSendingAtom);
	const roomOptions = useRoomOptionsById(Number(id));
	const room = useRoomById(Number(id));
	const theme = useRoomTheme(Number(id));
	// input height change

	const handleTranceSayHi = async () => {
		if (userInputText.length === 0) return;
		const userInputTemp = userInputText;
		setUserInputText("");
		setIsSending(true);
		try {
			const newMessageProps = {
				room_id: Number(id),
				type: "text" as const,
				role: "user" as const,
				content: userInputText,
				is_sender: 1,
			};
			const userResultId = await createRoomNewMessage(newMessageProps);
			const hi: TranceHi = {
				userLatestInput: userInputText,
				userLatestInputId: userResultId,
				type: "text",
				room_id: Number(id),
				personnel: room.personnel,
				prompt_group_id: roomOptions.prompt_group_id || undefined,
				is_Respawn: false,
				model: {
					model_name: roomOptions.model?.name as string,
					model_version: roomOptions.model?.version as string,
					is_Stream: false,
				},
			};
			const result = await tranceHi(hi);
			if (result) {
				await createRoomNewMessage({
					room_id: Number(id),
					character_id: room.personnel[0],
					type: "text",
					content: result,
					role: "assistant",
					is_sender: 0,
				});
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
			setUserInputText(userInputTemp);
		} finally {
			setIsSending(false);
		}
	};
	if (theme)
		return (
			<View style={theme.actionBar.ActionBarStyle}>
				<View className="flex flex-row justify-between items-center gap-x-4">
					<Pressable onPress={() => setIsFold(!isFold)}>
						<Icon as={isFold ? CircleChevronDown : PlusCircle} />
					</Pressable>

					<View className="flex-1">
						<Input
							style={theme.actionBar.TextInputStyle}
							className="border rounded-md px-3 flex-1"
							textAlignVertical="auto"
							multiline
							value={userInputText}
							onChangeText={setUserInputText}
							numberOfLines={3}
						/>
					</View>
					<View>
						<Pressable style={theme.actionBar.SendButton.buttonStyle} onPress={handleTranceSayHi}>
							{isSending ? (
								<ActivityIndicator size={"small"} color={"#9ca3af"} />
							) : (
								<>
									{theme.actionBar.SendButton.is_ShowText && (
										<Text style={theme.actionBar.SendButton.buttonTextStyle}>
											{theme.actionBar.SendButton.buttonText.length > 0
												? theme.actionBar.SendButton.buttonText
												: "发送"}
										</Text>
									)}
									{theme.actionBar.SendButton.is_ShowIcon && (
										<Icon style={theme.actionBar.SendButton.buttonIconStyle} as={Send} />
									)}
								</>
							)}
						</Pressable>
					</View>
				</View>
				{isFold && <UserActionBarFold />}
			</View>
		);
}

function UserActionBarFold() {
	const { id } = useLocalSearchParams();
	return (
		<View className="p-3">
			<View className="flex flex-col">
				<View className="flex flex-row">
					<Pressable
						onPress={() => router.push(`/room/${id}/option`)}
						className="flex flex-col gap-y-1 justify-center items-center active:opacity-80"
					>
						<Card className="p-3">
							<Icon as={Settings} />
						</Card>

						<Text>房间设置</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

function ChatCharacterAvatar({ character_id }: { character_id: number }) {
	const { id } = useLocalSearchParams();
	const theme = useRoomTheme(Number(id));
	const cover = useCharacterCoverById(character_id);
	if (theme)
		return (
			<Pressable onPress={() => router.push(`/character/${character_id}`)}>
				<Image style={theme.avatar.assistant} source={cover} alt="Character Cover" />
			</Pressable>
		);
}

function ChatUserAvatar() {
	const { id } = useLocalSearchParams();
	const theme = useRoomTheme(Number(id));
	const cover = useAtomValue(tranceUserAvatarAtom);
	if (theme) return <Image style={theme.avatar.user} source={cover} alt="User Avatar" />;
}
