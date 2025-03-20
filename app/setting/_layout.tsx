import { Stack } from "expo-router/stack";

export default function SettingLayout() {
	return (
		<Stack>
			<Stack.Screen name="about" />
			<Stack.Screen name="theme" />
		</Stack>
	);
}
