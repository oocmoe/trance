// db/schema/regex.ts
import { InferSelectModel, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const regex = sqliteTable('regex', {
  /**
   * trance 核心字段 不做对外兼容
   */

  // 正则 ID (主键，自增)
  id: integer('id').primaryKey({ autoIncrement: true }),

  // 正则全局唯一标识 uuidv7
  global_id: text('global_id').$type<string>().unique().notNull(),

  // 创建时间（毫秒级）— 使用整数类型存储时间戳
  created_at: integer('created_at')
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 更新时间（毫秒级）— 使用整数类型存储时间戳
  updated_at: integer('updated_at')
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 正则名称
  name: text('name').$type<string>().notNull(),

  // 查找
  replace: text('replace').$type<string>().notNull(),

  // 替换
  placement: text('placement').$type<string>().notNull().default(''),

  // 是否启用
  is_Enabled: integer({ mode: 'boolean' }).notNull().default(false),

  // 是否全局
  is_Global: integer({ mode: 'boolean' }).notNull().default(false),

  // 发送时触发
  is_Send: integer({ mode: 'boolean' }).notNull().default(false),

  // 显示时触发
  is_Render: integer({ mode: 'boolean' }).notNull().default(false)
});

export type Regex = InferSelectModel<typeof regex>;
