import { Prompt, prompt } from '@/db/schema/prompt';
import { useDB } from '@/hook/db';
import { ConverPromptResult } from '@/types/result';
import { eq } from 'drizzle-orm';
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

export async function readPromptFieldById(id: number, field: keyof Prompt) {
  try {
    const rows = await db
      .select({
        [field]: prompt[field]
      })
      .from(prompt)
      .where(eq(prompt.id, id));
    if (!rows) return;
    return rows[0][field];
  } catch (error) {
    console.log(error);
  }
}

export async function readPromptContent(id: number) {
  try {
    const rows = await db
      .select({
        content: prompt.content
      })
      .from(prompt)
      .where(eq(prompt.id, id));
    if (!rows[0].content || rows[0].content === null) return;
    return rows[0].content;
  } catch (error) {
    console.log(error);
  }
}

export async function readPromptContentById(id: number, contentId: number) {
  try {
    const rows = await db
      .select({
        content: prompt.content
      })
      .from(prompt)
      .where(eq(prompt.id, id));
    if (!rows[0].content || rows[0].content === null) return;
    const content = rows[0].content.find((item) => {
      return item.id === contentId;
    });
    if (!content) return;
    return content;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePromptContentField(
  id: number,
  contentId: number,
  field: 'name' | 'content' | 'role' | 'isEnabled' | 'identifier',
  value: string | boolean | number
) {
  try {
    const result = await readPromptContent(id);
    if (!result) return;
    const index = result.findIndex((item) => item.id === contentId);
    (result[index] as Record<string, any>)[field] = value;
    const rows = await db
      .update(prompt)
      .set({
        content: result
      })
      .where(eq(prompt.id, id));
    if (!rows) return;
    return rows.changes;
  } catch (error) {
    console.log(error);
  }
}
