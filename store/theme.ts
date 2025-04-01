import type { DrawerNavigationOptions } from "@react-navigation/drawer";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Storage } from "expo-sqlite/kv-store";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { StyleProp } from "react-native-css-interop/dist/types";

export type ThemeDrawer = {
	options: DrawerNavigationOptions;
};

export type ThemeStack = {
	options: NativeStackNavigationOptions;
};

export type ThemeRoom = {
	options: NativeStackNavigationOptions;
	componentStyle?: Record<string, StyleProp>;
};

type TranceThemeConfig = {
	Drawer: ThemeDrawer;
	Stack: ThemeStack;
	Room: ThemeRoom;
};

export type TranceTheme = {
	light: TranceThemeConfig;
	dark: TranceThemeConfig;
};

const defaultDrawerLightOptions: ThemeDrawer = {
	options: {
		headerTitleAlign: "left",
		headerTintColor: "#000000",
		headerStyle: {
			backgroundColor: "#ffffff",
		},
		sceneStyle: {
			backgroundColor: "#ffffff",
		},
		drawerInactiveTintColor: "#000000",
		drawerStyle: {
			width: 300,
			backgroundColor: "#ffffff",
			borderTopEndRadius: 0,
			borderBottomEndRadius: 0,
		},
	},
};

const defaultDrawerDarkOptions: ThemeDrawer = {
	options: {
		headerTitleAlign: "left",
		headerTintColor: "#ffffff",
		headerStyle: {
			backgroundColor: "#000000",
		},
		sceneStyle: {
			backgroundColor: "#000000",
		},
		drawerInactiveTintColor: "#ffffff",
		drawerStyle: {
			width: 300,
			backgroundColor: "#000000",
			borderTopEndRadius: 0,
			borderBottomEndRadius: 0,
		},
	},
};

const defaultStackLightOptions: ThemeStack = {
	options: {
		headerTitleAlign: "left",
		headerTintColor: "#000000",
		headerStyle: {
			backgroundColor: "#ffffff",
		},
		contentStyle: {
			backgroundColor: "#ffffff",
		},
	},
};

const defaultStackDarkOptions: ThemeStack = {
	options: {
		headerTitleAlign: "left",
		headerTintColor: "#ffffff",
		headerStyle: {
			backgroundColor: "#000000",
		},
		contentStyle: {
			backgroundColor: "#000000",
		},
	},
};

const defaultRoomLightOptions: ThemeRoom = {
	options: {
		headerTitleAlign: "left",
		headerTintColor: "#000000",
		headerStyle: {
			backgroundColor: "#ededed",
		},
		contentStyle: {
			backgroundColor: "#ededed",
		},
	},
	componentStyle: {
		assistantAvatar: {
			width: 48,
			height: 48,
			borderRadius: 100,
		},
		assistantChatBubble: {
			backgroundColor: "#ffffff",
			padding: 16,
			borderRadius: 16,
		},
		assistantChatBubbleText: {
			color: "#000000",
		},
		assistantChatBubbleHighlightText: {
			color: "#f59e0b",
		},
		userAvatar: {
			width: 48,
			height: 48,
			borderRadius: 100,
		},
		userChatBubbleText: {
			color: "#000000",
		},
		userChatBubbleHighlightText: {
			color: "#f59e0b",
		},
		userChatBubble: {
			backgroundColor: "#ffffff",
			padding: 16,
			borderRadius: 16,
		},
	},
};

const defaultRoomDarkOptions: ThemeRoom = {
	options: {
		headerTitleAlign: "left",
		headerTintColor: "#000000",
		headerStyle: {
			backgroundColor: "#ededed",
		},
		contentStyle: {
			backgroundColor: "#ededed",
		},
	},
	componentStyle: {
		assistantAvatar: {
			width: 48,
			height: 48,
			borderRadius: 100,
		},
		assistantChatBubble: {
			backgroundColor: "#ffffff",
			padding: 16,
			borderRadius: 16,
		},
		assistantChatBubbleText: {
			color: "#000000",
		},
		assistantChatBubbleHighlightText: {
			color: "#000000",
		},
		userAvatar: {
			width: 48,
			height: 48,
			borderRadius: 100,
		},
		userChatBubbleText: {
			color: "#000000",
		},
		userChatBubbleHighlightText: {
			color: "#000000",
		},
		userChatBubble: {
			backgroundColor: "#ffffff",
			padding: 16,
			borderRadius: 16,
		},
	},
};

export const defaultThemeOptions: TranceTheme = {
	light: {
		Drawer: defaultDrawerLightOptions,
		Stack: defaultStackLightOptions,
		Room: defaultRoomLightOptions,
	},
	dark: {
		Drawer: defaultDrawerDarkOptions,
		Stack: defaultStackDarkOptions,
		Room: defaultRoomDarkOptions,
	},
};

export const colorModeAtom = atomWithStorage<"light" | "dark">(
	"TRANCE_THEME_COLORMODE",
	"light",
	createJSONStorage<"light" | "dark">(() => Storage),
);

export const tranceThemeAtom = atomWithStorage<TranceTheme>(
	"TRANCE_THEME",
	defaultThemeOptions,
	createJSONStorage<TranceTheme>(() => Storage),
);

// export const themeStackOptionsAtom = atomWithStorage<ThemeStack>(
// 	"TRANCE_THEME_STACK",
// 	defaultStackOptions,
// 	createJSONStorage<ThemeStack>(() => Storage),
// );

// export const themeDrawerOptionsAtom = atomWithStorage<ThemeDrawer>(
// 	"TRANCE_THEME_DRAWER",
// 	defaultDrawerOptions,
// 	createJSONStorage<ThemeDrawer>(() => Storage),
// );

// export const themeRoomOptionsAtom = atomWithStorage<ThemeRoom>(
// 	"TRANCE_THEME_ROOM",
// 	defaultRoomOptions,
// 	createJSONStorage<ThemeRoom>(() => Storage),
// );
