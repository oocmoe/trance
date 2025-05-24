import "@/global.css";
import { View } from "react-native";
import { useColorScheme } from "@/lib/useColorScheme";
import { Pressable } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Text } from "@/components/ui/text";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import i18n from "@/languages/i18n";
import { useAtom } from "jotai";
import { tranceUsernameAtom } from "@/store/core";

import {
	Blocks,
	Bot,
	Circle,
	Cog,
	Hammer,
	Library,
	MessageCircle,
	MessageCircleIcon,
	Plug,
	Regex,
	Settings,
	Settings2,
	User,
	UserIcon,
	UserRound,
	UsersRound,
} from "lucide-react-native";
import TranceUserAvatar from "@/components/user-avatar";
import { useRouter } from "expo-router";
import { ColorModeToggle } from "@/components/ColorModeToggle";

export default function DrawerLayout() {
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	return (
		<Drawer
			drawerContent={(props) => <CustomDrawer {...props} />}
			screenOptions={{
				headerShown: false,
				drawerStyle: {
					width: 300,
					borderEndEndRadius: 0,
				},
				swipeEdgeWidth: 768,
			}}
		>
			<Drawer.Screen
				name="index"
				options={{
					drawerIcon: () => <Circle color={isDarkColorScheme ? "white" : "black"} />,
					title: i18n.t("drawer.index"),
				}}
			/>
			<Drawer.Screen
				name="message"
				options={{
					drawerIcon: () => <MessageCircle color={isDarkColorScheme ? "white" : "black"} />,
					title: i18n.t("drawer.message"),
				}}
			/>
			<Drawer.Screen
				name="character"
				options={{
					drawerIcon: () => <UsersRound color={isDarkColorScheme ? "white" : "black"} />,
					title: i18n.t("drawer.character"),
				}}
			/>

			<Drawer.Screen
				name="knowledgeBase"
				options={{
					drawerIcon: () => <Library color={isDarkColorScheme ? "white" : "black"} />,
					title: i18n.t("drawer.knowledgeBase"),
				}}
			/>

			<Drawer.Screen
				name="prompt"
				options={{
					drawerIcon: () => <Hammer color={isDarkColorScheme ? "white" : "black"} />,
					title: i18n.t("drawer.prompt"),
				}}
			/>

			<Drawer.Screen
				name="model"
				options={{
					drawerIcon: () => <Bot color={isDarkColorScheme ? "white" : "black"} />,
					title: i18n.t("drawer.model"),
				}}
			/>

			<Drawer.Screen
				name="regex"
				options={{
					drawerIcon: () => <Regex color={isDarkColorScheme ? "white" : "black"} />,
					title: i18n.t("drawer.regex"),
				}}
			/>

			<Drawer.Screen
				name="setting"
				options={{
					drawerIcon: () => <Settings color={isDarkColorScheme ? "white" : "black"} />,
					title: i18n.t("drawer.setting"),
				}}
			/>

			{/* <Drawer.Screen
				name="extension"
				options={{
					drawerIcon: () => (
						<Blocks color={isDarkColorScheme ? "white" : "black"} />
					),
					title: i18n.t("drawer.extension"),
				}}
			/> */}

			<Drawer.Screen
				name="my"
				options={{
					title: i18n.t("drawer.my"),
					drawerItemStyle: { display: "none" },
				}}
			/>
		</Drawer>
	);
}

function CustomDrawer(props: any) {
	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
				<CustomDrawerHeader />
				<View style={{ flexGrow: 1 }}>
					<DrawerItemList {...props} />
				</View>
				<CustomDrawerFooter />
			</DrawerContentScrollView>
		</View>
	);
}

function CustomDrawerHeader() {
	const [username] = useAtom(tranceUsernameAtom);
	const router = useRouter();
	return (
		<View className="h-24">
			<View className="flex flex-row gap-x-2">
				<Pressable onPress={() => router.push("/my")}>
					<TranceUserAvatar />
				</Pressable>
				<View className="flex flex-col">
					<Text className="font-black">{username}</Text>
				</View>
			</View>
		</View>
	);
}

function CustomDrawerFooter() {
	return (
		<View className="h-16">
			<View className="flex flex-row gap-x-8 mx-4 justify-between items-center">
				<ColorModeToggle />
			</View>
		</View>
	);
}
