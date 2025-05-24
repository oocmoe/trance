import { Card } from "@/components/ui/card";
import { Link, router } from "expo-router";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import Icon from "@/components/Icon";
import { ArrowRight, Circle, Palette } from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
export default function SettingScreen() {
	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				<ScreenHeader />
				<SettingList />
			</SafeAreaView>
		</View>
	);
}

function ScreenHeader() {
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<View>
				<Heading size="2xl">设置</Heading>
			</View>
		</View>
	);
}

function SettingList() {
	return (
		<View className="flex flex-col gap-y-2 p-3">
			<Theme />
			<About />
		</View>
	);
}

function Theme() {
	return (
		<Pressable onPress={() => router.push("/setting/theme")}>
			<Card className="flex flex-row p-3 justify-between items-center">
				<View className="flex flex-row items-center gap-x-2">
					<Icon as={Palette} />
					<Heading>主题</Heading>
				</View>

				<Icon as={ArrowRight} />
			</Card>
		</Pressable>
	);
}

function About() {
	return (
		<Pressable onPress={() => router.push("/setting/about")}>
			<Card className="flex flex-row p-3 justify-between items-center">
				<View className="flex flex-row items-center gap-x-2">
					<Icon as={Circle} />
					<Heading>关于喘息</Heading>
				</View>

				<Icon as={ArrowRight} />
			</Card>
		</Pressable>
	);
}
