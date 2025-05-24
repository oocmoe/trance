import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { createRoomNewPrivateChat } from "@/db/client";
import { useCharacterById } from "@/hook/useCharacter";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function CharacterNewStoryModal() {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	const [isLoading, setIsLoading] = React.useState(false);
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [prologueIndex, setPrologueIndex] = React.useState<number | undefined>(undefined);

	const handleCreateNewChat = async () => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			const result = await createRoomNewPrivateChat(character, prologueIndex);
			if (result) {
				router.replace("/message");
				setTimeout(() => {
					router.push(`/room/${result}`);
				}, 0);
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		} finally {
			setIsLoading(false);
		}
	};
	const selectedPrologue = prologueIndex !== undefined && character.prologue?.[prologueIndex];

	React.useEffect(() => {
		if (!character.prologue) return;
	}, [character.prologue]);

	
	return (
		<>
			<Stack.Screen
				options={{
					presentation: "modal",
				}}
			/>

			<SafeAreaView className="flex-1">
				<View className="p-3">
					<Select onValueChange={(e) => setPrologueIndex(Number(e?.value))} className="w-full">
						<SelectTrigger>
							<SelectValue className="text-foreground text-sm native:text-lg" placeholder="选择开场白" />
						</SelectTrigger>
						<SelectContent align="end">
							<ScrollView>
								<SelectGroup>
									<SelectItem key={"null"} value="null" label="None" />
									{character.prologue?.map((item, index) => (
										<SelectItem key={String(index)} value={String(index)} label={`# ${String(index + 1)}`} />
									))}
								</SelectGroup>
							</ScrollView>
						</SelectContent>
					</Select>
				</View>
				<View className="flex-1">
					<ScrollView>
						<View className="p-3">
							{selectedPrologue ? (
								<Text>{selectedPrologue.content}</Text>
							) : (
								<Text className="text-muted-foreground">请选择一个开场白</Text>
							)}
						</View>
					</ScrollView>
				</View>
				<View className="p-3">
					<Button onPress={handleCreateNewChat}>
						<Text>创建房间</Text>
					</Button>
				</View>
			</SafeAreaView>
		</>
	);
}
