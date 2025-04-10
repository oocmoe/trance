// app\character\[id]\editor\description.tsx

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useCharacter, useCharacterById } from "@/hook/character";
import { updateCharacterFiledById } from "@/utils/db/character";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { atom, useAtom } from "jotai";
import { Save } from "lucide-react-native";
import React from "react";
import { Alert, BackHandler, TextInput } from "react-native";
import { toast } from "sonner-native";

const descriptionAtom = atom<string>();

export default function CharacterDescriptionScreen() {
	return (
		<Box className="h-full w-full">
			<Stack.Screen
				options={{
					headerRight: () => {
						return <HeaderRightSaveButton />;
					},
				}}
			/>
			<CharacterDescription />
		</Box>
	);
}

const HeaderRightSaveButton = () => {
	const { id } = useLocalSearchParams();
	const [description, setDescription] = useAtom(descriptionAtom);
	const handleSave = async () => {
		if (!description) {
			toast.error("数据状态为准备完成");
			return;
		}
		try {
			const rows = await updateCharacterFiledById(
				Number(id),
				"description",
				description,
			);
			if(rows){
				toast.success("保存成功");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	return (
		<Button onPress={handleSave} variant="link">
			<ButtonIcon as={Save} />
		</Button>
	);
};

const CharacterDescription = () => {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	const [description, setDescription] = useAtom(descriptionAtom);
	React.useEffect(() => {
		if (!character?.description) return;
		setDescription(character.description);
	}, [character, setDescription]);
	return (
		<Box className="flex-1">
			<TextInput
				value={description}
				onChangeText={setDescription}
				className="flex-1 p-3"
				multiline
				textAlignVertical="top"
			/>
		</Box>
	);
};
