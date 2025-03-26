import {
  type KnowledgeBase,
  type KnowledgeBaseEntry,
  knowledgeBase,
} from "@/db/schema/knowledgeBase";
import { useDB } from "@/hook/db";
import type { ConvertKnowledgeBaseResult } from "@/types/result";
import { eq } from "drizzle-orm";
import "react-native-get-random-values";
import { v7 as uuidv7 } from "uuid";

const db = useDB();
export async function createImportKnowledgeBase(
  name: string,
  request: ConvertKnowledgeBaseResult,
) {
  try {
    const rows = await db.insert(knowledgeBase).values({
      global_id: uuidv7(),
      name: name,
      is_Enabled: false,
      entries: request.entries,
      firstArchived: request.firstArchived,
    });
    if (!rows) return;
    return rows.lastInsertRowId;
  } catch (error) {
    console.log(error);
  }
}

export async function readKnowLedgeBaseField(
  id: number,
  field: keyof KnowledgeBase,
) {
  try {
    const rows = await db
      .select({
        [field]: knowledgeBase[field],
      })
      .from(knowledgeBase)
      .where(eq(knowledgeBase.id, id));
    if (!rows) return;
    return rows[0];
  } catch (error) {}
}

export async function readIsEnableKnowledgeBase() {
  try {
    const rows = await db
      .select()
      .from(knowledgeBase)
      .where(eq(knowledgeBase.is_Enabled, true));
    return rows;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("读取全局世界书失败");
  }
}

export async function updateKnowledgeBaseEntriesFiled<
  T extends keyof KnowledgeBaseEntry,
>(id: number, entryId: number, field: T, value: KnowledgeBaseEntry[T]) {
  try {
    const result = await readKnowLedgeBaseField(id, "entries");
    if (!result) return;
    const entries = result.entries as KnowledgeBaseEntry[];
    const updatedEntries = entries.map((item) => {
      if (item.id === entryId) {
        item[field] = value;
      }
      return item;
    });
    const rows = await db
      .update(knowledgeBase)
      .set({
        entries: updatedEntries,
      })
      .where(eq(knowledgeBase.id, id));
    if (!rows) return;
    return rows.changes;
  } catch (error) {
    console.log(error);
  }
}
