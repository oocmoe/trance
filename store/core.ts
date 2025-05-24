import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { Storage } from "expo-sqlite/kv-store";
import { atom, ExtractAtomValue } from "jotai";

// app
export const tranceAppIsBootstrappedAtom = atomWithStorage(
	"TRANCE_ISBOOTSTRAPPED",
	false,
	createJSONStorage<boolean>(() => Storage),
);

export const tranceIsDarkModeAtom = atomWithStorage(
	"TRANCE_ISDARKMODE",
	false,
	createJSONStorage<boolean>(() => Storage),
);

export const tranceDefaultModelAtom = atomWithStorage(
	"TRANCE_ROOM_DEFAULT_MODEL",
	undefined,
	createJSONStorage<
		| {
				name: string;
				version: string;
		  }
		| undefined
	>(() => Storage),
);

export const tranceDefaultPromptGroupAtom = atomWithStorage(
	"TRANCE_ROOM_DEFAULT_PROMPTGROUP",
	undefined,
	createJSONStorage<number | undefined>(() => Storage),
);

// user
export const tranceUsernameAtom = atomWithStorage(
	"TRANCE_USER_NAME",
	"·(OoC)·",
	createJSONStorage<string>(() => Storage),
);

export const tranceUserAvatarAtom = atomWithStorage(
	"TRANCE_USER_AVATAR",
	"",
	createJSONStorage<string>(() => Storage),
);
