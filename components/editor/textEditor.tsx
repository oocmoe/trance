import { tranceIsDarkModeAtom } from "@/store/core";
import { useAtomValue } from "jotai";
import type React from "react";
import { TextInput, View, Text, StyleSheet, ScrollView } from "react-native";

export type TextEditorProps = {
	editable: boolean;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
};

export const TextEditor: React.FC<TextEditorProps> = ({
	editable,
	value,
	onChangeText,
	placeholder = "请输入内容...",
}) => {
	const isDarkMode = useAtomValue(tranceIsDarkModeAtom);
	return (
		<TextInput
			style={{ color: isDarkMode ? "white" : "black" }}
			editable={editable}
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			multiline
			textAlignVertical="top"
			autoCapitalize="sentences"
		/>
	);
};
