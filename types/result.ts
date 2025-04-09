import type { KnowledgeBaseEntry } from "@/db/schema/knowledgeBase";
import type { PromptContent } from "@/db/schema/prompt";

export type ConvertCharacterResult = {
	character: {
		global_id: string;
		cover: string;
		name: string;
		description: string;
		prologue: { name: string; content: string }[];
		creator: string;
		handbook: string;
		version: string;
		personality: string;
		scenario: string;
		mes_example: string;
		system_prompt: string;
		post_history_instructions: string;
	};
	knowledgeBase?: KnowledgeBaseEntry[];
	regex?:{
		name: string,
		replace: string,
		placement: string,
		is_Enabled: boolean,
		is_Global: boolean,
		is_Send: boolean,
		is_Render: boolean,
		firstArchived: string,
	}[]
	firstArchived: string;
};

export type ConverPromptResult = {
	name: string;
	content: PromptContent;
	firstArchived: string;
};

export type ConvertRgexResult = {
	name: string;
	replace: string;
	placement: string;
	is_Enabled: boolean;
	is_Global: boolean;
	is_Send: boolean;
	is_Render: boolean;
	firstArchived?: string;
};

export type ConvertKnowledgeBaseResult = {
	name: string;
	ceator?: string;
	version?: string;
	handbook?: string;
	entries: KnowledgeBaseEntry[];
	is_Enable?: boolean;
	firstArchived: string;
};

export type ConvertSillyTavernChatHistory = {
	id: number;
	type: "text";
	is_Sender: number;
	content: string;
	role: "user" | "assistant";
};
