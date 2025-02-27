import { Room } from '@/db/schema/room';
import { tranceHiGemini } from './gemini';

export async function tranceHi(content: string, type: string, room: Room) {
  if (!room.model || room.personnel.length === 0) return;
  const options = {
    model: room.model.version
  };
  if (room.model.model === 'Gemini') {
    if (type === 'text') {
      const result = await tranceHiGemini(options);
      if (!result) return;
      return result;
    }
  }
}
