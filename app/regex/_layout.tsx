import { Stack } from "expo-router";

export default function RegexLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="newRegexGroupModal"
				options={{
					title: "新建正则组",
					presentation: "transparentModal",
					animation: "fade",
				}}
			/>
		</Stack>
	);
}
