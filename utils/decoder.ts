import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import text from "png-chunk-text";
import extract from "png-chunks-extract";

export async function decoderCharacterPNG(uri: string) {
	try {
		const fileBase64 = await FileSystem.readAsStringAsync(uri, {
			encoding: "base64",
		});
		const fileUint8Array = Buffer.from(fileBase64, "base64");
		const chunks = extract(fileUint8Array);
		const tEXtChunks = chunks.filter((chunk: { name: string }) => chunk.name === "tEXt");
		const decodedText = text.decode(tEXtChunks[0].data)?.text;
		const character = JSON.parse(Buffer.from(decodedText, "base64").toString());
		return character;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: decoderCharacterPNG");
	}
}

export async function decoderJSON(uri: string) {
	try {
		const fileBase64 = await FileSystem.readAsStringAsync(uri, {
			encoding: "base64",
		});
		const json = JSON.parse(Buffer.from(fileBase64, "base64").toString());
		return json as string;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: decodeerJSON");
	}
}
