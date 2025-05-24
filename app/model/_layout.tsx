import { Stack } from "expo-router";

export default function ModelLayout() {
	return (
		<Stack>
			<Stack.Screen name="gemini" options={{ title: "Gemini" }} />
			<Stack.Screen name="customOpenAI" options={{ title: "Custom OpenAI" }} />
		</Stack>
	);
}
