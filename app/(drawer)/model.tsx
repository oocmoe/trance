import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@/components/Icon";
import { ArrowRight } from "lucide-react-native";
import { Card } from "@/components/ui/card";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { SvgUri } from "react-native-svg";
import { useAtomValue } from "jotai";
import { tranceIsDarkModeAtom } from "@/store/core";
import { Label } from "@/components/ui/label";
import { CardNavItem } from "@/components/card-navItem";
export default function ModelScreen() {
	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				<Text className="p-3 font-bold text-2xl">模型</Text>
				<DefaultModel />
				<ModelList />
			</SafeAreaView>
		</View>
	);
}

function ModelList() {
	return (
		<View className="flex flex-col gap-y-4 p-3">
			<Label>模型列表</Label>
			<Gemini />
			<CustomOpenAI />
		</View>
	);
}

function DefaultModel() {
	return (
		<View className="flex flex-col gap-y-2 p-3">
			<Label>全局设置</Label>
			<CardNavItem label="默认模型" href={"/model/defaultModelModal"} />
		</View>
	);
}

function Gemini() {
	return (
		<Pressable onPress={() => router.push("/model/gemini")} className="active:opacity-80">
			<Card className="flex flex-row justify-between items-center p-3">
				<View className="flex flex-row items-center gap-x-4">
					<SvgUri
						uri={"https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini-color.svg"}
						height={24}
						width={24}
					/>
					<Text className="font-bold">Gemini</Text>
				</View>
				<Icon as={ArrowRight} />
			</Card>
		</Pressable>
	);
}

function CustomOpenAI() {
	const isDarkMode = useAtomValue(tranceIsDarkModeAtom);
	return (
		<Pressable onPress={() => router.push("/model/customOpenAI")} className="active:opacity-80">
			<Card className="flex flex-row justify-between items-center p-3">
				<View className="flex flex-row items-center gap-x-4">
					<SvgUri
						uri={"https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg"}
						height={24}
						width={24}
						color={isDarkMode ? "white" : "black"}
					/>
					<Text className="font-bold">Custom OpenAI</Text>
				</View>
				<Icon as={ArrowRight} />
			</Card>
		</Pressable>
	);
}
