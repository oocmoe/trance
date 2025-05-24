import { Card } from "@/components/ui/card";
import { Pressable, View } from "react-native";
import { Storage } from "expo-sqlite/kv-store";
import { TRANCE_THEME_PROFILE_DEFAULT } from "@/constant/theme/default";
import { toast } from "sonner-native";
import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { TRANCE_THEME_PROFILE_GREEN } from "@/constant/theme/green";
import { atom, useAtom } from "jotai";
import React from "react";
import { TRANCE_THEME_PROFILE_OCEAN } from "@/constant/theme/ocean";
import { TRANCE_THEME_PROFILE_PEACH } from "@/constant/theme/peach";

const selectedThemeAtom = atom<string>("");

export default function SettingThemeScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "主题" }} />
			<View className="flex-1">
				<SelectedTheme />
				<View className="flex flex-col gap-y-2 p-3">
					<MultiTheme />
					<SingleTheme />
				</View>
			</View>
		</>
	);
}

function SelectedTheme() {
	const [theme, setTheme] = useAtom(selectedThemeAtom);
	React.useEffect(() => {
		const fetchTheme = async () => {
			const theme = await Storage.getItem("TRANCE_ROOM_DEFAULT_THEME");
			console.log(theme);
			if (theme) {
				setTheme(JSON.parse(theme).profile.name);
			}
		};
		fetchTheme();
	}, [setTheme]);
	return (
		<View className="flex flex-row items-center justify-between p-3">
			<Heading>当前房间默认主题</Heading>
			<Text>{theme}</Text>
		</View>
	);
}

function MultiTheme() {
	return (
		<View className="flex flex-col gap-y-2">
			<Heading>多色主题</Heading>
			<DefaultTheme />
			<ThemeGreen />
		</View>
	);
}

function SingleTheme() {
	return (
		<View className="flex flex-col gap-y-2">
			<Heading>单色主题</Heading>
			<ThemePeach />
			<ThemeOcean />
		</View>
	);
}

function DefaultTheme() {
	const [theme, setTheme] = useAtom(selectedThemeAtom);
	const handleChange = async () => {
		try {
			const value = TRANCE_THEME_PROFILE_DEFAULT;
			Storage.setItem("TRANCE_ROOM_DEFAULT_THEME", JSON.stringify(value));
			setTheme(value.profile.name);
			toast.success("更换成功");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<Pressable onPress={handleChange}>
			<Card className="p-3">
				<Text>默认</Text>
			</Card>
		</Pressable>
	);
}

function ThemePeach() {
	const [theme, setTheme] = useAtom(selectedThemeAtom);
	const handleChange = async () => {
		try {
			const value = TRANCE_THEME_PROFILE_PEACH;
			Storage.setItem("TRANCE_ROOM_DEFAULT_THEME", JSON.stringify(value));
			setTheme(value.profile.name);
			toast.success("更换成功");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<Pressable onPress={handleChange}>
			<Card className="p-3 bg-[#fa95a7]">
				<Text className="text-white">桃子</Text>
			</Card>
		</Pressable>
	);
}

function ThemeOcean() {
	const [theme, setTheme] = useAtom(selectedThemeAtom);
	const handleChange = async () => {
		try {
			const value = TRANCE_THEME_PROFILE_OCEAN;
			Storage.setItem("TRANCE_ROOM_DEFAULT_THEME", JSON.stringify(value));
			setTheme(value.profile.name);
			toast.success("更换成功");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<Pressable onPress={handleChange}>
			<Card className="p-3 bg-[#8ee2fa]">
				<Text className="text-white">海洋</Text>
			</Card>
		</Pressable>
	);
}

function ThemeGreen() {
	const [theme, setTheme] = useAtom(selectedThemeAtom);
	const handleChange = async () => {
		try {
			const value = TRANCE_THEME_PROFILE_GREEN;
			Storage.setItem("TRANCE_ROOM_DEFAULT_THEME", JSON.stringify(value));
			setTheme(value.profile.name);
			toast.success("更换成功");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<Pressable onPress={handleChange}>
			<Card className="p-3 bg-[#13c468]">
				<Text className="text-black">绿色</Text>
			</Card>
		</Pressable>
	);
}
