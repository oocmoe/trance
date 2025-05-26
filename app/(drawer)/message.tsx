import { useRoomFloorRecordByRoomId, useRoomList } from "@/hook/useRoom";
import { router } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchX } from "lucide-react-native";
import Icon from "@/components/Icon";
import { format } from "date-fns";
import { Heading } from "@/components/ui/heading";
import { MessageFlatListCard } from "@/components/message-flatListCard";
export default function MessageScreen() {
	return (
		<View className="flex-1">
			<SafeAreaView className="flex-1">
				<Header />
				<MessageList />
			</SafeAreaView>
		</View>
	);
}

function Header() {
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<View>
				<Heading size="2xl">消息</Heading>
			</View>
		</View>
	);
}

function MessageList() {
	const roomList = useRoomList();
	return (
		<View className="flex-1">
			{roomList.length > 0 ? (
				<FlatList
					data={roomList}
					numColumns={1}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={{ flexGrow: 1 }}
					renderItem={({ item }) => (
						<MessageFlatListCard item={item} />
					)}
				/>
			) : (
				<View className="flex-1 justify-center items-center">
					<Icon as={SearchX} />
					<Text>未找到相关房间</Text>
				</View>
			)}
		</View>
	);
}
