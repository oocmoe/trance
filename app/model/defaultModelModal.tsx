
import React from "react";
import { toast } from "sonner-native";
import { Storage } from "expo-sqlite/kv-store";
import { Stack } from "expo-router";
import { View } from "react-native";
import ModelSelect from "@/components/modelSelect";
export default function DefaultModelModal() {
	const [name, setName] = React.useState<string>("");
	const [version, setVersion] = React.useState<string>("");
	const handleSave = async () => {
		try {
			const model = {
				name: name,
				version: version,
			};
			await Storage.setItem("TRANCE_ROOM_DEFAULT_MODEL", JSON.stringify(model));
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	React.useEffect(() => {
		const fetchDefaultModal = async () => {
			try {
				const result = await Storage.getItem("TRANCE_ROOM_DEFAULT_MODEL");
				if (result) {
					const model = JSON.parse(result);
					setName(model.name);
					setVersion(model.version);
				}
			} catch (error) {
				console.error(error);
				toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
			}
		};
		fetchDefaultModal();
	}, []);
	return (
		<>
			<Stack.Screen
				options={{
					title: "默认模型设置",
					presentation: "modal",
				}}
			/>
			<View className="flex-1">
				<View className="p-3">
					<ModelSelect
						modelName={name}
						setModelName={setName}
						modelVersion={version}
						setModelVersion={setVersion}
						onSave={handleSave}
					/>
				</View>
			</View>
		</>
	);
}
