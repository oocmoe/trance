import {
	colorModeAtom,
	themeDrawerOptionsAtom,
	themeRoomOptionsAtom,
	themeStackOptionsAtom,
} from "@/store/theme";
import { useAtom } from "jotai";

export function useColorMode() {
	const [colorMode] = useAtom(colorModeAtom);
	return colorMode;
}

export function useThemeStackOptions() {
	const [themeStackOptions] = useAtom(themeStackOptionsAtom);
	const colorMode = useColorMode();
	if (colorMode === "light") return themeStackOptions.light.screenOptions;
	if (colorMode === "dark") return themeStackOptions.dark.screenOptions;
}

export function useThemeDrawerOptions() {
	const [themeDrawerOptions] = useAtom(themeDrawerOptionsAtom);
	const colorMode = useColorMode();
	if (colorMode === "light") return themeDrawerOptions.light.screenOptions;
	if (colorMode === "dark") return themeDrawerOptions.dark.screenOptions;
}

export function useThemeRoomOptions() {
	const [themeRoomOptions] = useAtom(themeRoomOptionsAtom);
	const colorMode = useColorMode();
	if (colorMode === "light") return themeRoomOptions.light;
	if (colorMode === "dark") return themeRoomOptions.dark;
}
