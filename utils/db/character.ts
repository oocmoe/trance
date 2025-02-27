import { character, InsertCharacter } from '@/db/schema/character';
import { useDB } from '@/hook/db';
import { eq } from 'drizzle-orm';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';

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
      cover: cover
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
 * 插入角色卡数
 * @param data
 */
export async function createImportCharacter(data: InsertCharacter) {
  try {
    const rows = await db.insert(character).values({
      ...data
    });
    if (!rows) return;
    return rows.lastInsertRowId;
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
