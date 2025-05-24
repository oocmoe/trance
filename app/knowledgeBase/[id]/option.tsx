import Icon from "@/components/Icon";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteKnowledgeBase, updateKnowledgeBaseField } from "@/db/client";
import { useKnowledgeBaseById } from "@/hook/useKnowledgeBase";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pen } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { toast } from "sonner-native";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ButtonModalTrigger } from "@/components/button-modalTrigger";
export default function KnowledgeBaseOptionScreen() {
	return (
		<>
			<Stack.Screen options={{ title: useKnowledgeBaseById(Number(useLocalSearchParams().id)).name }} />
			<View className="flex-1">
				<KnowledgeBaseIsEnabled />
				<KnowledgeBaseName />
				<KnowledgeBaseDelete />
			</View>
		</>
	);
}

function KnowledgeBaseIsEnabled() {
	const knowledgeBase = useKnowledgeBaseById(Number(useLocalSearchParams().id));
	const handleChange = async (value: boolean) => {
		try {
			await updateKnowledgeBaseField(knowledgeBase.id, "is_enabled", value);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Label className="font-bold">启用</Label>
			<Switch checked={knowledgeBase.is_enabled} onCheckedChange={handleChange} />
		</View>
	);
}

function KnowledgeBaseName() {
	const { id } = useLocalSearchParams();
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>("");
	const knowledgeBase = useKnowledgeBaseById(Number(id));
	React.useEffect(() => {
		if (knowledgeBase.name) {
			setName(knowledgeBase.name);
		}
	}, [knowledgeBase]);
	const handleChangeName = async () => {
		try {
			await updateKnowledgeBaseField(knowledgeBase.id, "name", name);
		} catch (error) {
			console.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View>
			<View className="flex flex-row justify-between items-center p-3">
				<Text className="font-bold">知识库名称</Text>
				<Pressable onPress={() => setIsOpen(true)}>
					<Icon as={Pen} />
				</Pressable>
			</View>
			<Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>知识库名称</DialogTitle>
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

function KnowledgeBaseDelete() {
	const { id } = useLocalSearchParams();
	const handleDelete = async () => {
		try {
			const result = await deleteKnowledgeBase(Number(id));
			if (result) {
				router.replace("/knowledgeBase");
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Label>删除知识库</Label>
			<ButtonModalTrigger
				buttonText="删除"
				variant="destructive"
				title="确认删除"
				description="确定要删除这个知识库吗？此操作不可撤销。"
				submit={handleDelete}
			/>
		</View>
	);
}
