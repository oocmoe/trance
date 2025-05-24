import {
	readPromptGroupById,
	readRoomRenderMessage,
	readPromptWithCharacterMessageReady,
	readRegexWithSending,
	readCharacterById,
	readPromptTranceHi,
	readKnowledgeBaseTranceHi,
} from "@/db/client";
import type { RegexTable, RoomMessageTable } from "@/db/schema";
import type { TranceChatBubbleMessage, TranceHi } from "@/types/trance.types";
import type { Content } from "@google/genai";
import { Storage } from "expo-sqlite/kv-store";
import type OpenAI from "openai";

export async function transformTranceHiCustomOpenAITextHistory(hi: TranceHi) {
	try {
		const renderMessage = await readRoomRenderMessage(hi);
		let textMessage = renderMessage.filter((item) => item.type === "text");

		// KnowledgeBase
		textMessage = await transformTranceHiTextKnowledgeBase(hi, textMessage);

		// Regex
		const regex = await readRegexWithSending(hi.personnel);
		if (regex.length) {
			textMessage = textMessage.map((item) =>
				item.content
					? {
							...item,
							content: regex.reduce(
								(str, rule) => (rule.replace ? str.replace(new RegExp(rule.replace), rule.placement || "") : str),
								item.content,
							),
						}
					: item,
			);
		}

		let history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = textMessage.map((item) => ({
			role: item.role,
			content: item.content,
		}));

		let prompt = await transformTranceHiTextPrompt(hi);
		prompt = await transformCharacterPlaceholder(hi.personnel[0], prompt);
		prompt = await transformUserPlaceholder(prompt);
		prompt = await transformCharacterPlaceholder(hi.personnel[0], prompt);
		const promptMessage = {
			role: "system" as const,
			content: prompt,
		};

		history = [promptMessage, ...history];

		return history;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: transformTranceHiCustomOpenAITextHistory",
		);
	}
}

export async function transformTranceHiGeminiTextHistory(hi: TranceHi) {
	try {
		const renderMessage = await readRoomRenderMessage(hi);
		let textMessage = renderMessage.filter((item) => item.type === "text");

		// KnowledgeBase
		textMessage = await transformTranceHiTextKnowledgeBase(hi, textMessage);

		// Regex
		const regex = await readRegexWithSending(hi.personnel);
		if (regex.length) {
			textMessage = textMessage.map((item) =>
				item.content
					? {
							...item,
							content: regex.reduce(
								(str, rule) => (rule.replace ? str.replace(new RegExp(rule.replace), rule.placement || "") : str),
								item.content,
							),
						}
					: item,
			);
		}

		let isFirstModelMessage = true;
		const historyPromises = textMessage.map(async (item): Promise<Content[]> => {
			if (item.role === "user") {
				return [
					{
						role: "user",
						parts: [{ text: item.content }],
					},
				];
			}
			if (item.role === "assistant") {
				const shouldTransform = isFirstModelMessage;
				if (isFirstModelMessage) isFirstModelMessage = false;

				let content = shouldTransform
					? await transformCharacterPlaceholder(hi.personnel[0], item.content)
					: item.content;
				content = await transformUserPlaceholder(content);
				return [
					{
						role: "model",
						parts: [{ text: content }],
					},
				];
			}
			return [];
		});
		let history = (await Promise.all(historyPromises)).flat();

		// Prompt
		if (hi.prompt_group_id) {
			const prompts = await readPromptTranceHi(hi);
			let prompt = await prompts.map((item) => item.content).join("");
			prompt = await transformUserPlaceholder(prompt);
			prompt = await transformCharacterPlaceholder(hi.personnel[0], prompt);
			history = [
				{
					role: "user",
					parts: [{ text: prompt }],
				},
				...history,
			];
		}

		return history;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: transformTranceHiGeminiTextHistory",
		);
	}
}

