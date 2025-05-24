import { ButtonEditTrigger } from "@/components/button-editTrigger";
import { TextEditor } from "@/components/editor/textEditor";
import Icon from "@/components/Icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updatePromptField } from "@/db/client";
import { usePreventBackIfEditing } from "@/hook/usePreventBackIfEditing";
import { usePromptById } from "@/hook/usePrompt";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { atom, useAtom } from "jotai";
import { Edit } from "lucide-react-native";
import React from "react";
import { ScrollView, TextInput, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Text } from "@/components/ui/text";
import { useHeaderHeight } from "@react-navigation/elements";
const isEditingAtom = atom<boolean>(false);
const contentAtom = atom<string>("");

export default function PromptContentEditModal() {
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	const [content] = useAtom(contentAtom);
	const { promptId } = useLocalSearchParams();
	const handleSave = async () => {
		try {
			const result = await updatePromptField(Number(promptId), "content", content);
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
					title: "提示词内容",
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
	const prompt = usePromptById(Number(useLocalSearchParams().promptId));
	React.useEffect(() => {
		if (prompt.content) {
			setContent(prompt.content);
		}
	}, [prompt.content, setContent]);
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
