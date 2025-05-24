import { db } from "@/db/client";
import { characterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useCharacter() {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(characterTable));
	return data ?? [];
}

export function useCharacterById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(characterTable).where(eq(characterTable.id, id)));
	return data[0] ?? [];
}

export function useCharacterCoverById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db
			.select({
				cover: characterTable.cover,
			})
			.from(characterTable)
			.where(eq(characterTable.id, id)),
	);
	return data[0]?.cover ?? "";
}
