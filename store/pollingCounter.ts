import { Storage } from "expo-sqlite/kv-store";
// store/core.ts
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export const geminiPollingCounterAtom = atomWithStorage(
	"TRANCE_MODEL_GEMINI_POLLINGCOUNTER",
	0,
	createJSONStorage(() => Storage),
);
export const geminiPollingIndexAtom = atomWithStorage(
	"TRANCE_MODEL_GEMINI_POLLINGINDEX",
	0,
	createJSONStorage(() => Storage),
);
