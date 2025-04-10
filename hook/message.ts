import { message } from "@/db/schema/message";
import { desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDB } from "./db";

// 初始化数据库
const db = useDB();

export function useMessageByRoomId(roomId: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(message).where(eq(message.room_id, roomId)),
	);
	return data;
}

export function useMessageById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(message).where(eq(message.id, id)),
	);
	return data;
}


export function useMessageDescByRoomId(roomId: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db
			.select()
			.from(message)
			.where(eq(message.room_id, roomId))
			.orderBy(desc(message.id)),
	);
	return data;
}

export function useMessageRecordByRoomId(roomId: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(message).where(eq(message.room_id, roomId)),
	);
	return data.length;
}

export function useMessageByIdOffset(roomId: number, offset: number) {
	console.log(offset);
	const { data, error, updatedAt } = useLiveQuery(
		db
			.select()
			.from(message)
			.where(eq(message.room_id, roomId))
			.orderBy(desc(message.id))
			.offset(offset)
			.limit(2),
	);
	return data;
}
