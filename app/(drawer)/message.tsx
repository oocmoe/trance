import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRoomList } from "@/hook/room";
import type { RenderRoomList } from "@/types/render";
import { router } from "expo-router";
import { atom, useAtom } from "jotai";
import { MessageCircleDashedIcon } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView } from "react-native";

// 房间列表状态
const renderRoomListAtom = atom<RenderRoomList>();
export default function MessageScreen() {
	renderRoomList();
	return (
		<Box className="h-full p-3">
			<RoomList />
		</Box>
	);
}

// 房间列表
function renderRoomList() {
	const list = useRoomList();
	const [, setRenderRoomList] = useAtom(renderRoomListAtom);
	React.useEffect(() => {
		setRenderRoomList(list.data);
	}, [list.data, setRenderRoomList]);
}

// 渲染角色卡列表
const RoomList = () => {
	const [list] = useAtom(renderRoomListAtom);
	if (!list)
		return (
			<Box>
				<HStack className="h-20 m-2" space="md">
					<Skeleton className="w-16 h-16 rounded-full" />
					<VStack className="m-2" space="md">
						<SkeletonText className="w-20 h-3" />
						<SkeletonText className="w-16 h-2" />
					</VStack>
				</HStack>
			</Box>
		);
	if (list.length === 0)
		return (
			<Box className="h-full justify-center items-center">
				<Box className="flex flex-col items-center gap-y-4">
					<Icon size="xl" as={MessageCircleDashedIcon} />
					<Text>还没有创建任何聊天</Text>
				</Box>
			</Box>
		);
	return (
		<ScrollView>
			<VStack>
				{list.map((item) => (
					<Pressable
						key={item.id}
						onPress={() => router.push(`/room/${item.id}`)}
						className="h-20 overflow-hidden"
					>
						<HStack className="flex-1 mx-2" space="md">
							<Image
								source={item.cover}
								alt={item.name}
								className="h-16 w-16 rounded-full"
							/>
							<VStack className="flex-1 mx-2">
								<Text bold>{item.name}</Text>
								<Text>{item.type}</Text>
							</VStack>
						</HStack>
					</Pressable>
				))}
			</VStack>
		</ScrollView>
	);
};
