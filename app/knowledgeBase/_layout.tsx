import { Stack } from "expo-router";

export default function KnowledgeBaseLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="knowledgeBaseImportModal"
				options={{
					presentation: "transparentModal",
					animation: "fade",
				}}
			/>
		</Stack>
	);
}
