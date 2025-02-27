import { prompt } from '@/db/schema/prompt';
import { useDB } from '@/hook/db';
import { ConverPromptResult } from '@/types/result';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';

const db = useDB();
export async function createImportPrompt(request: ConverPromptResult) {
  try {
    const rows = await db.insert(prompt).values({
      global_id: uuidv7(),
      name: request.name,
      content: request.content
    });
    if (!rows) return;
    return rows.lastInsertRowId;
  } catch (error) {
    console.log(error);
  }
}
