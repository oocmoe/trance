import { drizzle } from "drizzle-orm/expo-sqlite/driver";
import { openDatabaseSync } from "expo-sqlite";
import {
	type CharacterTable,
	characterTable,
	knowledgeBaseRelationTable,
	type KnowledgeBaseTable,
	knowledgeBaseTable,
	type KnowledgeBaseTableInsert,
	type KnowledgeEntryTable,
	knowledgeEntryTable,
	type KnowledgeEntryTableInsert,
	type PromptGroupTable,
	promptGroupTable,
	type PromptTable,
	promptTable,
	type RegexGroupTable,
	regexGroupTable,
	type RegexGroupTableInsert,
	regexRelationTable,
	type RegexTable,
	regexTable,
	type RegexTableInsert,
	roomFloorTable,
	type RoomMessageTable,
	roomMessageTable,
	type RoomMessageTableInsert,
	type RoomOptionTable,
	roomOptionTable,
	roomTable,
} from "./schema";
import { Storage } from "expo-sqlite/kv-store";
import { eq, inArray, desc, and, or, sql, lte, exists, lt } from "drizzle-orm";
import { TRANCE_THEME_PROFILE_DEFAULT } from "@/constant/theme/default";
import type { TranceHi } from "@/types/trance.types";
import { union } from "drizzle-orm/sqlite-core";

// trance.db Expo Sqlite
export const db = drizzle(openDatabaseSync("trance.db", { enableChangeListener: true }));

/**
 * Character
 */
export async function createCharacterImport(data: CharacterImportDataPreview) {
	try {
		const rows = await db.transaction(async (tx) => {
			const characterRows = await tx.insert(characterTable).values(data.character);
			if (data.knowledgeBase?.length) {
				const knowledgeBaseRows = await tx.insert(knowledgeBaseTable).values({
					name: data.character.name,
					creator: data.character.creator,
					version: data.character.version,
					is_enabled: true,
				});

				await tx.insert(knowledgeEntryTable).values(
					data.knowledgeBase.map((entry) => ({
						knowledge_base_id: knowledgeBaseRows.lastInsertRowId,
						...entry,
					})),
				);
				await tx.insert(knowledgeBaseRelationTable).values({
					character_id: characterRows.lastInsertRowId,
					knowledge_base_id: knowledgeBaseRows.lastInsertRowId,
				});
			}
			if (data.regex?.length) {
				const regexGroupRows = await tx.insert(regexGroupTable).values({
					name: data.character.name,
					creator: data.character.creator,
					version: data.character.version,
					type: "character",
					is_enabled: true,
				});
				await tx.insert(regexTable).values(
					data.regex.map((regex) => ({
						regex_group_id: regexGroupRows.lastInsertRowId,
						...regex,
					})),
				);
				await tx.insert(regexRelationTable).values({
					character_id: characterRows.lastInsertRowId,
					regex_group_id: regexGroupRows.lastInsertRowId,
				});
			}
			return characterRows;
		});
		return rows.lastInsertRowId;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: createCharacterImport");
	}
}

export async function readCharacterById(id: number) {
	try {
		const rows = await db.select().from(characterTable).where(eq(characterTable.id, id));
		return rows[0];
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readCharacterById");
	}
}

