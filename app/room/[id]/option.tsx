import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import ModelSelect from "@/components/modelSelect";
import React from "react";
import { useRoomOptionsById } from "@/hook/useRoom";
import { Button } from "@/components/ui/button";
import { deleteRoomById, updateRoomOptionField } from "@/db/client";
import { toast } from "sonner-native";
import { usePromptGroupList } from "@/hook/usePrompt";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Label } from "@/components/ui/label";
import { ButtonEditTrigger } from "@/components/button-editTrigger";
import { ButtonModalTrigger } from "@/components/button-modalTrigger";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { TRANCE_THEME_PROFILE_DEFAULT } from "@/constant/theme/default";
import { TRANCE_THEME_PROFILE_GREEN } from "@/constant/theme/green";
import { TRANCE_THEME_PROFILE_OCEAN } from "@/constant/theme/ocean";
import { TRANCE_THEME_PROFILE_PEACH } from "@/constant/theme/peach";
export default function RoomOptionScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "房间配置" }} />
			<View className="flex-1 ">
				<RoomOptionList />
			</View>
		</>
	);
}

function RoomOptionList() {
	return (
		<View className="flex flex-1 flex-col gap-y-2 p-3">
			<ModelSetting />
			<RoomPrompt />
			<RoomTheme />
			<DeleteRoom />
		</View>
	);
}

function ModelSetting() {
	const { id } = useLocalSearchParams();
	const [modelName, setModelName] = React.useState<string>("");
	const [modelVersion, setModelVersion] = React.useState<string>("");
	const roomOptions = useRoomOptionsById(Number(id));
	React.useEffect(() => {
		if (roomOptions.model) {
			setModelName(roomOptions.model.name);
			setModelVersion(roomOptions.model.version);
		}
	}, [roomOptions]);
	const handleSave = async () => {
		const model = {
			name: modelName,
			version: modelVersion,
		};
		await updateRoomOptionField(Number(id), "model", model);
	};
	return (
		<View>
			<ModelSelect
				modelName={modelName}
				setModelName={setModelName}
				modelVersion={modelVersion}
				setModelVersion={setModelVersion}
				onSave={handleSave}
			/>
		</View>
	);
}

function RoomPrompt() {
	const { id } = useLocalSearchParams();
	const [prompt, setPrompt] = React.useState<{ id: number; name: string } | undefined>(undefined);
	const [isEditing, setIsEditing] = React.useState<boolean>(false);
	const roomOptions = useRoomOptionsById(Number(id));
	const promptGroup = usePromptGroupList();
	React.useEffect(() => {
		if (roomOptions.prompt_group_id === null) {
			setPrompt(undefined);
		} else {
			const tempPrompt = promptGroup.find((item) => item.id === roomOptions.prompt_group_id);
			if (tempPrompt) {
				setPrompt({
					id: tempPrompt.id,
					name: tempPrompt.name,
				});
			}
		}
	}, [roomOptions, promptGroup]);

	const handleChangePrompt = async () => {
		try {
			if (!prompt) {
				await updateRoomOptionField(Number(id), "prompt_group_id", null);
				return;
			}
			await updateRoomOptionField(Number(id), "prompt_group_id", Number(prompt.id));
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};
	console.log(prompt)
	return (
		<View className="flex flex-col gap-y-2">
			<View className="flex flex-row justify-between items-center">
				<Text className="text-lg font-bold">提示词选择</Text>
				<ButtonEditTrigger isEditing={isEditing} setIsEditing={setIsEditing} onSubmit={handleChangePrompt} />
			</View>
			<View className="flex flex-row justify-between items-center">
				<Label>提示词</Label>
				<Select value={{ label: prompt?.name || "None", value: String(prompt?.id) || "null" }}  onValueChange={(e)=>{
					if (e?.value === "null") {
						setPrompt(undefined);
					}
					setPrompt({
						id: Number(e?.value),
						name: e?.label as string,
					})
				}}>
					<SelectTrigger  disabled={!isEditing} className="w-[250px]">
						<SelectValue className="text-foreground text-sm native:text-lg" placeholder="Select a prompt" />
					</SelectTrigger>
					<SelectContent insets={contentInsets} className="w-[250px]">
						<SelectGroup>
							<SelectItem key="none" label="None" value="null">
								None
							</SelectItem>
							{promptGroup.map((item) => (
								<SelectItem key={item.id} label={item.name} value={String(item.id)}>
									{item.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</View>
		</View>
	);
}

function DeleteRoom() {
	const { id } = useLocalSearchParams();

	const handleDelete = async () => {
		try {
			const result = await deleteRoomById(Number(id));
			if (result) {
				router.replace("/message");
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};

	return (
		<View className="flex flex-row justify-between items-center">
			<Label>删除聊天</Label>
			<ButtonModalTrigger
				buttonText="删除"
				submit={handleDelete}
				variant="destructive"
				title="确认删除"
				description="确定要删除这个聊天室吗？此操作不可撤销。"
			/>
		</View>
	);
}

function RoomTheme() {
	const { id } = useLocalSearchParams();

	const handleChangeTheme = async (value:number) => {
		const value1 = TRANCE_THEME_PROFILE_DEFAULT;
		const value2 = TRANCE_THEME_PROFILE_GREEN;
		const value3 = TRANCE_THEME_PROFILE_PEACH;
		const value4 = TRANCE_THEME_PROFILE_OCEAN;
		const theme = value === 1 ? value1 : value === 2 ? value2 : value === 3 ? value3 : value4;
		try {
			const result = await updateRoomOptionField(Number(id), "theme", theme);
			if(result){
				toast.success("更换成功")
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex gap-y-2">
			<Heading>房间主题</Heading>
			<Pressable onPress={() => handleChangeTheme(1)}>
				<Card className="p-3">
					<Text>默认</Text>
				</Card>
			</Pressable>
			<Pressable onPress={() => handleChangeTheme(2)}>
				<Card className="p-3 bg-[#13c468]">
					<Text className="text-black">绿色</Text>
				</Card>
			</Pressable>
		<Pressable onPress={() => handleChangeTheme(3)}>
				<Card className="p-3 bg-[#fa95a7]">
					<Text className="text-white">桃子</Text>
				</Card>
			</Pressable>
			<Pressable onPress={() => handleChangeTheme(4)}>
				<Card className="p-3 bg-[#8ee2fa]">
					<Text className="text-white">海洋</Text>
				</Card>
			</Pressable>
		</View>
	);
}
