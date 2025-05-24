import { useAtomValue } from "jotai";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { tranceIsDarkModeAtom } from "@/store/core";

export function useColorScheme() {
	const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
	return {
		colorScheme: colorScheme ?? "dark",
		isDarkColorScheme: colorScheme === "dark",
		setColorScheme,
		toggleColorScheme,
	};
}
