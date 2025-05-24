import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Modal, Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Import } from "lucide-react-native";
import Icon from "@/components/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useRegexGroupList } from "@/hook/useRegex";
import { useKnowledgeBaseList } from "@/hook/useKnowledgeBase";
import StatusBadge from "@/components/StatusBadge";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/ui/heading";
export default function KnowledgeBaseScreen() {
	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				<Header />
				<KnowledgeBaseList />
			</SafeAreaView>
		</View>
	);
}

function Header() {
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<View>
				<Heading size="2xl">知识库</Heading>
			</View>

			<View>
				<Pressable onPress={() => router.push("/knowledgeBase/knowledgeBaseImportModal")}>
					<Icon as={Import} />
				</Pressable>
			</View>
		</View>
	);
}

function KnowledgeBaseList() {
	const knowledgeBase = useKnowledgeBaseList();
	return (
		<View className="flex flex-1">
			<ScrollView>
				<View className="flex flex-1 p-3 gap-y-2">
					{knowledgeBase.map((item) => (
						<Card key={item.id}>
							<Pressable
								onPress={() => router.push(`/knowledgeBase/${item.id}`)}
								className="flex flex-row p-3 justify-between items-center active:opacity-80"
							>
								<View className="flex flex-col gap-y-2">
									<View className="flex flex-row items-center gap-x-2">
										<StatusBadge status={item.is_enabled ? "active" : "offline"} />
									</View>
									<Text className="font-bold">{item.name}</Text>
								</View>
								<Icon as={ArrowRight} />
							</Pressable>
						</Card>
					))}
				</View>
			</ScrollView>
		</View>
	);
}
