import { atom } from "jotai";

/**
 * 全局主题状态
 */
export const colorModeAtom = atom<"light" | "dark">("dark");
