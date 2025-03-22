import { colorModeAtom, stackScreenOptionsAtom } from "@/store/theme";
import { useAtom } from "jotai";

export function useColorMode() {
	const [colorMode] = useAtom(colorModeAtom);
	return colorMode;
}

export function useCustomStackScreenOptionsAtom() {
	const [stackScreenOptions] = useAtom(stackScreenOptionsAtom);
	return stackScreenOptions;
}
