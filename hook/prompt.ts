import { prompt } from '@/db/schema/prompt';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDB } from './db';

// 初始化数据库
const db = useDB();

/**
 * 实时查询所有提示列表
 * @returns
 */
export function usePromptList() {
  return useLiveQuery(
    db
      .select({
        id: prompt.id,
        global_id: prompt.global_id,
        name: prompt.name
      })
      .from(prompt)
  );
}

/**
 * 根据Id 实时查询提示词
 * @param id
 * @returns
 */
export function usePromptById(id: number) {
  const { data, error, updatedAt } = useLiveQuery(
    db.select().from(prompt).where(eq(prompt.id, id))
  );
  return data[0];
}
