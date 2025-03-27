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
) {
	try {
		if (type === "text") {
			const messages = await customoOpenAIChatMessageReady(
				content,
				roomOptions,
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
) {
	try {
		const historyResult = await transformHistroyMessage(roomOptions.id);
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
		});
		console.log(completion);
		console.log(completion.choices[0]);
		return completion.choices[0];
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("API远程请求失败");
	}
}
