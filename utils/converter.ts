import { type KnowledgeBaseTableInsert, KnowledgeEntryTable, type KnowledgeEntryTableInsert, RegexTableInsert } from "@/db/schema";
import * as ImageManipulator from "expo-image-manipulator";

export async function converterImageToWebpBase64(uri: string) {
	try {
		const manipulated = await ImageManipulator.manipulateAsync(uri, [], {
			format: ImageManipulator.SaveFormat.WEBP,
			base64: true,
			compress: 1,
		});
		const cover = `data:image/webp;base64,${manipulated.base64}`;
		return cover;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: converterImageToWebpBase64");
	}
}

/**
 * Converter Character Data To trance
 * @param characterJson
 * @param cover
 * @returns
 */
export async function converterCharacterDataToTrance(characterJson: any, cover: string) {
	try {
		// Spec V2
		if (characterJson.spec === "chara_card_v2") {
			const result = await coverterCharacterTavernCardV2(characterJson, cover);
			return result;
		}
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: converterCharacterDataToTrance");
	}
}

/**
 *
 */

async function coverterCharacterTavernCardV2(characterJson: TavernCardV2, cover: string) {
	try {
		const prologue = () => {
			const first_mes = {
				title: characterJson.data.first_mes.slice(0, 20),
				content: characterJson.data.first_mes,
			};
			const alternate_greetings = characterJson.data.alternate_greetings.map((item) => {
				return {
					title: item.slice(0, 20).replace(/\s+/g, ""),
					content: item,
				};
			});
			if (alternate_greetings.length > 0) {
				return [first_mes, ...alternate_greetings];
			}
			return Array(first_mes);
		};
		const character = {
			name: characterJson.data.name,
			cover: cover,
			creator: characterJson.data.creator,
			version: characterJson.data.character_version,
			handbook: characterJson.data.creator_notes,
			description: characterJson.data.description,
			personality: characterJson.data.personality,
			scenario: characterJson.data.scenario,
			prologue: prologue(),
		};

		// KnowledgeBase
		let knowledgeBase:
			| Array<{
					name: string;
					content: string;
					trigger: "always" | "keyword";
					keywords: string[];
					is_enabled: boolean;
			  }>
			| undefined;
		if (characterJson.data.character_book) {
			knowledgeBase = characterJson.data.character_book.entries.map((item) => {
				return {
					name: item.comment || "",
					content: item.content,
					trigger: item.constant ? "always" : "keyword",
					keywords: [...item.keys, ...(item.secondary_keys || [])],
					depth: item.extensions.depth,
					is_enabled: item.enabled,
				};
			});
		}

		let regex:
			| Array<{
					name: string;
					content: string;
					replace: string;
					placement: string;
					is_enabled: boolean;
					is_sending: boolean;
					is_render: boolean;
			  }>
			| undefined;

		if (characterJson.data.extensions.regex_scripts) {
			regex = characterJson.data.extensions.regex_scripts.map((item: any) => {
				return {
					name: item.scriptName,
					replace: item.findRegex,
					placement: item.replaceString,
					is_enabled: !item.disabled,
					is_sending: item.placement.includes(2) || false,
					is_render: item.placement.includes(1) || false,
				};
			});
		}

		const converData = {
			character: character,
			knowledgeBase: knowledgeBase,
			regex: regex,
		};

		return converData;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: coverterCharacterTavernCardV2");
	}
}

export async function converterSillyTavernPromptToTrance(promptJson: SillyTavernPrompt) {
	try {
		const order = promptJson.prompt_order.at(-1);
		if (!order?.order?.length) return [];
		const orderMap = new Map<string, number>();
		const isEnabledMap = new Map<string, boolean>();
		order.order.forEach((item, index) => {
			orderMap.set(item.identifier, index);
			isEnabledMap.set(item.identifier, item.enabled);
		});
		const processedPrompts = promptJson.prompts.map((item) => ({
			name: item.name,
			role: item.role || "system",
			content: item.content,
			identifier: item.identifier,
			isEnabled: isEnabledMap.get(item.identifier) ?? false,
		}));
		const sortedPrompts = processedPrompts.sort((a, b) => {
			const aOrder = orderMap.get(a.identifier) ?? Number.POSITIVE_INFINITY;
			const bOrder = orderMap.get(b.identifier) ?? Number.POSITIVE_INFINITY;
			return aOrder - bOrder;
		});
		return sortedPrompts.map((item) => ({
			name: item.name,
			role: item.role,
			content: item.content,
			is_enabled: item.isEnabled,
		}));
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: converterSillyTavernPrompt");
	}
}

export function converterSillyTavernRegexToTrance(regexJson: SillyTavernRegex) {
	const regex = {
		name: regexJson.scriptName,
		replace: regexJson.findRegex,
		placement: regexJson.replaceString,
		is_enabled: !regexJson.disabled,
		is_sending: regexJson.placement.includes(2) || false,
		is_render: regexJson.placement.includes(1) || false,
	};
	return regex;
}

export function converterSillyTavernKnowledgeBaseToTrance(data: SillyTavernWorldBook) {
	const knowledgeBase:KnowledgeBaseTableInsert = {
		name:data.originalData.name,
		type:"global",
		is_enabled:false,
	}
	const knowledgeEntry:KnowledgeEntryTableInsert[] = data.originalData.entries.map((item)=>{
		return {
			name: item.comment || "",
			content: item.content,
			trigger: item.constant ? "always" : "keyword",
			keywords: [...item.keys, ...(item.secondary_keys || [])],
			depth: item.extensions.depth,
			is_enabled: item.enabled,
		}
	})
	return {
		knowledgeBase: knowledgeBase,
		knowledgeEntry:	knowledgeEntry
	}
}