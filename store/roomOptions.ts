import { atom } from "jotai";

export type RoomOptions = {
	id: number;
	model?: ModelList;
	prompt?: number;
	knowledgeBase?: number[];
	personnel: string[];
};

const roomOptionsIdAtom = atom<number | undefined>(undefined);
const roomOptionsModel = atom<ModelList | undefined>(undefined);
const roomOptionsPrompt = atom<number | undefined>(undefined);
const roomOptionsKnowledgeBase = atom<number[] | undefined>(undefined);
const roomOptionsPersonnel = atom<string[] | undefined>(undefined);

export const roomOptionsAtom = atom(
	(get) => ({
		id: get(roomOptionsIdAtom),
		model: get(roomOptionsModel),
		prompt: get(roomOptionsPrompt),
		knowledgeBase: get(roomOptionsKnowledgeBase),
		personnel: get(roomOptionsPersonnel),
	}),
	(_get, set, update: Partial<RoomOptions>) => {
		if ("id" in update) set(roomOptionsIdAtom, update.id);
		if ("model" in update) set(roomOptionsModel, update.model);
		if ("prompt" in update) set(roomOptionsPrompt, update.prompt);
		if ("knowledgeBase" in update)
			set(roomOptionsKnowledgeBase, update.knowledgeBase);
		if ("personnel" in update) set(roomOptionsPersonnel, update.personnel);
	},
);
