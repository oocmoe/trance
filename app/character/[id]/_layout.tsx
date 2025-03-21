import { getCustomScreenOptions } from "@/lib/theme";
import { colorModeAtom } from "@/store/theme";
import { Stack } from "expo-router/stack";
import { useAtom } from "jotai";

export default function CharacterLayout() {
	const [colorMode] = useAtom(colorModeAtom);
	return (
		<Stack screenOptions={getCustomScreenOptions()}>
			<Stack.Screen name="index" options={{ title: "角色卡信息" }} />
		</Stack>
	);
}
