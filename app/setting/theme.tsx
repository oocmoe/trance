import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useThemeRoom } from "@/hook/theme";
import { tranceThemeAtom } from "@/store/theme";
import {
	themeDefaultConfig,
	themeDefaultGreenConfig,
	themeDefaultPeachConfig,
	themeDefaultPomeloThemeConfig,
} from "@/utils/theme/presuppose";
import { useAtom } from "jotai";
import { Pressable, ScrollView } from "react-native";
export default function ThemeScreen() {
	return (
		<Box className="h-full p-3">
			<ScrollView>
				<VStack space="md">
					<Text bold>房间设置</Text>
					<RoomAssistantAvatarShow />
					<RoomAssistantNameShow />
					<RoomUserAvatarShow />
					<RoomUserNameShow />
					<Text bold>双色模式</Text>
					<DefaultTheme />
					<GreenTheme />
					<Text bold>单色模式</Text>
					<PeachTheme />
					<PomeloTheme />
				</VStack>
			</ScrollView>
		</Box>
	);
}

const RoomAssistantAvatarShow = () => {
	const themeConfig = useThemeRoom();
	const [, setTranceTheme] = useAtom(tranceThemeAtom);
	const handleChange = async (value: boolean) => {
		setTranceTheme(async (prev) => {
			const theme = await prev;
			return {
				...theme,
				light: {
					...theme.light,
					Room: {
						...theme.light.Room,
						profile: {
							...theme.light.Room.profile,
							is_AssistantAvatarShow: value,
						},
					},
				},
				dark: {
					...theme.dark,
					Room: {
						...theme.dark.Room,
						profile: {
							...theme.dark.Room.profile,
							is_AssistantAvatarShow: value,
						},
					},
				},
			};
		});
	};
	return (
		<Box>
			<HStack className="justify-between items-center">
				<Text>显示角色头像</Text>
				<Switch
					onValueChange={handleChange}
					value={themeConfig.profile.is_AssistantAvatarShow}
				/>
			</HStack>
		</Box>
	);
};

const RoomAssistantNameShow = () => {
	const themeConfig = useThemeRoom();
	const [, setTranceTheme] = useAtom(tranceThemeAtom);
	const handleChange = async (value: boolean) => {
		setTranceTheme(async (prev) => {
			const theme = await prev;
			return {
				...theme,
				light: {
					...theme.light,
					Room: {
						...theme.light.Room,
						profile: {
							...theme.light.Room.profile,
							is_AssistantNameShow: value,
						},
					},
				},
				dark: {
					...theme.dark,
					Room: {
						...theme.dark.Room,
						profile: {
							...theme.dark.Room.profile,
							is_AssistantNameShow: value,
						},
					},
				},
			};
		});
	};
	return (
		<Box>
			<HStack className="justify-between items-center">
				<Text>显示角色名字</Text>
				<Switch
					onValueChange={handleChange}
					value={themeConfig.profile.is_AssistantNameShow}
				/>
			</HStack>
		</Box>
	);
};

const RoomUserAvatarShow = () => {
	const themeConfig = useThemeRoom();
	const [, setTranceTheme] = useAtom(tranceThemeAtom);
	const handleChange = async (value: boolean) => {
		setTranceTheme(async (prev) => {
			const theme = await prev;
			return {
				...theme,
				light: {
					...theme.light,
					Room: {
						...theme.light.Room,
						profile: {
							...theme.light.Room.profile,
							is_UserAvatarShow: value,
						},
					},
				},
				dark: {
					...theme.dark,
					Room: {
						...theme.dark.Room,
						profile: {
							...theme.dark.Room.profile,
							is_UserAvatarShow: value,
						},
					},
				},
			};
		});
	};
	return (
		<Box>
			<HStack className="justify-between items-center">
				<Text>显示用户头像</Text>
				<Switch
					onValueChange={handleChange}
					value={themeConfig.profile.is_UserAvatarShow}
				/>
			</HStack>
		</Box>
	);
};

const RoomUserNameShow = () => {
	const themeConfig = useThemeRoom();
	const [, setTranceTheme] = useAtom(tranceThemeAtom);
	const handleChange = async (value: boolean) => {
		setTranceTheme(async (prev) => {
			const theme = await prev;
			return {
				...theme,
				light: {
					...theme.light,
					Room: {
						...theme.light.Room,
						profile: {
							...theme.light.Room.profile,
							is_UserNameShow: value,
						},
					},
				},
				dark: {
					...theme.dark,
					Room: {
						...theme.dark.Room,
						profile: {
							...theme.dark.Room.profile,
							is_UserNameShow: value,
						},
					},
				},
			};
		});
	};
	return (
		<Box>
			<HStack className="justify-between items-center">
				<Text>显示用户名字</Text>
				<Switch
					onValueChange={handleChange}
					value={themeConfig.profile.is_UserNameShow}
				/>
			</HStack>
		</Box>
	);
};

const DefaultTheme = () => {
	const [, setTranceTheme] = useAtom(tranceThemeAtom);
	const handleChange = async () => {
		setTranceTheme(themeDefaultConfig);
	};
	return (
		<Pressable onPress={handleChange}>
			<Card>
				<HStack>
					<Heading>默认</Heading>
				</HStack>
			</Card>
		</Pressable>
	);
};

const GreenTheme = () => {
	const [, setTranceTheme] = useAtom(tranceThemeAtom);
	const handleChange = async () => {
		setTranceTheme(themeDefaultGreenConfig);
	};
	return (
		<Pressable onPress={handleChange}>
			<Card className="bg-[#95ec69]">
				<HStack>
					<Heading className="text-black">绿色</Heading>
				</HStack>
			</Card>
		</Pressable>
	);
};

const PeachTheme = () => {
	const [, setTranceTheme] = useAtom(tranceThemeAtom);
	const handleChange = async () => {
		setTranceTheme(themeDefaultPeachConfig);
	};
	return (
		<Pressable onPress={handleChange}>
			<Card className="bg-[#fa95a7]">
				<HStack>
					<Heading className="text-white">桃子</Heading>
				</HStack>
			</Card>
		</Pressable>
	);
};

const PomeloTheme = () => {
	const [, setTranceTheme] = useAtom(tranceThemeAtom);
	const handleChange = async () => {
		setTranceTheme(themeDefaultPomeloThemeConfig);
	};
	return (
		<Pressable onPress={handleChange}>
			<Card className="bg-[#fff7e1]">
				<HStack>
					<Heading className="text-black">柚子</Heading>
				</HStack>
			</Card>
		</Pressable>
	);
};
