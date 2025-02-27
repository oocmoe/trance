import { message } from '@/db/schema/message';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDB } from './db';

// 初始化数据库
const db = useDB();

export function useMessageById(roomId: number) {
  const { data, error, updatedAt } = useLiveQuery(
    db.select().from(message).where(eq(message.room_id, roomId))
  );
  return data[0];
}
