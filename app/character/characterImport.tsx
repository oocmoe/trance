import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { pickerCharacterPNGCard } from "@/utils/picker";
import { atom, useAtom } from "jotai";
import { Import, Scroll } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import React from "react";
import { Label } from "@/components/ui/label";
import { createCharacterImport } from "@/db/client";
import { router } from "expo-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// nativewind
cssInterop(Image, { className: "style" });

// jotai
const characterImportPreviewAtom = atom<CharacterImportDataPreview>();

export default function CharacterImportScreen() {
	const [characterImportDataPreview, setCharacterImportDataPreview] = useAtom(characterImportPreviewAtom);
	return (
		<View className="h-full w-full">
			<SafeAreaView className="flex-1 p-3">
				{characterImportDataPreview ? <CharacterPreview /> : <CharacterImport />}
			</SafeAreaView>
		</View>
	);
}

function CharacterImport() {
	const [characterImportDataPreview, setCharacterImportDataPreview] = useAtom(characterImportPreviewAtom);
	const handleImport = async () => {
		try {
			const result = await pickerCharacterPNGCard();
			setCharacterImportDataPreview(undefined);
			setCharacterImportDataPreview(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex-1">
			<Pressable onPress={handleImport} className="active:opacity-80 w-full">
				<Card className="p-6">
					<Text className="font-bold text-xl">导入 PNG 格式角色卡</Text>
					<Text className="text-gray-400">支持 SillyTavern Tavern V2 V3 格式</Text>
				</Card>
			</Pressable>
		</View>
	);
}

function CharacterPreview() {
	const [characterImportDataPreview, setCharacterImportDataPreview] = useAtom(characterImportPreviewAtom);
	return (
		<View className="flex-1 items-center p-3 pt-6 gap-y-2">
			<Image
				source={characterImportDataPreview?.character.cover}
				className="h-52 w-full"
				contentFit="contain"
				alt="cover"
			/>
			{characterImportDataPreview?.character && <CharacterPreviewTabs />}
			{characterImportDataPreview?.character && <CharacterImportButton />}
		</View>
	);
}

function CharacterPreviewTabs() {
	const [data, setData] = useAtom(characterImportPreviewAtom);
	const [value, setValue] = React.useState("info");
	if (data)
		return (
			<View className="flex-1">
				<Tabs value={value} onValueChange={setValue} className="flex-1 gap-1.5 w-full p-2">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="info" className="flex-1">
							<Text>简介</Text>
						</TabsTrigger>

						<TabsTrigger value="desc" className="flex-1">
							<Text>描述</Text>
						</TabsTrigger>

						<TabsTrigger value="prologue" className="flex-1">
							<Text>开场白</Text>
						</TabsTrigger>

						<TabsTrigger value="plug" className="flex-1">
							<Text>拓展</Text>
						</TabsTrigger>
					</TabsList>

					<TabsContent className="flex-1" value="info">
						<Card className="flex-1 p-3">
							<ScrollView showsVerticalScrollIndicator={false}>
								<View className="flex flex-col gap-y-2">
									<View>
										<Label>角色卡名称</Label>
										<Text>{data.character.name}</Text>
									</View>
									<View>
										<Label>角色卡作者</Label>
										<Text>{data.character.creator}</Text>
									</View>
									<View>
										<Label>角色卡版本</Label>
										<Text>{data.character.version}</Text>
									</View>
									<View>
										<Label>使用说明</Label>
										<Text>{data.character.handbook}</Text>
									</View>
								</View>
							</ScrollView>
						</Card>
					</TabsContent>

					<TabsContent className="flex-1" value="desc">
						<Card className="flex-1 p-3">
							<ScrollView showsVerticalScrollIndicator={false}>
								<Text>{data.character.description}</Text>
							</ScrollView>
						</Card>
					</TabsContent>

					<TabsContent className="flex-1" value="prologue">
						<Card className="flex-1 p-3">
							<ScrollView showsVerticalScrollIndicator={false}>
								<Accordion type="multiple" collapsible className="w-full max-w-sm native:max-w-md">
									{data.character.prologue.map((item, index) => (
										<AccordionItem key={String(index)} value={String(index)}>
											<AccordionTrigger>
												<Text className="font-bold text-xl"># {index + 1}</Text>
											</AccordionTrigger>
											<AccordionContent>
												<Text>{item.content}</Text>
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</ScrollView>
						</Card>
					</TabsContent>

					<TabsContent className="flex-1" value="plug">
						<Card className="flex-1 p-3">
							<ScrollView showsVerticalScrollIndicator={false}>
								{data.knowledgeBase && data.knowledgeBase.length > 0 && (
									<View>
										<Label>知识库</Label>
										<Accordion type="multiple" collapsible className="w-full max-w-sm native:max-w-md">
											{data.knowledgeBase.map((item, index) => (
												<AccordionItem key={String(index)} value={String(index)}>
													<AccordionTrigger>
														<Text className="font-bold text-xl">{item.name}</Text>
													</AccordionTrigger>
													<AccordionContent>
														<Text>{item.content}</Text>
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									</View>
								)}

								{data.regex && data.regex.length > 0 && (
									<View>
										<Label>正则表达式</Label>
										<Accordion type="multiple" collapsible className="w-full max-w-sm native:max-w-md">
											{data.regex.map((item, index) => (
												<AccordionItem key={String(index)} value={String(index)}>
													<AccordionTrigger>
														<Text className="font-bold text-xl">{item.name}</Text>
													</AccordionTrigger>
													<AccordionContent>
														<View className="flex flex-col gap-y-2">
															<Text>{item.replace}</Text>
															<Text>{item.placement}</Text>
														</View>
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									</View>
								)}
							</ScrollView>
						</Card>
					</TabsContent>
				</Tabs>
			</View>
		);
	return null;
}

function CharacterImportButton() {
	const [characterImportDataPreview, setCharacterImportDataPreview] = useAtom(characterImportPreviewAtom);
	const handleImport = async () => {
		try {
			const result = await pickerCharacterPNGCard();
			setCharacterImportDataPreview(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};

	const handleSave = async () => {
		if (!characterImportDataPreview) return;
		try {
			const result = await createCharacterImport(characterImportDataPreview);
			if (result) {
				setCharacterImportDataPreview(undefined);
				toast.success("角色卡导入成功");
				router.push("/character");
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row gap-x-2">
			<Button onPress={handleImport} variant={"secondary"} className="flex-1">
				<Text>重新选择</Text>
			</Button>
			<Button onPress={handleSave} className="flex-1">
				<Text>导入角色卡</Text>
			</Button>
		</View>
	);
}
