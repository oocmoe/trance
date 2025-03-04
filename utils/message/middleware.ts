import { Messages } from '@/db/schema/message';
import { Room } from '@/db/schema/room';
import { tranceHiGemini } from './gemini';

export async function tranceHi(content: string, type: string, room: Room) {
  if (!room.model || room.personnel.length === 0 || !room.prompt) return;
  const options = {
    roomId: room.id,
    content: content,
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

export async function convertRenderMessages(corlorMode: string, messages: Messages[]) {
  try {
    const formatedMessages = messages.map((item) => {
      return {
        id: item.id,
        global_id: item.global_id,
        type: item.type,
        is_Sender: item.is_Sender,
        content: tranceConvertMessage(corlorMode, item.content) as string,
        role: item.role
      };
    });
    return formatedMessages;
  } catch (error) {
    console.log(error);
  }
}

export function tranceConvertMessage(colorMode: string, content: string) {
  try {
    const highlightedChat = content.replace(
      /"([^"]*)"/g,
      '<span style="color: orange;">"$1"</span>'
    );
    return highlightedChat;
  } catch (error) {
    console.log(error);
  }
}
