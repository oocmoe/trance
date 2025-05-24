import { db } from "@/db/client";
import { knowledgeBaseTable, knowledgeEntryTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";

export function useKnowledgeBaseList() {
	const { data, error, updatedAt } = useLiveQuery(db.select().from(knowledgeBaseTable));
	return data ?? [];
}

export function useKnowledgeBaseById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(knowledgeBaseTable).where(eq(knowledgeBaseTable.id, id)),
	);
	return data[0] ?? [];
}

export function useKnowledgeEntryByKnowledgeBaseId(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(knowledgeEntryTable).where(eq(knowledgeEntryTable.knowledge_base_id, id)),
	);
	return data ?? [];
}

export function useKnowledgeEntryById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(knowledgeEntryTable).where(eq(knowledgeEntryTable.id, id)),
	);
	return data[0] ?? [];
}
