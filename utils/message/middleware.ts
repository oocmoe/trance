import type { RoomOptions } from "@/store/roomOptions";
import { tranceHiCustomoOpenAI } from "./customOpenAI";
import { tranceHiGemini } from "./gemini";

export async function tranceHi(
	content: string,
	type: "text" | "novel",
	roomOptions: RoomOptions,
	messageId?: number
) {
	try {
		if (type === "novel") throw new Error("未实现小说模式");
		if (!roomOptions.model?.model || !roomOptions.model?.version) {
			throw new Error("未设置模型或模型版本");
		}
		if (roomOptions.model.model === "Custom_OpenAI") {
			if (type === "text") {
				const result = tranceHiCustomoOpenAI(content, type, roomOptions,messageId);
				return result;
			}
		}
		if (roomOptions.model.model === "Grok") {
			if (type === "text") {
				const result = tranceHiCustomoOpenAI(content, type, roomOptions,messageId);
				return result;
			}
		}
		if (roomOptions.model.model === "Gemini") {
			if (type === "text") {
				const result = tranceHiGemini(content, type, roomOptions,messageId);
				return result;
			}
		}
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("API远程错误");
	}
}
