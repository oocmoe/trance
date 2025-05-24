import { db } from "@/db/client";
import { drizzle } from "drizzle-orm/expo-sqlite/driver";
import { openDatabaseSync } from "expo-sqlite";

// Live Queries
export function useDB() {
	return drizzle(openDatabaseSync("trance.db", { enableChangeListener: true }));
}
