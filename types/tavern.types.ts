// types/tavern.ts
type TavernCardV1 = {
	name: string;
	description: string;
	personality: string;
	scenario: string;
	first_mes: string;
	mes_example: string;
};

type TavernCardV2 = {
	spec: "chara_card_v2";
	spec_version: "2.0"; // May 8th addition
	data: {
		name: string;
		description: string;
		personality: string;
		scenario: string;
		first_mes: string;
		mes_example: string;

		// New fields start here
		creator_notes: string;
		system_prompt: string;
		post_history_instructions: string;
		alternate_greetings: Array<string>;
		character_book?: CharacterBook;

		// May 8th additions
		tags: Array<string>;
		creator: string;
		character_version: string;
		extensions: Record<string, any>;
	};
};

/**
 * ? as in `name?: string` means the `name` property may be absent from the JSON
 * (aka this property is optional)
 * OPTIONAL PROPERTIES ARE ALLOWED TO BE UNSUPPORTED BY EDITORS AND DISREGARDED BY
 * FRONTENDS, however they must never be destroyed if already in the data.
 *
 * the `extensions` properties may contain arbitrary key-value pairs, but you are encouraged
 * to namespace the keys to prevent conflicts, and you must never destroy
 * unknown key-value pairs from the data. `extensions` is mandatory and must
 * default to `{}`. `extensions` exists for the character book itself, and for
 * each entry.
 **/
type CharacterBook = {
	name?: string;
	description?: string;
	scan_depth?: number; // agnai: "Memory: Chat History Depth"
	token_budget?: number; // agnai: "Memory: Context Limit"
	recursive_scanning?: boolean; // no agnai equivalent. whether entry content can trigger other entries
	extensions: Record<string, any>;
	entries: Array<{
		keys: Array<string>;
		content: string;
		extensions: Record<string, any>;
		enabled: boolean;
		insertion_order: number; // if two entries inserted, lower "insertion order" = inserted higher
		case_sensitive?: boolean;

		// FIELDS WITH NO CURRENT EQUIVALENT IN SILLY
		name?: string; // not used in prompt engineering
		priority?: number; // if token budget reached, lower priority value = discarded first

		// FIELDS WITH NO CURRENT EQUIVALENT IN AGNAI
		id?: number; // not used in prompt engineering
		comment?: string; // not used in prompt engineering
		selective?: boolean; // if `true`, require a key from both `keys` and `secondary_keys` to trigger the entry
		secondary_keys?: Array<string>; // see field `selective`. ignored if selective == false
		constant?: boolean; // if true, always inserted in the prompt (within budget limit)
		position?: "before_char" | "after_char"; // whether the entry is placed before or after the character defs
	}>;
};

type TavernCard = TavernCardV1 | TavernCardV2;
type SillyTavernPrompt = {
	chat_completion_source: string;
	openai_model: string;
	claude_model: string;
	windowai_model: string;
	openrouter_model: string;
	openrouter_use_fallback: boolean;
	openrouter_group_models: boolean;
	openrouter_sort_models: "alphabetically" | "by-performance";
	openrouter_providers: string[];
	openrouter_allow_fallbacks: boolean;
	openrouter_middleout: "on" | "off";
	ai21_model: string;
	mistralai_model: string;
	cohere_model: string;
	perplexity_model: string;
	groq_model: string;
	zerooneai_model: string;
	blockentropy_model: string;
	custom_model: string;
	custom_prompt_post_processing: "strict" | "flexible";
	google_model: string;
	temperature: number;
	frequency_penalty: number;
	presence_penalty: number;
	top_p: number;
	top_k: number;
	top_a: number;
	min_p: number;
	repetition_penalty: number;
	openai_max_context: number;
	openai_max_tokens: number;
	wrap_in_quotes: boolean;
	names_behavior: 0 | 1 | 2;
	send_if_empty: string;
	jailbreak_system: boolean;
	impersonation_prompt: string;
	new_chat_prompt: string;
	new_group_chat_prompt: string;
	new_example_chat_prompt: string;
	continue_nudge_prompt: string;
	bias_preset_selected: string;
	max_context_unlocked: boolean;
	wi_format: string;
	scenario_format: string;
	personality_format: string;
	group_nudge_prompt: string;
	stream_openai: boolean;
	prompts: Array<{
		name: string;
		system_prompt: boolean;
		role?: "system" | "user" | "assistant";
		content: string;
		identifier: string;
		injection_position?: number;
		injection_depth?: number;
		forbid_overrides?: boolean;
		marker?: boolean;
		enabled?: boolean;
	}>;
	prompt_order: Array<{
		character_id: number;
		order: Array<{
			identifier: string;
			enabled: boolean;
		}>;
	}>;
	api_url_scale: string;
	show_external_models: boolean;
	assistant_prefill: string;
	assistant_impersonation: string;
	claude_use_sysprompt: boolean;
	use_makersuite_sysprompt: boolean;
	use_alt_scale: boolean;
	squash_system_messages: boolean;
	image_inlining: boolean;
	inline_image_quality: "low" | "medium" | "high";
	bypass_status_check: boolean;
	continue_prefill: boolean;
	continue_postfix: string;
	function_calling: boolean;
	show_thoughts: boolean;
	seed: number;
	n: number;
};

