import { type Content, GoogleGenAI, type SafetySetting } from "@google/genai";
import * as SecureStore from "expo-secure-store";
import { Storage } from "expo-sqlite/kv-store";
import { transformTranceHiGeminiTextHistory } from "../transform";
import type { TranceHi } from "@/types/trance.types";

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

export async function tranceHiGemini(hi: TranceHi) {
	try {
		if (hi.type === "text") {
			const history = await transformTranceHiGeminiTextHistory(hi);
			const result = await tranceHiGeminiText(hi, history);
			return result;
		}
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: tranceHiGemini");
	}
}

async function tranceHiGeminiText(hi: TranceHi, history: Content[]) {
	try {
		const key = await geminiKeyReady();
		const ai = new GoogleGenAI({ apiKey: key });
		const chat = ai.chats.create({
			model: hi.model?.model_version as string,
			history: history,
			config: {
				safetySettings: GeminiSafetySettings as SafetySetting[],
				temperature: hi.model?.temperature || 1.1,
			},
		});
		const response = await chat.sendMessage({
			message: hi.userLatestInput,
		});
		console.log(JSON.stringify(response));
		if (response.text) {
			return response.text;
		}

		return JSON.stringify(response);
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: geminiKeyReady");
	}
}

export async function tranceHiGeminiTextTest() {
	try {
		const key = await geminiKeyReady();
		const ai = new GoogleGenAI({ apiKey: key });
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: "Who are you?",
		});
		console.log(response.text);
		return response.text;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: tranceHiGeminiTextTest");
	}
}

async function geminiKeyReady() {
	try {
		const keyGroup = await SecureStore.getItem("TRANCE_MODEL_GEMINI_KEY");
		if (!keyGroup) throw new Error("!ERROR_GEMINI_KEY_NOT_FOUND");
		const [keyPollingResult, keyPollingCounterResult, keyPollingIndexResult] = await Promise.all([
			Storage.getItem("TRANCE_MODEL_GEMINI_POLLING"),
			Storage.getItem("TRANCE_MODEL_GEMINI_POLLINGCOUNTER"),
			Storage.getItem("TRANCE_MODEL_GEMINI_POLLINGINDEX"),
		]);
		const keyPolling = Number(JSON.parse(keyPollingResult ?? "0"));
		if (keyPolling === 0) return JSON.parse(keyGroup)[0];
		let counter = Number(keyPollingCounterResult ?? 0);
		let index = Number(keyPollingIndexResult ?? 0);
		const maxIndex = keyGroup.length - 1;
		if (counter >= keyPolling) {
			index = index >= maxIndex ? 0 : index + 1;
			counter = 0;
			await Promise.all([
				Storage.setItem("TRANCE_MODEL_GEMINI_POLLINGCOUNTER", "0"),
				Storage.setItem("TRANCE_MODEL_GEMINI_POLLINGINDEX", String(index)),
			]);
		} else {
			counter++;
			await Storage.setItem("TRANCE_MODEL_GEMINI_POLLINGCOUNTER", String(counter));
		}
		return JSON.parse(keyGroup[Math.min(index, maxIndex)]);
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: geminiKeyReady");
	}
}
