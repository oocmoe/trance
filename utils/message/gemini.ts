import type { RoomOptions } from "@/store/roomOptions";
import { GoogleGenAI, type SafetySetting } from "@google/genai";
import * as SecureStore from "expo-secure-store";
import { Storage } from "expo-sqlite/kv-store";
import {
	transformHistroyMessage,
	transformKnowledgeBase,
	transformPrompt,
	transformSendRegex,
} from "./transform";

type GeminiChatHistory = {
	role: "user" | "model";
	parts: [{ text: "string" }];
};

const GeminiSafetySettings = [
	{
		category: "HARM_CATEGORY_HARASSMENT",
		threshold: "OFF",
	},
	{
		category: "HARM_CATEGORY_HATE_SPEECH",
		threshold: "OFF",
	},
	{
		category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
		threshold: "OFF",
	},
	{
		category: "HARM_CATEGORY_DANGEROUS_CONTENT",
		threshold: "OFF",
	},
	{
		category: "HARM_CATEGORY_CIVIC_INTEGRITY",
		threshold: "BLOCK_NONE",
	},
];

export async function tranceHiGemini(
	content: string,
	type: string,
	roomOptions: RoomOptions,
) {
	try {
		const keyGroupResult = await SecureStore.getItem(
			"TRANCE_MODEL_GEMINI_KEYGROUP",
		);
		if (!keyGroupResult) throw new Error("未设置密钥组");
		const keyGroup = JSON.parse(keyGroupResult);

		if (type === "text") {
			const key = await geminiKeyReady(keyGroup);
			const history = await geminiChatHistoryReady(content, roomOptions);
			const result = await tranceHiGeminiText(
				content,
				history,
				key,
				roomOptions.model?.version as GeminiModels,
			);
			return result;
		}
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("Gemini中间件错误");
	}
}

/**
 * 生成ai.chats.create(history)
 * @param roomOptions
 */
async function geminiChatHistoryReady(
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
		const history = [
			{
				role: "user",
				parts: [{ text: regexResult }],
			},
		];

		if (historyResult.lastAssistantContent) {
			history.push({
				role: "model",
				parts: [{ text: historyResult.lastAssistantContent }],
			});
		}
		console.log(history);
		return history as GeminiChatHistory[];
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("消息准备失败");
	}
}

/**
 * 获取轮询密钥
 * @param keyGroupValue
 * @returns
 */
async function geminiKeyReady(keyGroupValue: string[]) {
	try {
		const [keyPollingResult, keyPollingCounterResult, keyPollingIndexResult] =
			await Promise.all([
				Storage.getItem("TRANCE_MODEL_GEMINI_POLLING"),
				Storage.getItem("TRANCE_MODEL_GEMINI_POLLINGCOUNTER"),
				Storage.getItem("TRANCE_MODEL_GEMINI_POLLINGINDEX"),
			]);
		if (!keyPollingResult) throw new Error("未设置Gemini密钥轮询");
		const keyPolling = Number(JSON.parse(keyPollingResult));
		if (keyPolling === 0) return keyGroupValue[0];
		let counter = Number(keyPollingCounterResult ?? 0);
		let index = Number(keyPollingIndexResult ?? 0);
		const maxIndex = keyGroupValue.length - 1;
		if (counter >= keyPolling) {
			index = index >= maxIndex ? 0 : index + 1;
			counter = 0;
			await Promise.all([
				Storage.setItem("TRANCE_MODEL_GEMINI_POLLINGCOUNTER", "0"),
				Storage.setItem("TRANCE_MODEL_GEMINI_POLLINGINDEX", String(index)),
			]);
		} else {
			counter++;
			await Storage.setItem(
				"TRANCE_MODEL_GEMINI_POLLINGCOUNTER",
				String(counter),
			);
		}
		return keyGroupValue[Math.min(index, maxIndex)];
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("密钥准备失败");
	}
}

/**
 *
 * @param message
 * @param history
 * @param key
 * @param model_version
 * @returns
 */
async function tranceHiGeminiText(
	message: string,
	history: GeminiChatHistory[],
	key: string,
	model_version: GeminiModels,
) {
	try {
		const ai = new GoogleGenAI({ apiKey: key });
		const chat = ai.chats.create({
			model: model_version,
			history: history,
			config: {
				safetySettings: GeminiSafetySettings as SafetySetting[],
			},
		});

		const response = await chat.sendMessage({
			message: message,
		});
		if (!response.text) throw new Error("获取了响应但是没有返回文本内容");
		return response.text;
	} catch (error) {
		throw error instanceof Error ? error.message : new Error("API远程错误");
	}
}

