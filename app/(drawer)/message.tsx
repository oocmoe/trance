import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRoomList } from "@/hook/room";
import type { RenderRoomList } from "@/types/render";
import { useEffect } from "react";
import { Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { atom, useAtom } from "jotai";

// 房间列表状态
const renderRoomListAtom = atom<RenderRoomList>();
export default function MessageScreen() {
	renderRoomList();
	return (
		<Box className="h-full pt-2 bg-white dark:bg-slate-950">
			<RoomList />
		</Box>
	);
}

// 房间列表
function renderRoomList() {
	const list = useRoomList();
	const [, setRenderRoomList] = useAtom(renderRoomListAtom);
	useEffect(() => {
		setRenderRoomList(list.data);
	}, [list.data]);
}

// 渲染角色卡列表
function RoomList() {
	const [list] = useAtom(renderRoomListAtom);
	return (
		<ScrollView>
			{list && typeof list != undefined ? (
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
			) : (
				<HStack className="h-20 m-2" space="md">
					<Skeleton className="w-16 h-16 rounded-full" />
					<VStack className="m-2" space="md">
						<SkeletonText className="w-20 h-3" />
						<SkeletonText className="w-16 h-2" />
					</VStack>
				</HStack>
			)}
		</ScrollView>
	);
}
