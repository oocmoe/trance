type GeminiModels =
	| "gemini-1.5-pro"
	| "gemini-1.5-flash-8b"
	| "gemini-1.5-flash"
	| "gemini-2.0-flash"
	| "gemini-2.0-flash-lite"
	| "gemini-2.5-pro-exp-03-25";

	type GrokModels =
	| "grok-3"
	| "grok-3-latest"
	| "grok-3-fast"
	| "grok-3-fast-latest"
	| "grok-3-mini"
	| "grok-3-mini-latest"
	| "grok-3-mini-fast"
	| "grok-3-mini-fast-latest"
	| "grok-2-vision"
	| "grok-2-vision-latest"
	| "grok-2-image"
	| "grok-2-image-latest"
	| "grok-2"
	| "grok-2-latest"
	| "grok-vision-beta"
	| "grok-beta";


// 定义模型名称
type Models = "Gemini" | "Custom_OpenAI" | "Grok"

// 模型版本映射
type ModelVersionMap = {
	Gemini: GeminiModels;
	Grok: GrokModels
	Custom_OpenAI: string;
};

/**
 * 定义模型列表
 * model: 指定模型名称
 * version：指定模型版本
 */
type ModelList = {
	model: Models;
	version: ModelVersionMap[Models];
};
