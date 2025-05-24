import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAtom, useAtomValue } from "jotai";
import { tranceAppIsBootstrappedAtom, tranceUsernameAtom } from "@/store/core";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite/driver";
import React from "react";
import Icon from "@/components/Icon";
import { User } from "lucide-react-native";
import { Link, Redirect, useRouter } from "expo-router";
import { ImageBackground } from "expo-image";
import { readLatestRoomChatData } from "@/db/client";
import { cssInterop } from "nativewind";

const expo = openDatabaseSync("trance.db");
const db = drizzle(expo);

// nativewind
cssInterop(ImageBackground, { className: "style" });

export default function IndexScreen() {
	// bootstrap
	const isBootstrapped = useAtomValue(tranceAppIsBootstrappedAtom);
	// drizzle
	const { success, error } = useMigrations(db, migrations);
	const [migrationStatus, setMigrationStatus] = React.useState<"loading" | "error" | "success">("loading");

	React.useEffect(() => {
		if (error) {
			setMigrationStatus("error");
		} else if (success) {
			setMigrationStatus("success");
		}
	}, [success, error]);

	if (migrationStatus === "loading") {
		return (
			<View className="flex-1 justify-center items-center ">
				<Text>Initializing...</Text>
			</View>
		);
	}

	if (migrationStatus === "error") {
		return (
			<View className="flex-1 justify-center items-center">
				<Text>Initialization Failure : {error?.message}</Text>
			</View>
		);
	}
	if (migrationStatus === "success" && isBootstrapped === false) return <Redirect href="/bootstrap" />;

	if (migrationStatus === "success" && isBootstrapped === true)
		return (
			<SafeAreaView className="flex-1 p-3">
				<IndexHero />
				<IndexBento />
			</SafeAreaView>
		);
}

function IndexHero() {
	const [username] = useAtom(tranceUsernameAtom);
	return (
		<Animated.View entering={FadeIn.duration(1000)} className="flex flex-col gap-y-3 p-3">
			<Text className="font-bold text-xl">亲爱的 {username}</Text>
			<Text style={{ lineHeight: 48 }} className="font-extrabold text-5xl">
				欢迎回来
			</Text>
		</Animated.View>
	);
}

function IndexBento() {
	const router = useRouter();
	const [latestChatBackground, setLatestChatBackground] = React.useState<string | undefined>(undefined);
	const [latestChatRoomId, setLatestChatRoomId] = React.useState<number | undefined>(undefined);
	React.useEffect(() => {
		const fetchLatestChatBackground = async () => {
			const data = await readLatestRoomChatData();
			if (data?.cover) {
				setLatestChatBackground(data.cover);
			}
			setLatestChatRoomId(data?.id);
		};
		fetchLatestChatBackground();
	}, []);
	return (
		<Animated.View entering={FadeInDown.duration(1000)} className="flex flex-col">
			<View className="flex flex-row gap-x-3 h-40 justify-between items-center">
				<Pressable disabled={!latestChatRoomId} onPress={() => router.push(`/room/${latestChatRoomId}`)} className="flex-1">
					<Card className="h-full">
						<View className="p-4">
							<Text>{!latestChatRoomId ? "暂无聊天记录" : "最新对话"}</Text>
						</View>

						<ImageBackground source={latestChatBackground} className="h-full w-full absolute opacity-20 " />
					</Card>
				</Pressable>

				<View className="flex flex-col gap-y-2">
					<Pressable onPress={() => router.push("/character/characterImport")} className="flex-1">
						<Card className="p-4 h-full">
							<Text>导入角色卡</Text>
						</Card>
					</Pressable>
				</View>
			</View>
		</Animated.View>
	);
}
