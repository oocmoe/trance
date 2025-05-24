import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
	converterCharacterDataToTrance,
	converterImageToWebpBase64,
	converterSillyTavernKnowledgeBaseToTrance,
	converterSillyTavernPromptToTrance,
	converterSillyTavernRegexToTrance,
} from "./converter";
import { decoderJSON, decoderCharacterPNG } from "./decoder";

/**
 * Pick Png
 * @returns
 */
export async function pickerPNG() {
	try {
		const result = await DocumentPicker.getDocumentAsync({
			type: ["image/png"],
		});
		if (!result.canceled) {
			return result.assets[0];
		}
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: pickerPNG");
	}
}

/**
 * Pick UserAvatar
 * @returns
 */
export async function pickerUserAvatar() {
	try {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		if (!result.canceled) {
			const webpBase64 = await converterImageToWebpBase64(result.assets[0].uri);
			return webpBase64;
		}
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: pickerUserAvatar");
	}
}

/**
 * Pick Character PNG Card
 * @returns
 */
export async function pickerCharacterPNGCard() {
	try {
		const assets = await pickerPNG();
		if (!assets) return;
		const cover = await converterImageToWebpBase64(assets.uri);
		const decodeResult = await decoderCharacterPNG(assets.uri);
		if (!decodeResult || !cover) return;
		const result = await converterCharacterDataToTrance(decodeResult, cover);
		if (!result) return;
		return result;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: pickerCharacterPNGCard");
	}
}

/**
 * Pick JSON
 * @returns
 */
export async function pickerJSON() {
	try {
		const result = await DocumentPicker.getDocumentAsync({
			type: ["application/json"],
		});
		if (result.canceled) return;
		return result;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: pickerJSON");
	}
}

/**
 * Pick Prompt
 * @returns
 */
export async function pickerPrompt() {
	try {
		const jsonFile = await pickerJSON();
		if (!jsonFile) return;
		const json = await decoderJSON(jsonFile.assets[0].uri);
		const prompt = await converterSillyTavernPromptToTrance(json as unknown as SillyTavernPrompt);
		return {
			name: jsonFile.assets[0].name.replace(/\.json$/i, ""),
			prompt: prompt,
		};
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: pickerPrompt");
	}
}

export async function pickerRegex() {
	try {
		const jsonFile = await pickerJSON();
		if (!jsonFile) return;
		const json = await decoderJSON(jsonFile.assets[0].uri);
		const regex = converterSillyTavernRegexToTrance(json as unknown as SillyTavernRegex);
		return regex;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: pickerRegex");
	}
}

export async function pickerKnowledgeBase() {
	try{
		const jsonFile = await pickerJSON();
		if (!jsonFile) return;
		const json = await decoderJSON(jsonFile.assets[0].uri);
		const knowledgeBase = converterSillyTavernKnowledgeBaseToTrance(json as unknown as SillyTavernWorldBook);
		return knowledgeBase;
	}catch(error){
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: pickerKnowledgeBase");
	}
}