import type { ImageStyle } from "expo-image";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export type TranceHi = {
	userLatestInput: string;
	userLatestInputId: number;
	type: "text" | "novel" | "image";
	room_id: number;
	room_floor_id?: number;
	prompt_group_id?: number;
	personnel: Array<number>;
	is_Respawn: boolean;
	model?: {
		model_name: string;
		model_version: string;
		is_Stream: boolean;
		maxToken?: number;
		temperature?: number;
	};
};

export type TranceRoomTheme = {
	profile: {
		name:string,
		creator:string,
		version:string
	};
	light: TranceRoomThemeConfig;
	dark: TranceRoomThemeConfig;
};

type TranceRoomThemeChatBubbleConfig = {
	bubble: StyleProp<ViewStyle>;
	bubbleText: StyleProp<TextStyle>;
	bubbleQuoteText: StyleProp<TextStyle>;
};

export type TranceRoomThemeConfig = {
	stackOptions: NativeStackNavigationOptions;
	imageBackground: {
		render: "character" | "custom" | "none";
		customImage: string;
		blurRadius: number;
		backgroundStyle: StyleProp<ViewStyle>;
		overlay: StyleProp<ViewStyle>;
	};
	roomFloor: {
		sender0: StyleProp<ViewStyle>;
		sender1: StyleProp<ViewStyle>;
	};
	avatar: {
		is_ShowUserAvatar: boolean;
		is_ShowAssistantAvatar: boolean;
		user: StyleProp<ImageStyle>;
		assistant: StyleProp<ImageStyle>;
	};
	chatBubble: {
		user: TranceRoomThemeChatBubbleConfig;
		assistant: TranceRoomThemeChatBubbleConfig;
	};
	actionBar: {
		SendButton: {
			buttonStyle: StyleProp<ViewStyle>;
			buttonText: string;
			buttonTextStyle: StyleProp<TextStyle>;
			buttonIconStyle: StyleProp<TextStyle>;
			is_ShowIcon: boolean;
			is_ShowText: boolean;
		};
		TextInputStyle: StyleProp<TextStyle>;
		ActionBarStyle: StyleProp<ViewStyle>;
	};
};

export type TranceChatBubbleMessage = {
	role: "user" | "assistant" | "system";
	message: Array<{
		id: number;
		type: "text" | "image";
		content: Array<string>;
	}>;
};
