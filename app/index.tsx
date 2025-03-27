// app/index.tsx
import migrations from "@/drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Redirect } from "expo-router";
import { openDatabaseSync } from "expo-sqlite";
import React from "react";
import { Text, View } from "react-native";

/**
 * trance 入口
 * expo sqlite drizzle 初始化和版本迁移操作
 * 重定向至 /(drawer)/message
 */
const expo = openDatabaseSync("trance.db");
const db = drizzle(expo);

export default function HomeScreen() {
	const { success, error } = useMigrations(db, migrations);
	const [migrationStatus, setMigrationStatus] = React.useState<
		"loading" | "error" | "success"
	>("loading");

	React.useEffect(() => {
		if (error) {
			setMigrationStatus("error");
		} else if (success) {
			setMigrationStatus("success");
		}
	}, [success, error]);

	if (migrationStatus === "loading") {
		return (
			<View className="flex-1 justify-center items-center">
				<Text>Initializing...</Text>
			</View>
		);
	}

	if (migrationStatus === "error") {
		return (
			<View className="flex-1 justify-center items-center">
				<Text>Initialization Failure : {error?.message}</Text>
			</View>
		);
	}

	if (migrationStatus === "success") {
		return <Redirect href="/(drawer)/message" />;
	}

	return null;
}
