import { knowledgeBase } from '@/db/schema/knowledgeBase';
import { useDB } from '@/hook/db';
import { ConvertKnowledgeBaseResult } from '@/types/result';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';

const db = useDB();
export async function createImportKnowledgeBase(name: string, request: ConvertKnowledgeBaseResult) {
  try {
    const rows = await db.insert(knowledgeBase).values({
      global_id: uuidv7(),
      name: name,
      is_Enabled: false,
      entries: request.entries,
      firstArchived: request.firstArchived
    });
    if (!rows) return;
    return rows.lastInsertRowId;
  } catch (error) {
    console.log(error);
  }
}
