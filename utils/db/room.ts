import { room } from '@/db/schema/room';
import { useDB } from '@/hook/db';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';

const db = useDB();

export async function createDialogRoom(
  id: number,
  name: string,
  cover: string,
  prologueIndex?: number
) {
  try {
    const rows = await db.insert(room).values({
      global_id: uuidv7(),
      name: name,
      cover: cover,
      type: 'dialog',
      personnel: [id]
    });
    if (!rows) return;
    return rows.lastInsertRowId;
  } catch (e) {
    console.log(e);
  }
}
