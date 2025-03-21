import { colorModeAtom } from "@/store/theme";
import { useAtom } from "jotai";

type ThemeConfig = {
  headerTintColor: string;
  headerBackgroundColor: string;
  contentBackgroundColor: string;
};

const [colorMode] = useAtom(colorModeAtom);

const THEME_CONFIG: Record<"light" | "dark", ThemeConfig> = {
  light: {
    headerTintColor: "#000",
    headerBackgroundColor: "#fff",
    contentBackgroundColor: "#fff"
  },
  dark: {
    headerTintColor: "#fff",
    headerBackgroundColor: "#000",
    contentBackgroundColor: "#000"
  }
};

export const getScreenOptions = () => ({
  headerTintColor: THEME_CONFIG[colorMode].headerTintColor,
  headerStyle: {
    backgroundColor: THEME_CONFIG[colorMode].headerBackgroundColor
  },
  contentStyle: {
    backgroundColor: THEME_CONFIG[colorMode].contentBackgroundColor
  }
});