import { ButtonEditTrigger } from "@/components/button-editTrigger";
import { TextEditor } from "@/components/editor/textEditor";
import Icon from "@/components/Icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateKnowledgeEntryField } from "@/db/client";
import { useKnowledgeEntryById } from "@/hook/useKnowledgeBase";
import { usePreventBackIfEditing } from "@/hook/usePreventBackIfEditing";
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

export default function KnowledgeEntryContentModal() {
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	const [content] = useAtom(contentAtom);
	const { knowledgeEntryId } = useLocalSearchParams();
	const navigation = useNavigation();
	const handleSave = async () => {
		try {
			const result = await updateKnowledgeEntryField(Number(knowledgeEntryId), "content", content);
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
					presentation: "modal",
					title: "条目内容",
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
	const [isEditing] = useAtom(isEditingAtom);
	const [content, setContent] = useAtom(contentAtom);
	const entry = useKnowledgeEntryById(Number(useLocalSearchParams().knowledgeEntryId));
	React.useEffect(() => {
		if (entry.content) {
			setContent(entry.content);
		}
	}, [entry.content, setContent]);
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
