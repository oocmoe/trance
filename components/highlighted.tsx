import { useThemeRoom } from "@/hook/theme";
import { Text } from "react-native";

export const HighlightedAssistantText = ({ str }: { str: string }) => {
	const regex = /["“]([^"”]+)["”]/g;
	const parts = str.split(regex);
	const themeRoomConfig = useThemeRoom();

	return (
		<Text>
			{parts.map((part, index) => {
				const uniqueKey = `${index}-${part || ""}`;
				return index % 2 === 1 ? (
					<Text
						key={uniqueKey}
						style={
							themeRoomConfig.componentStyle?.assistantChatBubbleHighlightText
						}
					>
						"{part}"
					</Text>
				) : (
					<Text
						style={themeRoomConfig.componentStyle?.assistantChatBubbleText}
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
	const themeRoomConfig = useThemeRoom();

	return (
		<Text>
			{parts.map((part, index) => {
				const uniqueKey = `${index}-${part || ""}`;
				return index % 2 === 1 ? (
					<Text
						style={themeRoomConfig.componentStyle?.userChatBubbleHighlightText}
						key={uniqueKey}
					>
						"{part}"
					</Text>
				) : (
					<Text
						style={themeRoomConfig.componentStyle?.userChatBubbleText}
						key={uniqueKey}
					>
						{part}
					</Text>
				);
			})}
		</Text>
	);
};
