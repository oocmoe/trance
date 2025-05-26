import { db } from "@/db/client";
import { roomFloorTable, roomMessageTable, roomOptionTable, roomTable } from "@/db/schema";
import { useColorScheme } from "@/lib/useColorScheme";
import { eq, desc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

/**
 * Room
 */

export function useRoomById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(roomTable).where(eq(roomTable.id, id)));
	return data[0] ?? [];
}

/**
 *
 * @returns
 */
export function useRoomList() {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(roomTable));
	return data ?? [];
}

export function useRoomListByCharacterId(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db
			.select()
			.from(roomTable)
			.where(eq(roomTable.personnel, [id]))
			.orderBy(desc(roomTable.id)),
	);
	return data ?? [];
}

export function useRoomFloorById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(roomFloorTable).where(eq(roomFloorTable.id, id)));
	return data[0] ?? [];
}

export function useRoomFloorListByRoomId(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(roomFloorTable).where(eq(roomFloorTable.room_id, id)).orderBy(desc(roomFloorTable.id)),
	);
	return data ?? [];
}

/**
 *
 * @param roomId
 * @returns
 */
export function useRoomOptionsById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(roomOptionTable).where(eq(roomOptionTable.room_id, id)),
	);
	return data[0] ?? [];
}

export function useRoomMessageByRoomFloorId(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(roomMessageTable).where(eq(roomMessageTable.room_floor_id, id)),
	);
	if (data) return data;
}

export function useRoomMessageById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(roomMessageTable).where(eq(roomMessageTable.id, id)),
	);
	return data[0] ?? [];
}


export function useRoomFloorRecordByRoomId(id:number){
		const { data, error, updatedAt } = useLiveQuery(
		db.select().from(roomFloorTable).where(eq(roomFloorTable.room_id, id)),
	);
	return data.length ?? 0;
}

export function useRoomTheme(id: number) {
	const { colorScheme } = useColorScheme();
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(roomOptionTable).where(eq(roomOptionTable.room_id, id)),
	);
	if (!data || data.length === 0) return undefined;
	if (colorScheme === "dark") return data[0].theme.dark ?? undefined;
	if (colorScheme === "light") return data[0].theme.light ?? undefined;
}