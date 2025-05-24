import type { TranceHi } from "@/types/trance.types";
import { transformTranceHiCustomOpenAITextHistory } from "@/utils/transform";
import * as SecureStore from "expo-secure-store";
import { Storage } from "expo-sqlite/kv-store";
import OpenAI from "openai";

export async function tranceHiCustomOpenAI(hi:TranceHi) {
	try{
		if(hi.type === "text"){
			const history = await transformTranceHiCustomOpenAITextHistory(hi)
			const result = await tranceHiCustomOpenAIText(history)
			return result
		}
	}catch(error){
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: tranceHiCustomOpenAI");
	}
}

export async function tranceHiCustomOpenAIText(history:OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
	try{
		const url = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_URL");
		const key = await SecureStore.getItemAsync("TRANCE_MODEL_CUSTOM_OPENAI_KEY");
		const version = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_VERSION");
		console.log(version)
		console.log(history)
		if(!url) throw new Error("未设置远程地址")
		if(!version) throw new Error("未设置模型版本")
		const client = new OpenAI({
			baseURL: url,
			apiKey: key ?? undefined,
		});

		const completion = await client.chat.completions.create({
			model: version,
			messages: history,
		});
		console.log(completion.choices[0].message.content)
		return completion.choices[0].message.content;
	}catch(error){
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: tranceHiCustomOpenAIText");
	}
}

export async function tranceHiCustomOpenAITextTest(url: string, version: string, key?: string) {
	try {
		const client = new OpenAI({
			baseURL: url,
			apiKey: key,
		});
		const completion = await client.chat.completions.create({
			model: version,
			messages: [
				{
					role: "user",
					content: "Who are you?",
				},
			],
		});
		return completion.choices[0].message.content;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: tranceHiCustomOpenAITextTest");
	}
}
