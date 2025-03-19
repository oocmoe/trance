type GeminiModels =
	| "gemini-1.5-pro"
	| "gemini-1.5-flash-8b"
	| "gemini-1.5-flash"
	| "gemini-2.0-flash"
	| "gemini-2.0-flash-lite";

// 定义模型名称
type Models = "Gemini";

// 模型版本映射
type ModelVersionMap = {
	Gemini: GeminiModels;
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
