import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Label } from "./ui/label";
import React from "react";
import { Text } from "./ui/text";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import Icon from "./Icon";
import { Edit, Edit2, Edit3, Save } from "lucide-react-native";
import { atom, useAtom } from "jotai";

const isEditAtom = atom(false);

const model = [
	{
		order: 1,
		label: "Custom OpenAI",
		value: "Custom_OpenAI",
	},
	{
		order: 2,
		label: "Gemini",
		value: "Gemini",
	},
];

const geminiModelVersion = [
	{
		order: 1,
		label: "Gemini 2.5 Flash Preview 05-20",
		value: "gemini-2.5-flash-preview-05-20",
	},
	{
		order: 2,
		label: "Gemini 2.0 Flash",
		value: "gemini-2.0-flash",
	},

	{
		order: 3,
		label: "Gemini 2.0 Flash-Lite",
		value: "gemini-2.0-flash-lite",
	},
	{
		order: 4,
		label: "Gemini 1.5 Flash",
		value: "gemini-1.5-flash",
	},
	{
		order: 5,
		label: "Gemini 1.5 Flash-8B",
		value: "gemini-1.5-flash-8b",
	},
	{
		order: 6,
		label: "Gemini 1.5 Pro",
		value: "gemini-1.5-pro",
	},
	{
		order: 7,
		label: "Gemini 2.5 Pro Preview",
		value: "gemini-2.5-pro-preview-05-06",
	},
];

export default function ModelSelect({
	modelName,
	modelVersion,
	setModelName,
	setModelVersion,
	onSave,
}: {
	modelName: string;
	modelVersion: string;
	setModelName: React.Dispatch<React.SetStateAction<string>>;
	setModelVersion: React.Dispatch<React.SetStateAction<string>>;
	onSave: () => void;
}) {
	const [isCustomVersion, setIsCustomVersion] = React.useState<boolean>(false);
	const [isEdit, setIsEdit] = useAtom(isEditAtom);
	return (
		<View className="flex flex-col gap-y-2">
			<View className="flex flex-row justify-between items-center">
				<Text className="text-xl font-bold">模型选择</Text>
				{isEdit ? (
					<Pressable
						onPress={() => {
							setIsEdit(false);
							onSave?.();
						}}
					>
						<Icon as={Save} />
					</Pressable>
				) : (
					<Pressable onPress={() => setIsEdit(true)}>
						<Icon as={Edit} />
					</Pressable>
				)}
			</View>
			{isEdit && (
				<View className="flex flex-row justify-between items-center gap-x-2">
					<Text>自定义模型版本</Text>
					<Switch checked={isCustomVersion} onCheckedChange={setIsCustomVersion} />
				</View>
			)}
			<View className="flex flex-row justify-between items-center">
				<Label>模型名称</Label>
				<SelectModelName modelName={modelName} setModelName={setModelName} />
			</View>
			{modelName !== "Custom_OpenAI" && (
				<View className="flex flex-row justify-between items-center">
					<Label>模型版本</Label>
					{isCustomVersion ? (
						<CustomModelVersion modelVersion={modelVersion} setModelVersion={setModelVersion} />
					) : (
						<SelectModelVersion modelName={modelName} modelVersion={modelVersion} setModelVersion={setModelVersion} />
					)}
				</View>
			)}
		</View>
	);
}

const SelectModelName = ({
	modelName,
	setModelName,
}: { modelName: string; setModelName: React.Dispatch<React.SetStateAction<string>> }) => {
	const [isEdit] = useAtom(isEditAtom);

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};
	return (
		<Select value={{ label: modelName, value: modelName }} onValueChange={(e) => setModelName(e?.value as string)}>
			<SelectTrigger disabled={!isEdit} className="w-[250px]">
				<SelectValue className="text-foreground text-sm native:text-lg" placeholder="Select a model" />
			</SelectTrigger>
			<SelectContent insets={contentInsets} className="w-[250px]">
				<SelectGroup>
					{model.map((item) => (
						<SelectItem key={item.order} label={item.label} value={item.value} />
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

const SelectModelVersion = ({
	modelName,
	modelVersion,
	setModelVersion,
}: {
	modelName: string;
	modelVersion: string;
	setModelVersion: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [isEdit] = useAtom(isEditAtom);

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};
	return (
		<Select
			value={{ label: modelVersion, value: modelVersion }}
			onValueChange={(e) => setModelVersion(e?.value as string)}
		>
			<SelectTrigger disabled={!isEdit} className="w-[250px]">
				<SelectValue className="text-foreground text-sm native:text-lg" placeholder="Select a version" />
			</SelectTrigger>
			<SelectContent insets={contentInsets} className="w-[250px]">
				<SelectGroup>
					{geminiModelVersion.map((item) => (
						<SelectItem key={item.order} label={item.label} value={item.value} />
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

const CustomModelVersion = ({
	modelVersion,
	setModelVersion,
}: {
	modelVersion: string;
	setModelVersion: React.Dispatch<React.SetStateAction<string>>;
}) => {
	return (
		<View className="w-80">
			<Input value={modelVersion} onChangeText={setModelVersion} />
		</View>
	);
};
