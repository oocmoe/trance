import { Stack } from "expo-router";

export default function PromptLayout() {
	return (
		<Stack>
			<Stack.Screen name="promptImport" options={{ headerShown: false }} />
		</Stack>
	);
}
