import { colorModeAtom, tranceThemeAtom } from "@/store/theme";
import { useAtom } from "jotai";

export function useColorMode() {
	const [colorMode] = useAtom(colorModeAtom);
	return colorMode;
}

export function useTranceTheme() {
	const [themeConfig] = useAtom(tranceThemeAtom);
	const colorMode = useColorMode();
	if (colorMode === "dark") return themeConfig.dark;
	return themeConfig.light;
}

export function useThemeStack() {
	const [themeConfig] = useAtom(tranceThemeAtom);
	const colorMode = useColorMode();
	if (colorMode === "dark") return themeConfig.dark.Stack;
	return themeConfig.light.Stack;
}

export function useThemeDrawer() {
	const [themeConfig] = useAtom(tranceThemeAtom);
	const colorMode = useColorMode();
	if (colorMode === "dark") return themeConfig.dark.Drawer;
	return themeConfig.light.Drawer;
}

export function useThemeRoom() {
	const [themeConfig] = useAtom(tranceThemeAtom);
	const colorMode = useColorMode();
	if (colorMode === "dark") return themeConfig.dark.Room;
	return themeConfig.light.Room;
}
