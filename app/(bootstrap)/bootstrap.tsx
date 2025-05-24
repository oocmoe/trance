import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import { FadeIn } from "react-native-reanimated";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react-native";
import Icon from "@/components/Icon";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	tranceAppIsBootstrappedAtom,
	tranceDefaultModelAtom,
	tranceDefaultPromptGroupAtom,
	tranceIsDarkModeAtom,
	tranceUserAvatarAtom,
	tranceUsernameAtom,
} from "@/store/core";
import { toast } from "sonner-native";
import { pickerCharacterPNGCard, pickerPrompt, pickerUserAvatar } from "@/utils/picker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import * as SecureStore from "expo-secure-store";
import { tranceHiGeminiTextTest } from "@/utils/model/gemini";
import { createCharacterImport, createPromptImport, createRoomNewPrivateChat, readCharacterById } from "@/db/client";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { router } from "expo-router";
import { useCharacterById } from "@/hook/useCharacter";
import { CharacterTable } from "@/db/schema";
import { tranceHiCustomOpenAITextTest } from "@/utils/model/customOpenAI";
import { Storage } from "expo-sqlite/kv-store";
import { Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const pageAtom = atom(0);
const selectedModelAtom = atom("");
const selectedCharacterAtom = atom<number | undefined>(undefined);
const promptGroupIdAtom = atom<number | undefined>(undefined);

export default function BootstrapScreen() {
	const [page, setPage] = useAtom(pageAtom);
	const pagerRef = useRef<PagerView>(null);

	const handleNextPage = () => {
		const nextPage = page + 1;
		if (nextPage < 7) {
			pagerRef.current?.setPage(nextPage);
		}
	};

	const handleJumpPage = (index: number) => {
		pagerRef.current?.setPage(index);
	};

	const handlePrevPage = () => {
		const prevPage = page - 1;
		if (prevPage >= 0) {
			pagerRef.current?.setPage(prevPage);
		}
	};

	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				<PagerView
					ref={pagerRef}
					style={{ height: "100%", width: "100%" }}
					scrollEnabled={false}
					initialPage={0}
					onPageSelected={(e) => setPage(e.nativeEvent.position)}
				>
					<View key="1" className="flex-1 px-8 py-16 ">
						<BootStrapStart onNextPage={handleNextPage} />
					</View>
					<View key="2" className="flex-1 px-8 py-16">
						<BootStrapTwo onNextPage={handleNextPage} onPrevPage={handlePrevPage} />
					</View>
					<View key="3" className="flex-1 px-8 py-16">
						<BootStrapThree onNextPage={handleNextPage} onJumpPage={handleJumpPage} onPrevPage={handlePrevPage} />
					</View>

					<View key="4" className="flex-1 px-8 py-16">
						<BootStrapFour onNextPage={handleNextPage} onJumpPage={handleJumpPage} onPrevPage={handlePrevPage} />
					</View>

					<View key="5" className="flex-1 px-8 py-16">
						<BootStrapFive onNextPage={handleNextPage} onPrevPage={handlePrevPage} onJumpPage={handleJumpPage} />
					</View>

					<View key="6" className="flex-1 px-8 py-16">
						<BootStrapSix onNextPage={handleNextPage} onPrevPage={handlePrevPage} onJumpPage={handleJumpPage} />
					</View>

					<View key="7" className="flex-1 px-8 py-16">
						<BootStrapEnd onNextPage={handleNextPage} onPrevPage={handlePrevPage} onJumpPage={handleJumpPage} />
					</View>
				</PagerView>
			</SafeAreaView>
		</View>
	);
}

function BootStrapStart({ onNextPage }: { onNextPage: () => void }) {
	return (
		<Animated.View entering={FadeIn.duration(1000)} className="flex flex-1">
			<View className="flex-1  flex-col gap-y-4">
				<Text className="text-3xl">1 / 6</Text>
				<Text className="text-3xl font-black">终于等到你了哇</Text>
				<Text className="text-lg font-bold">为了让咱更快上手，</Text>
				<Text className="text-lg font-bold">需要 2 分钟的简单配置</Text>
			</View>
			<View className="flex flex-col items-end">
				<Pressable onPress={onNextPage}>
					<Icon as={ArrowRightCircle} />
				</Pressable>
			</View>
		</Animated.View>
	);
}

