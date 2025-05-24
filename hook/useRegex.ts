import { db } from "@/db/client";
import { regexGroupTable, regexTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";

export function useRegexGroupList() {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(regexGroupTable));
	return data ?? [];
}

export function useRegexGroupById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(regexGroupTable).where(eq(regexGroupTable.id, id)));
	return data[0] ?? [];
}

export function useRegexListByGroupId(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(regexTable).where(eq(regexTable.regex_group_id, id)),
	);
	return data ?? [];
}

export function useRegexById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(regexTable).where(eq(regexTable.id, id)));
	return data[0] ?? [];
}
