import { message } from '@/db/schema/message';
import { useDB } from '@/hook/db';
import { eq } from 'drizzle-orm';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';

const db = useDB();

/**
 * 创建消息
 * @param room_id
 * @param type
 * @param is_Sender
 * @param content
 * @param role
 * @returns
 */
export async function createMessage(
  room_id: number,
  type: 'text',
  is_Sender: number,
  content: string,
  role: 'assistant' | 'user' | 'system'
) {
  try {
    const rows = await db.insert(message).values({
      global_id: uuidv7(),
      room_id: room_id,
      type: type,
      is_Sender: is_Sender,
      content: content,
      role: role
    });
    if (!rows) return;
    return rows.lastInsertRowId;
  } catch (error) {
    console.log(error);
  }
}

export async function readHistroyMessage(roomId: number) {
  try {
    const rows = await db
      .select({
        id: message.id,
        role: message.role,
        content: message.content
      })
      .from(message)
      .where(eq(message.room_id, roomId));
    if (!rows) return;
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteMessageById(id: number) {
  try {
    const rows = await db.delete(message).where(eq(message.id, id));
    if (!rows) return;
    return rows.changes;
  } catch (error) {
    console.log(error);
  }
}
