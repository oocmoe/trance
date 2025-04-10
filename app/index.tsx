// app/index.tsx
import { Heading } from "@/components/ui/heading";
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
				<Heading>
					如果你看见了这个消息，说明数据库版本发生了变化，但是测试版中为了拓展的可能性暂时还没有配置数据库版本更新操作，请尝试清除应用数据即可恢复正常
				</Heading>
				<Text>Initialization Failure : {error?.message}</Text>
			</View>
		);
	}

	if (migrationStatus === "success") {
		return <Redirect href="/(drawer)/message" />;
	}

	return null;
}
