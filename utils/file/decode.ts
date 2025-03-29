import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import text from "png-chunk-text";
import extract from "png-chunks-extract";

/**
 * 解码 角色卡
 * @param uri 临时文件地址
 */
export async function decodeCharacter(uri: string) {
	try {
		const fileBase64 = await FileSystem.readAsStringAsync(uri, {
			encoding: "base64",
		});
		const fileUint8Array = Buffer.from(fileBase64, "base64");
		const chunks = extract(fileUint8Array);
		const tEXtChunks = chunks.filter(
			(chunk: { name: string }) => chunk.name === "tEXt",
		);
		if (tEXtChunks.length === 0) {
			return;
		}
		const decodedText = text.decode(tEXtChunks[0].data)?.text;
		const character = JSON.parse(Buffer.from(decodedText, "base64").toString());
		return character;
	} catch (error) {
		console.log(error);
	}
}

/**
 * 解码JSON，返回json内容
 * @param uri
 * @returns
 */
export async function decodeJson(uri: string) {
	try {
		const fileBase64 = await FileSystem.readAsStringAsync(uri, {
			encoding: "base64",
		});
		const json = JSON.parse(Buffer.from(fileBase64, "base64").toString());
		return json;
	} catch (error) {
		console.log(error);
	}
}

export async function decodeJsonl(uri: string) {
	try {
		const fileContent = await FileSystem.readAsStringAsync(uri, {
			encoding: FileSystem.EncodingType.UTF8,
		});
		return fileContent;
	} catch (error) {
		console.log(error);
		throw new Error("解码 jsonl 文件失败");
	}
}
