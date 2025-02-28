import { Room } from '@/db/schema/room';
import { tranceHiGemini } from './gemini';

export async function tranceHi(content: string, type: string, room: Room) {
  if (!room.model || room.personnel.length === 0) return;
  const options = {
    roomId: room.id,
    promptId: room.prompt,
    personnel: room.personnel,
    model: room.model.model,
    model_version: room.model.version
  };
  if (options.model === 'Gemini') {
    if (type === 'text') {
      const result = await tranceHiGemini(options);
      if (!result) return;
      return result;
    }
  }
}
