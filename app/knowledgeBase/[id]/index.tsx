import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useKnowledgeBaseById } from "@/hook/knowledgeBase";
import { updateKnowledgeBaseFiledById } from "@/utils/db/knowledgeBase";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";
export default function knowledgeBaseByIdScreen() {
	return (
		<Box className="h-full p-3">
			<KnowledgeBaseIsEnableSwitch />
			<KnowledgeBaseEntryList />
		</Box>
	);
}

const KnowledgeBaseIsEnableSwitch = () => {
	const { id } = useLocalSearchParams();
	const list = useKnowledgeBaseById(Number(id));
	const handleChange = async () => {
		try {
			const result = await updateKnowledgeBaseFiledById(
				Number(id),
				"is_Enabled",
				!list.is_Enabled,
			);
			if (result) toast.success("更改成功");
		} catch (error) {
			throw error instanceof Error
				? error.message
				: new Error("转换提示词信息失败");
		}
	};
	return (
		<Box>
			<HStack className="justify-between items-center">
				<Text>是否全局启用</Text>
				{list && (
					<Switch onValueChange={handleChange} value={list.is_Enabled} />
				)}
			</HStack>
		</Box>
	);
};

const KnowledgeBaseEntryList = () => {
	const { id } = useLocalSearchParams();
	const list = useKnowledgeBaseById(Number(id));
	const router = useRouter();
	return (
		<ScrollView className="flex-1">
			{list?.entries && (
				<VStack space="sm">
					{list.entries.map((item) => {
						return (
							<Pressable
								onPress={() =>
									router.push(`/knowledgeBase/${id}/entry/${item.id}`)
								}
								key={item.id}
							>
								<Card>
									<HStack className="justify-between items-center">
										<Heading>{item.name}</Heading>
										<Icon as={ArrowRightIcon} />
									</HStack>
								</Card>
							</Pressable>
						);
					})}
				</VStack>
			)}
		</ScrollView>
	);
};
