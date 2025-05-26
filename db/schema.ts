/**
 * trance db schema
 * some like @TavernCardV2: https://github.com/malfoyslastname/character-card-spec-v2
 */

import type { TranceRoomTheme } from "@/types/trance.types";
import { type InferInsertModel, type InferSelectModel, not, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Character Table
 */
export const characterTable = sqliteTable("character", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// name @TavernCardV2:[name|data.name]
	name: text("name").$type<string>().notNull(),

	// cover
	cover: text("cover").$type<string>(),

	// creator @TavernCardV2:[data.creator]
	creator: text("creator").$type<string>(),

	// version @TavernCardV2:[data.character_version]
	version: text("version").$type<string>(),

	// handbook @TavernCardV2:[data.creator_notes]
	handbook: text("handbook").$type<string>(),

	// description @TavernCardV2:[description|data.description]
	description: text("description").$type<string>(),

	// personality @TavernCardV2:[personality|data.personality]
	personality: text("personality").$type<string>(),

	// scenario @TavernCardV2:[scenario|data.scenario]
	scenario: text("scenario").$type<string>(),

	// prologue @TavernCardV2:[first_mes + alternate_greetings]
	prologue: text("prologue", { mode: "json" }).$type<CharacterPrologue>(),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" }).default(sql`(unixepoch() * 1000)`).$type<number>(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" }).default(sql`(unixepoch() * 1000)`).$type<number>(),
});

type CharacterPrologue = Array<{
	title: string;
	content: string;
}>;

/**
 * Room Table
 */
