import { type Character, character } from "@/db/schema/character";
import { knowledgeBase } from "@/db/schema/knowledgeBase";
import { regex } from "@/db/schema/regex";
import { room } from "@/db/schema/room";
import { useDB } from "@/hook/db";
import type { ConvertCharacterResult } from "@/types/result";
import { and, eq } from "drizzle-orm";
import "react-native-get-random-values";
import { v7 as uuidv7 } from "uuid";

const db = useDB();

/**
 * 新增角色卡
 * @param name
 * @param cover base64图片地址
 * @returns
 */
export async function createCharacter(name: string, cover: string) {
	try {
		const rows = await db.insert(character).values({
			global_id: uuidv7(),
			name: name,
			cover: cover,
			firstArchived: "",
		});
		if (!rows) return;
		return rows.lastInsertRowId;
	} catch (error) {
		console.log(error);
	}
}

/**
 * 根据Id 读取角色卡
 * @param id
 * @returns
 */
export async function readCharacterById(id: number) {
	try {
		const rows = await db.select().from(character).where(eq(character.id, id));
		if (!rows) return;
		return rows[0];
	} catch (error) {
		console.log(error);
	}
}

/**
 * 根据Id 读取角色卡字段
 * @param id
 * @param field
 */
export async function readCharacterFieldById(
	id: number,
	field: keyof Character,
) {
	try {
		const rows = await db
			.select({
				[field]: character[field],
			})
			.from(character)
			.where(eq(character.id, id));
		if (!rows) return;
		return rows[0][field];
	} catch (error) {
		console.log(error);
	}
}

/**
 * 插入角色卡数
 * @param data
 */
export async function createImportCharacter(data: ConvertCharacterResult) {
	try {
		const characterRows = await db.insert(character).values({
			...data.character,
			firstArchived: data.firstArchived,
		});
		if (!characterRows) throw new Error("导入角色卡失败");
		if (data.knowledgeBase) {
			const knowledgeBaseRows = await db.insert(knowledgeBase).values({
				global_id: uuidv7(),
				name: data.character.name,
				entries: data.knowledgeBase,
				firstArchived: data.firstArchived,
			});
			if (!knowledgeBaseRows) throw new Error("导入知识库失败");
		}
		if (data.regex) {
			const regexData = data.regex.map((item) => {
				return {
					...item,
					global_id: uuidv7(),
				};
			});
			const regexRows = await db.insert(regex).values(regexData);
			if (!regexRows) throw new Error("导入正则脚本失败");
		}
		return characterRows;
	} catch (error) {
		console.log(error);
	}
}

export async function updateCharacterFiledById(
	id: number,
	field: keyof Character,
	value: Character[keyof Character],
) {
	try {
		const rows = await db
			.update(character)
			.set({
				[field]: value,
			})
			.where(eq(character.id, id));
		return rows.changes;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

/**
 * 删除角色卡，同时删除角色卡对应的聊天
 * @param id
 * @returns
 */
export async function deleteCharacter(id: number) {
	try {
		const result = await db.transaction(async (tx) => {
			const roomRows = await tx
				.delete(room)
				.where(and(eq(room.type, "dialog"), eq(room.personnel, [String(id)])));
			if (!roomRows) throw new Error("删除聊天时发生错误");
			const characterRows = await tx
				.delete(character)
				.where(eq(character.id, id));
			if (!characterRows) throw new Error("删除角色卡时发生错误");
			return characterRows.changes;
		});
		return result;
	} catch (error) {
		throw new Error("删除角色卡时发生未知错误");
	}
}
