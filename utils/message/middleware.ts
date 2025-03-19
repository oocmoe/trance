import type { Messages } from "@/db/schema/message";
import type { Room } from "@/db/schema/room";
import { readEnabledGlobalRenderRegex } from "../db/regex";
import { tranceHiGemini } from "./gemini";

/**
 * 消息队列
 *
 * 发送消息
 *  ↓
 * options
 *  ↓
 * 发送正则
 *  ↓
 * 中间件
 *  ↓
 * 对应模型结果
 *  ↓
 * 渲染正则
 *  ↓
 * 渲染html
 *  ↓
 * @returns
 *
 */

/**
 * 消息中间件
 * @param content 
 * @param type 
 * @param room 
 * @returns 
 */
export async function tranceHi(content: string, type: string, room: Room) {
	if (!room.model || room.personnel.length === 0 || !room.prompt)
		throw new Error("房间未设置模型或者提示词");
	const options = {
		roomId: room.id,
		content: content,
		promptId: room.prompt,
		personnel: room.personnel,
		model: room.model.model,
		model_version: room.model.version,
	};

	if (options.model === "Gemini") {
		if (type === "text") {
			const result = await tranceHiGemini(options);
			if (!result) return;
			return result;
		}
	}
}
/**
 * 渲染消息
 * @param messages 
 * @returns 
 */
export async function tranceRenderMessages(
	messages: Messages[],
) {
	try {
		const formatedMessages = await Promise.all(
			messages.map(async (item) => {
				const content = await tranceConvertMessage(item.content);
				return {
					id: item.id,
					global_id: item.global_id,
					type: item.type,
					is_Sender: item.is_Sender,
					content: content || "ERROR",
					role: item.role,
				};
			}),
		);
		return formatedMessages;
	} catch (error) {
		console.log(error);
	}
}

/**
 * 转换html消息
 * @param content 
 * @returns 
 */
export async function tranceConvertMessage(content: string) {
	try {
		const promptRegex = await readEnabledGlobalRenderRegex();
		let message = content;
		if (promptRegex) {
			const regexRules = promptRegex.map((item) => ({
				replace: new RegExp(item.replace),
				placeholder: item.placement,
			}));
			for (const { replace, placeholder } of regexRules) {
				message = content.replace(replace, placeholder);
		}
		}
		message = removeSpareHtmlTag(content);
		const highlightedChat = content.replace(
			/["“](.*?)["”]/g,
			'<span style="color: orange;">"$1"</span>',
		);
		return highlightedChat;
	} catch (error) {
		console.log(error);
	}
}

/**
 * 删除多余html标签
 * @param content 
 * @returns 
 */
function removeSpareHtmlTag(content: string) {
	const tagGroup = [
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
	const tagRule = tagGroup.map((tag) => `${tag}\\b`).join("|");
	const regexTag = new RegExp(`<(?!(?:${tagRule})>)[^>]+>`, "g");
	const response = content.replace(regexTag, "");
	return response;
}
