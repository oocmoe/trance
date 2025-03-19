import { GoogleGenerativeAI } from "@google/generative-ai";
import * as SecureStore from "expo-secure-store";
import { readCharacterById } from "../db/character";
import { createMessage, readHistroyMessage } from "../db/message";
import { readPromptContent } from "../db/prompt";
import { regexUserName } from "./regex";

type GeminiOptions = {
	roomId: number;
	promptId: number;
	content: string;
	model: "Gemini";
	model_version: GeminiModels;
	personnel: Array<string>;
};

const GEMINI_SAFETY = [
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

export async function tranceHiGemini(options: GeminiOptions) {
	const key = await SecureStore.getItem("TRANCE_MODEL_GEMINI_KEY");
	if (!key) throw new Error("Gemini 密钥未设置");
	const prompt = await readGeminiPrompt(
		options.promptId,
		options.personnel,
		options.roomId,
	);
	if (!prompt) throw new Error("未找到房间所匹配的提示词");
	const genAI = new GoogleGenerativeAI(key);
	const model = genAI.getGenerativeModel({ model: options.model_version });
	let safetySettings = GEMINI_SAFETY;
	safetySettings = GEMINI_SAFETY.map((setting) => ({
		...setting,
		threshold: "BLOCK_NONE",
	}));
	safetySettings = GEMINI_SAFETY.map((setting) => ({
		...setting,
		threshold: "OFF",
	}));
	model.safetySettings;

	const chat = model.startChat({
		history: [
			{
				role: "user",
				parts: [{ text: prompt }],
			},
		],
	});
	try {
		const insertUserInput = await createMessage(
			options.roomId,
			"text",
			1,
			options.content,
			"user",
		);
		if (!insertUserInput) return;
		const result = await chat.sendMessage(options.content);
		const rows = await createMessage(
			options.roomId,
			"text",
			0,
			result.response.text(),
			"assistant",
		);
		return rows;
	} catch (error) {
		console.log(error);
		return;
	}
}

async function readGeminiHistroyMessage(roomId: number) {
	try {
		const result = await readHistroyMessage(roomId);
		if (!result) return;
		if (result.length === 0) return "\n";
		const history = result.map((item) => item.content).join("\n");
		if (!history) return;
		return history;
	} catch (error) {
		console.log(error);
	}
}

async function readGeminiPrompt(
	promptId: number,
	personnel: Array<string>,
	roomId: number,
) {
	try {
		// 数据准备
		const history = await readGeminiHistroyMessage(roomId);
		if (!history) return;
		const promptContent = await readPromptContent(promptId);
		if (!promptContent) return;
		const character = await readCharacterById(Number(personnel[0]));
		if (!character) return;
		// 根据提示词排序替换
		promptContent.forEach((item) => {
			if (item.identifier === "chatHistory") {
				item.content = history;
			}
			if (item.identifier === "charDescription") {
				item.content = character.description || "";
			}
		});
		const activePrompt = promptContent.filter(
			(item) => item.isEnabled === true,
		);
		const promptRaw = activePrompt.map((item) => item.content).join("\n");
		const prompt = await regexUserName(promptRaw);
		if (!prompt) return;
		return prompt;
	} catch (error) {
		console.log(error);
	}
}
