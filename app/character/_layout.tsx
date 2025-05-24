import { Stack } from "expo-router";

export default function CharacterLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="characterImport" />
		</Stack>
	);
}
