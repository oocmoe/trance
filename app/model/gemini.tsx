import { Label } from "@/components/ui/label";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner-native";
import { tranceHiGeminiTextTest } from "@/utils/model/gemini";
import { useAtom } from "jotai";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Slider from "@react-native-community/slider";
import { debounce } from "es-toolkit";
import { Storage } from "expo-sqlite/kv-store";
import { geminiPollingAtom } from "@/store/polling";
export default function GeminiScreen() {
	return (
		<View className="flex-1">
			<View className="flex-1 p-3 gap-y-4">
				<GeminiTest />
				<GeminiKey />
				{/* <GeminiTemperature /> */}
				<GeminiPolling />
			</View>
		</View>
	);
}

function GeminiKey() {
	const [key, setKey] = React.useState<string>("");
	const [testResult, setTestResult] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState(false);
	const handleSaveKey = async () => {
		try {
			const keys = key
				.split("\n")
				.map((k) => k.trim())
				.filter((k) => k !== "");
			const jsonKeys = JSON.stringify(keys);
			await SecureStore.setItem("TRANCE_MODEL_GEMINI_KEY", jsonKeys);
			toast.success("Gemini 密钥保存成功");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};

	return (
		<View className="flex flex-col gap-y-2">
			<Label>Gemini 密钥组</Label>
			<Text>密钥保存后无法查看和修改</Text>
			<Input
				multiline
				className="h-48"
				secureTextEntry={true}
				placeholder={"AIzaSyXXXXXA \nAIzaSyXXXXXB"}
				textAlignVertical="top"
				value={key}
				onChangeText={setKey}
			/>
			<Button variant={"outline"} onPress={handleSaveKey}>
				<Text>保存密钥</Text>
			</Button>
		</View>
	);
}

function GeminiPolling() {
	const [value, setValue] = useAtom(geminiPollingAtom)
	const handleChangeValue = debounce(async(value:number)=>{
		const intValue = Math.round(value)
		setValue(intValue)
	},300)
	return (
		<View>
			<Label>轮询 (0 为始终使用第一个)</Label>
			<Text className="text-center">{value}</Text>
			<Slider minimumValue={0} step={1} maximumValue={30} value={value}  onSlidingComplete={handleChangeValue} />
		</View>
	);
}

// function GeminiTemperature() {
// 	const [value, setValue] = React.useState(1.0);
// 	return (
// 		<View>
// 			<Label>温度</Label>
// 			<Text className="text-center">{value}</Text>
// 			<Slider minimumValue={0.1} step={0.1} maximumValue={2} value={value} onValueChange={setValue} />
// 		</View>
// 	);
// }

function GeminiTest() {
	const [isLoading, setIsLoading] = React.useState(false);
	const [testResult, setTestResult] = React.useState<string>("");
	const handleTest = async () => {
		setIsLoading(true);
		try {
			const result = await tranceHiGeminiTextTest();
			if (result) setTestResult(result);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<View className="flex flex-col ">
			<View className="flex flex-row justify-between items-center">
				<Label>
					Gemini 通信状态
					{testResult.length > 0 && (
						<Badge className="mx-2 bg-green-400 text-white">
							<Text>正常</Text>
						</Badge>
					)}
				</Label>
				<Button disabled={isLoading} variant={"outline"} onPress={handleTest}>
					{isLoading ? <ActivityIndicator /> : <Text>测试</Text>}
				</Button>
			</View>
			<Text>{testResult}</Text>
		</View>
	);
}
