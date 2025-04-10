import type { KnowledgeBaseEntry } from "@/db/schema/knowledgeBase";
import { Regex } from "@/db/schema/regex";
import type { ConvertSillyTavernChatHistory } from "@/types/result";
import * as FileSystem from "expo-file-system";
import "react-native-get-random-values";
import * as ImageManipulator from "expo-image-manipulator";
import { v7 as uuidv7 } from "uuid";
/**
 * 处理角色卡封面
 * @param data
 */
export async function convertCover(uri: string) {
	try {
		const manipulated = await ImageManipulator.manipulateAsync(uri, [], {
			format: ImageManipulator.SaveFormat.WEBP,
			base64: true,
			compress: 1,
		});
		const cover = `data:image/webp;base64,${manipulated.base64}`;
		return cover;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

/**
 * 转换角色卡为 trance格式,这里只做转换检测
 * @param characterJson
 */
export async function convertCharacter(characterJson: any, cover: string) {
	try {
		// Spec V2
		if (characterJson.spec === "chara_card_v2") {
			const result = await covertCharacterTavernCardV2(characterJson, cover);
			return result;
		}
		// Spec V1
		// if (characterJson.name) {
		// 	const result = await convertCharacterTavernCardV1(
		// 		characterJson as TavernCardV1,
		// 	);
		// }
	} catch (error) {
		console.log(error);
	}
}

/**
 * 转换提示词为 trance格式，这里只做转换检测
 * @param promptJson
 */
export async function convertPrompt(requsetJson: any) {
	try {
		if (requsetJson.prompt_order && requsetJson.prompts) {
			const result = await convertPromptSillyTavern(
				requsetJson as SillyTavermPrompt,
			);
			if (!result) return;
			return result;
		}
	} catch (error) {
		console.log(error);
	}
}

/**
 * 转换正则为 trance格式
 * @param promptJson
 * @returns
 */
export async function convertRegex(requsetJson: any) {
	try {
		if (requsetJson.scriptName && requsetJson.findRegex) {
			const result = await convertRegexSillyTavern(requsetJson);
			if (!result) return;
			return result;
		}
	} catch (error) {
		console.log(error);
	}
}

export function convertKnowledgeBase(requsetJson: any) {
	if (requsetJson.entries && requsetJson.originalData) {
		const result = convertKnowledgeBaseSillyTavern(
			requsetJson as SillyTavernWorldBook,
		);
		return result;
	}
	throw new Error("错误的知识库格式");
}

/**
 * 转换 TavernCardV1
 * @param characterJson
 */
// async function convertCharacterTavernCardV1(characterJson: TavernCardV1) {
// 	try {
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

/**
 * 转换 TavernCardV2
 * @param characterJson
 */
async function covertCharacterTavernCardV2(
	characterJson: TavernCardV2,
	cover: string,
) {
	try {
		// 处理角色卡数据
		const prologue = () => {
			const first_mes = {
				name: characterJson.data.first_mes.slice(0, 20),
				content: characterJson.data.first_mes,
			};
			const alternate_greetings = characterJson.data.alternate_greetings.map(
				(item) => {
					return {
						name: item.slice(0, 20).replace(/\s+/g, ""),
						content: item,
					};
				},
			);
			if (alternate_greetings.length > 0) {
				return [first_mes, ...alternate_greetings];
			}
			return Array(first_mes);
		};
		const character = {
			global_id: uuidv7(),
			cover: cover,
			name: characterJson.data.name,
			description: characterJson.data.description,
			prologue: prologue(),
			creator: characterJson.data.creator,
			handbook: characterJson.data.creator_notes,
			version: characterJson.data.character_version,
			personality: characterJson.data.personality,
			scenario: characterJson.data.scenario,
			mes_example: characterJson.data.mes_example,
			system_prompt: characterJson.data.system_prompt,
			post_history_instructions: characterJson.data.post_history_instructions,
		};

		//处理知识库数据
		let knowledgeBase: KnowledgeBaseEntry[] | undefined;
		if (characterJson.data.character_book) {
			let knowledgeBaseIdCounter = 0;
			knowledgeBase = characterJson.data.character_book.entries.map((item) => {
				return {
					id: knowledgeBaseIdCounter++,
					name: item.comment || "",
					content: item.content,
					trigger: item.constant ? "always" : "key",
					keywords: [...item.keys, ...(item.secondary_keys || [])],
					is_Enable: item.enabled,
				};
			});
		}

		let regex:
			| {
					global_id: string;
					name: string;
					replace: string;
					placement: string;
					is_Enabled: boolean;
					is_Global: boolean;
					is_Send: boolean;
					is_Render: boolean;
					firstArchived: string;
			  }[]
			| undefined;

		if (characterJson.data.extensions.regex_scripts) {
			regex = characterJson.data.extensions.regex_scripts.map((item: any) => {
				return {
					name: item.scriptName,
					replace: item.findRegex,
					placement: item.replaceString,
					is_Enabled: false,
					is_Global: false,
					is_Send: item.placement.includes(2) || false,
					is_Render: item.placement.includes(1) || false,
					firstArchived: JSON.stringify(item),
				};
			});
		}

		// 整合
		const converData = {
			character: character,
			knowledgeBase: knowledgeBase,
			regex: regex,
		};

		return converData;
	} catch (error) {
		console.log(error);
	}
}

/**
 * 转换提示
 * @param promptJson
 * @returns
 */
async function convertPromptSillyTavern(promptJson: SillyTavermPrompt) {
	try {
		const order = promptJson.prompt_order.at(-1);
		if (!order?.order?.length) return [];
		const orderMap = new Map<string, number>();
		const isEnabledMap = new Map<string, boolean>();
		order.order.forEach((item, index) => {
			orderMap.set(item.identifier, index);
			isEnabledMap.set(item.identifier, item.enabled);
		});
		const processedPrompts = promptJson.prompts.map((item) => ({
			name: item.name,
			role: item.role || "system",
			content: item.content,
			identifier: item.identifier,
			isEnabled: isEnabledMap.get(item.identifier) ?? false,
		}));
		const sortedPrompts = processedPrompts.sort((a, b) => {
			const aOrder = orderMap.get(a.identifier) ?? Number.POSITIVE_INFINITY;
			const bOrder = orderMap.get(b.identifier) ?? Number.POSITIVE_INFINITY;
			return aOrder - bOrder;
		});
		return sortedPrompts.map((item, index) => ({
			id: index + 1,
			...item,
		}));
	} catch (error) {
		console.log(error);
		return [];
	}
}

async function convertRegexSillyTavern(promptJson: SillyTavermRegex) {
	try {
		const regexScript = {
			name: promptJson.scriptName,
			replace: promptJson.findRegex,
			placement: promptJson.replaceString,
			is_Enabled: !promptJson.disabled,
			is_Global: false,
			is_Send: promptJson.placement.includes(2) || false,
			is_Render: promptJson.placement.includes(1) || false,
		};
		if (!regexScript) return;
		return regexScript;
	} catch (error) {
		console.log(error);
	}
}

async function convertKnowledgeBaseSillyTavern(
	requsetJson: SillyTavernWorldBook,
) {
	const knowledgeBaseEntries: KnowledgeBaseEntry[] = Object.entries(
		requsetJson.entries,
	).map(([key, item]) => {
		console.log(requsetJson.entries);
		return {
			id: Number(key),
			name: item.comment,
			trigger: item.constant ? "always" : "key",
			keywords: [...item.key, ...item.keysecondary],
			content: item.content,
			is_Enable: !item.disable,
		};
	});
	const knowledgeBase = {
		name: requsetJson.originalData.name,
		entries: knowledgeBaseEntries,
		firstArchived: JSON.stringify(requsetJson),
	};

	return knowledgeBase;
}

export async function convertSillyTavernChatHistory(jsonl: string) {
	try {
		const lines = jsonl.split("\n").filter((line) => line.trim() !== "");
		if (lines.length > 0) {
			lines.shift();
		}
		const result: SillyTavernChatHisotry[] = lines.map((line) => {
			try {
				return JSON.parse(line);
			} catch (error) {
				throw new Error(`解析 jsonl 失败: "${line.substring(0, 30)}..."`);
			}
		});
		const history: ConvertSillyTavernChatHistory[] = result.map((item) => {
			let idConter = 1;
			return {
				id: idConter++,
				type: "text",
				is_Sender: item.is_user ? 1 : 0,
				content: [item.mes],
				role: item.is_user ? "user" : "assistant",
			};
		});
		return history;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("转换酒馆 SillyTavern 聊天记录失败");
	}
}