export const roomTable = sqliteTable("room", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// name
	name: text("name").$type<string>().notNull(),

	// cover
	cover: text("cover").$type<string>(),

	// type
	type: text("type").$type<"private" | "group">().notNull(),

	// room_floor_sort
	room_floor_sort: text("room_floor_sort", { mode: "json" }).$type<Array<number>>().notNull().default([]),

	// personnel
	personnel: text("personnel", { mode: "json" }).$type<Array<number>>().default([]).notNull(),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Room Option Table
 */
export const roomOptionTable = sqliteTable("room_option", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// room_id
	room_id: integer("room_id")
		.references(() => roomTable.id, { onDelete: "cascade" })
		.$type<number>(),

	// prompt_id
	prompt_group_id: integer("prompt_group_id").references(() => promptGroupTable.id, { onDelete: "set null" }),

	// model
	model: text("model", { mode: "json" }).$type<{
		name: string;
		version: string;
	}>(),

	// theme
	theme: text("theme", { mode: "json" }).$type<TranceRoomTheme>().notNull(),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Room Floor Table
 */
export const roomFloorTable = sqliteTable("room_floor", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// room_id
	room_id: integer("room_id")
		.references(() => roomTable.id, { onDelete: "cascade" })
		.$type<number>(),

	// character_id
	character_id: integer("character_id")
		.references(() => characterTable.id, { onDelete: "set null" })
		.$type<number>(),

	// room_message_sort
	room_message_sort: text("room_message_sort", { mode: "json" }).$type<Array<number>>().notNull().default([]),

	// is_sender 0:assistant 1:user 2:system
	is_sender: integer("is_sender").$type<number>(),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Room Message Table
 */
export const roomMessageTable = sqliteTable("room_message", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// room_floor_id
	room_floor_id: integer("room_floor_id")
		.references(() => roomFloorTable.id, { onDelete: "cascade" })
		.$type<number>(),

	// type
	type: text("type").$type<"text" | "image">(),

	// role
	role: text("role").$type<"user" | "assistant" | "system">().notNull(),

	// content
	content: text("content").$type<string>().notNull(),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * KnowledgeBase Table
 */
export const knowledgeBaseTable = sqliteTable("knowledge_base", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// name
	name: text("name").$type<string>().notNull(),

	// type
	type: text("type").$type<"character" | "global">(),

	// creator
	creator: text("creator").$type<string>(),

	// version
	version: text("version").$type<string>(),

	// handbook
	handbook: text("handbook").$type<string>(),

	// knowledge_entry_sort
	knowledge_entry_sort: text("knowledge_entry_sort", { mode: "json" }).$type<Array<number>>().notNull().default([]),

	// is_enabled
	is_enabled: integer("is_enabled", { mode: "boolean" }).$type<boolean>().notNull().default(false),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Knowledge Entry Table
 */
export const knowledgeEntryTable = sqliteTable("knowledge_entry", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// knowledge_base_id
	knowledge_base_id: integer("knowledge_base_id")
		.references(() => knowledgeBaseTable.id, { onDelete: "cascade" })
		.$type<number>(),

	// name
	name: text("name").$type<string>().notNull(),

	// trigger
	trigger: text("trigger").$type<"keyword" | "always">(),

	// keywords
	keywords: text("keywords", { mode: "json" }).$type<Array<string>>(),

	// content
	content: text("content").$type<string>(),

	// depth
	depth: integer("depth").$type<number>(),

	// is_enabled
	is_enabled: integer("is_enabled", { mode: "boolean" }).$type<boolean>().notNull().default(false),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Knowledge Base Relation Table
 */
export const knowledgeBaseRelationTable = sqliteTable("knowledge_base_relation", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	//
	knowledge_base_id: integer("knowledge_base_id")
		.references(() => regexTable.id, { onDelete: "cascade" })
		.$type<number>()
		.notNull(),

	character_id: integer("character_id")
		.references(() => characterTable.id, { onDelete: "cascade" })
		.$type<number>(),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Regex Group Table
 */
export const regexGroupTable = sqliteTable("regex_group", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// type
	type: text("type").$type<"character" | "global">().notNull(),

	// name
	name: text("name").$type<string>().notNull(),

	// creator
	creator: text("creator").$type<string>(),

	// version
	version: text("version").$type<string>(),

	// handbook
	handbook: text("handbook").$type<string>(),

	// regex_sort
	regex_sort: text("regex_sort", { mode: "json" }).$type<Array<number>>().notNull().default([]),

	// is_enabled
	is_enabled: integer("is_enabled", { mode: "boolean" }).$type<boolean>().notNull().default(false),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Regex Table
 */
export const regexTable = sqliteTable("regex", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// regex_group_id
	regex_group_id: integer("regex_group_id")
		.references(() => regexGroupTable.id, { onDelete: "cascade" })
		.$type<number>()
		.notNull(),

	// name
	name: text("name").$type<string>().notNull(),

	// handbook
	handbook: text("handbook").$type<string>(),

	// replace
	replace: text("replace").$type<string>(),

	// placement
	placement: text("placement").$type<string>(),

	// is_enabled
	is_enabled: integer("is_enabled", { mode: "boolean" }).$type<boolean>().notNull().default(false),

	// is_sending
	is_sending: integer("is_sending", { mode: "boolean" }).$type<boolean>().notNull().default(false),

	// is_render
	is_render: integer("is_render", { mode: "boolean" }).$type<boolean>().notNull().default(false),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Regex Relation Table
 */
export const regexRelationTable = sqliteTable("regex_relation", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	//
	regex_group_id: integer("regex_group_id")
		.references(() => regexTable.id, { onDelete: "cascade" })
		.$type<number>()
		.notNull(),

	character_id: integer("character_id")
		.references(() => characterTable.id, { onDelete: "cascade" })
		.$type<number>(),

	prompt_group_id: integer("prompt_group_id")
		.references(() => promptGroupTable.id, { onDelete: "cascade" })
		.$type<number>(),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Prompt Group Table
 */
export const promptGroupTable = sqliteTable("prompt_group", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// name
	name: text("name").$type<string>().notNull(),

	// creator
	creator: text("creator").$type<string>(),

	// version
	version: text("version").$type<string>(),

	// handbook
	handbook: text("handbook").$type<string>(),

	// prompt_sort
	prompt_sort: text("prompt_sort", { mode: "json" }).$type<Array<number>>().notNull().default([]),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Prompt Table
 */
export const promptTable = sqliteTable("prompt", {
	// id
	id: integer("id").primaryKey({ autoIncrement: true }).$type<number>(),

	// prompt_group_id
	prompt_group_id: integer("prompt_group_id")
		.references(() => promptGroupTable.id, { onDelete: "cascade" })
		.$type<number>()
		.notNull(),

	// name
	name: text("name").$type<string>().notNull(),

	// role
	role: text("role").$type<"system" | "user" | "assistant">().notNull(),

	// content
	content: text("content").$type<string>().notNull(),

	// is_enabled
	is_enabled: integer("is_enabled", { mode: "boolean" }).$type<boolean>().notNull().default(false),

	// created_at
	created_at: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),

	// updated_at
	updated_at: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.$type<number>()
		.notNull(),
});

/**
 * Export Table Type
 */
export type CharacterTable = InferSelectModel<typeof characterTable>;
export type RoomTable = InferSelectModel<typeof roomTable>;
export type RoomFloorTable = InferSelectModel<typeof roomFloorTable>;
export type RoomOptionTable = InferSelectModel<typeof roomOptionTable>;
export type RoomMessageTable = InferSelectModel<typeof roomMessageTable>;
export type RoomMessageTableInsert = InferInsertModel<typeof roomMessageTable>;
export type KnowledgeBaseTable = InferSelectModel<typeof knowledgeBaseTable>;
export type KnowledgeBaseTableInsert = InferInsertModel<typeof knowledgeBaseTable>;
export type KnowledgeEntryTable = InferSelectModel<typeof knowledgeEntryTable>;
export type KnowledgeEntryTableInsert = InferInsertModel<typeof knowledgeEntryTable>;
export type PromptTable = InferSelectModel<typeof promptTable>;
export type PromptGroupTable = InferSelectModel<typeof promptGroupTable>;
export type RegexGroupTable = InferSelectModel<typeof regexGroupTable>;
export type RegexGroupTableInsert = InferInsertModel<typeof regexGroupTable>;
export type RegexTable = InferSelectModel<typeof regexTable>;
export type RegexTableInsert = InferInsertModel<typeof regexTable>;
