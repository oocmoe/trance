import { View } from "react-native";
import { Text } from "./ui/text";
import { TRANCE_THEME_PROFILE_DEFAULT } from "@/constant/theme/default";
import type { TranceRoomThemeConfig } from "@/types/trance.types";

export function ChatBubbleAssistantText({ str, theme }: { str: string; theme: TranceRoomThemeConfig }) {
	const regex = /(["“][^"”]*["”])/g;
	const parts = str.split(regex);

	return (
		<View style={theme.chatBubble.assistant.bubble}>
			<Text>
				{parts.map((part, index) => {
					const isQuoted = index % 2 !== 0;
					return (
						<Text
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							style={isQuoted ? theme.chatBubble.assistant.bubbleQuoteText : theme.chatBubble.assistant.bubbleText}
						>
							{part}
						</Text>
					);
				})}
			</Text>
		</View>
	);
}

export function ChatBubbleUserText({ str, theme }: { str: string; theme: TranceRoomThemeConfig }) {
	const regex = /(["“][^"”]*["”])/g;
	const parts = str.split(regex);
	return (
		<View style={theme.chatBubble.user.bubble}>
			<Text>
				{parts.map((part, index) => {
					const isQuoted = index % 2 !== 0;
					return (
						<Text
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							style={isQuoted ? theme.chatBubble.user.bubbleQuoteText : theme.chatBubble.user.bubbleText}
						>
							{part}
						</Text>
					);
				})}
			</Text>
		</View>
	);
}