// function transformMessageHistoryToGeminiHistory(messageHistory: Array<RoomMessageTable>): Content[] {
// 	try {
// 		return messageHistory.flatMap((item): Content[] => {
// 			if (item.type !== "text" || !item.content) {
// 				return [];
// 			}
// 			if (item.role === "user") {
// 				return [
// 					{
// 						role: "user",
// 						parts: [{ text: item.content }],
// 					},
// 				];
// 			}
// 			if (item.role === "assistant") {
// 				return [
// 					{
// 						role: "model",
// 						parts: [{ text: item.content }],
// 					},
// 				];
// 			}
// 			return [];
// 		});
// 	} catch (error) {
// 		throw new Error(
// 			error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: transformMessageHistoryToGeminiHistory",
// 		);
// 	}
// }

async function transformTranceHiTextPrompt(hi: TranceHi) {
	try {
		const promptGroup = await readPromptWithCharacterMessageReady(hi);
		const prompt = promptGroup.map((item) => item.content).join("");
		return prompt;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: transformTranceHiTextPrompt");
	}
}

async function transformTranceHiTextKnowledgeBase(hi: TranceHi, messageHistory: Array<RoomMessageTable>) {
	try {
		const knowledgeBase = await readKnowledgeBaseTranceHi(hi);
		const lastTwoMessages = messageHistory.slice(-2);
		const keywordKnowledge = knowledgeBase.filter(
			(kb) => kb.trigger === "keyword" && kb.is_enabled && kb.content !== null && kb.keywords !== null,
		);
		for (const message of lastTwoMessages) {
			for (const kb of keywordKnowledge) {
				if (kb.keywords?.some((keyword) => message.content.trim() === keyword.trim())) {
					if (kb.depth === null || kb.depth >= messageHistory.length) {
						if (messageHistory.length > 0) {
							messageHistory[0].content += `\n\n${kb.content}`;
						}
					} else {
						const targetIndex = messageHistory.length - 1 - kb.depth;
						if (targetIndex >= 0 && targetIndex < messageHistory.length) {
							messageHistory[targetIndex].content += `\n\n${kb.content}`;
						}
					}
					break;
				}
			}
		}

		const alwaysKnowledge = knowledgeBase.filter(
			(kb) => kb.trigger === "always" && kb.is_enabled && kb.content !== null,
		);

		alwaysKnowledge.sort((a, b) => {
			if (a.depth === null) return -1;
			if (b.depth === null) return 1;
			return (b.depth || 0) - (a.depth || 0);
		});

		for (const kb of alwaysKnowledge) {
			if (kb.depth === null || kb.depth >= messageHistory.length) {
				if (messageHistory.length > 0) {
					messageHistory[0].content += `\n\n${kb.content}`;
				}
			} else {
				const targetIndex = messageHistory.length - 1 - kb.depth;
				if (targetIndex >= 0 && targetIndex < messageHistory.length) {
					messageHistory[targetIndex].content += `\n\n${kb.content}`;
				}
			}
		}

		return messageHistory;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: transformTranceHiTextKnowledgeBase",
		);
	}
}

async function transformCharacterPlaceholder(characterId: number, str: string) {
	try {
		const character = await readCharacterById(characterId);
		const charRegex = /\{\{char\}\}/gi;
		const descriptionRegex = /\{\{description\}\}/gi;
		const personalityRegex = /\{\{personality\}\}/gi;
		const scenarioRegex = /\{\{scenario\}\}/gi;
		let replacedStr = str.replace(charRegex, character.name);
		if (character.description) {
			replacedStr = replacedStr.replace(descriptionRegex, character.description);
		}
		if (character.personality) {
			replacedStr = replacedStr.replace(personalityRegex, character.personality);
		}
		if (character.scenario) {
			replacedStr = replacedStr.replace(scenarioRegex, character.scenario);
		}
		return replacedStr;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: transformCharacterPlaceholder");
	}
}

