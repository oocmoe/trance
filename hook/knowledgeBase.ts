import { knowledgeBase } from '@/db/schema/knowledgeBase';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDB } from './db';

const db = useDB();
export function useKnowledgeBaseList() {
  const { data, error, updatedAt } = useLiveQuery(
    db
      .select({
        id: knowledgeBase.id,
        global_id: knowledgeBase.global_id,
        name: knowledgeBase.name
      })
      .from(knowledgeBase)
  );
  return data;
}

export function useKnowledgeBaseById(id: number) {
  const { data, error, updatedAt } = useLiveQuery(
    db.select().from(knowledgeBase).where(eq(knowledgeBase.id, id))
  );
  return data[0];
}

export function useKnowledgeBaseEntryById(id: number, entryId: number) {
  const { data } = useLiveQuery(
    db
      .select({ entries: knowledgeBase.entries })
      .from(knowledgeBase)
      .where(eq(knowledgeBase.id, id))
  );
  return data?.[0]?.entries?.[entryId] ?? undefined;
}
