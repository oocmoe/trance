import { Storage } from "expo-sqlite/kv-store";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

type HexColor = `#${string}`;

type ThemeStackOptions = {
	headerTitleAlign: "left" | "center";
	headerTintColor: HexColor;
	headerStyle: {
		backgroundColor: HexColor;
	};
	contentStyle: {
		backgroundColor: HexColor;
	};
};

type ThemeStack = {
	light: {
		screenOptions: ThemeStackOptions;
	};
	dark: {
		screenOptions: ThemeStackOptions;
	};
};

type ThemeDrawerOptions = {
	headerTintColor: HexColor;
	headerTitleAlign: "left" | "center";
	headerStyle: {
		backgroundColor: HexColor;
	};
	sceneStyle: {
		backgroundColor: HexColor;
	};
	drawerStyle: {
		backgroundColor: HexColor;
		borderTopEndRadius: number;
		borderBottomEndRadius: number;
	};
};

type ThemeDrawer = {
	light: {
		screenOptions: ThemeDrawerOptions;
	};
	dark: {
		screenOptions: ThemeDrawerOptions;
	};
};

export type ThemeOptions = {
	stackOptions: ThemeStack;
	drawerOptions: ThemeDrawer;
	roomOptions: ThemeStack;
};

const defaultStackOptions: ThemeStack = {
	light: {
		screenOptions: {
			headerTitleAlign: "left",
			headerTintColor: "#000",
			headerStyle: {
				backgroundColor: "#fff",
			},
			contentStyle: {
				backgroundColor: "#fff",
			},
		},
	},
	dark: {
		screenOptions: {
			headerTitleAlign: "left",
			headerTintColor: "#fff",
			headerStyle: {
				backgroundColor: "#000",
			},
			contentStyle: {
				backgroundColor: "#000",
			},
		},
	},
};

const defaultDrawerOptions: ThemeDrawer = {
	light: {
		screenOptions: {
			headerTitleAlign: "left",
			headerTintColor: "#000",
			headerStyle: {
				backgroundColor: "#fff",
			},
			sceneStyle: {
				backgroundColor: "#fff",
			},
			drawerStyle: {
				backgroundColor: "#fff",
				borderTopEndRadius: 0,
				borderBottomEndRadius: 0,
			},
		},
	},
	dark: {
		screenOptions: {
			headerTitleAlign: "left",
			headerTintColor: "#fff",
			headerStyle: {
				backgroundColor: "#000",
			},
			sceneStyle: {
				backgroundColor: "#000",
			},
			drawerStyle: {
				backgroundColor: "#000",
				borderTopEndRadius: 0,
				borderBottomEndRadius: 0,
			},
		},
	},
};

export const colorModeAtom = atom<"light" | "dark">("dark");

export const themeStackOptionsAtom = atomWithStorage<ThemeStack>(
	"TRANCE_THEME_STACK",
	defaultStackOptions,
	createJSONStorage<ThemeStack>(() => Storage),
);

export const themeDrawerOptionsAtom = atomWithStorage<ThemeDrawer>(
	"TRANCE_THEME_DRAWER",
	defaultDrawerOptions,
	createJSONStorage<ThemeDrawer>(() => Storage),
);