export async function deleteCharacterById(id: number) {
	try {
		const rows = await db.delete(characterTable).where(eq(characterTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: deleteCharacterById");
	}
}

/**
 * Room
 */

export async function createRoomNewPrivateChat(character: CharacterTable, prologueIndex?: number) {
	try {
		const defaultModel = await Storage.getItem("TRANCE_ROOM_DEFAULT_MODEL");
		const defaultPromptGroup = await Storage.getItem("TRANCE_ROOM_DEFAULT_PROMPTGROUP");
		const defaultTheme = await Storage.getItem("TRANCE_ROOM_DEFAULT_THEME");
		const rows = await db.transaction(async (tx) => {
			const roomRows = await tx.insert(roomTable).values({
				name: character.name,
				personnel: [character.id],
				cover: character.cover,
				type: "private",
			});
			if (roomRows.lastInsertRowId) {
				await tx.insert(roomOptionTable).values({
					room_id: roomRows.lastInsertRowId,
					model: JSON.parse(defaultModel ?? "{}") as {
						name: string;
						version: string;
					},
					prompt_group_id: Number(defaultPromptGroup),
					theme: defaultTheme ? JSON.parse(defaultTheme) : TRANCE_THEME_PROFILE_DEFAULT,
				});
				if (character.prologue) {
					const roomFloorRows = await tx.insert(roomFloorTable).values({
						room_id: roomRows.lastInsertRowId,
						character_id: character.id,
						is_sender: 0,
					});
					const roomMessageRows = await tx.insert(roomMessageTable).values(
						character.prologue.map((item) => ({
							room_floor_id: roomFloorRows.lastInsertRowId,
							role: "assistant" as const,
							type: "text" as const,
							content: item.content,
						})),
					);
					await tx
						.update(roomTable)
						.set({
							room_floor_sort: [roomFloorRows.lastInsertRowId],
						})
						.where(eq(roomTable.id, roomRows.lastInsertRowId));
					if (roomMessageRows) {
						const roomMessageIdRows = await tx
							.select({
								id: roomMessageTable.id,
							})
							.from(roomMessageTable)
							.where(eq(roomMessageTable.room_floor_id, roomFloorRows.lastInsertRowId));
						if (roomMessageIdRows.length > 0) {
							const sortedIds = roomMessageIdRows.map((item) => item.id);
							if (prologueIndex !== undefined && prologueIndex >= 0 && prologueIndex < sortedIds.length) {
								const [prologueItem] = sortedIds.splice(prologueIndex, 1);
								sortedIds.unshift(prologueItem);
							}

							await tx
								.update(roomFloorTable)
								.set({
									room_message_sort: sortedIds,
								})
								.where(eq(roomFloorTable.id, roomFloorRows.lastInsertRowId));
						}
					}
				}
			}
			return roomRows.lastInsertRowId;
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: createRoom");
	}
}

export async function deleteRoomById(id: number) {
	try {
		const rows = await db.delete(roomTable).where(eq(roomTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: deleteRoomById");
	}
}

/**
 * Room Message
 */

type CreateRoomNewMessageProps = {
	room_id: number;
	character_id?: number;
	type: "text" | "image";
	content: string;
	role: "user" | "assistant" | "system";
	is_sender: number;
};

export async function createRoomNewMessage(props: CreateRoomNewMessageProps) {
	try {
		const rows = await db.transaction(async (tx) => {
			const roomFloorRows = await tx.insert(roomFloorTable).values({
				character_id: props.character_id,
				room_id: props.room_id,
				is_sender: props.is_sender,
			});
			const roomMessageRows = await tx.insert(roomMessageTable).values({
				room_floor_id: roomFloorRows.lastInsertRowId,
				role: props.role,
				type: props.type,
				content: props.content,
			});
			await tx
				.update(roomTable)
				.set({
					room_floor_sort: [roomFloorRows.lastInsertRowId],
				})
				.where(eq(roomTable.id, props.room_id));
			await tx
				.update(roomFloorTable)
				.set({
					room_message_sort: [roomMessageRows.lastInsertRowId],
				})
				.where(eq(roomFloorTable.id, roomFloorRows.lastInsertRowId));
			return roomFloorRows.lastInsertRowId;
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: createRoomNewMessage");
	}
}

export async function createRoomFloorMessage(room_floor_id: number, data: RoomMessageTableInsert) {
	try {
		const rows = await db.transaction(async (tx) => {
			const roomFloorMessageRows = await tx.insert(roomMessageTable).values(data);
			const sort = await tx
				.select({
					room_message_sort: roomFloorTable.room_message_sort,
				})
				.from(roomFloorTable)
				.where(eq(roomFloorTable.id, room_floor_id));
			await tx
				.update(roomFloorTable)
				.set({
					room_message_sort: [roomFloorMessageRows.lastInsertRowId, ...sort[0].room_message_sort],
				})
				.where(eq(roomFloorTable.id, room_floor_id));
			return roomFloorMessageRows;
		});
		return rows.lastInsertRowId;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: createRoomMessage");
	}
}

export async function readRoomRenderMessage(hi: TranceHi) {
	try {
		if (hi.is_Respawn) {
		const rows = await db.transaction(async (tx) => {
			const roomFloorRows = await tx.select().from(roomFloorTable).where(
          and(
            eq(roomFloorTable.room_id, hi.room_id),
            lt(roomFloorTable.id, hi.room_floor_id as number)
          )
        );
			const messageId = roomFloorRows.map((item) => item.room_message_sort[0]);
			const roomMessageRows = await tx.select().from(roomMessageTable).where(inArray(roomMessageTable.id, messageId));
			return roomMessageRows;
		});
		return rows
		}

		const rows = await db.transaction(async (tx) => {
			const roomFloorRows = await tx.select().from(roomFloorTable).where(eq(roomFloorTable.room_id, hi.room_id));
			const messageId = roomFloorRows.map((item) => item.room_message_sort[0]);
			const roomMessageRows = await tx.select().from(roomMessageTable).where(inArray(roomMessageTable.id, messageId));
			return roomMessageRows;
		});
		return rows
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readRoomMessageById");
	}
}

export async function readRoomMessageRespawnUser(room_id: number, room_floor_id: number) {
	try {
		const rows = await db.transaction(async (tx) => {
			const roomFloorRows = await tx
				.select()
				.from(roomFloorTable)
				.where(
					and(
						eq(roomFloorTable.room_id, room_id),
						lt(roomFloorTable.id, room_floor_id),
						eq(roomFloorTable.is_sender, 1),
					),
				)
				.orderBy(desc(roomFloorTable.id))
				.limit(1);
			if (!roomFloorRows[0]) throw new Error("必须有前置用户消息");
			const roomMessageRows = await tx
				.select()
				.from(roomMessageTable)
				.where(eq(roomMessageTable.id, roomFloorRows[0].room_message_sort[0]));
			return roomMessageRows;
		});
		return rows[0];
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readRoomMessageRespawnUser");
	}
}

export async function readLatestRoomChatData() {
	try {
		const rows = await db.transaction(async (tx) => {
			const messageRows = await db
				.select({ id: roomFloorTable.room_id })
				.from(roomFloorTable)
				.orderBy(desc(roomFloorTable.updated_at))
				.limit(1);
			const messageId = messageRows[0].id;
			if (!messageId) return null;
			const roomRows = await db
				.select({ id: roomTable.id, cover: roomTable.cover })
				.from(roomTable)
				.where(eq(roomTable.id, messageId));

			return roomRows[0];
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readLatestRoomChatCover");
	}
}
export async function updateRoomFloorMessageField<K extends keyof RoomMessageTable>(
	id: number,
	field: K,
	value: RoomMessageTable[K],
) {
	try {
		const rows = await db
			.update(roomMessageTable)
			.set({ [field]: value })
			.where(eq(roomMessageTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updateRoomFloorMessageField");
	}
}

export async function updateRoomFloorMessageSort(room_floor_id: number, beforeIndex: number, afterIndex: number) {
	try {
		const rows = await db.transaction(async (tx) => {
			const [roomFloor] = await tx
				.select({ room_message_sort: roomFloorTable.room_message_sort })
				.from(roomFloorTable)
				.where(eq(roomFloorTable.id, room_floor_id))
				.limit(1);
			const newSort = [...roomFloor.room_message_sort];
			[newSort[beforeIndex], newSort[afterIndex]] = [newSort[afterIndex], newSort[beforeIndex]];
			const roomFloorRows = await tx
				.update(roomFloorTable)
				.set({ room_message_sort: newSort })
				.where(eq(roomFloorTable.id, room_floor_id));

			return roomFloorRows.changes;
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updatedRoomMessageSort");
	}
}

export async function updateRoomFloorMessagePagination(room_floor_id: number, direction: "next" | "previous") {
	try {
		const rows = await db.transaction(async (tx) => {
			const [roomFloor] = await tx
				.select({ room_message_sort: roomFloorTable.room_message_sort })
				.from(roomFloorTable)
				.where(eq(roomFloorTable.id, room_floor_id))
				.limit(1);
			let sort = roomFloor.room_message_sort;

			if (direction === "next") {
				if (sort && sort.length > 1) {
					const newSort = [...sort];
					const firstItem = newSort.shift();
					if (firstItem) {
						newSort.push(firstItem);
					}
					sort = newSort;
				}
			} else if (direction === "previous") {
				if (sort && sort.length > 1) {
					const newSort = [...sort];
					const lastItem = newSort.pop();
					if (lastItem) {
						newSort.unshift(lastItem);
					}
					sort = newSort;
				}
			}
			const roomFloorRows = await tx
				.update(roomFloorTable)
				.set({ room_message_sort: sort })
				.where(eq(roomFloorTable.id, room_floor_id));
			return roomFloorRows.changes;
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updatedRoomMessageSort");
	}
}

export async function deleteRoomFloorById(id: number) {
	try {
		const rows = await db.delete(roomFloorTable).where(eq(roomFloorTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: deleteRoomFloorById");
	}
}

/**
 * Room Options
 */

export async function updateRoomOptionField<K extends keyof RoomOptionTable>(
	id: number,
	field: K,
	value: RoomOptionTable[K],
) {
	try {
		const rows = await db
			.update(roomOptionTable)
			.set({ [field]: value })
			.where(eq(roomOptionTable.room_id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updateRoomOptionField");
	}
}

/**
 * Knowledge Base
 */
export async function createKnowledgeBaseImport(request: {
	knowledgeBase: KnowledgeBaseTableInsert;
	knowledgeEntry: Array<KnowledgeEntryTableInsert>;
}) {
	try {
		const rows = await db.transaction(async (tx) => {
			const knowledgeBaseRows = await tx.insert(knowledgeBaseTable).values(request.knowledgeBase);
			const knowledgeBaseEntryRows = await tx
				.insert(knowledgeEntryTable)
				.values(
					request.knowledgeEntry.map((item) => ({
						knowledge_base_id: knowledgeBaseRows.lastInsertRowId,
						...item,
					})),
				)
				.returning({ id: knowledgeEntryTable.id });
			await tx
				.update(knowledgeBaseTable)
				.set({
					knowledge_entry_sort: knowledgeBaseEntryRows.map((item) => item.id),
				})
				.where(eq(knowledgeBaseTable.id, knowledgeBaseRows.lastInsertRowId));
			return knowledgeBaseRows.lastInsertRowId;
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: createKnowledgeBaseImport");
	}
}

export async function readKnowledgeBaseTranceHi(hi: TranceHi) {
	try {
		const rows = await db.transaction(async (tx) => {
			const knowledgeBaseEntry = await tx
				.select()
				.from(knowledgeEntryTable)
				.where(
					and(
						eq(knowledgeEntryTable.is_enabled, true),
						inArray(
							knowledgeEntryTable.knowledge_base_id,
							union(
								tx
									.select({ id: knowledgeBaseTable.id })
									.from(knowledgeBaseTable)
									.where(and(eq(knowledgeBaseTable.type, "global"), eq(knowledgeBaseTable.is_enabled, true))),
								tx
									.select({ id: knowledgeBaseRelationTable.knowledge_base_id })
									.from(knowledgeBaseRelationTable)
									.where(inArray(knowledgeBaseRelationTable.character_id, hi.personnel)),
							),
						),
					),
				);

			return knowledgeBaseEntry;
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readKnowledgeBaseGroup");
	}
}

export async function updateKnowledgeBaseField<K extends keyof KnowledgeBaseTable>(
	id: number,
	field: K,
	value: KnowledgeBaseTable[K],
) {
	try {
		const rows = await db
			.update(knowledgeBaseTable)
			.set({ [field]: value })
			.where(eq(knowledgeBaseTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updateKnowledgeBaseField");
	}
}

export async function updateKnowledgeEntryField<K extends keyof KnowledgeEntryTable>(
	id: number,
	field: K,
	value: KnowledgeEntryTable[K],
) {
	try {
		const rows = await db
			.update(knowledgeEntryTable)
			.set({ [field]: value })
			.where(eq(knowledgeEntryTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updateKnowledgeEntryField");
	}
}

export async function deleteKnowledgeBase(id: number) {
	try {
		const rows = await db.delete(knowledgeBaseTable).where(eq(knowledgeBaseTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: deleteKnowledgeBase");
	}
}

/**
 * Prompt
 */

export async function createPromptImport(data: PromptImportDataPreview) {
	try {
		console.log(data);
		const rows = await db.transaction(async (tx) => {
			const promptGroupRows = await tx.insert(promptGroupTable).values({
				name: data.name,
				creator: data.creator,
				version: data.version,
				handbook: data.handbook,
			});

			if (promptGroupRows.lastInsertRowId) {
				const promptsWithContent = data.prompt.map((prompt) => ({
					...prompt,
					prompt_group_id: promptGroupRows.lastInsertRowId,
					content: prompt.content || "",
				}));

				await tx.insert(promptTable).values(promptsWithContent);
			}
			return promptGroupRows;
		});
		return rows.lastInsertRowId;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: createPromptImport");
	}
}

export async function readPromptGroupById(id: number) {
	try {
		const rows = await db.select().from(promptTable).where(eq(promptTable.id, id));
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readPromptGroupById");
	}
}

export async function readPromptWithCharacterMessageReady(hi: TranceHi) {
	try {
		const rows = await db
			.select()
			.from(promptTable)
			.where(and(eq(promptTable.prompt_group_id, hi.prompt_group_id as number), eq(promptTable.is_enabled, true)));
		return rows;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readPromptWithCharacterMessageReady",
		);
	}
}

export async function readPromptTranceHi(hi: TranceHi) {
	try {
		const rows = await db
			.select()
			.from(promptTable)
			.where(and(eq(promptTable.prompt_group_id, hi.prompt_group_id as number), eq(promptTable.is_enabled, true)));
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readPromptTranceHi");
	}
}

export async function updatePromptGroupField<K extends keyof PromptGroupTable>(
	id: number,
	field: K,
	value: PromptGroupTable[K],
) {
	try {
		const rows = await db
			.update(promptGroupTable)
			.set({ [field]: value })
			.where(eq(promptGroupTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updatePromptGroupField");
	}
}

export async function updatePromptField<K extends keyof PromptTable>(id: number, field: K, value: PromptTable[K]) {
	try {
		const rows = await db
			.update(promptTable)
			.set({ [field]: value })
			.where(eq(promptTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updatePromptField");
	}
}

export async function deletePromptGroup(id: number) {
	try {
		const rows = await db.delete(promptGroupTable).where(eq(promptGroupTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: deletePromptGroup");
	}
}

/**
 * Regex
 */

export async function createRegexGroup(data: RegexGroupTableInsert) {
	try {
		const rows = await db.insert(regexGroupTable).values(data);
		return rows.lastInsertRowId;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: createRegexGroup");
	}
}

export async function createRegex(id: number, data: RegexTableInsert) {
	try {
		const rows = await db.insert(regexTable).values(data);
		return rows.lastInsertRowId;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: createRegex");
	}
}

export async function readRegexWithSending(personnel: Array<number>) {
	try {
		const rows = await db.transaction(async (tx) => {
			const regexId = await tx
				.selectDistinct({
					id: regexGroupTable.id,
				})
				.from(regexGroupTable)
				.leftJoin(regexRelationTable, eq(regexGroupTable.id, regexRelationTable.prompt_group_id))
				.where(
					and(
						eq(regexGroupTable.is_enabled, true),
						or(
							eq(regexGroupTable.type, "global"),
							and(eq(regexGroupTable.type, "character"), inArray(regexRelationTable.character_id, personnel)),
						),
					),
				);
			const regexItem = await tx
				.select()
				.from(regexTable)
				.where(
					and(
						eq(regexTable.is_enabled, true),
						eq(regexTable.is_sending, true),
						inArray(
							regexTable.regex_group_id,
							regexId.map((item) => item.id),
						),
					),
				);
			return regexItem;
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readRegexWithSending");
	}
}

export async function readRegexWithTranceHiTextRender(character_id: number) {
	try {
		return await db.transaction(async (tx) => {
			const regexRecords = await tx
				.select()
				.from(regexTable)
				.where(
					and(
						eq(regexTable.is_enabled, true),
						or(
							exists(
								tx
									.select()
									.from(regexGroupTable)
									.where(
										and(
											eq(regexGroupTable.id, regexTable.regex_group_id),
											eq(regexGroupTable.is_enabled, true),
											eq(regexGroupTable.type, "global"),
										),
									),
							),
							exists(
								tx
									.select()
									.from(regexRelationTable)
									.where(
										and(
											eq(regexRelationTable.regex_group_id, regexTable.regex_group_id),
											eq(regexRelationTable.character_id, character_id),
										),
									),
							),
						),
					),
				);
			return regexRecords;
		});
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readRegexWithTranceHiTextRender");
	}
}

export async function readCharacterRegex(id: number) {
	try {
		const rows = await db
			.select({ regex_group_id: regexRelationTable.regex_group_id })
			.from(regexRelationTable)
			.where(eq(regexRelationTable.character_id, id));
		return rows[0].regex_group_id;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readCharacterRegex");
	}
}

export async function readCharacterKnowledgeBase(id: number) {
	try {
		const rows = await db
			.select({ knowledge_base_id: knowledgeBaseRelationTable.knowledge_base_id })
			.from(knowledgeBaseRelationTable)
			.where(eq(knowledgeBaseRelationTable.character_id, id));
		return rows[0].knowledge_base_id;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: readCharacterRegex");
	}
}

export async function updateRegexGroupField<K extends keyof RegexGroupTable>(
	id: number,
	field: K,
	value: RegexGroupTable[K],
) {
	try {
		const rows = await db
			.update(regexGroupTable)
			.set({ [field]: value })
			.where(eq(regexGroupTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updateRegexGroupFiled");
	}
}

export async function updateRegexField<K extends keyof RegexTable>(id: number, field: K, value: RegexTable[K]) {
	try {
		const rows = await db
			.update(regexTable)
			.set({ [field]: value })
			.where(eq(regexTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: updateRegexGroupFiled");
	}
}

export async function deleteRegexGroupById(id: number) {
	try {
		const rows = await db.delete(regexGroupTable).where(eq(regexGroupTable.id, id));
		return rows.changes;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: deleteRegexGroupById");
	}
}

export async function deleteRegex(id: number) {
	try {
		const rows = await db.transaction(async (tx) => {
			const regexGroupIdRows = await tx
				.select({ id: regexTable.regex_group_id })
				.from(regexTable)
				.where(eq(regexTable.id, id));
			const regexGroupSortRows = await tx
				.select({ regex_sort: regexGroupTable.regex_sort })
				.from(regexGroupTable)
				.where(eq(regexGroupTable.id, regexGroupIdRows[0].id));
			const sort = regexGroupSortRows[0].regex_sort;
			const sorted = sort.filter((item) => item !== id);
			await tx
				.update(regexGroupTable)
				.set({ regex_sort: sorted })
				.where(eq(regexGroupTable.id, regexGroupIdRows[0].id));
			const regexRows = await tx.delete(regexTable).where(eq(regexTable.id, id));
			return regexRows.changes;
		});
		return rows;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "!ERROR_TRANCE_FUNCTION: deleteRegexById");
	}
}
