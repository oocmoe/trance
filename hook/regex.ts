import { regex } from '@/db/schema/regex';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDB } from './db';

// 初始化数据库
const db = useDB();

/**
 * 实时查询所有提示列表
 * @returns
 */
export function useRegexList() {
  const { data, error, updatedAt } = useLiveQuery(
    db
      .select({
        id: regex.id,
        global_id: regex.global_id,
        name: regex.name,
        isEnabled: regex.isEnabled
      })
      .from(regex)
  );
  return data;
}