export async function transformUserPlaceholder(str: string) {
	try {
		const username = (await Storage.getItem("TRANCE_USER_NAME"))?.replace(/^"|"$/g, "") || "";
		const usernameRegex = /\{\{user\}\}/gi;
		const replacedStr = str.replace(usernameRegex, username || "");
		return replacedStr;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: transformUserPlaceholder");
	}
}

async function transformRegexWithSending(hi: TranceHi, str: string) {
	try {
		const regex = await readRegexWithSending(hi.personnel);
		const regexRules = regex
			.filter((item) => item.replace != null)
			.map((item) => ({
				replace: new RegExp(item.replace as string),
				placeholder: item.placement ?? "",
			}));
		return regexRules.reduce((currentStr, { replace, placeholder }) => currentStr.replace(replace, placeholder), str);
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: transformTranceHiTextKnowledgeBase",
		);
	}
}

export function transformRegexText(str: string, regex: Array<RegexTable>) {
	let result = str;
	for (const item of regex) {
		if (!item.is_enabled || !item.replace) continue;
		const patternParts = item.replace.match(/^\/(.*?)\/([gimsuy]*)$/);
		const replacement = item.placement ?? "";
		if (patternParts) {
			const [, pattern, flags] = patternParts;
			result = result.replace(new RegExp(pattern, flags), replacement);
		} else {
			result = result.replace(new RegExp(item.replace, "gs"), replacement);
		}
	}
	return result;
}

export function transformChatBubbleMessage(roomMessage: RoomMessageTable): TranceChatBubbleMessage {
	if (roomMessage.type !== "text") {
		return {
			role: "system",
			message: [{ id: 1, type: "text", content: [""] }],
		};
	}
	const textSegments = transformRenderText(roomMessage.content);
	const imageUrls = transformHTMLImageSrc(roomMessage.content);
	const combinedTextContent = textSegments.map((segment) => segment.content).join("\n");
	let idCounter = 1;
	const messagesWithId = [
		{
			id: idCounter++,
			type: "text" as const,
			content: [combinedTextContent],
		},
		...(imageUrls
			? [
					{
						id: idCounter++,
						type: "image" as const,
						content: Array.isArray(imageUrls) ? imageUrls : [imageUrls],
					},
				]
			: []),
	];

	return {
		role: roomMessage.role,
		message: messagesWithId,
	};
}
function transformHTMLImageSrc(str: string) {
	const imageSrcRegex = new RegExp(/(?<=<img[^>]*\bsrc=")[^"]+/g);
	const imageSrc = str.match(imageSrcRegex);
	if (imageSrc) return imageSrc;
}

export function transformRenderText(str: string) {
	const pureHtml = transformPureHtml(str);
	const pureFormat = transformPureFormate(pureHtml);
	const paragraphs = pureFormat.split("\n").filter((paragraph) => paragraph.trim() !== "");
	return paragraphs.map((paragraph) => ({
		type: "text" as const,
		content: paragraph.trim(),
	}));
}
function transformPureHtml(str: string) {
	const whiteList = [
		"oocmoe",
		// "h1",
		// "h2",
		// "h3",
		// "h4",
		// "h5",
		// "h6",
		// "p",
		// "span",
		// "div",
		// "img",
		// "ul",
		// "ol",
		// "li",
		// "table",
		// "tr",
		// "td",
		// "th",
		// "blockquote",
		// "code",
		// "pre",
		// "header",
		// "footer",
		// "section",
		// "article",
		// "aside",
		// "nav",
		// "main",
		// "br",
		// "hr",
		// "strong",
		// "em",
		// "i",
		// "b",
		// "u",
	];
	const regex = new RegExp(`</?(?!(?:${whiteList.join("|")})\\b)(\\w+)[^>]*>`, "gi");
	const response = str.replace(regex, "");
	return response;
}

function transformPureFormate(str: string) {
	return str
		.split(/\r?\n/)
		.map((s) => s.trim())
		.filter((s, i, arr) => s || (i && arr[i - 1]))
		.join("\n");
}
