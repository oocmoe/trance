import "@/global.css";

import { DarkTheme, DefaultTheme, type Theme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAtom } from "jotai";
import { tranceIsDarkModeAtom } from "@/store/core";
import { Toaster } from "sonner-native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

const db = SQLite.openDatabaseSync("trance.db");

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
	useDrizzleStudio(db);
	const [isDarkMode, setIsDarkMode] = useAtom(tranceIsDarkModeAtom);
	// rnr default
	const hasMounted = React.useRef(false);
	const { colorScheme, setColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}
		if (Platform.OS === "web") {
			// Adds the background color to the html element to prevent white background on overscroll.
			document.documentElement.classList.add("bg-background");
		}
		setAndroidNavigationBar(colorScheme);
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);
	React.useEffect(() => {
		if (isDarkMode) {
			setColorScheme("dark");
		} else {
			setColorScheme("light");
		}
	}, [isDarkMode, setColorScheme]);
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ThemeProvider value={isDarkMode ? DARK_THEME : LIGHT_THEME}>
					<StatusBar backgroundColor="transparent" /> 
					<Stack
						screenOptions={{
							headerShown: false,
							presentation: "transparentModal",
						}}
					>
						<Stack.Screen name="(drawer)" />
						<Stack.Screen name="+not-found" />
					</Stack>
					<PortalHost />
					<Toaster richColors closeButton visibleToasts={1} duration={1200} position={"bottom-center"} />
				</ThemeProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