function BootStrapTwo({ onNextPage, onPrevPage }: { onNextPage: () => void; onPrevPage: () => void }) {
	const [username, setUsername] = useAtom(tranceUsernameAtom);
	const [userAvatar, setUserAvatar] = useAtom(tranceUserAvatarAtom);
	const handleChangeCover = async () => {
		try {
			const result = await pickerUserAvatar();
			if (result) setUserAvatar(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<Animated.View entering={FadeIn.duration(1000)} className="flex flex-1">
			<View className="flex-1  flex-col gap-y-4">
				<Text className="text-3xl">2 / 6</Text>
				<Text className="text-3xl font-black">让咱认识一下</Text>
				<Text className="text-lg font-bold">以后也可以改 , 随便写</Text>
				<View className="flex flex-col gap-y-2">
					{userAvatar && <Image source={{ uri: userAvatar }} className="w-32 h-32 border border-gray-200 rounded-md" />}
					<Label>您的名字是 ?</Label>
					<Input value={username} onChangeText={setUsername} />
					<Label>瞧瞧咱的美貌</Label>
					<Button onPress={handleChangeCover}>
						<Text>选择头像</Text>
					</Button>
				</View>
			</View>
			<View className="flex flex-row justify-between items-end">
				<Pressable onPress={onPrevPage}>
					<Icon as={ArrowLeftCircle} />
				</Pressable>
				<Pressable onPress={onNextPage}>
					<Icon as={ArrowRightCircle} />
				</Pressable>
			</View>
		</Animated.View>
	);
}

function BootStrapThree({
	onNextPage,
	onPrevPage,
	onJumpPage,
}: {
	onNextPage: () => void;
	onPrevPage: () => void;
	onJumpPage: (index: number) => void;
}) {
	const [defaultModel, setDefaultModel] = useAtom(tranceDefaultModelAtom);
	const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
	const isDarkMode = useAtomValue(tranceIsDarkModeAtom);
	return (
		<Animated.View entering={FadeIn.duration(1000)} className="flex flex-1">
			<View className="flex-1  flex-col gap-y-4">
				<Text className="text-3xl">3 / 6</Text>
				<Text className="text-3xl font-black">竟有如此可爱的名字</Text>
				<Text className="text-lg font-bold">或许它们想认识下你</Text>
				<Label>选择默认的 AI 模型</Label>
				<Pressable
					onPress={() => {
						setSelectedModel("Gemini");
						onJumpPage(3);
					}}
					className="p-3 border border-gray-100 active:opacity-80"
				>
					<View className="flex flex-row gap-x-2">
						<SvgUri
							uri={"https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini-color.svg"}
							height={24}
							width={24}
						/>
						<Text className="font-bold">Gemini</Text>
					</View>
				</Pressable>
				<Pressable
					onPress={() => {
						setSelectedModel("CustomOpenAI");
						onJumpPage(3);
					}}
					className="p-3 border border-gray-100 active:opacity-80"
				>
					<View className="flex flex-row gap-x-2">
						<SvgUri
							uri={"https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg"}
							height={24}
							width={24}
							color={isDarkMode ? "white" : "black"}
						/>
						<Text className="font-bold">自定义接口 OpenAI 格式 </Text>
					</View>
				</Pressable>
			</View>
			<View className="flex flex-row justify-between items-end">
				<Pressable onPress={onPrevPage}>
					<Icon as={ArrowLeftCircle} />
				</Pressable>
				<Pressable onPress={() => onJumpPage(4)}>
					<Text>以后再说</Text>
				</Pressable>
			</View>
		</Animated.View>
	);
}

function BootStrapFour({
	onNextPage,
	onPrevPage,
	onJumpPage,
}: {
	onNextPage: () => void;
	onPrevPage: () => void;
	onJumpPage: (index: number) => void;
}) {
	const [defaultModel, setDefaultModel] = useAtom(tranceDefaultModelAtom);
	const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
	return (
		<View className="flex flex-1">
			<View className="flex-1  flex-col gap-y-4">
				<Text className="text-3xl">4 / 6</Text>
				<Text className="text-3xl font-black">这事只有咱俩知道</Text>
				<Text className="text-lg font-bold">密钥会加密保存 🔒</Text>
				<Text className="text-lg ">并且只可替换不可修改</Text>
				{selectedModel.length > 0 ? (
					<View className="flex flex-1">
						{selectedModel === "Gemini" && <GeminiSetting />}
						{selectedModel === "CustomOpenAI" && <CustomOpenAISettings />}
					</View>
				) : (
					<Text>但是未选择模型</Text>
				)}
			</View>
			<View className="flex flex-row justify-between items-end">
				<Pressable onPress={onPrevPage}>
					<Icon as={ArrowLeftCircle} />
				</Pressable>
				<Pressable onPress={onNextPage}>
					<Icon as={ArrowRightCircle} />
				</Pressable>
			</View>
		</View>
	);
}

function GeminiSetting() {
	const [key, setKey] = React.useState<string>("");
	const [testResult, setTestResult] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
	const [defaultModel, setDefaultModel] = useAtom(tranceDefaultModelAtom);
	const handleSaveKey = async () => {
		try {
			const keys = key
				.split("\n")
				.map((k) => k.trim())
				.filter((k) => k !== "");
			const jsonKeys = JSON.stringify(keys);
			await SecureStore.setItem("TRANCE_MODEL_GEMINI_KEY", jsonKeys);
			toast.success("Gemini 密钥保存成功");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};

	const handleTest = async () => {
		setIsLoading(true);
		try {
			const result = await tranceHiGeminiTextTest();
			if (result) setTestResult(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		} finally {
			setIsLoading(false);
		}
	};
	const handleSelectVersion = async (value: string) => {
		try {
			console.log(value);
			setDefaultModel({
				name: "Gemini",
				version: value,
			});
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-col gap-y-2">
			<Label>默认模型</Label>
			<Select onValueChange={(e) => handleSelectVersion(e?.value ?? "")}>
				<SelectTrigger>
					<SelectValue className="text-foreground text-sm native:text-lg" placeholder="Gemini 2.0 Flash" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem label="Gemini 2.0 Flash" value="gemini-2.0-flash">
							Gemini 2.0 Flash
						</SelectItem>
						<SelectItem label="Gemini 2.0 Flash Lite" value="gemini-2.0-flash-lite">
							Gemini 2.0 Flash Lite
						</SelectItem>
						<SelectItem label="Gemini 2.5 Flash Preview" value="gemini-2.5-flash-preview-05-20">
							Gemini 2.5 Flash Preview 05-20
						</SelectItem>
						<SelectItem label="Gemini 2.5 Pro Preview" value="gemini-2.5-pro-preview-05-06">
							Gemini 2.5 Pro Preview
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<Label>Gemini 密钥</Label>
			<Textarea placeholder="多个密钥用换行分隔" textAlignVertical="top" value={key} onChangeText={setKey} />
			<Button variant={"outline"} onPress={handleSaveKey}>
				<Text>保存</Text>
			</Button>
			<Label>测试一下</Label>
			<Text>这里只会测试第一个</Text>
			<Button disabled={isLoading} variant={"outline"} onPress={handleTest}>
				{isLoading ? <ActivityIndicator /> : <Text>测试 Gemini 通信</Text>}
			</Button>
			<Text>{testResult}</Text>
		</View>
	);
}

function CustomOpenAISettings() {
	const [key, setKey] = React.useState<string>("");
	const [url, setUrl] = React.useState<string>("");
	const [version, setVersion] = React.useState<string>("");
	const [testResult, setTestResult] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [modelList, setModelList] = React.useState<Array<string>>([]);
	const [defaultModel, setDefaultModel] = useAtom(tranceDefaultModelAtom);
	const handleFetchKey = async () => {
		setIsLoading(true);
		try {
			await Storage.setItem("TRANCE_MODEL_CUSTOM_OPENAI_URL", url);
			await SecureStore.setItem("TRANCE_MODEL_CUSTOM_OPENAI_KEY", key);
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};
			headers.Authorization = `Bearer ${key}`;
			const result = await fetch(`${url}/models`, {
				method: "GET",
				headers: headers,
			});
			const { data } = await result.json();
			const list = data.map((item: { id: string }) => item.id);
			console.log(list)
			setModelList(list);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		} finally {
			setIsLoading(false);
		}
	};

	const handleTest = async () => {
		setIsLoading(true);
		try {
			const result = await tranceHiCustomOpenAITextTest(url, version, key);
			if (result) {
				setTestResult(result)
				await Storage.setItem("TRANCE_MODEL_CUSTOM_OPENAI_VERSION",version)
				await Storage.setItem("TRANCE_ROOM_DEFAULT_MODEL",JSON.stringify({
					name: "Custom_OpenAI",
					version: version
				}))
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		} finally {
			setIsLoading(false);
		}
	};
	const handleSelectVersion = async (value: string) => {
		try {
			setVersion(value);
			setDefaultModel({
				name: "Custom_OpenAI",
				version: value,
			});
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex-1 flex flex-col gap-y-2">
			<Label>请求地址</Label>
			<Input value={url} onChangeText={setUrl} placeholder="" />
			<Label>自定义接口密钥</Label>
			<Input value={key} onChangeText={setKey} />
			<Button variant={"outline"} onPress={handleFetchKey}>
				{isLoading ? <ActivityIndicator /> : <Text>获取模型</Text>}
			</Button>
			{modelList.length > 0 && (
				<View className="flex flex-col flex-1 gap-y-2">
					<Label>选择模型</Label>
					<View className="flex-1">
						<ScrollView>
							<RadioGroup value={version} onValueChange={handleSelectVersion}>
								{modelList.map((item, index) => (
									<View key={String(index)} className="flex flex-row items-center gap-x-2">
										<RadioGroupItem value={item} />
										<Label>{item}</Label>
									</View>
								))}
							</RadioGroup>
						</ScrollView>
					</View>
				</View>
			)}
			{defaultModel && (
				<>
					<Label>测试一下</Label>
					<Button disabled={isLoading} variant={"outline"} onPress={handleTest}>
						{isLoading ? <ActivityIndicator /> : <Text>测试自定义 API 通信</Text>}
					</Button>
					<Text>{testResult}</Text>
				</>
			)}
		</View>
	);
}

function BootStrapFive({
	onNextPage,
	onPrevPage,
	onJumpPage,
}: {
	onNextPage: () => void;
	onPrevPage: () => void;
	onJumpPage: (index: number) => void;
}) {
	const [selectedCharacter, setSelectedCharacter] = useAtom(selectedCharacterAtom);
	const [name, setName] = React.useState<string>("");
	const [cover, setCover] = React.useState<string>("");
	const handlePickCharacterPng = async () => {
		try {
			const result = await pickerCharacterPNGCard();
			if (result) {
				const characterRows = await createCharacterImport(result);
				if (characterRows) {
					setName(result.character.name);
					setCover(result.character.cover);
					setSelectedCharacter(characterRows);
				}
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<Animated.View entering={FadeIn.duration(1000)} className="flex flex-1">
			<View className="flex-1  flex-col gap-y-4">
				<Text className="text-3xl">5 / 6</Text>
				<Text className="text-3xl font-black">美好的事物从未离开</Text>
				<Text className="text-lg font-bold">是时候回应了</Text>
				{!selectedCharacter ? (
					<Button onPress={handlePickCharacterPng}>
						<Text>导入一个角色卡</Text>
					</Button>
				) : (
					<View className="flex flex-1 flex-col gap-y-4 pb-16">
						<Text className="font-bold text-xl">{name}</Text>
						<Image source={{ uri: cover }} className="h-full w-full rounded-md" alt="cover" />
					</View>
				)}
			</View>
			<View className="flex flex-row justify-between items-end">
				<Pressable onPress={onPrevPage}>
					<Icon as={ArrowLeftCircle} />
				</Pressable>
				{!selectedCharacter ? (
					<Pressable onPress={onNextPage}>
						<Text>以后再说</Text>
					</Pressable>
				) : (
					<Pressable onPress={onNextPage}>
						<Icon as={ArrowRightCircle} />
					</Pressable>
				)}
			</View>
		</Animated.View>
	);
}

function BootStrapSix({
	onNextPage,
	onPrevPage,
	onJumpPage,
}: {
	onNextPage: () => void;
	onPrevPage: () => void;
	onJumpPage: (index: number) => void;
}) {
	const [defaultPromptGroup, setDefaultPromptGroup] = useAtom(tranceDefaultPromptGroupAtom);
	const [promptGroupId, setPromptGroupId] = useAtom(promptGroupIdAtom);
	const [promptName, setPromptName] = React.useState<string>("");

	const handleImportPrompt = async () => {
		try {
			const result = await pickerPrompt();
			if (!result) return;
			const promptGroupRows = await createPromptImport(result);
			if (promptGroupRows) {
				setPromptGroupId(promptGroupRows);
				setPromptName(result.name);
				setDefaultPromptGroup(promptGroupRows);
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<Animated.View entering={FadeIn.duration(1000)} className="flex flex-1">
			<View className="flex-1  flex-col gap-y-4">
				<Text className="text-3xl">6 / 6</Text>
				<Text className="text-3xl font-black">这是最后一步了</Text>
				<Text>目前设置的所有内容后期都可以修改</Text>
				<Label>可选: 导入默认提示词</Label>
				{!promptGroupId ? (
					<Button onPress={handleImportPrompt}>
						<Text>导入提示词</Text>
					</Button>
				) : (
					<Text>{promptName}</Text>
				)}
			</View>
			<View className="flex flex-row justify-between items-end">
				<Pressable onPress={onPrevPage}>
					<Icon as={ArrowLeftCircle} />
				</Pressable>
				<Pressable onPress={onNextPage}>
					<Icon as={ArrowRightCircle} />
				</Pressable>
			</View>
		</Animated.View>
	);
}

function BootStrapEnd({
	onNextPage,
	onPrevPage,
	onJumpPage,
}: {
	onNextPage: () => void;
	onPrevPage: () => void;
	onJumpPage: (index: number) => void;
}) {
	const [defaultModel, setDefaultModel] = useAtom(tranceDefaultModelAtom);
	const [defaultPromptGroup, setDefaultPromptGroup] = useAtom(tranceDefaultPromptGroupAtom);
	const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
	const [tranceIsBootstrapped, setTranceIsBootstrapped] = useAtom(tranceAppIsBootstrappedAtom);
	const [selectedCharacter, setSelectedCharacter] = useAtom(selectedCharacterAtom);

	const handleEndBootstrap = async () => {
		try {
			if (!selectedCharacter) {
				setTranceIsBootstrapped(true);
				router.replace("/");
				return;
			}
			const character = await readCharacterById(selectedCharacter);
			const roomRows = await createRoomNewPrivateChat(character);
			if (roomRows) {
				setTranceIsBootstrapped(true);
				router.replace("/");
				return;
			}
			setTranceIsBootstrapped(true);
			router.replace("/");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<Animated.View entering={FadeIn.duration(1000)} className="flex flex-1">
			<View className="flex-1  flex-col gap-y-4">
				<Text className="text-4xl">寂溺迷境至</Text>
				<Text className="text-4xl">终得以喘息</Text>
			</View>
			<View className="flex flex-row justify-between items-end">
				<Pressable onPress={onPrevPage}>
					<Icon as={ArrowLeftCircle} />
				</Pressable>
				<Pressable onPress={handleEndBootstrap}>
					<Text>进入喘息</Text>
				</Pressable>
			</View>
		</Animated.View>
	);
}
