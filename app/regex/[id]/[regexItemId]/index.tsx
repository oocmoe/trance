import { useRegexById, useRegexGroupById, useRegexListByGroupId } from "@/hook/useRegex";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import type { RegexGroupTable } from "@/db/schema";
import { toast } from "sonner-native";
import { deleteRegex, updateRegexField, updateRegexGroupField } from "@/db/client";
import { Card } from "@/components/ui/card";
import Icon from "@/components/Icon";
import { ArrowRight, Cog, Pen, Save, Settings, Trash } from "lucide-react-native";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { atom, useAtom } from "jotai";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const deleteModalAtom = atom(false);

export default function RegexItemScreen() {
	const { regexItemId } = useLocalSearchParams();
	const regex = useRegexById(Number(regexItemId));
	return (
		<>
			<Stack.Screen options={{ title: regex.name, headerRight: () => <RegexDelete /> }} />
			<View className="flex-1">
				<RegexItemName />
				<RegexItemIsEnable />
				<RegexItemIsSending />
				<RegexItemIsRender />
				<RegexItemReplace />
				<RegexItemPlacement />
				<RegexDeleteModal />
			</View>
		</>
	);
}

function RegexItemIsEnable() {
	const { regexItemId } = useLocalSearchParams();
	const regex = useRegexById(Number(regexItemId));
	const handleChangeIsEnable = async (value: boolean) => {
		try {
			await updateRegexField(Number(regexItemId), "is_enabled", value);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Text className="font-bold">开关</Text>
			<Switch checked={regex.is_enabled} onCheckedChange={handleChangeIsEnable} />
		</View>
	);
}

function RegexDelete() {
	const [, setIsOpen] = useAtom(deleteModalAtom);
	return (
		<Pressable onPress={() => setIsOpen(true)}>
			<Icon as={Trash} />
		</Pressable>
	);
}

function RegexDeleteModal() {
	const [isOpen, setIsOpen] = useAtom(deleteModalAtom);
	const { id, regexItemId } = useLocalSearchParams();
	const handleDelete = async () => {
		try {
			const result = await deleteRegex(Number(regexItemId));
			if (result) {
				router.back();
				toast.success("删除成功");
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
			<AlertDialogContent className="w-full">
				<AlertDialogHeader>
					<AlertDialogTitle>你确定吗?</AlertDialogTitle>
					<AlertDialogDescription>无法撤回</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="flex flex-row justify-end">
					<AlertDialogCancel>
						<Text>Cancel</Text>
					</AlertDialogCancel>
					<AlertDialogAction className="bg-red-500" onPress={handleDelete}>
						<Text>Continue</Text>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function RegexItemIsSending() {
	const { regexItemId } = useLocalSearchParams();
	const regex = useRegexById(Number(regexItemId));
	const handleChangeIsSending = async (value: boolean) => {
		try {
			await updateRegexField(Number(regexItemId), "is_sending", value);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Text className="font-bold">发送时运行</Text>
			<Switch checked={regex.is_sending} onCheckedChange={handleChangeIsSending} />
		</View>
	);
}

function RegexItemIsRender() {
	const { regexItemId } = useLocalSearchParams();
	const regex = useRegexById(Number(regexItemId));
	const handleChangeIsRender = async (value: boolean) => {
		try {
			await updateRegexField(Number(regexItemId), "is_render", value);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Text className="font-bold">渲染时运行</Text>
			<Switch checked={regex.is_render} onCheckedChange={handleChangeIsRender} />
		</View>
	);
}

function RegexItemName() {
	const { regexItemId } = useLocalSearchParams();
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>("");
	const regex = useRegexById(Number(regexItemId));
	React.useEffect(() => {
		if (regex.name) {
			setName(regex.name);
		}
	}, [regex]);
	const handleChangeName = async () => {
		try {
			await updateRegexGroupField(regex.id, "name", name);
		} catch (error) {
			console.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View>
			<View className="flex flex-row justify-between items-center p-3">
				<Text className="font-bold">正则名称</Text>
				<Pressable onPress={() => setIsOpen(true)}>
					<Icon as={Pen} />
				</Pressable>
			</View>
			<Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>正则名称</DialogTitle>
						<DialogDescription>
							<Input className="w-full" value={name} onChangeText={setName} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex flex-row justify-end">
						<DialogClose asChild>
							<Button variant={"outline"}>
								<Text>Cancel</Text>
							</Button>
						</DialogClose>
						<Button disabled={name.length === 0} onPress={handleChangeName}>
							<Text>保存</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</View>
	);
}

function RegexItemReplace() {
	const [isEdit, setIsEdit] = React.useState<boolean>(false);
	const [replace, setReplace] = React.useState<string>("");
	const { regexItemId } = useLocalSearchParams();
	const regex = useRegexById(Number(regexItemId));
	React.useEffect(() => {
		if (!regex.replace) return;
		setReplace(regex.replace);
	}, [regex]);

	const handleSave = async () => {
		try {
			const result = await updateRegexField(Number(regexItemId), "replace", replace);
			if (result) {
				setIsEdit(false);
				toast.success("保存成功");
			}
		} catch (error) {
			console.log(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-col gap-y-2 p-3">
			<View className="flex flex-row justify-between items-center">
				<Label>查找</Label>
				{isEdit ? (
					<Pressable onPress={handleSave}>
						<Icon as={Save} />
					</Pressable>
				) : (
					<Pressable onPress={() => setIsEdit(true)}>
						<Icon as={Pen} />
					</Pressable>
				)}
			</View>

			<Textarea editable={isEdit} value={replace} onChangeText={setReplace} />
		</View>
	);
}

function RegexItemPlacement() {
	const [isEdit, setIsEdit] = React.useState<boolean>(false);
	const [placement, setPlacement] = React.useState<string>("");
	const { regexItemId } = useLocalSearchParams();
	const regex = useRegexById(Number(regexItemId));
	React.useEffect(() => {
		if (!regex.placement) return;
		setPlacement(regex.placement);
	}, [regex]);

	const handleSave = async () => {
		try {
			const result = await updateRegexField(Number(regexItemId), "placement", placement);
			if (result) {
				setIsEdit(false);
				toast.success("保存成功");
			}
		} catch (error) {
			console.log(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-col gap-y-2 p-3">
			<View className="flex flex-row justify-between items-center">
				<Label>替换</Label>
				{isEdit ? (
					<Pressable onPress={handleSave}>
						<Icon as={Save} />
					</Pressable>
				) : (
					<Pressable onPress={() => setIsEdit(true)}>
						<Icon as={Pen} />
					</Pressable>
				)}
			</View>

			<Textarea editable={isEdit} value={placement} onChangeText={setPlacement} />
		</View>
	);
}
