import type { RoomOptions } from "@/store/roomOptions";
import * as SecureStore from "expo-secure-store";
import { Storage } from "expo-sqlite/kv-store";
import OpenAI from "openai";
import {
	transformHistroyMessage,
	transformKnowledgeBase,
	transformPrompt,
	transformSendRegex,
} from "./transform";

type CustomOpenAIMessages = {
	role: "system" | "user" | "assistant";
	content: string;
};
export async function tranceHiCustomoOpenAI(
	content: string,
	type: "text",
	roomOptions: RoomOptions,
	messageId?: number
) {
	try {
		if(roomOptions.model?.model === "Grok"){
			if (type === "text") {
				const messages = await customoOpenAIChatMessageReady(
					content,
					roomOptions,
					messageId
				);
				const result = await tranceHiGrokOpenAIText(messages, roomOptions);
				return result;
			}
		}
		if (type === "text") {
			const messages = await customoOpenAIChatMessageReady(
				content,
				roomOptions,
				messageId
			);
			const result = await tranceHiCustomoOpenAIText(messages, roomOptions);
			return result;
		}
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("中间件错误");
	}
}

async function customoOpenAIChatMessageReady(
	content: string,
	roomOptions: RoomOptions,
	messageId?: number
) {
	try {
		const historyResult = await transformHistroyMessage(roomOptions.id,messageId);
		const knowledgeBaseResult = await transformKnowledgeBase(
			content,
			historyResult.lastAssistantContent,
		);
		const promptResult = await transformPrompt(
			roomOptions.prompt,
			Number(roomOptions.personnel[0]),
			historyResult.history,
			knowledgeBaseResult,
		);
		const regexResult = await transformSendRegex(promptResult);

		const messages: CustomOpenAIMessages[] = [
			{
				role: "system",
				content: regexResult,
			},
		];
		if (historyResult.lastAssistantContent) {
			messages.push({
				role: "assistant",
				content: historyResult.lastAssistantContent,
			});
		}
		messages.push({
			role: "user",
			content: content,
		});
		return messages;
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("消息准备失败");
	}
}

async function tranceHiGrokOpenAIText(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
	roomOptions: RoomOptions,)  {
		try {
			const key = await SecureStore.getItem("TRANCE_MODEL_GROK_KEY");
			if (key === null) throw new Error("未设置 Grok 密钥");
			const client = new OpenAI({
				baseURL: "https://api.x.ai/v1",
				apiKey: key,
			});
			const completion = await client.chat.completions.create({
				model: roomOptions.model?.version as string,
				messages: messages,
				temperature:1.1
			});
			console.log(completion);
			return completion.choices[0];
		} catch (error) {
			console.log(error)
			throw error
		}
	}

async function tranceHiCustomoOpenAIText(
	messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
	roomOptions: RoomOptions,
) {
	try {
		const baseUrl = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_URL");
		if (baseUrl === null) throw new Error("未设置请求地址");
		const key = await SecureStore.getItem("TRANCE_MODEL_CUSTOM_OPENAI_KEY");
		if (key === null) throw new Error("未设置密钥");
		const client = new OpenAI({
			baseURL: baseUrl,
			apiKey: key,
		});
		const completion = await client.chat.completions.create({
			model: roomOptions.model?.version as string,
			messages: messages,
			temperature:1.1
		});
		console.log(completion);
		return completion.choices[0];
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("API远程请求失败");
	}
}

export async function tranceHiCustomoOpenAITextTest() {
	try {
		const baseUrl = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_URL");
		if (baseUrl === null) throw new Error("未设置请求地址");
		const key = await SecureStore.getItem("TRANCE_MODEL_CUSTOM_OPENAI_KEY");
		if (key === null) throw new Error("未设置密钥");
		const model = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_MODEL");
		if (model === null) throw new Error("未设置模型");

		const client = new OpenAI({
			baseURL: baseUrl,
			apiKey: key,
		});
		const completion = await client.chat.completions.create({
			model: model,
			messages: [
				{
					role: "user",
					content: "Who are you?",
				},
			],
		});
		console.log(completion);
		return completion.choices[0];
	} catch (error) {
		console.log(error);
		throw error instanceof Error ? error.message : new Error("API远程请求失败");
	}
}
