import { regex } from '@/db/schema/regex';
import { useDB } from '@/hook/db';
import { ConvertRgexResult } from '@/types/result';
import { eq, inArray } from 'drizzle-orm';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';

// 初始化数据库
const db = useDB();

export async function createImportRegex(name: string, request: ConvertRgexResult) {
  try {
    const rows = await db.insert(regex).values({
      global_id: uuidv7(),
      name: name,
      replace: request.replace,
      placement: request.placement,
      is_Enabled: request.is_Enabled,
      is_Global: request.is_Global,
      is_Send: request.is_Send,
      is_Render: request.is_Render
    });
    if (!rows) return;
    return rows.lastInsertRowId;
  } catch (error) {
    console.log(error);
  }
}

export async function readRegexById(id: number) {
  try {
    const rows = await db.select().from(regex).where(eq(regex.id, id));
    if (!rows) return;
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

export async function readRegexByIdGroup(id: number[]) {
  try {
    const rows = await db.select().from(regex).where(inArray(regex.id, id));
    if (!rows) return;
    return rows;
  } catch (error) {
    console.log(error);
  }
}
