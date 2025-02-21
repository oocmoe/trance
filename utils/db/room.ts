import { room } from '@/db/schema/room';
import { useDB } from '@/hook/db';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';
import { readCharacterById } from './character';
import { createMessage } from './message';

const db = useDB();

/**
 * 创建对话房间
 * @param id 
 * @param name 
 * @param prologueIndex 
 * @returns 
 */
export async function createDialogRoom(
  id: number,
  name: string,
  prologueIndex?: number
) {
  const character = await readCharacterById(id)
  if(!character) return
  try {
    const roomRows = await db.insert(room).values({
      global_id: uuidv7(),
      cover:character.cover,
      name: name,
      type: 'dialog',
      personnel: [String(id)],
    });
    if (!roomRows) return;
    if(prologueIndex){
      const id = roomRows.lastInsertRowId
      const content = character.prologue[prologueIndex].content
      const messageRows = await createMessage(id, 'text', 0, content, 'assistant')
    }
    return roomRows.lastInsertRowId;
  } catch (error) {
    console.log(error);
  }
}
