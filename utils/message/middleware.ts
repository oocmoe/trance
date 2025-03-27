import type { RoomOptions } from "@/store/roomOptions";
import { tranceHiCustomoOpenAI } from "./customOpenAI";
import { tranceHiGemini } from "./gemini";

export async function tranceHi(
	content: string,
	type: "text" | "novel",
	roomOptions: RoomOptions,
) {
	try {
		if (type === "novel") throw new Error("未实现小说模式");
		if (!roomOptions.model?.model || !roomOptions.model.version) {
			throw new Error("未设置模型或模型版本");
		}
		if (roomOptions.model.model === "Custom_OpenAI") {
			if (type === "text") {
				const result = tranceHiCustomoOpenAI(content, type, roomOptions);
				return result;
			}
		}
		if (roomOptions.model.model === "Gemini") {
			if (type === "text") {
				const result = tranceHiGemini(content, type, roomOptions);
				return result;
			}
		}
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("API远程错误");
	}
}

/**
 * 渲染消息
 * @param messages
 * @returns
 */
// export async function tranceRenderMessages(messages: Messages[]) {
//   try {
//     const formatedMessages = await Promise.all(
//       messages.map(async (item) => {
//         const content = await tranceConvertMessage(item.content);
//         return {
//           id: item.id,
//           global_id: item.global_id,
//           type: item.type,
//           is_Sender: item.is_Sender,
//           content: content || "ERROR",
//           role: item.role,
//         };
//       }),
//     );
//     return formatedMessages;
//   } catch (error) {
//     console.log(error);
//   }
// }

/**
 * 转换html消息
 * @param content
 * @returns
 */
// export async function tranceConvertMessage(content: string) {
//   try {
//     const promptRegex = await readEnabledGlobalRenderRegex();
//     let message = content;
//     if (promptRegex) {
//       const regexRules = promptRegex.map((item) => ({
//         replace: new RegExp(item.replace),
//         placeholder: item.placement,
//       }));
//       for (const { replace, placeholder } of regexRules) {
//         message = content.replace(replace, placeholder);
//       }
//     }
//     message = removeSpareHtmlTag(content);
//     const highlightedChat = content.replace(
//       /["“](.*?)["”]/g,
//       '<span style="color: orange;">"$1"</span>',
//     );
//     return highlightedChat;
//   } catch (error) {
//     console.log(error);
//   }
// }

/**
 * 删除多余html标签
 * @param content
 * @returns
 */
// function removeSpareHtmlTag(str: string) {
//   let content = str;
//   const tagGroup = [
//     "h1",
//     "h2",
//     "h3",
//     "h4",
//     "h5",
//     "h6",
//     "p",
//     "span",
//     "div",
//     "img",
//     "ul",
//     "ol",
//     "li",
//     "table",
//     "tr",
//     "td",
//     "th",
//     "blockquote",
//     "code",
//     "pre",
//     "header",
//     "footer",
//     "section",
//     "article",
//     "aside",
//     "nav",
//     "main",
//     "br",
//     "hr",
//     "strong",
//     "em",
//     "i",
//     "b",
//     "u",
//   ];
//   const allowedTags = tagGroup.join("|");
//   const regexPair = new RegExp(
//     `<(?!\\/?(?:${allowedTags})\\b)([a-zA-Z][^\\s/>]*)(?:\\s[^>]*)?>([\\s\\S]*?)<\\/\\1>`,
//     "gi",
//   );
//   content = content.replace(regexPair, "$2");
//   const regexSingle = new RegExp(`<\\/?(?!(${allowedTags})\\b)[^>]+>`, "gi");
//   return content.replace(regexSingle, "");
// }
