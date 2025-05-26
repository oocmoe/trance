import { Heading } from "@/components/ui/heading";
import type { RoomFloorTable, RoomTable } from "@/db/schema";
import { format } from "date-fns";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useRoomFloorRecordByRoomId } from "@/hook/useRoom";
export const MessageFlatListCard = ({ item }: { item: RoomTable }) => {
  const record = useRoomFloorRecordByRoomId(item.id);
	return (
		<View>
			<Pressable
				onPress={() => {
					router.push(`/room/${item.id}`);
				}}
				className="active:opacity-80"
			>
				<View className="p-3  flex flex-row justify-between items-center">
					<Image source={item.cover} className="w-32 h-24 rounded-md" contentFit="cover" />
					<View className="flex-1 ml-3 flex flex-col gap-y-1">
						<Text className="font-bold">{item.name}</Text>
						<Text>{format(new Date(item.created_at), "yyyy-MM-dd HH:mm:ss")}</Text>
            <Text>共 {record} 条消息</Text>
					</View>
				</View>
			</Pressable>
		</View>
	);
};
