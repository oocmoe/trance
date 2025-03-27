import { useThemeRoomOptions } from "@/hook/theme";
import { Text } from "react-native";

export const HighlightedAssistantText = ({ str }: { str: string }) => {
	const regex = /["“]([^"”]+)["”]/g;
	const parts = str.split(regex);
	const themeRoomOptions = useThemeRoomOptions();

	return (
		<Text>
			{parts.map((part, index) => {
				const uniqueKey = `${index}-${part || ""}`;
				return index % 2 === 1 ? (
					<Text key={uniqueKey} className="text-amber-500">
						"{part}"
					</Text>
				) : (
					<Text
						style={themeRoomOptions?.componentOptions.assistantChatBubbleText}
						key={uniqueKey}
					>
						{part}
					</Text>
				);
			})}
		</Text>
	);
};

export const HighlightedUserText = ({ str }: { str: string }) => {
	const regex = /["“]([^"”]+)["”]/g;
	const parts = str.split(regex);
	const themeRoomOptions = useThemeRoomOptions();

	return (
		<Text>
			{parts.map((part, index) => {
				const uniqueKey = `${index}-${part || ""}`;
				return index % 2 === 1 ? (
					<Text key={uniqueKey}>"{part}"</Text>
				) : (
					<Text
						style={themeRoomOptions?.componentOptions.userChatBubbleText}
						key={uniqueKey}
					>
						{part}
					</Text>
				);
			})}
		</Text>
	);
};
