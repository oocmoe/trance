import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
	convertCharacter,
	convertCover,
	convertKnowledgeBase,
	convertPrompt,
	convertRegex,
	convertSillyTavernChatHistory,
} from "./convert";
import { decodeCharacter, decodeJson, decodeJsonl } from "./decode";

/**
 * 选择json
 * @returns
 */
export async function pickFileJson() {
	try {
		const result = await DocumentPicker.getDocumentAsync({
			type: ["application/json"],
		});
		if (result.canceled) return;
		return result;
	} catch (error) {
		console.log(error);
	}
}

/**
 * 选择jsonl
 * @returns
 */
export async function pickFileJsonl() {
	try {
		const result = await DocumentPicker.getDocumentAsync();
		if (result.canceled) return;
		if (!result.assets[0].name.endsWith(".jsonl"))
			throw new Error("非 jsonl 文件");
		return result;
	} catch (error) {
		console.log(error);
	}
}

/**
 * 选择png 图片
 * @returns
 */
export async function pickFilePng() {
	try {
		const result = await DocumentPicker.getDocumentAsync({
			type: ["image/png"],
		});
		console.log(result);
		if (!result.canceled) {
			return result.assets[0];
		}
	} catch (error) {
		console.log(error);
	}
}

/**
 * 选择角色卡封面
 * @returns 图片地址
 */
export async function pickUserAvatar() {
	try {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		console.log(result);
		if (!result.canceled) {
			return result.assets[0];
		}
	} catch (error) {
		console.log(error);
	}
}

/**
 * 选择角色卡封面
 * @returns 图片地址
 */
export async function pickCharacterCover() {
	try {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [3, 4],
			quality: 1,
		});
		console.log(result);
		if (!result.canceled) {
			return result.assets[0];
		}
	} catch (error) {
		console.log(error);
	}
}

/**
 * 选取PNG格式角色卡
 * @returns
 */
export async function pickCharacterPng() {
	try {
		const assets = await pickFilePng();
		if (!assets) return;
		const cover = await convertCover(assets.uri);
		const decodeResult = await decodeCharacter(assets.uri);
		if (!decodeResult || !cover) return;
		const result = await convertCharacter(decodeResult, cover);
		if (!result) return;
		return {
			firstArchived: JSON.stringify(decodeResult),
			...result,
		};
	} catch (error) {
		console.log(error);
	}
}

export async function pickPrompt() {
	try {
		const assets = await pickFileJson();
		if (!assets || !assets.assets || !assets.assets[0]?.uri) return;
		const json = await decodeJson(assets.assets[0].uri);
		if (!json) return;
		const convertedJson = await convertPrompt(json);
		if (!convertedJson) return;
		const prompt = {
			name: assets.assets[0].name,
			content: convertedJson,
			firstArchived: JSON.stringify(json),
		};
		return prompt;
	} catch (error) {
		console.log(error);
	}
}

export async function pickRegex() {
	try {
		const assets = await pickFileJson();
		if (!assets || !assets.assets || !assets.assets[0]?.uri) return;
		const json = await decodeJson(assets.assets[0].uri);
		if (!json) return;
		const result = await convertRegex(json);
		if (!result) return;
		const convertedJson = {
			firstArchived: JSON.stringify(json),
			...result,
		};
		return convertedJson;
	} catch (error) {
		console.log(error);
	}
}

export async function pickKnowledgeBase() {
	try {
		const assets = await pickFileJson();
		if (!assets || !assets.assets || !assets.assets[0]?.uri) {
			throw new Error("未选择文件");
		}
		const json = await decodeJson(assets.assets[0].uri);
		if (!json) {
			throw new Error("json文件解析失败");
		}
		const result = convertKnowledgeBase(json);
		return result;
	} catch (error) {
		console.log(error);
	}
}

export async function pickSillyTavernChatHistory() {
	try {
		const assets = await pickFileJsonl();
		if (!assets || !assets.assets || !assets.assets[0]?.uri) {
			throw new Error("取消选择");
		}
		const jsonl = await decodeJsonl(assets.assets[0].uri);
		const result = await convertSillyTavernChatHistory(jsonl);
		return result;
	} catch (error) {
		console.log(error);
	}
}
