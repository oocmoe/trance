import { Card } from "@/components/ui/card";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { toast } from "sonner-native";
import { pickerPrompt } from "@/utils/picker";
import { atom, useAtom } from "jotai";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { createPromptImport } from "@/db/client";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const promptPreviewAtom = atom<PromptImportDataPreview | undefined>(undefined);
export default function PromptImportScreen() {
	const [promptPreview] = useAtom(promptPreviewAtom);
	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				{promptPreview ? <ImportPromptPreview /> : <ImportSillyTavernPrompt />}
			</SafeAreaView>
		</View>
	);
}

function ImportPromptPreview() {
	const [promptPreview, setPromptPreview] = useAtom(promptPreviewAtom);

	const handleSave = async () => {
		if (!promptPreview) {
			return;
		}
		try {
			const result = await createPromptImport(promptPreview);
			if (result) {
				router.back();
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	const handleImport = async () => {
		try {
			setPromptPreview(undefined);
			const result = await pickerPrompt();
			setPromptPreview(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-1 flex-col gap-y-2">
			<Label className="p-3">{promptPreview?.name}</Label>
			<ScrollView>
				<Accordion type="multiple" collapsible className="w-full max-w-sm native:max-w-md p-3">
					{promptPreview?.prompt.map((item, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<AccordionItem key={index} value={String(index)}>
							<AccordionTrigger>
								<View className="flex flex-row items-center gap-x-1">
									<StatusBadge status={item.is_enabled === true ? "active" : "offline"} />
									<Text>{item.name}</Text>
								</View>
							</AccordionTrigger>
							<AccordionContent>
								<Text>{item.content}</Text>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</ScrollView>
			<View className="flex flex-row justify-between items-center gap-x-2 mx-2">
				<Button onPress={handleImport} variant={"outline"} className="flex-1">
					<Text>重新选择</Text>
				</Button>
				<Button onPress={handleSave} className="flex-1">
					<Text>保存提示词</Text>
				</Button>
			</View>
		</View>
	);
}

function ImportSillyTavernPrompt() {
	const [, setPromptPreview] = useAtom(promptPreviewAtom);
	const handleImport = async () => {
		try {
			setPromptPreview(undefined);
			const result = await pickerPrompt();
			setPromptPreview(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="p-3">
			<Pressable onPress={handleImport} className="active:opacity-80 w-full">
				<Card className="p-6">
					<Text className="font-bold text-xl">导入 SillyTavern 格式提示词</Text>
					<Text className="text-gray-400">部分参数不被支持</Text>
				</Card>
			</Pressable>
		</View>
	);
}
