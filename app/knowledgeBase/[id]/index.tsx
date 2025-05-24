import Icon from "@/components/Icon";
import { useKnowledgeBaseById, useKnowledgeEntryByKnowledgeBaseId } from "@/hook/useKnowledgeBase";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { Cog, Pen, Settings2 } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { CardNavItem } from "@/components/card-navItem";
export default function KnowledgeBaseIdScreen() {
	const { id } = useLocalSearchParams();
	const knowledgeBase = useKnowledgeBaseById(Number(id));
	return (
		<>
			<Stack.Screen
				options={{
					title: knowledgeBase.name,
					headerRight: () => (
						<Link href={`/knowledgeBase/${id}/option`}>
							<Icon as={Settings2} />
						</Link>
					),
				}}
			/>
			<View className="flex-1">
				<KnowledgeBaseEntryList />
			</View>
		</>
	);
}

function KnowledgeBaseEntryList() {
	const { id } = useLocalSearchParams();
	const knowledgeEntryList = useKnowledgeEntryByKnowledgeBaseId(Number(id));
	return (
		<View className="flex-1">
			<ScrollView>
				<View className="flex flex-col gap-y-2 p-3">
					{knowledgeEntryList.map((item) => (
						<CardNavItem
							key={item.id}
							label={item.name ?? ""}
							href={`/knowledgeBase/${id}/${item.id}`}
							status={item.is_enabled ? "active" : "offline"}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	);
}
