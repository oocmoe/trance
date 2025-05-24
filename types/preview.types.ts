type CharacterImportDataPreview = {
	character: {
		cover: string;
		name: string;
		description: string;
		prologue: Array<{
			title: string;
			content: string;
		}>;
		creator: string;
		handbook: string;
		version: string;
	};
	knowledgeBase:
		| Array<{
				name: string;
				content: string;
				trigger: "always" | "keyword";
				keywords: Array<string>;
				is_enabled: boolean;
		  }>
		| undefined;
	regex:
		| Array<{
				name: string;
				content: string;
				replace: string;
				placement: string;
				is_enabled: boolean;
				is_sending: boolean;
				is_render: boolean;
		  }>
		| undefined;
};

type PromptImportDataPreview = {
	name: string;
	creator?: string;
	version?: string;
	handbook?: string;
	prompt: Array<{
		name: string;
		role: "system" | "user" | "assistant";
		content: string;
		is_enabled: boolean;
	}>;
};
