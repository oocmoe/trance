import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { tranceThemeAtom } from "@/store/theme";
import {
	themeDefaultConfig,
	themeDefaultGreenConfig,
	themeDefaultPeachConfig,
} from "@/utils/theme/presuppose";
import { useAtom } from "jotai";
import { Pressable, ScrollView } from "react-native";
export default function ThemeScreen() {
	return (
		<Box className="h-full p-3">
			<ScrollView>
				<VStack space="md">
					<Text>双色模式</Text>
					<DefaultTheme />
					<GreenTheme />
					<Text>单色模式</Text>
					<PeachTheme />
					<PomeloTheme />
				</VStack>
			</ScrollView>
		</Box>
	);
}

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
		setTranceTheme(themeDefaultPeachConfig);
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
