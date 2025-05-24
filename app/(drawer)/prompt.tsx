import Icon from "@/components/Icon";
import { Card } from "@/components/ui/card";
import { usePromptGroupList } from "@/hook/usePrompt";
import { Link, router } from "expo-router";
import { Import } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
export default function PromptScreen() {
	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				<Header />
				<PromptList />
			</SafeAreaView>
		</View>
	);
}

function Header() {
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Heading size="2xl">提示词</Heading>
			<Link href={"/prompt/promptImport"}>
				<Icon as={Import} />
			</Link>
		</View>
	);
}

function PromptList() {
	const prompt = usePromptGroupList();
	return (
		<ScrollView>
			<View className="flex flex-col gap-y-2 p-3">
				{prompt.map((item) => (
					<Pressable onPress={() => router.push(`/prompt/${item.id}`)} key={item.id}>
						<Card className="p-3">
							<Text>{item.name}</Text>
						</Card>
					</Pressable>
				))}
			</View>
		</ScrollView>
	);
}
