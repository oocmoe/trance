import { regex } from "@/db/schema/regex";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDB } from "./db";

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
				is_Enabled: regex.is_Enabled,
			})
			.from(regex),
	);
	return data;
}

export function useRegexById(id: number) {
	const { data, error, updatedAt } = useLiveQuery(
		db.select().from(regex).where(eq(regex.id, id)),
	);
	return data[0];
}
