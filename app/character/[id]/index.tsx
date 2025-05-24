import { Text } from "@/components/ui/text";
import { useCharacterById } from "@/hook/useCharacter";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { ActivityIndicator, Pressable, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ImageBackground } from "expo-image";
import { BlurView } from "expo-blur";
import { useColorScheme } from "@/lib/useColorScheme";
import { cssInterop } from "nativewind";
import Icon from "@/components/Icon";
import {
	ArrowRight,
	ArrowUp,
	Briefcase,
	HeartCrack,
	Library,
	MessageCirclePlus,
	MessageSquare,
	MessageSquarePlus,
	MessagesSquare,
	Regex,
	Trash,
} from "lucide-react-native";
import { atom, useAtom, useAtomValue } from "jotai";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner-native";
import { createRoomNewPrivateChat, deleteCharacterById, readCharacterKnowledgeBase, readCharacterRegex } from "@/db/client";
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
import React from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// nativewind
cssInterop(Image, { className: "style" });

export default function CharacterIdScreen() {
	const { id } = useLocalSearchParams();
	const { colorScheme } = useColorScheme();
	const character = useCharacterById(Number(id));
	return (
		<View style={{ flex: 1 }}>
			<View className="absolute inset-0 z-0">
				<ImageBackground source={character.cover} style={{ flex: 1 }} blurRadius={5}>
					<SafeAreaView
						style={{
							flex: 1,
							zIndex: 10,
							backgroundColor: "transparent",
						}}
					>
						<PagerView style={{ flex: 1 }} initialPage={0} orientation="vertical">
							<View key="1" className="flex-1">
								<CharacterAction />
							</View>
						</PagerView>
					</SafeAreaView>
				</ImageBackground>
			</View>
		</View>
	);
}

function CharacterAction() {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	return (
		<View className="flex-1 p-3">
			<View className="flex flex-1 flex-col gap-y-4">
				<CharacterActionHero />
				<CharacterActionList />
			</View>

			{/* <View className="flex justify-center items-center pb-4">
				<Pressable>
					<Icon as={ArrowUp} />
				</Pressable>
			</View> */}
		</View>
	);
}

function CharacterActionHero() {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	return (
		<View className="flex flex-row items-center gap-x-4">
			<Image className="h-32 w-32 rounded-full" source={character.cover} alt="cover" />
			<View className="flex flex-col gap-y-2">
				<Text className="font-bold text-lg">{character.name}</Text>
				{character.creator && <Text>{character.creator}</Text>}
				{character.version && <Text>{character.version}</Text>}
			</View>
		</View>
	);
}

function CharacterActionList() {
	return (
		<View className="flex flex-col gap-y-3">
			<CharacterActionCreateNewChat />
			<CharacterRoomList />
			<CharacterKnowledgeBase />
			<CharacterRegex />
			<CharacterDelete />
		</View>
	);
}

