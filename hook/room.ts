import { room } from '@/db/schema/room';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDB } from './db';

// 初始化数据库
const db = useDB();

/**
 * 实时查询全部房间
 */
export function useRoom() {
  const { data, error, updatedAt } = useLiveQuery(db.select().from(room));
  return data;
}

/**
 * 根据 ID 实时查询房间
 * @param id
 * @returns
 */
export function useRoomById(id: number) {
  const { data, error, updatedAt } = useLiveQuery(db.select().from(room).where(eq(room.id, id)));
  return data[0];
}

/**
 * 实时查询房间列表
 */
export function useRoomList() {
  return useLiveQuery(
    db
      .select({
        id: room.id,
        global_id: room.global_id,
        cover: room.cover,
        name: room.name,
        type: room.type
      })
      .from(room)
  );
}
