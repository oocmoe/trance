import { type Room, room } from "@/db/schema/room";
import { useDB } from "@/hook/db";
import { eq } from "drizzle-orm";
import "react-native-get-random-values";
import { v7 as uuidv7 } from "uuid";
import { readCharacterById } from "./character";
import { createMessage } from "./message";

const db = useDB();

/**
 * 创建对话房间
 * @param id
 * @param name
 * @param prologueIndex
 * @returns
 */
export async function createDialogRoom(
	id: number,
	name: string,
	prologueIndex?: number,
) {
	const character = await readCharacterById(id);
	if (!character) return;
	try {
		const personnel = [];
		personnel.push(String(id));
		const roomRows = await db.insert(room).values({
			global_id: uuidv7(),
			cover: character.cover,
			name: name,
			type: "dialog",
			personnel: personnel,
		});
		if (!roomRows) return;
		if (prologueIndex) {
			const content = character.prologue[prologueIndex].content;
			const messageRows = await createMessage(
				roomRows.lastInsertRowId,
				"text",
				0,
				content,
				"assistant",
			);
		}
		return roomRows.lastInsertRowId;
	} catch (error) {
		console.log(error);
	}
}

/**
 * 根据id 查询房间内容
 * @param id
 * @returns
 */
export async function readRoomById(id: number) {
	const rows = await db.select().from(room).where(eq(room.id, id));
	if (!rows) return;
	return rows[0];
}

export async function readRoomFieldById(id: number, field: keyof Room) {
	try {
		const rows = await db
			.select({
				[field]: room[field],
			})
			.from(room)
			.where(eq(room.id, id));
		if (!rows) return;
		return rows[0][field];
	} catch (error) {
		console.log(error);
	}
}

/**
 * 根据id 更新房间字段
 * @param id
 * @param field
 * @param value
 * @returns
 */
export async function updateRoomFieldById(
	id: number,
	field: string,
	value: any,
) {
	const rows = await db
		.update(room)
		.set({
			[field]: value,
		})
		.where(eq(room.id, id));
	if (!rows) return;
	return rows;
}
