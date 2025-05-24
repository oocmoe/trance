import { ButtonEditTrigger } from "@/components/button-editTrigger";
import { TextEditor } from "@/components/editor/textEditor";
import Icon from "@/components/Icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateKnowledgeEntryField, updateRoomFloorMessageField } from "@/db/client";
import { useKnowledgeEntryById } from "@/hook/useKnowledgeBase";
import { usePreventBackIfEditing } from "@/hook/usePreventBackIfEditing";
import { useRoomMessageById } from "@/hook/useRoom";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { atom, useAtom } from "jotai";
import { Edit } from "lucide-react-native";
import React from "react";
import { ScrollView, TextInput, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { toast } from "sonner-native";

const isEditingAtom = atom<boolean>(false);
const contentAtom = atom<string>("");

export default function RoomFloorMessageContentEditModal() {
  const { roomMessageId } = useLocalSearchParams()
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	const [content] = useAtom(contentAtom);
	const handleSave = async () => {
		try {
			const result = await updateRoomFloorMessageField(Number(roomMessageId), "content", content);
			if (result) {
				toast.success("保存成功");
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	usePreventBackIfEditing(isEditing);
	return (
		<>
			<Stack.Screen
				options={{
					title: "消息内容",
					headerRight: () => (
						<ButtonEditTrigger isEditing={isEditing} setIsEditing={setIsEditing} onSubmit={handleSave} />
					),
				}}
			/>
			<View className="flex-1">
				<ContentTextarea />
			</View>
		</>
	);
}

function ContentTextarea() {
	const headerHeight = useHeaderHeight();
    const { roomMessageId } = useLocalSearchParams()
	const [isEditing] = useAtom(isEditingAtom);
	const [content, setContent] = useAtom(contentAtom);
	const message = useRoomMessageById(Number(roomMessageId))
	React.useEffect(() => {
		if (message.content) {
			setContent(message.content);
		}
	}, [message.content, setContent]);
	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: headerHeight,
				flexGrow: 1,
			}}
		>
			<TextEditor value={content} onChangeText={setContent} editable={isEditing} />
		</ScrollView>
	);
}
