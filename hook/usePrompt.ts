import { db } from "@/db/client";
import { promptGroupTable, promptTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";

export function usePromptGroupList() {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(promptGroupTable));
	return data ?? [];
}

export function usePromptGroupById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(promptGroupTable).where(eq(promptGroupTable.id, id)),
	);
	return data[0] ?? [];
}

export function usePromptListById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(promptTable).where(eq(promptTable.prompt_group_id, id)),
	);
	return data ?? [];
}

export function usePromptById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(promptTable).where(eq(promptTable.id, id)));
	return data[0] ?? [];
}
