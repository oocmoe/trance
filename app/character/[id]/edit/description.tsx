import { ButtonEditTrigger } from "@/components/button-editTrigger";
import { TextEditor } from "@/components/editor/textEditor";
import { updateCharacterField } from "@/db/client";
import { useCharacterById } from "@/hook/useCharacter";
import { usePreventBackIfEditing } from "@/hook/usePreventBackIfEditing";
import { Stack, useLocalSearchParams } from "expo-router";
import { atom, useAtom } from "jotai";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const descriptionAtom = atom<string | undefined>(undefined);
const isEditingAtom = atom<boolean>(false);
export default function DescriptionScreen() {
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	const [description, setDescription] = useAtom(descriptionAtom);
	const { id } = useLocalSearchParams();
	usePreventBackIfEditing(isEditing);

	const handleSubmit = async () => {
		if (!description) return;
		try {
			await updateCharacterField(Number(id), "description", description);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					title:"角色描述",
					headerRight: () => (
						<ButtonEditTrigger isEditing={isEditing} setIsEditing={setIsEditing} onSubmit={handleSubmit} />
					),
				}}
			/>
			<SafeAreaView className="flex-1 p-3">
				<DescriptionTextArea />
			</SafeAreaView>
		</>
	);
}

function DescriptionTextArea() {
	const [description, setDescription] = useAtom(descriptionAtom);
	const [isEditing] = useAtom(isEditingAtom);
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	React.useEffect(() => {
		if (character.description) {
			setDescription(character.description);
		}
	}, [character, setDescription]);
	if (description) return <TextEditor editable={isEditing} value={description} onChangeText={setDescription} />;
}
