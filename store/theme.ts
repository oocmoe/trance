import { atom } from "jotai";

type HexColor = `#${string}`;

/**
 * 全局主题状态
 */

export const colorModeAtom = atom<"light" | "dark">("dark");

const headerTintColorAtom = atom<HexColor>((get) => {
	return get(colorModeAtom) === "light" ? "#000" : "#fff";
});

const headerBackgroundColorAtom = atom<HexColor>((get) => {
	return get(colorModeAtom) === "light" ? "#fff" : "#000";
});

const contentBackgroundColorAtom = atom<HexColor>((get) => {
	return get(colorModeAtom) === "light" ? "#fff" : "#000";
});

export const stackScreenOptionsAtom = atom((get) => ({
	headerTintColor: get(headerTintColorAtom),
	headerStyle: {
		backgroundColor: get(headerBackgroundColorAtom),
	},
	contentStyle: {
		backgroundColor: get(contentBackgroundColorAtom),
	},
}));
