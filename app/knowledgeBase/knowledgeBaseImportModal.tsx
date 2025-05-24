import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeBaseTable, type KnowledgeEntryTableInsert, type KnowledgeBaseTableInsert } from "@/db/schema";
import { atom, useAtom } from "jotai";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { toast } from "sonner-native";
import { pickerKnowledgeBase } from "@/utils/picker";
import { Heading } from "@/components/ui/heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { createKnowledgeBaseImport } from "@/db/client";
import { retry } from "es-toolkit";
import { router } from "expo-router";

const previewDataAtom = atom<
	| {
			knowledgeBase: KnowledgeBaseTableInsert;
			knowledgeEntry: Array<KnowledgeEntryTableInsert>;
	  }
	| undefined
>(undefined);

export default function KnowledgeBaseImportModal() {
	const [previewData, setPreviewData] = useAtom(previewDataAtom);
	return <View className="flex flex-1">{previewData ? <DataPreview /> : <ImportSelection />}</View>;
}

function ImportSelection() {
	const [previewData, setPreviewData] = useAtom(previewDataAtom);
	const handleImport = async () => {
		try {
			const result = await pickerKnowledgeBase();
			setPreviewData(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="p-3">
			<Pressable onPress={handleImport}>
				<Card>
					<CardHeader>
						<CardTitle style={{ lineHeight: 28 }}>导入 SillyTavern 世界书</CardTitle>
						<CardDescription>部分参数无法解析</CardDescription>
					</CardHeader>
				</Card>
			</Pressable>
		</View>
	);
}

function DataPreview() {
	const [data, setData] = useAtom(previewDataAtom);
	const handleSave = async () => {
		if (!data) return;
		try {
			const result = await createKnowledgeBaseImport(data);
			if (result) {
				toast.success("导入成功");
				router.replace("/knowledgeBase");
			}
		} catch (error) {
			console.log(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};

	const handleImport = async () => {
		try {
			const result = await pickerKnowledgeBase();
			setData(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};

	return (
		<View className="flex flex-1 flex-col gap-y-2">
			<Heading className="p-3">{data?.knowledgeBase.name}</Heading>

<ScrollView>
				<Accordion type="multiple" collapsible className="w-full max-w-sm native:max-w-md p-3">
					{data?.knowledgeEntry.map((item, index) => (
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
