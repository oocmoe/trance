import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { themeDrawerOptionsAtom, themeStackOptionsAtom } from "@/store/theme";
import { themeDefault, themeDefaultGreen } from "@/utils/theme/default";
import { useAtom } from "jotai";
import { Pressable, ScrollView } from "react-native";
export default function ThemeScreen() {
	return (
		<Box className="h-full p-3">
			<ScrollView>
				<VStack space="md">
					<Text>喘息主题</Text>
					<DefaultTheme />
					<GreenTheme />
				</VStack>
			</ScrollView>
		</Box>
	);
}

const DefaultTheme = () => {
	const [, setThemeStackOptions] = useAtom(themeStackOptionsAtom);
	const [, setThemeDrawerOptions] = useAtom(themeDrawerOptionsAtom);
	const theme = themeDefault;
	const handleChangeTheme = () => {
		setThemeStackOptions(async (prev) => {
			const current = await prev;
			return {
				...current,
				...theme.stackOptions,
			};
		});
		setThemeDrawerOptions(async (prev) => {
			const current = await prev;
			return {
				...current,
				...theme.drawerOptions,
			};
		});
	};
	return (
		<Pressable onPress={handleChangeTheme}>
			<Card>
				<HStack>
					<Heading>默认</Heading>
				</HStack>
			</Card>
		</Pressable>
	);
};

const GreenTheme = () => {
	const [, setThemeStackOptions] = useAtom(themeStackOptionsAtom);
	const [, setThemeDrawerOptions] = useAtom(themeDrawerOptionsAtom);
	const theme = themeDefaultGreen;
	const handleChangeTheme = () => {
		setThemeStackOptions(async (prev) => {
			const current = await prev;
			return {
				...current,
				...theme.stackOptions,
			};
		});
		setThemeDrawerOptions(async (prev) => {
			const current = await prev;
			return {
				...current,
				...theme.drawerOptions,
			};
		});
	};
	return (
		<Pressable onPress={handleChangeTheme}>
			<Card className="bg-[#95ec69]">
				<HStack>
					<Heading className="text-black">绿色</Heading>
				</HStack>
			</Card>
		</Pressable>
	);
};
