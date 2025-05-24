import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Import, Plus } from "lucide-react-native";
import Icon from "@/components/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useRegexGroupList } from "@/hook/useRegex";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
export default function RegexScreen() {
	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				<ScreenHeader />
				<RegexGroupList />
			</SafeAreaView>
		</View>
	);
}

function ScreenHeader() {
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<View>
				<Heading size="2xl">正则脚本</Heading>
			</View>
			<View>
				<Link href={"/regex/newRegexGroupModal"}>
					<Icon as={Plus} />
				</Link>
			</View>
		</View>
	);
}

function RegexGroupList() {
	const regex = useRegexGroupList();
	return (
		<View className="flex-1">
			<ScrollView>
				<View className="flex flex-col gap-y-2 p-3">
					{regex.map((item) => (
						<Card key={item.id}>
							<Pressable
								onPress={() => router.push(`/regex/${item.id}`)}
								className="flex flex-row p-3 justify-between items-center active:opacity-80"
							>
								<View className="flex flex-col gap-y-2">
									<View className="flex flex-row items-center gap-x-2">
										<Badge className={item.is_enabled ? "bg-green-400" : "bg-gray-400"}>
											<Text>{item.is_enabled ? "启用中" : "已禁用"}</Text>
										</Badge>
										<Badge variant={"outline"}>
											<Text>{item.type}</Text>
										</Badge>
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
