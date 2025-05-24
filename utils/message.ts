import type { TranceHi } from "@/types/trance.types";
import { tranceHiGemini } from "./model/gemini";
import { tranceHiCustomOpenAI } from "@/utils/model/customOpenAI";

export async function tranceHi(hi: TranceHi) {
	try {
		if (hi.type === "novel") {
			return "";
		}
		if (hi.type === "image") {
			return "";
		}
		if (hi.model?.model_name === "Gemini") {
			const result = await tranceHiGemini(hi);
			return result || "!Error_UNKNOWN";
		}
		if (hi.model?.model_name === "Custom_OpenAI") {
				const result = await tranceHiCustomOpenAI(hi)
				return result || "!Error_UNKNOWN";
		}
		throw new Error("未选择模型");
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: tranceHi");
	}
}
