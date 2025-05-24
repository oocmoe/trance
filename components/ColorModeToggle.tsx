import { Pressable } from "react-native";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";

import { useColorScheme } from "@/lib/useColorScheme";
import Icon from "./Icon";
import { Moon, Sun } from "lucide-react-native";
import { useAtom } from "jotai";
import { tranceIsDarkModeAtom } from "@/store/core";

export function ColorModeToggle() {
	const { isDarkColorScheme, setColorScheme } = useColorScheme();
	const [isDarkMode, setIsDarkMode] = useAtom(tranceIsDarkModeAtom);
	function toggleColorScheme() {
		const newTheme = isDarkMode ? "light" : "dark";
		setColorScheme(newTheme);
		setIsDarkMode(!isDarkMode);
		setAndroidNavigationBar(newTheme);
	}

	return <Pressable onPress={toggleColorScheme}>{isDarkMode ? <Icon as={Moon} /> : <Icon as={Sun} />}</Pressable>;
}
