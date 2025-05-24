import { ButtonModalTrigger } from "@/components/button-modalTrigger";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { deletePromptGroup } from "@/db/client";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { toast } from "sonner-native";

export default function PromptGroupOptionScreen() {
	return (
		<>
			<Stack.Screen
				options={{
					title: "提示词组配置",
				}}
			/>
			<View>
				<PromptGroupDelete />
			</View>
		</>
	);
}

// function PromptGroupName() {
// 	return <View></View>;
// }

function PromptGroupDelete() {
	const { promptGroupId } = useLocalSearchParams();
	const handleDelete = async () => {
		try {
			const result = await deletePromptGroup(Number(promptGroupId));
			if (result) {
				router.replace("/prompt");
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Heading>删除提示词组</Heading>
			<ButtonModalTrigger
				title="删除提示词组"
				buttonText="删除"
				description="确定要删除这个提示词组吗？此操作不可撤销。"
				variant={"destructive"}
				submit={handleDelete}
			/>
		</View>
	);
}
