import { ButtonEditTrigger } from "@/components/button-editTrigger";
import { TextEditor } from "@/components/editor/textEditor";
import { SelectBottomSheet } from "@/components/select";
import { updateCharacterField } from "@/db/client";
import type { CharacterTable } from "@/db/schema";
import { useCharacterById } from "@/hook/useCharacter";
import { set } from "date-fns";
import { boolean } from "drizzle-orm/gel-core";
import { Stack, useLocalSearchParams } from "expo-router";
import { atom, useAtom, useAtomValue } from "jotai";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const isEditingAtom = atom<boolean>(false);
const prologueAtom = atom<CharacterTable["prologue"] | null>(null);
const prologueOptionsAtom = atom<Array<{ label: string; value: string }>>([]);
const selectedPrologueIndexAtom = atom<number>(0);
const contentAtom = atom<string>("");

export default function CharacterIdEditPrologueScreen() {
	const { id } = useLocalSearchParams();
	const [prologue, setPrologue] = useAtom(prologueAtom);
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	const [selectedPrologueIndex] = useAtom(selectedPrologueIndexAtom);
	const [content] = useAtom(contentAtom);
	const [, setPrologueOptions] = useAtom(prologueOptionsAtom);
	const character = useCharacterById(Number(id));

	const handleSubmit = async () => {
		if (!prologue) return;
		try {
			const newPrologue = [...prologue];
			newPrologue[selectedPrologueIndex].content = content;
			await updateCharacterField(Number(id), "prologue", newPrologue);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};


	React.useEffect(() => {
		if (character.prologue) {
			setPrologueOptions(character.prologue.map((item, index) => ({ label: item.title, value: String(index) })));
			setPrologue(character.prologue);
		}
	}, [character, setPrologueOptions, setPrologue]);
	return (
		<>
			<Stack.Screen
				options={{
					title: "开场白",
					headerShown: true,
					headerRight: () => (
						<ButtonEditTrigger isEditing={isEditing} setIsEditing={setIsEditing} onSubmit={handleSubmit} />
					),
				}}
			/>
			<View className="p-3">
				<PrologueSelector />
			</View>
			<View className="flex-1 p-3">
				<PrologueTextarea />
			</View>
		</>
	);
}

function PrologueSelector() {
	const [prologue, setPrologue] = useAtom(prologueAtom);
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	const [prologueOptions, setPrologueOptions] = useAtom(prologueOptionsAtom);
	const [selectedPrologueIndex, setSelectedPrologueIndex] = useAtom(selectedPrologueIndexAtom);
	return (
		<SelectBottomSheet
			label="选择开场白"
			value={""}
			options={prologueOptions}
			onValueChange={(value) => setSelectedPrologueIndex(Number(value))}
			disabled={isEditing}
		/>
	);
}

function PrologueTextarea() {
	const [content, setContent] = useAtom(contentAtom);
	const [prologue, setPrologue] = useAtom(prologueAtom);
	const [selectedPrologueIndex, setSelectedPrologueIndex] = useAtom(selectedPrologueIndexAtom);
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	React.useEffect(() => {
		if (prologue) {
			setContent(prologue[selectedPrologueIndex].content);
		}
	}, [selectedPrologueIndex, prologue, setContent]);
	return <TextEditor value={content} onChangeText={setContent} editable={isEditing} />;
}
