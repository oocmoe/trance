import { type Character, character } from "@/db/schema/character";
import { knowledgeBase } from "@/db/schema/knowledgeBase";
import { useDB } from "@/hook/db";
import type { ConvertCharacterResult } from "@/types/result";
import { eq } from "drizzle-orm";
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
      console.log(1);
      const knowledgeBaseRows = await db.insert(knowledgeBase).values({
        global_id: uuidv7(),
        name: data.character.name,
        entries: data.knowledgeBase,
        firstArchived: data.firstArchived,
      });
      if (!knowledgeBaseRows) throw new Error("导入知识库失败");
    }
    return characterRows;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 删除角色卡
 * @param id
 * @returns
 */
export async function deleteCharacter(id: number) {
  try {
    const rows = await db.delete(character).where(eq(character.id, id));
    if (!rows) return;
    return rows.changes;
  } catch (error) {
    console.log(error);
  }
}
