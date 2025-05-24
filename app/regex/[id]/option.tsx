import { ButtonModalTrigger } from "@/components/button-modalTrigger";
import { Heading } from "@/components/ui/heading";
import { deleteRegexGroupById } from "@/db/client";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { toast } from "sonner-native";

export default function RegexGroupIdOptionScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "正则组设置" }} />
			<View className="flex-1">
				<RegexGroupDelete />
			</View>
		</>
	);
}

function RegexGroupDelete() {
	const { id } = useLocalSearchParams();
	const handleDelete = async () => {
		try {
			const result = await deleteRegexGroupById(Number(id));
			if (result) {
				router.replace("/regex");
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<View>
				<Heading>删除正则组</Heading>
			</View>
			<ButtonModalTrigger
				variant={"destructive"}
				buttonText="删除"
				title="确认删除"
				description="确定要删除这个正则组吗？此操作不可撤销。"
				submit={handleDelete}
			/>
		</View>
	);
}