type SillyTavernRegex = {
	id: string;
	scriptName: string;
	findRegex: string;
	replaceString: string;
	trimStrings: string[];
	placement: number[];
	disabled: boolean;
	markdownOnly: boolean;
	promptOnly: boolean;
	runOnEdit: boolean;
	substituteRegex: boolean;
	minDepth: number | null;
	maxDepth: number | null;
};

type SillyTavernWorldBookExtensions = {
	position: number;
	exclude_recursion: boolean;
	display_index: number;
	probability: number;
	useProbability: boolean;
	depth: number;
	selectiveLogic: number;
	group: string;
	group_override: boolean;
	group_weight: number;
	prevent_recursion: boolean;
	delay_until_recursion: boolean;
	scan_depth: number | null;
	match_whole_words: boolean | null;
	use_group_scoring: boolean;
	case_sensitive: boolean | null;
	automation_id: string;
	role: number;
	vectorized: boolean;
	sticky: number;
	cooldown: number;
	delay: number;
};

type SillyTavernWorldBookEntry = {
	key: string[];
	keysecondary: string[];
	comment: string;
	content: string;
	constant: boolean;
	vectorized: boolean;
	selective: boolean;
	selectiveLogic: number;
	addMemo: boolean;
	order: number;
	position: number;
	disable: boolean;
	excludeRecursion: boolean;
	preventRecursion: boolean;
	delayUntilRecursion: boolean;
	probability: number;
	useProbability: boolean;
	depth: number;
	group: string;
	groupOverride: boolean;
	groupWeight: number;
	scanDepth: number | null;
	caseSensitive: boolean | null;
	matchWholeWords: boolean | null;
	useGroupScoring: boolean;
	automationId: string;
	role: number;
	sticky: number;
	cooldown: number;
	delay: number;
	uid: number;
	displayIndex: number;
	extensions: SillyTavernWorldBookExtensions;
};

type SillyTavernWorldBookOriginalDataEntry = {
	id: number;
	keys: string[];
	secondary_keys: string[];
	comment: string;
	content: string;
	constant: boolean;
	selective: boolean;
	insertion_order: number;
	enabled: boolean;
	position: string;
	use_regex: boolean;
	extensions: SillyTavernWorldBookExtensions;
};

type SillyTavernWorldBookOriginalData = {
	entries: SillyTavernWorldBookOriginalDataEntry[];
	name: string;
};

// type SillyTavernWorldBook = {
// 	entries: Record<string, SillyTavernWorldBookEntry>;
// 	originalData: SillyTavernWorldBookOriginalData;
// };

type SillyTavernChatHisotry = {
	name: string;
	is_user: boolean;
	send_date: string;
	mes: string;
	extras: Record<string, any>;
	force_avatar: string;
};



type SillyTavernWorldBook = {
  entries: Record<string, {
    key: string[];
    keysecondary: string[];
    comment: string;
    content: string;
    constant: boolean;
    vectorized: boolean;
    selective: boolean;
    selectiveLogic: number;
    addMemo: boolean;
    order: number;
    position: number;
    disable: boolean;
    excludeRecursion: boolean;
    preventRecursion: boolean;
    delayUntilRecursion: boolean;
    probability: number;
    useProbability: boolean;
    depth: number;
    group: string;
    groupOverride: boolean;
    groupWeight: number;
    scanDepth: number | null;
    caseSensitive: boolean | null;
    matchWholeWords: boolean | null;
    useGroupScoring: boolean;
    automationId: string;
    role: number;
    sticky: number;
    cooldown: number;
    delay: number;
    uid: number;
    displayIndex: number;
    extensions: {
      position: number;
      exclude_recursion: boolean;
      display_index: number;
      probability: number;
      useProbability: boolean;
      depth: number;
      selectiveLogic: number;
      group: string;
      group_override: boolean;
      group_weight: number;
      prevent_recursion: boolean;
      delay_until_recursion: boolean;
      scan_depth: number | null;
      match_whole_words: boolean | null;
      use_group_scoring: boolean;
      case_sensitive: boolean | null;
      automation_id: string;
      role: number;
      vectorized: boolean;
      sticky: number;
      cooldown: number;
      delay: number;
    };
  }>;
  originalData: {
    entries: {
      id: number;
      keys: string[];
      secondary_keys: string[];
      comment: string;
      content: string;
      constant: boolean;
      selective: boolean;
      insertion_order: number;
      enabled: boolean;
      position: string;
      use_regex: boolean;
      extensions: {
        position: number;
        display_index: number;
        probability: number;
        useProbability: boolean;
        depth: number;
        selectiveLogic: number;
        group: string;
        group_override: boolean;
        group_weight: number;
        scan_depth: number | null;
        match_whole_words: boolean | null;
        use_group_scoring: boolean;
        case_sensitive: boolean | null;
        automation_id: string;
        role: number;
        vectorized: boolean;
        sticky: number;
        cooldown: number;
        delay: number;
      };
    }[];
    name: string;
  };
};