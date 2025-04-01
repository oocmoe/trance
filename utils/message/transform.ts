import type { KnowledgeBaseEntry } from "@/db/schema/knowledgeBase";
import { RoomOptions } from "@/store/roomOptions";
import { Storage } from "expo-sqlite/kv-store";
import { readCharacterById } from "../db/character";
import { readIsEnableKnowledgeBase } from "../db/knowledgeBase";
import { readHistroyMessage } from "../db/message";
import { readPromptContent } from "../db/prompt";
import {
	readEnabledGlobalRenderRegex,
	readIsGlobalEnabledSendRegex,
} from "../db/regex";
/**
 * 获取房间历史聊天记录
 * @param roomId
 * @returns
 */
export async function transformHistroyMessage(roomId: number) {
	const result = await readHistroyMessage(roomId);
	if (!result) throw new Error("读取消息记录失败");
	if (result.length === 0)
		return {
			history: "\n",
			lastAssistantContent: undefined,
		};
	let lastAssistantContent: string | undefined = undefined;
	let lastAssistantIndex = -1;
	for (let i = result.length - 1; i >= 0; i--) {
		const item = result[i];
		if (item.role === "assistant" && item.content?.trim()) {
			lastAssistantContent = item.content;
			lastAssistantIndex = i;
			break;
		}
	}
	const history = result
		.filter((_, index) => index !== lastAssistantIndex)
		.map((item) => item.content)
		.join("\n");
	return {
		history: history || "\n",
		lastAssistantContent,
	};
}

export async function transformKnowledgeBase(
	lastUserContent: string,
	lastAssistantContent?: string | undefined,
) {
	try {
		const lastContent = `${lastUserContent}\n${lastAssistantContent}`;
		const knowledgeBaseResult = await readIsEnableKnowledgeBase();
		let globalEntriesId = 1;
		const [keyEntries, alwaysEntries] = knowledgeBaseResult.reduce(
			([keys, alwayss], kb) => {
				const processed = kb.entries
					.filter((entry) => entry.is_Enable)
					.map((entry) => ({ ...entry, id: globalEntriesId++ }));

				for (const entry of processed) {
					if (entry.trigger === "key") {
						keys.push(entry);
					} else {
						alwayss.push(entry);
					}
				}
				return [keys, alwayss];
			},
			[[] as KnowledgeBaseEntry[], [] as KnowledgeBaseEntry[]],
		);
		const contentKeywords = new Set(lastContent.split(/\s+/));
		const alwaysContent = alwaysEntries
			.map((entry) => entry.content?.trim())
			.filter(Boolean)
			.join("\n");
		const keyContent = keyEntries
			.filter((entry) => entry.keywords.some((k) => contentKeywords.has(k)))
			.map((entry) => entry.content)
			.join("\n");

		return [alwaysContent, keyContent].join("\n");
	} catch (error) {
		throw error instanceof Error ? error : new Error("转换知识库信息失败");
	}
}

export async function transformPrompt(
	promptId: number | undefined,
	characterId: number,
	history?: string,
	knowledgeBase?: string,
) {
	try {
		if (!promptId) return "\n";
		const promptContent = await readPromptContent(promptId);
		if (!promptContent) return "\n";
		const character = await readCharacterById(characterId);
		if (!character) throw new Error("转换提示词时未找到角色卡数据");
		for (const item of promptContent) {
			if (item.identifier === "chatHistory") {
				item.content = history || "\n";
			}
			if (item.identifier === "charDescription") {
				item.content = character.description || "\n";
			}
			if (item.identifier === "worldInfoAfter") {
				item.content = knowledgeBase || "\n";
			}
		}
		const activePrompt = promptContent.filter(
			(item) => item.isEnabled === true,
		);

		const prompt = activePrompt.map((item) => item.content).join("\n");
		return prompt;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("转换提示词信息失败");
	}
}

export async function transformSendRegex(str: string) {
	try {
		const rows = await readIsGlobalEnabledSendRegex();
		if (rows.length === 0) {
			const response = await transformUserName(str);
			return response;
		}
		let result = str;
		const regexRules = rows.map((item) => ({
			replace: new RegExp(item.replace),
			placeholder: item.placement,
		}));
		for (const { replace, placeholder } of regexRules) {
			result = result.replace(replace, placeholder);
		}
		const response = await transformUserName(result);
		return response;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("转换正则信息失败");
	}
}

/**
 * 匹配 {{user}} 替换为用户名
 * @param str
 */
export async function transformUserName(str: string) {
	try {
		const value = await Storage.getItem("TRANCE_USER_NAME");
		if (!value) {
			return str;
		}
		const regex = /\{\{user\}\}/gi;
		const result = str.replace(regex, value);
		return result;
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("替换用户名失败");
	}
}

export async function transformRenderRegex(str: string) {
	try {
		let message = str;
		const promptRegex = await readEnabledGlobalRenderRegex();
		if (promptRegex) {
			const regexRules = promptRegex.map((item) => ({
				replace: new RegExp(item.replace),
				placeholder: item.placement,
			}));
			for (const { replace, placeholder } of regexRules) {
				message = str.replace(replace, placeholder);
			}
		}
		return message;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("消息正则匹配失败");
	}
}

export async function transformPureHtml(str: string) {
	try {
		const whiteList = [
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"p",
			"span",
			"div",
			"img",
			"ul",
			"ol",
			"li",
			"table",
			"tr",
			"td",
			"th",
			"blockquote",
			"code",
			"pre",
			"header",
			"footer",
			"section",
			"article",
			"aside",
			"nav",
			"main",
			"br",
			"hr",
			"strong",
			"em",
			"i",
			"b",
			"u",
		];
		const regex = new RegExp(
			`</?(?!(?:${whiteList.join("|")})\\b)(\\w+)[^>]*>`,
			"gi",
		);
		const response = str.replace(regex, "");
		return response;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("删除多余HTML标签失败");
	}
}

export async function transformRenderMessage(
	str: string,
	roomOptions: RoomOptions,
) {
	try {
		const regexResult = await transformRenderRegex(str);
		const pureHtmlResult = await transformPureHtml(regexResult);
		const userResult = await transformUserName(pureHtmlResult);
		const response = userResult.replace(/^\n+/g, "");
		return response;
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("渲染消息失败");
	}
}