// async function geminiKeyReady(keyGroupValue:string[]) {
//   const keyPollingResult = await Storage.getItem("TRANCE_MODEL_GEMINI_POLLING")
//   if(!keyPollingResult) throw new Error("未设置Gemini密钥轮询");
//   const keyPolling = Number(JSON.parse(keyPollingResult))
//   if(keyPolling === 0){
//     return keyGroupValue[0]
//   }
//   const keyPollingCounterResult = await Storage.getItem("TRANCE_MODEL_GEMINI_POLLINGCOUNTER")
//   const keyPollingIndexResult = await Storage.getItem("TRANCE_MODEL_GEMINI_POLLINGINDEX")
//   if(!keyPollingCounterResult || !keyPollingIndexResult) throw new Error("轮询状态丢失");
//   const keyPollingCounter = Number(keyPollingCounterResult)
//   const keyPollingIndex = Number(keyPollingIndexResult)
//   if(keyPollingCounter >= keyPolling){
//     await Storage.setItem("TRANCE_MODEL_GEMINI_POLLINGCOUNTER","0")
//     if(keyPollingIndex > keyGroupValue.length){
//       await Storage.setItem("TRANCE_MODEL_GEMINI_POLLINGINDEX","0")
//       return keyGroupValue[0]
//     }
//     return keyGroupValue[keyPollingIndex]
//   }
//   await Storage.setItem("TRANCE_MODEL_GEMINI_POLLINGCOUNTER",String(keyPollingCounter + 1))
//   return keyGroupValue[keyPollingIndex]

// }

// export async function tranceHiGemini(options: GeminiOptions) {
//   const key = await SecureStore.getItem("TRANCE_MODEL_GEMINI_KEY");
//   if (!key) throw new Error("Gemini 密钥未设置");
//   const prompt = await readGeminiPrompt(
//     options.promptId,
//     options.personnel,
//     options.roomId,
//   );
//   if (!prompt) throw new Error("未找到房间所匹配的提示词");
//   const genAI = new GoogleGenerativeAI(key);
//   const model = genAI.getGenerativeModel({ model: options.model_version });
//   let safetySettings = GEMINI_SAFETY;
//   safetySettings = GEMINI_SAFETY.map((setting) => ({
//     ...setting,
//     threshold: "BLOCK_NONE",
//   }));
//   safetySettings = GEMINI_SAFETY.map((setting) => ({
//     ...setting,
//     threshold: "OFF",
//   }));
//   model.safetySettings;

//   const chat = model.startChat({
//     history: [
//       {
//         role: "user",
//         parts: [{ text: prompt }],
//       },
//     ],
//   });
//   try {
//     const insertUserInput = await createMessage(
//       options.roomId,
//       "text",
//       1,
//       options.content,
//       "user",
//     );
//     if (!insertUserInput) return;
//     const result = await chat.sendMessage(options.content);
//     const rows = await createMessage(
//       options.roomId,
//       "text",
//       0,
//       result.response.text(),
//       "assistant",
//     );
//     return rows;
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// }

// async function readGeminiHistroyMessage(roomId: number) {
//   try {
//     const result = await readHistroyMessage(roomId);
//     if (!result) return;
//     if (result.length === 0) return "\n";
//     const history = result.map((item) => item.content).join("\n");
//     if (!history) return;
//     return history;
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function readGeminiPrompt(
//   promptId: number,
//   personnel: Array<string>,
//   roomId: number,
// ) {
//   try {
//     // 数据准备
//     const history = await readGeminiHistroyMessage(roomId);
//     if (!history) return;
//     const promptContent = await readPromptContent(promptId);
//     if (!promptContent) return;
//     const character = await readCharacterById(Number(personnel[0]));
//     if (!character) return;
//     // 根据提示词排序替换
//     for (const item of promptContent) {
//       if (item.identifier === "chatHistory") {
//         item.content = history;
//       }
//       if (item.identifier === "charDescription") {
//         item.content = character.description || "";
//       }
//     }
//     const activePrompt = promptContent.filter(
//       (item) => item.isEnabled === true,
//     );
//     const promptRaw = activePrompt.map((item) => item.content).join("\n");
//     const prompt = await regexUserName(promptRaw);
//     if (!prompt) return;
//     return prompt;
//   } catch (error) {
//     console.log(error);
//   }
// }
