import { useRoomListByCharacterId } from "@/hook/useRoom";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollView } from "react-native-gesture-handler";
export default function CharacterRoomListScreen() {
	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				<CharacterRoomList />
			</SafeAreaView>
		</View>
	);
}

function CharacterRoomList() {
	const { id } = useLocalSearchParams();
	const list = useRoomListByCharacterId(Number(id));
	return (
		<View className="flex-1">
			{list.length > 1 ? (
				<ScrollView>
					<View className="flex flex-col gap-y-3 p-3">
						{list.map((item) => (
							<Pressable onPress={() => router.push(`/room/${item.id}`)} key={item.id}>
								<Card className="shadow">
									<CardHeader className="flex flex-row items-center gap-x-2">
										<Badge variant={"outline"}>
											<Text>{item.type === "private" ? "私聊" : "群聊"} </Text>
										</Badge>
										<Text>{item.name}</Text>
									</CardHeader>
									<CardContent>
										<Text>
											创建时间:
											{format(new Date(item.created_at), "yyyy-MM-dd HH:mm:ss")}
										</Text>
										<Text>
											更新时间:
											{format(new Date(item.created_at), "yyyy-MM-dd HH:mm:ss")}
										</Text>
									</CardContent>
								</Card>
							</Pressable>
						))}
					</View>
				</ScrollView>
			) : (
				<View className="flex flex-1 justify-center items-center">
					<Text>还没有创建聊天</Text>
				</View>
			)}
		</View>
	);
}
