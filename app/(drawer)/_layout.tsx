// app/(drawer)/_layout.tsx
import { ThemeSwitch } from "@/components/themeSwitch";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon, MessageCircleIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useThemeDrawer, useTranceTheme } from "@/hook/theme";
import { USER_avtarAtom, USER_nameAtom } from "@/store/core";
import { colorModeAtom } from "@/store/theme";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Storage } from "expo-sqlite/kv-store";
import { useAtom } from "jotai";
import {
	BookUserIcon,
	BotIcon,
	CogIcon,
	HammerIcon,
	LibraryIcon,
	RegexIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DrawerLayout() {
	const [colorMode] = useAtom(colorModeAtom);
	const themeConfig = useTranceTheme();
	return (
		<Drawer
			drawerContent={() => <CustomDrawerContent />}
			screenOptions={{
				...themeConfig.Drawer.options,
				swipeEdgeWidth: 768,
			}}
		>
			<Drawer.Screen
				name="my"
				options={{
					title: "我的",
				}}
			/>
			<Drawer.Screen
				name="message"
				options={{
					title: "消息",
				}}
			/>
			<Drawer.Screen
				name="character"
				options={{
					title: "角色卡",
				}}
			/>
			<Drawer.Screen
				name="model"
				options={{
					title: "模型",
				}}
			/>
			<Drawer.Screen
				name="knowledgeBase"
				options={{
					title: "知识库",
				}}
			/>
			<Drawer.Screen
				name="prompt"
				options={{
					title: "提示词",
				}}
			/>
			<Drawer.Screen
				name="regex"
				options={{
					title: "正则脚本",
				}}
			/>
			<Drawer.Screen
				name="setting"
				options={{
					title: "设置",
				}}
			/>
		</Drawer>
	);
}

// 导航列表
const drawerNavList = [
	{
		sortId: 1,
		name: "消息",
		path: "(drawer)/message",
		icon: MessageCircleIcon,
	},
	{
		sortId: 2,
		name: "角色卡",
		path: "(drawer)/character",
		icon: BookUserIcon,
	},

	{
		sortId: 3,
		name: "提示词",
		path: "(drawer)/prompt",
		icon: HammerIcon,
	},
	{
		sortId: 4,
		name: "AI 模型",
		path: "(drawer)/model",
		icon: BotIcon,
	},
	{
		sortId: 5,
		name: "知识库",
		path: "(drawer)/knowledgeBase",
		icon: LibraryIcon,
	},
	{
		sortId: 6,
		name: "正则脚本",
		path: "(drawer)/regex",
		icon: RegexIcon,
	},
	{
		sortId: 7,
		name: "设置",
		path: "(drawer)/setting",
		icon: CogIcon,
	},
];

// 自定义侧边栏
const CustomDrawerContent = () => {
	const [avatar, setAvatar] = useAtom(USER_avtarAtom);
	const [name, setName] = useAtom(USER_nameAtom);
	const themeConfig = useThemeDrawer();
	React.useEffect(() => {
		const initAvatar = async () => {
			const avatar = await Storage.getItem("TRANCE_USER_AVATAR");
			const name = await Storage.getItem("TRANCE_USER_NAME");
			if (!name) {
				await Storage.setItem("TRANCE_USER_NAME", "User");
				const name = await Storage.getItem("TRANCE_USER_NAME");
				setName(name || "");
			}
			if (avatar) {
				setAvatar(avatar);
			}
			if (name) {
				setName(name);
			}
		};
		initAvatar();
	}, [setAvatar, setName]);
	return (
		<Box className="flex-1">
			<SafeAreaView>
				<VStack>
					<Box className="h-32 p-3">
						<HStack className="justify-between">
							<VStack space="sm">
								{avatar ? (
									<Pressable onPress={() => router.push("/(drawer)/my")}>
										<Image
											source={avatar}
											className="h-16 w-16 rounded-full"
											alt="userAvatar"
										/>
									</Pressable>
								) : (
									<Pressable onPress={() => router.push("/(drawer)/my")}>
										<Skeleton className="w-16 h-16 rounded-full" />
									</Pressable>
								)}
								{name && (
									<Text
										style={{
											color: themeConfig.options.drawerInactiveTintColor,
										}}
										bold
									>
										{name}
									</Text>
								)}
							</VStack>
							<ThemeSwitch />
						</HStack>
					</Box>
					<Box className="p-6">
						<VStack space="4xl">
							{drawerNavList.map((item) => (
								<Pressable
									onPress={() => router.push(item.path as any)}
									key={item.sortId}
								>
									<HStack space="2xl" className="items-center">
										<Icon
											style={{
												color: themeConfig.options.drawerInactiveTintColor,
											}}
											size="xl"
											as={item.icon}
										/>
										<Heading
											style={{
												color: themeConfig.options.drawerInactiveTintColor,
											}}
										>
											{item.name}
										</Heading>
									</HStack>
								</Pressable>
							))}
						</VStack>
					</Box>
				</VStack>
			</SafeAreaView>
		</Box>
	);
};
