// db/schema/kb.ts
import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const knowledgeBase = sqliteTable("knowledgeBase", {
  /**
   * trance 核心字段 不做对外兼容
   * 知识库 Knowledge base = 世界书WorldBook
   */

  // 知识库 ID (主键，自增)
  id: integer("id").primaryKey({ autoIncrement: true }),

  // 知识库全局唯一标识 uuidv7
  global_id: text("global_id").$type<string>().unique().notNull(),

  // 创建时间（毫秒级）— 使用整数类型存储时间戳
  created_at: integer("created_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 更新时间（毫秒级）— 使用整数类型存储时间戳
  updated_at: integer("updated_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 知识库名称
  name: text("name").$type<string>().notNull(),

  // 知识库作者
  ceator: text("creator").$type<string>(),

  // 知识库版本
  version: text("version").$type<string>(),

  // 知识库使用说明
  handbook: text("handbook").$type<string>(),

  // 知识库条目
  entries: text("entries", { mode: "json" })
    .$type<KnowledgeBaseEntry[]>()
    .notNull(),

  // 是否全局启用
  is_Enabled: integer({ mode: "boolean" }).notNull().default(false),

  // 首次存档内容
  firstArchived: text("firstArchived", { mode: "json" })
    .$type<string>()
    .notNull(),
});

export type KnowledgeBaseEntry = {
  id: number;
  name: string;
  trigger: "key" | "always";
  keywords: string[];
  content: string;
  is_Enable: boolean;
};

export type KnowledgeBase = InferSelectModel<typeof knowledgeBase>;
export type InsertKnowledgeBase = InferInsertModel<typeof knowledgeBase>;