function CharacterActionCreateNewChat() {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [prologueIndex, setPrologueIndex] = React.useState<number | undefined>(undefined);
	const handleCreateNewChat = async () => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			const result = await createRoomNewPrivateChat(character, prologueIndex);
			if (result) {
				router.push(`/room/${result}`);
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		if (!character.prologue) return;
	}, [character.prologue]);
	return (
		<View>
			<Pressable onPress={() => router.push(`/character/${id}/newStoryModal`)}>
				<Card pointerEvents="none" className="p-6 rounded-2xl shadow active:opacity-80">
					<View className="flex flex-row justify-between items-center gap-x-2">
						<View className="flex flex-row gap-x-2">
							<Icon as={MessageSquarePlus} />
							<Text>开启新故事</Text>
						</View>
						<View>
							{isLoading ? <ActivityIndicator className="text-black dark:text-white" /> : <Icon as={ArrowRight} />}
						</View>
					</View>
				</Card>
			</Pressable>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="w-80">
					<Select onValueChange={(e) => setPrologueIndex(Number(e?.value))} className="w-full">
						<SelectTrigger>
							<SelectValue className="text-foreground text-sm native:text-lg" placeholder="选择开场白" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem key={"null"} value="null" label="None" />
								{character.prologue?.map((item, index) => (
									<SelectItem key={String(index)} value={String(index)} label={`# ${String(index + 1)}`} />
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<DialogFooter>
						<DialogClose asChild>
							<Button onPress={handleCreateNewChat}>
								<Text>创建新聊天</Text>
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</View>
	);
}

function CharacterRoomList() {
	const { id } = useLocalSearchParams();
	return (
		<View>
			<Card
				onTouchEnd={() => router.push(`/character/${id}/roomList`)}
				className="p-6 rounded-2xl shadow active:opacity-80"
			>
				<View className="flex flex-row justify-between items-center gap-x-2">
					<View className="flex flex-row gap-x-2">
						<Icon as={MessagesSquare} />
						<Text>与其的回忆</Text>
					</View>
					<View>
						<Icon as={ArrowRight} />
					</View>
				</View>
			</Card>
		</View>
	);
}

function CharacterRegex() {
	const { id } = useLocalSearchParams();
	const [regexId, setRegexId] = React.useState<number | undefined>();
	React.useEffect(() => {
		const fetchRegexId = async () => {
			const result = await readCharacterRegex(Number(id));
			setRegexId(result);
		};
		fetchRegexId();
	}, [id]);
		return (
			<View>
				<Card pointerEvents={!regexId ? "none" : "auto"} onTouchEnd={() => router.push(`/regex/${regexId}`)}  className={`p-6 rounded-2xl shadow active:opacity-80 ${!regexId ? "opacity-80" : ""} `}>
					<View className="flex flex-row justify-between items-center gap-x-2">
						<View className="flex flex-row gap-x-2">
							<Icon as={Regex} />
							<Text>角色正则</Text>
						</View>
						<View>
							<Icon as={ArrowRight} />
						</View>
					</View>
				</Card>
			</View>
		);
}

function CharacterKnowledgeBase(){
	const { id } = useLocalSearchParams();
	const [knowledgeBaseId, setKnowledgeBaseId] = React.useState<number | undefined>();
	React.useEffect(() => {
		const fetchRegexId = async () => {
			const result = await  readCharacterKnowledgeBase(Number(id));
			setKnowledgeBaseId(result);
		};
		fetchRegexId();
	}, [id]);
		return (
			<View>
				<Card pointerEvents={!knowledgeBaseId ? "none" : "auto"} onTouchEnd={() => router.push(`/knowledgeBase/${knowledgeBaseId}`)} className={`p-6 rounded-2xl shadow active:opacity-80 ${!knowledgeBaseId ? "opacity-80" : ""} `}>
					<View className="flex flex-row justify-between items-center gap-x-2">
						<View className="flex flex-row gap-x-2">
							<Icon as={Library} />
							<Text>角色知识库</Text>
						</View>
						<View>
							<Icon as={ArrowRight} />
						</View>
					</View>
				</Card>
			</View>
		);
}

function CharacterDelete() {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const { id } = useLocalSearchParams();
	const handleDelete = async () => {
		try {
			const result = await deleteCharacterById(Number(id));
			if(result){
				router.replace("/character")
				toast.success("删除成功")
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<>
			<Pressable className="active:opacity-80 " onPress={() => setIsOpen(true)}>
				<Card className="p-6 rounded-2xl shadow" pointerEvents="none">
					<View className="flex flex-row justify-between items-center gap-x-2">
						<View className="flex flex-row gap-x-2">
							<Icon as={HeartCrack} />
							<Text>就此分别</Text>
						</View>
						<View>
							<Icon as={Trash} className="text-red-400" />
						</View>
					</View>
				</Card>
			</Pressable>
			<AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
				<AlertDialogContent className="w-full">
					<AlertDialogHeader>
						<AlertDialogTitle>你确定吗?</AlertDialogTitle>
						<AlertDialogDescription>无法撤回</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-row justify-end">
						<AlertDialogCancel>
							<Text>取消</Text>
						</AlertDialogCancel>
						<AlertDialogAction onPress={handleDelete} className="bg-red-500">
							<Text>删除</Text>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
